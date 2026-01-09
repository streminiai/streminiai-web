"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"

interface MagneticWrapperProps {
    children: React.ReactNode
    strength?: number
    className?: string
}

export function MagneticWrapper({ children, strength = 0.5, className = "" }: MagneticWrapperProps) {
    const ref = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return

        const { clientX, clientY } = e
        const { left, top, width, height } = ref.current.getBoundingClientRect()

        const centerX = left + width / 2
        const centerY = top + height / 2

        const distanceX = clientX - centerX
        const distanceY = clientY - centerY

        setPosition({
            x: distanceX * strength,
            y: distanceY * strength
        })
    }

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 })
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </motion.div>
    )
}
