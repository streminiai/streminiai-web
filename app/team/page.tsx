"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { Users, Zap, Megaphone, Briefcase } from "lucide-react"
import Link from "next/link"
import { supabase, TeamMember, categoryLabels, isSupabaseConfigured } from "@/lib/supabase"
import TeamMemberCard from "@/components/ui/team-member-card"

// Fallback static data (used if Supabase is not configured)
const staticTeamData: Record<string, { title: string; members: { name: string; role: string }[] }> = {
  founder: {
    title: "Founder",
    members: [{ name: "KRISHNA ARORA", role: "Founder" }],
  },
  "co-founder": {
    title: "Co-Founders",
    members: [
      { name: "Mehridin Yo'ldoshev", role: "Co-Founder" },
      { name: "Vishwajeet", role: "Co-Founder" },
      { name: "Vector", role: "Co-Founder" },
      { name: "Energy", role: "Co-Founder" },
    ],
  },
  developer: {
    title: "Developers Team",
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

const categoryIcons: Record<string, React.ElementType> = {
  founder: Briefcase,
  "co-founder": Users,
  developer: Zap,
  marketing: Megaphone,
  research: Briefcase,
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
    <div className="min-h-screen bg-background pt-20 pb-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
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
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {/* Team Sections */}
        {!loading && (
          <div className="space-y-20">
            {useStaticData ? (
              // Render static data
              Object.entries(staticTeamData).map(([key, section], sectionIndex) => {
                const Icon = categoryIcons[key]
                return (
                  <motion.section
                    key={key}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.15, duration: 0.6 }}
                  >
                    <div className="mb-10 flex items-center gap-4">
                      <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-3 shadow-lg shadow-primary/25">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{section.title}</h2>
                        <p className="text-sm text-muted-foreground">{section.members.length} members</p>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {section.members.map((member, idx) => (
                        <TeamMemberCard
                          key={idx}
                          name={member.name}
                          role={member.role}
                        />
                      ))}
                    </div>
                  </motion.section>
                )
              })
            ) : (
              // Render dynamic data from Supabase
              categories.map((category, sectionIndex) => {
                const members = groupedMembers[category]
                if (!members || members.length === 0) return null

                const Icon = categoryIcons[category]
                return (
                  <motion.section
                    key={category}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: sectionIndex * 0.15, duration: 0.6 }}
                  >
                    <div className="mb-10 flex items-center gap-4">
                      <div className="rounded-xl bg-gradient-to-br from-primary to-accent p-3 shadow-lg shadow-primary/25">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-foreground">{categoryLabels[category]}</h2>
                        <p className="text-sm text-muted-foreground">{members.length} members</p>
                      </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {members.map((member) => (
                        <TeamMemberCard
                          key={member.id}
                          name={member.name}
                          role={member.role}
                          imageUrl={member.image_url}
                          linkedinUrl={member.linkedin_url}
                          twitterUrl={member.twitter_url}
                          instagramUrl={member.instagram_url}
                        />
                      ))}
                    </div>
                  </motion.section>
                )
              })
            )}
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          className="mt-24 overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 p-8 text-center md:p-12 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Background sparkles effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-primary/30"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <div className="mx-auto max-w-2xl relative z-10">
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
        </motion.div>
      </div>
    </div>
  )
}
