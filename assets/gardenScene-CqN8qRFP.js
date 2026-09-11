const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/three-8V8V_zZj.js","assets/rolldown-runtime-QTnfLwEv.js"])))=>i.map(i=>d[i]);
import{n as e}from"./react-spline-CLS9LA80.js";import{n as t,t as n}from"./krajobraz-5UO7aIba.js";var r={petal:`#fbf6ea`,centre:`#f0b429`,petals:13,round:.35},i={petal:`#ffe27e`,centre:`#d9822b`,petals:9,round:.6},a={petal:`#ffc4d2`,centre:`#f5c93b`,petals:6,round:1.4},o={petal:`#ee2e1c`,centre:`#ffd23f`,petals:5,round:1.6},s={petal:`#ff5b3d`,centre:`#ffd65a`,petals:5,round:1.3},c=[[`Zbuduję dla Ciebie`,`nową stronę`],[`Zbuduję dla`,`Ciebie nową`,`stronę`],[`Zbuduję`,`dla Ciebie`,`nową`,`stronę`],[`Zbuduję`,`dla`,`Ciebie`,`nową`,`stronę`]],l=900,u=.96,d=.02,f=.05,p=7;function m(e){let t=ee(e.seed??20260911),n=t=>`${l} ${t}px ${e.fontFamily}`,m=document.createElement(`canvas`).getContext(`2d`);m.font=n(100);let g=e=>Math.max(0,e.length-1)*d*100,_={lines:c[0],em:0};for(let t of c){let n=Math.max(...t.map(e=>m.measureText(e).width+g(e)))/100,r=t.length*u*e.stretch,i=Math.min(e.width/n,e.depth/r);i>_.em&&(_={lines:t,em:i})}let{lines:v,em:y}=_,b=y*f,te=t=>e.width*e.depth*.34/(t*t*.866);for(;te(b)>e.maxCount*1.15;)b*=1.06;let x=p/b,S=y*x,ne=e.width*x,C=S*u,w=v.length*C,T=document.createElement(`canvas`);T.width=Math.ceil(ne+S),T.height=Math.ceil(w+S);let E=T.getContext(`2d`,{willReadFrequently:!0});E.fillStyle=`#000`,E.fillRect(0,0,T.width,T.height),E.fillStyle=`#fff`,E.font=n(S),E.textBaseline=`alphabetic`,E.textAlign=`left`;let D=[];v.forEach((e,t)=>{let n=[...e],r=n.map(e=>E.measureText(e).width),i=r.reduce((e,t)=>e+t,0)+(n.length-1)*d*S,a=(T.width-i)/2,o=(T.height-w)/2+t*C+S*.8;D.push({left:a,right:a+i,top:o-S*.78,bottom:o+S*.22}),n.forEach((e,t)=>{E.fillText(e,a,o),a+=r[t]+d*S})});let re=E.getImageData(0,0,T.width,T.height).data,O=(e,t)=>{let n=Math.round(e),r=Math.round(t);return n<0||r<0||n>=T.width||r>=T.height?0:re[(r*T.width+n)*4]/255},ie=e=>(e-T.width/2)/x,ae=t=>(t-T.height/2)/x*e.stretch+e.centreZ,k=[],A=b*x,j=A*.866,M=Array.from({length:8},(e,t)=>{let n=t/8*Math.PI*2;return[Math.cos(n)*A*1.02,Math.sin(n)*A*1.02]}),N=Math.min(...D.map(e=>e.left)),P=Math.max(...D.map(e=>e.right));for(let e=0,n=j/2;n<T.height;e++,n+=j){let r=e%2?A/2:0;for(let e=r;e<T.width;e+=A){let r=e+(t()-.5)*A*.36,i=n+(t()-.5)*A*.36;if(O(r,i)<.5)continue;let a=!1;for(let[e,t]of M)if(O(r+e,i+t)<.5){a=!0;break}let o=0;for(let e=0;e<D.length;e++)i>=D[e].top-j&&i<=D[e].bottom+j&&(o=e);k.push({x:ie(r),z:ae(i),edge:a,line:o,nx:(r-N)/Math.max(1,P-N)})}}let F=Math.round(e.maxCount*1.2),I=k;if(k.length>F){let e=k.map((e,t)=>t);for(let n=0;n<F;n++){let r=n+Math.floor(t()*(e.length-n));[e[n],e[r]]=[e[r],e[n]]}I=e.slice(0,F).sort((e,t)=>e-t).map(e=>k[e])}let L=I.length,R={count:L,pos:new Float32Array(L*3),size:new Float32Array(L),petal:new Float32Array(L*3),centre:new Float32Array(L*3),shape:new Float32Array(L*2),birth:new Float32Array(L),seed:new Float32Array(L),lines:v,em:y,pitch:b},z=Math.max(1,v.length-1);for(let n=0;n<L;n++){let c=I[n],l=t(),u=c.edge?l<.72?o:s:l<.58?r:l<.85?i:a,d=.94+t()*.1,f=h(u.petal),p=h(u.centre);R.pos[n*3]=c.x,R.pos[n*3+1]=c.z,R.pos[n*3+2]=b*(.9+t()*.7),R.size[n]=b*(c.edge?1.6:1.85)*(.9+t()*.22),R.petal.set([f[0]*d,f[1]*d,f[2]*d],n*3),R.centre.set(p,n*3),R.shape[n*2]=u.petals,R.shape[n*2+1]=u.round;let m=c.nx*.82+c.line/z*.12+t()*.06;R.birth[n]=e.timeline.start+e.timeline.sweep*m+(c.edge?0:e.timeline.edgeLead),R.seed[n]=t()}return R}function h(e){let t=parseInt(e.slice(1),16),n=e=>(e/255)**2.2;return[n(t>>16&255),n(t>>8&255),n(t&255)]}function ee(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var g=`
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
varying vec3 vWorld;
void main() {
  vec4 w = modelMatrix * vec4(position, 1.0);
  vWorld = w.xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,y=`
${g}
${_}
varying vec3 vWorld;

void main() {
  vec2 p = vWorld.xz;
  vec2 warp = p + 0.3 * vec2(fbm3(p * 0.8), fbm3(p * 0.8 + 5.3));
  // Rounded lumps, not cells: distance to the nearest seed makes a dome,
  // where F2 − F1 would have made plates with cracks between them — dried
  // mud, which is the opposite of a bed that has just been dug over.
  vec3 v1 = voronoi(warp * 3.4);
  float clod = (1.0 - smoothstep(0.0, 0.62, v1.x)) * (0.6 + 0.4 * v1.z);
  vec3 v2 = voronoi(warp * 9.0 + 3.1);
  float crumb = (1.0 - smoothstep(0.0, 0.55, v2.x)) * (0.5 + 0.5 * v2.z);
  float billow = 1.0 - abs(2.0 * fbm3(p * 1.6 + 2.0) - 1.0);
  // A few small stones, not a scatter of hail.
  vec3 v3 = voronoi(p * 2.6 + 11.0);
  float pebR = 0.08 + 0.07 * fract(v3.z * 17.0);
  float pebble = step(0.94, v3.z) * (1.0 - smoothstep(pebR - 0.025, pebR, v3.x));
  // Rake lines across the bed, wandering a little.
  float furrow = sin(p.y * 6.5 + fbm3(p * 0.9) * 2.4) * 0.5 + 0.5;

  float h = clod * 0.45 + crumb * 0.3 + billow * 0.15 + furrow * 0.12 + pebble * 0.35;

  vec3 dpx = dFdx(vWorld);
  vec3 dpy = dFdy(vWorld);
  float dhx = dFdx(h);
  float dhy = dFdy(h);
  float det = dpx.x * dpy.z - dpx.z * dpy.x;
  vec2 g = abs(det) > 1e-9 ? vec2(dhx * dpy.z - dhy * dpx.z, dpx.x * dhy - dpy.x * dhx) / det : vec2(0.0);
  vec3 n = normalize(vec3(-g.x * 0.075, 1.0, -g.y * 0.075));

  vec3 dark = vec3(0.02, 0.01, 0.0045);
  vec3 mid = vec3(0.058, 0.029, 0.013);
  vec3 dry = vec3(0.13, 0.078, 0.04);
  vec3 rust = vec3(0.085, 0.034, 0.014);
  float m = fbm(p * 0.33);
  vec3 c = mix(dark, mid, smoothstep(0.1, 0.62, h));
  c = mix(c, dry, smoothstep(0.52, 0.95, h) * (0.3 + 0.7 * m));
  c = mix(c, rust, 0.28 * smoothstep(0.45, 0.75, fbm3(p * 1.3 + 7.0)));
  // Damp patches.
  c *= mix(0.66, 1.0, smoothstep(0.3, 0.62, fbm3(p * 0.5 + 2.0)));
  // Grain.
  c *= 0.86 + 0.28 * hash12(floor(p * 120.0));
  vec3 peb = mix(vec3(0.1, 0.085, 0.065), vec3(0.26, 0.22, 0.17), fract(v3.z * 31.0));
  c = mix(c, peb, pebble);

  float ndl = max(dot(n, uSun), 0.0);
  float cavity = mix(0.5, 1.0, smoothstep(0.05, 0.55, h));
  vec3 lit = c * (uSky * 0.7 + uSunCol * ndl * 1.25) * cavity;
  lit += uSunCol * pebble * pow(max(dot(reflect(-uSun, n), vec3(0.0, 0.9, 0.44)), 0.0), 12.0) * 0.12;
  gl_FragColor = vec4(finish(lit), 1.0);
}
`,b=`
${g}
attribute float aLayer;
uniform float uBase;
uniform float uHeight;
uniform float uTime;
varying vec3 vWorld;
varying float vLayer;
varying float vGust;
varying float vPatch;
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
  gl_Position = projectionMatrix * viewMatrix * w;
}
`,te=`
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

void main() {
  vec2 p = vWorld.xz;
  float fi = floor((p.x - uX0) / uW);
  int si = int(clamp(fi, 0.0, float(uN - 1)));
  float laid = uZc[si] - p.y;

  float h = vLayer;
  // Freshly laid turf is pressed flat by the roll and stands up behind it.
  float stand = smoothstep(0.0, 1.15, laid);
  float gust = vGust;
  vec2 lean = vec2(0.26, -0.36) + vec2(0.95, 0.35) * (gust - 0.45);

  vec2 uv = p * uDensity + lean * h * h * 2.4 * stand;
  // Derivatives before any discard: they are undefined once a quad diverges.
  float fw = fwidth(uv.x) * 0.85 + 0.015;
  if (laid < 0.0) discard;
  vec2 cell = floor(uv);
  vec2 f = fract(uv) - 0.5;
  float r1 = hash12(cell);
  vec2 jit = (hash22(cell + 17.0) - 0.5) * 0.44;
  float bladeH = mix(0.5, 1.0, r1) * mix(0.16, 1.0, stand);
  float t = h / bladeH;

  float cover = 1.0;
  if (h > 0.001) {
    if (t > 1.0) discard;
    float rad = mix(0.47, 0.07, t);
    float d = length(f - jit);
    cover = 1.0 - smoothstep(rad - fw, rad + fw, d);
    if (cover < 0.02) discard;
  }

  float tt = h > 0.001 ? t : 0.32;
  vec3 root = vec3(0.01, 0.024, 0.006);
  vec3 mid = vec3(0.032, 0.115, 0.02);
  vec3 tip = vec3(0.17, 0.39, 0.065);
  vec3 c = mix(root, mid, smoothstep(0.0, 0.55, tt));
  c = mix(c, tip, smoothstep(0.42, 1.0, tt));
  c *= 0.78 + 0.44 * hash12(cell + 3.7);
  c = mix(c, vec3(0.33, 0.34, 0.075), step(0.955, hash12(cell + 9.1)) * tt * 0.75);
  c *= uShade[si];
  c *= 0.84 + 0.3 * vPatch;

  float ao = mix(0.32, 1.0, smoothstep(0.0, 0.85, h));
  vec3 lit = c * (uSky * 0.6 + uSunCol * (0.5 + 0.5 * tt)) * ao;
  // A gust lays the blades over and the lawn catches the sun in a wave.
  lit += uSunCol * c * smoothstep(0.42, 0.8, gust) * tt * tt * 0.85;
  lit *= mix(0.55, 1.0, stand);

  // Joints between strips: bare soil in a thin line, closing as it knits.
  float u = (p.x - uX0) / uW;
  float edge = min(fract(u), 1.0 - fract(u)) * uW;
  float open = 1.0 - uKnit;
  float seam = (1.0 - smoothstep(0.0, 0.03 * open + 1e-4, edge)) * (1.0 - smoothstep(0.0, 0.35, h));
  lit = mix(lit, vec3(0.02, 0.011, 0.006), seam * open);

  gl_FragColor = vec4(finish(lit), cover);
}
`,x=`
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
`,S=`
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
`,ne=`
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
`,C=`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`,w=`
uniform float uOpacity;
varying vec2 vUv;
void main() {
  vec2 d = (vUv - 0.5) * 2.0;
  float r = length(d);
  float a = (1.0 - smoothstep(0.15, 1.0, r)) * uOpacity;
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}
`,T=`
uniform float uP;
uniform float uGrow;
uniform float uTime;
uniform float uWind;
uniform float uGrassTop;
attribute vec3 aPos;
attribute float aSize;
attribute vec3 aPetal;
attribute vec3 aCentre;
attribute vec2 aShape;
attribute float aBirth;
attribute float aSeed;

float growth() {
  return clamp((uP - aBirth) / uGrow, 0.0, 1.0);
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
`,E=`
${T}
varying vec2 vUv;
varying float vOpen;
varying float vSprout;
varying vec3 vPetal;
varying vec3 vCentre;
varying vec2 vShape;
varying float vSeed;
void main() {
  float g = growth();
  float sprout = smoothstep(0.0, 0.42, g);
  float open = smoothstep(0.34, 1.0, g);
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
`,D=`
${g}
${_}
varying vec2 vUv;
varying float vOpen;
varying float vSprout;
varying vec3 vPetal;
varying vec3 vCentre;
varying vec2 vShape;
varying float vSeed;
void main() {
  vec2 p = (vUv - 0.5) * 2.0;
  float r = length(p);
  float a = atan(p.y, p.x);

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

  float k = pow(abs(cos(a * vShape.x * 0.5)), vShape.y);
  float pr = mix(0.42, 0.76, k) * vOpen;
  float petal = 1.0 - smoothstep(pr - 0.07, pr + 0.01, r);
  float budR = 0.28 * vSprout * (1.0 - vOpen);
  float bud = 1.0 - smoothstep(budR - 0.06, budR, r);
  float cr = (vShape.x > 8.0 ? 0.24 : 0.15) * vOpen;
  float centre = 1.0 - smoothstep(cr - 0.05, cr, r);

  float alpha = max(max(leaf, petal), bud);
  if (alpha < 0.02) discard;

  // Fresh growth: a shade lighter than the lawn, so a sprout is visible as
  // a sprout before it has a flower to show.
  vec3 leafC = mix(vec3(0.022, 0.075, 0.012), vec3(0.075, 0.2, 0.035), leafT);
  vec3 pc = vPetal * mix(0.55, 1.0, smoothstep(0.05, 0.6, r / max(pr, 1e-3)));
  pc *= mix(0.78, 1.0, k);
  vec3 budC = mix(vec3(0.04, 0.12, 0.02), vPetal * 0.75, smoothstep(0.5, 1.0, vSprout) * 0.6);
  vec3 c = leafC;
  c = mix(c, budC, bud);
  c = mix(c, pc, petal);
  c = mix(c, vCentre * (0.65 + 0.35 * vnoise(p * 16.0 + vSeed * 40.0)), centre);
  vec3 lit = c * (uSky * 0.5 + uSunCol * 0.92);
  gl_FragColor = vec4(finish(lit), alpha);
}
`,re=`
${T}
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
`,O=`
${g}
${_}
varying float vT;
void main() {
  vec3 c = mix(vec3(0.02, 0.06, 0.01), vec3(0.07, 0.2, 0.035), vT);
  gl_FragColor = vec4(finish(c * (uSky * 0.6 + uSunCol * 0.8)), 1.0);
}
`,ie=`
${T}
uniform vec2 uShadowDir;
varying vec2 vUv;
varying float vA;
void main() {
  float g = growth();
  float sprout = smoothstep(0.0, 0.42, g);
  float open = smoothstep(0.34, 1.0, g);
  float height = stemTop(sprout);
  float s = aSize * mix(0.3, 0.95, open) * step(1e-4, g);
  vec2 off = uShadowDir * height;
  vec3 world = vec3(aPos.x + off.x + position.x * s, uGrassTop + 0.006, aPos.y + off.y - position.y * s);
  vUv = uv;
  vA = sprout;
  gl_Position = projectionMatrix * viewMatrix * vec4(world, 1.0);
}
`,ae=`
varying vec2 vUv;
varying float vA;
void main() {
  float r = length((vUv - 0.5) * 2.0);
  float a = (1.0 - smoothstep(0.25, 1.0, r)) * 0.42 * vA;
  gl_FragColor = vec4(0.0, 0.0, 0.0, a);
}
`,k=Math.PI/180,A=24*k,j=36,M=8,N=.16,P=.018,F=V([-.5,.74,-.45]),I=[1.45,1.12,.78],L=[.36,.42,.55],R=`"Hanken Grotesk", system-ui, sans-serif`;async function z(r,i){let a=await e(()=>import(`./three-8V8V_zZj.js`).then(e=>e.d),__vite__mapDeps([0,1]));await Promise.race([document.fonts?.load(`900 64px "Hanken Grotesk"`,`Zbudujęąó`).catch(()=>void 0),new Promise(e=>setTimeout(e,2500))]);let o=new a.WebGLRenderer({canvas:r,antialias:!0,alpha:!1,powerPreference:`high-performance`});o.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5)),o.setClearColor(1182728,1);let s=new a.Scene,c=new a.PerspectiveCamera(j,1,.1,120),l={uSun:{value:new a.Vector3(...F)},uSunCol:{value:new a.Vector3(...I)},uSky:{value:new a.Vector3(...L)}},u={time:0},d=i.coarse?10:14,f=null,p=0,h=0;function ee(e){let t=Math.max(5.6,Math.min(14.5,7.8*e))/(2*Math.tan(j*k/2)*e);c.aspect=e,c.position.set(0,t*Math.cos(A),t*Math.sin(A)),c.up.set(0,1,0),c.lookAt(0,0,0),c.updateProjectionMatrix(),c.updateMatrixWorld(!0);let n=(e,t)=>{let n=new a.Vector3(e,t,.5).unproject(c).sub(c.position).normalize(),r=-c.position.y/n.y;return c.position.clone().addScaledVector(n,r)},r=n(-1,1),i=n(-1,-1);return{zFar:r.z,zNear:i.z,halfFar:Math.abs(r.x),halfNear:Math.abs(i.x),halfAt(e){let t=(e-r.z)/(i.z-r.z);return Math.abs(r.x)+(Math.abs(i.x)-Math.abs(r.x))*t}}}function g(e){let t=ee(e),r=[],o=new a.Group,u=oe(911),f=t.zNear-t.zFar,p=2*Math.max(t.halfFar,t.halfNear)+.8,h=Math.min(M,Math.max(3,Math.round(p/2.4))),g=p/h,_=-p/2,T=Math.min(.7,g*.27),k=.035,j=t.zFar-1.2,I=t.zNear+T+.9,L=Array.from({length:h},(e,t)=>t/Math.max(1,h-1));for(let e=L.length-1;e>0;e--){let t=Math.floor(u()*(e+1));[L[e],L[t]]=[L[t],L[e]]}let z=Array.from({length:h},(e,r)=>{let i=t.zFar+f*.3+(u()-.5)*.45,a=I-i;return{x:_+(r+.5)*g,len:g*.985,zInit:i,total:a,tau:Math.PI*(T*T-k*k)/a,startAt:n.rollStart+n.rollStagger*L[r],shade:(r%2?.8:1)*(.97+u()*.06)}});{let e=new a.PlaneGeometry(p+6,f+8).rotateX(-Math.PI/2);e.translate(0,0,(t.zFar+t.zNear)/2);let n=new a.ShaderMaterial({vertexShader:v,fragmentShader:y,uniforms:{...l}}),i=new a.Mesh(e,n);i.renderOrder=1,o.add(i),r.push(e,n)}let B=new a.ShaderMaterial({vertexShader:b,fragmentShader:te,uniforms:{...l,uBase:{value:P},uHeight:{value:N},uX0:{value:_},uW:{value:g},uN:{value:h},uZc:{value:Array(M).fill(j)},uShade:{value:Array.from({length:M},(e,t)=>z[t]?.shade??1)},uDensity:{value:i.coarse?26:30},uTime:{value:0},uKnit:{value:0}},alphaToCoverage:!0});{let e=new a.PlaneGeometry(p,I-j,40,60).rotateX(-Math.PI/2);e.translate(0,0,(j+I)/2);let t=new a.InstancedBufferGeometry;t.index=e.index,t.setAttribute(`position`,e.getAttribute(`position`));let n=new Float32Array(d);for(let e=0;e<d;e++)n[e]=e/(d-1);t.setAttribute(`aLayer`,new a.InstancedBufferAttribute(n,1)),t.instanceCount=d;let i=new a.Mesh(t,B);i.frustumCulled=!1,i.renderOrder=0,o.add(i),r.push(e,t,B)}let V=new a.CylinderGeometry(1,1,1,72,1,!0).rotateZ(Math.PI/2),H=new a.CircleGeometry(1,72).rotateY(Math.PI/2).translate(.5,0,0),U=new a.CircleGeometry(1,72).rotateY(-Math.PI/2).translate(-.5,0,0),W=new a.PlaneGeometry(1,1).rotateX(-Math.PI/2);r.push(V,H,U,W);let G=z.map(e=>{let t=new a.Group,n=new a.ShaderMaterial({vertexShader:x,fragmentShader:S,uniforms:{...l,uR0:{value:T},uR:{value:T},uLen:{value:e.len}}}),i=[1,-1].map(t=>new a.ShaderMaterial({vertexShader:x,fragmentShader:ne,uniforms:{...l,uR:{value:T},uTau:{value:e.tau},uCore:{value:k},uCapLight:{value:Math.max(.12,F[0]*t)*1.1}}})),s=new a.Mesh(V,n),c=new a.Mesh(H,i[0]),u=new a.Mesh(U,i[1]);for(let e of[s,c,u])e.renderOrder=3;t.add(s,c,u),o.add(t);let d=new a.ShaderMaterial({vertexShader:C,fragmentShader:w,uniforms:{uOpacity:{value:.6}},transparent:!0,depthWrite:!1}),f=new a.Mesh(W,d);return f.renderOrder=2,o.add(f),r.push(n,...i,d),{group:t,body:n,caps:i,shadow:f,shadowMat:d}}),K=f*.6,q=t.zFar+f*.46,J=m({width:2*t.halfAt(q+K/2)*.86,depth:K,centreZ:q,stretch:1/Math.cos(A),maxCount:i.coarse?4800:7500,fontFamily:R,timeline:{start:n.flowerStart,sweep:n.flowerSweep,edgeLead:n.edgeLead}}),Y=new a.PlaneGeometry(1,1),X=new a.InstancedBufferGeometry;X.index=Y.index,X.setAttribute(`position`,Y.getAttribute(`position`)),X.setAttribute(`uv`,Y.getAttribute(`uv`)),X.setAttribute(`aPos`,new a.InstancedBufferAttribute(J.pos,3)),X.setAttribute(`aSize`,new a.InstancedBufferAttribute(J.size,1)),X.setAttribute(`aPetal`,new a.InstancedBufferAttribute(J.petal,3)),X.setAttribute(`aCentre`,new a.InstancedBufferAttribute(J.centre,3)),X.setAttribute(`aShape`,new a.InstancedBufferAttribute(J.shape,2)),X.setAttribute(`aBirth`,new a.InstancedBufferAttribute(J.birth,1)),X.setAttribute(`aSeed`,new a.InstancedBufferAttribute(J.seed,1)),X.instanceCount=J.count,r.push(Y,X);let Z={uP:{value:0},uGrow:{value:n.flowerGrow},uTime:{value:0},uWind:{value:i.reduced?0:.09},uGrassTop:{value:.178}},Q=new a.ShaderMaterial({vertexShader:ie,fragmentShader:ae,uniforms:{...Z,uShadowDir:{value:new a.Vector2(-F[0]/F[1],-F[2]/F[1])}},transparent:!0,depthWrite:!1}),$=new a.Vector3().setFromMatrixColumn(c.matrixWorld,0);$.y=0,$.normalize();let se=new a.ShaderMaterial({vertexShader:re,fragmentShader:O,uniforms:{...Z,...l,uCamRight:{value:$},uStemW:{value:.011}},side:a.DoubleSide}),ce=new a.ShaderMaterial({vertexShader:E,fragmentShader:D,uniforms:{...Z,...l},side:a.DoubleSide,alphaToCoverage:!0});return[Q,se,ce].forEach((e,t)=>{let n=new a.Mesh(X,e);n.frustumCulled=!1,n.renderOrder=4+t,o.add(n),r.push(e)}),s.add(o),{group:o,strips:z,r0:T,core:k,rolls:G,grass:B,flowerMats:[Q,se,ce],field:J,disposables:r}}function _(e){s.remove(e.group);for(let t of e.disposables)t.dispose()}function T(e){let r=f;if(!r)return;let i=r.grass.uniforms.uZc.value;r.strips.forEach((a,o)=>{let s=t((e-a.startAt)/n.rollSpan),c=a.zInit+a.total*s,l=c-a.zInit,u=Math.sqrt(Math.max(r.core*r.core,r.r0*r.r0-a.tau*l/Math.PI)),d=2*Math.PI/a.tau*(r.r0-u);i[o]=c;let f=r.rolls[o],p=s<.999;if(f.group.visible=p,f.shadow.visible=p,p){f.group.position.set(a.x,u+P*.5,c),f.group.scale.set(a.len,u,u),f.group.rotation.set(d,0,0),f.body.uniforms.uR.value=u;for(let e of f.caps)e.uniforms.uR.value=u;f.shadow.position.set(a.x+u*.25,.188,c+u*.55),f.shadow.scale.set(a.len*1.06,1,u*2.9),f.shadowMat.uniforms.uOpacity.value=.62*Math.sqrt(u/r.r0)}}),r.grass.uniforms.uKnit.value=B(n.knit[0],n.knit[1],e),r.grass.uniforms.uTime.value=u.time;for(let t of r.flowerMats)t.uniforms.uP.value=e,t.uniforms.uTime.value=u.time}function z(){let e=r.parentElement??r,t=Math.max(1,e.clientWidth),n=Math.max(1,e.clientHeight);o.setSize(t,n,!1);let i=t/n;!f||Math.abs(i/p-1)>.04||Math.abs(t/h-1)>.04?(f&&_(f),f=g(i),p=i,h=t):ee(i),T(H),W=!0}let V=+!!i.reduced,H=V,U=!0,W=!0,G=0,K=performance.now(),q=0,J=!1,Y=()=>{o.render(s,c),W=!1},X=e=>{G=requestAnimationFrame(X);let t=Math.min(.05,(e-K)/1e3);K=e;let n=V-H;H=Math.abs(n)<1e-4?V:H+n*(1-Math.exp(-t*7)),q=Math.abs(n)<1e-4?q+t:0,!(q>1.5&&(J=!J,J))&&(u.time+=t,T(H),Y())},Z=()=>{G||i.reduced||(K=performance.now(),G=requestAnimationFrame(X))},Q=()=>{cancelAnimationFrame(G),G=0},$=()=>{document.hidden?Q():U&&Z()};return document.addEventListener(`visibilitychange`,$),z(),T(H),Y(),Z(),{setProgress(e){V=i.reduced?1:Math.min(1,Math.max(0,e)),i.reduced&&W&&Y()},resize(){z(),G||Y()},setVisible(e){U=e,e&&!document.hidden?Z():Q()},dispose(){Q(),document.removeEventListener(`visibilitychange`,$),f&&_(f),f=null,o.dispose()},debug:{jump(e,t){V=H=e,t!==void 0&&(u.time=t),T(e),Y()},info(){return{strips:f?.strips.length,flowers:f?.field.count,lines:f?.field.lines,em:f?.field.em,pitch:f?.field.pitch,shells:d,pixelRatio:o.getPixelRatio(),progress:H}}}}}function B(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function V(e){let t=Math.hypot(e[0],e[1],e[2]);return[e[0]/t,e[1]/t,e[2]/t]}function oe(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}export{z as createGardenScene};