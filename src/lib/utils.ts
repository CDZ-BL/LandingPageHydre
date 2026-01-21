// Simple class name merger utility (no external dependency)
export function cn(...inputs: (string | undefined | null | false | Record<string, boolean>)[]): string {
    return inputs
        .flatMap(input => {
            if (!input) return [];
            if (typeof input === 'string') return [input];
            return Object.entries(input)
                .filter(([, value]) => value)
                .map(([key]) => key);
        })
        .join(' ');
}

// Detect low-power mode based on device capabilities
export function detectLowPowerMode(): boolean {
    if (typeof window === 'undefined') return false;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Check device memory (if available)
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowMemory = nav.deviceMemory ? nav.deviceMemory < 4 : false;

    // Check hardware concurrency
    const lowCores = navigator.hardwareConcurrency ? navigator.hardwareConcurrency < 4 : false;

    return prefersReducedMotion || lowMemory || lowCores;
}

// Format large numbers with commas
export function formatNumber(num: number): string {
    return new Intl.NumberFormat('en-US').format(num);
}

// Smooth scroll to element
export function scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => void>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}
