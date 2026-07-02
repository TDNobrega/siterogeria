import Head from 'next/head'
import { ReactNode } from 'react'

interface SeoHeadProps {
  title: string
  description: string
  url: string
  image?: string
  keywords?: string
  children?: ReactNode
}

export default function SeoHead({ title, description, url, image, keywords, children }: SeoHeadProps) {
  const ogImage = image ? `https://rogeriaoliveira.com${image}` : 'https://rogeriaoliveira.com/assets/banner.jpg'

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="language" content="pt-BR" />
      <link rel="canonical" href={url} />

      <meta property="og:type" content="article" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:locale" content="pt_BR" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {children}
    </Head>
  )
}
