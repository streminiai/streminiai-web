import { Star, ShieldCheck } from "lucide-react"

const reviews = [
  {
    name: "Ava Chen",
    role: "Security Analyst",
    text: "The scam detection saved our team multiple times. Stremini is a must-have.",
  },
  { name: "Liam Patel", role: "Founder", text: "Floating UI that pops in when I need it—magic for focus and speed." },
  { name: "Noah Smith", role: "Engineer", text: "Voice automation + AI keyboard = fewer clicks, faster delivery." },
  {
    name: "Emma Garcia",
    role: "Product Manager",
    text: "Setup was easy and the protection runs 24/7 in the background.",
  },
]

export function Testimonials() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <h2 className="text-balance text-center text-3xl font-semibold md:text-4xl">What users say</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {reviews.map((r) => (
          <div key={r.name} className="rounded-lg border border-border bg-card p-5">
            <div className="mb-2 flex items-center gap-1 text-yellow-500" aria-label="5 stars">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} fill="currentColor" />
              ))}
            </div>
            <p className="text-pretty text-sm leading-relaxed text-foreground">{r.text}</p>
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck size={16} className="text-primary" />
              <span className="font-medium text-foreground">{r.name}</span>
              <span>• {r.role}</span>
              <span>• Verified</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
