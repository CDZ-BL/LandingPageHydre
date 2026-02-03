/**
 * Mercury Dissolve Shader — TypeScript Integration
 * V4.0.0-HYDRE-APEX Compliant
 * 
 * Provides a React Three Fiber compatible shader material
 * with all Mercury Glass Physics effects.
 */

import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';

// ═══════════════════════════════════════════════════════════════════════════
// SHADER SOURCE CODE (Embedded for bundler compatibility)
// ═══════════════════════════════════════════════════════════════════════════

const vertexShader = /* glsl */ `
precision highp float;
precision highp int;

uniform float u_time;
uniform float u_dissolveProgress;
uniform float u_noiseScale;
uniform float u_noiseStrength;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_position;
varying vec3 v_worldPosition;
varying vec3 v_viewDirection;
varying float v_dissolveNoise;

// Simplex noise implementation
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
  v_uv = uv;
  
  vec3 noisePos = position * u_noiseScale + vec3(u_time * 0.3);
  float noise = snoise(noisePos);
  v_dissolveNoise = noise;
  
  float dissolveThreshold = 1.0 - u_dissolveProgress * 2.0;
  float displacement = smoothstep(dissolveThreshold - 0.3, dissolveThreshold, noise);
  
  vec3 displacedPosition = position;
  if (u_dissolveProgress > 0.0) {
    vec3 explosionDir = normalize(position) + normal * 0.5;
    displacedPosition += explosionDir * displacement * u_noiseStrength * u_dissolveProgress;
    
    displacedPosition += vec3(
      snoise(noisePos + vec3(100.0, 0.0, 0.0)),
      snoise(noisePos + vec3(0.0, 100.0, 0.0)),
      snoise(noisePos + vec3(0.0, 0.0, 100.0))
    ) * displacement * 0.2;
  }
  
  v_normal = normalize(normalMatrix * normal);
  v_position = displacedPosition;
  vec4 worldPosition = modelMatrix * vec4(displacedPosition, 1.0);
  v_worldPosition = worldPosition.xyz;
  v_viewDirection = normalize(cameraPosition - worldPosition.xyz);
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
`;

const fragmentShader = /* glsl */ `
precision mediump float;
precision mediump int;

uniform float u_time;
uniform float u_dissolveProgress;
uniform vec3 u_color;
uniform vec3 u_secondaryColor;
uniform float u_fresnelPower;
uniform float u_chromaticStrength;
uniform float u_opacity;

varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_position;
varying vec3 v_worldPosition;
varying vec3 v_viewDirection;
varying float v_dissolveNoise;

float fresnelRim(vec3 viewDir, vec3 normal, float power) {
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  return pow(rim, power);
}

vec3 fresnelChromatic(vec3 viewDir, vec3 normal, float strength) {
  float r = fresnelRim(viewDir, normal, 3.0 - strength * 0.5);
  float g = fresnelRim(viewDir, normal, 3.0);
  float b = fresnelRim(viewDir, normal, 3.0 + strength * 0.5);
  return vec3(r, g, b);
}

void main() {
  vec3 normal = normalize(v_normal);
  vec3 viewDir = normalize(v_viewDirection);
  
  // Dissolution
  float dissolveThreshold = 1.0 - u_dissolveProgress * 2.0;
  float dissolveEdge = smoothstep(dissolveThreshold - 0.2, dissolveThreshold, v_dissolveNoise);
  
  if (dissolveEdge > 0.98 && u_dissolveProgress > 0.0) {
    discard;
  }
  
  float edgeGlow = smoothstep(0.0, 0.3, dissolveEdge) * (1.0 - smoothstep(0.7, 1.0, dissolveEdge));
  
  // Fresnel
  float fresnel = fresnelRim(viewDir, normal, u_fresnelPower);
  vec3 chromaticFresnel = fresnelChromatic(viewDir, normal, u_chromaticStrength);
  
  // Color composition
  vec3 baseColor = u_color * (1.0 - chromaticFresnel * 0.3);
  vec3 rimColor = u_secondaryColor * fresnel * 1.5;
  vec3 edgeColor = u_secondaryColor * edgeGlow * 3.0;
  vec3 finalColor = baseColor + rimColor + edgeColor;
  
  // Alpha
  float baseAlpha = u_opacity * (1.0 - u_dissolveProgress * 0.5);
  float rimAlpha = fresnel * 0.3;
  float finalAlpha = baseAlpha + rimAlpha;
  finalAlpha *= (1.0 - dissolveEdge);
  finalAlpha += edgeGlow * 0.5;
  
  gl_FragColor = vec4(finalColor, clamp(finalAlpha, 0.0, 1.0));
}
`;

// ═══════════════════════════════════════════════════════════════════════════
// SHADER MATERIAL FACTORY
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Default uniform values for Mercury Dissolve shader
 */
export const MERCURY_DISSOLVE_DEFAULTS = {
    u_time: 0,
    u_dissolveProgress: 0,
    u_noiseScale: 2.0,
    u_noiseStrength: 1.0,
    u_color: new THREE.Color('#FFD700'),
    u_secondaryColor: new THREE.Color('#FFA500'),
    u_fresnelPower: 3.0,
    u_chromaticStrength: 1.0,
    u_opacity: 1.0,
} as const;

/**
 * Mercury Dissolve shader material for React Three Fiber
 * 
 * @example
 * <mesh>
 *   <sphereGeometry />
 *   <mercuryDissolveMaterial
 *     u_color={new THREE.Color('#FFD700')}
 *     u_dissolveProgress={0.5}
 *     transparent
 *   />
 * </mesh>
 */
export const MercuryDissolveMaterial = shaderMaterial(
    MERCURY_DISSOLVE_DEFAULTS,
    vertexShader,
    fragmentShader
);

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface MercuryDissolveMaterialProps {
    /** Animation time (auto-updated in useFrame) */
    u_time?: number;

    /** Dissolution progress [0, 1] */
    u_dissolveProgress?: number;

    /** Scale of noise pattern for dissolution */
    u_noiseScale?: number;

    /** Intensity of vertex displacement */
    u_noiseStrength?: number;

    /** Primary color */
    u_color?: THREE.Color;

    /** Secondary color (rim, glow) */
    u_secondaryColor?: THREE.Color;

    /** Fresnel power (higher = sharper rim) */
    u_fresnelPower?: number;

    /** Chromatic aberration intensity */
    u_chromaticStrength?: number;

    /** Base opacity */
    u_opacity?: number;

    /** Standard Three.js material props */
    transparent?: boolean;
    side?: THREE.Side;
    depthWrite?: boolean;
    depthTest?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Create a new MercuryDissolveMaterial instance with custom uniforms
 */
export function createMercuryDissolveMaterial(
    props: Partial<MercuryDissolveMaterialProps> = {}
): THREE.ShaderMaterial {
    const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: {
            u_time: { value: props.u_time ?? MERCURY_DISSOLVE_DEFAULTS.u_time },
            u_dissolveProgress: { value: props.u_dissolveProgress ?? MERCURY_DISSOLVE_DEFAULTS.u_dissolveProgress },
            u_noiseScale: { value: props.u_noiseScale ?? MERCURY_DISSOLVE_DEFAULTS.u_noiseScale },
            u_noiseStrength: { value: props.u_noiseStrength ?? MERCURY_DISSOLVE_DEFAULTS.u_noiseStrength },
            u_color: { value: props.u_color ?? MERCURY_DISSOLVE_DEFAULTS.u_color },
            u_secondaryColor: { value: props.u_secondaryColor ?? MERCURY_DISSOLVE_DEFAULTS.u_secondaryColor },
            u_fresnelPower: { value: props.u_fresnelPower ?? MERCURY_DISSOLVE_DEFAULTS.u_fresnelPower },
            u_chromaticStrength: { value: props.u_chromaticStrength ?? MERCURY_DISSOLVE_DEFAULTS.u_chromaticStrength },
            u_opacity: { value: props.u_opacity ?? MERCURY_DISSOLVE_DEFAULTS.u_opacity },
        },
        transparent: props.transparent ?? true,
        side: props.side ?? THREE.DoubleSide,
        depthWrite: props.depthWrite ?? false,
    });

    return material;
}

// Re-export for convenience
export { vertexShader, fragmentShader };
