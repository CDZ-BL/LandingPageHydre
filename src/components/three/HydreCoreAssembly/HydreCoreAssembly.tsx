'use client';

/**
 * HydreCoreAssembly — Pure Ambient Animation
 *
 * No scroll dependency. Everything driven by useFrame.
 *
 * GROUP HIERARCHY
 * ─────────────────────────────────────────────────────────
 * <group {...props}>                props: scale, position
 *   <group ref={assemblyRef}>       slow perpetual Y spin (full assembly)
 *     <group ref={floatRef}>        ambient breathing
 *       tube
 *       lid (lidRef)                state-machine lift/lower + fast spin
 *       tablets (tabletsRef)        orbit + self-rotation
 *
 * LID STATE MACHINE
 * ─────────────────────────────────────────────────────────
 *  rest (2s)  →  lifting (1.8s)  →  hovering (5s)  →  lowering (1.8s)  →  …
 *  Spin during rest: slow (0.2 rev/s)
 *  Spin during lift / hover / lower: fast (1.6 rev/s) — satisfying endless unscrew
 */

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import type { HydreCoreAssemblyProps } from './HydreCoreAssembly.types';

// ─────────────────────────────────────────────────────────
// ASSETS
// ─────────────────────────────────────────────────────────
const MODEL_PATH     = '/models/Tube+Lid+Tabs2.glb' as const;
const ETIQUETTE_PATH = '/images/etiquette.png';
useGLTF.preload(MODEL_PATH);
useTexture.preload(ETIQUETTE_PATH);

// ─────────────────────────────────────────────────────────
// ASSEMBLY SPIN
// ─────────────────────────────────────────────────────────
const ASSEMBLY_SPIN_SPEED = (Math.PI * 2) / 22;   // 22 s / revolution — majestic

// ─────────────────────────────────────────────────────────
// LID STATE MACHINE
// ─────────────────────────────────────────────────────────
const LID_HOVER_AMOUNT    = 0.018;                        // Three.js units of lift
const LID_LIFT_DURATION   = 1.8;                          // seconds to reach hover height
const LID_HOVER_DURATION  = 5.0;                          // seconds held aloft
const LID_LOWER_DURATION  = 1.8;                          // seconds to descend
const LID_REST_DURATION   = 2.0;                          // seconds at rest
const LID_ACTIVE_SPIN     = (Math.PI * 2) * 0.8;         // rad/s — fast satisfying spin
const LID_REST_SPIN       = (Math.PI * 2) * 0.09;        // rad/s — slow idle
const LID_HOVER_FLOAT_AMP = 0.004;                        // subtle bob while hovering

type LidPhase = 'rest' | 'lifting' | 'hovering' | 'lowering';
const LID_PHASE_DURATION: Record<LidPhase, number> = {
    rest:     LID_REST_DURATION,
    lifting:  LID_LIFT_DURATION,
    hovering: LID_HOVER_DURATION,
    lowering: LID_LOWER_DURATION,
};
const LID_PHASE_NEXT: Record<LidPhase, LidPhase> = {
    rest:     'lifting',
    lifting:  'hovering',
    hovering: 'lowering',
    lowering: 'rest',
};

// ─────────────────────────────────────────────────────────
// TABLET ORBIT
// ─────────────────────────────────────────────────────────
const TABLET_COUNT   = 6;
const ORBIT_RADIUS   = 0.085;
const ORBIT_SPEED    = 0.38;    // rad/s  — gentle perpetual orbit
const ORBIT_Y_SPREAD = 0.042;
const TABLET_SELF_SPIN_X = 0.55;
const TABLET_SELF_SPIN_Z = 0.28;

// ─────────────────────────────────────────────────────────
// EASING
// ─────────────────────────────────────────────────────────
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic  = (t: number) => Math.pow(t, 3);

// ─────────────────────────────────────────────────────────
// MATERIALS
// ─────────────────────────────────────────────────────────
const LID_MATERIAL = new THREE.MeshStandardMaterial({
    color:           new THREE.Color('#f2f2f2'),
    metalness:       0.0,
    roughness:       0.55,
    envMapIntensity: 0.8,
});

export function HydreCoreAssembly(props: HydreCoreAssemblyProps) {
    const { nodes, materials } = useGLTF(MODEL_PATH) as any;
    const etiquetteTexture     = useTexture(ETIQUETTE_PATH);

    useMemo(() => {
        etiquetteTexture.colorSpace  = THREE.SRGBColorSpace;
        etiquetteTexture.flipY       = false;
        etiquetteTexture.needsUpdate = true;
    }, [etiquetteTexture]);

    // ── REFS ──────────────────────────────────────────────
    const assemblyRef = useRef<THREE.Group>(null);
    const floatRef    = useRef<THREE.Group>(null);
    const lidRef      = useRef<THREE.Mesh>(null);
    const tabletsRef  = useRef<THREE.Group>(null);

    // Lid state machine
    const lidPhase    = useRef<LidPhase>('rest');
    const lidPhaseT   = useRef(0);          // elapsed seconds within current phase
    const lidBaseY    = useRef<number | null>(null);

    // ── FRAME LOOP ────────────────────────────────────────
    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        // 1. SLOW ASSEMBLY SPIN ──────────────────────────
        if (assemblyRef.current) {
            assemblyRef.current.rotation.y -= delta * ASSEMBLY_SPIN_SPEED;
        }

        // 2. AMBIENT BREATHING ───────────────────────────
        if (floatRef.current) {
            floatRef.current.position.y = Math.sin(t * 1.3) * 0.0015;
            floatRef.current.rotation.x = Math.sin(t * 0.7) * 0.016;
            floatRef.current.rotation.z = Math.cos(t * 1.0) * 0.007;
        }

        // 3. LID STATE MACHINE ───────────────────────────
        if (lidRef.current) {
            // Capture base Y on first frame
            if (lidBaseY.current === null) {
                lidBaseY.current = lidRef.current.position.y;
            }
            const base = lidBaseY.current;

            // Advance phase timer
            lidPhaseT.current += delta;
            const phaseDuration = LID_PHASE_DURATION[lidPhase.current];
            if (lidPhaseT.current >= phaseDuration) {
                lidPhaseT.current = lidPhaseT.current - phaseDuration; // carry over
                lidPhase.current  = LID_PHASE_NEXT[lidPhase.current];
            }

            const p = Math.min(lidPhaseT.current / phaseDuration, 1); // 0→1 within phase

            // Spin speed — fast when active, slow at rest
            const spinSpeed = (lidPhase.current === 'rest')
                ? LID_REST_SPIN
                : LID_ACTIVE_SPIN;
            lidRef.current.rotation.y += delta * spinSpeed;

            // Vertical position per phase
            switch (lidPhase.current) {
                case 'rest':
                    lidRef.current.position.y = base;
                    break;
                case 'lifting':
                    lidRef.current.position.y = base + easeOutCubic(p) * LID_HOVER_AMOUNT;
                    break;
                case 'hovering': {
                    // Subtle sinusoidal float while aloft
                    const bob = Math.sin(lidPhaseT.current * Math.PI * 2 / 2.8) * LID_HOVER_FLOAT_AMP;
                    lidRef.current.position.y = base + LID_HOVER_AMOUNT + bob;
                    break;
                }
                case 'lowering':
                    lidRef.current.position.y = base + LID_HOVER_AMOUNT * (1 - easeInCubic(p));
                    break;
            }
        }

        // 4. TABLET ORBIT + SELF-ROTATION ────────────────
        if (tabletsRef.current) {
            const breathRadius = ORBIT_RADIUS + Math.sin(t * 0.5) * 0.008;
            tabletsRef.current.children.forEach((child, i) => {
                const phase = (i / TABLET_COUNT) * Math.PI * 2;
                const angle = t * ORBIT_SPEED + phase;
                child.position.x = Math.cos(angle) * breathRadius;
                child.position.z = Math.sin(angle) * breathRadius;
                child.position.y = Math.sin(angle * 0.65 + phase) * ORBIT_Y_SPREAD;
                child.rotation.x += delta * TABLET_SELF_SPIN_X;
                child.rotation.z += delta * (TABLET_SELF_SPIN_Z + Math.sin(phase) * 0.1);
                const s = 0.6 + Math.sin(t * 1.8 + phase) * 0.04;
                child.scale.set(s, s, s);
            });
        }
    });

    // ── JSX ───────────────────────────────────────────────
    return (
        <group {...props} dispose={null}>
            <group ref={assemblyRef}>
                <group ref={floatRef}>

                    {/* TUBE */}
                    {nodes.Mesh_Tube.type === 'Group' ? (
                        <group>
                            {(nodes.Mesh_Tube.children as THREE.Mesh[]).map((child: THREE.Mesh, i: number) => {
                                const isLabel =
                                    child.material === materials.Label ||
                                    (child.material as THREE.Material)?.name === 'Label';
                                return (
                                    <mesh
                                        key={i}
                                        geometry={child.geometry}
                                        position={child.position}
                                        rotation={child.rotation}
                                        scale={child.scale}
                                    >
                                        {isLabel ? (
                                            <meshPhysicalMaterial
                                                map={etiquetteTexture}
                                                color="#ffffff"
                                                metalness={0.05}
                                                roughness={0.55}
                                                clearcoat={0.6}
                                                clearcoatRoughness={0.15}
                                                envMapIntensity={1.0}
                                            />
                                        ) : (
                                            <meshPhysicalMaterial
                                                color="#030303"
                                                metalness={0.8}
                                                roughness={0.4}
                                                clearcoat={1.0}
                                                clearcoatRoughness={0.05}
                                                envMapIntensity={2.5}
                                            />
                                        )}
                                    </mesh>
                                );
                            })}
                        </group>
                    ) : (
                        <mesh geometry={nodes.Mesh_Tube.geometry}>
                            <meshPhysicalMaterial
                                map={etiquetteTexture}
                                color="#ffffff"
                                metalness={0.05}
                                roughness={0.55}
                                clearcoat={0.6}
                                clearcoatRoughness={0.15}
                                envMapIntensity={1.0}
                            />
                        </mesh>
                    )}

                    {/* LID — state machine target */}
                    <mesh
                        ref={lidRef}
                        geometry={nodes.Mesh_Lid.geometry}
                        material={LID_MATERIAL}
                        position={nodes.Mesh_Lid.position}
                        rotation={nodes.Mesh_Lid.rotation}
                    />

                    {/* TABLETS — perpetual orbit */}
                    <group ref={tabletsRef} position={[0, 0.02, 0]}>
                        {Array.from({ length: TABLET_COUNT }).map((_, i) => (
                            <mesh
                                key={i}
                                geometry={nodes.Mesh_Tablet_Hero.geometry}
                                scale={0.6}
                            >
                                <meshStandardMaterial
                                    color="#fdfdfd"
                                    roughness={0.5}
                                    metalness={0.0}
                                    envMapIntensity={1.0}
                                />
                            </mesh>
                        ))}
                    </group>

                </group>
            </group>
        </group>
    );
}
