import type { Metadata } from "next"
import { Gallery } from "@/components/sections/gallery"

export const metadata: Metadata = {
  title: "Gallery - Stremini AI",
  description: "View screenshots and visuals of Stremini AI in action.",
}

export default function GalleryPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="py-16 md:py-24">
        <Gallery />
      </section>
    </div>
  )
}
