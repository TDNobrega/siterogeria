import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WHATSAPP_URL, FIRM_NAME } from '../lib/constants'

const navLinks = [
  { href: '/#sobre',       label: 'Início' },
  { href: '/#servicos',    label: 'Serviços' },
  { href: '/professores',  label: 'Professores' },
  { href: '/blog',         label: 'Artigos e Notícias' },
  { href: '/#escritorio',  label: 'Escritório' },
  { href: '/#depoimentos', label: 'Depoimentos' },
]

// Consultas processuais — abrem em nova aba
const processLinks = [
  { label: 'Consulta Trabalhista',            href: 'https://pje.trt1.jus.br/consultaprocessual/consulta-cidadao' },
  { label: 'Consulta Federal Previdenciário', href: 'https://eproc-consulta.jfrj.jus.br/eproc/externo_controlador.php?acao=processo_consulta_publica' },
  { label: 'Cível PJe',                       href: 'https://tjrj.pje.jus.br/pje/ConsultaPublica/listView.seam' },
  { label: 'Cível e-eproc',                   href: 'https://eproc1g-cp.tjrj.jus.br/eproc/externo_controlador.php?acao=processo_consulta_publica' },
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
    <header className={`fixed inset-x-0 top-0 z-50 bg-white border-b border-border
                        transition-shadow duration-300
                        ${scrolled ? 'shadow-[0_2px_12px_0_rgba(0,0,0,0.06)]' : ''}`}>
      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo — banner bronze (versão pra fundo claro) */}
          <Link href="/" className="flex-shrink-0">
            <div className="relative h-12 w-44">
              <Image
                src="/assets/banner-logo-dark.png"
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
                className="font-subtitle text-sm font-medium text-muted
                           hover:text-ink transition-colors tracking-wide"
              >
                {l.label}
              </Link>
            ))}

            {/* Dropdown — Consulte seu Processo */}
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
                           text-muted hover:text-ink transition-colors tracking-wide"
              >
                Consulte seu Processo
                <ChevronIcon open={processOpen} />
              </button>

              {processOpen && (
                <div className="absolute right-0 top-full pt-3 w-64">
                  <div className="bg-white border border-border rounded-xl shadow-xl
                                  py-2 overflow-hidden">
                    {processLinks.map((p) => (
                      <a
                        key={p.href}
                        href={p.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between gap-3 px-4 py-2.5
                                   font-subtitle text-sm text-muted hover:text-ink
                                   hover:bg-brand-light transition-colors"
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
            className="lg:hidden p-2 text-muted hover:text-ink transition-colors"
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
        <div className="lg:hidden border-t border-border bg-white px-4 py-5 space-y-1">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block font-subtitle text-sm font-medium text-muted
                         hover:text-ink py-2.5 border-b border-border
                         transition-colors"
            >
              {l.label}
            </Link>
          ))}

          {/* Accordion — Consulte seu Processo */}
          <div className="border-b border-border">
            <button
              onClick={() => setProcessOpenMobile(!processOpenMobile)}
              aria-expanded={processOpenMobile}
              className="w-full flex items-center justify-between font-subtitle text-sm
                         font-medium text-muted hover:text-ink py-2.5 transition-colors"
            >
              Consulte seu Processo
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
                               font-subtitle text-sm text-muted hover:text-ink
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
