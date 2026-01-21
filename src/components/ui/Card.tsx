'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
    children: ReactNode;
    className?: string;
    glass?: boolean;
    hover?: boolean;
}

export function Card({ children, className, glass = false, hover = false }: CardProps) {
    return (
        <div
            className={cn(
                'rounded-xl p-6 transition-all duration-300',
                glass
                    ? 'bg-charcoal-700/60 backdrop-blur-lg border border-charcoal-600/50 shadow-soft'
                    : 'bg-charcoal-800 shadow-lg border border-charcoal-700',
                hover && 'hover:scale-[1.02] hover:shadow-xl hover:border-orange-600/30 cursor-pointer',
                className
            )}
        >
            {children}
        </div>
    );
}

interface IngredientCardProps {
    name: string;
    amount: string;
    description: string;
    icon: string;
    accentColor?: 'orange' | 'lab';
}

export function IngredientCard({
    name,
    amount,
    description,
    icon,
    accentColor = 'orange'
}: IngredientCardProps) {
    const colors = {
        orange: 'from-orange-600 to-orange-500',
        lab: 'from-lab-600 to-lab-500',
    };

    const textColors = {
        orange: 'text-orange-500',
        lab: 'text-lab-400',
    };

    const glows = {
        orange: 'group-hover:shadow-glow-orange',
        lab: 'group-hover:shadow-glow-lab',
    };

    return (
        <Card glass hover className={cn('group', glows[accentColor])}>
            <div className="flex items-start gap-4">
                <div
                    className={cn(
                        'w-12 h-12 rounded-lg flex items-center justify-center',
                        'bg-gradient-to-br text-white font-bold text-lg',
                        'transform group-hover:scale-110 transition-transform duration-300',
                        colors[accentColor]
                    )}
                >
                    {icon}
                </div>
                <div className="flex-1">
                    <div className="flex items-baseline justify-between">
                        <h3 className="font-sans font-semibold text-lg text-charcoal-50">{name}</h3>
                        <span className={cn('text-sm font-medium', textColors[accentColor])}>{amount}</span>
                    </div>
                    <p className="mt-1 text-sm text-charcoal-50/50">{description}</p>
                </div>
            </div>
        </Card>
    );
}
