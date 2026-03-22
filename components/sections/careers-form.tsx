"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Briefcase, Send, CheckCircle2, AlertCircle } from "lucide-react"

import { submitJobApplication } from "@/app/actions/submit-application"

export function CareersForm({ jobTitle }: { jobTitle?: string }) {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    portfolio: "",
    message: "",
  })

  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus("idle")
    setErrorMessage("")

    try {
      const result = await submitJobApplication({ ...formData, jobTitle })
      
      if (result.success) {
        setStatus("success")
        setFormData({ name: "", email: "", portfolio: "", message: "" })
      } else {
        setStatus("error")
        setErrorMessage(result.error || "Unknown error occurred from server.")
        console.error("Server Action Error:", result.error)
      }
    } catch (error) {
      console.error("Submission error:", error)
      setStatus("error")
      setErrorMessage(error instanceof Error ? error.message : "Unknown error caught in client.")
    } finally {
      setLoading(false)
    }
  }

  if (status === "success") {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-2xl border border-green-500/20 bg-green-500/5 p-8 text-center"
      >
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/20 text-green-500">
          <CheckCircle2 size={24} />
        </div>
        <h3 className="text-xl font-semibold text-white">Application Received!</h3>
        <p className="mt-2 text-muted-foreground">
          Thanks for your interest in joining Stremini. Our team will review your application and get back to you soon.
        </p>
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={() => setStatus("idle")}
        >
          Submit another application
        </Button>
      </motion.div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl md:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
          <Briefcase size={20} />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white">Apply Now</h3>
          <p className="text-sm text-muted-foreground">
            {jobTitle ? `Applying for ${jobTitle}` : "Join our world-class team"}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-slate-300">Full Name</label>
            <Input
              id="name"
              name="name"
              required
              placeholder="John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-white/10 bg-white/5 focus:border-primary/50"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-slate-300">Email Address</label>
            <Input
              id="email"
              name="email"
              required
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border-white/10 bg-white/5 focus:border-primary/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="portfolio" className="text-sm font-medium text-slate-300">Portfolio / LinkedIn / Resume Link</label>
          <Input
            id="portfolio"
            name="portfolio"
            placeholder="https://..."
            value={formData.portfolio}
            onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
            className="border-white/10 bg-white/5 focus:border-primary/50"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-slate-300">Why do you want to join Stremini?</label>
          <Textarea
            id="message"
            name="message"
            required
            placeholder="Tell us about yourself and your experience..."
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="resize-none border-white/10 bg-white/5 focus:border-primary/50"
          />
        </div>

        {status === "error" && (
          <div className="flex items-start gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <div className="flex flex-col">
              <span className="font-semibold">Something went wrong.</span>
              <span className="text-red-400/80">{errorMessage || "Please try again later."}</span>
            </div>
          </div>
        )}

        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-gradient-to-r from-primary to-accent py-6 text-lg font-semibold text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="mr-2 h-5 w-5 border-2 border-white/30 border-t-white rounded-full"
            />
          ) : (
            <Send size={18} className="mr-2" />
          )}
          {loading ? "Submitting..." : "Submit Application"}
        </Button>
      </form>
    </div>
  )
}
