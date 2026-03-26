const testimonials = [
  {
    name: 'Maria Aparecida S.',
    role: 'Professora Municipal – Rio de Janeiro',
    stars: 5,
    text: 'Tive descontos indevidos no meu contracheque por quase dois anos. Tentei resolver sozinha, sem sucesso. Com a Dra. Rogéria, em poucos meses recebi tudo de volta, com correção. Atendimento humano e profissional do início ao fim.',
    initial: 'M',
  },
  {
    name: 'José Carlos F.',
    role: 'Aposentado – Campo Grande, RJ',
    stars: 5,
    text: 'O INSS havia negado meu auxílio-doença duas vezes. Depois de contratar o escritório, entramos com recurso e conseguimos o benefício. Não precisei sair de casa para nada, tudo foi resolvido à distância. Recomendo muito!',
    initial: 'J',
  },
  {
    name: 'Ana Lúcia M.',
    role: 'Professora Estadual – RJ',
    stars: 5,
    text: 'Estava lutando para conseguir minha aposentadoria especial como professora há mais de um ano. A equipe da Rogéria Advocacia entrou com a ação e em menos de 6 meses consegui meu benefício. Ótima equipe, muito competente!',
    initial: 'A',
  },
  {
    name: 'Roberto Mendes',
    role: 'Servidor Público – Rio de Janeiro',
    stars: 5,
    text: 'Minha mãe precisava do BPC/LOAS e o INSS tinha negado o pedido. Com a ajuda da Dra. Rogéria conseguimos reverter a decisão judicialmente. Excelente profissional, muito dedicada ao caso da nossa família.',
    initial: 'R',
  },
  {
    name: 'Cláudia Pereira',
    role: 'Professora de Educação Infantil',
    stars: 5,
    text: 'Fui demitida sem justa causa após 15 anos de magistério na rede privada. Não sabia quais eram meus direitos. O escritório me orientou, entrou com a ação e recebi todas as verbas rescisórias que a escola tentou me sonegar.',
    initial: 'C',
  },
  {
    name: 'Francisco Lima',
    role: 'Trabalhador Informal – Campo Grande, RJ',
    stars: 5,
    text: 'Nunca imaginei que teria direito à aposentadoria por invalidez. Após dois infartos, o INSS negou meu pedido. A advogada Rogéria entrou com recurso e hoje recebo meu benefício todos os meses. Deus abençoe esse escritório!',
    initial: 'F',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? 'text-yellow-400' : 'text-border'}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section id="depoimentos" className="section-padding bg-brand-light">
      <div className="container-max mx-auto">

        {/* Header */}
        <div className="text-center mb-14">
          <p className="eyebrow justify-center">O Que Dizem Nossos Clientes</p>
          <h2 className="section-title mb-4">
            Histórias de <span className="text-primary">Sucesso Reais</span>
          </h2>
          <div className="divider mx-auto mb-6" />
          <p className="section-subtitle max-w-2xl mx-auto">
            Cada depoimento representa uma vida transformada e um direito garantido.
          </p>
        </div>

        {/* Testimonial Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="card bg-white p-4 sm:p-7 flex flex-col min-w-0"
            >
              {/* Quote icon */}
              <svg className="w-7 h-7 text-secondary mb-4 flex-shrink-0"
                fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>

              {/* Review text */}
              <p className="font-body text-muted leading-relaxed text-sm flex-grow mb-6">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-border">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center
                                justify-center text-white font-title font-bold text-lg
                                flex-shrink-0">
                  {t.initial}
                </div>
                <div className="flex-grow min-w-0">
                  <p className="font-subtitle font-semibold text-ink text-sm truncate">
                    {t.name}
                  </p>
                  <p className="font-body text-muted text-xs truncate">{t.role}</p>
                </div>
                <Stars count={t.stars} />
              </div>
            </div>
          ))}
        </div>

        {/* Google Reviews CTA */}
        <div className="text-center mt-10">
          <a
            href="https://www.google.com/search?q=Rogéria+Advocacia+Campo+Grande+Rio+de+Janeiro&hl=pt-BR"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Ver mais avaliações no Google
          </a>
          <p className="font-body text-muted text-sm mt-3">
            ⭐ 5.0 · Avaliações verificadas no Google
          </p>
        </div>
      </div>
    </section>
  )
}
