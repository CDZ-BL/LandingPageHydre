/**
 * HydreCoreAssembly — Declarative Scene Graph Destructuring
 * V4.0.0-HYDRE-APEX Compliant
 *
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────┐
 * │  useGLTF.preload() → Web Worker Draco decode (t=0ms)   │
 * │  ↓                                                      │
 * │  useGLTF() → destructure nodes → atomic <mesh> nodes   │
 * │  ↓                                                      │
 * │  Tube (static)  │  Lid (ref→GSAP)  │  Tablet (shader)  │
 * └─────────────────────────────────────────────────────────┘
 *
 * Zero-Latency Mount: Geometry is pre-fetched and decoded in a
 * background Web Worker before the Canvas even mounts. When the
 * user scrolls to the HYDRE section, VRAM is already warm.
 *
 * Component-Level Authority: Each mesh is a distinct React node
 * with its own ref, material, and lifecycle — no imperative
 * scene.traverse() required.
 */

'use client';

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { HydreCoreAssemblyProps } from './HydreCoreAssembly.types';

// ─────────────────────────────────────────────────────────────
// GSAP PLUGIN REGISTRATION — Module scope, executed once
// ─────────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// ASSET PATH — Single source of truth
// ─────────────────────────────────────────────────────────────
const MODEL_PATH = '/models/Tube+Lid+Tabs2.glb' as const;

// ─────────────────────────────────────────────────────────────
// SCROLL KINEMATICS CONSTANTS
// Tunable parameters for the unscrewing animation.
// ─────────────────────────────────────────────────────────────
/** Vertical lift distance: 30mm to clear the threads */
const LID_LIFT_DISTANCE = 0.03;
/** Total rotation in radians — 1.5 full turns (Math.PI * 3) */
const LID_ROTATION_RADIANS = Math.PI * 3;
/** Scroll depth in px over which the unscrew unfolds */
const SCROLL_DEPTH_PX = 800;
/** GSAP scrub lag in seconds — simulates physical friction */
const SCRUB_LAG_SECONDS = 1;
/** Perpetual Y-rotation speed in rad/s — 14s per full revolution */
const TUBE_SPIN_SPEED = -(Math.PI * 2) / 14;

// ─────────────────────────────────────────────────────────────
// PRELOAD DIRECTIVE
// Executes at module-evaluation time (bundle parse), NOT at
// component mount. This initiates the network fetch + Draco
// decode pipeline in a Web Worker immediately.
// ─────────────────────────────────────────────────────────────
useGLTF.preload(MODEL_PATH);
const ETIQUETTE_PATH = '/images/etiquette.png';
useTexture.preload(ETIQUETTE_PATH);

// ─────────────────────────────────────────────────────────────
// MATERIAL DEFINITION — Matte White Plastic Lid
// Zero metalness — this is injection-molded plastic.
// ─────────────────────────────────────────────────────────────
const LUXURY_LID_MATERIAL = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#f2f2f2'),
    metalness: 0.0,
    roughness: 0.55,
    envMapIntensity: 0.8,
});

// ─────────────────────────────────────────────────────────────
// ORBITING TABLETS CONFIGURATION
// ─────────────────────────────────────────────────────────────
const ORBITING_TABLET_COUNT = 6;
const ORBIT_RADIUS = 0.06;
const ORBIT_SPEED = 0.4;
const ORBIT_Y_SPREAD = 0.04;


/**
 * HydreCoreAssembly — Premium 3D product assembly
 *
 * Destructures the parsed glTF scene graph into atomic React
 * mesh nodes: Tube, Lid, and Tablet Hero. Each mesh receives
 * independent refs and materials for fine-grained GSAP control
 * and shader injection.
 */
export function HydreCoreAssembly(props: HydreCoreAssemblyProps) {
    // ── 1. DESTRUCTURE THE PARSED SCENE GRAPH ──────────────
    // R3F's useGLTF returns the full glTF result. We extract
    // only `nodes` — the flattened map of named meshes.
    const { nodes, materials } = useGLTF(MODEL_PATH) as any;
    const etiquetteTexture = useTexture(ETIQUETTE_PATH);

    // ── 1.5. CONFIGURE ETIQUETTE TEXTURE FOR UV MAPPING ────
    // The new GLB (Tube+Lid+Tabs2) has a dedicated "Label" material
    // slot with cylindrical UVs pre-configured in Blender to match
    // the exact proportions of etiquette.png.
    useMemo(() => {
        etiquetteTexture.colorSpace = THREE.SRGBColorSpace;
        etiquetteTexture.flipY = false; // glTF convention
        etiquetteTexture.needsUpdate = true;
    }, [etiquetteTexture]);

    // ── 2. KINEMATIC POINTERS FOR GSAP ─────────────────────
    // Exclusive refs per mesh for surgical animation control.
    const lidRef = useRef<THREE.Mesh>(null);
    const assemblyGroupRef = useRef<THREE.Group>(null);
    const floatingRef = useRef<THREE.Group>(null);
    const orbitingTabletsRef = useRef<THREE.Group>(null);

    // ── 4. SCROLL-DRIVEN UNSCREWING + DISSOLVE MATRIX ──────
    useGSAP(() => {
        if (!lidRef.current || !assemblyGroupRef.current || !orbitingTabletsRef.current) return;

        // Set initial state for orbiting tablets (visible immediately, not hidden)
        gsap.set(orbitingTabletsRef.current.scale, { x: 1, y: 1, z: 1 });
        gsap.set(orbitingTabletsRef.current.position, { y: 0.05 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#hydre-product-section',
                start: 'top top',
                end: `+=${SCROLL_DEPTH_PX}`,
                scrub: SCRUB_LAG_SECONDS,
            },
        });

        // Phase A & B: Lift and Spin the Lid (Starts at timeline 0)
        tl.to(lidRef.current.position, { y: `+=${LID_LIFT_DISTANCE}`, ease: 'power2.out' }, 0);
        tl.to(lidRef.current.rotation, { y: `+=${LID_ROTATION_RADIANS}`, ease: 'power1.inOut' }, 0);

        // Move the lid out of the way to the side
        tl.to(lidRef.current.position, { x: '+=0.04', z: '-=0.02', ease: 'power1.inOut' }, 0.2);

        // Phase C: Tablets burst out of the tube as the lid moves away
        // Removed scroll-triggered scale/position since they are visible from the start

    }, { dependencies: [] });

    // ── 5. AMBIENT BREATHING + ORBITING TABLETS LOOP ───────
    useFrame((state, delta) => {
        const t = state.clock.elapsedTime;

        // Perpetual 360° rotation — smooth cinematic spin
        if (assemblyGroupRef.current) {
            assemblyGroupRef.current.rotation.y += delta * TUBE_SPIN_SPEED;
        }

        // Breathing on the inner group
        if (floatingRef.current) {
            floatingRef.current.position.y = Math.sin(t * 1.5) * 0.002;
            floatingRef.current.rotation.x = Math.sin(t * 0.8) * 0.02;
            floatingRef.current.rotation.y = Math.cos(t * 1.2) * 0.02;
        }

        // Orbiting tablets — each child orbits at a unique phase
        if (orbitingTabletsRef.current) {
            const dynamicRadius = ORBIT_RADIUS + Math.sin(t * 0.5) * 0.02; // Breath-like expansion

            orbitingTabletsRef.current.children.forEach((child, i) => {
                const phase = (i / ORBITING_TABLET_COUNT) * Math.PI * 2;
                const angle = t * ORBIT_SPEED + phase;
                
                child.position.x = Math.cos(angle) * dynamicRadius;
                child.position.z = Math.sin(angle) * dynamicRadius;
                child.position.y = Math.sin(angle * 0.7 + phase) * ORBIT_Y_SPREAD;
                
                // Self-rotation for visual interest
                child.rotation.x = t * 0.5 + phase;
                child.rotation.z = t * 0.3 + phase;

                // Subtle pulsing scale
                const scalePulse = 0.6 + Math.sin(t * 2 + phase) * 0.05;
                child.scale.set(scalePulse, scalePulse, scalePulse);
            });
        }
    });

    return (
        <group ref={assemblyGroupRef} {...props} dispose={null}>
            <group ref={floatingRef}>

                {/* ━━━ TUBE: Multi-primitive mesh (Body + Label) ━━━━━━
                 *  The glTF contains two primitives on the tube:
                 *  - Primitive 0 → "Material" (dark chrome body)
                 *  - Primitive 1 → "Label" (cylindrical UV zone)
                 *  R3F destructures multi-primitive meshes as a Group
                 *  with child meshes. We render them with distinct
                 *  materials: body gets luxe chrome, label gets the
                 *  etiquette texture mapped to its Blender UVs.
                 */}
                {nodes.Mesh_Tube.type === 'Group' ? (
                    <group>
                        {(nodes.Mesh_Tube.children as THREE.Mesh[]).map((child: THREE.Mesh, i: number) => {
                            const isLabel = child.material === materials.Label ||
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
                    /* Fallback: single-primitive mesh (shouldn't happen with Tube+Lid+Tabs2) */
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

                {/* ━━━ LID: Unscrewing scroll timeline target ━━━━━━━━━━
                 *  Position/rotation read from the parsed glTF node.
                 *  The ref is the kinematic pointer for GSAP's
                 *  ScrollTrigger unscrewing timeline.
                 */}
                <mesh
                    ref={lidRef}
                    geometry={nodes.Mesh_Lid.geometry}
                    material={LUXURY_LID_MATERIAL}
                    position={nodes.Mesh_Lid.position}
                    rotation={nodes.Mesh_Lid.rotation}
                />

                {/* ━━━ ORBITING TABLETS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                 *  Cloned tablet geometry orbiting perpetually.
                 *  useFrame drives their positions each tick.
                 */}
                <group ref={orbitingTabletsRef} position={[0, 0.02, 0]}>
                    {Array.from({ length: ORBITING_TABLET_COUNT }).map((_, i) => (
                        <mesh
                            key={i}
                            geometry={nodes.Mesh_Tablet_Hero.geometry}
                            scale={0.6}
                        >
                            {/* Realistic White Tablet Material */}
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
    );
}
