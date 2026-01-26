import type { Metadata } from 'next';
import { Cinzel, JetBrains_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
    subsets: ['latin'],
    variable: '--font-cinzel',
    display: 'swap',
});

const jetbrains = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
});

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    variable: '--font-jakarta',
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

// Next.js 13.5 prefers simple object for viewport if Viewport type is not found
export const themeColor = '#050505';

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};

import { TacticalCursor } from '@/components/ui/TacticalCursor';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className={`${cinzel.variable} ${jetbrains.variable} ${plusJakarta.variable}`}>
            <body className="antialiased bg-void text-void-950">
                <TacticalCursor />
                {children}
            </body>
        </html>
    );
}
