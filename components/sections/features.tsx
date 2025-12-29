"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"
import FeaturesSectionDemo from "@/components/ui/features-section-demo-2"

export function Features() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Header */}
      <motion.div
        className="mb-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Features</span>
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Powered by{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Advanced AI
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Built for security and productivity—seamlessly floating over your apps when you need it.
        </p>
      </motion.div>

      {/* Enhanced Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <FeaturesSectionDemo />
      </motion.div>
    </div>
  )
}
