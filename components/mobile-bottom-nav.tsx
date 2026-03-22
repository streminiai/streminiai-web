"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Download, Users, ImageIcon, Info, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Download", href: "https://play.google.com/store/apps/details?id=com.Android.stremini_ai&hl=en_IN", icon: Download, external: true, isFeatured: true },
  { label: "Team", href: "/team", icon: Users },
  { label: "About", href: "/about", icon: Info },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 md:hidden">
      {/* Custom Bump Background */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-background/95 backdrop-blur-xl border-t border-border" />
      <div className="absolute bottom-[16px] left-1/2 -translate-x-1/2 w-24 h-12">
        <svg viewBox="0 0 100 50" className="w-full h-full fill-background/95 stroke-border" style={{ strokeWidth: '1px', filter: 'drop-shadow(0 -1px 0px rgba(255,255,255,0.1))' }}>
          <path d="M0 50 Q25 50 25 25 A25 25 0 0 1 75 25 Q75 50 100 50" fill="currentColor" className="text-background/95" />
          <path d="M25 25 A25 25 0 0 1 75 25" fill="none" className="stroke-border" strokeWidth="1" />
        </svg>
      </div>

      <div className="mx-auto grid max-w-3xl grid-cols-5 px-2 py-3 relative z-10 h-16 items-center">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          
          if (item.isFeatured) {
            return (
              <div key={item.label} className="col-span-1 flex justify-center -translate-y-6">
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="relative flex flex-col items-center justify-center outline-none group"
                >
                  <motion.div 
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#00f2ff] via-[#0062ff] to-[#0044ff] text-white shadow-[0_0_20px_rgba(0,114,255,0.5)] group-hover:shadow-[0_0_30px_rgba(0,114,255,0.8)] group-active:scale-95 transition-shadow border border-white/20"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <Icon size={28} strokeWidth={2.5} />
                  </motion.div>
                  <span className="text-[10px] font-bold text-[#00f2ff] mt-2 filter drop-shadow-[0_0_4px_rgba(0,242,255,0.5)] uppercase tracking-wider">{item.label}</span>
                </Link>
              </div>
            )
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className={`flex flex-col items-center justify-center gap-1.5 rounded-lg p-2 transition-colors ${isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
