import Head from 'next/head'
import { FIRM_NAME, FIRM_CNPJ } from '../lib/constants'

const WA_GERAL     = 'https://wa.me/5521969742080?text=' + encodeURIComponent('Olá, gostaria de uma consulta gratuita.')
const WA_PROF      = 'https://wa.me/5521983009815?text=' + encodeURIComponent('Olá, gostaria de analisar meu contracheque.')
const IG_GERAL     = 'https://instagram.com/rogeriaoliveiraadvocacia'
const IG_PROF      = 'https://instagram.com/rogeriaoliveira.advogada'
const GMB_REVIEW   = 'https://g.page/r/CT0bwIw2AmllEBM/review'

const links = [
  {
    label: 'Site: Direito Previdenciário',
    sublabel: 'INSS · BPC/LOAS · Aposentadoria',
    href: 'https://rogeriaoliveira.com',
    icon: '🌐',
    variant: 'primary',
  },
  {
    label: 'WhatsApp: Atendimento Direito Previdenciário',
    sublabel: '(21) 96974-2080',
    href: WA_GERAL,
    icon: '💬',
    variant: 'whatsapp',
  },
  {
    label: 'WhatsApp: Atendimento Professores/Servidores',
    sublabel: '(21) 98300-9815 · Análise do contracheque',
    href: WA_PROF,
    icon: '📋',
    variant: 'whatsapp',
  },
  {
    label: 'Avaliar no Google',
    sublabel: 'Sua opinião ajuda outros clientes',
    href: GMB_REVIEW,
    icon: '⭐',
    variant: 'review',
  },
]

const variantStyles: Record<string, string> = {
  primary:  'bg-primary hover:bg-support text-white',
  whatsapp: 'bg-[#25D366] hover:bg-[#1ebe5c] text-white',
  social:   'bg-white/10 hover:bg-white/20 text-white border border-white/20',
  review:   'bg-white hover:bg-white/90 text-ink',
}

export default function Links() {
  return (
    <>
      <Head>
        <title>Links | Rogéria Oliveira Advocacia</title>
        <meta name="description" content="Todos os contatos e links da Rogéria Oliveira Advogada: WhatsApp, Instagram, site e avaliações." />
        <meta name="robots" content="noindex" />
        <link rel="canonical" href="https://rogeriaoliveira.com/links" />
      </Head>

      <div className="min-h-screen bg-ink flex flex-col items-center justify-start px-4 py-10">

        {/* Avatar + nome */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary mb-4 shadow-lg bg-black">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/logo.png"
              alt={FIRM_NAME}
              className="w-full h-full object-contain p-2"
            />
          </div>
          <h1 className="font-title font-bold text-white text-xl mb-1">
            Rogéria Oliveira Advocacia
          </h1>
          <p className="font-subtitle text-white/60 text-sm text-center max-w-xs">
            Advogada Previdenciária &amp; Direitos dos Professores do RJ
          </p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="font-subtitle text-primary text-xs font-semibold tracking-wide">
              Campo Grande, Rio de Janeiro
            </span>
          </div>
        </div>

        {/* Links */}
        <div className="w-full max-w-sm flex flex-col gap-3">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-subtitle
                         font-semibold text-sm transition-all duration-200 shadow-sm
                         active:scale-95 ${variantStyles[link.variant]}`}
            >
              <span className="text-xl flex-shrink-0">{link.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm leading-tight">{link.label}</p>
                <p className={`text-xs mt-0.5 leading-tight font-normal
                  ${link.variant === 'review' ? 'text-ink/60' : 'text-white/70'}`}>
                  {link.sublabel}
                </p>
              </div>
              <svg className={`w-4 h-4 flex-shrink-0 opacity-60
                ${link.variant === 'review' ? 'text-ink' : 'text-white'}`}
                fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          ))}
        </div>

        {/* Logo */}
        <div className="mt-10 flex flex-col items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/logo.png" alt={FIRM_NAME} className="h-6 w-auto opacity-60" />
          <p className="font-subtitle text-white/30 text-xs">CNPJ {FIRM_CNPJ}</p>
        </div>

      </div>
    </>
  )
}
