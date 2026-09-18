import{n as e}from"./rolldown-runtime-QTnfLwEv.js";import{$ as t,C as n,Ct as r,D as i,Ft as a,H as o,O as s,R as c,S as l,T as u,Tt as d,a as f,bt as p,c as m,ft as h,gt as g,it as _,k as v,rt as y,tt as b,v as x,wt as S,xt as C,y as w,z as T}from"./three-QBlS6eYp.js";var E={ink:526343,amber:16098596,amberBright:16762977,amberDeep:15234586,coral:16735802},D=new a(600,400,250).normalize(),O=t.degToRad(.1),k=`
  const vec3 SUN_DIR = vec3(${D.x.toFixed(6)}, ${D.y.toFixed(6)}, ${D.z.toFixed(6)});
`,A=`
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`,ee=`
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
`,te=`
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
`,ne=`
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
`,re=`
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,ie=`
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
    ${A}
  }
`;function ae(e,t,n){let{power:a=2.6,intensity:o=1.1,segments:s=48}=n??{},c=new r(e*1.06,s,Math.max(16,Math.floor(s/1.5))),l=new p({uniforms:{uColor:{value:new i(t)},uPower:{value:a},uIntensity:{value:o}},vertexShader:re,fragmentShader:ie,transparent:!0,depthWrite:!1,blending:2}),u=new b(c,l);return u.renderOrder=3,{mesh:u,dispose(){c.dispose(),l.dispose()}}}function oe(e){let t=e|0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function j(e,t){let n=Math.cos(e),r=Math.sin(e),i=Math.max(t.roundness,1.001),a=Math.max(t.roundnessY??t.roundness,1.001),o=Math.max(t.roundnessBottom??t.roundnessY??t.roundness,1.001),s=r>=0?a:o,c=r>=0?t.halfHeight:t.halfHeightBottom??t.halfHeight;return[Math.sign(n)*Math.abs(n)**(2/i)*t.halfWidth,Math.sign(r)*Math.abs(r)**(2/s)*c]}function M(e,t){let n=e.length,r=[],i=[];for(let a=0;a<n;a++){let o=e[a],s=a/(n-1);for(let e=0;e<t;e++){let[n,a]=j(e/t*Math.PI*2,o);r.push(n+(o.centerX??0),a+(o.centerY??0),o.z),i.push(e/t,s)}}let a=[];for(let e=0;e<n-1;e++){let n=e*t,r=(e+1)*t;for(let e=0;e<t;e++){let i=(e+1)%t,o=n+e,s=n+i,c=r+e,l=r+i;a.push(o,s,c),a.push(s,l,c)}}let o=new l;return o.setAttribute(`position`,new T(r,3)),o.setAttribute(`uv`,new T(i,2)),o.setIndex(a),o.computeVertexNormals(),o}function N(e,t,n){let r=[e.centerX??0,e.centerY??0,e.z],i=[.5,.5];for(let n=0;n<t;n++){let a=n/t*Math.PI*2,[o,s]=j(a,e);r.push(o+(e.centerX??0),s+(e.centerY??0),e.z),i.push(.5+Math.cos(a)*.5,.5+Math.sin(a)*.5)}let a=[];for(let e=0;e<t;e++){let r=(e+1)%t;n>0?a.push(0,1+e,1+r):a.push(0,1+r,1+e)}let o=new l;return o.setAttribute(`position`,new T(r,3)),o.setAttribute(`uv`,new T(i,2)),o.setIndex(a),o.computeVertexNormals(),o}function se(e){let t=e.length,n=e.map(e=>e[0]),r=e.map(e=>e[1]),i=[];for(let e=0;e<t-1;e++)i.push((r[e+1]-r[e])/(n[e+1]-n[e]));let a=Array(t).fill(0);a[0]=i[0],a[t-1]=i[t-2];for(let e=1;e<t-1;e++)a[e]=i[e-1]*i[e]<=0?0:(i[e-1]+i[e])/2;for(let e=0;e<t-1;e++){if(i[e]===0){a[e]=0,a[e+1]=0;continue}let t=a[e]/i[e],n=a[e+1]/i[e],r=t*t+n*n;if(r>9){let o=3/Math.sqrt(r);a[e]=o*t*i[e],a[e+1]=o*n*i[e]}}return{xs:n,ys:r,ms:a}}function ce(e,t){let{xs:n,ys:r,ms:i}=e,a=n.length;if(t<=n[0])return r[0];if(t>=n[a-1])return r[a-1];let o=0;for(;o<a-2&&t>n[o+1];)o++;let s=n[o+1]-n[o],c=(t-n[o])/s,l=c*c,u=l*c,d=2*u-3*l+1,f=u-2*l+c,p=-2*u+3*l,m=u-l;return d*r[o]+f*s*i[o]+p*r[o+1]+m*s*i[o+1]}var P=new WeakMap;function F(e,t){let n=P.get(e);return n||(n=se(e),P.set(e,n)),ce(n,t)}function le(){let e=1024,t=document.createElement(`canvas`);t.width=e,t.height=e;let r=t.getContext(`2d`);r.fillStyle=`#c9c9c9`,r.fillRect(0,0,e,e);let i=1337,a=()=>(i=i*1103515245+12345&2147483647,(i>>>0)/2147483647),o=[0];for(let t=1;t<9;t++)o.push(t/9*e+(a()-.5)*(e/9)*.3);o.push(e);let s=[0];for(let t=1;t<14;t++)s.push(t/14*e+(a()-.5)*(e/14)*.3);s.push(e),r.strokeStyle=`rgba(40,42,46,0.55)`,r.lineWidth=2;for(let t of o)r.beginPath(),r.moveTo(t,0),r.lineTo(t,e),r.stroke();for(let t of s)r.beginPath(),r.moveTo(0,t),r.lineTo(e,t),r.stroke();for(let e=0;e<14;e++)for(let t=0;t<9;t++){let n=190+Math.floor((a()-.5)*26);r.fillStyle=`rgba(${n},${n},${n+2},0.5)`,r.fillRect(o[t]+1,s[e]+1,o[t+1]-o[t]-2,s[e+1]-s[e]-2)}r.fillStyle=`rgba(60,62,66,0.5)`;for(let t=0;t<260;t++){let t=a()*e,n=a()*e;r.beginPath(),r.arc(t,n,1.4,0,Math.PI*2),r.fill()}let c=r.getImageData(0,0,e,e),l=c.data;for(let e=0;e<l.length;e+=4){let t=(a()-.5)*10;l[e]=Math.min(255,Math.max(0,l[e]+t)),l[e+1]=Math.min(255,Math.max(0,l[e+1]+t)),l[e+2]=Math.min(255,Math.max(0,l[e+2]+t))}r.putImageData(c,0,0);let u=new n(t);return u.wrapS=g,u.wrapT=g,u.colorSpace=``,u.needsUpdate=!0,u}function I(e){let t=le(),n=t.clone();n.image=t.image,n.repeat.set(8,2),n.needsUpdate=!0;let r=t.clone();r.image=t.image,r.repeat.set(5,4),r.needsUpdate=!0;let a=new y({color:5924212,metalness:.78,roughness:.32,roughnessMap:n,envMapIntensity:.95,clearcoat:.22,clearcoatRoughness:.34}),o=new y({color:1975084,metalness:.72,roughness:.36,roughnessMap:r,envMapIntensity:.58,clearcoat:.12,clearcoatRoughness:.4}),s=new y({color:2765116,metalness:.28,roughness:.48,roughnessMap:r,envMapIntensity:.4,clearcoat:.1,clearcoatRoughness:.45}),c=new y({color:462872,metalness:.22,roughness:.06,clearcoat:1,clearcoatRoughness:.06,emissive:new i(663600),emissiveIntensity:.28,envMapIntensity:.7}),l=new y({color:2896702,metalness:.74,roughness:.34,envMapIntensity:.55,clearcoat:.14,clearcoatRoughness:.4});return e&&(a.envMap=e,o.envMap=e,s.envMap=e,c.envMap=e,l.envMap=e),{steel:a,gunmetal:o,ceramic:s,glass:c,blade:l,dispose(){a.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose(),t.dispose(),n.dispose(),r.dispose()}}}function L(e){return new _({color:e,emissive:new i(e),emissiveIntensity:.35,roughness:.6,metalness:0})}var R=34,z=R/2,B=48,V=96,ue=[[0,.14],[.08,.34],[.16,.48],[.32,.56],[.5,.58],[.7,.6],[.88,.54],[1,.48]],de=[[0,.1],[.14,.28],[.4,.42],[.68,.5],[.88,.4],[1,.28]],fe=[[0,.08],[.14,.18],[.4,.24],[.68,.28],[1,.16]],pe=[[0,3.6],[.2,4.2],[.6,3.4],[1,3.2]],me=[[0,3.8],[.3,3.2],[1,2.8]],he=[[0,4.2],[1,3.6]];function H(e){return{halfWidth:F(ue,e),halfHeight:F(de,e),halfHeightBottom:F(fe,e),roundness:F(pe,e),roundnessY:F(me,e),roundnessBottom:F(he,e),centerX:0,centerY:0}}function ge(){let e=[];for(let t=0;t<V;t++){let n=t/(V-1),r=H(n);e.push({z:-17+n*R,...r})}let t=M(e,B),n=N(e[0],B,-1),r=N(e[V-1],B,1),i=m([t,n,r]);return t.dispose(),n.dispose(),r.dispose(),i}function U(e){return H(t.clamp((e+z)/R,0,1))}function W(e,n,r,i,a,o=20,s=8){let c=[],u=[],d=[];for(let l=0;l<=o;l++){let f=t.lerp(e,n,l/o),p=U(f);for(let e=0;e<=s;e++){let[n,m]=j(t.degToRad(t.lerp(r,i,e/s)),p),h=Math.hypot(n,m)||1,g=n/h,_=m/h;c.push(n+g*a+p.centerX,m+_*a+p.centerY,f),d.push(g,_),u.push(e/s,l/o)}}let f=s+1,p=[];for(let e=0;e<o;e++)for(let t=0;t<s;t++){let n=e*f+t,r=n+1,i=n+f,a=i+1;p.push(n,i,r,r,i,a)}let m=new l;m.setAttribute(`position`,new T(c,3)),m.setAttribute(`uv`,new T(u,2)),m.setIndex(p),m.computeVertexNormals();let h=m.getAttribute(`normal`),g=Math.floor(o/2*f+s/2);if(h.getX(g)*d[g*2]+h.getY(g)*d[g*2+1]<0){let e=m.getIndex();for(let t=0;t<e.count;t+=3){let n=e.getX(t+1);e.setX(t+1,e.getX(t+2)),e.setX(t+2,n)}e.needsUpdate=!0,m.computeVertexNormals()}return m}var G=-9.52,_e=-4.76,K=14,q=20,ve=[[0,.12],[.3,.32],[.7,.28],[1,.1]],ye=[[0,.06],[.35,.26],[.7,.22],[1,.06]];function be(){let e=[];for(let t=0;t<K;t++){let n=t/(K-1),r=G+n*(_e-G),i=U(r),a=F(ye,n);e.push({z:r,centerX:0,centerY:i.centerY+i.halfHeight+a*.28,halfWidth:F(ve,n),halfHeight:a,roundness:2.6,roundnessY:2.2,roundnessBottom:3.4})}let t=M(e,q),n=N(e[0],q,-1),r=N(e[K-1],q,1),i=m([t,n,r]);return t.dispose(),n.dispose(),r.dispose(),i}function xe(e,t,n,r,i){let a=new C;a.moveTo(0,0),a.lineTo(t,0),a.lineTo(r+n,e),a.lineTo(r,e),a.closePath();let o=new c(a,{depth:i,bevelEnabled:!0,bevelThickness:i*.3,bevelSize:i*.25,bevelSegments:2});return o.translate(0,0,-i/2),o.rotateY(-Math.PI/2),o}function J(){let e=new C;e.moveTo(.12,.4),e.lineTo(3.15,2.35),e.lineTo(3.35,5.4),e.lineTo(.18,4.1),e.closePath();let t=new c(e,{depth:.82,bevelEnabled:!0,bevelThickness:.14,bevelSize:.12,bevelSegments:2});return t.translate(0,0,-.41),t.rotateX(Math.PI/2),t.computeVertexNormals(),t}function Se(){let e=[];for(let n=0;n<40;n++){let r=n/39,i;i=r<.14?t.lerp(.32,1.02,r/.14):r<.72?t.lerp(1.02,1.14,(r-.14)/.58):t.lerp(1.14,1.08,(r-.72)/.28);let a=i*.78;e.push({z:-5.3+r*10.6,halfWidth:i,halfHeight:a,halfHeightBottom:a*.92,roundness:2.5,roundnessY:2.3,roundnessBottom:2.8})}let n=M(e,28),r=N(e[0],28,-1),i=N(e[39],28,1),a=m([n,r,i]);return n.dispose(),r.dispose(),i.dispose(),a}var Y=10.6,X=.98,Ce=3.4,we=-.22;function Z(e){return new a(e*3.85,-1.35,7.65)}var Te=7.48;function Ee(e){let t=I(e),n=new o;n.name=`ship-hull-normandy`;let i=[];function s(e,t){i.push(e);let r=new b(e,t);return n.add(r),r}s(ge(),t.steel);let c=-14.6;s(new w(11.8,.48,3.7),t.gunmetal).position.set(0,.16,c),s(new w(11.4,.16,3.2),t.steel).position.set(0,.44,c),s(new w(10.6,.14,2.4),t.steel).position.set(0,-.14,-14.4),s(new w(10.8,.32,.55),t.gunmetal).position.set(0,.12,c-1.95),s(new w(1.7,.36,2.4),t.steel).position.set(0,.2,-12.2);let l=s(be(),t.glass);l.renderOrder=1,s(W(-5.5,11.5,-12,14,.014,20,5),t.ceramic),s(W(-5.5,11.5,166,194,.014,20,5),t.ceramic);let u=J(),d=J();d.scale(-1,1,1);let f=d.getIndex();if(f){for(let e=0;e<f.count;e+=3){let t=f.getX(e+1);f.setX(e+1,f.getX(e+2)),f.setX(e+2,t)}f.needsUpdate=!0}d.computeVertexNormals(),i.push(u,d);for(let e of[1,-1]){let r=new b(e===1?u:d,t.steel);r.position.set(0,we,Ce),r.rotation.z=-e*.32,n.add(r)}let p=[],m=Se();i.push(m);let h=new v(X*.48,X,.7,24,1,!0);h.rotateX(Math.PI/2),i.push(h);for(let e of[1,-1]){let r=Z(e),i=new b(m,t.gunmetal);i.position.copy(r),n.add(i);let o=new b(h,t.steel);o.position.copy(r).add(new a(0,0,Y*.5)),n.add(o),p.push(r.clone().add(new a(0,0,Y*.52)))}let g=U(Te).halfHeight+.02,_=xe(2.15,1.65,.28,1.1,.07);i.push(_);for(let e of[-1,1]){let r=new b(_,t.gunmetal);r.position.set(e*.12,g,Te),r.rotation.z=-e*.08,n.add(r)}let y=new r(.045,10,8);i.push(y);let x=L(16722474),S=L(2883422),C=L(14214384),T=Z(1),E=Z(-1),D=new b(y,x);D.position.copy(E).add(new a(-.85,.2,0)),n.add(D);let O=new b(y,S);O.position.copy(T).add(new a(.85,.2,0)),n.add(O);let k=U(z),A=new b(y,C);return A.position.set(0,k.centerY+k.halfHeight*.8,17.02),A.scale.setScalar(.5),n.add(A),{group:n,nozzleAttachPoints:p,dispose(){for(let e of i)e.dispose();x.dispose(),S.dispose(),C.dispose(),t.dispose()}}}var De=`/v4/assets/ships/normandy-sr2-joshuas-cc0.glb`,Oe=28,ke=Math.PI;function Ae(e){let t=new x().setFromObject(e),n=new a;t.getCenter(n),e.position.sub(n);let r=new a;t.getSize(r);let i=new o;i.add(e),r.x>=r.y&&r.x>=r.z?i.rotation.y=Math.PI/2:r.y>r.x&&r.y>=r.z&&(i.rotation.x=Math.PI/2),i.rotation.y+=ke;let s=new x().setFromObject(i),c=new a;s.getSize(c);let l=Oe/Math.max(c.z,1e-4),u=new o;return u.name=`normandy-glb-hull`,u.add(i),u.scale.setScalar(l),{group:u,box:new x().setFromObject(u)}}function je(e){let t=e.min,n=e.max,r=(t.x+n.x)/2,i=t.y+(n.y-t.y)*.42,o=n.z-t.z,s=n.z,c=(n.x-t.x)*.36,l=(n.y-t.y)*.14,u=s-o*.04;return[new a(r+c,i-l,s),new a(r+c,i+l*.6,s),new a(r-c,i-l,s),new a(r-c,i+l*.6,s),new a(r+c*.22,i,u),new a(r-c*.22,i,u)]}function Me(e,t){let n=I(t),r=[n.steel,n.gunmetal,n.ceramic,n.glass,n.blade],i=0;return e.traverse(e=>{if(e instanceof b){let t=e.name.toLowerCase();t.includes(`glass`)||t.includes(`canopy`)||t.includes(`window`)?e.material=n.glass:t.includes(`stripe`)||t.includes(`band`)||t.includes(`ceramic`)?e.material=n.ceramic:t.includes(`engine`)||t.includes(`nozzle`)||t.includes(`dark`)?e.material=n.gunmetal:e.material=i%4==0?n.ceramic:n.steel,e.castShadow=!1,e.receiveShadow=!1,i+=1}}),r}function Ne(e,t){let{group:n,box:r}=Ae(e.scene.clone(!0)),i=Me(n,t),a=je(r),o=[];return n.traverse(e=>{e instanceof b&&o.push(e.geometry)}),{group:n,nozzleAttachPoints:a,dispose(){for(let e of o)e.dispose();for(let e of i)e.dispose()}}}async function Pe(){try{let e=await fetch(De,{method:`GET`,headers:{Range:`bytes=0-11`},cache:`force-cache`});if(!e.ok||(e.headers.get(`content-type`)??``).includes(`text/html`))return!1;let t=new Uint8Array(await e.arrayBuffer());return t.byteLength<4?!1:t[0]===103&&t[1]===108&&t[2]===84&&t[3]===70}catch{return!1}}async function Fe(e,t){if(!(typeof location<`u`&&new URLSearchParams(location.search).has(`glb`))||!await Pe())return{hull:Ee(t),source:`procedural`};try{return{hull:Ne(await new f(e).loadAsync(De),t),source:`glb`}}catch{return{hull:Ee(t),source:`procedural`}}}var Ie=.22,Le=1.35,Q=new i(2779788),Re=new i(5941448),ze=2.2,Be=12,Ve=.45,He=4.6,$=.16,Ue=.38,We=new i(15267071),Ge=new i(3061992);function Ke(){let e=new s(1,1,20,12,!0);return e.translate(0,.5,0),e.rotateX(Math.PI/2),e}var qe=`
  varying vec3 vLocalPos;
  void main() {
    vLocalPos = position;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
  }
`,Je=`
  precision highp float;
  uniform float uTime;
  uniform float uThrust;
  uniform float uPhase;
  uniform vec3 uColorCore;
  uniform vec3 uColorMid;
  varying vec3 vLocalPos;

  ${ee}

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
    ${A}
  }
`;function Ye(){let e=document.createElement(`canvas`);e.width=128,e.height=128;let t=e.getContext(`2d`),r=t.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2);r.addColorStop(0,`rgba(255,255,255,1)`),r.addColorStop(.35,`rgba(150,210,255,0.65)`),r.addColorStop(1,`rgba(80,160,255,0)`),t.fillStyle=r,t.fillRect(0,0,128,128);let i=new n(e);return i.needsUpdate=!0,i}function Xe(e){let n=new o;n.name=`engine-fx`;let r=new u(.4,24),s=new _({color:1581870,emissive:Q.clone(),emissiveIntensity:Ie,metalness:.6,roughness:.3}),c=Ye(),l=new d({map:c,color:Q.clone(),transparent:!0,depthWrite:!1,blending:2,opacity:.18}),f=[],m=[],g=Ke(),v=[];e.forEach((e,t)=>{let i=new b(r,s);i.position.copy(e),i.rotation.y=Math.PI,n.add(i);let o=new S(l);o.position.copy(e).add(new a(0,0,.22)),o.scale.set(.55,.55,1),o.visible=!1,n.add(o),f.push(o);let c=new p({uniforms:{uTime:{value:0},uThrust:{value:0},uPhase:{value:t%4*17.3},uColorCore:{value:We.clone()},uColorMid:{value:Ge.clone()}},vertexShader:qe,fragmentShader:Je,transparent:!0,depthWrite:!1,side:2,blending:2}),u=new b(g,c);u.position.copy(e).add(new a(0,0,.04)),u.scale.set($,$,Ve),u.renderOrder=5,n.add(u),v.push({mesh:u,mat:c});let d=new h(Q.getHex(),ze,40,2);d.position.copy(e).add(new a(0,0,1)),n.add(d),m.push(d)});let y=new i;return{group:n,nozzleMat:s,updateThrust(e,n){let r=t.clamp(e,0,1);y.copy(Q).lerp(Re,r);let i=t.lerp(Ie,Le,r);s.emissive.copy(y),s.emissiveIntensity=i,l.color.copy(y),l.opacity=t.lerp(.18,.48,r);let a=t.lerp(1.25,2.05,r);for(let e of f)e.scale.set(a,a,1);let o=t.lerp(ze,Be,r);for(let e of m)e.color.copy(y),e.intensity=o;let c=t.lerp(Ve,He,r),u=t.lerp($,Ue,r);for(let e of v)e.mesh.visible=r>.04,e.mesh.scale.set(u,u,c),e.mat.uniforms.uTime.value=n,e.mat.uniforms.uThrust.value=r},dispose(){r.dispose(),s.dispose(),l.dispose(),c.dispose(),g.dispose();for(let e of v)e.mat.dispose()}}}var Ze=e({buildShipV2:()=>Qe});async function Qe(e,t){let{hull:n,source:r}=await Fe(e,t),i=Xe(n.nozzleAttachPoints),a=new o;return a.name=`ship-root-v2`,a.userData.hullSource=r,a.add(n.group),a.add(i.group),{group:a,updateThrust(e,t){i.updateThrust(e,t)},dispose(){n.dispose(),i.dispose()}}}export{te as a,k as c,oe as d,E as i,A as l,Ze as n,ne as o,ee as r,O as s,Qe as t,ae as u};