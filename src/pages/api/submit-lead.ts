import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminSupabase } from '../../lib/supabase'

const LIDERHUB_KEY        = process.env.LIDERHUB_API_KEY        || ''
const LIDERHUB_CONNECTION = process.env.LIDERHUB_CONNECTION_ID  || ''
const LIDERHUB_AGENT      = process.env.LIDERHUB_AGENT_ID       || ''

// ── Helpers LiderHub ──────────────────────────────────────────────────────────
async function liderHubHeaders() {
  return {
    'x-company-key': LIDERHUB_KEY,
    'Content-Type':  'application/json',
    'User-Agent':    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept':        'application/json',
    'Origin':        'https://chat.liderhub.ai',
    'Referer':       'https://chat.liderhub.ai/',
  }
}

async function cadastrarContato(numero: string, nome: string, email: string) {
  const body: Record<string, string> = {
    connection: LIDERHUB_CONNECTION,
    number:     numero,
    name:       nome,
  }
  if (email)          body.email = email
  if (LIDERHUB_AGENT) body.agent = LIDERHUB_AGENT

  console.log('LiderHub request body:', JSON.stringify(body))

  const res = await fetch('https://api.liderhub.com.br/v1/contacts', {
    method:  'POST',
    headers: await liderHubHeaders(),
    body:    JSON.stringify(body),
  })

  const rawText = await res.text()
  console.log('LiderHub status:', res.status)
  console.log('LiderHub raw response:', rawText)

  return JSON.parse(rawText) as { exist: boolean; id?: string; created?: boolean }
}

async function enviarMensagem(contactId: string, content: string) {
  await fetch('https://api.liderhub.com.br/v1/send/message', {
    method:  'POST',
    headers: await liderHubHeaders(),
    body:    JSON.stringify({
      contact:     contactId,
      content,
      messageType: 'conversation',
    }),
  })
}

// ── Extensões permitidas para upload ─────────────────────────────────────────
const EXTENSOES_PERMITIDAS = ['.pdf', '.jpg', '.jpeg', '.png', '.webp']
const TAMANHO_MAX_NOME     = 200

// ── Handler principal ─────────────────────────────────────────────────────────
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { nome, telefone, email, situacao, mensagem, arquivo_nome, arquivo_path } = req.body

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

    // 2. Integração LiderHub (erro aqui não bloqueia a resposta)
    if (LIDERHUB_KEY && LIDERHUB_CONNECTION) {
      try {
        const tel    = (telefone as string).replace(/\D/g, '')
        const numero = tel.startsWith('55') ? tel : '55' + tel

        const contato = await cadastrarContato(numero, nome, email || '')
        console.log('LiderHub contato:', JSON.stringify(contato))

        const contactId = contato.id
        if (contactId) {
          const primeiroNome = (nome as string).split(' ')[0]
          await enviarMensagem(
            contactId,
            `Olá, ${primeiroNome}! 👋\n\nRecebemos sua solicitação de análise gratuita do contracheque.\n\nNossa equipe jurídica já está avaliando o seu caso e em breve entraremos em contato.\n\n*Rogéria Oliveira Advocacia* ⚖️`
          )
        }
      } catch (liderErr) {
        console.error('LiderHub error (non-fatal):', liderErr)
      }
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('submit-lead error:', err)
    return res.status(500).json({ error: 'Erro ao salvar lead.' })
  }
}
