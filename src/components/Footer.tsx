import Image from 'next/image'
import Link from 'next/link'
import {
  WHATSAPP_URL,
  FIRM_NAME,
  FIRM_EMAIL,
  FIRM_PHONE,
  FIRM_CNPJ,
  OFFICE_ADDRESS,
  GOOGLE_MAPS_URL,
} from '../lib/constants'

const navLinks = [
  { href: '#sobre', label: 'Sobre o Escritório' },
  { href: '#servicos', label: 'Serviços' },
  { href: '#escritorio', label: 'Nosso Escritório' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#como-funciona', label: 'Como Funciona' },
  { href: '#contato', label: 'Contato' },
]

const services = [
  'Direito dos Professores',
  'Direito Previdenciário',
  'BPC / LOAS',
  'Aposentadoria por Invalidez',
  'Revisão de Benefícios',
  'Auxílio-doença',
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-white">
      {/* Main Footer */}
      <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── Col 1: Brand ── */}
          <div className="lg:col-span-1">
            <div className="relative h-14 w-44 mb-5">
              <Image
                src="/assets/logo.png"
                alt={FIRM_NAME}
                fill
                sizes="(max-width: 768px) 160px, 176px"
                className="object-contain object-left brightness-0 invert"
              />
            </div>
            <p className="font-body text-gray-400 text-sm leading-relaxed mb-6">
              Escritório especializado em Direito dos Professores e Direito
              Previdenciário. Defendemos seus direitos com dedicação e expertise.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp text-sm !px-4 !py-2.5"
            >
              <WhatsAppIcon />
              Fale no WhatsApp
            </a>
          </div>

          {/* ── Col 2: Navigation ── */}
          <div>
            <h4 className="font-title font-bold text-white text-lg mb-5 relative
                           after:content-[''] after:absolute after:-bottom-2 after:left-0
                           after:w-8 after:h-0.5 after:bg-primary">
              Navegação
            </h4>
            <ul className="space-y-3 mt-4">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-gray-400 hover:text-primary text-sm
                               transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-primary transition-all duration-200
                                     group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 3: Services ── */}
          <div>
            <h4 className="font-title font-bold text-white text-lg mb-5 relative
                           after:content-[''] after:absolute after:-bottom-2 after:left-0
                           after:w-8 after:h-0.5 after:bg-primary">
              Serviços
            </h4>
            <ul className="space-y-3 mt-4">
              {services.map((s) => (
                <li key={s}>
                  <Link
                    href="#servicos"
                    className="font-body text-gray-400 hover:text-primary text-sm
                               transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-0 h-px bg-primary transition-all duration-200
                                     group-hover:w-3" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 4: Contact ── */}
          <div>
            <h4 className="font-title font-bold text-white text-lg mb-5 relative
                           after:content-[''] after:absolute after:-bottom-2 after:left-0
                           after:w-8 after:h-0.5 after:bg-primary">
              Contato
            </h4>
            <ul className="space-y-4 mt-4">
              <li className="flex items-start gap-3">
                <svg className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <a href={GOOGLE_MAPS_URL} target="_blank" rel="noopener noreferrer"
                  className="font-body text-gray-400 text-sm hover:text-primary transition-colors
                             leading-relaxed">
                  {OFFICE_ADDRESS}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href={`tel:${FIRM_PHONE.replace(/\D/g, '')}`}
                  className="font-body text-gray-400 text-sm hover:text-primary transition-colors">
                  {FIRM_PHONE}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-4 h-4 text-primary flex-shrink-0" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href={`mailto:${FIRM_EMAIL}`}
                  className="font-body text-gray-400 text-sm hover:text-primary transition-colors">
                  {FIRM_EMAIL}
                </a>
              </li>
            </ul>

            {/* CNPJ + OAB Notice */}
            <div className="mt-6 p-3 rounded-lg bg-white/5 border border-white/10 space-y-2">
              <p className="font-subtitle text-gray-400 text-xs font-semibold tracking-wide">
                CNPJ: {FIRM_CNPJ}
              </p>
              <p className="font-body text-gray-500 text-xs leading-relaxed">
                ⚖️ Inscrita na OAB/RJ. Advocacia exercida nos termos do Estatuto da OAB e
                do Código de Ética e Disciplina.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-max mx-auto px-4 sm:px-6 lg:px-8 py-5
                        flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-body text-gray-500 text-sm text-center">
            © {year} {FIRM_NAME}. Todos os direitos reservados.
          </p>
          <p className="font-body text-gray-600 text-xs text-center">
            Este site é meramente informativo e não configura prestação de serviços advocatícios.
          </p>
        </div>
      </div>
    </footer>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.523 5.851L.057 23.057a.75.75 0 00.886.886l5.206-1.466A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.706 9.706 0 01-4.952-1.357l-.355-.21-3.678 1.036 1.036-3.678-.21-.355A9.706 9.706 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
    </svg>
  )
}
