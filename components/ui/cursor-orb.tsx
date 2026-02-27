"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useMotionValue } from "framer-motion"

export function CursorOrb() {
    const [isHovered, setIsHovered] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Increase stiffness and damping to eliminate obvious spring latency
    const springConfig = { damping: 100, stiffness: 2000, mass: 0.1 }
    const x = useSpring(mouseX, springConfig)
    const y = useSpring(mouseY, springConfig)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
            if (!isVisible) setIsVisible(true)
        }

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const isInteractive =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.getAttribute('role') === 'button'

            setIsHovered(!!isInteractive)
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseover", handleMouseOver)

        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseover", handleMouseOver)
        }
    }, [mouseX, mouseY, isVisible])

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] hidden md:block">
            {/* Main Orb */}
            <motion.div
                className="absolute w-6 h-6 rounded-full bg-purple-500/30 border border-purple-400/50 backdrop-blur-[2px]"
                style={{
                    x: x,
                    y: y,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovered ? 2.5 : 1,
                    backgroundColor: isHovered ? "rgba(168, 85, 247, 0.15)" : "rgba(168, 85, 247, 0.3)",
                }}
            />

            {/* Inner Dot */}
            <motion.div
                className="absolute w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                style={{
                    x: x,
                    y: y,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovered ? 0.5 : 1,
                }}
            />

            {/* Outer Glow */}
            <motion.div
                className="absolute w-12 h-12 rounded-full bg-purple-500/10 blur-xl"
                style={{
                    x: x,
                    y: y,
                    translateX: "-50%",
                    translateY: "-50%",
                }}
                animate={{
                    scale: isHovered ? 2 : 1,
                    opacity: isHovered ? 0.8 : 0.4,
                }}
            />
        </div>
    )
}
