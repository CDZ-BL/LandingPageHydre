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

// ─────────────────────────────────────────────────────────────
// PRELOAD DIRECTIVE
// Executes at module-evaluation time (bundle parse), NOT at
// component mount. This initiates the network fetch + Draco
// decode pipeline in a Web Worker immediately.
// ─────────────────────────────────────────────────────────────
useGLTF.preload(MODEL_PATH);

// ─────────────────────────────────────────────────────────────
// MATERIAL DEFINITION — Dark Chrome & Brushed Metal
// 0.1% Deep Chrome Polymer with micro-rough clearcoat
// ─────────────────────────────────────────────────────────────
// Tube material now defined dynamically inside component for texture binding.

const LUXURY_LID_MATERIAL = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#080808'),
    metalness: 0.9,
    roughness: 0.2,                    // Smoother than the tube
    envMapIntensity: 2.0,
});

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

    // ── 3. DISSOLVE UNIFORM REFS ───────────────────────────
    // Mutable uniform object — GSAP mutates .value directly,
    // CSM reads it every frame. Zero React re-renders.
    const dissolveUniforms = useRef({
        uProgress: { value: 0.0 },
        uEdgeColor: { value: new THREE.Color('#00F0FF') },
        uThickness: { value: 0.04 },
    });

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
        if (!lidRef.current || !tabletRef.current) return;

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

        // Phase D: The Apex Dissolve
        // Starts at 0.6, after the tablet is floating in macro-focus
        tl.to(dissolveUniforms.current.uProgress, {
            value: 1.0,
            ease: 'power2.in',
        }, 0.6);

    }, { dependencies: [] });

    // ── 5. AMBIENT BREATHING LOOP ──────────────────────────
    // Sub-millimeter floating motion to simulate zero-gravity
    // suspension. Breaks the rigid "3D model on a web page" feel.
    // Applied to inner group to preserve parent styling/position.
    useFrame((state) => {
        if (!floatingRef.current) return;

        // Elapsed time from the Three.js clock
        const t = state.clock.elapsedTime;

        // Sub-millimeter translation: A * sin(freq * t)
        floatingRef.current.position.y = Math.sin(t * 1.5) * 0.002;

        // Micro-rotation for environmental light catching
        floatingRef.current.rotation.x = Math.sin(t * 0.8) * 0.02;
        floatingRef.current.rotation.y = Math.cos(t * 1.2) * 0.02;
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

                {/* ━━━ TABLET HERO: Apex Dissolve via CSM ━━━━━━━━━━━━━
                 *  CustomShaderMaterial extends MeshPhysicalMaterial's
                 *  shader AST — preserves the full PBR lighting pipeline
                 *  while injecting our 3D simplex noise dissolve.
                 */}
                <mesh
                    ref={tabletRef}
                    geometry={nodes.Mesh_Tablet_Hero.geometry}
                    position={nodes.Mesh_Tablet_Hero.position}
                    rotation={nodes.Mesh_Tablet_Hero.rotation}
                >
                    <CustomShaderMaterial
                        baseMaterial={THREE.MeshPhysicalMaterial}
                        vertexShader={dissolveVertex}
                        fragmentShader={dissolveFragment}
                        uniforms={dissolveUniforms.current}
                        transparent
                        // Luxury PBR properties
                        color="#1a1a1a"
                        roughness={0.15}
                        metalness={0.8}
                        clearcoat={1.0}
                        clearcoatRoughness={0.1}
                        envMapIntensity={2.5}
                    />
                </mesh>

            </group>
        </group>
    );
}
