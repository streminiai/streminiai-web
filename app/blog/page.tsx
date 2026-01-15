import type { Metadata } from "next"
import { supabase, type BlogPost } from "@/lib/supabase"
import Link from "next/link"
import { Calendar, Clock, Tag } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

export const metadata: Metadata = {
    title: "Blog - Stremini AI",
    description: "Latest news, updates, and insights from the Stremini team about AI security and productivity.",
}

export const dynamic = "force-dynamic"

async function getBlogPosts(): Promise<BlogPost[]> {
    const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching blog posts:", error)
        return []
    }

    return data || []
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

export default async function BlogPage() {
    const posts = await getBlogPosts()

    return (
        <div className="min-h-screen py-16 md:py-24 pb-24 md:pb-24">
            <div className="mx-auto max-w-6xl px-4">
                {/* Header */}
                <ScrollReveal>
                    <div className="text-center mb-16">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Insights, updates, and stories from the Stremini team
                        </p>
                    </div>
                </ScrollReveal>

                {/* Blog posts grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-muted-foreground">No blog posts yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {posts.map((post, idx) => (
                            <ScrollReveal key={post.id} delay={idx * 0.1}>
                                <Link href={`/blog/${post.slug}`} className="group block">
                                    <article className="h-full rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg">
                                        {/* Featured image */}
                                        {post.featured_image_url && (
                                            <div className="aspect-video overflow-hidden">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={post.featured_image_url}
                                                    alt={post.title}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="p-6">
                                            {/* Tags */}
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {post.tags.slice(0, 2).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium"
                                                        >
                                                            <Tag className="w-3 h-3" />
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Title */}
                                            <h2 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                                                {post.title}
                                            </h2>

                                            {/* Excerpt */}
                                            {post.excerpt && (
                                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                                    {post.excerpt}
                                                </p>
                                            )}

                                            {/* Meta */}
                                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(post.published_at || post.created_at)}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    {estimateReadTime(post.content)} min read
                                                </span>
                                            </div>
                                        </div>
                                    </article>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
