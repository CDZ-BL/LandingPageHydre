import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { HeroVoid } from '@/components/sections/Hero3D';
import { SystemFailure } from '@/components/sections/SystemFailure';
import { ThePact } from '@/components/sections/ThePact';
import { TheSpecs } from '@/components/sections/TheSpecs';
import { ProductVision } from '@/components/sections/ProductVision';
import { Reciprocity } from '@/components/sections/Reciprocity';
import { FounderCircle } from '@/components/sections/FounderCircle';
import { Roadmap } from '@/components/sections/Roadmap';
import { TheClose } from '@/components/sections/TheClose';

export default function Home() {
    return (
        <main className="min-h-screen bg-void">
            <Header />

            {/* Block 1: Architecture Hero */}
            <HeroVoid />

            {/* Block 1.5: System Failure (The Problem) */}
            <SystemFailure />

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
