import { motion } from "framer-motion"

export function Logo({ className = "" }: { className?: string }) {
    return (
        <motion.div
            className={`relative inline-flex items-center ${className}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <motion.span
                className="text-2xl font-bold bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
                style={{ backgroundSize: "200% auto" }}
                animate={{
                    backgroundPosition: ["0% center", "200% center", "0% center"],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                }}
            >
                Stremini
            </motion.span>
            <motion.span
                className="ml-1 text-xs font-semibold text-purple-400"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.4 }}
            >
                AI
            </motion.span>

            {/* Glow effect */}
            <motion.div
                className="absolute inset-0 blur-xl opacity-30"
                style={{
                    background: "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />
        </motion.div>
    )
}
