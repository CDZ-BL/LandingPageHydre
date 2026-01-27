'use client';

import { Header } from '@/components/layout/Header';
import { DarkWaterBackground } from '@/components/effects/DarkWaterBackground';
import { Footer } from '@/components/layout/Footer';
import { HeroVoid } from '@/components/sections/Hero3D';
import { TheProblem } from '@/components/sections/TheProblem';
import { GlitchOverride } from '@/components/sections/GlitchOverride';
import { TheSpecs } from '@/components/sections/TheSpecs';
import { ThePhilosophy } from '@/components/sections/ThePhilosophy';
import { FounderStatus } from '@/components/sections/FounderStatus';
import { TheClose } from '@/components/sections/TheClose';

export default function Home() {
    return (
        <main className="min-h-screen relative">
            <DarkWaterBackground />
            <Header />

            {/* Block 1: Hero */}
            <HeroVoid />

            {/* Block 2: The Problem */}
            <TheProblem />

            {/* Block 3: The Specs */}
            <TheSpecs />

            {/* Block 4: Glitch Override - System Bug */}
            <GlitchOverride />

            {/* Block 5: The Philosophy */}
            <ThePhilosophy />

            {/* Block 5: Founder Status */}
            <FounderStatus />

            {/* Block 6: The Close */}
            <TheClose />

            <Footer />
        </main>
    );
}
