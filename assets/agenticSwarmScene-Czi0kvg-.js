const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/three-8V8V_zZj.js","assets/rolldown-runtime-QTnfLwEv.js"])))=>i.map(i=>d[i]);
import{n as e}from"./react-spline-CLS9LA80.js";import{n as t}from"./pointerSurface-DbvqVcVS.js";import{r as n,t as r}from"./heroSceneTypes-BBcQTCIc.js";function i(e){let t=e|0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var a=659469,o=7031346,s=12088138,c=13935988,l=2,u=3,d=1.5,f=.55;function p(e,t){let n=(d+f*Math.cos(u*e))*Math.cos(l*e),r=(d+f*Math.cos(u*e))*Math.sin(l*e),i=f*Math.sin(u*e);return t[0]=n*1.55,t[1]=r*.95,t[2]=i*1.15,t}function m(e){return 1+.65*Math.sin(3*e+1.1)+.4*Math.sin(7*e+2.3)+.25*Math.sin(11*e+.4)}var h=1337,g=.85,_=1.9,v=.1,y=.06,b=.45,x=.55,S=.9,C=1.35,w=.7,T=.12,E=45,D=12,O=-.4,k=1.1,A={x:.2,y:.35,z:.1},j=D-2.5,M=15.5,N=3*Math.PI/180,P=6e4,F=25e3,I=2.4,L=3.1;function ee(e,t){let n=i(h),r=0;for(let e=0;e<512;e++)r=Math.max(r,m(e/512*Math.PI*2));r*=1.02;let l=Math.floor(t*v),u=Math.floor(t*y),d=t-l-u,f=new Float32Array(t*3),b=new Float32Array(t*3),x=new Float32Array(t),S=new Float32Array(t),C=new e.Color(o),w=new e.Color(s),T=new e.Color(c),E=new e.Color(a),D=new e.Color,O=new Float32Array(3),k=new Float32Array(3),A=0;for(let t=0;t<d;t++,A++){let t,i;do t=n()*Math.PI*2,i=m(t);while(n()*r>i);p(t,O),p(t+.002,k);let a=k[0]-O[0],o=k[1]-O[1],s=k[2]-O[2],c=Math.hypot(a,o,s)||1;a/=c,o/=c,s/=c;let l=-o,u=a,d=0,h=Math.hypot(l,u,d);h<1e-4&&(l=1,u=0,d=0,h=1),l/=h,u/=h,d/=h;let v=o*d-s*u,y=s*l-a*d,E=a*u-o*l,j=n()<.72,M=j?g*n()**+_:g*(1.2+n()*2),N=n()*Math.PI*2,P=l*Math.cos(N)+v*Math.sin(N),F=u*Math.cos(N)+y*Math.sin(N),I=d*Math.cos(N)+E*Math.sin(N);f[A*3]=O[0]+P*M,f[A*3+1]=O[1]+F*M,f[A*3+2]=O[2]+I*M;let L=j?e.MathUtils.clamp(1-M/g,0,1):.12*n();L>.55?D.copy(w).lerp(T,(L-.55)/.45):D.copy(C).lerp(w,L/.55),b[A*3]=D.r,b[A*3+1]=D.g,b[A*3+2]=D.b,x[A]=j?1+n()*.6:.7+n()*.4,S[A]=j?.62+L*.5:.16+n()*.18}for(let e=0;e<l;e++,A++){p(n()*Math.PI*2,O);let e=n()*2-1,t=n()*2-1,r=n()*2-1,i=Math.hypot(e,t,r)||1,a=g*(2.6+n()*3.2);f[A*3]=O[0]+e/i*a,f[A*3+1]=O[1]+t/i*a,f[A*3+2]=O[2]+r/i*a,D.copy(C).lerp(E,.15+n()*.25),b[A*3]=D.r,b[A*3+1]=D.g,b[A*3+2]=D.b,x[A]=.55+n()*.35,S[A]=.05+n()*.09}for(let e=0;e<u;e++,A++)f[A*3]=(n()*2-1)*4.2,f[A*3+1]=(n()*2-1)*3,f[A*3+2]=(n()*2-1)*3.2,D.copy(C).lerp(E,.35+n()*.35),b[A*3]=D.r,b[A*3+1]=D.g,b[A*3+2]=D.b,x[A]=.5+n()*.3,S[A]=.03+n()*.06;return{positions:f,colors:b,sizes:x,alphas:S}}var te=`
  attribute vec3 aColor;
  attribute float aSize;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFog;
  uniform float uPixelRatio;
  uniform float uBasePx;
  uniform float uFogNear;
  uniform float uFogFar;
  uniform float uCurlFreq;
  uniform float uCurlAmp;
  uniform vec3 uCurlOffset;

  
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + 2.0 * C.xxx;
    vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;

    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  // Three decorrelated noise channels (fixed offsets), curl of which gives a
  // divergence-free flow field — mirrors the offline reference's makeCurl().
  float nX(vec3 p) { return snoise(p); }
  float nY(vec3 p) { return snoise(p + vec3(37.2, 91.1, 13.7)); }
  float nZ(vec3 p) { return snoise(p + vec3(-71.4, 5.3, 47.9)); }

  vec3 curlNoise(vec3 p) {
    float e = 0.06;
    float dFz_dy = (nZ(p + vec3(0.0, e, 0.0)) - nZ(p - vec3(0.0, e, 0.0))) / (2.0 * e);
    float dFy_dz = (nY(p + vec3(0.0, 0.0, e)) - nY(p - vec3(0.0, 0.0, e))) / (2.0 * e);
    float dFx_dz = (nX(p + vec3(0.0, 0.0, e)) - nX(p - vec3(0.0, 0.0, e))) / (2.0 * e);
    float dFz_dx = (nZ(p + vec3(e, 0.0, 0.0)) - nZ(p - vec3(e, 0.0, 0.0))) / (2.0 * e);
    float dFy_dx = (nY(p + vec3(e, 0.0, 0.0)) - nY(p - vec3(e, 0.0, 0.0))) / (2.0 * e);
    float dFx_dy = (nX(p + vec3(0.0, e, 0.0)) - nX(p - vec3(0.0, e, 0.0))) / (2.0 * e);
    return vec3(dFz_dy - dFy_dz, dFx_dz - dFz_dx, dFy_dx - dFx_dy);
  }


  void main() {
    vColor = aColor;

    // Anchors stay fixed; only the sampled region of the curl-noise field
    // drifts over time (uCurlOffset), so the internal flow keeps moving
    // without the swarm's centroid running away.
    vec3 p = position * uCurlFreq + uCurlOffset;
    vec3 c = curlNoise(p);
    vec3 displaced = position + c * uCurlAmp;

    vec4 mv = modelViewMatrix * vec4(displaced, 1.0);
    float dist = -mv.z;
    vFog = clamp((dist - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
    vAlpha = aAlpha * (1.0 - 0.65 * vFog);
    gl_Position = projectionMatrix * mv;
    float sizeAtten = mix(1.15, 0.55, vFog);
    gl_PointSize = aSize * uBasePx * uPixelRatio * sizeAtten;
  }
`,ne=`
  precision mediump float;
  varying vec3 vColor;
  varying float vAlpha;
  varying float vFog;
  uniform vec3 uInk;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv) * 2.0;
    float alpha = smoothstep(1.0, 0.0, d);
    alpha = pow(alpha, 1.4);
    if (alpha < 0.02) discard;
    vec3 col = mix(vColor, uInk, vFog * 0.9);
    float a = alpha * vAlpha;
    gl_FragColor = vec4(col * a, a);
  }
`;async function R(i,o){let s=await e(()=>import(`./three-8V8V_zZj.js`).then(e=>e.d),__vite__mapDeps([0,1])),c=o.lowPower??!1,l=c?F:P,u=c?L:I,d=n(c),f=new s.WebGLRenderer({canvas:i,antialias:!c,alpha:!1,powerPreference:c?`default`:`high-performance`});f.setPixelRatio(d),f.setClearColor(a,1),f.outputColorSpace=s.SRGBColorSpace,f.toneMapping=s.ACESFilmicToneMapping,f.toneMappingExposure=C;let p=new s.Scene;p.background=new s.Color(a);let m=new s.PerspectiveCamera(E,1,.1,30);m.position.set(0,O,D),m.lookAt(0,0,0);let h=new s.Group;h.position.x=k,h.rotation.set(A.x,A.y,A.z),p.add(h);let{positions:g,colors:_,sizes:v,alphas:y}=ee(s,l),R=new s.BufferGeometry;R.setAttribute(`position`,new s.BufferAttribute(g,3)),R.setAttribute(`aColor`,new s.BufferAttribute(_,3)),R.setAttribute(`aSize`,new s.BufferAttribute(v,1)),R.setAttribute(`aAlpha`,new s.BufferAttribute(y,1));let z=new s.Color(a),B=new s.Vector3,V=new s.ShaderMaterial({uniforms:{uPixelRatio:{value:d},uBasePx:{value:u},uFogNear:{value:j},uFogFar:{value:M},uCurlFreq:{value:b},uCurlAmp:{value:x},uCurlOffset:{value:B},uInk:{value:new s.Vector3(z.r,z.g,z.b)}},vertexShader:te,fragmentShader:ne,transparent:!0,depthWrite:!1,depthTest:!0,blending:s.AdditiveBlending}),re=new s.Points(R,V);h.add(re);let H=e=>{B.set(S*Math.cos(e),S*Math.sin(e),S*Math.cos(e+Math.PI/2)*.6)},U=0,W=!1,G=0,K=0,q=0,J=0,Y=0,X=0,Z,Q=e=>{if(!W)return;let t=Math.min(.05,K?(e-K)/1e3:.016);K=e,G+=t,H(w+G*T),Y+=(q-Y)*r,X+=(J-X)*r,h.rotation.x=A.x+Y,h.rotation.y=A.y+X,f.render(p,m),U=requestAnimationFrame(Q)},$=e=>{let n=t(e.clientX,e.clientY,i),r=n.nx*2-1,a=n.ny*2-1;J=r*N,q=a*N};return{setSize(e,t){e<2||t<2||(f.setSize(e,t,!1),m.aspect=e/Math.max(t,1),m.updateProjectionMatrix(),o.reducedMotion&&W&&f.render(p,m))},start(){if(!W){if(W=!0,o.reducedMotion){H(w),f.render(p,m);return}window.addEventListener(`pointermove`,$,{passive:!0}),Z=()=>window.removeEventListener(`pointermove`,$),U=requestAnimationFrame(Q)}},stop(){W=!1,cancelAnimationFrame(U),Z?.(),Z=void 0},dispose(){W=!1,cancelAnimationFrame(U),Z?.(),R.dispose(),V.dispose(),f.dispose(),f.getContext().getExtension(`WEBGL_lose_context`)?.loseContext()}}}export{R as createAgenticSwarmScene};