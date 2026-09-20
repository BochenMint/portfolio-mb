import{n as e}from"./rolldown-runtime-QTnfLwEv.js";import{C as t,E as n,F as r,I as i,Mt as a,Q as o,S as s,St as c,X as l,_t as u,a as d,bt as f,c as p,et as m,ht as h,l as g,lt as _,pt as v,tt as y,v as b,vt as x,xt as S,z as C}from"./three-D8_snUvY.js";var w={ink:526343,amber:16098596,amberBright:16762977,amberDeep:15234586,coral:16735802},T=new a(600,400,250).normalize(),E=l.degToRad(.1),D=`
  const vec3 SUN_DIR = vec3(${T.x.toFixed(6)}, ${T.y.toFixed(6)}, ${T.z.toFixed(6)});
`,O=`
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`,k=`
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
`,A=`
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
`,j=`
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
`,M=`
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,N=`
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
    ${O}
  }
`;function P(e,t,r){let{power:i=2.6,intensity:a=1.1,segments:s=48}=r??{},c=new f(e*1.06,s,Math.max(16,Math.floor(s/1.5))),l=new u({uniforms:{uColor:{value:new n(t)},uPower:{value:i},uIntensity:{value:a}},vertexShader:M,fragmentShader:N,transparent:!0,depthWrite:!1,blending:2}),d=new o(c,l);return d.renderOrder=3,{mesh:d,dispose(){c.dispose(),l.dispose()}}}function F(e){let t=e|0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function I(e,t){let n=Math.cos(e),r=Math.sin(e),i=Math.max(t.roundness,1.001),a=Math.max(t.roundnessY??t.roundness,1.001),o=Math.max(t.roundnessBottom??t.roundnessY??t.roundness,1.001),s=r>=0?a:o,c=r>=0?t.halfHeight:t.halfHeightBottom??t.halfHeight;return[Math.sign(n)*Math.abs(n)**(2/i)*t.halfWidth,Math.sign(r)*Math.abs(r)**(2/s)*c]}function ee(e,t){let n=Math.cos(e),r=Math.sin(e),i=t.length;for(let e=0;e<i;e++){let a=t[e][0],o=t[e][1],s=t[(e+1)%i][0],c=t[(e+1)%i][1],l=s-a,u=c-o,d=n*-u- -l*r;if(Math.abs(d)<1e-10)continue;let f=(-a*u+l*o)/d,p=(n*o-a*r)/d;if(f>1e-8&&p>=-1e-5&&p<=1.00001)return[n*f,r*f]}return[n*.01,r*.01]}function te(e,t,n){let r=[];for(let i=0;i<6;i++){let a=(i+.5)*(Math.PI/3),o=Math.sin(a)>=0?t:n;r.push([Math.cos(a)*e,Math.sin(a)*o])}return r}function ne(e,t,n){return[[e,0],[0,t],[-e,0],[0,-n]]}function L(e,t){let n=I(e,t),r=t.shape??`superellipse`;if(r===`superellipse`)return n;let i=t.halfHeightBottom??t.halfHeight,a=ee(e,r===`diamond`?ne(t.halfWidth,t.halfHeight,i):te(t.halfWidth,t.halfHeight,i)),o=l.clamp(t.cornerBlend??.08,0,1);return o<=0?a:[a[0]+(n[0]-a[0])*o,a[1]+(n[1]-a[1])*o]}function re(e,t){let n=e.length,r=[],a=[];for(let i=0;i<n;i++){let o=e[i],s=i/(n-1);for(let e=0;e<t;e++){let[n,i]=L(e/t*Math.PI*2,o);r.push(n+(o.centerX??0),i+(o.centerY??0),o.z),a.push(e/t,s)}}let o=[];for(let e=0;e<n-1;e++){let n=e*t,r=(e+1)*t;for(let e=0;e<t;e++){let i=(e+1)%t,a=n+e,s=n+i,c=r+e,l=r+i;o.push(a,s,c),o.push(s,l,c)}}let c=new s;return c.setAttribute(`position`,new i(r,3)),c.setAttribute(`uv`,new i(a,2)),c.setIndex(o),c.computeVertexNormals(),c}function ie(e,t,n){let r=[e.centerX??0,e.centerY??0,e.z],a=[.5,.5];for(let n=0;n<t;n++){let i=n/t*Math.PI*2,[o,s]=L(i,e);r.push(o+(e.centerX??0),s+(e.centerY??0),e.z),a.push(.5+Math.cos(i)*.5,.5+Math.sin(i)*.5)}let o=[];for(let e=0;e<t;e++){let r=(e+1)%t;n>0?o.push(0,1+e,1+r):o.push(0,1+r,1+e)}let c=new s;return c.setAttribute(`position`,new i(r,3)),c.setAttribute(`uv`,new i(a,2)),c.setIndex(o),c.computeVertexNormals(),c}function ae(e){let t=e.length,n=e.map(e=>e[0]),r=e.map(e=>e[1]),i=[];for(let e=0;e<t-1;e++)i.push((r[e+1]-r[e])/(n[e+1]-n[e]));let a=Array(t).fill(0);a[0]=i[0],a[t-1]=i[t-2];for(let e=1;e<t-1;e++)a[e]=i[e-1]*i[e]<=0?0:(i[e-1]+i[e])/2;for(let e=0;e<t-1;e++){if(i[e]===0){a[e]=0,a[e+1]=0;continue}let t=a[e]/i[e],n=a[e+1]/i[e],r=t*t+n*n;if(r>9){let o=3/Math.sqrt(r);a[e]=o*t*i[e],a[e+1]=o*n*i[e]}}return{xs:n,ys:r,ms:a}}function oe(e,t){let{xs:n,ys:r,ms:i}=e,a=n.length;if(t<=n[0])return r[0];if(t>=n[a-1])return r[a-1];let o=0;for(;o<a-2&&t>n[o+1];)o++;let s=n[o+1]-n[o],c=(t-n[o])/s,l=c*c,u=l*c,d=2*u-3*l+1,f=u-2*l+c,p=-2*u+3*l,m=u-l;return d*r[o]+f*s*i[o]+p*r[o+1]+m*s*i[o+1]}var se=new WeakMap;function R(e,t){let n=se.get(e);return n||(n=ae(e),se.set(e,n)),oe(n,t)}function ce(){let e=document.createElement(`canvas`);e.width=512,e.height=512;let n=e.getContext(`2d`);n.fillStyle=`#c9c9c9`,n.fillRect(0,0,512,512);let r=1337,i=()=>(r=r*1103515245+12345&2147483647,(r>>>0)/2147483647),a=[0];for(let e=1;e<9;e++)a.push(e/9*512+(i()-.5)*(512/9)*.3);a.push(512);let o=[0];for(let e=1;e<14;e++)o.push(e/14*512+(i()-.5)*(512/14)*.3);o.push(512),n.strokeStyle=`rgba(40,42,46,0.55)`,n.lineWidth=2;for(let e of a)n.beginPath(),n.moveTo(e,0),n.lineTo(e,512),n.stroke();for(let e of o)n.beginPath(),n.moveTo(0,e),n.lineTo(512,e),n.stroke();for(let e=0;e<14;e++)for(let t=0;t<9;t++){let r=190+Math.floor((i()-.5)*26);n.fillStyle=`rgba(${r},${r},${r+2},0.5)`,n.fillRect(a[t]+1,o[e]+1,a[t+1]-a[t]-2,o[e+1]-o[e]-2)}n.fillStyle=`rgba(60,62,66,0.5)`;for(let e=0;e<260;e++){let e=i()*512,t=i()*512;n.beginPath(),n.arc(e,t,1.4,0,Math.PI*2),n.fill()}let s=n.getImageData(0,0,512,512),c=s.data;for(let e=0;e<c.length;e+=4){let t=(i()-.5)*10;c[e]=Math.min(255,Math.max(0,c[e]+t)),c[e+1]=Math.min(255,Math.max(0,c[e+1]+t)),c[e+2]=Math.min(255,Math.max(0,c[e+2]+t))}n.putImageData(s,0,0);let l=new t(e);return l.wrapS=v,l.wrapT=v,l.colorSpace=``,l.needsUpdate=!0,l}function le(){let e=document.createElement(`canvas`);e.width=256,e.height=128;let n=e.getContext(`2d`);if(!n)return null;let r=n.createLinearGradient(0,0,0,128);r.addColorStop(0,`#a8b0bc`),r.addColorStop(.18,`#5a6370`),r.addColorStop(.42,`#2a3038`),r.addColorStop(.68,`#161a20`),r.addColorStop(1,`#0a0c10`),n.fillStyle=r,n.fillRect(0,0,256,128);let i=n.createLinearGradient(0,128*.08,0,128*.46);i.addColorStop(0,`rgba(248, 244, 236, 0.72)`),i.addColorStop(.4,`rgba(226, 214, 196, 0.4)`),i.addColorStop(1,`rgba(226, 214, 196, 0)`),n.fillStyle=i,n.fillRect(256*.08,128*.06,256*.38,128*.4);let a=n.createRadialGradient(256*.78,128*.3,4,256*.78,128*.3,256*.36);a.addColorStop(0,`rgba(186, 210, 232, 0.5)`),a.addColorStop(1,`rgba(186, 210, 232, 0)`),n.fillStyle=a,n.fillRect(0,0,256,128);let o=n.createRadialGradient(256*.12,128*.62,2,256*.12,128*.62,256*.28);o.addColorStop(0,`rgba(168, 196, 220, 0.42)`),o.addColorStop(1,`rgba(168, 196, 220, 0)`),n.fillStyle=o,n.fillRect(0,0,256,128);let s=n.createLinearGradient(0,128*.72,0,128);s.addColorStop(0,`rgba(18, 20, 24, 0)`),s.addColorStop(1,`rgba(8, 9, 11, 0.85)`),n.fillStyle=s,n.fillRect(0,128*.7,256,128*.3);let c=new t(e);return c.mapping=303,c.colorSpace=h,c.needsUpdate=!0,c}function ue(e){let t=le();if(!t)return{map:null,dispose(){}};if(!e)return{map:t,dispose(){t.dispose()}};let n=new g(e);n.compileEquirectangularShader();let r=n.fromEquirectangular(t);return t.dispose(),n.dispose(),{map:r.texture,dispose(){r.dispose()}}}function z(e,t,n){t&&(e.envMap=t,e.envMapIntensity=n,e.needsUpdate=!0)}function B(e,t){let r=ue(t??null),i=r.map,a=ce(),o=a.clone();o.image=a.image,o.repeat.set(6,2),o.needsUpdate=!0;let s=new m({color:3818062,metalness:.82,roughness:.34,roughnessMap:o,clearcoat:.12,clearcoatRoughness:.42,emissive:new n(922652),emissiveIntensity:.09});z(s,i,.68);let c=new m({color:11844806,metalness:1,roughness:.11,clearcoat:.4,clearcoatRoughness:.12});z(c,i,1.35);let l=new m({color:4866104,metalness:.28,roughness:.58,clearcoat:.06,clearcoatRoughness:.5});z(l,i,.38);let u=new m({color:1054752,metalness:.22,roughness:.08,clearcoat:.72,clearcoatRoughness:.1,emissive:new n(462872),emissiveIntensity:.18});z(u,i,.9);let d=new m({color:2233872,metalness:.64,roughness:.36,emissive:new n(4858380),emissiveIntensity:.42});return z(d,i,.28),{graphite:s,chrome:c,ceramic:l,glass:u,heat:d,dispose(){s.dispose(),c.dispose(),l.dispose(),u.dispose(),d.dispose(),a.dispose(),o.dispose(),r.dispose()}}}function V(e){return new y({color:e,emissive:new n(e),emissiveIntensity:.7,roughness:.5,metalness:0})}var H=34,U=H/2,de=28,W=44,fe=[[0,.14],[.08,.38],[.18,.82],[.32,1.55],[.48,2.42],[.62,3.35],[.74,3.55],[.86,3.28],[.94,2.95],[1,2.72]],pe=[[0,.12],[.12,.42],[.3,.82],[.5,1.18],[.68,1.36],[.86,1.12],[1,.92]],me=[[0,.1],[.16,.32],[.4,.62],[.68,.82],[1,.7]],he=[[0,1.16],[.4,1.18],[1,1.22]],ge=[[0,1.45],[.5,1.55],[1,1.62]],_e=[[0,1.5],[1,1.7]];function G(e){return{halfWidth:R(fe,e),halfHeight:R(pe,e),halfHeightBottom:R(me,e),roundness:R(he,e),roundnessY:R(ge,e),roundnessBottom:R(_e,e),shape:`diamond`,cornerBlend:.14,centerX:0,centerY:.06}}function K(e){return G(l.clamp((e+U)/H,0,1))}function q(e,t,n=!0){let r=re(e,t);if(!n)return r;let i=ie(e[0],t,-1),a=ie(e[e.length-1],t,1),o=p([r,i,a]);return r.dispose(),i.dispose(),a.dispose(),o}function ve(e){let t=e.index?e.toNonIndexed():e,n=t.getAttribute(`position`),r=n.count,a=new Float32Array(r*3);a.set(n.array.subarray(0,r*3));let o=new Float32Array(r*2),c=t.getAttribute(`uv`);if(c)for(let e=0;e<r;e++)o[e*2]=c.getX(e),o[e*2+1]=c.getY(e);let l=new s;return l.setAttribute(`position`,new i(a,3)),l.setAttribute(`uv`,new i(o,2)),l.computeVertexNormals(),t!==e&&t.dispose(),e.dispose(),l}function ye(e){let t=e.clone();t.scale(-1,1,1);let n=t.getIndex();if(n){for(let e=0;e<n.count;e+=3){let t=n.getX(e+1);n.setX(e+1,n.getX(e+2)),n.setX(e+2,t)}n.needsUpdate=!0}return t.computeVertexNormals(),t}function be(){let e=[];for(let t=0;t<W;t++){let n=t/(W-1),r=G(n);e.push({z:-17+n*H,...r})}return q(e,de)}function J(e,t,n,r,a,o=18,c=5){let u=[],d=[],f=[];for(let i=0;i<=o;i++){let s=l.lerp(e,t,i/o),p=K(s);for(let e=0;e<=c;e++){let[t,m]=L(l.degToRad(l.lerp(n,r,e/c)),p),h=Math.hypot(t,m)||1,g=t/h,_=m/h;u.push(t+g*a+p.centerX,m+_*a+p.centerY,s),f.push(g,_),d.push(e/c,i/o)}}let p=c+1,m=[];for(let e=0;e<o;e++)for(let t=0;t<c;t++){let n=e*p+t,r=n+1,i=n+p,a=i+1;m.push(n,i,r,r,i,a)}let h=new s;h.setAttribute(`position`,new i(u,3)),h.setAttribute(`uv`,new i(d,2)),h.setIndex(m),h.computeVertexNormals();let g=h.getAttribute(`normal`),_=Math.floor(o/2*p+c/2);if(g.getX(_)*f[_*2]+g.getY(_)*f[_*2+1]<0){let e=h.getIndex();for(let t=0;t<e.count;t+=3){let n=e.getX(t+1);e.setX(t+1,e.getX(t+2)),e.setX(t+2,n)}e.needsUpdate=!0,h.computeVertexNormals()}return h}var xe=-8.84,Se=-3.3999999999999986;function Ce(){let e=[];for(let t=0;t<12;t++){let n=t/11,r=xe+n*(Se-xe),i=K(r),a=n<.35?l.lerp(.05,.22,n/.35):n<.75?l.lerp(.22,.18,(n-.35)/.4):l.lerp(.18,.05,(n-.75)/.25),o=n<.4?l.lerp(.1,.28,n/.4):l.lerp(.28,.1,(n-.4)/.6);e.push({z:r,centerX:0,centerY:i.centerY+i.halfHeight+a*.22,halfWidth:o,halfHeight:a,roundness:2.4,roundnessY:2.1,roundnessBottom:3.2})}return q(e,16)}function we(e){let t=[];for(let n=0;n<10;n++){let r=n/9,i;i=r<.28?l.lerp(.07,.26,r/.28):l.lerp(.26,.12,(r-.28)/.72);let a=i*.7;t.push({z:l.lerp(-17.92,-14.55,r),centerX:e*l.lerp(1.22,.2,r),centerY:l.lerp(-.04,.05,r),halfWidth:i,halfHeight:a,halfHeightBottom:a*.85,roundness:1.28,shape:`diamond`,cornerBlend:.1})}return q(t,12)}function Te(){let e=[];for(let t=0;t<8;t++){let n=t/7,r=n<.18?l.lerp(.02,.048,n/.18):l.lerp(.048,.03,(n-.18)/.82);e.push({z:l.lerp(-18.05,-15.65,n),centerY:.06,halfWidth:r,halfHeight:r*.85,roundness:1.55,shape:`diamond`,cornerBlend:.2})}return q(e,10)}function Ee(e){return q([{z:-17.92,centerX:e*1.22,centerY:-.02,halfWidth:.04,halfHeight:.03,roundness:1.35,shape:`diamond`,cornerBlend:.1},{z:-17.55,centerX:e*1.05,centerY:-.01,halfWidth:.12,halfHeight:.08,roundness:1.32,shape:`diamond`,cornerBlend:.1}],10)}function De(){return q([{z:-18.05,centerY:.06,halfWidth:.012,halfHeight:.01,roundness:1.4,shape:`diamond`,cornerBlend:.15},{z:-17.72,centerY:.06,halfWidth:.038,halfHeight:.03,roundness:1.45,shape:`diamond`,cornerBlend:.15}],10)}var Oe=1.8,ke=16.45,Ae=16;function je(e,t,n){return e*(K(t).halfWidth*.58+l.lerp(.02,.16,n))}function Me(e){let t=K(e);return t.centerY-(t.halfHeightBottom??t.halfHeight)*.18}function Ne(e){let t=[];for(let n=0;n<Ae;n++){let r=n/(Ae-1),i=l.lerp(Oe,ke,r),a;a=r<.18?l.lerp(.12,.62,r/.18):r<.82?l.lerp(.62,.78,(r-.18)/.64):l.lerp(.78,.7,(r-.82)/.18);let o=a*.38;t.push({z:i,centerX:je(e,i,r),centerY:Me(i),halfWidth:a,halfHeight:o,halfHeightBottom:o*.92,roundness:1.22,shape:`diamond`,cornerBlend:.05})}return q(t,12)}function Pe(e){let t=[];for(let n=0;n<14;n++){let r=n/13,i=l.lerp(-9.2,15.6,r),a=K(i),o=r<.2?l.lerp(.08,.28,r/.2):r<.75?l.lerp(.28,.4,(r-.2)/.55):l.lerp(.4,.22,(r-.75)/.25),s=o*.48;t.push({z:i,centerX:e*(a.halfWidth*.96),centerY:a.centerY-(a.halfHeightBottom??a.halfHeight)*.08,halfWidth:o,halfHeight:s,halfHeightBottom:s*.9,roundness:1.2,shape:`diamond`,cornerBlend:.06})}return q(t,10)}function Y(e,t,n){let r=[];for(let i=0;i<5;i++){let a=i/4,o=l.lerp(.78,1,a);r.push({z:a*n,halfWidth:e/2*o,halfHeight:t/2*o,halfHeightBottom:t/2*o*.92,roundness:1.3,shape:`diamond`,cornerBlend:.06})}return q(r,12,!1)}function X(e,t,n,i,a){let o=new x;o.moveTo(0,0),o.lineTo(t,0),o.lineTo(i+n,e),o.lineTo(i,e),o.closePath();let s=new r(o,{depth:a,bevelEnabled:!0,bevelThickness:a*.28,bevelSize:a*.22,bevelSegments:1});return s.translate(0,0,-a/2),s.rotateY(-Math.PI/2),s.computeVertexNormals(),s}function Fe(e,t){let n=B(e,t),r=new C;r.name=`ship-hull-mb-kite`;let i={graphite:[],chrome:[],ceramic:[],glass:[],heat:[]};function s(e,t){i[t].push(ve(e))}s(be(),`graphite`),s(we(1),`graphite`),s(we(-1),`graphite`),s(Te(),`graphite`),s(De(),`chrome`),s(Pe(1),`graphite`),s(Pe(-1),`graphite`),s(Ne(1),`graphite`),s(Ne(-1),`graphite`),s(Ce(),`glass`),s(J(-15.8,U-1.4,-10,10,.028,22,5),`chrome`),s(J(-15.8,U-1.4,170,190,.028,22,5),`chrome`),s(J(-16.85,-13.4,28,58,.03,10,4),`chrome`),s(J(-16.85,-13.4,122,152,.03,10,4),`chrome`);let c=X(.78,6.2,.42,2.8,.065);c.translate(0,K(3.4).halfHeight+.02,3.4),s(c,`graphite`);let l=X(.74,.38,.1,.16,.04);l.translate(0,K(1.6).halfHeight+.04,1.4),s(l,`chrome`);let u=X(.48,.95,.16,.52,.04),d=u.clone();d.rotateZ(-Math.PI/2),d.rotateY(-.22),d.translate(.55,.04,-12.4);let m=ye(d);u.dispose(),s(d,`graphite`),s(m,`graphite`),s(Ee(1),`chrome`),s(Ee(-1),`chrome`);let h=1.08,g=.34,_=[];for(let e of[1,-1]){let t=ke,n=je(e,t,1),r=Me(t),i=Y(h,g,.68);i.translate(n,r,t),s(i,`ceramic`);let o=Y(h*1.06,g*1.08,.08);o.translate(n,r,17.061999999999998),s(o,`chrome`);let c=Y(h*.7,g*.62,.14);c.translate(n,r,17.0076),s(c,`heat`),_.push(new a(n,r,17.18))}let v=U-.28,y=Y(.7,.22,.58);y.translate(0,-.08,v),s(y,`ceramic`);let x=Y(.74,.24,.07);x.translate(0,-.08,17.2),s(x,`chrome`);let S=Y(.48,.14,.12);S.translate(0,-.08,17.119999999999997),s(S,`heat`),_.push(new a(0,-.08,17.34));let w=[],T={graphite:n.graphite,chrome:n.chrome,ceramic:n.ceramic,glass:n.glass,heat:n.heat};for(let e of Object.keys(i)){let t=i[e];if(!t.length)continue;let n=p(t,!1);if(!n){for(let n of t){w.push(n);let t=new o(n,T[e]);t.name=`mb-kite-${e}`,e===`glass`&&(t.renderOrder=1),r.add(t)}continue}for(let e of t)e.dispose();ve(n),w.push(n);let a=new o(n,T[e]);a.name=`mb-kite-${e}`,e===`glass`&&(a.renderOrder=1),r.add(a)}let E=new b().setFromObject(r).getCenter(new a);for(let e of w)e.translate(-E.x,-E.y,-E.z),e.computeBoundingBox(),e.computeBoundingSphere();for(let e of _)e.sub(E);let D=new f(.06,10,8);w.push(D);let O=V(16722474),k=V(2883422),A=_[0],j=_[1],M=new o(D,O);M.position.set(j.x-.72,j.y+.16,j.z-5.2),M.name=`nav-port`,r.add(M);let N=new o(D,k);N.position.set(A.x+.72,A.y+.16,A.z-5.2),N.name=`nav-starboard`,r.add(N);let P=new b().setFromObject(r).getSize(new a),F=0,I=0;return r.traverse(e=>{if(!(e instanceof o)||!e.visible)return;I+=1;let t=e.geometry,n=t.getIndex();F+=n?n.count/3:t.getAttribute(`position`).count/3}),r.userData.hullStats={tris:F,drawCalls:I,length:P.z,span:P.x,height:P.y},r.userData.engineAnchors=_.map(e=>e.toArray()),{group:r,nozzleAttachPoints:_,dispose(){for(let e of w)e.dispose();O.dispose(),k.dispose(),n.dispose()}}}var Ie=`/v4/assets/ships/normandy-sr2-joshuas-cc0.glb`,Le=28,Re=Math.PI;function ze(e){let t=new b().setFromObject(e),n=new a;t.getCenter(n),e.position.sub(n);let r=new a;t.getSize(r);let i=new C;i.add(e),r.x>=r.y&&r.x>=r.z?i.rotation.y=Math.PI/2:r.y>r.x&&r.y>=r.z&&(i.rotation.x=Math.PI/2),i.rotation.y+=Re;let o=new b().setFromObject(i),s=new a;o.getSize(s);let c=Le/Math.max(s.z,1e-4),l=new C;return l.name=`normandy-glb-hull`,l.add(i),l.scale.setScalar(c),{group:l,box:new b().setFromObject(l)}}function Be(e){let t=e.min,n=e.max,r=(t.x+n.x)/2,i=t.y+(n.y-t.y)*.42,o=n.z-t.z,s=n.z,c=(n.x-t.x)*.36,l=(n.y-t.y)*.14,u=s-o*.04;return[new a(r+c,i-l,s),new a(r+c,i+l*.6,s),new a(r-c,i-l,s),new a(r-c,i+l*.6,s),new a(r+c*.22,i,u),new a(r-c*.22,i,u)]}function Ve(e,t,n){let r=B(t,n),i=[r.graphite,r.chrome,r.ceramic,r.glass,r.heat],a=0;return e.traverse(e=>{if(e instanceof o){let t=e.name.toLowerCase();t.includes(`glass`)||t.includes(`canopy`)||t.includes(`window`)?e.material=r.glass:t.includes(`stripe`)||t.includes(`band`)||t.includes(`ceramic`)?e.material=r.ceramic:t.includes(`engine`)||t.includes(`nozzle`)||t.includes(`dark`)||t.includes(`heat`)?e.material=r.heat:t.includes(`chrome`)||t.includes(`edge`)?e.material=r.chrome:e.material=a%5==0?r.ceramic:r.graphite,e.castShadow=!1,e.receiveShadow=!1,a+=1}}),i}function He(e,t,n){let{group:r,box:i}=ze(e.scene.clone(!0)),a=Ve(r,t,n),s=Be(i),c=[];return r.traverse(e=>{e instanceof o&&c.push(e.geometry)}),{group:r,nozzleAttachPoints:s,dispose(){for(let e of c)e.dispose();for(let e of a)e.dispose()}}}async function Ue(){try{let e=await fetch(Ie,{method:`GET`,headers:{Range:`bytes=0-11`},cache:`force-cache`});if(!e.ok||(e.headers.get(`content-type`)??``).includes(`text/html`))return!1;let t=new Uint8Array(await e.arrayBuffer());return t.byteLength<4?!1:t[0]===103&&t[1]===108&&t[2]===84&&t[3]===70}catch{return!1}}async function We(e,t,n){if(!(typeof location<`u`&&new URLSearchParams(location.search).has(`glb`))||!await Ue())return{hull:Fe(t,n),source:`procedural`};try{return{hull:He(await new d(e).loadAsync(Ie),t,n),source:`glb`}}catch{return{hull:Fe(t,n),source:`procedural`}}}var Ge=.22,Ke=1.35,Z=new n(2779788),qe=new n(5941448),Je=2.2,Ye=12,Q=.55,Xe=5.2,$=.16,Ze=.42,Qe=new n(15267071),$e=new n(3061992);function et(){let e=new Float32Array([1,0,0,0,.38,0,-1,0,0,0,-.38,0,0,0,1]),t=[0,1,4,1,2,4,2,3,4,3,0,4,0,3,1,1,3,2],n=new s;return n.setAttribute(`position`,new i(e,3)),n.setIndex(t),n.computeVertexNormals(),n}var tt=`
  varying vec3 vLocalPos;
  void main() {
    vLocalPos = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`,nt=`
  precision highp float;
  uniform float uTime;
  uniform float uThrust;
  uniform float uPhase;
  uniform vec3 uColorCore;
  uniform vec3 uColorMid;
  varying vec3 vLocalPos;

  ${k}

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
    ${O}
  }
`;function rt(){let e=document.createElement(`canvas`);e.width=128,e.height=128;let n=e.getContext(`2d`),r=n.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2);r.addColorStop(0,`rgba(255,255,255,1)`),r.addColorStop(.35,`rgba(150,210,255,0.65)`),r.addColorStop(1,`rgba(80,160,255,0)`),n.fillStyle=r,n.fillRect(0,0,128,128);let i=new t(e);return i.needsUpdate=!0,i}function it(e){let t=new C;t.name=`engine-fx`;let r=new s;r.setAttribute(`position`,new i([0,.16,0,.48,0,0,0,-.16,0,-.48,0,0],3)),r.setAttribute(`uv`,new i([.5,1,1,.5,.5,0,0,.5],2)),r.setIndex([0,1,2,0,2,3]),r.computeVertexNormals();let d=new y({color:1581870,emissive:Z.clone(),emissiveIntensity:Ge,metalness:.6,roughness:.3,side:2}),f=rt(),p=new c({map:f,color:Z.clone(),transparent:!0,depthWrite:!1,blending:2,opacity:.18}),m=[],h=[],g=et(),v=[];e.forEach((n,i)=>{let s=new o(r,d);s.position.copy(n),s.rotation.y=0;let c=i===e.length-1&&e.length>2;s.scale.set(c?.72:1,c?.72:1,1),t.add(s);let l=new S(p);l.position.copy(n).add(new a(0,0,.1)),l.scale.set(.4,.4,1),l.visible=!1,t.add(l),m.push(l);let f=new u({uniforms:{uTime:{value:0},uThrust:{value:0},uPhase:{value:i%4*17.3},uColorCore:{value:Qe.clone()},uColorMid:{value:$e.clone()}},vertexShader:tt,fragmentShader:nt,transparent:!0,depthWrite:!1,side:2,blending:2}),y=new o(g,f);y.position.copy(n).add(new a(0,0,.04));let b=c?.72:1.15,x=c?.55:.7,C=c?.78:1;y.scale.set($*b,$*x,Q*C),y.renderOrder=5,t.add(y),v.push({mesh:y,mat:f,rx:b,ry:x,rz:C});let w=new _(Z.getHex(),Je,40,2);w.position.copy(n).add(new a(0,0,1)),t.add(w),h.push(w)});let b=new n;return{group:t,nozzleMat:d,updateThrust(e,t){let n=l.clamp(e,0,1);b.copy(Z).lerp(qe,n);let r=l.lerp(Ge,Ke,n);d.emissive.copy(b),d.emissiveIntensity=r,p.color.copy(b),p.opacity=l.lerp(.18,.48,n);let i=l.lerp(1.25,2.05,n);for(let e of m)e.scale.set(i,i,1);let a=l.lerp(Je,Ye,n);for(let e of h)e.color.copy(b),e.intensity=a;let o=l.lerp(Q,Xe,n),s=l.lerp($,Ze,n);for(let e of v)e.mesh.visible=n>.02,e.mesh.scale.set(s*e.rx,s*e.ry,o*e.rz),e.mat.uniforms.uTime.value=t,e.mat.uniforms.uThrust.value=n},dispose(){r.dispose(),d.dispose(),p.dispose(),f.dispose(),g.dispose();for(let e of v)e.mat.dispose()}}}var at=e({buildShipV2:()=>ot});async function ot(e,t,n){let{hull:r,source:i}=await We(e,t,n),a=it(r.nozzleAttachPoints),o=new C;return o.name=`ship-root-v2`,o.userData.hullSource=i,o.userData.hullStats=r.group.userData.hullStats,o.userData.engineAnchors=r.group.userData.engineAnchors,o.add(r.group),o.add(a.group),{group:o,updateThrust(e,t){a.updateThrust(e,t)},dispose(){r.dispose(),a.dispose()}}}export{A as a,D as c,F as d,w as i,O as l,at as n,j as o,k as r,E as s,ot as t,P as u};