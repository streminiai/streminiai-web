"use client"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export function NavbarTop() {
  return (
    <header className="sticky top-0 z-40 bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image 
            src="/stremio-logo.png" 
            alt="Stremio Logo" 
            width={24} 
            height={24}
            className="h-6 w-6"
          />
          <span className="text-sm font-semibold tracking-wide">Stremini</span>
        </Link>
        <div className="hidden items-center gap-5 md:flex">
          {[
            ["Home", "/"],
            ["Features", "/features"],
            ["Gallery", "/gallery"],
            ["About", "/about"],
            ["Team", "/team"],
          ].map(([label, href]) => (
            <Link key={label} href={href} className="text-sm hover:text-primary whitespace-nowrap">
              {label}
            </Link>
          ))}
          <Button asChild className="ml-2 bg-gradient-to-tr from-primary to-accent text-primary-foreground">
            <Link href="/wishlist">Join Wishlist</Link>
          </Button>
        </div>
      </nav>
    </header>
  )
}
