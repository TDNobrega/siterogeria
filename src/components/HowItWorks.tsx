import { WHATSAPP_URL } from '../lib/constants'

const steps = [
  {
    number: '01',
    title: 'Contato Inicial',
    description:
      'Entre em contato pelo WhatsApp ou formulário. Nossa equipe responde rapidamente para entender sua situação e agendar uma conversa.',
    highlight: 'Sem compromisso',
  },
  {
    number: '02',
    title: 'Análise do Caso',
    description:
      'Analisamos a documentação e os detalhes do seu caso com atenção. Identificamos os melhores caminhos jurídicos e apresentamos uma estratégia clara.',
    highlight: 'Diagnóstico jurídico preciso',
  },
  {
    number: '03',
    title: 'Atuação Jurídica',
    description:
      'Iniciamos as providências necessárias — administrativas ou judiciais — e acompanhamos cada etapa, mantendo você informado sobre o andamento.',
    highlight: 'Transparência total no processo',
  },
  {
    number: '04',
    title: 'Resolução do Seu Caso',
    description:
      'Trabalhamos incansavelmente até a resolução do seu caso. Seu direito é o nosso objetivo final.',
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
          {/* Connector line (desktop only) — passa pelo centro dos círculos */}
          <div className="hidden lg:block absolute top-8 left-1/2 -translate-x-1/2
                          w-3/4 h-px bg-border" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                {/* Número da etapa — serif, círculo de traço fino */}
                <div className="w-16 h-16 rounded-full border border-primary/40 bg-white
                                flex items-center justify-center mb-6 z-10 relative">
                  <span className="font-title text-2xl font-semibold text-primary leading-none">
                    {step.number}
                  </span>
                </div>

                {/* Content */}
                <div className="w-full">
                  <h3 className="font-title text-2xl font-semibold text-ink mb-3">
                    {step.title}
                  </h3>
                  <p className="font-body text-muted text-sm leading-relaxed mb-3">
                    {step.description}
                  </p>
                  <span className="font-subtitle text-xs font-semibold tracking-[0.12em]
                                   uppercase text-primary">
                    {step.highlight}
                  </span>
                </div>
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
