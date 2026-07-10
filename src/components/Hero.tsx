export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[62vh] flex items-center justify-center overflow-hidden bg-ink"
    >
      {/* ── Fundo — martelo de juiz sobre preto, clean e jurídico ─────────── */}
      {/* Foto: Tingey Injury Law Firm / Unsplash License (uso livre e comercial) */}
      <picture>
        <source srcSet="/assets/hero-bg3.webp" type="image/webp" />
        <img
          src="/assets/hero-bg3.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover brightness-[.8]
                     lg:scale-[1.45] lg:translate-x-[14%] lg:translate-y-[8%]"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
      </picture>

      {/* Overlay — escurece a zona central/esquerda (texto) e preserva o
          martelo visível à direita */}
      <div className="absolute inset-0 bg-ink/45" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/65 via-ink/55 to-transparent" />

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
                      text-center pt-32 pb-16">

        {/* ── Banner da marca — PNG transparente, só a arte dourada ────────── */}
        <picture>
          <source srcSet="/assets/banner-logo.webp" type="image/webp" />
          <img
            src="/assets/banner-logo.png"
            alt="Rogéria Oliveira Advocacia"
            className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg animate-fade-up
                       drop-shadow-[0_2px_24px_rgba(0,0,0,0.55)]"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        {/* Filete dourado */}
        <div className="mt-7 mb-6 flex items-center justify-center gap-4">
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
                      max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-up">
          Um escritório dedicado a proteger o que você construiu: aposentadorias,
          benefícios do INSS e direitos do servidor, conduzidos com escuta atenta,
          técnica e transparência do início ao fim.
        </p>

        {/* Linha de confiança — sem emojis, tipografia discreta */}
        <div className="mt-4 flex flex-wrap items-center justify-center
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
