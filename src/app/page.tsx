import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroVoid } from '@/components/sections/01_Hero3D';
import { SystemFailure } from '@/components/sections/02_SystemFailure';
import { TheProblem } from '@/components/sections/03_TheProblem';
import { ThePact } from '@/components/sections/04_ThePact';
import { TheSpecs } from '@/components/sections/05_TheSpecs';
import { ProductVision } from '@/components/sections/06_ProductVision';
import { Reciprocity } from '@/components/sections/07_Reciprocity';
import { FounderCircle } from '@/components/sections/08_FounderCircle';
import { Roadmap } from '@/components/sections/09_Roadmap';
import { TheClose } from '@/components/sections/10_TheClose';

export default function Home() {
    return (
        <main className="min-h-screen bg-void">
            <Header />

            {/* Block 1: Architecture Hero */}
            <HeroVoid />

            {/* Block 1.5: System Failure (The Problem) */}
            <SystemFailure />

            {/* Block 1.6: The Problem (Radar + Video) */}
            <TheProblem />

            {/* Block 2: The Pact (Value) */}
            <ThePact />

            {/* Block 3: The Specs (Product) */}
            <TheSpecs />

            {/* Block 4: Product Vision (Versioning) */}
            <ProductVision />

            {/* Block 5: Reciprocity (Alliance) */}
            <Reciprocity />

            {/* Block 6: Founder Circle (Co-Creation) */}
            <FounderCircle />

            {/* Block 7: Detailed Roadmap */}
            <Roadmap />

            {/* Block 8: The Close */}
            <TheClose />

            <Footer />
        </main>
    );
}
