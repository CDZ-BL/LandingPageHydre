'use client';

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export default function NumberTicker({ value, delay = 0 }: { value: number, delay?: number }) {
    const ref = useRef<HTMLSpanElement>(null);
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, {
        damping: 100,
        stiffness: 100,
        duration: 2000
    });
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    useEffect(() => {
        if (isInView) {
            setTimeout(() => {
                motionValue.set(value);
            }, delay * 1000);
        }
    }, [motionValue, isInView, value, delay]);

    useEffect(() => {
        const unsubscribe = springValue.on("change", (latest) => {
            if (ref.current) {
                ref.current.textContent = latest.toFixed(0) + "%";
            }
        });
        return () => unsubscribe();
    }, [springValue]);

    return <span ref={ref} className="font-mono tabular-nums">0%</span>;
}
