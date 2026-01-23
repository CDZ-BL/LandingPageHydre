'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { FLAVOR_BATTLE_CLAIMS } from '@/constants/claims';

interface Flavor {
    id: string;
    name: string;
    image: string;
    color: string;
    taps: number;
    maxTaps: number;
}

const INITIAL_FLAVORS: Flavor[] = [
    {
        id: 'citrus',
        name: 'CITRUS VOLT',
        image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&h=400&fit=crop',
        color: '#FFD700',
        taps: 0,
        maxTaps: 15,
    },
    {
        id: 'berry',
        name: 'BAIES NOIRES',
        image: 'https://images.unsplash.com/photo-1425934398893-310a009a77f9?w=400&h=400&fit=crop',
        color: '#9B30FF',
        taps: 0,
        maxTaps: 15,
    },
    {
        id: 'lime',
        name: 'CITRON VERT',
        image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&h=400&fit=crop',
        color: '#39FF14',
        taps: 0,
        maxTaps: 15,
    },
];

// Particle component for explosion effect
function Particles({ color, count = 20 }: { color: string; count?: number }) {
    return (
        <div className="absolute inset-0 pointer-events-none">
            {[...Array(count)].map((_, i) => {
                const angle = (i / count) * 360;
                const distance = 100 + Math.random() * 100;
                const tx = Math.cos((angle * Math.PI) / 180) * distance;
                const ty = Math.sin((angle * Math.PI) / 180) * distance;

                return (
                    <motion.div
                        key={i}
                        className="absolute left-1/2 top-1/2 w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                        animate={{ x: tx, y: ty, scale: 0, opacity: 0 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                );
            })}
        </div>
    );
}

interface FlavorCardProps {
    flavor: Flavor;
    onTap: () => void;
    isCompleted: boolean;
    isWinner: boolean;
}

function FlavorCard({ flavor, onTap, isCompleted, isWinner }: FlavorCardProps) {
    const progress = (flavor.taps / flavor.maxTaps) * 100;
    const [showParticles, setShowParticles] = useState(false);

    const handleClick = () => {
        if (isCompleted) return;
        onTap();

        if (flavor.taps + 1 >= flavor.maxTaps) {
            setShowParticles(true);
        }
    };

    return (
        <motion.div
            className={`relative cursor-pointer select-none ${isCompleted && !isWinner ? 'opacity-30' : ''}`}
            whileTap={{ scale: 0.95 }}
            onClick={handleClick}
        >
            {/* Card */}
            <div className="relative border border-void-300 p-6 bg-void transition-all duration-300 hover:border-void-400">
                {/* Image */}
                <div className="relative w-full aspect-square mb-6 overflow-hidden">
                    <Image
                        src={flavor.image}
                        alt={flavor.name}
                        fill
                        className={`object-cover transition-all duration-300 ${isWinner ? 'scale-110' : ''}`}
                    />

                    {/* Overlay on completion */}
                    {isWinner && (
                        <div
                            className="absolute inset-0 mix-blend-overlay"
                            style={{ backgroundColor: flavor.color, opacity: 0.3 }}
                        />
                    )}

                    {/* Particles */}
                    {showParticles && <Particles color={flavor.color} />}
                </div>

                {/* Name */}
                <h3 className="font-display text-lg text-white mb-4">{flavor.name}</h3>

                {/* Progress */}
                <div className="space-y-2">
                    <div className="flex justify-between font-data text-xs">
                        <span className="text-white">{flavor.taps}/{flavor.maxTaps}</span>
                        <span className="text-white">{FLAVOR_BATTLE_CLAIMS.tapsLabel}</span>
                    </div>
                    <div className="h-1 bg-void-200">
                        <motion.div
                            className="h-full"
                            style={{ backgroundColor: flavor.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: 'spring', stiffness: 300 }}
                        />
                    </div>
                </div>

                {/* Winner badge */}
                {isWinner && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute -top-3 -right-3 px-3 py-1 font-data text-xs text-void"
                        style={{ backgroundColor: flavor.color }}
                    >
                        {FLAVOR_BATTLE_CLAIMS.selectedLabel}
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

interface FlavorBattleProps {
    onComplete: (flavor: string) => void;
}

export function FlavorBattle({ onComplete }: FlavorBattleProps) {
    const [flavors, setFlavors] = useState<Flavor[]>(INITIAL_FLAVORS);
    const [winner, setWinner] = useState<string | null>(null);

    const handleTap = useCallback((flavorId: string) => {
        if (winner) return;

        setFlavors((prev) => {
            const updated = prev.map((f) => {
                if (f.id === flavorId) {
                    const newTaps = f.taps + 1;
                    if (newTaps >= f.maxTaps) {
                        setWinner(flavorId);
                        setTimeout(() => onComplete(flavorId), 1500);
                    }
                    return { ...f, taps: newTaps };
                }
                return f;
            });
            return updated;
        });
    }, [winner, onComplete]);

    return (
        <section id="flavor-battle" className="relative min-h-screen py-32 bg-void">
            <div className="relative z-10 w-[85%] max-w-[1600px] mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="font-data text-void-900 mb-4">{FLAVOR_BATTLE_CLAIMS.sectionLabel}</p>
                    <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
                        {FLAVOR_BATTLE_CLAIMS.headline}
                    </h2>
                    <p className="font-data text-void-900 max-w-md mx-auto">
                        {FLAVOR_BATTLE_CLAIMS.description}
                    </p>
                </motion.div>

                {/* Flavor Cards */}
                <div className="grid md:grid-cols-3 gap-6">
                    {flavors.map((flavor) => (
                        <FlavorCard
                            key={flavor.id}
                            flavor={flavor}
                            onTap={() => handleTap(flavor.id)}
                            isCompleted={winner !== null}
                            isWinner={winner === flavor.id}
                        />
                    ))}
                </div>

                {/* Winner announcement */}
                <AnimatePresence>
                    {winner && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mt-12"
                        >
                            <p className="font-display text-2xl text-white">
                                {FLAVOR_BATTLE_CLAIMS.flavorLocked} {flavors.find(f => f.id === winner)?.name}
                            </p>
                            <p className="font-data text-void-900 mt-2">
                                {FLAVOR_BATTLE_CLAIMS.proceedingText}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

