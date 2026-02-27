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
    Settings,
    Star,
    Upload,
    Shield,
} from "lucide-react"
import { supabase, WaitlistEntry, TeamMember, categoryLabels, BlogPost, SiteSetting, SurveyStats, UserRole, getUserRole, getAllUserRoles, updateUserRole, UserRoleView } from "@/lib/supabase"
import { inviteUser } from "./actions"
import { BlogEditor } from "@/components/blog-editor"
import { AIBackendTester } from "@/components/ai-backend-tester"

type Tab = "waitlist" | "team" | "blog" | "ai-backend" | "settings" | "permissions"
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

        // Check if the URL is the placeholder
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (!supabaseUrl || supabaseUrl.includes('placeholder.supabase.co')) {
            setError("Configuration Error: NEXT_PUBLIC_SUPABASE_URL is missing or invalid. Please check your environment variables.")
            setLoading(false)
            return
        }

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                // If it's a fetch error, it might be an adblocker or completely invalid URL
                if (error.message.includes("Failed to fetch")) {
                    throw new Error("Network Error: Could not connect to Supabase. This may be caused by an invalid Supabase URL or an aggressive adblocker.")
                }
                throw error
            }
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
function StatsCards({ entries, teamMembers, blogCount }: { entries: WaitlistEntry[]; teamMembers: TeamMember[]; blogCount: number }) {
    // Count unique team members by name to avoid double counting people in multiple categories
    const uniqueTeamCount = new Set(teamMembers.map(m => m.name)).size

    const stats = {
        total: entries.length,
        pending: entries.filter((e) => e.status === "pending").length,
        approved: entries.filter((e) => e.status === "approved").length,
        team: uniqueTeamCount,
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
        instagram_url: member?.instagram_url || "",
        display_order: member?.display_order || 0,
    })
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const handleImageUpload = async (file: File) => {
        try {
            setUploading(true)
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
            const filePath = `team/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('team-pictures')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('team-pictures')
                .getPublicUrl(filePath)

            setFormData({ ...formData, image_url: publicUrl })
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleImageUpload(e.dataTransfer.files[0])
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleImageUpload(e.target.files[0])
        }
    }

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
                        <label className="block text-sm text-slate-400 mb-2">Profile Picture</label>
                        <div
                            className={`relative border-2 border-dashed rounded-xl p-4 transition-colors ${dragActive ? "border-purple-500 bg-purple-500/10" : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                                }`}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}
                        >
                            {formData.image_url ? (
                                <div className="relative group aspect-square w-32 mx-auto">
                                    <Image
                                        src={formData.image_url}
                                        alt="Preview"
                                        width={128}
                                        height={128}
                                        className="rounded-xl object-cover w-full h-full"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setFormData({ ...formData, image_url: "" })}
                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-4">
                                    <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-3">
                                        {uploading ? (
                                            <RefreshCw className="w-6 h-6 text-purple-400 animate-spin" />
                                        ) : (
                                            <Upload className="w-6 h-6 text-slate-400" />
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-400 mb-1">
                                        <span className="text-purple-400 font-medium">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-slate-500">PNG, JPG or WebP (max. 2MB)</p>
                                </div>
                            )}
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                accept="image/*"
                                disabled={uploading}
                            />
                        </div>
                        <div className="mt-2">
                            <label className="block text-xs text-slate-500 mb-1">Or enter Photo URL</label>
                            <input
                                type="url"
                                value={formData.image_url}
                                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-purple-500"
                                placeholder="https://..."
                            />
                        </div>
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
                        <div>
                            <label className="block text-sm text-slate-400 mb-2">Instagram URL</label>
                            <input
                                type="url"
                                value={formData.instagram_url}
                                onChange={(e) => setFormData({ ...formData, instagram_url: e.target.value })}
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
    const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([])
    const [savingSettings, setSavingSettings] = useState(false)
    const [userRoles, setUserRoles] = useState<UserRole[] | null>(null)
    const [allUserRoles, setAllUserRoles] = useState<UserRoleView[]>([])
    const [updatingRole, setUpdatingRole] = useState<string | null>(null)
    const [showAddUserModal, setShowAddUserModal] = useState(false)
    const [newUserEmail, setNewUserEmail] = useState("")
    const [newUserRoles, setNewUserRoles] = useState<UserRole[]>([])

    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (session?.user) {
                const roles = await getUserRole()
                setUserRoles(roles)

                // Set initial tab based on role
                if (roles?.includes('superadmin')) setActiveTab('waitlist')
                else if (roles?.includes('blog_editor')) setActiveTab('blog')
                else if (roles?.includes('team_editor')) setActiveTab('team')
                else if (roles?.includes('waitlist_viewer')) setActiveTab('waitlist')

                // Fetch all roles if superadmin
                if (roles?.includes('superadmin')) {
                    const allRoles = await getAllUserRoles()
                    setAllUserRoles(allRoles)
                }
            }

            const [waitlistRes, teamRes, blogRes, settingsRes] = await Promise.all([
                supabase.from("waitlist").select("*").order("created_at", { ascending: false }),
                supabase.from("team_members").select("*").order("display_order", { ascending: true }),
                supabase.from("blog_posts").select("*").order("created_at", { ascending: false }),
                supabase.from("site_settings").select("*"),
            ])

            if (waitlistRes.data) setEntries(waitlistRes.data)
            if (teamRes.data) setTeamMembers(teamRes.data)
            if (blogRes.data) setBlogPosts(blogRes.data)
            if (settingsRes.data) setSiteSettings(settingsRes.data)
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

    const saveSurveyStats = async (stats: Record<string, unknown>) => {
        setSavingSettings(true)
        try {
            const { error } = await supabase
                .from("site_settings")
                .upsert({ key: "survey_stats", value: stats, updated_at: new Date().toISOString() }, { onConflict: "key" })

            if (error) throw error

            // Update local state
            setSiteSettings(prev => {
                const existing = prev.find(s => s.key === "survey_stats")
                if (existing) {
                    return prev.map(s => s.key === "survey_stats" ? { ...s, value: stats } : s)
                }
                return [...prev, { key: "survey_stats", value: stats } as SiteSetting]
            })

            alert("Survey stats saved successfully!")
        } catch (error) {
            console.error("Error saving survey stats:", error)
            alert("Failed to save survey stats")
        } finally {
            setSavingSettings(false)
        }
    }

    const handleRoleToggle = async (userId: string, role: UserRole, currentRoles: UserRole[]) => {
        setUpdatingRole(userId)
        const newRoles = currentRoles.includes(role)
            ? currentRoles.filter(r => r !== role)
            : [...currentRoles, role]

        const success = await updateUserRole(userId, newRoles)
        if (success) {
            setAllUserRoles(prev => prev.map(u => u.user_id === userId ? { ...u, roles: newRoles } : u))
        } else {
            alert("Failed to update roles")
        }
        setUpdatingRole(null)
    }

    const handleAddUser = async () => {
        if (!newUserEmail || newUserRoles.length === 0) {
            alert("Please provide an email and at least one role")
            return
        }

        try {
            setLoading(true)
            const result = await inviteUser(newUserEmail, newUserRoles)

            if (result.success) {
                alert(result.message || "User added successfully!")
                setShowAddUserModal(false)
                setNewUserEmail("")
                setNewUserRoles([])
                fetchData()
            } else {
                throw new Error(result.error || "Failed to add user")
            }
        } catch (error: unknown) {
            console.error("Error adding user:", error)
            const message = error instanceof Error ? error.message : "Failed to add user. Ensure the user exists in Supabase Auth."
            alert(message)
        } finally {
            setLoading(false)
        }
    }

    const surveyStats = useMemo(() => {
        const setting = siteSettings.find(s => s.key === "survey_stats")
        return (setting?.value as unknown as SurveyStats) || {
            averageRating: 3.91,
            totalResponses: 35,
            ratings: [
                { stars: 5, count: 10, percentage: 28.6 },
                { stars: 4, count: 12, percentage: 34.3 },
                { stars: 3, count: 13, percentage: 37.1 },
                { stars: 2, count: 0, percentage: 0 },
                { stars: 1, count: 0, percentage: 0 },
            ],
            dailyUseIntent: { yes: 75, no: 0, maybe: 25 },
            onScreenAccessComfort: { yes: 87.5, no: 0, maybe: 12.5 },
            topFeedback: [
                "Floating features",
                "Reminders and to do list",
                "It working as a digital bodyguard",
                "The on screen chatbot and AI keyboard",
                "Voice control",
                "Automation of tasks such as sending messages or checking emails"
            ]
        }
    }, [siteSettings])

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
                <StatsCards entries={entries} teamMembers={teamMembers} blogCount={blogPosts.length} />

                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    {(userRoles?.includes('superadmin') || userRoles?.includes('waitlist_viewer')) && (
                        <button
                            onClick={() => setActiveTab("waitlist")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "waitlist" ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                }`}
                        >
                            <Mail className="w-4 h-4 inline mr-2" />
                            Waitlist
                        </button>
                    )}
                    {(userRoles?.includes('superadmin') || userRoles?.includes('team_editor')) && (
                        <button
                            onClick={() => setActiveTab("team")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "team" ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                }`}
                        >
                            <Users className="w-4 h-4 inline mr-2" />
                            Team
                        </button>
                    )}
                    {(userRoles?.includes('superadmin') || userRoles?.includes('blog_editor')) && (
                        <button
                            onClick={() => setActiveTab("blog")}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "blog" ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                }`}
                        >
                            <BookOpen className="w-4 h-4 inline mr-2" />
                            Blog
                        </button>
                    )}
                    {userRoles?.includes('superadmin') && (
                        <>
                            <button
                                onClick={() => setActiveTab("ai-backend")}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "ai-backend" ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                    }`}
                            >
                                <Zap className="w-4 h-4 inline mr-2" />
                                AI Backend
                            </button>
                            <button
                                onClick={() => setActiveTab("settings")}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "settings" ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                    }`}
                            >
                                <Settings className="w-4 h-4 inline mr-2" />
                                Settings
                            </button>
                            <button
                                onClick={() => setActiveTab("permissions")}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "permissions" ? "bg-purple-500 text-white" : "bg-slate-800 text-slate-400 hover:bg-slate-700"
                                    }`}
                            >
                                <Shield className="w-4 h-4 inline mr-2" />
                                Permissions
                            </button>
                        </>
                    )}
                    {!loading && (userRoles === null || userRoles?.length === 0) && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-lg border border-red-500/20 text-sm">
                            <Shield className="w-4 h-4" />
                            No role assigned to {userRoles === null ? "this user" : "this account"}. Please contact a superadmin.
                        </div>
                    )}
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
                                                            {(userRoles?.includes('superadmin') || userRoles?.includes('waitlist_viewer')) && (
                                                                <>
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
                                                                </>
                                                            )}
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
                            {(userRoles?.includes('superadmin') || userRoles?.includes('team_editor')) && (
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
                            )}
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
                                                {userRoles?.includes('superadmin') && (
                                                    <>
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
                                                    </>
                                                )}
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

                                {(userRoles?.includes('superadmin') || userRoles?.includes('blog_editor')) && (
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
                                )}
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
                                                            {(userRoles?.includes('superadmin') || userRoles?.includes('blog_editor')) && (
                                                                <>
                                                                    <button
                                                                        onClick={async () => {
                                                                            const newStatus = !post.is_published
                                                                            await supabase
                                                                                .from("blog_posts")
                                                                                .update({
                                                                                    is_published: newStatus,
                                                                                    published_at: newStatus ? new Date().toISOString() : post.published_at
                                                                                })
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
                                                                </>
                                                            )}
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

                {/* AI Backend Tab */}
                {activeTab === "ai-backend" && (
                    <AIBackendTester />
                )}

                {/* Permissions Tab */}
                {activeTab === "permissions" && userRoles?.includes('superadmin') && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Shield className="w-5 h-5 text-purple-500" />
                                    User Permissions Management
                                </h2>
                                <p className="text-slate-400 text-sm mt-1">Manage user roles and access levels</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowAddUserModal(true)}
                                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add User
                                </button>
                                <button
                                    onClick={fetchData}
                                    className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 border border-slate-800"
                                    title="Refresh"
                                >
                                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                                </button>
                            </div>
                        </div>

                        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-800 bg-slate-800/50">
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">User Email</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Assigned Roles</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allUserRoles.map((user) => (
                                            <tr key={user.user_id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                                                            <Mail className="w-4 h-4 text-purple-400" />
                                                        </div>
                                                        <span className="font-medium text-slate-200">{user.email}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {user.roles && user.roles.length > 0 ? (
                                                            user.roles.map(role => (
                                                                <span key={role} className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${role === 'superadmin' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                                                                    role === 'blog_editor' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                                                        role === 'team_editor' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                                                                            'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                                    }`}>
                                                                    {role.replace('_', ' ')}
                                                                </span>
                                                            ))
                                                        ) : (
                                                            <span className="text-slate-500 text-xs italic">No roles assigned</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-wrap gap-2">
                                                        {(['superadmin', 'blog_editor', 'team_editor', 'waitlist_viewer'] as UserRole[]).map(role => (
                                                            <button
                                                                key={role}
                                                                disabled={updatingRole === user.user_id}
                                                                onClick={() => handleRoleToggle(user.user_id, role, user.roles || [])}
                                                                className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all ${user.roles?.includes(role)
                                                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/20'
                                                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                                                    } disabled:opacity-50`}
                                                            >
                                                                {role.split('_')[0]}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
                {/* Settings Tab */}
                {activeTab === "settings" && (
                    <div className="space-y-8">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Star className="w-5 h-5 text-yellow-500" />
                                Survey Management
                            </h2>

                            <form onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                const stats = {
                                    averageRating: parseFloat(formData.get("averageRating") as string),
                                    totalResponses: parseInt(formData.get("totalResponses") as string),
                                    ratings: [
                                        { stars: 5, count: parseInt(formData.get("stars5") as string), percentage: 0 },
                                        { stars: 4, count: parseInt(formData.get("stars4") as string), percentage: 0 },
                                        { stars: 3, count: parseInt(formData.get("stars3") as string), percentage: 0 },
                                        { stars: 2, count: parseInt(formData.get("stars2") as string), percentage: 0 },
                                        { stars: 1, count: parseInt(formData.get("stars1") as string), percentage: 0 },
                                    ],
                                    dailyUseIntent: {
                                        yes: parseInt(formData.get("dailyYes") as string),
                                        maybe: parseInt(formData.get("dailyMaybe") as string),
                                        no: parseInt(formData.get("dailyNo") as string),
                                    },
                                    onScreenAccessComfort: {
                                        yes: parseFloat(formData.get("comfortYes") as string),
                                        maybe: parseFloat(formData.get("comfortMaybe") as string),
                                        no: parseFloat(formData.get("comfortNo") as string),
                                    },
                                    topFeedback: (formData.get("topFeedback") as string).split(",").map(s => s.trim()).filter(Boolean)
                                }

                                // Calculate percentages
                                const totalRatings = stats.ratings.reduce((acc, r) => acc + r.count, 0)
                                stats.ratings = stats.ratings.map(r => ({
                                    ...r,
                                    percentage: totalRatings > 0 ? parseFloat(((r.count / totalRatings) * 100).toFixed(1)) : 0
                                }))

                                saveSurveyStats(stats)
                            }} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Average Rating</label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            name="averageRating"
                                            defaultValue={surveyStats.averageRating}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-slate-400 mb-2">Total Responses</label>
                                        <input
                                            type="number"
                                            name="totalResponses"
                                            defaultValue={surveyStats.totalResponses}
                                            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-slate-300">Star Counts</h3>
                                    <div className="grid grid-cols-5 gap-4">
                                        {[5, 4, 3, 2, 1].map(stars => (
                                            <div key={stars}>
                                                <label className="block text-xs text-slate-500 mb-1">{stars} Stars</label>
                                                <input
                                                    type="number"
                                                    name={`stars${stars}`}
                                                    defaultValue={surveyStats.ratings.find((r: { stars: number; count: number }) => r.stars === stars)?.count || 0}
                                                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-slate-300">Daily Use Intent (%)</h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Yes</label>
                                                <input type="number" name="dailyYes" defaultValue={surveyStats.dailyUseIntent.yes} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Maybe</label>
                                                <input type="number" name="dailyMaybe" defaultValue={surveyStats.dailyUseIntent.maybe} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">No</label>
                                                <input type="number" name="dailyNo" defaultValue={surveyStats.dailyUseIntent.no} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <h3 className="text-sm font-semibold text-slate-300">On-screen Access Comfort (%)</h3>
                                        <div className="grid grid-cols-3 gap-3">
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Yes</label>
                                                <input type="number" step="0.1" name="comfortYes" defaultValue={surveyStats.onScreenAccessComfort.yes} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">Maybe</label>
                                                <input type="number" step="0.1" name="comfortMaybe" defaultValue={surveyStats.onScreenAccessComfort.maybe} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                                            </div>
                                            <div>
                                                <label className="block text-xs text-slate-500 mb-1">No</label>
                                                <input type="number" step="0.1" name="comfortNo" defaultValue={surveyStats.onScreenAccessComfort.no} className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-purple-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-slate-400 mb-2">Top Feedback Tags (comma-separated)</label>
                                    <textarea
                                        name="topFeedback"
                                        defaultValue={surveyStats.topFeedback.join(", ")}
                                        rows={3}
                                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 resize-none"
                                        placeholder="Tag 1, Tag 2, Tag 3..."
                                    />
                                </div>

                                <div className="flex justify-end">
                                    <motion.button
                                        type="submit"
                                        disabled={savingSettings}
                                        className="px-8 py-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl text-white font-medium disabled:opacity-50"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {savingSettings ? "Saving..." : "Save Changes"}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
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

            {/* Add User Modal */}
            <AnimatePresence>
                {showAddUserModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <UserPlus className="w-5 h-5 text-purple-500" />
                                    Add New User
                                </h3>
                                <button
                                    onClick={() => setShowAddUserModal(false)}
                                    className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">User Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                                        <input
                                            type="email"
                                            value={newUserEmail}
                                            onChange={(e) => setNewUserEmail(e.target.value)}
                                            placeholder="user@example.com"
                                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-purple-500 transition-colors"
                                        />
                                    </div>
                                    <p className="text-[10px] text-slate-500 mt-2">The user must already have an account in Supabase Auth.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-3">Assign Roles</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {(['superadmin', 'blog_editor', 'team_editor', 'waitlist_viewer'] as UserRole[]).map(role => (
                                            <button
                                                key={role}
                                                onClick={() => {
                                                    setNewUserRoles(prev =>
                                                        prev.includes(role)
                                                            ? prev.filter(r => r !== role)
                                                            : [...prev, role]
                                                    )
                                                }}
                                                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition-all ${newUserRoles.includes(role)
                                                    ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                                                    : 'bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700'
                                                    }`}
                                            >
                                                <div className={`w-4 h-4 rounded flex items-center justify-center border ${newUserRoles.includes(role) ? 'bg-purple-500 border-purple-500' : 'border-slate-700'}`}>
                                                    {newUserRoles.includes(role) && <Check className="w-3 h-3 text-white" />}
                                                </div>
                                                {role.replace('_', ' ')}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-800/30 border-t border-slate-800 flex gap-3">
                                <button
                                    onClick={() => setShowAddUserModal(false)}
                                    className="flex-1 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddUser}
                                    disabled={loading || !newUserEmail || newUserRoles.length === 0}
                                    className="flex-1 px-4 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                    Add User
                                </button>
                            </div>
                        </motion.div>
                    </div>
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
