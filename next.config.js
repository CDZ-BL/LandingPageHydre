/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        // Vercel handles image optimization natively
        formats: ['image/avif', 'image/webp'],
    },
    reactStrictMode: true,
    // Enable experimental features for better 3D performance
    experimental: {
        optimizePackageImports: ['framer-motion', '@react-three/drei'],
    },
    // ── VERCEL CACHE HEADERS ─────────────────────────────────
    // Immutable caching for static 3D assets, textures, and fonts.
    // Vercel Edge Network serves these with near-zero TTFB globally.
    async headers() {
        return [
            // ── GLOBAL SECURITY + CSP ────────────────────────────
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",
                            "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // Three.js GLSL compiler needs eval
                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
                            "font-src 'self' https://fonts.gstatic.com",
                            "img-src 'self' data: blob: https:",
                            "media-src 'self' blob:",
                            "connect-src 'self' https://*.supabase.co https://*.upstash.io https://api.resend.com",
                            "worker-src 'self' blob:",
                            "frame-src 'none'",
                        ].join('; '),
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            // ── IMMUTABLE ASSET CACHING ──────────────────────────
            {
                source: '/models/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/textures/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/videos/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
            {
                source: '/fonts/:path*',
                headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
            },
        ];
    },
};

module.exports = nextConfig;
