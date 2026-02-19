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
};

module.exports = nextConfig;
