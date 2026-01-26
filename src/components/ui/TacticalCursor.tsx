'use client';

import { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { cn } from '@/lib/utils';

export function TacticalCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const [targetType, setTargetType] = useState<string>('NEUTRAL');

    // Smooth mouse movement
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);
    const springConfig = { damping: 25, stiffness: 700 };
    const springX = useSpring(cursorX, springConfig);
    const springY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX);
            cursorY.set(e.clientY);
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isClickable =
                target.tagName === 'BUTTON' ||
                target.tagName === 'A' ||
                target.closest('button') ||
                target.closest('a') ||
                target.hasAttribute('data-tactical-target');

            if (isClickable) {
                setIsHovering(true);
                const tag = target.tagName.toLowerCase();
                setTargetType(tag === 'a' ? 'LINK' : tag === 'button' ? 'ACTION' : 'TARGET');
            } else {
                setIsHovering(false);
                setTargetType('NEUTRAL');
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        // Hide default cursor
        document.body.style.cursor = 'none';

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
            document.body.style.cursor = 'auto'; // Restore on unmount
        };
    }, [cursorX, cursorY]);

    return (
        <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[100] mix-blend-screen"
            style={{
                x: springX,
                y: springY,
                translateX: '-50%',
                translateY: '-50%',
            }}
        >
            {/* Main Crosshair */}
            <div className="relative flex items-center justify-center">
                {/* Center dot */}
                <motion.div
                    animate={{
                        scale: isHovering ? 0.5 : 1,
                        backgroundColor: isHovering ? '#00F0FF' : 'rgba(0, 240, 255, 0.5)'
                    }}
                    className="w-1 h-1 rounded-full bg-neon-cyan"
                />

                {/* Rotating Ring */}
                <motion.div
                    animate={{
                        scale: isHovering ? 1.5 : 1,
                        rotate: isHovering ? 180 : 0,
                        borderColor: isHovering ? '#00F0FF' : 'rgba(0, 240, 255, 0.3)'
                    }}
                    className="absolute w-8 h-8 border border-neon-cyan/30 rounded-full"
                    style={{ borderStyle: 'dashed', borderWidth: '1px' }}
                />

                {/* Corner Brackets */}
                <motion.div
                    animate={{
                        scale: isHovering ? 0.8 : 1.2,
                        opacity: isHovering ? 1 : 0.5
                    }}
                    className="absolute inset-0 w-12 h-12 -ml-2 -mt-2"
                >
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-cyan" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neon-cyan" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neon-cyan" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neon-cyan" />
                </motion.div>

                {/* Scan Line effect on hover */}
                {isHovering && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute w-20 h-[1px] bg-neon-cyan/50"
                    />
                )}
            </div>

            {/* Metadata Floater */}
            <motion.div
                animate={{
                    opacity: 1,
                    x: 20,
                    y: 20
                }}
                className="absolute top-0 left-0"
            >
                <div className="flex flex-col gap-0.5 bg-void/80 backdrop-blur-sm p-1.5 border border-neon-cyan/20">
                    <span className="font-mono text-[8px] text-neon-cyan/60 tracking-wider whitespace-nowrap">
                        TGT: {targetType}
                    </span>
                    <span className="font-mono text-[8px] text-neon-cyan/40 tracking-wider">
                        {Math.floor(cursorX.get() || 0)}.{Math.floor(cursorY.get() || 0)}
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
}
