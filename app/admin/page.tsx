"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
    Users,
    Check,
    X,
    Download,
    Search,
    RefreshCw,
    LogOut,
    Filter,
    Clock,
    CheckCircle,
    Mail,
    Trash2,
    Plus,
    Edit,
    UserPlus,
    Briefcase,
    Zap,
    Megaphone,
    BookOpen,
    Eye,
    EyeOff,
} from "lucide-react"
import { supabase, WaitlistEntry, TeamMember, categoryLabels, BlogPost } from "@/lib/supabase"
import { BlogEditor } from "@/components/blog-editor"

type Tab = "waitlist" | "team" | "blog"
type FilterStatus = "all" | "pending" | "approved" | "removed"

// Login component
function AdminLogin({ onLogin }: { onLogin: () => void }) {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) throw error
            onLogin()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">
            <motion.div
                className="bg-slate-900 border border-slate-800 rounded-2xl p-8 w-full max-w-md"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
                        Admin Login
                    </h1>
                    <p className="text-slate-400 text-sm">Sign in to manage Stremini</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            placeholder="admin@stremini.site"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm"
                        >
                            {error}
                        </motion.div>
                    )}

                    <motion.button
                        type="submit"
                        className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 rounded-xl font-medium"
                        disabled={loading}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </motion.button>
                </form>
            </motion.div>
        </div>
    )
}

// Stats cards
function StatsCards({ entries, teamCount, blogCount }: { entries: WaitlistEntry[]; teamCount: number; blogCount: number }) {
    const stats = {
        total: entries.length,
        pending: entries.filter((e) => e.status === "pending").length,
        approved: entries.filter((e) => e.status === "approved").length,
        team: teamCount,
        blog: blogCount,
    }

    const cards = [
        { label: "Total Signups", value: stats.total, icon: Users, color: "purple" },
        { label: "Pending", value: stats.pending, icon: Clock, color: "yellow" },
        { label: "Approved", value: stats.approved, icon: CheckCircle, color: "green" },
        { label: "Team Members", value: stats.team, icon: UserPlus, color: "blue" },
        { label: "Blog Posts", value: stats.blog, icon: BookOpen, color: "purple" },
    ]

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {cards.map((card, index) => (
                <motion.div
                    key={card.label}
                    className="bg-slate-900 border border-slate-800 rounded-xl p-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-${card.color}-500/20 flex items-center justify-center`}>
                            <card.icon className={`w-5 h-5 text-${card.color}-400`} />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{card.value}</p>
                            <p className="text-xs text-slate-400">{card.label}</p>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    )
}

// Team Member Modal
function TeamMemberModal({
    member,
    onClose,
    onSave,
}: {
    member: TeamMember | null
    onClose: () => void
    onSave: (_data: Partial<TeamMember>) => void
}) {
    const [formData, setFormData] = useState({
        name: member?.name || "",
        role: member?.role || "",
        category: member?.category || "developer",
        image_url: member?.image_url || "",
        linkedin_url: member?.linkedin_url || "",
        twitter_url: member?.twitter_url || "",
        display_order: member?.display_order || 0,
    })
    const [saving, setSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        await onSave(formData)
        setSaving(false)
    }

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <motion.div
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg relative z-10 max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-6">
                    {member ? "Edit Team Member" : "Add Team Member"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Role</label>
                        <input
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            placeholder="e.g. Lead Developer"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Category *</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as TeamMember["category"] })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        >
                            {Object.entries(categoryLabels).map(([key, label]) => (
                                <option key={key} value={key}>
                                    {label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Photo URL</label>
                        <input
                            type="url"
                            value={formData.image_url}
                            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">LinkedIn URL</label>
                            <input
                                type="url"
                                value={formData.linkedin_url}
                                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Twitter URL</label>
                            <input
                                type="url"
                                value={formData.twitter_url}
                                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Display Order</label>
                        <input
                            type="number"
                            value={formData.display_order}
                            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium disabled:opacity-50"
                        >
                            {saving ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}

// Blog Post Modal
function BlogPostModal({
    post,
    onClose,
    onSave,
}: {
    post: BlogPost | null
    onClose: () => void
    onSave: (_data: Partial<BlogPost>) => void
}) {
    const [formData, setFormData] = useState({
        title: post?.title || "",
        slug: post?.slug || "",
        excerpt: post?.excerpt || "",
        content: post?.content || "",
        author: post?.author || "Stremini Team",
        featured_image_url: post?.featured_image_url || "",
        tags: post?.tags?.join(", ") || "",
        is_published: post?.is_published || false,
    })
    const [saving, setSaving] = useState(false)

    // Auto-generate slug from title
    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
    }

    const handleTitleChange = (title: string) => {
        setFormData({
            ...formData,
            title,
            slug: post ? formData.slug : generateSlug(title),
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)
        await onSave({
            ...formData,
            tags: formData.tags.split(",").map((t) => t.trim()).filter(Boolean),
            published_at: formData.is_published ? new Date().toISOString() : null,
        })
        setSaving(false)
    }

    return (
        <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="absolute inset-0 bg-black/60" onClick={onClose} />
            <motion.div
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-3xl relative z-10 max-h-[90vh] overflow-y-auto"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-6">
                    {post ? "Edit Blog Post" : "Create Blog Post"}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Title *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                            required
                            placeholder="Your blog post title"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Slug (URL)</label>
                        <div className="flex items-center gap-2">
                            <span className="text-slate-500">/blog/</span>
                            <input
                                type="text"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                placeholder="url-friendly-slug"
                            />
                        </div>
                    </div>

                    {/* Excerpt */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Excerpt (Short Summary)</label>
                        <textarea
                            value={formData.excerpt}
                            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
                            rows={2}
                            placeholder="Brief summary for blog cards..."
                        />
                    </div>

                    {/* Content Editor */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Content *</label>
                        <BlogEditor
                            value={formData.content}
                            onChange={(content) => setFormData({ ...formData, content })}
                            placeholder="Write your blog content here using Markdown..."
                        />
                    </div>

                    {/* Tags and Image URL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Tags (comma-separated)</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                placeholder="AI, Security, News"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Featured Image URL</label>
                            <input
                                type="url"
                                value={formData.featured_image_url}
                                onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                placeholder="https://..."
                            />
                        </div>
                    </div>

                    {/* Author */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-2">Author</label>
                        <input
                            type="text"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Publish Toggle */}
                    <div className="flex items-center gap-3 p-4 bg-slate-800 rounded-xl">
                        <input
                            type="checkbox"
                            id="publish-toggle"
                            checked={formData.is_published}
                            onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                            className="w-5 h-5 rounded bg-slate-700 border-slate-600 text-purple-500 focus:ring-purple-500"
                        />
                        <label htmlFor="publish-toggle" className="text-white">
                            Publish immediately
                        </label>
                        <span className="text-xs text-slate-400 ml-auto">
                            {formData.is_published ? "Will be visible to public" : "Saved as draft"}
                        </span>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-3 px-4 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium disabled:opacity-50"
                        >
                            {saving ? "Saving..." : post ? "Update Post" : "Create Post"}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    )
}

// Main Dashboard
function Dashboard() {
    const [activeTab, setActiveTab] = useState<Tab>("waitlist")
    const [entries, setEntries] = useState<WaitlistEntry[]>([])
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
    const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null)
    const [showMemberModal, setShowMemberModal] = useState(false)
    const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
    const [showPostModal, setShowPostModal] = useState(false)

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [waitlistRes, teamRes, blogRes] = await Promise.all([
                supabase.from("waitlist").select("*").order("created_at", { ascending: false }),
                supabase.from("team_members").select("*").order("display_order", { ascending: true }),
                supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
            ])

            if (waitlistRes.data) setEntries(waitlistRes.data)
            if (teamRes.data) setTeamMembers(teamRes.data)
            if (blogRes.data) setBlogPosts(blogRes.data)
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    const updateWaitlistStatus = async (id: string, status: "pending" | "approved" | "removed") => {
        const updateData: { status: string; approved_at?: string | null } = { status }
        if (status === "approved") {
            updateData.approved_at = new Date().toISOString()
        } else {
            updateData.approved_at = null
        }

        const { error } = await supabase.from("waitlist").update(updateData).eq("id", id)
        if (!error) {
            setEntries((prev) => prev.map((e) => (e.id === id ? ({ ...e, ...updateData } as WaitlistEntry) : e)))
        }
    }

    const deleteWaitlistEntry = async (id: string) => {
        if (!confirm("Delete this entry permanently?")) return
        const { error } = await supabase.from("waitlist").delete().eq("id", id)
        if (!error) setEntries((prev) => prev.filter((e) => e.id !== id))
    }

    const saveTeamMember = async (data: Partial<TeamMember>) => {
        if (selectedMember) {
            const { error } = await supabase
                .from("team_members")
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq("id", selectedMember.id)
            if (!error) {
                setTeamMembers((prev) => prev.map((m) => (m.id === selectedMember.id ? { ...m, ...data } as TeamMember : m)))
            }
        } else {
            const { data: newMember, error } = await supabase
                .from("team_members")
                .insert([{ ...data, is_active: true }])
                .select()
                .single()
            if (!error && newMember) {
                setTeamMembers((prev) => [...prev, newMember])
            }
        }
        setShowMemberModal(false)
        setSelectedMember(null)
    }

    const deleteTeamMember = async (id: string) => {
        if (!confirm("Delete this team member?")) return
        const { error } = await supabase.from("team_members").delete().eq("id", id)
        if (!error) setTeamMembers((prev) => prev.filter((m) => m.id !== id))
    }

    const saveBlogPost = async (data: Partial<BlogPost>) => {
        if (selectedPost) {
            // Update existing post
            const { error } = await supabase
                .from("blog_posts")
                .update({ ...data, updated_at: new Date().toISOString() })
                .eq("id", selectedPost.id)
            if (!error) {
                setBlogPosts((prev) => prev.map((p) => (p.id === selectedPost.id ? { ...p, ...data } as BlogPost : p)))
            }
        } else {
            // Create new post
            const { data: newPost, error } = await supabase
                .from("blog_posts")
                .insert([data])
                .select()
                .single()
            if (!error && newPost) {
                setBlogPosts((prev) => [newPost, ...prev])
            }
        }
        setShowPostModal(false)
        setSelectedPost(null)
    }

    const exportCSV = () => {
        const headers = ["Email", "Name", "Status", "Source", "Created At"]
        const rows = filteredEntries.map((e) => [e.email, e.name || "", e.status, e.source, new Date(e.created_at).toISOString()])
        const csv = [headers, ...rows].map((row) => row.join(",")).join("\n")
        const blob = new Blob([csv], { type: "text/csv" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `waitlist-${new Date().toISOString().split("T")[0]}.csv`
        a.click()
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        window.location.reload()
    }

    const filteredEntries = useMemo(() => {
        return entries
            .filter((e) => filterStatus === "all" || e.status === filterStatus)
            .filter((e) => e.email.toLowerCase().includes(searchQuery.toLowerCase()) || (e.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()))
    }, [entries, filterStatus, searchQuery])

    const filteredBlogPosts = useMemo(() => {
        return blogPosts.filter((post) => {
            const matchesSearch =
                post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (post.excerpt?.toLowerCase() || "").includes(searchQuery.toLowerCase())
            const matchesStatus =
                filterStatus === "all" ||
                (filterStatus === "approved" && post.is_published) ||
                (filterStatus === "pending" && !post.is_published)
            return matchesSearch && matchesStatus
        })
    }, [blogPosts, filterStatus, searchQuery])

    const categoryIcons: Record<string, React.ElementType> = {
        founder: Briefcase,
        "co-founder": Users,
        developer: Zap,
        marketing: Megaphone,
        research: Briefcase,
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Header */}
            <header className="border-b border-slate-800 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                            Stremini Admin
                        </h1>
                        <p className="text-sm text-slate-400">Manage waitlist and team</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                <StatsCards entries={entries} teamCount={teamMembers.length} blogCount={blogPosts.length} />

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab("waitlist")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "waitlist" ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            }`}
                    >
                        <Mail className="w-4 h-4 inline mr-2" />
                        Waitlist
                    </button>
                    <button
                        onClick={() => setActiveTab("team")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "team" ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            }`}
                    >
                        <Users className="w-4 h-4 inline mr-2" />
                        Team
                    </button>
                    <button
                        onClick={() => setActiveTab("blog")}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "blog" ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                            }`}
                    >
                        <BookOpen className="w-4 h-4 inline mr-2" />
                        Blog
                    </button>
                </div>

                {/* Waitlist Tab */}
                {activeTab === "waitlist" && (
                    <>
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search by email or name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <div className="flex gap-3">
                                <div className="relative">
                                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                                        className="bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-8 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="pending">Pending</option>
                                        <option value="approved">Approved</option>
                                        <option value="removed">Removed</option>
                                    </select>
                                </div>

                                <button onClick={fetchData} className="p-3 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800" disabled={loading}>
                                    <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                                </button>

                                <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl hover:bg-slate-800">
                                    <Download className="w-4 h-4" />
                                    <span className="hidden md:inline">Export</span>
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-800">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Name</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-12">
                                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                                                </td>
                                            </tr>
                                        ) : filteredEntries.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center py-12 text-slate-400">
                                                    No entries found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredEntries.map((entry) => (
                                                <tr key={entry.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="w-4 h-4 text-slate-400" />
                                                            <span className="font-medium">{entry.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-400">{entry.name || "-"}</td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${entry.status === "approved"
                                                                ? "bg-green-500/20 text-green-400"
                                                                : entry.status === "pending"
                                                                    ? "bg-yellow-500/20 text-yellow-400"
                                                                    : "bg-red-500/20 text-red-400"
                                                                }`}
                                                        >
                                                            {entry.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-400 text-sm">{new Date(entry.created_at).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1">
                                                            {entry.status !== "approved" && (
                                                                <button onClick={() => updateWaitlistStatus(entry.id, "approved")} className="p-2 rounded-lg hover:bg-slate-700 text-green-400" title="Approve">
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {entry.status !== "removed" && (
                                                                <button onClick={() => updateWaitlistStatus(entry.id, "removed")} className="p-2 rounded-lg hover:bg-slate-700 text-red-400" title="Remove">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button onClick={() => deleteWaitlistEntry(entry.id)} className="p-2 rounded-lg hover:bg-slate-700 text-slate-400" title="Delete">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Team Tab */}
                {activeTab === "team" && (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-semibold">Team Members</h2>
                            <button
                                onClick={() => {
                                    setSelectedMember(null)
                                    setShowMemberModal(true)
                                }}
                                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium"
                            >
                                <Plus className="w-4 h-4" />
                                Add Member
                            </button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {teamMembers.map((member) => {
                                const Icon = categoryIcons[member.category] || Users
                                return (
                                    <motion.div
                                        key={member.id}
                                        className="bg-slate-900 border border-slate-800 rounded-xl p-4"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                {member.image_url ? (
                                                    <Image src={member.image_url} alt={member.name} width={48} height={48} className="w-12 h-12 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
                                                        <span className="text-sm font-bold text-purple-400">
                                                            {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                                                        </span>
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold text-white">{member.name}</p>
                                                    <p className="text-sm text-slate-400">{member.role}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => {
                                                        setSelectedMember(member)
                                                        setShowMemberModal(true)
                                                    }}
                                                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => deleteTeamMember(member.id)} className="p-2 rounded-lg hover:bg-slate-800 text-red-400">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Icon className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs text-slate-400">{categoryLabels[member.category]}</span>
                                            {!member.is_active && <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded">Inactive</span>}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* Blog Tab */}
                {activeTab === "blog" && (
                    <>
                        <div className="flex flex-col md:flex-row gap-4 mb-6">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search posts by title or excerpt..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                />
                            </div>

                            <div className="flex gap-3">
                                <div className="relative">
                                    <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                                        className="bg-slate-900 border border-slate-800 rounded-xl pl-11 pr-8 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-purple-500"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="approved">Published</option>
                                        <option value="pending">Drafts</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedPost(null)
                                        setShowPostModal(true)
                                    }}
                                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium"
                                >
                                    <Plus className="w-4 h-4" />
                                    New Post
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-800">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Title</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Date</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loading ? (
                                            <tr>
                                                <td colSpan={4} className="text-center py-12">
                                                    <RefreshCw className="w-6 h-6 animate-spin mx-auto text-slate-400" />
                                                </td>
                                            </tr>
                                        ) : filteredBlogPosts.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center py-12 text-slate-400">
                                                    No blog posts found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredBlogPosts.map((post) => (
                                                <tr key={post.id} className="border-b border-slate-800/50 hover:bg-slate-800/50">
                                                    <td className="px-6 py-4">
                                                        <div>
                                                            <p className="font-medium text-white">{post.title}</p>
                                                            {post.excerpt && (
                                                                <p className="text-xs text-slate-400 line-clamp-1">{post.excerpt}</p>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-semibold ${post.is_published
                                                                ? "bg-green-500/20 text-green-400"
                                                                : "bg-yellow-500/20 text-yellow-400"
                                                                }`}
                                                        >
                                                            {post.is_published ? "Published" : "Draft"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-400 text-sm">
                                                        {new Date(post.created_at).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1">
                                                            <button
                                                                onClick={async () => {
                                                                    await supabase
                                                                        .from("blog_posts")
                                                                        .update({ is_published: !post.is_published })
                                                                        .eq("id", post.id)
                                                                    fetchData()
                                                                }}
                                                                className="p-2 rounded-lg hover:bg-slate-700 text-slate-400"
                                                                title={post.is_published ? "Unpublish" : "Publish"}
                                                            >
                                                                {post.is_published ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedPost(post)
                                                                    setShowPostModal(true)
                                                                }}
                                                                className="p-2 rounded-lg hover:bg-slate-700 text-blue-400"
                                                                title="Edit"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={async () => {
                                                                    if (!confirm("Delete this post permanently?")) return
                                                                    await supabase.from("blog_posts").delete().eq("id", post.id)
                                                                    fetchData()
                                                                }}
                                                                className="p-2 rounded-lg hover:bg-slate-700 text-red-400"
                                                                title="Delete"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                            <Link
                                                                href={`/blog/${post.slug}`}
                                                                target="_blank"
                                                                className="p-2 rounded-lg hover:bg-slate-700 text-purple-400"
                                                                title="View Live"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Team Member Modal */}
            <AnimatePresence>
                {showMemberModal && (
                    <TeamMemberModal
                        member={selectedMember}
                        onClose={() => {
                            setShowMemberModal(false)
                            setSelectedMember(null)
                        }}
                        onSave={saveTeamMember}
                    />
                )}
            </AnimatePresence>

            {/* Blog Post Modal */}
            <AnimatePresence>
                {showPostModal && (
                    <BlogPostModal
                        post={selectedPost}
                        onClose={() => {
                            setShowPostModal(false)
                            setSelectedPost(null)
                        }}
                        onSave={saveBlogPost}
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

// Main admin page
export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

    useEffect(() => {
        const checkAuth = async () => {
            const {
                data: { session },
            } = await supabase.auth.getSession()
            setIsAuthenticated(!!session)
        }

        checkAuth()

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_, session) => {
            setIsAuthenticated(!!session)
        })

        return () => subscription.unsubscribe()
    }, [])

    if (isAuthenticated === null) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <RefreshCw className="w-8 h-8 animate-spin text-purple-400" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return <AdminLogin onLogin={() => setIsAuthenticated(true)} />
    }

    return <Dashboard />
}
