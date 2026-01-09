"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AssistantDemo } from "@/components/assistant-demo"
import { motion } from "framer-motion"
import { MagneticWrapper } from "@/components/ui/magnetic-wrapper"

export function Hero() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 md:pt-8">
      <div className="grid items-center gap-8 md:grid-cols-2">
        {/* Left copy */}
        <div>
          <span className="sr-only">Floating AI for Digital Security and Productivity</span>
          <motion.span
            className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden /> 24/7 AI Protection
          </motion.span>
          <motion.h1
            className="mt-6 text-balance text-4xl font-semibold leading-tight md:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Your floating AI for safer, faster work
          </motion.h1>
          <motion.p
            className="text-pretty mt-4 text-base leading-relaxed text-muted-foreground md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Stremini guards your digital life while helping you move faster—real‑time threat prevention, voice
            automation, and an AI keyboard that writes with context.
          </motion.p>
          <motion.div
            className="mt-8 flex flex-wrap items-center gap-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <MagneticWrapper strength={0.2}>
              <Button asChild className="bg-gradient-to-tr from-primary to-accent text-primary-foreground">
                <Link href="/wishlist">Join Waitlist</Link>
              </Button>
            </MagneticWrapper>
            <MagneticWrapper strength={0.2}>
              <Button asChild variant="outline">
                <Link href="#features">Explore Features</Link>
              </Button>
            </MagneticWrapper>
          </motion.div>
          <motion.div
            className="mt-8 grid grid-cols-2 gap-3 text-sm text-muted-foreground md:grid-cols-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {[
              { label: "Launching Soon", sublabel: "Status" },
              { label: "24/7 Available", sublabel: "AI Chatbot" },
              { label: "Fully Safe", sublabel: "Security" },
              { label: "24/7 Available", sublabel: "Digital Protection" },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                className="rounded-md border border-border p-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + idx * 0.1 }}
              >
                <span className="block text-foreground font-medium">{item.label}</span>
                <span className="text-xs">{item.sublabel}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
        {/* Right demo */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div
            className="absolute -top-12 -right-6 h-40 w-40 rounded-full opacity-60 blur-2xl"
            aria-hidden
            style={{ background: "radial-gradient(circle at 30% 30%, var(--color-primary) 0%, transparent 60%)" }}
          />
          <AssistantDemo />
        </motion.div>
      </div>
    </div>
  )
}
