import { WHATSAPP_URL } from '../lib/constants'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundColor: '#000000',
        backgroundImage: "url('/assets/banner.webp'), url('/assets/banner.jpg')",
        backgroundSize: 'contain',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay — dark base + subtle primary warmth */}
      <div className="absolute inset-0 bg-ink/60" />
      <div className="absolute inset-0 bg-primary/10" />

      <div className="relative z-10 container-max mx-auto px-4 sm:px-6 lg:px-8
                      text-center py-16">

        {/* H1 */}
        <h1 className="font-title font-bold text-white leading-[1.1]
                       text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem]
                       max-w-4xl mx-auto mb-6 animate-fade-up">
          Advocacia Especializada em{' '}
          <span className="text-secondary">Direito Previdenciário (INSS)</span>{' '}
          e Direitos do{' '}
          <span className="text-secondary">Servidor Público</span>
        </h1>

        {/* Divider */}
        <div className="w-12 h-px bg-primary mx-auto mb-7" />

        {/* Sub-headline */}
        <p className="font-body text-white/80 text-lg sm:text-xl
                      max-w-2xl mx-auto mb-4 leading-relaxed animate-fade-up">
          Descontos indevidos no contracheque? Benefício negado pelo INSS?
          Aposentadoria travada? Nós resolvemos.
        </p>
        <p className="font-body text-white/60 text-base max-w-xl mx-auto mb-12">
          Atendemos professores e trabalhadores com problemas previdenciários
          em todo o Brasil.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary-lg w-full sm:w-auto"
          >
            <WhatsAppIcon />
            Fale com um Advogado
          </a>
          <a
            href="#servicos"
            className="btn-ghost w-full sm:w-auto"
          >
            Ver Serviços
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}
              viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>

        {/* Trust strip */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 animate-fade-up">
          {[
            { icon: '⚖️', text: 'Direito dos Professores' },
            { icon: '🏛️', text: 'Direito Previdenciário' },
          ].map((item) => (
            <div key={item.text}
              className="flex items-center gap-2 text-white/60">
              <span className="text-base">{item.icon}</span>
              <span className="font-subtitle text-xs tracking-wide">{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24
                      bg-gradient-to-t from-white to-transparent" />
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
