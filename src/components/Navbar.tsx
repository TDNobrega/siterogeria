import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WHATSAPP_URL, FIRM_NAME } from '../lib/constants'

const navLinks = [
  { href: '/#sobre',       label: 'Sobre' },
  { href: '/#servicos',    label: 'Serviços' },
  { href: '/professores',  label: 'Professores' },
  { href: '/blog',         label: 'Artigos e Notícias' },
  { href: '/#escritorio',  label: 'Escritório' },
  { href: '/#depoimentos', label: 'Depoimentos' },
  { href: '/#contato',     label: 'Contato' },
]

// Consultas processuais e portais OAB — abrem em nova aba
const processLinks = [
  { label: 'Consulta Trabalhista',    href: 'https://pje.trt1.jus.br/consultaprocessual/login' },
  { label: 'Consulta Cível',          href: 'https://www.tjrj.jus.br/' },
  { label: 'Consulta Federal',        href: 'https://eproc.jfrj.jus.br/eproc/externo_controlador.php?acao=principal' },
  { label: 'Consulta Federal Antigo', href: 'https://balcaojus.trf2.jus.br/balcaojus/#/login' },
  { label: 'OAB Federal',             href: 'https://www.oab.org.br/' },
  { label: 'OAB Rio',                 href: 'https://www.oabrj.org.br/' },
]

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
      fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  )
}

function ExternalIcon() {
  return (
    <svg className="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor"
      strokeWidth={1.75} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
    </svg>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [processOpen, setProcessOpen] = useState(false)        // dropdown desktop
  const [processOpenMobile, setProcessOpenMobile] = useState(false) // accordion mobile
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Fecha o dropdown ao clicar fora
  useEffect(() => {
    if (!processOpen) return
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProcessOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [processOpen])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 bg-ink transition-shadow duration-300
                        ${scrolled ? 'shadow-[0_1px_0_0_rgba(255,255,255,0.08)]' : ''}`}>
      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative h-12 w-44">
              <Image
                src="/assets/logo.png"
                alt={FIRM_NAME}
                fill
                sizes="176px"
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-subtitle text-sm font-medium text-white/70
                           hover:text-white transition-colors tracking-wide"
              >
                {l.label}
              </Link>
            ))}

            {/* Dropdown — Ver Processo */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={() => setProcessOpen(true)}
              onMouseLeave={() => setProcessOpen(false)}
            >
              <button
                onClick={() => setProcessOpen(!processOpen)}
                aria-expanded={processOpen}
                aria-haspopup="true"
                className="flex items-center gap-1.5 font-subtitle text-sm font-medium
                           text-white/70 hover:text-white transition-colors tracking-wide"
              >
                Ver Processo
                <ChevronIcon open={processOpen} />
              </button>

              {processOpen && (
                <div className="absolute right-0 top-full pt-3 w-64">
                  <div className="bg-ink border border-white/10 rounded-xl shadow-2xl
                                  py-2 overflow-hidden">
                    {processLinks.map((p) => (
                      <a
                        key={p.href}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 px-4 py-2.5
                                   font-subtitle text-sm text-white/70 hover:text-white
                                   hover:bg-white/5 transition-colors"
                      >
                        {p.label}
                        <ExternalIcon />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Fale Comigo
            </a>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 text-white/70 hover:text-white transition-colors"
            aria-label="Abrir menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}
              viewBox="0 0 24 24">
              {open
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-white/10 bg-ink px-4 py-5 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block font-subtitle text-sm font-medium text-white/70
                         hover:text-white py-2.5 border-b border-white/10
                         transition-colors"
            >
              {l.label}
            </Link>
          ))}

          {/* Accordion — Ver Processo */}
          <div className="border-b border-white/10">
            <button
              onClick={() => setProcessOpenMobile(!processOpenMobile)}
              aria-expanded={processOpenMobile}
              className="w-full flex items-center justify-between font-subtitle text-sm
                         font-medium text-white/70 hover:text-white py-2.5 transition-colors"
            >
              Ver Processo
              <ChevronIcon open={processOpenMobile} />
            </button>
            {processOpenMobile && (
              <div className="pb-2 space-y-0.5">
                {processLinks.map((p) => (
                  <a
                    key={p.href}
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 pl-4 pr-1 py-2
                               font-subtitle text-sm text-white/60 hover:text-white
                               transition-colors"
                  >
                    {p.label}
                    <ExternalIcon />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full"
            >
              Fale Comigo
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
