"use client"

import { useState } from "react"
import emailjs from '@emailjs/browser'
import { Heart, Trash2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface WishlistItem {
    id: string
    feature: string
    description: string
}

export default function WishlistPage() {
    const [items, setItems] = useState<WishlistItem[]>([])
    const [feature, setFeature] = useState("")
    const [description, setDescription] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "ok" | "err">("idle")

    const addItem = () => {
        if (feature.trim()) {
            const newItem: WishlistItem = {
                id: `${Date.now()}-${Math.random()}`,
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
    }

    const handlePrebook = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim() || items.length === 0) return

        setLoading(true)
        setStatus("idle")

        try {
            await emailjs.send(
                process.env.EMAILJS_SERVICE_ID!,
                process.env.EMAILJS_TEMPLATE_ID!,
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
                process.env.EMAILJS_PUBLIC_KEY
            )

            setStatus("ok")
            setEmail("")
            setItems([])
        } catch (error) {
            console.error("Preorder error:", error)
            setStatus("err")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background pt-20 pb-24">
            <div className="mx-auto max-w-3xl px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="mb-4 flex justify-center">
                        <Heart className="h-12 w-12 text-primary" fill="currentColor" />
                    </div>
                    <h1 className="text-balance text-4xl font-bold md:text-5xl">Feature Wishlist</h1>
                    <p className="mt-2 text-muted-foreground">
                        Tell us what features you&lsquo;d love to see in Stremini AI. Preorder now and get early access!
                    </p>
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                    {/* Add Wishlist Item */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h2 className="mb-4 text-xl font-semibold">Add Feature Request</h2>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="feature" className="block text-sm font-medium">
                                    Feature Name *
                                </label>
                                <Input
                                    id="feature"
                                    placeholder="e.g., Real-time threat detection"
                                    value={feature}
                                    onChange={(e) => setFeature(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium">
                                    Description
                                </label>
                                <Textarea
                                    id="description"
                                    placeholder="Tell us more about this feature..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="mt-1"
                                    rows={3}
                                />
                            </div>
                            <Button
                                onClick={addItem}
                                disabled={!feature.trim()}
                                className="w-full bg-primary text-primary-foreground"
                            >
                                Add to Wishlist
                            </Button>
                        </div>
                    </div>

                    {/* Wishlist Items */}
                    <div className="rounded-lg border border-border bg-card p-6">
                        <h2 className="mb-4 text-xl font-semibold">Your Wishlist ({items.length})</h2>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {items.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No items yet. Add your first feature request!</p>
                            ) : (
                                items.map((item) => (
                                    <div key={item.id} className="flex items-start justify-between gap-3 rounded-md bg-muted p-3">
                                        <div className="flex-1">
                                            <p className="font-medium text-sm">{item.feature}</p>
                                            {item.description && <p className="text-xs text-muted-foreground mt-1">{item.description}</p>}
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-muted-foreground hover:text-destructive transition-colors"
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
                    <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-6">
                        <h2 className="mb-4 text-xl font-semibold">Preorder & Get Early Access</h2>
                        <form onSubmit={handlePrebook} className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">
                                    Email Address *
                                </label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="mt-1"
                                />
                            </div>
                            <Button
                                type="submit"
                                disabled={loading || !email.trim()}
                                className="w-full bg-gradient-to-tr from-primary to-accent text-primary-foreground"
                            >
                                {loading ? (
                                    "Sending..."
                                ) : (
                                    <>
                                        <Send size={16} className="mr-2" />
                                        Preorder Now
                                    </>
                                )}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                We&lsquo;ll notify you when these features are ready and give you early access!
                            </p>
                        </form>

                        {status === "ok" && (
                            <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                ✓ Thanks! We&lsquo;ve received your preorder. Check your email for confirmation.
                            </div>
                        )}
                        {status === "err" && (
                            <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                                ✗ Something went wrong. Please try again.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </main>
    )
}