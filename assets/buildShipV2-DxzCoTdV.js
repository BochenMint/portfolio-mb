import{n as e}from"./rolldown-runtime-QTnfLwEv.js";import{$ as t,B as n,C as r,Ct as i,D as a,E as o,I as s,L as c,Nt as l,S as u,St as d,Z as f,a as p,c as m,gt as h,l as g,mt as _,nt as v,tt as y,ut as b,v as x,vt as S,xt as C,yt as w}from"./three-PTrTQivD.js";var T={ink:526343,amber:16098596,amberBright:16762977,amberDeep:15234586,coral:16735802},E=new l(600,400,250).normalize(),D=f.degToRad(.1),O=`
  const vec3 SUN_DIR = vec3(${E.x.toFixed(6)}, ${E.y.toFixed(6)}, ${E.z.toFixed(6)});
`,k=`
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`,A=`
  float hash21(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float vnoise2(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm2(vec2 p, int octaves) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      sum += amp * vnoise2(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return sum;
  }

  float hash31(vec3 p) {
    p = fract(p * vec3(443.897, 441.423, 437.195));
    p += dot(p, p.yzx + 19.19);
    return fract((p.x + p.y) * p.z);
  }

  float vnoise3(vec3 p) {
    vec3 i = floor(p);
    vec3 f = fract(p);
    vec3 u = f * f * (3.0 - 2.0 * f);
    float n000 = hash31(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash31(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash31(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash31(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash31(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash31(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash31(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash31(i + vec3(1.0, 1.0, 1.0));
    float nx00 = mix(n000, n100, u.x);
    float nx10 = mix(n010, n110, u.x);
    float nx01 = mix(n001, n101, u.x);
    float nx11 = mix(n011, n111, u.x);
    float nxy0 = mix(nx00, nx10, u.y);
    float nxy1 = mix(nx01, nx11, u.y);
    return mix(nxy0, nxy1, u.z);
  }

  float fbm3(vec3 p, int octaves) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 6; i++) {
      if (i >= octaves) break;
      sum += amp * vnoise3(p);
      p *= 2.03;
      amp *= 0.5;
    }
    return sum;
  }
`,j=`
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  void main() {
    vUv = uv;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,M=`
  varying vec2 vUv;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  varying vec3 vLocalDir;

  void main() {
    vUv = uv;
    vLocalDir = normalize(position);
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,N=`
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,P=`
  uniform vec3 uColor;
  uniform float uPower;
  uniform float uIntensity;
  varying vec3 vNormalW;
  varying vec3 vWorldPos;

  void main() {
    vec3 n = normalize(vNormalW);
    vec3 v = normalize(cameraPosition - vWorldPos);
    float fres = pow(1.0 - clamp(dot(n, v), 0.0, 1.0), uPower);
    float a = fres * uIntensity;
    gl_FragColor = vec4(uColor * a, a);
    ${k}
  }
`;function F(e,n,r){let{power:i=2.6,intensity:a=1.1,segments:s=48}=r??{},c=new C(e*1.06,s,Math.max(16,Math.floor(s/1.5))),l=new S({uniforms:{uColor:{value:new o(n)},uPower:{value:i},uIntensity:{value:a}},vertexShader:N,fragmentShader:P,transparent:!0,depthWrite:!1,blending:2}),u=new t(c,l);return u.renderOrder=3,{mesh:u,dispose(){c.dispose(),l.dispose()}}}function ee(e){let t=e|0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function te(e,t){let n=Math.cos(e),r=Math.sin(e),i=Math.max(t.roundness,1.001),a=Math.max(t.roundnessY??t.roundness,1.001),o=Math.max(t.roundnessBottom??t.roundnessY??t.roundness,1.001),s=r>=0?a:o,c=r>=0?t.halfHeight:t.halfHeightBottom??t.halfHeight;return[Math.sign(n)*Math.abs(n)**(2/i)*t.halfWidth,Math.sign(r)*Math.abs(r)**(2/s)*c]}function ne(e,t){let n=Math.cos(e),r=Math.sin(e),i=t.length;for(let e=0;e<i;e++){let a=t[e][0],o=t[e][1],s=t[(e+1)%i][0],c=t[(e+1)%i][1],l=s-a,u=c-o,d=n*-u- -l*r;if(Math.abs(d)<1e-10)continue;let f=(-a*u+l*o)/d,p=(n*o-a*r)/d;if(f>1e-8&&p>=-1e-5&&p<=1.00001)return[n*f,r*f]}return[n*.01,r*.01]}function re(e,t,n){let r=[];for(let i=0;i<6;i++){let a=(i+.5)*(Math.PI/3),o=Math.sin(a)>=0?t:n;r.push([Math.cos(a)*e,Math.sin(a)*o])}return r}function ie(e,t,n){return[[e,0],[0,t],[-e,0],[0,-n]]}function I(e,t){let n=te(e,t),r=t.shape??`superellipse`;if(r===`superellipse`)return n;let i=t.halfHeightBottom??t.halfHeight,a=ne(e,r===`diamond`?ie(t.halfWidth,t.halfHeight,i):re(t.halfWidth,t.halfHeight,i)),o=f.clamp(t.cornerBlend??.08,0,1);return o<=0?a:[a[0]+(n[0]-a[0])*o,a[1]+(n[1]-a[1])*o]}function ae(e,t){let n=e.length,r=[],i=[];for(let a=0;a<n;a++){let o=e[a],s=a/(n-1);for(let e=0;e<t;e++){let[n,a]=I(e/t*Math.PI*2,o);r.push(n+(o.centerX??0),a+(o.centerY??0),o.z),i.push(e/t,s)}}let a=[];for(let e=0;e<n-1;e++){let n=e*t,r=(e+1)*t;for(let e=0;e<t;e++){let i=(e+1)%t,o=n+e,s=n+i,c=r+e,l=r+i;a.push(o,s,c),a.push(s,l,c)}}let o=new u;return o.setAttribute(`position`,new c(r,3)),o.setAttribute(`uv`,new c(i,2)),o.setIndex(a),o.computeVertexNormals(),o}function oe(e,t,n){let r=[e.centerX??0,e.centerY??0,e.z],i=[.5,.5];for(let n=0;n<t;n++){let a=n/t*Math.PI*2,[o,s]=I(a,e);r.push(o+(e.centerX??0),s+(e.centerY??0),e.z),i.push(.5+Math.cos(a)*.5,.5+Math.sin(a)*.5)}let a=[];for(let e=0;e<t;e++){let r=(e+1)%t;n>0?a.push(0,1+e,1+r):a.push(0,1+r,1+e)}let o=new u;return o.setAttribute(`position`,new c(r,3)),o.setAttribute(`uv`,new c(i,2)),o.setIndex(a),o.computeVertexNormals(),o}function se(e){let t=e.length,n=e.map(e=>e[0]),r=e.map(e=>e[1]),i=[];for(let e=0;e<t-1;e++)i.push((r[e+1]-r[e])/(n[e+1]-n[e]));let a=Array(t).fill(0);a[0]=i[0],a[t-1]=i[t-2];for(let e=1;e<t-1;e++)a[e]=i[e-1]*i[e]<=0?0:(i[e-1]+i[e])/2;for(let e=0;e<t-1;e++){if(i[e]===0){a[e]=0,a[e+1]=0;continue}let t=a[e]/i[e],n=a[e+1]/i[e],r=t*t+n*n;if(r>9){let o=3/Math.sqrt(r);a[e]=o*t*i[e],a[e+1]=o*n*i[e]}}return{xs:n,ys:r,ms:a}}function ce(e,t){let{xs:n,ys:r,ms:i}=e,a=n.length;if(t<=n[0])return r[0];if(t>=n[a-1])return r[a-1];let o=0;for(;o<a-2&&t>n[o+1];)o++;let s=n[o+1]-n[o],c=(t-n[o])/s,l=c*c,u=l*c,d=2*u-3*l+1,f=u-2*l+c,p=-2*u+3*l,m=u-l;return d*r[o]+f*s*i[o]+p*r[o+1]+m*s*i[o+1]}var le=new WeakMap;function L(e,t){let n=le.get(e);return n||(n=se(e),le.set(e,n)),ce(n,t)}function ue(){let e=document.createElement(`canvas`);e.width=512,e.height=512;let t=e.getContext(`2d`);t.fillStyle=`#c9c9c9`,t.fillRect(0,0,512,512);let n=1337,i=()=>(n=n*1103515245+12345&2147483647,(n>>>0)/2147483647),a=[0];for(let e=1;e<9;e++)a.push(e/9*512+(i()-.5)*(512/9)*.3);a.push(512);let o=[0];for(let e=1;e<14;e++)o.push(e/14*512+(i()-.5)*(512/14)*.3);o.push(512),t.strokeStyle=`rgba(40,42,46,0.55)`,t.lineWidth=2;for(let e of a)t.beginPath(),t.moveTo(e,0),t.lineTo(e,512),t.stroke();for(let e of o)t.beginPath(),t.moveTo(0,e),t.lineTo(512,e),t.stroke();for(let e=0;e<14;e++)for(let n=0;n<9;n++){let r=190+Math.floor((i()-.5)*26);t.fillStyle=`rgba(${r},${r},${r+2},0.5)`,t.fillRect(a[n]+1,o[e]+1,a[n+1]-a[n]-2,o[e+1]-o[e]-2)}t.fillStyle=`rgba(60,62,66,0.5)`;for(let e=0;e<260;e++){let e=i()*512,n=i()*512;t.beginPath(),t.arc(e,n,1.4,0,Math.PI*2),t.fill()}let s=t.getImageData(0,0,512,512),c=s.data;for(let e=0;e<c.length;e+=4){let t=(i()-.5)*10;c[e]=Math.min(255,Math.max(0,c[e]+t)),c[e+1]=Math.min(255,Math.max(0,c[e+1]+t)),c[e+2]=Math.min(255,Math.max(0,c[e+2]+t))}t.putImageData(s,0,0);let l=new r(e);return l.wrapS=_,l.wrapT=_,l.colorSpace=``,l.needsUpdate=!0,l}function de(){let e=document.createElement(`canvas`);e.width=128,e.height=64;let t=e.getContext(`2d`);if(!t)return null;let n=t.createLinearGradient(0,0,0,64);n.addColorStop(0,`#8b929c`),n.addColorStop(.22,`#4a515c`),n.addColorStop(.48,`#2a2f38`),n.addColorStop(.72,`#1a1d22`),n.addColorStop(1,`#101114`),t.fillStyle=n,t.fillRect(0,0,128,64);let i=t.createLinearGradient(0,64*.12,0,64*.5);i.addColorStop(0,`rgba(228, 231, 236, 0.55)`),i.addColorStop(.45,`rgba(196, 202, 212, 0.32)`),i.addColorStop(1,`rgba(196, 202, 212, 0)`),t.fillStyle=i,t.fillRect(128*.18,64*.1,128*.64,64*.38);let a=t.createRadialGradient(128*.72,64*.28,2,128*.72,64*.28,128*.34);a.addColorStop(0,`rgba(210, 216, 224, 0.42)`),a.addColorStop(1,`rgba(210, 216, 224, 0)`),t.fillStyle=a,t.fillRect(0,0,128,64);let o=new r(e);return o.mapping=303,o.colorSpace=h,o.needsUpdate=!0,o}function fe(e){let t=de();if(!t)return{map:null,dispose(){}};if(!e)return{map:t,dispose(){t.dispose()}};let n=new g(e);n.compileEquirectangularShader();let r=n.fromEquirectangular(t);return t.dispose(),n.dispose(),{map:r.texture,dispose(){r.dispose()}}}function R(e,t,n){t&&(e.envMap=t,e.envMapIntensity=n)}function z(e,t){let n=fe(t??null),r=e??n.map,i=n.map??e,a=ue(),s=a.clone();s.image=a.image,s.repeat.set(6,2),s.needsUpdate=!0;let c=new y({color:2764342,metalness:.9,roughness:.27,roughnessMap:s,clearcoat:.08,clearcoatRoughness:.46});R(c,r,.58);let l=new y({color:15001580,metalness:1,roughness:.12,clearcoat:.28,clearcoatRoughness:.16});R(l,i,1.08);let u=new y({color:3813932,metalness:.32,roughness:.56,clearcoat:.06,clearcoatRoughness:.5});R(u,r,.28);let d=new y({color:659992,metalness:.18,roughness:.08,clearcoat:.72,clearcoatRoughness:.1,emissive:new o(397336),emissiveIntensity:.12});R(d,i,.82);let f=new y({color:1708558,metalness:.72,roughness:.4,emissive:new o(2757640),emissiveIntensity:.18});return R(f,r,.32),{graphite:c,chrome:l,ceramic:u,glass:d,heat:f,dispose(){c.dispose(),l.dispose(),u.dispose(),d.dispose(),f.dispose(),a.dispose(),s.dispose(),n.dispose()}}}function B(e){return new v({color:e,emissive:new o(e),emissiveIntensity:.42,roughness:.55,metalness:0})}var V=34,H=V/2,pe=28,U=44,me=[[0,.16],[.08,.34],[.18,.7],[.32,1.28],[.48,2.15],[.6,3.15],[.67,3.72],[.78,3.38],[.9,2.78],[1,2.48]],he=[[0,.1],[.12,.36],[.3,.68],[.5,.98],[.67,1.18],[.86,.82],[1,.44]],ge=[[0,.08],[.16,.26],[.4,.48],[.67,.62],[1,.3]],_e=[[0,1.22],[.3,1.28],[.67,1.32],[1,1.4]],ve=[[0,2.05],[.4,2.2],[1,2.35]],ye=[[0,2.4],[1,2.85]];function W(e){return{halfWidth:L(me,e),halfHeight:L(he,e),halfHeightBottom:L(ge,e),roundness:L(_e,e),roundnessY:L(ve,e),roundnessBottom:L(ye,e),centerX:0,centerY:.04}}function G(e){return W(f.clamp((e+H)/V,0,1))}function K(e,t,n=!0){let r=ae(e,t);if(!n)return r;let i=oe(e[0],t,-1),a=oe(e[e.length-1],t,1),o=m([r,i,a]);return r.dispose(),i.dispose(),a.dispose(),o}function be(e){let t=e.index?e.toNonIndexed():e,n=t.getAttribute(`position`),r=n.count,i=new Float32Array(r*3);i.set(n.array.subarray(0,r*3));let a=new Float32Array(r*2),o=t.getAttribute(`uv`);if(o)for(let e=0;e<r;e++)a[e*2]=o.getX(e),a[e*2+1]=o.getY(e);let s=new u;return s.setAttribute(`position`,new c(i,3)),s.setAttribute(`uv`,new c(a,2)),s.computeVertexNormals(),t!==e&&t.dispose(),e.dispose(),s}function xe(e){let t=e.clone();t.scale(-1,1,1);let n=t.getIndex();if(n){for(let e=0;e<n.count;e+=3){let t=n.getX(e+1);n.setX(e+1,n.getX(e+2)),n.setX(e+2,t)}n.needsUpdate=!0}return t.computeVertexNormals(),t}function Se(){let e=[];for(let t=0;t<U;t++){let n=t/(U-1),r=W(n);e.push({z:-17+n*V,...r})}return K(e,pe)}function q(e,t,n,r,i,a=18,o=5){let s=[],l=[],d=[];for(let c=0;c<=a;c++){let u=f.lerp(e,t,c/a),p=G(u);for(let e=0;e<=o;e++){let[t,m]=I(f.degToRad(f.lerp(n,r,e/o)),p),h=Math.hypot(t,m)||1,g=t/h,_=m/h;s.push(t+g*i+p.centerX,m+_*i+p.centerY,u),d.push(g,_),l.push(e/o,c/a)}}let p=o+1,m=[];for(let e=0;e<a;e++)for(let t=0;t<o;t++){let n=e*p+t,r=n+1,i=n+p,a=i+1;m.push(n,i,r,r,i,a)}let h=new u;h.setAttribute(`position`,new c(s,3)),h.setAttribute(`uv`,new c(l,2)),h.setIndex(m),h.computeVertexNormals();let g=h.getAttribute(`normal`),_=Math.floor(a/2*p+o/2);if(g.getX(_)*d[_*2]+g.getY(_)*d[_*2+1]<0){let e=h.getIndex();for(let t=0;t<e.count;t+=3){let n=e.getX(t+1);e.setX(t+1,e.getX(t+2)),e.setX(t+2,n)}e.needsUpdate=!0,h.computeVertexNormals()}return h}var Ce=-8.84,we=-3.3999999999999986;function Te(){let e=[];for(let t=0;t<12;t++){let n=t/11,r=Ce+n*(we-Ce),i=G(r),a=n<.35?f.lerp(.05,.22,n/.35):n<.75?f.lerp(.22,.18,(n-.35)/.4):f.lerp(.18,.05,(n-.75)/.25),o=n<.4?f.lerp(.1,.28,n/.4):f.lerp(.28,.1,(n-.4)/.6);e.push({z:r,centerX:0,centerY:i.centerY+i.halfHeight+a*.22,halfWidth:o,halfHeight:a,roundness:2.4,roundnessY:2.1,roundnessBottom:3.2})}return K(e,16)}function Ee(e){let t=[];for(let n=0;n<10;n++){let r=n/9,i;i=r<.28?f.lerp(.07,.26,r/.28):f.lerp(.26,.12,(r-.28)/.72);let a=i*.7;t.push({z:f.lerp(-17.92,-14.55,r),centerX:e*f.lerp(1.22,.2,r),centerY:f.lerp(-.04,.05,r),halfWidth:i,halfHeight:a,halfHeightBottom:a*.85,roundness:1.28,shape:`diamond`,cornerBlend:.1})}return K(t,12)}function De(){let e=[];for(let t=0;t<8;t++){let n=t/7,r=n<.18?f.lerp(.02,.048,n/.18):f.lerp(.048,.03,(n-.18)/.82);e.push({z:f.lerp(-18.05,-15.65,n),centerY:.06,halfWidth:r,halfHeight:r*.85,roundness:1.55,shape:`diamond`,cornerBlend:.2})}return K(e,10)}function Oe(e){return K([{z:-17.92,centerX:e*1.22,centerY:-.02,halfWidth:.04,halfHeight:.03,roundness:1.35,shape:`diamond`,cornerBlend:.1},{z:-17.55,centerX:e*1.05,centerY:-.01,halfWidth:.12,halfHeight:.08,roundness:1.32,shape:`diamond`,cornerBlend:.1}],10)}function ke(){return K([{z:-18.05,centerY:.06,halfWidth:.012,halfHeight:.01,roundness:1.4,shape:`diamond`,cornerBlend:.15},{z:-17.72,centerY:.06,halfWidth:.038,halfHeight:.03,roundness:1.45,shape:`diamond`,cornerBlend:.15}],10)}var Ae=4.6,je=16.55,Me=18;function Ne(e,t,n){let r=G(t).halfWidth,i=f.lerp(.08,.22,n);return e*(r*.86+i)}function Pe(e){return G(e).centerY-.2}function Fe(e){let t=[];for(let n=0;n<Me;n++){let r=n/(Me-1),i=f.lerp(Ae,je,r),a;a=r<.16?f.lerp(.16,.5,r/.16):r<.78?f.lerp(.5,.58,(r-.16)/.62):f.lerp(.58,.52,(r-.78)/.22);let o=a*.78;t.push({z:i,centerX:Ne(e,i,r),centerY:Pe(i),halfWidth:a,halfHeight:o,halfHeightBottom:o*.9,roundness:1.35,shape:`hexagon`,cornerBlend:.1})}return K(t,12)}function J(e,t,n){let r=[];for(let i=0;i<5;i++){let a=i/4,o=f.lerp(.78,1,a);r.push({z:a*n,halfWidth:e/2*o,halfHeight:t/2*o,halfHeightBottom:t/2*o*.92,roundness:1.3,shape:`diamond`,cornerBlend:.06})}return K(r,12,!1)}function Y(e,t,n,r,i){let a=new w;a.moveTo(0,0),a.lineTo(t,0),a.lineTo(r+n,e),a.lineTo(r,e),a.closePath();let o=new s(a,{depth:i,bevelEnabled:!0,bevelThickness:i*.28,bevelSize:i*.22,bevelSegments:1});return o.translate(0,0,-i/2),o.rotateY(-Math.PI/2),o.computeVertexNormals(),o}function Ie(e,r){let i=z(e,r),a=new n;a.name=`ship-hull-mb-kite`;let o={graphite:[],chrome:[],ceramic:[],glass:[],heat:[]};function s(e,t){o[t].push(be(e))}s(Se(),`graphite`),s(Ee(1),`graphite`),s(Ee(-1),`graphite`),s(De(),`graphite`),s(ke(),`chrome`),s(Fe(1),`graphite`),s(Fe(-1),`graphite`),s(Te(),`glass`),s(q(-15.4,H-1.8,-11,11,.02,22,5),`chrome`),s(q(-15.4,H-1.8,169,191,.02,22,5),`chrome`),s(q(-16.8,-13.8,32,62,.024,10,4),`chrome`),s(q(-16.8,-13.8,118,148,.024,10,4),`chrome`);let c=Y(1.52,4.8,.55,2.4,.07);c.translate(0,G(4.2).halfHeight+.02,4.2),s(c,`graphite`);let u=Y(1.5,.42,.12,.18,.045);u.translate(0,G(2.4).halfHeight+.04,2.2),s(u,`chrome`);let d=Y(1.28,1.35,.22,.7,.045),f=d.clone();f.rotateZ(-Math.PI/2),f.rotateY(-.16),f.translate(.82,.06,-11.2);let p=xe(f);d.dispose(),s(f,`chrome`),s(p,`chrome`),s(Oe(1),`chrome`),s(Oe(-1),`chrome`);let h=.78,g=.36,_=[];for(let e of[1,-1]){let t=je,n=Ne(e,t,1),r=Pe(t),i=J(h,g,.72);i.translate(n,r,t),s(i,`ceramic`);let a=J(h*.72,g*.7,.12);a.translate(n,r,17.183600000000002),s(a,`heat`),_.push(new l(n,r,17.31))}let v=H-.35,y=J(.52,.18,.55);y.translate(0,-.02,v),s(y,`ceramic`);let b=J(.36,.12,.1);b.translate(0,-.02,17.07),s(b,`heat`),_.push(new l(0,-.02,17.229999999999997));let S=[],w={graphite:i.graphite,chrome:i.chrome,ceramic:i.ceramic,glass:i.glass,heat:i.heat};for(let e of Object.keys(o)){let n=o[e];if(!n.length)continue;let r=m(n,!1);if(!r){for(let r of n){S.push(r);let n=new t(r,w[e]);n.name=`mb-kite-${e}`,e===`glass`&&(n.renderOrder=1),a.add(n)}continue}for(let e of n)e.dispose();be(r),S.push(r);let i=new t(r,w[e]);i.name=`mb-kite-${e}`,e===`glass`&&(i.renderOrder=1),a.add(i)}let T=new x().setFromObject(a).getCenter(new l);for(let e of S)e.translate(-T.x,-T.y,-T.z),e.computeBoundingBox(),e.computeBoundingSphere();for(let e of _)e.sub(T);let E=new C(.06,10,8);S.push(E);let D=B(16722474),O=B(2883422),k=_[0],A=_[1],j=new t(E,D);j.position.set(A.x-.72,A.y+.16,A.z-5.2),j.name=`nav-port`,a.add(j);let M=new t(E,O);M.position.set(k.x+.72,k.y+.16,k.z-5.2),M.name=`nav-starboard`,a.add(M);let N=new x().setFromObject(a).getSize(new l),P=0,F=0;return a.traverse(e=>{if(!(e instanceof t)||!e.visible)return;F+=1;let n=e.geometry,r=n.getIndex();P+=r?r.count/3:n.getAttribute(`position`).count/3}),a.userData.hullStats={tris:P,drawCalls:F,length:N.z,span:N.x,height:N.y},a.userData.engineAnchors=_.map(e=>e.toArray()),{group:a,nozzleAttachPoints:_,dispose(){for(let e of S)e.dispose();D.dispose(),O.dispose(),i.dispose()}}}var Le=`/v4/assets/ships/normandy-sr2-joshuas-cc0.glb`,Re=28,ze=Math.PI;function Be(e){let t=new x().setFromObject(e),r=new l;t.getCenter(r),e.position.sub(r);let i=new l;t.getSize(i);let a=new n;a.add(e),i.x>=i.y&&i.x>=i.z?a.rotation.y=Math.PI/2:i.y>i.x&&i.y>=i.z&&(a.rotation.x=Math.PI/2),a.rotation.y+=ze;let o=new x().setFromObject(a),s=new l;o.getSize(s);let c=Re/Math.max(s.z,1e-4),u=new n;return u.name=`normandy-glb-hull`,u.add(a),u.scale.setScalar(c),{group:u,box:new x().setFromObject(u)}}function Ve(e){let t=e.min,n=e.max,r=(t.x+n.x)/2,i=t.y+(n.y-t.y)*.42,a=n.z-t.z,o=n.z,s=(n.x-t.x)*.36,c=(n.y-t.y)*.14,u=o-a*.04;return[new l(r+s,i-c,o),new l(r+s,i+c*.6,o),new l(r-s,i-c,o),new l(r-s,i+c*.6,o),new l(r+s*.22,i,u),new l(r-s*.22,i,u)]}function He(e,n,r){let i=z(n,r),a=[i.graphite,i.chrome,i.ceramic,i.glass,i.heat],o=0;return e.traverse(e=>{if(e instanceof t){let t=e.name.toLowerCase();t.includes(`glass`)||t.includes(`canopy`)||t.includes(`window`)?e.material=i.glass:t.includes(`stripe`)||t.includes(`band`)||t.includes(`ceramic`)?e.material=i.ceramic:t.includes(`engine`)||t.includes(`nozzle`)||t.includes(`dark`)||t.includes(`heat`)?e.material=i.heat:t.includes(`chrome`)||t.includes(`edge`)?e.material=i.chrome:e.material=o%5==0?i.ceramic:i.graphite,e.castShadow=!1,e.receiveShadow=!1,o+=1}}),a}function Ue(e,n,r){let{group:i,box:a}=Be(e.scene.clone(!0)),o=He(i,n,r),s=Ve(a),c=[];return i.traverse(e=>{e instanceof t&&c.push(e.geometry)}),{group:i,nozzleAttachPoints:s,dispose(){for(let e of c)e.dispose();for(let e of o)e.dispose()}}}async function We(){try{let e=await fetch(Le,{method:`GET`,headers:{Range:`bytes=0-11`},cache:`force-cache`});if(!e.ok||(e.headers.get(`content-type`)??``).includes(`text/html`))return!1;let t=new Uint8Array(await e.arrayBuffer());return t.byteLength<4?!1:t[0]===103&&t[1]===108&&t[2]===84&&t[3]===70}catch{return!1}}async function Ge(e,t,n){if(!(typeof location<`u`&&new URLSearchParams(location.search).has(`glb`))||!await We())return{hull:Ie(t,n),source:`procedural`};try{return{hull:Ue(await new p(e).loadAsync(Le),t,n),source:`glb`}}catch{return{hull:Ie(t,n),source:`procedural`}}}var Ke=.22,qe=1.35,X=new o(2779788),Je=new o(5941448),Ye=2.2,Xe=12,Z=.45,Ze=4.6,Q=.11,Qe=.3,$e=new o(15267071),et=new o(3061992);function tt(){let e=new a(1,1,20,12,!0);return e.translate(0,.5,0),e.rotateX(Math.PI/2),e}var nt=`
  varying vec3 vLocalPos;
  void main() {
    vLocalPos = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`,rt=`
  precision highp float;
  uniform float uTime;
  uniform float uThrust;
  uniform float uPhase;
  uniform vec3 uColorCore;
  uniform vec3 uColorMid;
  varying vec3 vLocalPos;

  ${A}

  void main() {
    float frac = clamp(vLocalPos.z, 0.0, 1.0);
    float ang = atan(vLocalPos.y, vLocalPos.x);

    float scrollSpeed = 3.0 + uThrust * 9.0;
    vec2 flowUv = vec2(ang * 1.6, frac * 5.0 - uTime * scrollSpeed - uPhase);
    float turb = fbm2(flowUv, 4);
    float turb2 = fbm2(flowUv * 2.3 + 7.1, 3);
    float turbMix = mix(turb, turb2, 0.4);

    float lengthFade = pow(1.0 - frac, 1.6);
    float amp = mix(0.16, 0.55, uThrust);
    float density = clamp(lengthFade * (1.0 - amp + amp * turbMix * 1.4), 0.0, 1.0);

    vec3 color = mix(uColorMid, uColorCore, smoothstep(0.55, 0.0, frac));

    float alpha = density * smoothstep(1.0, 0.05, frac);
    if (alpha < 0.02) discard;
    gl_FragColor = vec4(color * (0.6 + density * 1.2), alpha);
    ${k}
  }
`;function it(){let e=document.createElement(`canvas`);e.width=128,e.height=128;let t=e.getContext(`2d`),n=t.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2);n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.35,`rgba(150,210,255,0.65)`),n.addColorStop(1,`rgba(80,160,255,0)`),t.fillStyle=n,t.fillRect(0,0,128,128);let i=new r(e);return i.needsUpdate=!0,i}function at(e){let r=new n;r.name=`engine-fx`;let a=new u;a.setAttribute(`position`,new c([0,.15,0,.34,0,0,0,-.15,0,-.34,0,0],3)),a.setAttribute(`uv`,new c([.5,1,1,.5,.5,0,0,.5],2)),a.setIndex([0,1,2,0,2,3]),a.computeVertexNormals();let s=new v({color:1581870,emissive:X.clone(),emissiveIntensity:Ke,metalness:.6,roughness:.3,side:2}),p=it(),m=new i({map:p,color:X.clone(),transparent:!0,depthWrite:!1,blending:2,opacity:.18}),h=[],g=[],_=tt(),y=[];e.forEach((e,n)=>{let i=new t(a,s);i.position.copy(e),i.rotation.y=0,r.add(i);let o=new d(m);o.position.copy(e).add(new l(0,0,.1)),o.scale.set(.4,.4,1),o.visible=!1,r.add(o),h.push(o);let c=new S({uniforms:{uTime:{value:0},uThrust:{value:0},uPhase:{value:n%4*17.3},uColorCore:{value:$e.clone()},uColorMid:{value:et.clone()}},vertexShader:nt,fragmentShader:rt,transparent:!0,depthWrite:!1,side:2,blending:2}),u=new t(_,c);u.position.copy(e).add(new l(0,0,.04)),u.scale.set(Q,Q,Z),u.renderOrder=5,r.add(u),y.push({mesh:u,mat:c});let f=new b(X.getHex(),Ye,40,2);f.position.copy(e).add(new l(0,0,1)),r.add(f),g.push(f)});let x=new o;return{group:r,nozzleMat:s,updateThrust(e,t){let n=f.clamp(e,0,1);x.copy(X).lerp(Je,n);let r=f.lerp(Ke,qe,n);s.emissive.copy(x),s.emissiveIntensity=r,m.color.copy(x),m.opacity=f.lerp(.18,.48,n);let i=f.lerp(1.25,2.05,n);for(let e of h)e.scale.set(i,i,1);let a=f.lerp(Ye,Xe,n);for(let e of g)e.color.copy(x),e.intensity=a;let o=f.lerp(Z,Ze,n),c=f.lerp(Q,Qe,n);for(let e of y)e.mesh.visible=n>.04,e.mesh.scale.set(c,c,o),e.mat.uniforms.uTime.value=t,e.mat.uniforms.uThrust.value=n},dispose(){a.dispose(),s.dispose(),m.dispose(),p.dispose(),_.dispose();for(let e of y)e.mat.dispose()}}}var ot=e({buildShipV2:()=>$});async function $(e,t,r){let{hull:i,source:a}=await Ge(e,t,r),o=at(i.nozzleAttachPoints),s=new n;return s.name=`ship-root-v2`,s.userData.hullSource=a,s.userData.hullStats=i.group.userData.hullStats,s.userData.engineAnchors=i.group.userData.engineAnchors,s.add(i.group),s.add(o.group),{group:s,updateThrust(e,t){o.updateThrust(e,t)},dispose(){i.dispose(),o.dispose()}}}export{j as a,O as c,ee as d,T as i,k as l,ot as n,M as o,A as r,D as s,$ as t,F as u};