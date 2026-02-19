/**
 * ApexDissolve — 3D Volumetric Dissolve Shader
 * V4.0.0-HYDRE-APEX Compliant
 *
 * ARCHITECTURE:
 * ┌─────────────────────────────────────────────────────────┐
 * │  Vertex: Pass raw local-space position to fragment      │
 * │  Fragment: 3D Simplex Noise → threshold discard         │
 * │           → emissive plasma edge on the cut boundary    │
 * └─────────────────────────────────────────────────────────┘
 *
 * Uses 3D Simplex Noise (Ashima Arts) mapped to vLocalPosition
 * instead of 2D UV noise — guarantees seamless volumetric
 * continuity across the entire surface regardless of UV layout.
 *
 * Injected via three-custom-shader-material (CSM) which
 * extends MeshPhysicalMaterial's shader AST without
 * replacing the entire lighting pipeline.
 */

export const dissolveVertex = `
  varying vec3 vLocalPosition;
  
  void main() {
    // Pass the raw, unscaled local coordinates to the fragment shader
    // This ensures the noise field sticks to the geometry even if it moves
    vLocalPosition = position;
  }
`;

export const dissolveFragment = `
  varying vec3 vLocalPosition;
  uniform float uProgress;
  uniform vec3 uEdgeColor;
  uniform float uThickness;

  // ─────────────────────────────────────────────────────────
  // 3D SIMPLEX NOISE ALGORITHM (Ashima Arts)
  // Volumetric noise ensures seamless dissolution across
  // all UV islands — no 2D seam tearing artifacts.
  // ─────────────────────────────────────────────────────────
  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
  float snoise(vec3 v){ 
    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy) );
    vec3 x0 = v - i + dot(i, C.xxx) ;
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min( g.xyz, l.zxy );
    vec3 i2 = max( g.xyz, l.zxy );
    vec3 x1 = x0 - i1 + 1.0 * C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
    i = mod(i, 289.0 ); 
    vec4 p = permute( permute( permute( 
               i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
             + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
             + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    float n_ = 1.42857142857143; // 1.0/0.7
    vec3  ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_ );
    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4( x.xy, y.xy );
    vec4 b1 = vec4( x.zw, y.zw );
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                  dot(p2,x2), dot(p3,x3) ) );
  }

  void main() {
    // 1. Generate noise mapped to the object's physical size.
    //    150.0 multiplier scales the dissolve chunk granularity.
    float noiseVal = snoise(vLocalPosition * 150.0);
    
    // Remap noise from [-1, 1] to [0, 1]
    noiseVal = noiseVal * 0.5 + 0.5;

    // 2. The Disintegration Cut
    //    Pad progress slightly to ensure complete disappearance at uProgress = 1.0
    float threshold = uProgress * 1.2 - 0.1; 
    
    if (noiseVal < threshold) {
      discard; // Kill the pixel immediately. Zero VRAM overhead.
    }

    // 3. The Emissive Plasma Edge
    //    Isolate a band right on the edge of the threshold
    float edgeMask = 1.0 - smoothstep(threshold, threshold + uThickness, noiseVal);
    
    // INJECT into CSM's native emissive chunk
    csm_Emissive += uEdgeColor * edgeMask * 8.0; 
  }
`;
