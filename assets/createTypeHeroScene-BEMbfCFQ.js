const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/three-5t8Jrc3N.js","assets/rolldown-runtime-QTnfLwEv.js"])))=>i.map(i=>d[i]);
import{t as e}from"./preload-helper-zJ_50EbN.js";import{a as t,d as n,i as r,n as i,o as a,p as o}from"./build-B_dLGevH.js";import{n as s,r as c}from"./heroSceneTypes-BBcQTCIc.js";var l=`
  uniform sampler2D uMap;
  uniform sampler2D uNoise;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uDispStrength;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec2 nUv = texture2D(uNoise, uv * 1.8 + uTime * 0.03).rg;
    vec2 m = (uMouse - 0.5) * 2.0;
    float breathe = sin(uTime * 1.2 + uv.y * 6.0) * 0.012;
    vec2 offset = (nUv - 0.5) * uDispStrength + m * 0.04 * uDispStrength;
    offset += vec2(breathe, breathe * 0.6);
    vec3 pos = position + normal * length(offset) * 0.35;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`,u=`
  precision highp float;
  uniform sampler2D uMap;
  uniform float uTime;
  uniform vec2 uMouse;
  varying vec2 vUv;

  void main() {
    vec2 m = (uMouse - 0.5) * 0.02;
    float ca = 0.0035 + 0.002 * sin(uTime * 0.8);
    float r = texture2D(uMap, vUv + m + vec2(ca, 0.0)).r;
    float g = texture2D(uMap, vUv + m).g;
    float b = texture2D(uMap, vUv + m - vec2(ca, 0.0)).b;
    float a = texture2D(uMap, vUv + m).a;
    vec3 col = vec3(r, g, b);
    col += vec3(0.15, 0.25, 0.35) * (1.0 - a) * 0.15;
    gl_FragColor = vec4(col, a * 0.28);
  }
`;function d(e,t,n,r){let i=document.createElement(`canvas`);i.width=n,i.height=r;let a=i.getContext(`2d`);if(!a)throw Error(`2d context unavailable`);a.clearRect(0,0,n,r);let o=a.createLinearGradient(0,0,n,r);o.addColorStop(0,`rgba(240, 236, 228, 0.95)`),o.addColorStop(1,`rgba(200, 210, 230, 0.85)`),a.fillStyle=o;let s=Math.round(n*.11);a.font=`700 ${s}px "Bebas Neue", "Arial Narrow", sans-serif`,a.textAlign=`left`,a.textBaseline=`middle`;let c=s*.92,l=t.length*c,u=r*.38-l/2+c/2;for(let e of t)a.fillText(e.toUpperCase(),n*.06,u),u+=c;let d=new e.CanvasTexture(i);return d.colorSpace=e.SRGBColorSpace,d.minFilter=e.LinearFilter,d.magFilter=e.LinearFilter,d.needsUpdate=!0,d}function f(e){let t=new Uint8Array(16384*4);for(let e=0;e<16384;e++){let n=Math.random()*255;t[e*4]=n,t[e*4+1]=n,t[e*4+2]=n,t[e*4+3]=255}let n=new e.DataTexture(t,128,128);return n.wrapS=n.wrapT=e.RepeatWrapping,n.needsUpdate=!0,n}async function p(p,m,h){let g=await e(()=>import(`./three-5t8Jrc3N.js`).then(e=>e.d),__vite__mapDeps([0,1]));await document.fonts.load(`700 1em "Bebas Neue"`);let _=h.lowPower??!1,v=new g.WebGLRenderer({canvas:p,antialias:!_,alpha:!0,powerPreference:_?`default`:`high-performance`});v.setPixelRatio(c(_)),v.setClearColor(0,0);let y=new g.Scene,b=new g.PerspectiveCamera(38,1,.1,40);b.position.z=3.2;let x=d(g,m,2048,1024),S=f(g),C=new g.ShaderMaterial({uniforms:{uMap:{value:x},uNoise:{value:S},uTime:{value:0},uMouse:{value:new g.Vector2(.5,.5)},uDispStrength:{value:h.reducedMotion?.02:_?.045:.09}},vertexShader:l,fragmentShader:u,transparent:!0,depthWrite:!1}),w=h.reducedMotion?32:_?48:72,T=new g.Mesh(new g.PlaneGeometry(1,1,w,w),C);T.position.set(-.15,.05,0),y.add(T);let E=new t(v,{multisampling:0});E.addPass(new n(y,b)),E.addPass(new a(b,new i({intensity:1.1,luminanceThreshold:.35,luminanceSmoothing:.4}),new r({offset:new g.Vector2(.0025,.0015),radialModulation:!0,modulationOffset:.2}),new o({darkness:.4,offset:.35})));let D=1,O=1,k=0,A=!1,j=0,M=0,N=new g.Vector2(.5,.5),P=new g.Vector2(.5,.5),F=!1,I,L=()=>{let e=D/Math.max(O,1);b.aspect=e,b.updateProjectionMatrix();let t=b.position.z,n=g.MathUtils.degToRad(b.fov),r=2*Math.tan(n/2)*t,i=r*e*.95,a=i/2;a>r*.55&&(a=r*.55,i=a*2),T.scale.set(i,a,1)},R=e=>{if(!A)return;let t=h.reducedMotion?0:Math.min(.05,M?(e-M)/1e3:.016);if(M=e,!h.reducedMotion){j+=t;let e=F?.1:.04;N.lerp(P,e),T.rotation.y=Math.sin(j*.35)*.02,T.rotation.x=Math.cos(j*.28)*.015}C.uniforms.uTime.value=j,C.uniforms.uMouse.value.copy(N),E.render(t),k=requestAnimationFrame(R)};return{setSize(e,t){e<2||t<2||(D=e,O=t,v.setSize(e,t,!1),E.setSize(e,t),L())},start(){if(A)return;A=!0;let e=p.parentElement;e&&!h.reducedMotion&&(I=s(e,(e,t,n)=>{P.set(e,t),F=n})),k=requestAnimationFrame(R)},stop(){A=!1,cancelAnimationFrame(k),I?.(),I=void 0},dispose(){A=!1,cancelAnimationFrame(k),I?.(),T.geometry.dispose(),C.dispose(),x.dispose(),S.dispose(),E.dispose(),v.dispose(),v.getContext().getExtension(`WEBGL_lose_context`)?.loseContext()}}}export{p as createTypeHeroScene};