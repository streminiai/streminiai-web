"use client"

import { Star, Users, ThumbsUp, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

// Initial fallback/default survey data
const defaultStats = {
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
    "Automation of tasks such as sending messages or checking emails",
  ]
}

export function Testimonials() {
  const [stats, setStats] = useState(defaultStats)
  const [topFeedback, setTopFeedback] = useState(defaultStats.topFeedback)

  useEffect(() => {
    async function fetchStats() {
      try {
        const { data, error } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "survey_stats")
          .single()

        if (error) throw error
        if (data?.value) {
          setStats(data.value)
          if (data.value.topFeedback) {
            setTopFeedback(data.value.topFeedback)
          }
        }
      } catch (err) {
        console.error("Error fetching survey stats:", err)
      }
    }

    fetchStats()
  }, [])
  return (
    <div className="mx-auto max-w-6xl px-4">
      <h2 className="text-balance text-center text-3xl font-semibold md:text-4xl">User Feedback</h2>
      <p className="mt-2 text-center text-muted-foreground">Based on real survey responses from early testers</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Average Rating Card */}
        <motion.div
          className="rounded-xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-yellow-500" fill="currentColor" />
            <span className="font-semibold">Average Rating</span>
          </div>
          <div className="text-4xl font-bold text-primary mb-2">{stats.averageRating.toFixed(2)}</div>
          <p className="text-sm text-muted-foreground">out of 5 stars ({stats.totalResponses} responses)</p>

          {/* Rating bars */}
          <div className="mt-4 space-y-2">
            {stats.ratings.map((rating) => (
              <div key={rating.stars} className="flex items-center gap-2 text-sm">
                <span className="w-3">{rating.stars}</span>
                <Star className="w-3 h-3 text-yellow-500" fill="currentColor" />
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-500 rounded-full"
                    style={{ width: `${rating.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-xs text-muted-foreground">{rating.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Daily Use Intent */}
        <motion.div
          className="rounded-xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <span className="font-semibold">Would use daily?</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold text-green-500">{stats.dailyUseIntent.yes}%</div>
            <span className="text-muted-foreground">said Yes</span>
          </div>
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg bg-green-500/20 p-3 text-center">
              <div className="text-lg font-semibold text-green-500">{stats.dailyUseIntent.yes}%</div>
              <div className="text-xs text-muted-foreground">Yes</div>
            </div>
            <div className="flex-1 rounded-lg bg-yellow-500/20 p-3 text-center">
              <div className="text-lg font-semibold text-yellow-500">{stats.dailyUseIntent.maybe}%</div>
              <div className="text-xs text-muted-foreground">Maybe</div>
            </div>
            <div className="flex-1 rounded-lg bg-red-500/20 p-3 text-center">
              <div className="text-lg font-semibold text-red-500">{stats.dailyUseIntent.no}%</div>
              <div className="text-xs text-muted-foreground">No</div>
            </div>
          </div>
        </motion.div>

        {/* On-screen Access Comfort */}
        <motion.div
          className="rounded-xl border border-border bg-card p-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <ThumbsUp className="w-5 h-5 text-primary" />
            <span className="font-semibold">Comfortable with on-screen access?</span>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <div className="text-4xl font-bold text-green-500">{stats.onScreenAccessComfort.yes}%</div>
            <span className="text-muted-foreground">are comfortable</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Users feel safe giving on-screen access when everything stays on-device and only works on their command.
          </p>
        </motion.div>
      </div>

      {/* Top Features Users Love */}
      <motion.div
        className="mt-8 rounded-xl border border-border bg-card p-6"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-5 h-5 text-primary" />
          <span className="font-semibold">Top Features Users Want</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {topFeedback.map((feature, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
            >
              {feature}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
