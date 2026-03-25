import type { NextPage } from 'next'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Layout from '../components/Layout'
import Hero from '../components/Hero'
import { FIRM_NAME, FIRM_PHONE, FIRM_EMAIL, FIRM_CNPJ } from '../lib/constants'

// Below-fold sections loaded lazily to reduce initial bundle
const About       = dynamic(() => import('../components/About'))
const Services    = dynamic(() => import('../components/Services'))
const Office      = dynamic(() => import('../components/Office'))
const Testimonials = dynamic(() => import('../components/Testimonials'))
const HowItWorks  = dynamic(() => import('../components/HowItWorks'))
const CTASection  = dynamic(() => import('../components/CTASection'))
const Contact     = dynamic(() => import('../components/Contact'))

const SEO = {
  title: 'Rogéria Oliveira Advogada | Direito Previdenciário (INSS) e Direitos do Servidor Público – Campo Grande, RJ',
  description:
    'Advogada especializada em Direito Previdenciário e Direitos do Servidor Público em Campo Grande, Rio de Janeiro. INSS negado, aposentadoria, BPC/LOAS, descontos indevidos no contracheque. Consulta gratuita.',
  keywords:
    'advogada servidor público campo grande rj, direito previdenciário rio de janeiro, INSS negado rio de janeiro, aposentadoria servidor público, BPC LOAS rio de janeiro, descontos indevidos servidor público, advocacia campo grande, rogéria oliveira advogada',
  url: 'https://rogeriaoliveira.com',
  image: '/assets/banner.jpg',
}

const Home: NextPage = () => {
  return (
    <>
      <Head>
        {/* Primary */}
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <meta name="keywords" content={SEO.keywords} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="language" content="pt-BR" />
        <meta name="author" content={FIRM_NAME} />
        <link rel="canonical" href={SEO.url} />

        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <meta name="theme-color" content="#C5973A" />

        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SEO.url} />
        <meta property="og:title" content={SEO.title} />
        <meta property="og:description" content={SEO.description} />
        <meta property="og:image" content={`${SEO.url}${SEO.image}`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="Rogéria Oliveira Advogada — Campo Grande, RJ" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:site_name" content={FIRM_NAME} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO.title} />
        <meta name="twitter:description" content={SEO.description} />
        <meta name="twitter:image" content={`${SEO.url}${SEO.image}`} />
        <meta name="twitter:image:alt" content="Rogéria Oliveira Advogada — Campo Grande, RJ" />

        {/* Performance — preload LCP image */}
        <link rel="preload" as="image" href="/assets/banner.webp" type="image/webp" fetchPriority="high" />

        {/* Sitemap reference */}
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />

        {/* Local Business Schema — LegalService */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LegalService',
              name: FIRM_NAME,
              description: SEO.description,
              url: SEO.url,
              telephone: '+55-21-96940-1414',
              email: FIRM_EMAIL,
              taxID: FIRM_CNPJ,
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'Estrada da Cachamorra, 350 - Bloco 3A, Sala 227',
                addressLocality: 'Campo Grande',
                addressRegion: 'RJ',
                postalCode: '23080-000',
                addressCountry: 'BR',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: -22.8989,
                longitude: -43.5601,
              },
              openingHoursSpecification: [
                {
                  '@type': 'OpeningHoursSpecification',
                  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                  opens: '10:00',
                  closes: '18:00',
                },
              ],
              areaServed: [
                { '@type': 'City', name: 'Campo Grande' },
                { '@type': 'State', name: 'Rio de Janeiro' },
                { '@type': 'Country', name: 'Brasil' },
              ],
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Serviços Jurídicos',
                itemListElement: [
                  { '@type': 'Offer', name: 'Direito dos Professores e Servidor Público' },
                  { '@type': 'Offer', name: 'Direito Previdenciário' },
                  { '@type': 'Offer', name: 'Aposentadoria e Benefícios INSS' },
                  { '@type': 'Offer', name: 'BPC/LOAS' },
                ],
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '5.0',
                reviewCount: '47',
              },
            }),
          }}
        />
      </Head>

      <Layout>
        <Hero />
        <About />
        <Services />
        <Office />
        <Testimonials />
        <HowItWorks />
        <CTASection />
        <Contact />
      </Layout>
    </>
  )
}

export default Home
