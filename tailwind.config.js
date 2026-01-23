/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // AETHER Monochrome Palette - Improved Luminosity
                void: {
                    DEFAULT: '#050505',
                    50: '#0D0D0D',
                    100: '#151515',
                    200: '#222222',
                    300: '#333333',
                    400: '#555555',
                    500: '#777777',
                    600: '#999999',  // Brighter muted text
                    700: '#BBBBBB',  // Brighter secondary text
                    800: '#DDDDDD',  // Brighter text
                    900: '#EEEEEE',  // Near white
                    950: '#FFFFFF',  // Pure white for headings
                },
                // Accent colors - ONLY for product imagery
                neon: {
                    orange: '#FF6B00',
                    purple: '#9B30FF',
                    yellow: '#CCFF00',
                    lime: '#39FF14',
                },
            },
            fontFamily: {
                display: ['var(--font-cinzel)', 'serif'],
                data: ['var(--font-jetbrains)', 'monospace'],
                mono: ['var(--font-jetbrains)', 'monospace'],
                sans: ['var(--font-jakarta)', 'system-ui', 'sans-serif'],
            },
            animation: {
                'marquee': 'marquee 40s linear infinite',
                'glitch': 'glitch 0.3s ease-in-out',
                'pulse-slow': 'pulse 3s ease-in-out infinite',
                'float': 'float 6s ease-in-out infinite',
                'particle-explode': 'particle-explode 0.6s ease-out forwards',
                'fade-up': 'fade-up 0.6s ease-out forwards',
                'reveal': 'reveal 0.8s ease-out forwards',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
                glitch: {
                    '0%, 100%': { transform: 'translate(0)', opacity: '1' },
                    '20%': { transform: 'translate(-2px, 2px)', opacity: '0.8' },
                    '40%': { transform: 'translate(2px, -2px)', opacity: '0.9' },
                    '60%': { transform: 'translate(-1px, 1px)', opacity: '0.8' },
                    '80%': { transform: 'translate(1px, -1px)', opacity: '0.9' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                'particle-explode': {
                    '0%': { transform: 'scale(1)', opacity: '1' },
                    '100%': { transform: 'scale(2)', opacity: '0' },
                },
                'fade-up': {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                reveal: {
                    '0%': { opacity: '0', transform: 'translateY(30px)', filter: 'blur(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
                },
            },
            backgroundImage: {
                'gradient-void': 'linear-gradient(180deg, #050505 0%, #111111 50%, #050505 100%)',
                'gradient-radial': 'radial-gradient(circle at center, #1A1A1A 0%, #050505 70%)',
            },
            boxShadow: {
                'glow': '0 0 60px rgba(255, 107, 0, 0.15)',
                'inner-glow': 'inset 0 0 30px rgba(255, 255, 255, 0.05)',
            },
        },
    },
    plugins: [],
};
