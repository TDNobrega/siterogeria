import { WHATSAPP_URL } from '../lib/constants'

export default function TrustSection() {
  return (
    <section id="presenca" className="relative overflow-hidden bg-ink">
      <div className="flex flex-col md:flex-row md:min-h-[560px]">

        {/* Texto */}
        <div className="flex-1 flex items-center px-4 sm:px-6 lg:px-16 py-16 md:py-0">
          <div className="max-w-lg mx-auto md:mx-0">
            <span className="font-subtitle text-sm font-semibold text-primary
                             tracking-widest uppercase flex items-center gap-2 mb-4">
              <span className="w-8 h-px bg-primary" />
              Presença
            </span>
            <h2 className="font-title font-bold text-3xl md:text-4xl lg:text-[2.5rem]
                           leading-tight text-white mb-5">
              Um advogado que você{' '}
              <span className="text-secondary">enxerga</span>, não só que assina
              petições
            </h2>
            <p className="font-body text-white/70 text-base leading-relaxed mb-8">
              Cada caso é acompanhado de perto, com atenção real ao que você está
              passando. Nada de respostas automáticas ou promessas vazias —
              só orientação clara e presença de verdade em cada etapa do
              processo.
            </p>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
            >
              Fale com a Dra. Rogéria
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2}
                viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>

        {/* Foto — de borda a borda */}
        <div className="relative w-full h-[360px] md:h-auto md:w-[45%] lg:w-[40%]">
          <picture>
            <source srcSet="/assets/rogeria-full.webp" type="image/webp" />
            <img
              src="/assets/rogeria-full.jpg"
              alt="Dra. Rogéria Oliveira"
              className="w-full h-full object-cover object-top"
              loading="lazy"
              decoding="async"
            />
          </picture>
        </div>

      </div>
    </section>
  )
}
