import { Card, CardContent } from "@/components/ui/card"
import { ShieldCheck, Sparkles, Keyboard } from "lucide-react"

const steps = [
  {
    title: "1. Protect",
    desc: "Stremini scans links, attachments, and pages in real time—blocking threats proactively.",
    icon: ShieldCheck,
  },
  {
    title: "2. Assist",
    desc: "Use voice or text to automate tasks—compose, summarize, translate, schedule, and more.",
    icon: Sparkles,
  },
  {
    title: "3. Accelerate",
    desc: "Type faster with the AI keyboard that adapts to your tone and context.",
    icon: Keyboard,
  },
]

export function HowItWorks() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <h2 className="text-balance text-center text-3xl font-semibold md:text-4xl">How it works</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
        Lightweight, always available, and designed to stay out of your way.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {steps.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.title} className="border border-border bg-card">
              <CardContent className="flex flex-col gap-2 pt-6">
                <Icon size={20} className="text-primary" aria-hidden />
                <div className="text-lg font-medium">{s.title}</div>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
