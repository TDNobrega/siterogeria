import type { ReactNode } from 'react'
import { WHATSAPP_URL } from '../lib/constants'

const stats = [
  { value: '10+',  label: 'Anos de Experiência' },
  { value: '500+', label: 'Casos Resolvidos' },
  { value: '98%',  label: 'Clientes Satisfeitos' },
  { value: '3',    label: 'Especialidades' },
]

// Ícones de traço fino — tom sóbrio, sem emojis
const valueIcons: Record<string, ReactNode> = {
  etica: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971z" />
    </svg>
  ),
  foco: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="8.25" /><circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  ),
  humano: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  ),
  especializacao: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
  ),
}

const values = [
  { id: 'etica',          title: 'Ética Profissional',  desc: 'Transparência em cada etapa' },
  { id: 'foco',           title: 'Foco em Resultados',   desc: 'Estratégias orientadas ao sucesso' },
  { id: 'humano',         title: 'Atendimento Humano',   desc: 'Você não é apenas um processo' },
  { id: 'especializacao', title: 'Especialização Real',  desc: 'Anos dedicados ao direito público e trabalhista' },
]

export default function About() {
  return (
    <section id="sobre" className="section-padding bg-white">
      <div className="container-max mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* ── Left: Photo + stats ── */}
          <div className="relative">
            {/* Main photo */}
            <div className="relative rounded-2xl overflow-hidden aspect-[3/4]
                            max-w-sm mx-auto lg:mx-0 shadow-card-hover">
              <picture>
                <source srcSet="/assets/attorney.webp" type="image/webp" />
                <img
                  src="/assets/attorney.jpg"
                  alt="Dra. Rogéria Oliveira — Advogada"
                  className="w-full h-full object-cover object-top"
                  loading="eager"
                  decoding="async"
                />
              </picture>
            </div>

            {/* Stats card — floating bottom-right */}
            <div className="absolute -bottom-6 -right-4 lg:right-0
                            bg-white rounded-2xl border border-border
                            shadow-card-hover p-5 w-56">
              <div className="grid grid-cols-2 gap-x-4 gap-y-5">
                {stats.map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="font-title text-2xl font-bold text-primary leading-none">
                      {s.value}
                    </p>
                    <p className="font-subtitle text-[11px] text-muted mt-1 leading-tight">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Right: Text ── */}
          <div className="mt-10 lg:mt-0 text-center lg:text-left">
            <p className="eyebrow justify-center lg:justify-start">Sobre o Escritório</p>

            <h2 className="section-title mb-4">
              Advocacia com{' '}
              <span className="text-primary">Propósito</span>{' '}
              e Resultado
            </h2>

            <div className="divider mb-8 mx-auto lg:mx-0" />

            <div className="space-y-4 font-body text-muted text-base leading-relaxed">
              <p>
                Somos um escritório de advocacia com atuação nacional, especializado
                nas complexidades que envolvem o{' '}
                <strong className="text-ink font-semibold">Servidor Público</strong> e o{' '}
                <strong className="text-ink font-semibold">Trabalhador da iniciativa privada</strong>.
                Nossa missão é clara: garantir que cada cliente receba uma defesa personalizada,
                transparente e rigorosamente focada em resultados.
              </p>
              <p>
                Com uma trajetória sólida em{' '}
                <strong className="text-ink font-semibold">Direito Previdenciário (RPPS e RGPS)</strong> e{' '}
                <strong className="text-ink font-semibold">Trabalhista</strong>, dominamos as nuances
                que separam um benefício negado de uma aposentadoria justa. Seja na recuperação de
                descontos indevidos, na correção de injustiças contratuais ou na viabilização de
                benefícios junto ao INSS, estamos prontos para proteger o seu patrimônio e o seu futuro.
              </p>
            </div>

            {/* Values grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 mb-8">
              {values.map((v) => (
                <div key={v.title}
                  className="flex items-start gap-3 p-4 rounded-xl
                             bg-brand-light border border-secondary/30">
                  <span className="text-primary mt-0.5 flex-shrink-0">{valueIcons[v.id]}</span>
                  <div>
                    <p className="font-subtitle font-semibold text-ink text-sm">{v.title}</p>
                    <p className="font-body text-muted text-xs mt-0.5">{v.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
              className="btn-primary mx-auto lg:mx-0">
              Agendar Consulta Gratuita
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
