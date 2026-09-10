const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/three-8V8V_zZj.js","assets/rolldown-runtime-QTnfLwEv.js"])))=>i.map(i=>d[i]);
import{n as e}from"./react-spline-CLS9LA80.js";import{n as t}from"./pointerSurface-DbvqVcVS.js";import{r as n}from"./heroSceneTypes-BBcQTCIc.js";var r=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 1.0, 1.0);
  }
`,i=`
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uAspect;
  uniform vec2 uMouse;
  uniform float uBars;
  uniform float uScrim;
  uniform float uBeam;

  const vec3 INK       = vec3(0.024, 0.042, 0.034);
  const vec3 COPPER    = vec3(0.780, 0.478, 0.278);
  const vec3 BRIGHT    = vec3(0.910, 0.698, 0.438);
  const vec3 SEA_GLASS = vec3(0.208, 0.448, 0.478);
  const vec3 EMBER     = vec3(0.478, 0.312, 0.188);
  const vec3 SEA       = vec3(0.188, 0.438, 0.468);

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  // ── Pole światła ZA szybą (czysta matematyka — tanie wielokrotne próbkowanie)
  vec3 lightField(vec2 uv) {
    vec2 p = vec2(uv.x * uAspect, uv.y);

    // główne słońce — góra-prawo, dryfuje + reaguje na mysz
    // portret: słońce wyżej, żeby gorący punkt nie siedział za nagłówkiem
    float portrait = max(0.0, 1.0 - uAspect);
    vec2 sun = vec2(
      (0.72 + (uMouse.x - 0.5) * 0.28 + 0.02 * sin(uTime * 0.23)) * uAspect,
      0.70 + portrait * 0.35 + (uMouse.y - 0.5) * 0.22 + 0.04 * sin(uTime * 0.17)
    );
    // żar — dół-lewo, wolny obieg
    vec2 ember = vec2(
      (0.18 + 0.05 * sin(uTime * 0.11)) * uAspect,
      0.14 + 0.05 * cos(uTime * 0.14)
    );
    // mała gorąca drobina wędrująca środkiem (życie w tle)
    vec2 spark = vec2(
      (0.45 + 0.22 * sin(uTime * 0.07)) * uAspect,
      0.38 + 0.18 * sin(uTime * 0.09 + 1.7)
    );

    // portret: bez korekty słońce zalewa cały wąski ekran (x ściśnięty przez aspect)
    float aspectFix = 1.0 + 1.7 * max(0.0, 1.0 - uAspect);
    float gSun = exp(-pow(distance(p, sun), 2.0) * 2.4 * aspectFix);
    float gEmb = exp(-pow(distance(p, ember), 2.0) * 3.0 * aspectFix);
    float gSpk = exp(-pow(distance(p, spark), 2.0) * 9.0);

    float tealZone = smoothstep(0.75, 0.0, uv.x) * smoothstep(0.15, 0.85, uv.y);
    float darkZone = smoothstep(0.45, 0.95, uv.x) * smoothstep(0.55, 0.02, uv.y);

    vec3 col = INK;
    col = mix(col, SEA, tealZone * 1.22);
    col += EMBER * gEmb * 1.18;
    col = mix(col, SEA_GLASS, clamp(gSun * 1.24, 0.0, 1.0));
    col = mix(col, COPPER, clamp(pow(gSun, 1.55) * 1.38, 0.0, 1.0));
    col = mix(col, BRIGHT, clamp(pow(gSun, 3.6) * 1.08, 0.0, 1.0));
    col += SEA_GLASS * gSpk * 0.68;
    col = mix(col, INK, darkZone * 0.82);

    // pionowa linia świetlna ZA szkłem — podświetla ryfle od dołu,
    // pozycja podąża za kursorem (refrakcja żeber łamie ją naturalnie)
    float beamX = 0.62 + (uMouse.x - 0.5) * 0.34;
    float dxB = abs(uv.x - beamX);
    float beamCore = exp(-pow(dxB / 0.0055, 2.0));
    float beamGlow = exp(-pow(dxB / 0.055, 2.0));
    float lift = smoothstep(1.1, 0.0, uv.y);                 // najjaśniej przy dole
    float beam = (beamCore * 1.5 + beamGlow * 0.5) * (0.30 + 0.85 * lift);
    col += BRIGHT * beam * uBeam;
    // gorący punkt u podstawy linii (źródło światła "od spodu")
    float base = exp(-pow(distance(uv, vec2(beamX, 0.02)) / 0.11, 2.0));
    col += BRIGHT * base * 0.55 * uBeam;

    return col;
  }

  void main() {
    vec2 uv = vUv;

    // ── geometria żebra ──
    float fx = fract(uv.x * uBars);          // 0..1 w poprzek żebra
    float c = fx - 0.5;                       // -0.5..0.5 (środek żebra = 0)

    // profil soczewki cylindrycznej: przesunięcie próbkowania rośnie ku krawędzi
    float bend = sign(c) * pow(abs(c) * 2.0, 1.6);
    float refr = bend * (10.0 / uBars) * 0.55;   // siła załamania
    // delikatna falistość szkła (nierówność ryfli)
    float wob = sin(uv.y * 9.0 + uTime * 0.4 + floor(uv.x * uBars) * 1.7) * 0.004;

    vec2 ruv = vec2(uv.x + refr + wob, uv.y);

    // ── dyspersja chromatyczna na krawędziach (szkło rozszczepia) ──
    float disp = abs(bend) * 0.010;
    vec3 col;
    col.r = lightField(ruv + vec2(disp, 0.0)).r;
    col.g = lightField(ruv).g;
    col.b = lightField(ruv - vec2(disp, 0.0)).b;

    // ── pionowa smuga (fluted glass rozmywa w pionie) ──
    vec3 smear = lightField(ruv + vec2(0.0, 0.045)) + lightField(ruv - vec2(0.0, 0.055));
    col = mix(col, (col + smear) / 3.0, 0.55);

    // ── cieniowanie szkła ──
    // ciemna spoina między żebrami
    float seam = smoothstep(0.0, 0.06, fx) * smoothstep(1.0, 0.94, fx);
    col *= mix(0.30, 1.0, seam);
    // środek żebra lekko jaśniejszy (grubość szkła)
    col *= 0.82 + 0.30 * exp(-pow(c / 0.30, 2.0));

    // specular na grzbiecie żebra — podwójny refleks, zależny od jasności tła
    float lum = dot(lightField(ruv), vec3(0.299, 0.587, 0.114));
    float spec1 = exp(-pow((fx - 0.18) / 0.045, 2.0));
    float spec2 = exp(-pow((fx - 0.86) / 0.035, 2.0));
    col += vec3(0.94, 0.86, 0.74) * (spec1 * 0.9 + spec2 * 0.45) * (0.10 + 0.75 * lum);

    // mleczność szkła (frost) — subtelna, bez wybielania
    col = mix(col, col + vec3(0.014, 0.020, 0.018), 0.32);

    // ── scrim pod typografię ──
    float scrim = exp(-pow((uv.x - 0.5) / 0.46, 2.0)) * exp(-pow((uv.y - 0.42) / 0.40, 2.0));
    col = mix(col, INK, scrim * uScrim);

    // winieta + ziarno
    float vig = smoothstep(1.35, 0.40, length(uv - 0.5));
    col *= mix(0.62, 1.0, vig);
    float n = hash(uv * (310.0 + mod(uTime, 7.0)));
    col += (n - 0.5) * 0.028;

    gl_FragColor = vec4(col, 1.0);
  }
`;async function a(a,o){let s=await e(()=>import(`./three-8V8V_zZj.js`).then(e=>e.d),__vite__mapDeps([0,1])),c=o.lowPower??!1,l=new s.WebGLRenderer({canvas:a,antialias:!1,alpha:!1,powerPreference:c?`default`:`high-performance`});l.setPixelRatio(n(c));let u=new s.Scene,d=new s.OrthographicCamera(-1,1,1,-1,0,1),f=new s.PlaneGeometry(2,2),p=new s.ShaderMaterial({vertexShader:r,fragmentShader:i,uniforms:{uTime:{value:0},uAspect:{value:1},uMouse:{value:new s.Vector2(.5,.5)},uBars:{value:c?26:42},uScrim:{value:c?.58:.42},uBeam:{value:c?.7:1}},depthTest:!1,depthWrite:!1});u.add(new s.Mesh(f,p));let m=0,h=!1,g=0,_=0,v=.5,y=.5,b=.5,x=.5,S,C=e=>{if(!h)return;let t=o.reducedMotion?0:Math.min(.05,_?(e-_)/1e3:.016);_=e,o.reducedMotion||(g+=t,b+=(v-b)*.085,x+=(y-x)*.085,p.uniforms.uTime.value=g,p.uniforms.uMouse.value.set(b,x)),l.render(u,d),m=requestAnimationFrame(C)},w=e=>{let n=t(e.clientX,e.clientY,a);v=n.nx,y=1-n.ny};return{setSize(e,t){e<2||t<2||(l.setSize(e,t,!1),p.uniforms.uAspect.value=e/Math.max(t,1))},start(){h||(h=!0,o.reducedMotion||(window.addEventListener(`pointermove`,w,{passive:!0}),S=()=>window.removeEventListener(`pointermove`,w)),m=requestAnimationFrame(C))},stop(){h=!1,cancelAnimationFrame(m),S?.(),S=void 0},dispose(){h=!1,cancelAnimationFrame(m),S?.(),f.dispose(),p.dispose(),l.dispose(),l.getContext().getExtension(`WEBGL_lose_context`)?.loseContext()}}}export{a as createPleatedScene};