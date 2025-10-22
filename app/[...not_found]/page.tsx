"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 animate-pulse" />

      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-float-y" />
      <div
        className="absolute bottom-20 right-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl animate-float-y"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative z-10 text-center max-w-md">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent animate-pulse">
            404
          </h1>
        </div>

        <h2 className="text-3xl font-bold text-foreground mb-3">Page Not Found</h2>
        <p className="text-muted-foreground text-lg mb-8">
          Oops! The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center animate-float-y">
            <Home className="w-10 h-10 text-primary" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground">
              <Home className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground mb-4">Quick links:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Features", href: "/features" },
              { label: "About", href: "/about" },
              { label: "Team", href: "/team" },
              { label: "Wishlist", href: "/wishlist" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-primary hover:text-primary/80 transition-colors underline"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
