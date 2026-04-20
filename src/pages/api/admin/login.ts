import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

function getAdminToken() {
  return crypto
    .createHmac('sha256', process.env.ADMIN_SALT || 'rogeria-admin-2025')
    .update(process.env.ADMIN_PASSWORD || '')
    .digest('hex')
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { password } = req.body

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Senha incorreta.' })
  }

  const token = getAdminToken()
  const maxAge = 60 * 60 * 24 * 7 // 7 dias

  res.setHeader('Set-Cookie', [
    `admin_token=${token}; HttpOnly; Path=/; Max-Age=${maxAge}; SameSite=Lax${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
  ])

  return res.status(200).json({ ok: true })
}
