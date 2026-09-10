const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/three-8V8V_zZj.js","assets/rolldown-runtime-QTnfLwEv.js"])))=>i.map(i=>d[i]);
import{n as e}from"./react-spline-CLS9LA80.js";var t=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`,n=`
  precision highp float;
  uniform sampler2D uTexture;
  uniform vec2 uTexel;
  uniform vec2 uMouse;
  uniform float uAspect;
  uniform float uDissipation;
  uniform float uBrushRadius;
  uniform float uVelocity;
  uniform float uMouseSpeed;
  uniform float uWaveFrequency;
  uniform float uHeightClamp;
  uniform float uVelocityClamp;
  uniform float uIdleDamping;
  varying vec2 vUv;

  void main() {
    vec4 info = texture2D(uTexture, vUv);
    float height = info.r;
    float vel = info.g;

    float aspect = max(uAspect, 0.25);
    vec2 dx = vec2(uTexel.x / aspect, 0.0);
    vec2 dy = vec2(0.0, uTexel.y);

    float left = texture2D(uTexture, vUv - dx).r;
    float right = texture2D(uTexture, vUv + dx).r;
    float up = texture2D(uTexture, vUv + dy).r;
    float down = texture2D(uTexture, vUv - dy).r;

    vel += (left + right + up + down) * uWaveFrequency - height * uWaveFrequency;
    vel *= uDissipation;
    height += vel;

    vec2 toMouse = (vUv - uMouse) * vec2(aspect, 1.0);
    float dist = length(toMouse);
    float brush = 1.0 - smoothstep(uBrushRadius * 0.08, uBrushRadius, dist);
    float speedBoost = 0.4 + min(uMouseSpeed, 2.8) * 0.55;
    vel += brush * uVelocity * speedBoost;

    height = clamp(height, -uHeightClamp, uHeightClamp);
    vel = clamp(vel, -uVelocityClamp, uVelocityClamp);

    height *= uIdleDamping;
    vel *= uIdleDamping;

    gl_FragColor = vec4(height, vel, 0.0, 1.0);
  }
`,r=`
  uniform sampler2D uDisplacementMap;
  uniform float uVertexStrength;
  uniform float uMaxVertexOffset;
  uniform float uProgress;
  uniform float uIntroStrength;
  uniform vec2 uCoverCenter;
  uniform float uCoverZoom;
  varying vec2 vUv;

  vec2 coverMapUv(vec2 uv) {
    float z = max(uCoverZoom, 1.0);
    return (uv - uCoverCenter) / z + uCoverCenter;
  }

  void main() {
    vUv = uv;
    vec3 pos = position;
    float disp = texture2D(uDisplacementMap, coverMapUv(uv)).r;
    float center = length(uv - 0.5);
    float intro = (1.0 - smoothstep(0.0, 0.78, center)) * uIntroStrength * (1.0 - uProgress);
    float z = (disp + intro) * uVertexStrength;
    z = clamp(z, -uMaxVertexOffset, uMaxVertexOffset);
    pos.z += z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`,i=`
  precision highp float;
  uniform sampler2D uMap;
  uniform sampler2D uDisplacementMap;
  uniform vec2 uGradTexel;
  uniform float uDistortStrength;
  uniform float uMaxDistort;
  uniform float uChromaticStrength;
  uniform float uProgress;
  uniform float uIntroStrength;
  uniform vec2 uCoverCenter;
  uniform float uCoverZoom;
  varying vec2 vUv;

  vec2 coverMapUv(vec2 uv) {
    float z = max(uCoverZoom, 1.0);
    return (uv - uCoverCenter) / z + uCoverCenter;
  }

  void main() {
    vec2 mapUv = coverMapUv(vUv);
    float h = texture2D(uDisplacementMap, mapUv).r;
    float hL = texture2D(uDisplacementMap, mapUv - vec2(uGradTexel.x, 0.0)).r;
    float hR = texture2D(uDisplacementMap, mapUv + vec2(uGradTexel.x, 0.0)).r;
    float hD = texture2D(uDisplacementMap, mapUv - vec2(0.0, uGradTexel.y)).r;
    float hU = texture2D(uDisplacementMap, mapUv + vec2(0.0, uGradTexel.y)).r;
    vec2 grad = vec2(hR - hL, hU - hD);

    float center = length(vUv - 0.5);
    float intro = (1.0 - smoothstep(0.0, 0.78, center)) * uIntroStrength * (1.0 - uProgress);
    grad += vec2(intro * 0.04);

    vec2 offset = clamp(grad * uDistortStrength, -uMaxDistort, uMaxDistort);
    vec2 uv = clamp(mapUv + offset, 0.001, 0.999);
    vec3 col = texture2D(uMap, uv).rgb;

    if (uChromaticStrength > 0.0001) {
      vec2 chroma = grad * uChromaticStrength;
      col.r = texture2D(uMap, clamp(mapUv + offset + chroma, 0.001, 0.999)).r;
      col.b = texture2D(uMap, clamp(mapUv + offset - chroma, 0.001, 0.999)).b;
    }

    gl_FragColor = vec4(col, 1.0);
  }
`;async function a(a,l,u,d={}){let f=await e(()=>import(`./three-8V8V_zZj.js`).then(e=>e.d),__vite__mapDeps([0,1])),p=new f.WebGLRenderer({canvas:a,antialias:!0,alpha:!0,powerPreference:`high-performance`,preserveDrawingBuffer:!0});p.setPixelRatio(Math.min(window.devicePixelRatio,2));let m=new f.Scene,h=new f.OrthographicCamera(-1,1,1,-1,0,1),g=s(f,p),_={minFilter:f.LinearFilter,magFilter:f.LinearFilter,format:f.RGBAFormat,type:g},v=u.simResolution,y=new f.WebGLRenderTarget(v,v,_),b=new f.WebGLRenderTarget(v,v,_);o(p,y),o(p,b);let x=new f.ShaderMaterial({uniforms:{uTexture:{value:null},uTexel:{value:new f.Vector2(1/v,1/v)},uMouse:{value:new f.Vector2(.5,.5)},uAspect:{value:1},uDissipation:{value:u.dissipation},uBrushRadius:{value:u.brushRadius},uVelocity:{value:0},uMouseSpeed:{value:0},uWaveFrequency:{value:u.waveFrequency},uHeightClamp:{value:u.heightClamp},uVelocityClamp:{value:u.velocityClamp},uIdleDamping:{value:1}},vertexShader:t,fragmentShader:n}),S=new f.Mesh(new f.PlaneGeometry(2,2),x);m.add(S);let C=Math.max(1,d.zoom??1),w=d.centerY??.5,T=new f.Vector2(.5,w),E=new f.Scene,D=new f.PerspectiveCamera(45,1,.1,100);D.position.z=2.2;let O=Math.min(u.vertexStrength*u.heightClamp*1.15,.18),k=await c(f,l);k.colorSpace=f.SRGBColorSpace,k.minFilter=f.LinearFilter,k.magFilter=f.LinearFilter;let A=new f.ShaderMaterial({uniforms:{uMap:{value:k},uDisplacementMap:{value:y.texture},uGradTexel:{value:new f.Vector2(1/v,1/v)},uVertexStrength:{value:u.vertexStrength},uMaxVertexOffset:{value:O},uDistortStrength:{value:u.distortStrength},uMaxDistort:{value:u.distortStrength*1.35},uChromaticStrength:{value:u.chromaticStrength},uProgress:{value:0},uIntroStrength:{value:u.introWaveStrength},uCoverCenter:{value:T.clone()},uCoverZoom:{value:C}},vertexShader:r,fragmentShader:i,transparent:!0}),j=new f.PlaneGeometry(1,1,u.planeSegments,u.planeSegments),M=new f.Mesh(j,A);E.add(M);let N={x:.5,y:.5,active:!1,speed:0},P={x:.5,y:.5,speed:0},F=0,I=1,L=1,R=0,z=!1,B=!1,V=()=>{let e=I/Math.max(L,1);x.uniforms.uAspect.value=e;let t=1/v/Math.max(e,.25);A.uniforms.uGradTexel.value.set(t,1/v)},H=()=>{let e=k.image?k.image.width/k.image.height:16/9,t=I/Math.max(L,1),n=Math.abs(D.position.z),r=f.MathUtils.degToRad(D.fov),i=2*Math.tan(r/2)*n,a=i*t,o=a,s=i;t>e?s=a/e:o=i*e,M.scale.set(o,s,1),V()},U=()=>{let e=N.active?.14:.06;P.x+=(N.x-P.x)*e,P.y+=(N.y-P.y)*e,P.speed+=(N.speed-P.speed)*(N.active?.22:.08);let t=N.active?1:.952;x.uniforms.uIdleDamping.value=t,x.uniforms.uDissipation.value=N.active?u.dissipation:Math.min(u.dissipation+.008,.99),x.uniforms.uTexture.value=y.texture,x.uniforms.uMouse.value.set(P.x,1-P.y),x.uniforms.uVelocity.value=N.active?u.brushVelocity:0,x.uniforms.uMouseSpeed.value=N.active?P.speed:0,p.setRenderTarget(b),p.render(m,h),p.setRenderTarget(null);let n=y;y=b,b=n,A.uniforms.uDisplacementMap.value=y.texture},W=()=>{z&&(U(),A.uniforms.uProgress.value=F,p.setClearColor(0,0),p.render(E,D),R=requestAnimationFrame(W))};return B=!0,{get ready(){return B},setSize(e,t){e<2||t<2||(I=e,L=t,p.setSize(e,t,!1),D.aspect=e/Math.max(t,1),D.updateProjectionMatrix(),H())},setMouse(e,t,n,r=0){N={x:Number.isFinite(e)?Math.min(1,Math.max(0,e)):P.x,y:Number.isFinite(t)?Math.min(1,Math.max(0,t)):P.y,active:n,speed:n&&Number.isFinite(r)?Math.min(3.2,Math.max(0,r)):0}},setIntroProgress(e){F=Math.min(1,Math.max(0,e))},start(){z||(z=!0,R=requestAnimationFrame(W))},stop(){z=!1,cancelAnimationFrame(R)},dispose(){z=!1,cancelAnimationFrame(R),k.dispose(),j.dispose(),A.dispose(),x.dispose(),y.dispose(),b.dispose(),S.geometry.dispose(),p.dispose(),p.getContext().getExtension(`WEBGL_lose_context`)?.loseContext()}}}function o(e,t){let n=e.getRenderTarget();e.setRenderTarget(t),e.setClearColor(0,0),e.clear(),e.setRenderTarget(n)}function s(e,t){if(!t.capabilities.isWebGL2)return e.UnsignedByteType;try{let n=t.getContext();return n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT)?e.HalfFloatType:e.UnsignedByteType}catch{return e.UnsignedByteType}}function c(e,t){return new Promise((n,r)=>{new e.TextureLoader().load(t,n,void 0,r)})}export{a as createDisplacementEffect};