import { Card, CardHeader, CardContent } from "@/components/ui/card"

const items = [
  { title: "Scam Detection Demo", soon: false },
  { title: "Voice Automation", soon: false },
  { title: "AI Keyboard", soon: false },
  { title: "Smart Automation", soon: true },
]

export function Gallery() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <h2 className="text-balance text-center text-3xl font-semibold md:text-4xl">Gallery</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
        A glimpse of Stremini in action.
      </p>

      <div className="mt-8 hidden gap-4 overflow-x-auto pb-2 md:flex md:snap-x md:snap-mandatory">
        {items.map((it) => (
          <Card key={it.title} className="min-w-[320px] snap-start border border-border bg-card">
            <CardHeader className="flex items-center gap-2">
              <span className="text-base font-medium">{it.title}</span>
              {it.soon && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                  Coming Soon
                </span>
              )}
            </CardHeader>
            <CardContent>
              <div className="h-40 w-full rounded-md bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid gap-4 md:hidden">
        {items.map((it) => (
          <Card key={it.title} className="border border-border bg-card">
            <CardHeader className="flex items-center gap-2">
              <span className="text-base font-medium">{it.title}</span>
              {it.soon && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-medium text-accent-foreground">
                  Coming Soon
                </span>
              )}
            </CardHeader>
            <CardContent>
              <div className="h-40 w-full rounded-md bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
