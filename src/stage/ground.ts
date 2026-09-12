/**
 * Prepared ground — a bed that has just been dug over and raked level, which
 * is the first thing the visitor sees and the only thing on screen for the
 * first eighth of the scroll. It has to hold up at that size.
 *
 * Four scales, because that is what makes ground read as ground: the dig
 * (metres), the rake furrows (7 cm, and they are what says *prepared* rather
 * than *wild*), the clods a rake leaves behind (5 cm), and the fine tilth
 * (2 cm). On top of that sit the things a real bed has lying in it — stones,
 * bits of straw, damp patches where the sun has not reached.
 *
 * The fine scales are faded out with distance (`vDist`). Without that the
 * far half of the bed is a shimmering mess in motion and the derivative
 * normal turns into pixel noise, which is what the first attempt looked
 * like: an even field of lumps with no depth at all.
 *
 * Extracted from the garden's own soil shader with two things pulled out
 * for the next trade to set: the palette (wet/loam/dry/stone/straw) and the
 * rake (its direction and how many furrows cross the bed), both as uniforms
 * so the shader itself never needs recompiling per landing. Everything
 * else — the two height fields, the distance fade, the `COARSE` define —
 * stays exactly as tuned for the garden.
 */

import { LIGHT, NOISE } from './shaders'

export type GroundPalette = {
  wet: [number, number, number]
  loam: [number, number, number]
  dry: [number, number, number]
  stoneLo: [number, number, number]
  stoneHi: [number, number, number]
  straw: [number, number, number]
}

/** The garden's own palette — freshly dug loam, not yet planted. */
export const GARDEN_PALETTE: GroundPalette = {
  wet: [0.016, 0.0115, 0.008],
  loam: [0.046, 0.031, 0.021],
  dry: [0.088, 0.066, 0.047],
  stoneLo: [0.085, 0.08, 0.07],
  stoneHi: [0.22, 0.21, 0.19],
  straw: [0.19, 0.155, 0.09],
}

export type RakeConfig = {
  /** Direction the rake was dragged in, ground-plane xz (need not be unit —
   *  the shader normalises it). */
  dir: [number, number]
  /** How many furrow crests cross the bed. */
  freq: number
}

/** The garden's own rake: dragged almost along x, with a slight drift. */
export const GARDEN_RAKE: RakeConfig = { dir: [0.96, 0.28], freq: 21.0 }

export const GROUND_VERT = /* glsl */ `
varying vec3 vWorld;
varying float vDist;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vDist = length(w.xyz - cameraPosition);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

export const GROUND_FRAG = /* glsl */ `
${NOISE}
${LIGHT}
uniform vec3 uWet;
uniform vec3 uLoam;
uniform vec3 uDry;
uniform vec3 uStoneLo;
uniform vec3 uStoneHi;
uniform vec3 uStraw;
uniform vec2 uRakeDir;
uniform float uRakeFreq;
varying vec3 vWorld;
varying float vDist;

void main() {
  vec2 p = vWorld.xz;
  // How much fine detail this pixel may have. Near the camera one crumb is
  // ~10 px across; by the far edge it is under one, and drawing it there
  // buys nothing but aliasing.
  float near = 1.0 - smoothstep(6.0, 15.0, vDist);
  float fine = near * near;

  /* --- the dig: where the ground is high and where it is hollow --- */
  float billow = fbm3(p * 0.42 + 2.0);
  float dig = fbm3(p * 1.05 + 9.0);

  /* --- rake furrows -------------------------------------------------
     A rake is dragged in one direction and its line wanders: the wobble
     is what keeps these from reading as corduroy. The tines also skip, so
     the crest height is modulated along the furrow rather than constant. */
  vec2 rakeDir = normalize(uRakeDir);
  float across = dot(p, vec2(-rakeDir.y, rakeDir.x));
  float along = dot(p, rakeDir);
  float wobble = fbm3(p * 0.5 + 4.0) * 1.1 + billow * 0.5;
  float phase = (across + wobble) * uRakeFreq;
  // Asymmetric, not a sine: a rake leaves a narrow crest with a long slope
  // behind it. A plain sin(x) read as rippled sand, which is what the first
  // pass of this looked like — dunes, not a seed bed.
  float saw = 0.5 + 0.5 * sin(phase);
  float furrow = pow(saw, 2.6);
  // Crests break up along their length, and the rake lifts in places: what
  // must never happen is one clean corrugation running the width of the bed.
  float run = 0.3 + 0.7 * fbm3(vec2(along * 2.1, across * 6.0));
  float lift = smoothstep(0.2, 0.62, fbm3(p * 0.38 + 7.0));
  float rake = furrow * run * (0.25 + 0.75 * lift);

  /* --- clods and tilth ----------------------------------------------
     Three sizes of lump, each sparser than the last, because soil that has
     been turned over is graded: a few fist-sized clods the rake could not
     break, a crumb structure under them, and dust in the hollows. */
  vec2 warp = p + 0.22 * vec2(fbm3(p * 1.1), fbm3(p * 1.1 + 5.3));
  // Rounded lumps, not cells: distance to the nearest seed makes a dome,
  // where F2 − F1 would have made plates with cracks between them — dried
  // mud, which is the opposite of a bed that has just been dug over.
  vec3 v1 = voronoi(warp * 4.6);
  // Only some cells carry a clod. An even field of them was the single
  // thing that made the first version read as texture instead of ground.
  float clodMask = smoothstep(0.4, 0.72, v1.z);
  float clod = (1.0 - smoothstep(0.0, 0.44, v1.x)) * clodMask;
  vec3 v2 = voronoi(warp * 13.0 + 3.1);
  // Not every cell, and not one size: an even field of round domes reads as
  // sand sprinkled on chocolate, which is exactly what it looked like.
  float crumbR = 0.18 + 0.3 * fract(v2.z * 5.0);
  float crumb = (1.0 - smoothstep(0.0, crumbR, v2.x)) * step(0.35, fract(v2.z * 11.0)) * mix(0.45, 1.0, fine);
  // The roughness between the lumps: no shape of its own, which is the
  // point — it is what stops the ground reading as a poured surface.
  float tooth = (fbm3(warp * 24.0) - 0.5) * fine;
#ifndef COARSE
  // The finest grade, close to the camera only: 8 mm crumbs, which is where
  // the ground stops being a surface and starts being a material.
  vec3 v4 = voronoi(warp * 31.0 + 7.7);
  float grit = (1.0 - smoothstep(0.0, 0.5, v4.x)) * fine * fine;
#else
  float grit = 0.0;
#endif

  /* --- what is lying on the bed -------------------------------------- */
  vec3 v3 = voronoi(p * 2.2 + 11.0);
  float stoneR = 0.06 + 0.09 * fract(v3.z * 17.0);
  float stone = step(0.955, v3.z) * (1.0 - smoothstep(stoneR - 0.02, stoneR, v3.x)) * near;
  // Straw: a few dry stalks left from the turf that was cut, each lying in
  // its own direction. Thin enough that they read as lines, not sticks.
  vec2 sc = p * 1.9;
  vec2 si = floor(sc);
  vec2 sf = fract(sc) - 0.5;
  float sk = hash12(si + 21.0);
  float sa = hash12(si + 5.0) * 3.14159;
  vec2 sd = vec2(cos(sa), sin(sa));
  float strawLen = 0.18 + 0.14 * hash12(si + 33.0);
  float straw =
    step(0.955, sk) *
    step(abs(dot(sf, sd)), strawLen) *
    (1.0 - smoothstep(0.006, 0.016, abs(dot(sf, vec2(-sd.y, sd.x))))) *
    fine;

  // Two height fields, not one. The big one — the dig and the rake — is what
  // shades the bed: hollows see less sky than crests do. The small one only
  // tilts the normal. Letting the crumbs drive the ambient term as well gave
  // every one of them a bright top *and* a bright surround, which is how a
  // seed bed turns into a tray of breadcrumbs.
  float hLow = billow * 0.14 + dig * 0.09 + rake * 0.15;
  float hDetail = clod * 0.4 + crumb * 0.18 + tooth * 0.1 + grit * 0.12 + stone * 0.45 + straw * 0.12;
  float h = hLow + hDetail;

  /* --- normal, from the height field in screen space ------------------ */
  vec3 dpx = dFdx(vWorld);
  vec3 dpy = dFdy(vWorld);
  float dhx = dFdx(h);
  float dhy = dFdy(h);
  float det = dpx.x * dpy.z - dpx.z * dpy.x;
  vec2 g = abs(det) > 1e-9 ? vec2(dhx * dpy.z - dhy * dpx.z, dpx.x * dhy - dpy.x * dhx) / det : vec2(0.0);
  // Strong near, flat far: the same slope at the far edge is a pixel wide
  // and only produces sparkle.
  float relief = mix(0.045, 0.19, near);
  vec3 n = normalize(vec3(-g.x * relief, 1.0, -g.y * relief));

  /* --- colour ---------------------------------------------------------
     One quiet albedo, and every grain of detail from the shading. Driving
     the colour off the height instead — pale crests, dark hollows — is what
     turned the first two passes into chocolate cake with sprinkles: at this
     distance a crumb is four pixels, and four bright pixels on a dark ground
     read as a speck of something rather than as a lump of earth.

     So: the colour only carries what is genuinely a colour difference —
     how wet the ground is, and which clod came up from where. */
  vec3 wet = uWet;
  vec3 loam = uLoam;
  vec3 dry = uDry;
  // Metres-wide patches of drier crust, the sort a bed gets between showers.
  float crust = smoothstep(0.34, 0.8, fbm(p * 0.3)) * 0.8 + 0.3 * smoothstep(0.45, 0.92, fbm3(p * 1.1 + 7.0));
  vec3 c = mix(loam, dry, crust);
  // Every clod its own shade — a lump of soil that came up whole is not the
  // same colour as the tilth around it, and nothing else separates them.
  c *= mix(0.86, 1.14, fract(v1.z * 7.3) * clod + 0.5 * (1.0 - clod));
  // …and the tilth between them varies too, but only just: this is the
  // difference between a material and a surface, not a pattern.
  c *= mix(0.94, 1.07, fract(v2.z * 19.0));
  // Damp ground: cooler and much darker, in patches metres across, with the
  // hollows holding the water.
  float damp = smoothstep(0.6, 0.24, fbm3(p * 0.36 + 2.0));
  c = mix(c, wet, damp * 0.85);
  // Grain, tightened up close and gone at distance.
  c *= 1.0 + (hash12(floor(p * 150.0)) - 0.5) * 0.16 * fine;
  vec3 stoneC = mix(uStoneLo, uStoneHi, fract(v3.z * 31.0));
  c = mix(c, stoneC, stone);
  c = mix(c, uStraw, straw * 0.9);

  /* --- light ----------------------------------------------------------- */
  float ndl = max(dot(n, uSun), 0.0);
  // Hollows see less of the sky than crests do, and the gaps between crumbs
  // are the darkest thing on a bed of soil — which is what makes it read as
  // loose rather than poured. Kept gentle: this is ambient occlusion, and
  // occlusion that reaches black turns the tilth into soot.
  float cavity = mix(0.72, 1.0, smoothstep(0.02, 0.34, hLow)) * mix(1.0, 0.88, clod);
  // The sun is low and raking, so a furrow throws a shadow into the next
  // trough. Sign of the slope across the rake against the sun's direction.
  float sunAcross = dot(normalize(vec2(-rakeDir.y, rakeDir.x)), normalize(uSun.xz));
  float selfShadow = mix(1.0, 0.7, smoothstep(0.1, 0.9, -cos(phase) * sunAcross) * rake);
  vec3 lit = c * (uSky * 0.66 + uSunCol * ndl * 1.25) * cavity * selfShadow;
  // Damp soil is glossy where the sun catches it flat.
  float gloss = pow(max(dot(reflect(-uSun, n), normalize(cameraPosition - vWorld)), 0.0), 22.0);
  lit += uSunCol * gloss * (0.02 + 0.1 * damp) * near;
  gl_FragColor = vec4(finish(lit), 1.0);
}
`

/** Build the ground shader's uniform set from a palette + rake, given the
 *  landing's own `THREE` (dynamically imported, never at module scope here). */
export function groundUniforms(THREE: typeof import('three'), palette: GroundPalette, rake: RakeConfig) {
  return {
    uWet: { value: new THREE.Vector3(...palette.wet) },
    uLoam: { value: new THREE.Vector3(...palette.loam) },
    uDry: { value: new THREE.Vector3(...palette.dry) },
    uStoneLo: { value: new THREE.Vector3(...palette.stoneLo) },
    uStoneHi: { value: new THREE.Vector3(...palette.stoneHi) },
    uStraw: { value: new THREE.Vector3(...palette.straw) },
    uRakeDir: { value: new THREE.Vector2(...rake.dir) },
    uRakeFreq: { value: rake.freq },
  }
}
