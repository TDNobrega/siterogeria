import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { getAdminSupabase } from '../../../lib/supabase'

function getAdminToken() {
  return crypto
    .createHmac('sha256', process.env.ADMIN_SALT || 'rogeria-admin-2025')
    .update(process.env.ADMIN_PASSWORD || '')
    .digest('hex')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).end()

  // Verifica autenticação
  const token = req.cookies.admin_token
  if (!token || token !== getAdminToken()) {
    return res.status(401).json({ error: 'Não autorizado.' })
  }

  const { path } = req.query
  if (!path || typeof path !== 'string') {
    return res.status(400).json({ error: 'Caminho do arquivo não informado.' })
  }

  try {
    const db = getAdminSupabase()

    // Gera link temporário válido por 24 horas
    const { data, error } = await db.storage
      .from('contracheques')
      .createSignedUrl(path, 60 * 60 * 24)

    if (error || !data?.signedUrl) throw error

    // Redireciona direto para o arquivo
    return res.redirect(302, data.signedUrl)
  } catch (err) {
    console.error('file-url error:', err)
    return res.status(500).json({ error: 'Erro ao gerar link do arquivo.' })
  }
}
