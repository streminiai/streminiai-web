"use client"

import { useEffect, useState } from "react"
import { supabase, Job } from "@/lib/supabase"
import { CareersForm } from "@/components/sections/careers-form"
import { Globe, Clock, Zap } from "lucide-react"

export default function CareersPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("is_active", true)
        .order("created_at", { ascending: false })
      
      if (!error && data) {
        setJobs(data)
      }
      setLoading(false)
    }
    fetchJobs()
  }, [])

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:py-24 font-['Outfit']">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-white md:text-6xl">
          Build the future of <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">AI Protection</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Join a world-class team of engineers, designers, and researchers building the #1 floating AI assistant. 
          Help us redefine digital security and productivity.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Job Listings */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-white">Open Positions</h2>
          
          <div className="grid gap-6">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-12 text-center bg-white/5">
                <p className="text-muted-foreground italic">No open positions at the moment. Check back later!</p>
              </div>
            ) : (
              jobs.map((job) => (
                <div
                  key={job.id}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/[0.08] hover:border-white/20"
                >
                  <div className="flex flex-col gap-6">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{job.title}</h3>
                      <div className="mt-1 flex flex-wrap gap-3 text-sm text-muted-foreground border-b border-white/10 pb-4">
                        <span className="flex items-center gap-1">
                          <Globe className="h-4 w-4" /> {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" /> {job.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Zap className="h-4 w-4" /> {job.department}
                        </span>
                      </div>
                      
                      {job.description && (
                        <div className="mt-4 text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                          {job.description}
                        </div>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => {
                        document.getElementById("apply-form")?.scrollIntoView({ behavior: "smooth" })
                      }}
                      className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition-transform hover:scale-105 active:scale-95 whitespace-nowrap self-start"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center bg-white/[0.02]">
            <h3 className="text-lg font-medium text-white">Don&apos;t see a role for you?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              We&apos;re always looking for exceptional talent. Apply spontaneously below!
            </p>
          </div>
        </div>

        {/* Application Form */}
        <div className="sticky top-24 h-fit">
          <div id="apply-form">
            <CareersForm />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="mt-24 text-center border-t border-white/10 pt-16">
        <h2 
          className="text-5xl md:text-7xl font-bold text-white mb-6 uppercase tracking-wider relative inline-block transition-transform hover:scale-105 duration-300"
          style={{ 
            textShadow: "-3px 0px 0px #00f2ff, 3px 0px 0px #ff3366" 
          }}
        >
          Contact
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto text-lg mt-4">
          Have specific questions about our open roles or the interview process? 
          <br/> Reach out to our talent team directly.
        </p>
        <a 
          href="mailto:Mail@stremini.site" 
          className="inline-block mt-8 rounded-2xl bg-white/5 border border-white/10 px-8 py-4 text-white hover:bg-white/10 transition-colors font-semibold"
        >
          Mail@stremini.site
        </a>
      </div>
    </div>
  )
}
