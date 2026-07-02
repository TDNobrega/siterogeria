import type { GetServerSideProps } from 'next'
import { getAllPosts } from '@/lib/blog'

const SITE = 'https://rogeriaoliveira.com'

const STATIC_PAGES: Array<{ path: string; changefreq: string; priority: string; lastmod?: string }> = [
  { path: '/', changefreq: 'monthly', priority: '1.0', lastmod: '2026-06-25' },
  { path: '/professores', changefreq: 'weekly', priority: '0.9', lastmod: '2026-06-25' },
  { path: '/blog', changefreq: 'weekly', priority: '0.7' },
  { path: '/privacidade', changefreq: 'yearly', priority: '0.2', lastmod: '2026-03-26' },
]

function buildXml(): string {
  const posts = getAllPosts()

  const staticEntries = STATIC_PAGES.map(
    (p) =>
      `<url><loc>${SITE}${p.path}</loc><lastmod>${p.lastmod ?? new Date().toISOString().slice(0, 10)}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`
  )

  const postEntries = posts.map(
    (p) =>
      `<url><loc>${SITE}/blog/${p.slug}</loc><lastmod>${p.updatedAt || p.date}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`
  )

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${[...staticEntries, ...postEntries].join('')}</urlset>`
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader('Content-Type', 'application/xml')
  res.write(buildXml())
  res.end()
  return { props: {} }
}

export default function Sitemap() {
  return null
}
