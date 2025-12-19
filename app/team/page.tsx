"use client"

import { useEffect, useState } from "react"
import { Users, Zap, Megaphone, Briefcase, User, Linkedin, Twitter, type LucideIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { supabase, TeamMember, categoryLabels, isSupabaseConfigured } from "@/lib/supabase"

// Fallback static data (used if Supabase is not configured)
const staticTeamData: Record<string, { title: string; icon: LucideIcon; members: { name: string; role: string }[] }> = {
  founder: {
    title: "Founder",
    icon: Briefcase,
    members: [{ name: "KRISHNA ARORA", role: "Founder" }],
  },
  "co-founder": {
    title: "Co-Founders",
    icon: Users,
    members: [
      { name: "Mehridin Yo'ldoshev", role: "Co-Founder" },
      { name: "Vishwajeet", role: "Co-Founder" },
      { name: "Vector", role: "Co-Founder" },
      { name: "Energy", role: "Co-Founder" },
    ],
  },
  developer: {
    title: "Developers Team",
    icon: Zap,
    members: [
      { name: "Vishwajeet", role: "Lead Dev 1" },
      { name: "Vector", role: "Lead Dev 2" },
      { name: "Abhinanda Raghav", role: "Developer" },
      { name: "Arnav Sen", role: "Developer" },
      { name: "Tushar", role: "Developer" },
      { name: "Uday Preet Singh", role: "Developer" },
      { name: "Sanju", role: "Developer" },
      { name: "Sulaymon", role: "Developer" },
    ],
  },
  marketing: {
    title: "Marketing Team",
    icon: Megaphone,
    members: [
      { name: "Restant", role: "Marketing Head" },
      { name: "Edmund Mylliem Umlong", role: "Marketing" },
      { name: "Khushi Kumari", role: "Marketing" },
      { name: "Sanchita Barua", role: "Marketing" },
      { name: "Elysian", role: "Marketing" },
      { name: "Salifa", role: "Marketing" },
    ],
  },
  research: {
    title: "Research & Operations",
    icon: Briefcase,
    members: [
      { name: "Mehridin Yo'ldoshev", role: "Head of Research" },
      { name: "Arnav Sen", role: "Research" },
      { name: "Pankaj", role: "Research" },
      { name: "Uday Preet Singh", role: "Operations" },
      { name: "Elysian", role: "Research" },
      { name: "Sanchita Barua", role: "Research" },
      { name: "Auroja Peshin", role: "Research" },
      { name: "Gurvit Daga", role: "Research" },
      { name: "Riddhi", role: "Research" },
    ],
  },
}

const categoryIcons: Record<string, LucideIcon> = {
  founder: Briefcase,
  "co-founder": Users,
  developer: Zap,
  marketing: Megaphone,
  research: Briefcase,
}

// Team Member Card Component
function TeamMemberCard({ member }: { member: TeamMember | { name: string; role: string; image_url?: string; linkedin_url?: string; twitter_url?: string } }) {
  const initials = member.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card to-card/50 p-6 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="mb-4 relative">
          {member.image_url ? (
            <div className="h-20 w-20 overflow-hidden rounded-full ring-2 ring-border group-hover:ring-primary/50 transition-all">
              <Image
                src={member.image_url}
                alt={member.name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20 ring-2 ring-border group-hover:ring-primary/50 transition-all">
              <span className="text-xl font-bold text-primary">{initials}</span>
            </div>
          )}

          {/* Online indicator */}
          <div className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-card bg-green-500" />
        </div>

        {/* Name */}
        <h3 className="mb-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          {member.name}
        </h3>

        {/* Role */}
        <p className="mb-4 text-sm text-muted-foreground">{member.role || "Team Member"}</p>

        {/* Social Links */}
        <div className="flex gap-3">
          {member.linkedin_url && (
            <a
              href={member.linkedin_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          )}
          {member.twitter_url && (
            <a
              href={member.twitter_url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-muted p-2 text-muted-foreground transition-colors hover:bg-primary/20 hover:text-primary"
            >
              <Twitter className="h-4 w-4" />
            </a>
          )}
          {!member.linkedin_url && !member.twitter_url && (
            <div className="rounded-lg bg-muted p-2 text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [useStaticData, setUseStaticData] = useState(false)

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!isSupabaseConfigured) {
        setUseStaticData(true)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from("team_members")
          .select("*")
          .eq("is_active", true)
          .order("display_order", { ascending: true })

        if (error) throw error

        if (data && data.length > 0) {
          setTeamMembers(data)
        } else {
          setUseStaticData(true)
        }
      } catch (error) {
        console.error("Error fetching team members:", error)
        setUseStaticData(true)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamMembers()
  }, [])

  // Group team members by category
  const groupedMembers = teamMembers.reduce((acc, member) => {
    if (!acc[member.category]) {
      acc[member.category] = []
    }
    acc[member.category].push(member)
    return acc
  }, {} as Record<string, TeamMember[]>)

  const categories: TeamMember['category'][] = ['founder', 'co-founder', 'developer', 'marketing', 'research']

  return (
    <main className="min-h-screen bg-background pt-20 pb-24">
      <div className="mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">Our Team</span>
          </div>
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Meet the People Behind{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Stremini
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            Talented individuals working together to build the future of AI assistance
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {/* Team Sections */}
        {!loading && (
          <div className="space-y-16">
            {useStaticData ? (
              // Render static data
              Object.entries(staticTeamData).map(([key, section]) => {
                const Icon = section.icon
                return (
                  <section key={key}>
                    <div className="mb-8 flex items-center gap-3">
                      <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-3">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                        <p className="text-sm text-muted-foreground">{section.members.length} members</p>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {section.members.map((member, idx) => (
                        <TeamMemberCard key={idx} member={member} />
                      ))}
                    </div>
                  </section>
                )
              })
            ) : (
              // Render dynamic data from Supabase
              categories.map((category) => {
                const members = groupedMembers[category]
                if (!members || members.length === 0) return null

                const Icon = categoryIcons[category]
                return (
                  <section key={category}>
                    <div className="mb-8 flex items-center gap-3">
                      <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-3">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{categoryLabels[category]}</h2>
                        <p className="text-sm text-muted-foreground">{members.length} members</p>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {members.map((member) => (
                        <TeamMemberCard key={member.id} member={member} />
                      ))}
                    </div>
                  </section>
                )
              })
            )}
          </div>
        )}

        {/* CTA Section */}
        <div className="mt-20 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8 text-center md:p-12">
          <div className="mx-auto max-w-2xl">
            <h3 className="mb-3 text-2xl font-bold text-foreground md:text-3xl">
              Join Our Growing Team
            </h3>
            <p className="mb-8 text-muted-foreground">
              We&apos;re always looking for talented individuals to help us build the future of AI assistance
            </p>
            <Link
              href="/wishlist"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-8 py-3 font-medium text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
