"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Download, Users, ImageIcon, BookOpen } from "lucide-react"
import { motion } from "framer-motion"

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Download", href: "https://play.google.com/store/apps/details?id=com.Android.stremini_ai&hl=en_IN", icon: Download, external: true, isFeatured: true },
  { label: "Team", href: "/team", icon: Users },
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)]">
      {/* Background with Glassmorphism */}
      <div className="absolute inset-0 bg-neutral-900/95 backdrop-blur-2xl border-t border-white/10" />
      
      {/* Smooth Bump Shape */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-[24px] w-32 h-10 pointer-events-none">
        <svg viewBox="0 0 100 40" className="w-full h-full" preserveAspectRatio="none">
          <path 
            d="M0 40 C20 40 20 0 50 0 C80 0 80 40 100 40" 
            className="fill-neutral-900/95 stroke-white/10"
            strokeWidth="1"
          />
        </svg>
        {/* Mask to clean bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-neutral-900/95 translate-y-[0.5px]" />
      </div>

      <div className="mx-auto grid max-w-3xl grid-cols-5 px-2 relative z-10 h-16 items-center">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          
          if (item.isFeatured) {
            return (
              <div key={item.label} className="col-span-1 flex justify-center -translate-y-[22px]">
                <Link
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className="relative flex flex-col items-center justify-center outline-none group"
                >
                  {/* Outer Glow */}
                  <div className="absolute inset-0 rounded-full bg-cyan-500/20 blur-xl group-hover:bg-cyan-500/30 transition-colors" />
                  
                  <motion.div 
                    className="relative flex h-[58px] w-[58px] items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 text-white shadow-[0_0_20px_rgba(0,180,255,0.5)] group-hover:shadow-[0_0_35px_rgba(0,180,255,0.7)] group-active:scale-95 transition-all border-2 border-white/20"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  >
                    <Icon size={26} strokeWidth={2.5} className="drop-shadow-lg" />
                    
                    {/* Inner Shine */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
                  </motion.div>
                  
                  <span className="text-[9px] font-black text-cyan-400 mt-3 filter drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] uppercase tracking-[0.2em]">{item.label}</span>
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
              className={`flex flex-col items-center justify-center gap-1.5 rounded-xl p-2 transition-all relative group ${isActive ? "text-cyan-400" : "text-slate-400 hover:text-white"
                }`}
              aria-current={isActive ? "page" : undefined}
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute inset-0 bg-white/5 rounded-xl -z-1"
                />
              )}
              <Icon size={22} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" : ""} />
              <span className={`text-[10px] font-bold ${isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"}`}>
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
