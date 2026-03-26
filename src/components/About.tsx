import { WHATSAPP_URL } from '../lib/constants'

const stats = [
  { value: '10+',  label: 'Anos de Experiência' },
  { value: '500+', label: 'Casos Resolvidos' },
  { value: '98%',  label: 'Clientes Satisfeitos' },
  { value: '2',    label: 'Especialidades' },
]

const values = [
  { icon: '⚖️', title: 'Ética Profissional',  desc: 'Transparência em cada etapa' },
  { icon: '🎯', title: 'Foco em Resultados',   desc: 'Estratégias orientadas ao sucesso' },
  { icon: '🤝', title: 'Atendimento Humano',   desc: 'Você não é apenas um processo' },
  { icon: '📚', title: 'Especialização Real',  desc: 'Anos dedicados ao direito do professor' },
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

            {/* Decorative dot */}
            <div className="absolute -top-3 -left-3 w-16 h-16 rounded-full
                            bg-secondary/30 -z-10" />
          </div>

          {/* ── Right: Text ── */}
          <div className="mt-10 lg:mt-0 text-center lg:text-left">
            <p className="eyebrow">Sobre o Escritório</p>

            <h2 className="section-title mb-4">
              Advocacia com{' '}
              <span className="text-primary">Propósito</span>{' '}
              e Resultado
            </h2>

            <div className="divider mb-8 mx-auto lg:mx-0" />

            <div className="space-y-4 font-body text-muted text-base leading-relaxed">
              <p>
                Somos um escritório especializado no atendimento a{' '}
                <strong className="text-ink font-semibold">professores</strong> e
                trabalhadores com questões junto ao{' '}
                <strong className="text-ink font-semibold">INSS</strong>, com
                atuação em todo o Brasil.
              </p>
              <p>
                Nossa missão é garantir que cada cliente receba atendimento
                personalizado, transparente e focado em resultados. Entendemos as
                particularidades da carreira docente e as complexidades do sistema
                previdenciário brasileiro.
              </p>
              <p>
                Já ajudamos centenas de professores a recuperarem descontos indevidos,
                garantirem seus benefícios e conquistarem a aposentadoria a que têm direito.
              </p>
            </div>

            {/* Values grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 mb-8">
              {values.map((v) => (
                <div key={v.title}
                  className="flex items-start gap-3 p-4 rounded-xl
                             bg-brand-light border border-secondary/30">
                  <span className="text-xl mt-0.5">{v.icon}</span>
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
