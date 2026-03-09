import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroVoid } from '@/components/sections/01_Hero3D';
import { SystemFailure } from '@/components/sections/02_SystemFailure';
import { CarouselHub } from '@/components/sections/CarouselHub';
import { Alliance } from '@/components/sections/07_Alliance';
import { Roadmap } from '@/components/sections/09_Roadmap';
import { TheClose } from '@/components/sections/10_TheClose';
import { FixedProductCanvas } from '@/components/three/FixedProductCanvas';

export default function Home() {
    return (
        <main className="min-h-screen bg-void">
            <Header />

            {/* ━━━ VIEWPORT-FIXED 3D PRODUCT OVERLAY ━━━━━━━━━━━━━━━━ */}
            <FixedProductCanvas />

            {/* Block 1: Architecture Hero */}
            <HeroVoid />

            {/* Block 2: System Failure (Glitch) */}
            <SystemFailure />

            {/* Block 3-5: Carousel Hub (Analyse + Engagement + Formule) */}
            <section id="specs">
                <CarouselHub />
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
