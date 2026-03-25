const officePhotos = [
  {
    src: '/assets/office-1.jpg',
    webp: '/assets/office-1.webp',
    alt: 'Recepção e sala de espera — Rogéria Oliveira Advocacia',
  },
  {
    src: '/assets/office-2.jpg',
    webp: '/assets/office-2.webp',
    alt: 'Dra. Rogéria no consultório jurídico',
  },
]

export default function Office() {
  return (
    <section id="escritorio" className="section-padding bg-white">
      <div className="container-max mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="font-subtitle text-sm font-semibold text-primary tracking-widest
                           uppercase flex items-center justify-center gap-2 mb-4">
            <span className="w-8 h-px bg-primary" />
            Nosso Espaço
            <span className="w-8 h-px bg-primary" />
          </span>
          <h2 className="section-title mb-4">
            Nosso <span className="text-primary">Escritório</span>
          </h2>
          <div className="divider-primary mx-auto mb-6" />
          <p className="section-subtitle max-w-2xl mx-auto">
            Um ambiente acolhedor, moderno e preparado para oferecer o
            melhor atendimento jurídico a você e sua família.
          </p>
        </div>

        {/* Photo Grid — 2 real photos side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {officePhotos.map((photo) => (
            <div
              key={photo.src}
              className="relative overflow-hidden rounded-2xl group aspect-[4/3] shadow-lg"
            >
              <picture>
                <source srcSet={photo.webp} type="image/webp" />
                <img
                  src={photo.src}
                  alt={photo.alt}
                  className="w-full h-full object-cover transition-transform duration-700
                             group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </picture>
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent
                              to-transparent opacity-0 group-hover:opacity-100 transition-opacity
                              duration-300 flex items-end p-6">
                <p className="text-white font-subtitle font-medium text-sm">{photo.alt}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Address Banner */}
        <div className="mt-12 bg-brand-light rounded-2xl border border-secondary/30 p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center
                          justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center
                              justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-subtitle font-semibold text-ink text-lg">Localização</p>
                <p className="font-body text-muted mt-1">
                  Estrada da Cachamorra, 350 - Bloco 3A, Sala 227<br />
                  Campo Grande - Rio de Janeiro - RJ
                </p>
                <div className="flex flex-wrap gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-sm text-muted font-body">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Seg – Sex: 10h às 18h
                  </span>
                  <span className="flex items-center gap-1.5 text-sm text-muted font-body">
                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Atendimento com hora marcada
                  </span>
                </div>
              </div>
            </div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Estrada+da+Cachamorra+350+Campo+Grande+Rio+de+Janeiro"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline flex-shrink-0 whitespace-nowrap"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Abrir no Google Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
