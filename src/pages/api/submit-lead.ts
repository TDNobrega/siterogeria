import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminSupabase } from '../../lib/supabase'

// Aviso de lead novo: vai para um webhook do n8n da VPS, que avisa no grupo de alertas do Telegram.
// Substituiu o LiderHub (desligado em 17/07/2026; até 05/11 ninguém era avisado de lead do site).
// Manda só o mínimo (primeiro nome, situação, se anexou contracheque); o resto fica no /admin.
const AVISO_URL    = process.env.LEAD_AVISO_URL    || ''
const AVISO_SECRET = process.env.LEAD_AVISO_SECRET || ''

async function avisarLeadNovo(nome: string, situacao: string, temArquivo: boolean) {
  if (!AVISO_URL || !AVISO_SECRET) {
    console.error('[ERROR] aviso de lead: LEAD_AVISO_URL/LEAD_AVISO_SECRET não configurados')
    return
  }
  try {
    const res = await fetch(AVISO_URL, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'x-aviso-secret': AVISO_SECRET },
      body:    JSON.stringify({
        origem:   'site /professores',
        nome:     nome.trim().split(/\s+/)[0],
        situacao,
        arquivo:  temArquivo,
      }),
      signal: AbortSignal.timeout(5000),
    })
    console.log('[INFO] aviso de lead:', res.status)
  } catch (err) {
    console.error('[ERROR] aviso de lead (lead já gravado):', err instanceof Error ? err.message : err)
  }
}

// ── Extensões permitidas para upload ─────────────────────────────────────────
const EXTENSOES_PERMITIDAS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp']
const TAMANHO_MAX_NOME     = 200

// ── Handler principal ─────────────────────────────────────────────────────────
const ORIGENS_PERMITIDAS = [
  'https://rogeriaoliveira.com',
  'https://www.rogeriaoliveira.com',
]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // Bloqueia submissões de origens externas (proteção básica contra bots)
  const origin = req.headers.origin || ''
  if (process.env.NODE_ENV === 'production' && !ORIGENS_PERMITIDAS.includes(origin)) {
    return res.status(403).json({ error: 'Origem não permitida.' })
  }

  const { nome, telefone, email, situacao, mensagem, arquivo_nome, arquivo_path } = req.body

  // Campo isca (invisível para pessoas): robô que preenche tudo é ignorado sem saber
  if (req.body?.empresa_site) return res.status(200).json({ ok: true })

  // Validação de campos obrigatórios
  if (!nome || !telefone || !situacao) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' })
  }

  // Sanitização básica — limita tamanho dos campos de texto
  if (
    String(nome).length     > 200 ||
    String(telefone).length > 20  ||
    String(situacao).length > 100 ||
    (email    && String(email).length    > 200) ||
    (mensagem && String(mensagem).length > 2000)
  ) {
    return res.status(400).json({ error: 'Dados inválidos.' })
  }

  // Validação do arquivo (se enviado)
  if (arquivo_nome) {
    const ext = String(arquivo_nome).toLowerCase().slice(String(arquivo_nome).lastIndexOf('.'))
    if (
      String(arquivo_nome).length > TAMANHO_MAX_NOME ||
      !EXTENSOES_PERMITIDAS.includes(ext)
    ) {
      return res.status(400).json({ error: 'Tipo de arquivo não permitido.' })
    }
  }

  // Valida que arquivo_path não contém traversal
  if (arquivo_path && (String(arquivo_path).includes('..') || String(arquivo_path).includes('//'))) {
    return res.status(400).json({ error: 'Caminho de arquivo inválido.' })
  }

  try {
    const db = getAdminSupabase()

    // 1. Salva o lead no banco de dados
    const { data: lead, error } = await db.from('leads').insert({
      nome,
      telefone,
      email:        email        || null,
      situacao,
      mensagem:     mensagem     || null,
      arquivo_nome: arquivo_nome || null,
      arquivo_path: arquivo_path || null,
      status: 'novo',
    }).select().single()

    if (error) throw error

    // 2. Aviso para a equipe (falha aqui não perde o lead, que já está gravado)
    await avisarLeadNovo(String(nome), String(situacao), Boolean(arquivo_path))

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('submit-lead error:', err)
    return res.status(500).json({ error: 'Erro ao salvar lead.' })
  }
}
