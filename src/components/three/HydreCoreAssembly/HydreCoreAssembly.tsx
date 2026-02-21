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
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useTexture } from '@react-three/drei';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomShaderMaterial from 'three-custom-shader-material';
import { dissolveVertex, dissolveFragment } from '@/shaders/ApexDissolve';
import type { HydreCoreAssemblyProps } from './HydreCoreAssembly.types';

// ─────────────────────────────────────────────────────────────
// GSAP PLUGIN REGISTRATION — Module scope, executed once
// ─────────────────────────────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// ─────────────────────────────────────────────────────────────
// ASSET PATH — Single source of truth
// ─────────────────────────────────────────────────────────────
const MODEL_PATH = '/models/Tube+Lid+Tabs.glb' as const;

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
/** Scroll-driven Y-rotation — spins the tube to showcase the label */
const TUBE_SHOWCASE_ROTATION = Math.PI * 0.6;

// ─────────────────────────────────────────────────────────────
// PRELOAD DIRECTIVE
// Executes at module-evaluation time (bundle parse), NOT at
// component mount. This initiates the network fetch + Draco
// decode pipeline in a Web Worker immediately.
// ─────────────────────────────────────────────────────────────
useGLTF.preload(MODEL_PATH);

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
    const { nodes } = useGLTF(MODEL_PATH) as any;

    // ── 1.5. LOAD DEBOSSED NORMAL MAP ──────────────────────
    // Tangent-space normal map simulating CNC-milled logo
    // and injection micro-scratches. Zero-poly detail.
    // TODO: Re-enable once /textures/hydre-tube-normal.webp is available
    // const [tubeNormalMap] = useTexture(['/textures/hydre-tube-normal.webp']);
    // tubeNormalMap.wrapS = tubeNormalMap.wrapT = THREE.ClampToEdgeWrapping;
    // tubeNormalMap.colorSpace = THREE.NoColorSpace;

    // ── 2. KINEMATIC POINTERS FOR GSAP ─────────────────────
    // Exclusive refs per mesh for surgical animation control.
    const lidRef = useRef<THREE.Mesh>(null);
    const tabletRef = useRef<THREE.Mesh>(null);
    const assemblyGroupRef = useRef<THREE.Group>(null);
    const floatingRef = useRef<THREE.Group>(null);
    const orbitingTabletsRef = useRef<THREE.Group>(null);

    // ── 4. SCROLL-DRIVEN UNSCREWING + DISSOLVE MATRIX ──────
    // Binds lid kinematics and tablet dissolve to the DOM
    // scroll position. Timeline phases:
    //   A (0.0) — Lift lid
    //   B (0.0) — Unscrew lid
    //   C (0.5) — Dissolve tablet (starts when lid is off)
    // ── 4. APEX EXTRACTION TIMELINE ────────────────────────
    // 1. Lid unscrews and moves aside
    // 2. Tablet levitates out (Extraction)
    // 3. Tablet rotates to face camera
    // 4. Tablet dissolves (Atomization)
    useGSAP(() => {
        if (!lidRef.current || !tabletRef.current || !assemblyGroupRef.current) return;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: '#hydre-product-section',
                start: 'top top',
                end: `+=${SCROLL_DEPTH_PX}`,
                scrub: SCRUB_LAG_SECONDS,
            },
        });

        // Phase 0: Showcase rotation — spins the tube to reveal the label
        tl.to(assemblyGroupRef.current.rotation, {
            y: TUBE_SHOWCASE_ROTATION,
            ease: 'power1.inOut',
        }, 0);

        // Phase A & B: Lift and Spin the Lid (Starts at timeline 0)
        tl.to(lidRef.current.position, { y: `+=${LID_LIFT_DISTANCE}`, ease: 'power2.out' }, 0);
        tl.to(lidRef.current.rotation, { y: `+=${LID_ROTATION_RADIANS}`, ease: 'power1.inOut' }, 0);

        // Move the lid out of the way to the side
        tl.to(lidRef.current.position, { x: '+=0.04', z: '-=0.02', ease: 'power1.inOut' }, 0.2);

        // Phase C: Extract the Tablet (Levitation)
        // Starts at 0.3, as the lid is clearing the tube
        tl.to(tabletRef.current.position, {
            y: '+=0.08', // Pull up out of the tube
            z: '+=0.04', // Pull forward toward the camera
            ease: 'power3.inOut'
        }, 0.3);

        // Rotate the tablet to show off its geometry
        tl.to(tabletRef.current.rotation, {
            x: Math.PI * 0.5,
            y: Math.PI * 2,
            ease: 'power1.inOut'
        }, 0.3);

        // Phase D reserved for future dissolve effect

    }, { dependencies: [] });

    // ── 5. AMBIENT BREATHING + ORBITING TABLETS LOOP ───────
    useFrame((state) => {
        const t = state.clock.elapsedTime;

        // Breathing on the inner group
        if (floatingRef.current) {
            floatingRef.current.position.y = Math.sin(t * 1.5) * 0.002;
            floatingRef.current.rotation.x = Math.sin(t * 0.8) * 0.02;
            floatingRef.current.rotation.y = Math.cos(t * 1.2) * 0.02;
        }

        // Orbiting tablets — each child orbits at a unique phase
        if (orbitingTabletsRef.current) {
            orbitingTabletsRef.current.children.forEach((child, i) => {
                const phase = (i / ORBITING_TABLET_COUNT) * Math.PI * 2;
                const angle = t * ORBIT_SPEED + phase;
                child.position.x = Math.cos(angle) * ORBIT_RADIUS;
                child.position.z = Math.sin(angle) * ORBIT_RADIUS;
                child.position.y = Math.sin(angle * 0.7 + phase) * ORBIT_Y_SPREAD;
                // Self-rotation for visual interest
                child.rotation.x = t * 0.5 + phase;
                child.rotation.z = t * 0.3 + phase;
            });
        }
    });

    return (
        <group ref={assemblyGroupRef} {...props} dispose={null}>
            <group ref={floatingRef}>

                {/* ━━━ TUBE: Statically anchored at origin ━━━━━━━━━━━━━
                 *  No position prop — geometry origin is 0,0,0 in Blender.
                 *  Receives the luxury deep chrome material.
                 */}
                <mesh
                    geometry={nodes.Mesh_Tube.geometry}
                >
                    <meshPhysicalMaterial
                        color="#030303"
                        metalness={0.8}
                        roughness={0.4}
                        clearcoat={1.0}
                        clearcoatRoughness={0.05}
                        envMapIntensity={2.5}
                    // THE 0.1% INJECTION
                    // TODO: Re-enable with tubeNormalMap
                    // normalMap={tubeNormalMap}
                    // normalScale={new THREE.Vector2(0.5, 0.5)}
                    />
                </mesh>

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

                {/* ━━━ TABLET HERO: Compressed Powder ━━━━━━━━━━━━━━━━━
                 *  Non-metallic, matte — compressed powder aesthetic.
                 */}
                <mesh
                    ref={tabletRef}
                    geometry={nodes.Mesh_Tablet_Hero.geometry}
                    position={nodes.Mesh_Tablet_Hero.position}
                    rotation={nodes.Mesh_Tablet_Hero.rotation}
                >
                    <meshStandardMaterial
                        color="#e8e8e8"
                        roughness={0.7}
                        metalness={0.0}
                        envMapIntensity={0.5}
                        side={THREE.DoubleSide}
                    />
                </mesh>

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
                            <meshStandardMaterial
                                color="#e8e8e8"
                                roughness={0.7}
                                metalness={0.0}
                                envMapIntensity={0.5}
                                side={THREE.DoubleSide}
                            />
                        </mesh>
                    ))}
                </group>

            </group>
        </group>
    );
}
