'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroVoid } from '@/components/sections/Hero3D';
import { EducationSection } from '@/components/sections/BenefitsSection';
import { AICoach } from '@/components/sections/ProductShowcase';
import { FlavorBattle } from '@/components/sections/FlavorBattle';
import { FoundersCard } from '@/components/sections/FoundersCard';

export default function Home() {
    const [showFoundersCard, setShowFoundersCard] = useState(false);
    const [selectedFlavor, setSelectedFlavor] = useState('');

    const handleFlavorComplete = (flavor: string) => {
        setSelectedFlavor(flavor);
        setShowFoundersCard(true);
    };

    return (
        <main className="min-h-screen bg-void">
            <Header />

            {/* Hero - The Void */}
            <HeroVoid />

            {/* Education - Anti-Bullshit Scroll */}
            <EducationSection />

            {/* AI Coach - AETHER Intelligence */}
            <AICoach />

            {/* Flavor Battle - Gamification */}
            <FlavorBattle onComplete={handleFlavorComplete} />

            <Footer />

            {/* Founders Card Modal */}
            <AnimatePresence>
                {showFoundersCard && (
                    <FoundersCard
                        selectedFlavor={selectedFlavor}
                        onClose={() => setShowFoundersCard(false)}
                    />
                )}
            </AnimatePresence>
        </main>
    );
}
