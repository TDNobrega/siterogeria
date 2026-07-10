import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* DNS prefetch for external services */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        <link rel="dns-prefetch" href="//wa.me" />
        <link rel="dns-prefetch" href="//api.whatsapp.com" />

        {/* Google Fonts — Cormorant Garamond (títulos, serif clássica alinhada ao
            banner da marca) + DM Sans + Nunito Sans */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Nunito+Sans:ital,opsz,wght@0,6..12,400;0,6..12,500;0,6..12,600;0,6..12,700;1,6..12,400&display=swap"
          rel="stylesheet"
        />

        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        <meta name="format-detection" content="telephone=no" />

        {/* Schema global — advogada reconhecida em todas as páginas */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Attorney",
              "name": "Rogéria Oliveira",
              "url": "https://rogeriaoliveira.com",
              "description": "Advogada especializada em Direito Previdenciário e Direitos do Servidor Público, com foco em professores estaduais do Rio de Janeiro.",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Estrada da Cachamorra, 350 - Bloco 3A, Sala 227",
                "addressLocality": "Campo Grande",
                "addressRegion": "RJ",
                "addressCountry": "BR"
              },
              "telephone": "+55-21-96940-1414",
              "memberOf": {
                "@type": "Organization",
                "name": "OAB/RJ",
                "identifier": "239.339"
              }
            })
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
