import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const tiers = [
  {
    name: "Free Plan",
    price: "$0",
    period: "/month",
    features: [
      "AI Chatbot - 30/day",
      "Digital Bodyguard - 15 times/day",
      "Automation - 7 times/day",
      "AI keyboard - 20/day",
      "24/7 support",
      "Security - Fully safe",
    ],
    cta: "Get Started",
  },
  {
    name: "Pro Plan",
    price: "$9",
    period: "/month",
    features: [
      "AI Chatbot - 70/day",
      "Digital Bodyguard - 35 times/day",
      "Automation - 25 times/day",
      "AI keyboard - 50/day",
      "Stremini coins",
      "24/7 support",
      "Early access to upcoming features",
      "Security - Fully Safe + Enhanced Protection",
    ],
    cta: "Start 14-day Trial",
    highlight: true,
  },
  {
    name: "Max Plan",
    price: "$29",
    period: "/month",
    features: [
      "AI Chatbot - 150/day",
      "Digital Bodyguard - 50/day",
      "Automation - 50/day",
      "AI keyboard - 100/day",
      "Stremini coins",
      "24/7 support",
      "Early access to upcoming features",
      "Security - Maximum Security + Compliance Level",
    ],
    cta: "Go Max",
  },
]

export function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <h2 className="text-balance text-center text-3xl font-semibold md:text-4xl">Pricing</h2>
      <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-muted-foreground md:text-base">
        Simple plans, powerful protection. 30-Day Money-Back Guarantee.
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {tiers.map((t) => (
          <Card key={t.name} className={`border border-border bg-card ${t.highlight ? "ring-2 ring-primary" : ""}`}>
            <CardHeader className="flex flex-col items-start gap-1">
              <span className="text-lg font-medium">{t.name}</span>
              <div>
                <span className="text-3xl font-semibold">{t.price}</span>
                <span className="text-muted-foreground">{t.period}</span>
              </div>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              <ul className="grid gap-2">
                {t.features.map((f) => (
                  <li key={f} className="leading-relaxed">
                    • {f}
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className={
                  t.highlight ? "bg-gradient-to-tr from-primary to-accent text-primary-foreground w-full" : "w-full"
                }
              >
                {t.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-center text-xs text-muted-foreground">30-Day Money-Back Guarantee.</p>
    </div>
  )
}
