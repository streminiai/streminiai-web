"use client"

import { useState, useEffect } from "react"
import emailjs from '@emailjs/browser'
import { Heart, Trash2, Send, CheckCircle2, XCircle, Sparkles, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface WishlistItem {
    id: string
    feature: string
    description: string
}

const PRESET_FEATURES = [
    { id: "smart-auto-tasker", name: "Smart Auto Tasker", description: "Automate your daily tasks intelligently" },
    { id: "talk-assist", name: "Talk Assist", description: "Voice-powered AI assistant" },
    { id: "core-ai", name: "Core AI", description: "Advanced AI processing engine" },
    { id: "emotional-tone", name: "Emotional Tone Sense", description: "Detect and respond to emotional context" },
    { id: "smart-protection", name: "Smart Protection", description: "Advanced security and privacy features" },
    { id: "ai-keyboard", name: "AI Keyboard", description: "Intelligent typing assistance" },
]

export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([])
    const [selectedPresets, setSelectedPresets] = useState<Set<string>>(new Set())
    const [feature, setFeature] = useState("")
    const [description, setDescription] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "ok" | "err">("idle")
    const [showSuccess, setShowSuccess] = useState(false)

    useEffect(() => {
        emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!)
    }, [])

    const togglePreset = (presetId: string) => {
        const preset = PRESET_FEATURES.find(f => f.id === presetId)
        if (!preset) return

        const newSelected = new Set(selectedPresets)
        
        if (newSelected.has(presetId)) {
            newSelected.delete(presetId)
            setItems(items.filter(item => item.id !== presetId))
        } else {
            newSelected.add(presetId)
            const newItem: WishlistItem = {
                id: presetId,
                feature: preset.name,
                description: preset.description,
            }
            setItems([...items, newItem])
        }
        
        setSelectedPresets(newSelected)
    }

    const addCustomItem = () => {
        if (feature.trim()) {
            const newItem: WishlistItem = {
                id: `custom-${Date.now()}-${Math.random()}`,
                feature: feature.trim(),
                description: description.trim(),
            }
            setItems([...items, newItem])
            setFeature("")
            setDescription("")
        }
    }

    const removeItem = (id: string) => {
        setItems(items.filter((item) => item.id !== id))
        if (selectedPresets.has(id)) {
            const newSelected = new Set(selectedPresets)
            newSelected.delete(id)
            setSelectedPresets(newSelected)
        }
    }

    const handlePrebook = async () => {
        if (!email.trim() || items.length === 0) return

        setLoading(true)
        setStatus("idle")
        setShowSuccess(false)

        try {
            await emailjs.send(
                process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
                process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
                {
                    to_email: email,
                    user_email: email,
                    name: email,
                    time: new Date().toLocaleString(),
                    message: `I'm interested in these features for Stremini AI:\n\n${items
                        .map((item) => `• ${item.feature}${item.description ? ": " + item.description : ""}`)
                        .join("\n")}`,
                    wishlist_items: items
                        .map((item) => `${item.feature}${item.description ? ": " + item.description : ""}`)
                        .join("\n"),
                },
                process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
            )

            setStatus("ok")
            setShowSuccess(true)
            setTimeout(() => {
                setEmail("")
                setItems([])
                setSelectedPresets(new Set())
                setShowSuccess(false)
            }, 3000)
        } catch (error) {
            console.error("Preorder error:", error)
            setStatus("err")
        } finally {
            setLoading(false)
        }
    }

    const totalItems = items.length

    return (
        <main className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 pt-20 pb-24">
            {/* Success Overlay */}
            {showSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-card border border-green-500/50 rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-in zoom-in duration-300">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="rounded-full bg-green-500/20 p-4">
                                <CheckCircle2 className="h-16 w-16 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold">Preorder Successful! 🎉</h3>
                            <p className="text-muted-foreground">
                                We've received your feature requests. Check your email for confirmation and early access details!
                            </p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Sparkles className="h-4 w-4 text-primary" />
                                <span>You'll be among the first to try these features</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto max-w-5xl px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <div className="mb-4 flex justify-center">
                        <div className="rounded-full bg-primary/10 p-4">
                            <Heart className="h-12 w-12 text-primary" fill="currentColor" />
                        </div>
                    </div>
                    <h1 className="text-balance text-4xl font-bold md:text-5xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                        Feature Wishlist
                    </h1>
                    <p className="mt-3 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Choose the features you'd love to see in Stremini AI. Preorder now and get early access!
                    </p>
                </div>

                {/* Preset Features */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                        <Sparkles className="h-6 w-6 text-primary" />
                        Popular Features
                    </h2>
                    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                        {PRESET_FEATURES.map((preset) => (
                            <button
                                key={preset.id}
                                onClick={() => togglePreset(preset.id)}
                                className={`relative text-left rounded-xl border-2 p-4 transition-all duration-200 hover:shadow-lg ${
                                    selectedPresets.has(preset.id)
                                        ? "border-primary bg-primary/5 shadow-md"
                                        : "border-border bg-card hover:border-primary/50"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`mt-0.5 flex-shrink-0 rounded-md border-2 w-5 h-5 flex items-center justify-center transition-all ${
                                        selectedPresets.has(preset.id)
                                            ? "border-primary bg-primary"
                                            : "border-muted-foreground/30"
                                    }`}>
                                        {selectedPresets.has(preset.id) && (
                                            <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-sm">{preset.name}</p>
                                        <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Add Custom Feature */}
                    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
                        <h2 className="mb-4 text-xl font-semibold">Request Custom Feature</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="feature" className="block text-sm font-medium mb-1">
                                    Feature Name *
                                </label>
                                <Input
                                    id="feature"
                                    placeholder="e.g., Real-time threat detection"
                                    value={feature}
                                    onChange={(e) => setFeature(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium mb-1">
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    placeholder="Tell us more about this feature..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="bg-background"
                                    rows={3}
                                />
                            </div>
                            <Button
                                onClick={addCustomItem}
                                disabled={!feature.trim()}
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                            >
                                Add Custom Feature
                            </Button>
                        </div>
                    </div>

                    {/* Selected Items */}
                    <div className="rounded-xl border border-border bg-card/50 backdrop-blur-sm p-6 shadow-lg">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold">Your Selection</h2>
                            <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                                {totalItems} {totalItems === 1 ? "item" : "items"}
                            </span>
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                            {items.length === 0 ? (
                                <div className="text-center py-8">
                                    <div className="rounded-full bg-muted w-16 h-16 flex items-center justify-center mx-auto mb-3">
                                        <Heart className="h-8 w-8 text-muted-foreground" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        No features selected yet. Choose from the list above or add your own!
                                    </p>
                                </div>
                            ) : (
                                items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start justify-between gap-3 rounded-lg bg-muted/50 p-3 border border-border/50 hover:border-primary/30 transition-colors"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm">{item.feature}</p>
                                            {item.description && (
                                                <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Preorder Form */}
                {items.length > 0 && (
                    <div className="mt-8 rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-purple-500/5 to-primary/5 p-8 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="rounded-full bg-primary/10 p-2">
                                <Sparkles className="h-6 w-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-semibold">Preorder & Get Early Access</h2>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email Address *
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="bg-background"
                                />
                            </div>
                            
                            <Button
                                onClick={handlePrebook}
                                disabled={loading || !email.trim()}
                                className="w-full bg-gradient-to-r from-primary via-purple-600 to-primary text-primary-foreground font-semibold h-12 text-base hover:shadow-lg transition-all"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                        Sending...
                                    </span>
                                ) : (
                                    <>
                                        <Send size={18} className="mr-2" />
                                        Preorder Now - Get Early Access
                                    </>
                                )}
                            </Button>
                            
                            <p className="text-xs text-center text-muted-foreground">
                                🎁 We'll notify you when these features are ready and give you exclusive early access!
                            </p>
                        </div>

                        {status === "err" && (
                            <div className="mt-4 rounded-lg border border-red-500/50 bg-red-50 p-4 text-sm dark:bg-red-900/20 animate-in slide-in-from-top duration-300">
                                <div className="flex items-start gap-3">
                                    <XCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-red-900 dark:text-red-200">
                                            Oops! Something went wrong
                                        </p>
                                        <p className="text-red-700 dark:text-red-400 mt-1">
                                            Please check your connection and try again.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}