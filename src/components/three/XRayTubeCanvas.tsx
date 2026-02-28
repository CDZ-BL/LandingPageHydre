'use client';

/**
 * XRayTubeCanvas — Rotated tube with original materials
 *
 * Static pose: 90° Z rotation, original GLB materials, with gradient label.
 * Shifted to the left by 20vw.
 */

import * as THREE from 'three';
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer, PresentationControls } from '@react-three/drei';

// ─────────────────────────────────────────────────────────
// ASSETS
// ─────────────────────────────────────────────────────────
const MODEL_PATH = '/models/Tube+Lid+Tabs2.glb' as const;
const ETIQUETTE_PATH = '/images/etiquettegradiant.png';

useGLTF.preload(MODEL_PATH);
useTexture.preload(ETIQUETTE_PATH);

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
function OrbitingTablets({ geometry, baseScale }: { geometry: THREE.BufferGeometry; baseScale: THREE.Vector3 }) {
    const groupRef = useRef<THREE.Group>(null);
    const t1 = useRef<THREE.Mesh>(null);
    const t2 = useRef<THREE.Mesh>(null);
    const t3 = useRef<THREE.Mesh>(null);

    useFrame((state, delta) => {
        // Orbit the group around the shared center (tube + stack)
        if (groupRef.current) {
            groupRef.current.rotation.y -= delta * 0.5; // revolve clockwise
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.5) * 0.05; // slight float up/down
        }

        // Spin each tablet exactly on its own axes
        const tRefs = [t1, t2, t3];
        tRefs.forEach((ref, i) => {
            if (ref.current) {
                ref.current.rotation.x += delta * (1.2 + i * 0.3);
                ref.current.rotation.z += delta * (0.8 + i * 0.2);
            }
        });
    });

    const radius = 0.22; // wide enough to orbit around both the tube (left) and the stack (right)

    return (
        <group ref={groupRef}>
            {[t1, t2, t3].map((ref, i) => {
                const angle = (i / 3) * Math.PI * 2;
                return (
                    <mesh
                        key={i}
                        ref={ref as any}
                        geometry={geometry}
                        material={TABLET_MATERIAL}
                        position={[
                            Math.cos(angle) * radius,
                            (i - 1) * 0.12, // stagger Y heights
                            Math.sin(angle) * radius
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

    useMemo(() => {
        etiquetteTexture.colorSpace = THREE.SRGBColorSpace;
        etiquetteTexture.flipY = false;
        etiquetteTexture.needsUpdate = true;
    }, [etiquetteTexture]);

    return (
        <group>
            {/* TUBE POSITION */}
            <group position={[-0.1, -0.40, 0]}>
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
                                                    roughness={1}
                                                    clearcoat={0.05}
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

            {/* TABLET STACK */}
            {/* Added a slight Y rotation so the score lines face more towards the camera */}
            <group scale={5.9} position={[0.2, -0.37, 0]} rotation={[0, -0.07, 0]}>
                {(() => {
                    // 1. Calculate the true height of one tablet
                    nodes.Mesh_Tablet_Hero.geometry.computeBoundingBox();
                    const bbox = nodes.Mesh_Tablet_Hero.geometry.boundingBox;
                    // Full height in local space
                    const localHeight = bbox ? bbox.max.y - bbox.min.y : 0.01;

                    // The tablets are scaled uniformly by 5.9 in the parent group.
                    // The mesh itself has nodes.Mesh_Tablet_Hero.scale which we apply.
                    // Let's assume uniform scaling for simplicity.
                    const tabletScale = nodes.Mesh_Tablet_Hero.scale.y;

                    // We slightly overlap them so it looks like a tight stack
                    const stepY = localHeight * tabletScale * 0.95;

                    return Array.from({ length: 20 }).map((_, i) => (
                        <mesh
                            key={i}
                            geometry={nodes.Mesh_Tablet_Hero.geometry}
                            material={TABLET_MATERIAL}
                            position={[0, i * stepY, 0]}
                            // All rotations completely identical for perfectly aligned middle lines
                            rotation={nodes.Mesh_Tablet_Hero.rotation}
                            scale={nodes.Mesh_Tablet_Hero.scale}
                        />
                    ));
                })()}
            </group>

            {/* ORBITING TABLETS */}
            {/* Center of orbit positioned between the tube (-0.1) and stack (0.2) */}
            <group scale={5.9} position={[0.05, -0.32, 0]}>
                <OrbitingTablets
                    geometry={nodes.Mesh_Tablet_Hero.geometry}
                    baseScale={nodes.Mesh_Tablet_Hero.scale}
                />
            </group>
        </group>
    );
}

// ─────────────────────────────────────────────────────────
// CANVAS WRAPPER
// ─────────────────────────────────────────────────────────
export function XRayTubeCanvas() {
    return (
        // The container wrapper is 100% width and height.
        <div className="relative w-full h-full">
            <Canvas
                dpr={[1, 1.5]}
                camera={{ position: [0, 0, 2.8], fov: 22 }}
                gl={{
                    antialias: true,
                    alpha: true,
                    powerPreference: 'high-performance',
                }}
                style={{ background: 'transparent' }}
            >
                {/* Lighting match Hero */}
                <ambientLight intensity={0.15} />
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
