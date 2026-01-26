'use client';

import { TacticalNavigation } from '@/components/ui/TacticalNavigation';
import { DataGridBackground } from '@/components/effects/DataGridBackground';
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
        <main className="min-h-screen bg-void relative">
            {/* FUI Data Grid Background with radar pulse */}
            <DataGridBackground enableRadarPulse density="normal" />

            {/* Tactical Navigation HUD */}
            <TacticalNavigation />

            {/* Block 1: Hero */}
            <HeroVoid />

            {/* Block 2: The Problem */}
            <TheProblem />

            {/* Block 3: Glitch Override */}
            <GlitchOverride />

            {/* Block 4: The Specs */}
            <TheSpecs />

            {/* Block 4: The Philosophy */}
            <ThePhilosophy />

            {/* Block 5: Founder Status */}
            <FounderStatus />

            {/* Block 6: The Close */}
            <TheClose />

            <Footer />
        </main>
    );
}

