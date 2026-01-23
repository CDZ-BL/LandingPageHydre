'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/lib/store';

const emailSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type EmailFormData = z.infer<typeof emailSchema>;

type Sport = 'hyrox' | 'crossfit' | 'running';

export function WaitlistCapture() {
    const [showSportModal, setShowSportModal] = useState(false);
    const {
        waitlistCount,
        isSubmitted,
        setIsSubmitted,
        setUserEmail,
        setUserSport,
        incrementWaitlist
    } = useAppStore();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
    } = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
    });

    const onEmailSubmit = async (data: EmailFormData) => {
        setUserEmail(data.email);
        setShowSportModal(true);
    };

    const onSportSelect = async (sport: Sport) => {
        setUserSport(sport);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        setShowSportModal(false);
        setIsSubmitted(true);
        incrementWaitlist();

        // Here you would integrate with Firebase/Supabase
        console.log('Submitted:', { email: getValues('email'), sport });
    };

    const sports = [
        { id: 'hyrox' as Sport, name: 'Hyrox', icon: '🏃‍♂️', color: 'from-accent-orange to-red-500' },
        { id: 'crossfit' as Sport, name: 'CrossFit', icon: '🏋️', color: 'from-blue-500 to-accent-blue' },
        { id: 'running' as Sport, name: 'Running', icon: '👟', color: 'from-green-500 to-teal-500' },
    ];

    return (
        <section
            id="waitlist"
            className="relative py-24 md:py-32 overflow-hidden"
        >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-stone-100 to-stone-200" />

            {/* Decorative elements */}
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-accent-orange/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-80 h-80 bg-accent-blue/20 rounded-full blur-3xl" />

            <div className="relative z-10 w-[85%] max-w-[1600px] mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <span className="inline-block text-accent-orange font-medium mb-4">
                        Exclusive Early Access
                    </span>

                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-charcoal mb-6">
                        Join the Waitlist
                    </h2>

                    <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-4">
                        Be the first to experience HYDRE. Get exclusive early access,
                        special launch pricing, and priority shipping.
                    </p>

                    {/* Waitlist counter */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full 
                       bg-white/60 backdrop-blur-sm border border-white/30 shadow-lg mb-12"
                    >
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-orange to-accent-blue 
                             border-2 border-white"
                                />
                            ))}
                        </div>
                        <span className="text-charcoal font-medium">
                            <span className="font-bold">{waitlistCount.toLocaleString()}</span> athletes waiting
                        </span>
                    </motion.div>
                </motion.div>

                {/* Form */}
                <AnimatePresence mode="wait">
                    {isSubmitted ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="max-w-md mx-auto text-center"
                        >
                            <div className="w-20 h-20 rounded-full bg-green-500 mx-auto mb-6 
                              flex items-center justify-center text-white text-4xl">
                                ✓
                            </div>
                            <h3 className="font-display text-2xl font-bold text-charcoal mb-4">
                                You&apos;re on the list!
                            </h3>
                            <p className="text-stone-600">
                                We&apos;ll notify you as soon as HYDRE is ready.
                                Check your email for exclusive updates.
                            </p>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            onSubmit={handleSubmit(onEmailSubmit)}
                            className="max-w-md mx-auto"
                        >
                            <div className="flex flex-col sm:flex-row gap-4">
                                <div className="flex-1">
                                    <Input
                                        label="Email address"
                                        type="email"
                                        error={errors.email?.message}
                                        {...register('email')}
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    size="lg"
                                    disabled={isSubmitting}
                                    className="whitespace-nowrap"
                                >
                                    {isSubmitting ? 'Joining...' : 'Join Now'}
                                </Button>
                            </div>
                            <p className="text-xs text-stone-500 mt-4 text-center">
                                By joining, you agree to receive updates about HYDRE. Unsubscribe anytime.
                            </p>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* Sport Selection Modal */}
                <AnimatePresence>
                    {showSportModal && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/50 backdrop-blur-sm"
                            onClick={() => setShowSportModal(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                                className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
                            >
                                <h3 className="font-display text-2xl font-bold text-charcoal mb-2 text-center">
                                    One more thing...
                                </h3>
                                <p className="text-stone-600 text-center mb-8">
                                    What&apos;s your primary sport? This helps us personalize your experience.
                                </p>

                                <div className="space-y-4">
                                    {sports.map((sport) => (
                                        <motion.button
                                            key={sport.id}
                                            onClick={() => onSportSelect(sport.id)}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className={`w-full p-4 rounded-2xl bg-gradient-to-r ${sport.color} 
                                  text-white font-medium text-lg flex items-center gap-4
                                  hover:shadow-lg transition-shadow`}
                                        >
                                            <span className="text-3xl">{sport.icon}</span>
                                            <span>{sport.name}</span>
                                        </motion.button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => {
                                        setShowSportModal(false);
                                        setIsSubmitted(true);
                                        incrementWaitlist();
                                    }}
                                    className="w-full mt-6 text-stone-500 hover:text-charcoal transition-colors text-sm"
                                >
                                    Skip for now
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </section>
    );
}

