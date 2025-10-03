"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Waitlist() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "ok" | "err">("idle")

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")
    try {
      await new Promise((r) => setTimeout(r, 800))
      setStatus("ok")
      setEmail("")
    } catch {
      setStatus("err")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4">
      <h2 className="text-balance text-center text-3xl font-semibold md:text-4xl">Join the Waitlist</h2>
      <p className="mt-2 text-center text-sm text-muted-foreground">Be the first to try Stremini. No spam, ever.</p>
      <form onSubmit={onSubmit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          aria-label="Email address"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="flex-1"
        />
        <Button type="submit" disabled={loading} className="bg-primary text-primary-foreground">
          {loading ? "Joining..." : "Join Waitlist"}
        </Button>
      </form>
      <p className="mt-2 text-center text-xs text-muted-foreground">We respect your privacy. Unsubscribe anytime.</p>
      {status === "ok" && <p className="mt-2 text-center text-sm text-green-600">Thanks! You’re on the list.</p>}
      {status === "err" && (
        <p className="mt-2 text-center text-sm text-red-600">Something went wrong. Please try again.</p>
      )}
    </div>
  )
}
