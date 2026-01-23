'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { WHY_NOW_CLAIMS, ORIGINS_CLAIMS } from '@/constants/claims';

export function EducationSection() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ['start end', 'end start'],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

    return (
        <section
            id="education"
            ref={sectionRef}
            className="relative py-32 overflow-hidden bg-void"
        >
            {/* Texture background */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            <motion.div
                style={{ opacity }}
                className="relative z-10 w-[85%] max-w-[1600px] mx-auto"
            >
                {/* WHY NOW Section - Marketing Tax */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-20"
                >
                    <p className="font-data text-void-900 mb-4">{WHY_NOW_CLAIMS.sectionLabel}</p>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-white mb-6">
                        {WHY_NOW_CLAIMS.headline}
                    </h2>
                    <p className="font-sans text-white max-w-3xl mx-auto text-lg leading-relaxed">
                        {WHY_NOW_CLAIMS.description}
                    </p>
                </motion.div>

                {/* Price Anatomy vs AETHER Protocol - Side by Side */}
                <div className="grid md:grid-cols-2 gap-8 mb-20">
                    {/* Price Anatomy - The Problem */}
                    <motion.div
                        initial={{ opacity: 0, x: -40, scale: 0.95 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
                        className="border border-void-300 p-8 md:p-10 bg-void"
                    >
                        <div className="border-b border-void-300 pb-4 mb-6">
                            <span className="font-data text-red-500 text-sm font-bold tracking-wider">LE PROBLÈME</span>
                            <h3 className="font-display text-2xl text-void-900 mt-2">
                                {WHY_NOW_CLAIMS.priceAnatomy.title}
                            </h3>
                        </div>

                        <p className="font-sans text-void-900 text-sm mb-6">
                            {WHY_NOW_CLAIMS.priceAnatomy.subtitle}
                        </p>

                        <ul className="space-y-4 mb-6">
                            {WHY_NOW_CLAIMS.priceAnatomy.points.map((point, i) => (
                                <li key={i} className="flex items-start gap-3 text-void-900">
                                    <span className="font-data text-red-500 text-xl">✗</span>
                                    <span className="font-sans text-sm">{point}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-void-300 pt-4">
                            <p className="font-data text-red-500 text-sm font-semibold">
                                {WHY_NOW_CLAIMS.priceAnatomy.conclusion}
                            </p>
                        </div>
                    </motion.div>

                    {/* AETHER Protocol - The Solution */}
                    <motion.div
                        initial={{ opacity: 0, x: 40, scale: 0.95 }}
                        whileInView={{ opacity: 1, x: 0, scale: 1 }}
                        viewport={{ once: false, margin: "-100px" }}
                        transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                        className="border border-void-300 p-8 md:p-10 bg-void-50"
                    >
                        <div className="border-b border-void-300 pb-4 mb-6">
                            <span className="font-data text-neon-orange text-sm font-bold tracking-wider">LA SOLUTION</span>
                            <h3 className="font-display text-2xl text-white mt-2">
                                {WHY_NOW_CLAIMS.protocol.title}
                            </h3>
                        </div>

                        <p className="font-sans text-white text-sm mb-6">
                            {WHY_NOW_CLAIMS.protocol.subtitle}
                        </p>

                        <ul className="space-y-5 mb-6">
                            {WHY_NOW_CLAIMS.protocol.points.map((point, i) => (
                                <li key={i} className="text-white">
                                    <div className="flex items-start gap-3">
                                        <span className="font-data text-neon-orange text-xl font-bold">✓</span>
                                        <div>
                                            <span className="font-display text-sm text-white block">{point.label}</span>
                                            <span className="font-sans text-xs text-void-900">{point.detail}</span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="border-t border-void-300 pt-4">
                            <p className="font-display text-neon-orange text-base font-semibold tracking-wide">
                                {WHY_NOW_CLAIMS.protocol.conclusion}
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Community Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
                    className="border border-void-300 p-8 text-center mb-32"
                >
                    <h3 className="font-display text-xl text-white mb-3">
                        {WHY_NOW_CLAIMS.community.title}
                    </h3>
                    <p className="font-sans text-void-900 text-sm max-w-xl mx-auto">
                        {WHY_NOW_CLAIMS.community.description}
                    </p>
                </motion.div>

                {/* ORIGINS Section - 4 Pillars */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-150px" }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-center mb-16"
                >
                    <p className="font-data text-void-900 mb-4">{ORIGINS_CLAIMS.sectionLabel}</p>
                    <h2 className="font-display text-4xl md:text-5xl text-white mb-6">
                        {ORIGINS_CLAIMS.headline}
                    </h2>
                    <p className="font-sans text-white max-w-xl mx-auto">
                        {ORIGINS_CLAIMS.description}
                    </p>
                </motion.div>

                {/* Pillars Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {ORIGINS_CLAIMS.pillars.map((pillar, index) => (
                        <motion.div
                            key={pillar.number}
                            initial={{ opacity: 0, y: 40, scale: 0.95 }}
                            whileInView={{ opacity: 1, y: 0, scale: 1 }}
                            viewport={{ once: false, margin: "-80px" }}
                            transition={{
                                duration: 0.7,
                                delay: index * 0.2,
                                ease: "easeOut"
                            }}
                            className="border border-void-300 p-8 bg-void hover:border-void-400 transition-colors group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <span className="font-display text-4xl text-white group-hover:text-neon-orange transition-colors">
                                    {pillar.number}
                                </span>
                                <span className="font-data text-xs text-white uppercase">
                                    {pillar.category}
                                </span>
                            </div>

                            <h3 className="font-display text-xl text-white mb-4">
                                {pillar.title}
                            </h3>

                            <p className="font-sans text-white text-sm mb-4 leading-relaxed">
                                {pillar.description}
                            </p>

                            <p className="font-sans text-void-900 text-sm mb-6 leading-relaxed">
                                {pillar.details}
                            </p>

                            <div className="border-t border-void-300 pt-4">
                                <p className="font-data text-neon-orange text-sm font-semibold">
                                    → {pillar.promise}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: false, margin: "-100px" }}
                    transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
                    className="grid grid-cols-3 gap-px bg-void-300 border border-void-300 mt-16"
                >
                    {[
                        { value: '1200', unit: 'MG', label: 'SODIUM' },
                        { value: '1000', unit: 'MG', label: 'POTASSIUM' },
                        { value: '500', unit: 'MG', label: 'MAGNÉSIUM' },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: false, margin: "-100px" }}
                            transition={{
                                duration: 0.5,
                                delay: 0.5 + (i * 0.1),
                                ease: "easeOut"
                            }}
                            className="bg-void p-6 md:p-8 text-center"
                        >
                            <div className="font-display text-3xl md:text-4xl text-white">
                                {stat.value}
                                <span className="text-void-900 text-lg ml-1">{stat.unit}</span>
                            </div>
                            <div className="font-data text-white text-xs mt-2">{stat.label}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}


