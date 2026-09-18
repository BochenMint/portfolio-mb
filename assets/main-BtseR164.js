import{n as e,r as t,t as n}from"./jsx-runtime-i9uBjpvk.js";import{n as r,o as i,r as a}from"./i18n-C1tP8KwJ.js";/* empty css            */import{d as o,g as s}from"./live-C7cvPOC7.js";import{t as c}from"./gallery-jI0pM9Zk.js";import{$ as l,A as u,B as d,C as f,Ct as p,Dt as m,E as h,Et as g,G as _,H as v,K as y,M as b,Mt as x,Nt as S,Ot as C,P as w,Q as T,S as E,St as D,T as O,Tt as k,V as A,W as j,Y as M,Z as N,_t as P,b as F,bt as I,ct as L,dt as R,et as z,ft as B,gt as V,h as H,ht as U,l as ee,lt as W,mt as G,nt as te,ot as ne,q as re,u as ie,ut as ae,v as oe,vt as K,w as q,x as J,xt as Y,y as se}from"./three-PTrTQivD.js";import{a as ce,c as X,d as Z,i as le,n as ue,o as de,p as fe,r as pe}from"./build-DoixvEbG.js";import{r as me}from"./heroSceneTypes-BBcQTCIc.js";import{a as he,c as ge,d as _e,i as ve,l as ye,o as be,r as xe,s as Se,t as Ce,u as we}from"./buildShipV2-DxzCoTdV.js";var Te=e(),Ee=t(),De=180,Oe=De/2,ke=2600,Ae=1200,je=900,Me=400,Ne=12,Pe=60,Fe=.5,Ie=70,Le=.1,Re=.35;function ze(){let e=document.createElement(`canvas`);e.width=e.height=32;let t=e.getContext(`2d`),n=t.createRadialGradient(16,16,0,16,16,16);return n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.5,`rgba(255,255,255,0.5)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,32,32),new f(e)}function Be(e,t){let n=e-t;for(;n>Oe;)n-=De;for(;n<-90;)n+=De;return t+n}var Ve=`
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
`,He=`
  precision mediump float;
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec3 vTint;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    gl_FragColor = vec4(vTint * tex.rgb, tex.a * uOpacity);
  }
`;function Ue(e){let t=e?Ae:ke,n=e?Me:je,r=ze(),i=new Float32Array(t*3),a=new Float32Array(t),o=new Float32Array(t*3);for(let e=0;e<t;e++){let t=e*3;i[t+0]=(Math.random()-.5)*De,i[t+1]=(Math.random()-.5)*De,i[t+2]=(Math.random()-.5)*De,a[e]=.1+Math.random()*.25;let n=Math.random();n<.04?(o[t+0]=.72,o[t+1]=.83,o[t+2]=1):n<.08?(o[t+0]=1,o[t+1]=.9,o[t+2]=.74):(o[t+0]=1,o[t+1]=1,o[t+2]=1)}let s=new E;s.setAttribute(`position`,new J(i,3)),s.setAttribute(`aSize`,new J(a,1)),s.setAttribute(`aTint`,new J(o,3));let c=new K({uniforms:{uMap:{value:r},uOpacity:{value:Le},uSizeMul:{value:260}},vertexShader:Ve,fragmentShader:He,transparent:!0,depthWrite:!1,depthTest:!0,blending:2}),l=new R(s,c);l.frustumCulled=!1,l.renderOrder=2;let u=new Float32Array(n*3);for(let e=0;e<n;e++){let t=e*3;u[t+0]=(Math.random()-.5)*De,u[t+1]=(Math.random()-.5)*De,u[t+2]=(Math.random()-.5)*De}let f=new Float32Array(n*2*3),p=new E,m=new J(f,3);m.setUsage(b),p.setAttribute(`position`,m);let h=new j({color:13623551,transparent:!0,opacity:0,depthWrite:!1,depthTest:!0,blending:2}),g=new _(p,h);g.frustumCulled=!1,g.renderOrder=2;let v=new d;return v.name=`dust-field`,v.add(l),v.add(g),{object:v,update(e,r){for(let n=0;n<t;n++){let t=n*3;i[t+0]=Be(i[t+0],e.x),i[t+1]=Be(i[t+1],e.y),i[t+2]=Be(i[t+2],e.z)}s.attributes.position.needsUpdate=!0;let a=r.length(),o=N.clamp(a/Ie,0,1);c.uniforms.uOpacity.value=N.lerp(Le,Re,o);let l=0,d=0,m=-1;if(a>1e-4){let e=1/a;l=r.x*e,d=r.y*e,m=r.z*e}let g=N.clamp(a*.06,.3,4.5);for(let t=0;t<n;t++){let n=t*3;u[n+0]=Be(u[n+0],e.x),u[n+1]=Be(u[n+1],e.y),u[n+2]=Be(u[n+2],e.z);let r=u[n+0],i=u[n+1],a=u[n+2],o=t*6;f[o+0]=r,f[o+1]=i,f[o+2]=a,f[o+3]=r-l*g,f[o+4]=i-d*g,f[o+5]=a-m*g}p.attributes.position.needsUpdate=!0,h.opacity=N.clamp((a-Ne)/(Pe-Ne),0,1)*Fe},dispose(){s.dispose(),c.dispose(),p.dispose(),h.dispose(),r.dispose()}}}var We=1500,Ge=1600,Ke=20260712,qe=`
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
`,Je=`
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
`;function Ye(e){let t=e?800:We,n=_e(Ke),r=new Float32Array(t*3),i=new Float32Array(t),a=new Float32Array(t),o=new Float32Array(t),s=new Float32Array(t*3),c=new h(16777215),l=new h(12571903),u=new h(16769208),d=new h;for(let e=0;e<t;e++){let t,f,p,m;do t=n()*2-1,f=n()*2-1,p=n()*2-1,m=t*t+f*f+p*p;while(m<.01||m>1);let h=Ge/Math.sqrt(m);r[e*3]=t*h,r[e*3+1]=f*h,r[e*3+2]=p*h,i[e]=n()*Math.PI*2,a[e]=.5+n()*2.2,o[e]=.5+n()**2.4*1.9;let g=n();g<.12?d.copy(l):g<.2?d.copy(u):d.copy(c),d.multiplyScalar(.55+n()*.45),s[e*3]=d.r,s[e*3+1]=d.g,s[e*3+2]=d.b}let f=new E;f.setAttribute(`position`,new J(r,3)),f.setAttribute(`aPhase`,new J(i,1)),f.setAttribute(`aSpeed`,new J(a,1)),f.setAttribute(`aSize`,new J(o,1)),f.setAttribute(`aColor`,new J(s,3)),f.boundingSphere=new I(new S,1601);let p=new K({uniforms:{uTime:{value:0}},vertexShader:qe,fragmentShader:Je,transparent:!0,depthWrite:!1,depthTest:!0,blending:2}),m=new R(f,p);return m.frustumCulled=!1,m.renderOrder=0,m.name=`starfield-twinkle`,{object:m,update(e,t,n){m.position.copy(e),m.rotation.y=n,p.uniforms.uTime.value=t},dispose(){f.dispose(),p.dispose()}}}var Xe=`/v4/assets/skybox-8k.jpg`,Ze=`/v4/assets/skybox-4k.jpg`,Qe=`/v4/assets/skybox-2k.jpg`;function $e(){return typeof navigator>`u`?!1:!!navigator.connection?.saveData}function et(){return typeof navigator>`u`?!1:navigator.userAgentData?.mobile===!0?!0:/iPhone|iPod|Android.+Mobile/i.test(navigator.userAgent)}function tt(e,t){return t?[Qe]:e>=8192?[Xe,Ze,Qe]:e>=4096?(console.warn(`[v4] GPU maxTextureSize=${e} < 8192; sky fallback ${Ze}`),[Ze,Qe]):(console.warn(`[v4] GPU maxTextureSize=${e} < 4096; sky fallback ${Qe}`),[Qe])}async function nt(e,t){let n;for(let r of t)try{return{texture:await e.loadAsync(r),url:r}}catch(e){n=e,console.error(`[v4] sky texture failed to load: ${r}`,e)}throw n instanceof Error?n:Error(`[v4] sky texture failed to load: ${t.join(` → `)}`)}function rt(e){e.mapping=303,e.colorSpace=V,e.generateMipmaps=!1,e.minFilter=y,e.magFilter=y,e.wrapS=G,e.wrapT=O,e.anisotropy=1,e.needsUpdate=!0}var it=4500,at=`
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
`,ot=`
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
`;function st(e){let t=new Y(it,64,40),n=new K({uniforms:{uSky:{value:e},uSkyRot:{value:0}},vertexShader:at,fragmentShader:ot,side:1,depthWrite:!1,depthTest:!1}),r=new l(t,n);return r.frustumCulled=!1,r.renderOrder=-2,r.name=`sky-dome`,{mesh:r,setYaw(e){n.uniforms.uSkyRot.value=e},dispose(){t.dispose(),n.dispose()}}}async function ct(e,t){let{lowPower:n,manager:r,reducedMotion:i}=t,a=typeof location<`u`&&new URLSearchParams(location.search).has(`debug`),o=new ie({canvas:e,antialias:!n,alpha:!1,powerPreference:n?`default`:`high-performance`,preserveDrawingBuffer:a});o.setPixelRatio(me(n)),o.setClearColor(0,1),o.toneMapping=4,o.toneMappingExposure=1.18,o.outputColorSpace=V;let s=new P,c=new L(60,1,.8,6e3);c.position.set(0,4,16);let d=new ae(13688042,250,120,2);c.add(d),s.add(c);let f=new k(r),p=n||$e()||et(),m=tt(o.capabilities.maxTextureSize,p),h=m[0]===Qe?Promise.resolve(null):f.loadAsync(Qe).catch(e=>(console.error(`[v4] env sky texture failed to load: ${Qe}`,e),null)),[{texture:_,url:v},y]=await Promise.all([nt(f,m),h]);rt(_);let b=st(_);s.add(b.mesh);let S=y??_;y&&(y.mapping=303,y.colorSpace=V);let C=new ee(o);C.compileEquirectangularShader();let w=C.fromEquirectangular(S);s.environment=w.texture;let T=w.texture;if(y?.dispose(),a){let e=_.image;window.__v4Sky={url:v,imageWidth:e?.width??0,imageHeight:e?.height??0,generateMipmaps:_.generateMipmaps,minFilter:_.minFilter,magFilter:_.magFilter,wrapS:_.wrapS,colorSpace:_.colorSpace,anisotropy:_.anisotropy,maxTextureSize:o.capabilities.maxTextureSize,constrained:p}}s.add(new A(9085128,658448,.55));let E=new u(16773596,1.65);E.position.set(600,400,250),s.add(E);let D=new u(11847396,.95);D.position.set(-420,260,-380),s.add(D);let O=new ae(16760944,130,520,1.7);O.position.set(0,0,0),s.add(O);let j=Ue(n);s.add(j.object);let M=Ye(n);s.add(M.object);let N=new ce(o,{multisampling:n?0:4});N.addPass(new Z(s,c));let F=new ue({intensity:i?.1:n?.12:.16,luminanceThreshold:.985,luminanceSmoothing:.06,mipmapBlur:!0}),I=new fe({offset:.52,darkness:.22}),R=[F,new pe({contrast:.02,brightness:0}),new X({saturation:-.02}),I];if(!n&&!i){let e=new le({offset:new x(9e-4,9e-4),radialModulation:!0,modulationOffset:.15});R.splice(1,0,e)}N.addPass(new de(c,...R));let z=new g;a||z.connect(document);let B=new Set,H=0,U=!1,W=e=>a&&document.hidden?setTimeout(()=>e(performance.now()),16):requestAnimationFrame(e),G=e=>{if(!U)return;z.update(e);let t=Math.min(.05,z.getDelta()),n=z.getElapsed();for(let e of B)e(t,n);let r=n*Se;b.setYaw(r),M.update(c.position,n,r),N.render(t),H=W(G)};return{renderer:o,scene:s,camera:c,composer:N,dust:j,envMap:T,skyTex:_,setSize(e,t){e<2||t<2||(o.setSize(e,t,!1),N.setSize(e,t),c.aspect=e/Math.max(t,1),c.updateProjectionMatrix())},onTick(e){return B.add(e),()=>B.delete(e)},start(){U||(U=!0,z.reset(),H=W(G))},stop(){U=!1,clearTimeout(H),cancelAnimationFrame(H)},dispose(){U=!1,clearTimeout(H),cancelAnimationFrame(H),z.dispose(),B.clear(),j.dispose(),M.dispose(),b.dispose(),s.traverse(e=>{if(e instanceof l){let t=Array.isArray(e.material)?e.material:[e.material];for(let e of t)e?.dispose()}}),w.dispose(),C.dispose(),_.dispose(),N.dispose(),o.dispose(),o.getContext().getExtension(`WEBGL_lose_context`)?.loseContext()}}}var lt=22,ut=lt/5;lt*.42,ut*.42,lt*.16,new h(5093631),new h(10475775),new h(15398655),new h(3787263),`${xe}${ye}`;var dt=new S(1,0,0),ft=new S(0,1,0),pt=Math.PI/180,mt=1.9,ht=6.5,gt=8,_t=1.15,vt=7,yt=9,bt=52*pt,xt=20*pt,St=5,Ct=.1,wt=30,Tt=.999,Et=92,Dt=4.2,Ot=2.4,kt=new Set([`Space`]),At=new Set([`ShiftLeft`,`ShiftRight`]),jt=new Set([`KeyW`,`ArrowUp`]),Mt=new Set([`KeyS`,`ArrowDown`]),Nt=new Set([`KeyA`,`ArrowLeft`]),Pt=new Set([`KeyD`,`ArrowRight`]),Ft=new Set([`KeyQ`]),It=new Set([`KeyE`]),Lt=new Set([`Space`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`]);function Rt(e,t){let n=new Set,r={position:e.clone(),quaternion:new B,velocity:new S,angularVelocity:new S,bankAngle:0,thrustLevel:0,brakeLevel:0,speed:0,hasThrusted:!1},i=e=>{n.add(e.code),Lt.has(e.code)&&e.preventDefault()},a=e=>{n.delete(e.code)},o=()=>n.clear();window.addEventListener(`keydown`,i,{passive:!1}),window.addEventListener(`keyup`,a),window.addEventListener(`blur`,o);let s=e=>{for(let t of e)if(n.has(t))return!0;return!1},c=new S,l=new B,u=new B,d=new w(0,0,0,`YXZ`);return{state:r,update(e){let n=0;s(jt)&&--n,s(Mt)&&(n+=1),t&&(t.pitch!==0||n===0)&&(n=Math.max(-1,Math.min(1,n+t.pitch)));let i=n*mt,a=n===0?gt:ht;r.angularVelocity.x+=(i-r.angularVelocity.x)*Math.min(1,a*e),r.angularVelocity.x*=Math.exp(-3.2*e);let o=0;s(Nt)&&(o+=1),s(Pt)&&--o,t&&(t.turn!==0||o===0)&&(o=Math.max(-1,Math.min(1,o+t.turn)));let f=o*_t,p=f===0?yt:vt;r.angularVelocity.y+=(f-r.angularVelocity.y)*Math.min(1,p*e);let m=Ct*Math.abs(r.angularVelocity.y)/_t,h=0;s(Ft)&&(h+=1),s(It)&&--h;let g=r.angularVelocity.y/_t*bt+h*xt;r.bankAngle+=(g-r.bankAngle)*Math.min(1,St*e),r.angularVelocity.z=0,l.setFromAxisAngle(dt,(r.angularVelocity.x+m)*e),u.setFromAxisAngle(ft,r.angularVelocity.y*e),r.quaternion.multiply(l).multiply(u),r.quaternion.normalize(),d.setFromQuaternion(r.quaternion,`YXZ`),Math.abs(d.x)<1.35&&(d.z=0,r.quaternion.setFromEuler(d));let _=s(kt)||(t?.thrust??!1),v=s(At)||(t?.brake??!1);_&&(r.hasThrusted=!0),c.set(0,0,-1).applyQuaternion(r.quaternion);let y=r.velocity.length();if(_){let t=Math.max(0,1-(y/Et)**2);r.velocity.addScaledVector(c,54*t*e)}if(v&&y>.05){let t=r.velocity.clone().normalize(),n=Math.min(wt*e,y);r.velocity.addScaledVector(t,-n)}r.velocity.multiplyScalar(Tt),r.position.addScaledVector(r.velocity,e),r.speed=r.velocity.length();let b=+!!_,x=_?Dt:Ot;r.thrustLevel+=(b-r.thrustLevel)*Math.min(1,x*e),r.brakeLevel+=(+!!v-r.brakeLevel)*Math.min(1,4*e)},dispose(){window.removeEventListener(`keydown`,i),window.removeEventListener(`keyup`,a),window.removeEventListener(`blur`,o),n.clear()}}}var zt=52,Bt=.12;function Vt(e,t,n){return Math.max(t,Math.min(n,e))}function Ht(e){let t=Math.abs(e);return t<Bt?0:Math.sign(e)*((t-Bt)/(1-Bt))}function Ut(e){let t={pitch:0,turn:0,thrust:!1,brake:!1};if(!window.matchMedia(`(pointer: coarse)`).matches)return{input:t,active:!1,setArmed(){},dispose(){}};let n=document.createElement(`div`);n.className=`v4-touch is-prelaunch`,n.setAttribute(`aria-hidden`,`true`),n.innerHTML=`
    <div class="v4-touch__stick-zone" aria-hidden="true">
      <div class="v4-touch__stick-ring"></div>
      <div class="v4-touch__stick-knob"></div>
    </div>
    <div class="v4-touch__actions">
      <button type="button" class="v4-touch__btn v4-touch__btn--brake" data-action="brake" aria-label="Hamowanie">HAM</button>
      <button type="button" class="v4-touch__btn v4-touch__btn--thrust" data-action="thrust" aria-label="Ciąg główny">CIĄG</button>
    </div>
  `,e.appendChild(n);let r=n.querySelector(`.v4-touch__stick-zone`),i=n.querySelector(`.v4-touch__stick-knob`),a=n.querySelector(`[data-action="thrust"]`),o=n.querySelector(`[data-action="brake"]`),s=null,c=0,l=0;function u(){s=null,t.pitch=0,t.turn=0,i.style.transform=`translate(-50%, -50%)`}function d(e,n){let r=e-c,a=n-l,o=Math.hypot(r,a),s=o>zt?zt/o:1,u=r*s/zt,d=a*s/zt;i.style.transform=`translate(calc(-50% + ${u*zt}px), calc(-50% + ${d*zt}px))`,t.pitch=Ht(Vt(-d,-1,1)),t.turn=Ht(Vt(u,-1,1))}let f=e=>{if(s!==null)return;s=e.pointerId;let t=r.getBoundingClientRect();c=t.left+t.width/2,l=t.top+t.height/2,d(e.clientX,e.clientY);try{r.setPointerCapture(e.pointerId)}catch{}e.preventDefault()},p=e=>{e.pointerId===s&&(d(e.clientX,e.clientY),e.preventDefault())},m=e=>{e.pointerId===s&&(r.releasePointerCapture(e.pointerId),u(),e.preventDefault())};r.addEventListener(`pointerdown`,f),r.addEventListener(`pointermove`,p),r.addEventListener(`pointerup`,m),r.addEventListener(`pointercancel`,m);let h=(e,n,r)=>{t[r]=n,e.classList.toggle(`is-active`,n)},g=(e,t)=>{let n=n=>{h(e,!0,t);try{e.setPointerCapture(n.pointerId)}catch{}n.preventDefault()},r=n=>{e.hasPointerCapture(n.pointerId)&&e.releasePointerCapture(n.pointerId),h(e,!1,t),n.preventDefault()};return e.addEventListener(`pointerdown`,n),e.addEventListener(`pointerup`,r),e.addEventListener(`pointercancel`,r),()=>{e.removeEventListener(`pointerdown`,n),e.removeEventListener(`pointerup`,r),e.removeEventListener(`pointercancel`,r)}},_=g(a,`thrust`),v=g(o,`brake`),y=()=>{u(),h(a,!1,`thrust`),h(o,!1,`brake`)};return window.addEventListener(`blur`,y),{input:t,active:!0,setArmed(e){n.classList.toggle(`is-prelaunch`,!e),n.setAttribute(`aria-hidden`,e?`false`:`true`),e||(u(),h(a,!1,`thrust`),h(o,!1,`brake`))},dispose(){window.removeEventListener(`blur`,y),r.removeEventListener(`pointerdown`,f),r.removeEventListener(`pointermove`,p),r.removeEventListener(`pointerup`,m),r.removeEventListener(`pointercancel`,m),_(),v(),n.remove()}}}var Q=new S(0,0,0),Wt=[{id:`mint`,position:new S(784,126,-364),radius:40,color:3003583},{id:`plumm`,position:new S(-588,-196,728),radius:34,color:9071615},{id:`idrive`,position:new S(420,308,1176),radius:28,color:16762977},{id:`agentic`,position:new S(-1092,-84,-840),radius:45,color:16098596}],Gt=.15,Kt=6.8,qt=56,Jt=48,Yt=2.4,Xt=55,Zt=60,Qt=58,$t=62,en=6.5,tn=10,nn=16,rn=50,an=.95,on=.37,sn={length:34,span:7.4,height:3.3},cn=.45,ln=.9,un=new S(0,1,0),dn=new S(0,0,-1),fn=new S(0,1,0);function pn(e,t){return!Number.isFinite(e.x+e.y+e.z)||e.lengthSq()<1e-10?t.clone():e.normalize()}function mn(e){let t=N.clamp(e,0,1);return t*t*(3-2*t)}function hn(e){let t=e?.length,n=e?.span,r=e?.height;return{length:Number.isFinite(t)&&t>8?t:sn.length,span:Number.isFinite(n)&&n>2?n:sn.span,height:Number.isFinite(r)&&r>1?r:sn.height}}function gn(e){return e>0&&e<.62?{fov:55,sideOverBack:.24,heightOverBack:.5,widthTarget:.4,cyTarget:.54,bottomNdc:-.62,lookAheadMul:.9,lookLiftMul:2.2}:e>0&&e<.85?{fov:53,sideOverBack:.26,heightOverBack:.46,widthTarget:.38,cyTarget:.56,bottomNdc:-.66,lookAheadMul:.8,lookLiftMul:2}:{fov:rn,sideOverBack:.32,heightOverBack:.48,widthTarget:on,cyTarget:.62,bottomNdc:-.74,lookAheadMul:.55,lookLiftMul:2.1}}function _n(e,t){let n=hn(t),r=[];for(let e of[-.5,.5])for(let t of[-.5,.5])for(let i of[-.5,.5])r.push(new S(e*n.span,t*n.height,i*n.length));let i=new S,a=new S,o=new S,s=new S,c=new S,l=new S,u=new S,d=new S(Gt,Kt,qt),f=new S,p=new S,m=new S,h=new S,g=new S,_=new B,v=new B,y=new S,b=new B,x=new L;x.up.copy(un);let C=0,w=rn,T=`launch`,E=0,D=!1;e.fov=Xt,e.updateProjectionMatrix();function O(t,o){let s=e.aspect>.05?e.aspect:1.6,u=gn(s);w=u.fov,c.set(0,0,-1).applyQuaternion(o),pn(c,dn),l.set(0,1,0).applyQuaternion(o),pn(l,fn),m.set(1,0,0).applyQuaternion(o),m.lengthSq()<1e-8&&m.crossVectors(c,un),m.normalize(),x.near=e.near,x.far=e.far,x.aspect=s,x.fov=w,x.up.copy(un);let d=Math.hypot(1,u.heightOverBack,u.sideOverBack),f=N.degToRad(w),p=2*Math.atan(Math.tan(f/2)*s),v=(n.length*.72+n.span*.85)/Math.max(.12,u.widthTarget*2*Math.tan(p/2)),y=n.length*1.05,b=n.length*3.2;v=N.clamp(v,y,b);let S=n.length*u.lookAheadMul,C=n.height*u.lookLiftMul,T=n.length*.12,E=n.length*2.2,D=()=>{let e=v/d;h.copy(t).addScaledVector(c,-e).addScaledVector(un,e*u.heightOverBack).addScaledVector(m,e*u.sideOverBack),g.copy(t).addScaledVector(c,S).addScaledVector(un,C),x.fov=w,x.position.copy(h),x.lookAt(g),x.updateProjectionMatrix(),x.updateMatrixWorld(!0)};for(let e=0;e<10;e++){D();let e=1/0,s=-1/0,c=1/0,l=-1/0;for(let n of r)i.copy(n).applyQuaternion(o).add(t),a.copy(i).project(x),Number.isFinite(a.x+a.y)&&(e=Math.min(e,a.x),s=Math.max(s,a.x),c=Math.min(c,a.y),l=Math.max(l,a.y));if(!Number.isFinite(e))break;let d=(s-e)*.5,f=.5-(c+l)*.25,p=c<u.bottomNdc,m=e<-.9||s>.9||l>.92||p;if(p){S=Math.max(T,S*.78),C=Math.max(n.height*.3,C*.88),v=Math.min(b,v*1.07);continue}if(m){v=Math.min(b,v*1.08);continue}if(d>.02){let e=v*(d/u.widthTarget);v=N.clamp(v+(e-v)*.55,y,b)}f<u.cyTarget-.04?(S=Math.min(E,S+n.length*.06),C=Math.min(n.height*5,C+n.height*.2)):f>u.cyTarget+.05&&(S=Math.max(T,S-n.length*.08),C=Math.max(n.height*.3,C-n.height*.18)),a.copy(Q).project(x),Number.isFinite(a.y)&&.5-a.y*.5>.44&&!p&&(S=Math.min(E,S+n.length*.05)),S=N.clamp(S,T,E),C=N.clamp(C,n.height*.3,n.height*5)}D(),x.up.copy(un),x.lookAt(g),_.copy(x.quaternion)}function k(){e.position.copy(h),e.quaternion.copy(_),e.up.copy(un),Math.abs(e.fov-w)>.01&&(e.fov=w,e.updateProjectionMatrix())}function A(e,t){T=`launch`,E=0,D=!1,C=0,f.set(0,0,0),d.set(Gt,Kt,qt),O(e,t),k()}function j(t,n,r,i,a){let m=Number.isFinite(t)&&t>0?Math.min(t,.05):1/60,h=a?Math.min(Math.hypot(a.x,a.y),12):0,g=a?N.clamp(-a.y*cn,-.9,ln):0,_=a?N.clamp(a.x*cn,-.9,ln):0,y=1-Math.exp(-8*m);f.x+=(g-f.x)*y,f.y+=(_-f.y)*y;let b=N.clamp(Number.isFinite(i)?i:0,0,1),S=b*en;C+=(S-C)*(1-Math.exp(-4.5*m)),u.set(Gt+f.x,Kt+f.y,qt+C);let w=1-Math.exp(-(tn+h*nn)*m);d.lerp(u,w),o.copy(d).applyQuaternion(r).add(n),c.set(0,0,-1).applyQuaternion(r),pn(c,dn),l.set(0,1,0).applyQuaternion(r),pn(l,fn),s.copy(n).addScaledVector(c,Jt).addScaledVector(l,Yt),x.position.copy(o),p.copy(s).sub(o),p.lengthSq()>1e-8?(p.normalize(),x.up.copy(Math.abs(p.dot(un))>.92?l:un)):x.up.copy(un),x.lookAt(s),v.copy(x.quaternion);let T=e.aspect>0&&e.aspect<.85,E=T?Qt:Xt,D=T?$t:Zt;return{fov:N.lerp(E,D,b*b)}}function M(t){e.position.copy(o),e.quaternion.copy(v),e.up.copy(x.up),Math.abs(e.fov-t)>.01&&(e.fov=t,e.updateProjectionMatrix())}return{holdLaunch:A,getPhase(){return T},update(t,n,r,i,a,s,c){if(!c.hasThrusted){A(n,r);return}D||(D=!0,O(n,r),y.copy(e.position),b.copy(e.quaternion),c.reducedMotion?(T=`chase`,E=1):(T=`blend`,E=0));let l=j(t,n,r,i,s);if(T===`blend`){E=Math.min(1,E+(Number.isFinite(t)&&t>0?Math.min(t,.05):1/60)/an);let n=mn(E);e.position.lerpVectors(y,o,n),e.quaternion.slerpQuaternions(b,v,n),e.up.copy(un).lerp(x.up,n).normalize();let r=N.lerp(w,l.fov,n);Math.abs(e.fov-r)>.01&&(e.fov=r,e.updateProjectionMatrix()),E>=1&&(T=`chase`);return}M(l.fov)}}}function vn(e){let t=Math.floor(Math.max(0,e)/100),n=t%10,r=Math.floor(t/10),i=r%60,a=Math.floor(r/60);return`${String(a).padStart(2,`0`)}:${String(i).padStart(2,`0`)}.${n}`}function yn(e){let t=new Date(e);return Number.isNaN(t.getTime())?`--.--`:`${String(t.getDate()).padStart(2,`0`)}.${String(t.getMonth()+1).padStart(2,`0`)}`}function bn(e,t){let n=e.match(/[^.!?]+[.!?]+(\s+|$)/g);return!n||n.length===0?e.trim():n.slice(0,t).join(``).trim()}var xn={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`};function Sn(e){return e.replace(/[&<>"']/g,e=>xn[e]??e)}function Cn(e){if(!e)return!1;let t=e.trim();if(!t||t===`#`||t.startsWith(`#`))return!1;try{let e=new URL(t);return e.protocol===`http:`||e.protocol===`https:`}catch{return!1}}var wn=`https://marcinbochenek.com`,Tn=8e3,En=.4;function Dn(e,t={}){let n=typeof location<`u`&&new URLSearchParams(location.search).has(`debug`);for(let t of e.querySelectorAll(`.stats, #stats, [class*="fps"]`))t.remove();let r=t.touchActive??!1,i=t.launchByTap??r,a=r?`<span>Lewy drążek</span> — lot · <span>Ciąg</span> — napęd · <span>Ham</span> — hamowanie`:`<span>W/S</span> — pochylenie · <span>A/D</span> — skręt · <span>Spacja</span> — ciąg · <span>Shift</span> — hamowanie`,o=i?`Dotknij, aby uruchomić silniki`:`Naciśnij <span class="v4-hud__start-keys">Spację</span>, aby uruchomić silniki`,s=document.createElement(`div`);s.className=`v4-hud`,s.innerHTML=`
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
      <div class="v4-hud__pips">${Wt.map(e=>`<span class="v4-hud__pip" data-planet="${e.id}"></span>`).join(``)}</div>
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
      <a href="${wn}">&larr; klasyczne portfolio</a>
    </div>
  `,e.appendChild(s);let c=s.querySelector(`.v4-hud__speed-value`),l=s.querySelector(`.v4-hud__thrust-fill`),u=s.querySelector(`.v4-hud__legend`),d=s.querySelector(`.v4-hud__start-prompt`);i&&t.onLaunch&&d.addEventListener(`pointerdown`,e=>{e.preventDefault(),t.onLaunch?.()});let f=s.querySelector(`.v4-hud__timer`),p=s.querySelector(`.v4-hud__warning`),m=Array.from(s.querySelectorAll(`.v4-hud__pip`)),h=s.querySelector(`.v4-hud__fps`),g=performance.now(),_=0,v=0,y=En*54,b=y*.78,x=!1,S=0,C=!1;function w(){window.clearTimeout(S),S=window.setTimeout(()=>{u.classList.remove(`is-visible`),u.setAttribute(`aria-hidden`,`true`)},Tn)}return{update(e){if(c.textContent=String(Math.round(e.speed)).padStart(2,`0`),l.style.transform=`scaleX(${Math.max(0,Math.min(1,e.thrust))})`,e.hasThrusted&&!x&&(x=!0,d.classList.add(`is-hidden`),u.classList.add(`is-visible`),u.setAttribute(`aria-hidden`,`false`),w()),f.textContent=vn(e.missionMs),h){let e=performance.now(),t=e-g;if(g=e,t>.75&&t<250){let e=1e3/t;_=v===0?e:_*.88+e*.12,v+=1,v>=8&&_>=1&&(h.hidden=!1,h.textContent=`${Math.round(_)} fps`)}}C=C?e.gravityAccel>b:e.gravityAccel>y,p.classList.toggle(`is-visible`,C);for(let t of m){let n=t.dataset.planet;t.classList.toggle(`is-found`,e.discovered.has(n))}},reset(){x=!1,C=!1,window.clearTimeout(S),d.classList.remove(`is-hidden`),u.classList.remove(`is-visible`),u.setAttribute(`aria-hidden`,`true`),p.classList.remove(`is-visible`)},dispose(){window.clearTimeout(S),s.remove()}}}var On=108,kn=On,An=On,jn=kn,Mn=kn*1.012,Nn=.92,Pn=kn*1.08,Fn=kn*3.05,In=Fn*1.38,Ln=7.5,Rn=.94,zn=4,Bn=2,Vn=kn*1.78,Hn=Vn,Un=`
  vec2 diskSpun(float cu, float cv, float rad, float omega, float time) {
    vec2 dir = vec2(cu, cv) / max(rad, 1.0e-4);
    float ca = cos(time * omega);
    float sa = sin(time * omega);
    return vec2(dir.x * ca + dir.y * sa, -dir.x * sa + dir.y * ca);
  }
`,Wn=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`,Gn=`
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

  ${xe}
  ${Un}

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
    ${ye}
  }
`,Kn=`
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,qn=`
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

  ${xe}
  ${Un}

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
    ${ye}

    if (uRayPlane > 0.5) {
      vec4 clipHit = uViewProj * vec4(hit, 1.0);
      gl_FragDepth = clipHit.z / clipHit.w * 0.5 + 0.5;
    } else {
      gl_FragDepth = gl_FragCoord.z;
    }
  }
`;function Jn(e,t){let n=e.material;return{name:t,visible:e.visible,renderOrder:e.renderOrder,depthTest:n.depthTest,depthWrite:n.depthWrite,transparent:n.transparent,blending:n.blending,side:n.side}}function Yn(e,t,n){let r=N.degToRad(Ln),i=new S(0,Math.cos(r),Math.sin(r)).normalize(),a=new S(1,0,0),o=new S().crossVectors(i,a).normalize();a.crossVectors(o,i).normalize();let s=new W(2,2),c=new K({uniforms:{uBHPos:{value:Q.clone()},uHorizonR:{value:An},uShadowR:{value:kn},uPhotonR:{value:Mn},uPhotonWidth:{value:Nn},uDiskInner:{value:Pn},uDiskOuter:{value:Fn},uInfluenceR:{value:Vn},uDiskU:{value:a},uDiskV:{value:o},uDiskN:{value:i},uTime:{value:0},uBendK:{value:Rn},uArcSamples:{value:t?Bn:zn},uSky:{value:e},uSkyRot:{value:0},uCamPos:{value:new S},uCamRight:{value:new S},uCamUp:{value:new S},uCamFwd:{value:new S},uResolution:{value:new x(1,1)},uTanHalfFov:{value:1},uAspect:{value:1}},vertexShader:Wn,fragmentShader:Gn,depthTest:!0,depthWrite:!1,transparent:!0,blending:2,toneMapped:!0,side:0}),u=new l(s,c);u.frustumCulled=!1,u.renderOrder=7,u.name=`black-hole-lensing`,u.scale.setScalar(Vn);let f=new Y(jn,64,48),p=new z({color:0,toneMapped:!1,depthWrite:!0,depthTest:!0,transparent:!1,fog:!1});p.colorWrite=!0;let m=new l(f,p);m.name=`black-hole-horizon`,m.renderOrder=0,m.frustumCulled=!1;let h=new z({color:0,toneMapped:!1,depthTest:!0,depthWrite:!1,depthFunc:3,transparent:!0,opacity:1,blending:1,fog:!1,side:0}),g=new l(f,h);g.name=`black-hole-aperture-seal`,g.renderOrder=6,g.frustumCulled=!1;let _=new U(Pn,In,192,12),v=new K({uniforms:{uBHPos:{value:Q.clone()},uDiskInner:{value:Pn},uDiskOuter:{value:Fn},uShadowR:{value:kn},uDiskU:{value:a},uDiskV:{value:o},uDiskN:{value:i},uTime:{value:0},uCamNear:{value:.8},uRayPlane:{value:0},uHideFar:{value:1},uViewProj:{value:new T}},vertexShader:Kn,fragmentShader:qn,depthTest:!0,depthWrite:!0,transparent:!1,toneMapped:!0,side:2}),y=new l(_,v);y.name=`black-hole-disk`,y.renderOrder=1,y.quaternion.setFromUnitVectors(new S(0,0,1),i),y.frustumCulled=!1;let b=new Y(In,64,48),C=new l(b,v);C.name=`black-hole-disk-proxy`,C.renderOrder=1,C.visible=!1,C.frustumCulled=!1;let w=new d;w.name=`black-hole`,w.position.copy(Q),w.add(m),w.add(y),w.add(C),w.add(g),w.add(u);let E=new d;E.name=`black-hole-debug-bounds`,E.visible=!1;let D=new l(new Y(jn,32,24),new z({color:4521932,wireframe:!0,depthTest:!1,toneMapped:!1}));D.name=`black-hole-horizon-wire`;let O=new H(jn*1.6);O.name=`black-hole-axes`,E.add(D),E.add(O),w.add(E);let k=new S,A=new S,j=new S,M=new S,P=new x;return{object:w,update(e,t,r){c.uniforms.uTime.value=t,c.uniforms.uSkyRot.value=t*Se,r.updateMatrixWorld(),v.uniforms.uTime.value=t,v.uniforms.uCamNear.value=r.near,v.uniforms.uViewProj.value.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),k.copy(Q).sub(r.position),A.set(0,0,-1).applyQuaternion(r.quaternion),j.set(1,0,0).applyQuaternion(r.quaternion),M.set(0,1,0).applyQuaternion(r.quaternion);let i=k.dot(A),a=k.length(),o=a<jn+4;c.uniforms.uCamPos.value.copy(r.position),c.uniforms.uCamFwd.value.copy(A),c.uniforms.uCamRight.value.copy(j),c.uniforms.uCamUp.value.copy(M),c.uniforms.uTanHalfFov.value=Math.tan(N.degToRad(r.fov)*.5),c.uniforms.uAspect.value=r.aspect,n.getDrawingBufferSize(P),c.uniforms.uResolution.value.copy(P),u.lookAt(r.position),u.userData.forceHidden||(u.visible=!o&&i>4),g.userData.forceHidden||(g.visible=!o);let s=!!y.userData.forceHidden,l=a<In+16;s?(y.visible=!1,C.visible=!1):l?(v.uniforms.uRayPlane.value=1,y.visible=!1,C.visible=!0,v.side=+(a<In-1)):(v.uniforms.uRayPlane.value=0,y.visible=!0,C.visible=!1,v.side=2),v.uniforms.uHideFar.value=1},setLayerVisible(e,t){e===`horizon`?(m.visible=t,g.userData.forceHidden||(g.visible=t)):e===`lensing`?(u.userData.forceHidden=!t,u.visible=t):e===`seal`?(g.userData.forceHidden=!t,g.visible=t):(y.userData.forceHidden=!t,y.visible=t,C.visible=!1)},getLayerState(){return{horizon:Jn(m,m.name),seal:Jn(g,g.name),lensing:Jn(u,u.name),disk:Jn(y,y.name)}},getRadii(){return{physicalRs:On,apparentShadow:kn,photonRing:Mn,diskInner:Pn,diskOuter:Fn,diskGeoOuter:In,lensShell:Hn}},getDiskFrame(){return{u:a.clone(),v:o.clone(),n:i.clone(),inner:Pn,outer:Fn}},setDebugBounds(e){E.visible=e},dispose(){s.dispose(),c.dispose(),f.dispose(),p.dispose(),h.dispose(),_.dispose(),b.dispose(),v.dispose(),D.geometry.dispose(),D.material.dispose(),O.geometry.dispose(),O.material.dispose()}}}var Xn=`
  precision highp float;

  uniform sampler2D uEarthTex;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  ${ge}
  ${xe}

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
    ${ye}
  }
`,Zn=`
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
`,Qn=`
  precision highp float;
  uniform float uTime;
  uniform float uRadius;
  varying vec3 vLocalDir;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  ${ge}
  ${xe}

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
    ${ye}
  }
`;function $n(e,t,n=!1){let r=new d;r.name=`planet-mint`;let[i,a]=n?[96,64]:[128,96],o=new Y(e,i,a),s=new K({uniforms:{uEarthTex:{value:t},uRadius:{value:e}},vertexShader:he,fragmentShader:Xn}),c=new l(o,s);r.add(c);let u=new Y(e*1.025,n?64:84,n?44:60),f=new K({uniforms:{uTime:{value:0},uRadius:{value:e}},vertexShader:Zn,fragmentShader:Qn,transparent:!0,depthWrite:!1}),p=new l(u,f);p.renderOrder=2,r.add(p);let m=we(e,16767392,{power:2.3,intensity:1.25});return r.add(m.mesh),{group:r,update(e){c.rotation.y+=e*.018,p.rotation.y+=e*.026,f.uniforms.uTime.value+=e},dispose(){o.dispose(),s.dispose(),u.dispose(),f.dispose(),m.dispose()}}}var er=`
  precision highp float;

  uniform sampler2D uCityTex;
  uniform float uTime;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vLocalDir;
  varying vec3 vWorldPos;

  ${ge}
  ${xe}

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
    ${ye}
  }
`;function tr(e,t,n){let r=new d;r.name=`planet-plumm`;let[i,a]=n?[96,64]:[128,96],o=new Y(e,i,a),s=new K({uniforms:{uCityTex:{value:t},uTime:{value:0},uRadius:{value:e}},vertexShader:be,fragmentShader:er}),c=new l(o,s);r.add(c);let u=we(e,9071615,{power:2.8,intensity:1.35});r.add(u.mesh);let f=[],p=[];if(!n){let t=[{r:e*1.28,speed:.22,tilt:.06,opacity:.55},{r:e*1.48,speed:-.16,tilt:-.09,opacity:.4},{r:e*1.7,speed:.12,tilt:.14,opacity:.3}];for(let n of t){let t=new m(n.r,e*.006,8,160),i=new z({color:11246557,transparent:!0,opacity:n.opacity,blending:2,depthWrite:!1}),a=new l(t,i);a.rotation.x=Math.PI/2+n.tilt,a.renderOrder=2,r.add(a),f.push({mesh:a,speed:n.speed}),p.push({geo:t,mat:i})}}let h=n?20:48,g=new E;{let e=1.8,t=new Float32Array([0,0,-1.8*.55,-.62,.12,e*.45,0,-.1,e*.38,0,0,-1.8*.55,0,-.1,e*.38,.62,.12,e*.45]);g.setAttribute(`position`,new J(t,3)),g.computeVertexNormals()}let _=new z({color:15854847,side:2}),y=new v(g,_,h);y.frustumCulled=!1,r.add(y);let b=[];{let t=(()=>{let e=2636928641;return()=>(e=Math.imul(e^e>>>15,e|1),(e>>>16&65535)/65535)})(),n=new S;for(let r=0;r<h;r++)n.set(t()*2-1,t()*2-1,t()*2-1).normalize(),b.push({quat:new B().setFromAxisAngle(n,t()*Math.PI*2),r:e*(1.16+t()*.42),speed:(.1+t()*.22)*(t()<.5?1:-1),phase:t()*Math.PI*2,bank:(t()-.5)*.9})}let x=new S,C=new S,w=new S,D=new S,O=new S,k=new S(1,1,1),A=new T,j=new B,M=new B,N=new T,P=new S(0,0,1);function F(e){for(let t=0;t<h;t++){let n=b[t],r=n.phase+e*n.speed,i=Math.sign(n.speed)||1;x.set(Math.cos(r)*n.r,0,Math.sin(r)*n.r).applyQuaternion(n.quat),C.set(-Math.sin(r)*i,0,Math.cos(r)*i).applyQuaternion(n.quat).normalize(),w.copy(x).normalize(),O.copy(C).multiplyScalar(-1),D.crossVectors(w,O).normalize(),w.crossVectors(O,D),A.makeBasis(D,w,O),j.setFromRotationMatrix(A),M.setFromAxisAngle(P,n.bank),j.multiply(M),N.compose(x,j,k),y.setMatrixAt(t,N)}y.instanceMatrix.needsUpdate=!0}return F(0),{group:r,update(e,t){c.rotation.y+=e*.014,s.uniforms.uTime.value=t;for(let t of f)t.mesh.rotation.z+=e*t.speed;F(t)},dispose(){o.dispose(),s.dispose(),u.dispose(),g.dispose(),_.dispose(),y.dispose();for(let e of p)e.geo.dispose(),e.mat.dispose()}}}var nr=1056,rr=`
  precision highp float;

  uniform float uRadius;
  varying vec3 vNormalW;
  varying vec3 vLocalDir;
  varying vec3 vWorldPos;

  ${ge}
  ${xe}

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
    ${ye}
  }
`,ir=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,ar=`
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
    ${ye}
  }
`,or=`
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
`,sr=`
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
    ${ye}
  }
`,cr=class extends q{shellRadius;constructor(e,t){super(e,!0,`centripetal`),this.shellRadius=t}getPoint(e,t=new S){return super.getPoint(e,t),t.setLength(this.shellRadius)}},lr=[{kind:`straight`,weight:1.7},{kind:`hairpin`,weight:.6,sign:1},{kind:`straight`,weight:1.3},{kind:`corner`,weight:.8,sign:-1},{kind:`chicane`,weight:.8,sign:1},{kind:`straight`,weight:1.6},{kind:`hairpin`,weight:.6,sign:-1},{kind:`straight`,weight:1.2},{kind:`corner`,weight:.8,sign:1},{kind:`straight`,weight:1.5}];function ur(e){let t=e*1.02,n=e*.018,r=_e(nr),i=lr.reduce((e,t)=>e+t.weight,0),a=r()*Math.PI*2,o=[];for(let e of lr){let t=e.weight/i*Math.PI*2,n=a+t/2,s=e.sign??1;if(e.kind===`straight`)o.push({theta:n+(r()-.5)*t*.3,lat:(r()-.5)*.24});else if(e.kind===`corner`){let e=.38+r()*.14;o.push({theta:n,lat:s*e})}else if(e.kind===`chicane`){let e=t*.26,i=.34+r()*.1;o.push({theta:n-e,lat:s*i}),o.push({theta:n+e,lat:-s*i})}else{let e=t*.38,i=.46+r()*.08;o.push({theta:n-e,lat:s*i*.6}),o.push({theta:n,lat:s*(i+.08)}),o.push({theta:n+e,lat:s*i*.6})}a+=t}let s=new cr(o.map(({theta:e,lat:n})=>{let r=Math.PI/2-n;return new S(t*Math.sin(r)*Math.cos(e),t*Math.cos(r),t*Math.sin(r)*Math.sin(e))}),t),c=[];for(let e=0;e<256;e++)c.push(s.getPointAt(e/256,new S));let l=n*5.2,u=new S,d=new S;for(let e=0;e<80;e++){let e=!0,n=c.map(e=>e.clone());for(let r=0;r<256;r++){let i=n[(r-1+256)%256],a=n[r],o=n[(r+1)%256];u.subVectors(a,i),d.subVectors(o,a);let s=(u.length()+d.length())/2,f=u.normalize().angleTo(d.normalize());f<1e-5||s/f>=l||(e=!1,c[r].copy(i).add(o).multiplyScalar(.5).sub(a).multiplyScalar(.6).add(a).setLength(t))}if(e)break}for(let e=0;e<2;e++){let e=c.map(e=>e.clone());for(let n=0;n<256;n++){let r=e[(n-1+256)%256],i=e[n],a=e[(n+1)%256];c[n].copy(r).add(a).multiplyScalar(.5).sub(i).multiplyScalar(.25).add(i).setLength(t)}}let f=new cr(c,t);return f.arcLengthDivisions=800,f}function dr(e,t){let n=new d;n.name=`planet-idrive`;let[r,i]=t?[96,64]:[128,96],a=new Y(e,r,i),o=new K({uniforms:{uRadius:{value:e}},vertexShader:be,fragmentShader:rr}),s=new l(a,o);n.add(s);let c=e*.018,u=ur(e),f=new C(u,t?220:400,c,14,!0),p=new K({vertexShader:ir,fragmentShader:ar}),m=new l(f,p);n.add(m);let g=we(e,10133672,{power:3.2,intensity:.55});n.add(g.mesh);let _=t?16:28,y=_e(1057),x=e*.031,w=x*.5,D=x*.2,O=Array.from({length:_},(e,t)=>{let n=(t%2==0?-1:1)*(.55+y()*.45)*.4*c;return{t:y(),speed:.028+y()*.05,lane:n,lift:Math.sqrt(Math.max(c*c-n*n,0))+D*.5+c*.04}}),k=new se(w,D,x),A=new te({color:16777215,roughness:.45,metalness:.55,emissive:2364677,emissiveIntensity:.9}),j=new v(k,A,_);j.instanceMatrix.setUsage(b),j.frustumCulled=!1;let M=[12106948,4869720,10238770,3364477,12159534,4025167],N=new h;for(let e=0;e<_;e++)N.setHex(M[e%M.length]),j.setColorAt(e,N);n.add(j);let P=_*3,F=new Float32Array(P*3),I=new Float32Array(P*3),L=new Float32Array(P),z=new Float32Array(P),B=new Float32Array(P),V=new h(16768160),H=new h(16777215),U=new h(16774880),ee=new h(16723224);for(let t=0;t<_;t++){let n=t*3;N.copy(V).lerp(H,y()*.5),I.set([N.r,N.g,N.b],n*3),L[n]=e*(.1+y()*.05),z[n]=.9,B[n]=1,I.set([U.r,U.g,U.b],(n+1)*3),L[n+1]=x*.5,z[n+1]=1,B[n+1]=0,I.set([ee.r,ee.g,ee.b],(n+2)*3),L[n+2]=x*.55,z[n+2]=1,B[n+2]=0}let W=new E;W.setAttribute(`position`,new J(F,3)),W.setAttribute(`aColor`,new J(I,3)),W.setAttribute(`aSize`,new J(L,1)),W.setAttribute(`aAlpha`,new J(z,1)),W.setAttribute(`aFadeNear`,new J(B,1));let G=new K({vertexShader:or,fragmentShader:sr,transparent:!0,depthWrite:!1,blending:2}),ne=new R(W,G);ne.frustumCulled=!1,ne.renderOrder=3,n.add(ne);let re=W.attributes.position,ie=new S,ae=new S,oe=new S,q=new S,ce=new S,X=new S,Z=new S,le=new T;function ue(e){let t=O[e];u.getPointAt(t.t,ie),u.getPointAt((t.t+.0015)%1,ae),oe.copy(ie).normalize(),q.subVectors(ae,ie),q.addScaledVector(oe,-q.dot(oe)).normalize(),ce.crossVectors(oe,q),X.copy(ie).addScaledVector(ce,t.lane).addScaledVector(oe,t.lift),le.makeBasis(ce,oe,q),le.setPosition(X),j.setMatrixAt(e,le);let n=e*3;re.setXYZ(n,X.x,X.y,X.z),Z.copy(X).addScaledVector(q,x*.58),re.setXYZ(n+1,Z.x,Z.y,Z.z),Z.copy(X).addScaledVector(q,-x*.58),re.setXYZ(n+2,Z.x,Z.y,Z.z)}for(let e=0;e<_;e++)ue(e);return j.instanceMatrix.needsUpdate=!0,j.instanceColor&&(j.instanceColor.needsUpdate=!0),re.needsUpdate=!0,{group:n,update(e){s.rotation.y+=e*.01;for(let t=0;t<_;t++){let n=O[t];n.t=(n.t+n.speed*e)%1,ue(t)}j.instanceMatrix.needsUpdate=!0,re.needsUpdate=!0},dispose(){a.dispose(),o.dispose(),f.dispose(),p.dispose(),g.dispose(),j.dispose(),k.dispose(),A.dispose(),W.dispose(),G.dispose()}}}var fr=9001;function pr(e){let t=1024,n=document.createElement(`canvas`);n.width=t,n.height=512;let r=n.getContext(`2d`);r.fillStyle=`#000000`,r.fillRect(0,0,t,512);let i=_e(e);for(let e=0;e<52;e++){let e=i()*t,n=i()*512;r.beginPath(),r.moveTo(e,n);let a=3+Math.floor(i()*5);for(let o=0;o<a;o++){let a=i()<.5,o=18+i()*65;a?e+=(i()<.5?-1:1)*o:n+=(i()<.5?-1:1)*o,e=Math.max(3,Math.min(t-3,e)),n=Math.max(3,Math.min(509,n)),r.lineTo(e,n)}r.lineWidth=1+i()*1.2,r.strokeStyle=`rgba(245, 165, 36, ${(.5+i()*.5).toFixed(2)})`,r.stroke(),r.fillStyle=`rgba(255, 200, 97, ${(.7+i()*.3).toFixed(2)})`;let o=2+i()*2;r.fillRect(e-o/2,n-o/2,o,o)}let a=new f(n);return a.colorSpace=V,a.wrapS=G,a.wrapT=O,a.needsUpdate=!0,a}var mr=`
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

  ${xe}

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
`,hr=`
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
    ${ye}
  }
`;function gr(e,t,n,r=1){let i=new d;i.name=`planet-agentic`;let a=pr(fr);a.anisotropy=r;let[o,s]=n?[96,64]:[128,96],c=new Y(e,o,s),u=new te({color:1711140,metalness:1,roughness:.48,emissive:new h(ve.amber),emissiveMap:a,emissiveIntensity:1.6,envMapIntensity:.9});t&&(u.envMap=t),u.onBeforeCompile=t=>{t.uniforms.uRadius={value:e},t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>\nuniform float uRadius;\nvarying vec3 vDetailDir;\nvarying vec3 vDetailWorldPos;\n${xe}`).replace(`#include <color_fragment>`,`#include <color_fragment>
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
  vDetailWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`)};let f=new l(c,u);i.add(f);let p=we(e,ve.amber,{power:2.9,intensity:.9});i.add(p.mesh);let m=n?8e3:17e3,g=e*2.3,_=e*.55,v=N.degToRad(25),y=_e(9008),b=new Float32Array(m),x=new Float32Array(m),C=new Float32Array(m),w=new Float32Array(m),T=new Float32Array(m*3),D=new Float32Array(m),O=new Float32Array(m),k=new h(ve.amberDeep),A=new h(ve.amber),j=new h(ve.amberBright),M=new h;for(let e=0;e<m;e++){b[e]=y()*Math.PI*2,x[e]=y()*Math.PI*2;let t=.55+y()**1.6*.45;C[e]=t,w[e]=.09+y()*.14;let n=N.clamp((t-.55)/.45,0,1);n>.6?M.copy(A).lerp(j,(n-.6)/.4):M.copy(k).lerp(A,n/.6),T[e*3]=M.r,T[e*3+1]=M.g,T[e*3+2]=M.b,D[e]=.85+y()*1.1,O[e]=.5+y()*.48}let P=new E;P.setAttribute(`aTheta0`,new J(b,1)),P.setAttribute(`aPhi`,new J(x,1)),P.setAttribute(`aTubeFrac`,new J(C,1)),P.setAttribute(`aSpeed`,new J(w,1)),P.setAttribute(`aColor`,new J(T,3)),P.setAttribute(`aSize`,new J(D,1)),P.setAttribute(`aAlpha`,new J(O,1)),P.setAttribute(`position`,new J(new Float32Array(m*3),3)),P.boundingSphere=new I(new S,g+_+6);let F=new K({uniforms:{uTime:{value:0},uMajorR:{value:g},uTubeR:{value:_},uJitterAmp:{value:e*.12},uBasePx:{value:2.6}},vertexShader:mr,fragmentShader:hr,transparent:!0,depthWrite:!1,blending:2}),L=new R(P,F);return L.frustumCulled=!1,L.rotation.x=v,L.renderOrder=2,i.add(L),{group:i,update(e,t){f.rotation.y+=e*.012,F.uniforms.uTime.value=t},dispose(){c.dispose(),u.dispose(),a.dispose(),p.dispose(),P.dispose(),F.dispose()}}}var _r=7331,vr=3,yr=4,br=10,xr=60,Sr=90,Cr=240,wr=420,Tr=.55,Er=1.5,Dr=.7,Or=1.5,kr=16,Ar=34,jr=2.6,Mr=480,Nr=680,Pr=.4,Fr=3.5,Ir=5.5,Lr=70,Rr=5.5;function zr(){let e=document.createElement(`canvas`);e.width=48,e.height=256;let t=e.getContext(`2d`);t.clearRect(0,0,48,256);let n=256*.13;t.globalCompositeOperation=`lighter`;for(let e=0;e<56;e++){let r=e/55,i=n+r*(256-n),a=(1-r)**2.4*.85,o=48*(.55+.45*(1-r));t.globalAlpha=a,t.fillStyle=`#ffffff`,t.fillRect(48/2-o/2,i,o,5.477142857142857)}t.globalAlpha=1;let r=t.createRadialGradient(48/2,n,0,48/2,n,48*.6);r.addColorStop(0,`rgba(255,255,255,1)`),r.addColorStop(.45,`rgba(255,255,255,0.85)`),r.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=r,t.fillRect(0,0,48,256),t.globalCompositeOperation=`source-over`;let i=new f(e);return i.needsUpdate=!0,i}function Br(){let e=_e(_r),t=new d;t.name=`meteor-field`;let n=zr();function r(e){let r=new D(new p({map:n,color:e?13627391:16777215,transparent:!0,opacity:0,depthWrite:!1,depthTest:!0,blending:2}));return r.visible=!1,r.renderOrder=4,t.add(r),{sprite:r,active:!1,age:0,life:1,startPos:new S,velocity:new S,length:kr,width:jr,isComet:e}}let i=Array.from({length:vr},()=>r(!1)),a=r(!0),o=yr+e()*(br-yr),s=xr+e()*(Sr-xr),c=null,l=!1,u=new S,f=new S,m=new S;function h(t,n,r,i){i?(i.getWorldDirection(u),m.set(e()*2-1,e()*2-1,e()*2-1).multiplyScalar(.3),u.add(m)):u.set(e()*2-1,e()*2-1,e()*2-1),u.lengthSq()<1e-6&&u.set(0,1,0),u.normalize(),r.pos.copy(t).addScaledVector(u,n),m.set(e()*2-1,e()*2-1,e()*2-1).normalize(),f.crossVectors(u,m),f.lengthSq()<1e-6&&f.set(1,0,0),f.normalize(),r.dir.copy(f)}let g={pos:new S,dir:new S};function _(t,n){h(n,Cr+e()*(wr-Cr),g,c),c=null;let r=Tr+e()*(Er-Tr),i=Dr+e()*(Or-Dr),a=g.pos.distanceTo(n)*r;t.startPos.copy(g.pos),t.velocity.copy(g.dir).multiplyScalar(a/i),t.life=i,t.age=0,t.length=kr+e()*(Ar-kr),t.width=jr*(.85+e()*.3),t.active=!0,t.sprite.visible=!0}function v(t){h(t,Mr+e()*(Nr-Mr),g);let n=Fr+e()*(Ir-Fr),r=g.pos.distanceTo(t)*Pr;a.startPos.copy(g.pos),a.velocity.copy(g.dir).multiplyScalar(r/n),a.life=n,a.age=0,a.length=Lr,a.width=Rr,a.active=!0,a.sprite.visible=!0}let y=new S,b=new S,x=new S,C=new S;function w(e,t,n){if(!e.active)return;if(e.age+=t,e.age>=e.life){e.active=!1,e.sprite.visible=!1;return}C.copy(e.velocity).multiplyScalar(e.age),e.sprite.position.copy(e.startPos).add(C);let r=e.age/e.life,i=N.smoothstep(r,0,.12),a=1-N.smoothstep(r,.65,1),o=e.sprite.material;o.opacity=i*a*(e.isComet?.85:1),n.matrixWorld.extractBasis(y,b,x);let s=e.velocity.dot(y),c=e.velocity.dot(b);o.rotation=Math.atan2(-s,c),e.sprite.scale.set(e.width,e.length,1)}return{object:t,update(t,n){if(l&&(l=!1,c=n),o-=t,o<=0){o=yr+e()*(br-yr);let t=i.find(e=>!e.active),r=i.filter(e=>e.active).length;t&&r<vr&&_(t,n.position)}c=null,s-=t,s<=0&&(s=xr+e()*(Sr-xr),a.active||v(n.position));for(let e of i)w(e,t,n);w(a,t,n)},debugForceSpawn(e=`meteor`){e===`comet`?s=-1:(o=-1,l=!0)},dispose(){n.dispose();for(let e of i)e.sprite.material.dispose();a.sprite.material.dispose()}}}var Vr={mint:[{orbitRadius:1.75,moonRadius:.11,orbitSpeed:.07,inclination:.28,phase:.4,color:9083562},{orbitRadius:2.35,moonRadius:.07,orbitSpeed:.045,inclination:-.18,phase:2.3,color:6978184}],plumm:[{orbitRadius:1.9,moonRadius:.09,orbitSpeed:.055,inclination:.42,phase:1.1,color:5917290}],idrive:[{orbitRadius:1.65,moonRadius:.08,orbitSpeed:.08,inclination:.22,phase:.6,color:10127472},{orbitRadius:2.25,moonRadius:.055,orbitSpeed:.038,inclination:-.35,phase:3.8,color:7825496}],agentic:[{orbitRadius:2,moonRadius:.1,orbitSpeed:.065,inclination:.32,phase:1.6,color:11176032},{orbitRadius:2.7,moonRadius:.065,orbitSpeed:.042,inclination:-.22,phase:4.2,color:8941664}]};function Hr(e,t,n,r){let i=Vr[t],a=r?12:16,o=[],s=[],c=new S;for(let t of i){let r=new ne;r.rotation.x=t.inclination,e.add(r);let i=n*t.moonRadius,c=new Y(i,a,a),u=new te({color:t.color,roughness:.92,metalness:.04,emissive:new h(t.color).multiplyScalar(.04)}),d=new l(c,u);d.position.x=n*t.orbitRadius,r.add(d),o.push({pivot:r,mesh:d,speed:t.orbitSpeed,phase:t.phase,radius:i}),s.push({geo:c,mat:u})}return{update(e,t){for(let{pivot:e,speed:n,phase:r}of o)e.rotation.y=t*n+r},forEachCollider(e){for(let{mesh:t,radius:n}of o)t.getWorldPosition(c),e(c,n)},dispose(){for(let{geo:e,mat:t}of s)e.dispose(),t.dispose()}}}var Ur=`/v4/assets/tex/earth-day-2k.jpg`,Wr=`/v4/assets/tex/city-lights-2k.jpg`;function Gr(){let e=document.createElement(`canvas`);e.width=8,e.height=8;let t=e.getContext(`2d`);t&&(t.fillStyle=`#141820`,t.fillRect(0,0,8,8));let n=new f(e);return n.needsUpdate=!0,n}async function Kr(e,t){try{return await e.loadAsync(t)}catch{return Gr()}}async function qr(e,t){let{manager:n,skyTex:r,envMap:i,lowPower:a,renderer:o}=t,s=Math.min(o.capabilities.getMaxAnisotropy(),8),c=new k(n),[l,u]=await Promise.all([Kr(c,Ur),Kr(c,Wr)]);for(let e of[l,u])e.colorSpace=V,e.wrapS=G,e.wrapT=O,e.generateMipmaps=!0,e.minFilter=re,e.anisotropy=s;let d=Yn(r,a,o);e.add(d.object);let f=Br();e.add(f.object);let p=new Map,m=[];for(let t of Wt){let n;switch(t.id){case`mint`:n=$n(t.radius,l,a);break;case`plumm`:n=tr(t.radius,u,a);break;case`idrive`:n=dr(t.radius,a);break;case`agentic`:n=gr(t.radius,i,a,s);break;default:throw Error(`Unknown planet id: ${t.id}`)}n.group.position.copy(t.position),n.group.name=`planet-${t.id}`,e.add(n.group),p.set(t.id,n),m.push(Hr(n.group,t.id,t.radius,a))}return{update(e,t,n){d.update(e,t,n);for(let n of p.values())n.update(e,t);for(let n of m)n.update(e,t);f.update(e,n)},debugForceMeteor(e){f.debugForceSpawn(e)},setBlackHoleLayerVisible(e,t){d.setLayerVisible(e,t)},getBlackHoleLayerState(){return d.getLayerState()},getBlackHoleRadii(){return d.getRadii()},getBlackHoleDiskFrame(){return d.getDiskFrame()},setBlackHoleDebugBounds(e){d.setDebugBounds(e)},forEachMoonCollider(e){for(let t of m)t.forEachCollider(e)},dispose(){e.remove(d.object),d.dispose();for(let t of p.values())e.remove(t.group),t.dispose();p.clear();for(let e of m)e.dispose();m.length=0,e.remove(f.object),f.dispose(),l.dispose(),u.dispose()}}}var Jr=12e4,Yr=250,Xr=600,Zr=108,Qr=5,$r=new S;function ei(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function ti(e){return 1-ei(Yr,Xr,e)}function ni(e,t,n){$r.copy(Q).sub(e);let r=Math.max($r.length(),Qr),i=Jr/(r*r)*ti(r);$r.normalize(),t.addScaledVector($r,i*n)}function ri(e){let t=Math.max(Q.distanceTo(e),Qr);return Jr/(t*t)*ti(t)}var ii=`v4-leaderboard`,ai=10;function oi(e){if(!e||typeof e!=`object`)return!1;let t=e;return typeof t.nick==`string`&&typeof t.ms==`number`&&typeof t.date==`string`}function si(){try{let e=window.localStorage.getItem(ii);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(oi):[]}catch{return[]}}function ci(){return si().sort((e,t)=>e.ms-t.ms)}function li(e,t){let n=e.trim().slice(0,16)||`PILOT`,r=si();r.push({nick:n,ms:t,date:new Date().toISOString()}),r.sort((e,t)=>e.ms-t.ms);let i=r.slice(0,ai);try{window.localStorage.setItem(ii,JSON.stringify(i))}catch{}return i}var ui={mint:`Mint Apartments`,plumm:`Plumm`,idrive:`I DRIVE CARS`,agentic:`Agentic OS`};function di(e){let t=c(e);if(t.length>=2)return t.slice(0,2).map(e=>({src:e.srcSmall,alt:e.caption}));let n=ui[e];return[{src:`/projects/${e}/hero-card.webp`,alt:`${n} — podgląd interfejsu`},{src:`/projects/${e}/hero-full.webp`,alt:`${n} — drugi kadr interfejsu`}]}var fi=[`Kapitanie — misja: znajdź nowoczesną stronę dla swojego biznesu. Cztery światy na orbicie czarnej dziury.`,`Nie trać czasu — minuta tak blisko horyzontu to godzina na Ziemi.`,`Ten statek… przypomina Ci coś? Zbieg okoliczności.`],pi=5e3,mi=25;function hi(e,t,n){if(n)return e.textContent=t,()=>{};e.textContent=``;let r=0,i=0,a=()=>{r+=1,e.textContent=t.slice(0,r),r<t.length&&(i=window.setTimeout(a,mi))};return i=window.setTimeout(a,mi),()=>window.clearTimeout(i)}function gi(e,t){let n=document.createElement(`div`);n.className=`v4-comm`,n.innerHTML=`
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
  `,e.appendChild(n);let r=n.querySelector(`.v4-comm__panel`),i=n.querySelector(`.v4-comm__icon`),a=n.querySelector(`.v4-comm__collapse`),o=Array.from(n.querySelectorAll(`.v4-comm__line`)),s=n.querySelector(`.v4-comm__board`),c=n.querySelector(`.v4-comm__board-list`),l=n.querySelector(`.v4-comm__wave`),u=!1,d=[],f=[],p=0;function m(){for(let e of d)window.clearTimeout(e);for(let e of f)e();d=[],f=[]}function h(){fi.forEach((e,n)=>{let r=window.setTimeout(()=>{f.push(hi(o[n],e,t.reducedMotion))},n*pi);d.push(r)})}function g(){let e=ci().slice(0,3);if(e.length===0){s.hidden=!0;return}s.hidden=!1,c.innerHTML=e.map((e,t)=>`<li><span>${t+1}.</span><span>${Sn(e.nick)}</span><span>${vn(e.ms)}</span></li>`).join(``)}function _(e){let t=l.getContext(`2d`);if(!t)return;let n=l.width/8;t.clearRect(0,0,l.width,l.height),t.fillStyle=`#f5a524`;for(let r=0;r<8;r++){let i=l.height*(.22+.58*Math.abs(Math.sin(e+r*.7)));t.fillRect(r*n+1,l.height-i,n-2,i)}}function v(){if(t.reducedMotion){_(.6);return}let e=0,n=()=>{e+=.12,_(e),p=requestAnimationFrame(n)};n()}function y(){u=!1,r.classList.remove(`is-collapsed`),i.hidden=!0}function b(){u=!0,r.classList.add(`is-collapsed`),i.hidden=!1}r.addEventListener(`click`,e=>{e.target.closest(`.v4-comm__collapse`)||b()}),a.addEventListener(`click`,e=>{e.stopPropagation(),b()}),i.addEventListener(`click`,y);let x=e=>{e.code===`Enter`&&!u&&b()};return window.addEventListener(`keydown`,x),g(),h(),v(),t.startCollapsed&&b(),{dismiss(){u||b()},restart(){m();for(let e of o)e.textContent=``;y(),g(),h()},dispose(){m(),cancelAnimationFrame(p),window.removeEventListener(`keydown`,x),n.remove()}}}var _i=`${`https://marcinbochenek.com`.replace(/\/$/,``)}/#realizacje`;function vi(e){let t=document.createElement(`div`);t.className=`v4-project-panel`,t.setAttribute(`aria-hidden`,`true`),t.inert=!0,t.innerHTML=`
    <button type="button" class="v4-project-panel__close" aria-label="Zamknij panel projektu">&times;</button>
    <p class="v4-project-panel__eyebrow"></p>
    <h2 class="v4-project-panel__title"></h2>
    <p class="v4-project-panel__desc"></p>
    <div class="v4-project-panel__shots"></div>
    <div class="v4-project-panel__stack"></div>
    <div class="v4-project-panel__links">
      <a class="v4-project-panel__live" href="#" target="_blank" rel="noopener" hidden>Strona na żywo &rarr;</a>
      <span class="v4-project-panel__status" hidden></span>
      <a class="v4-project-panel__case" href="${_i}" target="_blank" rel="noopener">Case study &rarr;</a>
    </div>
  `,e.appendChild(t);let n=t.querySelector(`.v4-project-panel__close`),r=t.querySelector(`.v4-project-panel__eyebrow`),i=t.querySelector(`.v4-project-panel__title`),a=t.querySelector(`.v4-project-panel__desc`),o=t.querySelector(`.v4-project-panel__shots`),s=t.querySelector(`.v4-project-panel__stack`),c=t.querySelector(`.v4-project-panel__live`),l=t.querySelector(`.v4-project-panel__status`);function u(){t.classList.remove(`is-open`),t.setAttribute(`aria-hidden`,`true`),t.inert=!0,document.documentElement.classList.remove(`v4-panel-open`)}return n.addEventListener(`click`,u),{show(e,n){r.textContent=e.tagline,i.textContent=e.title,a.textContent=bn(e.description,3),o.innerHTML=``;for(let e of n){let t=document.createElement(`img`);t.className=`v4-project-panel__shot`,t.src=e.src,t.alt=e.alt,t.loading=`lazy`,o.appendChild(t)}s.innerHTML=``;for(let t of e.stack??[]){let e=document.createElement(`span`);e.className=`v4-project-panel__chip`,e.textContent=t,s.appendChild(e)}Cn(e.url)&&e.id!==`idrive`&&e.id!==`agentic`?(c.href=e.url,c.hidden=!1,l.hidden=!0):(c.hidden=!0,c.removeAttribute(`href`),l.hidden=!1,l.textContent=e.domain),t.classList.add(`is-open`),t.setAttribute(`aria-hidden`,`false`),t.inert=!1,document.documentElement.classList.add(`v4-panel-open`)},hide:u,dispose(){t.remove()}}}var yi=2500;function bi(e){let t=document.createElement(`div`);t.className=`v4-toast`,t.setAttribute(`aria-live`,`polite`),t.setAttribute(`aria-hidden`,`true`),e.appendChild(t);let n=0;return{show(e){t.textContent=`ODKRYTO: ${e.toUpperCase()}`,t.classList.remove(`is-visible`),t.offsetWidth,t.classList.add(`is-visible`),t.setAttribute(`aria-hidden`,`false`),window.clearTimeout(n),n=window.setTimeout(()=>{t.classList.remove(`is-visible`),t.setAttribute(`aria-hidden`,`true`)},yi)},dispose(){window.clearTimeout(n),t.remove()}}}var xi=600;function Si(e,t){let n=document.createElement(`div`);n.className=`v4-horizon-flash`,e.appendChild(n);let r=document.createElement(`div`);r.className=`v4-overlay v4-overlay--gameover`,r.setAttribute(`aria-hidden`,`true`),r.inert=!0,r.innerHTML=`
    <div class="v4-overlay__card">
      <p class="v4-overlay__eyebrow">Misja przerwana</p>
      <h1 class="v4-overlay__title" id="v4-gameover-title">Przekroczono horyzont zdarzeń</h1>
      <p class="v4-overlay__lead">Z tej odległości nie ucieka nawet światło. Misja zaczyna się od nowa.</p>
      <button type="button" class="v4-overlay__button">Restart misji <span class="v4-overlay__hint">[R]</span></button>
    </div>
  `,e.appendChild(r);let i=r.querySelector(`.v4-overlay__button`);i.addEventListener(`click`,()=>t.onRestart());let a=0;function o(){r.setAttribute(`role`,`dialog`),r.setAttribute(`aria-modal`,`true`),r.setAttribute(`aria-labelledby`,`v4-gameover-title`),r.classList.add(`is-visible`),r.setAttribute(`aria-hidden`,`false`),r.inert=!1,i.focus({preventScroll:!0})}function s(){window.clearTimeout(a),r.classList.remove(`is-visible`),r.removeAttribute(`role`),r.removeAttribute(`aria-modal`),r.setAttribute(`aria-hidden`,`true`),r.inert=!0,n.classList.remove(`is-active`)}return{trigger(){if(t.reducedMotion){o();return}n.classList.remove(`is-active`),n.offsetWidth,n.classList.add(`is-active`),window.clearTimeout(a),a=window.setTimeout(o,xi)},reset(){s()},dispose(){window.clearTimeout(a),r.remove(),n.remove()}}}function Ci(e,t){let n=document.createElement(`div`);n.className=`v4-overlay v4-overlay--completion`,n.setAttribute(`aria-hidden`,`true`),n.inert=!0,n.innerHTML=`
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
  `,e.appendChild(n);let r=n.querySelector(`.v4-overlay__time-value`),i=n.querySelector(`.v4-overlay__dilation`),a=n.querySelector(`.v4-overlay__save`),o=n.querySelector(`.v4-overlay__nick`),s=n.querySelector(`.v4-overlay__button`),c=n.querySelector(`tbody`),l=n.querySelector(`.v4-overlay__restart`),u=e=>e.stopPropagation();o.addEventListener(`keydown`,u),o.addEventListener(`keyup`,u),a.addEventListener(`submit`,e=>{e.preventDefault(),!s.disabled&&(t.onSave(o.value),s.disabled=!0,o.disabled=!0,s.textContent=`Zapisano`)}),l.addEventListener(`click`,()=>t.onRestart());function d(e){c.innerHTML=e.slice(0,10).map((e,t)=>`<tr><td>${t+1}</td><td>${Sn(e.nick)}</td><td>${vn(e.ms)}</td><td>${yn(e.date)}</td></tr>`).join(``)}return{show(e,t){r.textContent=vn(e);let a=Math.round(e/1e3);i.textContent=`Na Ziemi minęło w tym czasie: ${Math.floor(a/60)}h ${a%60}min`,o.value=``,o.disabled=!1,s.disabled=!1,s.textContent=`Zapisz wynik`,d(t),n.setAttribute(`role`,`dialog`),n.setAttribute(`aria-labelledby`,`v4-completion-title`),n.classList.add(`is-visible`),n.setAttribute(`aria-hidden`,`false`),n.inert=!1,o.focus({preventScroll:!0})},updateBoard(e){d(e)},reset(){n.classList.remove(`is-visible`),n.removeAttribute(`role`),n.setAttribute(`aria-hidden`,`true`),n.inert=!0},dispose(){o.removeEventListener(`keydown`,u),o.removeEventListener(`keyup`,u),n.remove()}}}var $=n(),wi=new S(205,-36,700),Ti=(()=>{let e=wi.clone().normalize(),t=new S().crossVectors(new S(0,1,0),e).normalize(),n=e.clone().negate(),r=t.clone().multiplyScalar(.18).addScaledVector(n,.82);r.normalize();let i=new L;return i.up.set(0,1,0),i.lookAt(r),i.quaternion.clone()})();function Ei(){if(typeof navigator>`u`)return!1;let e=navigator.hardwareConcurrency??8,t=navigator.deviceMemory;return e<=4||t!==void 0&&t<=4}function Di(){let e=(0,Ee.useRef)(null),t=(0,Ee.useRef)(null),n=(0,Ee.useRef)(null),r=(0,Ee.useRef)(null),i=(0,Ee.useRef)(null),a=(0,Ee.useRef)(null);return(0,Ee.useEffect)(()=>{let s=!1,c=null,l=null,u=null,d=null,f=null,p=null,m=null,h=null,g=null,_=null,v=null,y=null,b=null,x=null,C=null,w=null;async function T(){let T=e.current,E=t.current,D=n.current;if(!T||!E||!D)return;let O=T;w=O,E.tabIndex=0,E.setAttribute(`aria-label`,`Pole lotu — sterowanie statkiem`),E.focus({preventScroll:!0});let k=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,A=Ei(),j=new M;j.onProgress=(e,t,n)=>{let r=n>0?Math.round(t/n*100):0;a.current&&(a.current.style.width=`${r}%`),i.current&&(i.current.textContent=`WCZYTYWANIE MISJI… ${r}%`)},j.onError=e=>{e.includes(`normandy-sr2-joshuas-cc0.glb`)||console.error(`[v4] failed to load asset:`,e)};let P=await ct(E,{lowPower:A,reducedMotion:k,manager:j});if(s){P.dispose();return}c=P;let I=await Ce(j,P.envMap,P.renderer);if(s){I.dispose(),P.dispose();return}l=I,P.scene.add(I.group);let L=await qr(P.scene,{manager:j,skyTex:P.skyTex,envMap:P.envMap,lowPower:A,renderer:P.renderer});if(s){L.dispose(),I.dispose(),P.dispose();return}u=L;let R=Ut(T);f=R;let z=Rt(wi,R.input);z.state.quaternion.copy(Ti),d=z;let V=_n(P.camera,I.group.userData.hullStats),H=R.active||window.matchMedia(`(max-width: 480px), (hover: none)`).matches,U=Dn(D,{touchActive:R.active,launchByTap:H,onLaunch:()=>{z.state.hasThrusted=!0}});p=U;function ee(e){O.classList.toggle(`is-prelaunch`,e),R.setArmed(!e)}ee(!0),C=e=>{if(!H||!O.classList.contains(`is-prelaunch`))return;let t=e.target;t instanceof Element&&(t.closest(`a, .v4-loading, .v4-overlay, input, textarea, button.v4-comm__collapse, button.v4-comm__icon`)||(e.preventDefault(),z.state.hasThrusted=!0))},O.addEventListener(`pointerdown`,C),m=gi(D,{reducedMotion:k,startCollapsed:R.active}),h=vi(D),g=bi(D);let W=null,G=0,te=!1,ne=!1,re=!1,ie=new Set,ae=null,K=!1;function q(){z.state.position.copy(wi),z.state.velocity.set(0,0,0),z.state.angularVelocity.set(0,0,0),z.state.bankAngle=0,z.state.quaternion.copy(Ti),z.state.thrustLevel=0,z.state.brakeLevel=0,z.state.speed=0,z.state.hasThrusted=!1,K=!1,W=null,G=0,te=!1,ne=!1,re=!1,ie.clear(),ae=null,h?.hide(),_?.reset(),v?.reset(),m?.restart(),U.reset(),V.holdLaunch(wi,Ti),ee(!0)}_=Si(D,{reducedMotion:k,onRestart:()=>q()});let J=Ci(D,{onRestart:()=>q(),onSave:e=>{let t=li(e,G);J.updateBoard(t)}});v=J,x=e=>{if(e.code!==`KeyR`)return;let t=e.target;t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||q()},window.addEventListener(`keydown`,x),b=()=>{P.setSize(O.clientWidth,O.clientHeight),z.state.hasThrusted||V.holdLaunch(wi,Ti)},window.addEventListener(`resize`,b),b(),V.holdLaunch(wi,Ti);let Y=!1,se=new S,ce=new S,X=null;new URLSearchParams(window.location.search).has(`debug`)&&(X=new F(I.group,16763972),X.name=`ship-debug-bounds`,X.visible=!1,P.scene.add(X),window.__v4={teleport(e,t){Y=!0,se.set(e[0],e[1],e[2]),ce.set(t[0],t[1],t[2])},spawnMeteor(e){L.debugForceMeteor(e)},getShipPos(){let e=z.state.position;return[e.x,e.y,e.z]},haltShip(){z.state.velocity.set(0,0,0),z.state.angularVelocity.set(0,0,0)},getHullSource(){return I.group.userData.hullSource??`unknown`},getHullStats(){return I.group.userData.hullStats??null},frameHull(e){Y=!0;let t=I.group.position,n=I.group.quaternion,r=new S(0,0,-1).applyQuaternion(n),i=new S(0,1,0).applyQuaternion(n),a=new S(1,0,0).applyQuaternion(n),o=t.clone();e===`rear`?se.copy(t).addScaledVector(r,-38).addScaledVector(i,7):e===`top`?se.copy(t).addScaledVector(i,32).addScaledVector(r,1):e===`side`?se.copy(t).addScaledVector(a,36).addScaledVector(i,4):se.copy(t).addScaledVector(r,-26).addScaledVector(i,11).addScaledVector(a,16),ce.copy(o)},releaseDebugCam(){Y=!1},getRenderInfo(){let e=P.renderer.info.render;return{triangles:e.triangles,calls:e.calls}},setShipVisible(e){I.group.visible=e},getChaseInfo(){let e=P.camera.position.clone().sub(I.group.position),t=new S(0,1,0).applyQuaternion(I.group.quaternion),n=new S(0,0,-1).applyQuaternion(I.group.quaternion);return{heightDot:e.dot(t),backDot:-e.dot(n),dist:e.length(),upDot:t.dot(new S(0,1,0))}},getScreenAabbs(){return window.__v4.getComposition().aabbs},getComposition(){let e=P.camera;e.updateMatrixWorld(),e.updateProjectionMatrix();let t=P.renderer.domElement,n=t.clientWidth,r=t.clientHeight,i=Math.min(n,r),a=.07*i,o=()=>({left:1/0,top:1/0,right:-1/0,bottom:-1/0}),s=(e,t,n)=>{e.left=Math.min(e.left,t),e.right=Math.max(e.right,t),e.top=Math.min(e.top,n),e.bottom=Math.max(e.bottom,n)},c=(t,i)=>{let a=t.clone().project(e);Number.isFinite(a.x+a.y)&&s(i,(a.x*.5+.5)*n,(-a.y*.5+.5)*r)},l=e=>{let t=o(),n=[new S(e.min.x,e.min.y,e.min.z),new S(e.min.x,e.min.y,e.max.z),new S(e.min.x,e.max.y,e.min.z),new S(e.min.x,e.max.y,e.max.z),new S(e.max.x,e.min.y,e.min.z),new S(e.max.x,e.min.y,e.max.z),new S(e.max.x,e.max.y,e.min.z),new S(e.max.x,e.max.y,e.max.z)];for(let e of n)c(e,t);return t},u=e=>({left:e.left,top:e.top,right:n-e.right,bottom:r-e.bottom}),d=(e,t)=>e.left<t.right-1&&e.right>t.left+1&&e.top<t.bottom-1&&e.bottom>t.top+1,f=(e,t)=>({left:e.left-t,top:e.top-t,right:e.right+t,bottom:e.bottom+t}),p=l(new oe().setFromObject(I.group)),m=L.getBlackHoleRadii(),h=L.getBlackHoleDiskFrame(),g=e.position.distanceTo(Q),_=Q.clone().project(e),v=(_.x*.5+.5)*n,y=(-_.y*.5+.5)*r,b=N.degToRad(e.fov),x=Math.sqrt(Math.max(g*g-m.apparentShadow*m.apparentShadow,1)),C=m.apparentShadow/x/Math.tan(b/2)*(r*.5),w={left:v-C,top:y-C,right:v+C,bottom:y+C},T=o();for(let e=0;e<48;e++){let t=e/48*Math.PI*2;c(Q.clone().addScaledVector(h.u,Math.cos(t)*h.outer).addScaledVector(h.v,Math.sin(t)*h.outer),T)}let E=t.getBoundingClientRect(),O=D.querySelector(`.v4-hud__start-prompt`),k=null;if(O&&!O.classList.contains(`is-hidden`)){let e=O.getBoundingClientRect();k={left:e.left-E.left,top:e.top-E.top,right:e.right-E.left,bottom:e.bottom-E.top}}let A=u(p),j=u(w),M=u(T),F=(p.right-p.left)/n,R=(p.top+p.bottom)*.5/r,z=y/r,B={shipPrompt:k?d(f(p,6),k):!1,promptShadow:k?d(f(w,6),k):!1,promptDisk:k?d(f(T,6),k):!1},V=n>=900?a:.05*i,H={shadowInFrame:j.left>=V&&j.right>=V&&j.top>=V&&j.bottom>=V,diskSignificantWidth:T.right-T.left>C*3.6&&M.left>4&&M.right>4,shipWidth:F>=.3&&F<=.45,shipLower:R>.55,bhUpper:z<.42,noPromptOverlap:!B.shipPrompt&&!B.promptShadow&&!B.promptDisk};return{viewport:{w:n,h:r,short:i,marginNeed:a,aspect:n/r},aabbs:{ship:p,bh:w,disk:T,prompt:k,viewport:{w:n,h:r}},shadow:{cx:v,cy:y,r:C,rect:w,margins:j,fracShort:C*2/i},disk:{rect:T,margins:M,widthFrac:(T.right-T.left)/n},ship:{rect:p,margins:A,widthFrac:F,cy:R},prompt:k,overlaps:B,pass:H}},setShipPos(e){z.state.position.set(e[0],e[1],e[2]),z.state.velocity.set(0,0,0),z.state.angularVelocity.set(0,0,0)},getCameraPhase(){return Y?`debug-teleport`:V.getPhase()},getProbe(){let e=P.camera,t=z.state.position,n=new S(0,0,-1).applyQuaternion(e.quaternion),r=t.clone().sub(e.position),i=Q.clone().sub(e.position),a=r.length(),o=i.length(),s=r.dot(n),c=i.dot(n),l=Math.abs(s-c)<.5?`equal`:s<c?`ship`:`bh`,u=r.clone().normalize(),d=e.position.clone().sub(Q),f=d.dot(u),p=d.lengthSq()-11664,m=f*f-p,h=null;if(m>=0){let e=-f-Math.sqrt(m),t=-f+Math.sqrt(m);h=e>.02?e:t>.02?t:null}return{phase:Y?`debug-teleport`:V.getPhase(),hasThrusted:z.state.hasThrusted,camera:{pos:[e.position.x,e.position.y,e.position.z],fwd:[n.x,n.y,n.z]},ship:[t.x,t.y,t.z],bh:[Q.x,Q.y,Q.z],distShipBh:t.distanceTo(Q),distCamShip:a,distCamBh:o,camSpace:{shipFwd:s,bhFwd:c,closer:l},rayThroughShip:{tShip:a,tHorizon:h,sphereHitsBeforeShip:h!==null&&h<a-.05},layers:L.getBlackHoleLayerState(),radii:L.getBlackHoleRadii()}},setBhLayer(e,t){L.setBlackHoleLayerVisible(e,t)},getBhLayers(){return L.getBlackHoleLayerState()},showBounds(e){L.setBlackHoleDebugBounds(e),X&&(X.visible=e,e&&X.update())}});let Z=new S,le=new B,ue=new S(0,0,1);y=P.onTick((e,t)=>{let n=!re;if(n){z.state.hasThrusted&&ni(z.state.position,z.state.velocity,e),z.update(e),!z.state.hasThrusted&&!Y&&(z.state.position.copy(wi),z.state.velocity.set(0,0,0),z.state.angularVelocity.set(0,0,0),z.state.quaternion.copy(Ti),z.state.bankAngle=0),I.group.position.copy(z.state.position),X?.visible&&X.update(),le.setFromAxisAngle(ue,z.state.bankAngle),I.group.quaternion.copy(z.state.quaternion).multiply(le),I.updateThrust(z.state.thrustLevel,t),z.state.hasThrusted&&!K&&(K=!0,ee(!1),te||(te=!0,W=t),m?.dismiss()),te&&W!==null&&(G=(t-W)*1e3),z.state.position.distanceTo(Q)<Zr&&(re=!0,z.state.velocity.set(0,0,0),z.state.angularVelocity.set(0,0,0),_?.trigger());for(let e of Wt){let t=z.state.position.distanceTo(e.position),n=e.radius*2.5,r=e.radius*3.5;if(t<n&&ae!==e.id){ae=e.id;let t=o.find(t=>t.id===e.id);t&&(ie.has(e.id)||(ie.add(e.id),g?.show(t.title),ie.size===Wt.length&&!ne&&(ne=!0,te=!1,v?.show(G,ci()))),h?.show(t,di(e.id)))}else ae===e.id&&t>r&&(ae=null,h?.hide())}for(let e of Wt){Z.copy(z.state.position).sub(e.position);let t=e.radius*1.12+2,n=Z.length();if(n<t&&n>1e-4){Z.multiplyScalar(1/n),z.state.position.copy(e.position).addScaledVector(Z,t);let r=z.state.velocity.dot(Z);r<0&&z.state.velocity.addScaledVector(Z,-r)}}L.forEachMoonCollider((e,t)=>{Z.copy(z.state.position).sub(e);let n=t*1.2+1.4,r=Z.length();if(r<n&&r>1e-4){Z.multiplyScalar(1/r),z.state.position.copy(e).addScaledVector(Z,n);let t=z.state.velocity.dot(Z);t<0&&z.state.velocity.addScaledVector(Z,-t)}})}Y?(P.camera.position.copy(se),P.camera.lookAt(ce)):n&&V.update(e,z.state.position,z.state.quaternion,z.state.thrustLevel,z.state.bankAngle,z.state.angularVelocity,{hasThrusted:z.state.hasThrusted,reducedMotion:window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}),P.dust.update(P.camera.position,z.state.velocity),L.update(e,t,P.camera),U.update({speed:z.state.speed,thrust:z.state.thrustLevel,hasThrusted:z.state.hasThrusted,missionMs:G,discovered:ie,gravityAccel:n?ri(z.state.position):0})}),P.start(),r.current&&(r.current.classList.add(`is-hidden`),r.current.setAttribute(`aria-busy`,`false`),r.current.setAttribute(`aria-hidden`,`true`))}return T().catch(e=>{console.error(`[v4] init failed`,e);let t=r.current;t&&(t.classList.add(`is-error`),t.setAttribute(`aria-busy`,`false`)),i.current&&(i.current.textContent=`Nie udało się wczytać misji. Odśwież stronę.`)}),()=>{s=!0,b&&window.removeEventListener(`resize`,b),x&&window.removeEventListener(`keydown`,x),C&&w&&w.removeEventListener(`pointerdown`,C),y?.(),delete window.__v4,v?.dispose(),_?.dispose(),g?.dispose(),h?.dispose(),m?.dispose(),p?.dispose(),d?.dispose(),f?.dispose(),u?.dispose(),l?.dispose(),c?.stop(),c?.dispose()}},[]),(0,$.jsxs)(`div`,{className:`v4-root is-prelaunch`,ref:e,children:[(0,$.jsx)(`canvas`,{className:`v4-canvas`,ref:t}),(0,$.jsx)(`div`,{className:`v4-hud-container`,ref:n}),(0,$.jsxs)(`div`,{className:`v4-loading`,ref:r,"aria-live":`polite`,"aria-busy":`true`,role:`status`,children:[(0,$.jsx)(`div`,{className:`v4-loading__label`,ref:i,children:`WCZYTYWANIE MISJI… 0%`}),(0,$.jsx)(`div`,{className:`v4-loading__bar`,children:(0,$.jsx)(`div`,{className:`v4-loading__bar-fill`,ref:a})})]})]})}var Oi=s.portfolioUrl.replace(/\/$/,``),ki=`${Oi}/#realizacje`;function Ai(){let{locale:e}=i(),t=a(e).v4Fallback;return(0,$.jsx)(`div`,{className:`v4-fallback`,children:(0,$.jsxs)(`div`,{className:`v4-fallback__card`,children:[(0,$.jsx)(`p`,{className:`v4-fallback__eyebrow`,children:t.eyebrow}),(0,$.jsx)(`h1`,{className:`v4-fallback__title`,children:t.title}),(0,$.jsx)(`p`,{className:`v4-fallback__lead`,children:t.lead}),(0,$.jsx)(`div`,{className:`v4-fallback__list`,children:o.map(e=>(0,$.jsxs)(`a`,{className:`v4-fallback__item`,href:Cn(e.url)?e.url:ki,target:`_blank`,rel:`noopener noreferrer`,children:[(0,$.jsx)(`span`,{className:`v4-fallback__item-title`,children:e.title}),(0,$.jsx)(`span`,{className:`v4-fallback__item-tagline`,children:e.tagline})]},e.id))}),(0,$.jsxs)(`div`,{className:`v4-fallback__actions`,children:[(0,$.jsx)(`a`,{className:`v4-fallback__cta`,href:ki,children:t.seeWork}),(0,$.jsx)(`a`,{className:`v4-fallback__back`,href:Oi,children:t.back})]}),(0,$.jsxs)(`p`,{className:`v4-fallback__hint`,children:[t.hintBefore,(0,$.jsx)(`a`,{href:s.gameUrl,rel:`noopener`,children:s.gameUrl.replace(/^https?:\/\//,``)}),t.hintAfter]})]})})}function ji(){if(typeof window>`u`)return!1;try{return!!document.createElement(`canvas`).getContext(`webgl2`)}catch{return!1}}function Mi(){let[e]=(0,Ee.useState)(ji);return e?(0,$.jsx)(Di,{}):(0,$.jsx)(Ai,{})}(0,Te.createRoot)(document.getElementById(`root`)).render((0,$.jsx)(r,{children:(0,$.jsx)(Mi,{})}));