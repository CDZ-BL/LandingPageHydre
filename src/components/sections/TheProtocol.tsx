'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export function TheProtocol() {
    const [downloadCount, setDownloadCount] = useState(1247); // Default value

    // Set random count only on client side to avoid hydration mismatch
    useEffect(() => {
        setDownloadCount(Math.floor(Math.random() * 500) + 1247);
    }, []);

    const handleDownload = () => {
        // In production, this would track the download
        console.log('Protocol downloaded');
        // For now, we'll create a placeholder
        alert('Le protocole sera bientôt disponible au téléchargement.');
    };

    return (
        <section id="protocol" className="relative py-32 bg-void overflow-hidden">
            {/* Tactical grid overlay */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
                    `,
                    backgroundSize: '40px 40px',
                }}
            />

            <div className="relative z-10 w-[85%] max-w-[1200px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                    className="border border-void-300 p-12 md:p-16"
                >
                    {/* Classification Header */}
                    <div className="flex justify-between items-start mb-8 pb-6 border-b border-dashed border-void-300">
                        <div>
                            <span className="font-data text-red-500 text-xs font-bold tracking-wider">DOCUMENT TACTIQUE</span>
                            <h2 className="font-display text-4xl md:text-5xl text-white mt-2">
                                LE PROTOCOLE
                            </h2>
                        </div>
                        <div className="text-right">
                            <span className="font-data text-white text-xs">CLASSÉ</span>
                            <div className="font-mono text-neon-orange text-sm font-semibold mt-1">FONDATEURS</div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="mb-12">
                        <h3 className="font-display text-xl text-white mb-4">
                            Protocole d'hydratation tactique pour l'effort &gt; 90min
                        </h3>
                        <p className="font-sans text-white leading-relaxed max-w-2xl">
                            Document technique déclassifié. Stratégies d'hydratation haute performance, dosages précis,
                            timing d'absorption optimisé. Aucune théorie marketing. Uniquement des protocoles testés sur le terrain.
                        </p>
                    </div>

                    {/* Document Preview Frame */}
                    <div className="border border-void-300 bg-void-50 p-8 mb-8">
                        <div className="flex items-start gap-8">
                            {/* Document Icon/Visual */}
                            <div className="flex-shrink-0">
                                <div className="w-32 h-40 border-2 border-white bg-void flex flex-col items-center justify-center">
                                    <svg
                                        className="w-16 h-16 text-neon-orange mb-2"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <span className="font-data text-white text-xs">PDF</span>
                                </div>
                            </div>

                            {/* Document Metadata */}
                            <div className="flex-1 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-data text-white text-xs block">PAGES</span>
                                        <span className="font-mono text-white text-lg">24</span>
                                    </div>
                                    <div>
                                        <span className="font-data text-white text-xs block">TAILLE</span>
                                        <span className="font-mono text-white text-lg">2.4 MB</span>
                                    </div>
                                    <div>
                                        <span className="font-data text-white text-xs block">FORMAT</span>
                                        <span className="font-mono text-white text-lg">A4</span>
                                    </div>
                                    <div>
                                        <span className="font-data text-white text-xs block">LANGUE</span>
                                        <span className="font-mono text-white text-lg">FR</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-void-300">
                                    <span className="font-data text-white text-xs block mb-2">CONTENU</span>
                                    <ul className="space-y-1 font-sans text-sm text-white">
                                        <li>→ Physiologie de l'hydratation</li>
                                        <li>→ Protocoles par durée d'effort</li>
                                        <li>→ Dosages électrolytiques précis</li>
                                        <li>→ Timing d'absorption optimisé</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Download CTA */}
                    <div className="space-y-4">
                        <button
                            onClick={handleDownload}
                            className="w-full py-6 bg-white text-black font-display text-sm tracking-widest
                                     hover:bg-neon-orange hover:text-white transition-all duration-300
                                     flex items-center justify-center gap-3"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                />
                            </svg>
                            TÉLÉCHARGER LE PROTOCOLE
                        </button>

                        <div className="flex justify-between items-center font-data text-xs text-white">
                            <span>Accès gratuit. Aucune inscription requise.</span>
                            <span className="text-neon-orange font-semibold">{downloadCount.toLocaleString()} téléchargements</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
