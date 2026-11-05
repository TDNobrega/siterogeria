import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminSupabase } from '../../../lib/supabase'
import { sessaoValida } from '../../../lib/admin-auth'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  // Verifica autenticação
  if (!sessaoValida(req.cookies.admin_token)) {
    return res.status(401).json({ error: 'Não autorizado.' })
  }

  const { id, status } = req.body
  if (!id) return res.status(400).json({ error: 'ID obrigatório.' })

  // Mesmos status do painel (/admin). Até 05/11/2026 a lista era outra e o painel nunca conseguia gravar.
  const STATUS_PERMITIDOS = ['novo', 'em_contato', 'cliente', 'arquivado']
  if (status && !STATUS_PERMITIDOS.includes(status)) {
    return res.status(400).json({ error: 'Status inválido.' })
  }

  const updateData: Record<string, string> = {}
  if (status) updateData.status = status

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
