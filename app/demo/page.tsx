import StreminiAiDemo from "@/components/stremini-ai-demo"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Interactive Demo - Stremini AI",
    description: "Experience Stremini's capabilities with our interactive demo showcasing scam detection, voice commands, and AI assistance.",
}

export default function DemoPage() {
    return <StreminiAiDemo />
}
