const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/three-5t8Jrc3N.js","assets/rolldown-runtime-QTnfLwEv.js"])))=>i.map(i=>d[i]);
import{n as e,r as t,t as n}from"./jsx-runtime-i9uBjpvk.js";import{c as r,l as i}from"./content-CPGK3yoW.js";import{t as a}from"./preload-helper-zJ_50EbN.js";var o=t(),s=e(),c=e=>Math.min(1,Math.max(0,e));function l(e,t,n){let r=c((n-e)/(t-e));return r*r*(3-2*r)}function u(e){let t=c(e);return .5-.5*Math.cos(Math.PI*t)}function d(e,[t,n]){return c((e-t)/(n-t))}var f=n(),p=typeof window<`u`&&window.location.search.includes(`debug=1`),m=e=>Math.min(1,Math.max(0,e));function h({id:e,className:t,debugHandleName:n,height:r,createScene:i,h1:a,brand:s,contact:c,intro:l,outro:u,timeline:h}){let g=(0,o.useRef)(null),_=(0,o.useRef)(null),v=(0,o.useRef)(null),y=(0,o.useRef)(null),[b]=(0,o.useState)(()=>typeof window<`u`&&window.matchMedia(`(prefers-reduced-motion: reduce)`).matches),[x,S]=(0,o.useState)(`loading`),C=b||x===`fallback`;return(0,o.useEffect)(()=>{let e=g.current,t=_.current,r=v.current,a=y.current;if(!e||!t||!r||!a)return;let o=!1,s=null,c=``,l=!0,u=()=>{if(b)return 1;let t=e.getBoundingClientRect(),n=t.height-window.innerHeight;return n>0?m(-t.top/n):1},f=()=>{let e=u(),n=1-d(e,[h.introHold,h.introOut]),r=d(e,h.outro);t.style.setProperty(`--p`,e.toFixed(4)),t.style.setProperty(`--intro`,n.toFixed(3)),t.style.setProperty(`--outro`,r.toFixed(3));let i=r>.6?`outro`:n>.4?`intro`:`mid`;i!==c&&(c=i,t.dataset.phase=i,a.inert=i!==`outro`),s?.setProgress(e)};f(),window.addEventListener(`scroll`,f,{passive:!0}),window.addEventListener(`resize`,f);let x=new IntersectionObserver(([e])=>{l=e.isIntersecting,s?.setVisible(l)},{rootMargin:`10% 0px`});x.observe(e);let C=new ResizeObserver(()=>{f(),s?.resize()});C.observe(t),C.observe(e);let w=e=>{e.preventDefault(),s?.dispose(),s=null,S(`fallback`)};return r.addEventListener(`webglcontextlost`,w),(async()=>{try{let e=window.matchMedia(`(pointer: coarse)`).matches,t=await i(r,{reduced:b,coarse:e});if(o){t.dispose();return}s=t,t.setProgress(u()),t.setVisible(l),S(`live`),p&&(window[n]=t.debug)}catch{o||S(`fallback`)}})(),()=>{o=!0,window.removeEventListener(`scroll`,f),window.removeEventListener(`resize`,f),r.removeEventListener(`webglcontextlost`,w),x.disconnect(),C.disconnect(),s?.dispose()}},[b,i,n,h]),(0,f.jsx)(`section`,{ref:g,id:e,"aria-labelledby":a.id,className:`stage ${t} ${C?`stage--still`:``}`,style:{"--stage-height":r},children:(0,f.jsxs)(`div`,{ref:_,className:`stage-frame`,"data-status":x,"data-phase":`intro`,children:[(0,f.jsx)(`canvas`,{ref:v,className:`stage-canvas`,"aria-hidden":!0}),(0,f.jsx)(`div`,{className:`stage-vignette`,"aria-hidden":!0}),(0,f.jsxs)(`header`,{className:`stage-bar`,children:[(0,f.jsx)(`a`,{href:s.href,className:`stage-brand`,children:s.content}),(0,f.jsx)(`a`,{href:c.href,className:`stage-bar-link`,children:c.label})]}),(0,f.jsx)(`h1`,{id:a.id,className:x===`fallback`?`stage-fallback-title`:`sr-only`,children:a.text}),(0,f.jsxs)(`div`,{className:`stage-intro`,children:[(0,f.jsx)(`p`,{className:`stage-eyebrow`,children:l.eyebrow}),(0,f.jsx)(`p`,{className:`stage-intro-title`,children:l.title}),(0,f.jsxs)(`p`,{className:`stage-intro-hint`,children:[(0,f.jsx)(`span`,{className:`stage-cue`,"aria-hidden":!0}),l.hint]})]}),(0,f.jsxs)(`div`,{ref:y,className:`stage-outro`,children:[(0,f.jsx)(`p`,{className:`stage-outro-line`,children:u.line}),(0,f.jsxs)(`div`,{className:`stage-outro-actions`,children:[(0,f.jsx)(`a`,{href:u.ctaHref,className:`cta-red stage-outro-cta`,children:u.ctaLabel}),(0,f.jsx)(`a`,{href:u.mailHref,className:`stage-outro-mail`,children:u.mailLabel})]})]})]})})}var g=`
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
`,_=`
uniform vec3 uSun;
uniform vec3 uSunCol;
uniform vec3 uSky;
`,v=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`,y=`
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec2 d = (vUv - 0.5) * 2.0;
  float r = length(d);
  float a = (1.0 - smoothstep(0.15, 1.0, r)) * uOpacity;
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}
`,b={wet:[.016,.0115,.008],loam:[.046,.031,.021],dry:[.088,.066,.047],stoneLo:[.085,.08,.07],stoneHi:[.22,.21,.19],straw:[.19,.155,.09]},x={dir:[.96,.28],freq:21},S=`
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
`,C=`
varying vec3 vWorld;
varying float vDist;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  vDist = length(w.xyz - cameraPosition);
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,w=`
${g}
${S}
${_}
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
`;function T(e){return(e.coarse?`#define COARSE 1
`:``)+(e.angular?`#define ANGULAR 1
`:``)+w}function E(e,t,n,r){return{uWet:{value:new e.Vector3(...t.wet)},uLoam:{value:new e.Vector3(...t.loam)},uDry:{value:new e.Vector3(...t.dry)},uStoneLo:{value:new e.Vector3(...t.stoneLo)},uStoneHi:{value:new e.Vector3(...t.stoneHi)},uStraw:{value:new e.Vector3(...t.straw)},uRakeDir:{value:new e.Vector2(...n.dir)},uRakeFreq:{value:n.freq},uAngular:{value:r?.angular??0},uOrganic:{value:r?.organic??1}}}var D=Math.PI/180,O=F([-.5,.74,-.45]),k=[1.45,1.12,.78],A=[.36,.42,.55],j=1182728,M=1.5,N=.04;async function P(e,t){let n=await a(()=>import(`./three-5t8Jrc3N.js`).then(e=>e.d),__vite__mapDeps([0,1])),r=new n.WebGLRenderer({canvas:e,antialias:!0,alpha:!1,powerPreference:`high-performance`});r.setPixelRatio(Math.min(window.devicePixelRatio||1,t.pixelRatioCap??M)),r.setClearColor(t.clearColor??j,1);let i=new n.Scene,o=new n.PerspectiveCamera(t.vfov,1,.1,120),s={uSun:{value:new n.Vector3(...t.sun??O)},uSunCol:{value:new n.Vector3(...t.sunColor??k)},uSky:{value:new n.Vector3(...t.sky??A)}},c={time:0},l=t.tilt*D,u=t.rebuildThreshold??N,d,f={THREE:n,scene:i,camera:o,get frame(){return d},light:s,clock:c,reduced:t.reduced,coarse:t.coarse};function p(e){let r=t.groundWidth(e)/(2*Math.tan(t.vfov*D/2)*e);o.aspect=e,o.position.set(0,r*Math.cos(l),r*Math.sin(l)),o.up.set(0,1,0),o.lookAt(0,0,0),o.updateProjectionMatrix(),o.updateMatrixWorld(!0);let i=(e,t)=>{let r=new n.Vector3(e,t,.5).unproject(o).sub(o.position).normalize(),i=-o.position.y/r.y;return o.position.clone().addScaledVector(r,i)},a=i(-1,1),s=i(-1,-1);return{zFar:a.z,zNear:s.z,halfFar:Math.abs(a.x),halfNear:Math.abs(s.x),halfAt(e){let t=(e-a.z)/(s.z-a.z);return Math.abs(a.x)+(Math.abs(s.x)-Math.abs(a.x))*t}}}let m=null,h=0,g=0;function _(e){i.remove(e.group),e.dispose()}function v(e){m&&t.update(m,e,f)}function y(){let n=e.parentElement??e,a=Math.max(1,n.clientWidth),o=Math.max(1,n.clientHeight);r.setSize(a,o,!1);let s=a/o;d=p(s),(!m||Math.abs(s/h-1)>u||Math.abs(a/g-1)>u)&&(m&&_(m),m=t.build(f),i.add(m.group),h=s,g=a),v(x),C=!0}let b=+!!t.reduced,x=b,S=!0,C=!0,w=0,T=performance.now(),E=0,P=!1,F=()=>{r.render(i,o),C=!1},I=e=>{w=requestAnimationFrame(I);let t=Math.min(.05,(e-T)/1e3);T=e;let n=b-x;x=Math.abs(n)<1e-4?b:x+n*(1-Math.exp(-t*7)),E=Math.abs(n)<1e-4?E+t:0,!(E>1.5&&(P=!P,P))&&(c.time+=t,v(x),F())},L=()=>{w||t.reduced||(T=performance.now(),w=requestAnimationFrame(I))},R=()=>{cancelAnimationFrame(w),w=0},z=()=>{document.hidden?R():S&&L()};return document.addEventListener(`visibilitychange`,z),y(),v(x),F(),L(),{setProgress(e){b=t.reduced?1:Math.min(1,Math.max(0,e)),t.reduced&&C&&F()},resize(){y(),w||F()},setVisible(e){S=e,e&&!document.hidden?L():R()},dispose(){R(),document.removeEventListener(`visibilitychange`,z),m&&_(m),m=null,r.dispose()},debug:{jump(e,t){b=x=e,t!==void 0&&(c.time=t),v(e),F()},info(){return{pixelRatio:r.getPixelRatio(),progress:x,...t.debugInfo?.(m)??{}}}}}}function F(e){let t=Math.hypot(e[0],e[1],e[2]);return[e[0]/t,e[1]/t,e[2]/t]}var I=900,L=.96,R=.02,z=.05,B=7;function V(e){let t=e.weight??I,n=e.lineHeight??L,r=e.tracking??R,i=e.pitchPerEm??z,a=e.maskPxPerPitch??B,{rand:o}=e,s=n=>`${t} ${n}px ${e.fontFamily}`,c=document.createElement(`canvas`).getContext(`2d`);c.font=s(100);let l=e=>Math.max(0,e.length-1)*r*100,u={lines:e.layouts[0],em:0};for(let t of e.layouts){let r=Math.max(...t.map(e=>c.measureText(e).width+l(e)))/100,i=t.length*n*e.stretch,a=Math.min(e.width/r,e.depth/i);a>u.em&&(u={lines:t,em:a})}let{lines:d,em:f}=u,p=f*i,m=t=>e.width*e.depth*.34/(t*t*.866);for(;m(p)>e.maxCount*1.15;)p*=1.06;let h=a/p,g=f*h,_=e.width*h,v=g*n,y=d.length*v,b=document.createElement(`canvas`);b.width=Math.ceil(_+g),b.height=Math.ceil(y+g);let x=b.getContext(`2d`,{willReadFrequently:!0});x.fillStyle=`#000`,x.fillRect(0,0,b.width,b.height),x.fillStyle=`#fff`,x.font=s(g),x.textBaseline=`alphabetic`,x.textAlign=`left`;let S=[];d.forEach((e,t)=>{let n=[...e],i=n.map(e=>x.measureText(e).width),a=i.reduce((e,t)=>e+t,0)+(n.length-1)*r*g,o=(b.width-a)/2,s=(b.height-y)/2+t*v+g*.8;S.push({left:o,right:o+a,top:s-g*.78,bottom:s+g*.22}),n.forEach((e,t)=>{x.fillText(e,o,s),o+=i[t]+r*g})});let C=x.getImageData(0,0,b.width,b.height).data,w=(e,t)=>{let n=Math.round(e),r=Math.round(t);return n<0||r<0||n>=b.width||r>=b.height?0:C[(r*b.width+n)*4]/255},T=e=>(e-b.width/2)/h,E=t=>(t-b.height/2)/h*e.stretch+e.centreZ,D=[],O=p*h,k=O*.866,A=Array.from({length:8},(e,t)=>{let n=t/8*Math.PI*2;return[Math.cos(n)*O*1.02,Math.sin(n)*O*1.02]}),j=Math.min(...S.map(e=>e.left)),M=Math.max(...S.map(e=>e.right));for(let e=0,t=k/2;t<b.height;e++,t+=k){let n=e%2?O/2:0;for(let e=n;e<b.width;e+=O){let n=e+(o()-.5)*O*.36,r=t+(o()-.5)*O*.36;if(w(n,r)<.5)continue;let i=!1;for(let[e,t]of A)if(w(n+e,r+t)<.5){i=!0;break}let a=0;for(let e=0;e<S.length;e++)r>=S[e].top-k&&r<=S[e].bottom+k&&(a=e);D.push({x:T(n),z:E(r),edge:i,line:a,nx:(n-j)/Math.max(1,M-j)})}}let N=Math.round(e.maxCount*1.2),P=D;if(D.length>N){let e=D.map((e,t)=>t);for(let t=0;t<N;t++){let n=t+Math.floor(o()*(e.length-t));[e[t],e[n]]=[e[n],e[t]]}P=e.slice(0,N).sort((e,t)=>e-t).map(e=>D[e])}return{points:P,lines:d,em:f,pitch:p}}var H={DAISY:0,POMPOM:1,CUP:2,POPPY:3},U={petal:`#fbf6ea`,centre:`#f0b429`,petals:13,round:.35,form:H.DAISY,size:1,height:1},W={petal:`#ffe27e`,centre:`#d9822b`,petals:9,round:.6,form:H.DAISY,size:.94,height:.92},G={petal:`#ffc4d2`,centre:`#f5c93b`,petals:6,round:1.4,form:H.CUP,size:1.02,height:1.1},K={petal:`#fdeccd`,centre:`#e8c15a`,petals:20,round:.2,form:H.POMPOM,size:.82,height:.84},q={petal:`#ffcf9b`,centre:`#e0913a`,petals:6,round:1.1,form:H.CUP,size:1.06,height:1.28},ee={petal:`#ee2e1c`,centre:`#ffd23f`,petals:5,round:1.6,form:H.POMPOM,size:1,height:.95},te={petal:`#ff5b3d`,centre:`#ffd65a`,petals:5,round:1.3,form:H.DAISY,size:1,height:1},ne={petal:`#e01f12`,centre:`#2a0d06`,petals:4,round:.85,form:H.POPPY,size:1.22,height:1.2},re=[[`Zbuduję dla Ciebie`,`nową stronę`],[`Zbuduję dla`,`Ciebie nową`,`stronę`],[`Zbuduję`,`dla Ciebie`,`nową`,`stronę`],[`Zbuduję`,`dla`,`Ciebie`,`nową`,`stronę`]];function ie(e){let t=oe(e.seed??20260911),{points:n,lines:r,em:i,pitch:a}=V({layouts:re,width:e.width,depth:e.depth,centreZ:e.centreZ,stretch:e.stretch,maxCount:e.maxCount,fontFamily:e.fontFamily,rand:t}),o=n.length,s={count:o,pos:new Float32Array(o*3),size:new Float32Array(o),petal:new Float32Array(o*3),centre:new Float32Array(o*3),shape:new Float32Array(o*3),birth:new Float32Array(o),seed:new Float32Array(o),lines:r,em:i,pitch:a},c=Math.max(1,r.length-1);for(let r=0;r<o;r++){let i=n[r],o=t(),l=i.edge?o<.6?ee:o<.88?te:ne:o<.42?U:o<.66?W:o<.83?K:o<.94?G:q,u=.94+t()*.1,d=ae(l.petal),f=ae(l.centre);s.pos[r*3]=i.x,s.pos[r*3+1]=i.z,s.pos[r*3+2]=a*(.9+t()*.7)*l.height,s.size[r]=a*(i.edge?1.6:1.85)*l.size*(.9+t()*.22),s.petal.set([d[0]*u,d[1]*u,d[2]*u],r*3),s.centre.set(f,r*3),s.shape[r*3]=l.petals,s.shape[r*3+1]=l.round,s.shape[r*3+2]=l.form;let p=i.nx*.82+i.line/c*.12+t()*.06;s.birth[r]=e.timeline.start+e.timeline.sweep*p+(i.edge?0:e.timeline.edgeLead),s.seed[r]=t()}return s}function ae(e){let t=parseInt(e.slice(1),16),n=e=>(e/255)**2.2;return[n(t>>16&255),n(t>>8&255),n(t&255)]}function oe(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var se=`
${g}
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
`,ce=`
${g}
${_}
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
`,le=`
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
`,ue=`
${g}
${_}
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
`,de=`
${g}
${_}
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
`,J=`
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
`,fe=`
${J}
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
`,pe=`
${g}
${_}
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
`,me=`
${J}
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
`,he=`
${g}
${_}
varying float vT;
void main() {
  vec3 c = mix(vec3(0.02, 0.06, 0.01), vec3(0.07, 0.2, 0.035), vT);
  gl_FragColor = vec4(finish(c * (uSky * 0.6 + uSunCol * 0.8)), 1.0);
}
`,ge=`
${J}
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
`,_e=`
varying vec2 vUv;
varying float vA;
void main() {
  float r = length((vUv - 0.5) * 2.0);
  float a = (1.0 - smoothstep(0.25, 1.0, r)) * 0.42 * vA;
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}
`,Y={introHold:.025,introOut:.075,rollStart:.05,rollSpan:.36,rollStagger:.12,knit:[.5,.64],plantStart:.52,plantEnd:.66,flowerStart:.56,flowerSweep:.24,edgeLead:.035,flowerGrow:.075,outro:[.88,.94]},X=12,ve=`
attribute vec3 aCentre;
attribute vec3 aDir;
attribute vec3 aUp;
attribute vec2 aSize;
attribute float aSeed;
attribute float aShrubId;
attribute float aBirth;
uniform float uTime;
uniform float uWind;
uniform float uGrow[${X}];
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
`,ye=`
${g}
${_}
uniform float uWarmth[${X}];
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
`,be=`
attribute vec2 aCentre;
attribute vec2 aSize;
attribute float aShrubId;
uniform vec2 uShadowDir;
uniform float uGrow[${X}];
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
`,xe=`
${g}
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
`;function Se(e,t){let n=Ce(t.seed??20260912),r=new e.Group,i=[],a=t.zNear-t.zFar,o=e=>t.halfFar+(t.halfNear-t.halfFar)*((e-t.zFar)/a),s=t.bed.centreZ-t.bed.halfDepth,c=t.bed.centreZ+t.bed.halfDepth,l=t.bed.halfWidth,u=t.light.uSun.value,d={x:-u.x/u.y,z:-u.z/u.y},f=Math.max(1.4,a)*(t.coarse?.1:.092);function p(e){let t=e.r*1.2,n=e.x+d.x*e.r*.8,r=e.z+d.z*e.r*.8,i=(e,t,n)=>e<-l-n||e>l+n||t<s-n||t>c+n;return i(e.x,e.z,t)&&i(n,r,e.r*.7)}function m(e,t,r){let i={x:e,z:t,r:f*(.72+n()*.66),warmth:n()<.35?.5+n()*.5:0,seed:n(),order:0};for(let e=0;e<12&&!p(i);e++)r===0?i.z-=i.r*.4:i.x+=r*i.r*.4;return p(i)?i:null}let h=t.coarse?4+Math.floor(n()*2):6+Math.floor(n()*3),g=Math.max(2,Math.round(h*.55)),_=h-g,v=Math.ceil(_/2),y=[],b=o(t.zFar)*1.1;for(let e=0;e<g;e++){let r=(e+.5)/g+(n()-.5)*(.7/g),i=m(-b+r*2*b,t.zFar-f*(.1+n()*.45),0);i&&y.push(i)}for(let e=0;e<_;e++){let r=e<v?-1:1,i=t.zFar+a*(.1+n()*.7),s=m(r*(o(i)+f*(.05+n()*.4)),i,r);s&&y.push(s)}let x=y.map(e=>e.x),S=Math.min(...x,0),C=Math.max(...x,0)-S||1;y.forEach(e=>{e.order=(e.x-S)/C});let w=[],T=t.coarse?60:130;y.forEach((e,t)=>{for(let r=0;r<T;r++){let r=n()*Math.PI*2,i=Math.acos(1-.92*n()),a=e.r*(.72+n()*.3),o=Math.sin(i)*Math.cos(r),s=Math.cos(i),c=Math.sin(i)*Math.sin(r),l=e.r*(.3+n()*.2),u=()=>(n()-.5)*1.5;w.push({c:[e.x+o*a,.02+s*a*.78,e.z+c*a],d:[o,s+.35,c],u:[o*.5+u(),.75+n()*.5,c*.5+u()],len:l,wid:l*(.42+n()*.22),seed:n(),shrubId:t,birth:n()*.6})}});let E=new e.PlaneGeometry(1,1),D=new e.InstancedBufferGeometry;D.index=E.index,D.setAttribute(`position`,E.getAttribute(`position`));let O=w.length,k=new Float32Array(O*3),A=new Float32Array(O*3),j=new Float32Array(O*3),M=new Float32Array(O*2),N=new Float32Array(O),P=new Float32Array(O),F=new Float32Array(O);w.forEach((e,t)=>{k.set(e.c,t*3),A.set(e.d,t*3),j.set(e.u,t*3),M.set([e.wid,e.len],t*2),N[t]=e.seed,P[t]=e.shrubId,F[t]=e.birth}),D.setAttribute(`aCentre`,new e.InstancedBufferAttribute(k,3)),D.setAttribute(`aDir`,new e.InstancedBufferAttribute(A,3)),D.setAttribute(`aUp`,new e.InstancedBufferAttribute(j,3)),D.setAttribute(`aSize`,new e.InstancedBufferAttribute(M,2)),D.setAttribute(`aSeed`,new e.InstancedBufferAttribute(N,1)),D.setAttribute(`aShrubId`,new e.InstancedBufferAttribute(P,1)),D.setAttribute(`aBirth`,new e.InstancedBufferAttribute(F,1)),D.instanceCount=O;let I=Array(X).fill(0),L=Array(X).fill(0);y.forEach((e,t)=>{L[t]=e.warmth});let R=new e.ShaderMaterial({vertexShader:ve,fragmentShader:ye,uniforms:{...t.light,uTime:{value:0},uWind:{value:t.reduced?0:f*.03},uGrow:{value:I},uWarmth:{value:L}},side:e.DoubleSide,alphaToCoverage:!0}),z=new e.Mesh(D,R);z.frustumCulled=!1,z.renderOrder=7,r.add(z),i.push(E,D,R);let B=new e.PlaneGeometry(1,1),V=new e.InstancedBufferGeometry;V.index=B.index,V.setAttribute(`position`,B.getAttribute(`position`));let H=new Float32Array(y.length*2),U=new Float32Array(y.length*2),W=new Float32Array(y.length);y.forEach((e,t)=>{H.set([e.x+d.x*e.r*.7,e.z+d.z*e.r*.7],t*2),U.set([e.r*2.1,e.r*1.5],t*2),W[t]=t}),V.setAttribute(`aCentre`,new e.InstancedBufferAttribute(H,2)),V.setAttribute(`aSize`,new e.InstancedBufferAttribute(U,2)),V.setAttribute(`aShrubId`,new e.InstancedBufferAttribute(W,1)),V.instanceCount=y.length;let G=new e.ShaderMaterial({vertexShader:be,fragmentShader:xe,uniforms:{uShadowDir:{value:new e.Vector2(d.x,d.z)},uGrow:{value:I}},transparent:!0,depthWrite:!1}),K=new e.Mesh(V,G);K.frustumCulled=!1,K.renderOrder=2,r.add(K),i.push(B,V,G);let[q,ee]=t.window,te=Math.max(.04,(ee-q)*.55);return{group:r,update(e,t){y.forEach((e,n)=>{let r=q+(ee-q-te)*e.order;I[n]=Math.min(1,Math.max(0,(t-r)/te))}),R.uniforms.uTime.value=e},dispose(){for(let e of i)e.dispose()},info:()=>({shrubs:y.length,leaves:O})}}function Ce(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var we=Math.PI/180,Te=24,Ee=Te*we,De=36,Oe=8,ke=.16,Ae=.018,Z=Le([-.5,.74,-.45]),je=[1.45,1.12,.78],Me=[.36,.42,.55],Ne=`"Hanken Grotesk", system-ui, sans-serif`;async function Pe(e,t){await Promise.race([document.fonts?.load(`900 64px "Hanken Grotesk"`,`Zbudujęąó`).catch(()=>void 0),new Promise(e=>setTimeout(e,2500))]);let n=t.coarse?10:14;return P(e,{reduced:t.reduced,coarse:t.coarse,tilt:Te,vfov:De,groundWidth:e=>Math.max(5.6,Math.min(14.5,7.8*e)),sun:Z,sunColor:je,sky:Me,clearColor:1182728,pixelRatioCap:1.5,build:e=>Fe(e,t,n),update:(e,t,n)=>Ie(e,t,n),debugInfo:e=>({strips:e?.strips.length,flowers:e?.field.count,lines:e?.field.lines,em:e?.field.em,pitch:e?.field.pitch,shells:n,shrubs:e?.shrubs.info()})})}function Fe(e,t,n){let{THREE:r,light:i}=e,a=e.frame,o=[],s=new r.Group,c=Re(911),l=a.zNear-a.zFar,u=2*Math.max(a.halfFar,a.halfNear)+.8,d=Math.min(Oe,Math.max(3,Math.round(u/2.4))),f=u/d,p=-u/2,m=Math.min(.7,f*.27),h=.035,g=a.zFar-1.2,_=a.zNear+m+.9,S=Array.from({length:d},(e,t)=>t/Math.max(1,d-1));for(let e=S.length-1;e>0;e--){let t=Math.floor(c()*(e+1));[S[e],S[t]]=[S[t],S[e]]}let w=Array.from({length:d},(e,t)=>{let n=a.zFar+l*.3+(c()-.5)*.45,r=_-n;return{x:p+(t+.5)*f,len:f*.985,zInit:n,total:r,tau:Math.PI*(m*m-h*h)/r,startAt:Y.rollStart+Y.rollStagger*S[t],shade:(t%2?.92:1)*(.97+c()*.06)}});{let e=new r.PlaneGeometry(u+6,l+8).rotateX(-Math.PI/2);e.translate(0,0,(a.zFar+a.zNear)/2);let n=new r.ShaderMaterial({vertexShader:C,fragmentShader:T({coarse:t.coarse}),uniforms:{...i,...E(r,b,x)}}),c=new r.Mesh(e,n);c.renderOrder=1,s.add(c),o.push(e,n)}let D=new r.ShaderMaterial({vertexShader:se,fragmentShader:ce,uniforms:{...i,uBase:{value:Ae},uHeight:{value:ke},uX0:{value:p},uW:{value:f},uN:{value:d},uZc:{value:Array(Oe).fill(g)},uShade:{value:Array.from({length:Oe},(e,t)=>w[t]?.shade??1)},uDensity:{value:t.coarse?26:30},uTime:{value:0},uKnit:{value:0}},alphaToCoverage:!0});{let e=new r.PlaneGeometry(u,_-g,40,60).rotateX(-Math.PI/2);e.translate(0,0,(g+_)/2);let t=new r.InstancedBufferGeometry;t.index=e.index,t.setAttribute(`position`,e.getAttribute(`position`));let i=new Float32Array(n);for(let e=0;e<n;e++)i[e]=e/(n-1);t.setAttribute(`aLayer`,new r.InstancedBufferAttribute(i,1)),t.instanceCount=n;let a=new r.Mesh(t,D);a.frustumCulled=!1,a.renderOrder=0,s.add(a),o.push(e,t,D)}let O=new r.CylinderGeometry(1,1,1,72,1,!0).rotateZ(Math.PI/2),k=new r.CircleGeometry(1,72).rotateY(Math.PI/2).translate(.5,0,0),A=new r.CircleGeometry(1,72).rotateY(-Math.PI/2).translate(-.5,0,0),j=new r.PlaneGeometry(1,1).rotateX(-Math.PI/2);o.push(O,k,A,j);let M=w.map(e=>{let t=new r.Group,n=new r.ShaderMaterial({vertexShader:le,fragmentShader:ue,uniforms:{...i,uR0:{value:m},uR:{value:m},uLen:{value:e.len}}}),a=[1,-1].map(t=>new r.ShaderMaterial({vertexShader:le,fragmentShader:de,uniforms:{...i,uR:{value:m},uTau:{value:e.tau},uCore:{value:h},uCapLight:{value:Math.max(.12,Z[0]*t)*1.1}}})),c=new r.Mesh(O,n),l=new r.Mesh(k,a[0]),u=new r.Mesh(A,a[1]);for(let e of[c,l,u])e.renderOrder=3;t.add(c,l,u),s.add(t);let d=new r.ShaderMaterial({vertexShader:v,fragmentShader:y,uniforms:{uOpacity:{value:.6}},transparent:!0,depthWrite:!1}),f=new r.Mesh(j,d);return f.renderOrder=2,s.add(f),o.push(n,...a,d),{group:t,body:n,caps:a,shadow:f,shadowMat:d}}),N=l*.6,P=a.zFar+l*.46,F=ie({width:2*a.halfAt(P+N/2)*.86,depth:N,centreZ:P,stretch:1/Math.cos(Ee),maxCount:t.coarse?4800:7500,fontFamily:Ne,timeline:{start:Y.flowerStart,sweep:Y.flowerSweep,edgeLead:Y.edgeLead}}),I=new r.PlaneGeometry(1,1),L=new r.InstancedBufferGeometry;L.index=I.index,L.setAttribute(`position`,I.getAttribute(`position`)),L.setAttribute(`uv`,I.getAttribute(`uv`)),L.setAttribute(`aPos`,new r.InstancedBufferAttribute(F.pos,3)),L.setAttribute(`aSize`,new r.InstancedBufferAttribute(F.size,1)),L.setAttribute(`aPetal`,new r.InstancedBufferAttribute(F.petal,3)),L.setAttribute(`aCentre`,new r.InstancedBufferAttribute(F.centre,3)),L.setAttribute(`aShape`,new r.InstancedBufferAttribute(F.shape,3)),L.setAttribute(`aBirth`,new r.InstancedBufferAttribute(F.birth,1)),L.setAttribute(`aSeed`,new r.InstancedBufferAttribute(F.seed,1)),L.instanceCount=F.count,o.push(I,L);let R={uP:{value:0},uGrow:{value:Y.flowerGrow},uTime:{value:0},uWind:{value:t.reduced?0:.09},uGrassTop:{value:.178}},z=new r.ShaderMaterial({vertexShader:ge,fragmentShader:_e,uniforms:{...R,uShadowDir:{value:new r.Vector2(-Z[0]/Z[1],-Z[2]/Z[1])}},transparent:!0,depthWrite:!1}),B=new r.Vector3().setFromMatrixColumn(e.camera.matrixWorld,0);B.y=0,B.normalize();let V=new r.ShaderMaterial({vertexShader:me,fragmentShader:he,uniforms:{...R,...i,uCamRight:{value:B},uStemW:{value:.011}},side:r.DoubleSide}),H=new r.ShaderMaterial({vertexShader:fe,fragmentShader:pe,uniforms:{...R,...i},side:r.DoubleSide,alphaToCoverage:!0});[z,V,H].forEach((e,t)=>{let n=new r.Mesh(L,e);n.frustumCulled=!1,n.renderOrder=4+t,s.add(n),o.push(e)});let U=Se(r,{halfFar:a.halfFar,halfNear:a.halfNear,zFar:a.zFar,zNear:a.zNear,bed:{centreZ:P,halfDepth:N/2,halfWidth:a.halfAt(P+N/2)*.86},light:i,coarse:t.coarse,reduced:t.reduced,window:[Y.plantStart,Y.plantEnd]});return s.add(U.group),o.push(U),{group:s,shrubs:U,strips:w,r0:m,core:h,rolls:M,grass:D,flowerMats:[z,V,H],field:F,dispose(){for(let e of o)e.dispose()}}}function Ie(e,t,n){let r=e.grass.uniforms.uZc.value;e.strips.forEach((n,i)=>{let a=u((t-n.startAt)/Y.rollSpan),o=n.zInit+n.total*a,s=o-n.zInit,c=Math.sqrt(Math.max(e.core*e.core,e.r0*e.r0-n.tau*s/Math.PI)),l=2*Math.PI/n.tau*(e.r0-c);r[i]=o;let d=e.rolls[i],f=a<.999;if(d.group.visible=f,d.shadow.visible=f,f){d.group.position.set(n.x,c+Ae*.5,o),d.group.scale.set(n.len,c,c),d.group.rotation.set(l,0,0),d.body.uniforms.uR.value=c;for(let e of d.caps)e.uniforms.uR.value=c;d.shadow.position.set(n.x+c*.25,.188,o+c*.55),d.shadow.scale.set(n.len*1.06,1,c*2.9),d.shadowMat.uniforms.uOpacity.value=.62*Math.sqrt(c/e.r0)}}),e.grass.uniforms.uKnit.value=l(Y.knit[0],Y.knit[1],t),e.grass.uniforms.uTime.value=n.clock.time,e.shrubs.update(n.clock.time,t);for(let r of e.flowerMats)r.uniforms.uP.value=t,r.uniforms.uTime.value=n.clock.time}function Le(e){let t=Math.hypot(e[0],e[1],e[2]);return[e[0]/t,e[1]/t,e[2]/t]}function Re(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var ze={introHold:Y.introHold,introOut:Y.introOut,outro:Y.outro};function Be(){return(0,f.jsx)(h,{id:`ogrod`,className:`garden`,debugHandleName:`__garden`,height:`480svh`,createScene:Pe,h1:{id:`garden-title`,text:`Zbuduję nową stronę dla Twojej pracowni architektury krajobrazu`},brand:{href:`https://marcinbochenek.com/`,content:(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(i,{size:26}),(0,f.jsx)(`span`,{children:`Marcin Bochenek`})]})},contact:{href:`#kontakt`,label:`Kontakt`},intro:{eyebrow:`Dla pracowni architektury krajobrazu`,title:`Najpierw przygotujmy teren.`,hint:`Przewiń — rozłożę trawnik`},outro:{line:(0,f.jsx)(f.Fragment,{children:`Strona dla Twojej pracowni: realizacje, oferta i\xA0zapytania od klientów w\xA0jednym miejscu.`}),ctaLabel:`Porozmawiajmy`,ctaHref:`#kontakt`,mailHref:`mailto:${r.email}`,mailLabel:r.email},timeline:ze})}function Ve(){return(0,f.jsx)(`footer`,{style:{background:`var(--moss-950)`},className:`px-5 py-8 md:px-10`,children:(0,f.jsxs)(`div`,{className:`mx-auto max-w-6xl`,children:[(0,f.jsx)(`div`,{className:`hairline`}),(0,f.jsxs)(`div`,{className:`flex flex-col gap-3 pt-6 font-mono text-[11px] tracking-[0.05em] text-[var(--cream-dim)] md:flex-row md:items-center md:justify-between md:text-xs`,children:[(0,f.jsx)(`p`,{children:`© 2026 Marcin Bochenek`}),(0,f.jsxs)(`div`,{className:`flex items-center gap-5`,children:[(0,f.jsx)(`a`,{href:`mailto:${r.email}`,className:`transition-colors hover:text-[var(--cream)]`,children:r.email}),(0,f.jsx)(`a`,{href:`https://marcinbochenek.com/`,className:`transition-colors hover:text-[var(--cream)]`,children:`marcinbochenek.com`})]})]})]})})}function He(){return(0,f.jsx)(`svg`,{"aria-hidden":!0,width:`14`,height:`14`,viewBox:`0 0 14 14`,fill:`none`,className:`mt-1 shrink-0`,children:(0,f.jsx)(`path`,{d:`M2 12C2 6 6 2 12 2C12 8 8 12 2 12Z`,fill:`var(--leaf)`})})}var Ue={offer:{eyebrow:`Oferta`,heading:`Co dostajesz`,blocks:[{title:`Portfolio, które broni ceny`,body:`Duże zdjęcia realizacji, galerie przed i po, opis zakresu i doboru roślin. Klient widzi Waszą robotę, zanim zadzwoni — i przychodzi na rozmowę z innym nastawieniem.`},{title:`Oferta rozpisana po ludzku`,body:`Projekt, realizacja, pielęgnacja: co wchodzi w zakres, jak wygląda współpraca i czego nie robicie. Połowa zapytań odpada właśnie na tym, że tego nigdzie nie było.`},{title:`Formularz, który odsiewa`,body:`Metraż, lokalizacja, termin i budżet zebrane w jednym kroku. Dostajesz zapytanie, z którym da się od razu pracować, zamiast „ile kosztuje ogród?".`},{title:`Widoczność tam, gdzie pracujecie`,body:`Strona szybka na telefonie i opisana tak, żeby Google i modele AI wiedziały, w jakiej okolicy działacie i co dokładnie robicie.`}]},process:{eyebrow:`Proces`,heading:`Jak to działa`,steps:[{number:`01`,title:`Rozmowa, 20 minut`,body:`Pokazujesz realizacje i mówisz, komu chcesz sprzedawać. Wychodzę z tego z zakresem i widełkami — bez prezentacji i bez zobowiązania.`},{number:`02`,title:`Projekt i wdrożenie`,body:`Typowa strona pracowni to 2–4 tygodnie od kompletu materiałów. Postęp oglądasz na żywym podglądzie, nie w raporcie.`},{number:`03`,title:`Start i opieka`,body:`Przenoszę domenę, wpinam analitykę, zostaję na zmiany. Strona jest Wasza — kod i treści zostają u Was.`}]},price:{eyebrow:`Inwestycja`,heading:`Ile to kosztuje`,lead:`Wycenę podaję po rozmowie, bez ukrytych pozycji. Punkt wyjścia zależy od tego, ile strona ma robić.`,tiers:[{name:`Wizytówka z formularzem`,price:`od 2 000 PLN`,desc:`jedna strona, realizacje, kontakt.`},{name:`Strona z portfolio i lejkiem zapytań`,price:`od 8 000 PLN`,desc:`wiele podstron, panel do dodawania realizacji, integracje.`}]},faq:{eyebrow:`FAQ`,heading:`Pytania, które słyszę najczęściej`,items:[{q:`Czy przenosicie treści i zdjęcia ze starej strony?`,a:`Tak. Przenoszę to, co działa, resztę przepisujemy — zwykle okazuje się, że najlepsze zdjęcia leżały poza stroną.`},{q:`Ile trwa wdrożenie?`,a:`Typowa strona pracowni: 2–4 tygodnie od momentu, w którym mam komplet zdjęć i opisów. Sam projekt graficzny widzisz w pierwszym tygodniu.`},{q:`Czy będę mógł sam dodawać realizacje?`,a:`Tak. Dodawanie projektów, zdjęć i opisów odbywa się w panelu, bez znajomości kodu i bez dzwonienia do mnie.`},{q:`Mam zdjęcia tylko z telefonu. To wystarczy?`,a:`Da się z tym pracować i często tak zaczynamy. Ale jedna porządna sesja z gotowego ogrodu zwraca się na stronie szybciej niż cokolwiek innego.`},{q:`Pracujesz tylko w Polsce?`,a:`Nie. Pracuję zdalnie, po polsku i po angielsku — lokalizacja pracowni nie ma znaczenia dla współpracy.`}]}},We=[{id:`name`,label:`Imię`,type:`text`,required:!0},{id:`email`,label:`E-mail`,type:`email`,required:!0},{id:`company`,label:`Pracownia / firma`,type:`text`},{id:`website`,label:`Obecna strona (jeśli jest)`,type:`text`,placeholder:`np. twojapracownia.pl`},{id:`message`,label:`Czego potrzebujesz?`,type:`textarea`,placeholder:`Kilka zdań: czym się zajmujecie i co ma robić nowa strona.`}],Ge={eyebrow:`Kontakt`,heading:`Porozmawiajmy o\xA0stronie Twojej pracowni.`,lead:`Zaprojektuję i\xA0wdrożę stronę, która pokazuje Wasze realizacje tak dobrze, jak wyglądają w\xA0naturze — i\xA0zamienia oglądających w\xA0zapytania. Jedna osoba od projektu po wdrożenie i\xA0opiekę.`,listHeading:`Co może się na niej znaleźć`,bullets:[`Portfolio realizacji — duże zdjęcia, galerie przed i\xA0po, opis każdego projektu`,`Usługi opisane po ludzku: projekt, realizacja, pielęgnacja`,`Formularz zapytania, który od razu zbiera metraż, lokalizację i\xA0budżet`,`Szybka na telefonie i\xA0widoczna w\xA0Google w\xA0Twojej okolicy`],priceLine:`Strony od 2\xA0000 PLN. Wycenę podam po krótkiej rozmowie.`,rows:[{label:`E-mail`,value:r.email,href:`mailto:${r.email}`},...r.calendly?[{label:`Kalendarz`,value:`Umów 20 minut rozmowy`,href:r.calendly,external:!0}]:[],{label:`Portfolio`,value:`marcinbochenek.com`,href:`https://marcinbochenek.com/`}],responseTime:r.responseTime,source:`krajobraz`,formHeading:`Opowiedz o swojej pracowni`,fields:We,buildSubject:e=>`Strona dla pracowni krajobrazu — ${e.company||e.name||`zapytanie`}`,glow:`radial-gradient(70% 42% at 18% 44%, rgba(40, 66, 30, 0.3), transparent 100%), var(--moss-950)`},Ke=15e3,Q=``,qe=``;function Je(e){return e.includes(`web3forms.com`)}function Ye(e,t){return!e||Je(e)&&!t}function Xe({source:e,fields:t,heading:n,submitLabel:i=`Wyślij zapytanie`,buildSubject:a}){let[s,c]=(0,o.useState)(`idle`),[l,u]=(0,o.useState)(``),[d,p]=(0,o.useState)(``);return s===`success`?(0,f.jsxs)(`div`,{"aria-live":`polite`,style:{background:`var(--moss-900)`,borderColor:`rgba(244, 237, 220, 0.14)`},className:`rounded-2xl border p-8 text-center md:p-10`,children:[(0,f.jsx)(`p`,{className:`font-display text-xl font-semibold text-[var(--cream)]`,children:`Dziękuję!`}),(0,f.jsx)(`p`,{className:`mt-2 text-sm text-[var(--cream-dim)]`,children:`Odezwę się — ${r.responseTime.toLowerCase()}.`}),r.calendly&&(0,f.jsx)(`a`,{href:r.calendly,target:`_blank`,rel:`noopener noreferrer`,className:`cta-red mt-6 inline-flex px-6 py-3 text-sm`,children:`Albo od razu umów rozmowę`})]}):(0,f.jsx)(`div`,{style:{background:`var(--moss-900)`,borderColor:`rgba(244, 237, 220, 0.14)`},className:`rounded-2xl border p-6 md:p-8`,children:(0,f.jsxs)(`form`,{onSubmit:async n=>{n.preventDefault();let i=n.currentTarget;u(``);let o=Object.fromEntries(new FormData(i).entries()),s=a(o);if(Ye(Q,qe)){let e=t.map(e=>`${e.label}: ${o[e.id]||`-`}`),n=`mailto:${r.email}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(e.join(`
`))}`;p(n),c(`mailto`),window.location.href=n;return}c(`loading`);let l={subject:s,from_name:o.name||`Zapytanie z /${e}`,...o};Je(Q)&&(l.access_key=qe);let d=new AbortController,f=window.setTimeout(()=>d.abort(),Ke);try{let e=await fetch(Q,{method:`POST`,headers:{"Content-Type":`application/json`,Accept:`application/json`},body:JSON.stringify(l),signal:d.signal});if(!e.ok){let t=await e.json().catch(()=>({}));throw Error(t.message||`HTTP ${e.status}`)}i.reset(),c(`success`)}catch(e){c(`error`),u(e instanceof DOMException&&e.name===`AbortError`?`Formularz nie odpowiada. Napisz proszę bezpośrednio na ${r.email}.`:`Nie udało się wysłać. Napisz proszę bezpośrednio na ${r.email}.`)}finally{window.clearTimeout(f)}},className:`space-y-5`,children:[(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`p`,{className:`font-display text-lg font-semibold text-[var(--cream)]`,children:n}),(0,f.jsx)(`p`,{className:`mt-1 text-sm text-[var(--cream-dim)]`,children:`${r.responseTime}.`})]}),(0,f.jsx)(`input`,{type:`hidden`,name:`source`,value:e}),(0,f.jsx)(`div`,{className:`grid gap-4 md:grid-cols-2`,children:t.map(e=>(0,f.jsxs)(`label`,{className:e.type===`textarea`?`md:col-span-2`:``,children:[(0,f.jsx)(`span`,{className:`eyebrow mb-2 block`,children:e.label}),e.type===`textarea`?(0,f.jsx)(`textarea`,{name:e.id,required:e.required,rows:4,disabled:s===`loading`,placeholder:e.placeholder,className:`field resize-none`}):(0,f.jsx)(`input`,{type:e.type,name:e.id,required:e.required,disabled:s===`loading`,placeholder:e.placeholder,className:`field`})]},e.id))}),(0,f.jsxs)(`div`,{"aria-live":`polite`,children:[s===`mailto`&&(0,f.jsxs)(`p`,{style:{borderColor:`rgba(143, 191, 74, 0.35)`,background:`rgba(143, 191, 74, 0.08)`},className:`rounded-2xl border px-4 py-3 text-sm leading-relaxed text-[var(--cream)]`,children:[`Otworzyłem Twój program pocztowy z\xA0gotową wiadomością — wystarczy ją wysłać. Jeśli się nie otworzył,`,` `,(0,f.jsx)(`a`,{href:d,className:`underline underline-offset-4`,children:`spróbuj ponownie`}),` `,`albo napisz na`,` `,(0,f.jsx)(`a`,{href:`mailto:${r.email}`,className:`underline underline-offset-4`,children:r.email}),`.`]}),s===`error`&&(0,f.jsx)(`p`,{style:{borderColor:`rgba(244, 237, 220, 0.2)`,background:`rgba(244, 237, 220, 0.05)`},className:`rounded-2xl border px-4 py-3 text-sm text-[var(--cream)]`,children:l||`Nie udało się wysłać. Napisz proszę bezpośrednio na ${r.email}.`})]}),(0,f.jsx)(`button`,{type:`submit`,disabled:s===`loading`,className:`cta-red w-full px-6 py-3 text-sm md:w-auto`,children:s===`loading`?`Wysyłam…`:i}),(0,f.jsxs)(`p`,{className:`text-[11px] text-[var(--cream-dim)]`,children:[`Dane z`,` `,`formularza wykorzystam wyłącznie do odpowiedzi na to zapytanie.`]})]})})}var Ze={background:`var(--card-bg)`,borderColor:`var(--card-border)`},$={background:`var(--page-bg)`};function Qe({content:e,marker:t}){let{offer:n,process:r,price:i,faq:a}=e;return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(`section`,{id:`oferta`,style:$,className:`px-5 pt-24 pb-16 md:px-10 md:pt-32 md:pb-20`,children:(0,f.jsxs)(`div`,{className:`mx-auto max-w-6xl`,children:[(0,f.jsx)(`p`,{className:`eyebrow`,children:n.eyebrow}),(0,f.jsx)(`h2`,{className:`mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl`,children:n.heading}),(0,f.jsx)(`div`,{className:`mt-12 grid gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-12`,children:n.blocks.map(e=>(0,f.jsxs)(`div`,{className:`flex gap-4`,children:[t,(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`h3`,{className:`font-display text-lg font-semibold text-[var(--cream)]`,children:e.title}),(0,f.jsx)(`p`,{className:`mt-2 text-sm leading-relaxed text-[var(--cream-dim)]`,children:e.body})]})]},e.title))})]})}),(0,f.jsx)(`section`,{id:`proces`,style:$,className:`px-5 py-16 md:px-10 md:py-20`,children:(0,f.jsxs)(`div`,{className:`mx-auto max-w-6xl`,children:[(0,f.jsx)(`div`,{className:`hairline`}),(0,f.jsxs)(`div`,{className:`mt-16 md:mt-20`,children:[(0,f.jsx)(`p`,{className:`eyebrow`,children:r.eyebrow}),(0,f.jsx)(`h2`,{className:`mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl`,children:r.heading}),(0,f.jsx)(`div`,{className:`mt-12 grid gap-10 md:grid-cols-3 md:gap-8`,children:r.steps.map(e=>(0,f.jsxs)(`div`,{className:`flex gap-4`,children:[(0,f.jsx)(`span`,{"aria-hidden":!0,className:`offer-step-num`,children:e.number}),(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`h3`,{className:`font-display text-lg font-semibold text-[var(--cream)]`,children:e.title}),(0,f.jsx)(`p`,{className:`mt-2 text-sm leading-relaxed text-[var(--cream-dim)]`,children:e.body})]})]},e.title))})]})]})}),(0,f.jsx)(`section`,{id:`inwestycja`,style:$,className:`px-5 py-16 md:px-10 md:py-20`,children:(0,f.jsxs)(`div`,{className:`mx-auto max-w-6xl`,children:[(0,f.jsx)(`div`,{className:`hairline`}),(0,f.jsxs)(`div`,{className:`mt-16 md:mt-20`,children:[(0,f.jsx)(`p`,{className:`eyebrow`,children:i.eyebrow}),(0,f.jsx)(`h2`,{className:`mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl`,children:i.heading}),(0,f.jsx)(`p`,{className:`mt-6 max-w-[52ch] text-[15px] leading-relaxed text-[var(--cream-dim)]`,children:i.lead}),(0,f.jsx)(`div`,{style:Ze,className:`mt-8 rounded-2xl border px-6 md:px-8`,children:i.tiers.map((e,t)=>(0,f.jsxs)(`div`,{children:[t>0&&(0,f.jsx)(`div`,{className:`hairline`}),(0,f.jsxs)(`div`,{className:`price-ladder-row`,children:[(0,f.jsxs)(`div`,{className:`price-ladder-heading`,children:[(0,f.jsx)(`span`,{className:`price-ladder-name`,children:e.name}),(0,f.jsx)(`span`,{className:`price-ladder-value`,children:e.price})]}),(0,f.jsx)(`p`,{className:`price-ladder-desc`,children:e.desc})]})]},e.name))})]})]})}),(0,f.jsx)(`section`,{id:`faq`,style:$,className:`px-5 pt-16 pb-24 md:px-10 md:pt-20 md:pb-32`,children:(0,f.jsxs)(`div`,{className:`mx-auto max-w-6xl`,children:[(0,f.jsx)(`div`,{className:`hairline`}),(0,f.jsxs)(`div`,{className:`mt-16 md:mt-20`,children:[(0,f.jsx)(`p`,{className:`eyebrow`,children:a.eyebrow}),(0,f.jsx)(`h2`,{className:`mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl`,children:a.heading}),(0,f.jsx)(`div`,{style:Ze,className:`mt-8 rounded-2xl border`,children:a.items.map((e,t)=>(0,f.jsxs)(`div`,{children:[t>0&&(0,f.jsx)(`div`,{className:`hairline`}),(0,f.jsxs)(`details`,{className:`group px-6 py-6 md:px-8`,children:[(0,f.jsxs)(`summary`,{className:`flex cursor-pointer list-none items-center justify-between gap-6`,children:[(0,f.jsx)(`span`,{className:`font-display text-base font-semibold text-[var(--cream)] md:text-lg`,children:e.q}),(0,f.jsx)(`span`,{"aria-hidden":!0,className:`relative shrink-0 text-2xl font-light text-[var(--accent-mark)] transition-transform duration-300 group-open:rotate-45`,children:`+`})]}),(0,f.jsx)(`p`,{className:`mt-4 max-w-2xl text-sm leading-relaxed text-[var(--cream-dim)]`,children:e.a})]})]},e.q))})]})]})})]})}function $e({content:e,marker:t}){return(0,f.jsx)(`section`,{id:`kontakt`,style:{background:e.glow},className:`px-5 py-24 md:px-10 md:py-32`,children:(0,f.jsxs)(`div`,{className:`mx-auto grid max-w-6xl gap-16 lg:grid-cols-2 lg:gap-20`,children:[(0,f.jsxs)(`div`,{children:[(0,f.jsx)(`p`,{className:`eyebrow`,children:e.eyebrow}),(0,f.jsx)(`h2`,{className:`mt-4 text-3xl font-semibold text-[var(--cream)] md:text-4xl`,children:e.heading}),(0,f.jsx)(`p`,{className:`mt-6 max-w-[52ch] text-[15px] leading-relaxed text-[var(--cream-dim)]`,children:e.lead}),(0,f.jsxs)(`div`,{className:`mt-10`,children:[(0,f.jsx)(`p`,{className:`eyebrow`,children:e.listHeading}),(0,f.jsx)(`ul`,{className:`mt-4 space-y-3`,children:e.bullets.map(e=>(0,f.jsxs)(`li`,{className:`flex items-start gap-3 text-sm leading-relaxed text-[var(--cream)]`,children:[t,(0,f.jsx)(`span`,{children:e})]},e))})]}),(0,f.jsx)(`p`,{className:`mt-8 text-sm text-[var(--cream-dim)]`,children:e.priceLine}),(0,f.jsxs)(`div`,{className:`mt-10`,children:[(0,f.jsx)(`div`,{className:`hairline`}),e.rows.map(e=>(0,f.jsxs)(`div`,{children:[(0,f.jsxs)(`a`,{href:e.href,...e.external?{target:`_blank`,rel:`noopener noreferrer`}:{},className:`group flex items-center justify-between gap-4 py-4`,children:[(0,f.jsx)(`span`,{className:`eyebrow`,children:e.label}),(0,f.jsx)(`span`,{className:`text-sm text-[var(--cream)] transition-transform group-hover:translate-x-1`,children:e.value})]}),(0,f.jsx)(`div`,{className:`hairline`})]},e.label)),(0,f.jsx)(`p`,{className:`mt-4 text-sm text-[var(--cream-dim)]`,children:e.responseTime})]})]}),(0,f.jsx)(Xe,{source:e.source,fields:e.fields,heading:e.formHeading,buildSubject:e.buildSubject})]})})}function et(){return(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)(`main`,{children:[(0,f.jsx)(Be,{}),(0,f.jsx)(Qe,{content:Ue,marker:(0,f.jsx)(He,{})}),(0,f.jsx)($e,{content:Ge,marker:(0,f.jsx)(He,{})})]}),(0,f.jsx)(Ve,{})]})}(0,s.createRoot)(document.getElementById(`root`)).render((0,f.jsx)(o.StrictMode,{children:(0,f.jsx)(et,{})}));