import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Bot, Zap, Cpu, MessageSquare, ShieldCheck, Keyboard } from "lucide-react"

const items = [
  { title: "Smart Auto Tasker", desc: "Automate repetitive workflows with a single tap.", icon: Zap },
  { title: "Talk Assist", desc: "Voice-first assistant to execute actions hands-free.", icon: MessageSquare },
  { title: "Core AI", desc: "On-device + cloud AI orchestration for speed and privacy.", icon: Cpu },
  { title: "Emotional Tone Sense", desc: "Understands tone to craft better communications.", icon: Bot },
  { title: "Smart Protection", desc: "Real-time scam and phishing detection across apps.", icon: ShieldCheck },
  { title: "AI Keyboard", desc: "Type faster with context-aware AI completions.", icon: Keyboard },
]

export function Features() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <h2 className="text-balance text-center text-3xl font-semibold md:text-4xl">Features</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
        Built for security and productivity—seamlessly floating over your apps when you need it.
      </p>

      <div className="mt-8">
        <div className="hidden gap-4 overflow-x-auto pb-2 md:flex md:snap-x md:snap-mandatory">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <Card key={it.title} className="min-w-[320px] snap-start border border-border bg-card">
                <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-primary to-accent" aria-hidden />
                <CardHeader className="flex flex-row items-center gap-3 text-lg font-medium">
                  <Icon size={18} className="text-primary" />
                  {it.title}
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{it.desc}</CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-4 md:hidden">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <Card key={it.title} className="border border-border bg-card">
                <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-primary to-accent" aria-hidden />
                <CardHeader className="flex flex-row items-center gap-3 text-base font-medium">
                  <Icon size={18} className="text-primary" />
                  {it.title}
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">{it.desc}</CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
