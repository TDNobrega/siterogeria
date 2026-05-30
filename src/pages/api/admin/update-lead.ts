import type { NextApiRequest, NextApiResponse } from 'next'
import crypto from 'crypto'
import { getAdminSupabase } from '../../../lib/supabase'

function getAdminToken() {
  const salt = process.env.ADMIN_SALT
  const pass = process.env.ADMIN_PASSWORD
  if (!salt || !pass) throw new Error('ADMIN_SALT e ADMIN_PASSWORD são obrigatórios.')
  return crypto.createHmac('sha256', salt).update(pass).digest('hex')
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // Verifica autenticação
  const token = req.cookies.admin_token
  if (!token || token !== getAdminToken()) {
    return res.status(401).json({ error: 'Não autorizado.' })
  }

  const { id, status, notas } = req.body
  if (!id) return res.status(400).json({ error: 'ID obrigatório.' })

  const STATUS_PERMITIDOS = ['novo', 'em_analise', 'concluido', 'cancelado']
  if (status && !STATUS_PERMITIDOS.includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' })
  }

  const updateData: Record<string, string> = {}
  if (status) updateData.status = status
  if (notas !== undefined) updateData.notas = String(notas).slice(0, 5000)

  try {
    const db = getAdminSupabase()
    const { error } = await db.from('leads').update(updateData).eq('id', id)
    if (error) throw error
    return res.status(200).json({ ok: true })
  } catch (err) {
    console.error('update-lead error:', err)
    return res.status(500).json({ error: 'Erro ao atualizar lead.' })
  }
}
