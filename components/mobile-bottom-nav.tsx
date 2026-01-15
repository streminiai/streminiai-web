"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Heart, Users, ImageIcon, Info, BookOpen } from "lucide-react"

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Gallery", href: "/gallery", icon: ImageIcon },
  { label: "Blog", href: "/blog", icon: BookOpen },
  { label: "Team", href: "/team", icon: Users },
  { label: "About", href: "/about", icon: Info },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
]

export function MobileBottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur-lg md:hidden">
      <div className="mx-auto grid max-w-3xl grid-cols-6 px-2 py-3">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
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
