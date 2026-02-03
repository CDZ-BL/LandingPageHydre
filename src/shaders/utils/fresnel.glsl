/**
 * Fresnel Effect — GLSL Implementation
 * Creates the characteristic rim lighting of premium glass/mercury materials
 * 
 * Based on Schlick's approximation for physically-based rendering
 */

/**
 * Calculate Fresnel factor using Schlick's approximation
 * 
 * @param viewDir - Normalized view direction
 * @param normal - Normalized surface normal
 * @param ior - Index of refraction (glass ~1.5, water ~1.33)
 * @returns float - Fresnel factor [0, 1]
 */
float fresnelSchlick(vec3 viewDir, vec3 normal, float ior) {
  // Calculate F0 (reflectance at normal incidence)
  float f0 = pow((1.0 - ior) / (1.0 + ior), 2.0);
  
  // Schlick's approximation
  float cosTheta = max(dot(viewDir, normal), 0.0);
  return f0 + (1.0 - f0) * pow(1.0 - cosTheta, 5.0);
}

/**
 * Simplified Fresnel for rim lighting effect
 * 
 * @param viewDir - Normalized view direction
 * @param normal - Normalized surface normal
 * @param power - Fresnel power (higher = sharper falloff)
 * @returns float - Fresnel intensity [0, 1]
 */
float fresnelRim(vec3 viewDir, vec3 normal, float power) {
  float rim = 1.0 - max(dot(viewDir, normal), 0.0);
  return pow(rim, power);
}

/**
 * Mercury-style fresnel with configurable parameters
 * Combines rim lighting with base reflectance
 * 
 * @param viewDir - Normalized view direction (camera to surface)
 * @param normal - Normalized surface normal
 * @param rimPower - Power for rim effect (3.0 = subtle, 5.0 = sharp)
 * @param rimIntensity - Multiplier for rim brightness
 * @param baseReflectance - Minimum reflectance at center
 * @returns float - Final fresnel value
 */
float fresnelMercury(
  vec3 viewDir,
  vec3 normal,
  float rimPower,
  float rimIntensity,
  float baseReflectance
) {
  float rim = fresnelRim(viewDir, normal, rimPower);
  return baseReflectance + rim * rimIntensity;
}

/**
 * Iridescent fresnel for color-shifting effects
 * Returns RGB fresnel values with chromatic dispersion
 * 
 * @param viewDir - Normalized view direction
 * @param normal - Normalized surface normal
 * @param iorR - Index of refraction for red channel
 * @param iorG - Index of refraction for green channel  
 * @param iorB - Index of refraction for blue channel
 * @returns vec3 - RGB fresnel values
 */
vec3 fresnelIridescent(
  vec3 viewDir,
  vec3 normal,
  float iorR,
  float iorG,
  float iorB
) {
  return vec3(
    fresnelSchlick(viewDir, normal, iorR),
    fresnelSchlick(viewDir, normal, iorG),
    fresnelSchlick(viewDir, normal, iorB)
  );
}
