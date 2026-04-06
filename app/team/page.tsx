"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, Zap, Megaphone, Briefcase, X, Save, LogIn, MapPin, ExternalLink, Plus, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { FaLinkedin, FaTwitter, FaInstagram, FaGlobe } from "react-icons/fa"
import { categoryLabels, type TeamMember } from "@/lib/supabase"
import { cn } from "@/lib/utils"

// ── Color Presets ──
const COLORS: Record<string, string> = {
  blue:   "linear-gradient(135deg,#0071e3,#34aadc)",
  purple: "linear-gradient(135deg,#bf5af2,#9b59b6)",
  orange: "linear-gradient(135deg,#ff9f0a,#ff6b35)",
  green:  "linear-gradient(135deg,#34c759,#30a14e)",
  red:    "linear-gradient(135deg,#ff3b30,#c0392b)",
  teal:   "linear-gradient(135deg,#5ac8fa,#0097a7)",
}

const COLOR_CLASSES: Record<string, string> = {
  blue:   "from-blue-500 to-cyan-400",
  purple: "from-purple-500 to-violet-400",
  orange: "from-orange-500 to-amber-400",
  green:  "from-green-500 to-emerald-400",
  red:    "from-red-500 to-rose-400",
  teal:   "from-cyan-500 to-teal-400",
}

const categoryIcons: Record<string, React.ElementType> = {
  founder: Briefcase,
  "co-founder": Users,
  developer: Zap,
  marketing: Megaphone,
  research: Briefcase,
}

// ── Avatar Component ──
function MemberAvatar({ member, size = "lg" }: { member: TeamMember; size?: "sm" | "md" | "lg" | "xl" }) {
  const sizeMap = { sm: "h-10 w-10 text-sm", md: "h-14 w-14 text-lg", lg: "h-20 w-20 text-2xl", xl: "h-24 w-24 text-3xl" }
  const initials = member.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
  const colorClass = COLOR_CLASSES[member.color_key ?? "blue"] ?? COLOR_CLASSES.blue

  return (
    <div className={cn("relative rounded-full flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg", sizeMap[size])}>
      {member.avatar_url || member.image_url ? (
        <Image
          src={member.avatar_url || member.image_url || ""}
          alt={member.name}
          fill
          className="object-cover"
        />
      ) : (
        <div className={cn("w-full h-full flex items-center justify-center bg-gradient-to-br font-bold text-white", colorClass)}>
          {initials}
        </div>
      )}
    </div>
  )
}

// ── Founder Spotlight ──
function FounderSpotlight({ member }: { member: TeamMember }) {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden border border-white/10 dark:bg-neutral-900/70 bg-white shadow-2xl"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />

      <div className="grid md:grid-cols-2 gap-0">
        {/* Left — Identity */}
        <div className="p-10 md:p-14 flex flex-col justify-center relative z-10 border-r border-white/5">
          <div className="relative mb-6 w-fit">
            <MemberAvatar member={member} size="xl" />
            <motion.div
              className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full border-[3px] border-white dark:border-neutral-900 bg-green-500"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>

          <span className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold bg-primary/10 text-primary w-fit mb-4">
            {member.role || "Founder"}
          </span>

          <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-3">
            {member.name}
          </h3>

          <p className="text-muted-foreground text-sm leading-relaxed max-w-sm mb-6">
            {member.bio || "Leading the vision and strategy."}
          </p>

          <div className="flex gap-2">
            {member.twitter_url && (
              <a href={member.twitter_url.startsWith("http") ? member.twitter_url : `https://twitter.com/${member.twitter_url}`} target="_blank" rel="noopener noreferrer"
                aria-label={`${member.name} on Twitter`}
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <FaTwitter className="h-4 w-4" />
              </a>
            )}
            {member.linkedin_url && (
              <a href={member.linkedin_url} target="_blank" rel="noopener noreferrer"
                aria-label={`${member.name} on LinkedIn`}
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <FaLinkedin className="h-4 w-4" />
              </a>
            )}
            {member.website_url && (
              <a href={member.website_url} target="_blank" rel="noopener noreferrer"
                aria-label={`${member.name} website`}
                className="p-2.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all">
                <FaGlobe className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Right — Details */}
        <div className="p-10 md:p-14 flex flex-col justify-center gap-0 dark:bg-neutral-800/30 bg-neutral-50/50">
          {[
            { label: "Role", value: member.role, sub: "Full-time · Since 2026" },
            { label: "Focus", value: null, sub: (member.skills ?? []).join(" · ") || "—" },
            member.location ? { label: "Location", value: null, sub: member.location } : null,
            { label: "Status", value: "__status__" },
          ].filter(Boolean).map((item, i) => (
            <div key={i} className={cn("py-5", i < 2 && "border-b border-white/10 dark:border-neutral-700/50")}>
              <div className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5">{item!.label}</div>
              {item!.value === "__status__" ? (
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_6px_rgba(52,199,89,.5)]" />
                  <span className="text-sm font-medium text-foreground">Open to collaboration</span>
                </div>
              ) : (
                <>
                  {item!.value && <div className="text-base font-medium text-foreground">{item!.value}</div>}
                  {item!.sub && <div className="text-sm text-muted-foreground">{item!.sub}</div>}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// ── Enhanced Team Card ──
function EnhancedTeamCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl border border-white/10 dark:bg-neutral-900/70 bg-white p-6 shadow-md hover:shadow-xl transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.3 }}
    >
      {/* Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(4)].map((_, i) => (
          <motion.span key={i}
            className="absolute h-1 w-1 rounded-full bg-purple-400/30"
            style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.5, 1] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() }}
          />
        ))}
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500 pointer-events-none" />

      <div className="relative z-10">
        <MemberAvatar member={member} size="lg" />

        <span className="inline-block mt-4 mb-1 text-xs font-semibold text-primary">{member.role || "Team Member"}</span>
        <h3 className="text-xl font-bold tracking-tight text-foreground mb-2 group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
          {member.name}
        </h3>

        {member.bio && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-3 line-clamp-3">{member.bio}</p>
        )}

        {member.location && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
            <MapPin className="h-3 w-3" /> {member.location}
          </div>
        )}

        {/* Skills */}
        {(member.skills ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {(member.skills ?? []).map((s, i) => (
              <span key={i} className="px-2.5 py-0.5 text-[10px] font-semibold rounded-full bg-neutral-100 dark:bg-neutral-800 text-muted-foreground">{s}</span>
            ))}
          </div>
        )}

        {/* Social Links */}
        <div className="flex gap-2">
          {member.twitter_url && (
            <motion.a href={member.twitter_url.startsWith("http") ? member.twitter_url : `https://twitter.com/${member.twitter_url}`} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-muted-foreground hover:bg-blue-500/20 hover:text-blue-500 transition-colors"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <FaTwitter className="h-3.5 w-3.5" />
            </motion.a>
          )}
          {member.linkedin_url && (
            <motion.a href={member.linkedin_url} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-muted-foreground hover:bg-purple-500/20 hover:text-purple-500 transition-colors"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <FaLinkedin className="h-3.5 w-3.5" />
            </motion.a>
          )}
          {member.instagram_url && (
            <motion.a href={member.instagram_url} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-muted-foreground hover:bg-pink-500/20 hover:text-pink-500 transition-colors"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <FaInstagram className="h-3.5 w-3.5" />
            </motion.a>
          )}
          {member.website_url && (
            <motion.a href={member.website_url} target="_blank" rel="noopener noreferrer"
              className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-muted-foreground hover:bg-teal-500/20 hover:text-teal-500 transition-colors"
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <FaGlobe className="h-3.5 w-3.5" />
            </motion.a>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </motion.div>
  )
}

// ── Login Modal ──
function LoginModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: (_member: TeamMember, _pw: string) => void }) {
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function doLogin() {
    if (!email || !pass) return
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/team", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || "Incorrect email or password."); setLoading(false); return }
      onSuccess(data, pass)
    } catch {
      setError("Network error. Try again.")
    }
    setLoading(false)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-center justify-center p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 pb-0">
            <h3 className="text-lg font-bold tracking-tight">Staff Login</h3>
            <button onClick={onClose} aria-label="Close login" className="h-8 w-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <p className="text-sm text-muted-foreground">Sign in to edit your team profile.</p>

            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5">Email</label>
              <div className="relative">
                <input type="email" placeholder="e.g. founder@stremini.com" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all" />
                <Megaphone className="absolute left-3.5 top-3.5 h-5 w-5 text-muted-foreground" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5">Password</label>
              <input type="password" value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
              />
              {error && <p className="text-xs text-red-500 mt-1.5">{error}</p>}
            </div>

            <button onClick={doLogin} disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : <><LogIn className="h-4 w-4" /> Sign In</>}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ── Edit Panel ──
function EditPanel({ member, authPassword, onClose, onSaved }: {
  member: TeamMember; authPassword: string; onClose: () => void; onSaved: (_updated: TeamMember) => void
}) {
  const [name, setName] = useState(member.name)
  const [bio, setBio] = useState(member.bio ?? "")
  const [location, setLocation] = useState(member.location ?? "")
  const [twitterUrl, setTwitterUrl] = useState(member.twitter_url ?? "")
  const [linkedinUrl, setLinkedinUrl] = useState(member.linkedin_url ?? "")
  const [websiteUrl, setWebsiteUrl] = useState(member.website_url ?? "")
  const [instagramUrl, setInstagramUrl] = useState(member.instagram_url ?? "")
  const [skills, setSkills] = useState<string[]>([...(member.skills ?? [])])
  const [colorKey, setColorKey] = useState(member.color_key ?? "blue")
  const [tagInput, setTagInput] = useState("")
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState("")

  function addTag() {
    const t = tagInput.trim()
    if (t && !skills.includes(t)) setSkills([...skills, t])
    setTagInput("")
  }

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`/api/team/${member.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: member.email,
          password: authPassword,
          updates: {
            name, bio, location,
            twitter_url: twitterUrl, linkedin_url: linkedinUrl,
            website_url: websiteUrl, instagram_url: instagramUrl,
            skills, color_key: colorKey, color: COLORS[colorKey],
          },
        }),
      })
      const data = await res.json()
      if (!res.ok) { setToast("Error: " + data.error); setSaving(false); return }
      onSaved(data)
      setToast("Profile saved ✓")
      setTimeout(() => setToast(""), 3000)
    } catch { setToast("Network error.") }
    setSaving(false)
  }

  return (
    <motion.div
      className="fixed inset-0 bg-background z-[3000] overflow-y-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Top bar */}
      <div className="sticky top-0 z-10 h-14 bg-background/85 backdrop-blur-xl border-b border-border flex items-center justify-between px-4 md:px-6">
        <span className="text-sm font-semibold">Edit Your Profile</span>
        <div className="flex gap-2">
          <button onClick={save} disabled={saving}
            className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center gap-1.5">
            {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Save className="h-3 w-3" />}
            {saving ? "Saving..." : "Save"}
          </button>
          <button onClick={onClose} className="px-4 py-1.5 bg-neutral-800 text-white rounded-full text-xs font-semibold hover:bg-neutral-700 transition-colors">
            Done
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 pb-24 space-y-4">

        {/* Profile preview */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 md:p-8 border border-white/10 flex items-center gap-6 flex-wrap">
          <div className={cn("h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 bg-gradient-to-br", COLOR_CLASSES[colorKey] ?? COLOR_CLASSES.blue)}>
            {(name || "?")[0]?.toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight mb-1">{name || "Your Name"}</h3>
            <p className="text-sm text-muted-foreground mb-3">{member.role || "Role"}</p>
            <div className="flex gap-1.5 flex-wrap">
              {Object.keys(COLORS).map((k) => (
                <button key={k} onClick={() => setColorKey(k)}
                  className={cn("px-3 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5",
                    k === colorKey ? "border-primary text-primary bg-primary/5" : "border-neutral-200 dark:border-neutral-700 text-muted-foreground")}>
                  <span className={cn("h-2 w-2 rounded-full bg-gradient-to-br", COLOR_CLASSES[k])} />
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <EditSection title="Basic Info">
          <EditField label="Display Name" value={name} onChange={setName} placeholder="Your name" />
          <EditField label="Bio" value={bio} onChange={setBio} placeholder="Short bio..." textarea />
          <EditField label="Location" value={location} onChange={setLocation} placeholder="e.g. Sialkot, Pakistan" />
        </EditSection>

        {/* Skills */}
        <EditSection title="Skills & Tags">
          <div className="flex flex-wrap gap-1.5 mb-3">
            {skills.map((t, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-medium text-muted-foreground">
                {t}
                <button onClick={() => setSkills(skills.filter((_, j) => j !== i))} className="text-muted-foreground/60 hover:text-red-400 transition-colors">×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTag()}
              placeholder="Add a skill..."
              className="flex-1 px-3 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-transparent text-sm outline-none focus:ring-2 focus:ring-primary/30" />
            <button onClick={addTag} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
        </EditSection>

        {/* Social */}
        <EditSection title="Social Links">
          <EditField label="Twitter / X" value={twitterUrl} onChange={setTwitterUrl} placeholder="https://twitter.com/..." />
          <EditField label="LinkedIn URL" value={linkedinUrl} onChange={setLinkedinUrl} placeholder="https://linkedin.com/in/..." />
          <EditField label="Instagram URL" value={instagramUrl} onChange={setInstagramUrl} placeholder="https://instagram.com/..." />
          <EditField label="Website URL" value={websiteUrl} onChange={setWebsiteUrl} placeholder="https://yoursite.com" />
        </EditSection>

        <button onClick={save} disabled={saving}
          className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Profile</>}
        </button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-6 py-3 rounded-full text-sm font-medium shadow-2xl z-[9999]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ── Edit Helpers ──
function EditSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-white/10">
      <div className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-5 pb-3 border-b border-neutral-100 dark:border-neutral-800">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function EditField({ label, value, onChange, placeholder, textarea }: {
  label: string; value: string; onChange: (_v: string) => void; placeholder?: string; textarea?: boolean
}) {
  const cls = "w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-foreground focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none transition-all text-sm"
  return (
    <div>
      <label className="block text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-1.5">{label}</label>
      {textarea
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cn(cls, "min-h-[90px] resize-y")} />
        : <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      }
    </div>
  )
}

// ── MAIN PAGE ──
export default function TeamPage() {
  const [team, setTeam] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [showLogin, setShowLogin] = useState(false)
  const [authMember, setAuthMember] = useState<TeamMember | null>(null)
  const [authPw, setAuthPw] = useState("")
  const [showEdit, setShowEdit] = useState(false)
  const searchParams = useSearchParams()

  // Auto-open login modal if ?staff=login
  useEffect(() => {
    if (searchParams.get("staff") === "login") {
      setShowLogin(true)
    }
  }, [searchParams])

  useEffect(() => {
    fetch("/api/team")
      .then(r => r.json())
      .then(data => { setTeam(Array.isArray(data) ? data : []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  function handleLoginSuccess(member: TeamMember, pw: string) {
    setAuthMember(member)
    setAuthPw(pw)
    setShowLogin(false)
    setShowEdit(true)
  }

  function handleSaved(updated: TeamMember) {
    setTeam(prev => prev.map(m => m.id === updated.id ? updated : m))
    setAuthMember(updated)
  }

  const founder = team.find(m => m.is_founder)
  const others = team.filter(m => !m.is_founder)

  // Group by category
  const grouped = others.reduce((acc, m) => {
    const cat = m.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(m)
    return acc
  }, {} as Record<string, TeamMember[]>)

  const categories: TeamMember["category"][] = ["co-founder", "developer", "marketing", "research"]

  return (
    <div className="min-h-screen bg-background pt-20 pb-24">
      <div className="mx-auto max-w-6xl px-4">

        {/* Hero */}
        <motion.div className="mb-16 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Team</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Meet the People Behind{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Stremini</span>
          </h1>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Talented individuals working together to build the future of AI assistance.
          </p>
          <div className="flex gap-2 justify-center flex-wrap mt-6">
            {[
              { dot: true, text: "Actively building" },
              { text: loading ? "— members" : `${team.length} members` },
              { text: "Global team" },
            ].map((p, i) => (
              <div key={i} className="px-4 py-2 rounded-full border border-border bg-neutral-50 dark:bg-neutral-900 text-xs font-medium text-muted-foreground flex items-center gap-2">
                {p.dot && <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_4px_rgba(52,199,89,.6)]" />}
                {p.text}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {!loading && (
          <div className="space-y-20">

            {/* Founder Spotlight */}
            {founder && (
              <section>
                <div className="mb-8">
                  <span className="text-xs font-semibold text-primary tracking-wider uppercase">Leadership</span>
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mt-2">Founder</h2>
                  <p className="text-muted-foreground mt-2 max-w-md">The visionary who started it all.</p>
                </div>
                <FounderSpotlight member={founder} />
              </section>
            )}

            {/* Category Sections */}
            {categories.map((cat, sectionIndex) => {
              const members = grouped[cat]
              if (!members || members.length === 0) return null
              const Icon = categoryIcons[cat] ?? Briefcase
              return (
                <motion.section key={cat} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: sectionIndex * 0.1, duration: 0.5 }}>
                  <div className="mb-8 flex items-center gap-4">
                    <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-3 shadow-lg shadow-primary/25">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">{categoryLabels[cat] ?? cat}</h2>
                      <p className="text-sm text-muted-foreground">{members.length} members</p>
                    </div>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {members.map(m => <EnhancedTeamCard key={m.id} member={m} />)}
                  </div>
                </motion.section>
              )
            })}

            {/* CTA */}
            <motion.div
              className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8 md:p-12 text-center relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(15)].map((_, i) => (
                  <motion.div key={i}
                    className="absolute h-1 w-1 rounded-full bg-primary/30"
                    style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%` }}
                    animate={{ opacity: [0.3, 0.8, 0.3], scale: [1, 1.5, 1] }}
                    transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
                  />
                ))}
              </div>
              <div className="mx-auto max-w-2xl relative z-10">
                <h3 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">Join Our Growing Team</h3>
                <p className="mb-8 text-muted-foreground">We&apos;re always looking for talented individuals to help us build the future of AI assistance</p>
                <div className="flex gap-3 justify-center flex-wrap">
                  <Link href="/waitlist"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:-translate-y-0.5">
                    Get in Touch
                  </Link>
                  <Link href="/careers"
                    className="inline-flex items-center gap-2 rounded-xl border border-primary px-8 py-3 font-medium text-primary transition-all hover:bg-primary/5 hover:-translate-y-0.5">
                    <ExternalLink className="h-4 w-4" /> View Careers
                  </Link>
                </div>
              </div>
            </motion.div>

          </div>
        )}
      </div>

      {/* Login Modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onSuccess={handleLoginSuccess} />}

      {/* Edit Panel */}
      {showEdit && authMember && (
        <EditPanel member={authMember} authPassword={authPw} onClose={() => setShowEdit(false)} onSaved={handleSaved} />
      )}
    </div>
  )
}
