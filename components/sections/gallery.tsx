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
      
      {/* Desktop: 4 column grid */}
      <div className="mt-8 hidden gap-6 md:grid md:grid-cols-2 xl:grid-cols-4">
        {items.map((it) => (
          <Card key={it.title} className="border border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium">{it.title}</span>
                {it.soon && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground whitespace-nowrap">
                    Soon
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative w-full rounded-lg overflow-hidden bg-muted" style={{ height: '400px' }}>
                <Image
                  src={it.image}
                  alt={it.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile: Single column */}
      <div className="mt-8 space-y-6 md:hidden">
        {items.map((it) => (
          <Card key={it.title} className="border border-border bg-card">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-base font-medium">{it.title}</span>
                {it.soon && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground whitespace-nowrap">
                    Coming Soon
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative w-full rounded-lg overflow-hidden bg-muted" style={{ height: '500px' }}>
                <Image
                  src={it.image}
                  alt={it.title}
                  fill
                  className="object-contain"
                  sizes="100vw"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
