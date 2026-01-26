'use client';

import { motion } from 'framer-motion';

interface MarqueeProps {
    items: string[];
    speed?: number;
    reverse?: boolean;
    className?: string;
}

export function Marquee({ items, speed = 30, reverse = false, className = '' }: MarqueeProps) {
    // Duplicate items to create seamless loop
    const duplicatedItems = [...items, ...items];

    return (
        <div className={`marquee-container overflow-hidden py-4 ${className}`}>
            <motion.div
                className="flex gap-8 whitespace-nowrap"
                animate={{
                    x: reverse ? ['0%', '-50%'] : ['-50%', '0%'],
                }}
                transition={{
                    duration: speed,
                    repeat: Infinity,
                    ease: 'linear',
                }}
            >
                {duplicatedItems.map((item, index) => (
                    <span
                        key={index}
                        className="flex items-center gap-8 text-charcoal-50/60 font-medium text-sm tracking-widest uppercase"
                    >
                        <span>{item}</span>
                        <span className="text-cyan-500">•</span>
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

