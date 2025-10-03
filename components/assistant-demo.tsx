"use client"

import { Card, CardContent } from "@/components/ui/card"

export function AssistantDemo() {
  return (
    <div className="relative">
      {/* glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 -z-10 rounded-2xl blur-2xl opacity-70"
        style={{
          background:
            "radial-gradient(40% 40% at 20% 10%, var(--color-primary) 0%, transparent 60%), radial-gradient(35% 35% at 80% 80%, var(--color-accent) 0%, transparent 60%)",
        }}
      />
      <Card className="border border-border bg-card/90 backdrop-blur-md shadow-sm">
        <CardContent>
          <div role="log" aria-label="Assistant conversation" className="grid gap-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="h-6 w-6 shrink-0 rounded-md bg-primary" aria-hidden />
              <div className="rounded-lg border border-border bg-card px-3 py-2">
                How can I stay safe from phishing across email and messaging?
              </div>
            </div>

            <div className="ml-9 rounded-lg border border-border bg-muted px-3 py-2 text-muted-foreground">
              I’m scanning links and attachments in real-time. Suspicious domains are blocked automatically.
            </div>

            <div className="flex items-start gap-3">
              <div className="h-6 w-6 shrink-0 rounded-md bg-primary" aria-hidden />
              <div className="rounded-lg border border-border bg-card px-3 py-2">
                Draft a polite reply declining a meeting for this Friday.
              </div>
            </div>

            <div className="ml-9 rounded-lg border border-border bg-muted px-3 py-2 text-muted-foreground">
              Here’s a concise draft you can paste now:
              <div className="mt-2 rounded-md border border-border bg-background px-3 py-2 text-foreground">
                Hi Alex—thanks for reaching out. I’m at capacity this Friday. Could we look at next Wednesday instead?
                Best, Jamie
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
