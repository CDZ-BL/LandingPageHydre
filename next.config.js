/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Enable static export for GitHub Pages
    trailingSlash: true, // Required for GitHub Pages routing
    images: {
        unoptimized: true, // Required for static export
    },
    basePath: '/LandingPageHydre', // Your GitHub repo name
    assetPrefix: '/LandingPageHydre/', // Required for assets to load correctly
    reactStrictMode: true,
    // Enable experimental features for better 3D performance
    experimental: {
        optimizePackageImports: ['framer-motion', '@react-three/drei'],
    },
};

module.exports = nextConfig;
