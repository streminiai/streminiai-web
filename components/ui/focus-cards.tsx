"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export const Card = React.memo(
    ({
        card,
        index,
        hovered,
        setHovered,
    }: {
        card: { title: string; src: string };
        index: number;
        hovered: number | null;
        setHovered: React.Dispatch<React.SetStateAction<number | null>>;
    }) => (
        <div
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "rounded-xl relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-80 md:h-[500px] w-full transition-all duration-300 ease-out cursor-pointer",
                hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
            )}
        >
            <Image
                src={card.src}
                alt={card.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div
                className={cn(
                    "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end py-8 px-4 transition-opacity duration-300",
                    hovered === index ? "opacity-100" : "opacity-0"
                )}
            >
                <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
                    {card.title}
                </div>
            </div>
        </div>
    )
);

Card.displayName = "Card";

type CardType = {
    title: string;
    src: string;
};

export function FocusCards({ cards }: { cards: CardType[] }) {
    const [hovered, setHovered] = useState<number | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
            {cards.map((card, index) => (
                <Card
                    key={card.title}
                    card={card}
                    index={index}
                    hovered={hovered}
                    setHovered={setHovered}
                />
            ))}
        </div>
    );
}
