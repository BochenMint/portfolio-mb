import{n as e,r as t,t as n}from"./jsx-runtime-i9uBjpvk.js";import{n as r,o as i,r as a}from"./i18n-C1tP8KwJ.js";/* empty css            */import{d as o,g as s}from"./live-C7cvPOC7.js";import{t as c}from"./gallery-jI0pM9Zk.js";import{$ as l,B as u,C as d,Dt as f,E as p,Et as m,G as h,J as g,K as _,Mt as v,N as y,Q as b,S as x,St as S,T as C,Tt as w,U as T,V as E,W as D,X as O,Z as k,_t as A,at as j,b as M,bt as N,ct as P,dt as F,gt as I,h as L,ht as R,j as z,jt as B,k as V,l as ee,lt as te,mt as ne,pt as H,st as re,tt as ie,u as ae,ut as oe,v as se,w as ce,wt as le,x as U,xt as W,y as ue,yt as G,z as K}from"./three-D8_snUvY.js";import{a as q,c as J,d as Y,i as X,n as de,o as fe,p as pe,r as me}from"./build-Bn3S1IAb.js";import{r as he}from"./heroSceneTypes-BBcQTCIc.js";import{a as ge,c as _e,d as ve,i as ye,l as be,o as xe,r as Se,s as Ce,t as we,u as Te}from"./buildShipV2-OaVK2xOY.js";var Ee=e(),De=t(),Oe=180,ke=Oe/2,Ae=2600,je=1200,Me=900,Ne=400,Pe=12,Fe=60,Ie=.5,Le=70,Re=.1,ze=.35;function Be(){let e=document.createElement(`canvas`);e.width=e.height=32;let t=e.getContext(`2d`),n=t.createRadialGradient(16,16,0,16,16,16);return n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.5,`rgba(255,255,255,0.5)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,32,32),new d(e)}function Ve(e,t){let n=e-t;for(;n>ke;)n-=Oe;for(;n<-90;)n+=Oe;return t+n}var He=`
  attribute float aSize;
  attribute vec3 aTint;
  varying vec3 vTint;
  uniform float uSizeMul;
  void main() {
    vTint = aTint;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    // Perspective size falloff — approximation of THREE's built-in
    // sizeAttenuation (we need a custom shader here for per-vertex aSize,
    // which PointsMaterial can't drive).
    gl_PointSize = aSize * uSizeMul / max(-mvPosition.z, 1.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`,Ue=`
  precision mediump float;
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec3 vTint;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    gl_FragColor = vec4(vTint * tex.rgb, tex.a * uOpacity);
  }
`;function We(e){let t=e?je:Ae,n=e?Ne:Me,r=Be(),i=new Float32Array(t*3),a=new Float32Array(t),o=new Float32Array(t*3);for(let e=0;e<t;e++){let t=e*3;i[t+0]=(Math.random()-.5)*Oe,i[t+1]=(Math.random()-.5)*Oe,i[t+2]=(Math.random()-.5)*Oe,a[e]=.1+Math.random()*.25;let n=Math.random();n<.04?(o[t+0]=.72,o[t+1]=.83,o[t+2]=1):n<.08?(o[t+0]=1,o[t+1]=.9,o[t+2]=.74):(o[t+0]=1,o[t+1]=1,o[t+2]=1)}let s=new x;s.setAttribute(`position`,new U(i,3)),s.setAttribute(`aSize`,new U(a,1)),s.setAttribute(`aTint`,new U(o,3));let c=new A({uniforms:{uMap:{value:r},uOpacity:{value:Re},uSizeMul:{value:260}},vertexShader:He,fragmentShader:Ue,transparent:!0,depthWrite:!1,depthTest:!0,blending:2}),l=new oe(s,c);l.frustumCulled=!1,l.renderOrder=2;let u=new Float32Array(n*3);for(let e=0;e<n;e++){let t=e*3;u[t+0]=(Math.random()-.5)*Oe,u[t+1]=(Math.random()-.5)*Oe,u[t+2]=(Math.random()-.5)*Oe}let d=new Float32Array(n*2*3),f=new x,p=new U(d,3);p.setUsage(z),f.setAttribute(`position`,p);let m=new T({color:13623551,transparent:!0,opacity:0,depthWrite:!1,depthTest:!0,blending:2}),h=new D(f,m);h.frustumCulled=!1,h.renderOrder=2;let g=new K;return g.name=`dust-field`,g.add(l),g.add(h),{object:g,update(e,r){for(let n=0;n<t;n++){let t=n*3;i[t+0]=Ve(i[t+0],e.x),i[t+1]=Ve(i[t+1],e.y),i[t+2]=Ve(i[t+2],e.z)}s.attributes.position.needsUpdate=!0;let a=r.length(),o=O.clamp(a/Le,0,1);c.uniforms.uOpacity.value=O.lerp(Re,ze,o);let l=0,p=0,h=-1;if(a>1e-4){let e=1/a;l=r.x*e,p=r.y*e,h=r.z*e}let g=O.clamp(a*.06,.3,4.5);for(let t=0;t<n;t++){let n=t*3;u[n+0]=Ve(u[n+0],e.x),u[n+1]=Ve(u[n+1],e.y),u[n+2]=Ve(u[n+2],e.z);let r=u[n+0],i=u[n+1],a=u[n+2],o=t*6;d[o+0]=r,d[o+1]=i,d[o+2]=a,d[o+3]=r-l*g,d[o+4]=i-p*g,d[o+5]=a-h*g}f.attributes.position.needsUpdate=!0,m.opacity=O.clamp((a-Pe)/(Fe-Pe),0,1)*Ie},dispose(){s.dispose(),c.dispose(),f.dispose(),m.dispose(),r.dispose()}}}var Ge=1500,Ke=1600,qe=20260712,Je=`
  attribute float aPhase;
  attribute float aSpeed;
  attribute float aSize;
  attribute vec3 aColor;

  uniform float uTime;

  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    // 0.62..1.0 — stars never blink fully off, they breathe.
    float tw = 0.81 + 0.19 * sin(uTime * aSpeed + aPhase);
    vTwinkle = tw;
    vColor = aColor;

    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * tw * (1900.0 / max(-mv.z, 1.0));
  }
`,Ye=`
  precision mediump float;
  varying vec3 vColor;
  varying float vTwinkle;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    float alpha = smoothstep(1.0, 0.0, d);
    alpha = pow(alpha, 2.2) * vTwinkle;
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(vColor * alpha, alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;function Xe(e){let t=e?800:Ge,n=ve(qe),r=new Float32Array(t*3),i=new Float32Array(t),a=new Float32Array(t),o=new Float32Array(t),s=new Float32Array(t*3),c=new p(16777215),l=new p(12571903),u=new p(16769208),d=new p;for(let e=0;e<t;e++){let t,f,p,m;do t=n()*2-1,f=n()*2-1,p=n()*2-1,m=t*t+f*f+p*p;while(m<.01||m>1);let h=Ke/Math.sqrt(m);r[e*3]=t*h,r[e*3+1]=f*h,r[e*3+2]=p*h,i[e]=n()*Math.PI*2,a[e]=.5+n()*2.2,o[e]=.5+n()**2.4*1.9;let g=n();g<.12?d.copy(l):g<.2?d.copy(u):d.copy(c),d.multiplyScalar(.55+n()*.45),s[e*3]=d.r,s[e*3+1]=d.g,s[e*3+2]=d.b}let f=new x;f.setAttribute(`position`,new U(r,3)),f.setAttribute(`aPhase`,new U(i,1)),f.setAttribute(`aSpeed`,new U(a,1)),f.setAttribute(`aSize`,new U(o,1)),f.setAttribute(`aColor`,new U(s,3)),f.boundingSphere=new G(new v,1601);let m=new A({uniforms:{uTime:{value:0}},vertexShader:Je,fragmentShader:Ye,transparent:!0,depthWrite:!1,depthTest:!0,blending:2}),h=new oe(f,m);return h.frustumCulled=!1,h.renderOrder=0,h.name=`starfield-twinkle`,{object:h,update(e,t,n){h.position.copy(e),h.rotation.y=n,m.uniforms.uTime.value=t},dispose(){f.dispose(),m.dispose()}}}var Ze=`/v4/assets/skybox-8k.jpg`,Qe=`/v4/assets/skybox-4k.jpg`,$e=`/v4/assets/skybox-2k.jpg`;function et(){return typeof navigator>`u`?!1:!!navigator.connection?.saveData}function tt(){return typeof navigator>`u`?!1:navigator.userAgentData?.mobile===!0?!0:/iPhone|iPod|Android.+Mobile/i.test(navigator.userAgent)}function nt(e,t){return t?[$e]:e>=8192?[Ze,Qe,$e]:e>=4096?(console.warn(`[v4] GPU maxTextureSize=${e} < 8192; sky fallback ${Qe}`),[Qe,$e]):(console.warn(`[v4] GPU maxTextureSize=${e} < 4096; sky fallback ${$e}`),[$e])}async function rt(e,t){let n;for(let r of t)try{return{texture:await e.loadAsync(r),url:r}}catch(e){n=e,console.error(`[v4] sky texture failed to load: ${r}`,e)}throw n instanceof Error?n:Error(`[v4] sky texture failed to load: ${t.join(` → `)}`)}function it(e){e.mapping=303,e.colorSpace=R,e.generateMipmaps=!1,e.minFilter=h,e.magFilter=h,e.wrapS=H,e.wrapT=C,e.anisotropy=1,e.needsUpdate=!0}var at=4500,ot=`
  varying vec3 vDir;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    // View direction from the CAMERA, not from the dome center — the dome is
    // pinned at the origin while the camera roams up to ~1000u away, and the
    // black hole impostor samples true camera rays; sampling by dome-center
    // direction would shift the sky a couple of degrees and reopen the seam.
    vDir = wp.xyz - cameraPosition;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,st=`
  precision highp float;
  uniform sampler2D uSky;
  uniform float uSkyRot;
  varying vec3 vDir;
  #define PI 3.14159265359

  vec2 equirectUv(vec3 dir) {
    float u = atan(dir.z, dir.x) / (2.0 * PI) + 0.5;
    float v = asin(clamp(dir.y, -1.0, 1.0)) / PI + 0.5;
    return vec2(u, v);
  }

  void main() {
    vec3 dir = normalize(vDir);
    float c = cos(uSkyRot);
    float s = sin(uSkyRot);
    vec3 rd = vec3(c * dir.x + s * dir.z, dir.y, -s * dir.x + c * dir.z);
    // Seam-free equirect: przy nieciągłości atan2 (u: 1→0) pochodna UV
    // eksploduje i mipmapping rysuje pionowy szew. Druga próbka z u
    // przesuniętym o 0.5 ma nieciągłość po przeciwnej stronie nieba —
    // wybieramy tę o mniejszej pochodnej (wrapS=Repeat zawija ujemne u).
    vec2 uvA = equirectUv(rd);
    vec2 uvB = vec2(fract(uvA.x + 0.5) - 0.5, uvA.y);
    vec3 col = fwidth(uvA.x) <= fwidth(uvB.x)
      ? texture2D(uSky, uvA).rgb
      : texture2D(uSky, uvB).rgb;
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;function ct(e){let t=new N(at,64,40),n=new A({uniforms:{uSky:{value:e},uSkyRot:{value:0}},vertexShader:ot,fragmentShader:st,side:1,depthWrite:!1,depthTest:!1}),r=new b(t,n);return r.frustumCulled=!1,r.renderOrder=-2,r.name=`sky-dome`,{mesh:r,setYaw(e){n.uniforms.uSkyRot.value=e},dispose(){t.dispose(),n.dispose()}}}async function lt(e,t){let{lowPower:n,manager:r,reducedMotion:i}=t,a=typeof location<`u`&&new URLSearchParams(location.search).has(`debug`),o=new ae({canvas:e,antialias:!n,alpha:!1,powerPreference:n?`default`:`high-performance`,preserveDrawingBuffer:a});o.setPixelRatio(he(n)),o.setClearColor(0,1),o.toneMapping=4,o.toneMappingExposure=1.18,o.outputColorSpace=R;let s=new I,c=new re(60,1,.8,6e3);c.position.set(0,4,16);let l=new te(13688042,250,120,2);c.add(l),s.add(c);let d=new le(r),f=n||et()||tt(),p=nt(o.capabilities.maxTextureSize,f),m=p[0]===$e?Promise.resolve(null):d.loadAsync($e).catch(e=>(console.error(`[v4] env sky texture failed to load: ${$e}`,e),null)),[{texture:h,url:g},_]=await Promise.all([rt(d,p),m]);it(h);let v=ct(h);s.add(v.mesh);let y=_??h;_&&(_.mapping=303,_.colorSpace=R);let x=new ee(o);x.compileEquirectangularShader();let S=x.fromEquirectangular(y);s.environment=S.texture;let C=S.texture;if(_?.dispose(),a){let e=h.image;window.__v4Sky={url:g,imageWidth:e?.width??0,imageHeight:e?.height??0,generateMipmaps:h.generateMipmaps,minFilter:h.minFilter,magFilter:h.magFilter,wrapS:h.wrapS,colorSpace:h.colorSpace,anisotropy:h.anisotropy,maxTextureSize:o.capabilities.maxTextureSize,constrained:f}}s.add(new u(9085128,658448,.55));let T=new V(16773596,1.65);T.position.set(600,400,250),s.add(T);let E=new V(11847396,.95);E.position.set(-420,260,-380),s.add(E);let D=new te(16760944,130,520,1.7);D.position.set(0,0,0),s.add(D);let O=We(n);s.add(O.object);let k=Xe(n);s.add(k.object);let A=new q(o,{multisampling:n?0:4});A.addPass(new Y(s,c));let j=new de({intensity:i?.1:n?.12:.16,luminanceThreshold:.985,luminanceSmoothing:.06,mipmapBlur:!0}),M=new pe({offset:.52,darkness:.22}),N=[j,new me({contrast:.02,brightness:0}),new J({saturation:-.02}),M];if(!n&&!i){let e=new X({offset:new B(9e-4,9e-4),radialModulation:!0,modulationOffset:.15});N.splice(1,0,e)}A.addPass(new fe(c,...N));let P=new w;a||P.connect(document);let F=new Set,L=0,z=!1,ne=e=>a&&document.hidden?setTimeout(()=>e(performance.now()),16):requestAnimationFrame(e),H=e=>{if(!z)return;P.update(e);let t=Math.min(.05,P.getDelta()),n=P.getElapsed();for(let e of F)e(t,n);let r=n*Ce;v.setYaw(r),k.update(c.position,n,r),A.render(t),L=ne(H)};return{renderer:o,scene:s,camera:c,composer:A,dust:O,envMap:C,skyTex:h,setSize(e,t){e<2||t<2||(o.setSize(e,t,!1),A.setSize(e,t),c.aspect=e/Math.max(t,1),c.updateProjectionMatrix())},onTick(e){return F.add(e),()=>F.delete(e)},start(){z||(z=!0,P.reset(),L=ne(H))},stop(){z=!1,clearTimeout(L),cancelAnimationFrame(L)},dispose(){z=!1,clearTimeout(L),cancelAnimationFrame(L),P.dispose(),F.clear(),O.dispose(),k.dispose(),v.dispose(),s.traverse(e=>{if(e instanceof b){let t=Array.isArray(e.material)?e.material:[e.material];for(let e of t)e?.dispose()}}),S.dispose(),x.dispose(),h.dispose(),A.dispose(),o.dispose(),o.getContext().getExtension(`WEBGL_lose_context`)?.loseContext()}}}var ut=22,dt=ut/5;ut*.42,dt*.42,ut*.16,new p(5093631),new p(10475775),new p(15398655),new p(3787263),`${Se}${be}`;var ft=new v(1,0,0),pt=new v(0,1,0),mt=Math.PI/180,ht=1.9,gt=6.5,_t=8,vt=1.15,yt=7,bt=9,xt=52*mt,St=20*mt,Ct=5,wt=.1,Tt=30,Et=.999,Dt=92,Ot=4.2,kt=2.4,At=new Set([`Space`]),jt=new Set([`ShiftLeft`,`ShiftRight`]),Mt=new Set([`KeyW`,`ArrowUp`]),Nt=new Set([`KeyS`,`ArrowDown`]),Pt=new Set([`KeyA`,`ArrowLeft`]),Ft=new Set([`KeyD`,`ArrowRight`]),It=new Set([`KeyQ`]),Lt=new Set([`KeyE`]),Rt=new Set([`Space`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`]);function zt(e,t){let n=new Set,r={position:e.clone(),quaternion:new F,velocity:new v,angularVelocity:new v,bankAngle:0,thrustLevel:0,brakeLevel:0,speed:0,hasThrusted:!1},i=e=>{n.add(e.code),Rt.has(e.code)&&e.preventDefault()},a=e=>{n.delete(e.code)},o=()=>n.clear();window.addEventListener(`keydown`,i,{passive:!1}),window.addEventListener(`keyup`,a),window.addEventListener(`blur`,o);let s=e=>{for(let t of e)if(n.has(t))return!0;return!1},c=new v,l=new F,u=new F,d=new y(0,0,0,`YXZ`);return{state:r,update(e){let n=0;s(Mt)&&--n,s(Nt)&&(n+=1),t&&(t.pitch!==0||n===0)&&(n=Math.max(-1,Math.min(1,n+t.pitch)));let i=n*ht,a=n===0?_t:gt;r.angularVelocity.x+=(i-r.angularVelocity.x)*Math.min(1,a*e),r.angularVelocity.x*=Math.exp(-3.2*e);let o=0;s(Pt)&&(o+=1),s(Ft)&&--o,t&&(t.turn!==0||o===0)&&(o=Math.max(-1,Math.min(1,o+t.turn)));let f=o*vt,p=f===0?bt:yt;r.angularVelocity.y+=(f-r.angularVelocity.y)*Math.min(1,p*e);let m=wt*Math.abs(r.angularVelocity.y)/vt,h=0;s(It)&&(h+=1),s(Lt)&&--h;let g=r.angularVelocity.y/vt*xt+h*St;r.bankAngle+=(g-r.bankAngle)*Math.min(1,Ct*e),r.angularVelocity.z=0,l.setFromAxisAngle(ft,(r.angularVelocity.x+m)*e),u.setFromAxisAngle(pt,r.angularVelocity.y*e),r.quaternion.multiply(l).multiply(u),r.quaternion.normalize(),d.setFromQuaternion(r.quaternion,`YXZ`),Math.abs(d.x)<1.35&&(d.z=0,r.quaternion.setFromEuler(d));let _=s(At)||(t?.thrust??!1),v=s(jt)||(t?.brake??!1);_&&(r.hasThrusted=!0),c.set(0,0,-1).applyQuaternion(r.quaternion);let y=r.velocity.length();if(_){let t=Math.max(0,1-(y/Dt)**2);r.velocity.addScaledVector(c,54*t*e)}if(v&&y>.05){let t=r.velocity.clone().normalize(),n=Math.min(Tt*e,y);r.velocity.addScaledVector(t,-n)}r.velocity.multiplyScalar(Et),r.position.addScaledVector(r.velocity,e),r.speed=r.velocity.length();let b=+!!_,x=_?Ot:kt;r.thrustLevel+=(b-r.thrustLevel)*Math.min(1,x*e),r.brakeLevel+=(+!!v-r.brakeLevel)*Math.min(1,4*e)},dispose(){window.removeEventListener(`keydown`,i),window.removeEventListener(`keyup`,a),window.removeEventListener(`blur`,o),n.clear()}}}var Bt=52,Vt=.12;function Ht(e,t,n){return Math.max(t,Math.min(n,e))}function Ut(e){let t=Math.abs(e);return t<Vt?0:Math.sign(e)*((t-Vt)/(1-Vt))}function Wt(e){let t={pitch:0,turn:0,thrust:!1,brake:!1};if(!window.matchMedia(`(pointer: coarse)`).matches)return{input:t,active:!1,setArmed(){},dispose(){}};let n=document.createElement(`div`);n.className=`v4-touch is-prelaunch`,n.setAttribute(`aria-hidden`,`true`),n.innerHTML=`
    <div class="v4-touch__stick-zone" aria-hidden="true">
      <div class="v4-touch__stick-ring"></div>
      <div class="v4-touch__stick-knob"></div>
    </div>
    <div class="v4-touch__actions">
      <button type="button" class="v4-touch__btn v4-touch__btn--brake" data-action="brake" aria-label="Hamowanie">HAM</button>
      <button type="button" class="v4-touch__btn v4-touch__btn--thrust" data-action="thrust" aria-label="Ciąg główny">CIĄG</button>
    </div>
  `,e.appendChild(n);let r=n.querySelector(`.v4-touch__stick-zone`),i=n.querySelector(`.v4-touch__stick-knob`),a=n.querySelector(`[data-action="thrust"]`),o=n.querySelector(`[data-action="brake"]`),s=null,c=0,l=0;function u(){s=null,t.pitch=0,t.turn=0,i.style.transform=`translate(-50%, -50%)`}function d(e,n){let r=e-c,a=n-l,o=Math.hypot(r,a),s=o>Bt?Bt/o:1,u=r*s/Bt,d=a*s/Bt;i.style.transform=`translate(calc(-50% + ${u*Bt}px), calc(-50% + ${d*Bt}px))`,t.pitch=Ut(Ht(-d,-1,1)),t.turn=Ut(Ht(u,-1,1))}let f=e=>{if(s!==null)return;s=e.pointerId;let t=r.getBoundingClientRect();c=t.left+t.width/2,l=t.top+t.height/2,d(e.clientX,e.clientY);try{r.setPointerCapture(e.pointerId)}catch{}e.preventDefault()},p=e=>{e.pointerId===s&&(d(e.clientX,e.clientY),e.preventDefault())},m=e=>{e.pointerId===s&&(r.releasePointerCapture(e.pointerId),u(),e.preventDefault())};r.addEventListener(`pointerdown`,f),r.addEventListener(`pointermove`,p),r.addEventListener(`pointerup`,m),r.addEventListener(`pointercancel`,m);let h=(e,n,r)=>{t[r]=n,e.classList.toggle(`is-active`,n)},g=(e,t)=>{let n=n=>{h(e,!0,t);try{e.setPointerCapture(n.pointerId)}catch{}n.preventDefault()},r=n=>{e.hasPointerCapture(n.pointerId)&&e.releasePointerCapture(n.pointerId),h(e,!1,t),n.preventDefault()};return e.addEventListener(`pointerdown`,n),e.addEventListener(`pointerup`,r),e.addEventListener(`pointercancel`,r),()=>{e.removeEventListener(`pointerdown`,n),e.removeEventListener(`pointerup`,r),e.removeEventListener(`pointercancel`,r)}},_=g(a,`thrust`),v=g(o,`brake`),y=()=>{u(),h(a,!1,`thrust`),h(o,!1,`brake`)};return window.addEventListener(`blur`,y),{input:t,active:!0,setArmed(e){n.classList.toggle(`is-prelaunch`,!e),n.setAttribute(`aria-hidden`,e?`false`:`true`),e||(u(),h(a,!1,`thrust`),h(o,!1,`brake`))},dispose(){window.removeEventListener(`blur`,y),r.removeEventListener(`pointerdown`,f),r.removeEventListener(`pointermove`,p),r.removeEventListener(`pointerup`,m),r.removeEventListener(`pointercancel`,m),_(),v(),n.remove()}}}var Z=new v(0,0,0),Gt=[{id:`mint`,position:new v(784,126,-364),radius:40,color:3003583},{id:`plumm`,position:new v(-588,-196,728),radius:34,color:9071615},{id:`idrive`,position:new v(420,308,1176),radius:28,color:16762977},{id:`agentic`,position:new v(-1092,-84,-840),radius:45,color:16098596}],Kt=55,qt=60,Jt=58,Yt=62,Xt=5.2,Zt=10,Qt=16,$t=50,en=.95,tn=.37,nn={length:34,span:7.4,height:3.3},rn=.45,an=.9,Q=new v(0,1,0),on=new v(0,0,-1),sn=new v(0,1,0);function cn(e,t){return!Number.isFinite(e.x+e.y+e.z)||e.lengthSq()<1e-10?t.clone():e.normalize()}function ln(e){let t=O.clamp(e,0,1);return t*t*(3-2*t)}function un(e){let t=e?.length,n=e?.span,r=e?.height;return{length:Number.isFinite(t)&&t>8?t:nn.length,span:Number.isFinite(n)&&n>2?n:nn.span,height:Number.isFinite(r)&&r>1?r:nn.height}}function dn(e,t){let n=t>0&&t<.85,r=e.length*(n?1.22:1.08);return{side:r*(n?.16:.22),height:Math.max(e.height*2.55,n?7.6:8.4),back:r,lookAhead:e.length*(n?.55:.58),lookHeight:e.height*.42}}function fn(e){return e>0&&e<.62?{fov:55,sideOverBack:.24,heightOverBack:.5,widthTarget:.4,cyTarget:.54,bottomNdc:-.62,lookAheadMul:.9,lookLiftMul:2.2}:e>0&&e<.85?{fov:53,sideOverBack:.26,heightOverBack:.46,widthTarget:.38,cyTarget:.56,bottomNdc:-.66,lookAheadMul:.8,lookLiftMul:2}:{fov:$t,sideOverBack:.32,heightOverBack:.48,widthTarget:tn,cyTarget:.62,bottomNdc:-.74,lookAheadMul:.55,lookLiftMul:2.1}}function pn(e,t){let n=un(t),r=[];for(let e of[-.5,.5])for(let t of[-.5,.5])for(let i of[-.5,.5])r.push(new v(e*n.span,t*n.height,i*n.length));let i=new v,a=new v,o=new v,s=new v,c=new v,l=new v,u=new v,d=dn(n,1.6),f=new v(d.side,d.height,d.back),p=new v,m=new v,h=new v,g=new v,_=new v,y=new F,b=new F,x=new v,S=new F,C=new re;C.up.copy(Q);let w=0,T=$t,E=`launch`,D=0,k=!1;e.fov=Kt,e.updateProjectionMatrix();function A(t,o){let s=e.aspect>.05?e.aspect:1.6,u=fn(s);T=u.fov,c.set(0,0,-1).applyQuaternion(o),cn(c,on),l.set(0,1,0).applyQuaternion(o),cn(l,sn),h.set(1,0,0).applyQuaternion(o),h.lengthSq()<1e-8&&h.crossVectors(c,Q),h.normalize(),C.near=e.near,C.far=e.far,C.aspect=s,C.fov=T,C.up.copy(Q);let d=Math.hypot(1,u.heightOverBack,u.sideOverBack),f=O.degToRad(T),p=2*Math.atan(Math.tan(f/2)*s),m=(n.length*.72+n.span*.85)/Math.max(.12,u.widthTarget*2*Math.tan(p/2)),v=n.length*1.05,b=n.length*3.2;m=O.clamp(m,v,b);let x=n.length*u.lookAheadMul,S=n.height*u.lookLiftMul,w=n.length*.12,E=n.length*2.2,D=()=>{let e=m/d;g.copy(t).addScaledVector(c,-e).addScaledVector(Q,e*u.heightOverBack).addScaledVector(h,e*u.sideOverBack),_.copy(t).addScaledVector(c,x).addScaledVector(Q,S),C.fov=T,C.position.copy(g),C.lookAt(_),C.updateProjectionMatrix(),C.updateMatrixWorld(!0)};for(let e=0;e<10;e++){D();let e=1/0,s=-1/0,c=1/0,l=-1/0;for(let n of r)i.copy(n).applyQuaternion(o).add(t),a.copy(i).project(C),Number.isFinite(a.x+a.y)&&(e=Math.min(e,a.x),s=Math.max(s,a.x),c=Math.min(c,a.y),l=Math.max(l,a.y));if(!Number.isFinite(e))break;let d=(s-e)*.5,f=.5-(c+l)*.25,p=c<u.bottomNdc,h=e<-.9||s>.9||l>.92||p;if(p){x=Math.max(w,x*.78),S=Math.max(n.height*.3,S*.88),m=Math.min(b,m*1.07);continue}if(h){m=Math.min(b,m*1.08);continue}if(d>.02){let e=m*(d/u.widthTarget);m=O.clamp(m+(e-m)*.55,v,b)}f<u.cyTarget-.04?(x=Math.min(E,x+n.length*.06),S=Math.min(n.height*5,S+n.height*.2)):f>u.cyTarget+.05&&(x=Math.max(w,x-n.length*.08),S=Math.max(n.height*.3,S-n.height*.18)),a.copy(Z).project(C),Number.isFinite(a.y)&&.5-a.y*.5>.44&&!p&&(x=Math.min(E,x+n.length*.05)),x=O.clamp(x,w,E),S=O.clamp(S,n.height*.3,n.height*5)}D(),C.up.copy(Q),C.lookAt(_),y.copy(C.quaternion)}function j(){e.position.copy(g),e.quaternion.copy(y),e.up.copy(Q),Math.abs(e.fov-T)>.01&&(e.fov=T,e.updateProjectionMatrix())}function M(t,r){E=`launch`,D=0,k=!1,w=0,p.set(0,0,0);let i=dn(n,e.aspect>.05?e.aspect:1.6);f.set(i.side,i.height,i.back),A(t,r),j()}function N(t,r,i,a,d){let h=Number.isFinite(t)&&t>0?Math.min(t,.05):1/60,g=d?Math.min(Math.hypot(d.x,d.y),12):0,_=d?O.clamp(-d.y*rn,-.9,an):0,v=d?O.clamp(d.x*rn,-.9,an):0,y=1-Math.exp(-8*h);p.x+=(_-p.x)*y,p.y+=(v-p.y)*y;let x=O.clamp(Number.isFinite(a)?a:0,0,1),S=x*Xt;w+=(S-w)*(1-Math.exp(-4.5*h));let T=dn(n,e.aspect>.05?e.aspect:1.6);u.set(T.side+p.x,T.height+p.y,T.back+w);let E=1-Math.exp(-(Zt+g*Qt)*h);f.lerp(u,E),o.copy(f).applyQuaternion(i).add(r),c.set(0,0,-1).applyQuaternion(i),cn(c,on),l.set(0,1,0).applyQuaternion(i),cn(l,sn),s.copy(r).addScaledVector(c,T.lookAhead).addScaledVector(l,T.lookHeight),C.position.copy(o),m.copy(s).sub(o),m.lengthSq()>1e-8?(m.normalize(),C.up.copy(Math.abs(m.dot(Q))>.92?l:Q)):C.up.copy(Q),C.lookAt(s),b.copy(C.quaternion);let D=e.aspect>0&&e.aspect<.85,k=D?Jt:Kt,A=D?Yt:qt;return{fov:O.lerp(k,A,x*x)}}function P(t){e.position.copy(o),e.quaternion.copy(b),e.up.copy(C.up),Math.abs(e.fov-t)>.01&&(e.fov=t,e.updateProjectionMatrix())}return{holdLaunch:M,getPhase(){return E},update(t,n,r,i,a,s,c){if(!c.hasThrusted){M(n,r);return}k||(k=!0,A(n,r),x.copy(e.position),S.copy(e.quaternion),c.reducedMotion?(E=`chase`,D=1):(E=`blend`,D=0));let l=N(t,n,r,i,s);if(E===`blend`){D=Math.min(1,D+(Number.isFinite(t)&&t>0?Math.min(t,.05):1/60)/en);let n=ln(D);e.position.lerpVectors(x,o,n),e.quaternion.slerpQuaternions(S,b,n),e.up.copy(Q).lerp(C.up,n).normalize();let r=O.lerp(T,l.fov,n);Math.abs(e.fov-r)>.01&&(e.fov=r,e.updateProjectionMatrix()),D>=1&&(E=`chase`);return}P(l.fov)}}}function mn(e){let t=Math.floor(Math.max(0,e)/100),n=t%10,r=Math.floor(t/10),i=r%60,a=Math.floor(r/60);return`${String(a).padStart(2,`0`)}:${String(i).padStart(2,`0`)}.${n}`}function hn(e){let t=new Date(e);return Number.isNaN(t.getTime())?`--.--`:`${String(t.getDate()).padStart(2,`0`)}.${String(t.getMonth()+1).padStart(2,`0`)}`}function gn(e,t){let n=e.match(/[^.!?]+[.!?]+(\s+|$)/g);return!n||n.length===0?e.trim():n.slice(0,t).join(``).trim()}var _n={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`};function vn(e){return e.replace(/[&<>"']/g,e=>_n[e]??e)}function yn(e){if(!e)return!1;let t=e.trim();if(!t||t===`#`||t.startsWith(`#`))return!1;try{let e=new URL(t);return e.protocol===`http:`||e.protocol===`https:`}catch{return!1}}var bn=`https://marcinbochenek.com`,xn=8e3,Sn=.4;function Cn(e,t={}){let n=typeof location<`u`&&new URLSearchParams(location.search).has(`debug`);for(let t of e.querySelectorAll(`.stats, #stats, [class*="fps"]`))t.remove();let r=t.touchActive??!1,i=t.launchByTap??r,a=r?`<span>Lewy drążek</span> — lot · <span>Ciąg</span> — napęd · <span>Ham</span> — hamowanie`:`<span>W/S</span> — pochylenie · <span>A/D</span> — skręt · <span>Spacja</span> — ciąg · <span>Shift</span> — hamowanie`,o=i?`Dotknij, aby uruchomić silniki`:`Naciśnij <span class="v4-hud__start-keys">Spację</span>, aby uruchomić silniki`,s=document.createElement(`div`);s.className=`v4-hud`,s.innerHTML=`
    <div class="v4-hud__panel v4-hud__speed">
      <div class="v4-hud__label">PRĘDKOŚĆ</div>
      <div class="v4-hud__speed-row">
        <span class="v4-hud__speed-value">0</span>
        <span class="v4-hud__speed-unit">u/s</span>
      </div>
      <div class="v4-hud__thrust-bar"><div class="v4-hud__thrust-fill"></div></div>
    </div>

    <div class="v4-hud__panel v4-hud__mission-status">
      <div class="v4-hud__label">CZAS MISJI</div>
      <div class="v4-hud__timer">00:00.0</div>
      <div class="v4-hud__pips">${Gt.map(e=>`<span class="v4-hud__pip" data-planet="${e.id}"></span>`).join(``)}</div>
    </div>
    ${n?`<div class="v4-hud__panel v4-hud__fps" hidden>fps</div>`:``}

    <div class="v4-hud__panel v4-hud__mission">
      Misja: znajdź nowoczesną stronę dla swojego biznesu
    </div>

    <div class="v4-hud__warning">Uwaga: studnia grawitacyjna</div>

    ${i?`<button type="button" class="v4-hud__start-prompt v4-hud__start-prompt--touch">${o}</button>`:`<div class="v4-hud__start-prompt">${o}</div>`}

    <div class="v4-hud__legend" aria-hidden="true">
      ${a}
    </div>

    <div class="v4-hud__links">
      <a href="/v4/assets/ATTRIBUTION.md" target="_blank" rel="noopener">Assety i licencje</a>
      <a href="${bn}">&larr; klasyczne portfolio</a>
    </div>
  `,e.appendChild(s);let c=s.querySelector(`.v4-hud__speed-value`),l=s.querySelector(`.v4-hud__thrust-fill`),u=s.querySelector(`.v4-hud__legend`),d=s.querySelector(`.v4-hud__start-prompt`);i&&t.onLaunch&&d.addEventListener(`pointerdown`,e=>{e.preventDefault(),t.onLaunch?.()});let f=s.querySelector(`.v4-hud__timer`),p=s.querySelector(`.v4-hud__warning`),m=Array.from(s.querySelectorAll(`.v4-hud__pip`)),h=s.querySelector(`.v4-hud__fps`),g=performance.now(),_=0,v=0,y=Sn*54,b=y*.78,x=!1,S=0,C=!1;function w(){window.clearTimeout(S),S=window.setTimeout(()=>{u.classList.remove(`is-visible`),u.setAttribute(`aria-hidden`,`true`)},xn)}return{update(e){if(c.textContent=String(Math.round(e.speed)).padStart(2,`0`),l.style.transform=`scaleX(${Math.max(0,Math.min(1,e.thrust))})`,e.hasThrusted&&!x&&(x=!0,d.classList.add(`is-hidden`),u.classList.add(`is-visible`),u.setAttribute(`aria-hidden`,`false`),w()),f.textContent=mn(e.missionMs),h){let e=performance.now(),t=e-g;if(g=e,t>.75&&t<250){let e=1e3/t;_=v===0?e:_*.88+e*.12,v+=1,v>=8&&_>=1&&(h.hidden=!1,h.textContent=`${Math.round(_)} fps`)}}C=C?e.gravityAccel>b:e.gravityAccel>y,p.classList.toggle(`is-visible`,C);for(let t of m){let n=t.dataset.planet;t.classList.toggle(`is-found`,e.discovered.has(n))}},reset(){x=!1,C=!1,window.clearTimeout(S),d.classList.remove(`is-hidden`),u.classList.remove(`is-visible`),u.setAttribute(`aria-hidden`,`true`),p.classList.remove(`is-visible`)},dispose(){window.clearTimeout(S),s.remove()}}}var wn=108,Tn=wn,En=wn,Dn=Tn,On=Tn*1.012,kn=.92,An=Tn*1.08,jn=Tn*3.05,Mn=jn*1.38,Nn=7.5,Pn=.94,Fn=4,In=2,Ln=Tn*1.78,Rn=Ln,zn=`
  vec2 diskSpun(float cu, float cv, float rad, float omega, float time) {
    vec2 dir = vec2(cu, cv) / max(rad, 1.0e-4);
    float ca = cos(time * omega);
    float sa = sin(time * omega);
    return vec2(dir.x * ca + dir.y * sa, -dir.x * sa + dir.y * ca);
  }
`,Bn=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`,Vn=`
  precision highp float;

  uniform vec3 uBHPos;
  uniform float uHorizonR;
  uniform float uShadowR;
  uniform float uPhotonR;
  uniform float uPhotonWidth;
  uniform float uDiskInner;
  uniform float uDiskOuter;
  uniform float uInfluenceR;
  uniform vec3 uDiskU;
  uniform vec3 uDiskV;
  uniform vec3 uDiskN;
  uniform float uTime;
  uniform float uBendK;
  uniform int uArcSamples;
  uniform sampler2D uSky;
  uniform float uSkyRot;
  uniform vec3 uCamPos;
  uniform vec3 uCamRight;
  uniform vec3 uCamUp;
  uniform vec3 uCamFwd;
  uniform vec2 uResolution;
  uniform float uTanHalfFov;
  uniform float uAspect;

  varying vec2 vUv;

  ${Se}
  ${zn}

  const float PI = 3.141592653589793;

  vec2 equirectUv(vec3 dir) {
    float u = atan(dir.z, dir.x) / (2.0 * PI) + 0.5;
    float v = asin(clamp(dir.y, -1.0, 1.0)) / PI + 0.5;
    return vec2(u, v);
  }

  vec3 sampleSky(vec3 dir) {
    vec3 d = normalize(dir);
    float c = cos(uSkyRot);
    float s = sin(uSkyRot);
    vec3 rd = vec3(c * d.x + s * d.z, d.y, -s * d.x + c * d.z);
    vec2 uvA = equirectUv(rd);
    vec2 uvB = vec2(fract(uvA.x + 0.5) - 0.5, uvA.y);
    return (fwidth(uvA.x) <= fwidth(uvB.x)
      ? texture2D(uSky, uvA).rgb
      : texture2D(uSky, uvB).rgb);
  }

  vec3 diskTemperatureColor(float t) {
    vec3 hot = vec3(1.0, 0.969, 0.91);
    vec3 amber = vec3(1.0, 0.784, 0.38);
    vec3 ember = vec3(0.91, 0.463, 0.102);
    vec3 c = mix(amber, ember, smoothstep(0.18, 0.82, t));
    c = mix(hot, c, smoothstep(0.0, 0.16, t));
    return c;
  }

  vec3 shadeDiskCrossing(vec3 crossP, vec3 d, float imageFalloff) {
    float cu = dot(crossP, uDiskU);
    float cv = dot(crossP, uDiskV);
    float rad = length(vec2(cu, cv));
    if (rad <= uDiskInner || rad >= uDiskOuter) return vec3(0.0);

    float tRad = (rad - uDiskInner) / (uDiskOuter - uDiskInner);
    float omega = 2.0 / pow(rad / uDiskInner, 1.5);
    vec2 spun = diskSpun(cu, cv, rad, omega, uTime);
    float streak = fbm3(vec3(rad * 0.08, spun * 3.4), 5);
    float streak2 = fbm3(vec3(rad * 0.18, spun * 6.2), 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec2 dir = vec2(cu, cv) / max(rad, 1.0e-4);
    vec3 tangent = normalize(-dir.y * uDiskU + dir.x * uDiskV);
    float approach = dot(tangent, -d);
    float beam = mix(0.36, 1.58, smoothstep(-0.55, 0.55, approach));
    vec3 temp = diskTemperatureColor(tRad);
    temp = mix(temp * vec3(0.42, 0.55, 1.08), temp * vec3(1.18, 0.9, 0.62), smoothstep(-0.5, 0.5, approach));

    float bandA = smoothstep(0.0, 0.05, tRad) * (1.0 - smoothstep(0.12, 0.22, tRad));
    float bandB = smoothstep(0.18, 0.28, tRad) * (1.0 - smoothstep(0.38, 0.50, tRad));
    float bandC = smoothstep(0.42, 0.54, tRad) * (1.0 - smoothstep(0.66, 0.78, tRad));
    float bandD = smoothstep(0.72, 0.82, tRad) * (1.0 - smoothstep(0.92, 1.0, tRad));
    float bands = bandA * 1.05 + bandB * 0.82 + bandC * 0.62 + bandD * 0.42;
    float innerFade = smoothstep(0.0, 0.04, tRad);
    float outerFade = 1.0 - smoothstep(0.72, 0.98, tRad);
    float brightness = (0.22 + streakMix * 0.58) * beam * (0.22 + bands) * innerFade * outerFade;
    return temp * brightness * imageFalloff;
  }

  vec3 cameraRay() {
    vec2 ndc = (gl_FragCoord.xy / max(uResolution, vec2(1.0))) * 2.0 - 1.0;
    return normalize(
      uCamFwd
      + ndc.x * uTanHalfFov * uAspect * uCamRight
      + ndc.y * uTanHalfFov * uCamUp
    );
  }

  void main() {
    vec2 q = vUv * 2.0 - 1.0;
    float qR = length(q);
    if (qR > 0.98) discard;
    float qFade = 1.0 - smoothstep(0.84, 0.96, qR);

    vec3 rd = cameraRay();
    vec3 w0 = uCamPos - uBHPos;

    float b2 = dot(w0, w0) - pow(dot(w0, rd), 2.0);
    float b = sqrt(max(b2, 0.0));

    // Apparent shadow interior: additive never paints the core.
    if (b < uShadowR * 0.995) discard;
    if (b > uInfluenceR * 0.92) discard;

    float inflFade = 1.0 - smoothstep(uInfluenceR * 0.70, uInfluenceR * 0.88, b);

    vec3 peri = w0 - rd * dot(w0, rd);
    float periLen = length(peri);
    vec3 periN = periLen > 1e-4 ? peri / periLen : uDiskN;
    float polar = abs(dot(periN, uDiskN));

    vec3 inPlane = peri - uDiskN * dot(peri, uDiskN);
    vec3 camPlane = w0 - uDiskN * dot(w0, uDiskN);
    vec3 az = length(inPlane) > 1e-3
      ? normalize(inPlane)
      : (length(camPlane) > 1e-3 ? normalize(camPlane) : uDiskU);
    vec3 farAz = az;
    if (dot(farAz, w0) > 0.0) farAz = -farAz;

    vec3 tangent = normalize(cross(uDiskN, az));
    float approach = dot(tangent, -rd);

    vec3 accum = vec3(0.0);

    // Thin photon rim around the whole silhouette — not a decorative hoop.
    float rim = exp(-pow((b - uPhotonR) / uPhotonWidth, 2.0));
    rim *= mix(0.28, 1.0, smoothstep(-0.45, 0.45, approach));
    rim *= 0.62 + 0.38 * (1.0 - smoothstep(0.18, 0.82, polar));

    // Far-side Einstein arcs: Gaussian in impact-parameter (analytic, planar
    // coverage so this CAN be wider than a sphere-triangle without filling
    // fans) gated to high polar so it cannot become a gold ring.
    float polarCap = smoothstep(0.18, 0.56, polar);
    float limb = exp(-pow((b - uPhotonR) / (uPhotonWidth * 5.4), 2.0));
    float capW = polarCap * limb * inflFade;
    if (capW > 0.04) {
      float sampleW = capW * (1.15 / float(max(uArcSamples, 1)));
      for (int i = 0; i < 4; i++) {
        if (i >= uArcSamples) break;
        float tRad = 0.07 + float(i) * 0.14;
        vec3 farP = farAz * mix(uDiskInner, uDiskOuter, tRad);
        accum += shadeDiskCrossing(farP, rd, sampleW);
      }
    }

    // Local radial sky warp around the photon sphere. Signed (bent − unbent)
    // so it cannot stamp a halo. Falloff hits 0 before the impostor edge.
    float warpW = smoothstep(uShadowR * 1.002, uPhotonR * 1.05, b)
      * (1.0 - smoothstep(uPhotonR * 1.18, uInfluenceR * 0.82, b));
    if (warpW > 0.02) {
      float defl = uBendK * 0.20 * (uHorizonR / max(b, uPhotonR));
      vec3 bent = normalize(rd - periN * defl * warpW);
      accum += (sampleSky(bent) - sampleSky(rd)) * warpW * 0.62;
    }

    vec3 color = (accum + vec3(1.0, 0.969, 0.91) * rim * 0.40) * qFade * inflFade;
    if (dot(color, vec3(0.3, 0.55, 0.15)) < 0.01) discard;

    gl_FragColor = vec4(color, 1.0);
    ${be}
  }
`,Hn=`
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,Un=`
  precision highp float;
  uniform vec3 uBHPos;
  uniform float uDiskInner;
  uniform float uDiskOuter;
  uniform float uShadowR;
  uniform vec3 uDiskU;
  uniform vec3 uDiskV;
  uniform vec3 uDiskN;
  uniform float uTime;
  uniform float uCamNear;
  uniform float uRayPlane;
  uniform float uHideFar;
  uniform mat4 uViewProj;
  varying vec3 vWorldPos;

  ${Se}
  ${zn}

  vec3 diskTemperatureColor(float t) {
    vec3 hot = vec3(0.99, 0.94, 0.84);
    vec3 amber = vec3(0.94, 0.66, 0.28);
    vec3 ember = vec3(0.62, 0.28, 0.08);
    vec3 c = mix(amber, ember, smoothstep(0.18, 0.8, t));
    c = mix(hot, c, smoothstep(0.0, 0.14, t));
    return c;
  }

  vec3 shadeDiskHit(vec3 hit, vec3 rd) {
    vec3 rel = hit - uBHPos;
    float cu = dot(rel, uDiskU);
    float cv = dot(rel, uDiskV);
    float rad = length(vec2(cu, cv));
    if (rad <= uDiskInner || rad >= uDiskOuter) return vec3(0.0);

    float tRad = (rad - uDiskInner) / (uDiskOuter - uDiskInner);
    float omega = 2.0 / pow(rad / uDiskInner, 1.5);
    vec2 spun = diskSpun(cu, cv, rad, omega, uTime);
    float streak = fbm3(vec3(rad * 0.055, spun * 3.4), 5);
    float streak2 = fbm3(vec3(rad * 0.14, spun * 6.2), 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec2 dir = vec2(cu, cv) / max(rad, 1.0e-4);
    vec3 tangent = normalize(-dir.y * uDiskU + dir.x * uDiskV);
    float approach = dot(tangent, -rd);
    float beam = mix(0.36, 1.55, smoothstep(-0.55, 0.55, approach));
    vec3 temp = diskTemperatureColor(tRad);
    temp = mix(temp * vec3(0.4, 0.52, 1.06), temp * vec3(1.16, 0.88, 0.58), smoothstep(-0.5, 0.5, approach));

    float bandA = smoothstep(0.0, 0.05, tRad) * (1.0 - smoothstep(0.12, 0.22, tRad));
    float bandB = smoothstep(0.18, 0.28, tRad) * (1.0 - smoothstep(0.38, 0.50, tRad));
    float bandC = smoothstep(0.42, 0.54, tRad) * (1.0 - smoothstep(0.66, 0.78, tRad));
    float bandD = smoothstep(0.72, 0.82, tRad) * (1.0 - smoothstep(0.92, 1.0, tRad));
    float bands = bandA * 1.05 + bandB * 0.82 + bandC * 0.62 + bandD * 0.42;
    float innerFade = smoothstep(0.0, 0.04, tRad);
    // Radiance dies before the visible outer radius; the mesh continues to
    // DISK_GEO_OUTER so a tessellated rim cannot appear as a hard board edge.
    float outerFade = 1.0 - smoothstep(0.72, 0.98, tRad);
    float brightness = (0.2 + streakMix * 0.6) * beam * (0.24 + bands) * innerFade * outerFade;
    return temp * brightness;
  }

  void main() {
    vec3 rd = normalize(vWorldPos - cameraPosition);
    vec3 hit;
    float tHit;

    if (uRayPlane > 0.5) {
      // Proxy sphere: intersect the disk plane along this ray so a camera
      // sitting inside the disk radius cannot near-clip a paper-thin ring.
      float denom = dot(rd, uDiskN);
      if (abs(denom) < 1.0e-5) discard;
      tHit = dot(uBHPos - cameraPosition, uDiskN) / denom;
      if (tHit < uCamNear * 1.8) discard;
      hit = cameraPosition + rd * tHit;
    } else {
      hit = vWorldPos;
      tHit = length(vWorldPos - cameraPosition);
    }

    vec3 rel = hit - uBHPos;
    float cu = dot(rel, uDiskU);
    float cv = dot(rel, uDiskV);
    float rad = length(vec2(cu, cv));
    if (rad <= uDiskInner || rad >= uDiskOuter) discard;

    vec3 oc = cameraPosition - uBHPos;
    float bOc = dot(oc, rd);
    float cOc = dot(oc, oc) - uShadowR * uShadowR;
    float discOc = bOc * bOc - cOc;
    if (discOc > 0.0) {
      float tSph = -bOc - sqrt(discOc);
      if (tSph < 0.0) tSph = -bOc + sqrt(discOc);
      if (tSph > 0.02 && tSph < tHit - 0.02) discard;
    }

    float nearFade = smoothstep(uCamNear * 3.0, uCamNear * 14.0, tHit);
    vec3 color = shadeDiskHit(hit, rd) * nearFade;

    // Hide the Euclidean FAR half of the ring (Saturn continuation behind
    // the hole) so analytical polar arcs own that light. Split is in the
    // DISK PLANE toward the camera — not a world hemisphere (that chopped
    // the left arm when the camera was offset, and cut a chord in close
    // flight). Degenerate when looking face-on (top-down keeps the full ring).
    if (uHideFar > 0.5) {
      vec3 camRel = cameraPosition - uBHPos;
      float camDist = length(camRel);
      float faceOn = camDist > 1.0 ? abs(dot(camRel / camDist, uDiskN)) : 1.0;
      vec3 camInDisk = camRel - uDiskN * dot(camRel, uDiskN);
      float cil = length(camInDisk);
      // Face-on (top/down): keep the full ring. Edge-on: hide the Euclidean
      // far half so polar arcs own that light. Threshold is on camera vs
      // disk normal — in-plane leftover from a 7.5° tilt must not cut a
      // semicircle.
      if (faceOn < 0.68 && cil > uShadowR * 0.5) {
        float alongN = dot(rel, camInDisk / cil) / max(rad, 1.0);
        color *= smoothstep(-0.42, -0.04, alongN);
      }
    }

    if (dot(color, vec3(0.3, 0.55, 0.15)) < 0.008) discard;

    gl_FragColor = vec4(color, 1.0);
    ${be}

    if (uRayPlane > 0.5) {
      vec4 clipHit = uViewProj * vec4(hit, 1.0);
      gl_FragDepth = clipHit.z / clipHit.w * 0.5 + 0.5;
    } else {
      gl_FragDepth = gl_FragCoord.z;
    }
  }
`;function Wn(e,t){let n=e.material;return{name:t,visible:e.visible,renderOrder:e.renderOrder,depthTest:n.depthTest,depthWrite:n.depthWrite,transparent:n.transparent,blending:n.blending,side:n.side}}function Gn(e,t,n){let r=O.degToRad(Nn),i=new v(0,Math.cos(r),Math.sin(r)).normalize(),a=new v(1,0,0),o=new v().crossVectors(i,a).normalize();a.crossVectors(o,i).normalize();let s=new P(2,2),c=new A({uniforms:{uBHPos:{value:Z.clone()},uHorizonR:{value:En},uShadowR:{value:Tn},uPhotonR:{value:On},uPhotonWidth:{value:kn},uDiskInner:{value:An},uDiskOuter:{value:jn},uInfluenceR:{value:Ln},uDiskU:{value:a},uDiskV:{value:o},uDiskN:{value:i},uTime:{value:0},uBendK:{value:Pn},uArcSamples:{value:t?In:Fn},uSky:{value:e},uSkyRot:{value:0},uCamPos:{value:new v},uCamRight:{value:new v},uCamUp:{value:new v},uCamFwd:{value:new v},uResolution:{value:new B(1,1)},uTanHalfFov:{value:1},uAspect:{value:1}},vertexShader:Bn,fragmentShader:Vn,depthTest:!0,depthWrite:!1,transparent:!0,blending:2,toneMapped:!0,side:0}),u=new b(s,c);u.frustumCulled=!1,u.renderOrder=7,u.name=`black-hole-lensing`,u.scale.setScalar(Ln);let d=new N(Dn,64,48),f=new l({color:0,toneMapped:!1,depthWrite:!0,depthTest:!0,transparent:!1,fog:!1});f.colorWrite=!0;let p=new b(d,f);p.name=`black-hole-horizon`,p.renderOrder=0,p.frustumCulled=!1;let m=new l({color:0,toneMapped:!1,depthTest:!0,depthWrite:!1,depthFunc:3,transparent:!0,opacity:1,blending:1,fog:!1,side:0}),h=new b(d,m);h.name=`black-hole-aperture-seal`,h.renderOrder=6,h.frustumCulled=!1;let g=new ne(An,Mn,192,12),_=new A({uniforms:{uBHPos:{value:Z.clone()},uDiskInner:{value:An},uDiskOuter:{value:jn},uShadowR:{value:Tn},uDiskU:{value:a},uDiskV:{value:o},uDiskN:{value:i},uTime:{value:0},uCamNear:{value:.8},uRayPlane:{value:0},uHideFar:{value:1},uViewProj:{value:new k}},vertexShader:Hn,fragmentShader:Un,depthTest:!0,depthWrite:!0,transparent:!1,toneMapped:!0,side:2}),y=new b(g,_);y.name=`black-hole-disk`,y.renderOrder=1,y.quaternion.setFromUnitVectors(new v(0,0,1),i),y.frustumCulled=!1;let x=new N(Mn,64,48),S=new b(x,_);S.name=`black-hole-disk-proxy`,S.renderOrder=1,S.visible=!1,S.frustumCulled=!1;let C=new K;C.name=`black-hole`,C.position.copy(Z),C.add(p),C.add(y),C.add(S),C.add(h),C.add(u);let w=new K;w.name=`black-hole-debug-bounds`,w.visible=!1;let T=new b(new N(Dn,32,24),new l({color:4521932,wireframe:!0,depthTest:!1,toneMapped:!1}));T.name=`black-hole-horizon-wire`;let E=new L(Dn*1.6);E.name=`black-hole-axes`,w.add(T),w.add(E),C.add(w);let D=new v,j=new v,M=new v,F=new v,I=new B;return{object:C,update(e,t,r){c.uniforms.uTime.value=t,c.uniforms.uSkyRot.value=t*Ce,r.updateMatrixWorld(),_.uniforms.uTime.value=t,_.uniforms.uCamNear.value=r.near,_.uniforms.uViewProj.value.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),D.copy(Z).sub(r.position),j.set(0,0,-1).applyQuaternion(r.quaternion),M.set(1,0,0).applyQuaternion(r.quaternion),F.set(0,1,0).applyQuaternion(r.quaternion);let i=D.dot(j),a=D.length(),o=a<Dn+4;c.uniforms.uCamPos.value.copy(r.position),c.uniforms.uCamFwd.value.copy(j),c.uniforms.uCamRight.value.copy(M),c.uniforms.uCamUp.value.copy(F),c.uniforms.uTanHalfFov.value=Math.tan(O.degToRad(r.fov)*.5),c.uniforms.uAspect.value=r.aspect,n.getDrawingBufferSize(I),c.uniforms.uResolution.value.copy(I),u.lookAt(r.position),u.userData.forceHidden||(u.visible=!o&&i>4),h.userData.forceHidden||(h.visible=!o);let s=!!y.userData.forceHidden,l=a<Mn+16;s?(y.visible=!1,S.visible=!1):l?(_.uniforms.uRayPlane.value=1,y.visible=!1,S.visible=!0,_.side=+(a<Mn-1)):(_.uniforms.uRayPlane.value=0,y.visible=!0,S.visible=!1,_.side=2),_.uniforms.uHideFar.value=1},setLayerVisible(e,t){e===`horizon`?(p.visible=t,h.userData.forceHidden||(h.visible=t)):e===`lensing`?(u.userData.forceHidden=!t,u.visible=t):e===`seal`?(h.userData.forceHidden=!t,h.visible=t):(y.userData.forceHidden=!t,y.visible=t,S.visible=!1)},getLayerState(){return{horizon:Wn(p,p.name),seal:Wn(h,h.name),lensing:Wn(u,u.name),disk:Wn(y,y.name)}},getRadii(){return{physicalRs:wn,apparentShadow:Tn,photonRing:On,diskInner:An,diskOuter:jn,diskGeoOuter:Mn,lensShell:Rn}},getDiskFrame(){return{u:a.clone(),v:o.clone(),n:i.clone(),inner:An,outer:jn}},setDebugBounds(e){w.visible=e},dispose(){s.dispose(),c.dispose(),d.dispose(),f.dispose(),m.dispose(),g.dispose(),x.dispose(),_.dispose(),T.geometry.dispose(),T.material.dispose(),E.geometry.dispose(),E.material.dispose()}}}var Kn=`
  precision highp float;

  uniform sampler2D uEarthTex;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  ${_e}
  ${Se}

  void main() {
    vec4 tex = texture2D(uEarthTex, vUv);

    // Ocean discriminant: earth day-map oceans read strongly blue relative to
    // red/green; land is closer to balanced RGB.
    float wet = clamp(tex.b - max(tex.r, tex.g) * 0.62, 0.0, 1.0);
    float oceanMask = smoothstep(0.02, 0.24, wet);

    vec3 deepOcean = vec3(0.02, 0.24, 0.34);
    vec3 shallowOcean = vec3(0.15, 0.83, 0.73);
    vec3 oceanColor = mix(deepOcean, shallowOcean, smoothstep(0.22, 0.8, tex.b));

    vec3 darkLand = vec3(0.07, 0.26, 0.12);
    vec3 lushLand = vec3(0.30, 0.58, 0.24);
    vec3 landColor = mix(darkLand, lushLand, smoothstep(0.15, 0.55, tex.g));

    vec3 base = mix(landColor, oceanColor, oceanMask);

    // Sandy coastline accent — a narrow band right where the mask crosses 0.5.
    float coast = smoothstep(0.38, 0.5, oceanMask) * (1.0 - smoothstep(0.5, 0.62, oceanMask));
    vec3 sand = vec3(0.96, 0.87, 0.70);
    base = mix(base, sand, coast * 0.9);

    // Faint polar ice caps where the source map reads near-white in all channels.
    float ice = smoothstep(0.78, 0.92, min(tex.r, min(tex.g, tex.b)));
    base = mix(base, vec3(0.94, 0.97, 0.98), ice * 0.55);

    // Close-up detail: fine surface grain (coastline texture / terrain
    // stippling) that fades out at range so the far establishing view stays
    // clean and reads as the earlier flat-shaded planet.
    vec3 n = normalize(vNormalW);
    float camDist = length(cameraPosition - vWorldPos);
    float detailFade = 1.0 - smoothstep(uRadius * 2.2, uRadius * 9.0, camDist);
    if (detailFade > 0.003) {
      float grain = fbm3(normalize(vWorldPos) * uRadius * 0.9, 5);
      float grain2 = fbm3(normalize(vWorldPos) * uRadius * 2.6 + 4.7, 3);
      float grainMix = grain * 0.7 + grain2 * 0.3;
      base *= mix(1.0, 0.82 + grainMix * 0.36, detailFade);
    }

    float diffuse = max(dot(n, SUN_DIR), 0.0);
    vec3 color = base * (0.4 + diffuse * 0.85);

    gl_FragColor = vec4(color, 1.0);
    ${be}
  }
`,qn=`
  varying vec3 vLocalDir;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  void main() {
    vLocalDir = normalize(position);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,Jn=`
  precision highp float;
  uniform float uTime;
  uniform float uRadius;
  varying vec3 vLocalDir;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  ${_e}
  ${Se}

  void main() {
    vec3 p = vLocalDir * 3.1 + vec3(uTime * 0.014, uTime * 0.007, -uTime * 0.01);
    float n = fbm3(p, 5);
    float alpha = smoothstep(0.5, 0.74, n);
    if (alpha < 0.02) discard;

    // Close-up wisp detail — a finer, faster-drifting fbm layer folded in only
    // near the camera so distant views keep the clean broad cloud shapes.
    float camDist = length(cameraPosition - vWorldPos);
    float detailFade = 1.0 - smoothstep(uRadius * 2.2, uRadius * 9.0, camDist);
    if (detailFade > 0.003) {
      float wisp = fbm3(vLocalDir * 11.0 + vec3(-uTime * 0.05, uTime * 0.03, 0.0), 4);
      alpha = mix(alpha, clamp(alpha + (wisp - 0.5) * 0.5, 0.0, 1.0), detailFade);
    }

    vec3 nrm = normalize(vNormalW);
    float diffuse = max(dot(nrm, SUN_DIR), 0.0);
    vec3 color = vec3(1.0) * (0.4 + diffuse * 0.7);

    gl_FragColor = vec4(color, alpha * 0.8);
    ${be}
  }
`;function Yn(e,t,n=!1){let r=new K;r.name=`planet-mint`;let[i,a]=n?[96,64]:[128,96],o=new N(e,i,a),s=new A({uniforms:{uEarthTex:{value:t},uRadius:{value:e}},vertexShader:ge,fragmentShader:Kn}),c=new b(o,s);r.add(c);let l=new N(e*1.025,n?64:84,n?44:60),u=new A({uniforms:{uTime:{value:0},uRadius:{value:e}},vertexShader:qn,fragmentShader:Jn,transparent:!0,depthWrite:!1}),d=new b(l,u);d.renderOrder=2,r.add(d);let f=Te(e,16767392,{power:2.3,intensity:1.25});return r.add(f.mesh),{group:r,update(e){c.rotation.y+=e*.018,d.rotation.y+=e*.026,u.uniforms.uTime.value+=e},dispose(){o.dispose(),s.dispose(),l.dispose(),u.dispose(),f.dispose()}}}var Xn=`
  precision highp float;

  uniform sampler2D uCityTex;
  uniform float uTime;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vLocalDir;
  varying vec3 vWorldPos;

  ${_e}
  ${Se}

  void main() {
    vec4 tex = texture2D(uCityTex, vUv);
    float cityLum = clamp(dot(tex.rgb, vec3(0.299, 0.587, 0.114)) * 1.4, 0.0, 1.0);

    // Two separate procedural layers, kept deliberately unequal in brightness
    // so ~70% surface "coverage" doesn't read as a uniform pale wash:
    //  - district: a broad ~70%-area mask, but only a DIM ambient violet lift
    //  - network: a much sparser mask within it, the actual bright light veins
    float cellsA = fbm3(vLocalDir * 13.0, 4);
    float cellsB = fbm3(vLocalDir * 34.0 + 11.3, 3);
    float district = smoothstep(0.28, 0.5, cellsA);
    float network = smoothstep(0.58, 0.7, cellsB) * district;

    vec3 baseDark = vec3(0.03, 0.024, 0.055);
    vec3 districtGlow = vec3(0.15, 0.07, 0.3);
    vec3 networkColor = vec3(0.56, 0.38, 0.92);
    vec3 hotspot = vec3(0.88, 0.7, 1.0);

    vec3 color = baseDark + districtGlow * district;
    color += networkColor * network * 0.95;
    color += hotspot * cityLum * 1.1;

    // Faint day-side lift so the lit hemisphere doesn't look flat black.
    vec3 n = normalize(vNormalW);
    float diffuse = max(dot(n, SUN_DIR), 0.0);
    color += baseDark * (0.55 + diffuse * 1.6);

    // Slow twinkle so the city grid doesn't look static from orbit.
    float coverage = clamp(district * 0.6 + network + cityLum, 0.0, 1.0);
    float twinkle = 0.92 + 0.08 * sin(uTime * 1.3 + cellsA * 40.0);
    color *= mix(1.0, twinkle, coverage);

    // Close-up block-granularity: a much higher-frequency cell layer, only
    // blended in near the camera — individual "city blocks" resolve up close
    // while the distant view keeps the same broad glow pattern as before.
    float camDist = length(cameraPosition - vWorldPos);
    float detailFade = 1.0 - smoothstep(uRadius * 2.0, uRadius * 8.0, camDist);
    if (detailFade > 0.003) {
      float blocksA = fbm3(vLocalDir * 90.0 + 3.3, 3);
      float blocks = smoothstep(0.4, 0.46, blocksA) * (1.0 - smoothstep(0.5, 0.58, blocksA));
      color += networkColor * blocks * coverage * 0.6 * detailFade;
      color *= mix(1.0, 0.88 + blocksA * 0.24, detailFade * coverage);
    }

    gl_FragColor = vec4(color, 1.0);
    ${be}
  }
`;function Zn(e,t,n){let r=new K;r.name=`planet-plumm`;let[i,a]=n?[96,64]:[128,96],o=new N(e,i,a),s=new A({uniforms:{uCityTex:{value:t},uTime:{value:0},uRadius:{value:e}},vertexShader:xe,fragmentShader:Xn}),c=new b(o,s);r.add(c);let u=Te(e,9071615,{power:2.8,intensity:1.35});r.add(u.mesh);let d=[],f=[];if(!n){let t=[{r:e*1.28,speed:.22,tilt:.06,opacity:.55},{r:e*1.48,speed:-.16,tilt:-.09,opacity:.4},{r:e*1.7,speed:.12,tilt:.14,opacity:.3}];for(let n of t){let t=new m(n.r,e*.006,8,160),i=new l({color:11246557,transparent:!0,opacity:n.opacity,blending:2,depthWrite:!1}),a=new b(t,i);a.rotation.x=Math.PI/2+n.tilt,a.renderOrder=2,r.add(a),d.push({mesh:a,speed:n.speed}),f.push({geo:t,mat:i})}}let p=n?20:48,h=new x;{let e=1.8,t=new Float32Array([0,0,-1.8*.55,-.62,.12,e*.45,0,-.1,e*.38,0,0,-1.8*.55,0,-.1,e*.38,.62,.12,e*.45]);h.setAttribute(`position`,new U(t,3)),h.computeVertexNormals()}let g=new l({color:15854847,side:2}),_=new E(h,g,p);_.frustumCulled=!1,r.add(_);let y=[];{let t=(()=>{let e=2636928641;return()=>(e=Math.imul(e^e>>>15,e|1),(e>>>16&65535)/65535)})(),n=new v;for(let r=0;r<p;r++)n.set(t()*2-1,t()*2-1,t()*2-1).normalize(),y.push({quat:new F().setFromAxisAngle(n,t()*Math.PI*2),r:e*(1.16+t()*.42),speed:(.1+t()*.22)*(t()<.5?1:-1),phase:t()*Math.PI*2,bank:(t()-.5)*.9})}let S=new v,C=new v,w=new v,T=new v,D=new v,O=new v(1,1,1),j=new k,M=new F,P=new F,I=new k,L=new v(0,0,1);function R(e){for(let t=0;t<p;t++){let n=y[t],r=n.phase+e*n.speed,i=Math.sign(n.speed)||1;S.set(Math.cos(r)*n.r,0,Math.sin(r)*n.r).applyQuaternion(n.quat),C.set(-Math.sin(r)*i,0,Math.cos(r)*i).applyQuaternion(n.quat).normalize(),w.copy(S).normalize(),D.copy(C).multiplyScalar(-1),T.crossVectors(w,D).normalize(),w.crossVectors(D,T),j.makeBasis(T,w,D),M.setFromRotationMatrix(j),P.setFromAxisAngle(L,n.bank),M.multiply(P),I.compose(S,M,O),_.setMatrixAt(t,I)}_.instanceMatrix.needsUpdate=!0}return R(0),{group:r,update(e,t){c.rotation.y+=e*.014,s.uniforms.uTime.value=t;for(let t of d)t.mesh.rotation.z+=e*t.speed;R(t)},dispose(){o.dispose(),s.dispose(),u.dispose(),h.dispose(),g.dispose(),_.dispose();for(let e of f)e.geo.dispose(),e.mat.dispose()}}}var Qn=1056,$n=`
  precision highp float;

  uniform float uRadius;
  varying vec3 vNormalW;
  varying vec3 vLocalDir;
  varying vec3 vWorldPos;

  ${_e}
  ${Se}

  void main() {
    float macro = fbm3(vLocalDir * 3.4, 4);
    float micro = fbm3(vLocalDir * 14.0 + 5.2, 4);
    float relief = macro * 0.7 + micro * 0.3;

    vec3 darkBasalt = vec3(0.035, 0.033, 0.038);
    vec3 lightBasalt = vec3(0.12, 0.11, 0.115);
    vec3 base = mix(darkBasalt, lightBasalt, smoothstep(0.25, 0.85, relief));

    // Close-up rock detail: a much finer fbm octave faded in only near the
    // camera, so the far view keeps the same clean basalt gradient as before.
    float camDist = length(cameraPosition - vWorldPos);
    float detailFade = 1.0 - smoothstep(uRadius * 2.0, uRadius * 8.0, camDist);
    vec3 fineWobble = vec3(0.0);
    float fineLum = 0.0;
    if (detailFade > 0.003) {
      float fineA = fbm3(vLocalDir * uRadius * 1.6, 4);
      float fineB = fbm3(vLocalDir * uRadius * 1.6 + 9.4, 3);
      float fineC = fbm3(vLocalDir * uRadius * 1.6 + 21.8, 3);
      fineLum = fineA - 0.5;
      fineWobble = (vec3(fineA, fineB, fineC) - 0.5) * detailFade;
      base *= mix(1.0, 1.0 + fineLum * 0.5, detailFade);
    }

    // Fake relief shading: perturb the normal slightly by the noise gradient
    // direction so cratered/ridged patches catch a bit of extra light.
    vec3 n = normalize(vNormalW + (vec3(micro, macro, relief) - 0.5) * 0.12 + fineWobble * 0.1);
    float diffuse = max(dot(n, SUN_DIR), 0.0);
    vec3 color = base * (0.55 + diffuse * 0.95);

    gl_FragColor = vec4(color, 1.0);
    ${be}
  }
`,er=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,tr=`
  precision highp float;
  varying vec2 vUv;
  #define PI 3.14159265359
  void main() {
    // vUv.y wraps around the tube's circular cross-section — a bright band
    // along the outward-facing side, darker asphalt-grey border elsewhere.
    // Anti-alias the core/border edge with fwidth-derived smoothstep width
    // (rather than a fixed constant) so it stays crisp at any screen size —
    // close flybys don't get a jagged edge, distant views don't shimmer/moire.
    float rim = cos(vUv.y * 2.0 * PI - 1.2);
    float edgeAA = max(fwidth(rim), 0.001);
    float core = smoothstep(-0.15 - edgeAA, -0.15 + edgeAA, rim);
    vec3 border = vec3(0.05, 0.045, 0.05);
    vec3 hot = vec3(1.0, 0.87, 0.55);
    vec3 color = mix(border, hot, core);
    gl_FragColor = vec4(color, 1.0);
    ${be}
  }
`,nr=`
  attribute float aSize;
  attribute vec3 aColor;
  attribute float aAlpha;
  attribute float aFadeNear;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float dist = max(-mv.z, 1.0);
    // Glow sprites (aFadeNear=1) dissolve within ~10-34u of the camera so the
    // body + light-dot read takes over; light dots (aFadeNear=0) persist.
    float nearFade = mix(1.0, smoothstep(10.0, 34.0, dist), aFadeNear);
    vAlpha = aAlpha * nearFade;
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * (2600.0 / dist);
  }
`,rr=`
  precision highp float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    float core = smoothstep(1.0, 0.0, d);
    core = pow(core, 1.6) * vAlpha;
    if (core < 0.03) discard;
    gl_FragColor = vec4(vColor * core * 1.6, core);
    ${be}
  }
`,ir=class extends ce{shellRadius;constructor(e,t){super(e,!0,`centripetal`),this.shellRadius=t}getPoint(e,t=new v){return super.getPoint(e,t),t.setLength(this.shellRadius)}},ar=[{kind:`straight`,weight:1.7},{kind:`hairpin`,weight:.6,sign:1},{kind:`straight`,weight:1.3},{kind:`corner`,weight:.8,sign:-1},{kind:`chicane`,weight:.8,sign:1},{kind:`straight`,weight:1.6},{kind:`hairpin`,weight:.6,sign:-1},{kind:`straight`,weight:1.2},{kind:`corner`,weight:.8,sign:1},{kind:`straight`,weight:1.5}];function or(e){let t=e*1.02,n=e*.018,r=ve(Qn),i=ar.reduce((e,t)=>e+t.weight,0),a=r()*Math.PI*2,o=[];for(let e of ar){let t=e.weight/i*Math.PI*2,n=a+t/2,s=e.sign??1;if(e.kind===`straight`)o.push({theta:n+(r()-.5)*t*.3,lat:(r()-.5)*.24});else if(e.kind===`corner`){let e=.38+r()*.14;o.push({theta:n,lat:s*e})}else if(e.kind===`chicane`){let e=t*.26,i=.34+r()*.1;o.push({theta:n-e,lat:s*i}),o.push({theta:n+e,lat:-s*i})}else{let e=t*.38,i=.46+r()*.08;o.push({theta:n-e,lat:s*i*.6}),o.push({theta:n,lat:s*(i+.08)}),o.push({theta:n+e,lat:s*i*.6})}a+=t}let s=new ir(o.map(({theta:e,lat:n})=>{let r=Math.PI/2-n;return new v(t*Math.sin(r)*Math.cos(e),t*Math.cos(r),t*Math.sin(r)*Math.sin(e))}),t),c=[];for(let e=0;e<256;e++)c.push(s.getPointAt(e/256,new v));let l=n*5.2,u=new v,d=new v;for(let e=0;e<80;e++){let e=!0,n=c.map(e=>e.clone());for(let r=0;r<256;r++){let i=n[(r-1+256)%256],a=n[r],o=n[(r+1)%256];u.subVectors(a,i),d.subVectors(o,a);let s=(u.length()+d.length())/2,f=u.normalize().angleTo(d.normalize());f<1e-5||s/f>=l||(e=!1,c[r].copy(i).add(o).multiplyScalar(.5).sub(a).multiplyScalar(.6).add(a).setLength(t))}if(e)break}for(let e=0;e<2;e++){let e=c.map(e=>e.clone());for(let n=0;n<256;n++){let r=e[(n-1+256)%256],i=e[n],a=e[(n+1)%256];c[n].copy(r).add(a).multiplyScalar(.5).sub(i).multiplyScalar(.25).add(i).setLength(t)}}let f=new ir(c,t);return f.arcLengthDivisions=800,f}function sr(e,t){let n=new K;n.name=`planet-idrive`;let[r,i]=t?[96,64]:[128,96],a=new N(e,r,i),o=new A({uniforms:{uRadius:{value:e}},vertexShader:xe,fragmentShader:$n}),s=new b(a,o);n.add(s);let c=e*.018,l=or(e),u=new f(l,t?220:400,c,14,!0),d=new A({vertexShader:er,fragmentShader:tr}),m=new b(u,d);n.add(m);let h=Te(e,10133672,{power:3.2,intensity:.55});n.add(h.mesh);let g=t?16:28,_=ve(1057),y=e*.031,S=y*.5,C=y*.2,w=Array.from({length:g},(e,t)=>{let n=(t%2==0?-1:1)*(.55+_()*.45)*.4*c;return{t:_(),speed:.028+_()*.05,lane:n,lift:Math.sqrt(Math.max(c*c-n*n,0))+C*.5+c*.04}}),T=new ue(S,C,y),D=new ie({color:16777215,roughness:.45,metalness:.55,emissive:2364677,emissiveIntensity:.9}),O=new E(T,D,g);O.instanceMatrix.setUsage(z),O.frustumCulled=!1;let j=[12106948,4869720,10238770,3364477,12159534,4025167],M=new p;for(let e=0;e<g;e++)M.setHex(j[e%j.length]),O.setColorAt(e,M);n.add(O);let P=g*3,F=new Float32Array(P*3),I=new Float32Array(P*3),L=new Float32Array(P),R=new Float32Array(P),B=new Float32Array(P),V=new p(16768160),ee=new p(16777215),te=new p(16774880),ne=new p(16723224);for(let t=0;t<g;t++){let n=t*3;M.copy(V).lerp(ee,_()*.5),I.set([M.r,M.g,M.b],n*3),L[n]=e*(.1+_()*.05),R[n]=.9,B[n]=1,I.set([te.r,te.g,te.b],(n+1)*3),L[n+1]=y*.5,R[n+1]=1,B[n+1]=0,I.set([ne.r,ne.g,ne.b],(n+2)*3),L[n+2]=y*.55,R[n+2]=1,B[n+2]=0}let H=new x;H.setAttribute(`position`,new U(F,3)),H.setAttribute(`aColor`,new U(I,3)),H.setAttribute(`aSize`,new U(L,1)),H.setAttribute(`aAlpha`,new U(R,1)),H.setAttribute(`aFadeNear`,new U(B,1));let re=new A({vertexShader:nr,fragmentShader:rr,transparent:!0,depthWrite:!1,blending:2}),ae=new oe(H,re);ae.frustumCulled=!1,ae.renderOrder=3,n.add(ae);let se=H.attributes.position,ce=new v,le=new v,W=new v,G=new v,q=new v,J=new v,Y=new v,X=new k;function de(e){let t=w[e];l.getPointAt(t.t,ce),l.getPointAt((t.t+.0015)%1,le),W.copy(ce).normalize(),G.subVectors(le,ce),G.addScaledVector(W,-G.dot(W)).normalize(),q.crossVectors(W,G),J.copy(ce).addScaledVector(q,t.lane).addScaledVector(W,t.lift),X.makeBasis(q,W,G),X.setPosition(J),O.setMatrixAt(e,X);let n=e*3;se.setXYZ(n,J.x,J.y,J.z),Y.copy(J).addScaledVector(G,y*.58),se.setXYZ(n+1,Y.x,Y.y,Y.z),Y.copy(J).addScaledVector(G,-y*.58),se.setXYZ(n+2,Y.x,Y.y,Y.z)}for(let e=0;e<g;e++)de(e);return O.instanceMatrix.needsUpdate=!0,O.instanceColor&&(O.instanceColor.needsUpdate=!0),se.needsUpdate=!0,{group:n,update(e){s.rotation.y+=e*.01;for(let t=0;t<g;t++){let n=w[t];n.t=(n.t+n.speed*e)%1,de(t)}O.instanceMatrix.needsUpdate=!0,se.needsUpdate=!0},dispose(){a.dispose(),o.dispose(),u.dispose(),d.dispose(),h.dispose(),O.dispose(),T.dispose(),D.dispose(),H.dispose(),re.dispose()}}}var cr=9001;function lr(e){let t=1024,n=document.createElement(`canvas`);n.width=t,n.height=512;let r=n.getContext(`2d`);r.fillStyle=`#000000`,r.fillRect(0,0,t,512);let i=ve(e);for(let e=0;e<52;e++){let e=i()*t,n=i()*512;r.beginPath(),r.moveTo(e,n);let a=3+Math.floor(i()*5);for(let o=0;o<a;o++){let a=i()<.5,o=18+i()*65;a?e+=(i()<.5?-1:1)*o:n+=(i()<.5?-1:1)*o,e=Math.max(3,Math.min(t-3,e)),n=Math.max(3,Math.min(509,n)),r.lineTo(e,n)}r.lineWidth=1+i()*1.2,r.strokeStyle=`rgba(245, 165, 36, ${(.5+i()*.5).toFixed(2)})`,r.stroke(),r.fillStyle=`rgba(255, 200, 97, ${(.7+i()*.3).toFixed(2)})`;let o=2+i()*2;r.fillRect(e-o/2,n-o/2,o,o)}let a=new d(n);return a.colorSpace=R,a.wrapS=H,a.wrapT=C,a.needsUpdate=!0,a}var ur=`
  attribute float aTheta0;
  attribute float aPhi;
  attribute float aTubeFrac;
  attribute float aSpeed;
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aAlpha;

  uniform float uTime;
  uniform float uMajorR;
  uniform float uTubeR;
  uniform float uJitterAmp;
  uniform float uBasePx;

  varying vec3 vColor;
  varying float vAlpha;

  ${Se}

  // Three decorrelated noise channels (fixed offsets) whose curl gives a
  // divergence-free-ish flow field — cheap "living shell" jitter, same
  // construction as src/v3/agenticSwarmScene.ts's curlNoise() but built on
  // this file's own value-noise primitive.
  float nX(vec3 p) { return vnoise3(p); }
  float nY(vec3 p) { return vnoise3(p + vec3(37.2, 91.1, 13.7)); }
  float nZ(vec3 p) { return vnoise3(p + vec3(-71.4, 5.3, 47.9)); }

  vec3 curlNoise(vec3 p) {
    float e = 0.12;
    float dFz_dy = (nZ(p + vec3(0.0, e, 0.0)) - nZ(p - vec3(0.0, e, 0.0))) / (2.0 * e);
    float dFy_dz = (nY(p + vec3(0.0, 0.0, e)) - nY(p - vec3(0.0, 0.0, e))) / (2.0 * e);
    float dFx_dz = (nX(p + vec3(0.0, 0.0, e)) - nX(p - vec3(0.0, 0.0, e))) / (2.0 * e);
    float dFz_dx = (nZ(p + vec3(e, 0.0, 0.0)) - nZ(p - vec3(e, 0.0, 0.0))) / (2.0 * e);
    float dFy_dx = (nY(p + vec3(e, 0.0, 0.0)) - nY(p - vec3(e, 0.0, 0.0))) / (2.0 * e);
    float dFx_dy = (nX(p + vec3(0.0, e, 0.0)) - nX(p - vec3(0.0, e, 0.0))) / (2.0 * e);
    return vec3(dFz_dy - dFy_dz, dFx_dz - dFz_dx, dFy_dx - dFx_dy);
  }

  void main() {
    float theta = aTheta0 + uTime * aSpeed;
    vec3 outward = vec3(cos(theta), 0.0, sin(theta));
    vec3 ringCenter = outward * uMajorR;
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 tubeOffset = (outward * cos(aPhi) + up * sin(aPhi)) * uTubeR * aTubeFrac;
    vec3 basePos = ringCenter + tubeOffset;

    vec3 jitter = curlNoise(basePos * 0.045 + uTime * 0.025) * uJitterAmp;
    vec3 finalPos = basePos + jitter;

    vColor = aColor;
    vAlpha = aAlpha;

    vec4 mv = modelViewMatrix * vec4(finalPos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uBasePx * (420.0 / max(-mv.z, 1.0));
  }
`,dr=`
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    float alpha = smoothstep(1.0, 0.0, d);
    alpha = pow(alpha, 1.4);
    if (alpha < 0.02) discard;
    float a = alpha * vAlpha;
    gl_FragColor = vec4(vColor * a, a);
    ${be}
  }
`;function fr(e,t,n,r=1){let i=new K;i.name=`planet-agentic`;let a=lr(cr);a.anisotropy=r;let[o,s]=n?[96,64]:[128,96],c=new N(e,o,s),l=new ie({color:1711140,metalness:1,roughness:.48,emissive:new p(ye.amber),emissiveMap:a,emissiveIntensity:1.6,envMapIntensity:.9});t&&(l.envMap=t),l.onBeforeCompile=t=>{t.uniforms.uRadius={value:e},t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>\nuniform float uRadius;\nvarying vec3 vDetailDir;\nvarying vec3 vDetailWorldPos;\n${Se}`).replace(`#include <color_fragment>`,`#include <color_fragment>
        {
          float camDist = length(cameraPosition - vDetailWorldPos);
          float detailFade = 1.0 - smoothstep(uRadius * 2.0, uRadius * 7.0, camDist);
          if (detailFade > 0.003) {
            float seamA = fbm3(vDetailDir * uRadius * 2.2, 3);
            float seam = smoothstep(0.46, 0.49, seamA) * (1.0 - smoothstep(0.5, 0.53, seamA));
            diffuseColor.rgb *= mix(1.0, 1.0 - seam * 0.45, detailFade);
            float panel = fbm3(vDetailDir * uRadius * 0.7 + 5.1, 3);
            diffuseColor.rgb *= mix(1.0, 0.9 + panel * 0.2, detailFade);
          }
        }`),t.vertexShader=t.vertexShader.replace(`#include <common>`,`#include <common>
varying vec3 vDetailDir;
varying vec3 vDetailWorldPos;`).replace(`#include <begin_vertex>`,`#include <begin_vertex>
  vDetailDir = normalize(position);
  vDetailWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`)};let u=new b(c,l);i.add(u);let d=Te(e,ye.amber,{power:2.9,intensity:.9});i.add(d.mesh);let f=n?8e3:17e3,m=e*2.3,h=e*.55,g=O.degToRad(25),_=ve(9008),y=new Float32Array(f),S=new Float32Array(f),C=new Float32Array(f),w=new Float32Array(f),T=new Float32Array(f*3),E=new Float32Array(f),D=new Float32Array(f),k=new p(ye.amberDeep),j=new p(ye.amber),M=new p(ye.amberBright),P=new p;for(let e=0;e<f;e++){y[e]=_()*Math.PI*2,S[e]=_()*Math.PI*2;let t=.55+_()**1.6*.45;C[e]=t,w[e]=.09+_()*.14;let n=O.clamp((t-.55)/.45,0,1);n>.6?P.copy(j).lerp(M,(n-.6)/.4):P.copy(k).lerp(j,n/.6),T[e*3]=P.r,T[e*3+1]=P.g,T[e*3+2]=P.b,E[e]=.85+_()*1.1,D[e]=.5+_()*.48}let F=new x;F.setAttribute(`aTheta0`,new U(y,1)),F.setAttribute(`aPhi`,new U(S,1)),F.setAttribute(`aTubeFrac`,new U(C,1)),F.setAttribute(`aSpeed`,new U(w,1)),F.setAttribute(`aColor`,new U(T,3)),F.setAttribute(`aSize`,new U(E,1)),F.setAttribute(`aAlpha`,new U(D,1)),F.setAttribute(`position`,new U(new Float32Array(f*3),3)),F.boundingSphere=new G(new v,m+h+6);let I=new A({uniforms:{uTime:{value:0},uMajorR:{value:m},uTubeR:{value:h},uJitterAmp:{value:e*.12},uBasePx:{value:2.6}},vertexShader:ur,fragmentShader:dr,transparent:!0,depthWrite:!1,blending:2}),L=new oe(F,I);return L.frustumCulled=!1,L.rotation.x=g,L.renderOrder=2,i.add(L),{group:i,update(e,t){u.rotation.y+=e*.012,I.uniforms.uTime.value=t},dispose(){c.dispose(),l.dispose(),a.dispose(),d.dispose(),F.dispose(),I.dispose()}}}var pr=7331,mr=3,hr=4,gr=10,_r=60,vr=90,yr=240,br=420,xr=.55,Sr=1.5,Cr=.7,wr=1.5,Tr=16,Er=34,Dr=2.6,Or=480,kr=680,Ar=.4,jr=3.5,Mr=5.5,Nr=70,Pr=5.5;function Fr(){let e=document.createElement(`canvas`);e.width=48,e.height=256;let t=e.getContext(`2d`);t.clearRect(0,0,48,256);let n=256*.13;t.globalCompositeOperation=`lighter`;for(let e=0;e<56;e++){let r=e/55,i=n+r*(256-n),a=(1-r)**2.4*.85,o=48*(.55+.45*(1-r));t.globalAlpha=a,t.fillStyle=`#ffffff`,t.fillRect(48/2-o/2,i,o,5.477142857142857)}t.globalAlpha=1;let r=t.createRadialGradient(48/2,n,0,48/2,n,48*.6);r.addColorStop(0,`rgba(255,255,255,1)`),r.addColorStop(.45,`rgba(255,255,255,0.85)`),r.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=r,t.fillRect(0,0,48,256),t.globalCompositeOperation=`source-over`;let i=new d(e);return i.needsUpdate=!0,i}function Ir(){let e=ve(pr),t=new K;t.name=`meteor-field`;let n=Fr();function r(e){let r=new W(new S({map:n,color:e?13627391:16777215,transparent:!0,opacity:0,depthWrite:!1,depthTest:!0,blending:2}));return r.visible=!1,r.renderOrder=4,t.add(r),{sprite:r,active:!1,age:0,life:1,startPos:new v,velocity:new v,length:Tr,width:Dr,isComet:e}}let i=Array.from({length:mr},()=>r(!1)),a=r(!0),o=hr+e()*(gr-hr),s=_r+e()*(vr-_r),c=null,l=!1,u=new v,d=new v,f=new v;function p(t,n,r,i){i?(i.getWorldDirection(u),f.set(e()*2-1,e()*2-1,e()*2-1).multiplyScalar(.3),u.add(f)):u.set(e()*2-1,e()*2-1,e()*2-1),u.lengthSq()<1e-6&&u.set(0,1,0),u.normalize(),r.pos.copy(t).addScaledVector(u,n),f.set(e()*2-1,e()*2-1,e()*2-1).normalize(),d.crossVectors(u,f),d.lengthSq()<1e-6&&d.set(1,0,0),d.normalize(),r.dir.copy(d)}let m={pos:new v,dir:new v};function h(t,n){p(n,yr+e()*(br-yr),m,c),c=null;let r=xr+e()*(Sr-xr),i=Cr+e()*(wr-Cr),a=m.pos.distanceTo(n)*r;t.startPos.copy(m.pos),t.velocity.copy(m.dir).multiplyScalar(a/i),t.life=i,t.age=0,t.length=Tr+e()*(Er-Tr),t.width=Dr*(.85+e()*.3),t.active=!0,t.sprite.visible=!0}function g(t){p(t,Or+e()*(kr-Or),m);let n=jr+e()*(Mr-jr),r=m.pos.distanceTo(t)*Ar;a.startPos.copy(m.pos),a.velocity.copy(m.dir).multiplyScalar(r/n),a.life=n,a.age=0,a.length=Nr,a.width=Pr,a.active=!0,a.sprite.visible=!0}let _=new v,y=new v,b=new v,x=new v;function C(e,t,n){if(!e.active)return;if(e.age+=t,e.age>=e.life){e.active=!1,e.sprite.visible=!1;return}x.copy(e.velocity).multiplyScalar(e.age),e.sprite.position.copy(e.startPos).add(x);let r=e.age/e.life,i=O.smoothstep(r,0,.12),a=1-O.smoothstep(r,.65,1),o=e.sprite.material;o.opacity=i*a*(e.isComet?.85:1),n.matrixWorld.extractBasis(_,y,b);let s=e.velocity.dot(_),c=e.velocity.dot(y);o.rotation=Math.atan2(-s,c),e.sprite.scale.set(e.width,e.length,1)}return{object:t,update(t,n){if(l&&(l=!1,c=n),o-=t,o<=0){o=hr+e()*(gr-hr);let t=i.find(e=>!e.active),r=i.filter(e=>e.active).length;t&&r<mr&&h(t,n.position)}c=null,s-=t,s<=0&&(s=_r+e()*(vr-_r),a.active||g(n.position));for(let e of i)C(e,t,n);C(a,t,n)},debugForceSpawn(e=`meteor`){e===`comet`?s=-1:(o=-1,l=!0)},dispose(){n.dispose();for(let e of i)e.sprite.material.dispose();a.sprite.material.dispose()}}}var Lr={mint:[{orbitRadius:1.75,moonRadius:.11,orbitSpeed:.07,inclination:.28,phase:.4,color:9083562},{orbitRadius:2.35,moonRadius:.07,orbitSpeed:.045,inclination:-.18,phase:2.3,color:6978184}],plumm:[{orbitRadius:1.9,moonRadius:.09,orbitSpeed:.055,inclination:.42,phase:1.1,color:5917290}],idrive:[{orbitRadius:1.65,moonRadius:.08,orbitSpeed:.08,inclination:.22,phase:.6,color:10127472},{orbitRadius:2.25,moonRadius:.055,orbitSpeed:.038,inclination:-.35,phase:3.8,color:7825496}],agentic:[{orbitRadius:2,moonRadius:.1,orbitSpeed:.065,inclination:.32,phase:1.6,color:11176032},{orbitRadius:2.7,moonRadius:.065,orbitSpeed:.042,inclination:-.22,phase:4.2,color:8941664}]};function Rr(e,t,n,r){let i=Lr[t],a=r?12:16,o=[],s=[],c=new v;for(let t of i){let r=new j;r.rotation.x=t.inclination,e.add(r);let i=n*t.moonRadius,c=new N(i,a,a),l=new ie({color:t.color,roughness:.92,metalness:.04,emissive:new p(t.color).multiplyScalar(.04)}),u=new b(c,l);u.position.x=n*t.orbitRadius,r.add(u),o.push({pivot:r,mesh:u,speed:t.orbitSpeed,phase:t.phase,radius:i}),s.push({geo:c,mat:l})}return{update(e,t){for(let{pivot:e,speed:n,phase:r}of o)e.rotation.y=t*n+r},forEachCollider(e){for(let{mesh:t,radius:n}of o)t.getWorldPosition(c),e(c,n)},dispose(){for(let{geo:e,mat:t}of s)e.dispose(),t.dispose()}}}var zr=`/v4/assets/tex/earth-day-2k.jpg`,Br=`/v4/assets/tex/city-lights-2k.jpg`;function Vr(){let e=document.createElement(`canvas`);e.width=8,e.height=8;let t=e.getContext(`2d`);t&&(t.fillStyle=`#141820`,t.fillRect(0,0,8,8));let n=new d(e);return n.needsUpdate=!0,n}async function Hr(e,t){try{return await e.loadAsync(t)}catch{return Vr()}}async function Ur(e,t){let{manager:n,skyTex:r,envMap:i,lowPower:a,renderer:o}=t,s=Math.min(o.capabilities.getMaxAnisotropy(),8),c=new le(n),[l,u]=await Promise.all([Hr(c,zr),Hr(c,Br)]);for(let e of[l,u])e.colorSpace=R,e.wrapS=H,e.wrapT=C,e.generateMipmaps=!0,e.minFilter=_,e.anisotropy=s;let d=Gn(r,a,o);e.add(d.object);let f=Ir();e.add(f.object);let p=new Map,m=[];for(let t of Gt){let n;switch(t.id){case`mint`:n=Yn(t.radius,l,a);break;case`plumm`:n=Zn(t.radius,u,a);break;case`idrive`:n=sr(t.radius,a);break;case`agentic`:n=fr(t.radius,i,a,s);break;default:throw Error(`Unknown planet id: ${t.id}`)}n.group.position.copy(t.position),n.group.name=`planet-${t.id}`,e.add(n.group),p.set(t.id,n),m.push(Rr(n.group,t.id,t.radius,a))}return{update(e,t,n){d.update(e,t,n);for(let n of p.values())n.update(e,t);for(let n of m)n.update(e,t);f.update(e,n)},debugForceMeteor(e){f.debugForceSpawn(e)},setBlackHoleLayerVisible(e,t){d.setLayerVisible(e,t)},getBlackHoleLayerState(){return d.getLayerState()},getBlackHoleRadii(){return d.getRadii()},getBlackHoleDiskFrame(){return d.getDiskFrame()},setBlackHoleDebugBounds(e){d.setDebugBounds(e)},forEachMoonCollider(e){for(let t of m)t.forEachCollider(e)},dispose(){e.remove(d.object),d.dispose();for(let t of p.values())e.remove(t.group),t.dispose();p.clear();for(let e of m)e.dispose();m.length=0,e.remove(f.object),f.dispose(),l.dispose(),u.dispose()}}}var Wr=12e4,Gr=250,Kr=600,qr=108,Jr=5,Yr=new v;function Xr(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function Zr(e){return 1-Xr(Gr,Kr,e)}function Qr(e,t,n){Yr.copy(Z).sub(e);let r=Math.max(Yr.length(),Jr),i=Wr/(r*r)*Zr(r);Yr.normalize(),t.addScaledVector(Yr,i*n)}function $r(e){let t=Math.max(Z.distanceTo(e),Jr);return Wr/(t*t)*Zr(t)}var ei=`v4-leaderboard`,ti=10;function ni(e){if(!e||typeof e!=`object`)return!1;let t=e;return typeof t.nick==`string`&&typeof t.ms==`number`&&typeof t.date==`string`}function ri(){try{let e=window.localStorage.getItem(ei);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(ni):[]}catch{return[]}}function ii(){return ri().sort((e,t)=>e.ms-t.ms)}function ai(e,t){let n=e.trim().slice(0,16)||`PILOT`,r=ri();r.push({nick:n,ms:t,date:new Date().toISOString()}),r.sort((e,t)=>e.ms-t.ms);let i=r.slice(0,ti);try{window.localStorage.setItem(ei,JSON.stringify(i))}catch{}return i}var oi={mint:`Mint Apartments`,plumm:`Plumm`,idrive:`I DRIVE CARS`,agentic:`Agentic OS`};function si(e){let t=c(e);if(t.length>=2)return t.slice(0,2).map(e=>({src:e.srcSmall,alt:e.caption}));let n=oi[e];return[{src:`/projects/${e}/hero-card.webp`,alt:`${n} — podgląd interfejsu`},{src:`/projects/${e}/hero-full.webp`,alt:`${n} — drugi kadr interfejsu`}]}var ci=[`Kapitanie — misja: znajdź nowoczesną stronę dla swojego biznesu. Cztery światy na orbicie czarnej dziury.`,`Nie trać czasu — minuta tak blisko horyzontu to godzina na Ziemi.`,`Ten statek… przypomina Ci coś? Zbieg okoliczności.`],li=5e3,ui=25;function di(e,t,n){if(n)return e.textContent=t,()=>{};e.textContent=``;let r=0,i=0,a=()=>{r+=1,e.textContent=t.slice(0,r),r<t.length&&(i=window.setTimeout(a,ui))};return i=window.setTimeout(a,ui),()=>window.clearTimeout(i)}function fi(e,t){let n=document.createElement(`div`);n.className=`v4-comm`,n.innerHTML=`
    <div class="v4-comm__panel">
      <button type="button" class="v4-comm__collapse" aria-label="Zwiń łączność">&times;</button>
      <div class="v4-comm__header">
        <canvas class="v4-comm__wave" width="56" height="22"></canvas>
        <span class="v4-comm__label">ŁĄCZNOŚĆ · ZAŁOGA</span>
      </div>
      <div class="v4-comm__lines">
        <p class="v4-comm__line"></p>
        <p class="v4-comm__line"></p>
        <p class="v4-comm__line"></p>
      </div>
      <div class="v4-comm__board" hidden>
        <div class="v4-comm__board-label">NAJSZYBSI ODKRYWCY</div>
        <ol class="v4-comm__board-list"></ol>
      </div>
    </div>
    <button type="button" class="v4-comm__icon" aria-label="Rozwiń łączność" hidden>&#9679;</button>
  `,e.appendChild(n);let r=n.querySelector(`.v4-comm__panel`),i=n.querySelector(`.v4-comm__icon`),a=n.querySelector(`.v4-comm__collapse`),o=Array.from(n.querySelectorAll(`.v4-comm__line`)),s=n.querySelector(`.v4-comm__board`),c=n.querySelector(`.v4-comm__board-list`),l=n.querySelector(`.v4-comm__wave`),u=!1,d=[],f=[],p=0;function m(){for(let e of d)window.clearTimeout(e);for(let e of f)e();d=[],f=[]}function h(){ci.forEach((e,n)=>{let r=window.setTimeout(()=>{f.push(di(o[n],e,t.reducedMotion))},n*li);d.push(r)})}function g(){let e=ii().slice(0,3);if(e.length===0){s.hidden=!0;return}s.hidden=!1,c.innerHTML=e.map((e,t)=>`<li><span>${t+1}.</span><span>${vn(e.nick)}</span><span>${mn(e.ms)}</span></li>`).join(``)}function _(e){let t=l.getContext(`2d`);if(!t)return;let n=l.width/8;t.clearRect(0,0,l.width,l.height),t.fillStyle=`#f5a524`;for(let r=0;r<8;r++){let i=l.height*(.22+.58*Math.abs(Math.sin(e+r*.7)));t.fillRect(r*n+1,l.height-i,n-2,i)}}function v(){if(t.reducedMotion){_(.6);return}let e=0,n=()=>{e+=.12,_(e),p=requestAnimationFrame(n)};n()}function y(){u=!1,r.classList.remove(`is-collapsed`),i.hidden=!0}function b(){u=!0,r.classList.add(`is-collapsed`),i.hidden=!1}r.addEventListener(`click`,e=>{e.target.closest(`.v4-comm__collapse`)||b()}),a.addEventListener(`click`,e=>{e.stopPropagation(),b()}),i.addEventListener(`click`,y);let x=e=>{e.code===`Enter`&&!u&&b()};return window.addEventListener(`keydown`,x),g(),h(),v(),t.startCollapsed&&b(),{dismiss(){u||b()},restart(){m();for(let e of o)e.textContent=``;y(),g(),h()},dispose(){m(),cancelAnimationFrame(p),window.removeEventListener(`keydown`,x),n.remove()}}}var pi=`${`https://marcinbochenek.com`.replace(/\/$/,``)}/#realizacje`;function mi(e){let t=document.createElement(`div`);t.className=`v4-project-panel`,t.setAttribute(`aria-hidden`,`true`),t.inert=!0,t.innerHTML=`
    <button type="button" class="v4-project-panel__close" aria-label="Zamknij panel projektu">&times;</button>
    <p class="v4-project-panel__eyebrow"></p>
    <h2 class="v4-project-panel__title"></h2>
    <p class="v4-project-panel__desc"></p>
    <div class="v4-project-panel__shots"></div>
    <div class="v4-project-panel__stack"></div>
    <div class="v4-project-panel__links">
      <a class="v4-project-panel__live" href="#" target="_blank" rel="noopener" hidden>Strona na żywo &rarr;</a>
      <span class="v4-project-panel__status" hidden></span>
      <a class="v4-project-panel__case" href="${pi}" target="_blank" rel="noopener">Case study &rarr;</a>
    </div>
  `,e.appendChild(t);let n=t.querySelector(`.v4-project-panel__close`),r=t.querySelector(`.v4-project-panel__eyebrow`),i=t.querySelector(`.v4-project-panel__title`),a=t.querySelector(`.v4-project-panel__desc`),o=t.querySelector(`.v4-project-panel__shots`),s=t.querySelector(`.v4-project-panel__stack`),c=t.querySelector(`.v4-project-panel__live`),l=t.querySelector(`.v4-project-panel__status`);function u(){t.classList.remove(`is-open`),t.setAttribute(`aria-hidden`,`true`),t.inert=!0,document.documentElement.classList.remove(`v4-panel-open`)}return n.addEventListener(`click`,u),{show(e,n){r.textContent=e.tagline,i.textContent=e.title,a.textContent=gn(e.description,3),o.innerHTML=``;for(let e of n){let t=document.createElement(`img`);t.className=`v4-project-panel__shot`,t.src=e.src,t.alt=e.alt,t.loading=`lazy`,o.appendChild(t)}s.innerHTML=``;for(let t of e.stack??[]){let e=document.createElement(`span`);e.className=`v4-project-panel__chip`,e.textContent=t,s.appendChild(e)}yn(e.url)&&e.id!==`idrive`&&e.id!==`agentic`?(c.href=e.url,c.hidden=!1,l.hidden=!0):(c.hidden=!0,c.removeAttribute(`href`),l.hidden=!1,l.textContent=e.domain),t.classList.add(`is-open`),t.setAttribute(`aria-hidden`,`false`),t.inert=!1,document.documentElement.classList.add(`v4-panel-open`)},hide:u,dispose(){t.remove()}}}var hi=2500;function gi(e){let t=document.createElement(`div`);t.className=`v4-toast`,t.setAttribute(`aria-live`,`polite`),t.setAttribute(`aria-hidden`,`true`),e.appendChild(t);let n=0;return{show(e){t.textContent=`ODKRYTO: ${e.toUpperCase()}`,t.classList.remove(`is-visible`),t.offsetWidth,t.classList.add(`is-visible`),t.setAttribute(`aria-hidden`,`false`),window.clearTimeout(n),n=window.setTimeout(()=>{t.classList.remove(`is-visible`),t.setAttribute(`aria-hidden`,`true`)},hi)},dispose(){window.clearTimeout(n),t.remove()}}}var _i=600;function vi(e,t){let n=document.createElement(`div`);n.className=`v4-horizon-flash`,e.appendChild(n);let r=document.createElement(`div`);r.className=`v4-overlay v4-overlay--gameover`,r.setAttribute(`aria-hidden`,`true`),r.inert=!0,r.innerHTML=`
    <div class="v4-overlay__card">
      <p class="v4-overlay__eyebrow">Misja przerwana</p>
      <h1 class="v4-overlay__title" id="v4-gameover-title">Przekroczono horyzont zdarzeń</h1>
      <p class="v4-overlay__lead">Z tej odległości nie ucieka nawet światło. Misja zaczyna się od nowa.</p>
      <button type="button" class="v4-overlay__button">Restart misji <span class="v4-overlay__hint">[R]</span></button>
    </div>
  `,e.appendChild(r);let i=r.querySelector(`.v4-overlay__button`);i.addEventListener(`click`,()=>t.onRestart());let a=0;function o(){r.setAttribute(`role`,`dialog`),r.setAttribute(`aria-modal`,`true`),r.setAttribute(`aria-labelledby`,`v4-gameover-title`),r.classList.add(`is-visible`),r.setAttribute(`aria-hidden`,`false`),r.inert=!1,i.focus({preventScroll:!0})}function s(){window.clearTimeout(a),r.classList.remove(`is-visible`),r.removeAttribute(`role`),r.removeAttribute(`aria-modal`),r.setAttribute(`aria-hidden`,`true`),r.inert=!0,n.classList.remove(`is-active`)}return{trigger(){if(t.reducedMotion){o();return}n.classList.remove(`is-active`),n.offsetWidth,n.classList.add(`is-active`),window.clearTimeout(a),a=window.setTimeout(o,_i)},reset(){s()},dispose(){window.clearTimeout(a),r.remove(),n.remove()}}}function yi(e,t){let n=document.createElement(`div`);n.className=`v4-overlay v4-overlay--completion`,n.setAttribute(`aria-hidden`,`true`),n.inert=!0,n.innerHTML=`
    <div class="v4-overlay__card v4-overlay__card--wide">
      <h1 class="v4-overlay__title" id="v4-completion-title">Misja wykonana</h1>
      <p class="v4-overlay__time">Twój czas: <strong class="v4-overlay__time-value">00:00.0</strong></p>
      <p class="v4-overlay__dilation"></p>
      <form class="v4-overlay__save">
        <div class="v4-overlay__save-row">
          <label class="sr-only" for="v4-nick">Znak na tablicy wyników</label>
          <input class="v4-overlay__nick" id="v4-nick" name="nick" type="text" maxlength="16" placeholder="Twój znak (max 16)" autocomplete="off" aria-describedby="v4-nick-hint" />
          <button type="submit" class="v4-overlay__button">Zapisz wynik</button>
        </div>
        <p class="v4-overlay__nick-hint" id="v4-nick-hint">Maksymalnie 16 znaków — ranking lokalny na tym urządzeniu.</p>
      </form>
      <div class="v4-overlay__board">
        <div class="v4-overlay__board-label">Najszybsi odkrywcy</div>
        <table class="v4-overlay__table">
          <thead>
            <tr><th>#</th><th>Znak</th><th>Czas</th><th>Data</th></tr>
          </thead>
          <tbody></tbody>
        </table>
        <p class="v4-overlay__note">Ranking lokalny — na tym urządzeniu.</p>
      </div>
      <button type="button" class="v4-overlay__restart">Restart misji <span class="v4-overlay__hint">[R]</span></button>
    </div>
  `,e.appendChild(n);let r=n.querySelector(`.v4-overlay__time-value`),i=n.querySelector(`.v4-overlay__dilation`),a=n.querySelector(`.v4-overlay__save`),o=n.querySelector(`.v4-overlay__nick`),s=n.querySelector(`.v4-overlay__button`),c=n.querySelector(`tbody`),l=n.querySelector(`.v4-overlay__restart`),u=e=>e.stopPropagation();o.addEventListener(`keydown`,u),o.addEventListener(`keyup`,u),a.addEventListener(`submit`,e=>{e.preventDefault(),!s.disabled&&(t.onSave(o.value),s.disabled=!0,o.disabled=!0,s.textContent=`Zapisano`)}),l.addEventListener(`click`,()=>t.onRestart());function d(e){c.innerHTML=e.slice(0,10).map((e,t)=>`<tr><td>${t+1}</td><td>${vn(e.nick)}</td><td>${mn(e.ms)}</td><td>${hn(e.date)}</td></tr>`).join(``)}return{show(e,t){r.textContent=mn(e);let a=Math.round(e/1e3);i.textContent=`Na Ziemi minęło w tym czasie: ${Math.floor(a/60)}h ${a%60}min`,o.value=``,o.disabled=!1,s.disabled=!1,s.textContent=`Zapisz wynik`,d(t),n.setAttribute(`role`,`dialog`),n.setAttribute(`aria-labelledby`,`v4-completion-title`),n.classList.add(`is-visible`),n.setAttribute(`aria-hidden`,`false`),n.inert=!1,o.focus({preventScroll:!0})},updateBoard(e){d(e)},reset(){n.classList.remove(`is-visible`),n.removeAttribute(`role`),n.setAttribute(`aria-hidden`,`true`),n.inert=!0},dispose(){o.removeEventListener(`keydown`,u),o.removeEventListener(`keyup`,u),n.remove()}}}var $=n(),bi=new v(205,-36,700),xi=(()=>{let e=bi.clone().normalize(),t=new v().crossVectors(new v(0,1,0),e).normalize(),n=e.clone().negate(),r=t.clone().multiplyScalar(.18).addScaledVector(n,.82);r.normalize();let i=new re;return i.up.set(0,1,0),i.lookAt(r),i.quaternion.clone()})();function Si(){if(typeof navigator>`u`)return!1;let e=navigator.hardwareConcurrency??8,t=navigator.deviceMemory;return e<=4||t!==void 0&&t<=4}function Ci(){let e=(0,De.useRef)(null),t=(0,De.useRef)(null),n=(0,De.useRef)(null),r=(0,De.useRef)(null),i=(0,De.useRef)(null),a=(0,De.useRef)(null);return(0,De.useEffect)(()=>{let s=!1,c=null,l=null,u=null,d=null,f=null,p=null,m=null,h=null,_=null,y=null,x=null,S=null,C=null,w=null,T=null,E=null;async function D(){let D=e.current,k=t.current,A=n.current;if(!D||!k||!A)return;let j=D;E=j,k.tabIndex=0,k.setAttribute(`aria-label`,`Pole lotu — sterowanie statkiem`),k.focus({preventScroll:!0});let N=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,P=Si(),I=new g;I.onProgress=(e,t,n)=>{let r=n>0?Math.round(t/n*100):0;a.current&&(a.current.style.width=`${r}%`),i.current&&(i.current.textContent=`WCZYTYWANIE MISJI… ${r}%`)},I.onError=e=>{e.includes(`normandy-sr2-joshuas-cc0.glb`)||console.error(`[v4] failed to load asset:`,e)};let L=await lt(k,{lowPower:P,reducedMotion:N,manager:I});if(s){L.dispose();return}c=L;let R=await we(I,L.envMap,L.renderer);if(s){R.dispose(),L.dispose();return}l=R,L.scene.add(R.group);let z=await Ur(L.scene,{manager:I,skyTex:L.skyTex,envMap:L.envMap,lowPower:P,renderer:L.renderer});if(s){z.dispose(),R.dispose(),L.dispose();return}u=z;let B=Wt(D);f=B;let V=zt(bi,B.input);V.state.quaternion.copy(xi),d=V;let ee=pn(L.camera,R.group.userData.hullStats),te=B.active||window.matchMedia(`(max-width: 480px), (hover: none)`).matches,ne=Cn(A,{touchActive:B.active,launchByTap:te,onLaunch:()=>{V.state.hasThrusted=!0}});p=ne;function H(e){j.classList.toggle(`is-prelaunch`,e),B.setArmed(!e)}H(!0),T=e=>{if(!te||!j.classList.contains(`is-prelaunch`))return;let t=e.target;t instanceof Element&&(t.closest(`a, .v4-loading, .v4-overlay, input, textarea, button.v4-comm__collapse, button.v4-comm__icon`)||(e.preventDefault(),V.state.hasThrusted=!0))},j.addEventListener(`pointerdown`,T),m=fi(A,{reducedMotion:N,startCollapsed:B.active}),h=mi(A),_=gi(A);let re=null,ie=0,ae=!1,oe=!1,ce=!1,le=new Set,U=null,W=!1;function ue(){V.state.position.copy(bi),V.state.velocity.set(0,0,0),V.state.angularVelocity.set(0,0,0),V.state.bankAngle=0,V.state.quaternion.copy(xi),V.state.thrustLevel=0,V.state.brakeLevel=0,V.state.speed=0,V.state.hasThrusted=!1,W=!1,re=null,ie=0,ae=!1,oe=!1,ce=!1,le.clear(),U=null,h?.hide(),y?.reset(),x?.reset(),m?.restart(),ne.reset(),ee.holdLaunch(bi,xi),H(!0)}y=vi(A,{reducedMotion:N,onRestart:()=>ue()});let G=yi(A,{onRestart:()=>ue(),onSave:e=>{let t=ai(e,ie);G.updateBoard(t)}});x=G,w=e=>{if(e.code!==`KeyR`)return;let t=e.target;t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||ue()},window.addEventListener(`keydown`,w),C=()=>{L.setSize(j.clientWidth,j.clientHeight),V.state.hasThrusted||ee.holdLaunch(bi,xi)},window.addEventListener(`resize`,C),C(),ee.holdLaunch(bi,xi);let K=!1,q=new v,J=new v,Y=null;new URLSearchParams(window.location.search).has(`debug`)&&(Y=new M(R.group,16763972),Y.name=`ship-debug-bounds`,Y.visible=!1,L.scene.add(Y),window.__v4={teleport(e,t){K=!0,q.set(e[0],e[1],e[2]),J.set(t[0],t[1],t[2])},spawnMeteor(e){z.debugForceMeteor(e)},getShipPos(){let e=V.state.position;return[e.x,e.y,e.z]},haltShip(){V.state.velocity.set(0,0,0),V.state.angularVelocity.set(0,0,0)},getHullSource(){return R.group.userData.hullSource??`unknown`},getHullStats(){return R.group.userData.hullStats??null},frameHull(e){K=!0;let t=R.group.position,n=R.group.quaternion,r=new v(0,0,-1).applyQuaternion(n),i=new v(0,1,0).applyQuaternion(n),a=new v(1,0,0).applyQuaternion(n),o=t.clone();e===`rear`?q.copy(t).addScaledVector(r,-46).addScaledVector(i,9):e===`top`?q.copy(t).addScaledVector(i,44).addScaledVector(r,2):e===`side`?q.copy(t).addScaledVector(a,40).addScaledVector(i,5):q.copy(t).addScaledVector(r,-28).addScaledVector(i,12).addScaledVector(a,18),J.copy(o)},releaseDebugCam(){K=!1},getRenderInfo(){let e=L.renderer.info.render;return{triangles:e.triangles,calls:e.calls}},setShipVisible(e){R.group.visible=e},getChaseInfo(){let e=L.camera.position.clone().sub(R.group.position),t=new v(0,1,0).applyQuaternion(R.group.quaternion),n=new v(0,0,-1).applyQuaternion(R.group.quaternion),r=new v(1,0,0).applyQuaternion(R.group.quaternion);return{heightDot:e.dot(t),backDot:-e.dot(n),sideDot:e.dot(r),dist:e.length(),upDot:t.dot(new v(0,1,0))}},getShipMaterialReport(){let e=L.scene.environment?.uuid??null,t=[];return R.group.traverse(n=>{if(!(n instanceof b)||!n.visible)return;let r=Array.isArray(n.material)?n.material:[n.material];for(let i of r){if(!i||!(`color`in i))continue;let r=i,a=r.envMap?.uuid??null;t.push({mesh:n.name||n.parent?.name||``,type:r.type,color:r.color?.getHexString?.()??null,metalness:r.metalness??null,roughness:r.roughness??null,envMap:!!r.envMap,envMapIntensity:r.envMapIntensity??null,envMapUuid:a,sceneEnvUuid:e,usesStudioNotSky:!!(a&&a!==e),emissive:r.emissive?.getHexString?.()??null,emissiveIntensity:r.emissiveIntensity??null})}}),t},getScreenAabbs(){return window.__v4.getComposition().aabbs},getComposition(){let e=L.camera;e.updateMatrixWorld(),e.updateProjectionMatrix();let t=L.renderer.domElement,n=t.clientWidth,r=t.clientHeight,i=Math.min(n,r),a=.07*i,o=()=>({left:1/0,top:1/0,right:-1/0,bottom:-1/0}),s=(e,t,n)=>{e.left=Math.min(e.left,t),e.right=Math.max(e.right,t),e.top=Math.min(e.top,n),e.bottom=Math.max(e.bottom,n)},c=(t,i)=>{let a=t.clone().project(e);Number.isFinite(a.x+a.y)&&s(i,(a.x*.5+.5)*n,(-a.y*.5+.5)*r)},l=e=>{let t=o(),n=[new v(e.min.x,e.min.y,e.min.z),new v(e.min.x,e.min.y,e.max.z),new v(e.min.x,e.max.y,e.min.z),new v(e.min.x,e.max.y,e.max.z),new v(e.max.x,e.min.y,e.min.z),new v(e.max.x,e.min.y,e.max.z),new v(e.max.x,e.max.y,e.min.z),new v(e.max.x,e.max.y,e.max.z)];for(let e of n)c(e,t);return t},u=e=>({left:e.left,top:e.top,right:n-e.right,bottom:r-e.bottom}),d=(e,t)=>e.left<t.right-1&&e.right>t.left+1&&e.top<t.bottom-1&&e.bottom>t.top+1,f=(e,t)=>({left:e.left-t,top:e.top-t,right:e.right+t,bottom:e.bottom+t}),p=l(new se().setFromObject(R.group)),m=z.getBlackHoleRadii(),h=z.getBlackHoleDiskFrame(),g=e.position.distanceTo(Z),_=Z.clone().project(e),y=(_.x*.5+.5)*n,b=(-_.y*.5+.5)*r,x=O.degToRad(e.fov),S=Math.sqrt(Math.max(g*g-m.apparentShadow*m.apparentShadow,1)),C=m.apparentShadow/S/Math.tan(x/2)*(r*.5),w={left:y-C,top:b-C,right:y+C,bottom:b+C},T=o();for(let e=0;e<48;e++){let t=e/48*Math.PI*2;c(Z.clone().addScaledVector(h.u,Math.cos(t)*h.outer).addScaledVector(h.v,Math.sin(t)*h.outer),T)}let E=t.getBoundingClientRect(),D=A.querySelector(`.v4-hud__start-prompt`),k=null;if(D&&!D.classList.contains(`is-hidden`)){let e=D.getBoundingClientRect();k={left:e.left-E.left,top:e.top-E.top,right:e.right-E.left,bottom:e.bottom-E.top}}let j=u(p),M=u(w),N=u(T),P=(p.right-p.left)/n,F=(p.top+p.bottom)*.5/r,I=b/r,B={shipPrompt:k?d(f(p,6),k):!1,promptShadow:k?d(f(w,6),k):!1,promptDisk:k?d(f(T,6),k):!1},V=n>=900?a:.05*i,ee={shadowInFrame:M.left>=V&&M.right>=V&&M.top>=V&&M.bottom>=V,diskSignificantWidth:T.right-T.left>C*3.6&&N.left>4&&N.right>4,shipWidth:P>=.3&&P<=.45,shipLower:F>.55,bhUpper:I<.42,noPromptOverlap:!B.shipPrompt&&!B.promptShadow&&!B.promptDisk};return{viewport:{w:n,h:r,short:i,marginNeed:a,aspect:n/r},aabbs:{ship:p,bh:w,disk:T,prompt:k,viewport:{w:n,h:r}},shadow:{cx:y,cy:b,r:C,rect:w,margins:M,fracShort:C*2/i},disk:{rect:T,margins:N,widthFrac:(T.right-T.left)/n},ship:{rect:p,margins:j,widthFrac:P,cy:F},prompt:k,overlaps:B,pass:ee}},setShipPos(e){V.state.position.set(e[0],e[1],e[2]),V.state.velocity.set(0,0,0),V.state.angularVelocity.set(0,0,0)},getCameraPhase(){return K?`debug-teleport`:ee.getPhase()},getProbe(){let e=L.camera,t=V.state.position,n=new v(0,0,-1).applyQuaternion(e.quaternion),r=t.clone().sub(e.position),i=Z.clone().sub(e.position),a=r.length(),o=i.length(),s=r.dot(n),c=i.dot(n),l=Math.abs(s-c)<.5?`equal`:s<c?`ship`:`bh`,u=r.clone().normalize(),d=e.position.clone().sub(Z),f=d.dot(u),p=d.lengthSq()-11664,m=f*f-p,h=null;if(m>=0){let e=-f-Math.sqrt(m),t=-f+Math.sqrt(m);h=e>.02?e:t>.02?t:null}return{phase:K?`debug-teleport`:ee.getPhase(),hasThrusted:V.state.hasThrusted,camera:{pos:[e.position.x,e.position.y,e.position.z],fwd:[n.x,n.y,n.z]},ship:[t.x,t.y,t.z],bh:[Z.x,Z.y,Z.z],distShipBh:t.distanceTo(Z),distCamShip:a,distCamBh:o,camSpace:{shipFwd:s,bhFwd:c,closer:l},rayThroughShip:{tShip:a,tHorizon:h,sphereHitsBeforeShip:h!==null&&h<a-.05},layers:z.getBlackHoleLayerState(),radii:z.getBlackHoleRadii()}},setBhLayer(e,t){z.setBlackHoleLayerVisible(e,t)},getBhLayers(){return z.getBlackHoleLayerState()},showBounds(e){z.setBlackHoleDebugBounds(e),Y&&(Y.visible=e,e&&Y.update())}});let X=new v,de=new F,fe=new v(0,0,1);S=L.onTick((e,t)=>{let n=!ce;if(n){V.state.hasThrusted&&Qr(V.state.position,V.state.velocity,e),V.update(e),!V.state.hasThrusted&&!K&&(V.state.position.copy(bi),V.state.velocity.set(0,0,0),V.state.angularVelocity.set(0,0,0),V.state.quaternion.copy(xi),V.state.bankAngle=0),R.group.position.copy(V.state.position),Y?.visible&&Y.update(),de.setFromAxisAngle(fe,V.state.bankAngle),R.group.quaternion.copy(V.state.quaternion).multiply(de),R.updateThrust(V.state.thrustLevel,t),V.state.hasThrusted&&!W&&(W=!0,H(!1),ae||(ae=!0,re=t),m?.dismiss()),ae&&re!==null&&(ie=(t-re)*1e3),V.state.position.distanceTo(Z)<qr&&(ce=!0,V.state.velocity.set(0,0,0),V.state.angularVelocity.set(0,0,0),y?.trigger());for(let e of Gt){let t=V.state.position.distanceTo(e.position),n=e.radius*2.5,r=e.radius*3.5;if(t<n&&U!==e.id){U=e.id;let t=o.find(t=>t.id===e.id);t&&(le.has(e.id)||(le.add(e.id),_?.show(t.title),le.size===Gt.length&&!oe&&(oe=!0,ae=!1,x?.show(ie,ii()))),h?.show(t,si(e.id)))}else U===e.id&&t>r&&(U=null,h?.hide())}for(let e of Gt){X.copy(V.state.position).sub(e.position);let t=e.radius*1.12+2,n=X.length();if(n<t&&n>1e-4){X.multiplyScalar(1/n),V.state.position.copy(e.position).addScaledVector(X,t);let r=V.state.velocity.dot(X);r<0&&V.state.velocity.addScaledVector(X,-r)}}z.forEachMoonCollider((e,t)=>{X.copy(V.state.position).sub(e);let n=t*1.2+1.4,r=X.length();if(r<n&&r>1e-4){X.multiplyScalar(1/r),V.state.position.copy(e).addScaledVector(X,n);let t=V.state.velocity.dot(X);t<0&&V.state.velocity.addScaledVector(X,-t)}})}K?(L.camera.position.copy(q),L.camera.lookAt(J)):n&&ee.update(e,V.state.position,V.state.quaternion,V.state.thrustLevel,V.state.bankAngle,V.state.angularVelocity,{hasThrusted:V.state.hasThrusted,reducedMotion:window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}),L.dust.update(L.camera.position,V.state.velocity),z.update(e,t,L.camera),ne.update({speed:V.state.speed,thrust:V.state.thrustLevel,hasThrusted:V.state.hasThrusted,missionMs:ie,discovered:le,gravityAccel:n?$r(V.state.position):0})}),L.start(),r.current&&(r.current.classList.add(`is-hidden`),r.current.setAttribute(`aria-busy`,`false`),r.current.setAttribute(`aria-hidden`,`true`))}return D().catch(e=>{console.error(`[v4] init failed`,e);let t=r.current;t&&(t.classList.add(`is-error`),t.setAttribute(`aria-busy`,`false`)),i.current&&(i.current.textContent=`Nie udało się wczytać misji. Odśwież stronę.`)}),()=>{s=!0,C&&window.removeEventListener(`resize`,C),w&&window.removeEventListener(`keydown`,w),T&&E&&E.removeEventListener(`pointerdown`,T),S?.(),delete window.__v4,x?.dispose(),y?.dispose(),_?.dispose(),h?.dispose(),m?.dispose(),p?.dispose(),d?.dispose(),f?.dispose(),u?.dispose(),l?.dispose(),c?.stop(),c?.dispose()}},[]),(0,$.jsxs)(`div`,{className:`v4-root is-prelaunch`,ref:e,children:[(0,$.jsx)(`canvas`,{className:`v4-canvas`,ref:t}),(0,$.jsx)(`div`,{className:`v4-hud-container`,ref:n}),(0,$.jsxs)(`div`,{className:`v4-loading`,ref:r,"aria-live":`polite`,"aria-busy":`true`,role:`status`,children:[(0,$.jsx)(`div`,{className:`v4-loading__label`,ref:i,children:`WCZYTYWANIE MISJI… 0%`}),(0,$.jsx)(`div`,{className:`v4-loading__bar`,children:(0,$.jsx)(`div`,{className:`v4-loading__bar-fill`,ref:a})})]})]})}var wi=s.portfolioUrl.replace(/\/$/,``),Ti=`${wi}/#realizacje`;function Ei(){let{locale:e}=i(),t=a(e).v4Fallback;return(0,$.jsx)(`div`,{className:`v4-fallback`,children:(0,$.jsxs)(`div`,{className:`v4-fallback__card`,children:[(0,$.jsx)(`p`,{className:`v4-fallback__eyebrow`,children:t.eyebrow}),(0,$.jsx)(`h1`,{className:`v4-fallback__title`,children:t.title}),(0,$.jsx)(`p`,{className:`v4-fallback__lead`,children:t.lead}),(0,$.jsx)(`div`,{className:`v4-fallback__list`,children:o.map(e=>(0,$.jsxs)(`a`,{className:`v4-fallback__item`,href:yn(e.url)?e.url:Ti,target:`_blank`,rel:`noopener noreferrer`,children:[(0,$.jsx)(`span`,{className:`v4-fallback__item-title`,children:e.title}),(0,$.jsx)(`span`,{className:`v4-fallback__item-tagline`,children:e.tagline})]},e.id))}),(0,$.jsxs)(`div`,{className:`v4-fallback__actions`,children:[(0,$.jsx)(`a`,{className:`v4-fallback__cta`,href:Ti,children:t.seeWork}),(0,$.jsx)(`a`,{className:`v4-fallback__back`,href:wi,children:t.back})]}),(0,$.jsxs)(`p`,{className:`v4-fallback__hint`,children:[t.hintBefore,(0,$.jsx)(`a`,{href:s.gameUrl,rel:`noopener`,children:s.gameUrl.replace(/^https?:\/\//,``)}),t.hintAfter]})]})})}function Di(){if(typeof window>`u`)return!1;try{return!!document.createElement(`canvas`).getContext(`webgl2`)}catch{return!1}}function Oi(){let[e]=(0,De.useState)(Di);return e?(0,$.jsx)(Ci,{}):(0,$.jsx)(Ei,{})}(0,Ee.createRoot)(document.getElementById(`root`)).render((0,$.jsx)(r,{children:(0,$.jsx)(Oi,{})}));