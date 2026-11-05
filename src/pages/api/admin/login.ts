import type { NextApiRequest, NextApiResponse } from 'next'
import { SESSAO_SEGUNDOS, bloqueado, criarSessao, ipDe, registrarFalha, senhaConfere } from '../../../lib/admin-auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const ip = ipDe(req)
  if (await bloqueado(ip)) {
    return res.status(429).json({ error: 'Muitas tentativas. Aguarde 15 minutos.' })
  }

  if (!senhaConfere(req.body?.password)) {
    await registrarFalha(ip)
    await new Promise(r => setTimeout(r, 1000)) // atrasa robô de tentativa e erro
    return res.status(401).json({ error: 'Senha incorreta.' })
  }

  res.setHeader('Set-Cookie', [
    `admin_token=${criarSessao()}; HttpOnly; Path=/; Max-Age=${SESSAO_SEGUNDOS}; SameSite=Strict${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`,
  ])

  return res.status(200).json({ ok: true })
}
