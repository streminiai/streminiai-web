"use client"

import Link from "next/link"
import { Home, Sparkles, Images, Tag, HelpCircle, Inbox, Users } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { useState } from "react"

const items = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Features", href: "#features", icon: Sparkles },
  { label: "Gallery", href: "#gallery", icon: Images },
  { label: "Pricing", href: "#pricing", icon: Tag },
  { label: "FAQ", href: "#faq", icon: HelpCircle },
  { label: "Team", href: "/team", icon: Users },
  { label: "Waitlist", href: "#waitlist", icon: Inbox },
]

export function MobileBottomNav() {
  const [active, setActive] = useState("#home")

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/80 backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-3xl grid-cols-6">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = active === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setActive(item.href)}
              className={`flex flex-col items-center justify-center gap-1 p-2 text-xs ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
      <div className="border-t border-border p-2">
        <div className="mx-auto flex max-w-3xl items-center justify-center">
          <ThemeToggle className="w-full justify-center" />
        </div>
      </div>
    </nav>
  )
}
