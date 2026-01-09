import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Script from "next/script"
import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/next"
import SidebarDemo from "@/components/sidebar-demo"
import { Footer } from "@/components/footer"
import { CursorOrb } from "@/components/ui/cursor-orb"
import { PageTransition } from "@/components/ui/page-transition"
import { AnimatePresence } from "framer-motion"

export const metadata: Metadata = {
  title: "Stremini AI Assistant - #1 Floating AI for Digital Security & Productivity 2025",
  verification: {
    google: "nWXMsweHFRI-qkOCXhbBfFYzqoLuCkadvsHdRBBIfeTss7ZjGgsvwHY"
  },
  description:
    "Stremini is an advanced floating AI assistant for digital security and productivity. Smart protection, voice automation, AI keyboard, and more.",
  keywords: [
    "Stremini",
    "AI assistant",
    "floating AI",
    "digital security",
    "productivity",
    "edge AI",
    "threat prevention",
    "AI keyboard",
  ],
  authors: [{ name: "Stremini AI" }],
  robots: { index: true, follow: true },
  metadataBase: new URL("https://stremini.ai"),
  alternates: { canonical: "https://stremini.ai" },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Stremini AI Assistant - #1 Floating AI for Digital Security & Productivity 2025",
    description:
      "An advanced floating AI assistant with 24/7 protection, and seamless productivity tools.",
    url: "https://stremini.ai",
    siteName: "Stremini AI",
    type: "website",
    images: [{ url: "/stremini-og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stremini AI Assistant",
    description: "Advanced floating AI assistant for security and productivity with 24/7 AI protection.",
    images: ["/stremini-twitter-card.jpg"],
    creator: "@stremini",
  },
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
  const GTM_ID = "GTM-5CK2HCQP";

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <Script
          id="google-tag-manager"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){
                w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});
                var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
            `,
          }}
        />
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />


        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Stremini AI",
              url: "https://stremini.ai",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://stremini.ai/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Stremini AI Assistant",
              applicationCategory: "ProductivityApplication",
              operatingSystem: "Web, iOS, Android, Desktop",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", reviewCount: "500" },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Stremini AI",
              url: "https://stremini.ai",
              sameAs: ["https://twitter.com/stremini", "https://instagram.com/stremini", "https://t.me/stremini"],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What is Stremini AI?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Stremini is a floating AI assistant that protects your digital life and boosts productivity.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Is Stremini secure?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, Stremini provides proactive threat prevention.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <Suspense fallback={null}>
          <SidebarDemo>
            <AnimatePresence mode="wait">
              <PageTransition>
                {children}
              </PageTransition>
            </AnimatePresence>
            <Footer />
          </SidebarDemo>
          <CursorOrb />
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
