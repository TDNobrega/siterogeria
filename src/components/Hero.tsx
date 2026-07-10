export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-[62vh] flex flex-col justify-between overflow-hidden
                 bg-[#FAF5EA]"
    >
      <div className="relative z-10 container-max mx-auto px-4 sm:px-6 lg:px-8
                      text-center pt-32 pb-10">

        {/* ── Banner da marca — versão bronze pra fundo claro ──────────────── */}
        <picture>
          <source srcSet="/assets/banner-logo-dark.webp" type="image/webp" />
          <img
            src="/assets/banner-logo-dark.png"
            alt="Rogéria Oliveira Advocacia"
            className="mx-auto w-full max-w-sm sm:max-w-md lg:max-w-lg animate-fade-up"
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </picture>

        {/* Filete dourado */}
        <div className="mt-7 mb-6 flex items-center justify-center gap-4">
          <span className="block w-16 h-px bg-gradient-to-r from-transparent to-support/70" />
          <span className="block w-1.5 h-1.5 rotate-45 border border-support/80" />
          <span className="block w-16 h-px bg-gradient-to-l from-transparent to-support/70" />
        </div>

        {/* H1 — apresentação (mantém termos de SEO) */}
        <h1 className="font-title font-medium text-ink leading-snug
                       text-2xl sm:text-3xl lg:text-4xl
                       max-w-3xl mx-auto mb-6 animate-fade-up">
          Advocacia especializada em{' '}
          <em className="not-italic text-support">Direito Previdenciário</em>{' '}
          e na defesa de{' '}
          <em className="not-italic text-support">Servidores Públicos</em>
        </h1>

        {/* Apresentação do escritório */}
        <p className="font-body text-ink/70 text-base sm:text-lg
                      max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-up">
          Um escritório dedicado a proteger o que você construiu: aposentadorias,
          benefícios do INSS e direitos do servidor, conduzidos com escuta atenta,
          técnica e transparência do início ao fim.
        </p>

        {/* Linha de confiança — tipografia discreta */}
        <div className="mt-4 flex flex-wrap items-center justify-center
                        gap-x-3 gap-y-2 animate-fade-up">
          {[
            'Campo Grande · Rio de Janeiro',
            'Atendimento presencial e online em todo o Brasil',
          ].map((item, i) => (
            <span key={item} className="flex items-center gap-3">
              {i > 0 && (
                <span className="hidden sm:block w-1 h-1 rounded-full bg-support/60" />
              )}
              <span className="font-subtitle text-[10px] tracking-[0.16em] uppercase text-support/90">
                {item}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Foto — balança da justiça clara, fundindo no creme ───────────── */}
      {/* Foto: Pexels License (uso livre e comercial) */}
      <div className="relative h-48 sm:h-56 lg:h-64 w-full">
        <picture>
          <source srcSet="/assets/hero-bg5.webp" type="image/webp" />
          <img
            src="/assets/hero-bg5.jpg"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-[center_35%]"
            loading="eager"
            decoding="async"
          />
        </picture>
        {/* Fade do creme por cima da foto */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF5EA] via-[#FAF5EA]/45 to-transparent" />
        {/* Fade pro branco na base — transição pra seção seguinte */}
        <div className="absolute bottom-0 inset-x-0 h-12 bg-gradient-to-t from-white to-transparent" />
      </div>
    </section>
  )
}
