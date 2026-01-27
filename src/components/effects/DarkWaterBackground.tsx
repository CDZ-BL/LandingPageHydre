// @ts-nocheck
'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer, Noise, Bloom, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';

// -----------------------------------------------------------------------------
// SHADER DEFINITIONS
// -----------------------------------------------------------------------------

const vertexShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;
  
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uScroll;

  // Simplex 2D noise
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
             -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy) );
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1;
    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
    + i.x + vec3(0.0, i1.x, 1.0 ));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m ;
    m = m*m ;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vUv = uv;

    vec3 pos = position;

    // SLOW, VISCOUS MOVEMENT
    float slowTime = uTime * 0.15;
    
    // Base waves
    float noise1 = snoise(uv * 3.0 + slowTime);
    float noise2 = snoise(uv * 12.0 - slowTime * 2.0);
    
    // Mouse interaction displacement
    float dist = distance(uv, uMouse);
    float decay = clamp(1.0 - dist * 3.0, 0.0, 1.0);
    float mouseWave = sin(dist * 20.0 - uTime * 5.0) * decay * 0.1;

    // Combine elevation
    float elevation = noise1 * 0.3 + noise2 * 0.05 + mouseWave;
    
    // Add scroll influence
    elevation += sin(uv.y * 10.0 + uScroll) * 0.05;

    pos.z += elevation;
    vElevation = elevation;

    // Recompute normals for proper lighting (approximated)
    vec3 objectNormal = normalize(vec3(noise1, noise2, 1.0)); // Simplified
    vNormal = normal; 

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;
  varying vec3 vNormal;

  uniform float uTime;
  
  void main() {
    // BASE COLOR: DEEP DARK OBSIDIAN/OIL
    vec3 deepColor = vec3(0.05, 0.05, 0.08);
    vec3 peakColor = vec3(0.1, 0.12, 0.15); // Slightly lighter tips
    
    // MIX COLORS BASED ON ELEVATION
    vec3 color = mix(deepColor, peakColor, vElevation * 2.0 + 0.5);

    // SPECULAR HIGHLIGHTS (The "Wet" look)
    // Simple environment reflection imitation
    float light = pow(vElevation + 0.6, 5.0); 
    color += vec3(light * 0.3); // Add shine

    // ADD NOISE GRAIN
    float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
    color += noise * 0.02;

    gl_FragColor = vec4(color, 1.0);
  }
`;

// -----------------------------------------------------------------------------
// COMPONENT
// -----------------------------------------------------------------------------

function Simulation() {
    const meshRef = useRef(null);
    const shaderRef = useRef(null);

    // Uniforms
    const uniforms = useMemo(
        () => ({
            uTime: { value: 0 },
            uMouse: { value: new THREE.Vector2(0.5, 0.5) },
            uScroll: { value: 0 },
        }),
        []
    );

    // MOUSE TRACKING
    useEffect(() => {
        const handleMouseMove = (e) => {
            // Normalize to 0..1
            const x = e.clientX / window.innerWidth;
            const y = 1.0 - (e.clientY / window.innerHeight); // Flip Y
            if (shaderRef.current) {
                shaderRef.current.uniforms.uMouse.value.set(x, y);
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // ANIMATION LOOP
    useFrame((state) => {
        const { clock } = state;
        if (shaderRef.current) {
            shaderRef.current.uniforms.uTime.value = clock.getElapsedTime();
        }
    });

    return (
        <mesh ref={meshRef} rotation={[-Math.PI / 4, 0, 0]}>
            {/* 
         PlaneGeometry args: [width, height, widthSegments, heightSegments] 
         High segmentation needed for smooth vertex displacement
      */}
            <planeGeometry args={[14, 14, 128, 128]} />
            <shaderMaterial
                ref={shaderRef}
                wireframe={false}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                uniforms={uniforms}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

export function DarkWaterBackground() {
    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none bg-black">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 2]} // Optimize pixel ratio
                gl={{
                    antialias: false,
                    powerPreference: "high-performance"
                }}
            >
                <Simulation />

                {/* POST PROCESSING - DISABLED DUE TO RUNTIME CRASH */}
                {/* <EffectComposer disableNormalPass>
                    <Noise opacity={0.15} premultiply blendFunction={BlendFunction.OVERLAY} />
                    <Vignette eskil={false} offset={0.1} darkness={0.8} />
                    <Bloom
                        luminanceThreshold={0.5}
                        intensity={0.4}
                        radius={0.8}
                    />
                </EffectComposer> */}
            </Canvas>

            {/* OVERLAY GRADIENT FOR TEXT LEGIBILITY */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-void/50 to-void pointer-events-none" />
        </div>
    );
}
