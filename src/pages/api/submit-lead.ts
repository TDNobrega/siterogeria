import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminSupabase } from '../../lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { nome, telefone, email, situacao, mensagem, arquivo_nome, arquivo_url } = req.body

  if (!nome || !telefone || !situacao) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' })
  }

  try {
    const db = getAdminSupabase()

    // Salva o lead no banco de dados
    const { data: lead, error } = await db.from('leads').insert({
      nome,
      telefone,
      email:        email        || null,
      situacao,
      mensagem:     mensagem     || null,
      arquivo_nome: arquivo_nome || null,
      arquivo_url:  arquivo_url  || null,
      status: 'novo',
    }).select().single()

    if (error) throw error

    // Aciona IA LiderHub (quando LIDERHUB_API_KEY estiver configurado)
    if (process.env.LIDERHUB_API_KEY && process.env.LIDERHUB_API_URL) {
      const tel = (telefone as string).replace(/\D/g, '')
      const waNum = tel.startsWith('55') ? tel : '55' + tel

      await fetch(process.env.LIDERHUB_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.LIDERHUB_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phone:    waNum,
          name:     nome,
          email:    email    || '',
          situacao: situacao,
          mensagem: mensagem || '',
          lead_id:  lead?.id || '',
        }),
      })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('submit-lead error:', err)
    return res.status(500).json({ error: 'Erro ao salvar lead.' })
  }
}
