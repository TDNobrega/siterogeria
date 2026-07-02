import type { GetStaticProps, NextPage } from 'next'
import Layout from '@/components/Layout'
import SeoHead from '@/components/SeoHead'
import BlogPostCard from '@/components/BlogPostCard'
import { getAllPosts, PostSummary } from '@/lib/blog'

interface Props {
  posts: PostSummary[]
}

const BlogIndex: NextPage<Props> = ({ posts }) => (
  <>
    <SeoHead
      title="Blog | Rogéria Oliveira Advogada — Direito Previdenciário e do Servidor"
      description="Artigos sobre direitos de professores estaduais do RJ, aposentadoria, BPC/LOAS e direito previdenciário."
      url="https://rogeriaoliveira.com/blog"
    />
    <Layout>
      <section className="section-padding container-max">
        <span className="eyebrow">Blog</span>
        <h1 className="section-title mb-4">Artigos e orientações jurídicas</h1>
        <p className="section-subtitle mb-12">
          Conteúdo escrito pela equipe da Dra. Rogéria Oliveira sobre direitos
          previdenciários e do servidor público.
        </p>

        {posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogPostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="font-body text-muted">Nenhum artigo publicado ainda.</p>
        )}
      </section>
    </Layout>
  </>
)

export const getStaticProps: GetStaticProps<Props> = async () => ({
  props: { posts: getAllPosts() },
})

export default BlogIndex
