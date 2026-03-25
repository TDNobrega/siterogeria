import { WHATSAPP_URL } from '../lib/constants'

const services = [
  {
    id: 'professores',
    icon: '🎓',
    title: 'Direito dos Professores',
    subtitle: 'Defesa dos seus direitos trabalhistas como docente',
    items: [
      'Descontos indevidos no contracheque',
      'Licenças médicas e afastamentos',
      'Horas-aula e regência de classe',
      'Progressão funcional bloqueada',
      'Demissão irregular ou assédio',
      'Revisão salarial e adicional de qualificação',
      'Direitos de professores municipais, estaduais e federais',
    ],
  },
  {
    id: 'previdenciario',
    icon: '🏛️',
    title: 'Direito Previdenciário',
    subtitle: 'INSS, aposentadoria, benefícios e BPC/LOAS',
    items: [
      'Aposentadoria por tempo de contribuição',
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
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {services.map((service) => (
            <div key={service.id} className="card-primary flex flex-col p-8">
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-brand-light flex items-center
                              justify-center text-2xl mb-6 flex-shrink-0">
                {service.icon}
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
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 w-full text-center btn-primary justify-center"
              >
                Quero Consultar Este Serviço
              </a>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center font-subtitle text-sm text-muted mt-10">
          Primeira consulta gratuita · Atendimento presencial e online · Campo Grande - RJ e todo o Brasil
        </p>
      </div>
    </section>
  )
}
