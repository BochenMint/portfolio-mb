import{n as e}from"./rolldown-runtime-QTnfLwEv.js";import{C as t,D as n,H as r,Mt as i,O as a,Q as o,R as s,S as c,St as l,T as u,_t as d,a as f,bt as p,c as m,et as h,k as g,lt as _,nt as v,pt as y,rt as b,v as x,vt as S,xt as C,y as w,z as T}from"./three-D_yaIDXV.js";var E={ink:526343,amber:16098596,amberBright:16762977,amberDeep:15234586,coral:16735802},D=new i(600,400,250).normalize(),O=o.degToRad(.1),k=`
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
`;function ae(e,t,r){let{power:i=2.6,intensity:a=1.1,segments:o=48}=r??{},s=new p(e*1.06,o,Math.max(16,Math.floor(o/1.5))),c=new d({uniforms:{uColor:{value:new n(t)},uPower:{value:i},uIntensity:{value:a}},vertexShader:re,fragmentShader:ie,transparent:!0,depthWrite:!1,blending:2}),l=new h(s,c);return l.renderOrder=3,{mesh:l,dispose(){s.dispose(),c.dispose()}}}function oe(e){let t=e|0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function j(e,t){let n=Math.cos(e),r=Math.sin(e),i=Math.max(t.roundness,1.001),a=Math.max(t.roundnessY??t.roundness,1.001),o=Math.max(t.roundnessBottom??t.roundnessY??t.roundness,1.001),s=r>=0?a:o,c=r>=0?t.halfHeight:t.halfHeightBottom??t.halfHeight;return[Math.sign(n)*Math.abs(n)**(2/i)*t.halfWidth,Math.sign(r)*Math.abs(r)**(2/s)*c]}function M(e,t){let n=e.length,r=[],i=[];for(let a=0;a<n;a++){let o=e[a],s=a/(n-1);for(let e=0;e<t;e++){let[n,a]=j(e/t*Math.PI*2,o);r.push(n+(o.centerX??0),a+(o.centerY??0),o.z),i.push(e/t,s)}}let a=[];for(let e=0;e<n-1;e++){let n=e*t,r=(e+1)*t;for(let e=0;e<t;e++){let i=(e+1)%t,o=n+e,s=n+i,c=r+e,l=r+i;a.push(o,s,c),a.push(s,l,c)}}let o=new c;return o.setAttribute(`position`,new T(r,3)),o.setAttribute(`uv`,new T(i,2)),o.setIndex(a),o.computeVertexNormals(),o}function N(e,t,n){let r=[e.centerX??0,e.centerY??0,e.z],i=[.5,.5];for(let n=0;n<t;n++){let a=n/t*Math.PI*2,[o,s]=j(a,e);r.push(o+(e.centerX??0),s+(e.centerY??0),e.z),i.push(.5+Math.cos(a)*.5,.5+Math.sin(a)*.5)}let a=[];for(let e=0;e<t;e++){let r=(e+1)%t;n>0?a.push(0,1+e,1+r):a.push(0,1+r,1+e)}let o=new c;return o.setAttribute(`position`,new T(r,3)),o.setAttribute(`uv`,new T(i,2)),o.setIndex(a),o.computeVertexNormals(),o}function se(e){let t=e.length,n=e.map(e=>e[0]),r=e.map(e=>e[1]),i=[];for(let e=0;e<t-1;e++)i.push((r[e+1]-r[e])/(n[e+1]-n[e]));let a=Array(t).fill(0);a[0]=i[0],a[t-1]=i[t-2];for(let e=1;e<t-1;e++)a[e]=i[e-1]*i[e]<=0?0:(i[e-1]+i[e])/2;for(let e=0;e<t-1;e++){if(i[e]===0){a[e]=0,a[e+1]=0;continue}let t=a[e]/i[e],n=a[e+1]/i[e],r=t*t+n*n;if(r>9){let o=3/Math.sqrt(r);a[e]=o*t*i[e],a[e+1]=o*n*i[e]}}return{xs:n,ys:r,ms:a}}function ce(e,t){let{xs:n,ys:r,ms:i}=e,a=n.length;if(t<=n[0])return r[0];if(t>=n[a-1])return r[a-1];let o=0;for(;o<a-2&&t>n[o+1];)o++;let s=n[o+1]-n[o],c=(t-n[o])/s,l=c*c,u=l*c,d=2*u-3*l+1,f=u-2*l+c,p=-2*u+3*l,m=u-l;return d*r[o]+f*s*i[o]+p*r[o+1]+m*s*i[o+1]}var P=new WeakMap;function F(e,t){let n=P.get(e);return n||(n=se(e),P.set(e,n)),ce(n,t)}function le(){let e=1024,n=document.createElement(`canvas`);n.width=e,n.height=e;let r=n.getContext(`2d`);r.fillStyle=`#c9c9c9`,r.fillRect(0,0,e,e);let i=1337,a=()=>(i=i*1103515245+12345&2147483647,(i>>>0)/2147483647),o=[0];for(let t=1;t<9;t++)o.push(t/9*e+(a()-.5)*(e/9)*.3);o.push(e);let s=[0];for(let t=1;t<14;t++)s.push(t/14*e+(a()-.5)*(e/14)*.3);s.push(e),r.strokeStyle=`rgba(40,42,46,0.55)`,r.lineWidth=2;for(let t of o)r.beginPath(),r.moveTo(t,0),r.lineTo(t,e),r.stroke();for(let t of s)r.beginPath(),r.moveTo(0,t),r.lineTo(e,t),r.stroke();for(let e=0;e<14;e++)for(let t=0;t<9;t++){let n=190+Math.floor((a()-.5)*26);r.fillStyle=`rgba(${n},${n},${n+2},0.5)`,r.fillRect(o[t]+1,s[e]+1,o[t+1]-o[t]-2,s[e+1]-s[e]-2)}r.fillStyle=`rgba(60,62,66,0.5)`;for(let t=0;t<260;t++){let t=a()*e,n=a()*e;r.beginPath(),r.arc(t,n,1.4,0,Math.PI*2),r.fill()}let c=r.getImageData(0,0,e,e),l=c.data;for(let e=0;e<l.length;e+=4){let t=(a()-.5)*10;l[e]=Math.min(255,Math.max(0,l[e]+t)),l[e+1]=Math.min(255,Math.max(0,l[e+1]+t)),l[e+2]=Math.min(255,Math.max(0,l[e+2]+t))}r.putImageData(c,0,0);let u=new t(n);return u.wrapS=y,u.wrapT=y,u.colorSpace=``,u.needsUpdate=!0,u}function I(e){let t=le(),r=t.clone();r.image=t.image,r.repeat.set(8,2),r.needsUpdate=!0;let i=t.clone();i.image=t.image,i.repeat.set(5,4),i.needsUpdate=!0;let a=new v({color:5924212,metalness:.78,roughness:.32,roughnessMap:r,envMapIntensity:.95,clearcoat:.22,clearcoatRoughness:.34}),o=new v({color:1975084,metalness:.72,roughness:.36,roughnessMap:i,envMapIntensity:.58,clearcoat:.12,clearcoatRoughness:.4}),s=new v({color:2765116,metalness:.28,roughness:.48,roughnessMap:i,envMapIntensity:.4,clearcoat:.1,clearcoatRoughness:.45}),c=new v({color:462872,metalness:.22,roughness:.06,clearcoat:1,clearcoatRoughness:.06,emissive:new n(663600),emissiveIntensity:.28,envMapIntensity:.7}),l=new v({color:2896702,metalness:.74,roughness:.34,envMapIntensity:.55,clearcoat:.14,clearcoatRoughness:.4});return e&&(a.envMap=e,o.envMap=e,s.envMap=e,c.envMap=e,l.envMap=e),{steel:a,gunmetal:o,ceramic:s,glass:c,blade:l,dispose(){a.dispose(),o.dispose(),s.dispose(),c.dispose(),l.dispose(),t.dispose(),r.dispose(),i.dispose()}}}function L(e){return new b({color:e,emissive:new n(e),emissiveIntensity:.35,roughness:.6,metalness:0})}var R=34,z=R/2,B=48,V=96,ue=[[0,.14],[.08,.34],[.16,.48],[.32,.56],[.5,.58],[.7,.6],[.88,.54],[1,.48]],de=[[0,.1],[.14,.28],[.4,.42],[.68,.5],[.88,.4],[1,.28]],fe=[[0,.08],[.14,.18],[.4,.24],[.68,.28],[1,.16]],pe=[[0,3.6],[.2,4.2],[.6,3.4],[1,3.2]],me=[[0,3.8],[.3,3.2],[1,2.8]],he=[[0,4.2],[1,3.6]];function H(e){return{halfWidth:F(ue,e),halfHeight:F(de,e),halfHeightBottom:F(fe,e),roundness:F(pe,e),roundnessY:F(me,e),roundnessBottom:F(he,e),centerX:0,centerY:0}}function ge(){let e=[];for(let t=0;t<V;t++){let n=t/(V-1),r=H(n);e.push({z:-17+n*R,...r})}let t=M(e,B),n=N(e[0],B,-1),r=N(e[V-1],B,1),i=m([t,n,r]);return t.dispose(),n.dispose(),r.dispose(),i}function U(e){return H(o.clamp((e+z)/R,0,1))}function W(e,t,n,r,i,a=20,s=8){let l=[],u=[],d=[];for(let c=0;c<=a;c++){let f=o.lerp(e,t,c/a),p=U(f);for(let e=0;e<=s;e++){let[t,m]=j(o.degToRad(o.lerp(n,r,e/s)),p),h=Math.hypot(t,m)||1,g=t/h,_=m/h;l.push(t+g*i+p.centerX,m+_*i+p.centerY,f),d.push(g,_),u.push(e/s,c/a)}}let f=s+1,p=[];for(let e=0;e<a;e++)for(let t=0;t<s;t++){let n=e*f+t,r=n+1,i=n+f,a=i+1;p.push(n,i,r,r,i,a)}let m=new c;m.setAttribute(`position`,new T(l,3)),m.setAttribute(`uv`,new T(u,2)),m.setIndex(p),m.computeVertexNormals();let h=m.getAttribute(`normal`),g=Math.floor(a/2*f+s/2);if(h.getX(g)*d[g*2]+h.getY(g)*d[g*2+1]<0){let e=m.getIndex();for(let t=0;t<e.count;t+=3){let n=e.getX(t+1);e.setX(t+1,e.getX(t+2)),e.setX(t+2,n)}e.needsUpdate=!0,m.computeVertexNormals()}return m}var G=-9.52,_e=-4.76,K=14,q=20,ve=[[0,.12],[.3,.32],[.7,.28],[1,.1]],ye=[[0,.06],[.35,.26],[.7,.22],[1,.06]];function be(){let e=[];for(let t=0;t<K;t++){let n=t/(K-1),r=G+n*(_e-G),i=U(r),a=F(ye,n);e.push({z:r,centerX:0,centerY:i.centerY+i.halfHeight+a*.28,halfWidth:F(ve,n),halfHeight:a,roundness:2.6,roundnessY:2.2,roundnessBottom:3.4})}let t=M(e,q),n=N(e[0],q,-1),r=N(e[K-1],q,1),i=m([t,n,r]);return t.dispose(),n.dispose(),r.dispose(),i}function xe(e,t,n,r,i){let a=new S;a.moveTo(0,0),a.lineTo(t,0),a.lineTo(r+n,e),a.lineTo(r,e),a.closePath();let o=new s(a,{depth:i,bevelEnabled:!0,bevelThickness:i*.3,bevelSize:i*.25,bevelSegments:2});return o.translate(0,0,-i/2),o.rotateY(-Math.PI/2),o}function J(){let e=new S;e.moveTo(.12,.4),e.lineTo(3.15,2.35),e.lineTo(3.35,5.4),e.lineTo(.18,4.1),e.closePath();let t=new s(e,{depth:.82,bevelEnabled:!0,bevelThickness:.14,bevelSize:.12,bevelSegments:2});return t.translate(0,0,-.41),t.rotateX(Math.PI/2),t.computeVertexNormals(),t}function Se(){let e=[];for(let t=0;t<40;t++){let n=t/39,r;r=n<.14?o.lerp(.32,1.02,n/.14):n<.72?o.lerp(1.02,1.14,(n-.14)/.58):o.lerp(1.14,1.08,(n-.72)/.28);let i=r*.78;e.push({z:-5.3+n*10.6,halfWidth:r,halfHeight:i,halfHeightBottom:i*.92,roundness:2.5,roundnessY:2.3,roundnessBottom:2.8})}let t=M(e,28),n=N(e[0],28,-1),r=N(e[39],28,1),i=m([t,n,r]);return t.dispose(),n.dispose(),r.dispose(),i}var Y=10.6,X=.98,Ce=3.4,we=-.22;function Z(e){return new i(e*3.85,-1.35,7.65)}var Te=7.48;function Ee(e){let t=I(e),n=new r;n.name=`ship-hull-normandy`;let a=[];function o(e,t){a.push(e);let r=new h(e,t);return n.add(r),r}o(ge(),t.steel);let s=-14.6;o(new w(11.8,.48,3.7),t.gunmetal).position.set(0,.16,s),o(new w(11.4,.16,3.2),t.steel).position.set(0,.44,s),o(new w(10.6,.14,2.4),t.steel).position.set(0,-.14,-14.4),o(new w(10.8,.32,.55),t.gunmetal).position.set(0,.12,s-1.95),o(new w(1.7,.36,2.4),t.steel).position.set(0,.2,-12.2);let c=o(be(),t.glass);c.renderOrder=1,o(W(-5.5,11.5,-12,14,.014,20,5),t.ceramic),o(W(-5.5,11.5,166,194,.014,20,5),t.ceramic);let l=J(),u=J();u.scale(-1,1,1);let d=u.getIndex();if(d){for(let e=0;e<d.count;e+=3){let t=d.getX(e+1);d.setX(e+1,d.getX(e+2)),d.setX(e+2,t)}d.needsUpdate=!0}u.computeVertexNormals(),a.push(l,u);for(let e of[1,-1]){let r=new h(e===1?l:u,t.steel);r.position.set(0,we,Ce),r.rotation.z=-e*.32,n.add(r)}let f=[],m=Se();a.push(m);let _=new g(X*.48,X,.7,24,1,!0);_.rotateX(Math.PI/2),a.push(_);for(let e of[1,-1]){let r=Z(e),a=new h(m,t.gunmetal);a.position.copy(r),n.add(a);let o=new h(_,t.steel);o.position.copy(r).add(new i(0,0,Y*.5)),n.add(o),f.push(r.clone().add(new i(0,0,Y*.52)))}let v=U(Te).halfHeight+.02,y=xe(2.15,1.65,.28,1.1,.07);a.push(y);for(let e of[-1,1]){let r=new h(y,t.gunmetal);r.position.set(e*.12,v,Te),r.rotation.z=-e*.08,n.add(r)}let b=new p(.045,10,8);a.push(b);let x=L(16722474),S=L(2883422),C=L(14214384),T=Z(1),E=Z(-1),D=new h(b,x);D.position.copy(E).add(new i(-.85,.2,0)),n.add(D);let O=new h(b,S);O.position.copy(T).add(new i(.85,.2,0)),n.add(O);let k=U(z),A=new h(b,C);return A.position.set(0,k.centerY+k.halfHeight*.8,17.02),A.scale.setScalar(.5),n.add(A),{group:n,nozzleAttachPoints:f,dispose(){for(let e of a)e.dispose();x.dispose(),S.dispose(),C.dispose(),t.dispose()}}}var De=`/v4/assets/ships/normandy-sr2-joshuas-cc0.glb`,Oe=28,ke=Math.PI;function Ae(e){let t=new x().setFromObject(e),n=new i;t.getCenter(n),e.position.sub(n);let a=new i;t.getSize(a);let o=new r;o.add(e),a.x>=a.y&&a.x>=a.z?o.rotation.y=Math.PI/2:a.y>a.x&&a.y>=a.z&&(o.rotation.x=Math.PI/2),o.rotation.y+=ke;let s=new x().setFromObject(o),c=new i;s.getSize(c);let l=Oe/Math.max(c.z,1e-4),u=new r;return u.name=`normandy-glb-hull`,u.add(o),u.scale.setScalar(l),{group:u,box:new x().setFromObject(u)}}function je(e){let t=e.min,n=e.max,r=(t.x+n.x)/2,a=t.y+(n.y-t.y)*.42,o=n.z-t.z,s=n.z,c=(n.x-t.x)*.36,l=(n.y-t.y)*.14,u=s-o*.04;return[new i(r+c,a-l,s),new i(r+c,a+l*.6,s),new i(r-c,a-l,s),new i(r-c,a+l*.6,s),new i(r+c*.22,a,u),new i(r-c*.22,a,u)]}function Me(e,t){let n=I(t),r=[n.steel,n.gunmetal,n.ceramic,n.glass,n.blade],i=0;return e.traverse(e=>{if(e instanceof h){let t=e.name.toLowerCase();t.includes(`glass`)||t.includes(`canopy`)||t.includes(`window`)?e.material=n.glass:t.includes(`stripe`)||t.includes(`band`)||t.includes(`ceramic`)?e.material=n.ceramic:t.includes(`engine`)||t.includes(`nozzle`)||t.includes(`dark`)?e.material=n.gunmetal:e.material=i%4==0?n.ceramic:n.steel,e.castShadow=!1,e.receiveShadow=!1,i+=1}}),r}function Ne(e,t){let{group:n,box:r}=Ae(e.scene.clone(!0)),i=Me(n,t),a=je(r),o=[];return n.traverse(e=>{e instanceof h&&o.push(e.geometry)}),{group:n,nozzleAttachPoints:a,dispose(){for(let e of o)e.dispose();for(let e of i)e.dispose()}}}async function Pe(){try{let e=await fetch(De,{method:`GET`,headers:{Range:`bytes=0-11`},cache:`force-cache`});if(!e.ok||(e.headers.get(`content-type`)??``).includes(`text/html`))return!1;let t=new Uint8Array(await e.arrayBuffer());return t.byteLength<4?!1:t[0]===103&&t[1]===108&&t[2]===84&&t[3]===70}catch{return!1}}async function Fe(e,t){if(!(typeof location<`u`&&new URLSearchParams(location.search).has(`glb`))||!await Pe())return{hull:Ee(t),source:`procedural`};try{return{hull:Ne(await new f(e).loadAsync(De),t),source:`glb`}}catch{return{hull:Ee(t),source:`procedural`}}}var Ie=.22,Le=1.35,Q=new n(2779788),Re=new n(5941448),ze=2.2,Be=12,Ve=.45,He=4.6,$=.16,Ue=.38,We=new n(15267071),Ge=new n(3061992);function Ke(){let e=new a(1,1,20,12,!0);return e.translate(0,.5,0),e.rotateX(Math.PI/2),e}var qe=`
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
`;function Ye(){let e=document.createElement(`canvas`);e.width=128,e.height=128;let n=e.getContext(`2d`),r=n.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2);r.addColorStop(0,`rgba(255,255,255,1)`),r.addColorStop(.35,`rgba(150,210,255,0.65)`),r.addColorStop(1,`rgba(80,160,255,0)`),n.fillStyle=r,n.fillRect(0,0,128,128);let i=new t(e);return i.needsUpdate=!0,i}function Xe(e){let t=new r;t.name=`engine-fx`;let a=new u(.4,24),s=new b({color:1581870,emissive:Q.clone(),emissiveIntensity:Ie,metalness:.6,roughness:.3}),c=Ye(),f=new l({map:c,color:Q.clone(),transparent:!0,depthWrite:!1,blending:2,opacity:.18}),p=[],m=[],g=Ke(),v=[];e.forEach((e,n)=>{let r=new h(a,s);r.position.copy(e),r.rotation.y=Math.PI,t.add(r);let o=new C(f);o.position.copy(e).add(new i(0,0,.22)),o.scale.set(.55,.55,1),o.visible=!1,t.add(o),p.push(o);let c=new d({uniforms:{uTime:{value:0},uThrust:{value:0},uPhase:{value:n%4*17.3},uColorCore:{value:We.clone()},uColorMid:{value:Ge.clone()}},vertexShader:qe,fragmentShader:Je,transparent:!0,depthWrite:!1,side:2,blending:2}),l=new h(g,c);l.position.copy(e).add(new i(0,0,.04)),l.scale.set($,$,Ve),l.renderOrder=5,t.add(l),v.push({mesh:l,mat:c});let u=new _(Q.getHex(),ze,40,2);u.position.copy(e).add(new i(0,0,1)),t.add(u),m.push(u)});let y=new n;return{group:t,nozzleMat:s,updateThrust(e,t){let n=o.clamp(e,0,1);y.copy(Q).lerp(Re,n);let r=o.lerp(Ie,Le,n);s.emissive.copy(y),s.emissiveIntensity=r,f.color.copy(y),f.opacity=o.lerp(.18,.48,n);let i=o.lerp(1.25,2.05,n);for(let e of p)e.scale.set(i,i,1);let a=o.lerp(ze,Be,n);for(let e of m)e.color.copy(y),e.intensity=a;let c=o.lerp(Ve,He,n),l=o.lerp($,Ue,n);for(let e of v)e.mesh.visible=n>.04,e.mesh.scale.set(l,l,c),e.mat.uniforms.uTime.value=t,e.mat.uniforms.uThrust.value=n},dispose(){a.dispose(),s.dispose(),f.dispose(),c.dispose(),g.dispose();for(let e of v)e.mat.dispose()}}}var Ze=e({buildShipV2:()=>Qe});async function Qe(e,t){let{hull:n,source:i}=await Fe(e,t),a=Xe(n.nozzleAttachPoints),o=new r;return o.name=`ship-root-v2`,o.userData.hullSource=i,o.add(n.group),o.add(a.group),{group:o,updateThrust(e,t){a.updateThrust(e,t)},dispose(){n.dispose(),a.dispose()}}}export{te as a,k as c,oe as d,E as i,A as l,Ze as n,ne as o,ee as r,O as s,Qe as t,ae as u};