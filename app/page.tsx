import { NavbarTop } from "@/components/navbar-top"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { Hero } from "@/components/sections/hero"
import { HowItWorks } from "@/components/sections/how-it-works"
import { Features } from "@/components/sections/features"
import { Gallery } from "@/components/sections/gallery"
import { Pricing } from "@/components/sections/pricing"
import { Testimonials } from "@/components/sections/testimonials"
import { About } from "@/components/sections/about"
import { FAQ } from "@/components/sections/faq"
import { Waitlist } from "@/components/sections/waitlist"
import { Footer } from "@/components/footer"

export default function Page() {
  return (
    <>
      <NavbarTop />
      <main className="min-h-screen">
        <section id="home" aria-label="Hero">
          <Hero />
        </section>

        <section id="how-it-works" aria-label="How it works" className="py-16 md:py-24">
          <HowItWorks />
        </section>

        <section id="features" aria-label="Features" className="py-16 md:py-24">
          <Features />
        </section>

        <section id="gallery" aria-label="Gallery" className="py-16 md:py-24">
          <Gallery />
        </section>

        <section id="pricing" aria-label="Pricing" className="py-16 md:py-24">
          <Pricing />
        </section>

        <section id="testimonials" aria-label="Testimonials" className="py-16 md:py-24">
          <Testimonials />
        </section>

        <section id="about" aria-label="About Stremini" className="py-16 md:py-24">
          <About />
        </section>

        <section id="faq" aria-label="Frequently Asked Questions" className="py-16 md:py-24">
          <FAQ />
        </section>

        <section id="waitlist" aria-label="Join the Waitlist" className="py-16 md:py-24">
          <Waitlist />
        </section>
      </main>
      <Footer />
      <MobileBottomNav />
    </>
  )
}
