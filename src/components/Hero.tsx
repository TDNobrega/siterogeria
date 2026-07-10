import { WHATSAPP_URL } from '../lib/constants'

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-ink"
    >
      {/* ── Fundo — biblioteca jurídica clássica, tratamento escuro/dourado ── */}
      {/* Foto: Iñaki del Olmo / Unsplash License (uso livre e comercial) */}
      <picture>
        <source srcSet="/assets/hero-bg.webp" type="image/webp" />
        <img
          src="/assets/hero-bg.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {/* Overlay — escurece a foto pra manter contraste do texto e do banner */}
      <div className="absolute inset-0 bg-ink/80" />

      {/* Brilho dourado suave atrás do banner */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 55% 40% at 50% 32%, rgba(197,151,58,0.22), transparent 70%)',
        }}
      />

      {/* Textura de grão — reforça a profundidade sobre a foto */}
      <div className="absolute inset-0 grain-overlay opacity-[0.05] pointer-events-none" />

      <div className="relative z-10 container-max mx-auto px-4 sm:px-6 lg:px-8
                      text-center py-24">

        {/* ── Banner da marca — PNG transparente, só a arte dourada ────────── */}
        <picture>
          <source srcSet="/assets/banner-logo.webp" type="image/webp" />
          <img
            src="/assets/banner-logo.png"
            alt="Rogéria Oliveira Advocacia"
            className="mx-auto w-full max-w-md sm:max-w-lg lg:max-w-xl animate-fade-up
                       drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        {/* Filete dourado */}
        <div className="mt-10 mb-8 flex items-center justify-center gap-4">
          <span className="block w-16 h-px bg-gradient-to-r from-transparent to-primary/70" />
          <span className="block w-1.5 h-1.5 rotate-45 border border-primary/80" />
          <span className="block w-16 h-px bg-gradient-to-l from-transparent to-primary/70" />
        </div>

        {/* H1 — apresentação (mantém termos de SEO) */}
        <h1 className="font-title font-medium text-white leading-snug
                       text-2xl sm:text-3xl lg:text-4xl
                       max-w-3xl mx-auto mb-6 animate-fade-up">
          Advocacia especializada em{' '}
          <em className="not-italic text-secondary">Direito Previdenciário</em>{' '}
          e na defesa de{' '}
          <em className="not-italic text-secondary">Servidores Públicos</em>
          <span className="block mt-2 text-lg sm:text-xl text-white/70 font-title italic">
            Campo Grande · Rio de Janeiro · Atendimento em todo o Brasil
          </span>
        </h1>

        {/* Apresentação do escritório */}
        <p className="font-body text-white/75 text-base sm:text-lg
                      max-w-2xl mx-auto mb-12 leading-relaxed animate-fade-up">
          Um escritório dedicado a proteger o que você construiu: aposentadorias,
          benefícios do INSS e direitos do servidor, conduzidos com escuta atenta,
          técnica e transparência do início ao fim.
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
            href="#sobre"
            className="btn-ghost w-full sm:w-auto"
          >
            Conheça o Escritório
          </a>
        </div>

        {/* Linha de confiança — sem emojis, tipografia discreta */}
        <div className="mt-16 flex flex-wrap items-center justify-center
                        gap-x-3 gap-y-2 animate-fade-up">
          {[
            'OAB/RJ 239.339',
            'Atendimento presencial e online',
          ].map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && (
                <span className="hidden sm:block w-1 h-1 rounded-full bg-primary/60" />
              )}
              <span className="font-subtitle text-xs tracking-[0.18em] uppercase text-white/55">
                {item}
              </span>
            </span>
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
