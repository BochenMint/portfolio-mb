import{n as e,r as t,t as n}from"./jsx-runtime-i9uBjpvk.js";import{n as r,o as i,r as a}from"./i18n-C1tP8KwJ.js";/* empty css            */import{d as o,g as s}from"./live-C7cvPOC7.js";import{t as c}from"./gallery-jI0pM9Zk.js";import{$ as l,A as u,At as d,B as f,C as p,Ct as m,G as h,H as g,J as _,K as v,M as y,P as b,Q as x,S,St as C,T as w,Tt as T,U as E,V as D,W as O,X as k,Z as A,_t as j,b as M,bt as N,ct as P,dt as F,ft as I,ht as L,it as R,kt as z,l as B,lt as V,mt as ee,ot as te,pt as H,st as ne,tt as U,u as W,v as re,vt as G,w as ie,wt as K,x as q,y as J,yt as ae}from"./three-8V8V_zZj.js";import{a as oe,c as se,d as ce,i as le,n as ue,o as Y,p as de,r as fe}from"./build-BX1ZBYnt.js";import{r as pe}from"./heroSceneTypes-BBcQTCIc.js";import{a as me,c as he,d as ge,i as _e,l as X,o as ve,r as Z,s as ye,t as be,u as xe}from"./buildShipV2-WzNP40ru.js";var Se=e(),Ce=t(),Q=180,we=Q/2,Te=2600,Ee=1200,De=900,Oe=400,ke=12,Ae=60,je=.5,Me=70,Ne=.1,Pe=.35;function Fe(){let e=document.createElement(`canvas`);e.width=e.height=32;let t=e.getContext(`2d`),n=t.createRadialGradient(16,16,0,16,16,16);return n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.5,`rgba(255,255,255,0.5)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,32,32),new q(e)}function Ie(e,t){let n=e-t;for(;n>we;)n-=Q;for(;n<-90;)n+=Q;return t+n}var Le=`
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
`,Re=`
  precision mediump float;
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec3 vTint;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    gl_FragColor = vec4(vTint * tex.rgb, tex.a * uOpacity);
  }
`;function ze(e){let t=e?Ee:Te,n=e?Oe:De,r=Fe(),i=new Float32Array(t*3),a=new Float32Array(t),o=new Float32Array(t*3);for(let e=0;e<t;e++){let t=e*3;i[t+0]=(Math.random()-.5)*Q,i[t+1]=(Math.random()-.5)*Q,i[t+2]=(Math.random()-.5)*Q,a[e]=.1+Math.random()*.25;let n=Math.random();n<.04?(o[t+0]=.72,o[t+1]=.83,o[t+2]=1):n<.08?(o[t+0]=1,o[t+1]=.9,o[t+2]=.74):(o[t+0]=1,o[t+1]=1,o[t+2]=1)}let s=new M;s.setAttribute(`position`,new J(i,3)),s.setAttribute(`aSize`,new J(a,1)),s.setAttribute(`aTint`,new J(o,3));let c=new L({uniforms:{uMap:{value:r},uOpacity:{value:Ne},uSizeMul:{value:260}},vertexShader:Le,fragmentShader:Re,transparent:!0,depthWrite:!1,depthTest:!0,blending:2}),l=new P(s,c);l.frustumCulled=!1,l.renderOrder=2;let u=new Float32Array(n*3);for(let e=0;e<n;e++){let t=e*3;u[t+0]=(Math.random()-.5)*Q,u[t+1]=(Math.random()-.5)*Q,u[t+2]=(Math.random()-.5)*Q}let d=new Float32Array(n*2*3),p=new M,m=new J(d,3);m.setUsage(y),p.setAttribute(`position`,m);let h=new E({color:13623551,transparent:!0,opacity:0,depthWrite:!1,blending:2}),g=new O(p,h);g.frustumCulled=!1,g.renderOrder=2;let _=new f;return _.name=`dust-field`,_.add(l),_.add(g),{object:_,update(e,r){for(let n=0;n<t;n++){let t=n*3;i[t+0]=Ie(i[t+0],e.x),i[t+1]=Ie(i[t+1],e.y),i[t+2]=Ie(i[t+2],e.z)}s.attributes.position.needsUpdate=!0;let a=r.length(),o=k.clamp(a/Me,0,1);c.uniforms.uOpacity.value=k.lerp(Ne,Pe,o);let l=0,f=0,m=-1;if(a>1e-4){let e=1/a;l=r.x*e,f=r.y*e,m=r.z*e}let g=k.clamp(a*.06,.3,4.5);for(let t=0;t<n;t++){let n=t*3;u[n+0]=Ie(u[n+0],e.x),u[n+1]=Ie(u[n+1],e.y),u[n+2]=Ie(u[n+2],e.z);let r=u[n+0],i=u[n+1],a=u[n+2],o=t*6;d[o+0]=r,d[o+1]=i,d[o+2]=a,d[o+3]=r-l*g,d[o+4]=i-f*g,d[o+5]=a-m*g}p.attributes.position.needsUpdate=!0,h.opacity=k.clamp((a-ke)/(Ae-ke),0,1)*je},dispose(){s.dispose(),c.dispose(),p.dispose(),h.dispose(),r.dispose()}}}var Be=1500,Ve=1600,He=20260712,Ue=`
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
`,We=`
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
`;function Ge(e){let t=e?800:Be,n=ge(He),r=new Float32Array(t*3),i=new Float32Array(t),a=new Float32Array(t),o=new Float32Array(t),s=new Float32Array(t*3),c=new w(16777215),l=new w(12571903),u=new w(16769208),f=new w;for(let e=0;e<t;e++){let t,d,p,m;do t=n()*2-1,d=n()*2-1,p=n()*2-1,m=t*t+d*d+p*p;while(m<.01||m>1);let h=Ve/Math.sqrt(m);r[e*3]=t*h,r[e*3+1]=d*h,r[e*3+2]=p*h,i[e]=n()*Math.PI*2,a[e]=.5+n()*2.2,o[e]=.5+n()**2.4*1.9;let g=n();g<.12?f.copy(l):g<.2?f.copy(u):f.copy(c),f.multiplyScalar(.55+n()*.45),s[e*3]=f.r,s[e*3+1]=f.g,s[e*3+2]=f.b}let p=new M;p.setAttribute(`position`,new J(r,3)),p.setAttribute(`aPhase`,new J(i,1)),p.setAttribute(`aSpeed`,new J(a,1)),p.setAttribute(`aSize`,new J(o,1)),p.setAttribute(`aColor`,new J(s,3)),p.boundingSphere=new j(new d,1601);let m=new L({uniforms:{uTime:{value:0}},vertexShader:Ue,fragmentShader:We,transparent:!0,depthWrite:!1,depthTest:!0,blending:2}),h=new P(p,m);return h.frustumCulled=!1,h.renderOrder=0,h.name=`starfield-twinkle`,{object:h,update(e,t,n){h.position.copy(e),h.rotation.y=n,m.uniforms.uTime.value=t},dispose(){p.dispose(),m.dispose()}}}var Ke=`/v4/assets/skybox-8k.jpg`,qe=`/v4/assets/skybox-4k.jpg`,Je=`/v4/assets/skybox-2k.jpg`;function Ye(){return typeof navigator>`u`?!1:!!navigator.connection?.saveData}function Xe(){return typeof navigator>`u`?!1:navigator.userAgentData?.mobile===!0?!0:/iPhone|iPod|Android.+Mobile/i.test(navigator.userAgent)}function Ze(e,t){return t?[Je]:e>=8192?[Ke,qe,Je]:e>=4096?(console.warn(`[v4] GPU maxTextureSize=${e} < 8192; sky fallback ${qe}`),[qe,Je]):(console.warn(`[v4] GPU maxTextureSize=${e} < 4096; sky fallback ${Je}`),[Je])}async function Qe(e,t){let n;for(let r of t)try{return{texture:await e.loadAsync(r),url:r}}catch(e){n=e,console.error(`[v4] sky texture failed to load: ${r}`,e)}throw n instanceof Error?n:Error(`[v4] sky texture failed to load: ${t.join(` → `)}`)}function $e(e){e.mapping=303,e.colorSpace=H,e.generateMipmaps=!1,e.minFilter=h,e.magFilter=h,e.wrapS=F,e.wrapT=ie,e.anisotropy=1,e.needsUpdate=!0}var et=4500,tt=`
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
`,nt=`
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
`;function rt(e){let t=new G(et,64,40),n=new L({uniforms:{uSky:{value:e},uSkyRot:{value:0}},vertexShader:tt,fragmentShader:nt,side:1,depthWrite:!1,depthTest:!1}),r=new x(t,n);return r.frustumCulled=!1,r.renderOrder=-2,r.name=`sky-dome`,{mesh:r,setYaw(e){n.uniforms.uSkyRot.value=e},dispose(){t.dispose(),n.dispose()}}}async function it(e,t){let{lowPower:n,manager:r,reducedMotion:i}=t,a=typeof location<`u`&&new URLSearchParams(location.search).has(`debug`),o=new W({canvas:e,antialias:!n,alpha:!1,powerPreference:n?`default`:`high-performance`,preserveDrawingBuffer:a});o.setPixelRatio(pe(n)),o.setClearColor(0,1),o.toneMapping=4,o.toneMappingExposure=1.18,o.outputColorSpace=H;let s=new ee,c=new te(60,1,.8,6e3);c.position.set(0,4,16);let l=new ne(13688042,250,120,2);c.add(l),s.add(c);let d=new C(r),f=n||Ye()||Xe(),p=Ze(o.capabilities.maxTextureSize,f),h=p[0]===Je?Promise.resolve(null):d.loadAsync(Je).catch(e=>(console.error(`[v4] env sky texture failed to load: ${Je}`,e),null)),[{texture:g,url:_},v]=await Promise.all([Qe(d,p),h]);$e(g);let y=rt(g);s.add(y.mesh);let b=v??g;v&&(v.mapping=303,v.colorSpace=H);let S=new B(o);S.compileEquirectangularShader();let w=S.fromEquirectangular(b);s.environment=w.texture;let T=w.texture;if(v?.dispose(),a){let e=g.image;window.__v4Sky={url:_,imageWidth:e?.width??0,imageHeight:e?.height??0,generateMipmaps:g.generateMipmaps,minFilter:g.minFilter,magFilter:g.magFilter,wrapS:g.wrapS,colorSpace:g.colorSpace,anisotropy:g.anisotropy,maxTextureSize:o.capabilities.maxTextureSize,constrained:f}}s.add(new D(9085128,658448,.55));let E=new u(16773596,1.65);E.position.set(600,400,250),s.add(E);let O=new u(11847396,.95);O.position.set(-420,260,-380),s.add(O);let k=new ne(16760944,130,520,1.7);k.position.set(0,0,0),s.add(k);let A=ze(n);s.add(A.object);let j=Ge(n);s.add(j.object);let M=new oe(o,{multisampling:n?0:4});M.addPass(new ce(s,c));let N=new ue({intensity:i?.1:n?.12:.16,luminanceThreshold:.985,luminanceSmoothing:.06,mipmapBlur:!0}),P=new de({offset:.52,darkness:.22}),F=[N,new fe({contrast:.02,brightness:0}),new se({saturation:-.02}),P];if(!n&&!i){let e=new le({offset:new z(9e-4,9e-4),radialModulation:!0,modulationOffset:.15});F.splice(1,0,e)}M.addPass(new Y(c,...F));let I=new m;a||I.connect(document);let L=new Set,R=0,V=!1,U=e=>a&&document.hidden?setTimeout(()=>e(performance.now()),16):requestAnimationFrame(e),re=e=>{if(!V)return;I.update(e);let t=Math.min(.05,I.getDelta()),n=I.getElapsed();for(let e of L)e(t,n);let r=n*ye;y.setYaw(r),j.update(c.position,n,r),M.render(t),R=U(re)};return{renderer:o,scene:s,camera:c,composer:M,dust:A,envMap:T,skyTex:g,setSize(e,t){e<2||t<2||(o.setSize(e,t,!1),M.setSize(e,t),c.aspect=e/Math.max(t,1),c.updateProjectionMatrix())},onTick(e){return L.add(e),()=>L.delete(e)},start(){V||(V=!0,I.reset(),R=U(re))},stop(){V=!1,clearTimeout(R),cancelAnimationFrame(R)},dispose(){V=!1,clearTimeout(R),cancelAnimationFrame(R),I.dispose(),L.clear(),A.dispose(),j.dispose(),y.dispose(),s.traverse(e=>{if(e instanceof x){let t=Array.isArray(e.material)?e.material:[e.material];for(let e of t)e?.dispose()}}),w.dispose(),S.dispose(),g.dispose(),M.dispose(),o.dispose(),o.getContext().getExtension(`WEBGL_lose_context`)?.loseContext()}}}var at=22,ot=at/5;at*.42,ot*.42,at*.16,new w(5093631),new w(10475775),new w(15398655),new w(3787263),`${Z}${X}`;var st=new d(1,0,0),ct=new d(0,1,0),lt=Math.PI/180,ut=1.9,dt=6.5,ft=8,pt=1.15,mt=7,ht=9,gt=52*lt,_t=20*lt,vt=5,yt=.1,bt=30,xt=.999,St=92,Ct=4.2,wt=2.4,Tt=new Set([`Space`]),Et=new Set([`ShiftLeft`,`ShiftRight`]),Dt=new Set([`KeyW`,`ArrowUp`]),Ot=new Set([`KeyS`,`ArrowDown`]),kt=new Set([`KeyA`,`ArrowLeft`]),At=new Set([`KeyD`,`ArrowRight`]),jt=new Set([`KeyQ`]),Mt=new Set([`KeyE`]),Nt=new Set([`Space`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`]);function Pt(e,t){let n=new Set,r={position:e.clone(),quaternion:new V,velocity:new d,angularVelocity:new d,bankAngle:0,thrustLevel:0,brakeLevel:0,speed:0,hasThrusted:!1},i=e=>{n.add(e.code),Nt.has(e.code)&&e.preventDefault()},a=e=>{n.delete(e.code)},o=()=>n.clear();window.addEventListener(`keydown`,i,{passive:!1}),window.addEventListener(`keyup`,a),window.addEventListener(`blur`,o);let s=e=>{for(let t of e)if(n.has(t))return!0;return!1},c=new d,l=new V,u=new V,f=new b(0,0,0,`YXZ`);return{state:r,update(e){let n=0;s(Dt)&&--n,s(Ot)&&(n+=1),t&&(t.pitch!==0||n===0)&&(n=Math.max(-1,Math.min(1,n+t.pitch)));let i=n*ut,a=n===0?ft:dt;r.angularVelocity.x+=(i-r.angularVelocity.x)*Math.min(1,a*e),r.angularVelocity.x*=Math.exp(-3.2*e);let o=0;s(kt)&&(o+=1),s(At)&&--o,t&&(t.turn!==0||o===0)&&(o=Math.max(-1,Math.min(1,o+t.turn)));let d=o*pt,p=d===0?ht:mt;r.angularVelocity.y+=(d-r.angularVelocity.y)*Math.min(1,p*e);let m=yt*Math.abs(r.angularVelocity.y)/pt,h=0;s(jt)&&(h+=1),s(Mt)&&--h;let g=r.angularVelocity.y/pt*gt+h*_t;r.bankAngle+=(g-r.bankAngle)*Math.min(1,vt*e),r.angularVelocity.z=0,l.setFromAxisAngle(st,(r.angularVelocity.x+m)*e),u.setFromAxisAngle(ct,r.angularVelocity.y*e),r.quaternion.multiply(l).multiply(u),r.quaternion.normalize(),f.setFromQuaternion(r.quaternion,`YXZ`),Math.abs(f.x)<1.35&&(f.z=0,r.quaternion.setFromEuler(f));let _=s(Tt)||(t?.thrust??!1),v=s(Et)||(t?.brake??!1);_&&(r.hasThrusted=!0),c.set(0,0,-1).applyQuaternion(r.quaternion);let y=r.velocity.length();if(_){let t=Math.max(0,1-(y/St)**2);r.velocity.addScaledVector(c,54*t*e)}if(v&&y>.05){let t=r.velocity.clone().normalize(),n=Math.min(bt*e,y);r.velocity.addScaledVector(t,-n)}r.velocity.multiplyScalar(xt),r.position.addScaledVector(r.velocity,e),r.speed=r.velocity.length();let b=+!!_,x=_?Ct:wt;r.thrustLevel+=(b-r.thrustLevel)*Math.min(1,x*e),r.brakeLevel+=(+!!v-r.brakeLevel)*Math.min(1,4*e)},dispose(){window.removeEventListener(`keydown`,i),window.removeEventListener(`keyup`,a),window.removeEventListener(`blur`,o),n.clear()}}}var Ft=52,It=.12;function Lt(e,t,n){return Math.max(t,Math.min(n,e))}function Rt(e){let t=Math.abs(e);return t<It?0:Math.sign(e)*((t-It)/(1-It))}function zt(e){let t={pitch:0,turn:0,thrust:!1,brake:!1};if(!window.matchMedia(`(pointer: coarse)`).matches)return{input:t,active:!1,dispose(){}};let n=document.createElement(`div`);n.className=`v4-touch`,n.innerHTML=`
    <div class="v4-touch__stick-zone" aria-hidden="true">
      <div class="v4-touch__stick-ring"></div>
      <div class="v4-touch__stick-knob"></div>
    </div>
    <div class="v4-touch__actions">
      <button type="button" class="v4-touch__btn v4-touch__btn--brake" data-action="brake" aria-label="Hamowanie">HAM</button>
      <button type="button" class="v4-touch__btn v4-touch__btn--thrust" data-action="thrust" aria-label="Ciąg główny">CIĄG</button>
    </div>
  `,e.appendChild(n);let r=n.querySelector(`.v4-touch__stick-zone`),i=n.querySelector(`.v4-touch__stick-knob`),a=n.querySelector(`[data-action="thrust"]`),o=n.querySelector(`[data-action="brake"]`),s=null,c=0,l=0;function u(){s=null,t.pitch=0,t.turn=0,i.style.transform=`translate(-50%, -50%)`}function d(e,n){let r=e-c,a=n-l,o=Math.hypot(r,a),s=o>Ft?Ft/o:1,u=r*s/Ft,d=a*s/Ft;i.style.transform=`translate(calc(-50% + ${u*Ft}px), calc(-50% + ${d*Ft}px))`,t.pitch=Rt(Lt(-d,-1,1)),t.turn=Rt(Lt(u,-1,1))}let f=e=>{if(s!==null)return;s=e.pointerId,r.setPointerCapture(e.pointerId);let t=r.getBoundingClientRect();c=t.left+t.width/2,l=t.top+t.height/2,d(e.clientX,e.clientY),e.preventDefault()},p=e=>{e.pointerId===s&&(d(e.clientX,e.clientY),e.preventDefault())},m=e=>{e.pointerId===s&&(r.releasePointerCapture(e.pointerId),u(),e.preventDefault())};r.addEventListener(`pointerdown`,f),r.addEventListener(`pointermove`,p),r.addEventListener(`pointerup`,m),r.addEventListener(`pointercancel`,m);let h=(e,n,r)=>{t[r]=n,e.classList.toggle(`is-active`,n)},g=(e,t)=>{let n=n=>{e.setPointerCapture(n.pointerId),h(e,!0,t),n.preventDefault()},r=n=>{e.hasPointerCapture(n.pointerId)&&e.releasePointerCapture(n.pointerId),h(e,!1,t),n.preventDefault()};return e.addEventListener(`pointerdown`,n),e.addEventListener(`pointerup`,r),e.addEventListener(`pointercancel`,r),()=>{e.removeEventListener(`pointerdown`,n),e.removeEventListener(`pointerup`,r),e.removeEventListener(`pointercancel`,r)}},_=g(a,`thrust`),v=g(o,`brake`),y=()=>{u(),h(a,!1,`thrust`),h(o,!1,`brake`)};return window.addEventListener(`blur`,y),{input:t,active:!0,dispose(){window.removeEventListener(`blur`,y),r.removeEventListener(`pointerdown`,f),r.removeEventListener(`pointermove`,p),r.removeEventListener(`pointerup`,m),r.removeEventListener(`pointercancel`,m),_(),v(),n.remove()}}}var Bt=.15,Vt=5.4,Ht=28,Ut=18,Wt=.8,Gt=50,Kt=56,qt=5.5,Jt=10,Yt=16,Xt=.45,Zt=.9,Qt=new d(0,1,0),$t=new d(0,0,-1),en=new d(0,1,0);function tn(e,t){return!Number.isFinite(e.x+e.y+e.z)||e.lengthSq()<1e-10?t.clone():e.normalize()}function nn(e){let t=new d,n=new d,r=new d,i=new d,a=new d,o=new d(Bt,Vt,Ht),s=new d,c=new d,l=0;return e.fov=Gt,e.updateProjectionMatrix(),{update(u,d,f,p,m,h){let g=Number.isFinite(u)&&u>0?Math.min(u,.05):1/60,_=h?Math.min(Math.hypot(h.x,h.y),12):0,v=h?k.clamp(-h.y*Xt,-.9,Zt):0,y=h?k.clamp(h.x*Xt,-.9,Zt):0,b=1-Math.exp(-8*g);s.x+=(v-s.x)*b,s.y+=(y-s.y)*b;let x=k.clamp(Number.isFinite(p)?p:0,0,1),S=x*qt;l+=(S-l)*(1-Math.exp(-4.5*g)),a.set(Bt+s.x,Vt+s.y,Ht+l);let C=1-Math.exp(-(Jt+_*Yt)*g);o.lerp(a,C),t.copy(o).applyQuaternion(f).add(d),e.position.copy(t),r.set(0,0,-1).applyQuaternion(f),tn(r,$t),i.set(0,1,0).applyQuaternion(f),tn(i,en),n.copy(d).addScaledVector(r,Ut).addScaledVector(i,Wt),c.copy(n).sub(e.position),c.lengthSq()>1e-8?(c.normalize(),e.up.copy(Math.abs(c.dot(Qt))>.92?i:Qt)):e.up.copy(Qt),e.lookAt(n);let w=k.lerp(Gt,Kt,x*x);Math.abs(e.fov-w)>.01&&(e.fov=w,e.updateProjectionMatrix())}}}var rn=new d(0,0,0),an=[{id:`mint`,position:new d(784,126,-364),radius:40,color:3003583},{id:`plumm`,position:new d(-588,-196,728),radius:34,color:9071615},{id:`idrive`,position:new d(420,308,1176),radius:28,color:16762977},{id:`agentic`,position:new d(-1092,-84,-840),radius:45,color:16098596}];function on(e){let t=Math.floor(Math.max(0,e)/100),n=t%10,r=Math.floor(t/10),i=r%60,a=Math.floor(r/60);return`${String(a).padStart(2,`0`)}:${String(i).padStart(2,`0`)}.${n}`}function sn(e){let t=new Date(e);return Number.isNaN(t.getTime())?`--.--`:`${String(t.getDate()).padStart(2,`0`)}.${String(t.getMonth()+1).padStart(2,`0`)}`}function cn(e,t){let n=e.match(/[^.!?]+[.!?]+(\s+|$)/g);return!n||n.length===0?e.trim():n.slice(0,t).join(``).trim()}var ln={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`};function un(e){return e.replace(/[&<>"']/g,e=>ln[e]??e)}function dn(e){if(!e)return!1;let t=e.trim();if(!t||t===`#`||t.startsWith(`#`))return!1;try{let e=new URL(t);return e.protocol===`http:`||e.protocol===`https:`}catch{return!1}}var fn=`https://marcinbochenek.com`,pn=8e3,mn=.4;function hn(e,t={}){let n=typeof location<`u`&&new URLSearchParams(location.search).has(`debug`);for(let t of e.querySelectorAll(`.stats, #stats, [class*="fps"]`))t.remove();let r=t.touchActive??!1,i=r?`<span>Lewy drążek</span> — lot · <span>Ciąg</span> — napęd · <span>Ham</span> — hamowanie`:`<span>W/S</span> — pochylenie · <span>A/D</span> — skręt · <span>Spacja</span> — ciąg · <span>Shift</span> — hamowanie`,a=r?`Przytrzymaj <span class="v4-hud__start-keys">Ciąg</span>, aby uruchomić silniki`:`Naciśnij <span class="v4-hud__start-keys">Spację</span>, aby uruchomić silniki`,o=document.createElement(`div`);o.className=`v4-hud`,o.innerHTML=`
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
      <div class="v4-hud__pips">${an.map(e=>`<span class="v4-hud__pip" data-planet="${e.id}"></span>`).join(``)}</div>
    </div>
    ${n?`<div class="v4-hud__panel v4-hud__fps" hidden>fps</div>`:``}

    <div class="v4-hud__panel v4-hud__mission">
      Misja: znajdź nowoczesną stronę dla swojego biznesu
    </div>

    <div class="v4-hud__warning">Uwaga: studnia grawitacyjna</div>

    <div class="v4-hud__start-prompt">${a}</div>

    <div class="v4-hud__legend" aria-hidden="true">
      ${i}
    </div>

    <div class="v4-hud__links">
      <a href="/v4/assets/ATTRIBUTION.md" target="_blank" rel="noopener">Assety i licencje</a>
      <a href="${fn}">&larr; klasyczne portfolio</a>
    </div>
  `,e.appendChild(o);let s=o.querySelector(`.v4-hud__speed-value`),c=o.querySelector(`.v4-hud__thrust-fill`),l=o.querySelector(`.v4-hud__legend`),u=o.querySelector(`.v4-hud__start-prompt`),d=o.querySelector(`.v4-hud__timer`),f=o.querySelector(`.v4-hud__warning`),p=Array.from(o.querySelectorAll(`.v4-hud__pip`)),m=o.querySelector(`.v4-hud__fps`),h=performance.now(),g=0,_=0,v=mn*54,y=v*.78,b=!1,x=0,S=!1;function C(){window.clearTimeout(x),x=window.setTimeout(()=>{l.classList.remove(`is-visible`),l.setAttribute(`aria-hidden`,`true`)},pn)}return{update(e){if(s.textContent=String(Math.round(e.speed)).padStart(2,`0`),c.style.transform=`scaleX(${Math.max(0,Math.min(1,e.thrust))})`,e.hasThrusted&&!b&&(b=!0,u.classList.add(`is-hidden`),l.classList.add(`is-visible`),l.setAttribute(`aria-hidden`,`false`),C()),d.textContent=on(e.missionMs),m){let e=performance.now(),t=e-h;if(h=e,t>.75&&t<250){let e=1e3/t;g=_===0?e:g*.88+e*.12,_+=1,_>=8&&g>=1&&(m.hidden=!1,m.textContent=`${Math.round(g)} fps`)}}S=S?e.gravityAccel>y:e.gravityAccel>v,f.classList.toggle(`is-visible`,S);for(let t of p){let n=t.dataset.planet;t.classList.toggle(`is-found`,e.discovered.has(n))}},reset(){b=!1,S=!1,window.clearTimeout(x),u.classList.remove(`is-hidden`),l.classList.remove(`is-visible`),l.setAttribute(`aria-hidden`,`true`),f.classList.remove(`is-visible`)},dispose(){window.clearTimeout(x),o.remove()}}}var gn=96,_n=90,vn=114,yn=3.4,bn=124,xn=248,Sn=14,Cn=1,wn=175,Tn=gn,En=.94,Dn=126,On=64,kn=`
  varying vec3 vWorldPos;
  varying vec2 vLocalXY;
  void main() {
    vLocalXY = position.xy;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,An=`
  precision highp float;

  uniform vec3 uBHPos;
  uniform float uHorizonR;
  uniform float uPhotonR;
  uniform float uPhotonWidth;
  uniform float uDiskInner;
  uniform float uDiskOuter;
  uniform vec3 uDiskU;
  uniform vec3 uDiskV;
  uniform vec3 uDiskN;
  uniform float uTime;
  uniform sampler2D uSky;
  uniform float uBendK;
  uniform int uSteps;
  uniform float uHalfSize;
  uniform float uMarchStartR;
  uniform float uShadowCaptureR;
  uniform float uSkyRot;

  varying vec3 vWorldPos;
  varying vec2 vLocalXY;

  #define PI 3.14159265359
  // Tight safety margin — catches step-budget leaks without swallowing the
  // thin outer lens rim.
  #define HORIZON_SAFETY_R (uHorizonR * 1.02)

  ${Z}

  // Matches three.js's own equirectUv() convention (ShaderChunk/common.glsl.js)
  // so the lensed sample lines up seamlessly with the untouched skybox at the
  // edge of this impostor.
  vec2 equirectUv(vec3 dir) {
    float u = atan(dir.z, dir.x) / (2.0 * PI) + 0.5;
    float v = asin(clamp(dir.y, -1.0, 1.0)) / PI + 0.5;
    return vec2(u, v);
  }

  // Single sky-sampling entry point — applies the same slow yaw the engine
  // applies to scene.backgroundRotation, so the lensed view stays continuous
  // with the rotating skybox at the impostor edge.
  vec3 sampleSky(vec3 dir) {
    float c = cos(uSkyRot);
    float s = sin(uSkyRot);
    vec3 rd2 = vec3(c * dir.x + s * dir.z, dir.y, -s * dir.x + c * dir.z);
    // Seam-free equirect (identyczny trick jak w SKY_FRAG kopuły — patrz
    // core.ts): druga próbka z u przesuniętym o 0.5, wybór po mniejszym
    // fwidth. Wymaga wrapS = RepeatWrapping na uSky.
    vec2 uvA = equirectUv(rd2);
    vec2 uvB = vec2(fract(uvA.x + 0.5) - 0.5, uvA.y);
    return (fwidth(uvA.x) <= fwidth(uvB.x)
      ? texture2D(uSky, uvA, -0.75)
      : texture2D(uSky, uvB, -0.75)).rgb;
  }

  // Spec palette "temperature" gradient (not a physical black-body LUT):
  // white-gold core #fff7e8 -> warm amber mid #ffc861 -> deep ember outer
  // edge #e8761a — deliberately NOT oversaturated orange.
  vec3 diskTemperatureColor(float t) {
    vec3 hot = vec3(1.0, 0.969, 0.91);
    vec3 amber = vec3(1.0, 0.784, 0.38);
    vec3 ember = vec3(0.91, 0.463, 0.102);
    vec3 c = mix(amber, ember, smoothstep(0.25, 0.9, t));
    c = mix(hot, c, smoothstep(0.0, 0.22, t));
    return c;
  }

  // Shared disk-plane shading — used for direct outer annulus hits and for
  // lensed crossings inside the march sphere.
  vec3 shadeDiskCrossing(vec3 crossP, vec3 d, float imageFalloff, bool isOuterDirect) {
    float cu = dot(crossP, uDiskU);
    float cv = dot(crossP, uDiskV);
    float rad = length(vec2(cu, cv));
    if (rad <= uDiskInner || rad >= uDiskOuter) return vec3(0.0);

    float tRad = (rad - uDiskInner) / (uDiskOuter - uDiskInner);
    float ang = atan(cv, cu);

    float omega = 2.0 / pow(rad / uDiskInner, 1.5);
    float flowAngle = ang - uTime * omega;
    // Seam-free streaks: sin/cos of the wrap so atan2's 2π cut cannot draw
    // a radial gold scratch across the disk.
    vec2 flow = vec2(sin(flowAngle), cos(flowAngle));

    float streak = fbm2(vec2(rad * 0.22, 0.0) + flow * 2.6, 5);
    float streak2 = fbm2(vec2(rad * 0.62, 4.1) + flow * 5.4, 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec3 tempColor = diskTemperatureColor(tRad);

    vec3 tangent = normalize(-sin(ang) * uDiskU + cos(ang) * uDiskV);
    float approach = dot(tangent, -d);
    // Mild Doppler — 2.1 was a circular gold spotlight on the approaching
    // rim that bloom then smeared into a kleks against the horizon.
    float beam = mix(0.72, 1.12, smoothstep(-0.7, 0.7, approach));

    float innerFade = smoothstep(0.0, 0.14, tRad);
    float outerFade = isOuterDirect
      ? (1.0 - smoothstep(0.78, 1.0, tRad))
      : (1.0 - smoothstep(0.68, 1.0, tRad));
    float brightness = (0.42 + streakMix * 0.7) * beam * innerFade * outerFade;

    if (isOuterDirect) {
      brightness *= mix(1.0, 0.55, smoothstep(uMarchStartR, uDiskOuter, rad));
    }

    return tempColor * brightness * imageFalloff;
  }

  void main() {
    vec3 ro = cameraPosition;
    vec3 rd = normalize(vWorldPos - ro);
    vec3 w0 = ro - uBHPos;

    // Unit-circle mesh, world radius = uHalfSize (set from JS scale).
    // Circular clip only — never a world-radius fade (that was the vertical knife).
    float billboardR = length(vLocalXY);
    if (billboardR > 0.992) discard;

    // Periapsis / impact parameter — single source of truth for the shadow cone.
    float b2Early = dot(w0, w0) - pow(dot(w0, rd), 2.0);
    float closestREarly = sqrt(max(b2Early, 0.0));
    // Apparent shadow (inside photon ring). The 3D horizon sphere writes
    // opaque black + real depth for this cone — the impostor must NOT fill
    // it (that was the circular stamp on the ship). March still runs so
    // far-side disk can wrap just outside the silhouette.
    bool inCore = closestREarly < uShadowCaptureR;

    // Near-side outer annulus (r > march sphere) — direct, unlensed shading.
    // Interstellar: the wide disk plane extends past the lensing volume; only
    // the inner band + far-side images need geodesic bending.
    vec3 directDisk = vec3(0.0);
    float diskDenom = dot(rd, uDiskN);
    if (abs(diskDenom) > 1e-5) {
      float tPlane = -dot(w0, uDiskN) / diskDenom;
      if (tPlane > 0.0) {
        vec3 crossP = w0 + rd * tPlane;
        float rad = length(vec2(dot(crossP, uDiskU), dot(crossP, uDiskV)));
        if (rad > uDiskInner && rad < uDiskOuter && rad > uMarchStartR * 0.94) {
          directDisk = shadeDiskCrossing(crossP, rd, 1.0, true);
        }
      }
    }
    bool hadOuterDirect = dot(directDisk, vec3(0.299, 0.587, 0.114)) > 1e-5;

    // Far-field deflection is negligible — analytically fast-forward to
    // where the ray first enters the march sphere instead of burning the
    // step budget on a straight line where nothing happens. Rays that never
    // enter it at all may still see the outer disk (directDisk); the empty
    // core is the sphere's job, so we discard here instead of stamping black.
    vec3 oc = w0;
    float bIsec = dot(oc, rd);
    float cIsec = dot(oc, oc) - uMarchStartR * uMarchStartR;
    float discIsec = bIsec * bIsec - cIsec;

    if (discIsec < 0.0) discard;

    float tEntry = -bIsec - sqrt(discIsec);
    // Work in hole-relative coordinates from here on — the geodesic term and
    // the disk tests only care about the offset from the singularity.
    vec3 p = (tEntry > 0.0 ? ro + rd * tEntry : ro) - uBHPos;
    vec3 d = rd;
    // Conserved specific angular momentum h = |x×v| of this ray — the
    // Schwarzschild null geodesic in central-force form bends with
    // a = -1.5·Rs·h²·x/r⁵ (leapfrog below). Impact parameter b = h for a
    // unit-speed ray, so h² also encodes how close this ray will pass.
    vec3 hvec = cross(p, d);
    float h2 = dot(hvec, hvec);
    float bendScale = 1.5 * uHorizonR * h2 * uBendK;

    vec3 accum = vec3(0.0);
    float minDist = 1.0e9;
    bool captured = false;
    int diskHits = 0;

    for (int i = 0; i < 128; i++) {
      if (i >= uSteps) break;

      float r = length(p);
      minDist = min(minDist, r);

      if (r < uHorizonR) {
        captured = true;
        break;
      }
      if (r > uMarchStartR * 1.02 && dot(d, p) > 0.0) break;

      // Finer steps deep in the strong field (photon-ring region needs them),
      // coarser out at disk radii where curvature is already tiny.
      float ds = clamp(r * 0.14, 0.35, 5.0);
      float r2 = r * r;
      vec3 accel = p * (-bendScale / (r2 * r2 * r));
      vec3 newD = d + accel * ds;

      vec3 prevP = p;
      p += newD * ds;
      d = newD;

      // Tilted accretion-disk plane crossing test (basis uDiskU/uDiskV/uDiskN),
      // run DURING bending so rays that pass above/below the hole can still
      // hit the far side of the disk behind it — that is what paints the
      // over-pole halo arcs. Capped at three hits (direct + two lensed
      // images) so a ray orbiting the photon sphere can't rack up unbounded
      // brightness.
      float prevZ = dot(prevP, uDiskN);
      float curZ = dot(p, uDiskN);
      if (diskHits < 3 && prevZ * curZ < 0.0) {
        float tt = prevZ / (prevZ - curZ);
        vec3 crossP = mix(prevP, p, tt);
        float cu = dot(crossP, uDiskU);
        float cv = dot(crossP, uDiskV);
        float rad = length(vec2(cu, cv));
        if (rad > uDiskInner && rad < uDiskOuter) {
          // Skip the near-side outer hit already shaded analytically.
          if (hadOuterDirect && diskHits == 0 && rad > uMarchStartR * 0.94) {
            // no-op
          } else {
            diskHits += 1;
            float imageFalloff = diskHits == 1 ? 1.0 : (diskHits == 2 ? 0.78 : 0.45);
            accum += shadeDiskCrossing(crossP, d, imageFalloff, false);
          }
        }
      }
    }

    // Safety net: a ray that exhausts its step budget deep in the strong
    // field (i.e. never resolved to a clean escape or capture) reads as
    // captured rather than leaking a stray bright/ambiguous sample.
    if (!captured && minDist < HORIZON_SAFETY_R) captured = true;

    // Near-side annulus is the 3D ring mesh (real depth). Impostor only
    // contributes lensed far-side crossings + the photon ring — never fill
    // stronglyBent sky (that was the gold circular kleks clipped against
    // the horizon).
    bool sealed = inCore || captured;
    vec3 color;
    float ring = exp(-pow((minDist - uPhotonR) / uPhotonWidth, 2.0));
    ring *= 1.0 / (1.0 + dot(accum, vec3(0.6)));
    if (sealed) {
      color = accum;
      color += vec3(1.0, 0.969, 0.91) * ring * 0.35;
      if (dot(color, vec3(0.299, 0.587, 0.114)) < 0.004) discard;
    } else {
      bool onRing = ring > 0.05;
      bool onDisk = dot(accum, vec3(0.299, 0.587, 0.114)) > 0.008;
      if (!onRing && !onDisk) discard;
      color = accum;
      color += vec3(1.0, 0.969, 0.91) * ring * 0.35;
    }

    // Billboard depth + depthTest, no depthWrite, no gl_FragDepth: the 3D
    // disk mesh and horizon sphere own occlusion; this cannot stamp the ship.
    gl_FragColor = vec4(color, 1.0);
    ${X}
  }
`,jn=`
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,Mn=`
  precision highp float;
  uniform vec3 uBHPos;
  uniform float uDiskInner;
  uniform float uDiskOuter;
  uniform vec3 uDiskU;
  uniform vec3 uDiskV;
  uniform float uTime;
  varying vec3 vWorldPos;

  ${Z}

  vec3 diskTemperatureColor(float t) {
    vec3 hot = vec3(0.96, 0.9, 0.78);
    vec3 amber = vec3(0.92, 0.68, 0.32);
    vec3 ember = vec3(0.72, 0.36, 0.1);
    vec3 c = mix(amber, ember, smoothstep(0.25, 0.9, t));
    c = mix(hot, c, smoothstep(0.0, 0.22, t));
    return c;
  }

  void main() {
    vec3 rel = vWorldPos - uBHPos;
    float cu = dot(rel, uDiskU);
    float cv = dot(rel, uDiskV);
    float rad = length(vec2(cu, cv));
    if (rad <= uDiskInner || rad >= uDiskOuter) discard;

    float tRad = (rad - uDiskInner) / (uDiskOuter - uDiskInner);
    float ang = atan(cv, cu);
    float omega = 2.0 / pow(rad / uDiskInner, 1.5);
    float flowAngle = ang - uTime * omega;
    vec2 flow = vec2(sin(flowAngle), cos(flowAngle));
    float streak = fbm2(vec2(rad * 0.22, 0.0) + flow * 2.6, 5);
    float streak2 = fbm2(vec2(rad * 0.62, 4.1) + flow * 5.4, 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec3 rd = normalize(vWorldPos - cameraPosition);
    vec3 tangent = normalize(-sin(ang) * uDiskU + cos(ang) * uDiskV);
    float beam = mix(0.78, 1.08, smoothstep(-0.7, 0.7, dot(tangent, -rd)));
    float innerFade = smoothstep(0.1, 0.28, tRad);
    float outerFade = 1.0 - smoothstep(0.82, 1.0, tRad);
    float brightness = (0.32 + streakMix * 0.5) * beam * innerFade * outerFade;

    gl_FragColor = vec4(diskTemperatureColor(tRad) * brightness, 1.0);
    ${X}
  }
`;function Nn(e,t){let n=k.degToRad(Sn),r=new d(0,Math.cos(n),Math.sin(n)).normalize(),i=new d(1,0,0),a=new d().crossVectors(r,i).normalize();i.crossVectors(a,r).normalize();let o=new p(Cn,96),s=new L({uniforms:{uBHPos:{value:rn.clone()},uHorizonR:{value:_n},uPhotonR:{value:vn},uPhotonWidth:{value:yn},uDiskInner:{value:bn},uDiskOuter:{value:xn},uDiskU:{value:i},uDiskV:{value:a},uDiskN:{value:r},uTime:{value:0},uSky:{value:e},uBendK:{value:En},uSteps:{value:t?On:Dn},uHalfSize:{value:xn*4},uMarchStartR:{value:wn},uShadowCaptureR:{value:Tn},uSkyRot:{value:0}},vertexShader:kn,fragmentShader:An,depthTest:!0,depthWrite:!1,transparent:!1,toneMapped:!0,side:2}),c=new x(o,s);c.frustumCulled=!1,c.renderOrder=7,c.name=`black-hole-impostor`;let u=new G(gn,128,96),m=new l({color:0,toneMapped:!1,depthWrite:!0,depthTest:!0,transparent:!1,fog:!1});m.colorWrite=!0;let h=new x(u,m);h.name=`black-hole-horizon`,h.renderOrder=0,h.frustumCulled=!1;let g=new I(bn,xn,160,5),_=new L({uniforms:{uBHPos:{value:rn.clone()},uDiskInner:{value:bn},uDiskOuter:{value:xn},uDiskU:{value:i},uDiskV:{value:a},uTime:{value:0}},vertexShader:jn,fragmentShader:Mn,depthTest:!0,depthWrite:!0,transparent:!1,toneMapped:!0,side:2}),v=new x(g,_);v.name=`black-hole-disk`,v.renderOrder=1,v.quaternion.setFromUnitVectors(new d(0,0,1),r),v.frustumCulled=!1;let y=new f;y.name=`black-hole`,y.position.copy(rn),y.add(h),y.add(v),y.add(c);let b=new d,S=new d;return{object:y,update(e,t,n){c.quaternion.copy(n.quaternion),s.uniforms.uTime.value=t,s.uniforms.uSkyRot.value=t*ye,_.uniforms.uTime.value=t,b.copy(rn).sub(n.position),S.set(0,0,-1).applyQuaternion(n.quaternion);let r=b.dot(S);if(r<20){c.visible=!1;return}c.visible=!0;let i=Math.max(b.length(),1),a=k.clamp(Math.abs(r)/i,.38,1),o=k.clamp(xn*2.4/a,xn*2.2,xn*5.5);c.scale.setScalar(o),s.uniforms.uHalfSize.value=o},dispose(){o.dispose(),s.dispose(),u.dispose(),m.dispose(),g.dispose(),_.dispose()}}}var Pn=`
  precision highp float;

  uniform sampler2D uEarthTex;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  ${he}
  ${Z}

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
    ${X}
  }
`,Fn=`
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
`,In=`
  precision highp float;
  uniform float uTime;
  uniform float uRadius;
  varying vec3 vLocalDir;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  ${he}
  ${Z}

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
    ${X}
  }
`;function Ln(e,t,n=!1){let r=new f;r.name=`planet-mint`;let[i,a]=n?[96,64]:[128,96],o=new G(e,i,a),s=new L({uniforms:{uEarthTex:{value:t},uRadius:{value:e}},vertexShader:me,fragmentShader:Pn}),c=new x(o,s);r.add(c);let l=new G(e*1.025,n?64:84,n?44:60),u=new L({uniforms:{uTime:{value:0},uRadius:{value:e}},vertexShader:Fn,fragmentShader:In,transparent:!0,depthWrite:!1}),d=new x(l,u);d.renderOrder=2,r.add(d);let p=xe(e,16767392,{power:2.3,intensity:1.25});return r.add(p.mesh),{group:r,update(e){c.rotation.y+=e*.018,d.rotation.y+=e*.026,u.uniforms.uTime.value+=e},dispose(){o.dispose(),s.dispose(),l.dispose(),u.dispose(),p.dispose()}}}var Rn=`
  precision highp float;

  uniform sampler2D uCityTex;
  uniform float uTime;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vLocalDir;
  varying vec3 vWorldPos;

  ${he}
  ${Z}

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
    ${X}
  }
`;function zn(e,t,n){let r=new f;r.name=`planet-plumm`;let[i,a]=n?[96,64]:[128,96],o=new G(e,i,a),s=new L({uniforms:{uCityTex:{value:t},uTime:{value:0},uRadius:{value:e}},vertexShader:ve,fragmentShader:Rn}),c=new x(o,s);r.add(c);let u=xe(e,9071615,{power:2.8,intensity:1.35});r.add(u.mesh);let p=[],m=[];if(!n){let t=[{r:e*1.28,speed:.22,tilt:.06,opacity:.55},{r:e*1.48,speed:-.16,tilt:-.09,opacity:.4},{r:e*1.7,speed:.12,tilt:.14,opacity:.3}];for(let n of t){let t=new K(n.r,e*.006,8,160),i=new l({color:11246557,transparent:!0,opacity:n.opacity,blending:2,depthWrite:!1}),a=new x(t,i);a.rotation.x=Math.PI/2+n.tilt,a.renderOrder=2,r.add(a),p.push({mesh:a,speed:n.speed}),m.push({geo:t,mat:i})}}let h=n?20:48,_=new M;{let e=1.8,t=new Float32Array([0,0,-1.8*.55,-.62,.12,e*.45,0,-.1,e*.38,0,0,-1.8*.55,0,-.1,e*.38,.62,.12,e*.45]);_.setAttribute(`position`,new J(t,3)),_.computeVertexNormals()}let v=new l({color:15854847,side:2}),y=new g(_,v,h);y.frustumCulled=!1,r.add(y);let b=[];{let t=(()=>{let e=2636928641;return()=>(e=Math.imul(e^e>>>15,e|1),(e>>>16&65535)/65535)})(),n=new d;for(let r=0;r<h;r++)n.set(t()*2-1,t()*2-1,t()*2-1).normalize(),b.push({quat:new V().setFromAxisAngle(n,t()*Math.PI*2),r:e*(1.16+t()*.42),speed:(.1+t()*.22)*(t()<.5?1:-1),phase:t()*Math.PI*2,bank:(t()-.5)*.9})}let S=new d,C=new d,w=new d,T=new d,E=new d,D=new d(1,1,1),O=new A,k=new V,j=new V,N=new A,P=new d(0,0,1);function F(e){for(let t=0;t<h;t++){let n=b[t],r=n.phase+e*n.speed,i=Math.sign(n.speed)||1;S.set(Math.cos(r)*n.r,0,Math.sin(r)*n.r).applyQuaternion(n.quat),C.set(-Math.sin(r)*i,0,Math.cos(r)*i).applyQuaternion(n.quat).normalize(),w.copy(S).normalize(),E.copy(C).multiplyScalar(-1),T.crossVectors(w,E).normalize(),w.crossVectors(E,T),O.makeBasis(T,w,E),k.setFromRotationMatrix(O),j.setFromAxisAngle(P,n.bank),k.multiply(j),N.compose(S,k,D),y.setMatrixAt(t,N)}y.instanceMatrix.needsUpdate=!0}return F(0),{group:r,update(e,t){c.rotation.y+=e*.014,s.uniforms.uTime.value=t;for(let t of p)t.mesh.rotation.z+=e*t.speed;F(t)},dispose(){o.dispose(),s.dispose(),u.dispose(),_.dispose(),v.dispose(),y.dispose();for(let e of m)e.geo.dispose(),e.mat.dispose()}}}var Bn=1056,Vn=`
  precision highp float;

  uniform float uRadius;
  varying vec3 vNormalW;
  varying vec3 vLocalDir;
  varying vec3 vWorldPos;

  ${he}
  ${Z}

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
    ${X}
  }
`,Hn=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,Un=`
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
    ${X}
  }
`,Wn=`
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
`,Gn=`
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
    ${X}
  }
`,Kn=class extends S{shellRadius;constructor(e,t){super(e,!0,`centripetal`),this.shellRadius=t}getPoint(e,t=new d){return super.getPoint(e,t),t.setLength(this.shellRadius)}},qn=[{kind:`straight`,weight:1.7},{kind:`hairpin`,weight:.6,sign:1},{kind:`straight`,weight:1.3},{kind:`corner`,weight:.8,sign:-1},{kind:`chicane`,weight:.8,sign:1},{kind:`straight`,weight:1.6},{kind:`hairpin`,weight:.6,sign:-1},{kind:`straight`,weight:1.2},{kind:`corner`,weight:.8,sign:1},{kind:`straight`,weight:1.5}];function Jn(e){let t=e*1.02,n=e*.018,r=ge(Bn),i=qn.reduce((e,t)=>e+t.weight,0),a=r()*Math.PI*2,o=[];for(let e of qn){let t=e.weight/i*Math.PI*2,n=a+t/2,s=e.sign??1;if(e.kind===`straight`)o.push({theta:n+(r()-.5)*t*.3,lat:(r()-.5)*.24});else if(e.kind===`corner`){let e=.38+r()*.14;o.push({theta:n,lat:s*e})}else if(e.kind===`chicane`){let e=t*.26,i=.34+r()*.1;o.push({theta:n-e,lat:s*i}),o.push({theta:n+e,lat:-s*i})}else{let e=t*.38,i=.46+r()*.08;o.push({theta:n-e,lat:s*i*.6}),o.push({theta:n,lat:s*(i+.08)}),o.push({theta:n+e,lat:s*i*.6})}a+=t}let s=new Kn(o.map(({theta:e,lat:n})=>{let r=Math.PI/2-n;return new d(t*Math.sin(r)*Math.cos(e),t*Math.cos(r),t*Math.sin(r)*Math.sin(e))}),t),c=[];for(let e=0;e<256;e++)c.push(s.getPointAt(e/256,new d));let l=n*5.2,u=new d,f=new d;for(let e=0;e<80;e++){let e=!0,n=c.map(e=>e.clone());for(let r=0;r<256;r++){let i=n[(r-1+256)%256],a=n[r],o=n[(r+1)%256];u.subVectors(a,i),f.subVectors(o,a);let s=(u.length()+f.length())/2,d=u.normalize().angleTo(f.normalize());d<1e-5||s/d>=l||(e=!1,c[r].copy(i).add(o).multiplyScalar(.5).sub(a).multiplyScalar(.6).add(a).setLength(t))}if(e)break}for(let e=0;e<2;e++){let e=c.map(e=>e.clone());for(let n=0;n<256;n++){let r=e[(n-1+256)%256],i=e[n],a=e[(n+1)%256];c[n].copy(r).add(a).multiplyScalar(.5).sub(i).multiplyScalar(.25).add(i).setLength(t)}}let p=new Kn(c,t);return p.arcLengthDivisions=800,p}function Yn(e,t){let n=new f;n.name=`planet-idrive`;let[r,i]=t?[96,64]:[128,96],a=new G(e,r,i),o=new L({uniforms:{uRadius:{value:e}},vertexShader:ve,fragmentShader:Vn}),s=new x(a,o);n.add(s);let c=e*.018,l=Jn(e),u=new T(l,t?220:400,c,14,!0),p=new L({vertexShader:Hn,fragmentShader:Un}),m=new x(u,p);n.add(m);let h=xe(e,10133672,{power:3.2,intensity:.55});n.add(h.mesh);let _=t?16:28,v=ge(1057),b=e*.031,S=b*.5,C=b*.2,E=Array.from({length:_},(e,t)=>{let n=(t%2==0?-1:1)*(.55+v()*.45)*.4*c;return{t:v(),speed:.028+v()*.05,lane:n,lift:Math.sqrt(Math.max(c*c-n*n,0))+C*.5+c*.04}}),D=new re(S,C,b),O=new U({color:16777215,roughness:.45,metalness:.55,emissive:2364677,emissiveIntensity:.9}),k=new g(D,O,_);k.instanceMatrix.setUsage(y),k.frustumCulled=!1;let j=[12106948,4869720,10238770,3364477,12159534,4025167],N=new w;for(let e=0;e<_;e++)N.setHex(j[e%j.length]),k.setColorAt(e,N);n.add(k);let F=_*3,I=new Float32Array(F*3),R=new Float32Array(F*3),z=new Float32Array(F),B=new Float32Array(F),V=new Float32Array(F),ee=new w(16768160),te=new w(16777215),H=new w(16774880),ne=new w(16723224);for(let t=0;t<_;t++){let n=t*3;N.copy(ee).lerp(te,v()*.5),R.set([N.r,N.g,N.b],n*3),z[n]=e*(.1+v()*.05),B[n]=.9,V[n]=1,R.set([H.r,H.g,H.b],(n+1)*3),z[n+1]=b*.5,B[n+1]=1,V[n+1]=0,R.set([ne.r,ne.g,ne.b],(n+2)*3),z[n+2]=b*.55,B[n+2]=1,V[n+2]=0}let W=new M;W.setAttribute(`position`,new J(I,3)),W.setAttribute(`aColor`,new J(R,3)),W.setAttribute(`aSize`,new J(z,1)),W.setAttribute(`aAlpha`,new J(B,1)),W.setAttribute(`aFadeNear`,new J(V,1));let ie=new L({vertexShader:Wn,fragmentShader:Gn,transparent:!0,depthWrite:!1,blending:2}),K=new P(W,ie);K.frustumCulled=!1,K.renderOrder=3,n.add(K);let q=W.attributes.position,ae=new d,oe=new d,se=new d,ce=new d,le=new d,ue=new d,Y=new d,de=new A;function fe(e){let t=E[e];l.getPointAt(t.t,ae),l.getPointAt((t.t+.0015)%1,oe),se.copy(ae).normalize(),ce.subVectors(oe,ae),ce.addScaledVector(se,-ce.dot(se)).normalize(),le.crossVectors(se,ce),ue.copy(ae).addScaledVector(le,t.lane).addScaledVector(se,t.lift),de.makeBasis(le,se,ce),de.setPosition(ue),k.setMatrixAt(e,de);let n=e*3;q.setXYZ(n,ue.x,ue.y,ue.z),Y.copy(ue).addScaledVector(ce,b*.58),q.setXYZ(n+1,Y.x,Y.y,Y.z),Y.copy(ue).addScaledVector(ce,-b*.58),q.setXYZ(n+2,Y.x,Y.y,Y.z)}for(let e=0;e<_;e++)fe(e);return k.instanceMatrix.needsUpdate=!0,k.instanceColor&&(k.instanceColor.needsUpdate=!0),q.needsUpdate=!0,{group:n,update(e){s.rotation.y+=e*.01;for(let t=0;t<_;t++){let n=E[t];n.t=(n.t+n.speed*e)%1,fe(t)}k.instanceMatrix.needsUpdate=!0,q.needsUpdate=!0},dispose(){a.dispose(),o.dispose(),u.dispose(),p.dispose(),h.dispose(),k.dispose(),D.dispose(),O.dispose(),W.dispose(),ie.dispose()}}}var Xn=9001;function Zn(e){let t=1024,n=document.createElement(`canvas`);n.width=t,n.height=512;let r=n.getContext(`2d`);r.fillStyle=`#000000`,r.fillRect(0,0,t,512);let i=ge(e);for(let e=0;e<52;e++){let e=i()*t,n=i()*512;r.beginPath(),r.moveTo(e,n);let a=3+Math.floor(i()*5);for(let o=0;o<a;o++){let a=i()<.5,o=18+i()*65;a?e+=(i()<.5?-1:1)*o:n+=(i()<.5?-1:1)*o,e=Math.max(3,Math.min(t-3,e)),n=Math.max(3,Math.min(509,n)),r.lineTo(e,n)}r.lineWidth=1+i()*1.2,r.strokeStyle=`rgba(245, 165, 36, ${(.5+i()*.5).toFixed(2)})`,r.stroke(),r.fillStyle=`rgba(255, 200, 97, ${(.7+i()*.3).toFixed(2)})`;let o=2+i()*2;r.fillRect(e-o/2,n-o/2,o,o)}let a=new q(n);return a.colorSpace=H,a.wrapS=F,a.wrapT=ie,a.needsUpdate=!0,a}var Qn=`
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

  ${Z}

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
`,$n=`
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
    ${X}
  }
`;function er(e,t,n,r=1){let i=new f;i.name=`planet-agentic`;let a=Zn(Xn);a.anisotropy=r;let[o,s]=n?[96,64]:[128,96],c=new G(e,o,s),l=new U({color:1711140,metalness:1,roughness:.48,emissive:new w(_e.amber),emissiveMap:a,emissiveIntensity:1.6,envMapIntensity:.9});t&&(l.envMap=t),l.onBeforeCompile=t=>{t.uniforms.uRadius={value:e},t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>\nuniform float uRadius;\nvarying vec3 vDetailDir;\nvarying vec3 vDetailWorldPos;\n${Z}`).replace(`#include <color_fragment>`,`#include <color_fragment>
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
  vDetailWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`)};let u=new x(c,l);i.add(u);let p=xe(e,_e.amber,{power:2.9,intensity:.9});i.add(p.mesh);let m=n?8e3:17e3,h=e*2.3,g=e*.55,_=k.degToRad(25),v=ge(9008),y=new Float32Array(m),b=new Float32Array(m),S=new Float32Array(m),C=new Float32Array(m),T=new Float32Array(m*3),E=new Float32Array(m),D=new Float32Array(m),O=new w(_e.amberDeep),A=new w(_e.amber),N=new w(_e.amberBright),F=new w;for(let e=0;e<m;e++){y[e]=v()*Math.PI*2,b[e]=v()*Math.PI*2;let t=.55+v()**1.6*.45;S[e]=t,C[e]=.09+v()*.14;let n=k.clamp((t-.55)/.45,0,1);n>.6?F.copy(A).lerp(N,(n-.6)/.4):F.copy(O).lerp(A,n/.6),T[e*3]=F.r,T[e*3+1]=F.g,T[e*3+2]=F.b,E[e]=.85+v()*1.1,D[e]=.5+v()*.48}let I=new M;I.setAttribute(`aTheta0`,new J(y,1)),I.setAttribute(`aPhi`,new J(b,1)),I.setAttribute(`aTubeFrac`,new J(S,1)),I.setAttribute(`aSpeed`,new J(C,1)),I.setAttribute(`aColor`,new J(T,3)),I.setAttribute(`aSize`,new J(E,1)),I.setAttribute(`aAlpha`,new J(D,1)),I.setAttribute(`position`,new J(new Float32Array(m*3),3)),I.boundingSphere=new j(new d,h+g+6);let R=new L({uniforms:{uTime:{value:0},uMajorR:{value:h},uTubeR:{value:g},uJitterAmp:{value:e*.12},uBasePx:{value:2.6}},vertexShader:Qn,fragmentShader:$n,transparent:!0,depthWrite:!1,blending:2}),z=new P(I,R);return z.frustumCulled=!1,z.rotation.x=_,z.renderOrder=2,i.add(z),{group:i,update(e,t){u.rotation.y+=e*.012,R.uniforms.uTime.value=t},dispose(){c.dispose(),l.dispose(),a.dispose(),p.dispose(),I.dispose(),R.dispose()}}}var tr=7331,nr=3,rr=4,ir=10,ar=60,or=90,sr=240,cr=420,lr=.55,ur=1.5,dr=.7,fr=1.5,pr=16,mr=34,hr=2.6,gr=480,_r=680,vr=.4,yr=3.5,br=5.5,xr=70,Sr=5.5;function Cr(){let e=document.createElement(`canvas`);e.width=48,e.height=256;let t=e.getContext(`2d`);t.clearRect(0,0,48,256);let n=256*.13;t.globalCompositeOperation=`lighter`;for(let e=0;e<56;e++){let r=e/55,i=n+r*(256-n),a=(1-r)**2.4*.85,o=48*(.55+.45*(1-r));t.globalAlpha=a,t.fillStyle=`#ffffff`,t.fillRect(48/2-o/2,i,o,5.477142857142857)}t.globalAlpha=1;let r=t.createRadialGradient(48/2,n,0,48/2,n,48*.6);r.addColorStop(0,`rgba(255,255,255,1)`),r.addColorStop(.45,`rgba(255,255,255,0.85)`),r.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=r,t.fillRect(0,0,48,256),t.globalCompositeOperation=`source-over`;let i=new q(e);return i.needsUpdate=!0,i}function wr(){let e=ge(tr),t=new f;t.name=`meteor-field`;let n=Cr();function r(e){let r=new ae(new N({map:n,color:e?13627391:16777215,transparent:!0,opacity:0,depthWrite:!1,depthTest:!0,blending:2}));return r.visible=!1,r.renderOrder=4,t.add(r),{sprite:r,active:!1,age:0,life:1,startPos:new d,velocity:new d,length:pr,width:hr,isComet:e}}let i=Array.from({length:nr},()=>r(!1)),a=r(!0),o=rr+e()*(ir-rr),s=ar+e()*(or-ar),c=null,l=!1,u=new d,p=new d,m=new d;function h(t,n,r,i){i?(i.getWorldDirection(u),m.set(e()*2-1,e()*2-1,e()*2-1).multiplyScalar(.3),u.add(m)):u.set(e()*2-1,e()*2-1,e()*2-1),u.lengthSq()<1e-6&&u.set(0,1,0),u.normalize(),r.pos.copy(t).addScaledVector(u,n),m.set(e()*2-1,e()*2-1,e()*2-1).normalize(),p.crossVectors(u,m),p.lengthSq()<1e-6&&p.set(1,0,0),p.normalize(),r.dir.copy(p)}let g={pos:new d,dir:new d};function _(t,n){h(n,sr+e()*(cr-sr),g,c),c=null;let r=lr+e()*(ur-lr),i=dr+e()*(fr-dr),a=g.pos.distanceTo(n)*r;t.startPos.copy(g.pos),t.velocity.copy(g.dir).multiplyScalar(a/i),t.life=i,t.age=0,t.length=pr+e()*(mr-pr),t.width=hr*(.85+e()*.3),t.active=!0,t.sprite.visible=!0}function v(t){h(t,gr+e()*(_r-gr),g);let n=yr+e()*(br-yr),r=g.pos.distanceTo(t)*vr;a.startPos.copy(g.pos),a.velocity.copy(g.dir).multiplyScalar(r/n),a.life=n,a.age=0,a.length=xr,a.width=Sr,a.active=!0,a.sprite.visible=!0}let y=new d,b=new d,x=new d,S=new d;function C(e,t,n){if(!e.active)return;if(e.age+=t,e.age>=e.life){e.active=!1,e.sprite.visible=!1;return}S.copy(e.velocity).multiplyScalar(e.age),e.sprite.position.copy(e.startPos).add(S);let r=e.age/e.life,i=k.smoothstep(r,0,.12),a=1-k.smoothstep(r,.65,1),o=e.sprite.material;o.opacity=i*a*(e.isComet?.85:1),n.matrixWorld.extractBasis(y,b,x);let s=e.velocity.dot(y),c=e.velocity.dot(b);o.rotation=Math.atan2(-s,c),e.sprite.scale.set(e.width,e.length,1)}return{object:t,update(t,n){if(l&&(l=!1,c=n),o-=t,o<=0){o=rr+e()*(ir-rr);let t=i.find(e=>!e.active),r=i.filter(e=>e.active).length;t&&r<nr&&_(t,n.position)}c=null,s-=t,s<=0&&(s=ar+e()*(or-ar),a.active||v(n.position));for(let e of i)C(e,t,n);C(a,t,n)},debugForceSpawn(e=`meteor`){e===`comet`?s=-1:(o=-1,l=!0)},dispose(){n.dispose();for(let e of i)e.sprite.material.dispose();a.sprite.material.dispose()}}}var Tr={mint:[{orbitRadius:1.75,moonRadius:.11,orbitSpeed:.07,inclination:.28,phase:.4,color:9083562},{orbitRadius:2.35,moonRadius:.07,orbitSpeed:.045,inclination:-.18,phase:2.3,color:6978184}],plumm:[{orbitRadius:1.9,moonRadius:.09,orbitSpeed:.055,inclination:.42,phase:1.1,color:5917290}],idrive:[{orbitRadius:1.65,moonRadius:.08,orbitSpeed:.08,inclination:.22,phase:.6,color:10127472},{orbitRadius:2.25,moonRadius:.055,orbitSpeed:.038,inclination:-.35,phase:3.8,color:7825496}],agentic:[{orbitRadius:2,moonRadius:.1,orbitSpeed:.065,inclination:.32,phase:1.6,color:11176032},{orbitRadius:2.7,moonRadius:.065,orbitSpeed:.042,inclination:-.22,phase:4.2,color:8941664}]};function Er(e,t,n,r){let i=Tr[t],a=r?12:16,o=[],s=[],c=new d;for(let t of i){let r=new R;r.rotation.x=t.inclination,e.add(r);let i=n*t.moonRadius,c=new G(i,a,a),l=new U({color:t.color,roughness:.92,metalness:.04,emissive:new w(t.color).multiplyScalar(.04)}),u=new x(c,l);u.position.x=n*t.orbitRadius,r.add(u),o.push({pivot:r,mesh:u,speed:t.orbitSpeed,phase:t.phase,radius:i}),s.push({geo:c,mat:l})}return{update(e,t){for(let{pivot:e,speed:n,phase:r}of o)e.rotation.y=t*n+r},forEachCollider(e){for(let{mesh:t,radius:n}of o)t.getWorldPosition(c),e(c,n)},dispose(){for(let{geo:e,mat:t}of s)e.dispose(),t.dispose()}}}var Dr=`/v4/assets/tex/earth-day-2k.jpg`,Or=`/v4/assets/tex/city-lights-2k.jpg`;function kr(){let e=document.createElement(`canvas`);e.width=8,e.height=8;let t=e.getContext(`2d`);t&&(t.fillStyle=`#141820`,t.fillRect(0,0,8,8));let n=new q(e);return n.needsUpdate=!0,n}async function Ar(e,t){try{return await e.loadAsync(t)}catch{return kr()}}async function jr(e,t){let{manager:n,skyTex:r,envMap:i,lowPower:a,renderer:o}=t,s=Math.min(o.capabilities.getMaxAnisotropy(),8),c=new C(n),[l,u]=await Promise.all([Ar(c,Dr),Ar(c,Or)]);for(let e of[l,u])e.colorSpace=H,e.wrapS=F,e.wrapT=ie,e.generateMipmaps=!0,e.minFilter=v,e.anisotropy=s;let d=Nn(r,a);e.add(d.object);let f=wr();e.add(f.object);let p=new Map,m=[];for(let t of an){let n;switch(t.id){case`mint`:n=Ln(t.radius,l,a);break;case`plumm`:n=zn(t.radius,u,a);break;case`idrive`:n=Yn(t.radius,a);break;case`agentic`:n=er(t.radius,i,a,s);break;default:throw Error(`Unknown planet id: ${t.id}`)}n.group.position.copy(t.position),n.group.name=`planet-${t.id}`,e.add(n.group),p.set(t.id,n),m.push(Er(n.group,t.id,t.radius,a))}return{update(e,t,n){d.update(e,t,n);for(let n of p.values())n.update(e,t);for(let n of m)n.update(e,t);f.update(e,n)},debugForceMeteor(e){f.debugForceSpawn(e)},forEachMoonCollider(e){for(let t of m)t.forEachCollider(e)},dispose(){e.remove(d.object),d.dispose();for(let t of p.values())e.remove(t.group),t.dispose();p.clear();for(let e of m)e.dispose();m.length=0,e.remove(f.object),f.dispose(),l.dispose(),u.dispose()}}}var Mr=12e4,Nr=250,Pr=600,Fr=5,Ir=new d;function Lr(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function Rr(e){return 1-Lr(Nr,Pr,e)}function zr(e,t,n){Ir.copy(rn).sub(e);let r=Math.max(Ir.length(),Fr),i=Mr/(r*r)*Rr(r);Ir.normalize(),t.addScaledVector(Ir,i*n)}function Br(e){let t=Math.max(rn.distanceTo(e),Fr);return Mr/(t*t)*Rr(t)}var Vr=`v4-leaderboard`,Hr=10;function Ur(e){if(!e||typeof e!=`object`)return!1;let t=e;return typeof t.nick==`string`&&typeof t.ms==`number`&&typeof t.date==`string`}function Wr(){try{let e=window.localStorage.getItem(Vr);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(Ur):[]}catch{return[]}}function Gr(){return Wr().sort((e,t)=>e.ms-t.ms)}function Kr(e,t){let n=e.trim().slice(0,16)||`PILOT`,r=Wr();r.push({nick:n,ms:t,date:new Date().toISOString()}),r.sort((e,t)=>e.ms-t.ms);let i=r.slice(0,Hr);try{window.localStorage.setItem(Vr,JSON.stringify(i))}catch{}return i}var qr={mint:`Mint Apartments`,plumm:`Plumm`,idrive:`I DRIVE CARS`,agentic:`Agentic OS`};function Jr(e){let t=c(e);if(t.length>=2)return t.slice(0,2).map(e=>({src:e.srcSmall,alt:e.caption}));let n=qr[e];return[{src:`/projects/${e}/hero-card.webp`,alt:`${n} — podgląd interfejsu`},{src:`/projects/${e}/hero-full.webp`,alt:`${n} — drugi kadr interfejsu`}]}var Yr=[`Kapitanie — misja: znajdź nowoczesną stronę dla swojego biznesu. Cztery światy na orbicie czarnej dziury.`,`Nie trać czasu — minuta tak blisko horyzontu to godzina na Ziemi.`,`Ten statek… przypomina Ci coś? Zbieg okoliczności.`],Xr=5e3,Zr=25;function Qr(e,t,n){if(n)return e.textContent=t,()=>{};e.textContent=``;let r=0,i=0,a=()=>{r+=1,e.textContent=t.slice(0,r),r<t.length&&(i=window.setTimeout(a,Zr))};return i=window.setTimeout(a,Zr),()=>window.clearTimeout(i)}function $r(e,t){let n=document.createElement(`div`);n.className=`v4-comm`,n.innerHTML=`
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
  `,e.appendChild(n);let r=n.querySelector(`.v4-comm__panel`),i=n.querySelector(`.v4-comm__icon`),a=n.querySelector(`.v4-comm__collapse`),o=Array.from(n.querySelectorAll(`.v4-comm__line`)),s=n.querySelector(`.v4-comm__board`),c=n.querySelector(`.v4-comm__board-list`),l=n.querySelector(`.v4-comm__wave`),u=!1,d=[],f=[],p=0;function m(){for(let e of d)window.clearTimeout(e);for(let e of f)e();d=[],f=[]}function h(){Yr.forEach((e,n)=>{let r=window.setTimeout(()=>{f.push(Qr(o[n],e,t.reducedMotion))},n*Xr);d.push(r)})}function g(){let e=Gr().slice(0,3);if(e.length===0){s.hidden=!0;return}s.hidden=!1,c.innerHTML=e.map((e,t)=>`<li><span>${t+1}.</span><span>${un(e.nick)}</span><span>${on(e.ms)}</span></li>`).join(``)}function _(e){let t=l.getContext(`2d`);if(!t)return;let n=l.width/8;t.clearRect(0,0,l.width,l.height),t.fillStyle=`#f5a524`;for(let r=0;r<8;r++){let i=l.height*(.22+.58*Math.abs(Math.sin(e+r*.7)));t.fillRect(r*n+1,l.height-i,n-2,i)}}function v(){if(t.reducedMotion){_(.6);return}let e=0,n=()=>{e+=.12,_(e),p=requestAnimationFrame(n)};n()}function y(){u=!1,r.classList.remove(`is-collapsed`),i.hidden=!0}function b(){u=!0,r.classList.add(`is-collapsed`),i.hidden=!1}r.addEventListener(`click`,e=>{e.target.closest(`.v4-comm__collapse`)||b()}),a.addEventListener(`click`,e=>{e.stopPropagation(),b()}),i.addEventListener(`click`,y);let x=e=>{e.code===`Enter`&&!u&&b()};return window.addEventListener(`keydown`,x),g(),h(),v(),t.startCollapsed&&b(),{dismiss(){u||b()},restart(){m();for(let e of o)e.textContent=``;y(),g(),h()},dispose(){m(),cancelAnimationFrame(p),window.removeEventListener(`keydown`,x),n.remove()}}}var ei=`${`https://marcinbochenek.com`.replace(/\/$/,``)}/#realizacje`;function ti(e){let t=document.createElement(`div`);t.className=`v4-project-panel`,t.setAttribute(`aria-hidden`,`true`),t.inert=!0,t.innerHTML=`
    <button type="button" class="v4-project-panel__close" aria-label="Zamknij panel projektu">&times;</button>
    <p class="v4-project-panel__eyebrow"></p>
    <h2 class="v4-project-panel__title"></h2>
    <p class="v4-project-panel__desc"></p>
    <div class="v4-project-panel__shots"></div>
    <div class="v4-project-panel__stack"></div>
    <div class="v4-project-panel__links">
      <a class="v4-project-panel__live" href="#" target="_blank" rel="noopener" hidden>Strona na żywo &rarr;</a>
      <span class="v4-project-panel__status" hidden></span>
      <a class="v4-project-panel__case" href="${ei}" target="_blank" rel="noopener">Case study &rarr;</a>
    </div>
  `,e.appendChild(t);let n=t.querySelector(`.v4-project-panel__close`),r=t.querySelector(`.v4-project-panel__eyebrow`),i=t.querySelector(`.v4-project-panel__title`),a=t.querySelector(`.v4-project-panel__desc`),o=t.querySelector(`.v4-project-panel__shots`),s=t.querySelector(`.v4-project-panel__stack`),c=t.querySelector(`.v4-project-panel__live`),l=t.querySelector(`.v4-project-panel__status`);function u(){t.classList.remove(`is-open`),t.setAttribute(`aria-hidden`,`true`),t.inert=!0,document.documentElement.classList.remove(`v4-panel-open`)}return n.addEventListener(`click`,u),{show(e,n){r.textContent=e.tagline,i.textContent=e.title,a.textContent=cn(e.description,3),o.innerHTML=``;for(let e of n){let t=document.createElement(`img`);t.className=`v4-project-panel__shot`,t.src=e.src,t.alt=e.alt,t.loading=`lazy`,o.appendChild(t)}s.innerHTML=``;for(let t of e.stack??[]){let e=document.createElement(`span`);e.className=`v4-project-panel__chip`,e.textContent=t,s.appendChild(e)}dn(e.url)&&e.id!==`idrive`&&e.id!==`agentic`?(c.href=e.url,c.hidden=!1,l.hidden=!0):(c.hidden=!0,c.removeAttribute(`href`),l.hidden=!1,l.textContent=e.domain),t.classList.add(`is-open`),t.setAttribute(`aria-hidden`,`false`),t.inert=!1,document.documentElement.classList.add(`v4-panel-open`)},hide:u,dispose(){t.remove()}}}var ni=2500;function ri(e){let t=document.createElement(`div`);t.className=`v4-toast`,t.setAttribute(`aria-live`,`polite`),t.setAttribute(`aria-hidden`,`true`),e.appendChild(t);let n=0;return{show(e){t.textContent=`ODKRYTO: ${e.toUpperCase()}`,t.classList.remove(`is-visible`),t.offsetWidth,t.classList.add(`is-visible`),t.setAttribute(`aria-hidden`,`false`),window.clearTimeout(n),n=window.setTimeout(()=>{t.classList.remove(`is-visible`),t.setAttribute(`aria-hidden`,`true`)},ni)},dispose(){window.clearTimeout(n),t.remove()}}}var ii=600;function ai(e,t){let n=document.createElement(`div`);n.className=`v4-horizon-flash`,e.appendChild(n);let r=document.createElement(`div`);r.className=`v4-overlay v4-overlay--gameover`,r.setAttribute(`aria-hidden`,`true`),r.inert=!0,r.innerHTML=`
    <div class="v4-overlay__card">
      <p class="v4-overlay__eyebrow">Misja przerwana</p>
      <h1 class="v4-overlay__title" id="v4-gameover-title">Przekroczono horyzont zdarzeń</h1>
      <p class="v4-overlay__lead">Z tej odległości nie ucieka nawet światło. Misja zaczyna się od nowa.</p>
      <button type="button" class="v4-overlay__button">Restart misji <span class="v4-overlay__hint">[R]</span></button>
    </div>
  `,e.appendChild(r);let i=r.querySelector(`.v4-overlay__button`);i.addEventListener(`click`,()=>t.onRestart());let a=0;function o(){r.setAttribute(`role`,`dialog`),r.setAttribute(`aria-modal`,`true`),r.setAttribute(`aria-labelledby`,`v4-gameover-title`),r.classList.add(`is-visible`),r.setAttribute(`aria-hidden`,`false`),r.inert=!1,i.focus({preventScroll:!0})}function s(){window.clearTimeout(a),r.classList.remove(`is-visible`),r.removeAttribute(`role`),r.removeAttribute(`aria-modal`),r.setAttribute(`aria-hidden`,`true`),r.inert=!0,n.classList.remove(`is-active`)}return{trigger(){if(t.reducedMotion){o();return}n.classList.remove(`is-active`),n.offsetWidth,n.classList.add(`is-active`),window.clearTimeout(a),a=window.setTimeout(o,ii)},reset(){s()},dispose(){window.clearTimeout(a),r.remove(),n.remove()}}}function oi(e,t){let n=document.createElement(`div`);n.className=`v4-overlay v4-overlay--completion`,n.setAttribute(`aria-hidden`,`true`),n.inert=!0,n.innerHTML=`
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
  `,e.appendChild(n);let r=n.querySelector(`.v4-overlay__time-value`),i=n.querySelector(`.v4-overlay__dilation`),a=n.querySelector(`.v4-overlay__save`),o=n.querySelector(`.v4-overlay__nick`),s=n.querySelector(`.v4-overlay__button`),c=n.querySelector(`tbody`),l=n.querySelector(`.v4-overlay__restart`),u=e=>e.stopPropagation();o.addEventListener(`keydown`,u),o.addEventListener(`keyup`,u),a.addEventListener(`submit`,e=>{e.preventDefault(),!s.disabled&&(t.onSave(o.value),s.disabled=!0,o.disabled=!0,s.textContent=`Zapisano`)}),l.addEventListener(`click`,()=>t.onRestart());function d(e){c.innerHTML=e.slice(0,10).map((e,t)=>`<tr><td>${t+1}</td><td>${un(e.nick)}</td><td>${on(e.ms)}</td><td>${sn(e.date)}</td></tr>`).join(``)}return{show(e,t){r.textContent=on(e);let a=Math.round(e/1e3);i.textContent=`Na Ziemi minęło w tym czasie: ${Math.floor(a/60)}h ${a%60}min`,o.value=``,o.disabled=!1,s.disabled=!1,s.textContent=`Zapisz wynik`,d(t),n.setAttribute(`role`,`dialog`),n.setAttribute(`aria-labelledby`,`v4-completion-title`),n.classList.add(`is-visible`),n.setAttribute(`aria-hidden`,`false`),n.inert=!1,o.focus({preventScroll:!0})},updateBoard(e){d(e)},reset(){n.classList.remove(`is-visible`),n.removeAttribute(`role`),n.setAttribute(`aria-hidden`,`true`),n.inert=!0},dispose(){o.removeEventListener(`keydown`,u),o.removeEventListener(`keyup`,u),n.remove()}}}var $=n(),si=new d(158,-70,534),ci=(()=>{let e=si.clone().normalize(),t=new d().crossVectors(new d(0,1,0),e).normalize(),n=e.clone().negate(),r=t.clone().multiplyScalar(.42).addScaledVector(n,.58);r.y=0,r.normalize();let i=new R;return i.up.set(0,1,0),i.lookAt(r),i.quaternion.clone()})();function li(){if(typeof navigator>`u`)return!1;let e=navigator.hardwareConcurrency??8,t=navigator.deviceMemory;return e<=4||t!==void 0&&t<=4}function ui(){let e=(0,Ce.useRef)(null),t=(0,Ce.useRef)(null),n=(0,Ce.useRef)(null),r=(0,Ce.useRef)(null),i=(0,Ce.useRef)(null),a=(0,Ce.useRef)(null);return(0,Ce.useEffect)(()=>{let s=!1,c=null,l=null,u=null,f=null,p=null,m=null,h=null,g=null,v=null,y=null,b=null,x=null,S=null,C=null;async function w(){let w=e.current,T=t.current,E=n.current;if(!w||!T||!E)return;T.tabIndex=0,T.setAttribute(`aria-label`,`Pole lotu — sterowanie statkiem`),T.focus({preventScroll:!0});let D=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,O=li(),k=new _;k.onProgress=(e,t,n)=>{let r=n>0?Math.round(t/n*100):0;a.current&&(a.current.style.width=`${r}%`),i.current&&(i.current.textContent=`WCZYTYWANIE MISJI… ${r}%`)},k.onError=e=>{e.includes(`normandy-sr2-joshuas-cc0.glb`)||console.error(`[v4] failed to load asset:`,e)};let A=await it(T,{lowPower:O,reducedMotion:D,manager:k});if(s){A.dispose();return}c=A;let j=await be(k,A.envMap);if(s){j.dispose(),A.dispose();return}l=j,A.scene.add(j.group);let M=await jr(A.scene,{manager:k,skyTex:A.skyTex,envMap:A.envMap,lowPower:O,renderer:A.renderer});if(s){M.dispose(),j.dispose(),A.dispose();return}u=M;let N=zt(w);p=N;let P=Pt(si,N.input);P.state.quaternion.copy(ci),f=P;let F=nn(A.camera),I=hn(E,{touchActive:N.active});m=I,h=$r(E,{reducedMotion:D,startCollapsed:N.active}),g=ti(E),v=ri(E);let L=null,R=0,z=!1,B=!1,ee=!1,te=new Set,H=null,ne=!1;function U(){P.state.position.copy(si),P.state.velocity.set(0,0,0),P.state.angularVelocity.set(0,0,0),P.state.bankAngle=0,P.state.quaternion.copy(ci),P.state.thrustLevel=0,P.state.brakeLevel=0,P.state.speed=0,P.state.hasThrusted=!1,ne=!1,L=null,R=0,z=!1,B=!1,ee=!1,te.clear(),H=null,g?.hide(),y?.reset(),b?.reset(),h?.restart(),I.reset()}y=ai(E,{reducedMotion:D,onRestart:()=>U()});let W=oi(E,{onRestart:()=>U(),onSave:e=>{let t=Kr(e,R);W.updateBoard(t)}});b=W,C=e=>{e.code===`KeyR`&&(ee||B)&&U()},window.addEventListener(`keydown`,C),S=()=>{A.setSize(w.clientWidth,w.clientHeight)},window.addEventListener(`resize`,S),S();let re=!1,G=new d,ie=new d;new URLSearchParams(window.location.search).has(`debug`)&&(window.__v4={teleport(e,t){re=!0,G.set(e[0],e[1],e[2]),ie.set(t[0],t[1],t[2]),P.state.position.set(e[0],e[1],e[2]),P.state.velocity.set(0,0,0),P.state.angularVelocity.set(0,0,0)},spawnMeteor(e){M.debugForceMeteor(e)},getShipPos(){let e=P.state.position;return[e.x,e.y,e.z]},haltShip(){P.state.velocity.set(0,0,0),P.state.angularVelocity.set(0,0,0)},getHullSource(){return j.group.userData.hullSource??`unknown`},setShipVisible(e){j.group.visible=e},getChaseInfo(){let e=A.camera.position.clone().sub(j.group.position),t=new d(0,1,0).applyQuaternion(j.group.quaternion),n=new d(0,0,-1).applyQuaternion(j.group.quaternion);return{heightDot:e.dot(t),backDot:-e.dot(n),dist:e.length(),upDot:t.dot(new d(0,1,0))}}});let K=new d,q=new V,J=new d(0,0,1);x=A.onTick((e,t)=>{let n=!ee;if(n){P.state.hasThrusted&&zr(P.state.position,P.state.velocity,e),P.update(e),!P.state.hasThrusted&&!re&&(P.state.position.copy(si),P.state.velocity.set(0,0,0),P.state.angularVelocity.set(0,0,0),P.state.quaternion.copy(ci),P.state.bankAngle=0),j.group.position.copy(P.state.position),q.setFromAxisAngle(J,P.state.bankAngle),j.group.quaternion.copy(P.state.quaternion).multiply(q),j.updateThrust(P.state.thrustLevel,t),P.state.hasThrusted&&!ne&&(ne=!0,z||(z=!0,L=t),h?.dismiss()),z&&L!==null&&(R=(t-L)*1e3),P.state.position.distanceTo(rn)<108&&(ee=!0,P.state.velocity.set(0,0,0),P.state.angularVelocity.set(0,0,0),y?.trigger());for(let e of an){let t=P.state.position.distanceTo(e.position),n=e.radius*2.5,r=e.radius*3.5;if(t<n&&H!==e.id){H=e.id;let t=o.find(t=>t.id===e.id);t&&(te.has(e.id)||(te.add(e.id),v?.show(t.title),te.size===an.length&&!B&&(B=!0,z=!1,b?.show(R,Gr()))),g?.show(t,Jr(e.id)))}else H===e.id&&t>r&&(H=null,g?.hide())}for(let e of an){K.copy(P.state.position).sub(e.position);let t=e.radius*1.12+2,n=K.length();if(n<t&&n>1e-4){K.multiplyScalar(1/n),P.state.position.copy(e.position).addScaledVector(K,t);let r=P.state.velocity.dot(K);r<0&&P.state.velocity.addScaledVector(K,-r)}}M.forEachMoonCollider((e,t)=>{K.copy(P.state.position).sub(e);let n=t*1.2+1.4,r=K.length();if(r<n&&r>1e-4){K.multiplyScalar(1/r),P.state.position.copy(e).addScaledVector(K,n);let t=P.state.velocity.dot(K);t<0&&P.state.velocity.addScaledVector(K,-t)}})}re?(A.camera.position.copy(G),A.camera.lookAt(ie)):n&&F.update(e,P.state.position,P.state.quaternion,P.state.thrustLevel,P.state.bankAngle,P.state.angularVelocity),A.dust.update(A.camera.position,P.state.velocity),M.update(e,t,A.camera),I.update({speed:P.state.speed,thrust:P.state.thrustLevel,hasThrusted:P.state.hasThrusted,missionMs:R,discovered:te,gravityAccel:n?Br(P.state.position):0})}),A.start(),r.current&&(r.current.classList.add(`is-hidden`),r.current.setAttribute(`aria-busy`,`false`),r.current.setAttribute(`aria-hidden`,`true`))}return w().catch(e=>{console.error(`[v4] init failed`,e);let t=r.current;t&&(t.classList.add(`is-error`),t.setAttribute(`aria-busy`,`false`)),i.current&&(i.current.textContent=`Nie udało się wczytać misji. Odśwież stronę.`)}),()=>{s=!0,S&&window.removeEventListener(`resize`,S),C&&window.removeEventListener(`keydown`,C),x?.(),delete window.__v4,b?.dispose(),y?.dispose(),v?.dispose(),g?.dispose(),h?.dispose(),m?.dispose(),f?.dispose(),p?.dispose(),u?.dispose(),l?.dispose(),c?.stop(),c?.dispose()}},[]),(0,$.jsxs)(`div`,{className:`v4-root`,ref:e,children:[(0,$.jsx)(`canvas`,{className:`v4-canvas`,ref:t}),(0,$.jsx)(`div`,{className:`v4-hud-container`,ref:n}),(0,$.jsxs)(`div`,{className:`v4-loading`,ref:r,"aria-live":`polite`,"aria-busy":`true`,role:`status`,children:[(0,$.jsx)(`div`,{className:`v4-loading__label`,ref:i,children:`WCZYTYWANIE MISJI… 0%`}),(0,$.jsx)(`div`,{className:`v4-loading__bar`,children:(0,$.jsx)(`div`,{className:`v4-loading__bar-fill`,ref:a})})]})]})}var di=s.portfolioUrl.replace(/\/$/,``),fi=`${di}/#realizacje`;function pi(){let{locale:e}=i(),t=a(e).v4Fallback;return(0,$.jsx)(`div`,{className:`v4-fallback`,children:(0,$.jsxs)(`div`,{className:`v4-fallback__card`,children:[(0,$.jsx)(`p`,{className:`v4-fallback__eyebrow`,children:t.eyebrow}),(0,$.jsx)(`h1`,{className:`v4-fallback__title`,children:t.title}),(0,$.jsx)(`p`,{className:`v4-fallback__lead`,children:t.lead}),(0,$.jsx)(`div`,{className:`v4-fallback__list`,children:o.map(e=>(0,$.jsxs)(`a`,{className:`v4-fallback__item`,href:dn(e.url)?e.url:fi,target:`_blank`,rel:`noopener noreferrer`,children:[(0,$.jsx)(`span`,{className:`v4-fallback__item-title`,children:e.title}),(0,$.jsx)(`span`,{className:`v4-fallback__item-tagline`,children:e.tagline})]},e.id))}),(0,$.jsxs)(`div`,{className:`v4-fallback__actions`,children:[(0,$.jsx)(`a`,{className:`v4-fallback__cta`,href:fi,children:t.seeWork}),(0,$.jsx)(`a`,{className:`v4-fallback__back`,href:di,children:t.back})]}),(0,$.jsxs)(`p`,{className:`v4-fallback__hint`,children:[t.hintBefore,(0,$.jsx)(`a`,{href:s.gameUrl,rel:`noopener`,children:s.gameUrl.replace(/^https?:\/\//,``)}),t.hintAfter]})]})})}function mi(){if(typeof window>`u`)return!1;try{return!!document.createElement(`canvas`).getContext(`webgl2`)}catch{return!1}}function hi(){let[e]=(0,Ce.useState)(mi);return e?(0,$.jsx)(ui,{}):(0,$.jsx)(pi,{})}(0,Se.createRoot)(document.getElementById(`root`)).render((0,$.jsx)(r,{children:(0,$.jsx)(hi,{})}));