'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getAssetPath } from '@/lib/utils';

interface TubeVideoPlayerProps {
    className?: string;
}

export function TubeVideoPlayer({ className = '' }: TubeVideoPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const loopIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const loopStartTime = 4.9;
    const loopEndTime = 5.5;

    // Setup loop check with interval (more performant than timeupdate)
    useEffect(() => {
        if (isPlaying && videoRef.current) {
            // Check every 100ms instead of every frame
            loopIntervalRef.current = setInterval(() => {
                if (videoRef.current && videoRef.current.currentTime >= loopEndTime) {
                    videoRef.current.currentTime = loopStartTime;
                }
            }, 100);
        }

        return () => {
            if (loopIntervalRef.current) {
                clearInterval(loopIntervalRef.current);
            }
        };
    }, [isPlaying]);

    // Handle tap/click to toggle video
    const handleTap = useCallback(() => {
        if (!videoRef.current) return;

        if (isPlaying) {
            // Stop video, reset
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
            setIsPlaying(false);
            if (loopIntervalRef.current) {
                clearInterval(loopIntervalRef.current);
            }
        } else {
            // Start playing
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setIsPlaying(true);
        }
    }, [isPlaying]);

    return (
        <div
            className={`relative w-full h-full flex items-center justify-center cursor-pointer ${className}`}
            onClick={handleTap}
        >
            {/* Static Image (shown when not playing) */}
            <AnimatePresence mode="wait">
                {!isPlaying && (
                    <motion.div
                        key="image"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 flex items-center justify-center"
                    >
                        <div className="relative w-full h-full max-w-lg lg:max-w-xl">
                            <Image
                                src={getAssetPath('/images/tubehydre.png')}
                                alt="HYDRE Tube"
                                fill
                                className="object-contain"
                                priority
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />

                            {/* TAP TO OPEN overlay */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                className="absolute inset-0 flex items-center justify-center"
                            >
                                <motion.div
                                    animate={{
                                        scale: [1, 1.05, 1],
                                    }}
                                    transition={{
                                        duration: 2,
                                        repeat: Infinity,
                                        ease: 'easeInOut',
                                    }}
                                    className="px-6 py-3 rounded-full bg-charcoal-900/80 backdrop-blur-sm 
                             border border-cyan-500/50 shadow-glow"
                                >
                                    <span className="text-charcoal-50 font-medium text-lg tracking-wide flex items-center gap-2">
                                        <span className="text-cyan-400">👆</span>
                                        TAP TO OPEN
                                    </span>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video (shown when playing) - Full size */}
            <video
                ref={videoRef}
                src={getAssetPath('/videos/_scene_the_1080p_202601151645.mp4')}
                muted
                playsInline
                preload="auto"
                className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-200 ${isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* TAP TO CLOSE hint (shown when playing) */}
            <AnimatePresence>
                {isPlaying && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ delay: 0.3 }}
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
                    >
                        <div className="px-4 py-2 rounded-full bg-charcoal-900/60 backdrop-blur-sm 
                            border border-charcoal-600/50 text-charcoal-50/60 text-sm">
                            Tap to close
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

