import type { ReactNode } from 'react'
import { WHATSAPP_URL } from '../lib/constants'

// Ícones de traço fino — substituem os emojis pra manter o tom sóbrio da marca
const icons: Record<string, ReactNode> = {
  professores: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  ),
  previdenciario: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
    </svg>
  ),
  trabalhista: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round"
        d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  ),
}

const services = [
  {
    id: 'professores',
    title: 'Direito dos Servidores Públicos',
    subtitle: 'Defesa dos seus direitos como servidor ou docente',
    items: [
      'Descontos indevidos no contracheque',
      'Licenças médicas e afastamentos',
      'Piso Nacional do Magistério e triênios',
      'Progressão funcional bloqueada',
      'Demissão irregular ou assédio',
      'Revisão salarial e adicional de qualificação',
      'Direitos de servidores municipais, estaduais e federais',
    ],
  },
  {
    id: 'previdenciario',
    title: 'Direito Previdenciário',
    subtitle: 'RPPS, RGPS, aposentadoria, benefícios e BPC/LOAS',
    items: [
      'Aposentadoria por tempo de contribuição (RPPS e RGPS)',
      'Aposentadoria por invalidez',
      'Revisão de benefícios negados',
      'Auxílio-doença e auxílio-acidente',
      'Pensão por morte',
      'Planejamento previdenciário',
      'Recursos administrativos no INSS',
      'BPC/LOAS — Benefício de Prestação Continuada',
      'Benefício para idosos acima de 65 anos',
      'Benefício para pessoas com deficiência',
    ],
  },
  {
    id: 'trabalhista',
    title: 'Direito Trabalhista',
    subtitle: 'Proteção dos seus direitos nas relações de trabalho',
    items: [
      'Demissão sem justa causa e rescisão indireta',
      'Horas extras e banco de horas não pagos',
      'Assédio moral e sexual no trabalho',
      'FGTS não depositado ou sacado indevidamente',
      'Adicional de insalubridade e periculosidade',
      'Estabilidade no emprego (gestante, acidente, doença)',
      'Equiparação salarial e discriminação remuneratória',
    ],
  },
]

export default function Services() {
  return (
    <section id="servicos" className="section-padding bg-brand-light">
      <div className="container-max mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="eyebrow justify-center">Nossas Especialidades</p>
          <h2 className="section-title mb-4">
            Como Podemos <span className="text-primary">Ajudar Você</span>
          </h2>
          <div className="divider mx-auto mb-6" />
          <p className="section-subtitle max-w-2xl mx-auto">
            Atuamos em áreas específicas do direito para oferecer o nível
            de especialização que o seu caso merece.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {services.map((service) => (
            <div key={service.id} className="card-primary flex flex-col p-8">
              {/* Icon */}
              <div className="w-14 h-14 rounded-full border border-primary/30 bg-brand-light
                              flex items-center justify-center text-primary mb-6 flex-shrink-0">
                {icons[service.id]}
              </div>

              {/* Title */}
              <h3 className="font-title text-xl font-bold text-ink mb-2">
                {service.title}
              </h3>
              <p className="font-subtitle text-muted text-sm mb-5 leading-relaxed">
                {service.subtitle}
              </p>

              <div className="w-8 h-px bg-primary/40 mb-5" />

              {/* Items */}
              <ul className="space-y-3 flex-grow">
                {service.items.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
                      fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd" />
                    </svg>
                    <span className="font-body text-muted text-sm leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href={service.id === 'professores' ? '/professores' : WHATSAPP_URL}
                {...(service.id !== 'professores' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                className="mt-8 inline-flex items-center gap-2 font-subtitle font-semibold
                           text-sm text-primary hover:text-support transition-colors
                           border-t border-border pt-5"
              >
                Falar sobre este serviço
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.75}
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center font-subtitle text-sm text-muted mt-10">
          Primeira consulta gratuita · Atendimento presencial e online · Todo o Brasil
        </p>
      </div>
    </section>
  )
}
