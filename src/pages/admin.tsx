import { useState, useMemo } from 'react'
import type { GetServerSideProps } from 'next'
import Head from 'next/head'
import crypto from 'crypto'
import { getAdminSupabase } from '../lib/supabase'

// ── Types ─────────────────────────────────────────────────────────────────────
type Lead = {
  id: string
  created_at: string
  nome: string
  telefone: string
  email: string | null
  situacao: string
  mensagem: string | null
  arquivo_nome: string | null
  arquivo_path: string | null
  status: 'novo' | 'em_contato' | 'cliente' | 'arquivado'
}

type Props = { isAuthenticated: boolean; leads: Lead[] | null }

const STATUS: Record<Lead['status'], { label: string; color: string }> = {
  novo:       { label: 'Novo',        color: 'bg-blue-100 text-blue-700' },
  em_contato: { label: 'Em Contato',  color: 'bg-amber-100 text-amber-700' },
  cliente:    { label: 'Cliente',     color: 'bg-green-100 text-green-700' },
  arquivado:  { label: 'Arquivado',   color: 'bg-gray-100 text-gray-500' },
}

function getAdminToken() {
  return crypto
    .createHmac('sha256', process.env.ADMIN_SALT || 'rogeria-admin-2025')
    .update(process.env.ADMIN_PASSWORD || '')
    .digest('hex')
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function Admin({ isAuthenticated, leads: initial }: Props) {
  return (
    <>
      <Head>
        <title>Painel Admin — Rogéria Oliveira</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      {isAuthenticated ? <Dashboard leads={initial || []} /> : <LoginForm />}
    </>
  )
}

// ── Login ─────────────────────────────────────────────────────────────────────
function LoginForm() {
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ password }),
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) window.location.reload()
      else setError('Senha incorreta. Tente novamente.')
    } catch {
      setError('Erro de conexão.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/logo.png" alt="Rogéria Oliveira" className="h-10 mx-auto mb-8" />
        <h1 className="font-title font-bold text-ink text-xl text-center mb-1">Painel Administrativo</h1>
        <p className="font-body text-muted text-sm text-center mb-8">Área restrita — somente colaboradores</p>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block font-subtitle text-xs font-semibold text-ink mb-1.5 uppercase tracking-wide">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoFocus
              className="w-full border border-border rounded-xl px-4 py-3 font-body text-sm text-ink
                         focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          {error && <p className="text-red-500 text-sm font-subtitle">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-support text-white font-subtitle font-bold
                       py-3 rounded-xl transition-colors disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ leads: initial }: { leads: Lead[] }) {
  const [leads,        setLeads]        = useState<Lead[]>(initial)
  const [search,       setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [updatingId,   setUpdatingId]   = useState<string | null>(null)
  const [expanded,     setExpanded]     = useState<string | null>(null)

  const stats = useMemo(() => ({
    total:      leads.length,
    novo:       leads.filter(l => l.status === 'novo').length,
    em_contato: leads.filter(l => l.status === 'em_contato').length,
    cliente:    leads.filter(l => l.status === 'cliente').length,
  }), [leads])

  const filtered = useMemo(() => leads.filter(l => {
    const term = search.toLowerCase()
    const ok = !term ||
      l.nome.toLowerCase().includes(term) ||
      l.telefone.includes(term) ||
      (l.email || '').toLowerCase().includes(term)
    return ok && (statusFilter === 'todos' || l.status === statusFilter)
  }), [leads, search, statusFilter])

  const updateStatus = async (id: string, status: Lead['status']) => {
    setUpdatingId(id)
    const res = await fetch('/api/admin/update-lead', {
      method: 'POST',
      body: JSON.stringify({ id, status }),
      headers: { 'Content-Type': 'application/json' },
    })
    if (res.ok) setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
    setUpdatingId(null)
  }

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.reload()
  }

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: '2-digit',
      hour: '2-digit', minute: '2-digit',
    })

  const waUrl = (tel: string) => {
    const n = tel.replace(/\D/g, '')
    return `https://wa.me/${n.startsWith('55') ? n : '55' + n}`
  }

  const WaIcon = () => (
    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.523 5.851L.057 23.057a.75.75 0 00.886.886l5.206-1.466A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.706 9.706 0 01-4.952-1.357l-.355-.21-3.678 1.036 1.036-3.678-.21-.355A9.706 9.706 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/>
    </svg>
  )

  return (
    <div className="min-h-screen bg-[#F4F6F9]">

      {/* Header */}
      <header className="bg-ink sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/logo.png" alt="Rogéria" className="h-7 w-auto" />
            <span className="font-subtitle text-white/50 text-xs hidden sm:inline">Painel Admin</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="font-subtitle text-white/50 text-xs">{leads.length} leads</span>
            <button onClick={handleLogout}
              className="font-subtitle text-xs text-white/60 hover:text-white transition-colors">
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total',      value: stats.total,      bg: 'bg-white',     text: 'text-ink' },
            { label: 'Novos',      value: stats.novo,       bg: 'bg-blue-50',   text: 'text-blue-700' },
            { label: 'Em Contato', value: stats.em_contato, bg: 'bg-amber-50',  text: 'text-amber-700' },
            { label: 'Clientes',   value: stats.cliente,    bg: 'bg-green-50',  text: 'text-green-700' },
          ].map(s => (
            <div key={s.label} className={`${s.bg} rounded-2xl p-5 shadow-sm border border-white/80`}>
              <p className={`font-title font-bold text-3xl ${s.text}`}>{s.value}</p>
              <p className="font-subtitle text-xs text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted"
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nome, telefone ou e-mail..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-border rounded-xl font-body text-sm
                         text-ink bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="border border-border rounded-xl px-4 py-2.5 font-body text-sm text-ink
                       bg-white focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="todos">Todos os status</option>
            <option value="novo">Novo</option>
            <option value="em_contato">Em Contato</option>
            <option value="cliente">Cliente</option>
            <option value="arquivado">Arquivado</option>
          </select>
        </div>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-14 text-center shadow-sm">
            <p className="font-body text-muted text-base">Nenhum lead encontrado.</p>
          </div>
        )}

        {/* Desktop Table */}
        {filtered.length > 0 && (
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  {['Data', 'Nome', 'WhatsApp', 'Situação', 'Status', 'Contracheque', 'Mensagem'].map(h => (
                    <th key={h} className="text-left font-subtitle text-[11px] font-semibold text-muted
                                           uppercase tracking-wider px-5 py-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead, i) => (
                  <tr key={lead.id}
                    className={`border-b border-border/50 transition-colors hover:bg-brand-light/40
                                ${i % 2 !== 0 ? 'bg-gray-50/40' : ''}`}>

                    {/* Data */}
                    <td className="px-5 py-4 font-body text-xs text-muted whitespace-nowrap">
                      {fmt(lead.created_at)}
                    </td>

                    {/* Nome + Email */}
                    <td className="px-5 py-4">
                      <p className="font-subtitle font-semibold text-ink text-sm leading-tight">{lead.nome}</p>
                      {lead.email && (
                        <p className="font-body text-xs text-muted mt-0.5">{lead.email}</p>
                      )}
                    </td>

                    {/* WhatsApp */}
                    <td className="px-5 py-4">
                      <a href={waUrl(lead.telefone)} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1fba59]
                                   text-white font-subtitle font-semibold text-xs
                                   px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                        <WaIcon />
                        {lead.telefone}
                      </a>
                    </td>

                    {/* Situação */}
                    <td className="px-5 py-4">
                      <span className="font-subtitle text-xs bg-primary/10 text-primary
                                       px-2.5 py-1 rounded-full font-semibold whitespace-nowrap">
                        {lead.situacao}
                      </span>
                    </td>

                    {/* Status dropdown */}
                    <td className="px-5 py-4">
                      <select
                        value={lead.status}
                        onChange={e => updateStatus(lead.id, e.target.value as Lead['status'])}
                        disabled={updatingId === lead.id}
                        className={`text-xs font-subtitle font-semibold px-3 py-1.5 rounded-full
                                    border-0 focus:outline-none focus:ring-2 focus:ring-primary/30
                                    cursor-pointer disabled:opacity-50 ${STATUS[lead.status].color}`}
                      >
                        <option value="novo">Novo</option>
                        <option value="em_contato">Em Contato</option>
                        <option value="cliente">Cliente</option>
                        <option value="arquivado">Arquivado</option>
                      </select>
                    </td>

                    {/* Arquivo */}
                    <td className="px-5 py-4">
                      {lead.arquivo_path ? (
                        <a href={`/api/admin/file-url?path=${encodeURIComponent(lead.arquivo_path)}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-subtitle text-xs
                                     text-primary hover:underline font-semibold">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round"
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
                          </svg>
                          Ver
                        </a>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>

                    {/* Mensagem toggle */}
                    <td className="px-5 py-4">
                      {lead.mensagem ? (
                        <button onClick={() => setExpanded(expanded === lead.id ? null : lead.id)}
                          className="font-subtitle text-xs text-primary hover:underline font-semibold">
                          {expanded === lead.id ? 'Fechar' : 'Ver'}
                        </button>
                      ) : (
                        <span className="text-muted text-xs">—</span>
                      )}
                    </td>
                  </tr>
                ))}

                {/* Expanded message row */}
                {filtered.map(lead => expanded === lead.id && lead.mensagem ? (
                  <tr key={`${lead.id}-msg`} className="bg-amber-50/40">
                    <td colSpan={7} className="px-5 py-3">
                      <p className="font-body text-sm text-ink leading-relaxed">
                        <span className="font-semibold text-muted text-xs uppercase tracking-wide mr-2">Mensagem:</span>
                        {lead.mensagem}
                      </p>
                    </td>
                  </tr>
                ) : null)}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile Cards */}
        {filtered.length > 0 && (
          <div className="md:hidden space-y-3">
            {filtered.map(lead => (
              <div key={lead.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-subtitle font-bold text-ink text-base leading-tight">{lead.nome}</p>
                    <p className="font-body text-xs text-muted mt-0.5">{fmt(lead.created_at)}</p>
                  </div>
                  <select
                    value={lead.status}
                    onChange={e => updateStatus(lead.id, e.target.value as Lead['status'])}
                    disabled={updatingId === lead.id}
                    className={`flex-shrink-0 text-xs font-subtitle font-semibold px-3 py-1.5 rounded-full
                                border-0 focus:outline-none cursor-pointer disabled:opacity-50
                                ${STATUS[lead.status].color}`}
                  >
                    <option value="novo">Novo</option>
                    <option value="em_contato">Em Contato</option>
                    <option value="cliente">Cliente</option>
                    <option value="arquivado">Arquivado</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                  <a href={waUrl(lead.telefone)} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-[#25D366] text-white
                               font-subtitle font-semibold text-xs px-3 py-1.5 rounded-full">
                    <WaIcon />
                    {lead.telefone}
                  </a>
                  <span className="font-subtitle text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                    {lead.situacao}
                  </span>
                  {lead.arquivo_path && (
                    <a href={`/api/admin/file-url?path=${encodeURIComponent(lead.arquivo_path)}`}
                      target="_blank" rel="noopener noreferrer"
                      className="font-subtitle text-xs text-primary font-semibold hover:underline">
                      📎 Contracheque
                    </a>
                  )}
                </div>

                {lead.email && (
                  <p className="font-body text-xs text-muted mt-2">{lead.email}</p>
                )}

                {lead.mensagem && (
                  <p className="font-body text-xs text-muted mt-3 leading-relaxed border-t border-border pt-3">
                    {lead.mensagem}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

// ── Server Side ───────────────────────────────────────────────────────────────
export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token    = req.cookies.admin_token
  const expected = getAdminToken()

  if (!token || token !== expected) {
    return { props: { isAuthenticated: false, leads: null } }
  }

  try {
    const db = getAdminSupabase()
    const { data: leads } = await db
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })

    return { props: { isAuthenticated: true, leads: leads || [] } }
  } catch {
    return { props: { isAuthenticated: true, leads: [] } }
  }
}
