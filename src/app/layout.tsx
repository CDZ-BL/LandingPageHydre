import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { JetBrains_Mono } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { LenisProvider } from '@/components/providers/LenisProvider';
import './globals.css';

// CLASH DISPLAY - Headlines (Local from Fontshare)
const clashDisplay = localFont({
    src: [
        {
            path: '../../public/fonts/ClashDisplay-Regular.woff2',
            weight: '400',
            style: 'normal',
        },
        {
            path: '../../public/fonts/ClashDisplay-Semibold.woff2',
            weight: '600',
            style: 'normal',
        },
        {
            path: '../../public/fonts/ClashDisplay-Bold.woff2',
            weight: '700',
            style: 'normal',
        },
    ],
    variable: '--font-clash',
    display: 'swap',
});

// JETBRAINS MONO - Technical Data
const jetbrains = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'AETHER | Pre-Launch Experience',
    description: 'High-performance electrolytes. Ionic precision for elite athletes. Join the Founders Circle.',
    keywords: ['electrolytes', 'sports nutrition', 'Hyrox', 'CrossFit', 'hydration', 'performance'],
    authors: [{ name: 'AETHER' }],
    openGraph: {
        title: 'AETHER | Ionic Precision',
        description: 'The anti-bullshit electrolyte. Full-dose, fully transparent.',
        type: 'website',
        locale: 'en_US',
    },
    robots: {
        index: true,
        follow: true,
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    themeColor: '#050505',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" className={`${clashDisplay.variable} ${jetbrains.variable} ${GeistSans.variable}`}>
            <body className="antialiased bg-obsidian text-white/85">
                <LenisProvider>
                    {children}
                </LenisProvider>
            </body>
        </html>
    );
}
