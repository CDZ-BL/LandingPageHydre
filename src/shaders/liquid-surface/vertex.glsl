/**
 * Liquid Surface — Vertex Shader
 * V4.0.0-HYDRE-APEX Compliant
 *
 * CSM Injection: Modifies csm_Position only.
 * MeshPhysicalMaterial handles all lighting, reflections,
 * and clearcoat calculations natively.
 *
 * MATH:
 * Displacement = snoise3D(pos * u_scale + u_time) * u_displacement
 * Applied along vertex normal for organic wave deformation.
 */

// ─────────────────────────────────────────────────────────────
// UNIFORMS — Animated by useFrame in LiquidPlane.tsx
// ─────────────────────────────────────────────────────────────
uniform float u_time;
uniform float u_displacement;
uniform float u_scale;

// ─────────────────────────────────────────────────────────────
// 3D SIMPLEX NOISE — Self-contained, no external dependency
// Based on Ashima Arts / Ian McEwan implementation
// Optimized: < 16 iterations, no dynamic branching
// ─────────────────────────────────────────────────────────────

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    // Magic constant: 1/6 = 0.166666667, 1/3 = 0.333333333
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    // Other corners
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;   // 2.0 * C.x = 1/3
    vec3 x3 = x0 - D.yyy;         // -1.0 + 3.0 * C.x = -0.5

    // Permutations
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    // Gradients: 7x7 points over a square, mapped onto an octahedron
    // Magic number: n_ = 1/7 = 0.142857142857
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

    // Normalize gradients
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    // Mix final noise value
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

// ─────────────────────────────────────────────────────────────
// MAIN — CSM vertex injection
// ─────────────────────────────────────────────────────────────

void main() {
    // Fractal Brownian Motion: 2 octaves for organic feel
    // without exceeding GPU budget (no loops > 16 iterations)
    vec3 noiseInput = position * u_scale + vec3(u_time, u_time * 0.7, 0.0);
    
    float noise1 = snoise(noiseInput) * 0.6;                    // Primary wave
    float noise2 = snoise(noiseInput * 2.0 + 5.0) * 0.3;       // Secondary ripple
    float noise3 = snoise(noiseInput * 4.0 + 10.0) * 0.1;      // Micro-detail
    
    float totalNoise = (noise1 + noise2 + noise3) * u_displacement;
    
    // CSM Override — displace along normal
    csm_Position = position + normal * totalNoise;
}
