'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FOUNDERS_CLAIMS } from '@/constants/claims';

const emailSchema = z.object({
    email: z.string().email('Format email invalide'),
});

type EmailFormData = z.infer<typeof emailSchema>;

interface FoundersCardProps {
    selectedFlavor: string;
    onClose: () => void;
}

export function FoundersCard({ selectedFlavor, onClose }: FoundersCardProps) {
    const [agentNumber, setAgentNumber] = useState('000');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    });

    // Generate random agent number on mount
    useEffect(() => {
        const num = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        setAgentNumber(num);
    }, []);

    const onSubmit = async (data: EmailFormData) => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log('Founder registered:', { email: data.email, agentNumber, flavor: selectedFlavor });
        setIsSubmitted(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/90 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="founders-card w-full max-w-md p-8 md:p-10"
            >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <p className="font-data text-void-600 text-xs mb-1">{FOUNDERS_CLAIMS.cardLabel}</p>
                        <h3 className="font-display text-2xl text-white">AETHER</h3>
                    </div>
                    <div className="text-right">
                        <p className="font-data text-void-600 text-xs mb-1">{FOUNDERS_CLAIMS.agentLabel}</p>
                        <p className="font-mono text-2xl text-white">#{agentNumber}</p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-dashed border-void-300 my-6" />

                {!isSubmitted ? (
                    <>
                        {/* Benefits */}
                        <div className="space-y-3 mb-8">
                            <div className="flex justify-between font-data text-xs">
                                <span className="text-void-600">{FOUNDERS_CLAIMS.statusLabel}</span>
                                <span className="text-neon-orange">{FOUNDERS_CLAIMS.statusValue}</span>
                            </div>
                            <div className="flex justify-between font-data text-xs">
                                <span className="text-void-600">{FOUNDERS_CLAIMS.discountLabel}</span>
                                <span className="text-white">{FOUNDERS_CLAIMS.discountValue}</span>
                            </div>
                            <div className="flex justify-between font-data text-xs">
                                <span className="text-void-600">{FOUNDERS_CLAIMS.flavorLabel}</span>
                                <span className="text-white">{selectedFlavor.toUpperCase()}</span>
                            </div>
                            <div className="flex justify-between font-data text-xs">
                                <span className="text-void-600">{FOUNDERS_CLAIMS.deliveryLabel}</span>
                                <span className="text-white">{FOUNDERS_CLAIMS.deliveryValue}</span>
                            </div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="font-data text-void-500 text-xs block mb-2">
                                    {FOUNDERS_CLAIMS.emailLabel}
                                </label>
                                <input
                                    type="email"
                                    placeholder={FOUNDERS_CLAIMS.emailPlaceholder}
                                    className="terminal-input"
                                    autoFocus
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="font-data text-xs text-red-500 mt-2">{errors.email.message}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-white text-void font-display text-sm tracking-widest
                           hover:bg-void-800 hover:text-white transition-colors disabled:opacity-50"
                            >
                                {isSubmitting ? FOUNDERS_CLAIMS.processing : FOUNDERS_CLAIMS.ctaButton}
                            </button>
                        </form>

                        {/* Legal */}
                        <p className="font-data text-void-500 text-[10px] text-center mt-6 leading-relaxed">
                            {FOUNDERS_CLAIMS.legalText}
                        </p>
                    </>
                ) : (
                    /* Success State */
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-8"
                    >
                        <div className="font-display text-4xl text-white mb-4">✓</div>
                        <h4 className="font-display text-xl text-white mb-2">{FOUNDERS_CLAIMS.welcomeTitle} #{agentNumber}</h4>
                        <p className="font-data text-void-600 text-sm mb-6">
                            {FOUNDERS_CLAIMS.welcomeMessage}
                        </p>
                        <button
                            onClick={onClose}
                            className="px-6 py-3 border border-void-300 text-white font-display text-xs tracking-widest
                         hover:bg-white hover:text-void transition-all"
                        >
                            {FOUNDERS_CLAIMS.continueButton}
                        </button>
                    </motion.div>
                )}

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 font-data text-void-500 hover:text-white transition-colors"
                >
                    ✕
                </button>
            </motion.div>
        </motion.div>
    );
}
