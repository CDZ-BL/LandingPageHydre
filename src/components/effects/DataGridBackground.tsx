'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

interface RadarPulse {
    id: number;
    x: number;
    y: number;
}

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    alpha: number;
}

interface DataGridBackgroundProps {
    className?: string;
    enableRadarPulse?: boolean;
    density?: 'sparse' | 'normal' | 'dense';
}

export function DataGridBackground({
    className,
    enableRadarPulse = true,
    density = 'normal',
}: DataGridBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [pulses, setPulses] = useState<RadarPulse[]>([]);
    const pulseIdRef = useRef(0);
    const mouseRef = useRef({ x: -1000, y: -1000 });

    // Handle click to create radar pulse
    const handleClick = useCallback((e: React.MouseEvent) => {
        if (!enableRadarPulse) return;

        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const newPulse: RadarPulse = {
            id: pulseIdRef.current++,
            x,
            y,
        };

        setPulses((prev) => [...prev, newPulse]);

        // Remove pulse after animation completes
        setTimeout(() => {
            setPulses((prev) => prev.filter((p) => p.id !== newPulse.id));
        }, 1500);
    }, [enableRadarPulse]);

    // Track mouse for canvas effects
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const rect = containerRef.current?.getBoundingClientRect();
            if (rect) {
                mouseRef.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                };
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Canvas particle system and proximity glow
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles: Particle[] = [];
        const particleCount = density === 'dense' ? 100 : density === 'normal' ? 60 : 30;
        const connectionDistance = 150;
        const mouseDistance = 200;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 1.5 + 0.5,
                    alpha: Math.random() * 0.5 + 0.2,
                });
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw glowing grid lines based on mouse proximity (Simulated via radial gradient)
            const mouseX = mouseRef.current.x;
            const mouseY = mouseRef.current.y;

            // Draw proximity glow around cursor (simulates grid lighting up)
            const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 300);
            gradient.addColorStop(0, 'rgba(0, 240, 255, 0.08)');
            gradient.addColorStop(1, 'rgba(0, 240, 255, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce off edges
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Draw particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
                ctx.fill();

                // Connect particles close to each other
                particles.forEach(p2 => {
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.strokeStyle = `rgba(0, 240, 255, ${0.1 * (1 - dist / connectionDistance)})`;
                        ctx.stroke();
                    }
                });

                // Connect particles to mouse
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < mouseDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouseX, mouseY);
                    ctx.strokeStyle = `rgba(0, 240, 255, ${0.15 * (1 - dist / mouseDistance)})`;
                    ctx.stroke();
                }
            });

            requestAnimationFrame(animate);
        };

        resize();
        initParticles();
        animate();

        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, [density]);

    const gridClass = density === 'dense'
        ? 'data-grid-bg-dense'
        : density === 'sparse'
            ? 'data-grid-bg opacity-50'
            : 'data-grid-bg';

    return (
        <div
            ref={containerRef}
            onClick={handleClick}
            className={cn(
                'fixed inset-0 pointer-events-auto z-0',
                gridClass,
                className
            )}
        >
            {/* Interactive Canvas Grid & Particles */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 pointer-events-none"
            />

            {/* Radar pulses */}
            {pulses.map((pulse) => (
                <div
                    key={pulse.id}
                    className="radar-pulse"
                    style={{
                        left: pulse.x,
                        top: pulse.y,
                    }}
                />
            ))}

            {/* Subtle vignette overlay */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse at center, transparent 0%, rgba(5,5,5,0.8) 100%)',
                }}
            />

            {/* Corner data points that illuminate on pulse */}
            <div className="absolute top-8 left-8 coordinate-display opacity-30">
                [NODE_001] ACTIVE
            </div>
            <div className="absolute top-8 right-8 coordinate-display opacity-30">
                [NODE_002] STANDBY
            </div>
            <div className="absolute bottom-8 left-8 coordinate-display opacity-30">
                [NODE_003] ONLINE
            </div>
            <div className="absolute bottom-8 right-8 coordinate-display opacity-30">
                [NODE_004] SYNCED
            </div>
        </div>
    );
}
