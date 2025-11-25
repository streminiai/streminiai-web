import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const qas = [
  {
    q: "What is Stremini AI?",
    a: "An advanced floating AI assistant for digital security and productivity. It proactively protects you and helps you work faster.",
  },
  { q: "Is my data secure?", a: "Yes. Stremini has strict privacy controls." },
  { q: "Does it work on mobile and desktop?", a: "Yes, Stremini supports Web, iOS, Android, and Desktop platforms." },
  { q: "Can I cancel anytime?", a: "Absolutely. You can upgrade, downgrade, or cancel at any time." },
]

export function FAQ() {
  return (
    <div className="mx-auto max-w-4xl px-4">
      <h2 className="text-balance text-center text-3xl font-semibold md:text-4xl">FAQ</h2>
      <Accordion type="multiple" className="mt-6">
        {qas.map((qa, idx) => (
          <AccordionItem key={idx} value={`faq-${idx}`} className="border-b border-border">
            <AccordionTrigger>{qa.q}</AccordionTrigger>
            <AccordionContent>
              <p className="text-sm leading-relaxed text-muted-foreground">{qa.a}</p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
