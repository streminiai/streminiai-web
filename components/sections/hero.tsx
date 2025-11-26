import Link from "next/link"
import { Button } from "@/components/ui/button"
import { AssistantDemo } from "@/components/assistant-demo"
export function Hero() {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-8 md:pt-12">
      <div className="grid items-center gap-8 md:grid-cols-2">
        {/* Left copy */}
        <div>
          <span className="sr-only">Floating AI for Digital Security and Productivity</span>
          <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-green-500" aria-hidden /> 24/7 AI Protection
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold leading-tight md:text-6xl">
            Your floating AI for safer, faster work
          </h1>
          <p className="text-pretty mt-4 text-base leading-relaxed text-muted-foreground md:text-lg">
            Stremini guards your digital life while helping you move faster—real‑time threat prevention, voice
            automation, and an AI keyboard that writes with context.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild className="bg-gradient-to-tr from-primary to-accent text-primary-foreground">
              <Link href="/wishlist">Join Waitlist</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="#features">Explore Features</Link>
            </Button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-muted-foreground md:grid-cols-4">
            <div className="rounded-md border border-border p-3">
              <span className="block text-foreground font-medium">Launching Soon</span>
              <span className="text-xs">Status</span>
            </div>
            <div className="rounded-md border border-border p-3">
              <span className="block text-foreground font-medium">24/7 Available</span>
              <span className="text-xs">AI Chatbot</span>
            </div>
            <div className="rounded-md border border-border p-3">
              <span className="block text-foreground font-medium">Fully Safe</span>
              <span className="text-xs">Security</span>
            </div>
            <div className="rounded-md border border-border p-3">
              <span className="block text-foreground font-medium">24/7 Available</span>
              <span className="text-xs">Digital Protection</span>
            </div>
          </div>
        </div>
        {/* Right demo */}
        <div className="relative">
          <div
            className="absolute -top-12 -right-6 h-40 w-40 rounded-full opacity-60 blur-2xl"
            aria-hidden
            style={{ background: "radial-gradient(circle at 30% 30%, var(--color-primary) 0%, transparent 60%)" }}
          />
          <AssistantDemo />
        </div>
      </div>
    </div>
  )
}
