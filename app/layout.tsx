import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Script from "next/script"
import { Suspense } from "react"
import { Analytics } from "@vercel/analytics/next"
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata: Metadata = {
  title: "Stremini AI Assistant - #1 Floating AI for Digital Security & Productivity 2025",
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
  openGraph: {
    title: "Stremini AI Assistant - #1 Floating AI for Digital Security & Productivity 2025",
    description:
      "An advanced floating AI assistant with bank-level security, 24/7 protection, and seamless productivity tools.",
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


  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script id="stremini-theme-init" strategy="beforeInteractive">
          {`
            try {
              const stored = localStorage.getItem('theme');
              const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
              const theme = stored || (systemDark ? 'dark' : 'light');
              document.documentElement.classList.toggle('dark', theme === 'dark');
            } catch (_) {}
          `}
        </Script>

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
                    text: "Yes, Stremini uses bank-level encryption and proactive threat prevention.",
                  },
                },
              ],
            }),
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <Suspense fallback={null}>{children} <Analytics />

          <GoogleAnalytics gaId={GA_ID ?? ''} />

        </Suspense>
      </body>
    </html>
  )
}
