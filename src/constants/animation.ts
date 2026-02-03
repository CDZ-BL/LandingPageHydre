/**
 * HYDRE V1.0 — Animation Token System
 * V4.0.0-HYDRE-APEX Compliant
 * 
 * Centralized animation constants for consistent motion design.
 * All animations should reference these tokens exclusively.
 */

// ═══════════════════════════════════════════════════════════════════════════
// EASING CURVES — Premium motion feel
// ═══════════════════════════════════════════════════════════════════════════

export const EASING = {
  /** Smooth default — natural deceleration */
  SMOOTH: 'cubic-bezier(0.25, 0.1, 0.25, 1.0)',
  
  /** Snap — bouncy, attention-grabbing */
  SNAP: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  
  /** Silk — ultra-smooth, luxury feel */
  SILK: 'cubic-bezier(0.22, 1, 0.36, 1)',
  
  /** Mercury — dramatic, cinematic */
  MERCURY: 'cubic-bezier(0.87, 0, 0.13, 1)',
  
  /** Linear — mechanical, data-driven */
  LINEAR: 'linear',
  
  /** Ease Out — quick start, slow end */
  EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
  
  /** Ease In — slow start, quick end */
  EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// DURATION TOKENS — Timing standards
// ═══════════════════════════════════════════════════════════════════════════

export const DURATION = {
  /** Micro interactions — hover states, toggles (150ms) */
  MICRO: 150,
  
  /** Fast transitions — button clicks, small reveals (300ms) */
  FAST: 300,
  
  /** Medium transitions — modal opens, section reveals (500ms) */
  MEDIUM: 500,
  
  /** Slow transitions — page transitions, major reveals (800ms) */
  SLOW: 800,
  
  /** Cinematic — hero animations, dramatic reveals (1200ms) */
  CINEMATIC: 1200,
  
  /** Epic — rare, ultra-dramatic moments (2000ms) */
  EPIC: 2000,
} as const;

// CSS string versions for direct use
export const DURATION_CSS = {
  MICRO: '150ms',
  FAST: '300ms',
  MEDIUM: '500ms',
  SLOW: '800ms',
  CINEMATIC: '1200ms',
  EPIC: '2000ms',
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// ANIMATION PRESETS — Common animation patterns
// ═══════════════════════════════════════════════════════════════════════════

export const ANIMATION_PRESET = {
  /** Fade in with upward motion */
  FADE_UP: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: DURATION.MEDIUM / 1000, ease: [0.22, 1, 0.36, 1] },
  },
  
  /** Fade in with scale */
  FADE_SCALE: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: DURATION.MEDIUM / 1000, ease: [0.22, 1, 0.36, 1] },
  },
  
  /** Fade in from left */
  FADE_LEFT: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: DURATION.MEDIUM / 1000, ease: [0.22, 1, 0.36, 1] },
  },
  
  /** Fade in from right */
  FADE_RIGHT: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: DURATION.MEDIUM / 1000, ease: [0.22, 1, 0.36, 1] },
  },
  
  /** Reveal with blur */
  REVEAL_BLUR: {
    initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    transition: { duration: DURATION.SLOW / 1000, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// STAGGER PATTERNS — Sequential animations
// ═══════════════════════════════════════════════════════════════════════════

export const STAGGER = {
  /** Tight stagger for lists (50ms) */
  TIGHT: 0.05,
  
  /** Normal stagger (100ms) */
  NORMAL: 0.1,
  
  /** Relaxed stagger (150ms) */
  RELAXED: 0.15,
  
  /** Dramatic stagger (200ms) */
  DRAMATIC: 0.2,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// CSS KEYFRAME DEFINITIONS — For globals.css
// ═══════════════════════════════════════════════════════════════════════════

export const KEYFRAMES = {
  // Screen shake effect
  SCREEN_SHAKE: `
    @keyframes screen-shake {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      2% { transform: translate(-3px, 2px) rotate(-0.5deg); }
      4% { transform: translate(3px, -2px) rotate(0.5deg); }
      6% { transform: translate(-2px, -1px) rotate(-0.3deg); }
      8% { transform: translate(2px, 1px) rotate(0.3deg); }
      10% { transform: translate(0, 0) rotate(0deg); }
      40% { transform: translate(0, 0) rotate(0deg); }
      42% { transform: translate(-4px, 3px) rotate(-0.8deg); }
      44% { transform: translate(4px, -3px) rotate(0.8deg); }
      46% { transform: translate(0, 0) rotate(0deg); }
    }
  `,
  
  // Text distortion
  TEXT_DISTORT: `
    @keyframes text-distort {
      0%, 100% { transform: translate(0, 0) skewX(0deg); filter: blur(0); }
      3% { transform: translate(-5px, 0) skewX(-3deg); filter: blur(1px); }
      6% { transform: translate(5px, 0) skewX(3deg); filter: blur(0); }
      9% { transform: translate(0, 0) skewX(0deg); }
      50% { transform: translate(0, 0) skewX(0deg); }
      53% { transform: translate(-3px, 2px) skewX(-2deg); filter: blur(2px); }
      56% { transform: translate(3px, -2px) skewX(2deg); filter: blur(0); }
      59% { transform: translate(0, 0) skewX(0deg); }
    }
  `,
  
  // Glitch effect layers
  GLITCH_HARD_1: `
    @keyframes glitch-hard-1 {
      0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
      5% { clip-path: inset(5% 0 85% 0); transform: translate(-12px, 0); }
      10% { clip-path: inset(70% 0 10% 0); transform: translate(12px, 0); }
      15% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
      30% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
      35% { clip-path: inset(40% 0 40% 0); transform: translate(-8px, 0); }
      40% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
    }
  `,
  
  GLITCH_HARD_2: `
    @keyframes glitch-hard-2 {
      0%, 100% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
      8% { clip-path: inset(60% 0 20% 0); transform: translate(14px, 0); }
      12% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
      25% { clip-path: inset(20% 0 65% 0); transform: translate(-16px, 0); }
      30% { clip-path: inset(0 0 0 0); transform: translate(0, 0); }
    }
  `,
  
  // Teleport slice effects
  TELEPORT_SLICE_1: `
    @keyframes teleport-slice-1 {
      0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
      5% { clip-path: inset(0% 0 85% 0); transform: translate(-25vw, -60px); opacity: 0.9; }
      8% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
      25% { clip-path: inset(35% 0 50% 0); transform: translate(30vw, 75px); opacity: 1; }
      28% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
    }
  `,
  
  TELEPORT_SLICE_2: `
    @keyframes teleport-slice-2 {
      0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
      12% { clip-path: inset(50% 0 35% 0); transform: translate(32vw, -70px); opacity: 1; }
      15% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
      35% { clip-path: inset(10% 0 75% 0); transform: translate(-30vw, 80px); opacity: 0.9; }
      38% { clip-path: inset(0 0 100% 0); transform: translate(0, 0); opacity: 0; }
    }
  `,
  
  TELEPORT_SLICE_3: `
    @keyframes teleport-slice-3 {
      0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) skewX(0deg); opacity: 0; }
      18% { clip-path: inset(25% 0 60% 0); transform: translate(-28vw, 70px) skewX(-15deg); opacity: 0.85; }
      21% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) skewX(0deg); opacity: 0; }
      42% { clip-path: inset(70% 0 15% 0); transform: translate(25vw, -80px) skewX(10deg); opacity: 0.9; }
      45% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) skewX(0deg); opacity: 0; }
    }
  `,
  
  TELEPORT_SLICE_4: `
    @keyframes teleport-slice-4 {
      0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) scale(1); opacity: 0; }
      8% { clip-path: inset(40% 0 45% 0); transform: translate(28vw, 85px) scale(1.2); opacity: 0.75; }
      11% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) scale(1); opacity: 0; }
      30% { clip-path: inset(80% 0 8% 0); transform: translate(-26vw, -75px) scale(0.9); opacity: 0.85; }
      33% { clip-path: inset(0 0 100% 0); transform: translate(0, 0) scale(1); opacity: 0; }
    }
  `,
  
  // Hard blink
  HARD_BLINK: `
    @keyframes hard-blink {
      0%, 100% { opacity: 1; }
      45% { opacity: 1; }
      46% { opacity: 0; }
      48% { opacity: 1; }
      49% { opacity: 0; }
      51% { opacity: 1; }
    }
  `,
  
  // Line teleport
  LINE_TELEPORT: `
    @keyframes line-teleport {
      0%, 100% { transform: translate(0, 0); opacity: 1; }
      15% { transform: translate(30px, 0); opacity: 0.3; }
      17% { transform: translate(-50px, 0); opacity: 0.8; }
      19% { transform: translate(0, 0); opacity: 1; }
      50% { transform: translate(0, 0); opacity: 1; }
      52% { transform: translate(-40px, 5px); opacity: 0.2; }
      54% { transform: translate(25px, -5px); opacity: 0.9; }
      56% { transform: translate(0, 0); opacity: 1; }
    }
  `,
  
  // Emergency flash
  EMERGENCY_FLASH: `
    @keyframes emergency-flash {
      0%, 100% { opacity: 1; text-shadow: 0 0 5px #ff0000; }
      25% { opacity: 1; text-shadow: 0 0 30px #ff0000, 0 0 60px #ff0000; }
      30% { opacity: 0.3; text-shadow: 0 0 5px #ff0000; }
      35% { opacity: 1; text-shadow: 0 0 20px #ff0000; }
    }
  `,
  
  // Noise animation
  NOISE: `
    @keyframes noise {
      0%, 100% { transform: translate(0, 0); }
      10% { transform: translate(-5%, -5%); }
      20% { transform: translate(5%, 5%); }
      30% { transform: translate(-5%, 5%); }
      40% { transform: translate(5%, -5%); }
    }
  `,
  
  // Flash out (teleport transition)
  FLASH_OUT: `
    @keyframes flash-out {
      0% { opacity: 1; }
      100% { opacity: 0; }
    }
  `,
} as const;

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Generate a CSS transition string with standardized tokens
 */
export function createTransition(
  properties: string | string[],
  duration: keyof typeof DURATION = 'MEDIUM',
  easing: keyof typeof EASING = 'SILK'
): string {
  const props = Array.isArray(properties) ? properties : [properties];
  const durationMs = DURATION[duration];
  const easingValue = EASING[easing];
  
  return props
    .map(prop => `${prop} ${durationMs}ms ${easingValue}`)
    .join(', ');
}

/**
 * Get all keyframes as a single CSS string for injection
 */
export function getAllKeyframes(): string {
  return Object.values(KEYFRAMES).join('\n');
}

// Type exports
export type EasingKey = keyof typeof EASING;
export type DurationKey = keyof typeof DURATION;
