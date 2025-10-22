"use client"

import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, Zap, Cpu, MessageSquare, ShieldCheck, Keyboard, Check } from "lucide-react"
import Link from "next/link"

const features = [
  {
    title: "Smart Auto Tasker",
    desc: "Automate repetitive workflows with a single tap.",
    icon: Zap,
    details: [
      "Create custom automation rules without coding",
      "Trigger actions based on time, location, or app activity",
      "Chain multiple tasks together seamlessly",
      "Save hours on repetitive daily tasks",
    ],
  },
  {
    title: "Talk Assist",
    desc: "Voice-first assistant to execute actions hands-free.",
    icon: MessageSquare,
    details: [
      "Natural language voice commands",
      "Works across all your apps",
      "Understands context and intent",
      "Perfect for multitasking and accessibility",
    ],
  },
  {
    title: "Core AI",
    desc: "On-device + cloud AI orchestration for speed and privacy.",
    icon: Cpu,
    details: [
      "Hybrid processing for optimal performance",
      "Your data stays private with on-device processing",
      "Cloud backup for complex tasks",
      "Lightning-fast response times",
    ],
  },
  {
    title: "Emotional Tone Sense",
    desc: "Understands tone to craft better communications.",
    icon: Bot,
    details: [
      "Analyzes sentiment in real-time",
      "Suggests tone adjustments for emails and messages",
      "Helps avoid miscommunication",
      "Improves professional and personal interactions",
    ],
  },
  {
    title: "Smart Protection",
    desc: "Real-time scam and phishing detection across apps.",
    icon: ShieldCheck,
    details: [
      "AI-powered threat detection",
      "Blocks phishing attempts instantly",
      "Protects against social engineering",
      "24/7 security monitoring",
    ],
  },
  {
    title: "AI Keyboard",
    desc: "Type faster with context-aware AI completions.",
    icon: Keyboard,
    details: [
      "Predictive text that learns your style",
      "Smart emoji and symbol suggestions",
      "Multi-language support",
      "Reduces typing time by up to 40%",
    ],
  },
]

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background pt-20 pb-20">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="text-balance text-4xl font-bold md:text-5xl">Powerful Features Built for You</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Discover how Stremini AI transforms your daily workflow with intelligent automation and protection.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border border-border bg-card hover:shadow-lg transition-shadow">
                <div className="h-1 w-full rounded-t-md bg-gradient-to-r from-primary to-accent" aria-hidden />
                <CardHeader className="flex flex-row items-start gap-3">
                  <Icon size={24} className="text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{feature.desc}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm">
                        <Check size={16} className="text-accent flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Ready to Experience Stremini?</h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join our waitlist to get early access and be among the first to transform your productivity.
          </p>
          <Button asChild className="bg-gradient-to-tr from-primary to-accent text-primary-foreground">
            <Link href="/wishlist">Join Waitlist</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
