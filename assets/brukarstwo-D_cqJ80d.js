import{n as e,r as t,t as n}from"./jsx-runtime-i9uBjpvk.js";import{c as r,l as i}from"./content-CeKOOgdU.js";import{c as a,f as o,i as s,l as c,m as l,n as u,p as d,r as f,s as p,t as m}from"./Sections-DCQoIosB.js";var h=t(),g=e(),_=Math.PI/180,v=Math.SQRT1_2,y=.4,b=.56,x=.012;function ee(e){let t=e?b:y,n=t+x,r=2*n;return{shortBody:t,wp:n,lp:r,longBody:r-x}}var S=.16,C=.19,te=.12;function w(e,t){let n=t??(e?C:S);return{settBody:n,pitch:n+x}}function T(e,t){return e*.72/(t+x)}function E(e,t,n){let r=w(n).settBody,i=e*.72/t-x;return Math.max(te,Math.min(r,i))}var D=.026,ne=.02,re=.006,O=.014,ie=S/y,k=.15,ae=.016,A=.014,oe=1.5,j=1.2,M=.24,N=.5,P=`
float easeOutBack(float t) {
  float c1 = 1.70158;
  float c3 = c1 + 1.0;
  float x = t - 1.0;
  return 1.0 + c3 * x * x * x + c1 * x * x;
}
`,F=`
float roundedBoxSDF(vec2 p, vec2 halfSize, float r) {
  vec2 q = abs(p) - halfSize + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}
`,se=`
vec3 concreteShade(float d, vec2 localP, float seed, vec3 world, float accentT, float uTime, float sandT, float chamfer, float bevelDepth, float jointDip) {
#ifndef COARSE
  float speck = voronoi((localP + seed * 71.0) * 14.0).x;
#else
  float speck = 0.5;
#endif

  float edgeT = smoothstep(-chamfer, 0.0, d);
  float hBody = mix(0.0, -bevelDepth, edgeT);
#ifndef COARSE
  hBody += (speck - 0.5) * 0.0015;
#endif
  float jointT = smoothstep(0.0, chamfer, d);
  float hJoint = mix(-bevelDepth, -jointDip, jointT);
  float h = d < 0.0 ? hBody : hJoint;

  vec3 dpx = dFdx(world);
  vec3 dpy = dFdy(world);
  float dhx = dFdx(h);
  float dhy = dFdy(h);
  float det = dpx.x * dpy.z - dpx.z * dpy.x;
  vec2 g = abs(det) > 1e-9 ? vec2(dhx * dpy.z - dhy * dpx.z, dpx.x * dhy - dpy.x * dhx) / det : vec2(0.0);
  vec3 n = normalize(vec3(-g.x * 0.6, 1.0, -g.y * 0.6));

  vec3 lightGrey = vec3(0.34, 0.345, 0.36);
  vec3 basalt = vec3(0.03, 0.028, 0.033);
  vec3 base = mix(lightGrey, basalt, accentT);
  // Per-stone colour variation — pavers come off different pallets.
  base *= mix(0.9, 1.12, fract(seed * 13.0));
  base *= mix(0.92, 1.08, speck);

  vec3 jointRaw = mix(vec3(0.02, 0.019, 0.02), vec3(0.012, 0.011, 0.014), accentT * 0.4);
  // Kiln-dried jointing sand, brushed in after the field is down: warmer and
  // much lighter than the raw gap, and — unlike the paver above it — the
  // same colour whether it sits under a grey field stone or a basalt letter,
  // which is true of the real material.
  vec3 jointSand = vec3(0.15, 0.135, 0.105) * mix(0.92, 1.08, fract(seed * 23.0));
  vec3 jointC = mix(jointRaw, jointSand, sandT);
  vec3 c = d < 0.0 ? base : jointC;

  float ndl = max(dot(n, uSun), 0.0);
  vec3 lit = c * (uSky * 0.55 + uSunCol * ndl * 1.3);
  // The chamfer's own bright catch — the low sun raking across the bevel is
  // what actually reads as "chamfer" at this scale; the analytic normal
  // alone all but disappears once it's through the ACES grade.
  float rim = (1.0 - smoothstep(0.0, chamfer, abs(d))) * step(d, 0.0);
  float glint = 0.97 + 0.03 * sin(uTime * 2.0 + seed * 40.0);
  lit += uSunCol * rim * max(uSun.y, 0.0) * 0.35 * glint;
  // The sweep itself: loose sand catches the sun for the moment the pass is
  // actually over a joint (never over the paver body), brighter than the
  // settled fill on either side of it — this, not the colour swap alone, is
  // what makes the pass read as something moving rather than a hard cut.
  float sweep = (1.0 - smoothstep(0.0, 1.0, abs(sandT - 0.5) * 4.0)) * step(0.0, d);
  lit += uSunCol * sweep * 0.5;
  return lit;
}
`,ce=`
${P}
attribute vec2 aCenter;
attribute float aSign;
attribute float aSeed;
attribute float aBirth;
uniform float uP;
uniform float uLayGrow;
uniform float uRestY;
// (long pitch, short pitch) — the one thing 'coarse' changes about the
// lattice, so it travels as a uniform rather than a baked constant; see
// paverMetrics() on the JS side.
uniform vec2 uPitch;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vSeed;

vec2 rot(vec2 p, float a) {
  float c = cos(a);
  float s = sin(a);
  return vec2(p.x * c - p.y * s, p.x * s + p.y * c);
}

void main() {
  vec2 local = position.xy * uPitch;
  vLocal = local;
  vSeed = aSeed;

  float layT = clamp((uP - aBirth) / uLayGrow, 0.0, 1.0);
  float settle = easeOutBack(layT);
  float y = mix(${k.toFixed(4)}, uRestY + (aSeed - 0.5) * ${A.toFixed(4)}, settle);

  float yaw = aSign * 45.0 * ${_.toFixed(8)} + (fract(aSeed * 17.0) - 0.5) * ${(2*oe*_).toFixed(8)};
  float born = step(aBirth, uP);
  vec2 world2 = aCenter + rot(local, yaw) * born;
  vWorld = vec3(world2.x, y, world2.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`,le=`
${d}
${o}
${F}
${se}
uniform float uX0;
uniform float uX1;
uniform float uZFar;
uniform float uZNear;
uniform float uTime;
uniform float uSandX;
uniform vec2 uBodyHalf;
// The letters' own true outline, as stage/lettering.ts's own rasterised
// mask rather than a re-discretised grid — see the header comment. uHasInk
// lets a scene with no headline at all (opts.letterMask absent) skip the
// lookup instead of needing a valid dummy texture sized just so.
uniform sampler2D uInkTex;
uniform vec2 uInkOrigin;
uniform vec2 uInkExtent;
uniform float uHasInk;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vSeed;

void main() {
  // The cut edge: a straight discard against the field rectangle. For a
  // paver rotated ±45° and straddling that line, this alone produces the
  // triangular cut piece a real herringbone border shows — no extra geometry.
  if (vWorld.x < uX0 || vWorld.x > uX1 || vWorld.z < uZFar || vWorld.z > uZNear) discard;

  if (uHasInk > 0.5) {
    vec2 uv = (vWorld.xz - uInkOrigin) / uInkExtent;
    if (uv.x >= 0.0 && uv.x <= 1.0 && uv.y >= 0.0 && uv.y <= 1.0) {
      // Same straight-discard trick as the outer boundary above, just driven
      // by a texture lookup instead of four numbers: a paver merely
      // straddling a letter's cut edge still gets a clean triangular cut.
      if (texture2D(uInkTex, uv).r > 0.5) discard;
    }
  }

  float d = roundedBoxSDF(vLocal, uBodyHalf - vec2(${D.toFixed(4)}), ${D.toFixed(4)});
  // 0 before the sand-sweep has reached this fragment's world x, 1 after —
  // see createPaverField's sandWindow (JS side) for how uSandX moves over time.
  float sandT = clamp((uSandX - vWorld.x) / ${N.toFixed(3)} + 0.5, 0.0, 1.0);
  vec3 lit = concreteShade(d, vLocal, vSeed, vWorld, 0.0, uTime, sandT, ${ne.toFixed(4)}, ${re.toFixed(4)}, ${O.toFixed(4)});
  gl_FragColor = vec4(finish(lit), 1.0);
}
`,ue=`
${P}
attribute vec2 aCenter;
attribute float aSeed;
attribute float aBirth;
uniform float uP;
uniform float uLayGrow;
uniform float uRestY;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vSeed;

void main() {
  vec2 local = position.xy * vec2(${M.toFixed(4)}, ${j.toFixed(4)});
  vLocal = local;
  vSeed = aSeed;
  float layT = clamp((uP - aBirth) / uLayGrow, 0.0, 1.0);
  float settle = easeOutBack(layT);
  float y = mix(${k.toFixed(4)}, uRestY + (aSeed - 0.5) * ${A.toFixed(4)}, settle);
  float born = step(aBirth, uP);
  vec2 world2 = aCenter + local * born;
  vWorld = vec3(world2.x, y, world2.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`,de=`
${d}
${o}
${F}
${se}
uniform float uZFar;
uniform float uZNear;
uniform float uTime;
uniform float uSandX;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vSeed;

void main() {
  if (vWorld.z < uZFar || vWorld.z > uZNear) discard;
  vec2 bodyHalf = vec2(${(M/2).toFixed(6)}, ${(j/2).toFixed(6)});
  float d = roundedBoxSDF(vLocal, bodyHalf - vec2(${D.toFixed(4)}), ${D.toFixed(4)});
  float sandT = clamp((uSandX - vWorld.x) / ${N.toFixed(3)} + 0.5, 0.0, 1.0);
  vec3 lit = concreteShade(d, vLocal, vSeed, vWorld, 0.0, uTime, sandT, ${ne.toFixed(4)}, ${re.toFixed(4)}, ${O.toFixed(4)});
  gl_FragColor = vec4(finish(lit), 1.0);
}
`,fe=`
${P}
attribute vec2 aCenter;
attribute float aSeed;
attribute float aBirth;
uniform float uP;
uniform float uLayGrow;
uniform float uRestY;
uniform float uPitch;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vSeed;

void main() {
  vec2 local = position.xy * vec2(uPitch, uPitch);
  vLocal = local;
  vSeed = aSeed;

  float layT = clamp((uP - aBirth) / uLayGrow, 0.0, 1.0);
  float settle = easeOutBack(layT);
  float y = mix(${k.toFixed(4)}, uRestY + (aSeed - 0.5) * ${A.toFixed(4)}, settle);

  float born = step(aBirth, uP);
  vec2 world2 = aCenter + local * born;
  vWorld = vec3(world2.x, y, world2.y);
  gl_Position = projectionMatrix * viewMatrix * vec4(vWorld, 1.0);
}
`;function pe(e,t,n,r){return`
${d}
${o}
${F}
${se}
uniform float uTime;
uniform float uSandX;
uniform float uBodyHalf;
uniform sampler2D uInkTex;
uniform vec2 uInkOrigin;
uniform vec2 uInkExtent;
varying vec2 vLocal;
varying vec3 vWorld;
varying float vSeed;

void main() {
  // The mirror image of the field's own cut, against the SAME source canvas
  // (a SEPARATE THREE.CanvasTexture object, though — see letterInkTexture's
  // own comment for why): a sett only shows where the mask says ink, so a
  // sett whose square quad pokes past the true glyph edge doesn't paint
  // over the herringbone that has every right to show through there.
  vec2 uv = (vWorld.xz - uInkOrigin) / uInkExtent;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0 || texture2D(uInkTex, uv).r < 0.5) discard;

  float d = roundedBoxSDF(vLocal, vec2(uBodyHalf - ${e.toFixed(4)}), ${e.toFixed(4)});
  float sandT = clamp((uSandX - vWorld.x) / ${N.toFixed(3)} + 0.5, 0.0, 1.0);
  vec3 lit = concreteShade(d, vLocal, vSeed, vWorld, 1.0, uTime, sandT, ${t.toFixed(4)}, ${n.toFixed(6)}, ${r.toFixed(6)});
  gl_FragColor = vec4(finish(lit), 1.0);
}
`}function me(e,t){let n=he(t.seed??20260912),r=[],i=new e.Group,{x0:a,x1:o,zFar:s,zNear:c,light:l}=t,{wp:u,lp:d,longBody:f,shortBody:p}=ee(t.coarse),{settBody:m,pitch:h}=w(t.coarse,t.settBody),g=ie*(m/(t.coarse?C:S)),_=D*g,y=ne*g,b=re*g,x=O*g,te=!!t.letterMask,T=t.letterMask?.rect??{x0:0,z0:0,x1:0,z1:0},E=t.letterMask?.canvas,k=E?.width??0,A=E?.height??0,oe=E?.getContext(`2d`)?.getImageData(0,0,k,A).data??null,j=Math.max(1e-6,T.x1-T.x0),P=Math.max(1e-6,T.z1-T.z0),F=new Int32Array((k+1)*(A+1));if(oe)for(let e=0;e<A;e++){let t=0;for(let n=0;n<k;n++)t+=+(oe[(e*k+n)*4]>127),F[(e+1)*(k+1)+(n+1)]=F[e*(k+1)+(n+1)]+t}function se(e,t,n,r){if(!oe)return!1;let i=Math.max(0,Math.floor((e-T.x0)/j*k)-1),a=Math.min(k,Math.ceil((n-T.x0)/j*k)+1),o=Math.max(0,Math.floor((t-T.z0)/P*A)-1),s=Math.min(A,Math.ceil((r-T.z0)/P*A)+1);if(a<=i||s<=o)return!1;let c=k+1;return F[s*c+a]-F[o*c+a]-F[s*c+i]+F[o*c+i]>0}let me=(e,t)=>({x:(e-t)*v,z:(e+t)*v}),I=d*1.5,ge=me(d/2,u/2),_e=Math.SQRT2*u,ve=Math.SQRT2*d,L=e=>(ge.x-e)/_e,R=e=>(e-ge.z)/ve,ye=Math.floor(Math.min(L(a-I),L(o+I)))-2,be=Math.ceil(Math.max(L(a-I),L(o+I)))+2,xe=Math.floor(Math.min(R(s-I),R(c+I)))-2,Se=Math.ceil(Math.max(R(s-I),R(c+I)))+2,z=[],B=new Set;for(let e=ye;e<=be;e++)for(let t=xe;t<=Se;t++){{let r=me(-u*e+d*t+d/2,u*e+d*t+u/2);r.x>a-I&&r.x<o+I&&r.z>s-I&&r.z<c+I&&(z.push({cx:r.x,cz:r.z,sign:1,seed:n(),courseN:t}),B.add(t))}{let r=me(d-u*e+d*t+u/2,u*e+d*t+d/2);r.x>a-I&&r.x<o+I&&r.z>s-I&&r.z<c+I&&(z.push({cx:r.x,cz:r.z,sign:-1,seed:n(),courseN:t}),B.add(t))}}let[V,Ce]=t.layWindow,[we,Te]=t.letterWindow,[Ee,De]=t.sandWindow,Oe=Math.max(.015,(Ce-V)*.12),ke=Math.max(.01,(Te-we)*.16),H=a-N,U=o+N,Ae=Array.from(B).sort((e,t)=>e-t),je=new Map(Ae.map((e,t)=>[e,Ae.length>1?t/(Ae.length-1):0])),W=z.length,Me=new Float32Array(W*2),Ne=new Float32Array(W),Pe=new Float32Array(W),Fe=new Float32Array(W);z.forEach((e,t)=>{let n=je.get(e.courseN)??0;Me[t*2]=e.cx,Me[t*2+1]=e.cz,Ne[t]=e.sign,Pe[t]=e.seed,Fe[t]=V+(Ce-V)*n+(e.seed-.5)*.03});let G=new e.PlaneGeometry(1,1),K=new e.InstancedBufferGeometry;K.index=G.index,K.setAttribute(`position`,G.getAttribute(`position`)),K.setAttribute(`aCenter`,new e.InstancedBufferAttribute(Me,2)),K.setAttribute(`aSign`,new e.InstancedBufferAttribute(Ne,1)),K.setAttribute(`aSeed`,new e.InstancedBufferAttribute(Pe,1)),K.setAttribute(`aBirth`,new e.InstancedBufferAttribute(Fe,1)),K.instanceCount=W,r.push(G,K);let Ie=document.createElement(`canvas`);Ie.width=1,Ie.height=1;function Le(){let t=new e.CanvasTexture(E??Ie);return t.flipY=!1,t.colorSpace=e.NoColorSpace,t.generateMipmaps=!1,t.magFilter=e.LinearFilter,t.minFilter=e.LinearFilter,t.needsUpdate=!0,t}let Re=Le();r.push(Re);let ze=Le();r.push(ze);let q=new e.ShaderMaterial({vertexShader:ce,fragmentShader:(t.coarse?`#define COARSE 1
`:``)+le,uniforms:{...l,uP:{value:0},uTime:{value:0},uLayGrow:{value:Oe},uRestY:{value:ae},uX0:{value:a},uX1:{value:o},uZFar:{value:s},uZNear:{value:c},uSandX:{value:H},uPitch:{value:new e.Vector2(d,u)},uBodyHalf:{value:new e.Vector2(f/2,p/2)},uInkTex:{value:Re},uInkOrigin:{value:new e.Vector2(T.x0,T.z0)},uInkExtent:{value:new e.Vector2(j,P)},uHasInk:{value:+!!te}},side:e.DoubleSide}),Be=new e.Mesh(K,q);Be.frustumCulled=!1,i.add(Be),r.push(q);let Ve=M/2,He=1.212,Ue=c-s,J=Math.max(1,Math.round(Ue/He)),We=new Float32Array(J*2*2),Ge=new Float32Array(J*2),Ke=new Float32Array(J*2),Y=0;for(let e of[-1,1]){let t=e<0?a-Ve:o+Ve;for(let e=0;e<J;e++){let r=s+(e+.5)*He,i=(r-s)/Math.max(.001,Ue);We[Y*2]=t,We[Y*2+1]=r;let a=n();Ge[Y]=a,Ke[Y]=V+(Ce-V)*i+(a-.5)*.02,Y++}}let X=new e.InstancedBufferGeometry;X.index=G.index,X.setAttribute(`position`,G.getAttribute(`position`)),X.setAttribute(`aCenter`,new e.InstancedBufferAttribute(We,2)),X.setAttribute(`aSeed`,new e.InstancedBufferAttribute(Ge,1)),X.setAttribute(`aBirth`,new e.InstancedBufferAttribute(Ke,1)),X.instanceCount=Y,r.push(X);let Z=new e.ShaderMaterial({vertexShader:ue,fragmentShader:(t.coarse?`#define COARSE 1
`:``)+de,uniforms:{...l,uP:{value:0},uTime:{value:0},uLayGrow:{value:Oe},uRestY:{value:ae},uZFar:{value:s},uZNear:{value:c},uSandX:{value:H}},side:e.DoubleSide}),qe=new e.Mesh(X,Z);qe.frustumCulled=!1,i.add(qe),r.push(Z);let Q=0,$=null;if(te){let a=Math.max(1,Math.ceil(j/h)),o=Math.max(1,Math.ceil(P/h)),s=[];for(let e=0;e<o;e++)for(let t=0;t<a;t++){let n=T.x0+(t+.5)*h,r=T.z0+(e+.5)*h,i=h*.5;se(n-i,r-i,n+i,r+i)&&s.push({cx:n,cz:r})}Q=s.length;let c=new Float32Array(Q*2),u=new Float32Array(Q),d=new Float32Array(Q);s.forEach(({cx:e,cz:t},r)=>{let i=Math.min(1,Math.max(0,(e-T.x0)/j)),a=n();c[r*2]=e,c[r*2+1]=t,u[r]=a,d[r]=we+(Te-we)*i+(a-.5)*.015});let f=new e.InstancedBufferGeometry;f.index=G.index,f.setAttribute(`position`,G.getAttribute(`position`)),f.setAttribute(`aCenter`,new e.InstancedBufferAttribute(c,2)),f.setAttribute(`aSeed`,new e.InstancedBufferAttribute(u,1)),f.setAttribute(`aBirth`,new e.InstancedBufferAttribute(d,1)),f.instanceCount=Q,r.push(f),$=new e.ShaderMaterial({vertexShader:fe,fragmentShader:(t.coarse?`#define COARSE 1
`:``)+pe(_,y,b,x),uniforms:{...l,uP:{value:0},uTime:{value:0},uLayGrow:{value:ke},uRestY:{value:ae},uSandX:{value:H},uPitch:{value:h},uBodyHalf:{value:m/2},uInkTex:{value:ze},uInkOrigin:{value:new e.Vector2(T.x0,T.z0)},uInkExtent:{value:new e.Vector2(j,P)}},side:e.DoubleSide});let p=new e.Mesh(f,$);p.frustumCulled=!1,p.renderOrder=1,i.add(p),r.push($)}return{group:i,setProgress(e,t){q.uniforms.uP.value=e,q.uniforms.uTime.value=t,Z.uniforms.uP.value=e,Z.uniforms.uTime.value=t;let n=Math.min(1,Math.max(0,(e-Ee)/Math.max(1e-4,De-Ee))),r=H+(U-H)*n;q.uniforms.uSandX.value=r,Z.uniforms.uSandX.value=r,$&&($.uniforms.uP.value=e,$.uniforms.uTime.value=t,$.uniforms.uSandX.value=r)},dispose(){for(let e of r)e.dispose()},info(){return{stones:W,courses:B.size,edging:Y,lettering:Q}}}}function he(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var I={introHold:.03,introOut:.1,layStart:.05,layEnd:.55,letterStart:.56,letterEnd:.78,sandStart:.78,sandEnd:.9,outro:[.88,.94]},ge=Math.PI/180,_e=24,ve=_e*ge,L=36,R=`"Hanken Grotesk", system-ui, sans-serif`,ye=[[`Zbuduję dla`,`Ciebie nową`,`stronę`],[`Zbuduję`,`dla Ciebie`,`nową`,`stronę`],[`Zbuduję`,`dla`,`Ciebie`,`nową`,`stronę`]],be=6;function xe(e,t){let n=f({layouts:e,width:t.width,depth:t.depth,centreZ:t.centreZ,stretch:1/Math.cos(ve),weight:700,tracking:.03,fontFamily:R,returnMask:!0,maxCount:2e3,rand:t.rand});return{...n,...Se(n.em,t.coarse)}}function Se(e,t){let n=w(t).settBody,r=n,i=T(e,r);return i<be&&(r=E(e,be,t),i=T(e,r)),{settBody:r,spch:i,shrunk:r<n}}var z={wet:[.016,.016,.017],loam:[.044,.044,.046],dry:[.085,.085,.088],stoneLo:[.062,.063,.066],stoneHi:[.185,.187,.192],straw:[.12,.108,.086]},B={dir:[1,0],freq:9},V=ke([-.5,.74,-.45]),Ce=[1.45,1.12,.78],we=[.36,.42,.55],Te=1577999;async function Ee(e,t){return await Promise.race([document.fonts?.load(`900 64px "Hanken Grotesk"`,`Zbudujęąó`).catch(()=>void 0),new Promise(e=>setTimeout(e,2500))]),s(e,{reduced:t.reduced,coarse:t.coarse,tilt:_e,vfov:L,groundWidth:e=>Math.max(5.6,Math.min(14.5,7.8*e)),sun:V,sunColor:Ce,sky:we,clearColor:Te,pixelRatioCap:1.5,build:e=>De(e,t),update:(e,t,n)=>Oe(e,t,n),debugInfo:e=>{let t=e?.pavers.info();return{pavers:t?.stones,courses:t?.courses,edging:t?.edging,lettering:t?.lettering,settsPerCapHeight:e?.settsPerCapHeight,em:e?.em,lines:e?.lines,headline:e?.headline}}})}function De(e,t){let{THREE:n,light:r}=e,i=e.frame,o=new n.Group,s=i.zNear-i.zFar,l=Math.max(i.halfFar,i.halfNear),u=Math.min(i.halfFar,i.halfNear),d=-(u-M),m=u-M,h=new n.PlaneGeometry(2*l+6,s+8).rotateX(-Math.PI/2);h.translate(0,0,(i.zFar+i.zNear)/2);let g=new n.ShaderMaterial({vertexShader:p,fragmentShader:a({coarse:t.coarse,angular:!0}),uniforms:{...r,...c(n,z,B,{angular:1,organic:0})}}),_=new n.Mesh(h,g);_.renderOrder=0,o.add(_);let v=ee(t.coarse).longBody,y=Math.max(.5,m-d-2*v),b=Math.max(.5,s-2*v),x=i.zFar+s/2,S=H(20260912),C=xe(ye,{width:y,depth:b,centreZ:x,coarse:t.coarse,rand:S});if(C.inkRect){let e=C.inkRect.x1-C.inkRect.x0,n=C.inkRect.z1-C.inkRect.z0,r=Math.min(1,y/e,b/n),i=x-((C.inkRect.z0+C.inkRect.z1)/2-x),a=f({layouts:[C.lines],width:y*r,depth:b*r,centreZ:i,stretch:1/Math.cos(ve),weight:700,tracking:.03,fontFamily:R,returnMask:!0,maxCount:2e3,rand:S});C={...C,lines:a.lines,em:a.em,mask:a.mask,maskRect:a.maskRect,inkRect:a.inkRect,...Se(a.em,t.coarse)}}let te=C.shrunk?`shrunk`:`full`,{lines:w,em:T,mask:E,maskRect:D,settBody:ne,spch:re}=C,O=me(n,{x0:d,x1:m,zFar:i.zFar,zNear:i.zNear,letterMask:E&&D?{canvas:E,rect:D}:void 0,light:r,coarse:t.coarse,layWindow:[I.layStart,I.layEnd],letterWindow:[I.letterStart,I.letterEnd],sandWindow:[I.sandStart,I.sandEnd],settBody:ne});return o.add(O.group),{settsPerCapHeight:re,em:T,lines:w,headline:te,group:o,groundGeo:h,groundMat:g,pavers:O,dispose(){h.dispose(),g.dispose(),O.dispose()}}}function Oe(e,t,n){e.pavers.setProgress(t,n.clock.time)}function ke(e){let t=Math.hypot(e[0],e[1],e[2]);return[e[0]/t,e[1]/t,e[2]/t]}function H(e){let t=e>>>0;return()=>{t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var U=n(),Ae={introHold:I.introHold,introOut:I.introOut,outro:I.outro};function je(){return(0,U.jsx)(l,{id:`kostka`,className:`paving`,debugHandleName:`__paving`,height:`480svh`,createScene:Ee,h1:{id:`paving-title`,text:`Zbuduję nową stronę dla Twojej firmy brukarskiej`},brand:{href:`https://marcinbochenek.com/`,content:(0,U.jsxs)(U.Fragment,{children:[(0,U.jsx)(i,{size:26}),(0,U.jsx)(`span`,{children:`Marcin Bochenek`})]})},contact:{href:`#kontakt`,label:`Kontakt`},intro:{eyebrow:`Dla firm brukarskich i wykonawców nawierzchni`,title:`Najpierw podbudowa.`,hint:`Przewiń — ułożę kostkę`},outro:{line:(0,U.jsx)(U.Fragment,{children:`Strona dla Twojej firmy: realizacje, wyceny i\xA0zapytania od klientów w\xA0jednym miejscu.`}),ctaLabel:`Porozmawiajmy`,ctaHref:`#kontakt`,mailHref:`mailto:${r.email}`,mailLabel:r.email},timeline:Ae})}function W(){return(0,U.jsxs)(`svg`,{"aria-hidden":!0,width:`14`,height:`14`,viewBox:`0 0 14 14`,fill:`none`,className:`mt-1 shrink-0`,children:[(0,U.jsx)(`path`,{d:`M4.6 1.6 L12.4 4.2 L9.4 12.4 L1.6 9.8 Z`,fill:`var(--accent-mark)`}),(0,U.jsx)(`path`,{d:`M9.4 12.4 L1.6 9.8 L2.1 8.4 L9.9 11.0 Z`,fill:`rgba(0,0,0,0.35)`})]})}function Me(){return(0,U.jsx)(`footer`,{style:{background:`var(--graphite-950)`},className:`px-5 py-8 md:px-10`,children:(0,U.jsxs)(`div`,{className:`mx-auto max-w-6xl`,children:[(0,U.jsx)(`div`,{className:`hairline`}),(0,U.jsxs)(`div`,{className:`flex flex-col gap-3 pt-6 font-mono text-[11px] tracking-[0.05em] text-[var(--cream-dim)] md:flex-row md:items-center md:justify-between md:text-xs`,children:[(0,U.jsx)(`p`,{children:`© 2026 Marcin Bochenek`}),(0,U.jsxs)(`div`,{className:`flex items-center gap-5`,children:[(0,U.jsx)(`a`,{href:`mailto:${r.email}`,className:`transition-colors hover:text-[var(--cream)]`,children:r.email}),(0,U.jsx)(`a`,{href:`/branze`,className:`transition-colors hover:text-[var(--cream)]`,children:`Strony dla branż`}),(0,U.jsx)(`a`,{href:`https://marcinbochenek.com/`,className:`transition-colors hover:text-[var(--cream)]`,children:`marcinbochenek.com`})]})]})]})})}var Ne={offer:{eyebrow:`Oferta`,heading:`Co dostajesz`,blocks:[{title:`Realizacje z\xA0metrażem i\xA0kosztem`,body:`Zdjęcia podjazdów i\xA0tarasów z\xA0metrażem, rodzajem kostki i\xA0czasem realizacji. Klient sam sobie odpowiada na pytanie „ile to u\xA0mnie będzie kosztować", zanim zadzwoni.`},{title:`Zakres bez niedomówień`,body:`Co robicie sami, a\xA0co podzlecacie: podbudowa, obrzeża, odwodnienie liniowe, cięcie, fugowanie. To pierwsza rzecz, o\xA0którą pyta inwestor, i\xA0pierwsza, której nie ma na stronach konkurencji.`},{title:`Formularz, który liczy zamiast pytać`,body:`Metry, rodzaj kostki, dojazd i\xA0termin zebrane w\xA0jednym kroku. Zapytanie trafia do Ciebie z\xA0liczbami, a\xA0nie z\xA0pytaniem „ile za podjazd?".`},{title:`Widoczność w\xA0promieniu, w\xA0którym jeździcie`,body:`Strona szybka na telefonie i\xA0opisana tak, żeby Google i\xA0modele AI wiedziały, w\xA0jakich miejscowościach pracujecie i\xA0czego się podejmujecie.`}]},process:{eyebrow:`Proces`,heading:`Jak to działa`,steps:[{number:`01`,title:`Rozmowa, 20 minut`,body:`Pokazujesz realizacje i\xA0mówisz, jakich zleceń chcesz więcej. Wychodzę z\xA0tego z\xA0zakresem i\xA0widełkami — bez prezentacji i\xA0bez zobowiązania.`},{number:`02`,title:`Projekt i\xA0wdrożenie`,body:`Typowa strona wykonawcy to 2–4 tygodnie od kompletu materiałów. Postęp oglądasz na żywym podglądzie, nie w\xA0raporcie.`},{number:`03`,title:`Start i\xA0opieka`,body:`Przenoszę domenę, wpinam analitykę, zostaję na zmiany. Strona jest Wasza — kod i\xA0treści zostają u\xA0Was.`}]},price:{eyebrow:`Inwestycja`,heading:`Ile to kosztuje`,lead:`Wycenę podaję po rozmowie, bez ukrytych pozycji. Punkt wyjścia zależy od tego, ile strona ma robić.`,tiers:[{name:`Wizytówka z\xA0formularzem`,price:`od 2 000 PLN`,desc:`jedna strona, realizacje, kontakt.`},{name:`Strona z\xA0realizacjami i\xA0lejkiem zapytań`,price:`od 8 000 PLN`,desc:`wiele podstron, panel do dodawania realizacji, kalkulator metrażu.`}]},faq:{eyebrow:`FAQ`,heading:`Pytania, które słyszę najczęściej`,items:[{q:`Mam zdjęcia z\xA0telefonu, prosto z\xA0budowy. To wystarczy?`,a:`Tak, i\xA0często tak zaczynamy. Zdjęcie skończonego podjazdu w\xA0słońcu robi robotę — najgorsze są kadry z\xA0błotem, bo klient patrzy wtedy na błoto, nie na kostkę.`},{q:`Czy da się wstawić kalkulator metrażu?`,a:`Da się i\xA0zwykle to robimy. Klient podaje metry i\xA0rodzaj kostki, dostaje widełki, a\xA0Ty dostajesz zapytanie z\xA0liczbami.`},{q:`Ile trwa wdrożenie?`,a:`Typowa strona wykonawcy: 2–4 tygodnie od momentu, w\xA0którym mam komplet zdjęć i\xA0opisów. Projekt graficzny widzisz w\xA0pierwszym tygodniu.`},{q:`Czy będę mógł sam dodawać realizacje?`,a:`Tak. Dodawanie zdjęć i\xA0opisów odbywa się w\xA0panelu, bez znajomości kodu i\xA0bez dzwonienia do mnie.`},{q:`Pracujecie tylko lokalnie?`,a:`Strona może celować w\xA0konkretne miejscowości, ale ja pracuję zdalnie — po polsku i\xA0po angielsku, niezależnie od tego, gdzie stoi Wasza baza.`}]}},Pe=[{id:`name`,label:`Imię`,type:`text`,required:!0},{id:`email`,label:`E-mail`,type:`email`,required:!0},{id:`company`,label:`Firma`,type:`text`},{id:`website`,label:`Obecna strona (jeśli jest)`,type:`text`,placeholder:`np. twojafirma.pl`},{id:`message`,label:`Czego potrzebujesz?`,type:`textarea`,placeholder:`Kilka zdań: jakie zlecenia bierzecie i\xA0co ma robić nowa strona.`}],Fe={eyebrow:`Kontakt`,heading:`Porozmawiajmy o\xA0stronie Twojej firmy.`,lead:`Zaprojektuję i\xA0wdrożę stronę, która pokazuje Wasze podjazdy i\xA0tarasy tak, jak wyglądają po zamieceniu fugi — i\xA0zamienia oglądających w\xA0zapytania z\xA0metrażem. Jedna osoba od projektu po wdrożenie i\xA0opiekę.`,listHeading:`Co może się na niej znaleźć`,bullets:[`Realizacje z\xA0metrażem, rodzajem kostki i\xA0czasem wykonania`,`Zakres robót rozpisany po ludzku: podbudowa, obrzeża, odwodnienie, fugowanie`,`Formularz, który zbiera metry, rodzaj kostki i\xA0termin`,`Szybka na telefonie i\xA0widoczna w\xA0Google w\xA0miejscowościach, w\xA0których pracujecie`],priceLine:`Strony od 2 000 PLN. Wycenę podam po krótkiej rozmowie.`,rows:[{label:`E-mail`,value:r.email,href:`mailto:${r.email}`},...r.calendly?[{label:`Kalendarz`,value:`Umów 20 minut rozmowy`,href:r.calendly,external:!0}]:[],{label:`Portfolio`,value:`marcinbochenek.com`,href:`https://marcinbochenek.com/`}],responseTime:r.responseTime,source:`brukarstwo`,formHeading:`Opowiedz o\xA0swojej firmie`,fields:Pe,buildSubject:e=>`Strona dla firmy brukarskiej — ${e.company||e.name||`zapytanie`}`,glow:`radial-gradient(70% 42% at 18% 44%, rgba(70, 74, 82, 0.32), transparent 100%), var(--graphite-950)`};function G(){return(0,U.jsxs)(U.Fragment,{children:[(0,U.jsxs)(`main`,{children:[(0,U.jsx)(je,{}),(0,U.jsx)(u,{content:Ne,marker:(0,U.jsx)(W,{})}),(0,U.jsx)(m,{content:Fe,marker:(0,U.jsx)(W,{})})]}),(0,U.jsx)(Me,{})]})}(0,g.createRoot)(document.getElementById(`root`)).render((0,U.jsx)(h.StrictMode,{children:(0,U.jsx)(G,{})}));