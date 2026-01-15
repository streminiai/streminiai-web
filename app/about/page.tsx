import type { Metadata } from "next"
import { ShieldCheck, MessageSquare, Keyboard, Bot, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "About Stremini",
  description:
    "Learn about Stremini’s vision, team, and our AI-powered floating assistant that protects you from scams while boosting productivity.",
}

export default function AboutPage() {
  const features = [
    {
      icon: ShieldCheck,
      title: "AI-Driven Protection",
      desc: "Detect and prevent online scams and phishing before they reach you.",
    },
    {
      icon: MessageSquare,
      title: "Floating Chatbot",
      desc: "Your on-screen assistant, always ready to help while you browse or work.",
    },
    {
      icon: Keyboard,
      title: "Smart Floating Keyboard",
      desc: "Integrated AI for safer, faster typing and navigation.",
    },
    {
      icon: Bot,
      title: "Automation Tools",
      desc: "Automate routine digital tasks and enhance efficiency.",
    },
    {
      icon: Eye,
      title: "Always-On-Screen",
      desc: "A persistent companion to assist, warn, and guide—24/7.",
    },
  ]

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      {/* Intro */}
      <header className="mb-10 space-y-3">
        <div className="h-2 w-16 rounded-full bg-gradient-to-r from-primary to-accent" aria-hidden />
        <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">About Stremini</h1>
        <p className="text-pretty text-muted-foreground">
          We’re a global team of 20 innovators, developers, and researchers united by a single mission—to make the
          digital world safer and smarter. We’re building an AI-powered floating assistant designed to protect your
          device from online scams and digital threats while enhancing your productivity and convenience.
        </p>
      </header>

      {/* Vision */}
      <section className="mb-10">
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">Our Vision</CardTitle>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            To redefine digital safety by creating a 24/7 intelligent safety partner that seamlessly blends security,
            automation, and assistance—right on your screen.
          </CardContent>
        </Card>
      </section>

      {/* Unique Features */}
      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">What Makes Stremini Unique</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, title, desc }) => (
            <Card key={title} className="border-border/60">
              <CardHeader className="flex flex-row items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-primary to-accent text-primary-foreground">
                  <Icon size={18} />
                </span>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">{desc}</CardContent>
            </Card>
          ))}
        </div>
      </section>

      <Separator className="my-8" />

      {/* Team */}
      <section className="mb-10">
        <h2 className="mb-2 text-lg font-semibold">Our Team</h2>
        <p className="text-pretty text-muted-foreground">
          We are a diverse group from around the world, blending expertise in AI, cybersecurity, user experience, and
          product design. Together, we aim to make technology not just powerful—but trustworthy and human-centered.
        </p>
      </section>

      {/* Promise */}
      <section>
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-xl">Our Promise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-muted-foreground">
            <p>Stremini isn’t just an app—it’s your digital safety partner.</p>
            <p>
              We believe everyone deserves a secure, intelligent, and effortless digital experience—and we’re here to
              make that happen.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
