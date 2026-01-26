'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TerminalTextProps {
    text: string;
    className?: string;
    speed?: number; // ms per char
    delay?: number; // ms start delay
    cursor?: boolean;
    scramble?: boolean;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

// Helper to scramble a character
const getRandomChar = () => CHARS[Math.floor(Math.random() * CHARS.length)];

export function TerminalText({
    text = '',
    className,
    speed = 40,
    delay = 0,
    cursor = true,
    scramble = false,
}: TerminalTextProps) {
    const [displayedText, setDisplayedText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    const containerRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-50px" });

    useEffect(() => {
        if (!isInView) return;

        let currentIndex = 0;
        let timeoutId: NodeJS.Timeout;

        // Start delay
        const startTimeout = setTimeout(() => {
            const typeNextChar = () => {
                if (currentIndex < text.length) {
                    // Logic for scramble effect
                    if (scramble) {
                        // Briefly show random chars before settling? 
                        // Simplified: just type sequentially for now, can enhance later
                        setDisplayedText(text.slice(0, currentIndex + 1));
                    } else {
                        setDisplayedText(text.slice(0, currentIndex + 1));
                    }

                    currentIndex++;
                    const randomSpeed = speed + (Math.random() * 20 - 10); // humanize typing slightly
                    timeoutId = setTimeout(typeNextChar, randomSpeed);
                } else {
                    setIsComplete(true);
                }
            };
            typeNextChar();
        }, delay);

        return () => {
            clearTimeout(startTimeout);
            clearTimeout(timeoutId);
        };
    }, [isInView, text, speed, delay, scramble]);

    return (
        <span ref={containerRef} className={cn('inline-block', className)}>
            {displayedText}
            {cursor && !isComplete && (
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.5, 1] }}
                    className="inline-block w-[0.5em] h-[1.2em] bg-neon-cyan align-middle ml-1"
                />
            )}
        </span>
    );
}

// Scramble variant specifically for decoding effect
export function DecryptText({
    text,
    className
}: {
    text: string;
    className?: string;
}) {
    const [output, setOutput] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true });

    useEffect(() => {
        if (!output && text) {
            setOutput(text.split('').map(() => getRandomChar()).join(''));
        }
    }, [text, output]);

    useEffect(() => {
        if (!isInView) return;

        let iteration = 0;
        let interval: NodeJS.Timeout;

        interval = setInterval(() => {
            setOutput(prev =>
                prev.split('').map((char, index) => {
                    if (index < iteration) return text[index];
                    return getRandomChar();
                }).join('')
            );

            if (iteration >= text.length) {
                clearInterval(interval);
            }

            iteration += 1 / 3;
        }, 30);

        return () => clearInterval(interval);
    }, [text, isInView]);

    return (
        <span ref={containerRef} className={cn('font-mono', className)}>
            {output}
        </span>
    );
}
