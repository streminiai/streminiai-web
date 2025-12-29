"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
    IconHome,
    IconSparkles,
    IconPhoto,
    IconInfoCircle,
    IconUsers,
    IconHeart,
    IconSettings,
    IconLogout,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function SidebarDemo({ children }: { children: React.ReactNode }) {
    const links = [
        {
            label: "Home",
            href: "/",
            icon: (
                <IconHome className="h-5 w-5 shrink-0 text-foreground group-hover/sidebar:text-primary transition-colors" />
            ),
        },
        {
            label: "Features",
            href: "/features",
            icon: (
                <IconSparkles className="h-5 w-5 shrink-0 text-foreground group-hover/sidebar:text-primary transition-colors" />
            ),
        },
        {
            label: "Gallery",
            href: "/gallery",
            icon: (
                <IconPhoto className="h-5 w-5 shrink-0 text-foreground group-hover/sidebar:text-primary transition-colors" />
            ),
        },
        {
            label: "About",
            href: "/about",
            icon: (
                <IconInfoCircle className="h-5 w-5 shrink-0 text-foreground group-hover/sidebar:text-primary transition-colors" />
            ),
        },
        {
            label: "Team",
            href: "/team",
            icon: (
                <IconUsers className="h-5 w-5 shrink-0 text-foreground group-hover/sidebar:text-primary transition-colors" />
            ),
        },
        {
            label: "Wishlist",
            href: "/wishlist",
            icon: (
                <IconHeart className="h-5 w-5 shrink-0 text-foreground group-hover/sidebar:text-primary transition-colors" />
            ),
        },
        {
            label: "Settings",
            href: "#",
            icon: (
                <IconSettings className="h-5 w-5 shrink-0 text-foreground group-hover/sidebar:text-primary transition-colors" />
            ),
        },
        {
            label: "Logout",
            href: "#",
            icon: (
                <IconLogout className="h-5 w-5 shrink-0 text-foreground group-hover/sidebar:text-primary transition-colors" />
            ),
        },
    ];
    const [open, setOpen] = useState(false);
    return (
        <div
            className={cn(
                "flex w-full flex-1 flex-col overflow-hidden md:flex-row",
                "min-h-screen"
            )}
        >
            <Sidebar open={open} setOpen={setOpen}>
                <SidebarBody className="justify-between gap-10">
                    <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
                        {open ? <Logo /> : <LogoIcon />}
                        <div className="mt-8 flex flex-col gap-2">
                            {links.map((link, idx) => (
                                <SidebarLink key={idx} link={link} />
                            ))}
                        </div>
                    </div>
                    <div>
                        <SidebarLink
                            link={{
                                label: "Admin User",
                                href: "#",
                                icon: (
                                    <div className="h-7 w-7 shrink-0 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center text-primary-foreground text-xs font-semibold">
                                        AU
                                    </div>
                                ),
                            }}
                        />
                    </div>
                </SidebarBody>
            </Sidebar>
            <main className="flex flex-1 flex-col overflow-auto">
                {children}
            </main>
        </div>
    );
}

export const Logo = () => {
    return (
        <Link
            href="/"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
        >
            <Image
                src="/stremio-logo.png"
                alt="Stremini Logo"
                width={24}
                height={24}
                className="h-6 w-6 shrink-0"
            />
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold whitespace-pre tracking-wide text-foreground"
            >
                Stremini
            </motion.span>
        </Link>
    );
};

export const LogoIcon = () => {
    return (
        <Link
            href="/"
            className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal"
        >
            <Image
                src="/stremio-logo.png"
                alt="Stremini Logo"
                width={24}
                height={24}
                className="h-6 w-6 shrink-0"
            />
        </Link>
    );
};
