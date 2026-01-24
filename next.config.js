/** @type {import('next').NextConfig} */

const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
    output: 'export', // Enable static export for GitHub Pages
    trailingSlash: true, // Required for GitHub Pages routing
    images: {
        unoptimized: true, // Required for static export
    },
    // Only apply basePath in production (for GitHub Pages)
    basePath: isProd ? '/LandingPageHydre' : '',
    assetPrefix: isProd ? '/LandingPageHydre/' : '',
    reactStrictMode: true,
    // Enable experimental features for better 3D performance
    experimental: {
        optimizePackageImports: ['framer-motion', '@react-three/drei'],
    },
};

module.exports = nextConfig;
