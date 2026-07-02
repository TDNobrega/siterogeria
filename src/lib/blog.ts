import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

const BLOG_DIR = path.join(process.cwd(), 'content/blog')

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  updatedAt?: string
  keywords: string[]
  coverImage?: string
  author: string
  category: string
  ctaHref: '/professores' | '/'
  published: boolean
}

export interface PostSummary extends PostFrontmatter {
  slug: string
}

export interface Post extends PostSummary {
  mdxSource: MDXRemoteSerializeResult
}

function includeDrafts() {
  return process.env.NODE_ENV !== 'production'
}

export function getAllPosts(): PostSummary[] {
  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.mdx'))

  const posts = files.map((file) => {
    const slug = file.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
    const { data } = matter(raw)
    return { slug, ...(data as PostFrontmatter) }
  })

  return posts
    .filter((p) => includeDrafts() || p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(raw)
  const frontmatter = data as PostFrontmatter

  if (!includeDrafts() && !frontmatter.published) return null

  const mdxSource = await serialize(content, {
    mdxOptions: { remarkPlugins: [remarkGfm] },
  })

  return { slug, ...frontmatter, mdxSource }
}
