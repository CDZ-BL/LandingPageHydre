import type { Metadata, Viewport } from 'next';
import { Instrument_Sans } from 'next/font/google';
import { JetBrains_Mono } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { LenisProvider } from '@/components/providers/LenisProvider';
import './globals.css';

// INSTRUMENT SANS — Neo-Grotesque Headlines (Clinical Swiss Authority)
const instrumentSans = Instrument_Sans({
    subsets: ['latin'],
    weight: ['400', '600', '700'],
    variable: '--font-headline',
    display: 'swap',
});

// JETBRAINS MONO - Technical Data
const jetbrains = JetBrains_Mono({
    subsets: ['latin'],
    variable: '--font-jetbrains',
    display: 'swap',
});

export const metadata: Metadata = {
    title: 'AETHER | Expérience Pré-Lancement',
    description: 'Électrolytes haute performance. Précision ionique pour athlètes exigeants. Rejoignez le Cercle des Fondateurs.',
    keywords: ['électrolytes', 'nutrition sportive', 'Hyrox', 'CrossFit', 'hydratation', 'performance', 'AETHER'],
    authors: [{ name: 'AETHER' }],
    openGraph: {
        title: 'AETHER | Précision Ionique',
        description: 'L\'anti-bullshit des électrolytes. Dosage complet, transparence totale.',
        type: 'website',
        locale: 'fr_FR',
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
        <html lang="fr" className={`${instrumentSans.variable} ${jetbrains.variable} ${GeistSans.variable}`}>
            <body className="antialiased bg-obsidian text-[#D9D9D9]">
                <LenisProvider>
                    {children}
                </LenisProvider>
            </body>
        </html>
    );
}
