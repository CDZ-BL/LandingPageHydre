'use client';

import { cn } from '@/lib/utils';
import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'lab';
    size?: 'sm' | 'md' | 'lg';
    glow?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', glow = false, children, ...props }, ref) => {
        const baseStyles = `
      relative inline-flex items-center justify-center font-medium
      transition-all duration-300 ease-out
      disabled:opacity-50 disabled:pointer-events-none
      rounded-full overflow-hidden
    `;

        const variants = {
            primary: `
        bg-gradient-to-r from-orange-600 to-orange-500
        text-white hover:from-orange-500 hover:to-orange-400
        hover:scale-105 active:scale-95
        hover:shadow-glow-orange
      `,
            secondary: `
        bg-[var(--bg-surface)] text-[var(--text-primary)] border border-[var(--stroke)]
        hover:bg-[var(--bg-elevated)] hover:scale-105 active:scale-95
        hover:border-neon-orange/50
      `,
            ghost: `
        bg-transparent border border-[var(--stroke)] text-[var(--text-primary)]
        hover:bg-[var(--bg-surface)]/10 hover:border-[var(--stroke-hover)]
      `,
            lab: `
        bg-gradient-to-r from-lab-600 to-lab-500
        text-white hover:from-lab-500 hover:to-lab-400
        hover:scale-105 active:scale-95
        hover:shadow-glow-lab
      `,
        };

        const sizes = {
            sm: 'px-4 py-2 text-sm',
            md: 'px-6 py-3 text-base',
            lg: 'px-8 py-4 text-lg min-h-[44px]', /* Mobile thumb-friendly */
        };

        return (
            <button
                ref={ref}
                className={cn(
                    baseStyles,
                    variants[variant],
                    sizes[size],
                    glow && variant === 'primary' && 'shadow-glow-orange',
                    glow && variant === 'lab' && 'shadow-glow-lab',
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';

