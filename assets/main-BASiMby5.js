import{n as e,r as t,t as n}from"./jsx-runtime-i9uBjpvk.js";import{n as r,o as i,r as a}from"./i18n-C1tP8KwJ.js";/* empty css            */import{d as o,g as s}from"./live-C7cvPOC7.js";import{t as c}from"./gallery-jI0pM9Zk.js";import{$ as l,C as u,Ct as d,D as f,Dt as p,E as m,Et as h,H as g,I as _,J as v,K as y,M as b,Nt as x,Ot as S,P as C,Pt as w,S as T,St as E,U as D,W as O,Y as k,Z as A,_t as j,b as M,ct as N,dt as P,et as F,ft as I,gt as L,h as R,ht as z,it as B,kt as V,l as ee,nt as H,pt as U,q as te,tt as W,u as G,ut as ne,v as re,vt as ie,w as K,wt as ae,x as q,xt as J,y as oe,yt as Y}from"./three-Cp78jkzt.js";import{a as se,c as ce,d as X,i as Z,n as le,o as ue,p as de,r as fe}from"./build-BRS2wQJO.js";import{r as pe}from"./heroSceneTypes-BBcQTCIc.js";import{a as me,c as he,d as ge,i as _e,l as ve,o as ye,r as be,s as xe,t as Se,u as Ce}from"./buildShipV2-C1xV7l9K.js";var we=e(),Te=t(),Ee=180,De=Ee/2,Oe=2600,ke=1200,Ae=900,je=400,Me=12,Ne=60,Pe=.5,Fe=70,Ie=.1,Le=.35;function Re(){let e=document.createElement(`canvas`);e.width=e.height=32;let t=e.getContext(`2d`),n=t.createRadialGradient(16,16,0,16,16,16);return n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.5,`rgba(255,255,255,0.5)`),n.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=n,t.fillRect(0,0,32,32),new u(e)}function ze(e,t){let n=e-t;for(;n>De;)n-=Ee;for(;n<-90;)n+=Ee;return t+n}var Be=`
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
`,Ve=`
  precision mediump float;
  uniform sampler2D uMap;
  uniform float uOpacity;
  varying vec3 vTint;
  void main() {
    vec4 tex = texture2D(uMap, gl_PointCoord);
    gl_FragColor = vec4(vTint * tex.rgb, tex.a * uOpacity);
  }
`;function He(e){let t=e?ke:Oe,n=e?je:Ae,r=Re(),i=new Float32Array(t*3),a=new Float32Array(t),o=new Float32Array(t*3);for(let e=0;e<t;e++){let t=e*3;i[t+0]=(Math.random()-.5)*Ee,i[t+1]=(Math.random()-.5)*Ee,i[t+2]=(Math.random()-.5)*Ee,a[e]=.1+Math.random()*.25;let n=Math.random();n<.04?(o[t+0]=.72,o[t+1]=.83,o[t+2]=1):n<.08?(o[t+0]=1,o[t+1]=.9,o[t+2]=.74):(o[t+0]=1,o[t+1]=1,o[t+2]=1)}let s=new T;s.setAttribute(`position`,new q(i,3)),s.setAttribute(`aSize`,new q(a,1)),s.setAttribute(`aTint`,new q(o,3));let c=new Y({uniforms:{uMap:{value:r},uOpacity:{value:Ie},uSizeMul:{value:260}},vertexShader:Be,fragmentShader:Ve,transparent:!0,depthWrite:!1,depthTest:!0,blending:2}),u=new I(s,c);u.frustumCulled=!1,u.renderOrder=2;let d=new Float32Array(n*3);for(let e=0;e<n;e++){let t=e*3;d[t+0]=(Math.random()-.5)*Ee,d[t+1]=(Math.random()-.5)*Ee,d[t+2]=(Math.random()-.5)*Ee}let f=new Float32Array(n*2*3),p=new T,m=new q(f,3);m.setUsage(C),p.setAttribute(`position`,m);let h=new y({color:13623551,transparent:!0,opacity:0,depthWrite:!1,depthTest:!0,blending:2}),_=new te(p,h);_.frustumCulled=!1,_.renderOrder=2;let v=new g;return v.name=`dust-field`,v.add(u),v.add(_),{object:v,update(e,r){for(let n=0;n<t;n++){let t=n*3;i[t+0]=ze(i[t+0],e.x),i[t+1]=ze(i[t+1],e.y),i[t+2]=ze(i[t+2],e.z)}s.attributes.position.needsUpdate=!0;let a=r.length(),o=l.clamp(a/Fe,0,1);c.uniforms.uOpacity.value=l.lerp(Ie,Le,o);let u=0,m=0,g=-1;if(a>1e-4){let e=1/a;u=r.x*e,m=r.y*e,g=r.z*e}let _=l.clamp(a*.06,.3,4.5);for(let t=0;t<n;t++){let n=t*3;d[n+0]=ze(d[n+0],e.x),d[n+1]=ze(d[n+1],e.y),d[n+2]=ze(d[n+2],e.z);let r=d[n+0],i=d[n+1],a=d[n+2],o=t*6;f[o+0]=r,f[o+1]=i,f[o+2]=a,f[o+3]=r-u*_,f[o+4]=i-m*_,f[o+5]=a-g*_}p.attributes.position.needsUpdate=!0,h.opacity=l.clamp((a-Me)/(Ne-Me),0,1)*Pe},dispose(){s.dispose(),c.dispose(),p.dispose(),h.dispose(),r.dispose()}}}var Ue=1500,We=1600,Ge=20260712,Ke=`
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
`,qe=`
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
`;function Je(e){let t=e?800:Ue,n=ge(Ge),r=new Float32Array(t*3),i=new Float32Array(t),a=new Float32Array(t),o=new Float32Array(t),s=new Float32Array(t*3),c=new f(16777215),l=new f(12571903),u=new f(16769208),d=new f;for(let e=0;e<t;e++){let t,f,p,m;do t=n()*2-1,f=n()*2-1,p=n()*2-1,m=t*t+f*f+p*p;while(m<.01||m>1);let h=We/Math.sqrt(m);r[e*3]=t*h,r[e*3+1]=f*h,r[e*3+2]=p*h,i[e]=n()*Math.PI*2,a[e]=.5+n()*2.2,o[e]=.5+n()**2.4*1.9;let g=n();g<.12?d.copy(l):g<.2?d.copy(u):d.copy(c),d.multiplyScalar(.55+n()*.45),s[e*3]=d.r,s[e*3+1]=d.g,s[e*3+2]=d.b}let p=new T;p.setAttribute(`position`,new q(r,3)),p.setAttribute(`aPhase`,new q(i,1)),p.setAttribute(`aSpeed`,new q(a,1)),p.setAttribute(`aSize`,new q(o,1)),p.setAttribute(`aColor`,new q(s,3)),p.boundingSphere=new J(new w,1601);let m=new Y({uniforms:{uTime:{value:0}},vertexShader:Ke,fragmentShader:qe,transparent:!0,depthWrite:!1,depthTest:!0,blending:2}),h=new I(p,m);return h.frustumCulled=!1,h.renderOrder=0,h.name=`starfield-twinkle`,{object:h,update(e,t,n){h.position.copy(e),h.rotation.y=n,m.uniforms.uTime.value=t},dispose(){p.dispose(),m.dispose()}}}var Ye=`/v4/assets/skybox-8k.jpg`,Xe=`/v4/assets/skybox-4k.jpg`,Ze=`/v4/assets/skybox-2k.jpg`;function Qe(){return typeof navigator>`u`?!1:!!navigator.connection?.saveData}function $e(){return typeof navigator>`u`?!1:navigator.userAgentData?.mobile===!0?!0:/iPhone|iPod|Android.+Mobile/i.test(navigator.userAgent)}function et(e,t){return t?[Ze]:e>=8192?[Ye,Xe,Ze]:e>=4096?(console.warn(`[v4] GPU maxTextureSize=${e} < 8192; sky fallback ${Xe}`),[Xe,Ze]):(console.warn(`[v4] GPU maxTextureSize=${e} < 4096; sky fallback ${Ze}`),[Ze])}async function tt(e,t){let n;for(let r of t)try{return{texture:await e.loadAsync(r),url:r}}catch(e){n=e,console.error(`[v4] sky texture failed to load: ${r}`,e)}throw n instanceof Error?n:Error(`[v4] sky texture failed to load: ${t.join(` → `)}`)}function nt(e){e.mapping=303,e.colorSpace=j,e.generateMipmaps=!1,e.minFilter=v,e.magFilter=v,e.wrapS=z,e.wrapT=m,e.anisotropy=1,e.needsUpdate=!0}var rt=4500,it=`
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
`,at=`
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
`;function ot(e){let t=new E(rt,64,40),n=new Y({uniforms:{uSky:{value:e},uSkyRot:{value:0}},vertexShader:it,fragmentShader:at,side:1,depthWrite:!1,depthTest:!1}),r=new W(t,n);return r.frustumCulled=!1,r.renderOrder=-2,r.name=`sky-dome`,{mesh:r,setYaw(e){n.uniforms.uSkyRot.value=e},dispose(){t.dispose(),n.dispose()}}}async function st(e,t){let{lowPower:n,manager:r,reducedMotion:i}=t,a=typeof location<`u`&&new URLSearchParams(location.search).has(`debug`),o=new G({canvas:e,antialias:!n,alpha:!1,powerPreference:n?`default`:`high-performance`,preserveDrawingBuffer:a});o.setPixelRatio(pe(n)),o.setClearColor(0,1),o.toneMapping=4,o.toneMappingExposure=1.18,o.outputColorSpace=j;let s=new ie,c=new ne(60,1,.8,6e3);c.position.set(0,4,16);let l=new P(13688042,250,120,2);c.add(l),s.add(c);let u=new h(r),d=n||Qe()||$e(),f=et(o.capabilities.maxTextureSize,d),m=f[0]===Ze?Promise.resolve(null):u.loadAsync(Ze).catch(e=>(console.error(`[v4] env sky texture failed to load: ${Ze}`,e),null)),[{texture:g,url:_},v]=await Promise.all([tt(u,f),m]);nt(g);let y=ot(g);s.add(y.mesh);let S=v??g;v&&(v.mapping=303,v.colorSpace=j);let C=new ee(o);C.compileEquirectangularShader();let w=C.fromEquirectangular(S);s.environment=w.texture;let T=w.texture;if(v?.dispose(),a){let e=g.image;window.__v4Sky={url:_,imageWidth:e?.width??0,imageHeight:e?.height??0,generateMipmaps:g.generateMipmaps,minFilter:g.minFilter,magFilter:g.magFilter,wrapS:g.wrapS,colorSpace:g.colorSpace,anisotropy:g.anisotropy,maxTextureSize:o.capabilities.maxTextureSize,constrained:d}}s.add(new D(9085128,658448,.55));let E=new b(16773596,1.65);E.position.set(600,400,250),s.add(E);let O=new b(11847396,.95);O.position.set(-420,260,-380),s.add(O);let k=new P(16760944,130,520,1.7);k.position.set(0,0,0),s.add(k);let A=He(n);s.add(A.object);let M=Je(n);s.add(M.object);let N=new se(o,{multisampling:n?0:4});N.addPass(new X(s,c));let F=new le({intensity:i?.1:n?.12:.16,luminanceThreshold:.985,luminanceSmoothing:.06,mipmapBlur:!0}),I=new de({offset:.52,darkness:.22}),L=[F,new fe({contrast:.02,brightness:0}),new ce({saturation:-.02}),I];if(!n&&!i){let e=new Z({offset:new x(9e-4,9e-4),radialModulation:!0,modulationOffset:.15});L.splice(1,0,e)}N.addPass(new ue(c,...L));let R=new p;a||R.connect(document);let z=new Set,B=0,V=!1,H=e=>a&&document.hidden?setTimeout(()=>e(performance.now()),16):requestAnimationFrame(e),U=e=>{if(!V)return;R.update(e);let t=Math.min(.05,R.getDelta()),n=R.getElapsed();for(let e of z)e(t,n);let r=n*xe;y.setYaw(r),M.update(c.position,n,r),N.render(t),B=H(U)};return{renderer:o,scene:s,camera:c,composer:N,dust:A,envMap:T,skyTex:g,setSize(e,t){e<2||t<2||(o.setSize(e,t,!1),N.setSize(e,t),c.aspect=e/Math.max(t,1),c.updateProjectionMatrix())},onTick(e){return z.add(e),()=>z.delete(e)},start(){V||(V=!0,R.reset(),B=H(U))},stop(){V=!1,clearTimeout(B),cancelAnimationFrame(B)},dispose(){V=!1,clearTimeout(B),cancelAnimationFrame(B),R.dispose(),z.clear(),A.dispose(),M.dispose(),y.dispose(),s.traverse(e=>{if(e instanceof W){let t=Array.isArray(e.material)?e.material:[e.material];for(let e of t)e?.dispose()}}),w.dispose(),C.dispose(),g.dispose(),N.dispose(),o.dispose(),o.getContext().getExtension(`WEBGL_lose_context`)?.loseContext()}}}var ct=22,lt=ct/5;ct*.42,lt*.42,ct*.16,new f(5093631),new f(10475775),new f(15398655),new f(3787263),`${be}${ve}`;var ut=new w(1,0,0),dt=new w(0,1,0),ft=Math.PI/180,pt=1.9,mt=6.5,ht=8,gt=1.15,_t=7,vt=9,yt=52*ft,bt=20*ft,xt=5,St=.1,Ct=30,wt=.999,Tt=92,Et=4.2,Dt=2.4,Ot=new Set([`Space`]),kt=new Set([`ShiftLeft`,`ShiftRight`]),At=new Set([`KeyW`,`ArrowUp`]),jt=new Set([`KeyS`,`ArrowDown`]),Mt=new Set([`KeyA`,`ArrowLeft`]),Nt=new Set([`KeyD`,`ArrowRight`]),Pt=new Set([`KeyQ`]),Ft=new Set([`KeyE`]),It=new Set([`Space`,`ArrowUp`,`ArrowDown`,`ArrowLeft`,`ArrowRight`]);function Lt(e,t){let n=new Set,r={position:e.clone(),quaternion:new U,velocity:new w,angularVelocity:new w,bankAngle:0,thrustLevel:0,brakeLevel:0,speed:0,hasThrusted:!1},i=e=>{n.add(e.code),It.has(e.code)&&e.preventDefault()},a=e=>{n.delete(e.code)},o=()=>n.clear();window.addEventListener(`keydown`,i,{passive:!1}),window.addEventListener(`keyup`,a),window.addEventListener(`blur`,o);let s=e=>{for(let t of e)if(n.has(t))return!0;return!1},c=new w,l=new U,u=new U,d=new _(0,0,0,`YXZ`);return{state:r,update(e){let n=0;s(At)&&--n,s(jt)&&(n+=1),t&&(t.pitch!==0||n===0)&&(n=Math.max(-1,Math.min(1,n+t.pitch)));let i=n*pt,a=n===0?ht:mt;r.angularVelocity.x+=(i-r.angularVelocity.x)*Math.min(1,a*e),r.angularVelocity.x*=Math.exp(-3.2*e);let o=0;s(Mt)&&(o+=1),s(Nt)&&--o,t&&(t.turn!==0||o===0)&&(o=Math.max(-1,Math.min(1,o+t.turn)));let f=o*gt,p=f===0?vt:_t;r.angularVelocity.y+=(f-r.angularVelocity.y)*Math.min(1,p*e);let m=St*Math.abs(r.angularVelocity.y)/gt,h=0;s(Pt)&&(h+=1),s(Ft)&&--h;let g=r.angularVelocity.y/gt*yt+h*bt;r.bankAngle+=(g-r.bankAngle)*Math.min(1,xt*e),r.angularVelocity.z=0,l.setFromAxisAngle(ut,(r.angularVelocity.x+m)*e),u.setFromAxisAngle(dt,r.angularVelocity.y*e),r.quaternion.multiply(l).multiply(u),r.quaternion.normalize(),d.setFromQuaternion(r.quaternion,`YXZ`),Math.abs(d.x)<1.35&&(d.z=0,r.quaternion.setFromEuler(d));let _=s(Ot)||(t?.thrust??!1),v=s(kt)||(t?.brake??!1);_&&(r.hasThrusted=!0),c.set(0,0,-1).applyQuaternion(r.quaternion);let y=r.velocity.length();if(_){let t=Math.max(0,1-(y/Tt)**2);r.velocity.addScaledVector(c,54*t*e)}if(v&&y>.05){let t=r.velocity.clone().normalize(),n=Math.min(Ct*e,y);r.velocity.addScaledVector(t,-n)}r.velocity.multiplyScalar(wt),r.position.addScaledVector(r.velocity,e),r.speed=r.velocity.length();let b=+!!_,x=_?Et:Dt;r.thrustLevel+=(b-r.thrustLevel)*Math.min(1,x*e),r.brakeLevel+=(+!!v-r.brakeLevel)*Math.min(1,4*e)},dispose(){window.removeEventListener(`keydown`,i),window.removeEventListener(`keyup`,a),window.removeEventListener(`blur`,o),n.clear()}}}var Rt=52,zt=.12;function Bt(e,t,n){return Math.max(t,Math.min(n,e))}function Vt(e){let t=Math.abs(e);return t<zt?0:Math.sign(e)*((t-zt)/(1-zt))}function Ht(e){let t={pitch:0,turn:0,thrust:!1,brake:!1};if(!window.matchMedia(`(pointer: coarse)`).matches)return{input:t,active:!1,setArmed(){},dispose(){}};let n=document.createElement(`div`);n.className=`v4-touch is-prelaunch`,n.setAttribute(`aria-hidden`,`true`),n.innerHTML=`
    <div class="v4-touch__stick-zone" aria-hidden="true">
      <div class="v4-touch__stick-ring"></div>
      <div class="v4-touch__stick-knob"></div>
    </div>
    <div class="v4-touch__actions">
      <button type="button" class="v4-touch__btn v4-touch__btn--brake" data-action="brake" aria-label="Hamowanie">HAM</button>
      <button type="button" class="v4-touch__btn v4-touch__btn--thrust" data-action="thrust" aria-label="Ciąg główny">CIĄG</button>
    </div>
  `,e.appendChild(n);let r=n.querySelector(`.v4-touch__stick-zone`),i=n.querySelector(`.v4-touch__stick-knob`),a=n.querySelector(`[data-action="thrust"]`),o=n.querySelector(`[data-action="brake"]`),s=null,c=0,l=0;function u(){s=null,t.pitch=0,t.turn=0,i.style.transform=`translate(-50%, -50%)`}function d(e,n){let r=e-c,a=n-l,o=Math.hypot(r,a),s=o>Rt?Rt/o:1,u=r*s/Rt,d=a*s/Rt;i.style.transform=`translate(calc(-50% + ${u*Rt}px), calc(-50% + ${d*Rt}px))`,t.pitch=Vt(Bt(-d,-1,1)),t.turn=Vt(Bt(u,-1,1))}let f=e=>{if(s!==null)return;s=e.pointerId;let t=r.getBoundingClientRect();c=t.left+t.width/2,l=t.top+t.height/2,d(e.clientX,e.clientY);try{r.setPointerCapture(e.pointerId)}catch{}e.preventDefault()},p=e=>{e.pointerId===s&&(d(e.clientX,e.clientY),e.preventDefault())},m=e=>{e.pointerId===s&&(r.releasePointerCapture(e.pointerId),u(),e.preventDefault())};r.addEventListener(`pointerdown`,f),r.addEventListener(`pointermove`,p),r.addEventListener(`pointerup`,m),r.addEventListener(`pointercancel`,m);let h=(e,n,r)=>{t[r]=n,e.classList.toggle(`is-active`,n)},g=(e,t)=>{let n=n=>{h(e,!0,t);try{e.setPointerCapture(n.pointerId)}catch{}n.preventDefault()},r=n=>{e.hasPointerCapture(n.pointerId)&&e.releasePointerCapture(n.pointerId),h(e,!1,t),n.preventDefault()};return e.addEventListener(`pointerdown`,n),e.addEventListener(`pointerup`,r),e.addEventListener(`pointercancel`,r),()=>{e.removeEventListener(`pointerdown`,n),e.removeEventListener(`pointerup`,r),e.removeEventListener(`pointercancel`,r)}},_=g(a,`thrust`),v=g(o,`brake`),y=()=>{u(),h(a,!1,`thrust`),h(o,!1,`brake`)};return window.addEventListener(`blur`,y),{input:t,active:!0,setArmed(e){n.classList.toggle(`is-prelaunch`,!e),n.setAttribute(`aria-hidden`,e?`false`:`true`),e||(u(),h(a,!1,`thrust`),h(o,!1,`brake`))},dispose(){window.removeEventListener(`blur`,y),r.removeEventListener(`pointerdown`,f),r.removeEventListener(`pointermove`,p),r.removeEventListener(`pointerup`,m),r.removeEventListener(`pointercancel`,m),_(),v(),n.remove()}}}var Ut=.15,Wt=6.8,Gt=56,Kt=48,qt=2.4,Jt=55,Yt=60,Xt=58,Zt=62,Qt=6.5,$t=10,en=16,tn=18,nn=13,rn=400,an=6,on=50,sn=.95,cn=.45,ln=.9,un=new w(0,1,0),dn=new w(0,0,-1),fn=new w(0,1,0);function pn(e,t){return!Number.isFinite(e.x+e.y+e.z)||e.lengthSq()<1e-10?t.clone():e.normalize()}function mn(e){return e>0&&e<.62?{back:1.95,height:1.08,side:.68,fov:55,pull:.78,lookLift:6}:e>0&&e<.85?{back:1.55,height:1.12,side:.78,fov:53,pull:.88,lookLift:2}:{back:1,height:1,side:1,fov:on,pull:1,lookLift:0}}function hn(e){let t=l.clamp(e,0,1);return t*t*(3-2*t)}function gn(e){let t=new w,n=new w,r=new w,i=new w,a=new w,o=new w(Ut,Wt,Gt),s=new w,c=new w,u=new w,d=new w,f=new w,p=new U,m=new U,h=new w,g=new U,_=new ne;_.up.copy(un);let v=0,y=on,b=`launch`,x=0,S=!1;e.fov=Jt,e.updateProjectionMatrix();function C(t,n){let a=mn(e.aspect);r.set(0,0,-1).applyQuaternion(n),pn(r,dn),i.set(0,1,0).applyQuaternion(n),pn(i,fn),u.set(1,0,0).applyQuaternion(n),u.lengthSq()<1e-8&&u.crossVectors(r,un),u.normalize(),d.copy(t).addScaledVector(r,-50*a.back).addScaledVector(un,tn*a.height).addScaledVector(u,nn*a.side),f.copy(t).addScaledVector(r,rn*a.pull).addScaledVector(un,an+a.lookLift),y=a.fov,_.position.copy(d),_.up.copy(un),_.lookAt(f),p.copy(_.quaternion)}function T(){e.position.copy(d),e.quaternion.copy(p),e.up.copy(un),Math.abs(e.fov-y)>.01&&(e.fov=y,e.updateProjectionMatrix())}function E(e,t){b=`launch`,x=0,S=!1,v=0,s.set(0,0,0),o.set(Ut,Wt,Gt),C(e,t),T()}function D(u,d,f,p,h){let g=Number.isFinite(u)&&u>0?Math.min(u,.05):1/60,y=h?Math.min(Math.hypot(h.x,h.y),12):0,b=h?l.clamp(-h.y*cn,-.9,ln):0,x=h?l.clamp(h.x*cn,-.9,ln):0,S=1-Math.exp(-8*g);s.x+=(b-s.x)*S,s.y+=(x-s.y)*S;let C=l.clamp(Number.isFinite(p)?p:0,0,1),w=C*Qt;v+=(w-v)*(1-Math.exp(-4.5*g)),a.set(Ut+s.x,Wt+s.y,Gt+v);let T=1-Math.exp(-($t+y*en)*g);o.lerp(a,T),t.copy(o).applyQuaternion(f).add(d),r.set(0,0,-1).applyQuaternion(f),pn(r,dn),i.set(0,1,0).applyQuaternion(f),pn(i,fn),n.copy(d).addScaledVector(r,Kt).addScaledVector(i,qt),_.position.copy(t),c.copy(n).sub(t),c.lengthSq()>1e-8?(c.normalize(),_.up.copy(Math.abs(c.dot(un))>.92?i:un)):_.up.copy(un),_.lookAt(n),m.copy(_.quaternion);let E=e.aspect>0&&e.aspect<.85,D=E?Xt:Jt,O=E?Zt:Yt;return{fov:l.lerp(D,O,C*C)}}function O(n){e.position.copy(t),e.quaternion.copy(m),e.up.copy(_.up),Math.abs(e.fov-n)>.01&&(e.fov=n,e.updateProjectionMatrix())}return{holdLaunch:E,getPhase(){return b},update(n,r,i,a,o,s,c){if(!c.hasThrusted){E(r,i);return}S||(S=!0,C(r,i),h.copy(e.position),g.copy(e.quaternion),c.reducedMotion?(b=`chase`,x=1):(b=`blend`,x=0));let u=D(n,r,i,a,s);if(b===`blend`){x=Math.min(1,x+(Number.isFinite(n)&&n>0?Math.min(n,.05):1/60)/sn);let r=hn(x);e.position.lerpVectors(h,t,r),e.quaternion.slerpQuaternions(g,m,r),e.up.copy(un).lerp(_.up,r).normalize();let i=l.lerp(y,u.fov,r);Math.abs(e.fov-i)>.01&&(e.fov=i,e.updateProjectionMatrix()),x>=1&&(b=`chase`);return}O(u.fov)}}}var Q=new w(0,0,0),_n=[{id:`mint`,position:new w(784,126,-364),radius:40,color:3003583},{id:`plumm`,position:new w(-588,-196,728),radius:34,color:9071615},{id:`idrive`,position:new w(420,308,1176),radius:28,color:16762977},{id:`agentic`,position:new w(-1092,-84,-840),radius:45,color:16098596}];function vn(e){let t=Math.floor(Math.max(0,e)/100),n=t%10,r=Math.floor(t/10),i=r%60,a=Math.floor(r/60);return`${String(a).padStart(2,`0`)}:${String(i).padStart(2,`0`)}.${n}`}function yn(e){let t=new Date(e);return Number.isNaN(t.getTime())?`--.--`:`${String(t.getDate()).padStart(2,`0`)}.${String(t.getMonth()+1).padStart(2,`0`)}`}function bn(e,t){let n=e.match(/[^.!?]+[.!?]+(\s+|$)/g);return!n||n.length===0?e.trim():n.slice(0,t).join(``).trim()}var xn={"&":`&amp;`,"<":`&lt;`,">":`&gt;`,'"':`&quot;`,"'":`&#39;`};function Sn(e){return e.replace(/[&<>"']/g,e=>xn[e]??e)}function Cn(e){if(!e)return!1;let t=e.trim();if(!t||t===`#`||t.startsWith(`#`))return!1;try{let e=new URL(t);return e.protocol===`http:`||e.protocol===`https:`}catch{return!1}}var wn=`https://marcinbochenek.com`,Tn=8e3,En=.4;function Dn(e,t={}){let n=typeof location<`u`&&new URLSearchParams(location.search).has(`debug`);for(let t of e.querySelectorAll(`.stats, #stats, [class*="fps"]`))t.remove();let r=t.touchActive??!1,i=t.launchByTap??r,a=r?`<span>Lewy drążek</span> — lot · <span>Ciąg</span> — napęd · <span>Ham</span> — hamowanie`:`<span>W/S</span> — pochylenie · <span>A/D</span> — skręt · <span>Spacja</span> — ciąg · <span>Shift</span> — hamowanie`,o=i?`Dotknij, aby uruchomić silniki`:`Naciśnij <span class="v4-hud__start-keys">Spację</span>, aby uruchomić silniki`,s=document.createElement(`div`);s.className=`v4-hud`,s.innerHTML=`
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
      <div class="v4-hud__pips">${_n.map(e=>`<span class="v4-hud__pip" data-planet="${e.id}"></span>`).join(``)}</div>
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
  `,e.appendChild(s);let c=s.querySelector(`.v4-hud__speed-value`),l=s.querySelector(`.v4-hud__thrust-fill`),u=s.querySelector(`.v4-hud__legend`),d=s.querySelector(`.v4-hud__start-prompt`);i&&t.onLaunch&&d.addEventListener(`pointerdown`,e=>{e.preventDefault(),t.onLaunch?.()});let f=s.querySelector(`.v4-hud__timer`),p=s.querySelector(`.v4-hud__warning`),m=Array.from(s.querySelectorAll(`.v4-hud__pip`)),h=s.querySelector(`.v4-hud__fps`),g=performance.now(),_=0,v=0,y=En*54,b=y*.78,x=!1,S=0,C=!1;function w(){window.clearTimeout(S),S=window.setTimeout(()=>{u.classList.remove(`is-visible`),u.setAttribute(`aria-hidden`,`true`)},Tn)}return{update(e){if(c.textContent=String(Math.round(e.speed)).padStart(2,`0`),l.style.transform=`scaleX(${Math.max(0,Math.min(1,e.thrust))})`,e.hasThrusted&&!x&&(x=!0,d.classList.add(`is-hidden`),u.classList.add(`is-visible`),u.setAttribute(`aria-hidden`,`false`),w()),f.textContent=vn(e.missionMs),h){let e=performance.now(),t=e-g;if(g=e,t>.75&&t<250){let e=1e3/t;_=v===0?e:_*.88+e*.12,v+=1,v>=8&&_>=1&&(h.hidden=!1,h.textContent=`${Math.round(_)} fps`)}}C=C?e.gravityAccel>b:e.gravityAccel>y,p.classList.toggle(`is-visible`,C);for(let t of m){let n=t.dataset.planet;t.classList.toggle(`is-found`,e.discovered.has(n))}},reset(){x=!1,C=!1,window.clearTimeout(S),d.classList.remove(`is-hidden`),u.classList.remove(`is-visible`),u.setAttribute(`aria-hidden`,`true`),p.classList.remove(`is-visible`)},dispose(){window.clearTimeout(S),s.remove()}}}var On=108,kn=On,An=On,jn=kn,Mn=kn*1.012,Nn=.92,Pn=kn*1.08,Fn=kn*3.05,In=Fn*1.38,Ln=7.5,Rn=Fn*1.04,zn=.94,Bn=48,Vn=24,Hn=kn*1.72,Un=`
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,Wn=`
  precision highp float;

  uniform vec3 uBHPos;
  uniform float uHorizonR;
  uniform float uShadowR;
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
  uniform sampler2D uSky;
  uniform float uSkyRot;

  varying vec3 vWorldPos;

  ${be}

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

  void main() {
    vec3 ro = cameraPosition;
    vec3 rd = normalize(vWorldPos - ro);
    vec3 w0 = ro - uBHPos;

    float b2Early = dot(w0, w0) - pow(dot(w0, rd), 2.0);
    float closestREarly = sqrt(max(b2Early, 0.0));

    // Apparent shadow interior: zero emissive. Seal already painted black.
    // Photon ring lives just outside this cutoff.
    if (closestREarly < uShadowR * 0.995) discard;

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
      if (diskHits < 3 && prevZ * curZ < 0.0) {
        float tt = prevZ / (prevZ - curZ);
        vec3 crossP = mix(prevP, p, tt);
        float cu = dot(crossP, uDiskU);
        float cv = dot(crossP, uDiskV);
        float rad = length(vec2(cu, cv));
        if (rad > uDiskInner && rad < uDiskOuter) {
          diskHits += 1;
          bool nearSide = dot(crossP, w0) > 0.0;
          if (!nearSide) {
            float imageFalloff = diskHits == 1 ? 0.95 : (diskHits == 2 ? 0.48 : 0.22);
            accum += shadeDiskCrossing(crossP, d, imageFalloff);
          }
        }
      }
    }

    vec3 peri = w0 - rd * dot(w0, rd);
    float periLen = length(peri);
    float polar = periLen > 1e-4 ? abs(dot(peri / periLen, uDiskN)) : 1.0;

    float rim = exp(-pow((closestREarly - uPhotonR) / uPhotonWidth, 2.0));
    // Side-on Doppler: approaching limb hotter, receding quieter. Polar
    // boosts the ring but never fills the interior (already discarded).
    vec3 az = periLen > 1e-4 ? normalize(peri - uDiskN * dot(peri, uDiskN)) : uDiskU;
    vec3 tangent = normalize(cross(uDiskN, az));
    float approach = dot(tangent, -rd);
    rim *= mix(0.28, 1.0, smoothstep(-0.45, 0.45, approach));
    rim *= 0.72 + 0.28 * (1.0 - smoothstep(0.15, 0.8, polar));

    // Far-side secondary image sitting ON the limb, above/below the shadow —
    // not a concentric hoop and not a fill inside the aperture.
    float polarCap = smoothstep(0.28, 0.7, polar);
    float limb = exp(-pow((closestREarly - uPhotonR) / (uPhotonWidth * 2.4), 2.0));
    float capW = polarCap * limb;
    if (capW > 0.05) {
      vec3 farP = az * (uDiskInner * 1.35);
      if (dot(farP, w0) > 0.0) farP = -farP;
      accum += shadeDiskCrossing(farP, d, capW * 0.7);
    }

    // Bent sky only in a polar annulus outside the shadow. Additive and
    // polar-gated so it cannot paint the aperture or a Saturn hoop.
    float warpW = polarCap
      * (1.0 - smoothstep(uPhotonR * 1.08, uPhotonR * 1.55, closestREarly))
      * smoothstep(uShadowR * 0.995, uPhotonR, closestREarly);
    if (warpW > 0.02) {
      accum += sampleSky(d) * warpW * 0.42;
    }

    vec3 color = accum + vec3(1.0, 0.969, 0.91) * rim * 0.48;
    if (dot(color, vec3(0.3, 0.55, 0.15)) < 0.01) discard;

    gl_FragColor = vec4(color, 1.0);
    ${ve}
  }
`,Gn=`
  varying vec3 vWorldPos;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,Kn=`
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
  uniform mat4 uViewProj;
  varying vec3 vWorldPos;

  ${be}

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
    float ang = atan(cv, cu);
    float omega = 2.0 / pow(rad / uDiskInner, 1.5);
    float flowAngle = ang - uTime * omega;
    vec2 flow = vec2(sin(flowAngle), cos(flowAngle));
    float streak = fbm2(vec2(rad * 0.055, ang * 0.55) + flow * 3.1, 5);
    float streak2 = fbm2(vec2(rad * 0.14, ang * 1.1) + flow * 5.8, 4);
    float streakMix = smoothstep(0.22, 0.78, mix(streak, streak2, 0.34));

    vec3 tangent = normalize(-sin(ang) * uDiskU + cos(ang) * uDiskV);
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
    if (dot(color, vec3(0.3, 0.55, 0.15)) < 0.008) discard;

    gl_FragColor = vec4(color, 1.0);
    ${ve}

    if (uRayPlane > 0.5) {
      vec4 clipHit = uViewProj * vec4(hit, 1.0);
      gl_FragDepth = clipHit.z / clipHit.w * 0.5 + 0.5;
    } else {
      gl_FragDepth = gl_FragCoord.z;
    }
  }
`;function qn(e,t){let n=e.material;return{name:t,visible:e.visible,renderOrder:e.renderOrder,depthTest:n.depthTest,depthWrite:n.depthWrite,transparent:n.transparent,blending:n.blending,side:n.side}}function Jn(e,t){let n=l.degToRad(Ln),r=new w(0,Math.cos(n),Math.sin(n)).normalize(),i=new w(1,0,0),a=new w().crossVectors(r,i).normalize();i.crossVectors(a,r).normalize();let o=new E(Hn,64,48),s=new Y({uniforms:{uBHPos:{value:Q.clone()},uHorizonR:{value:An},uShadowR:{value:kn},uPhotonR:{value:Mn},uPhotonWidth:{value:Nn},uDiskInner:{value:Pn},uDiskOuter:{value:Fn},uDiskU:{value:i},uDiskV:{value:a},uDiskN:{value:r},uTime:{value:0},uBendK:{value:zn},uSteps:{value:t?Vn:Bn},uMarchStartR:{value:Rn},uSky:{value:e},uSkyRot:{value:0}},vertexShader:Un,fragmentShader:Wn,depthTest:!0,depthWrite:!1,transparent:!0,blending:2,toneMapped:!0,side:0}),c=new W(o,s);c.frustumCulled=!1,c.renderOrder=7,c.name=`black-hole-lensing`;let u=new E(jn,64,48),d=new H({color:0,toneMapped:!1,depthWrite:!0,depthTest:!0,transparent:!1,fog:!1});d.colorWrite=!0;let f=new W(u,d);f.name=`black-hole-horizon`,f.renderOrder=0,f.frustumCulled=!1;let p=new H({color:0,toneMapped:!1,depthTest:!0,depthWrite:!1,depthFunc:3,transparent:!0,opacity:1,blending:1,fog:!1,side:0}),m=new W(u,p);m.name=`black-hole-aperture-seal`,m.renderOrder=6,m.frustumCulled=!1;let h=new L(Pn,In,160,10),_=new Y({uniforms:{uBHPos:{value:Q.clone()},uDiskInner:{value:Pn},uDiskOuter:{value:Fn},uShadowR:{value:kn},uDiskU:{value:i},uDiskV:{value:a},uDiskN:{value:r},uTime:{value:0},uCamNear:{value:.8},uRayPlane:{value:0},uViewProj:{value:new F}},vertexShader:Gn,fragmentShader:Kn,depthTest:!0,depthWrite:!0,transparent:!1,toneMapped:!0,side:2}),v=new W(h,_);v.name=`black-hole-disk`,v.renderOrder=1,v.quaternion.setFromUnitVectors(new w(0,0,1),r),v.frustumCulled=!1;let y=new E(In,64,48),b=new W(y,_);b.name=`black-hole-disk-proxy`,b.renderOrder=1,b.visible=!1,b.frustumCulled=!1;let x=new g;x.name=`black-hole`,x.position.copy(Q),x.add(f),x.add(v),x.add(b),x.add(m),x.add(c);let S=new g;S.name=`black-hole-debug-bounds`,S.visible=!1;let C=new W(new E(jn,32,24),new H({color:4521932,wireframe:!0,depthTest:!1,toneMapped:!1}));C.name=`black-hole-horizon-wire`;let T=new R(jn*1.6);T.name=`black-hole-axes`,S.add(C),S.add(T),x.add(S);let D=new w,O=new w;return{object:x,update(e,t,n){s.uniforms.uTime.value=t,s.uniforms.uSkyRot.value=t*xe,n.updateMatrixWorld(),_.uniforms.uTime.value=t,_.uniforms.uCamNear.value=n.near,_.uniforms.uViewProj.value.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),D.copy(Q).sub(n.position),O.set(0,0,-1).applyQuaternion(n.quaternion);let r=D.dot(O),i=D.length(),a=i<jn+4,o=r<Hn+8||i<Hn+4;c.userData.forceHidden||(c.visible=!o),m.userData.forceHidden||(m.visible=!a);let l=!!v.userData.forceHidden,u=i<In+16;l?(v.visible=!1,b.visible=!1):u?(_.uniforms.uRayPlane.value=1,v.visible=!1,b.visible=!0,_.side=+(i<In-1)):(_.uniforms.uRayPlane.value=0,v.visible=!0,b.visible=!1,_.side=2)},setLayerVisible(e,t){e===`horizon`?(f.visible=t,m.userData.forceHidden||(m.visible=t)):e===`lensing`?(c.userData.forceHidden=!t,c.visible=t):e===`seal`?(m.userData.forceHidden=!t,m.visible=t):(v.userData.forceHidden=!t,v.visible=t,b.visible=!1)},getLayerState(){return{horizon:qn(f,f.name),seal:qn(m,m.name),lensing:qn(c,c.name),disk:qn(v,v.name)}},getRadii(){return{physicalRs:On,apparentShadow:kn,photonRing:Mn,diskInner:Pn,diskOuter:Fn,diskGeoOuter:In,lensShell:Hn}},getDiskFrame(){return{u:i.clone(),v:a.clone(),n:r.clone(),inner:Pn,outer:Fn}},setDebugBounds(e){S.visible=e},dispose(){o.dispose(),s.dispose(),u.dispose(),d.dispose(),p.dispose(),h.dispose(),y.dispose(),_.dispose(),C.geometry.dispose(),C.material.dispose(),T.geometry.dispose(),T.material.dispose()}}}var Yn=`
  precision highp float;

  uniform sampler2D uEarthTex;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  ${he}
  ${be}

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
    ${ve}
  }
`,Xn=`
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
`,Zn=`
  precision highp float;
  uniform float uTime;
  uniform float uRadius;
  varying vec3 vLocalDir;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  ${he}
  ${be}

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
    ${ve}
  }
`;function Qn(e,t,n=!1){let r=new g;r.name=`planet-mint`;let[i,a]=n?[96,64]:[128,96],o=new E(e,i,a),s=new Y({uniforms:{uEarthTex:{value:t},uRadius:{value:e}},vertexShader:me,fragmentShader:Yn}),c=new W(o,s);r.add(c);let l=new E(e*1.025,n?64:84,n?44:60),u=new Y({uniforms:{uTime:{value:0},uRadius:{value:e}},vertexShader:Xn,fragmentShader:Zn,transparent:!0,depthWrite:!1}),d=new W(l,u);d.renderOrder=2,r.add(d);let f=Ce(e,16767392,{power:2.3,intensity:1.25});return r.add(f.mesh),{group:r,update(e){c.rotation.y+=e*.018,d.rotation.y+=e*.026,u.uniforms.uTime.value+=e},dispose(){o.dispose(),s.dispose(),l.dispose(),u.dispose(),f.dispose()}}}var $n=`
  precision highp float;

  uniform sampler2D uCityTex;
  uniform float uTime;
  uniform float uRadius;
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vLocalDir;
  varying vec3 vWorldPos;

  ${he}
  ${be}

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
    ${ve}
  }
`;function er(e,t,n){let r=new g;r.name=`planet-plumm`;let[i,a]=n?[96,64]:[128,96],o=new E(e,i,a),s=new Y({uniforms:{uCityTex:{value:t},uTime:{value:0},uRadius:{value:e}},vertexShader:ye,fragmentShader:$n}),c=new W(o,s);r.add(c);let l=Ce(e,9071615,{power:2.8,intensity:1.35});r.add(l.mesh);let u=[],d=[];if(!n){let t=[{r:e*1.28,speed:.22,tilt:.06,opacity:.55},{r:e*1.48,speed:-.16,tilt:-.09,opacity:.4},{r:e*1.7,speed:.12,tilt:.14,opacity:.3}];for(let n of t){let t=new S(n.r,e*.006,8,160),i=new H({color:11246557,transparent:!0,opacity:n.opacity,blending:2,depthWrite:!1}),a=new W(t,i);a.rotation.x=Math.PI/2+n.tilt,a.renderOrder=2,r.add(a),u.push({mesh:a,speed:n.speed}),d.push({geo:t,mat:i})}}let f=n?20:48,p=new T;{let e=1.8,t=new Float32Array([0,0,-1.8*.55,-.62,.12,e*.45,0,-.1,e*.38,0,0,-1.8*.55,0,-.1,e*.38,.62,.12,e*.45]);p.setAttribute(`position`,new q(t,3)),p.computeVertexNormals()}let m=new H({color:15854847,side:2}),h=new O(p,m,f);h.frustumCulled=!1,r.add(h);let _=[];{let t=(()=>{let e=2636928641;return()=>(e=Math.imul(e^e>>>15,e|1),(e>>>16&65535)/65535)})(),n=new w;for(let r=0;r<f;r++)n.set(t()*2-1,t()*2-1,t()*2-1).normalize(),_.push({quat:new U().setFromAxisAngle(n,t()*Math.PI*2),r:e*(1.16+t()*.42),speed:(.1+t()*.22)*(t()<.5?1:-1),phase:t()*Math.PI*2,bank:(t()-.5)*.9})}let v=new w,y=new w,b=new w,x=new w,C=new w,D=new w(1,1,1),k=new F,A=new U,j=new U,M=new F,N=new w(0,0,1);function P(e){for(let t=0;t<f;t++){let n=_[t],r=n.phase+e*n.speed,i=Math.sign(n.speed)||1;v.set(Math.cos(r)*n.r,0,Math.sin(r)*n.r).applyQuaternion(n.quat),y.set(-Math.sin(r)*i,0,Math.cos(r)*i).applyQuaternion(n.quat).normalize(),b.copy(v).normalize(),C.copy(y).multiplyScalar(-1),x.crossVectors(b,C).normalize(),b.crossVectors(C,x),k.makeBasis(x,b,C),A.setFromRotationMatrix(k),j.setFromAxisAngle(N,n.bank),A.multiply(j),M.compose(v,A,D),h.setMatrixAt(t,M)}h.instanceMatrix.needsUpdate=!0}return P(0),{group:r,update(e,t){c.rotation.y+=e*.014,s.uniforms.uTime.value=t;for(let t of u)t.mesh.rotation.z+=e*t.speed;P(t)},dispose(){o.dispose(),s.dispose(),l.dispose(),p.dispose(),m.dispose(),h.dispose();for(let e of d)e.geo.dispose(),e.mat.dispose()}}}var tr=1056,nr=`
  precision highp float;

  uniform float uRadius;
  varying vec3 vNormalW;
  varying vec3 vLocalDir;
  varying vec3 vWorldPos;

  ${he}
  ${be}

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
    ${ve}
  }
`,rr=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 wp = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,ir=`
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
    ${ve}
  }
`,ar=`
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
`,or=`
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
    ${ve}
  }
`,sr=class extends K{shellRadius;constructor(e,t){super(e,!0,`centripetal`),this.shellRadius=t}getPoint(e,t=new w){return super.getPoint(e,t),t.setLength(this.shellRadius)}},cr=[{kind:`straight`,weight:1.7},{kind:`hairpin`,weight:.6,sign:1},{kind:`straight`,weight:1.3},{kind:`corner`,weight:.8,sign:-1},{kind:`chicane`,weight:.8,sign:1},{kind:`straight`,weight:1.6},{kind:`hairpin`,weight:.6,sign:-1},{kind:`straight`,weight:1.2},{kind:`corner`,weight:.8,sign:1},{kind:`straight`,weight:1.5}];function lr(e){let t=e*1.02,n=e*.018,r=ge(tr),i=cr.reduce((e,t)=>e+t.weight,0),a=r()*Math.PI*2,o=[];for(let e of cr){let t=e.weight/i*Math.PI*2,n=a+t/2,s=e.sign??1;if(e.kind===`straight`)o.push({theta:n+(r()-.5)*t*.3,lat:(r()-.5)*.24});else if(e.kind===`corner`){let e=.38+r()*.14;o.push({theta:n,lat:s*e})}else if(e.kind===`chicane`){let e=t*.26,i=.34+r()*.1;o.push({theta:n-e,lat:s*i}),o.push({theta:n+e,lat:-s*i})}else{let e=t*.38,i=.46+r()*.08;o.push({theta:n-e,lat:s*i*.6}),o.push({theta:n,lat:s*(i+.08)}),o.push({theta:n+e,lat:s*i*.6})}a+=t}let s=new sr(o.map(({theta:e,lat:n})=>{let r=Math.PI/2-n;return new w(t*Math.sin(r)*Math.cos(e),t*Math.cos(r),t*Math.sin(r)*Math.sin(e))}),t),c=[];for(let e=0;e<256;e++)c.push(s.getPointAt(e/256,new w));let l=n*5.2,u=new w,d=new w;for(let e=0;e<80;e++){let e=!0,n=c.map(e=>e.clone());for(let r=0;r<256;r++){let i=n[(r-1+256)%256],a=n[r],o=n[(r+1)%256];u.subVectors(a,i),d.subVectors(o,a);let s=(u.length()+d.length())/2,f=u.normalize().angleTo(d.normalize());f<1e-5||s/f>=l||(e=!1,c[r].copy(i).add(o).multiplyScalar(.5).sub(a).multiplyScalar(.6).add(a).setLength(t))}if(e)break}for(let e=0;e<2;e++){let e=c.map(e=>e.clone());for(let n=0;n<256;n++){let r=e[(n-1+256)%256],i=e[n],a=e[(n+1)%256];c[n].copy(r).add(a).multiplyScalar(.5).sub(i).multiplyScalar(.25).add(i).setLength(t)}}let f=new sr(c,t);return f.arcLengthDivisions=800,f}function ur(e,t){let n=new g;n.name=`planet-idrive`;let[r,i]=t?[96,64]:[128,96],a=new E(e,r,i),o=new Y({uniforms:{uRadius:{value:e}},vertexShader:ye,fragmentShader:nr}),s=new W(a,o);n.add(s);let c=e*.018,l=lr(e),u=new V(l,t?220:400,c,14,!0),d=new Y({vertexShader:rr,fragmentShader:ir}),p=new W(u,d);n.add(p);let m=Ce(e,10133672,{power:3.2,intensity:.55});n.add(m.mesh);let h=t?16:28,_=ge(1057),v=e*.031,y=v*.5,b=v*.2,x=Array.from({length:h},(e,t)=>{let n=(t%2==0?-1:1)*(.55+_()*.45)*.4*c;return{t:_(),speed:.028+_()*.05,lane:n,lift:Math.sqrt(Math.max(c*c-n*n,0))+b*.5+c*.04}}),S=new oe(y,b,v),D=new B({color:16777215,roughness:.45,metalness:.55,emissive:2364677,emissiveIntensity:.9}),k=new O(S,D,h);k.instanceMatrix.setUsage(C),k.frustumCulled=!1;let A=[12106948,4869720,10238770,3364477,12159534,4025167],j=new f;for(let e=0;e<h;e++)j.setHex(A[e%A.length]),k.setColorAt(e,j);n.add(k);let M=h*3,N=new Float32Array(M*3),P=new Float32Array(M*3),L=new Float32Array(M),R=new Float32Array(M),z=new Float32Array(M),ee=new f(16768160),H=new f(16777215),U=new f(16774880),te=new f(16723224);for(let t=0;t<h;t++){let n=t*3;j.copy(ee).lerp(H,_()*.5),P.set([j.r,j.g,j.b],n*3),L[n]=e*(.1+_()*.05),R[n]=.9,z[n]=1,P.set([U.r,U.g,U.b],(n+1)*3),L[n+1]=v*.5,R[n+1]=1,z[n+1]=0,P.set([te.r,te.g,te.b],(n+2)*3),L[n+2]=v*.55,R[n+2]=1,z[n+2]=0}let G=new T;G.setAttribute(`position`,new q(N,3)),G.setAttribute(`aColor`,new q(P,3)),G.setAttribute(`aSize`,new q(L,1)),G.setAttribute(`aAlpha`,new q(R,1)),G.setAttribute(`aFadeNear`,new q(z,1));let ne=new Y({vertexShader:ar,fragmentShader:or,transparent:!0,depthWrite:!1,blending:2}),re=new I(G,ne);re.frustumCulled=!1,re.renderOrder=3,n.add(re);let ie=G.attributes.position,K=new w,ae=new w,J=new w,se=new w,ce=new w,X=new w,Z=new w,le=new F;function ue(e){let t=x[e];l.getPointAt(t.t,K),l.getPointAt((t.t+.0015)%1,ae),J.copy(K).normalize(),se.subVectors(ae,K),se.addScaledVector(J,-se.dot(J)).normalize(),ce.crossVectors(J,se),X.copy(K).addScaledVector(ce,t.lane).addScaledVector(J,t.lift),le.makeBasis(ce,J,se),le.setPosition(X),k.setMatrixAt(e,le);let n=e*3;ie.setXYZ(n,X.x,X.y,X.z),Z.copy(X).addScaledVector(se,v*.58),ie.setXYZ(n+1,Z.x,Z.y,Z.z),Z.copy(X).addScaledVector(se,-v*.58),ie.setXYZ(n+2,Z.x,Z.y,Z.z)}for(let e=0;e<h;e++)ue(e);return k.instanceMatrix.needsUpdate=!0,k.instanceColor&&(k.instanceColor.needsUpdate=!0),ie.needsUpdate=!0,{group:n,update(e){s.rotation.y+=e*.01;for(let t=0;t<h;t++){let n=x[t];n.t=(n.t+n.speed*e)%1,ue(t)}k.instanceMatrix.needsUpdate=!0,ie.needsUpdate=!0},dispose(){a.dispose(),o.dispose(),u.dispose(),d.dispose(),m.dispose(),k.dispose(),S.dispose(),D.dispose(),G.dispose(),ne.dispose()}}}var dr=9001;function fr(e){let t=1024,n=document.createElement(`canvas`);n.width=t,n.height=512;let r=n.getContext(`2d`);r.fillStyle=`#000000`,r.fillRect(0,0,t,512);let i=ge(e);for(let e=0;e<52;e++){let e=i()*t,n=i()*512;r.beginPath(),r.moveTo(e,n);let a=3+Math.floor(i()*5);for(let o=0;o<a;o++){let a=i()<.5,o=18+i()*65;a?e+=(i()<.5?-1:1)*o:n+=(i()<.5?-1:1)*o,e=Math.max(3,Math.min(t-3,e)),n=Math.max(3,Math.min(509,n)),r.lineTo(e,n)}r.lineWidth=1+i()*1.2,r.strokeStyle=`rgba(245, 165, 36, ${(.5+i()*.5).toFixed(2)})`,r.stroke(),r.fillStyle=`rgba(255, 200, 97, ${(.7+i()*.3).toFixed(2)})`;let o=2+i()*2;r.fillRect(e-o/2,n-o/2,o,o)}let a=new u(n);return a.colorSpace=j,a.wrapS=z,a.wrapT=m,a.needsUpdate=!0,a}var pr=`
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

  ${be}

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
`,mr=`
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
    ${ve}
  }
`;function hr(e,t,n,r=1){let i=new g;i.name=`planet-agentic`;let a=fr(dr);a.anisotropy=r;let[o,s]=n?[96,64]:[128,96],c=new E(e,o,s),u=new B({color:1711140,metalness:1,roughness:.48,emissive:new f(_e.amber),emissiveMap:a,emissiveIntensity:1.6,envMapIntensity:.9});t&&(u.envMap=t),u.onBeforeCompile=t=>{t.uniforms.uRadius={value:e},t.fragmentShader=t.fragmentShader.replace(`#include <common>`,`#include <common>\nuniform float uRadius;\nvarying vec3 vDetailDir;\nvarying vec3 vDetailWorldPos;\n${be}`).replace(`#include <color_fragment>`,`#include <color_fragment>
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
  vDetailWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;`)};let d=new W(c,u);i.add(d);let p=Ce(e,_e.amber,{power:2.9,intensity:.9});i.add(p.mesh);let m=n?8e3:17e3,h=e*2.3,_=e*.55,v=l.degToRad(25),y=ge(9008),b=new Float32Array(m),x=new Float32Array(m),S=new Float32Array(m),C=new Float32Array(m),D=new Float32Array(m*3),O=new Float32Array(m),k=new Float32Array(m),A=new f(_e.amberDeep),j=new f(_e.amber),M=new f(_e.amberBright),N=new f;for(let e=0;e<m;e++){b[e]=y()*Math.PI*2,x[e]=y()*Math.PI*2;let t=.55+y()**1.6*.45;S[e]=t,C[e]=.09+y()*.14;let n=l.clamp((t-.55)/.45,0,1);n>.6?N.copy(j).lerp(M,(n-.6)/.4):N.copy(A).lerp(j,n/.6),D[e*3]=N.r,D[e*3+1]=N.g,D[e*3+2]=N.b,O[e]=.85+y()*1.1,k[e]=.5+y()*.48}let P=new T;P.setAttribute(`aTheta0`,new q(b,1)),P.setAttribute(`aPhi`,new q(x,1)),P.setAttribute(`aTubeFrac`,new q(S,1)),P.setAttribute(`aSpeed`,new q(C,1)),P.setAttribute(`aColor`,new q(D,3)),P.setAttribute(`aSize`,new q(O,1)),P.setAttribute(`aAlpha`,new q(k,1)),P.setAttribute(`position`,new q(new Float32Array(m*3),3)),P.boundingSphere=new J(new w,h+_+6);let F=new Y({uniforms:{uTime:{value:0},uMajorR:{value:h},uTubeR:{value:_},uJitterAmp:{value:e*.12},uBasePx:{value:2.6}},vertexShader:pr,fragmentShader:mr,transparent:!0,depthWrite:!1,blending:2}),L=new I(P,F);return L.frustumCulled=!1,L.rotation.x=v,L.renderOrder=2,i.add(L),{group:i,update(e,t){d.rotation.y+=e*.012,F.uniforms.uTime.value=t},dispose(){c.dispose(),u.dispose(),a.dispose(),p.dispose(),P.dispose(),F.dispose()}}}var gr=7331,_r=3,vr=4,yr=10,br=60,xr=90,Sr=240,Cr=420,wr=.55,Tr=1.5,Er=.7,Dr=1.5,Or=16,kr=34,Ar=2.6,jr=480,Mr=680,Nr=.4,Pr=3.5,Fr=5.5,Ir=70,Lr=5.5;function Rr(){let e=document.createElement(`canvas`);e.width=48,e.height=256;let t=e.getContext(`2d`);t.clearRect(0,0,48,256);let n=256*.13;t.globalCompositeOperation=`lighter`;for(let e=0;e<56;e++){let r=e/55,i=n+r*(256-n),a=(1-r)**2.4*.85,o=48*(.55+.45*(1-r));t.globalAlpha=a,t.fillStyle=`#ffffff`,t.fillRect(48/2-o/2,i,o,5.477142857142857)}t.globalAlpha=1;let r=t.createRadialGradient(48/2,n,0,48/2,n,48*.6);r.addColorStop(0,`rgba(255,255,255,1)`),r.addColorStop(.45,`rgba(255,255,255,0.85)`),r.addColorStop(1,`rgba(255,255,255,0)`),t.fillStyle=r,t.fillRect(0,0,48,256),t.globalCompositeOperation=`source-over`;let i=new u(e);return i.needsUpdate=!0,i}function zr(){let e=ge(gr),t=new g;t.name=`meteor-field`;let n=Rr();function r(e){let r=new d(new ae({map:n,color:e?13627391:16777215,transparent:!0,opacity:0,depthWrite:!1,depthTest:!0,blending:2}));return r.visible=!1,r.renderOrder=4,t.add(r),{sprite:r,active:!1,age:0,life:1,startPos:new w,velocity:new w,length:Or,width:Ar,isComet:e}}let i=Array.from({length:_r},()=>r(!1)),a=r(!0),o=vr+e()*(yr-vr),s=br+e()*(xr-br),c=null,u=!1,f=new w,p=new w,m=new w;function h(t,n,r,i){i?(i.getWorldDirection(f),m.set(e()*2-1,e()*2-1,e()*2-1).multiplyScalar(.3),f.add(m)):f.set(e()*2-1,e()*2-1,e()*2-1),f.lengthSq()<1e-6&&f.set(0,1,0),f.normalize(),r.pos.copy(t).addScaledVector(f,n),m.set(e()*2-1,e()*2-1,e()*2-1).normalize(),p.crossVectors(f,m),p.lengthSq()<1e-6&&p.set(1,0,0),p.normalize(),r.dir.copy(p)}let _={pos:new w,dir:new w};function v(t,n){h(n,Sr+e()*(Cr-Sr),_,c),c=null;let r=wr+e()*(Tr-wr),i=Er+e()*(Dr-Er),a=_.pos.distanceTo(n)*r;t.startPos.copy(_.pos),t.velocity.copy(_.dir).multiplyScalar(a/i),t.life=i,t.age=0,t.length=Or+e()*(kr-Or),t.width=Ar*(.85+e()*.3),t.active=!0,t.sprite.visible=!0}function y(t){h(t,jr+e()*(Mr-jr),_);let n=Pr+e()*(Fr-Pr),r=_.pos.distanceTo(t)*Nr;a.startPos.copy(_.pos),a.velocity.copy(_.dir).multiplyScalar(r/n),a.life=n,a.age=0,a.length=Ir,a.width=Lr,a.active=!0,a.sprite.visible=!0}let b=new w,x=new w,S=new w,C=new w;function T(e,t,n){if(!e.active)return;if(e.age+=t,e.age>=e.life){e.active=!1,e.sprite.visible=!1;return}C.copy(e.velocity).multiplyScalar(e.age),e.sprite.position.copy(e.startPos).add(C);let r=e.age/e.life,i=l.smoothstep(r,0,.12),a=1-l.smoothstep(r,.65,1),o=e.sprite.material;o.opacity=i*a*(e.isComet?.85:1),n.matrixWorld.extractBasis(b,x,S);let s=e.velocity.dot(b),c=e.velocity.dot(x);o.rotation=Math.atan2(-s,c),e.sprite.scale.set(e.width,e.length,1)}return{object:t,update(t,n){if(u&&(u=!1,c=n),o-=t,o<=0){o=vr+e()*(yr-vr);let t=i.find(e=>!e.active),r=i.filter(e=>e.active).length;t&&r<_r&&v(t,n.position)}c=null,s-=t,s<=0&&(s=br+e()*(xr-br),a.active||y(n.position));for(let e of i)T(e,t,n);T(a,t,n)},debugForceSpawn(e=`meteor`){e===`comet`?s=-1:(o=-1,u=!0)},dispose(){n.dispose();for(let e of i)e.sprite.material.dispose();a.sprite.material.dispose()}}}var Br={mint:[{orbitRadius:1.75,moonRadius:.11,orbitSpeed:.07,inclination:.28,phase:.4,color:9083562},{orbitRadius:2.35,moonRadius:.07,orbitSpeed:.045,inclination:-.18,phase:2.3,color:6978184}],plumm:[{orbitRadius:1.9,moonRadius:.09,orbitSpeed:.055,inclination:.42,phase:1.1,color:5917290}],idrive:[{orbitRadius:1.65,moonRadius:.08,orbitSpeed:.08,inclination:.22,phase:.6,color:10127472},{orbitRadius:2.25,moonRadius:.055,orbitSpeed:.038,inclination:-.35,phase:3.8,color:7825496}],agentic:[{orbitRadius:2,moonRadius:.1,orbitSpeed:.065,inclination:.32,phase:1.6,color:11176032},{orbitRadius:2.7,moonRadius:.065,orbitSpeed:.042,inclination:-.22,phase:4.2,color:8941664}]};function Vr(e,t,n,r){let i=Br[t],a=r?12:16,o=[],s=[],c=new w;for(let t of i){let r=new N;r.rotation.x=t.inclination,e.add(r);let i=n*t.moonRadius,c=new E(i,a,a),l=new B({color:t.color,roughness:.92,metalness:.04,emissive:new f(t.color).multiplyScalar(.04)}),u=new W(c,l);u.position.x=n*t.orbitRadius,r.add(u),o.push({pivot:r,mesh:u,speed:t.orbitSpeed,phase:t.phase,radius:i}),s.push({geo:c,mat:l})}return{update(e,t){for(let{pivot:e,speed:n,phase:r}of o)e.rotation.y=t*n+r},forEachCollider(e){for(let{mesh:t,radius:n}of o)t.getWorldPosition(c),e(c,n)},dispose(){for(let{geo:e,mat:t}of s)e.dispose(),t.dispose()}}}var Hr=`/v4/assets/tex/earth-day-2k.jpg`,Ur=`/v4/assets/tex/city-lights-2k.jpg`;function Wr(){let e=document.createElement(`canvas`);e.width=8,e.height=8;let t=e.getContext(`2d`);t&&(t.fillStyle=`#141820`,t.fillRect(0,0,8,8));let n=new u(e);return n.needsUpdate=!0,n}async function Gr(e,t){try{return await e.loadAsync(t)}catch{return Wr()}}async function Kr(e,t){let{manager:n,skyTex:r,envMap:i,lowPower:a,renderer:o}=t,s=Math.min(o.capabilities.getMaxAnisotropy(),8),c=new h(n),[l,u]=await Promise.all([Gr(c,Hr),Gr(c,Ur)]);for(let e of[l,u])e.colorSpace=j,e.wrapS=z,e.wrapT=m,e.generateMipmaps=!0,e.minFilter=k,e.anisotropy=s;let d=Jn(r,a);e.add(d.object);let f=zr();e.add(f.object);let p=new Map,g=[];for(let t of _n){let n;switch(t.id){case`mint`:n=Qn(t.radius,l,a);break;case`plumm`:n=er(t.radius,u,a);break;case`idrive`:n=ur(t.radius,a);break;case`agentic`:n=hr(t.radius,i,a,s);break;default:throw Error(`Unknown planet id: ${t.id}`)}n.group.position.copy(t.position),n.group.name=`planet-${t.id}`,e.add(n.group),p.set(t.id,n),g.push(Vr(n.group,t.id,t.radius,a))}return{update(e,t,n){d.update(e,t,n);for(let n of p.values())n.update(e,t);for(let n of g)n.update(e,t);f.update(e,n)},debugForceMeteor(e){f.debugForceSpawn(e)},setBlackHoleLayerVisible(e,t){d.setLayerVisible(e,t)},getBlackHoleLayerState(){return d.getLayerState()},getBlackHoleRadii(){return d.getRadii()},getBlackHoleDiskFrame(){return d.getDiskFrame()},setBlackHoleDebugBounds(e){d.setDebugBounds(e)},forEachMoonCollider(e){for(let t of g)t.forEachCollider(e)},dispose(){e.remove(d.object),d.dispose();for(let t of p.values())e.remove(t.group),t.dispose();p.clear();for(let e of g)e.dispose();g.length=0,e.remove(f.object),f.dispose(),l.dispose(),u.dispose()}}}var qr=12e4,Jr=250,Yr=600,Xr=108,Zr=5,Qr=new w;function $r(e,t,n){let r=Math.min(1,Math.max(0,(n-e)/(t-e)));return r*r*(3-2*r)}function ei(e){return 1-$r(Jr,Yr,e)}function ti(e,t,n){Qr.copy(Q).sub(e);let r=Math.max(Qr.length(),Zr),i=qr/(r*r)*ei(r);Qr.normalize(),t.addScaledVector(Qr,i*n)}function ni(e){let t=Math.max(Q.distanceTo(e),Zr);return qr/(t*t)*ei(t)}var ri=`v4-leaderboard`,ii=10;function ai(e){if(!e||typeof e!=`object`)return!1;let t=e;return typeof t.nick==`string`&&typeof t.ms==`number`&&typeof t.date==`string`}function oi(){try{let e=window.localStorage.getItem(ri);if(!e)return[];let t=JSON.parse(e);return Array.isArray(t)?t.filter(ai):[]}catch{return[]}}function si(){return oi().sort((e,t)=>e.ms-t.ms)}function ci(e,t){let n=e.trim().slice(0,16)||`PILOT`,r=oi();r.push({nick:n,ms:t,date:new Date().toISOString()}),r.sort((e,t)=>e.ms-t.ms);let i=r.slice(0,ii);try{window.localStorage.setItem(ri,JSON.stringify(i))}catch{}return i}var li={mint:`Mint Apartments`,plumm:`Plumm`,idrive:`I DRIVE CARS`,agentic:`Agentic OS`};function ui(e){let t=c(e);if(t.length>=2)return t.slice(0,2).map(e=>({src:e.srcSmall,alt:e.caption}));let n=li[e];return[{src:`/projects/${e}/hero-card.webp`,alt:`${n} — podgląd interfejsu`},{src:`/projects/${e}/hero-full.webp`,alt:`${n} — drugi kadr interfejsu`}]}var di=[`Kapitanie — misja: znajdź nowoczesną stronę dla swojego biznesu. Cztery światy na orbicie czarnej dziury.`,`Nie trać czasu — minuta tak blisko horyzontu to godzina na Ziemi.`,`Ten statek… przypomina Ci coś? Zbieg okoliczności.`],fi=5e3,pi=25;function mi(e,t,n){if(n)return e.textContent=t,()=>{};e.textContent=``;let r=0,i=0,a=()=>{r+=1,e.textContent=t.slice(0,r),r<t.length&&(i=window.setTimeout(a,pi))};return i=window.setTimeout(a,pi),()=>window.clearTimeout(i)}function hi(e,t){let n=document.createElement(`div`);n.className=`v4-comm`,n.innerHTML=`
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
  `,e.appendChild(n);let r=n.querySelector(`.v4-comm__panel`),i=n.querySelector(`.v4-comm__icon`),a=n.querySelector(`.v4-comm__collapse`),o=Array.from(n.querySelectorAll(`.v4-comm__line`)),s=n.querySelector(`.v4-comm__board`),c=n.querySelector(`.v4-comm__board-list`),l=n.querySelector(`.v4-comm__wave`),u=!1,d=[],f=[],p=0;function m(){for(let e of d)window.clearTimeout(e);for(let e of f)e();d=[],f=[]}function h(){di.forEach((e,n)=>{let r=window.setTimeout(()=>{f.push(mi(o[n],e,t.reducedMotion))},n*fi);d.push(r)})}function g(){let e=si().slice(0,3);if(e.length===0){s.hidden=!0;return}s.hidden=!1,c.innerHTML=e.map((e,t)=>`<li><span>${t+1}.</span><span>${Sn(e.nick)}</span><span>${vn(e.ms)}</span></li>`).join(``)}function _(e){let t=l.getContext(`2d`);if(!t)return;let n=l.width/8;t.clearRect(0,0,l.width,l.height),t.fillStyle=`#f5a524`;for(let r=0;r<8;r++){let i=l.height*(.22+.58*Math.abs(Math.sin(e+r*.7)));t.fillRect(r*n+1,l.height-i,n-2,i)}}function v(){if(t.reducedMotion){_(.6);return}let e=0,n=()=>{e+=.12,_(e),p=requestAnimationFrame(n)};n()}function y(){u=!1,r.classList.remove(`is-collapsed`),i.hidden=!0}function b(){u=!0,r.classList.add(`is-collapsed`),i.hidden=!1}r.addEventListener(`click`,e=>{e.target.closest(`.v4-comm__collapse`)||b()}),a.addEventListener(`click`,e=>{e.stopPropagation(),b()}),i.addEventListener(`click`,y);let x=e=>{e.code===`Enter`&&!u&&b()};return window.addEventListener(`keydown`,x),g(),h(),v(),t.startCollapsed&&b(),{dismiss(){u||b()},restart(){m();for(let e of o)e.textContent=``;y(),g(),h()},dispose(){m(),cancelAnimationFrame(p),window.removeEventListener(`keydown`,x),n.remove()}}}var gi=`${`https://marcinbochenek.com`.replace(/\/$/,``)}/#realizacje`;function _i(e){let t=document.createElement(`div`);t.className=`v4-project-panel`,t.setAttribute(`aria-hidden`,`true`),t.inert=!0,t.innerHTML=`
    <button type="button" class="v4-project-panel__close" aria-label="Zamknij panel projektu">&times;</button>
    <p class="v4-project-panel__eyebrow"></p>
    <h2 class="v4-project-panel__title"></h2>
    <p class="v4-project-panel__desc"></p>
    <div class="v4-project-panel__shots"></div>
    <div class="v4-project-panel__stack"></div>
    <div class="v4-project-panel__links">
      <a class="v4-project-panel__live" href="#" target="_blank" rel="noopener" hidden>Strona na żywo &rarr;</a>
      <span class="v4-project-panel__status" hidden></span>
      <a class="v4-project-panel__case" href="${gi}" target="_blank" rel="noopener">Case study &rarr;</a>
    </div>
  `,e.appendChild(t);let n=t.querySelector(`.v4-project-panel__close`),r=t.querySelector(`.v4-project-panel__eyebrow`),i=t.querySelector(`.v4-project-panel__title`),a=t.querySelector(`.v4-project-panel__desc`),o=t.querySelector(`.v4-project-panel__shots`),s=t.querySelector(`.v4-project-panel__stack`),c=t.querySelector(`.v4-project-panel__live`),l=t.querySelector(`.v4-project-panel__status`);function u(){t.classList.remove(`is-open`),t.setAttribute(`aria-hidden`,`true`),t.inert=!0,document.documentElement.classList.remove(`v4-panel-open`)}return n.addEventListener(`click`,u),{show(e,n){r.textContent=e.tagline,i.textContent=e.title,a.textContent=bn(e.description,3),o.innerHTML=``;for(let e of n){let t=document.createElement(`img`);t.className=`v4-project-panel__shot`,t.src=e.src,t.alt=e.alt,t.loading=`lazy`,o.appendChild(t)}s.innerHTML=``;for(let t of e.stack??[]){let e=document.createElement(`span`);e.className=`v4-project-panel__chip`,e.textContent=t,s.appendChild(e)}Cn(e.url)&&e.id!==`idrive`&&e.id!==`agentic`?(c.href=e.url,c.hidden=!1,l.hidden=!0):(c.hidden=!0,c.removeAttribute(`href`),l.hidden=!1,l.textContent=e.domain),t.classList.add(`is-open`),t.setAttribute(`aria-hidden`,`false`),t.inert=!1,document.documentElement.classList.add(`v4-panel-open`)},hide:u,dispose(){t.remove()}}}var vi=2500;function yi(e){let t=document.createElement(`div`);t.className=`v4-toast`,t.setAttribute(`aria-live`,`polite`),t.setAttribute(`aria-hidden`,`true`),e.appendChild(t);let n=0;return{show(e){t.textContent=`ODKRYTO: ${e.toUpperCase()}`,t.classList.remove(`is-visible`),t.offsetWidth,t.classList.add(`is-visible`),t.setAttribute(`aria-hidden`,`false`),window.clearTimeout(n),n=window.setTimeout(()=>{t.classList.remove(`is-visible`),t.setAttribute(`aria-hidden`,`true`)},vi)},dispose(){window.clearTimeout(n),t.remove()}}}var bi=600;function xi(e,t){let n=document.createElement(`div`);n.className=`v4-horizon-flash`,e.appendChild(n);let r=document.createElement(`div`);r.className=`v4-overlay v4-overlay--gameover`,r.setAttribute(`aria-hidden`,`true`),r.inert=!0,r.innerHTML=`
    <div class="v4-overlay__card">
      <p class="v4-overlay__eyebrow">Misja przerwana</p>
      <h1 class="v4-overlay__title" id="v4-gameover-title">Przekroczono horyzont zdarzeń</h1>
      <p class="v4-overlay__lead">Z tej odległości nie ucieka nawet światło. Misja zaczyna się od nowa.</p>
      <button type="button" class="v4-overlay__button">Restart misji <span class="v4-overlay__hint">[R]</span></button>
    </div>
  `,e.appendChild(r);let i=r.querySelector(`.v4-overlay__button`);i.addEventListener(`click`,()=>t.onRestart());let a=0;function o(){r.setAttribute(`role`,`dialog`),r.setAttribute(`aria-modal`,`true`),r.setAttribute(`aria-labelledby`,`v4-gameover-title`),r.classList.add(`is-visible`),r.setAttribute(`aria-hidden`,`false`),r.inert=!1,i.focus({preventScroll:!0})}function s(){window.clearTimeout(a),r.classList.remove(`is-visible`),r.removeAttribute(`role`),r.removeAttribute(`aria-modal`),r.setAttribute(`aria-hidden`,`true`),r.inert=!0,n.classList.remove(`is-active`)}return{trigger(){if(t.reducedMotion){o();return}n.classList.remove(`is-active`),n.offsetWidth,n.classList.add(`is-active`),window.clearTimeout(a),a=window.setTimeout(o,bi)},reset(){s()},dispose(){window.clearTimeout(a),r.remove(),n.remove()}}}function Si(e,t){let n=document.createElement(`div`);n.className=`v4-overlay v4-overlay--completion`,n.setAttribute(`aria-hidden`,`true`),n.inert=!0,n.innerHTML=`
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
  `,e.appendChild(n);let r=n.querySelector(`.v4-overlay__time-value`),i=n.querySelector(`.v4-overlay__dilation`),a=n.querySelector(`.v4-overlay__save`),o=n.querySelector(`.v4-overlay__nick`),s=n.querySelector(`.v4-overlay__button`),c=n.querySelector(`tbody`),l=n.querySelector(`.v4-overlay__restart`),u=e=>e.stopPropagation();o.addEventListener(`keydown`,u),o.addEventListener(`keyup`,u),a.addEventListener(`submit`,e=>{e.preventDefault(),!s.disabled&&(t.onSave(o.value),s.disabled=!0,o.disabled=!0,s.textContent=`Zapisano`)}),l.addEventListener(`click`,()=>t.onRestart());function d(e){c.innerHTML=e.slice(0,10).map((e,t)=>`<tr><td>${t+1}</td><td>${Sn(e.nick)}</td><td>${vn(e.ms)}</td><td>${yn(e.date)}</td></tr>`).join(``)}return{show(e,t){r.textContent=vn(e);let a=Math.round(e/1e3);i.textContent=`Na Ziemi minęło w tym czasie: ${Math.floor(a/60)}h ${a%60}min`,o.value=``,o.disabled=!1,s.disabled=!1,s.textContent=`Zapisz wynik`,d(t),n.setAttribute(`role`,`dialog`),n.setAttribute(`aria-labelledby`,`v4-completion-title`),n.classList.add(`is-visible`),n.setAttribute(`aria-hidden`,`false`),n.inert=!1,o.focus({preventScroll:!0})},updateBoard(e){d(e)},reset(){n.classList.remove(`is-visible`),n.removeAttribute(`role`),n.setAttribute(`aria-hidden`,`true`),n.inert=!0},dispose(){o.removeEventListener(`keydown`,u),o.removeEventListener(`keyup`,u),n.remove()}}}var $=n(),Ci=new w(205,-36,700),wi=(()=>{let e=Ci.clone().normalize(),t=new w().crossVectors(new w(0,1,0),e).normalize(),n=e.clone().negate(),r=t.clone().multiplyScalar(.18).addScaledVector(n,.82);r.normalize();let i=new ne;return i.up.set(0,1,0),i.lookAt(r),i.quaternion.clone()})();function Ti(){if(typeof navigator>`u`)return!1;let e=navigator.hardwareConcurrency??8,t=navigator.deviceMemory;return e<=4||t!==void 0&&t<=4}function Ei(){let e=(0,Te.useRef)(null),t=(0,Te.useRef)(null),n=(0,Te.useRef)(null),r=(0,Te.useRef)(null),i=(0,Te.useRef)(null),a=(0,Te.useRef)(null);return(0,Te.useEffect)(()=>{let s=!1,c=null,u=null,d=null,f=null,p=null,m=null,h=null,g=null,_=null,v=null,y=null,b=null,x=null,S=null,C=null,T=null;async function E(){let E=e.current,D=t.current,O=n.current;if(!E||!D||!O)return;let k=E;T=k,D.tabIndex=0,D.setAttribute(`aria-label`,`Pole lotu — sterowanie statkiem`),D.focus({preventScroll:!0});let j=window.matchMedia(`(prefers-reduced-motion: reduce)`).matches,N=Ti(),P=new A;P.onProgress=(e,t,n)=>{let r=n>0?Math.round(t/n*100):0;a.current&&(a.current.style.width=`${r}%`),i.current&&(i.current.textContent=`WCZYTYWANIE MISJI… ${r}%`)},P.onError=e=>{e.includes(`normandy-sr2-joshuas-cc0.glb`)||console.error(`[v4] failed to load asset:`,e)};let F=await st(D,{lowPower:N,reducedMotion:j,manager:P});if(s){F.dispose();return}c=F;let I=await Se(P,F.envMap);if(s){I.dispose(),F.dispose();return}u=I,F.scene.add(I.group);let L=await Kr(F.scene,{manager:P,skyTex:F.skyTex,envMap:F.envMap,lowPower:N,renderer:F.renderer});if(s){L.dispose(),I.dispose(),F.dispose();return}d=L;let R=Ht(E);p=R;let z=Lt(Ci,R.input);z.state.quaternion.copy(wi),f=z;let B=gn(F.camera),V=R.active||window.matchMedia(`(max-width: 480px), (hover: none)`).matches,ee=Dn(O,{touchActive:R.active,launchByTap:V,onLaunch:()=>{z.state.hasThrusted=!0}});m=ee;function H(e){k.classList.toggle(`is-prelaunch`,e),R.setArmed(!e)}H(!0),C=e=>{if(!V||!k.classList.contains(`is-prelaunch`))return;let t=e.target;t instanceof Element&&(t.closest(`a, .v4-loading, .v4-overlay, input, textarea, button.v4-comm__collapse, button.v4-comm__icon`)||(e.preventDefault(),z.state.hasThrusted=!0))},k.addEventListener(`pointerdown`,C),h=hi(O,{reducedMotion:j,startCollapsed:R.active}),g=_i(O),_=yi(O);let te=null,W=0,G=!1,ne=!1,ie=!1,K=new Set,ae=null,q=!1;function J(){z.state.position.copy(Ci),z.state.velocity.set(0,0,0),z.state.angularVelocity.set(0,0,0),z.state.bankAngle=0,z.state.quaternion.copy(wi),z.state.thrustLevel=0,z.state.brakeLevel=0,z.state.speed=0,z.state.hasThrusted=!1,q=!1,te=null,W=0,G=!1,ne=!1,ie=!1,K.clear(),ae=null,g?.hide(),v?.reset(),y?.reset(),h?.restart(),ee.reset(),B.holdLaunch(Ci,wi),H(!0)}v=xi(O,{reducedMotion:j,onRestart:()=>J()});let oe=Si(O,{onRestart:()=>J(),onSave:e=>{let t=ci(e,W);oe.updateBoard(t)}});y=oe,S=e=>{if(e.code!==`KeyR`)return;let t=e.target;t instanceof HTMLInputElement||t instanceof HTMLTextAreaElement||J()},window.addEventListener(`keydown`,S),x=()=>{F.setSize(k.clientWidth,k.clientHeight),z.state.hasThrusted||B.holdLaunch(Ci,wi)},window.addEventListener(`resize`,x),x(),B.holdLaunch(Ci,wi);let Y=!1,se=new w,ce=new w,X=null;new URLSearchParams(window.location.search).has(`debug`)&&(X=new M(I.group,16763972),X.name=`ship-debug-bounds`,X.visible=!1,F.scene.add(X),window.__v4={teleport(e,t){Y=!0,se.set(e[0],e[1],e[2]),ce.set(t[0],t[1],t[2])},spawnMeteor(e){L.debugForceMeteor(e)},getShipPos(){let e=z.state.position;return[e.x,e.y,e.z]},haltShip(){z.state.velocity.set(0,0,0),z.state.angularVelocity.set(0,0,0)},getHullSource(){return I.group.userData.hullSource??`unknown`},setShipVisible(e){I.group.visible=e},getChaseInfo(){let e=F.camera.position.clone().sub(I.group.position),t=new w(0,1,0).applyQuaternion(I.group.quaternion),n=new w(0,0,-1).applyQuaternion(I.group.quaternion);return{heightDot:e.dot(t),backDot:-e.dot(n),dist:e.length(),upDot:t.dot(new w(0,1,0))}},getScreenAabbs(){return window.__v4.getComposition().aabbs},getComposition(){let e=F.camera;e.updateMatrixWorld(),e.updateProjectionMatrix();let t=F.renderer.domElement,n=t.clientWidth,r=t.clientHeight,i=Math.min(n,r),a=.07*i,o=()=>({left:1/0,top:1/0,right:-1/0,bottom:-1/0}),s=(e,t,n)=>{e.left=Math.min(e.left,t),e.right=Math.max(e.right,t),e.top=Math.min(e.top,n),e.bottom=Math.max(e.bottom,n)},c=(t,i)=>{let a=t.clone().project(e);Number.isFinite(a.x+a.y)&&s(i,(a.x*.5+.5)*n,(-a.y*.5+.5)*r)},u=e=>{let t=o(),n=[new w(e.min.x,e.min.y,e.min.z),new w(e.min.x,e.min.y,e.max.z),new w(e.min.x,e.max.y,e.min.z),new w(e.min.x,e.max.y,e.max.z),new w(e.max.x,e.min.y,e.min.z),new w(e.max.x,e.min.y,e.max.z),new w(e.max.x,e.max.y,e.min.z),new w(e.max.x,e.max.y,e.max.z)];for(let e of n)c(e,t);return t},d=e=>({left:e.left,top:e.top,right:n-e.right,bottom:r-e.bottom}),f=(e,t)=>e.left<t.right-1&&e.right>t.left+1&&e.top<t.bottom-1&&e.bottom>t.top+1,p=(e,t)=>({left:e.left-t,top:e.top-t,right:e.right+t,bottom:e.bottom+t}),m=u(new re().setFromObject(I.group)),h=L.getBlackHoleRadii(),g=L.getBlackHoleDiskFrame(),_=e.position.distanceTo(Q),v=Q.clone().project(e),y=(v.x*.5+.5)*n,b=(-v.y*.5+.5)*r,x=l.degToRad(e.fov),S=Math.sqrt(Math.max(_*_-h.apparentShadow*h.apparentShadow,1)),C=h.apparentShadow/S/Math.tan(x/2)*(r*.5),T={left:y-C,top:b-C,right:y+C,bottom:b+C},E=o();for(let e=0;e<48;e++){let t=e/48*Math.PI*2;c(Q.clone().addScaledVector(g.u,Math.cos(t)*g.outer).addScaledVector(g.v,Math.sin(t)*g.outer),E)}let D=t.getBoundingClientRect(),k=O.querySelector(`.v4-hud__start-prompt`),A=null;if(k&&!k.classList.contains(`is-hidden`)){let e=k.getBoundingClientRect();A={left:e.left-D.left,top:e.top-D.top,right:e.right-D.left,bottom:e.bottom-D.top}}let j=d(m),M=d(T),N=d(E),P=(m.right-m.left)/n,R=(m.top+m.bottom)*.5/r,z=b/r,B={shipPrompt:A?f(p(m,6),A):!1,promptShadow:A?f(p(T,6),A):!1,promptDisk:A?f(p(E,6),A):!1},V=n>=900?a:.05*i,ee={shadowInFrame:M.left>=V&&M.right>=V&&M.top>=V&&M.bottom>=V,diskSignificantWidth:E.right-E.left>C*3.6&&N.left>4&&N.right>4,shipWidth:P>=.3&&P<=.45,shipLower:R>.55,bhUpper:z<.42,noPromptOverlap:!B.shipPrompt&&!B.promptShadow&&!B.promptDisk};return{viewport:{w:n,h:r,short:i,marginNeed:a,aspect:n/r},aabbs:{ship:m,bh:T,disk:E,prompt:A,viewport:{w:n,h:r}},shadow:{cx:y,cy:b,r:C,rect:T,margins:M,fracShort:C*2/i},disk:{rect:E,margins:N,widthFrac:(E.right-E.left)/n},ship:{rect:m,margins:j,widthFrac:P,cy:R},prompt:A,overlaps:B,pass:ee}},setShipPos(e){z.state.position.set(e[0],e[1],e[2]),z.state.velocity.set(0,0,0),z.state.angularVelocity.set(0,0,0)},getCameraPhase(){return Y?`debug-teleport`:B.getPhase()},getProbe(){let e=F.camera,t=z.state.position,n=new w(0,0,-1).applyQuaternion(e.quaternion),r=t.clone().sub(e.position),i=Q.clone().sub(e.position),a=r.length(),o=i.length(),s=r.dot(n),c=i.dot(n),l=Math.abs(s-c)<.5?`equal`:s<c?`ship`:`bh`,u=r.clone().normalize(),d=e.position.clone().sub(Q),f=d.dot(u),p=d.lengthSq()-11664,m=f*f-p,h=null;if(m>=0){let e=-f-Math.sqrt(m),t=-f+Math.sqrt(m);h=e>.02?e:t>.02?t:null}return{phase:Y?`debug-teleport`:B.getPhase(),hasThrusted:z.state.hasThrusted,camera:{pos:[e.position.x,e.position.y,e.position.z],fwd:[n.x,n.y,n.z]},ship:[t.x,t.y,t.z],bh:[Q.x,Q.y,Q.z],distShipBh:t.distanceTo(Q),distCamShip:a,distCamBh:o,camSpace:{shipFwd:s,bhFwd:c,closer:l},rayThroughShip:{tShip:a,tHorizon:h,sphereHitsBeforeShip:h!==null&&h<a-.05},layers:L.getBlackHoleLayerState(),radii:L.getBlackHoleRadii()}},setBhLayer(e,t){L.setBlackHoleLayerVisible(e,t)},getBhLayers(){return L.getBlackHoleLayerState()},showBounds(e){L.setBlackHoleDebugBounds(e),X&&(X.visible=e,e&&X.update())}});let Z=new w,le=new U,ue=new w(0,0,1);b=F.onTick((e,t)=>{let n=!ie;if(n){z.state.hasThrusted&&ti(z.state.position,z.state.velocity,e),z.update(e),!z.state.hasThrusted&&!Y&&(z.state.position.copy(Ci),z.state.velocity.set(0,0,0),z.state.angularVelocity.set(0,0,0),z.state.quaternion.copy(wi),z.state.bankAngle=0),I.group.position.copy(z.state.position),X?.visible&&X.update(),le.setFromAxisAngle(ue,z.state.bankAngle),I.group.quaternion.copy(z.state.quaternion).multiply(le),I.updateThrust(z.state.thrustLevel,t),z.state.hasThrusted&&!q&&(q=!0,H(!1),G||(G=!0,te=t),h?.dismiss()),G&&te!==null&&(W=(t-te)*1e3),z.state.position.distanceTo(Q)<Xr&&(ie=!0,z.state.velocity.set(0,0,0),z.state.angularVelocity.set(0,0,0),v?.trigger());for(let e of _n){let t=z.state.position.distanceTo(e.position),n=e.radius*2.5,r=e.radius*3.5;if(t<n&&ae!==e.id){ae=e.id;let t=o.find(t=>t.id===e.id);t&&(K.has(e.id)||(K.add(e.id),_?.show(t.title),K.size===_n.length&&!ne&&(ne=!0,G=!1,y?.show(W,si()))),g?.show(t,ui(e.id)))}else ae===e.id&&t>r&&(ae=null,g?.hide())}for(let e of _n){Z.copy(z.state.position).sub(e.position);let t=e.radius*1.12+2,n=Z.length();if(n<t&&n>1e-4){Z.multiplyScalar(1/n),z.state.position.copy(e.position).addScaledVector(Z,t);let r=z.state.velocity.dot(Z);r<0&&z.state.velocity.addScaledVector(Z,-r)}}L.forEachMoonCollider((e,t)=>{Z.copy(z.state.position).sub(e);let n=t*1.2+1.4,r=Z.length();if(r<n&&r>1e-4){Z.multiplyScalar(1/r),z.state.position.copy(e).addScaledVector(Z,n);let t=z.state.velocity.dot(Z);t<0&&z.state.velocity.addScaledVector(Z,-t)}})}Y?(F.camera.position.copy(se),F.camera.lookAt(ce)):n&&B.update(e,z.state.position,z.state.quaternion,z.state.thrustLevel,z.state.bankAngle,z.state.angularVelocity,{hasThrusted:z.state.hasThrusted,reducedMotion:window.matchMedia(`(prefers-reduced-motion: reduce)`).matches}),F.dust.update(F.camera.position,z.state.velocity),L.update(e,t,F.camera),ee.update({speed:z.state.speed,thrust:z.state.thrustLevel,hasThrusted:z.state.hasThrusted,missionMs:W,discovered:K,gravityAccel:n?ni(z.state.position):0})}),F.start(),r.current&&(r.current.classList.add(`is-hidden`),r.current.setAttribute(`aria-busy`,`false`),r.current.setAttribute(`aria-hidden`,`true`))}return E().catch(e=>{console.error(`[v4] init failed`,e);let t=r.current;t&&(t.classList.add(`is-error`),t.setAttribute(`aria-busy`,`false`)),i.current&&(i.current.textContent=`Nie udało się wczytać misji. Odśwież stronę.`)}),()=>{s=!0,x&&window.removeEventListener(`resize`,x),S&&window.removeEventListener(`keydown`,S),C&&T&&T.removeEventListener(`pointerdown`,C),b?.(),delete window.__v4,y?.dispose(),v?.dispose(),_?.dispose(),g?.dispose(),h?.dispose(),m?.dispose(),f?.dispose(),p?.dispose(),d?.dispose(),u?.dispose(),c?.stop(),c?.dispose()}},[]),(0,$.jsxs)(`div`,{className:`v4-root is-prelaunch`,ref:e,children:[(0,$.jsx)(`canvas`,{className:`v4-canvas`,ref:t}),(0,$.jsx)(`div`,{className:`v4-hud-container`,ref:n}),(0,$.jsxs)(`div`,{className:`v4-loading`,ref:r,"aria-live":`polite`,"aria-busy":`true`,role:`status`,children:[(0,$.jsx)(`div`,{className:`v4-loading__label`,ref:i,children:`WCZYTYWANIE MISJI… 0%`}),(0,$.jsx)(`div`,{className:`v4-loading__bar`,children:(0,$.jsx)(`div`,{className:`v4-loading__bar-fill`,ref:a})})]})]})}var Di=s.portfolioUrl.replace(/\/$/,``),Oi=`${Di}/#realizacje`;function ki(){let{locale:e}=i(),t=a(e).v4Fallback;return(0,$.jsx)(`div`,{className:`v4-fallback`,children:(0,$.jsxs)(`div`,{className:`v4-fallback__card`,children:[(0,$.jsx)(`p`,{className:`v4-fallback__eyebrow`,children:t.eyebrow}),(0,$.jsx)(`h1`,{className:`v4-fallback__title`,children:t.title}),(0,$.jsx)(`p`,{className:`v4-fallback__lead`,children:t.lead}),(0,$.jsx)(`div`,{className:`v4-fallback__list`,children:o.map(e=>(0,$.jsxs)(`a`,{className:`v4-fallback__item`,href:Cn(e.url)?e.url:Oi,target:`_blank`,rel:`noopener noreferrer`,children:[(0,$.jsx)(`span`,{className:`v4-fallback__item-title`,children:e.title}),(0,$.jsx)(`span`,{className:`v4-fallback__item-tagline`,children:e.tagline})]},e.id))}),(0,$.jsxs)(`div`,{className:`v4-fallback__actions`,children:[(0,$.jsx)(`a`,{className:`v4-fallback__cta`,href:Oi,children:t.seeWork}),(0,$.jsx)(`a`,{className:`v4-fallback__back`,href:Di,children:t.back})]}),(0,$.jsxs)(`p`,{className:`v4-fallback__hint`,children:[t.hintBefore,(0,$.jsx)(`a`,{href:s.gameUrl,rel:`noopener`,children:s.gameUrl.replace(/^https?:\/\//,``)}),t.hintAfter]})]})})}function Ai(){if(typeof window>`u`)return!1;try{return!!document.createElement(`canvas`).getContext(`webgl2`)}catch{return!1}}function ji(){let[e]=(0,Te.useState)(Ai);return e?(0,$.jsx)(Ei,{}):(0,$.jsx)(ki,{})}(0,we.createRoot)(document.getElementById(`root`)).render((0,$.jsx)(r,{children:(0,$.jsx)(ji,{})}));