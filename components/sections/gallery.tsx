"use client"

import { motion } from "framer-motion"
import { Images } from "lucide-react"
import { FocusCards } from "@/components/ui/focus-cards"

const galleryItems = [
  { title: "Scam Detection Demo", src: "/gallery-1.jpg" },
  { title: "Chatbot", src: "/gallery-2.jpg" },
  { title: "AI Keyboard", src: "/gallery-3.jpg" },
  { title: "Smart Automation", src: "/gallery-4.jpg" },
]

export function Gallery() {
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
          <Images className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">Gallery</span>
        </div>
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          Stremini in{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Action
          </span>
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          A glimpse of what Stremini can do. Hover over images to explore.
        </p>
      </motion.div>

      {/* Focus Cards */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <FocusCards cards={galleryItems} />
      </motion.div>
    </div>
  )
}
