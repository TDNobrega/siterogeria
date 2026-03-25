import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { WHATSAPP_URL, FIRM_NAME } from '../lib/constants'

const navLinks = [
  { href: '#sobre',       label: 'Sobre' },
  { href: '#servicos',    label: 'Serviços' },
  { href: '#escritorio',  label: 'Escritório' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#contato',     label: 'Contato' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

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
          <nav className="hidden lg:flex items-center gap-8">
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
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Fale Conosco
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
                         last:border-0 transition-colors"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full"
            >
              Fale Conosco
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
