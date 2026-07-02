import Link from 'next/link'
import Image from 'next/image'
import { PostSummary } from '@/lib/blog'

export default function BlogPostCard({ post }: { post: PostSummary }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card block overflow-hidden group">
      {post.coverImage && (
        <div className="relative h-48 w-full">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" />
        </div>
      )}
      <div className="p-6">
        <span className="text-xs font-subtitle font-semibold uppercase tracking-wide text-primary">
          {post.category}
        </span>
        <h2 className="font-title font-bold text-xl text-ink mt-2 mb-2 group-hover:text-primary transition-colors">
          {post.title}
        </h2>
        <p className="font-body text-muted text-sm leading-relaxed line-clamp-3">
          {post.description}
        </p>
      </div>
    </Link>
  )
}
