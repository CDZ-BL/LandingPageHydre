import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroVoid } from '@/components/sections/01_Hero3D';
import { SystemFailure } from '@/components/sections/02_SystemFailure';
import { TheProblem } from '@/components/sections/03_TheProblem';
import { ThePact } from '@/components/sections/04_ThePact';
import { TheSpecs } from '@/components/sections/05_TheSpecs';
import { Alliance } from '@/components/sections/07_Alliance';
import { Roadmap } from '@/components/sections/09_Roadmap';
import { TheClose } from '@/components/sections/10_TheClose';
import { FixedProductCanvas } from '@/components/three/FixedProductCanvas';

export default function Home() {
    return (
        <main className="min-h-screen bg-void">
            <Header />

            {/* ━━━ VIEWPORT-FIXED 3D PRODUCT OVERLAY ━━━━━━━━━━━━━━━━ */}
            {/* Pinned to right 50%, persists through sections 1-2 */}
            <FixedProductCanvas />

            {/* Block 1: Architecture Hero */}
            <HeroVoid />

            {/* Visual Spacer for Aeration */}
            <div className="h-32 bg-void" />

            {/* Block 2: System Failure (Glitch) */}
            <SystemFailure />

            {/* Block 3: The Problem (Radar + Competitors) */}
            <TheProblem />

            {/* Block 4: The Pact (Value) */}
            <ThePact />

            {/* Block 5: The Specs (Product) */}
            <section id="specs">
                <TheSpecs />
            </section>

            {/* Block 6: Alliance (Reciprocity + Founder Circle) */}
            <section id="alliance">
                <Alliance />
            </section>

            {/* Block 7: Roadmap */}
            <section id="roadmap">
                <Roadmap />
            </section>

            {/* Block 8: The Close */}
            <section id="close">
                <TheClose />
            </section>

            <Footer />
        </main>
    );
}
