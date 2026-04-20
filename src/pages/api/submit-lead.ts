import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminSupabase } from '../../lib/supabase'
import { Resend } from 'resend'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { nome, telefone, email, situacao, mensagem, arquivo_nome, arquivo_url } = req.body

  if (!nome || !telefone || !situacao) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando.' })
  }

  try {
    const db = getAdminSupabase()

    // Salva o lead no banco de dados
    const { error } = await db.from('leads').insert({
      nome,
      telefone,
      email:        email        || null,
      situacao,
      mensagem:     mensagem     || null,
      arquivo_nome: arquivo_nome || null,
      arquivo_url:  arquivo_url  || null,
      status: 'novo',
    })

    if (error) throw error

    // Notificação por e-mail (opcional — só envia se RESEND_API_KEY estiver configurado)
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY)
      const tel = telefone.replace(/\D/g, '')
      const waNum = tel.startsWith('55') ? tel : '55' + tel

      await resend.emails.send({
        from:    'Site Rogéria <noreply@rogeriaoliveira.com>',
        to:      'documentos@rogeriaoliveira.com',
        subject: `🆕 Novo Lead — ${nome}`,
        html: `
          <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
            <h2 style="color:#1A1A1A;margin-bottom:16px">Novo lead do site — Professores</h2>
            <table style="width:100%;border-collapse:collapse">
              <tr><td style="padding:8px 0;color:#666;font-size:14px;width:120px"><b>Nome</b></td><td style="padding:8px 0;font-size:14px">${nome}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px"><b>WhatsApp</b></td><td style="padding:8px 0"><a href="https://wa.me/${waNum}" style="color:#25D366;font-weight:bold;font-size:14px">Chamar no WhatsApp →</a></td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px"><b>E-mail</b></td><td style="padding:8px 0;font-size:14px">${email || '—'}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px"><b>Situação</b></td><td style="padding:8px 0;font-size:14px">${situacao}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px"><b>Mensagem</b></td><td style="padding:8px 0;font-size:14px">${mensagem || '—'}</td></tr>
              ${arquivo_url ? `<tr><td style="padding:8px 0;color:#666;font-size:14px"><b>Contracheque</b></td><td style="padding:8px 0"><a href="${arquivo_url}" style="color:#C5973A;font-size:14px">Ver arquivo →</a></td></tr>` : ''}
            </table>
            <div style="margin-top:24px">
              <a href="https://rogeriaoliveira.com/admin" style="background:#C5973A;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;font-size:14px">
                Ver no Painel Admin →
              </a>
            </div>
          </div>
        `,
      })
    }

    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('submit-lead error:', err)
    return res.status(500).json({ error: 'Erro ao salvar lead.' })
  }
}
