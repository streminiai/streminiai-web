"use client"

import * as React from "react"

const WISHLIST_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScH8_GGO3x33hAZlDplggSdrGmbEjXLpSLgpBfwPc7kMC-3fA/viewform?embedded=true"

export default function WishlistPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-slate-900 border border-slate-700/70 text-[11px] font-semibold">
            S
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-tight">
              Stremini AI Assistant
            </span>
            <span className="text-[11px] text-slate-500 leading-tight">
              Floating copilot for your browser
            </span>
          </div>
        </div>

        <span className="text-[11px] px-3 py-1 rounded-full border border-slate-700/80 text-slate-400">
          Waitlist · 2025
        </span>
      </header>

      {/* Main */}
      <main className="max-w-4xl mx-auto w-full px-4 md:px-6 py-6 md:py-10">
        <section className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold mb-1">
            Join the Stremini AI waitlist
          </h1>
          <p className="text-sm md:text-base text-slate-400">
            Be among the first to try Stremini&apos;s floating AI assistant. Fill
            out this quick form without ever leaving stremini.site.
          </p>
        </section>

        {/* Responsive iframe wrapper */}
        <section>
          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
            {/* Use aspect ratio for responsiveness (height is large because form is long) */}
            <div className="pt-[180%] md:pt-[140%] lg:pt-[130%]">
              <iframe
                src={WISHLIST_FORM_URL}
                title="Stremini AI Waitlist Form"
                className="absolute inset-0 h-full w-full border-0"
                loading="lazy"
                allowFullScreen
              >
                Loading…
              </iframe>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
