"use client";

import { animate, motion } from "motion/react";
import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { FaLinkedin, FaTwitter, FaGithub } from "react-icons/fa";

// Sparkles animation
const Sparkles = () => {
    const randomMove = () => Math.random() * 2 - 1;
    const randomOpacity = () => Math.random();
    const random = () => Math.random();

    return (
        <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
                <motion.span
                    key={`star-${i}`}
                    animate={{
                        top: `calc(${random() * 100}% + ${randomMove()}px)`,
                        left: `calc(${random() * 100}% + ${randomMove()}px)`,
                        opacity: randomOpacity(),
                        scale: [1, 1.2, 0],
                    }}
                    transition={{
                        duration: random() * 2 + 4,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    style={{
                        position: "absolute",
                        top: `${random() * 100}%`,
                        left: `${random() * 100}%`,
                        width: `2px`,
                        height: `2px`,
                        borderRadius: "50%",
                        zIndex: 1,
                    }}
                    className="inline-block bg-purple-400 dark:bg-purple-300"
                />
            ))}
        </div>
    );
};

// Animated avatar container
const AvatarContainer = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                `relative rounded-full flex items-center justify-center bg-[rgba(248,248,248,0.01)]
        shadow-[0px_0px_8px_0px_rgba(168,85,247,0.4)_inset,0px_16px_24px_-8px_rgba(0,0,0,0.30)]
        transition-all duration-300 group-hover:shadow-[0px_0px_16px_0px_rgba(168,85,247,0.6)_inset,0px_16px_24px_-8px_rgba(0,0,0,0.30)]
        `,
                className
            )}
        >
            {children}
        </div>
    );
};

// Team member card
export interface TeamMemberCardProps {
    name: string;
    role?: string | null;
    imageUrl?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    githubUrl?: string | null;
    category?: string;
    className?: string;
}

export default function TeamMemberCard({
    name,
    role,
    imageUrl,
    linkedinUrl,
    twitterUrl,
    githubUrl,
    className,
}: TeamMemberCardProps) {
    const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    // Pulse animation for avatar
    useEffect(() => {
        const sequence = [
            [".avatar-glow", { opacity: [0.3, 0.6, 0.3] }, { duration: 2 }],
        ];

        animate(sequence as Parameters<typeof animate>[0], {
            repeat: Infinity,
        });
    }, []);

    return (
        <motion.div
            className={cn(
                "relative max-w-sm w-full mx-auto p-6 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100/80 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group overflow-hidden",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.3 }}
        >
            {/* Sparkles background */}
            <Sparkles />

            {/* Gradient overlay on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-blue-500/0 group-hover:from-purple-500/5 group-hover:to-blue-500/5 transition-all duration-500" />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                    {/* Animated glow ring */}
                    <div className="avatar-glow absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 opacity-30 blur-sm" />

                    <AvatarContainer className="h-20 w-20 relative z-10">
                        {imageUrl ? (
                            <Image
                                src={imageUrl}
                                alt={name}
                                width={80}
                                height={80}
                                className="h-full w-full rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-xl font-bold bg-gradient-to-br from-purple-400 to-blue-400 bg-clip-text text-transparent">
                                {initials}
                            </span>
                        )}
                    </AvatarContainer>

                    {/* Online indicator */}
                    <motion.div
                        className="absolute bottom-1 right-1 h-4 w-4 rounded-full border-2 border-gray-100 dark:border-gray-800 bg-green-500 z-20"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>

                {/* Name */}
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-blue-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                    {name}
                </h3>

                {/* Role */}
                <p className="text-sm font-normal text-neutral-600 dark:text-neutral-400 mb-4">
                    {role || "Team Member"}
                </p>

                {/* Social Links */}
                <div className="flex gap-3">
                    {linkedinUrl && (
                        <motion.a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-neutral-200/50 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-400 hover:bg-purple-500/20 hover:text-purple-500 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaLinkedin className="h-4 w-4" />
                        </motion.a>
                    )}
                    {twitterUrl && (
                        <motion.a
                            href={twitterUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-neutral-200/50 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-400 hover:bg-blue-500/20 hover:text-blue-500 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaTwitter className="h-4 w-4" />
                        </motion.a>
                    )}
                    {githubUrl && (
                        <motion.a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-neutral-200/50 dark:bg-neutral-700/50 text-neutral-600 dark:text-neutral-400 hover:bg-gray-500/20 hover:text-gray-800 dark:hover:text-white transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <FaGithub className="h-4 w-4" />
                        </motion.a>
                    )}
                </div>
            </div>

            {/* Bottom gradient line */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
    );
}

// Export card components for reuse
export const Card = ({
    className,
    children,
}: {
    className?: string;
    children: React.ReactNode;
}) => {
    return (
        <div
            className={cn(
                "max-w-sm w-full mx-auto p-8 rounded-xl border border-[rgba(255,255,255,0.10)] dark:bg-[rgba(40,40,40,0.70)] bg-gray-100 shadow-[2px_4px_16px_0px_rgba(248,248,248,0.06)_inset] group",
                className
            )}
        >
            {children}
        </div>
    );
};

export const CardTitle = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <h3
            className={cn(
                "text-lg font-semibold text-gray-800 dark:text-white py-2",
                className
            )}
        >
            {children}
        </h3>
    );
};

export const CardDescription = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <p
            className={cn(
                "text-sm font-normal text-neutral-600 dark:text-neutral-400 max-w-sm",
                className
            )}
        >
            {children}
        </p>
    );
};
