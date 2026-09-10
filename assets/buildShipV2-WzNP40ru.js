import{n as e}from"./rolldown-runtime-QTnfLwEv.js";import{At as t,B as n,C as r,D as i,E as a,I as o,L as s,Q as c,T as l,X as u,_ as d,a as f,b as p,bt as m,c as h,dt as g,et as _,gt as v,ht as y,st as b,tt as x,v as S,vt as C,x as w,yt as ee}from"./three-8V8V_zZj.js";var T={ink:526343,amber:16098596,amberBright:16762977,amberDeep:15234586,coral:16735802},E=new t(600,400,250).normalize(),D=u.degToRad(.1),O=`
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
    ${k}
  }
`;function ae(e,t,n){let{power:r=2.6,intensity:i=1.1,segments:a=48}=n??{},o=new C(e*1.06,a,Math.max(16,Math.floor(a/1.5))),s=new y({uniforms:{uColor:{value:new l(t)},uPower:{value:r},uIntensity:{value:i}},vertexShader:re,fragmentShader:ie,transparent:!0,depthWrite:!1,blending:2}),u=new c(o,s);return u.renderOrder=3,{mesh:u,dispose(){o.dispose(),s.dispose()}}}function oe(e){let t=e|0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function j(e,t){let n=Math.cos(e),r=Math.sin(e),i=Math.max(t.roundness,1.001),a=Math.max(t.roundnessY??t.roundness,1.001),o=Math.max(t.roundnessBottom??t.roundnessY??t.roundness,1.001),s=r>=0?a:o,c=r>=0?t.halfHeight:t.halfHeightBottom??t.halfHeight;return[Math.sign(n)*Math.abs(n)**(2/i)*t.halfWidth,Math.sign(r)*Math.abs(r)**(2/s)*c]}function M(e,t){let n=e.length,r=[],i=[];for(let a=0;a<n;a++){let o=e[a],s=a/(n-1);for(let e=0;e<t;e++){let[n,a]=j(e/t*Math.PI*2,o);r.push(n+(o.centerX??0),a+(o.centerY??0),o.z),i.push(e/t,s)}}let a=[];for(let e=0;e<n-1;e++){let n=e*t,r=(e+1)*t;for(let e=0;e<t;e++){let i=(e+1)%t,o=n+e,s=n+i,c=r+e,l=r+i;a.push(o,s,c),a.push(s,l,c)}}let o=new p;return o.setAttribute(`position`,new s(r,3)),o.setAttribute(`uv`,new s(i,2)),o.setIndex(a),o.computeVertexNormals(),o}function N(e,t,n){let r=[e.centerX??0,e.centerY??0,e.z],i=[.5,.5];for(let n=0;n<t;n++){let a=n/t*Math.PI*2,[o,s]=j(a,e);r.push(o+(e.centerX??0),s+(e.centerY??0),e.z),i.push(.5+Math.cos(a)*.5,.5+Math.sin(a)*.5)}let a=[];for(let e=0;e<t;e++){let r=(e+1)%t;n>0?a.push(0,1+e,1+r):a.push(0,1+r,1+e)}let o=new p;return o.setAttribute(`position`,new s(r,3)),o.setAttribute(`uv`,new s(i,2)),o.setIndex(a),o.computeVertexNormals(),o}function se(e){let t=e.length,n=e.map(e=>e[0]),r=e.map(e=>e[1]),i=[];for(let e=0;e<t-1;e++)i.push((r[e+1]-r[e])/(n[e+1]-n[e]));let a=Array(t).fill(0);a[0]=i[0],a[t-1]=i[t-2];for(let e=1;e<t-1;e++)a[e]=i[e-1]*i[e]<=0?0:(i[e-1]+i[e])/2;for(let e=0;e<t-1;e++){if(i[e]===0){a[e]=0,a[e+1]=0;continue}let t=a[e]/i[e],n=a[e+1]/i[e],r=t*t+n*n;if(r>9){let o=3/Math.sqrt(r);a[e]=o*t*i[e],a[e+1]=o*n*i[e]}}return{xs:n,ys:r,ms:a}}function ce(e,t){let{xs:n,ys:r,ms:i}=e,a=n.length;if(t<=n[0])return r[0];if(t>=n[a-1])return r[a-1];let o=0;for(;o<a-2&&t>n[o+1];)o++;let s=n[o+1]-n[o],c=(t-n[o])/s,l=c*c,u=l*c,d=2*u-3*l+1,f=u-2*l+c,p=-2*u+3*l,m=u-l;return d*r[o]+f*s*i[o]+p*r[o+1]+m*s*i[o+1]}var P=new WeakMap;function F(e,t){let n=P.get(e);return n||(n=se(e),P.set(e,n)),ce(n,t)}function le(){let e=1024,t=document.createElement(`canvas`);t.width=e,t.height=e;let n=t.getContext(`2d`);n.fillStyle=`#c9c9c9`,n.fillRect(0,0,e,e);let r=1337,i=()=>(r=r*1103515245+12345&2147483647,(r>>>0)/2147483647),a=[0];for(let t=1;t<9;t++)a.push(t/9*e+(i()-.5)*(e/9)*.3);a.push(e);let o=[0];for(let t=1;t<14;t++)o.push(t/14*e+(i()-.5)*(e/14)*.3);o.push(e),n.strokeStyle=`rgba(40,42,46,0.55)`,n.lineWidth=2;for(let t of a)n.beginPath(),n.moveTo(t,0),n.lineTo(t,e),n.stroke();for(let t of o)n.beginPath(),n.moveTo(0,t),n.lineTo(e,t),n.stroke();for(let e=0;e<14;e++)for(let t=0;t<9;t++){let r=190+Math.floor((i()-.5)*26);n.fillStyle=`rgba(${r},${r},${r+2},0.5)`,n.fillRect(a[t]+1,o[e]+1,a[t+1]-a[t]-2,o[e+1]-o[e]-2)}n.fillStyle=`rgba(60,62,66,0.5)`;for(let t=0;t<260;t++){let t=i()*e,r=i()*e;n.beginPath(),n.arc(t,r,1.4,0,Math.PI*2),n.fill()}let s=n.getImageData(0,0,e,e),c=s.data;for(let e=0;e<c.length;e+=4){let t=(i()-.5)*10;c[e]=Math.min(255,Math.max(0,c[e]+t)),c[e+1]=Math.min(255,Math.max(0,c[e+1]+t)),c[e+2]=Math.min(255,Math.max(0,c[e+2]+t))}n.putImageData(s,0,0);let l=new w(t);return l.wrapS=g,l.wrapT=g,l.colorSpace=``,l.needsUpdate=!0,l}function I(e){let t=le(),n=t.clone();n.image=t.image,n.repeat.set(8,2),n.needsUpdate=!0;let r=t.clone();r.image=t.image,r.repeat.set(5,4),r.needsUpdate=!0;let i=new _({color:5924212,metalness:.78,roughness:.32,roughnessMap:n,envMapIntensity:.95,clearcoat:.22,clearcoatRoughness:.34}),a=new _({color:1975084,metalness:.72,roughness:.36,roughnessMap:r,envMapIntensity:.58,clearcoat:.12,clearcoatRoughness:.4}),o=new _({color:2765116,metalness:.28,roughness:.48,roughnessMap:r,envMapIntensity:.4,clearcoat:.1,clearcoatRoughness:.45}),s=new _({color:462872,metalness:.22,roughness:.06,clearcoat:1,clearcoatRoughness:.06,emissive:new l(663600),emissiveIntensity:.28,envMapIntensity:.7}),c=new _({color:2896702,metalness:.74,roughness:.34,envMapIntensity:.55,clearcoat:.14,clearcoatRoughness:.4});return e&&(i.envMap=e,a.envMap=e,o.envMap=e,s.envMap=e,c.envMap=e),{steel:i,gunmetal:a,ceramic:o,glass:s,blade:c,dispose(){i.dispose(),a.dispose(),o.dispose(),s.dispose(),c.dispose(),t.dispose(),n.dispose(),r.dispose()}}}function L(e){return new x({color:e,emissive:new l(e),emissiveIntensity:.35,roughness:.6,metalness:0})}var R=34,z=R/2,B=48,V=96,ue=[[0,.14],[.08,.34],[.16,.48],[.32,.56],[.5,.58],[.7,.6],[.88,.54],[1,.48]],de=[[0,.1],[.14,.28],[.4,.42],[.68,.5],[.88,.4],[1,.28]],fe=[[0,.08],[.14,.18],[.4,.24],[.68,.28],[1,.16]],pe=[[0,3.6],[.2,4.2],[.6,3.4],[1,3.2]],me=[[0,3.8],[.3,3.2],[1,2.8]],he=[[0,4.2],[1,3.6]];function H(e){return{halfWidth:F(ue,e),halfHeight:F(de,e),halfHeightBottom:F(fe,e),roundness:F(pe,e),roundnessY:F(me,e),roundnessBottom:F(he,e),centerX:0,centerY:0}}function ge(){let e=[];for(let t=0;t<V;t++){let n=t/(V-1),r=H(n);e.push({z:-17+n*R,...r})}let t=M(e,B),n=N(e[0],B,-1),r=N(e[V-1],B,1),i=h([t,n,r]);return t.dispose(),n.dispose(),r.dispose(),i}function U(e){return H(u.clamp((e+z)/R,0,1))}function W(e,t,n,r,i,a=20,o=8){let c=[],l=[],d=[];for(let s=0;s<=a;s++){let f=u.lerp(e,t,s/a),p=U(f);for(let e=0;e<=o;e++){let[t,m]=j(u.degToRad(u.lerp(n,r,e/o)),p),h=Math.hypot(t,m)||1,g=t/h,_=m/h;c.push(t+g*i+p.centerX,m+_*i+p.centerY,f),d.push(g,_),l.push(e/o,s/a)}}let f=o+1,m=[];for(let e=0;e<a;e++)for(let t=0;t<o;t++){let n=e*f+t,r=n+1,i=n+f,a=i+1;m.push(n,i,r,r,i,a)}let h=new p;h.setAttribute(`position`,new s(c,3)),h.setAttribute(`uv`,new s(l,2)),h.setIndex(m),h.computeVertexNormals();let g=h.getAttribute(`normal`),_=Math.floor(a/2*f+o/2);if(g.getX(_)*d[_*2]+g.getY(_)*d[_*2+1]<0){let e=h.getIndex();for(let t=0;t<e.count;t+=3){let n=e.getX(t+1);e.setX(t+1,e.getX(t+2)),e.setX(t+2,n)}e.needsUpdate=!0,h.computeVertexNormals()}return h}var G=-9.52,_e=-4.76,K=14,q=20,ve=[[0,.12],[.3,.32],[.7,.28],[1,.1]],ye=[[0,.06],[.35,.26],[.7,.22],[1,.06]];function be(){let e=[];for(let t=0;t<K;t++){let n=t/(K-1),r=G+n*(_e-G),i=U(r),a=F(ye,n);e.push({z:r,centerX:0,centerY:i.centerY+i.halfHeight+a*.28,halfWidth:F(ve,n),halfHeight:a,roundness:2.6,roundnessY:2.2,roundnessBottom:3.4})}let t=M(e,q),n=N(e[0],q,-1),r=N(e[K-1],q,1),i=h([t,n,r]);return t.dispose(),n.dispose(),r.dispose(),i}function xe(e,t,n,r,i){let a=new v;a.moveTo(0,0),a.lineTo(t,0),a.lineTo(r+n,e),a.lineTo(r,e),a.closePath();let s=new o(a,{depth:i,bevelEnabled:!0,bevelThickness:i*.3,bevelSize:i*.25,bevelSegments:2});return s.translate(0,0,-i/2),s.rotateY(-Math.PI/2),s}function J(){let e=new v;e.moveTo(.12,.4),e.lineTo(3.15,2.35),e.lineTo(3.35,5.4),e.lineTo(.18,4.1),e.closePath();let t=new o(e,{depth:.82,bevelEnabled:!0,bevelThickness:.14,bevelSize:.12,bevelSegments:2});return t.translate(0,0,-.41),t.rotateX(Math.PI/2),t.computeVertexNormals(),t}function Se(){let e=[];for(let t=0;t<40;t++){let n=t/39,r;r=n<.14?u.lerp(.32,1.02,n/.14):n<.72?u.lerp(1.02,1.14,(n-.14)/.58):u.lerp(1.14,1.08,(n-.72)/.28);let i=r*.78;e.push({z:-5.3+n*10.6,halfWidth:r,halfHeight:i,halfHeightBottom:i*.92,roundness:2.5,roundnessY:2.3,roundnessBottom:2.8})}let t=M(e,28),n=N(e[0],28,-1),r=N(e[39],28,1),i=h([t,n,r]);return t.dispose(),n.dispose(),r.dispose(),i}var Y=10.6,X=.98,Ce=3.4,we=-.22;function Z(e){return new t(e*3.85,-1.35,7.65)}var Te=7.48;function Ee(e){let r=I(e),a=new n;a.name=`ship-hull-normandy`;let o=[];function s(e,t){o.push(e);let n=new c(e,t);return a.add(n),n}s(ge(),r.steel);let l=-14.6;s(new S(11.8,.48,3.7),r.gunmetal).position.set(0,.16,l),s(new S(11.4,.16,3.2),r.steel).position.set(0,.44,l),s(new S(10.6,.14,2.4),r.steel).position.set(0,-.14,-14.4),s(new S(10.8,.32,.55),r.gunmetal).position.set(0,.12,l-1.95),s(new S(1.7,.36,2.4),r.steel).position.set(0,.2,-12.2);let u=s(be(),r.glass);u.renderOrder=1,s(W(-5.5,11.5,-12,14,.014,20,5),r.ceramic),s(W(-5.5,11.5,166,194,.014,20,5),r.ceramic);let d=J(),f=J();f.scale(-1,1,1);let p=f.getIndex();if(p){for(let e=0;e<p.count;e+=3){let t=p.getX(e+1);p.setX(e+1,p.getX(e+2)),p.setX(e+2,t)}p.needsUpdate=!0}f.computeVertexNormals(),o.push(d,f);for(let e of[1,-1]){let t=new c(e===1?d:f,r.steel);t.position.set(0,we,Ce),t.rotation.z=-e*.32,a.add(t)}let m=[],h=Se();o.push(h);let g=new i(X*.48,X,.7,24,1,!0);g.rotateX(Math.PI/2),o.push(g);for(let e of[1,-1]){let n=Z(e),i=new c(h,r.gunmetal);i.position.copy(n),a.add(i);let o=new c(g,r.steel);o.position.copy(n).add(new t(0,0,Y*.5)),a.add(o),m.push(n.clone().add(new t(0,0,Y*.52)))}let _=U(Te).halfHeight+.02,v=xe(2.15,1.65,.28,1.1,.07);o.push(v);for(let e of[-1,1]){let t=new c(v,r.gunmetal);t.position.set(e*.12,_,Te),t.rotation.z=-e*.08,a.add(t)}let y=new C(.045,10,8);o.push(y);let b=L(16722474),x=L(2883422),w=L(14214384),ee=Z(1),T=Z(-1),E=new c(y,b);E.position.copy(T).add(new t(-.85,.2,0)),a.add(E);let D=new c(y,x);D.position.copy(ee).add(new t(.85,.2,0)),a.add(D);let O=U(z),k=new c(y,w);return k.position.set(0,O.centerY+O.halfHeight*.8,17.02),k.scale.setScalar(.5),a.add(k),{group:a,nozzleAttachPoints:m,dispose(){for(let e of o)e.dispose();b.dispose(),x.dispose(),w.dispose(),r.dispose()}}}var De=`/v4/assets/ships/normandy-sr2-joshuas-cc0.glb`,Oe=28,ke=Math.PI;function Ae(e){let r=new d().setFromObject(e),i=new t;r.getCenter(i),e.position.sub(i);let a=new t;r.getSize(a);let o=new n;o.add(e),a.x>=a.y&&a.x>=a.z?o.rotation.y=Math.PI/2:a.y>a.x&&a.y>=a.z&&(o.rotation.x=Math.PI/2),o.rotation.y+=ke;let s=new d().setFromObject(o),c=new t;s.getSize(c);let l=Oe/Math.max(c.z,1e-4),u=new n;return u.name=`normandy-glb-hull`,u.add(o),u.scale.setScalar(l),{group:u,box:new d().setFromObject(u)}}function je(e){let n=e.min,r=e.max,i=(n.x+r.x)/2,a=n.y+(r.y-n.y)*.42,o=r.z-n.z,s=r.z,c=(r.x-n.x)*.36,l=(r.y-n.y)*.14,u=s-o*.04;return[new t(i+c,a-l,s),new t(i+c,a+l*.6,s),new t(i-c,a-l,s),new t(i-c,a+l*.6,s),new t(i+c*.22,a,u),new t(i-c*.22,a,u)]}function Me(e,t){let n=I(t),r=[n.steel,n.gunmetal,n.ceramic,n.glass,n.blade],i=0;return e.traverse(e=>{if(e instanceof c){let t=e.name.toLowerCase();t.includes(`glass`)||t.includes(`canopy`)||t.includes(`window`)?e.material=n.glass:t.includes(`stripe`)||t.includes(`band`)||t.includes(`ceramic`)?e.material=n.ceramic:t.includes(`engine`)||t.includes(`nozzle`)||t.includes(`dark`)?e.material=n.gunmetal:e.material=i%4==0?n.ceramic:n.steel,e.castShadow=!1,e.receiveShadow=!1,i+=1}}),r}function Ne(e,t){let{group:n,box:r}=Ae(e.scene.clone(!0)),i=Me(n,t),a=je(r),o=[];return n.traverse(e=>{e instanceof c&&o.push(e.geometry)}),{group:n,nozzleAttachPoints:a,dispose(){for(let e of o)e.dispose();for(let e of i)e.dispose()}}}async function Pe(){try{let e=await fetch(De,{method:`GET`,headers:{Range:`bytes=0-11`},cache:`force-cache`});if(!e.ok||(e.headers.get(`content-type`)??``).includes(`text/html`))return!1;let t=new Uint8Array(await e.arrayBuffer());return t.byteLength<4?!1:t[0]===103&&t[1]===108&&t[2]===84&&t[3]===70}catch{return!1}}async function Fe(e,t){if(!(typeof location<`u`&&new URLSearchParams(location.search).has(`glb`))||!await Pe())return{hull:Ee(t),source:`procedural`};try{return{hull:Ne(await new f(e).loadAsync(De),t),source:`glb`}}catch{return{hull:Ee(t),source:`procedural`}}}var Ie=.22,Le=1.35,Q=new l(2779788),Re=new l(5941448),ze=2.2,Be=12,Ve=.45,He=4.6,$=.16,Ue=.38,We=new l(15267071),Ge=new l(3061992);function Ke(){let e=new a(1,1,20,12,!0);return e.translate(0,.5,0),e.rotateX(Math.PI/2),e}var qe=`
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
`;function Ye(){let e=document.createElement(`canvas`);e.width=128,e.height=128;let t=e.getContext(`2d`),n=t.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2);n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.35,`rgba(150,210,255,0.65)`),n.addColorStop(1,`rgba(80,160,255,0)`),t.fillStyle=n,t.fillRect(0,0,128,128);let r=new w(e);return r.needsUpdate=!0,r}function Xe(e){let i=new n;i.name=`engine-fx`;let a=new r(.4,24),o=new x({color:1581870,emissive:Q.clone(),emissiveIntensity:Ie,metalness:.6,roughness:.3}),s=Ye(),d=new m({map:s,color:Q.clone(),transparent:!0,depthWrite:!1,blending:2,opacity:.18}),f=[],p=[],h=Ke(),g=[];e.forEach((e,n)=>{let r=new c(a,o);r.position.copy(e),r.rotation.y=Math.PI,i.add(r);let s=new ee(d);s.position.copy(e).add(new t(0,0,.22)),s.scale.set(.55,.55,1),s.visible=!1,i.add(s),f.push(s);let l=new y({uniforms:{uTime:{value:0},uThrust:{value:0},uPhase:{value:n%4*17.3},uColorCore:{value:We.clone()},uColorMid:{value:Ge.clone()}},vertexShader:qe,fragmentShader:Je,transparent:!0,depthWrite:!1,side:2,blending:2}),u=new c(h,l);u.position.copy(e).add(new t(0,0,.04)),u.scale.set($,$,Ve),u.renderOrder=5,i.add(u),g.push({mesh:u,mat:l});let m=new b(Q.getHex(),ze,40,2);m.position.copy(e).add(new t(0,0,1)),i.add(m),p.push(m)});let _=new l;return{group:i,nozzleMat:o,updateThrust(e,t){let n=u.clamp(e,0,1);_.copy(Q).lerp(Re,n);let r=u.lerp(Ie,Le,n);o.emissive.copy(_),o.emissiveIntensity=r,d.color.copy(_),d.opacity=u.lerp(.18,.48,n);let i=u.lerp(1.25,2.05,n);for(let e of f)e.scale.set(i,i,1);let a=u.lerp(ze,Be,n);for(let e of p)e.color.copy(_),e.intensity=a;let s=u.lerp(Ve,He,n),c=u.lerp($,Ue,n);for(let e of g)e.mesh.visible=n>.04,e.mesh.scale.set(c,c,s),e.mat.uniforms.uTime.value=t,e.mat.uniforms.uThrust.value=n},dispose(){a.dispose(),o.dispose(),d.dispose(),s.dispose(),h.dispose();for(let e of g)e.mat.dispose()}}}var Ze=e({buildShipV2:()=>Qe});async function Qe(e,t){let{hull:r,source:i}=await Fe(e,t),a=Xe(r.nozzleAttachPoints),o=new n;return o.name=`ship-root-v2`,o.userData.hullSource=i,o.add(r.group),o.add(a.group),{group:o,updateThrust(e,t){a.updateThrust(e,t)},dispose(){r.dispose(),a.dispose()}}}export{te as a,O as c,oe as d,T as i,k as l,Ze as n,ne as o,A as r,D as s,Qe as t,ae as u};