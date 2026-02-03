/**
 * HYDRE V1.0 — Accessibility Utilities
 * V4.0.0-HYDRE-APEX Compliant
 * 
 * Centralized accessibility utilities for motion preferences,
 * ARIA helpers, and keyboard navigation support.
 */

'use client';

import { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// REDUCED MOTION DETECTION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook to detect user's reduced motion preference.
 * Returns true if the user prefers reduced motion.
 * 
 * @example
 * const prefersReducedMotion = usePrefersReducedMotion();
 * if (prefersReducedMotion) {
 *   // Show static alternative
 * }
 */
export function usePrefersReducedMotion(): boolean {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

    useEffect(() => {
        // Check if window is available (SSR safety)
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        // Set initial value
        setPrefersReducedMotion(mediaQuery.matches);

        // Listen for changes
        const handleChange = (event: MediaQueryListEvent) => {
            setPrefersReducedMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    return prefersReducedMotion;
}

/**
 * Synchronous check for reduced motion preference.
 * Use this in non-hook contexts (e.g., initial render decisions).
 */
export function getPrefersReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// ═══════════════════════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook to handle keyboard interactions for custom interactive elements.
 * Provides Enter and Space key handlers for accessibility.
 */
export function useKeyboardInteraction(
    onActivate: () => void,
    isDisabled = false
) {
    const handleKeyDown = useCallback(
        (event: React.KeyboardEvent) => {
            if (isDisabled) return;

            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onActivate();
            }
        },
        [onActivate, isDisabled]
    );

    return { onKeyDown: handleKeyDown };
}

/**
 * Props to make a div behave like a button for accessibility.
 */
export interface AccessibleButtonProps {
    role: 'button';
    tabIndex: number;
    'aria-disabled'?: boolean;
    onKeyDown: (event: React.KeyboardEvent) => void;
}

/**
 * Generate accessible button props for non-button interactive elements.
 */
export function getAccessibleButtonProps(
    onActivate: () => void,
    ariaLabel: string,
    isDisabled = false
): AccessibleButtonProps & { 'aria-label': string; onClick: () => void } {
    return {
        role: 'button',
        tabIndex: isDisabled ? -1 : 0,
        'aria-label': ariaLabel,
        'aria-disabled': isDisabled || undefined,
        onClick: isDisabled ? () => { } : onActivate,
        onKeyDown: (event: React.KeyboardEvent) => {
            if (isDisabled) return;
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onActivate();
            }
        },
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// FOCUS MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Hook to trap focus within a container (for modals, dialogs).
 */
export function useFocusTrap(isActive: boolean) {
    useEffect(() => {
        if (!isActive) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') return;

            const focusableElements = document.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            const focusableArray = Array.from(focusableElements) as HTMLElement[];
            const firstElement = focusableArray[0];
            const lastElement = focusableArray[focusableArray.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement?.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isActive]);
}

// ═══════════════════════════════════════════════════════════════════════════
// SCREEN READER UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Announce a message to screen readers.
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement is read
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ═══════════════════════════════════════════════════════════════════════════
// ARIA HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate unique ID for ARIA relationships.
 */
let idCounter = 0;
export function generateAriaId(prefix = 'hydre'): string {
    return `${prefix}-${++idCounter}`;
}

/**
 * Props for describing an element with another.
 */
export function getAriaDescribedBy(
    describerId: string,
    description: string
): { 'aria-describedby': string; describer: { id: string; children: string } } {
    return {
        'aria-describedby': describerId,
        describer: {
            id: describerId,
            children: description,
        },
    };
}

// ═══════════════════════════════════════════════════════════════════════════
// MOTION-SAFE ANIMATION WRAPPER
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Get animation props that respect reduced motion preferences.
 * Returns empty animation for users who prefer reduced motion.
 */
export function getMotionSafeAnimation<T extends Record<string, unknown>>(
    animation: T,
    staticFallback: Partial<T> = {}
): T | Partial<T> {
    if (getPrefersReducedMotion()) {
        return staticFallback;
    }
    return animation;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * CSS class for visually hidden but screen-reader accessible content.
 */
export const SR_ONLY_CLASS = 'sr-only';

/**
 * CSS for sr-only class (add to globals.css if not present).
 */
export const SR_ONLY_CSS = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
