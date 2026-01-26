'use client';

import { cn } from '@/lib/utils';
import { forwardRef, ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'lab';
    size?: 'sm' | 'md' | 'lg';
    glow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', glow = false, children, onClick, ...props }, ref) => {
        const baseStyles = `
      relative inline-flex items-center justify-center font-medium
      transition-all duration-300 ease-out
      disabled:opacity-50 disabled:pointer-events-none
      rounded-full overflow-hidden
      group
    `;

        const variants = {
            primary: `
        bg-gradient-to-r from-neon-cyan to-neon-blue
        text-void-950 hover:from-white hover:to-neon-cyan
        hover:shadow-glow
      `,
            secondary: `
        bg-void-800 text-void-50 border border-void-600
        hover:bg-void-700 hover:border-neon-cyan/50
      `,
            ghost: `
        bg-transparent border border-void-50/30 text-void-50
        hover:bg-void-50/10 hover:border-void-50/50
      `,
            lab: `
        bg-gradient-to-r from-lab-600 to-lab-500
        text-white hover:from-lab-500 hover:to-lab-400
        hover:shadow-glow-lab
      `,
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg min-h-[44px]',
        };

        return (
            <motion.button
                ref={ref as any}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    glow && variant === 'primary' && 'shadow-glow',
                    glow && variant === 'lab' && 'shadow-glow-lab',
                    className
                )}
                whileHover={{ scale: 1.05 }}
                whileTap={{
                    scale: 0.95,
                    x: [0, -2, 2, -2, 2, 0], // Brief shake
                }}
                transition={{ duration: 0.1 }}
                onClick={onClick}
                {...(props as any)}
            >
                {/* Scan line effect on hover */}
                {variant === 'primary' && (
                    <motion.div
                        className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[wiggle_1s_ease-in-out_infinite]"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.5 }}
                    />
                )}
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

