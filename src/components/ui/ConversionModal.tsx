'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppStore, FLAVOR_DATA, Sport } from '@/lib/store';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CONVERSION_CLAIMS, SEGMENTATION_CLAIMS } from '@/constants/claims';

const emailSchema = z.object({
    email: z.string().email('Veuillez entrer une adresse email valide'),
});

type EmailFormData = z.infer<typeof emailSchema>;

// Confetti particle component
function Confetti({ count = 50 }: { count?: number }) {
    const colors = ['#EA580C', '#2563EB', '#F97316', '#3B82F6', '#FFD700'];

    return (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {[...Array(count)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-3 h-3 rounded-sm"
                    style={{
                        left: `${Math.random() * 100}%`,
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                    }}
                    initial={{
                        y: -20,
                        rotate: 0,
                        opacity: 1,
                    }}
                    animate={{
                        y: '100vh',
                        rotate: Math.random() * 720,
                        opacity: 0,
                    }}
                    transition={{
                        duration: 2 + Math.random() * 2,
                        delay: Math.random() * 0.5,
                        ease: 'easeIn',
                    }}
                />
            ))}
        </div>
    );
}

export function ConversionModal() {
    const {
        isConversionModalOpen,
        closeConversionModal,
        selectedFlavor,
        setUserEmail,
        setUserSport,
        setIsSubmitted,
        incrementWaitlist,
        setGamePhase,
    } = useAppStore();

    const [step, setStep] = useState<'email' | 'sport' | 'success'>('email');
    const [showConfetti, setShowConfetti] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    });

    const onEmailSubmit = async (data: EmailFormData) => {
        setUserEmail(data.email);
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStep('sport');
    };

    const onSportSelect = async (sport: Sport) => {
        setUserSport(sport);
        setIsSubmitted(true);
        incrementWaitlist();
        setShowConfetti(true);
        setStep('success');
        setGamePhase('converting');
    };

    const handleClose = useCallback(() => {
        closeConversionModal();
        setShowConfetti(false);
        setStep('email');
    }, [closeConversionModal]);

    if (!isConversionModalOpen) return null;

    return (
        <>
            {showConfetti && <Confetti count={80} />}

            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-900/80 backdrop-blur-md"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="glass-card rounded-2xl p-8 max-w-lg w-full border border-orange-600/20"
                    >
                        {/* Step: Email */}
                        {step === 'email' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <div className="text-center mb-6">
                                    {selectedFlavor && (
                                        <span className="text-4xl mb-4 block">
                                            {FLAVOR_DATA[selectedFlavor].emoji}
                                        </span>
                                    )}
                                    <h3 className="font-serif text-2xl font-bold text-charcoal-50 mb-2">
                                        {CONVERSION_CLAIMS.headline}
                                    </h3>
                                    <p className="text-charcoal-50/70">
                                        {CONVERSION_CLAIMS.subheadline}
                                    </p>
                                </div>

                                {/* Incentives */}
                                <div className="grid grid-cols-3 gap-3 mb-8">
                                    {CONVERSION_CLAIMS.incentives.map((item, index) => (
                                        <motion.div
                                            key={item.title}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            className="text-center p-3 rounded-lg bg-charcoal-800/50 border border-charcoal-700"
                                        >
                                            <span className="text-2xl block mb-2">{item.icon}</span>
                                            <p className="text-sm font-medium text-charcoal-50">{item.title}</p>
                                            <p className="text-xs text-charcoal-50/50">{item.description}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                <form onSubmit={handleSubmit(onEmailSubmit)} className="space-y-4">
                                    <Input
                                        label={CONVERSION_CLAIMS.emailLabel}
                                        type="email"
                                        error={errors.email?.message}
                                        autoFocus
                                        {...register('email')}
                                    />
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Inscription...' : CONVERSION_CLAIMS.ctaEmail}
                                    </Button>
                                </form>

                                <p className="text-xs text-charcoal-50/40 mt-4 text-center">
                                    Rejoignez 5 400+ athlètes. Désabonnement possible à tout moment.
                                </p>
                            </motion.div>
                        )}

                        {/* Step: Sport Selection */}
                        {step === 'sport' && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <div className="text-center mb-6">
                                    <h3 className="font-serif text-2xl font-bold text-charcoal-50 mb-2">
                                        {SEGMENTATION_CLAIMS.title}
                                    </h3>
                                    <p className="text-charcoal-50/70">
                                        {SEGMENTATION_CLAIMS.question}
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {SEGMENTATION_CLAIMS.options.map((sport) => (
                                        <motion.button
                                            key={sport.id}
                                            onClick={() => onSportSelect(sport.id as Sport)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full p-4 rounded-xl bg-gradient-to-r ${sport.color} 
                                  text-white font-medium text-lg flex items-center gap-4
                                  hover:shadow-glow-orange transition-shadow min-h-[44px]`}
                                        >
                                            <span className="text-2xl">{sport.icon}</span>
                                            <span>{sport.name}</span>
                                        </motion.button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        setIsSubmitted(true);
                                        incrementWaitlist();
                                        setShowConfetti(true);
                                        setStep('success');
                                    }}
                                    className="w-full mt-4 text-charcoal-50/40 hover:text-charcoal-50 transition-colors text-sm"
                                >
                                    {CONVERSION_CLAIMS.ctaSkip}
                                </button>
                            </motion.div>
                        )}

                        {/* Step: Success */}
                        {step === 'success' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', duration: 0.5 }}
                                    className="w-20 h-20 rounded-full bg-gradient-orange
                             mx-auto mb-6 flex items-center justify-center text-white text-4xl"
                                >
                                    ✓
                                </motion.div>

                                <h3 className="font-serif text-2xl font-bold text-charcoal-50 mb-2">
                                    {CONVERSION_CLAIMS.successTitle}
                                </h3>
                                <p className="text-charcoal-50/70 mb-6">
                                    {CONVERSION_CLAIMS.successMessage}
                                </p>

                                <Button onClick={handleClose} variant="secondary" size="lg" className="w-full">
                                    {CONVERSION_CLAIMS.ctaContinue}
                                </Button>
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        </>
    );
}
