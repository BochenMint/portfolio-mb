import{n as e,r as t,t as n}from"./jsx-runtime-i9uBjpvk.js";import{n as r,o as i,r as a}from"./i18n-C1tP8KwJ.js";/* empty css            */import{d as o,g as s}from"./live-C7cvPOC7.js";import{t as c}from"./gallery-jI0pM9Zk.js";import{$ as l,C as u,D as d,Dt as f,E as p,Et as m,G as h,H as g,I as _,J as v,K as y,M as b,Mt as x,P as S,Q as C,S as w,St as T,Tt as E,U as D,W as O,X as ee,_t as k,b as A,bt as j,ct as M,dt as N,et as P,gt as F,h as I,ht as L,jt as R,l as z,lt as te,mt as ne,ot as B,pt as V,q as H,rt as re,tt as U,u as ie,ut as ae,v as oe,w as W,wt as se,x as G,xt as ce,y as le,yt as K}from"./three-D_yaIDXV.js";import{a as q,c as J,d as Y,i as X,n as ue,o as de,p as fe,r as pe}from"./build-CpKn-nqD.js";import{r as me}from"./heroSceneTypes-BBcQTCIc.js";import{a as he,c as ge,d as _e,i as ve,l as ye,o as be,r as xe,s as Se,t as Ce,u as we}from"./buildShipV2-DwCla6By.js";var Te=e(),Ee=t(),De=180,Oe=De/2,ke=2600,Ae=1200,je=900,Me=400,Ne=12,Pe=60,Fe=.5,Ie=70,Le=.1,Re=.35;function ze(){let e=document.createElement(`canvas`);e.width=e.height=32;let t=e.getContext(`2d`),n=t.createRadialGradient(16,16,0,16,16,16);return n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.5,`rgba(255,255,255,0.5)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,32,32),new u(e)}function Be(e,t){let n=e-t;for(;n>Oe;)n-=De;for(;n<-90;)n+=De;return t+n}var Ve=`
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
`;function Ue(e){let t=e?Ae:ke,n=e?Me:je,r=ze(),i=new Float32Array(t*3),a=new Float32Array(t),o=new Float32Array(t*3);for(let e=0;e<t;e++){let t=e*3;i[t+0]=(Math.random()-.5)*De,i[t+1]=(Math.random()-.5)*De,i[t+2]=(Math.random()-.5)*De,a[e]=.1+Math.random()*.25;let n=Math.random();n<.04?(o[t+0]=.72,o[t+1]=.83,o[t+2]=1):n<.08?(o[t+0]=1,o[t+1]=.9,o[t+2]=.74):(o[t+0]=1,o[t+1]=1,o[t+2]=1)}let s=new w;s.setAttribute(`position`,new G(i,3)),s.setAttribute(`aSize`,new G(a,1)),s.setAttribute(`aTint`,new G(o,3));let c=new k({uniforms:{uMap:{value:r},uOpacity:{value:Le},uSizeMul:{value:260}},vertexShader:Ve,fragmentShader:He,transparent:!0,depthWrite:!1,depthTest:!0,blending:2}),l=new ae(s,c);l.frustumCulled=!1,l.renderOrder=2;let u=new Float32Array(n*3);for(let e=0;e<n;e++){let t=e*3;u[t+0]=(Math.random()-.5)*De,u[t+1]=(Math.random()-.5)*De,u[t+2]=(Math.random()-.5)*De}let d=new Float32Array(n*2*3),f=new w,p=new G(d,3);p.setUsage(S),f.setAttribute(`position`,p);let m=new h({color:13623551,transparent:!0,opacity:0,depthWrite:!1,blending:2}),_=new y(f,m);_.frustumCulled=!1,_.renderOrder=2;let v=new g;return v.name=`dust-field`,v.add(l),v.add(_),{object:v,update(e,r){for(let n=0;n<t;n++){let t=n*3;i[t+0]=Be(i[t+0],e.x),i[t+1]=Be(i[t+1],e.y),i[t+2]=Be(i[t+2],e.z)}s.attributes.position.needsUpdate=!0;let a=r.length(),o=C.clamp(a/Ie,0,1);c.uniforms.uOpacity.value=C.lerp(Le,Re,o);let l=0,p=0,h=-1;if(a>1e-4){let e=1/a;l=r.x*e,p=r.y*e,h=r.z*e}let g=C.clamp(a*.06,.3,4.5);for(let t=0;t<n;t++){let n=t*3;u[n+0]=Be(u[n+0],e.x),u[n+1]=Be(u[n+1],e.y),u[n+2]=Be(u[n+2],e.z);let r=u[n+0],i=u[n+1],a=u[n+2],o=t*6;d[o+0]=r,d[o+1]=i,d[o+2]=a,d[o+3]=r-l*g,d[o+4]=i-p*g,d[o+5]=a-h*g}f.attributes.position.needsUpdate=!0,m.opacity=C.clamp((a-Ne)/(Pe-Ne),0,1)*Fe},dispose(){s.dispose(),c.dispose(),f.dispose(),m.dispose(),r.dispose()}}}var We=1500,Ge=1600,Ke=20260712,qe=`
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
`;function Ye(e){let t=e?800:We,n=_e(Ke),r=new Float32Array(t*3),i=new Float32Array(t),a=new Float32Array(t),o=new Float32Array(t),s=new Float32Array(t*3),c=new d(16777215),l=new d(12571903),u=new d(16769208),f=new d;for(let e=0;e<t;e++){let t,d,p,m;do t=n()*2-1,d=n()*2-1,p=n()*2-1,m=t*t+d*d+p*p;while(m<.01||m>1);let h=Ge/Math.sqrt(m);r[e*3]=t*h,r[e*3+1]=d*h,r[e*3+2]=p*h,i[e]=n()*Math.PI*2,a[e]=.5+n()*2.2,o[e]=.5+n()**2.4*1.9;let g=n();g<.12?f.copy(l):g<.2?f.copy(u):f.copy(c),f.multiplyScalar(.55+n()*.45),s[e*3]=f.r,s[e*3+1]=f.g,s[e*3+2]=f.b}let p=new w;p.setAttribute(`position`,new G(r,3)),p.setAttribute(`aPhase`,new G(i,1)),p.setAttribute(`aSpeed`,new G(a,1)),p.setAttribute(`aSize`,new G(o,1)),p.setAttribute(`aColor`,new G(s,3)),p.boundingSphere=new K(new x,1601);let m=new k({uniforms:{uTime:{value:0}},vertexShader:qe,fragmentShader:Je,transparent:!0,depthWrite:!1,depthTest:!0,blending:2}),h=new ae(p,m);return h.frustumCulled=!1,h.renderOrder=0,h.name=`starfield-twinkle`,{object:h,update(e,t,n){h.position.copy(e),h.rotation.y=n,m.uniforms.uTime.value=t},dispose(){p.dispose(),m.dispose()}}}var Xe=`/v4/assets/skybox-8k.jpg`,Ze=`/v4/assets/skybox-4k.jpg`,Qe=`/v4/assets/skybox-2k.jpg`;function $e(){return typeof navigator>`u`?!1:!!navigator.connection?.saveData}function et(){return typeof navigator>`u`?!1:navigator.userAgentData?.mobile===!0?!0:/iPhone|iPod|Android.+Mobile/i.test(navigator.userAgent)}function tt(e,t){return t?[Qe]:e>=8192?[Xe,Ze,Qe]:e>=4096?(console.warn(`[v4] GPU maxTextureSize=${e} < 8192; sky fallback ${Ze}`),[Ze,Qe]):(console.warn(`[v4] GPU maxTextureSize=${e} < 4096; sky fallback ${Qe}`),[Qe])}async function nt(e,t){let n;for(let r of t)try{return{texture:await e.loadAsync(r),url:r}}catch(e){n=e,console.error(`[v4] sky texture failed to load: ${r}`,e)}throw n instanceof Error?n:Error(`[v4] sky texture failed to load: ${t.join(` → `)}`)}function rt(e){e.mapping=303,e.colorSpace=L,e.generateMipmaps=!1,e.minFilter=H,e.magFilter=H,e.wrapS=V,e.wrapT=p,e.anisotropy=1,e.needsUpdate=!0}var it=4500,at=`
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
`;function st(e){let t=new j(it,64,40),n=new k({uniforms:{uSky:{value:e},uSkyRot:{value:0}},vertexShader:at,fragmentShader:ot,side:1,depthWrite:!1,depthTest:!1}),r=new P(t,n);return r.frustumCulled=!1,r.renderOrder=-2,r.name=`sky-dome`,{mesh:r,setYaw(e){n.uniforms.uSkyRot.value=e},dispose(){t.dispose(),n.dispose()}}}async function ct(e,t){let{lowPower:n,manager:r,reducedMotion:i}=t,a=typeof location<`u`&&new URLSearchParams(location.search).has(`debug`),o=new ie({canvas:e,antialias:!n,alpha:!1,powerPreference:n?`default`:`high-performance`,preserveDrawingBuffer:a});o.setPixelRatio(me(n)),o.setClearColor(0,1),o.toneMapping=4,o.toneMappingExposure=1.18,o.outputColorSpace=L;let s=new F,c=new M(60,1,.8,6e3);c.position.set(0,4,16);let l=new te(13688042,250,120,2);c.add(l),s.add(c);let u=new se(r),d=n||$e()||et(),f=tt(o.capabilities.maxTextureSize,d),p=f[0]===Qe?Promise.resolve(null):u.loadAsync(Qe).catch(e=>(console.error(`[v4] env sky texture failed to load: ${Qe}`,e),null)),[{texture:m,url:h},g]=await Promise.all([nt(u,f),p]);rt(m);let _=st(m);s.add(_.mesh);let v=g??m;g&&(g.mapping=303,g.colorSpace=L);let y=new z(o);y.compileEquirectangularShader();let x=y.fromEquirectangular(v);s.environment=x.texture;let S=x.texture;if(g?.dispose(),a){let e=m.image;window.__v4Sky={url:h,imageWidth:e?.width??0,imageHeight:e?.height??0,generateMipmaps:m.generateMipmaps,minFilter:m.minFilter,magFilter:m.magFilter,wrapS:m.wrapS,colorSpace:m.colorSpace,anisotropy:m.anisotropy,maxTextureSize:o.capabilities.maxTextureSize,constrained:d}}s.add(new D(9085128,658448,.55));let C=new b(16773596,1.65);C.position.set(600,400,250),s.add(C);let w=new b(11847396,.95);w.position.set(-420,260,-380),s.add(w);let T=new te(16760944,130,520,1.7);T.position.set(0,0,0),s.add(T);let O=Ue(n);s.add(O.object);let ee=Ye(n);s.add(ee.object);let k=new q(o,{multisampling:n?0:4});k.addPass(new Y(s,c));let A=new ue({intensity:i?.1:n?.12:.16,luminanceThreshold:.985,luminanceSmoothing:.06,mipmapBlur:!0}),j=new fe({offset:.52,darkness:.22}),N=[A,new pe({contrast:.02,brightness:0}),new J({saturation:-.02}),j];if(!n&&!i){let e=new X({offset:new R(9e-4,9e-4),radialModulation:!0,modulationOffset:.15});N.splice(1,0,e)}k.addPass(new de(c,...N));let I=new E;a||I.connect(document);let ne=new Set,B=0,V=!1,H=e=>a&&document.hidden?setTimeout(()=>e(performance.now()),16):requestAnimationFrame(e),re=e=>{if(!V)return;I.update(e);let t=Math.min(.05,I.getDelta()),n=I.getElapsed();for(let e of ne)e(t,n);let r=n*Se;_.setYaw(r),ee.update(c.position,n,r),k.render(t),B=H(re)};return{renderer:o,scene:s,camera:c,composer:k,dust:O,envMap:S,skyTex:m,setSize(e,t){e<2||t<2||(o.setSize(e,t,!1),k.setSize(e,t),c.aspect=e/Math.max(t,1),c.updateProjectionMatrix())},onTick(e){return ne.add(e),()=>ne.delete(e)},start(){V||(V=!0,I.reset(),B=H(re))},stop(){V=!1,clearTimeout(B),cancelAnimationFrame(B)},dispose(){V=!1,clearTimeout(B),cancelAnimationFrame(B),I.dispose(),ne.clear(),O.dispose(),ee.dispose(),_.dispose(),s.traverse(e=>{if(e instanceof P){let t=Array.isArray(e.material)?e.material:[e.material];for(let e of t)e?.dispose()}}),x.dispose(),y.dispose(),m.dispose(),k.dispose(),o.dispose(),o.getContext().getExtension(`WEBGL_lose_context`)?.loseContext()}}}var lt=22,ut=lt/5;lt*.42,ut*.42,lt*.16,new d(5093631),new d(10475775),new d(15398655),new d(3787263),`${xe}${ye}`;var dt=new x(1,0,0),ft=new x(0,1,0),pt=Math.PI/180,mt=1.9,ht=6.5,gt=8,_t=1.15,vt=7,yt=9,bt=52*pt,xt=20*pt,St=5,Ct=.1,wt=30,Tt=.999,Et=92,Dt=4.2,Ot=2.4,kt=new Set([`Space`]),At=new Set([`ShiftLeft`,`ShiftRight`]),jt=new Set([`KeyW`,`ArrowUp`]),Mt=new Set([`KeyS`,`ArrowDown`]),Nt=new Set([`KeyA`,`ArrowLeft`]),Pt=new Set([`KeyD`,`ArrowRight`]),Ft=new Set([`KeyQ`]),It=new Set([`KeyE`]),Lt=new Set([`Space`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`]);function Rt(e,t){let n=new Set,r={position:e.clone(),quaternion:new N,velocity:new x,angularVelocity:new x,bankAngle:0,thrustLevel:0,brakeLevel:0,speed:0,hasThrusted:!1},i=e=>{n.add(e.code),Lt.has(e.code)&&e.preventDefault()},a=e=>{n.delete(e.code)},o=()=>n.clear();window.addEventListener(`keydown`,i,{passive:!1}),window.addEventListener(`keyup`,a),window.addEventListener(`blur`,o);let s=e=>{for(let t of e)if(n.has(t))return!0;return!1},c=new x,l=new N,u=new N,d=new _(0,0,0,`YXZ`);return{state:r,update(e){let n=0;s(jt)&&--n,s(Mt)&&(n+=1),t&&(t.pitch!==0||n===0)&&(n=Math.max(-1,Math.min(1,n+t.pitch)));let i=n*mt,a=n===0?gt:ht;r.angularVelocity.x+=(i-r.angularVelocity.x)*Math.min(1,a*e),r.angularVelocity.x*=Math.exp(-3.2*e);let o=0;s(Nt)&&(o+=1),s(Pt)&&--o,t&&(t.turn!==0||o===0)&&(o=Math.max(-1,Math.min(1,o+t.turn)));let f=o*_t,p=f===0?yt:vt;r.angularVelocity.y+=(f-r.angularVelocity.y)*Math.min(1,p*e);let m=Ct*Math.abs(r.angularVelocity.y)/_t,h=0;s(Ft)&&(h+=1),s(It)&&--h;let g=r.angularVelocity.y/_t*bt+h*xt;r.bankAngle+=(g-r.bankAngle)*Math.min(1,St*e),r.angularVelocity.z=0,l.setFromAxisAngle(dt,(r.angularVelocity.x+m)*e),u.setFromAxisAngle(ft,r.angularVelocity.y*e),r.quaternion.multiply(l).multiply(u),r.quaternion.normalize(),d.setFromQuaternion(r.quaternion,`YXZ`),Math.abs(d.x)<1.35&&(d.z=0,r.quaternion.setFromEuler(d));let _=s(kt)||(t?.thrust??!1),v=s(At)||(t?.brake??!1);_&&(r.hasThrusted=!0),c.set(0,0,-1).applyQuaternion(r.quaternion);let y=r.velocity.length();if(_){let t=Math.max(0,1-(y/Et)**2);r.velocity.addScaledVector(c,54*t*e)}if(v&&y>.05){let t=r.velocity.clone().normalize(),n=Math.min(wt*e,y);r.velocity.addScaledVector(t,-n)}r.velocity.multiplyScalar(Tt),r.position.addScaledVector(r.velocity,e),r.speed=r.velocity.length();let b=+!!_,x=_?Dt:Ot;r.thrustLevel+=(b-r.thrustLevel)*Math.min(1,x*e),r.brakeLevel+=(+!!v-r.brakeLevel)*Math.min(1,4*e)},dispose(){window.removeEventListener(`keydown`,i),window.removeEventListener(`keyup`,a),window.removeEventListener(`blur`,o),n.clear()}}}var zt=52,Bt=.12;function Vt(e,t,n){return Math.max(t,Math.min(n,e))}function Ht(e){let t=Math.abs(e);return t<Bt?0:Math.sign(e)*((t-Bt)/(1-Bt))}function Ut(e){let t={pitch:0,turn:0,thrust:!1,brake:!1};if(!window.matchMedia(`(pointer: coarse)`).matches)return{input:t,active:!1,setArmed(){},dispose(){}};let n=document.createElement(`div`);n.className=`v4-touch is-prelaunch`,n.setAttribute(`aria-hidden`,`true`),n.innerHTML=`
    <div class="v4-touch__stick-zone" aria-hidden="true">
      <div class="v4-touch__stick-ring"></div>
      <div class="v4-touch__stick-knob"></div>
    </div>
    <div class="v4-touch__actions">
      <button type="button" class="v4-touch__btn v4-touch__btn--brake" data-action="brake" aria-label="Hamowanie">HAM</button>
      <button type="button" class="v4-touch__btn v4-touch__btn--thrust" data-action="thrust" aria-label="Ciąg główny">CIĄG</button>
    </div>
  `,e.appendChild(n);let r=n.querySelector(`.v4-touch__stick-zone`),i=n.querySelector(`.v4-touch__stick-knob`),a=n.querySelector(`[data-action="thrust"]`),o=n.querySelector(`[data-action="brake"]`),s=null,c=0,l=0;function u(){s=null,t.pitch=0,t.turn=0,i.style.transform=`translate(-50%, -50%)`}function d(e,n){let r=e-c,a=n-l,o=Math.hypot(r,a),s=o>zt?zt/o:1,u=r*s/zt,d=a*s/zt;i.style.transform=`translate(calc(-50% + ${u*zt}px), calc(-50% + ${d*zt}px))`,t.pitch=Ht(Vt(-d,-1,1)),t.turn=Ht(Vt(u,-1,1))}let f=e=>{if(s!==null)return;s=e.pointerId;let t=r.getBoundingClientRect();c=t.left+t.width/2,l=t.top+t.height/2,d(e.clientX,e.clientY);try{r.setPointerCapture(e.pointerId)}catch{}e.preventDefault()},p=e=>{e.pointerId===s&&(d(e.clientX,e.clientY),e.preventDefault())},m=e=>{e.pointerId===s&&(r.releasePointerCapture(e.pointerId),u(),e.preventDefault())};r.addEventListener(`pointerdown`,f),r.addEventListener(`pointermove`,p),r.addEventListener(`pointerup`,m),r.addEventListener(`pointercancel`,m);let h=(e,n,r)=>{t[r]=n,e.classList.toggle(`is-active`,n)},g=(e,t)=>{let n=n=>{h(e,!0,t);try{e.setPointerCapture(n.pointerId)}catch{}n.preventDefault()},r=n=>{e.hasPointerCapture(n.pointerId)&&e.releasePointerCapture(n.pointerId),h(e,!1,t),n.preventDefault()};return e.addEventListener(`pointerdown`,n),e.addEventListener(`pointerup`,r),e.addEventListener(`pointercancel`,r),()=>{e.removeEventListener(`pointerdown`,n),e.removeEventListener(`pointerup`,r),e.removeEventListener(`pointercancel`,r)}},_=g(a,`thrust`),v=g(o,`brake`),y=()=>{u(),h(a,!1,`thrust`),h(o,!1,`brake`)};return window.addEventListener(`blur`,y),{input:t,active:!0,setArmed(e){n.classList.toggle(`is-prelaunch`,!e),n.setAttribute(`aria-hidden`,e?`false`:`true`),e||(u(),h(a,!1,`thrust`),h(o,!1,`brake`))},dispose(){window.removeEventListener(`blur`,y),r.removeEventListener(`pointerdown`,f),r.removeEventListener(`pointermove`,p),r.removeEventListener(`pointerup`,m),r.removeEventListener(`pointercancel`,m),_(),v(),n.remove()}}}var Z=new x(0,0,0),Wt=[{id:`mint`,position:new x(784,126,-364),radius:40,color:3003583},{id:`plumm`,position:new x(-588,-196,728),radius:34,color:9071615},{id:`idrive`,position:new x(420,308,1176),radius:28,color:16762977},{id:`agentic`,position:new x(-1092,-84,-840),radius:45,color:16098596}],Gt=.15,Kt=6.8,qt=56,Jt=48,Yt=2.4,Xt=55,Zt=60,Qt=58,$t=62,en=6.5,tn=10,nn=16,rn=22,an=12,on=4.5,sn=2,cn=50,ln=.95,un=.45,dn=.9,Q=new x(0,1,0),fn=new x(0,0,-1),pn=new x(0,1,0);function mn(e,t){return!Number.isFinite(e.x+e.y+e.z)||e.lengthSq()<1e-10?t.clone():e.normalize()}function hn(e){return e>0&&e<.62?{back:2.35,height:1.28,side:.18,fov:58,pull:.55,lookLift:-14}:e>0&&e<.85?{back:2.05,height:1.18,side:.26,fov:56,pull:.65,lookLift:-11}:{back:1,height:1,side:1,fov:cn,pull:1,lookLift:0}}function gn(e){let t=C.clamp(e,0,1);return t*t*(3-2*t)}function _n(e){let t=new x,n=new x,r=new x,i=new x,a=new x,o=new x(Gt,Kt,qt),s=new x,c=new x,l=new x,u=new x,d=new x,f=new x,p=new N,m=new N,h=new x,g=new N,_=new M;_.up.copy(Q);let v=0,y=cn,b=`launch`,S=0,w=!1;e.fov=Xt,e.updateProjectionMatrix();function T(t){let n=hn(e.aspect);l.copy(t).sub(Z),l.lengthSq()<1e-6&&l.set(0,0,1),l.normalize(),u.crossVectors(Q,l),u.lengthSq()<1e-8&&u.set(1,0,0),u.normalize(),d.copy(t).addScaledVector(l,rn*n.back).addScaledVector(Q,an*n.height).addScaledVector(u,on*n.side),f.copy(t).addScaledVector(l,-14*n.pull).addScaledVector(Q,sn+n.lookLift),y=n.fov,_.position.copy(d),_.up.copy(Q),_.lookAt(f),p.copy(_.quaternion)}function E(){e.position.copy(d),e.quaternion.copy(p),e.up.copy(Q),Math.abs(e.fov-y)>.01&&(e.fov=y,e.updateProjectionMatrix())}function D(e,t){b=`launch`,S=0,w=!1,v=0,s.set(0,0,0),o.set(Gt,Kt,qt),T(e),E()}function O(l,u,d,f,p){let h=Number.isFinite(l)&&l>0?Math.min(l,.05):1/60,g=p?Math.min(Math.hypot(p.x,p.y),12):0,y=p?C.clamp(-p.y*un,-.9,dn):0,b=p?C.clamp(p.x*un,-.9,dn):0,x=1-Math.exp(-8*h);s.x+=(y-s.x)*x,s.y+=(b-s.y)*x;let S=C.clamp(Number.isFinite(f)?f:0,0,1),w=S*en;v+=(w-v)*(1-Math.exp(-4.5*h)),a.set(Gt+s.x,Kt+s.y,qt+v);let T=1-Math.exp(-(tn+g*nn)*h);o.lerp(a,T),t.copy(o).applyQuaternion(d).add(u),r.set(0,0,-1).applyQuaternion(d),mn(r,fn),i.set(0,1,0).applyQuaternion(d),mn(i,pn),n.copy(u).addScaledVector(r,Jt).addScaledVector(i,Yt),_.position.copy(t),c.copy(n).sub(t),c.lengthSq()>1e-8?(c.normalize(),_.up.copy(Math.abs(c.dot(Q))>.92?i:Q)):_.up.copy(Q),_.lookAt(n),m.copy(_.quaternion);let E=e.aspect>0&&e.aspect<.85,D=E?Qt:Xt,O=E?$t:Zt;return{fov:C.lerp(D,O,S*S)}}function ee(n){e.position.copy(t),e.quaternion.copy(m),e.up.copy(_.up),Math.abs(e.fov-n)>.01&&(e.fov=n,e.updateProjectionMatrix())}return{holdLaunch:D,getPhase(){return b},update(n,r,i,a,o,s,c){if(!c.hasThrusted){D(r,i);return}w||(w=!0,T(r),h.copy(e.position),g.copy(e.quaternion),c.reducedMotion?(b=`chase`,S=1):(b=`blend`,S=0));let l=O(n,r,i,a,s);if(b===`blend`){S=Math.min(1,S+(Number.isFinite(n)&&n>0?Math.min(n,.05):1/60)/ln);let r=gn(S);e.position.lerpVectors(h,t,r),e.quaternion.slerpQuaternions(g,m,r),e.up.copy(Q).lerp(_.up,r).normalize();let i=C.lerp(y,l.fov,r);Math.abs(e.fov-i)>.01&&(e.fov=i,e.updateProjectionMatrix()),S>=1&&(b=`chase`);return}ee(l.fov)}}}function vn(e){let t=Math.floor(Math.max(0,e)/100),n=t%10,r=Math.floor(t/10),i=r%60,a=Math.floor(r/60);return`${String(a).padStart(2,`0`)}:${String(i).padStart(2,`0`)}.${n}`}function yn(e){let t=new Date(e);return Number.isNaN(t.getTime())?`--.--`:`${String(t.getDate()).padStart(2,`0`)}.${String(t.getMonth()+1).padStart(2,`0`)}`}function bn(e,t){let n=e.match(/[^.!?]+[.!?]+(\s+|$)/g);return!n||n.length===0?e.trim():n.slice(0,t).join(``).trim()}var xn={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`};function Sn(e){return e.replace(/[&<>"']/g,e=>xn[e]??e)}function Cn(e){if(!e)return!1;let t=e.trim();if(!t||t===`#`||t.startsWith(`#`))return!1;try{let e=new URL(t);return e.protocol===`http:`||e.protocol===`https:`}catch{return!1}}var wn=`https://marcinbochenek.com`,Tn=8e3,En=.4;function Dn(e,t={}){let n=typeof location<`u`&&new URLSearchParams(location.search).has(`debug`);for(let t of e.querySelectorAll(`.stats, #stats, [class*="fps"]`))t.remove();let r=t.touchActive??!1,i=t.launchByTap??r,a=r?`<span>Lewy drążek</span> — lot · <span>Ciąg</span> — napęd · <span>Ham</span> — hamowanie`:`<span>W/S</span> — pochylenie · <span>A/D</span> — skręt · <span>Spacja</span> — ciąg · <span>Shift</span> — hamowanie`,o=i?`Dotknij, aby uruchomić silniki`:`Naciśnij <span class="v4-hud__start-keys">Spację</span>, aby uruchomić silniki`,s=document.createElement(`div`);s.className=`v4-hud`,s.innerHTML=`
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
  `,e.appendChild(s);let c=s.querySelector(`.v4-hud__speed-value`),l=s.querySelector(`.v4-hud__thrust-fill`),u=s.querySelector(`.v4-hud__legend`),d=s.querySelector(`.v4-hud__start-prompt`);i&&t.onLaunch&&d.addEventListener(`pointerdown`,e=>{e.preventDefault(),t.onLaunch?.()});let f=s.querySelector(`.v4-hud__timer`),p=s.querySelector(`.v4-hud__warning`),m=Array.from(s.querySelectorAll(`.v4-hud__pip`)),h=s.querySelector(`.v4-hud__fps`),g=performance.now(),_=0,v=0,y=En*54,b=y*.78,x=!1,S=0,C=!1;function w(){window.clearTimeout(S),S=window.setTimeout(()=>{u.classList.remove(`is-visible`),u.setAttribute(`aria-hidden`,`true`)},Tn)}return{update(e){if(c.textContent=String(Math.round(e.speed)).padStart(2,`0`),l.style.transform=`scaleX(${Math.max(0,Math.min(1,e.thrust))})`,e.hasThrusted&&!x&&(x=!0,d.classList.add(`is-hidden`),u.classList.add(`is-visible`),u.setAttribute(`aria-hidden`,`false`),w()),f.textContent=vn(e.missionMs),h){let e=performance.now(),t=e-g;if(g=e,t>.75&&t<250){let e=1e3/t;_=v===0?e:_*.88+e*.12,v+=1,v>=8&&_>=1&&(h.hidden=!1,h.textContent=`${Math.round(_)} fps`)}}C=C?e.gravityAccel>b:e.gravityAccel>y,p.classList.toggle(`is-visible`,C);for(let t of m){let n=t.dataset.planet;t.classList.toggle(`is-found`,e.discovered.has(n))}},reset(){x=!1,C=!1,window.clearTimeout(S),d.classList.remove(`is-hidden`),u.classList.remove(`is-visible`),u.setAttribute(`aria-hidden`,`true`),p.classList.remove(`is-visible`)},dispose(){window.clearTimeout(S),s.remove()}}}var On=108,kn=108,An=108*1.012,jn=1.55,Mn=108*1.018,Nn=108*1.26,Pn=12,Fn=Nn*1.18,In=.94,Ln=48,Rn=24,zn=Nn*1.06,Bn=`
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,Vn=`
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
  uniform float uBendK;
  uniform int uSteps;
  uniform float uMarchStartR;

  varying vec3 vWorldPos;

  ${xe}

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
    float ang = atan(cv, cu);

    float omega = 2.0 / pow(rad / uDiskInner, 1.5);
    float flowAngle = ang - uTime * omega;
    vec2 flow = vec2(sin(flowAngle), cos(flowAngle));

    float streak = fbm2(vec2(rad * 0.08, ang * 0.55) + flow * 3.1, 5);
    float streak2 = fbm2(vec2(rad * 0.18, ang * 1.1) + flow * 5.8, 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec3 tangent = normalize(-sin(ang) * uDiskU + cos(ang) * uDiskV);
    float approach = dot(tangent, -d);
    float beam = mix(0.36, 1.58, smoothstep(-0.55, 0.55, approach));
    vec3 temp = diskTemperatureColor(tRad);
    temp = mix(temp * vec3(0.42, 0.55, 1.08), temp * vec3(1.18, 0.9, 0.62), smoothstep(-0.5, 0.5, approach));

    float bandA = smoothstep(0.0, 0.1, tRad) * (1.0 - smoothstep(0.26, 0.46, tRad));
    float bandB = smoothstep(0.4, 0.56, tRad) * (1.0 - smoothstep(0.78, 1.0, tRad));
    float bands = bandA + bandB * 0.7;
    float innerFade = smoothstep(0.0, 0.07, tRad);
    float outerFade = 1.0 - smoothstep(0.84, 1.0, tRad);
    float brightness = (0.22 + streakMix * 0.58) * beam * (0.28 + bands) * innerFade * outerFade;
    return temp * brightness * imageFalloff;
  }

  void main() {
    vec3 ro = cameraPosition;
    vec3 rd = normalize(vWorldPos - ro);
    vec3 w0 = ro - uBHPos;

    float b2Early = dot(w0, w0) - pow(dot(w0, rd), 2.0);
    float closestREarly = sqrt(max(b2Early, 0.0));

    vec3 oc = w0;
    float bIsec = dot(oc, rd);
    float cIsec = dot(oc, oc) - uMarchStartR * uMarchStartR;
    float discIsec = bIsec * bIsec - cIsec;

    if (discIsec < 0.0) discard;

    float tEntry = -bIsec - sqrt(discIsec);
    vec3 p = (tEntry > 0.0 ? ro + rd * tEntry : ro) - uBHPos;
    vec3 d = rd;
    vec3 hvec = cross(p, d);
    float h2 = dot(hvec, hvec);
    float bendScale = 1.5 * uHorizonR * h2 * uBendK;

    vec3 accum = vec3(0.0);
    int diskHits = 0;

    for (int i = 0; i < 48; i++) {
      if (i >= uSteps) break;

      float r = length(p);

      if (r < uHorizonR) break;
      if (r > uMarchStartR * 1.02 && dot(d, p) > 0.0) break;

      float ds = clamp(r * 0.16, 0.45, 6.0);
      float r2 = r * r;
      vec3 accel = p * (-bendScale / (r2 * r2 * r));
      vec3 newD = d + accel * ds;

      vec3 prevP = p;
      p += newD * ds;
      d = newD;

      float prevZ = dot(prevP, uDiskN);
      float curZ = dot(p, uDiskN);
      if (diskHits < 2 && prevZ * curZ < 0.0) {
        float tt = prevZ / (prevZ - curZ);
        vec3 crossP = mix(prevP, p, tt);
        float cu = dot(crossP, uDiskU);
        float cv = dot(crossP, uDiskV);
        float rad = length(vec2(cu, cv));
        if (rad > uDiskInner && rad < uDiskOuter) {
          diskHits += 1;
          bool nearSide = dot(crossP, w0) > 0.0;
          if (!nearSide) {
            float imageFalloff = diskHits == 1 ? 0.95 : 0.42;
            accum += shadeDiskCrossing(crossP, d, imageFalloff);
          }
        }
      }
    }

    vec3 peri = w0 - rd * dot(w0, rd);
    float periLen = length(peri);
    float polar = periLen > 1e-4 ? abs(dot(peri / periLen, uDiskN)) : 1.0;
    // Continuous photon ring at the shadow limb — polar only boosts, never
    // kills, or the rim collapses to a Saturn scratch.
    float rim = exp(-pow((closestREarly - uPhotonR) / uPhotonWidth, 2.0));
    rim *= 0.78 + 0.22 * (1.0 - smoothstep(0.2, 0.85, polar));

    // Far-side secondary image: a polar cap at the limb, not a concentric hoop.
    // Rays skimming the shadow off the disk plane pick up the far disk.
    float polarCap = smoothstep(0.32, 0.72, polar);
    float limb = exp(-pow((closestREarly - uPhotonR) / (uPhotonWidth * 2.6), 2.0));
    float capW = polarCap * limb;
    if (capW > 0.04) {
      vec3 az = periLen > 1e-4 ? normalize(peri - uDiskN * dot(peri, uDiskN)) : uDiskU;
      vec3 farP = az * (uDiskInner * 1.1);
      if (dot(farP, w0) > 0.0) farP = -farP;
      accum += shadeDiskCrossing(farP, d, capW * 0.95);
    }

    vec3 color = accum + vec3(1.0, 0.969, 0.91) * rim * 0.62;
    if (dot(color, vec3(0.3, 0.55, 0.15)) < 0.01) discard;

    gl_FragColor = vec4(color, 1.0);
    ${ye}
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
  uniform float uHorizonR;
  uniform vec3 uDiskU;
  uniform vec3 uDiskV;
  uniform float uTime;
  varying vec3 vWorldPos;

  ${xe}

  vec3 diskTemperatureColor(float t) {
    vec3 hot = vec3(0.99, 0.94, 0.84);
    vec3 amber = vec3(0.94, 0.66, 0.28);
    vec3 ember = vec3(0.62, 0.28, 0.08);
    vec3 c = mix(amber, ember, smoothstep(0.18, 0.8, t));
    c = mix(hot, c, smoothstep(0.0, 0.14, t));
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
    float streak = fbm2(vec2(rad * 0.08, ang * 0.55) + flow * 3.1, 5);
    float streak2 = fbm2(vec2(rad * 0.18, ang * 1.1) + flow * 5.8, 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec3 rd = normalize(vWorldPos - cameraPosition);
    vec3 toCam = cameraPosition - uBHPos;
    if (dot(rel, toCam) < 0.0) discard;

    vec3 oc = cameraPosition - uBHPos;
    float bOc = dot(oc, rd);
    float cOc = dot(oc, oc) - uHorizonR * uHorizonR;
    float discOc = bOc * bOc - cOc;
    if (discOc > 0.0) {
      float tSph = -bOc - sqrt(discOc);
      if (tSph < 0.0) tSph = -bOc + sqrt(discOc);
      float tFrag = length(vWorldPos - cameraPosition);
      if (tSph > 0.02 && tSph < tFrag - 0.02) discard;
    }

    vec3 tangent = normalize(-sin(ang) * uDiskU + cos(ang) * uDiskV);
    float approach = dot(tangent, -rd);
    float beam = mix(0.36, 1.55, smoothstep(-0.55, 0.55, approach));
    vec3 temp = diskTemperatureColor(tRad);
    temp = mix(temp * vec3(0.4, 0.52, 1.06), temp * vec3(1.16, 0.88, 0.58), smoothstep(-0.5, 0.5, approach));

    float bandA = smoothstep(0.0, 0.08, tRad) * (1.0 - smoothstep(0.24, 0.44, tRad));
    float bandB = smoothstep(0.38, 0.54, tRad) * (1.0 - smoothstep(0.76, 1.0, tRad));
    float bands = bandA + bandB * 0.68;
    float innerFade = smoothstep(0.0, 0.05, tRad);
    float outerFade = 1.0 - smoothstep(0.86, 1.0, tRad);
    float brightness = (0.2 + streakMix * 0.6) * beam * (0.3 + bands) * innerFade * outerFade;

    gl_FragColor = vec4(temp * brightness, 1.0);
    ${ye}
  }
`;function Wn(e,t){let n=e.material;return{name:t,visible:e.visible,renderOrder:e.renderOrder,depthTest:n.depthTest,depthWrite:n.depthWrite,transparent:n.transparent,blending:n.blending,side:n.side}}function Gn(e,t){let n=C.degToRad(Pn),r=new x(0,Math.cos(n),Math.sin(n)).normalize(),i=new x(1,0,0),a=new x().crossVectors(r,i).normalize();i.crossVectors(a,r).normalize();let o=new j(zn,64,48),s=new k({uniforms:{uBHPos:{value:Z.clone()},uHorizonR:{value:On},uPhotonR:{value:An},uPhotonWidth:{value:jn},uDiskInner:{value:Mn},uDiskOuter:{value:Nn},uDiskU:{value:i},uDiskV:{value:a},uDiskN:{value:r},uTime:{value:0},uBendK:{value:In},uSteps:{value:t?Rn:Ln},uMarchStartR:{value:Fn}},vertexShader:Bn,fragmentShader:Vn,depthTest:!0,depthWrite:!1,transparent:!0,blending:2,toneMapped:!0,side:0}),c=new P(o,s);c.frustumCulled=!1,c.renderOrder=7,c.name=`black-hole-lensing`;let l=new j(kn,64,48),u=new U({color:0,toneMapped:!1,depthWrite:!0,depthTest:!0,transparent:!1,fog:!1});u.colorWrite=!0;let d=new P(l,u);d.name=`black-hole-horizon`,d.renderOrder=0,d.frustumCulled=!1;let f=new ne(Mn,Nn,128,4),p=new k({uniforms:{uBHPos:{value:Z.clone()},uDiskInner:{value:Mn},uDiskOuter:{value:Nn},uHorizonR:{value:On},uDiskU:{value:i},uDiskV:{value:a},uTime:{value:0}},vertexShader:Hn,fragmentShader:Un,depthTest:!0,depthWrite:!0,transparent:!1,toneMapped:!0,side:2}),m=new P(f,p);m.name=`black-hole-disk`,m.renderOrder=1,m.quaternion.setFromUnitVectors(new x(0,0,1),r),m.frustumCulled=!1;let h=new g;h.name=`black-hole`,h.position.copy(Z),h.add(d),h.add(m),h.add(c);let _=new g;_.name=`black-hole-debug-bounds`,_.visible=!1;let v=new P(new j(kn,32,24),new U({color:4521932,wireframe:!0,depthTest:!1,toneMapped:!1}));v.name=`black-hole-horizon-wire`;let y=new I(kn*1.6);y.name=`black-hole-axes`,_.add(v),_.add(y),h.add(_);let b=new x,S=new x;return{object:h,update(e,t,n){if(s.uniforms.uTime.value=t,p.uniforms.uTime.value=t,b.copy(Z).sub(n.position),S.set(0,0,-1).applyQuaternion(n.quaternion),b.dot(S)<zn+8||b.length()<zn+4){c.visible=!1;return}c.userData.forceHidden||(c.visible=!0)},setLayerVisible(e,t){e===`horizon`?d.visible=t:e===`lensing`?(c.userData.forceHidden=!t,c.visible=t):m.visible=t},getLayerState(){return{horizon:Wn(d,d.name),lensing:Wn(c,c.name),disk:Wn(m,m.name)}},setDebugBounds(e){_.visible=e},dispose(){o.dispose(),s.dispose(),l.dispose(),u.dispose(),f.dispose(),p.dispose(),v.geometry.dispose(),v.material.dispose(),y.geometry.dispose(),y.material.dispose()}}}var Kn=`
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
`;function Yn(e,t,n=!1){let r=new g;r.name=`planet-mint`;let[i,a]=n?[96,64]:[128,96],o=new j(e,i,a),s=new k({uniforms:{uEarthTex:{value:t},uRadius:{value:e}},vertexShader:he,fragmentShader:Kn}),c=new P(o,s);r.add(c);let l=new j(e*1.025,n?64:84,n?44:60),u=new k({uniforms:{uTime:{value:0},uRadius:{value:e}},vertexShader:qn,fragmentShader:Jn,transparent:!0,depthWrite:!1}),d=new P(l,u);d.renderOrder=2,r.add(d);let f=we(e,16767392,{power:2.3,intensity:1.25});return r.add(f.mesh),{group:r,update(e){c.rotation.y+=e*.018,d.rotation.y+=e*.026,u.uniforms.uTime.value+=e},dispose(){o.dispose(),s.dispose(),l.dispose(),u.dispose(),f.dispose()}}}var Xn=`
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
`;function Zn(e,t,n){let r=new g;r.name=`planet-plumm`;let[i,a]=n?[96,64]:[128,96],o=new j(e,i,a),s=new k({uniforms:{uCityTex:{value:t},uTime:{value:0},uRadius:{value:e}},vertexShader:be,fragmentShader:Xn}),c=new P(o,s);r.add(c);let u=we(e,9071615,{power:2.8,intensity:1.35});r.add(u.mesh);let d=[],f=[];if(!n){let t=[{r:e*1.28,speed:.22,tilt:.06,opacity:.55},{r:e*1.48,speed:-.16,tilt:-.09,opacity:.4},{r:e*1.7,speed:.12,tilt:.14,opacity:.3}];for(let n of t){let t=new m(n.r,e*.006,8,160),i=new U({color:11246557,transparent:!0,opacity:n.opacity,blending:2,depthWrite:!1}),a=new P(t,i);a.rotation.x=Math.PI/2+n.tilt,a.renderOrder=2,r.add(a),d.push({mesh:a,speed:n.speed}),f.push({geo:t,mat:i})}}let p=n?20:48,h=new w;{let e=1.8,t=new Float32Array([0,0,-1.8*.55,-.62,.12,e*.45,0,-.1,e*.38,0,0,-1.8*.55,0,-.1,e*.38,.62,.12,e*.45]);h.setAttribute(`position`,new G(t,3)),h.computeVertexNormals()}let _=new U({color:15854847,side:2}),v=new O(h,_,p);v.frustumCulled=!1,r.add(v);let y=[];{let t=(()=>{let e=2636928641;return()=>(e=Math.imul(e^e>>>15,e|1),(e>>>16&65535)/65535)})(),n=new x;for(let r=0;r<p;r++)n.set(t()*2-1,t()*2-1,t()*2-1).normalize(),y.push({quat:new N().setFromAxisAngle(n,t()*Math.PI*2),r:e*(1.16+t()*.42),speed:(.1+t()*.22)*(t()<.5?1:-1),phase:t()*Math.PI*2,bank:(t()-.5)*.9})}let b=new x,S=new x,C=new x,T=new x,E=new x,D=new x(1,1,1),ee=new l,A=new N,M=new N,F=new l,I=new x(0,0,1);function L(e){for(let t=0;t<p;t++){let n=y[t],r=n.phase+e*n.speed,i=Math.sign(n.speed)||1;b.set(Math.cos(r)*n.r,0,Math.sin(r)*n.r).applyQuaternion(n.quat),S.set(-Math.sin(r)*i,0,Math.cos(r)*i).applyQuaternion(n.quat).normalize(),C.copy(b).normalize(),E.copy(S).multiplyScalar(-1),T.crossVectors(C,E).normalize(),C.crossVectors(E,T),ee.makeBasis(T,C,E),A.setFromRotationMatrix(ee),M.setFromAxisAngle(I,n.bank),A.multiply(M),F.compose(b,A,D),v.setMatrixAt(t,F)}v.instanceMatrix.needsUpdate=!0}return L(0),{group:r,update(e,t){c.rotation.y+=e*.014,s.uniforms.uTime.value=t;for(let t of d)t.mesh.rotation.z+=e*t.speed;L(t)},dispose(){o.dispose(),s.dispose(),u.dispose(),h.dispose(),_.dispose(),v.dispose();for(let e of f)e.geo.dispose(),e.mat.dispose()}}}var Qn=1056,$n=`
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
    ${ye}
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
    ${ye}
  }
`,ir=class extends W{shellRadius;constructor(e,t){super(e,!0,`centripetal`),this.shellRadius=t}getPoint(e,t=new x){return super.getPoint(e,t),t.setLength(this.shellRadius)}},ar=[{kind:`straight`,weight:1.7},{kind:`hairpin`,weight:.6,sign:1},{kind:`straight`,weight:1.3},{kind:`corner`,weight:.8,sign:-1},{kind:`chicane`,weight:.8,sign:1},{kind:`straight`,weight:1.6},{kind:`hairpin`,weight:.6,sign:-1},{kind:`straight`,weight:1.2},{kind:`corner`,weight:.8,sign:1},{kind:`straight`,weight:1.5}];function or(e){let t=e*1.02,n=e*.018,r=_e(Qn),i=ar.reduce((e,t)=>e+t.weight,0),a=r()*Math.PI*2,o=[];for(let e of ar){let t=e.weight/i*Math.PI*2,n=a+t/2,s=e.sign??1;if(e.kind===`straight`)o.push({theta:n+(r()-.5)*t*.3,lat:(r()-.5)*.24});else if(e.kind===`corner`){let e=.38+r()*.14;o.push({theta:n,lat:s*e})}else if(e.kind===`chicane`){let e=t*.26,i=.34+r()*.1;o.push({theta:n-e,lat:s*i}),o.push({theta:n+e,lat:-s*i})}else{let e=t*.38,i=.46+r()*.08;o.push({theta:n-e,lat:s*i*.6}),o.push({theta:n,lat:s*(i+.08)}),o.push({theta:n+e,lat:s*i*.6})}a+=t}let s=new ir(o.map(({theta:e,lat:n})=>{let r=Math.PI/2-n;return new x(t*Math.sin(r)*Math.cos(e),t*Math.cos(r),t*Math.sin(r)*Math.sin(e))}),t),c=[];for(let e=0;e<256;e++)c.push(s.getPointAt(e/256,new x));let l=n*5.2,u=new x,d=new x;for(let e=0;e<80;e++){let e=!0,n=c.map(e=>e.clone());for(let r=0;r<256;r++){let i=n[(r-1+256)%256],a=n[r],o=n[(r+1)%256];u.subVectors(a,i),d.subVectors(o,a);let s=(u.length()+d.length())/2,f=u.normalize().angleTo(d.normalize());f<1e-5||s/f>=l||(e=!1,c[r].copy(i).add(o).multiplyScalar(.5).sub(a).multiplyScalar(.6).add(a).setLength(t))}if(e)break}for(let e=0;e<2;e++){let e=c.map(e=>e.clone());for(let n=0;n<256;n++){let r=e[(n-1+256)%256],i=e[n],a=e[(n+1)%256];c[n].copy(r).add(a).multiplyScalar(.5).sub(i).multiplyScalar(.25).add(i).setLength(t)}}let f=new ir(c,t);return f.arcLengthDivisions=800,f}function sr(e,t){let n=new g;n.name=`planet-idrive`;let[r,i]=t?[96,64]:[128,96],a=new j(e,r,i),o=new k({uniforms:{uRadius:{value:e}},vertexShader:be,fragmentShader:$n}),s=new P(a,o);n.add(s);let c=e*.018,u=or(e),p=new f(u,t?220:400,c,14,!0),m=new k({vertexShader:er,fragmentShader:tr}),h=new P(p,m);n.add(h);let _=we(e,10133672,{power:3.2,intensity:.55});n.add(_.mesh);let v=t?16:28,y=_e(1057),b=e*.031,C=b*.5,T=b*.2,E=Array.from({length:v},(e,t)=>{let n=(t%2==0?-1:1)*(.55+y()*.45)*.4*c;return{t:y(),speed:.028+y()*.05,lane:n,lift:Math.sqrt(Math.max(c*c-n*n,0))+T*.5+c*.04}}),D=new le(C,T,b),ee=new re({color:16777215,roughness:.45,metalness:.55,emissive:2364677,emissiveIntensity:.9}),A=new O(D,ee,v);A.instanceMatrix.setUsage(S),A.frustumCulled=!1;let M=[12106948,4869720,10238770,3364477,12159534,4025167],N=new d;for(let e=0;e<v;e++)N.setHex(M[e%M.length]),A.setColorAt(e,N);n.add(A);let F=v*3,I=new Float32Array(F*3),L=new Float32Array(F*3),R=new Float32Array(F),z=new Float32Array(F),te=new Float32Array(F),ne=new d(16768160),B=new d(16777215),V=new d(16774880),H=new d(16723224);for(let t=0;t<v;t++){let n=t*3;N.copy(ne).lerp(B,y()*.5),L.set([N.r,N.g,N.b],n*3),R[n]=e*(.1+y()*.05),z[n]=.9,te[n]=1,L.set([V.r,V.g,V.b],(n+1)*3),R[n+1]=b*.5,z[n+1]=1,te[n+1]=0,L.set([H.r,H.g,H.b],(n+2)*3),R[n+2]=b*.55,z[n+2]=1,te[n+2]=0}let U=new w;U.setAttribute(`position`,new G(I,3)),U.setAttribute(`aColor`,new G(L,3)),U.setAttribute(`aSize`,new G(R,1)),U.setAttribute(`aAlpha`,new G(z,1)),U.setAttribute(`aFadeNear`,new G(te,1));let ie=new k({vertexShader:nr,fragmentShader:rr,transparent:!0,depthWrite:!1,blending:2}),oe=new ae(U,ie);oe.frustumCulled=!1,oe.renderOrder=3,n.add(oe);let W=U.attributes.position,se=new x,ce=new x,K=new x,q=new x,J=new x,Y=new x,X=new x,ue=new l;function de(e){let t=E[e];u.getPointAt(t.t,se),u.getPointAt((t.t+.0015)%1,ce),K.copy(se).normalize(),q.subVectors(ce,se),q.addScaledVector(K,-q.dot(K)).normalize(),J.crossVectors(K,q),Y.copy(se).addScaledVector(J,t.lane).addScaledVector(K,t.lift),ue.makeBasis(J,K,q),ue.setPosition(Y),A.setMatrixAt(e,ue);let n=e*3;W.setXYZ(n,Y.x,Y.y,Y.z),X.copy(Y).addScaledVector(q,b*.58),W.setXYZ(n+1,X.x,X.y,X.z),X.copy(Y).addScaledVector(q,-b*.58),W.setXYZ(n+2,X.x,X.y,X.z)}for(let e=0;e<v;e++)de(e);return A.instanceMatrix.needsUpdate=!0,A.instanceColor&&(A.instanceColor.needsUpdate=!0),W.needsUpdate=!0,{group:n,update(e){s.rotation.y+=e*.01;for(let t=0;t<v;t++){let n=E[t];n.t=(n.t+n.speed*e)%1,de(t)}A.instanceMatrix.needsUpdate=!0,W.needsUpdate=!0},dispose(){a.dispose(),o.dispose(),p.dispose(),m.dispose(),_.dispose(),A.dispose(),D.dispose(),ee.dispose(),U.dispose(),ie.dispose()}}}var cr=9001;function lr(e){let t=1024,n=document.createElement(`canvas`);n.width=t,n.height=512;let r=n.getContext(`2d`);r.fillStyle=`#000000`,r.fillRect(0,0,t,512);let i=_e(e);for(let e=0;e<52;e++){let e=i()*t,n=i()*512;r.beginPath(),r.moveTo(e,n);let a=3+Math.floor(i()*5);for(let o=0;o<a;o++){let a=i()<.5,o=18+i()*65;a?e+=(i()<.5?-1:1)*o:n+=(i()<.5?-1:1)*o,e=Math.max(3,Math.min(t-3,e)),n=Math.max(3,Math.min(509,n)),r.lineTo(e,n)}r.lineWidth=1+i()*1.2,r.strokeStyle=`rgba(245, 165, 36, ${(.5+i()*.5).toFixed(2)})`,r.stroke(),r.fillStyle=`rgba(255, 200, 97, ${(.7+i()*.3).toFixed(2)})`;let o=2+i()*2;r.fillRect(e-o/2,n-o/2,o,o)}let a=new u(n);return a.colorSpace=L,a.wrapS=V,a.wrapT=p,a.needsUpdate=!0,a}var ur=`
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
    ${ye}
  }
`;function fr(e,t,n,r=1){let i=new g;i.name=`planet-agentic`;let a=lr(cr);a.anisotropy=r;let[o,s]=n?[96,64]:[128,96],c=new j(e,o,s),l=new re({color:1711140,metalness:1,roughness:.48,emissive:new d(ve.amber),emissiveMap:a,emissiveIntensity:1.6,envMapIntensity:.9});t&&(l.envMap=t),l.onBeforeCompile=t=>{t.uniforms.uRadius={value:e},t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>\nuniform float uRadius;\nvarying vec3 vDetailDir;\nvarying vec3 vDetailWorldPos;\n${xe}`).replace(`#include <color_fragment>`,`#include <color_fragment>
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
  vDetailWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`)};let u=new P(c,l);i.add(u);let f=we(e,ve.amber,{power:2.9,intensity:.9});i.add(f.mesh);let p=n?8e3:17e3,m=e*2.3,h=e*.55,_=C.degToRad(25),v=_e(9008),y=new Float32Array(p),b=new Float32Array(p),S=new Float32Array(p),T=new Float32Array(p),E=new Float32Array(p*3),D=new Float32Array(p),O=new Float32Array(p),ee=new d(ve.amberDeep),A=new d(ve.amber),M=new d(ve.amberBright),N=new d;for(let e=0;e<p;e++){y[e]=v()*Math.PI*2,b[e]=v()*Math.PI*2;let t=.55+v()**1.6*.45;S[e]=t,T[e]=.09+v()*.14;let n=C.clamp((t-.55)/.45,0,1);n>.6?N.copy(A).lerp(M,(n-.6)/.4):N.copy(ee).lerp(A,n/.6),E[e*3]=N.r,E[e*3+1]=N.g,E[e*3+2]=N.b,D[e]=.85+v()*1.1,O[e]=.5+v()*.48}let F=new w;F.setAttribute(`aTheta0`,new G(y,1)),F.setAttribute(`aPhi`,new G(b,1)),F.setAttribute(`aTubeFrac`,new G(S,1)),F.setAttribute(`aSpeed`,new G(T,1)),F.setAttribute(`aColor`,new G(E,3)),F.setAttribute(`aSize`,new G(D,1)),F.setAttribute(`aAlpha`,new G(O,1)),F.setAttribute(`position`,new G(new Float32Array(p*3),3)),F.boundingSphere=new K(new x,m+h+6);let I=new k({uniforms:{uTime:{value:0},uMajorR:{value:m},uTubeR:{value:h},uJitterAmp:{value:e*.12},uBasePx:{value:2.6}},vertexShader:ur,fragmentShader:dr,transparent:!0,depthWrite:!1,blending:2}),L=new ae(F,I);return L.frustumCulled=!1,L.rotation.x=_,L.renderOrder=2,i.add(L),{group:i,update(e,t){u.rotation.y+=e*.012,I.uniforms.uTime.value=t},dispose(){c.dispose(),l.dispose(),a.dispose(),f.dispose(),F.dispose(),I.dispose()}}}var pr=7331,mr=3,hr=4,gr=10,_r=60,vr=90,yr=240,br=420,xr=.55,Sr=1.5,Cr=.7,wr=1.5,Tr=16,Er=34,Dr=2.6,Or=480,kr=680,Ar=.4,jr=3.5,Mr=5.5,Nr=70,Pr=5.5;function Fr(){let e=document.createElement(`canvas`);e.width=48,e.height=256;let t=e.getContext(`2d`);t.clearRect(0,0,48,256);let n=256*.13;t.globalCompositeOperation=`lighter`;for(let e=0;e<56;e++){let r=e/55,i=n+r*(256-n),a=(1-r)**2.4*.85,o=48*(.55+.45*(1-r));t.globalAlpha=a,t.fillStyle=`#ffffff`,t.fillRect(48/2-o/2,i,o,5.477142857142857)}t.globalAlpha=1;let r=t.createRadialGradient(48/2,n,0,48/2,n,48*.6);r.addColorStop(0,`rgba(255,255,255,1)`),r.addColorStop(.45,`rgba(255,255,255,0.85)`),r.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=r,t.fillRect(0,0,48,256),t.globalCompositeOperation=`source-over`;let i=new u(e);return i.needsUpdate=!0,i}function Ir(){let e=_e(pr),t=new g;t.name=`meteor-field`;let n=Fr();function r(e){let r=new ce(new T({map:n,color:e?13627391:16777215,transparent:!0,opacity:0,depthWrite:!1,depthTest:!0,blending:2}));return r.visible=!1,r.renderOrder=4,t.add(r),{sprite:r,active:!1,age:0,life:1,startPos:new x,velocity:new x,length:Tr,width:Dr,isComet:e}}let i=Array.from({length:mr},()=>r(!1)),a=r(!0),o=hr+e()*(gr-hr),s=_r+e()*(vr-_r),c=null,l=!1,u=new x,d=new x,f=new x;function p(t,n,r,i){i?(i.getWorldDirection(u),f.set(e()*2-1,e()*2-1,e()*2-1).multiplyScalar(.3),u.add(f)):u.set(e()*2-1,e()*2-1,e()*2-1),u.lengthSq()<1e-6&&u.set(0,1,0),u.normalize(),r.pos.copy(t).addScaledVector(u,n),f.set(e()*2-1,e()*2-1,e()*2-1).normalize(),d.crossVectors(u,f),d.lengthSq()<1e-6&&d.set(1,0,0),d.normalize(),r.dir.copy(d)}let m={pos:new x,dir:new x};function h(t,n){p(n,yr+e()*(br-yr),m,c),c=null;let r=xr+e()*(Sr-xr),i=Cr+e()*(wr-Cr),a=m.pos.distanceTo(n)*r;t.startPos.copy(m.pos),t.velocity.copy(m.dir).multiplyScalar(a/i),t.life=i,t.age=0,t.length=Tr+e()*(Er-Tr),t.width=Dr*(.85+e()*.3),t.active=!0,t.sprite.visible=!0}function _(t){p(t,Or+e()*(kr-Or),m);let n=jr+e()*(Mr-jr),r=m.pos.distanceTo(t)*Ar;a.startPos.copy(m.pos),a.velocity.copy(m.dir).multiplyScalar(r/n),a.life=n,a.age=0,a.length=Nr,a.width=Pr,a.active=!0,a.sprite.visible=!0}let v=new x,y=new x,b=new x,S=new x;function w(e,t,n){if(!e.active)return;if(e.age+=t,e.age>=e.life){e.active=!1,e.sprite.visible=!1;return}S.copy(e.velocity).multiplyScalar(e.age),e.sprite.position.copy(e.startPos).add(S);let r=e.age/e.life,i=C.smoothstep(r,0,.12),a=1-C.smoothstep(r,.65,1),o=e.sprite.material;o.opacity=i*a*(e.isComet?.85:1),n.matrixWorld.extractBasis(v,y,b);let s=e.velocity.dot(v),c=e.velocity.dot(y);o.rotation=Math.atan2(-s,c),e.sprite.scale.set(e.width,e.length,1)}return{object:t,update(t,n){if(l&&(l=!1,c=n),o-=t,o<=0){o=hr+e()*(gr-hr);let t=i.find(e=>!e.active),r=i.filter(e=>e.active).length;t&&r<mr&&h(t,n.position)}c=null,s-=t,s<=0&&(s=_r+e()*(vr-_r),a.active||_(n.position));for(let e of i)w(e,t,n);w(a,t,n)},debugForceSpawn(e=`meteor`){e===`comet`?s=-1:(o=-1,l=!0)},dispose(){n.dispose();for(let e of i)e.sprite.material.dispose();a.sprite.material.dispose()}}}var Lr={mint:[{orbitRadius:1.75,moonRadius:.11,orbitSpeed:.07,inclination:.28,phase:.4,color:9083562},{orbitRadius:2.35,moonRadius:.07,orbitSpeed:.045,inclination:-.18,phase:2.3,color:6978184}],plumm:[{orbitRadius:1.9,moonRadius:.09,orbitSpeed:.055,inclination:.42,phase:1.1,color:5917290}],idrive:[{orbitRadius:1.65,moonRadius:.08,orbitSpeed:.08,inclination:.22,phase:.6,color:10127472},{orbitRadius:2.25,moonRadius:.055,orbitSpeed:.038,inclination:-.35,phase:3.8,color:7825496}],agentic:[{orbitRadius:2,moonRadius:.1,orbitSpeed:.065,inclination:.32,phase:1.6,color:11176032},{orbitRadius:2.7,moonRadius:.065,orbitSpeed:.042,inclination:-.22,phase:4.2,color:8941664}]};function Rr(e,t,n,r){let i=Lr[t],a=r?12:16,o=[],s=[],c=new x;for(let t of i){let r=new B;r.rotation.x=t.inclination,e.add(r);let i=n*t.moonRadius,c=new j(i,a,a),l=new re({color:t.color,roughness:.92,metalness:.04,emissive:new d(t.color).multiplyScalar(.04)}),u=new P(c,l);u.position.x=n*t.orbitRadius,r.add(u),o.push({pivot:r,mesh:u,speed:t.orbitSpeed,phase:t.phase,radius:i}),s.push({geo:c,mat:l})}return{update(e,t){for(let{pivot:e,speed:n,phase:r}of o)e.rotation.y=t*n+r},forEachCollider(e){for(let{mesh:t,radius:n}of o)t.getWorldPosition(c),e(c,n)},dispose(){for(let{geo:e,mat:t}of s)e.dispose(),t.dispose()}}}var zr=`/v4/assets/tex/earth-day-2k.jpg`,Br=`/v4/assets/tex/city-lights-2k.jpg`;function Vr(){let e=document.createElement(`canvas`);e.width=8,e.height=8;let t=e.getContext(`2d`);t&&(t.fillStyle=`#141820`,t.fillRect(0,0,8,8));let n=new u(e);return n.needsUpdate=!0,n}async function Hr(e,t){try{return await e.loadAsync(t)}catch{return Vr()}}async function Ur(e,t){let{manager:n,skyTex:r,envMap:i,lowPower:a,renderer:o}=t,s=Math.min(o.capabilities.getMaxAnisotropy(),8),c=new se(n),[l,u]=await Promise.all([Hr(c,zr),Hr(c,Br)]);for(let e of[l,u])e.colorSpace=L,e.wrapS=V,e.wrapT=p,e.generateMipmaps=!0,e.minFilter=v,e.anisotropy=s;let d=Gn(r,a);e.add(d.object);let f=Ir();e.add(f.object);let m=new Map,h=[];for(let t of Wt){let n;switch(t.id){case`mint`:n=Yn(t.radius,l,a);break;case`plumm`:n=Zn(t.radius,u,a);break;case`idrive`:n=sr(t.radius,a);break;case`agentic`:n=fr(t.radius,i,a,s);break;default:throw Error(`Unknown planet id: ${t.id}`)}n.group.position.copy(t.position),n.group.name=`planet-${t.id}`,e.add(n.group),m.set(t.id,n),h.push(Rr(n.group,t.id,t.radius,a))}return{update(e,t,n){d.update(e,t,n);for(let n of m.values())n.update(e,t);for(let n of h)n.update(e,t);f.update(e,n)},debugForceMeteor(e){f.debugForceSpawn(e)},setBlackHoleLayerVisible(e,t){d.setLayerVisible(e,t)},getBlackHoleLayerState(){return d.getLayerState()},setBlackHoleDebugBounds(e){d.setDebugBounds(e)},forEachMoonCollider(e){for(let t of h)t.forEachCollider(e)},dispose(){e.remove(d.object),d.dispose();for(let t of m.values())e.remove(t.group),t.dispose();m.clear();for(let e of h)e.dispose();h.length=0,e.remove(f.object),f.dispose(),l.dispose(),u.dispose()}}}var Wr=12e4,Gr=250,Kr=600,qr=108,Jr=5,Yr=new x;function Xr(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function Zr(e){return 1-Xr(Gr,Kr,e)}function Qr(e,t,n){Yr.copy(Z).sub(e);let r=Math.max(Yr.length(),Jr),i=Wr/(r*r)*Zr(r);Yr.normalize(),t.addScaledVector(Yr,i*n)}function $r(e){let t=Math.max(Z.distanceTo(e),Jr);return Wr/(t*t)*Zr(t)}var ei=`v4-leaderboard`,ti=10;function ni(e){if(!e||typeof e!=`object`)return!1;let t=e;return typeof t.nick==`string`&&typeof t.ms==`number`&&typeof t.date==`string`}function ri(){try{let e=window.localStorage.getItem(ei);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(ni):[]}catch{return[]}}function ii(){return ri().sort((e,t)=>e.ms-t.ms)}function ai(e,t){let n=e.trim().slice(0,16)||`PILOT`,r=ri();r.push({nick:n,ms:t,date:new Date().toISOString()}),r.sort((e,t)=>e.ms-t.ms);let i=r.slice(0,ti);try{window.localStorage.setItem(ei,JSON.stringify(i))}catch{}return i}var oi={mint:`Mint Apartments`,plumm:`Plumm`,idrive:`I DRIVE CARS`,agentic:`Agentic OS`};function si(e){let t=c(e);if(t.length>=2)return t.slice(0,2).map(e=>({src:e.srcSmall,alt:e.caption}));let n=oi[e];return[{src:`/projects/${e}/hero-card.webp`,alt:`${n} — podgląd interfejsu`},{src:`/projects/${e}/hero-full.webp`,alt:`${n} — drugi kadr interfejsu`}]}var ci=[`Kapitanie — misja: znajdź nowoczesną stronę dla swojego biznesu. Cztery światy na orbicie czarnej dziury.`,`Nie trać czasu — minuta tak blisko horyzontu to godzina na Ziemi.`,`Ten statek… przypomina Ci coś? Zbieg okoliczności.`],li=5e3,ui=25;function di(e,t,n){if(n)return e.textContent=t,()=>{};e.textContent=``;let r=0,i=0,a=()=>{r+=1,e.textContent=t.slice(0,r),r<t.length&&(i=window.setTimeout(a,ui))};return i=window.setTimeout(a,ui),()=>window.clearTimeout(i)}function fi(e,t){let n=document.createElement(`div`);n.className=`v4-comm`,n.innerHTML=`
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
  `,e.appendChild(n);let r=n.querySelector(`.v4-comm__panel`),i=n.querySelector(`.v4-comm__icon`),a=n.querySelector(`.v4-comm__collapse`),o=Array.from(n.querySelectorAll(`.v4-comm__line`)),s=n.querySelector(`.v4-comm__board`),c=n.querySelector(`.v4-comm__board-list`),l=n.querySelector(`.v4-comm__wave`),u=!1,d=[],f=[],p=0;function m(){for(let e of d)window.clearTimeout(e);for(let e of f)e();d=[],f=[]}function h(){ci.forEach((e,n)=>{let r=window.setTimeout(()=>{f.push(di(o[n],e,t.reducedMotion))},n*li);d.push(r)})}function g(){let e=ii().slice(0,3);if(e.length===0){s.hidden=!0;return}s.hidden=!1,c.innerHTML=e.map((e,t)=>`<li><span>${t+1}.</span><span>${Sn(e.nick)}</span><span>${vn(e.ms)}</span></li>`).join(``)}function _(e){let t=l.getContext(`2d`);if(!t)return;let n=l.width/8;t.clearRect(0,0,l.width,l.height),t.fillStyle=`#f5a524`;for(let r=0;r<8;r++){let i=l.height*(.22+.58*Math.abs(Math.sin(e+r*.7)));t.fillRect(r*n+1,l.height-i,n-2,i)}}function v(){if(t.reducedMotion){_(.6);return}let e=0,n=()=>{e+=.12,_(e),p=requestAnimationFrame(n)};n()}function y(){u=!1,r.classList.remove(`is-collapsed`),i.hidden=!0}function b(){u=!0,r.classList.add(`is-collapsed`),i.hidden=!1}r.addEventListener(`click`,e=>{e.target.closest(`.v4-comm__collapse`)||b()}),a.addEventListener(`click`,e=>{e.stopPropagation(),b()}),i.addEventListener(`click`,y);let x=e=>{e.code===`Enter`&&!u&&b()};return window.addEventListener(`keydown`,x),g(),h(),v(),t.startCollapsed&&b(),{dismiss(){u||b()},restart(){m();for(let e of o)e.textContent=``;y(),g(),h()},dispose(){m(),cancelAnimationFrame(p),window.removeEventListener(`keydown`,x),n.remove()}}}var pi=`${`https://marcinbochenek.com`.replace(/\/$/,``)}/#realizacje`;function mi(e){let t=document.createElement(`div`);t.className=`v4-project-panel`,t.setAttribute(`aria-hidden`,`true`),t.inert=!0,t.innerHTML=`
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
  `,e.appendChild(t);let n=t.querySelector(`.v4-project-panel__close`),r=t.querySelector(`.v4-project-panel__eyebrow`),i=t.querySelector(`.v4-project-panel__title`),a=t.querySelector(`.v4-project-panel__desc`),o=t.querySelector(`.v4-project-panel__shots`),s=t.querySelector(`.v4-project-panel__stack`),c=t.querySelector(`.v4-project-panel__live`),l=t.querySelector(`.v4-project-panel__status`);function u(){t.classList.remove(`is-open`),t.setAttribute(`aria-hidden`,`true`),t.inert=!0,document.documentElement.classList.remove(`v4-panel-open`)}return n.addEventListener(`click`,u),{show(e,n){r.textContent=e.tagline,i.textContent=e.title,a.textContent=bn(e.description,3),o.innerHTML=``;for(let e of n){let t=document.createElement(`img`);t.className=`v4-project-panel__shot`,t.src=e.src,t.alt=e.alt,t.loading=`lazy`,o.appendChild(t)}s.innerHTML=``;for(let t of e.stack??[]){let e=document.createElement(`span`);e.className=`v4-project-panel__chip`,e.textContent=t,s.appendChild(e)}Cn(e.url)&&e.id!==`idrive`&&e.id!==`agentic`?(c.href=e.url,c.hidden=!1,l.hidden=!0):(c.hidden=!0,c.removeAttribute(`href`),l.hidden=!1,l.textContent=e.domain),t.classList.add(`is-open`),t.setAttribute(`aria-hidden`,`false`),t.inert=!1,document.documentElement.classList.add(`v4-panel-open`)},hide:u,dispose(){t.remove()}}}var hi=2500;function gi(e){let t=document.createElement(`div`);t.className=`v4-toast`,t.setAttribute(`aria-live`,`polite`),t.setAttribute(`aria-hidden`,`true`),e.appendChild(t);let n=0;return{show(e){t.textContent=`ODKRYTO: ${e.toUpperCase()}`,t.classList.remove(`is-visible`),t.offsetWidth,t.classList.add(`is-visible`),t.setAttribute(`aria-hidden`,`false`),window.clearTimeout(n),n=window.setTimeout(()=>{t.classList.remove(`is-visible`),t.setAttribute(`aria-hidden`,`true`)},hi)},dispose(){window.clearTimeout(n),t.remove()}}}var _i=600;function vi(e,t){let n=document.createElement(`div`);n.className=`v4-horizon-flash`,e.appendChild(n);let r=document.createElement(`div`);r.className=`v4-overlay v4-overlay--gameover`,r.setAttribute(`aria-hidden`,`true`),r.inert=!0,r.innerHTML=`
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
  `,e.appendChild(n);let r=n.querySelector(`.v4-overlay__time-value`),i=n.querySelector(`.v4-overlay__dilation`),a=n.querySelector(`.v4-overlay__save`),o=n.querySelector(`.v4-overlay__nick`),s=n.querySelector(`.v4-overlay__button`),c=n.querySelector(`tbody`),l=n.querySelector(`.v4-overlay__restart`),u=e=>e.stopPropagation();o.addEventListener(`keydown`,u),o.addEventListener(`keyup`,u),a.addEventListener(`submit`,e=>{e.preventDefault(),!s.disabled&&(t.onSave(o.value),s.disabled=!0,o.disabled=!0,s.textContent=`Zapisano`)}),l.addEventListener(`click`,()=>t.onRestart());function d(e){c.innerHTML=e.slice(0,10).map((e,t)=>`<tr><td>${t+1}</td><td>${Sn(e.nick)}</td><td>${vn(e.ms)}</td><td>${yn(e.date)}</td></tr>`).join(``)}return{show(e,t){r.textContent=vn(e);let a=Math.round(e/1e3);i.textContent=`Na Ziemi minęło w tym czasie: ${Math.floor(a/60)}h ${a%60}min`,o.value=``,o.disabled=!1,s.disabled=!1,s.textContent=`Zapisz wynik`,d(t),n.setAttribute(`role`,`dialog`),n.setAttribute(`aria-labelledby`,`v4-completion-title`),n.classList.add(`is-visible`),n.setAttribute(`aria-hidden`,`false`),n.inert=!1,o.focus({preventScroll:!0})},updateBoard(e){d(e)},reset(){n.classList.remove(`is-visible`),n.removeAttribute(`role`),n.setAttribute(`aria-hidden`,`true`),n.inert=!0},dispose(){o.removeEventListener(`keydown`,u),o.removeEventListener(`keyup`,u),n.remove()}}}var $=n(),bi=new x(186,-42,648),xi=(()=>{let e=bi.clone().normalize(),t=new x().crossVectors(new x(0,1,0),e).normalize(),n=e.clone().negate(),r=t.clone().multiplyScalar(.2).addScaledVector(n,.8);r.normalize();let i=new B;return i.up.set(0,1,0),i.lookAt(r),i.quaternion.clone()})();function Si(){if(typeof navigator>`u`)return!1;let e=navigator.hardwareConcurrency??8,t=navigator.deviceMemory;return e<=4||t!==void 0&&t<=4}function Ci(){let e=(0,Ee.useRef)(null),t=(0,Ee.useRef)(null),n=(0,Ee.useRef)(null),r=(0,Ee.useRef)(null),i=(0,Ee.useRef)(null),a=(0,Ee.useRef)(null);return(0,Ee.useEffect)(()=>{let s=!1,c=null,l=null,u=null,d=null,f=null,p=null,m=null,h=null,g=null,_=null,v=null,y=null,b=null,S=null,C=null,w=null;async function T(){let T=e.current,E=t.current,D=n.current;if(!T||!E||!D)return;let O=T;w=O,E.tabIndex=0,E.setAttribute(`aria-label`,`Pole lotu — sterowanie statkiem`),E.focus({preventScroll:!0});let k=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,j=Si(),M=new ee;M.onProgress=(e,t,n)=>{let r=n>0?Math.round(t/n*100):0;a.current&&(a.current.style.width=`${r}%`),i.current&&(i.current.textContent=`WCZYTYWANIE MISJI… ${r}%`)},M.onError=e=>{e.includes(`normandy-sr2-joshuas-cc0.glb`)||console.error(`[v4] failed to load asset:`,e)};let P=await ct(E,{lowPower:j,reducedMotion:k,manager:M});if(s){P.dispose();return}c=P;let F=await Ce(M,P.envMap);if(s){F.dispose(),P.dispose();return}l=F,P.scene.add(F.group);let I=await Ur(P.scene,{manager:M,skyTex:P.skyTex,envMap:P.envMap,lowPower:j,renderer:P.renderer});if(s){I.dispose(),F.dispose(),P.dispose();return}u=I;let L=Ut(T);f=L;let R=Rt(bi,L.input);R.state.quaternion.copy(xi),d=R;let z=_n(P.camera),te=L.active||window.matchMedia(`(max-width: 480px), (hover: none)`).matches,ne=Dn(D,{touchActive:L.active,launchByTap:te,onLaunch:()=>{R.state.hasThrusted=!0}});p=ne;function B(e){O.classList.toggle(`is-prelaunch`,e),L.setArmed(!e)}B(!0),C=e=>{if(!te||!O.classList.contains(`is-prelaunch`))return;let t=e.target;t instanceof Element&&(t.closest(`a, .v4-loading, .v4-overlay, input, textarea, button.v4-comm__collapse, button.v4-comm__icon`)||(e.preventDefault(),R.state.hasThrusted=!0))},O.addEventListener(`pointerdown`,C),m=fi(D,{reducedMotion:k,startCollapsed:L.active}),h=mi(D),g=gi(D);let V=null,H=0,re=!1,U=!1,ie=!1,ae=new Set,W=null,se=!1;function G(){R.state.position.copy(bi),R.state.velocity.set(0,0,0),R.state.angularVelocity.set(0,0,0),R.state.bankAngle=0,R.state.quaternion.copy(xi),R.state.thrustLevel=0,R.state.brakeLevel=0,R.state.speed=0,R.state.hasThrusted=!1,se=!1,V=null,H=0,re=!1,U=!1,ie=!1,ae.clear(),W=null,h?.hide(),_?.reset(),v?.reset(),m?.restart(),ne.reset(),z.holdLaunch(bi,xi),B(!0)}_=vi(D,{reducedMotion:k,onRestart:()=>G()});let ce=yi(D,{onRestart:()=>G(),onSave:e=>{let t=ai(e,H);ce.updateBoard(t)}});v=ce,S=e=>{if(e.code!==`KeyR`)return;let t=e.target;t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||G()},window.addEventListener(`keydown`,S),b=()=>{P.setSize(O.clientWidth,O.clientHeight),R.state.hasThrusted||z.holdLaunch(bi,xi)},window.addEventListener(`resize`,b),b(),z.holdLaunch(bi,xi);let le=!1,K=new x,q=new x,J=null;new URLSearchParams(window.location.search).has(`debug`)&&(J=new A(F.group,16763972),J.name=`ship-debug-bounds`,J.visible=!1,P.scene.add(J),window.__v4={teleport(e,t){le=!0,K.set(e[0],e[1],e[2]),q.set(t[0],t[1],t[2])},spawnMeteor(e){I.debugForceMeteor(e)},getShipPos(){let e=R.state.position;return[e.x,e.y,e.z]},haltShip(){R.state.velocity.set(0,0,0),R.state.angularVelocity.set(0,0,0)},getHullSource(){return F.group.userData.hullSource??`unknown`},setShipVisible(e){F.group.visible=e},getChaseInfo(){let e=P.camera.position.clone().sub(F.group.position),t=new x(0,1,0).applyQuaternion(F.group.quaternion),n=new x(0,0,-1).applyQuaternion(F.group.quaternion);return{heightDot:e.dot(t),backDot:-e.dot(n),dist:e.length(),upDot:t.dot(new x(0,1,0))}},getScreenAabbs(){let e=P.camera,t=P.renderer.domElement,n=t.clientWidth,r=t.clientHeight,i=t=>{let i=[new x(t.min.x,t.min.y,t.min.z),new x(t.min.x,t.min.y,t.max.z),new x(t.min.x,t.max.y,t.min.z),new x(t.min.x,t.max.y,t.max.z),new x(t.max.x,t.min.y,t.min.z),new x(t.max.x,t.min.y,t.max.z),new x(t.max.x,t.max.y,t.min.z),new x(t.max.x,t.max.y,t.max.z)],a=1/0,o=1/0,s=-1/0,c=-1/0;for(let t of i){t.project(e);let i=(t.x*.5+.5)*n,l=(-t.y*.5+.5)*r;a=Math.min(a,i),s=Math.max(s,i),o=Math.min(o,l),c=Math.max(c,l)}return{left:a,top:o,right:s,bottom:c}},a=new oe().setFromObject(F.group),o=qr*2,s=new oe().setFromCenterAndSize(Z,new x(o,o,o));return{ship:i(a),bh:i(s),viewport:{w:n,h:r}}},setShipPos(e){R.state.position.set(e[0],e[1],e[2]),R.state.velocity.set(0,0,0),R.state.angularVelocity.set(0,0,0)},getCameraPhase(){return le?`debug-teleport`:z.getPhase()},getProbe(){let e=P.camera,t=R.state.position,n=new x(0,0,-1).applyQuaternion(e.quaternion),r=t.clone().sub(e.position),i=Z.clone().sub(e.position),a=r.length(),o=i.length(),s=r.dot(n),c=i.dot(n),l=Math.abs(s-c)<.5?`equal`:s<c?`ship`:`bh`,u=r.clone().normalize(),d=e.position.clone().sub(Z),f=d.dot(u),p=d.lengthSq()-11664,m=f*f-p,h=null;if(m>=0){let e=-f-Math.sqrt(m),t=-f+Math.sqrt(m);h=e>.02?e:t>.02?t:null}return{phase:le?`debug-teleport`:z.getPhase(),hasThrusted:R.state.hasThrusted,camera:{pos:[e.position.x,e.position.y,e.position.z],fwd:[n.x,n.y,n.z]},ship:[t.x,t.y,t.z],bh:[Z.x,Z.y,Z.z],distShipBh:t.distanceTo(Z),distCamShip:a,distCamBh:o,camSpace:{shipFwd:s,bhFwd:c,closer:l},rayThroughShip:{tShip:a,tHorizon:h,sphereHitsBeforeShip:h!==null&&h<a-.05},layers:I.getBlackHoleLayerState()}},setBhLayer(e,t){I.setBlackHoleLayerVisible(e,t)},getBhLayers(){return I.getBlackHoleLayerState()},showBounds(e){I.setBlackHoleDebugBounds(e),J&&(J.visible=e,e&&J.update())}});let Y=new x,X=new N,ue=new x(0,0,1);y=P.onTick((e,t)=>{let n=!ie;if(n){R.state.hasThrusted&&Qr(R.state.position,R.state.velocity,e),R.update(e),!R.state.hasThrusted&&!le&&(R.state.position.copy(bi),R.state.velocity.set(0,0,0),R.state.angularVelocity.set(0,0,0),R.state.quaternion.copy(xi),R.state.bankAngle=0),F.group.position.copy(R.state.position),J?.visible&&J.update(),X.setFromAxisAngle(ue,R.state.bankAngle),F.group.quaternion.copy(R.state.quaternion).multiply(X),F.updateThrust(R.state.thrustLevel,t),R.state.hasThrusted&&!se&&(se=!0,B(!1),re||(re=!0,V=t),m?.dismiss()),re&&V!==null&&(H=(t-V)*1e3),R.state.position.distanceTo(Z)<qr&&(ie=!0,R.state.velocity.set(0,0,0),R.state.angularVelocity.set(0,0,0),_?.trigger());for(let e of Wt){let t=R.state.position.distanceTo(e.position),n=e.radius*2.5,r=e.radius*3.5;if(t<n&&W!==e.id){W=e.id;let t=o.find(t=>t.id===e.id);t&&(ae.has(e.id)||(ae.add(e.id),g?.show(t.title),ae.size===Wt.length&&!U&&(U=!0,re=!1,v?.show(H,ii()))),h?.show(t,si(e.id)))}else W===e.id&&t>r&&(W=null,h?.hide())}for(let e of Wt){Y.copy(R.state.position).sub(e.position);let t=e.radius*1.12+2,n=Y.length();if(n<t&&n>1e-4){Y.multiplyScalar(1/n),R.state.position.copy(e.position).addScaledVector(Y,t);let r=R.state.velocity.dot(Y);r<0&&R.state.velocity.addScaledVector(Y,-r)}}I.forEachMoonCollider((e,t)=>{Y.copy(R.state.position).sub(e);let n=t*1.2+1.4,r=Y.length();if(r<n&&r>1e-4){Y.multiplyScalar(1/r),R.state.position.copy(e).addScaledVector(Y,n);let t=R.state.velocity.dot(Y);t<0&&R.state.velocity.addScaledVector(Y,-t)}})}le?(P.camera.position.copy(K),P.camera.lookAt(q)):n&&z.update(e,R.state.position,R.state.quaternion,R.state.thrustLevel,R.state.bankAngle,R.state.angularVelocity,{hasThrusted:R.state.hasThrusted,reducedMotion:window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}),P.dust.update(P.camera.position,R.state.velocity),I.update(e,t,P.camera),ne.update({speed:R.state.speed,thrust:R.state.thrustLevel,hasThrusted:R.state.hasThrusted,missionMs:H,discovered:ae,gravityAccel:n?$r(R.state.position):0})}),P.start(),r.current&&(r.current.classList.add(`is-hidden`),r.current.setAttribute(`aria-busy`,`false`),r.current.setAttribute(`aria-hidden`,`true`))}return T().catch(e=>{console.error(`[v4] init failed`,e);let t=r.current;t&&(t.classList.add(`is-error`),t.setAttribute(`aria-busy`,`false`)),i.current&&(i.current.textContent=`Nie udało się wczytać misji. Odśwież stronę.`)}),()=>{s=!0,b&&window.removeEventListener(`resize`,b),S&&window.removeEventListener(`keydown`,S),C&&w&&w.removeEventListener(`pointerdown`,C),y?.(),delete window.__v4,v?.dispose(),_?.dispose(),g?.dispose(),h?.dispose(),m?.dispose(),p?.dispose(),d?.dispose(),f?.dispose(),u?.dispose(),l?.dispose(),c?.stop(),c?.dispose()}},[]),(0,$.jsxs)(`div`,{className:`v4-root is-prelaunch`,ref:e,children:[(0,$.jsx)(`canvas`,{className:`v4-canvas`,ref:t}),(0,$.jsx)(`div`,{className:`v4-hud-container`,ref:n}),(0,$.jsxs)(`div`,{className:`v4-loading`,ref:r,"aria-live":`polite`,"aria-busy":`true`,role:`status`,children:[(0,$.jsx)(`div`,{className:`v4-loading__label`,ref:i,children:`WCZYTYWANIE MISJI… 0%`}),(0,$.jsx)(`div`,{className:`v4-loading__bar`,children:(0,$.jsx)(`div`,{className:`v4-loading__bar-fill`,ref:a})})]})]})}var wi=s.portfolioUrl.replace(/\/$/,``),Ti=`${wi}/#realizacje`;function Ei(){let{locale:e}=i(),t=a(e).v4Fallback;return(0,$.jsx)(`div`,{className:`v4-fallback`,children:(0,$.jsxs)(`div`,{className:`v4-fallback__card`,children:[(0,$.jsx)(`p`,{className:`v4-fallback__eyebrow`,children:t.eyebrow}),(0,$.jsx)(`h1`,{className:`v4-fallback__title`,children:t.title}),(0,$.jsx)(`p`,{className:`v4-fallback__lead`,children:t.lead}),(0,$.jsx)(`div`,{className:`v4-fallback__list`,children:o.map(e=>(0,$.jsxs)(`a`,{className:`v4-fallback__item`,href:Cn(e.url)?e.url:Ti,target:`_blank`,rel:`noopener noreferrer`,children:[(0,$.jsx)(`span`,{className:`v4-fallback__item-title`,children:e.title}),(0,$.jsx)(`span`,{className:`v4-fallback__item-tagline`,children:e.tagline})]},e.id))}),(0,$.jsxs)(`div`,{className:`v4-fallback__actions`,children:[(0,$.jsx)(`a`,{className:`v4-fallback__cta`,href:Ti,children:t.seeWork}),(0,$.jsx)(`a`,{className:`v4-fallback__back`,href:wi,children:t.back})]}),(0,$.jsxs)(`p`,{className:`v4-fallback__hint`,children:[t.hintBefore,(0,$.jsx)(`a`,{href:s.gameUrl,rel:`noopener`,children:s.gameUrl.replace(/^https?:\/\//,``)}),t.hintAfter]})]})})}function Di(){if(typeof window>`u`)return!1;try{return!!document.createElement(`canvas`).getContext(`webgl2`)}catch{return!1}}function Oi(){let[e]=(0,Ee.useState)(Di);return e?(0,$.jsx)(Ci,{}):(0,$.jsx)(Ei,{})}(0,Te.createRoot)(document.getElementById(`root`)).render((0,$.jsx)(r,{children:(0,$.jsx)(Oi,{})}));