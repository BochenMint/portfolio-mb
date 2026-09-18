import{n as e,r as t,t as n}from"./jsx-runtime-i9uBjpvk.js";import{c as r,l as i}from"./content-CeKOOgdU.js";import{a,c as o,d as s,f as c,g as l,h as u,i as d,l as f,m as p,n as m,o as ee,p as h,r as g,s as te,t as _,u as ne}from"./Sections-LFUklj2h.js";var v=t(),y=e(),b={DAISY:0,POMPOM:1,CUP:2,POPPY:3},x={petal:`#fbf6ea`,centre:`#f0b429`,petals:13,round:.35,form:b.DAISY,size:1,height:1},S={petal:`#ffe27e`,centre:`#d9822b`,petals:9,round:.6,form:b.DAISY,size:.94,height:.92},C={petal:`#ffc4d2`,centre:`#f5c93b`,petals:6,round:1.4,form:b.CUP,size:1.02,height:1.1},w={petal:`#fdeccd`,centre:`#e8c15a`,petals:20,round:.2,form:b.POMPOM,size:.82,height:.84},T={petal:`#ffcf9b`,centre:`#e0913a`,petals:6,round:1.1,form:b.CUP,size:1.06,height:1.28},E={petal:`#ee2e1c`,centre:`#ffd23f`,petals:5,round:1.6,form:b.POMPOM,size:1,height:.95},D={petal:`#ff5b3d`,centre:`#ffd65a`,petals:5,round:1.3,form:b.DAISY,size:1,height:1},O={petal:`#e01f12`,centre:`#2a0d06`,petals:4,round:.85,form:b.POPPY,size:1.22,height:1.2},k=[[`Zbuduję dla Ciebie`,`nową stronę`],[`Zbuduję dla`,`Ciebie nową`,`stronę`],[`Zbuduję`,`dla Ciebie`,`nową`,`stronę`],[`Zbuduję`,`dla`,`Ciebie`,`nową`,`stronę`]];function A(e){let t=M(e.seed??20260911),{points:n,lines:r,em:i,pitch:a}=g({layouts:k,width:e.width,depth:e.depth,centreZ:e.centreZ,stretch:e.stretch,maxCount:e.maxCount,fontFamily:e.fontFamily,rand:t}),o=n.length,s={count:o,pos:new Float32Array(o*3),size:new Float32Array(o),petal:new Float32Array(o*3),centre:new Float32Array(o*3),shape:new Float32Array(o*3),birth:new Float32Array(o),seed:new Float32Array(o),lines:r,em:i,pitch:a},c=Math.max(1,r.length-1);for(let r=0;r<o;r++){let i=n[r],o=t(),l=i.edge?o<.6?E:o<.88?D:O:o<.42?x:o<.66?S:o<.83?w:o<.94?C:T,u=.94+t()*.1,d=j(l.petal),f=j(l.centre);s.pos[r*3]=i.x,s.pos[r*3+1]=i.z,s.pos[r*3+2]=a*(.9+t()*.7)*l.height,s.size[r]=a*(i.edge?1.6:1.85)*l.size*(.9+t()*.22),s.petal.set([d[0]*u,d[1]*u,d[2]*u],r*3),s.centre.set(f,r*3),s.shape[r*3]=l.petals,s.shape[r*3+1]=l.round,s.shape[r*3+2]=l.form;let p=i.nx*.82+i.line/c*.12+t()*.06;s.birth[r]=e.timeline.start+e.timeline.sweep*p+(i.edge?0:e.timeline.edgeLead),s.seed[r]=t()}return s}function j(e){let t=parseInt(e.slice(1),16),n=e=>(e/255)**2.2;return[n(t>>16&255),n(t>>8&255),n(t&255)]}function M(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var N=`
${h}
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
`,re=`
${h}
${c}
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
`,P=`
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
`,F=`
${h}
${c}
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
`,I=`
${h}
${c}
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
`,L=`
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
`,R=`
${L}
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
`,ie=`
${h}
${c}
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
`,z=`
${L}
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
`,B=`
${h}
${c}
varying float vT;
void main() {
  vec3 c = mix(vec3(0.02, 0.06, 0.01), vec3(0.07, 0.2, 0.035), vT);
  gl_FragColor = vec4(finish(c * (uSky * 0.6 + uSunCol * 0.8)), 1.0);
}
`,V=`
${L}
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
`,H=`
varying vec2 vUv;
varying float vA;
void main() {
  float r = length((vUv - 0.5) * 2.0);
  float a = (1.0 - smoothstep(0.25, 1.0, r)) * 0.42 * vA;
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}
`,U={introHold:.025,introOut:.075,rollStart:.05,rollSpan:.36,rollStagger:.12,knit:[.5,.64],plantStart:.52,plantEnd:.66,flowerStart:.56,flowerSweep:.24,edgeLead:.035,flowerGrow:.075,outro:[.88,.94]},W=12,G=`
attribute vec3 aCentre;
attribute vec3 aDir;
attribute vec3 aUp;
attribute vec2 aSize;
attribute float aSeed;
attribute float aShrubId;
attribute float aBirth;
uniform float uTime;
uniform float uWind;
uniform float uGrow[${W}];
varying vec2 vLeaf;
varying vec3 vNormal;
varying float vSeed;
varying float vShrubId;
varying float vScale;
void main() {
  float g = clamp((uGrow[int(aShrubId)] - aBirth) / 0.4, 0.0, 1.0);
  // A leaf unfurls: it scales past its size and settles back, which is what
  // stops a planting from looking like it was switched on.
  float ease = g * g * (3.0 - 2.0 * g);
  float scale = ease * (1.0 + 0.16 * sin(ease * 3.14159));

  vec3 dir = normalize(aDir);
  vec3 up = normalize(aUp - dir * dot(aUp, dir));
  vec3 side = cross(up, dir);

  // Wind: the whole shrub leans and each leaf flutters around its own axis.
  // Small — this is a box ball, not a willow.
  float phase = aSeed * 6.2831853 + aShrubId * 1.7;
  float gust = 0.5 * sin(uTime * 1.1 + phase) + 0.5 * sin(uTime * 0.37 + phase * 2.3);
  vec3 sway = vec3(gust, 0.0, gust * 0.6) * uWind;
  float flutter = gust * 0.14;

  // position.xy is the quad's own −0.5…0.5; its y runs along the leaf, which
  // is anchored at the stem rather than centred, so it grows outward.
  vec2 q = position.xy * aSize * scale;
  vec3 world =
    aCentre +
    sway +
    side * (q.x * cos(flutter)) +
    up * (q.y + aSize.y * 0.5 * scale) +
    dir * (-abs(q.x) * 0.12 + q.y * flutter * 0.3);

  vLeaf = position.xy * 2.0;
  vNormal = normalize(dir + up * flutter * 0.5);
  vSeed = aSeed;
  vShrubId = aShrubId;
  vScale = scale;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`,K=`
${h}
${c}
uniform float uWarmth[${W}];
varying vec2 vLeaf;
varying vec3 vNormal;
varying float vSeed;
varying float vShrubId;
varying float vScale;
void main() {
  if (vScale < 0.02) discard;

  /* The leaf itself: widest a third of the way up, drawn to a point. The
     shape carries more than any amount of texture — a rectangle of green
     reads as a rectangle however it is shaded. */
  float t = clamp(vLeaf.y * 0.5 + 0.5, 0.0, 1.0);
  float halfW = 0.5 * sin(3.14159 * pow(t, 0.72)) * (1.0 - 0.25 * t);
  float d = abs(vLeaf.x * 0.5) - halfW;
  if (d > 0.0) discard;

  float warmth = uWarmth[int(vShrubId)];
  vec3 deep = mix(vec3(0.018, 0.045, 0.016), vec3(0.035, 0.04, 0.014), warmth);
  vec3 fresh = mix(vec3(0.085, 0.2, 0.055), vec3(0.13, 0.15, 0.05), warmth);
  // Old leaves sit low and dark, new growth is at the tips and lighter.
  vec3 c = mix(deep, fresh, smoothstep(0.1, 0.95, t) * (0.55 + 0.45 * hash12(vec2(vSeed * 37.0, 3.1))));
  c *= 0.82 + 0.36 * hash12(vec2(vSeed * 91.0, 7.7));

  // Midrib and a hint of veins: thin, dark, and the detail that survives at
  // four pixels a leaf to say "leaf" on its own.
  float rib = 1.0 - smoothstep(0.0, 0.055, abs(vLeaf.x * 0.5));
  float veins = smoothstep(0.55, 0.95, abs(sin(vLeaf.y * 9.0 + vLeaf.x * 3.0)));
  c *= 1.0 - rib * 0.28 - veins * 0.06 * (1.0 - rib);

  vec3 N = normalize(vNormal);
  float ndl = max(dot(N, uSun), 0.0);
  // A leaf is thin, so the sun behind it comes through. That glow is most of
  // what separates foliage from painted plastic.
  float through = pow(max(dot(-N, uSun), 0.0), 1.6) * 0.5;
  vec3 lit = c * (uSky * 0.45 + uSunCol * (0.22 + 0.85 * ndl));
  lit += c * uSunCol * through;
  lit += uSunCol * pow(max(dot(reflect(-uSun, N), vec3(0.0, 1.0, 0.0)), 0.0), 18.0) * 0.09 * t;

  // The rim of the leaf goes translucent rather than ending on a hard edge.
  float alpha = 1.0 - smoothstep(-0.035, 0.0, d);
  gl_FragColor = vec4(finish(lit), alpha);
}
`,q=`
attribute vec2 aCentre;
attribute vec2 aSize;
attribute float aShrubId;
uniform vec2 uShadowDir;
uniform float uGrow[${W}];
varying vec2 vUv;
varying vec2 vWorldXZ;
varying float vAlpha;
void main() {
  float g = clamp(uGrow[int(aShrubId)], 0.0, 1.0);
  vec2 dir = normalize(uShadowDir);
  vec2 perp = vec2(-dir.y, dir.x);
  vec2 local = (dir * position.x * aSize.x + perp * position.y * aSize.y) * max(g, 0.001);
  // Just above the tallest blade, so it depth-tests in front of the lawn.
  vec3 world = vec3(aCentre.x + local.x, 0.2, aCentre.y + local.y);
  vUv = position.xy + 0.5;
  vWorldXZ = world.xz;
  vAlpha = g;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`,J=`
${h}
varying vec2 vUv;
varying vec2 vWorldXZ;
varying float vAlpha;
void main() {
  float r = length((vUv - 0.5) * 2.0);
  float a = (1.0 - smoothstep(0.1, 1.0, r)) * 0.3 * vAlpha;
  // Dappled: a shrub leaks light through every gap between its leaves.
  float gaps = fbm3(vWorldXZ * 5.0) * 0.65 + fbm3(vWorldXZ * 12.0 + 3.0) * 0.35;
  a *= mix(0.4, 1.0, smoothstep(0.3, 0.7, gaps + (1.0 - r) * 0.25));
  gl_FragColor = vec4(0.02, 0.035, 0.05, a);
}
`;function Y(e,t){let n=ae(t.seed??20260912),r=new e.Group,i=[],a=t.zNear-t.zFar,o=e=>t.halfFar+(t.halfNear-t.halfFar)*((e-t.zFar)/a),s=t.bed.centreZ-t.bed.halfDepth,c=t.bed.centreZ+t.bed.halfDepth,l=t.bed.halfWidth,u=t.light.uSun.value,d={x:-u.x/u.y,z:-u.z/u.y},f=Math.max(1.4,a)*(t.coarse?.1:.092);function p(e){let t=e.r*1.2,n=e.x+d.x*e.r*.8,r=e.z+d.z*e.r*.8,i=(e,t,n)=>e<-l-n||e>l+n||t<s-n||t>c+n;return i(e.x,e.z,t)&&i(n,r,e.r*.7)}function m(e,t,r){let i={x:e,z:t,r:f*(.72+n()*.66),warmth:n()<.35?.5+n()*.5:0,seed:n(),order:0};for(let e=0;e<12&&!p(i);e++)r===0?i.z-=i.r*.4:i.x+=r*i.r*.4;return p(i)?i:null}let ee=t.coarse?4+Math.floor(n()*2):6+Math.floor(n()*3),h=Math.max(2,Math.round(ee*.55)),g=ee-h,te=Math.ceil(g/2),_=[],ne=o(t.zFar)*1.1;for(let e=0;e<h;e++){let r=(e+.5)/h+(n()-.5)*(.7/h),i=m(-ne+r*2*ne,t.zFar-f*(.1+n()*.45),0);i&&_.push(i)}for(let e=0;e<g;e++){let r=e<te?-1:1,i=t.zFar+a*(.1+n()*.7),s=m(r*(o(i)+f*(.05+n()*.4)),i,r);s&&_.push(s)}let v=_.map(e=>e.x),y=Math.min(...v,0),b=Math.max(...v,0)-y||1;_.forEach(e=>{e.order=(e.x-y)/b});let x=[],S=t.coarse?60:130;_.forEach((e,t)=>{for(let r=0;r<S;r++){let r=n()*Math.PI*2,i=Math.acos(1-.92*n()),a=e.r*(.72+n()*.3),o=Math.sin(i)*Math.cos(r),s=Math.cos(i),c=Math.sin(i)*Math.sin(r),l=e.r*(.3+n()*.2),u=()=>(n()-.5)*1.5;x.push({c:[e.x+o*a,.02+s*a*.78,e.z+c*a],d:[o,s+.35,c],u:[o*.5+u(),.75+n()*.5,c*.5+u()],len:l,wid:l*(.42+n()*.22),seed:n(),shrubId:t,birth:n()*.6})}});let C=new e.PlaneGeometry(1,1),w=new e.InstancedBufferGeometry;w.index=C.index,w.setAttribute(`position`,C.getAttribute(`position`));let T=x.length,E=new Float32Array(T*3),D=new Float32Array(T*3),O=new Float32Array(T*3),k=new Float32Array(T*2),A=new Float32Array(T),j=new Float32Array(T),M=new Float32Array(T);x.forEach((e,t)=>{E.set(e.c,t*3),D.set(e.d,t*3),O.set(e.u,t*3),k.set([e.wid,e.len],t*2),A[t]=e.seed,j[t]=e.shrubId,M[t]=e.birth}),w.setAttribute(`aCentre`,new e.InstancedBufferAttribute(E,3)),w.setAttribute(`aDir`,new e.InstancedBufferAttribute(D,3)),w.setAttribute(`aUp`,new e.InstancedBufferAttribute(O,3)),w.setAttribute(`aSize`,new e.InstancedBufferAttribute(k,2)),w.setAttribute(`aSeed`,new e.InstancedBufferAttribute(A,1)),w.setAttribute(`aShrubId`,new e.InstancedBufferAttribute(j,1)),w.setAttribute(`aBirth`,new e.InstancedBufferAttribute(M,1)),w.instanceCount=T;let N=Array(W).fill(0),re=Array(W).fill(0);_.forEach((e,t)=>{re[t]=e.warmth});let P=new e.ShaderMaterial({vertexShader:G,fragmentShader:K,uniforms:{...t.light,uTime:{value:0},uWind:{value:t.reduced?0:f*.03},uGrow:{value:N},uWarmth:{value:re}},side:e.DoubleSide,alphaToCoverage:!0}),F=new e.Mesh(w,P);F.frustumCulled=!1,F.renderOrder=7,r.add(F),i.push(C,w,P);let I=new e.PlaneGeometry(1,1),L=new e.InstancedBufferGeometry;L.index=I.index,L.setAttribute(`position`,I.getAttribute(`position`));let R=new Float32Array(_.length*2),ie=new Float32Array(_.length*2),z=new Float32Array(_.length);_.forEach((e,t)=>{R.set([e.x+d.x*e.r*.7,e.z+d.z*e.r*.7],t*2),ie.set([e.r*2.1,e.r*1.5],t*2),z[t]=t}),L.setAttribute(`aCentre`,new e.InstancedBufferAttribute(R,2)),L.setAttribute(`aSize`,new e.InstancedBufferAttribute(ie,2)),L.setAttribute(`aShrubId`,new e.InstancedBufferAttribute(z,1)),L.instanceCount=_.length;let B=new e.ShaderMaterial({vertexShader:q,fragmentShader:J,uniforms:{uShadowDir:{value:new e.Vector2(d.x,d.z)},uGrow:{value:N}},transparent:!0,depthWrite:!1}),V=new e.Mesh(L,B);V.frustumCulled=!1,V.renderOrder=2,r.add(V),i.push(I,L,B);let[H,U]=t.window,Y=Math.max(.04,(U-H)*.55);return{group:r,update(e,t){_.forEach((e,n)=>{let r=H+(U-H-Y)*e.order;N[n]=Math.min(1,Math.max(0,(t-r)/Y))}),P.uniforms.uTime.value=e},dispose(){for(let e of i)e.dispose()},info:()=>({shrubs:_.length,leaves:T})}}function ae(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var oe=Math.PI/180,X=24,se=X*oe,ce=36,Z=8,le=.16,ue=.018,Q=_e([-.5,.74,-.45]),de=[1.45,1.12,.78],fe=[.36,.42,.55],pe=`"Hanken Grotesk", system-ui, sans-serif`;async function me(e,t){await Promise.race([document.fonts?.load(`900 64px "Hanken Grotesk"`,`Zbudujęąó`).catch(()=>void 0),new Promise(e=>setTimeout(e,2500))]);let n=t.coarse?10:14;return d(e,{reduced:t.reduced,coarse:t.coarse,tilt:X,vfov:ce,groundWidth:e=>Math.max(5.6,Math.min(14.5,7.8*e)),sun:Q,sunColor:de,sky:fe,clearColor:1182728,pixelRatioCap:1.5,build:e=>he(e,t,n),update:(e,t,n)=>ge(e,t,n),debugInfo:e=>({strips:e?.strips.length,flowers:e?.field.count,lines:e?.field.lines,em:e?.field.em,pitch:e?.field.pitch,shells:n,shrubs:e?.shrubs.info()})})}function he(e,t,n){let{THREE:r,light:i}=e,c=e.frame,l=[],u=new r.Group,d=ve(911),p=c.zNear-c.zFar,m=2*Math.max(c.halfFar,c.halfNear)+.8,h=Math.min(Z,Math.max(3,Math.round(m/2.4))),g=m/h,_=-m/2,v=Math.min(.7,g*.27),y=.035,b=c.zFar-1.2,x=c.zNear+v+.9,S=Array.from({length:h},(e,t)=>t/Math.max(1,h-1));for(let e=S.length-1;e>0;e--){let t=Math.floor(d()*(e+1));[S[e],S[t]]=[S[t],S[e]]}let C=Array.from({length:h},(e,t)=>{let n=c.zFar+p*.3+(d()-.5)*.45,r=x-n;return{x:_+(t+.5)*g,len:g*.985,zInit:n,total:r,tau:Math.PI*(v*v-y*y)/r,startAt:U.rollStart+U.rollStagger*S[t],shade:(t%2?.92:1)*(.97+d()*.06)}});{let e=new r.PlaneGeometry(m+6,p+8).rotateX(-Math.PI/2);e.translate(0,0,(c.zFar+c.zNear)/2);let n=new r.ShaderMaterial({vertexShader:te,fragmentShader:o({coarse:t.coarse}),uniforms:{...i,...f(r,a,ee)}}),s=new r.Mesh(e,n);s.renderOrder=1,u.add(s),l.push(e,n)}let w=new r.ShaderMaterial({vertexShader:N,fragmentShader:re,uniforms:{...i,uBase:{value:ue},uHeight:{value:le},uX0:{value:_},uW:{value:g},uN:{value:h},uZc:{value:Array(Z).fill(b)},uShade:{value:Array.from({length:Z},(e,t)=>C[t]?.shade??1)},uDensity:{value:t.coarse?26:30},uTime:{value:0},uKnit:{value:0}},alphaToCoverage:!0});{let e=new r.PlaneGeometry(m,x-b,40,60).rotateX(-Math.PI/2);e.translate(0,0,(b+x)/2);let t=new r.InstancedBufferGeometry;t.index=e.index,t.setAttribute(`position`,e.getAttribute(`position`));let i=new Float32Array(n);for(let e=0;e<n;e++)i[e]=e/(n-1);t.setAttribute(`aLayer`,new r.InstancedBufferAttribute(i,1)),t.instanceCount=n;let a=new r.Mesh(t,w);a.frustumCulled=!1,a.renderOrder=0,u.add(a),l.push(e,t,w)}let T=new r.CylinderGeometry(1,1,1,72,1,!0).rotateZ(Math.PI/2),E=new r.CircleGeometry(1,72).rotateY(Math.PI/2).translate(.5,0,0),D=new r.CircleGeometry(1,72).rotateY(-Math.PI/2).translate(-.5,0,0),O=new r.PlaneGeometry(1,1).rotateX(-Math.PI/2);l.push(T,E,D,O);let k=C.map(e=>{let t=new r.Group,n=new r.ShaderMaterial({vertexShader:P,fragmentShader:F,uniforms:{...i,uR0:{value:v},uR:{value:v},uLen:{value:e.len}}}),a=[1,-1].map(t=>new r.ShaderMaterial({vertexShader:P,fragmentShader:I,uniforms:{...i,uR:{value:v},uTau:{value:e.tau},uCore:{value:y},uCapLight:{value:Math.max(.12,Q[0]*t)*1.1}}})),o=new r.Mesh(T,n),c=new r.Mesh(E,a[0]),d=new r.Mesh(D,a[1]);for(let e of[o,c,d])e.renderOrder=3;t.add(o,c,d),u.add(t);let f=new r.ShaderMaterial({vertexShader:s,fragmentShader:ne,uniforms:{uOpacity:{value:.6}},transparent:!0,depthWrite:!1}),p=new r.Mesh(O,f);return p.renderOrder=2,u.add(p),l.push(n,...a,f),{group:t,body:n,caps:a,shadow:p,shadowMat:f}}),j=p*.6,M=c.zFar+p*.46,L=A({width:2*c.halfAt(M+j/2)*.86,depth:j,centreZ:M,stretch:1/Math.cos(se),maxCount:t.coarse?4800:7500,fontFamily:pe,timeline:{start:U.flowerStart,sweep:U.flowerSweep,edgeLead:U.edgeLead}}),W=new r.PlaneGeometry(1,1),G=new r.InstancedBufferGeometry;G.index=W.index,G.setAttribute(`position`,W.getAttribute(`position`)),G.setAttribute(`uv`,W.getAttribute(`uv`)),G.setAttribute(`aPos`,new r.InstancedBufferAttribute(L.pos,3)),G.setAttribute(`aSize`,new r.InstancedBufferAttribute(L.size,1)),G.setAttribute(`aPetal`,new r.InstancedBufferAttribute(L.petal,3)),G.setAttribute(`aCentre`,new r.InstancedBufferAttribute(L.centre,3)),G.setAttribute(`aShape`,new r.InstancedBufferAttribute(L.shape,3)),G.setAttribute(`aBirth`,new r.InstancedBufferAttribute(L.birth,1)),G.setAttribute(`aSeed`,new r.InstancedBufferAttribute(L.seed,1)),G.instanceCount=L.count,l.push(W,G);let K={uP:{value:0},uGrow:{value:U.flowerGrow},uTime:{value:0},uWind:{value:t.reduced?0:.09},uGrassTop:{value:.178}},q=new r.ShaderMaterial({vertexShader:V,fragmentShader:H,uniforms:{...K,uShadowDir:{value:new r.Vector2(-Q[0]/Q[1],-Q[2]/Q[1])}},transparent:!0,depthWrite:!1}),J=new r.Vector3().setFromMatrixColumn(e.camera.matrixWorld,0);J.y=0,J.normalize();let ae=new r.ShaderMaterial({vertexShader:z,fragmentShader:B,uniforms:{...K,...i,uCamRight:{value:J},uStemW:{value:.011}},side:r.DoubleSide}),oe=new r.ShaderMaterial({vertexShader:R,fragmentShader:ie,uniforms:{...K,...i},side:r.DoubleSide,alphaToCoverage:!0});[q,ae,oe].forEach((e,t)=>{let n=new r.Mesh(G,e);n.frustumCulled=!1,n.renderOrder=4+t,u.add(n),l.push(e)});let X=Y(r,{halfFar:c.halfFar,halfNear:c.halfNear,zFar:c.zFar,zNear:c.zNear,bed:{centreZ:M,halfDepth:j/2,halfWidth:c.halfAt(M+j/2)*.86},light:i,coarse:t.coarse,reduced:t.reduced,window:[U.plantStart,U.plantEnd]});return u.add(X.group),l.push(X),{group:u,shrubs:X,strips:C,r0:v,core:y,rolls:k,grass:w,flowerMats:[q,ae,oe],field:L,dispose(){for(let e of l)e.dispose()}}}function ge(e,t,n){let r=e.grass.uniforms.uZc.value;e.strips.forEach((n,i)=>{let a=u((t-n.startAt)/U.rollSpan),o=n.zInit+n.total*a,s=o-n.zInit,c=Math.sqrt(Math.max(e.core*e.core,e.r0*e.r0-n.tau*s/Math.PI)),l=2*Math.PI/n.tau*(e.r0-c);r[i]=o;let d=e.rolls[i],f=a<.999;if(d.group.visible=f,d.shadow.visible=f,f){d.group.position.set(n.x,c+ue*.5,o),d.group.scale.set(n.len,c,c),d.group.rotation.set(l,0,0),d.body.uniforms.uR.value=c;for(let e of d.caps)e.uniforms.uR.value=c;d.shadow.position.set(n.x+c*.25,.188,o+c*.55),d.shadow.scale.set(n.len*1.06,1,c*2.9),d.shadowMat.uniforms.uOpacity.value=.62*Math.sqrt(c/e.r0)}}),e.grass.uniforms.uKnit.value=l(U.knit[0],U.knit[1],t),e.grass.uniforms.uTime.value=n.clock.time,e.shrubs.update(n.clock.time,t);for(let r of e.flowerMats)r.uniforms.uP.value=t,r.uniforms.uTime.value=n.clock.time}function _e(e){let t=Math.hypot(e[0],e[1],e[2]);return[e[0]/t,e[1]/t,e[2]/t]}function ve(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var $=n(),ye={introHold:U.introHold,introOut:U.introOut,outro:U.outro};function be(){return(0,$.jsx)(p,{id:`ogrod`,className:`garden`,debugHandleName:`__garden`,height:`480svh`,createScene:me,h1:{id:`garden-title`,text:`Zbuduję nową stronę dla Twojej pracowni architektury krajobrazu`},brand:{href:`https://marcinbochenek.com/`,content:(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(i,{size:26}),(0,$.jsx)(`span`,{children:`Marcin Bochenek`})]})},contact:{href:`#kontakt`,label:`Kontakt`},intro:{eyebrow:`Dla pracowni architektury krajobrazu`,title:`Najpierw przygotujmy teren.`,hint:`Przewiń — rozłożę trawnik`},outro:{line:(0,$.jsx)($.Fragment,{children:`Strona dla Twojej pracowni: realizacje, oferta i\xA0zapytania od klientów w\xA0jednym miejscu.`}),ctaLabel:`Porozmawiajmy`,ctaHref:`#kontakt`,mailHref:`mailto:${r.email}`,mailLabel:r.email},timeline:ye})}function xe(){return(0,$.jsx)(`footer`,{style:{background:`var(--moss-950)`},className:`px-5 py-8 md:px-10`,children:(0,$.jsxs)(`div`,{className:`mx-auto max-w-6xl`,children:[(0,$.jsx)(`div`,{className:`hairline`}),(0,$.jsxs)(`div`,{className:`flex flex-col gap-3 pt-6 font-mono text-[11px] tracking-[0.05em] text-[var(--cream-dim)] md:flex-row md:items-center md:justify-between md:text-xs`,children:[(0,$.jsx)(`p`,{children:`© 2026 Marcin Bochenek`}),(0,$.jsxs)(`div`,{className:`flex items-center gap-5`,children:[(0,$.jsx)(`a`,{href:`mailto:${r.email}`,className:`transition-colors hover:text-[var(--cream)]`,children:r.email}),(0,$.jsx)(`a`,{href:`/branze`,className:`transition-colors hover:text-[var(--cream)]`,children:`Strony dla branż`}),(0,$.jsx)(`a`,{href:`https://marcinbochenek.com/`,className:`transition-colors hover:text-[var(--cream)]`,children:`marcinbochenek.com`})]})]})]})})}function Se(){return(0,$.jsx)(`svg`,{"aria-hidden":!0,width:`14`,height:`14`,viewBox:`0 0 14 14`,fill:`none`,className:`mt-1 shrink-0`,children:(0,$.jsx)(`path`,{d:`M2 12C2 6 6 2 12 2C12 8 8 12 2 12Z`,fill:`var(--leaf)`})})}var Ce={offer:{eyebrow:`Oferta`,heading:`Co dostajesz`,blocks:[{title:`Portfolio, które broni ceny`,body:`Duże zdjęcia realizacji, galerie przed i po, opis zakresu i doboru roślin. Klient widzi Waszą robotę, zanim zadzwoni — i przychodzi na rozmowę z innym nastawieniem.`},{title:`Oferta rozpisana po ludzku`,body:`Projekt, realizacja, pielęgnacja: co wchodzi w zakres, jak wygląda współpraca i czego nie robicie. Połowa zapytań odpada właśnie na tym, że tego nigdzie nie było.`},{title:`Formularz, który odsiewa`,body:`Metraż, lokalizacja, termin i budżet zebrane w jednym kroku. Dostajesz zapytanie, z którym da się od razu pracować, zamiast „ile kosztuje ogród?".`},{title:`Widoczność tam, gdzie pracujecie`,body:`Strona szybka na telefonie i opisana tak, żeby Google i modele AI wiedziały, w jakiej okolicy działacie i co dokładnie robicie.`}]},process:{eyebrow:`Proces`,heading:`Jak to działa`,steps:[{number:`01`,title:`Rozmowa, 20 minut`,body:`Pokazujesz realizacje i mówisz, komu chcesz sprzedawać. Wychodzę z tego z zakresem i widełkami — bez prezentacji i bez zobowiązania.`},{number:`02`,title:`Projekt i wdrożenie`,body:`Typowa strona pracowni to 2–4 tygodnie od kompletu materiałów. Postęp oglądasz na żywym podglądzie, nie w raporcie.`},{number:`03`,title:`Start i opieka`,body:`Przenoszę domenę, wpinam analitykę, zostaję na zmiany. Strona jest Wasza — kod i treści zostają u Was.`}]},price:{eyebrow:`Inwestycja`,heading:`Ile to kosztuje`,lead:`Wycenę podaję po rozmowie, bez ukrytych pozycji. Punkt wyjścia zależy od tego, ile strona ma robić.`,tiers:[{name:`Wizytówka z formularzem`,price:`od 2 000 PLN`,desc:`jedna strona, realizacje, kontakt.`},{name:`Strona z portfolio i lejkiem zapytań`,price:`od 8 000 PLN`,desc:`wiele podstron, panel do dodawania realizacji, integracje.`}]},faq:{eyebrow:`FAQ`,heading:`Pytania, które słyszę najczęściej`,items:[{q:`Czy przenosicie treści i zdjęcia ze starej strony?`,a:`Tak. Przenoszę to, co działa, resztę przepisujemy — zwykle okazuje się, że najlepsze zdjęcia leżały poza stroną.`},{q:`Ile trwa wdrożenie?`,a:`Typowa strona pracowni: 2–4 tygodnie od momentu, w którym mam komplet zdjęć i opisów. Sam projekt graficzny widzisz w pierwszym tygodniu.`},{q:`Czy będę mógł sam dodawać realizacje?`,a:`Tak. Dodawanie projektów, zdjęć i opisów odbywa się w panelu, bez znajomości kodu i bez dzwonienia do mnie.`},{q:`Mam zdjęcia tylko z telefonu. To wystarczy?`,a:`Da się z tym pracować i często tak zaczynamy. Ale jedna porządna sesja z gotowego ogrodu zwraca się na stronie szybciej niż cokolwiek innego.`},{q:`Pracujesz tylko w Polsce?`,a:`Nie. Pracuję zdalnie, po polsku i po angielsku — lokalizacja pracowni nie ma znaczenia dla współpracy.`}]}},we=[{id:`name`,label:`Imię`,type:`text`,required:!0},{id:`email`,label:`E-mail`,type:`email`,required:!0},{id:`company`,label:`Pracownia / firma`,type:`text`},{id:`website`,label:`Obecna strona (jeśli jest)`,type:`text`,placeholder:`np. twojapracownia.pl`},{id:`message`,label:`Czego potrzebujesz?`,type:`textarea`,placeholder:`Kilka zdań: czym się zajmujecie i co ma robić nowa strona.`}],Te={eyebrow:`Kontakt`,heading:`Porozmawiajmy o\xA0stronie Twojej pracowni.`,lead:`Zaprojektuję i\xA0wdrożę stronę, która pokazuje Wasze realizacje tak dobrze, jak wyglądają w\xA0naturze — i\xA0zamienia oglądających w\xA0zapytania. Jedna osoba od projektu po wdrożenie i\xA0opiekę.`,listHeading:`Co może się na niej znaleźć`,bullets:[`Portfolio realizacji — duże zdjęcia, galerie przed i\xA0po, opis każdego projektu`,`Usługi opisane po ludzku: projekt, realizacja, pielęgnacja`,`Formularz zapytania, który od razu zbiera metraż, lokalizację i\xA0budżet`,`Szybka na telefonie i\xA0widoczna w\xA0Google w\xA0Twojej okolicy`],priceLine:`Strony od 2\xA0000 PLN. Wycenę podam po krótkiej rozmowie.`,rows:[{label:`E-mail`,value:r.email,href:`mailto:${r.email}`},...r.calendly?[{label:`Kalendarz`,value:`Umów 20 minut rozmowy`,href:r.calendly,external:!0}]:[],{label:`Portfolio`,value:`marcinbochenek.com`,href:`https://marcinbochenek.com/`}],responseTime:r.responseTime,source:`krajobraz`,formHeading:`Opowiedz o swojej pracowni`,fields:we,buildSubject:e=>`Strona dla pracowni krajobrazu — ${e.company||e.name||`zapytanie`}`,glow:`radial-gradient(70% 42% at 18% 44%, rgba(40, 66, 30, 0.3), transparent 100%), var(--moss-950)`};function Ee(){return(0,$.jsxs)($.Fragment,{children:[(0,$.jsxs)(`main`,{children:[(0,$.jsx)(be,{}),(0,$.jsx)(m,{content:Ce,marker:(0,$.jsx)(Se,{})}),(0,$.jsx)(_,{content:Te,marker:(0,$.jsx)(Se,{})})]}),(0,$.jsx)(xe,{})]})}(0,y.createRoot)(document.getElementById(`root`)).render((0,$.jsx)(v.StrictMode,{children:(0,$.jsx)(Ee,{})}));