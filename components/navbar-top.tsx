"use client"

import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"
import { Button } from "@/components/ui/button"

export function NavbarTop() {
  return (
    <header className="sticky top-0 z-40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="#home" className="flex items-center gap-2">
          <span className="inline-block h-6 w-6 rounded-md bg-gradient-to-br from-primary to-accent" aria-hidden />
          <span className="text-sm font-semibold tracking-wide">Stremini</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {[
            ["Home", "#home"],
            ["Features", "#features"],
            ["Gallery", "#gallery"],
            ["Pricing", "#pricing"],
            ["About", "/about"],
            ["Team", "/team"],
            ["FAQ", "#faq"],
          ].map(([label, href]) => (
            <Link key={label} href={href} className="text-sm hover:text-primary">
              {label}
            </Link>
          ))}

          <Button asChild className="bg-gradient-to-tr from-primary to-accent text-primary-foreground">
            <Link href="#waitlist">Join Waitlist</Link>
          </Button>

          <ThemeToggle />
        </div>

        <div className="md:hidden">
          <ThemeToggle />
        </div>
      </nav>
    </header>
  )
}
