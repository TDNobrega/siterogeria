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

  const res = await fetch('https://api.liderhub.ai/v1/contacts', {
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
  await fetch('https://api.liderhub.ai/v1/send/message', {
    method:  'POST',
    headers: await liderHubHeaders(),
    body:    JSON.stringify({
      contact:     contactId,
      content,
      messageType: 'conversation',
    }),
  })
}

// ── Handler principal ─────────────────────────────────────────────────────────
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { nome, telefone, email, situacao, mensagem, arquivo_nome, arquivo_path } = req.body

  if (!nome || !telefone || !situacao) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' })
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
