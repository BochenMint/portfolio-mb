/**
 * GLSL for the garden. Everything is lit by hand in linear space and graded
 * once at the end (`finish`), so every surface — soil, turf, rolls, petals —
 * shares one sun and one tone curve without dragging three's light system in.
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

const LIGHT = /* glsl */ `
uniform vec3 uSun;
uniform vec3 uSunCol;
uniform vec3 uSky;
`

/* ------------------------------------------------------------------ *
 * Soil — a bed that has just been dug over and raked level, which is the
 * first thing the visitor sees and the only thing on screen for the first
 * eighth of the scroll. It has to hold up at that size.
 *
 * Four scales, because that is what makes ground read as ground: the dig
 * (metres), the rake furrows (7 cm, and they are what says *prepared*
 * rather than *wild*), the clods a rake leaves behind (5 cm), and the fine
 * tilth (2 cm). On top of that sit the things a real bed has lying in it —
 * stones, bits of straw, damp patches where the sun has not reached.
 *
 * The fine scales are faded out with distance (`vDist`). Without that the
 * far half of the bed is a shimmering mess in motion and the derivative
 * normal turns into pixel noise, which is what the first attempt looked
 * like: an even field of lumps with no depth at all.
 * ------------------------------------------------------------------ */
export const SOIL_VERT = /* glsl */ `
varying vec3 vWorld;
varying float vDist;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vDist = length(w.xyz - cameraPosition);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

export const SOIL_FRAG = /* glsl */ `
${NOISE}
${LIGHT}
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
  vec2 rakeDir = normalize(vec2(0.96, 0.28));
  float across = dot(p, vec2(-rakeDir.y, rakeDir.x));
  float along = dot(p, rakeDir);
  float wobble = fbm3(p * 0.5 + 4.0) * 1.1 + billow * 0.5;
  float phase = (across + wobble) * 21.0;
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
  vec3 wet = vec3(0.016, 0.0115, 0.008);
  vec3 loam = vec3(0.046, 0.031, 0.021);
  vec3 dry = vec3(0.088, 0.066, 0.047);
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
  vec3 stoneC = mix(vec3(0.085, 0.08, 0.07), vec3(0.22, 0.21, 0.19), fract(v3.z * 31.0));
  c = mix(c, stoneC, stone);
  c = mix(c, vec3(0.19, 0.155, 0.09), straw * 0.9);

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

/* ------------------------------------------------------------------ *
 * Turf — shell-textured. One plane over the whole bed, drawn N times at
 * rising heights; each layer keeps only the pixels where a blade is still
 * that tall. The strip a pixel belongs to comes from its x, and the strip's
 * roll position from a uniform, so unrolling costs nothing but a compare.
 * ------------------------------------------------------------------ */
export const GRASS_VERT = /* glsl */ `
${NOISE}
attribute float aLayer;
uniform float uBase;
uniform float uHeight;
uniform float uTime;
varying vec3 vWorld;
varying float vLayer;
varying float vGust;
varying float vPatch;
varying float vNear;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  w.y = uBase + aLayer * uHeight;
  vWorld = w.xyz;
  vLayer = aLayer;
  // Gusts and colour patches are metres wide, so the plane's vertices sample
  // them and the rasteriser interpolates — fbm in every pixel of every shell
  // was the single most expensive thing on the page.
  vGust = fbm3(w.xz * 0.2 + vec2(uTime * 0.16, uTime * 0.05));
  vPatch = fbm3(w.xz * 0.42 + 4.0);
  // Blade-sized variation is worth drawing where a blade is several pixels
  // wide and is pure shimmer where it is not.
  vNear = 1.0 - smoothstep(7.0, 16.0, length(w.xyz - cameraPosition));
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

export const GRASS_FRAG = /* glsl */ `
${NOISE}
${LIGHT}
uniform float uX0;
uniform float uW;
uniform int uN;
uniform float uZc[8];
uniform float uShade[8];
uniform float uDensity;
uniform float uTime;
uniform float uKnit;
varying vec3 vWorld;
varying float vLayer;
varying float vGust;
varying float vPatch;
varying float vNear;

void main() {
  vec2 p = vWorld.xz;
  float fi = floor((p.x - uX0) / uW);
  int si = int(clamp(fi, 0.0, float(uN - 1)));
  float laid = uZc[si] - p.y;

  float h = vLayer;
  // Freshly laid turf is pressed flat by the roll and stands up behind it.
  float stand = smoothstep(0.0, 1.15, laid);
  float gust = vGust;

  /* --- tufts ---------------------------------------------------------
     Grass does not grow as an even pile of separate blades; it grows in
     clumps that share a root, a height and a direction. A lawn without them
     is a carpet, which is what this was: 30 identical blades per unit,
     every one of them upright. */
  vec2 tuft = floor(p * uDensity * 0.3);
  float tHeight = hash12(tuft + 41.0);
  float tHue = hash12(tuft + 77.0);
  vec2 tLean = (hash22(tuft + 13.0) - 0.5) * 1.3;

  /* --- the mower ------------------------------------------------------
     Alternate strips were cut in opposite directions, so their blades lie
     opposite ways. That — not a change of colour — is what a striped lawn
     actually is: one stripe shows the visitor its tips and the next its
     backs. */
  float dir = mod(fi, 2.0) < 0.5 ? 1.0 : -1.0;
  vec2 comb = vec2(0.1, -0.52) * dir;
  vec2 lean = comb + tLean * 0.45 + vec2(0.95, 0.35) * (gust - 0.45) * 0.85;

  vec2 uv = p * uDensity + lean * h * h * 2.4 * stand;
  // Derivatives before any discard: they are undefined once a quad diverges.
  float fw = fwidth(uv.x) * 0.85 + 0.015;
  if (laid < 0.0) discard;
  vec2 cell = floor(uv);
  vec2 f = fract(uv) - 0.5;
  float r1 = hash12(cell);
  vec2 jit = (hash22(cell + 17.0) - 0.5) * 0.44;
  // A few blades in every lawn missed the cut; without them the top of the
  // sward is a plane and reads as a haircut on a doll.
  float straggle = step(0.965, hash12(cell + 5.3)) * 0.5;
  float bladeH =
    mix(0.5, 1.0, r1) * mix(0.16, 1.0, stand) * mix(0.82, 1.14, tHeight) * (1.0 + straggle);
  float t = h / bladeH;

  float cover = 1.0;
  if (h > 0.001) {
    if (t > 1.0) discard;
    float rad = mix(0.47, 0.07, t);
    // A blade is long in the direction it leans and narrow across it. A
    // round footprint gave cones, which is why the lawn read as felt.
    vec2 ld = normalize(lean + vec2(1e-4, 1e-4));
    vec2 q = f - jit;
    vec2 e = vec2(dot(q, ld) * 0.62, dot(q, vec2(-ld.y, ld.x)) * 1.5);
    cover = 1.0 - smoothstep(rad - fw, rad + fw, length(e));
    if (cover < 0.02) discard;
  }

  float tt = h > 0.001 ? t : 0.32;
  vec3 root = vec3(0.01, 0.024, 0.006);
  vec3 mid = vec3(0.032, 0.115, 0.02);
  vec3 tip = vec3(0.17, 0.39, 0.065);
  vec3 c = mix(root, mid, smoothstep(0.0, 0.55, tt));
  c = mix(c, tip, smoothstep(0.42, 1.0, tt));
  // Per-blade and per-tuft variation, both faded out at distance where a
  // blade is a pixel and the variance is just noise.
  c *= 1.0 + (hash12(cell + 3.7) - 0.5) * 0.44 * vNear;
  c *= mix(0.88, 1.12, tHue);
  // Some tufts are a coarser, yellower grass — every real lawn is a mixture.
  c = mix(c, c * vec3(1.3, 1.05, 0.45), smoothstep(0.78, 0.98, tHue) * 0.5);
  c = mix(c, vec3(0.33, 0.34, 0.075), step(0.955, hash12(cell + 9.1)) * tt * 0.75 * vNear);
  c *= uShade[si];
  c *= 0.84 + 0.3 * vPatch;

  float ao = mix(0.32, 1.0, smoothstep(0.0, 0.85, h));
  vec3 lit = c * (uSky * 0.6 + uSunCol * (0.5 + 0.5 * tt)) * ao;
  // A gust lays the blades over and the lawn catches the sun in a wave.
  lit += uSunCol * c * smoothstep(0.42, 0.8, gust) * tt * tt * 0.85;
  lit *= mix(0.55, 1.0, stand);
  // The stripe itself: blades combed toward the camera show their lit tips,
  // blades combed away show their shaded backs.
  lit *= mix(0.9, 1.12, 0.5 + 0.5 * dir);

  // Joints between strips: bare soil in a thin line, closing as it knits.
  float u = (p.x - uX0) / uW;
  float edge = min(fract(u), 1.0 - fract(u)) * uW;
  float open = 1.0 - uKnit;
  float seam = (1.0 - smoothstep(0.0, 0.03 * open + 1e-4, edge)) * (1.0 - smoothstep(0.0, 0.35, h));
  lit = mix(lit, vec3(0.02, 0.011, 0.006), seam * open);

  gl_FragColor = vec4(finish(lit), cover);
}
`

/* ------------------------------------------------------------------ *
 * Turf roll — the root side faces out, as on a real sod roll; the grass is
 * rolled inside and only shows at the two ends, as a spiral.
 * ------------------------------------------------------------------ */
export const ROLL_VERT = /* glsl */ `
varying vec3 vLocal;
varying vec3 vN;
varying vec3 vWorld;
void main() {
  vLocal = position;
  vN = normalize(mat3(modelMatrix) * normal);
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`

export const ROLL_FRAG = /* glsl */ `
${NOISE}
${LIGHT}
uniform float uR0;
uniform float uR;
uniform float uLen;
varying vec3 vLocal;
varying vec3 vN;
varying vec3 vWorld;
void main() {
  float th = atan(vLocal.z, vLocal.y);
  vec2 q = vec2(th * uR0, vLocal.x * uLen);
  // The underside of a sod: dark soil held together by a mat of pale roots,
  // which run every way but read, wrapped round a roll, as fine streaks.
  float crumb = vnoise(q * 38.0) * 0.6 + vnoise(q * 90.0) * 0.4;
  vec3 c = mix(vec3(0.03, 0.016, 0.007), vec3(0.08, 0.047, 0.022), crumb);
  c *= 0.78 + 0.44 * fbm3(q * 1.3 + 3.0);
  // Roots: thin, pale and wandering. The warp is what stops them lining up
  // into a weave.
  vec2 wq = q + 0.18 * vec2(fbm3(q * 3.0), fbm3(q * 3.0 + 4.1));
  float fibres = smoothstep(0.76, 0.84, vnoise(vec2(wq.x * 7.0, wq.y * 26.0)));
  c = mix(c, vec3(0.2, 0.145, 0.08), fibres * 0.45);
  // Blades that were rolled in and poke out through the mat.
  c = mix(c, vec3(0.05, 0.12, 0.02), step(0.965, hash12(floor(q * 55.0))) * 0.7);
  c *= 0.88 + 0.24 * hash12(floor(q * 140.0));
  // Grass fringe where the blades stick out past the ends of the roll.
  float endD = (0.5 - abs(vLocal.x)) * uLen;
  float fringe = 1.0 - smoothstep(0.0, 0.03 + 0.03 * vnoise(q * 34.0), endD);
  c = mix(c, vec3(0.07, 0.19, 0.025), fringe * 0.9);

  vec3 n = normalize(vN);
  float ndl = max(dot(n, uSun), 0.0);
  vec3 lit = c * (uSky * 0.55 + uSunCol * ndl * 1.2);
  float y01 = clamp(vWorld.y / max(2.0 * uR, 1e-3), 0.0, 1.0);
  lit *= mix(0.4, 1.0, smoothstep(0.0, 0.5, y01));
  gl_FragColor = vec4(finish(lit), 1.0);
}
`

export const CAP_FRAG = /* glsl */ `
${NOISE}
${LIGHT}
uniform float uR;
uniform float uTau;
uniform float uCore;
uniform float uCapLight;
varying vec3 vLocal;
varying vec3 vN;
varying vec3 vWorld;
void main() {
  float rho = length(vLocal.yz) * uR;
  float th = atan(vLocal.z, vLocal.y);
  float s = (rho - uCore) / uTau - th / 6.2831853;
  float layer = fract(s);
  vec3 soil = mix(vec3(0.045, 0.024, 0.01), vec3(0.13, 0.08, 0.04), vnoise(vec2(th * 9.0, rho * 44.0)));
  vec3 grass = mix(vec3(0.035, 0.11, 0.015), vec3(0.15, 0.32, 0.045), vnoise(vec2(th * 34.0, rho * 18.0)));
  vec3 c = layer < 0.42 ? soil : grass;
  c *= 0.45 + 0.55 * smoothstep(0.0, 0.07, layer) * (1.0 - smoothstep(0.93, 1.0, layer));
  if (rho < uCore) c = vec3(0.02, 0.012, 0.006);
  c *= mix(0.7, 1.0, smoothstep(uR, uR * 0.82, rho));
  vec3 lit = c * (uSky * 0.75 + uSunCol * uCapLight);
  gl_FragColor = vec4(finish(lit), 1.0);
}
`

/* Soft contact / cast shadow, drawn on top of whatever is under it. */
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

/* ------------------------------------------------------------------ *
 * Flowers — one instanced quad per bloom, lying flat on its stem. The
 * growth curve lives here too: a flower's own clock is progress minus its
 * birth, so the whole bed plants itself from one uniform.
 * ------------------------------------------------------------------ */
const FLOWER_ATTRS = /* glsl */ `
uniform float uP;
uniform float uGrow;
uniform float uTime;
uniform float uWind;
uniform float uGrassTop;
attribute vec3 aPos;
attribute float aSize;
attribute vec3 aPetal;
attribute vec3 aCentre;
attribute vec3 aShape;
attribute float aBirth;
attribute float aSeed;

float growth() {
  return clamp((uP - aBirth) / uGrow, 0.0, 1.0);
}
/* A few never open. A bed where every single flower is out is a print of a
   bed; the ones still in bud are what date it to a particular morning. */
float opens() {
  return 1.0 - step(0.945, aSeed);
}
float stemTop(float sprout) {
  // Buds start down among the blades and climb out of them.
  return uGrassTop * 0.2 + (uGrassTop * 0.8 + aPos.z) * sprout;
}
vec2 sway(float height) {
  return vec2(
    sin(uTime * 1.35 + aPos.x * 1.7 + aSeed * 9.0),
    cos(uTime * 1.05 + aPos.y * 1.3 + aSeed * 5.0)
  ) * uWind * height;
}
`

export const BLOOM_VERT = /* glsl */ `
${FLOWER_ATTRS}
varying vec2 vUv;
varying float vOpen;
varying float vSprout;
varying vec3 vPetal;
varying vec3 vCentre;
varying vec3 vShape;
varying float vSeed;
void main() {
  float g = growth();
  float sprout = smoothstep(0.0, 0.42, g);
  float open = smoothstep(0.34, 1.0, g) * opens();
  float pop = open + sin(open * 3.14159) * 0.14;
  float height = stemTop(sprout);
  float s = aSize * mix(0.36, 1.0, max(sprout * 0.45, pop)) * step(1e-4, g);
  float ang = aSeed * 6.2831853 + (1.0 - open) * 1.3;
  float ca = cos(ang);
  float sa = sin(ang);
  vec2 local = vec2(position.x * ca - position.y * sa, position.x * sa + position.y * ca) * s;
  vec2 sw = sway(height);
  vec3 world = vec3(aPos.x + local.x + sw.x, height, aPos.y - local.y + sw.y);
  vUv = uv;
  vOpen = open;
  vSprout = sprout;
  vPetal = aPetal;
  vCentre = aCentre;
  vShape = aShape;
  vSeed = aSeed;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`

export const BLOOM_FRAG = /* glsl */ `
${NOISE}
${LIGHT}
varying vec2 vUv;
varying float vOpen;
varying float vSprout;
varying vec3 vPetal;
varying vec3 vCentre;
varying vec3 vShape;
varying float vSeed;
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p);
  float a = atan(p.y, p.x);
  float form = vShape.z;

  // Three leaves under every bloom: the foliage of the bed, and all there is
  // of the plant while it is still a sprout.
  float leaf = 0.0;
  float leafT = 0.0;
  float len = 0.98 * vSprout;
  for (int i = 0; i < 3; i++) {
    float la = vSeed * 6.2831853 + float(i) * 2.0944 + 0.4;
    vec2 d = vec2(cos(la), sin(la));
    float along = dot(p, d);
    float across = dot(p, vec2(-d.y, d.x));
    float u = clamp(along / max(len, 1e-3), 0.0, 1.0);
    float w = 0.3 * sin(u * 3.14159);
    float inside = step(0.0, along) * step(along, len) * (1.0 - smoothstep(w - 0.06, w, abs(across)));
    if (inside > leaf) {
      leaf = inside;
      leafT = u;
    }
  }

  /* Where the petal edge is, by form. One quad draws every kind of flower in
     the bed, so the shape has to come out of the maths rather than out of a
     mesh: lobe is 1 down the middle of a petal and 0 between two of them,
     and each form turns that into its own outline. */
  float lobe = abs(cos(a * vShape.x * 0.5));
  float k = pow(lobe, vShape.y);
  float pr;
  float cr;
  if (form < 0.5) {
    // Daisy: ray florets with real gaps between them.
    pr = mix(0.3, 0.8, pow(lobe, 0.45));
    cr = 0.2;
  } else if (form < 1.5) {
    // Pompom: a head of florets, near enough a disc.
    pr = mix(0.72, 0.82, k);
    cr = 0.07;
  } else if (form < 2.5) {
    // Cup: broad petals overlapping into a bowl.
    pr = mix(0.52, 0.8, pow(lobe, 0.32));
    cr = 0.1;
  } else {
    // Poppy: four wide petals round a big dark eye.
    pr = mix(0.48, 0.82, pow(lobe, 0.2));
    cr = 0.26;
  }
  pr *= vOpen;
  cr *= vOpen;
  float petal = 1.0 - smoothstep(pr - 0.07, pr + 0.01, r);
  float budR = 0.28 * vSprout * (1.0 - vOpen);
  float bud = 1.0 - smoothstep(budR - 0.06, budR, r);
  float centre = 1.0 - smoothstep(cr - 0.05, cr, r);

  float alpha = max(max(leaf, petal), bud);
  if (alpha < 0.02) discard;

  // Fresh growth: a shade lighter than the lawn, so a sprout is visible as
  // a sprout before it has a flower to show.
  vec3 leafC = mix(vec3(0.022, 0.075, 0.012), vec3(0.075, 0.2, 0.035), leafT);
  float rp = r / max(pr, 1e-3);
  vec3 pc = vPetal * mix(0.55, 1.0, smoothstep(0.05, 0.6, rp));
  pc *= mix(0.78, 1.0, k);
  if (form < 0.5) {
    // A ray floret is creased down its middle, which is the only thing that
    // separates two petals lying edge to edge.
    pc *= 0.88 + 0.12 * lobe + 0.06 * cos(a * vShape.x);
  } else if (form < 1.5) {
    // Dozens of florets, none of them resolvable: texture, not shape.
    pc *= 0.72 + 0.42 * vnoise(p * 11.0 + vSeed * 30.0);
  } else if (form < 2.5) {
    // The inside of a cup is in its own shadow.
    pc *= mix(0.5, 1.05, smoothstep(0.0, 0.85, rp));
  } else {
    // Poppies are near-black at the base of every petal.
    pc *= mix(0.32, 1.0, smoothstep(0.18, 0.5, rp));
  }
  vec3 budC = mix(vec3(0.04, 0.12, 0.02), vPetal * 0.75, smoothstep(0.5, 1.0, vSprout) * 0.6);
  vec3 c = leafC;
  c = mix(c, budC, bud);
  c = mix(c, pc, petal);
  c = mix(c, vCentre * (0.65 + 0.35 * vnoise(p * 16.0 + vSeed * 40.0)), centre);
  vec3 lit = c * (uSky * 0.5 + uSunCol * 0.92);
  gl_FragColor = vec4(finish(lit), alpha);
}
`

export const STEM_VERT = /* glsl */ `
${FLOWER_ATTRS}
uniform vec3 uCamRight;
uniform float uStemW;
varying float vT;
void main() {
  float g = growth();
  float sprout = smoothstep(0.0, 0.42, g);
  float height = stemTop(sprout);
  vec2 sw = sway(height);
  float t = position.y + 0.5;
  vec3 base = vec3(aPos.x, 0.0, aPos.y);
  vec3 top = vec3(aPos.x + sw.x, height, aPos.y + sw.y);
  vec3 world = mix(base, top, t) + uCamRight * position.x * uStemW * step(1e-4, g);
  vT = t;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`

export const STEM_FRAG = /* glsl */ `
${NOISE}
${LIGHT}
varying float vT;
void main() {
  vec3 c = mix(vec3(0.02, 0.06, 0.01), vec3(0.07, 0.2, 0.035), vT);
  gl_FragColor = vec4(finish(c * (uSky * 0.6 + uSunCol * 0.8)), 1.0);
}
`

export const FLOWER_SHADOW_VERT = /* glsl */ `
${FLOWER_ATTRS}
uniform vec2 uShadowDir;
varying vec2 vUv;
varying float vA;
void main() {
  float g = growth();
  float sprout = smoothstep(0.0, 0.42, g);
  float open = smoothstep(0.34, 1.0, g) * opens();
  float height = stemTop(sprout);
  float s = aSize * mix(0.3, 0.95, open) * step(1e-4, g);
  vec2 off = uShadowDir * height;
  vec3 world = vec3(aPos.x + off.x + position.x * s, uGrassTop + 0.006, aPos.y + off.y - position.y * s);
  vUv = uv;
  vA = sprout;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`

export const FLOWER_SHADOW_FRAG = /* glsl */ `
varying vec2 vUv;
varying float vA;
void main() {
  float r = length((vUv - 0.5) * 2.0);
  float a = (1.0 - smoothstep(0.25, 1.0, r)) * 0.42 * vA;
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}
`
