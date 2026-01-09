"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Play, RotateCcw, ArrowRight, Shield, Keyboard, Mic, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

type DemoScenario = "scam" | "voice" | "keyboard" | "protection"

const scenarios = [
    {
        id: "scam" as const,
        title: "Scam Detection",
        description: "Watch Stremini detect and prevent a phishing attempt in real-time",
        icon: Shield,
        steps: [
            { type: "message", content: "🚨 URGENT: Your bank account has been compromised. Click here immediately to secure it: suspicious-link.com" },
            { type: "analysis", content: "Analyzing message patterns..." },
            { type: "alert", content: "⚠️ Potential Scam Detected\n\nThis message shows multiple red flags:\n• Urgency tactics\n• Suspicious link\n• Unknown sender requesting sensitive action\n\nStremini recommends: Do not click the link" },
            { type: "action", content: "✅ Threat blocked. Message moved to spam." },
        ],
    },
    {
        id: "voice" as const,
        title: "Voice Commands",
        description: "Use natural voice to control your device hands-free",
        icon: Mic,
        steps: [
            { type: "voice", content: "👤 You: \"Stremini, remind me to call Mom tomorrow at 3 PM\"" },
            { type: "processing", content: "Processing command..." },
            { type: "response", content: "🤖 Stremini: Reminder set for tomorrow at 3:00 PM - Call Mom" },
            { type: "action", content: "✅ Reminder created in your calendar" },
        ],
    },
    {
        id: "keyboard" as const,
        title: "AI Keyboard",
        description: "Context-aware writing assistance that understands your screen",
        icon: Keyboard,
        steps: [
            { type: "context", content: "Replying to email about project deadline..." },
            { type: "suggestion", content: "💡 Stremini suggests:\n\"Thanks for the update. I'll have the report ready by Friday evening. Let me know if you need anything earlier.\"" },
            { type: "user", content: "Tap to accept suggestion" },
            { type: "action", content: "✅ Message composed and ready to send" },
        ],
    },
    {
        id: "protection" as const,
        title: "Real-Time Protection",
        description: "24/7 monitoring of your digital activity",
        icon: Shield,
        steps: [
            { type: "monitoring", content: "🛡️ Stremini is actively monitoring your screen..." },
            { type: "detection", content: "Suspicious activity detected: App requesting excessive permissions" },
            { type: "alert", content: "Security Alert\n\nThe app 'Photo Editor Pro' is requesting:\n• Access to contacts\n• Access to call logs\n• Background location\n\nThese permissions are unusual for a photo app." },
            { type: "action", content: "✅ Permissions blocked. App access restricted." },
        ],
    },
]

export function StreminiDemoInteractive() {
    const [activeScenario, setActiveScenario] = useState<DemoScenario>("scam")
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentStep, setCurrentStep] = useState(0)

    const currentScenarioData = scenarios.find((s) => s.id === activeScenario)!

    const startDemo = () => {
        setIsPlaying(true)
        setCurrentStep(0)
    }

    const resetDemo = () => {
        setIsPlaying(false)
        setCurrentStep(0)
    }

    const nextStep = () => {
        if (currentStep < currentScenarioData.steps.length - 1) {
            setCurrentStep(currentStep + 1)
        } else {
            setIsPlaying(false)
        }
    }

    return (
        <div className="min-h-screen py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        Try Stremini
                    </motion.h1>
                    <motion.p
                        className="text-lg text-muted-foreground"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        Experience how Stremini protects and assists you in real-time
                    </motion.p>
                </div>

                {/* Scenario Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    {scenarios.map((scenario) => {
                        const Icon = scenario.icon
                        return (
                            <button
                                key={scenario.id}
                                onClick={() => {
                                    setActiveScenario(scenario.id)
                                    resetDemo()
                                }}
                                className={`p-4 rounded-xl border-2 transition-all text-left ${activeScenario === scenario.id
                                    ? "border-primary bg-primary/10"
                                    : "border-border hover:border-primary/50"
                                    }`}
                            >
                                <Icon className={`w-6 h-6 mb-2 ${activeScenario === scenario.id ? "text-primary" : "text-muted-foreground"}`} />
                                <h3 className="font-semibold text-sm mb-1">{scenario.title}</h3>
                                <p className="text-xs text-muted-foreground line-clamp-2">{scenario.description}</p>
                            </button>
                        )
                    })}
                </div>

                {/* Demo Screen */}
                <div className="bg-card border border-border rounded-2xl overflow-hidden max-w-3xl mx-auto">
                    {/* Demo Header */}
                    <div className="bg-slate-900 border-b border-border px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <currentScenarioData.icon className="w-5 h-5 text-primary" />
                            <h2 className="font-semibold">{currentScenarioData.title}</h2>
                        </div>
                        <div className="flex gap-2">
                            {!isPlaying ? (
                                <Button onClick={startDemo} size="sm" className="flex items-center gap-2">
                                    <Play className="w-4 h-4" />
                                    Start Demo
                                </Button>
                            ) : (
                                <Button onClick={resetDemo} size="sm" variant="outline" className="flex items-center gap-2">
                                    <RotateCcw className="w-4 h-4" />
                                    Reset
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Demo Content */}
                    <div className="p-6 min-h-[400px] bg-slate-950/50">
                        {!isPlaying && currentStep === 0 && (
                            <div className="flex flex-col items-center justify-center h-64 text-center">
                                <currentScenarioData.icon className="w-16 h-16 text-muted-foreground mb-4" />
                                <p className="text-muted-foreground mb-6">{currentScenarioData.description}</p>
                                <Button onClick={startDemo} className="flex items-center gap-2">
                                    <Play className="w-4 h-4" />
                                    Start Demonstration
                                </Button>
                            </div>
                        )}

                        {isPlaying && (
                            <div className="space-y-4">
                                <AnimatePresence mode="wait">
                                    {currentScenarioData.steps.slice(0, currentStep + 1).map((step, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ duration: 0.4 }}
                                            className={`p-4 rounded-lg ${step.type === "alert"
                                                ? "bg-red-500/10 border border-red-500/30"
                                                : step.type === "action"
                                                    ? "bg-green-500/10 border border-green-500/30"
                                                    : step.type === "suggestion"
                                                        ? "bg-blue-500/10 border border-blue-500/30"
                                                        : "bg-slate-800/50 border border-slate-700"
                                                }`}
                                        >
                                            <p className="whitespace-pre-line text-sm">{step.content}</p>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {currentStep < currentScenarioData.steps.length - 1 && (
                                    <div className="flex justify-center pt-4">
                                        <Button onClick={nextStep} className="flex items-center gap-2">
                                            Continue
                                            <ChevronRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}

                                {currentStep === currentScenarioData.steps.length - 1 && (
                                    <div className="flex justify-center gap-4 pt-4">
                                        <Button onClick={resetDemo} variant="outline" className="flex items-center gap-2">
                                            <RotateCcw className="w-4 h-4" />
                                            Try Again
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                const nextIdx = (scenarios.findIndex((s) => s.id === activeScenario) + 1) % scenarios.length
                                                setActiveScenario(scenarios[nextIdx].id)
                                                resetDemo()
                                                startDemo()
                                            }}
                                            className="flex items-center gap-2"
                                        >
                                            Next Scenario
                                            <ArrowRight className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center mt-12">
                    <p className="text-muted-foreground mb-4">Ready to experience Stremini for real?</p>
                    <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent">
                        <Link href="/wishlist">Join the Waitlist</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
