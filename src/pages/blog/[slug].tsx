import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { MDXRemote } from 'next-mdx-remote'
import Layout from '@/components/Layout'
import SeoHead from '@/components/SeoHead'
import { getAllPosts, getPostBySlug, Post } from '@/lib/blog'
import { WHATSAPP_URL, FIRM_NAME } from '@/lib/constants'

interface Props {
  post: Post
}

const SITE_URL = 'https://rogeriaoliveira.com'

const BlogPost: NextPage<Props> = ({ post }) => {
  const url = `${SITE_URL}/blog/${post.slug}`

  return (
    <>
      <SeoHead
        title={`${post.title} | ${FIRM_NAME}`}
        description={post.description}
        url={url}
        image={post.coverImage}
        keywords={post.keywords.join(', ')}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BlogPosting',
              headline: post.title,
              description: post.description,
              datePublished: post.date,
              dateModified: post.updatedAt || post.date,
              author: { '@type': 'Person', name: post.author },
              publisher: { '@type': 'Organization', name: FIRM_NAME },
              mainEntityOfPage: { '@type': 'WebPage', '@id': url },
              ...(post.coverImage && { image: `${SITE_URL}${post.coverImage}` }),
            }),
          }}
        />
      </SeoHead>

      <Layout>
        <article className="section-padding container-max max-w-3xl mx-auto">
          <h1 className="section-title mb-6">{post.title}</h1>
          <div className="prose prose-blog max-w-none">
            <MDXRemote {...post.mdxSource} />
          </div>

          <div className="mt-16 card p-8 text-center">
            <h2 className="font-title font-bold text-xl mb-3">Precisa de orientação sobre o seu caso?</h2>
            <p className="text-muted mb-6">A análise inicial é gratuita.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
                Falar no WhatsApp
              </a>
              <a href={post.ctaHref} className="btn-outline">
                Saiba mais
              </a>
            </div>
          </div>
        </article>
      </Layout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => ({
  paths: getAllPosts().map((p) => ({ params: { slug: p.slug } })),
  fallback: false,
})

export const getStaticProps: GetStaticProps<Props> = async ({ params }) => {
  const post = await getPostBySlug(params!.slug as string)
  if (!post) return { notFound: true }
  return { props: { post } }
}

export default BlogPost
