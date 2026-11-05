import crypto from 'crypto'
import type { IncomingMessage } from 'http'
import { getAdminSupabase } from './supabase'

// Sessão do /admin. Revisão de 05/11/2026: o cookie antigo era sempre o mesmo (HMAC da senha) e não
// expirava de verdade; a senha não tinha limite de tentativas. Agora:
// - o cookie leva a data de expiração assinada (7 dias) e muda a cada login;
// - trocar a ADMIN_PASSWORD invalida todas as sessões (a senha entra na assinatura);
// - 5 senhas erradas do mesmo IP em 15 min bloqueiam novas tentativas (tabela admin_tentativas).

export const SESSAO_SEGUNDOS = 60 * 60 * 24 * 7
const MAX_FALHAS = 5
const JANELA_MIN = 15

function segredos() {
  const salt = process.env.ADMIN_SALT
  const pass = process.env.ADMIN_PASSWORD
  if (!salt || !pass) throw new Error('ADMIN_SALT e ADMIN_PASSWORD são obrigatórios.')
  return { salt, pass }
}

function assinatura(exp: number) {
  const { salt, pass } = segredos()
  return crypto.createHmac('sha256', salt).update(`${pass}|${exp}`).digest('hex')
}

function iguais(a: string, b: string) {
  const ha = crypto.createHash('sha256').update(a).digest()
  const hb = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

export function senhaConfere(senha: unknown) {
  return typeof senha === 'string' && senha.length > 0 && iguais(senha, segredos().pass)
}

export function criarSessao() {
  const exp = Math.floor(Date.now() / 1000) + SESSAO_SEGUNDOS
  return `${exp}.${assinatura(exp)}`
}

export function sessaoValida(token: string | undefined) {
  if (!token) return false
  const [expTxt, sig] = token.split('.')
  const exp = Number(expTxt)
  if (!sig || !Number.isInteger(exp) || exp < Date.now() / 1000) return false
  return iguais(sig, assinatura(exp))
}

export function ipDe(req: IncomingMessage) {
  const real = req.headers['x-real-ip']
  if (typeof real === 'string' && real) return real
  const fwd = req.headers['x-forwarded-for']
  const primeiro = (Array.isArray(fwd) ? fwd[0] : fwd || '').split(',')[0].trim()
  return primeiro || 'desconhecido'
}

function desde() {
  return new Date(Date.now() - JANELA_MIN * 60 * 1000).toISOString()
}

export async function bloqueado(ip: string) {
  const { count, error } = await getAdminSupabase()
    .from('admin_tentativas')
    .select('id', { count: 'exact', head: true })
    .eq('ip', ip)
    .gte('created_at', desde())
  // Se o banco falhar, não bloqueia a dona do painel; o atraso no erro de senha continua valendo.
  if (error) { console.error('[ERROR] admin_tentativas leitura:', error.message); return false }
  return (count ?? 0) >= MAX_FALHAS
}

export async function registrarFalha(ip: string) {
  const db = getAdminSupabase()
  const { error } = await db.from('admin_tentativas').insert({ ip })
  if (error) console.error('[ERROR] admin_tentativas gravação:', error.message)
  // limpeza: nada com mais de 1 dia
  await db.from('admin_tentativas').delete().lt('created_at', new Date(Date.now() - 86_400_000).toISOString())
}
