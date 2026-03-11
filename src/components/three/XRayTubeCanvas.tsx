'use client';

/**
 * XRayTubeCanvas — Rotated tube with original materials
 *
 * Static pose: 90° Z rotation, original GLB materials, with gradient label.
 * Shifted to the left by 20vw.
 */

import * as THREE from 'three';
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer, PresentationControls } from '@react-three/drei';
import { useHydreStore } from '@/lib/store';

// ─────────────────────────────────────────────────────────
// ASSETS
// ─────────────────────────────────────────────────────────
const MODEL_PATH = '/models/Tube+Lid+Tabs2.glb' as const;
const ETIQUETTE_PATH = '/images/tubelabelgoutte.webp';

// Skip preloads on mobile — avoids downloading ~2MB of assets on small screens
if (typeof window !== 'undefined' && window.innerWidth >= 768) {
    useGLTF.preload(MODEL_PATH);
    useTexture.preload(ETIQUETTE_PATH);
}

const TABLET_MATERIAL = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#fdfdfd'),
    roughness: 0.5,
    metalness: 0.0,
    envMapIntensity: 1.0,
    side: THREE.DoubleSide, // Fix for black holes/missing faces
});

// ─────────────────────────────────────────────────────────
// SCENE
// ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────
// ORBIT CONSTANTS
// radius = 0.055 → world-space orbit = 0.055 × scale(5.9) ≈ 0.32 units
// Camera fov=22 at z=2.8 gives half-width ≈ 0.54 units — tablets stay
// fully inside the frustum at all times.
// ─────────────────────────────────────────────────────────
const ORBIT_RADIUS = 0.055;
const ORBIT_SPEED = 0.45;   // rad/s — gentle clockwise revolution
const ORBIT_Y_FLOAT = 0.008;  // amplitude of vertical breathing (world ≈ 0.047)
const TABLET_COUNT = 5;

function OrbitingTablets({ geometry, baseScale }: { geometry: THREE.BufferGeometry; baseScale: THREE.Vector3 }) {
    const groupRef = useRef<THREE.Group>(null);
    const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

    useFrame((state, delta) => {
        if (groupRef.current) {
            groupRef.current.rotation.y -= delta * ORBIT_SPEED;
            // subtle breathing float — stays very close to origin
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.2) * ORBIT_Y_FLOAT;
        }
        meshRefs.current.forEach((mesh, i) => {
            if (!mesh) return;
            mesh.rotation.x += delta * (1.0 + i * 0.25);
            mesh.rotation.z += delta * (0.65 + i * 0.15);
        });
    });

    return (
        <group ref={groupRef}>
            {Array.from({ length: TABLET_COUNT }).map((_, i) => {
                const angle = (i / TABLET_COUNT) * Math.PI * 2;
                // Y stagger: spread tablets slightly across height — 0.022 × 5.9 ≈ 0.13 world units
                const yOffset = (i - (TABLET_COUNT - 1) / 2) * 0.022;
                return (
                    <mesh
                        key={i}
                        ref={(el) => { meshRefs.current[i] = el; }}
                        geometry={geometry}
                        material={TABLET_MATERIAL}
                        position={[
                            Math.cos(angle) * ORBIT_RADIUS,
                            yOffset,
                            Math.sin(angle) * ORBIT_RADIUS,
                        ]}
                        scale={baseScale}
                    />
                );
            })}
        </group>
    );
}

function XRayScene() {
    const { nodes, materials } = useGLTF(MODEL_PATH) as any;
    const etiquetteTexture = useTexture(ETIQUETTE_PATH);

    const { gl } = useThree();

    useMemo(() => {
        etiquetteTexture.colorSpace = THREE.SRGBColorSpace;
        etiquetteTexture.flipY = false;
        etiquetteTexture.minFilter = THREE.LinearFilter;
        etiquetteTexture.magFilter = THREE.LinearFilter;
        etiquetteTexture.generateMipmaps = false;
        etiquetteTexture.anisotropy = gl.capabilities.getMaxAnisotropy();
        etiquetteTexture.needsUpdate = true;
    }, [etiquetteTexture, gl]);

    return (
        <group>
            {/* TUBE POSITION */}
            <group position={[0, -0.28, 0]}>
                <PresentationControls
                    global={false}
                    cursor={true}
                    snap={false} // Don't snap back, so user can read the label at their own pace
                    speed={1.5} // Faster rotation
                    zoom={1}
                    rotation={[0, 0, 0]}
                >
                    <group scale={5.9} position={[0, 0, 0]} rotation={[0, -0.75, 0]}>

                        {/* TUBE BODY — Original Materials */}
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
                                />
                            </mesh>
                        )}

                        {/* LID */}
                        {nodes.Mesh_Lid && (
                            <mesh
                                geometry={nodes.Mesh_Lid.geometry}
                                position={nodes.Mesh_Lid.position}
                                rotation={nodes.Mesh_Lid.rotation}
                                scale={nodes.Mesh_Lid.scale}
                            >
                                <meshPhysicalMaterial
                                    color="#e0e0e0"
                                    metalness={0.6}
                                    roughness={0.2}
                                    clearcoat={0.8}
                                    clearcoatRoughness={0.1}
                                    envMapIntensity={1.5}
                                />
                            </mesh>
                        )}

                    </group>
                </PresentationControls>
            </group>

            {/* TABLET STACK — temporarily hidden */}
            {/* <group scale={5.9} position={[0.2, -0.37, 0]} rotation={[0, -0.07, 0]}>
                {(() => {
                    nodes.Mesh_Tablet_Hero.geometry.computeBoundingBox();
                    const bbox = nodes.Mesh_Tablet_Hero.geometry.boundingBox;
                    const localHeight = bbox ? bbox.max.y - bbox.min.y : 0.01;
                    const tabletScale = nodes.Mesh_Tablet_Hero.scale.y;
                    const stepY = localHeight * tabletScale * 0.95;

                    return Array.from({ length: 20 }).map((_, i) => (
                        <mesh
                            key={i}
                            geometry={nodes.Mesh_Tablet_Hero.geometry}
                            material={TABLET_MATERIAL}
                            position={[0, i * stepY, 0]}
                            rotation={nodes.Mesh_Tablet_Hero.rotation}
                            scale={nodes.Mesh_Tablet_Hero.scale}
                        />
                    ));
                })()}
            </group> */}

            {/* ORBITING TABLETS */}
            {/* Center of orbit aligned with the tube position */}
            <group scale={5.9} position={[-0.1, -0.40, 0]}>
                <OrbitingTablets
                    geometry={nodes.Mesh_Tablet_Hero.geometry}
                    baseScale={nodes.Mesh_Tablet_Hero.scale}
                />
            </group>
        </group>
    );
}

// ─────────────────────────────────────────────────────────
// THEME-AWARE AMBIENT LIGHT
// ─────────────────────────────────────────────────────────
function ThemeAwareAmbientLight() {
    const theme = useHydreStore((s) => s.theme);
    return <ambientLight intensity={theme === 'light' ? 0.35 : 0.15} />;
}

// ─────────────────────────────────────────────────────────
// CANVAS WRAPPER
// ─────────────────────────────────────────────────────────
export function XRayTubeCanvas() {
    return (
        // The container wrapper is 100% width and height.
        <div className="relative w-full h-full">
            <Canvas
                dpr={2}
                camera={{ position: [0, 0.45, 1.8], fov: 20 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                style={{ background: 'transparent' }}
            >
                {/* Lighting match Hero */}
                <ThemeAwareAmbientLight />
                <directionalLight position={[5, 10, 5]} intensity={0.7} color="#ffffff" />

                <Environment resolution={256} background={false}>
                    <Lightformer
                        form="rect"
                        intensity={1.5}
                        position={[5, 5, 5]}
                        rotation-y={Math.PI / 4}
                        scale={[5, 5, 1]}
                        color="#ffffff"
                    />
                    <Lightformer
                        form="ring"
                        intensity={0.3}
                        position={[-5, 3, 2]}
                        scale={[8, 8, 1]}
                        color="#4060ff"
                    />
                    <Lightformer
                        form="rect"
                        intensity={11}
                        position={[0, 2, -10]}
                        scale={[10, 20, 1]}
                        color="#ffffff"
                    />
                    <Lightformer
                        form="rect"
                        intensity={4}
                        position={[-7, 0, 4]}
                        scale={[2, 10, 1]}
                        color="#e6dcc8ff"
                    />
                </Environment>

                <Suspense fallback={null}>
                    <XRayScene />
                </Suspense>
            </Canvas>
        </div>
    );
}
