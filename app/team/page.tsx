"use client"

import { Users, Zap, Megaphone, Briefcase } from "lucide-react"
import Link from "next/link"

const teamData = {
  founder: {
    title: "Founder",
    icon: Briefcase,
    members: ["Kyzor"],
  },
  coFounders: {
    title: "Co-Founders",
    icon: Users,
    members: ["Edmund Mylliem Umlong", "Vishwajeet", "Vector", "Mehridin Yo'ldoshev"],
  },
  developers: {
    title: "Developers Team",
    icon: Zap,
    members: [
      "Vishwajeet (Lead Dev 1)",
      "Vector (Lead Dev 2)",
      "Chandan",
      "Abhinanda Raghav. S",
      "Arnav Sen",
      "SHUBHAM",
      "Valiant Joe",
      "Tushar",
      "Rodel",
      "Sanju",
      "Hasan Rezaee",
      "Antonio Biondo Lee",
    ],
  },
  marketing: {
    title: "Marketing Team",
    icon: Megaphone,
    members: [
      "Edmund Mylliem Umlong (Marketing Head)",
      "Restant",
      "Devesh Chhipa",
      "Vansh Sharma",
      "Zh4r",
      "Aslan Yaseer",
      "Devansh Doshi",
    ],
  },
  research: {
    title: "Research & Operations Team",
    icon: Briefcase,
    members: ["Mehridin Yo'ldoshev (Head)", "KISHAN MARISAM", "Abhinab Mishra", "Pankaj",
      "Devansh Doshi",
    ],
  },
}

export default function TeamPage() {
  return (
    <main className="min-h-screen bg-background pt-20 pb-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">Meet Our Team</h1>
          <p className="text-lg text-muted-foreground">
            Talented individuals working together to build the future of AI assistance
          </p>
        </div>

        {/* Team Sections */}
        <div className="space-y-12">
          {Object.entries(teamData).map(([key, section]) => {
            const Icon = section.icon
            return (
              <section key={key} className="rounded-lg border border-border bg-card p-8">
                {/* Section Header */}
                <div className="mb-8 flex items-center gap-3">
                  <div className="rounded-lg bg-gradient-to-br from-primary to-accent p-2">
                    <Icon className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">{section.title}</h2>
                </div>

                {/* Members Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {section.members.map((member, idx) => (
                    <div
                      key={idx}
                      className="rounded-lg border border-border/50 bg-background p-4 transition-all hover:border-primary/50 hover:shadow-md"
                    >
                      <p className="font-medium text-foreground">{member}</p>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>

        {/* CTA Section */}
        <div className="mt-16 rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-8 text-center">
          <h3 className="mb-2 text-2xl font-bold text-foreground">Join Our Growing Team</h3>
          <p className="mb-6 text-muted-foreground">
            We&apos;re always looking for talented individuals to help us build the future
          </p>
          <Link
            href="/wishlist"
            className="inline-block rounded-lg bg-gradient-to-tr from-primary to-accent px-6 py-2 font-medium text-primary-foreground transition-all hover:shadow-lg"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </main>
  )
}
