'use client';

import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TacticalGlassProps {
    children: ReactNode;
    className?: string;
    scanLine?: boolean;
    hudBrackets?: boolean;
    label?: string;
}

export function TacticalGlass({
    children,
    className,
    scanLine = false,
    hudBrackets = true,
    label,
}: TacticalGlassProps) {
    return (
        <div
            className={cn(
                'tactical-glass p-6',
                scanLine && 'scan-overlay',
                hudBrackets && 'hud-brackets',
                className
            )}
        >
            {label && (
                <div className="absolute -top-3 left-4 px-2 py-0.5 bg-void">
                    <span className="coordinate-display">[{label}]</span>
                </div>
            )}
            {children}

            {/* Additional corner brackets for full HUD effect */}
            {hudBrackets && (
                <>
                    <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-neon-cyan/50" />
                    <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-neon-cyan/50" />
                </>
            )}
        </div>
    );
}

// Compact variant for inline data displays
export function TacticalReadout({
    label,
    value,
    className,
}: {
    label: string;
    value: string | number;
    className?: string;
}) {
    return (
        <div className={cn('telemetry', className)}>
            <span className="text-void-500">{label}:</span>{' '}
            <span className="text-neon-cyan">{value}</span>
        </div>
    );
}

// Status indicator with pulsing dot
export function SystemStatus({
    status = 'ONLINE',
    className,
}: {
    status?: string;
    className?: string;
}) {
    return (
        <div className={cn('status-indicator coordinate-display', className)}>
            {status}
        </div>
    );
}
