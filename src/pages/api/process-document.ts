import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from 'sharp'

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '15mb',
    },
  },
  maxDuration: 60,
}

type Bbox = { x: number; y: number; largura: number; altura: number }

async function getBboxFromGemini(
  base64Image: string,
  mimeType: string,
  imgW: number,
  imgH: number
): Promise<Bbox | null> {
  const geminiKey = process.env.GEMINI_API_KEY
  if (!geminiKey) return null

  const prompt =
    'Você é um especialista em corte de documentos. ' +
    'Esta imagem já está na orientação CORRETA de leitura. ' +
    `A imagem tem ${imgW} pixels de largura e ${imgH} pixels de altura. ` +
    'Encontre o bounding box que cobre o documento físico (papel) na imagem. ' +
    'REGRAS: 1. Inclua o documento COMPLETO — não corte nenhuma parte. ' +
    '2. Prefira incluir um pouco de fundo a cortar qualquer parte do documento. ' +
    '3. Adicione 15px de margem extra em todos os 4 lados. ' +
    'Responda APENAS em JSON válido, sem markdown: {"x":X,"y":Y,"largura":LARGURA,"altura":ALTURA}'

  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inline_data: { mime_type: mimeType, data: base64Image } },
            ],
          }],
          generationConfig: { temperature: 0.05 },
        }),
        signal: AbortSignal.timeout(20000),
      }
    )

    if (!resp.ok) return null

    const json = await resp.json()
    const text = (json.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim()
    const clean = text.replace(/```json\n?|\n?```/g, '').trim()
    const bbox = JSON.parse(clean) as Bbox
    if (
      typeof bbox.x === 'number' &&
      typeof bbox.y === 'number' &&
      typeof bbox.largura === 'number' &&
      typeof bbox.altura === 'number'
    ) {
      return bbox
    }
    return null
  } catch {
    return null
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // Auth
  const apiKey = req.headers['x-api-key']
  if (!apiKey || apiKey !== process.env.PROCESS_DOC_API_KEY) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { image, mimeType = 'image/jpeg', angulo = 0 } = req.body as {
    image: string
    mimeType?: string
    angulo?: number
  }

  if (!image) return res.status(400).json({ error: 'image required' })

  try {
    const inputBuffer = Buffer.from(image, 'base64') as Buffer
    const validAngulo = [0, 90, 180, 270].includes(angulo) ? angulo : 0
    const workingMime = mimeType === 'image/png' ? 'image/png' : 'image/jpeg'

    // ── Passo 1: Rotação ────────────────────────────────────────
    let workingBuffer: Buffer = inputBuffer
    if (validAngulo !== 0) {
      workingBuffer = (await sharp(inputBuffer).rotate(validAngulo).toBuffer()) as Buffer
    }

    // ── Passo 2: Dimensões + bbox via Gemini ────────────────────
    const meta = await sharp(workingBuffer).metadata()
    const imgW = meta.width ?? 0
    const imgH = meta.height ?? 0

    let cropped = false
    if (imgW > 0 && imgH > 0) {
      const base64Rot = workingBuffer.toString('base64')
      const bbox = await getBboxFromGemini(base64Rot, workingMime, imgW, imgH)

      if (bbox) {
        const MARGIN = 25
        const left   = Math.max(0, Math.round(bbox.x) - MARGIN)
        const top    = Math.max(0, Math.round(bbox.y) - MARGIN)
        const width  = Math.min(imgW - left, Math.round(bbox.largura) + MARGIN * 2)
        const height = Math.min(imgH - top,  Math.round(bbox.altura)  + MARGIN * 2)

        if (width > 20 && height > 20) {
          workingBuffer = await sharp(workingBuffer)
            .extract({ left, top, width, height })
            .toBuffer()
          cropped = true
        }
      }
    }

    // ── Passo 3: Fallback — trim automático de bordas uniformes ─
    if (!cropped) {
      try {
        workingBuffer = await sharp(workingBuffer)
          .trim({ threshold: 40 })
          .toBuffer()
      } catch {
        // mantém imagem como está se trim falhar
      }
    }

    // ── Passo 4: Realce — contraste + nitidez ──────────────────
    const outputBuffer = await sharp(workingBuffer)
      .normalize()
      .sharpen({ sigma: 1.0, m1: 0.5, m2: 2.0 })
      .jpeg({ quality: 92 })
      .toBuffer()

    return res.status(200).json({
      image:    outputBuffer.toString('base64'),
      mimeType: 'image/jpeg',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Processing failed'
    console.error('[process-document]', message)
    return res.status(500).json({ error: message })
  }
}
