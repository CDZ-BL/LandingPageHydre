import type { Metadata, Viewport } from 'next';
import { Raleway, JetBrains_Mono } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import { LenisProvider } from '@/components/providers/LenisProvider';
import { AuthModal } from '@/components/ui/AuthModal';
import './globals.css';

// RALEWAY — Premium geometric sans-serif for headlines
const instrumentSans = Raleway({
    subsets: ['latin'],
    weight: ['400', '600', '700', '800', '900'],
    style: ['normal', 'italic'],
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
    title: 'Smart Nutrition | Expérience Pré-Lancement',
    description: 'Électrolytes haute performance. Précision ionique pour athlètes exigeants. Rejoignez le Cercle des Fondateurs.',
    keywords: ['électrolytes', 'nutrition sportive', 'Hyrox', 'CrossFit', 'hydratation', 'performance', 'Smart Nutrition'],
    authors: [{ name: 'Smart Nutrition' }],
    openGraph: {
        title: 'Smart Nutrition | Précision Ionique',
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
                    <AuthModal />
                </LenisProvider>
            </body>
        </html>
    );
}
