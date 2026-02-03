/**
 * Mercury Dissolve — Fragment Shader
 * V4.0.0-HYDRE-APEX Compliant
 * 
 * Premium glass/mercury material with:
 * - Fresnel rim lighting
 * - Chromatic aberration on edges
 * - HDR environment sampling
 * - Dissolve alpha masking
 * 
 * Uniforms:
 *   u_time - Animation time
 *   u_dissolveProgress - Dissolution amount [0, 1]
 *   u_color - Base color
 *   u_secondaryColor - Glow/rim color
 *   u_envMap - Environment cubemap (optional)
 *   u_fresnelPower - Fresnel falloff power
 *   u_chromaticStrength - Aberration intensity
 */

// Precision declarations (mediump for fragments per HYDRE spec)
precision mediump float;
precision mediump int;

// Uniforms
uniform float u_time;
uniform float u_dissolveProgress;
uniform vec3 u_color;
uniform vec3 u_secondaryColor;
uniform float u_fresnelPower;
uniform float u_chromaticStrength;
uniform float u_opacity;
uniform samplerCube u_envMap;
uniform bool u_useEnvMap;

// Varyings (from vertex shader)
varying vec2 v_uv;
varying vec3 v_normal;
varying vec3 v_position;
varying vec3 v_worldPosition;
varying vec3 v_viewDirection;
varying float v_dissolveNoise;

// ═══════════════════════════════════════════════════════════════════════════
// FRESNEL FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Fresnel rim effect
 * @param power - Higher = sharper falloff (3.0-5.0 recommended)
 */
float fresnelRim(vec3 viewDir, vec3 normal, float power) {
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  return pow(rim, power);
}

/**
 * Chromatic fresnel (RGB dispersion)
 * Creates iridescent color shifting at edges
 */
vec3 fresnelChromatic(vec3 viewDir, vec3 normal, float strength) {
  // Different powers for each channel = color separation
  float r = fresnelRim(viewDir, normal, 3.0 - strength * 0.5);
  float g = fresnelRim(viewDir, normal, 3.0);
  float b = fresnelRim(viewDir, normal, 3.0 + strength * 0.5);
  return vec3(r, g, b);
}

// ═══════════════════════════════════════════════════════════════════════════
// NOISE (simplified for fragment)
// ═══════════════════════════════════════════════════════════════════════════

// Hash function for procedural noise
float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

// Value noise
float valueNoise(vec3 p) {
  vec3 i = floor(p);
  vec3 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  
  return mix(
    mix(mix(hash(i + vec3(0, 0, 0)), hash(i + vec3(1, 0, 0)), f.x),
        mix(hash(i + vec3(0, 1, 0)), hash(i + vec3(1, 1, 0)), f.x), f.y),
    mix(mix(hash(i + vec3(0, 0, 1)), hash(i + vec3(1, 0, 1)), f.x),
        mix(hash(i + vec3(0, 1, 1)), hash(i + vec3(1, 1, 1)), f.x), f.y), f.z);
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN FRAGMENT SHADER
// ═══════════════════════════════════════════════════════════════════════════

void main() {
  // Normalize varying normals
  vec3 normal = normalize(v_normal);
  vec3 viewDir = normalize(v_viewDirection);
  
  // ─────────────────────────────────────────────────────────────────────────
  // 1. DISSOLUTION MASKING
  // ─────────────────────────────────────────────────────────────────────────
  
  // Use noise to create organic dissolve pattern
  float dissolveThreshold = 1.0 - u_dissolveProgress * 2.0;
  float dissolveEdge = smoothstep(dissolveThreshold - 0.2, dissolveThreshold, v_dissolveNoise);
  
  // Discard fully dissolved pixels
  if (dissolveEdge > 0.98 && u_dissolveProgress > 0.0) {
    discard;
  }
  
  // Glowing edge at dissolve boundary
  float edgeGlow = smoothstep(0.0, 0.3, dissolveEdge) * (1.0 - smoothstep(0.7, 1.0, dissolveEdge));
  
  // ─────────────────────────────────────────────────────────────────────────
  // 2. FRESNEL & CHROMATIC ABERRATION
  // ─────────────────────────────────────────────────────────────────────────
  
  // Base fresnel for rim lighting
  float fresnel = fresnelRim(viewDir, normal, u_fresnelPower);
  
  // Chromatic fresnel for iridescence
  vec3 chromaticFresnel = fresnelChromatic(viewDir, normal, u_chromaticStrength);
  
  // ─────────────────────────────────────────────────────────────────────────
  // 3. ENVIRONMENT REFLECTION
  // ─────────────────────────────────────────────────────────────────────────
  
  vec3 envColor = vec3(0.1);
  
  if (u_useEnvMap) {
    // Calculate reflection vector
    vec3 reflectDir = reflect(-viewDir, normal);
    
    // Add slight distortion for organic feel
    float distortNoise = valueNoise(v_worldPosition * 2.0 + u_time * 0.5) * 0.1;
    reflectDir += normal * distortNoise;
    
    // Sample environment with chromatic aberration
    vec3 envR = textureCube(u_envMap, reflectDir + vec3(0.02 * u_chromaticStrength, 0.0, 0.0)).rgb;
    vec3 envG = textureCube(u_envMap, reflectDir).rgb;
    vec3 envB = textureCube(u_envMap, reflectDir - vec3(0.02 * u_chromaticStrength, 0.0, 0.0)).rgb;
    
    envColor = vec3(envR.r, envG.g, envB.b);
  }
  
  // ─────────────────────────────────────────────────────────────────────────
  // 4. COLOR COMPOSITION
  // ─────────────────────────────────────────────────────────────────────────
  
  // Base color with chromatic fresnel tint
  vec3 baseColor = u_color * (1.0 - chromaticFresnel * 0.3);
  
  // Add rim lighting
  vec3 rimColor = u_secondaryColor * fresnel * 1.5;
  
  // Add environment reflections (modulated by fresnel)
  vec3 reflectionColor = envColor * fresnel * 0.5;
  
  // Dissolve edge glow
  vec3 edgeColor = u_secondaryColor * edgeGlow * 3.0;
  
  // Combine all layers
  vec3 finalColor = baseColor + rimColor + reflectionColor + edgeColor;
  
  // ─────────────────────────────────────────────────────────────────────────
  // 5. ALPHA CALCULATION
  // ─────────────────────────────────────────────────────────────────────────
  
  // Base opacity with fresnel boost at edges
  float baseAlpha = u_opacity * (1.0 - u_dissolveProgress * 0.5);
  float rimAlpha = fresnel * 0.3;
  float finalAlpha = baseAlpha + rimAlpha;
  
  // Fade out dissolved areas
  finalAlpha *= (1.0 - dissolveEdge);
  
  // Boost alpha at glowing edges
  finalAlpha += edgeGlow * 0.5;
  
  // ─────────────────────────────────────────────────────────────────────────
  // OUTPUT
  // ─────────────────────────────────────────────────────────────────────────
  
  gl_FragColor = vec4(finalColor, clamp(finalAlpha, 0.0, 1.0));
}
