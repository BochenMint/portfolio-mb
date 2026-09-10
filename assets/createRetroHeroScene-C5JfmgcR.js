const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/three-8V8V_zZj.js","assets/rolldown-runtime-QTnfLwEv.js"])))=>i.map(i=>d[i]);
import{n as e}from"./react-spline-CLS9LA80.js";import{a as t,d as n,f as ee,i as te,n as ne,o as r,p as i,t as a,u as o}from"./build-BX1ZBYnt.js";import{n as s,r as c}from"./heroSceneTypes-BBcQTCIc.js";var l=1313326,re=16727483,ie=16751933,ae=16735882,oe=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`,u=`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;

  vec3 skyTop  = vec3(0.078, 0.039, 0.180);
  vec3 skyMid  = vec3(0.560, 0.137, 0.420);
  vec3 horizon = vec3(1.000, 0.420, 0.380);

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  void main() {
    float y = vUv.y;
    vec3 col;
    if (y > 0.5) {
      float t = (y - 0.5) * 2.0;                 // 0 horizon → 1 top
      col = mix(horizon, mix(skyMid, skyTop, t * t), t);

      // stars (upper sky only, density fades toward horizon)
      vec2 sp = vec2(vUv.x * uAspect, vUv.y) * 90.0;
      vec2 id = floor(sp);
      float h = hash(id);
      float star = step(0.972, h) * smoothstep(0.5, 0.0, length(fract(sp) - 0.5));
      float tw = 0.5 + 0.5 * sin(uTime * 3.0 + h * 40.0);
      col += star * tw * vec3(1.0, 0.92, 0.85) * t;

      // soft horizon bloom
      col += horizon * pow(1.0 - t, 3.5) * 0.6;
    } else {
      // below horizon — dark floor base, slight warm tint near the line
      col = mix(vec3(0.015, 0.008, 0.04), horizon * 0.45, pow(y * 2.0, 1.5));
    }
    gl_FragColor = vec4(col, 1.0);
  }
`,d=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,f=`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;

  vec3 sunTop = vec3(1.000, 0.847, 0.420);
  vec3 sunBot = vec3(1.000, 0.239, 0.467);

  void main() {
    vec2 p = vUv - 0.5;
    float d = length(p) * 2.0;
    if (d > 1.0) discard;

    vec3 col = mix(sunBot, sunTop, vUv.y);

    // slits in the lower 55%, drifting slowly downward
    if (vUv.y < 0.55) {
      float bandY = (vUv.y * 16.0) - uTime * 0.6;
      float gap   = step(0.42, fract(bandY));
      float fade  = smoothstep(0.0, 0.55, vUv.y);   // fewer slits higher up
      float cut   = mix(1.0, gap, 1.0 - fade);
      float aedge = 1.0 - smoothstep(0.9, 1.0, d);
      gl_FragColor = vec4(col, cut * aedge);
      return;
    }

    float edge = 1.0 - smoothstep(0.92, 1.0, d);
    gl_FragColor = vec4(col, edge);
  }
`,p=`
  precision mediump float;
  varying vec2 vUv;
  uniform vec3 uColor;
  uniform float uPulse;
  void main() {
    float d = length(vUv - 0.5) * 2.0;
    float a = smoothstep(1.0, 0.0, d);
    a = pow(a, 2.2) * (0.55 + uPulse * 0.15);
    gl_FragColor = vec4(uColor, a);
  }
`,m=`
  varying vec3 vWorld;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorld = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,h=`
  precision highp float;
  varying vec3 vWorld;
  uniform float uTime;
  uniform vec3 uColorA;   // magenta (lines along view)
  uniform vec3 uColorB;   // amber (cross lines)
  uniform float uScale;

  void main() {
    vec2 p = vWorld.xz;
    p.y += uTime * 5.0;                       // scroll toward camera
    vec2 c = p * uScale;
    vec2 fr = fract(c);
    vec2 dist = min(fr, 1.0 - fr);            // distance to nearest line per-axis

    float lw = 0.018;
    float lineX = smoothstep(lw, 0.0, dist.x);
    float lineZ = smoothstep(lw, 0.0, dist.y);
    float glowX = exp(-dist.x * 13.0) * 0.5;
    float glowZ = exp(-dist.y * 13.0) * 0.5;
    float ix = lineX + glowX;
    float iz = lineZ + glowZ;
    float intensity = clamp(max(ix, iz), 0.0, 1.7);

    vec3 col = iz > ix ? uColorA : uColorB;

    float depth = -vWorld.z;                  // camera ~z=0 looking -z
    float fogFar  = smoothstep(160.0, 28.0, depth);
    float fogNear = smoothstep(-4.0, 14.0, depth);
    float sideFade = smoothstep(70.0, 22.0, abs(vWorld.x));
    float a = intensity * fogFar * fogNear * sideFade;
    if (a < 0.004) discard;

    gl_FragColor = vec4(col * intensity, a);
  }
`;async function g(g,_){let v=await e(()=>import(`./three-8V8V_zZj.js`).then(e=>e.d),__vite__mapDeps([0,1])),y=_.lowPower??!1,b=new v.WebGLRenderer({canvas:g,antialias:!y,alpha:!1,powerPreference:y?`default`:`high-performance`});b.setPixelRatio(c(y)),b.setClearColor(l,1),b.toneMapping=v.ACESFilmicToneMapping,b.toneMappingExposure=1.15;let x=new v.Scene,S=new v.PerspectiveCamera(62,1,.01,400),C=1.15;S.position.set(0,1.5,0),S.lookAt(0,C,-10);let w=new v.PlaneGeometry(2,2),T=new v.ShaderMaterial({vertexShader:oe,fragmentShader:u,uniforms:{uTime:{value:0},uAspect:{value:1}},depthTest:!1,depthWrite:!1}),E=new v.Scene,D=new v.OrthographicCamera(-1,1,1,-1,0,1);E.add(new v.Mesh(w,T));let O=new v.PlaneGeometry(320,320),k=new v.ShaderMaterial({vertexShader:m,fragmentShader:h,uniforms:{uTime:{value:0},uColorA:{value:new v.Color(re)},uColorB:{value:new v.Color(ie)},uScale:{value:y?.4:.5}},transparent:!0,blending:v.AdditiveBlending,depthWrite:!1}),A=new v.Mesh(O,k);A.rotation.x=-Math.PI/2,A.position.set(0,0,-140),A.renderOrder=0,x.add(A);let j=new v.CircleGeometry(.5,y?48:96),M=new v.ShaderMaterial({vertexShader:d,fragmentShader:f,uniforms:{uTime:{value:0}},transparent:!0}),N=new v.Mesh(j,M);N.position.set(0,1.85,-22),N.scale.setScalar(9),N.renderOrder=1,x.add(N);let P=new v.PlaneGeometry(1,1),F=new v.ShaderMaterial({vertexShader:d,fragmentShader:p,uniforms:{uColor:{value:new v.Color(ae)},uPulse:{value:0}},transparent:!0,blending:v.AdditiveBlending,depthWrite:!1}),I=new v.Mesh(P,F);I.position.set(0,1.85,-22.2),I.scale.setScalar(22),I.renderOrder=0,x.add(I);let L=new t(b,{multisampling:y?0:2});L.addPass(new n(E,D));let R=new n(x,S);R.clearPass.enabled=!1,L.addPass(R);let z=new ne({intensity:y?.9:1.7,luminanceThreshold:.25,luminanceSmoothing:.4,mipmapBlur:!0});L.addPass(new r(S,z));let B,V,H,U;y?(H=new i({offset:.3,darkness:.5}),L.addPass(new r(S,H))):(B=new te({offset:new v.Vector2(.0016,.0011),radialModulation:!0,modulationOffset:.4}),V=new ee({density:1.1}),V.blendMode.opacity.value=.18,H=new i({offset:.28,darkness:.62}),U=new o({blendFunction:a.OVERLAY,premultiply:!0}),U.blendMode.opacity.value=.085,L.addPass(new r(S,B,V,H,U)));let W=0,G=!1,K=0,q=0,J=.5,Y=.5,X=.5,Z=.5,Q,$=e=>{if(!G)return;let t=_.reducedMotion?0:Math.min(.05,q?(e-q)/1e3:.016);q=e,_.reducedMotion||(K+=t,k.uniforms.uTime.value=K,T.uniforms.uTime.value=K,M.uniforms.uTime.value=K,F.uniforms.uPulse.value=Math.sin(K*1.7)*.5+.5,X+=(J-X)*.06,Z+=(Y-Z)*.06,S.position.x=(X-.5)*.7,S.position.y=1.5+(Z-.5)*.25,S.lookAt(0,C,-10)),L.render(t),W=requestAnimationFrame($)};return{setSize(e,t){e<2||t<2||(b.setSize(e,t,!1),L.setSize(e,t),S.aspect=e/Math.max(t,1),S.updateProjectionMatrix(),T.uniforms.uAspect.value=e/Math.max(t,1))},start(){if(G)return;G=!0;let e=g.parentElement;e&&!_.reducedMotion&&(Q=s(e,(e,t)=>{J=e,Y=t})),W=requestAnimationFrame($)},stop(){G=!1,cancelAnimationFrame(W),Q?.(),Q=void 0},dispose(){G=!1,cancelAnimationFrame(W),Q?.(),w.dispose(),T.dispose(),O.dispose(),k.dispose(),j.dispose(),M.dispose(),P.dispose(),F.dispose(),L.dispose(),b.dispose(),b.getContext().getExtension(`WEBGL_lose_context`)?.loseContext()}}}export{g as createRetroHeroScene};