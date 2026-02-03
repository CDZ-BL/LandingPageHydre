/**
 * Mercury Dissolve — Vertex Shader
 * V4.0.0-HYDRE-APEX Compliant
 * 
 * Creates organic dissolution effect with vertex displacement
 * based on noise functions and dissolve progress.
 * 
 * Uniforms:
 *   u_time - Animation time
 *   u_dissolveProgress - Dissolution amount [0, 1]
 *   u_noiseScale - Scale of displacement noise
 *   u_noiseStrength - Intensity of displacement
 */

// Precision declarations (highp for vertices per HYDRE spec)
precision highp float;
precision highp int;

// Uniforms
uniform float u_time;
uniform float u_dissolveProgress;
uniform float u_noiseScale;
uniform float u_noiseStrength;

// Varyings (output to fragment shader)
varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_position;
varying vec3 v_worldPosition;
varying vec3 v_viewDirection;
varying float v_dissolveNoise;

// ═══════════════════════════════════════════════════════════════════════════
// NOISE FUNCTIONS (inlined for vertex shader compatibility)
// ═══════════════════════════════════════════════════════════════════════════

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
  return mod289(((x * 34.0) + 10.0) * x);
}

vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}

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

// ═══════════════════════════════════════════════════════════════════════════
// MAIN VERTEX SHADER
// ═══════════════════════════════════════════════════════════════════════════

void main() {
  // Pass UVs to fragment
  v_uv = uv;
  
  // Calculate noise for this vertex
  vec3 noisePos = position * u_noiseScale + vec3(u_time * 0.3);
  float noise = snoise(noisePos);
  v_dissolveNoise = noise;
  
  // Calculate displacement based on dissolve progress
  // Vertices with noise above threshold get displaced outward
  float dissolveThreshold = 1.0 - u_dissolveProgress * 2.0;
  float displacement = smoothstep(dissolveThreshold - 0.3, dissolveThreshold, noise);
  
  // Displace along normal with noise-based intensity
  vec3 displacedPosition = position;
  if (u_dissolveProgress > 0.0) {
    // Outward explosion effect
    vec3 explosionDir = normalize(position) + normal * 0.5;
    displacedPosition += explosionDir * displacement * u_noiseStrength * u_dissolveProgress;
    
    // Add some turbulence
    displacedPosition += vec3(
      snoise(noisePos + vec3(100.0, 0.0, 0.0)),
      snoise(noisePos + vec3(0.0, 100.0, 0.0)),
      snoise(noisePos + vec3(0.0, 0.0, 100.0))
    ) * displacement * 0.2;
  }
  
  // Transform normal to world space
  v_normal = normalize(normalMatrix * normal);
  
  // Store positions for fragment shader
  v_position = displacedPosition;
  vec4 worldPosition = modelMatrix * vec4(displacedPosition, 1.0);
  v_worldPosition = worldPosition.xyz;
  
  // Calculate view direction for fresnel
  v_viewDirection = normalize(cameraPosition - worldPosition.xyz);
  
  // Final position
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
}
