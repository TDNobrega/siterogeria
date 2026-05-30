import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'

function getAdminToken() {
  const salt = process.env.ADMIN_SALT
  const pass = process.env.ADMIN_PASSWORD
  if (!salt || !pass) throw new Error('ADMIN_SALT e ADMIN_PASSWORD são obrigatórios.')
  return crypto.createHmac('sha256', salt).update(pass).digest('hex')
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
