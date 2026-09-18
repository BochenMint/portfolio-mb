const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/three-Cp78jkzt.js","assets/rolldown-runtime-QTnfLwEv.js"])))=>i.map(i=>d[i]);
import{r as e,t}from"./jsx-runtime-i9uBjpvk.js";import{c as n}from"./content-CeKOOgdU.js";import{t as r}from"./preload-helper-zJ_50EbN.js";var i=e(),a=e=>Math.min(1,Math.max(0,e));function o(e,t,n){let r=a((n-e)/(t-e));return r*r*(3-2*r)}function s(e){let t=a(e);return .5-.5*Math.cos(Math.PI*t)}function c(e,[t,n]){return a((e-t)/(n-t))}var l=t(),u=typeof window<`u`&&window.location.search.includes(`debug=1`),d=e=>Math.min(1,Math.max(0,e));function f({id:e,className:t,debugHandleName:n,height:r,createScene:a,h1:o,brand:s,contact:f,intro:p,outro:m,timeline:h}){let g=(0,i.useRef)(null),_=(0,i.useRef)(null),v=(0,i.useRef)(null),y=(0,i.useRef)(null),[b]=(0,i.useState)(()=>typeof window<`u`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches),[x,S]=(0,i.useState)(`loading`),C=b||x===`fallback`;return(0,i.useEffect)(()=>{let e=g.current,t=_.current,r=v.current,i=y.current;if(!e||!t||!r||!i)return;let o=!1,s=null,l=``,f=!0,p=()=>{if(b)return 1;let t=e.getBoundingClientRect(),n=t.height-window.innerHeight;return n>0?d(-t.top/n):1},m=()=>{let e=p(),n=1-c(e,[h.introHold,h.introOut]),r=c(e,h.outro);t.style.setProperty(`--p`,e.toFixed(4)),t.style.setProperty(`--intro`,n.toFixed(3)),t.style.setProperty(`--outro`,r.toFixed(3));let a=r>.6?`outro`:n>.4?`intro`:`mid`;a!==l&&(l=a,t.dataset.phase=a,i.inert=a!==`outro`),s?.setProgress(e)};m(),window.addEventListener(`scroll`,m,{passive:!0}),window.addEventListener(`resize`,m);let x=new IntersectionObserver(([e])=>{f=e.isIntersecting,s?.setVisible(f)},{rootMargin:`10% 0px`});x.observe(e);let C=new ResizeObserver(()=>{m(),s?.resize()});C.observe(t),C.observe(e);let w=e=>{e.preventDefault(),s?.dispose(),s=null,S(`fallback`)};return r.addEventListener(`webglcontextlost`,w),(async()=>{try{let e=window.matchMedia(`(pointer: coarse)`).matches,t=await a(r,{reduced:b,coarse:e});if(o){t.dispose();return}s=t,t.setProgress(p()),t.setVisible(f),S(`live`),u&&(window[n]=t.debug)}catch{o||S(`fallback`)}})(),()=>{o=!0,window.removeEventListener(`scroll`,m),window.removeEventListener(`resize`,m),r.removeEventListener(`webglcontextlost`,w),x.disconnect(),C.disconnect(),s?.dispose()}},[b,a,n,h]),(0,l.jsx)(`section`,{ref:g,id:e,"aria-labelledby":o.id,className:`stage ${t} ${C?`stage--still`:``}`,style:{"--stage-height":r},children:(0,l.jsxs)(`div`,{ref:_,className:`stage-frame`,"data-status":x,"data-phase":`intro`,children:[(0,l.jsx)(`canvas`,{ref:v,className:`stage-canvas`,"aria-hidden":!0}),(0,l.jsx)(`div`,{className:`stage-vignette`,"aria-hidden":!0}),(0,l.jsxs)(`header`,{className:`stage-bar`,children:[(0,l.jsx)(`a`,{href:s.href,className:`stage-brand`,children:s.content}),(0,l.jsx)(`a`,{href:f.href,className:`stage-bar-link`,children:f.label})]}),(0,l.jsx)(`h1`,{id:o.id,className:x===`fallback`?`stage-fallback-title`:`sr-only`,children:o.text}),(0,l.jsxs)(`div`,{className:`stage-intro`,children:[(0,l.jsx)(`p`,{className:`stage-eyebrow`,children:p.eyebrow}),(0,l.jsx)(`p`,{className:`stage-intro-title`,children:p.title}),(0,l.jsxs)(`p`,{className:`stage-intro-hint`,children:[(0,l.jsx)(`span`,{className:`stage-cue`,"aria-hidden":!0}),p.hint]})]}),(0,l.jsxs)(`div`,{ref:y,className:`stage-outro`,children:[(0,l.jsx)(`p`,{className:`stage-outro-line`,children:m.line}),(0,l.jsxs)(`div`,{className:`stage-outro-actions`,children:[(0,l.jsx)(`a`,{href:m.ctaHref,className:`cta-red stage-outro-cta`,children:m.ctaLabel}),(0,l.jsx)(`a`,{href:m.mailHref,className:`stage-outro-mail`,children:m.mailLabel})]})]})]})})}var p=`
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
`,m=`
uniform vec3 uSun;
uniform vec3 uSunCol;
uniform vec3 uSky;
`,h=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`,g=`
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec2 d = (vUv - 0.5) * 2.0;
  float r = length(d);
  float a = (1.0 - smoothstep(0.15, 1.0, r)) * uOpacity;
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}
`,_={wet:[.016,.0115,.008],loam:[.046,.031,.021],dry:[.088,.066,.047],stoneLo:[.085,.08,.07],stoneHi:[.22,.21,.19],straw:[.19,.155,.09]},v={dir:[.96,.28],freq:21},y=`
vec3 chips(vec2 p) {
  vec2 n = floor(p);
  vec2 f = fract(p);
  float f1 = 8.0;
  float f2 = 8.0;
  vec2 best = vec2(0.0);
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
        best = r;
        id = hash12(n + g);
      } else if (d < f2) {
        f2 = d;
      }
    }
  }
  f1 = sqrt(f1);
  f2 = sqrt(f2);
  // A flat face, tilted a different way on every chip.
  vec2 grad = (hash22(vec2(id * 53.0, 11.0)) - 0.5) * 2.0;
  float face = 0.5 + dot(-best, grad) * 0.6;
  // The seam: sharp, because two crushed faces meet at an edge, not a
  // fillet. This is what the eye reads as "angular".
  float edge = smoothstep(0.0, 0.055, f2 - f1);
  return vec3(face * edge, edge, id);
}
`,b=`
varying vec3 vWorld;
varying float vDist;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vDist = length(w.xyz - cameraPosition);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,x=`
${p}
${y}
${m}
uniform vec3 uWet;
uniform vec3 uLoam;
uniform vec3 uDry;
uniform vec3 uStoneLo;
uniform vec3 uStoneHi;
uniform vec3 uStraw;
// 0 = clods and crumbs (a dug bed), 1 = crushed chips (a sub-base).
uniform float uAngular;
// How much of what is lying about is organic: straw belongs on a garden
// bed and has no business on a compacted sub-base.
uniform float uOrganic;
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
  float dome = (1.0 - smoothstep(0.0, 0.44, v1.x)) * clodMask;
  // The same lump, crushed: a flat tilted face with a hard seam round it.
  // Compiled in only where it is used. chips() is two nested 3×3 cell
  // searches, and the garden — a full-screen shader at p = 0, the heaviest
  // frame on that page — would otherwise pay for both on every fragment
  // only to multiply the result by zero. Without ANGULAR the blend weight
  // is a constant 0, so a uniform set by mistake cannot half-enable it.
#ifdef ANGULAR
  float angularK = uAngular;
  vec3 chip = chips(warp * 4.6);
#else
  const float angularK = 0.0;
  vec3 chip = vec3(0.0);
#endif
  float clod = mix(dome, chip.x, angularK);
  vec3 v2 = voronoi(warp * 13.0 + 3.1);
  // Not every cell, and not one size: an even field of round domes reads as
  // sand sprinkled on chocolate, which is exactly what it looked like.
  float crumbR = 0.18 + 0.3 * fract(v2.z * 5.0);
#ifdef ANGULAR
  vec3 chipFine = chips(warp * 13.0 + 3.1);
#else
  vec3 chipFine = vec3(0.0);
#endif
  float crumb =
    mix((1.0 - smoothstep(0.0, crumbR, v2.x)) * step(0.35, fract(v2.z * 11.0)), chipFine.x, angularK) *
    mix(0.45, 1.0, fine);
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
    fine * uOrganic;

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
  float relief = mix(0.045, 0.19, near) * mix(1.0, 1.45, angularK);
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
  // Crushed stone comes out of the pit in a dozen shades at once, far more
  // spread than one bed of loam ever shows.
  c *= mix(1.0, mix(0.72, 1.3, fract(chip.z * 19.0)), angularK);
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
`;function S(e){return(e.coarse?`#define COARSE 1
`:``)+(e.angular?`#define ANGULAR 1
`:``)+x}function C(e,t,n,r){return{uWet:{value:new e.Vector3(...t.wet)},uLoam:{value:new e.Vector3(...t.loam)},uDry:{value:new e.Vector3(...t.dry)},uStoneLo:{value:new e.Vector3(...t.stoneLo)},uStoneHi:{value:new e.Vector3(...t.stoneHi)},uStraw:{value:new e.Vector3(...t.straw)},uRakeDir:{value:new e.Vector2(...n.dir)},uRakeFreq:{value:n.freq},uAngular:{value:r?.angular??0},uOrganic:{value:r?.organic??1}}}var w=Math.PI/180,T=M([-.5,.74,-.45]),E=[1.45,1.12,.78],D=[.36,.42,.55],O=1182728,k=1.5,A=.04;async function j(e,t){let n=await r(()=>import(`./three-Cp78jkzt.js`).then(e=>e.d),__vite__mapDeps([0,1])),i=new n.WebGLRenderer({canvas:e,antialias:!0,alpha:!1,powerPreference:`high-performance`});i.setPixelRatio(Math.min(window.devicePixelRatio||1,t.pixelRatioCap??k)),i.setClearColor(t.clearColor??O,1);let a=new n.Scene,o=new n.PerspectiveCamera(t.vfov,1,.1,120),s={uSun:{value:new n.Vector3(...t.sun??T)},uSunCol:{value:new n.Vector3(...t.sunColor??E)},uSky:{value:new n.Vector3(...t.sky??D)}},c={time:0},l=t.tilt*w,u=t.rebuildThreshold??A,d,f={THREE:n,scene:a,camera:o,get frame(){return d},light:s,clock:c,reduced:t.reduced,coarse:t.coarse};function p(e){let r=t.groundWidth(e)/(2*Math.tan(t.vfov*w/2)*e);o.aspect=e,o.position.set(0,r*Math.cos(l),r*Math.sin(l)),o.up.set(0,1,0),o.lookAt(0,0,0),o.updateProjectionMatrix(),o.updateMatrixWorld(!0);let i=(e,t)=>{let r=new n.Vector3(e,t,.5).unproject(o).sub(o.position).normalize(),i=-o.position.y/r.y;return o.position.clone().addScaledVector(r,i)},a=i(-1,1),s=i(-1,-1);return{zFar:a.z,zNear:s.z,halfFar:Math.abs(a.x),halfNear:Math.abs(s.x),halfAt(e){let t=(e-a.z)/(s.z-a.z);return Math.abs(a.x)+(Math.abs(s.x)-Math.abs(a.x))*t}}}let m=null,h=0,g=0;function _(e){a.remove(e.group),e.dispose()}function v(e){m&&t.update(m,e,f)}function y(){let n=e.parentElement??e,r=Math.max(1,n.clientWidth),o=Math.max(1,n.clientHeight);i.setSize(r,o,!1);let s=r/o;d=p(s),(!m||Math.abs(s/h-1)>u||Math.abs(r/g-1)>u)&&(m&&_(m),m=t.build(f),a.add(m.group),h=s,g=r),v(x),C=!0}let b=+!!t.reduced,x=b,S=!0,C=!0,j=0,M=performance.now(),N=0,P=!1,F=()=>{i.render(a,o),C=!1},I=e=>{j=requestAnimationFrame(I);let t=Math.min(.05,(e-M)/1e3);M=e;let n=b-x;x=Math.abs(n)<1e-4?b:x+n*(1-Math.exp(-t*7)),N=Math.abs(n)<1e-4?N+t:0,!(N>1.5&&(P=!P,P))&&(c.time+=t,v(x),F())},L=()=>{j||t.reduced||(M=performance.now(),j=requestAnimationFrame(I))},R=()=>{cancelAnimationFrame(j),j=0},z=()=>{document.hidden?R():S&&L()};return document.addEventListener(`visibilitychange`,z),y(),v(x),F(),L(),{setProgress(e){b=t.reduced?1:Math.min(1,Math.max(0,e)),t.reduced&&C&&F()},resize(){y(),j||F()},setVisible(e){S=e,e&&!document.hidden?L():R()},dispose(){R(),document.removeEventListener(`visibilitychange`,z),m&&_(m),m=null,i.dispose()},debug:{jump(e,t){b=x=e,t!==void 0&&(c.time=t),v(e),F()},info(){return{pixelRatio:i.getPixelRatio(),progress:x,...t.debugInfo?.(m)??{}}}}}}function M(e){let t=Math.hypot(e[0],e[1],e[2]);return[e[0]/t,e[1]/t,e[2]/t]}var N=900,P=.96,F=.02,I=.05,L=7;function R(e){let t=e.weight??N,n=e.lineHeight??P,r=e.tracking??F,i=e.pitchPerEm??I,a=e.maskPxPerPitch??L,{rand:o}=e,s=n=>`${t} ${n}px ${e.fontFamily}`,c=document.createElement(`canvas`).getContext(`2d`);c.font=s(100);let l=e=>Math.max(0,e.length-1)*r*100,u={lines:e.layouts[0],em:0};for(let t of e.layouts){let r=Math.max(...t.map(e=>c.measureText(e).width+l(e)))/100,i=t.length*n*e.stretch,a=Math.min(e.width/r,e.depth/i);a>u.em*1.18&&(u={lines:t,em:a})}let{lines:d,em:f}=u,p=f*i,m=t=>e.width*e.depth*.34/(t*t*.866);for(;m(p)>e.maxCount*1.15;)p*=1.06;let h=a/p,g=f*h,_=e.width*h,v=g*n,y=d.length*v,b=document.createElement(`canvas`);b.width=Math.ceil(_+g),b.height=Math.ceil(y+g);let x=b.getContext(`2d`,{willReadFrequently:!0});x.fillStyle=`#000`,x.fillRect(0,0,b.width,b.height),x.fillStyle=`#fff`,x.font=s(g),x.textBaseline=`alphabetic`,x.textAlign=`left`;let S=[];d.forEach((e,t)=>{let n=[...e],i=n.map(e=>x.measureText(e).width),a=i.reduce((e,t)=>e+t,0)+(n.length-1)*r*g,o=(b.width-a)/2,s=(b.height-y)/2+t*v+g*.8;S.push({left:o,right:o+a,top:s-g*.78,bottom:s+g*.22}),n.forEach((e,t)=>{x.fillText(e,o,s),o+=i[t]+r*g})});let C=x.getImageData(0,0,b.width,b.height).data,w=(e,t)=>{let n=Math.round(e),r=Math.round(t);return n<0||r<0||n>=b.width||r>=b.height?0:C[(r*b.width+n)*4]/255},T=e=>(e-b.width/2)/h,E=t=>(t-b.height/2)/h*e.stretch+e.centreZ,D=[],O=p*h,k=O*.866,A=Array.from({length:8},(e,t)=>{let n=t/8*Math.PI*2;return[Math.cos(n)*O*1.02,Math.sin(n)*O*1.02]}),j=Math.min(...S.map(e=>e.left)),M=Math.max(...S.map(e=>e.right));for(let e=0,t=k/2;t<b.height;e++,t+=k){let n=e%2?O/2:0;for(let e=n;e<b.width;e+=O){let n=e+(o()-.5)*O*.36,r=t+(o()-.5)*O*.36;if(w(n,r)<.5)continue;let i=!1;for(let[e,t]of A)if(w(n+e,r+t)<.5){i=!0;break}let a=0;for(let e=0;e<S.length;e++)r>=S[e].top-k&&r<=S[e].bottom+k&&(a=e);D.push({x:T(n),z:E(r),edge:i,line:a,nx:(n-j)/Math.max(1,M-j)})}}let R=Math.round(e.maxCount*1.2),z=D;if(D.length>R){let e=D.map((e,t)=>t);for(let t=0;t<R;t++){let n=t+Math.floor(o()*(e.length-t));[e[t],e[n]]=[e[n],e[t]]}z=e.slice(0,R).sort((e,t)=>e-t).map(e=>D[e])}let B={points:z,lines:d,em:f,pitch:p};return e.returnMask&&(B.mask=b,B.maskRect={x0:T(0),z0:E(0),x1:T(b.width),z1:E(b.height)},B.inkRect={x0:T(j),z0:E(S[0].top),x1:T(M),z1:E(S[S.length-1].bottom)}),B}var z=15e3,B=`https://api.web3forms.com/submit`,V=``;function H(e){return e.includes(`web3forms.com`)}function U(e,t){return!e||H(e)&&!t}function W({source:e,fields:t,heading:r,submitLabel:a=`Wyślij zapytanie`,buildSubject:o}){let[s,c]=(0,i.useState)(`idle`),[u,d]=(0,i.useState)(``),[f,p]=(0,i.useState)(``);return s===`success`?(0,l.jsxs)(`div`,{"aria-live":`polite`,style:{background:`var(--moss-900)`,borderColor:`rgba(244, 237, 220, 0.14)`},className:`rounded-2xl border p-8 text-center md:p-10`,children:[(0,l.jsx)(`p`,{className:`font-display text-xl font-semibold text-[var(--cream)]`,children:`Dziękuję!`}),(0,l.jsx)(`p`,{className:`mt-2 text-sm text-[var(--cream-dim)]`,children:`Odezwę się — ${n.responseTime.toLowerCase()}.`}),n.calendly&&(0,l.jsx)(`a`,{href:n.calendly,target:`_blank`,rel:`noopener noreferrer`,className:`cta-red mt-6 inline-flex px-6 py-3 text-sm`,children:`Albo od razu umów rozmowę`})]}):(0,l.jsx)(`div`,{style:{background:`var(--moss-900)`,borderColor:`rgba(244, 237, 220, 0.14)`},className:`rounded-2xl border p-6 md:p-8`,children:(0,l.jsxs)(`form`,{onSubmit:async r=>{r.preventDefault();let i=r.currentTarget;d(``);let a=Object.fromEntries(new FormData(i).entries()),s=o(a);if(U(B,V)){let e=t.map(e=>`${e.label}: ${a[e.id]||`-`}`),r=`mailto:${n.email}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(e.join(`
`))}`;p(r),c(`mailto`),window.location.href=r;return}c(`loading`);let l={subject:s,from_name:a.name||`Zapytanie z /${e}`,...a};H(B)&&(l.access_key=V);let u=new AbortController,f=window.setTimeout(()=>u.abort(),z);try{let e=await fetch(B,{method:`POST`,headers:{"Content-Type":`application/json`,Accept:`application/json`},body:JSON.stringify(l),signal:u.signal});if(!e.ok){let t=await e.json().catch(()=>({}));throw Error(t.message||`HTTP ${e.status}`)}i.reset(),c(`success`)}catch(e){c(`error`),d(e instanceof DOMException&&e.name===`AbortError`?`Formularz nie odpowiada. Napisz proszę bezpośrednio na ${n.email}.`:`Nie udało się wysłać. Napisz proszę bezpośrednio na ${n.email}.`)}finally{window.clearTimeout(f)}},className:`space-y-5`,children:[(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`p`,{className:`font-display text-lg font-semibold text-[var(--cream)]`,children:r}),(0,l.jsx)(`p`,{className:`mt-1 text-sm text-[var(--cream-dim)]`,children:`${n.responseTime}.`})]}),(0,l.jsx)(`input`,{type:`hidden`,name:`source`,value:e}),(0,l.jsx)(`div`,{className:`grid gap-4 md:grid-cols-2`,children:t.map(e=>(0,l.jsxs)(`label`,{className:e.type===`textarea`?`md:col-span-2`:``,children:[(0,l.jsx)(`span`,{className:`eyebrow mb-2 block`,children:e.label}),e.type===`textarea`?(0,l.jsx)(`textarea`,{name:e.id,required:e.required,rows:4,disabled:s===`loading`,placeholder:e.placeholder,className:`field resize-none`}):(0,l.jsx)(`input`,{type:e.type,name:e.id,required:e.required,disabled:s===`loading`,placeholder:e.placeholder,className:`field`})]},e.id))}),(0,l.jsxs)(`div`,{"aria-live":`polite`,children:[s===`mailto`&&(0,l.jsxs)(`p`,{style:{borderColor:`rgba(143, 191, 74, 0.35)`,background:`rgba(143, 191, 74, 0.08)`},className:`rounded-2xl border px-4 py-3 text-sm leading-relaxed text-[var(--cream)]`,children:[`Otworzyłem Twój program pocztowy z\xA0gotową wiadomością — wystarczy ją wysłać. Jeśli się nie otworzył,`,` `,(0,l.jsx)(`a`,{href:f,className:`underline underline-offset-4`,children:`spróbuj ponownie`}),` `,`albo napisz na`,` `,(0,l.jsx)(`a`,{href:`mailto:${n.email}`,className:`underline underline-offset-4`,children:n.email}),`.`]}),s===`error`&&(0,l.jsx)(`p`,{style:{borderColor:`rgba(244, 237, 220, 0.2)`,background:`rgba(244, 237, 220, 0.05)`},className:`rounded-2xl border px-4 py-3 text-sm text-[var(--cream)]`,children:u||`Nie udało się wysłać. Napisz proszę bezpośrednio na ${n.email}.`})]}),(0,l.jsx)(`button`,{type:`submit`,disabled:s===`loading`,className:`cta-red w-full px-6 py-3 text-sm md:w-auto`,children:s===`loading`?`Wysyłam…`:a}),(0,l.jsxs)(`p`,{className:`text-[11px] text-[var(--cream-dim)]`,children:[`Dane z`,` `,`formularza wykorzystam wyłącznie do odpowiedzi na to zapytanie.`]})]})})}var G={background:`var(--card-bg)`,borderColor:`var(--card-border)`},K={background:`var(--page-bg)`};function q({content:e,marker:t}){let{offer:n,process:r,price:i,faq:a}=e;return(0,l.jsxs)(l.Fragment,{children:[(0,l.jsx)(`section`,{id:`oferta`,style:K,className:`px-5 pt-24 pb-16 md:px-10 md:pt-32 md:pb-20`,children:(0,l.jsxs)(`div`,{className:`mx-auto max-w-6xl`,children:[(0,l.jsx)(`p`,{className:`eyebrow`,children:n.eyebrow}),(0,l.jsx)(`h2`,{className:`mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl`,children:n.heading}),(0,l.jsx)(`div`,{className:`mt-12 grid gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-12`,children:n.blocks.map(e=>(0,l.jsxs)(`div`,{className:`flex gap-4`,children:[t,(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`h3`,{className:`font-display text-lg font-semibold text-[var(--cream)]`,children:e.title}),(0,l.jsx)(`p`,{className:`mt-2 text-sm leading-relaxed text-[var(--cream-dim)]`,children:e.body})]})]},e.title))})]})}),(0,l.jsx)(`section`,{id:`proces`,style:K,className:`px-5 py-16 md:px-10 md:py-20`,children:(0,l.jsxs)(`div`,{className:`mx-auto max-w-6xl`,children:[(0,l.jsx)(`div`,{className:`hairline`}),(0,l.jsxs)(`div`,{className:`mt-16 md:mt-20`,children:[(0,l.jsx)(`p`,{className:`eyebrow`,children:r.eyebrow}),(0,l.jsx)(`h2`,{className:`mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl`,children:r.heading}),(0,l.jsx)(`div`,{className:`mt-12 grid gap-10 md:grid-cols-3 md:gap-8`,children:r.steps.map(e=>(0,l.jsxs)(`div`,{className:`flex gap-4`,children:[(0,l.jsx)(`span`,{"aria-hidden":!0,className:`offer-step-num`,children:e.number}),(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`h3`,{className:`font-display text-lg font-semibold text-[var(--cream)]`,children:e.title}),(0,l.jsx)(`p`,{className:`mt-2 text-sm leading-relaxed text-[var(--cream-dim)]`,children:e.body})]})]},e.title))})]})]})}),(0,l.jsx)(`section`,{id:`inwestycja`,style:K,className:`px-5 py-16 md:px-10 md:py-20`,children:(0,l.jsxs)(`div`,{className:`mx-auto max-w-6xl`,children:[(0,l.jsx)(`div`,{className:`hairline`}),(0,l.jsxs)(`div`,{className:`mt-16 md:mt-20`,children:[(0,l.jsx)(`p`,{className:`eyebrow`,children:i.eyebrow}),(0,l.jsx)(`h2`,{className:`mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl`,children:i.heading}),(0,l.jsx)(`p`,{className:`mt-6 max-w-[52ch] text-[15px] leading-relaxed text-[var(--cream-dim)]`,children:i.lead}),(0,l.jsx)(`div`,{style:G,className:`mt-8 rounded-2xl border px-6 md:px-8`,children:i.tiers.map((e,t)=>(0,l.jsxs)(`div`,{children:[t>0&&(0,l.jsx)(`div`,{className:`hairline`}),(0,l.jsxs)(`div`,{className:`price-ladder-row`,children:[(0,l.jsxs)(`div`,{className:`price-ladder-heading`,children:[(0,l.jsx)(`span`,{className:`price-ladder-name`,children:e.name}),(0,l.jsx)(`span`,{className:`price-ladder-value`,children:e.price})]}),(0,l.jsx)(`p`,{className:`price-ladder-desc`,children:e.desc})]})]},e.name))})]})]})}),(0,l.jsx)(`section`,{id:`faq`,style:K,className:`px-5 pt-16 pb-24 md:px-10 md:pt-20 md:pb-32`,children:(0,l.jsxs)(`div`,{className:`mx-auto max-w-6xl`,children:[(0,l.jsx)(`div`,{className:`hairline`}),(0,l.jsxs)(`div`,{className:`mt-16 md:mt-20`,children:[(0,l.jsx)(`p`,{className:`eyebrow`,children:a.eyebrow}),(0,l.jsx)(`h2`,{className:`mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl`,children:a.heading}),(0,l.jsx)(`div`,{style:G,className:`mt-8 rounded-2xl border`,children:a.items.map((e,t)=>(0,l.jsxs)(`div`,{children:[t>0&&(0,l.jsx)(`div`,{className:`hairline`}),(0,l.jsxs)(`details`,{className:`group px-6 py-6 md:px-8`,children:[(0,l.jsxs)(`summary`,{className:`flex cursor-pointer list-none items-center justify-between gap-6`,children:[(0,l.jsx)(`span`,{className:`font-display text-base font-semibold text-[var(--cream)] md:text-lg`,children:e.q}),(0,l.jsx)(`span`,{"aria-hidden":!0,className:`relative shrink-0 text-2xl font-light text-[var(--accent-mark)] transition-transform duration-300 group-open:rotate-45`,children:`+`})]}),(0,l.jsx)(`p`,{className:`mt-4 max-w-2xl text-sm leading-relaxed text-[var(--cream-dim)]`,children:e.a})]})]},e.q))})]})]})})]})}function J({content:e,marker:t}){return(0,l.jsx)(`section`,{id:`kontakt`,style:{background:e.glow},className:`px-5 py-24 md:px-10 md:py-32`,children:(0,l.jsxs)(`div`,{className:`mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:gap-20`,children:[(0,l.jsxs)(`div`,{children:[(0,l.jsx)(`p`,{className:`eyebrow`,children:e.eyebrow}),(0,l.jsx)(`h2`,{className:`mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl`,children:e.heading}),(0,l.jsx)(`p`,{className:`mt-6 max-w-[52ch] text-[15px] leading-relaxed text-[var(--cream-dim)]`,children:e.lead}),(0,l.jsxs)(`div`,{className:`mt-10`,children:[(0,l.jsx)(`p`,{className:`eyebrow`,children:e.listHeading}),(0,l.jsx)(`ul`,{className:`mt-4 space-y-3`,children:e.bullets.map(e=>(0,l.jsxs)(`li`,{className:`flex items-start gap-3 text-sm leading-relaxed text-[var(--cream)]`,children:[t,(0,l.jsx)(`span`,{children:e})]},e))})]}),(0,l.jsx)(`p`,{className:`mt-8 text-sm text-[var(--cream-dim)]`,children:e.priceLine}),(0,l.jsxs)(`div`,{className:`mt-10`,children:[(0,l.jsx)(`div`,{className:`hairline`}),e.rows.map(e=>(0,l.jsxs)(`div`,{children:[(0,l.jsxs)(`a`,{href:e.href,...e.external?{target:`_blank`,rel:`noopener noreferrer`}:{},className:`group flex items-center justify-between gap-4 py-4`,children:[(0,l.jsx)(`span`,{className:`eyebrow`,children:e.label}),(0,l.jsx)(`span`,{className:`text-sm text-[var(--cream)] transition-transform group-hover:translate-x-1`,children:e.value})]}),(0,l.jsx)(`div`,{className:`hairline`})]},e.label)),(0,l.jsx)(`p`,{className:`mt-4 text-sm text-[var(--cream-dim)]`,children:e.responseTime})]})]}),(0,l.jsx)(W,{source:e.source,fields:e.fields,heading:e.formHeading,buildSubject:e.buildSubject})]})})}export{_ as a,S as c,h as d,m as f,o as g,s as h,j as i,C as l,f as m,q as n,v as o,p,R as r,b as s,J as t,g as u};