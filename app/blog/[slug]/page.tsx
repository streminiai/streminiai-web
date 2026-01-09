import type { Metadata } from "next"
import { supabase, type BlogPost } from "@/lib/supabase"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PageProps {
    params: Promise<{ slug: string }>
}

export const dynamic = "force-dynamic"

async function getBlogPost(slug: string): Promise<BlogPost | null> {
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("is_published", true)
        .single()

    if (error || !data) {
        return null
    }

    return data
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const post = await getBlogPost(slug)

    if (!post) {
        return {
            title: "Post Not Found - Stremini AI",
        }
    }

    return {
        title: `${post.title} - Stremini AI Blog`,
        description: post.excerpt || post.title,
        openGraph: {
            title: post.title,
            description: post.excerpt || post.title,
            images: post.featured_image_url ? [post.featured_image_url] : [],
        },
    }
}

function formatDate(dateString: string) {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
}

function estimateReadTime(content: string): number {
    const wordsPerMinute = 200
    const wordCount = content.split(/\s+/).length
    return Math.ceil(wordCount / wordsPerMinute)
}

export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params
    const post = await getBlogPost(slug)

    if (!post) {
        notFound()
    }

    return (
        <div className="min-h-screen py-16 md:py-24">
            <article className="mx-auto max-w-4xl px-4">
                {/* Back button */}
                <Button asChild variant="ghost" className="mb-8">
                    <Link href="/blog" className="flex items-center gap-2">
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </Link>
                </Button>

                {/* Featured image */}
                {post.featured_image_url && (
                    <div className="aspect-video rounded-xl overflow-hidden mb-8">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* Header */}
                <header className="mb-8">
                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                                >
                                    <Tag className="w-3 h-3" />
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

                    {/* Meta */}
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {formatDate(post.published_at || post.created_at)}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {estimateReadTime(post.content)} min read
                        </span>
                        <span>By {post.author}</span>
                    </div>
                </header>

                {/* Content */}
                <div
                    className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-semibold
            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
            prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:py-0.5 prose-code:rounded
            prose-pre:bg-card prose-pre:border prose-pre:border-border
            prose-img:rounded-xl"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* Footer */}
                <footer className="mt-16 pt-8 border-t border-border">
                    <Button asChild>
                        <Link href="/blog">← Back to all posts</Link>
                    </Button>
                </footer>
            </article>
        </div>
    )
}
