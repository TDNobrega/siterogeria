import { WHATSAPP_URL } from '../lib/constants'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink"
    >
      {/* ── Fundo temático (100% CSS/SVG, sem foto) ──────────────────────── */}

      {/* Colunas — linhas verticais finas evocando arquitetura de tribunal,
          "emergindo" da base e se dissolvendo em direção ao topo */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/3 opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, rgba(197,151,58,0.35) 0px, rgba(197,151,58,0.35) 2px, transparent 2px, transparent 44px)',
          maskImage: 'linear-gradient(to top, black, transparent)',
          WebkitMaskImage: 'linear-gradient(to top, black, transparent)',
        }}
      />

      {/* Brilho dourado suave atrás do título */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 60% 45% at 50% 8%, rgba(197,151,58,0.28), transparent 70%)',
        }}
      />

      {/* Balança da justiça — silhueta grande e discreta, só decorativa */}
      <ScalesMotif className="absolute -right-16 top-1/2 -translate-y-1/2
                              w-[420px] h-[420px] lg:w-[560px] lg:h-[560px]
                              text-primary opacity-[0.08] pointer-events-none" />

      {/* Textura de grão — profundidade sem precisar de imagem real */}
      <div className="absolute inset-0 grain-overlay opacity-[0.06] pointer-events-none" />

      {/* Overlay — escurece tudo de novo pra manter contraste do texto */}
      <div className="absolute inset-0 bg-ink/60" />
      <div className="absolute inset-0 bg-primary/10" />

      <div className="relative z-10 container-max mx-auto px-4 sm:px-6 lg:px-8
                      text-center py-16">

        {/* H1 */}
        <h1 className="font-title font-bold text-white leading-[1.1]
                       text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem]
                       max-w-4xl mx-auto mb-6 animate-fade-up">
          Advocacia Especializada para{' '}
          <span className="text-secondary">Servidores Públicos</span>{' '}
          e{' '}
          <span className="text-secondary">Direito Previdenciário</span>{' '}
          em Campo Grande, RJ
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
            Fale Comigo
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
            { icon: '⚖️', text: 'Direito dos Servidores Públicos' },
            { icon: '🏛️', text: 'Direito Previdenciário' },
            { icon: '💼', text: 'Direito Trabalhista' },
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

/** Balança da justiça — line-art minimalista, só decorativa (não é um ícone de UI). */
function ScalesMotif({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.25}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Poste central */}
      <line x1="100" y1="18" x2="100" y2="168" />
      {/* Finial */}
      <circle cx="100" cy="12" r="5" />
      {/* Trave horizontal */}
      <line x1="34" y1="40" x2="166" y2="40" />
      {/* Base / pedestal */}
      <line x1="66" y1="168" x2="134" y2="168" />
      <line x1="76" y1="180" x2="124" y2="180" />
      <line x1="100" y1="168" x2="100" y2="180" />

      {/* Prato esquerdo */}
      <line x1="34" y1="40" x2="20" y2="84" />
      <line x1="34" y1="40" x2="48" y2="84" />
      <path d="M14 84 a20 14 0 0 0 40 0" />

      {/* Prato direito */}
      <line x1="166" y1="40" x2="152" y2="84" />
      <line x1="166" y1="40" x2="180" y2="84" />
      <path d="M146 84 a20 14 0 0 0 40 0" />
    </svg>
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
