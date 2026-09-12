/**
 * GLSL genuinely shared by every scene on this stage. Everything is lit by
 * hand in linear space and graded once at the end (`finish`, bundled into
 * `NOISE` below), so every surface across every landing shares one sun and
 * one tone curve without dragging three's light system in.
 *
 * Written against three's ShaderMaterial, which accepts GLSL1-style
 * `attribute` / `varying` / `gl_FragColor` on WebGL2.
 */

export const NOISE = /* glsl */ `
float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}
float vnoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash12(i);
  float b = hash12(i + vec2(1.0, 0.0));
  float c = hash12(i + vec2(0.0, 1.0));
  float d = hash12(i + vec2(1.0, 1.0));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    s += a * vnoise(p);
    p = p * 2.03 + vec2(1.7, 9.2);
    a *= 0.5;
  }
  return s;
}
float fbm3(vec2 p) {
  float s = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    s += a * vnoise(p);
    p = p * 2.07 + vec2(5.3, 1.3);
    a *= 0.5;
  }
  return s / 0.875;
}
/* F1, F2 and the id of the nearest cell. */
vec3 voronoi(vec2 p) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  float f1 = 8.0;
  float f2 = 8.0;
  float id = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash22(n + g);
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < f1) {
        f2 = f1;
        f1 = d;
        id = hash12(n + g);
      } else if (d < f2) {
        f2 = d;
      }
    }
  }
  return vec3(sqrt(f1), sqrt(f2), id);
}
/* Narkowicz ACES fit, then display gamma. */
vec3 finish(vec3 lin) {
  vec3 x = lin * 0.95;
  x = clamp((x * (2.51 * x + 0.03)) / (x * (2.43 * x + 0.59) + 0.14), 0.0, 1.0);
  return pow(x, vec3(1.0 / 2.2));
}
`

/** One sun, one sky, shared by every material on the stage. Exported — a
 *  private copy of this used to get redeclared wherever a scene file needed
 *  it (`trees.ts` still had its own until this moved here). */
export const LIGHT = /* glsl */ `
uniform vec3 uSun;
uniform vec3 uSunCol;
uniform vec3 uSky;
`

/* Soft contact / cast shadow, drawn on top of whatever is under it. Used for
   the garden's roll shadows; anything else that needs a soft blob shadow
   (a stone, a pot) can reach for the same pair. */
export const BLOB_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`

export const BLOB_FRAG = /* glsl */ `
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec2 d = (vUv - 0.5) * 2.0;
  float r = length(d);
  float a = (1.0 - smoothstep(0.15, 1.0, r)) * uOpacity;
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}
`
