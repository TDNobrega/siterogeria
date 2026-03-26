import { WHATSAPP_URL } from '../lib/constants'

const steps = [
  {
    number: '01',
    icon: '💬',
    title: 'Contato Inicial',
    description:
      'Entre em contato pelo WhatsApp ou formulário. Nossa equipe responde rapidamente para entender sua situação e agendar uma conversa.',
    highlight: 'Gratuito e sem compromisso',
  },
  {
    number: '02',
    icon: '🔍',
    title: 'Análise do Caso',
    description:
      'Analisamos a documentação e os detalhes do seu caso com atenção. Identificamos os melhores caminhos jurídicos e apresentamos uma estratégia clara.',
    highlight: 'Diagnóstico jurídico preciso',
  },
  {
    number: '03',
    icon: '⚖️',
    title: 'Atuação Jurídica',
    description:
      'Iniciamos as providências necessárias — administrativas ou judiciais — e acompanhamos cada etapa, mantendo você informado sobre o andamento.',
    highlight: 'Transparência total no processo',
  },
  {
    number: '04',
    icon: '✅',
    title: 'Resultado Garantido',
    description:
      'Trabalhamos incansavelmente até a resolução do seu caso. Seu direito garantido é o nosso objetivo final.',
    highlight: 'Foco em resultados concretos',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="section-padding bg-white">
      <div className="container-max mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="eyebrow justify-center">Processo Simples e Transparente</p>
          <h2 className="section-title mb-4">
            Como <span className="text-primary">Funciona</span>
          </h2>
          <div className="divider mx-auto mb-6" />
          <p className="section-subtitle max-w-2xl mx-auto">
            Da primeira conversa à solução do seu caso, estamos ao seu lado em cada etapa.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-16 left-1/2 -translate-x-1/2
                          w-3/4 h-px bg-border" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Step number circle */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center
                                  justify-center text-white font-title text-xl font-bold
                                  shadow-button z-10 relative">
                    {step.icon}
                  </div>
                  <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-support
                                  flex items-center justify-center text-white text-xs
                                  font-subtitle font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="card p-6 w-full hover:border-primary/30 transition-colors">
                  <span className="font-title text-5xl font-bold text-secondary/40
                                   leading-none block mb-3">
                    {step.number}
                  </span>
                  <h3 className="font-title text-xl font-bold text-ink mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-muted text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>
                  <span className="inline-block bg-brand-light text-primary text-xs
                                   font-subtitle font-semibold px-3 py-1 rounded-full
                                   border border-primary/20">
                    {step.highlight}
                  </span>
                </div>

                {/* Arrow connector (mobile/tablet) */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex items-center justify-center mt-4">
                    <svg className="w-6 h-6 text-primary rotate-90 sm:rotate-0"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-14">
          <p className="font-subtitle text-muted mb-6 text-lg">
            Pronto para dar o primeiro passo?
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mx-auto"
          >
            <WhatsAppIcon />
            Iniciar Meu Atendimento Agora
          </a>
        </div>
      </div>
    </section>
  )
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.118 1.523 5.851L.057 23.057a.75.75 0 00.886.886l5.206-1.466A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75a9.706 9.706 0 01-4.952-1.357l-.355-.21-3.678 1.036 1.036-3.678-.21-.355A9.706 9.706 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z" />
    </svg>
  )
}
