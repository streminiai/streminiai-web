import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"

const qas = [
  {
    q: "What is Stremini?",
    a: "Stremini is a floating, always-on AI assistant that stays on your screen to protect, assist, and automate tasks in real time.",
  },
  {
    q: "Why is it better?",
    a: "Other AI are chat based. Stremini is context-aware, screen-aware, and action-capable—It observes, detects risk, and executes tasks across apps, and doesn't save users' sensitive data.",
  },
  {
    q: "Does Stremini work in real time?",
    a: "Yes. It runs continuously in the background and reacts instantly to on-screen activity, messages, calls, and user behavior.",
  },
  {
    q: "How does Stremini detect scams or fraud?",
    a: "By analyzing message patterns, intent, urgency signals, behavioral anomalies, and known scam structures.",
  },
  {
    q: "Which devices are supported?",
    a: "Android first. Desktop version is planned.",
  },
  {
    q: "Can I fully disable Stremini anytime?",
    a: "Yes. One tap to pause or shut it down completely.",
  },
  {
    q: "What happens if Stremini makes a mistake?",
    a: "We prioritize transparency, logs, user control, and rapid correction.",
  },
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
