import { Card, CardHeader, CardContent } from "@/components/ui/card"
import Image from "next/image"

const items = [
  { title: "Scam Detection Demo", image: "/gallery-1.jpg", soon: false },
  { title: "Chatbot", image: "/gallery-2.jpg", soon: false },
  { title: "AI Keyboard", image: "/gallery-3.jpg", soon: false },
  { title: "Smart Automation", image: "/gallery-4.jpg", soon: true },
]

export function Gallery() {
  return (
    <div className="mx-auto max-w-7xl px-4">
      <h2 className="text-balance text-center text-3xl font-semibold md:text-4xl">Gallery</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
        A glimpse of Stremini in action.
      </p>
      
      {/* Desktop: Grid layout */}
      <div className="mt-8 hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <Card key={it.title} className="border border-border bg-card overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-medium">{it.title}</span>
                {it.soon && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground whitespace-nowrap">
                    Coming Soon
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg">
                <Image
                  src={it.image}
                  alt={it.title}
                  fill
                  className="object-contain bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile: Vertical grid */}
      <div className="mt-8 grid gap-6 md:hidden">
        {items.map((it) => (
          <Card key={it.title} className="border border-border bg-card overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-medium">{it.title}</span>
                {it.soon && (
                  <span className="rounded-full bg-accent px-2.5 py-0.5 text-xs font-medium text-accent-foreground whitespace-nowrap">
                    Coming Soon
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative aspect-[9/16] w-full overflow-hidden rounded-lg">
                <Image
                  src={it.image}
                  alt={it.title}
                  fill
                  className="object-contain bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
