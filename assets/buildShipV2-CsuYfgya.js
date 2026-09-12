import{n as e}from"./rolldown-runtime-QTnfLwEv.js";import{$ as t,B as n,C as r,D as i,E as a,I as o,L as s,T as c,Z as l,_ as u,_t as d,a as f,b as p,bt as m,c as h,ct as g,ft as _,gt as v,jt as y,nt as b,tt as x,v as S,x as C,xt as w,yt as T}from"./three-5t8Jrc3N.js";var ee={ink:526343,amber:16098596,amberBright:16762977,amberDeep:15234586,coral:16735802},E=new y(600,400,250).normalize(),D=l.degToRad(.1),O=`
  const vec3 SUN_DIR = vec3(${E.x.toFixed(6)}, ${E.y.toFixed(6)}, ${E.z.toFixed(6)});
`,k=`
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
`,te=`
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
`,ne=`
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
`,re=`
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
`,ie=`
  varying vec3 vNormalW;
  varying vec3 vWorldPos;
  void main() {
    vNormalW = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPos = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`,ae=`
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
`;function oe(e,n,r){let{power:i=2.6,intensity:a=1.1,segments:o=48}=r??{},s=new T(e*1.06,o,Math.max(16,Math.floor(o/1.5))),l=new v({uniforms:{uColor:{value:new c(n)},uPower:{value:i},uIntensity:{value:a}},vertexShader:ie,fragmentShader:ae,transparent:!0,depthWrite:!1,blending:2}),u=new t(s,l);return u.renderOrder=3,{mesh:u,dispose(){s.dispose(),l.dispose()}}}function se(e){let t=e|0;return function(){t|=0,t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function A(e,t){let n=Math.cos(e),r=Math.sin(e),i=Math.max(t.roundness,1.001),a=Math.max(t.roundnessY??t.roundness,1.001),o=Math.max(t.roundnessBottom??t.roundnessY??t.roundness,1.001),s=r>=0?a:o,c=r>=0?t.halfHeight:t.halfHeightBottom??t.halfHeight;return[Math.sign(n)*Math.abs(n)**(2/i)*t.halfWidth,Math.sign(r)*Math.abs(r)**(2/s)*c]}function j(e,t){let n=e.length,r=[],i=[];for(let a=0;a<n;a++){let o=e[a],s=a/(n-1);for(let e=0;e<t;e++){let[n,a]=A(e/t*Math.PI*2,o);r.push(n+(o.centerX??0),a+(o.centerY??0),o.z),i.push(e/t,s)}}let a=[];for(let e=0;e<n-1;e++){let n=e*t,r=(e+1)*t;for(let e=0;e<t;e++){let i=(e+1)%t,o=n+e,s=n+i,c=r+e,l=r+i;a.push(o,s,c),a.push(s,l,c)}}let o=new p;return o.setAttribute(`position`,new s(r,3)),o.setAttribute(`uv`,new s(i,2)),o.setIndex(a),o.computeVertexNormals(),o}function M(e,t,n){let r=[e.centerX??0,e.centerY??0,e.z],i=[.5,.5];for(let n=0;n<t;n++){let a=n/t*Math.PI*2,[o,s]=A(a,e);r.push(o+(e.centerX??0),s+(e.centerY??0),e.z),i.push(.5+Math.cos(a)*.5,.5+Math.sin(a)*.5)}let a=[];for(let e=0;e<t;e++){let r=(e+1)%t;n>0?a.push(0,1+e,1+r):a.push(0,1+r,1+e)}let o=new p;return o.setAttribute(`position`,new s(r,3)),o.setAttribute(`uv`,new s(i,2)),o.setIndex(a),o.computeVertexNormals(),o}function ce(e){let t=e.length,n=e.map(e=>e[0]),r=e.map(e=>e[1]),i=[];for(let e=0;e<t-1;e++)i.push((r[e+1]-r[e])/(n[e+1]-n[e]));let a=Array(t).fill(0);a[0]=i[0],a[t-1]=i[t-2];for(let e=1;e<t-1;e++)a[e]=i[e-1]*i[e]<=0?0:(i[e-1]+i[e])/2;for(let e=0;e<t-1;e++){if(i[e]===0){a[e]=0,a[e+1]=0;continue}let t=a[e]/i[e],n=a[e+1]/i[e],r=t*t+n*n;if(r>9){let o=3/Math.sqrt(r);a[e]=o*t*i[e],a[e+1]=o*n*i[e]}}return{xs:n,ys:r,ms:a}}function le(e,t){let{xs:n,ys:r,ms:i}=e,a=n.length;if(t<=n[0])return r[0];if(t>=n[a-1])return r[a-1];let o=0;for(;o<a-2&&t>n[o+1];)o++;let s=n[o+1]-n[o],c=(t-n[o])/s,l=c*c,u=l*c,d=2*u-3*l+1,f=u-2*l+c,p=-2*u+3*l,m=u-l;return d*r[o]+f*s*i[o]+p*r[o+1]+m*s*i[o+1]}var N=new WeakMap;function P(e,t){let n=N.get(e);return n||(n=ce(e),N.set(e,n)),le(n,t)}function ue(){let e=1024,t=document.createElement(`canvas`);t.width=e,t.height=e;let n=t.getContext(`2d`);n.fillStyle=`#c9c9c9`,n.fillRect(0,0,e,e);let r=1337,i=()=>(r=r*1103515245+12345&2147483647,(r>>>0)/2147483647),a=[0];for(let t=1;t<9;t++)a.push(t/9*e+(i()-.5)*(e/9)*.3);a.push(e);let o=[0];for(let t=1;t<14;t++)o.push(t/14*e+(i()-.5)*(e/14)*.3);o.push(e),n.strokeStyle=`rgba(40,42,46,0.55)`,n.lineWidth=2;for(let t of a)n.beginPath(),n.moveTo(t,0),n.lineTo(t,e),n.stroke();for(let t of o)n.beginPath(),n.moveTo(0,t),n.lineTo(e,t),n.stroke();for(let e=0;e<14;e++)for(let t=0;t<9;t++){let r=190+Math.floor((i()-.5)*26);n.fillStyle=`rgba(${r},${r},${r+2},0.5)`,n.fillRect(a[t]+1,o[e]+1,a[t+1]-a[t]-2,o[e+1]-o[e]-2)}n.fillStyle=`rgba(60,62,66,0.5)`;for(let t=0;t<260;t++){let t=i()*e,r=i()*e;n.beginPath(),n.arc(t,r,1.4,0,Math.PI*2),n.fill()}let s=n.getImageData(0,0,e,e),c=s.data;for(let e=0;e<c.length;e+=4){let t=(i()-.5)*10;c[e]=Math.min(255,Math.max(0,c[e]+t)),c[e+1]=Math.min(255,Math.max(0,c[e+1]+t)),c[e+2]=Math.min(255,Math.max(0,c[e+2]+t))}n.putImageData(s,0,0);let l=new C(t);return l.wrapS=_,l.wrapT=_,l.colorSpace=``,l.needsUpdate=!0,l}function F(e){let t=ue(),n=t.clone();n.image=t.image,n.repeat.set(8,2),n.needsUpdate=!0;let r=t.clone();r.image=t.image,r.repeat.set(5,4),r.needsUpdate=!0;let i=new x({color:5924212,metalness:.78,roughness:.32,roughnessMap:n,envMapIntensity:.95,clearcoat:.22,clearcoatRoughness:.34}),a=new x({color:1975084,metalness:.72,roughness:.36,roughnessMap:r,envMapIntensity:.58,clearcoat:.12,clearcoatRoughness:.4}),o=new x({color:2765116,metalness:.28,roughness:.48,roughnessMap:r,envMapIntensity:.4,clearcoat:.1,clearcoatRoughness:.45}),s=new x({color:462872,metalness:.22,roughness:.06,clearcoat:1,clearcoatRoughness:.06,emissive:new c(663600),emissiveIntensity:.28,envMapIntensity:.7}),l=new x({color:2896702,metalness:.74,roughness:.34,envMapIntensity:.55,clearcoat:.14,clearcoatRoughness:.4});return e&&(i.envMap=e,a.envMap=e,o.envMap=e,s.envMap=e,l.envMap=e),{steel:i,gunmetal:a,ceramic:o,glass:s,blade:l,dispose(){i.dispose(),a.dispose(),o.dispose(),s.dispose(),l.dispose(),t.dispose(),n.dispose(),r.dispose()}}}function I(e){return new b({color:e,emissive:new c(e),emissiveIntensity:.35,roughness:.6,metalness:0})}var L=34,R=L/2,z=48,B=96,de=[[0,.14],[.08,.34],[.16,.48],[.32,.56],[.5,.58],[.7,.6],[.88,.54],[1,.48]],fe=[[0,.1],[.14,.28],[.4,.42],[.68,.5],[.88,.4],[1,.28]],pe=[[0,.08],[.14,.18],[.4,.24],[.68,.28],[1,.16]],me=[[0,3.6],[.2,4.2],[.6,3.4],[1,3.2]],he=[[0,3.8],[.3,3.2],[1,2.8]],ge=[[0,4.2],[1,3.6]];function V(e){return{halfWidth:P(de,e),halfHeight:P(fe,e),halfHeightBottom:P(pe,e),roundness:P(me,e),roundnessY:P(he,e),roundnessBottom:P(ge,e),centerX:0,centerY:0}}function _e(){let e=[];for(let t=0;t<B;t++){let n=t/(B-1),r=V(n);e.push({z:-17+n*L,...r})}let t=j(e,z),n=M(e[0],z,-1),r=M(e[B-1],z,1),i=h([t,n,r]);return t.dispose(),n.dispose(),r.dispose(),i}function H(e){return V(l.clamp((e+R)/L,0,1))}function U(e,t,n,r,i,a=20,o=8){let c=[],u=[],d=[];for(let s=0;s<=a;s++){let f=l.lerp(e,t,s/a),p=H(f);for(let e=0;e<=o;e++){let[t,m]=A(l.degToRad(l.lerp(n,r,e/o)),p),h=Math.hypot(t,m)||1,g=t/h,_=m/h;c.push(t+g*i+p.centerX,m+_*i+p.centerY,f),d.push(g,_),u.push(e/o,s/a)}}let f=o+1,m=[];for(let e=0;e<a;e++)for(let t=0;t<o;t++){let n=e*f+t,r=n+1,i=n+f,a=i+1;m.push(n,i,r,r,i,a)}let h=new p;h.setAttribute(`position`,new s(c,3)),h.setAttribute(`uv`,new s(u,2)),h.setIndex(m),h.computeVertexNormals();let g=h.getAttribute(`normal`),_=Math.floor(a/2*f+o/2);if(g.getX(_)*d[_*2]+g.getY(_)*d[_*2+1]<0){let e=h.getIndex();for(let t=0;t<e.count;t+=3){let n=e.getX(t+1);e.setX(t+1,e.getX(t+2)),e.setX(t+2,n)}e.needsUpdate=!0,h.computeVertexNormals()}return h}var W=-9.52,ve=-4.76,G=14,K=20,ye=[[0,.12],[.3,.32],[.7,.28],[1,.1]],be=[[0,.06],[.35,.26],[.7,.22],[1,.06]];function xe(){let e=[];for(let t=0;t<G;t++){let n=t/(G-1),r=W+n*(ve-W),i=H(r),a=P(be,n);e.push({z:r,centerX:0,centerY:i.centerY+i.halfHeight+a*.28,halfWidth:P(ye,n),halfHeight:a,roundness:2.6,roundnessY:2.2,roundnessBottom:3.4})}let t=j(e,K),n=M(e[0],K,-1),r=M(e[G-1],K,1),i=h([t,n,r]);return t.dispose(),n.dispose(),r.dispose(),i}function Se(e,t,n,r,i){let a=new d;a.moveTo(0,0),a.lineTo(t,0),a.lineTo(r+n,e),a.lineTo(r,e),a.closePath();let s=new o(a,{depth:i,bevelEnabled:!0,bevelThickness:i*.3,bevelSize:i*.25,bevelSegments:2});return s.translate(0,0,-i/2),s.rotateY(-Math.PI/2),s}function q(){let e=new d;e.moveTo(.12,.4),e.lineTo(3.15,2.35),e.lineTo(3.35,5.4),e.lineTo(.18,4.1),e.closePath();let t=new o(e,{depth:.82,bevelEnabled:!0,bevelThickness:.14,bevelSize:.12,bevelSegments:2});return t.translate(0,0,-.41),t.rotateX(Math.PI/2),t.computeVertexNormals(),t}function Ce(){let e=[];for(let t=0;t<40;t++){let n=t/39,r;r=n<.14?l.lerp(.32,1.02,n/.14):n<.72?l.lerp(1.02,1.14,(n-.14)/.58):l.lerp(1.14,1.08,(n-.72)/.28);let i=r*.78;e.push({z:-5.3+n*10.6,halfWidth:r,halfHeight:i,halfHeightBottom:i*.92,roundness:2.5,roundnessY:2.3,roundnessBottom:2.8})}let t=j(e,28),n=M(e[0],28,-1),r=M(e[39],28,1),i=h([t,n,r]);return t.dispose(),n.dispose(),r.dispose(),i}var J=10.6,Y=.98,we=3.4,Te=-.22;function X(e){return new y(e*3.85,-1.35,7.65)}var Z=7.48;function Ee(e){let r=F(e),a=new n;a.name=`ship-hull-normandy`;let o=[];function s(e,n){o.push(e);let r=new t(e,n);return a.add(r),r}s(_e(),r.steel);let c=-14.6;s(new S(11.8,.48,3.7),r.gunmetal).position.set(0,.16,c),s(new S(11.4,.16,3.2),r.steel).position.set(0,.44,c),s(new S(10.6,.14,2.4),r.steel).position.set(0,-.14,-14.4),s(new S(10.8,.32,.55),r.gunmetal).position.set(0,.12,c-1.95),s(new S(1.7,.36,2.4),r.steel).position.set(0,.2,-12.2);let l=s(xe(),r.glass);l.renderOrder=1,s(U(-5.5,11.5,-12,14,.014,20,5),r.ceramic),s(U(-5.5,11.5,166,194,.014,20,5),r.ceramic);let u=q(),d=q();d.scale(-1,1,1);let f=d.getIndex();if(f){for(let e=0;e<f.count;e+=3){let t=f.getX(e+1);f.setX(e+1,f.getX(e+2)),f.setX(e+2,t)}f.needsUpdate=!0}d.computeVertexNormals(),o.push(u,d);for(let e of[1,-1]){let n=new t(e===1?u:d,r.steel);n.position.set(0,Te,we),n.rotation.z=-e*.32,a.add(n)}let p=[],m=Ce();o.push(m);let h=new i(Y*.48,Y,.7,24,1,!0);h.rotateX(Math.PI/2),o.push(h);for(let e of[1,-1]){let n=X(e),i=new t(m,r.gunmetal);i.position.copy(n),a.add(i);let o=new t(h,r.steel);o.position.copy(n).add(new y(0,0,J*.5)),a.add(o),p.push(n.clone().add(new y(0,0,J*.52)))}let g=H(Z).halfHeight+.02,_=Se(2.15,1.65,.28,1.1,.07);o.push(_);for(let e of[-1,1]){let n=new t(_,r.gunmetal);n.position.set(e*.12,g,Z),n.rotation.z=-e*.08,a.add(n)}let v=new T(.045,10,8);o.push(v);let b=I(16722474),x=I(2883422),C=I(14214384),w=X(1),ee=X(-1),E=new t(v,b);E.position.copy(ee).add(new y(-.85,.2,0)),a.add(E);let D=new t(v,x);D.position.copy(w).add(new y(.85,.2,0)),a.add(D);let O=H(R),k=new t(v,C);return k.position.set(0,O.centerY+O.halfHeight*.8,17.02),k.scale.setScalar(.5),a.add(k),{group:a,nozzleAttachPoints:p,dispose(){for(let e of o)e.dispose();b.dispose(),x.dispose(),C.dispose(),r.dispose()}}}var De=`/v4/assets/ships/normandy-sr2-joshuas-cc0.glb`,Oe=28,ke=Math.PI;function Ae(e){let t=new u().setFromObject(e),r=new y;t.getCenter(r),e.position.sub(r);let i=new y;t.getSize(i);let a=new n;a.add(e),i.x>=i.y&&i.x>=i.z?a.rotation.y=Math.PI/2:i.y>i.x&&i.y>=i.z&&(a.rotation.x=Math.PI/2),a.rotation.y+=ke;let o=new u().setFromObject(a),s=new y;o.getSize(s);let c=Oe/Math.max(s.z,1e-4),l=new n;return l.name=`normandy-glb-hull`,l.add(a),l.scale.setScalar(c),{group:l,box:new u().setFromObject(l)}}function je(e){let t=e.min,n=e.max,r=(t.x+n.x)/2,i=t.y+(n.y-t.y)*.42,a=n.z-t.z,o=n.z,s=(n.x-t.x)*.36,c=(n.y-t.y)*.14,l=o-a*.04;return[new y(r+s,i-c,o),new y(r+s,i+c*.6,o),new y(r-s,i-c,o),new y(r-s,i+c*.6,o),new y(r+s*.22,i,l),new y(r-s*.22,i,l)]}function Me(e,n){let r=F(n),i=[r.steel,r.gunmetal,r.ceramic,r.glass,r.blade],a=0;return e.traverse(e=>{if(e instanceof t){let t=e.name.toLowerCase();t.includes(`glass`)||t.includes(`canopy`)||t.includes(`window`)?e.material=r.glass:t.includes(`stripe`)||t.includes(`band`)||t.includes(`ceramic`)?e.material=r.ceramic:t.includes(`engine`)||t.includes(`nozzle`)||t.includes(`dark`)?e.material=r.gunmetal:e.material=a%4==0?r.ceramic:r.steel,e.castShadow=!1,e.receiveShadow=!1,a+=1}}),i}function Ne(e,n){let{group:r,box:i}=Ae(e.scene.clone(!0)),a=Me(r,n),o=je(i),s=[];return r.traverse(e=>{e instanceof t&&s.push(e.geometry)}),{group:r,nozzleAttachPoints:o,dispose(){for(let e of s)e.dispose();for(let e of a)e.dispose()}}}async function Pe(){try{let e=await fetch(De,{method:`GET`,headers:{Range:`bytes=0-11`},cache:`force-cache`});if(!e.ok||(e.headers.get(`content-type`)??``).includes(`text/html`))return!1;let t=new Uint8Array(await e.arrayBuffer());return t.byteLength<4?!1:t[0]===103&&t[1]===108&&t[2]===84&&t[3]===70}catch{return!1}}async function Fe(e,t){if(!(typeof location<`u`&&new URLSearchParams(location.search).has(`glb`))||!await Pe())return{hull:Ee(t),source:`procedural`};try{return{hull:Ne(await new f(e).loadAsync(De),t),source:`glb`}}catch{return{hull:Ee(t),source:`procedural`}}}var Ie=.22,Le=1.35,Q=new c(2779788),Re=new c(5941448),ze=2.2,Be=12,Ve=.45,He=4.6,$=.16,Ue=.38,We=new c(15267071),Ge=new c(3061992);function Ke(){let e=new a(1,1,20,12,!0);return e.translate(0,.5,0),e.rotateX(Math.PI/2),e}var qe=`
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

  ${te}

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
`;function Ye(){let e=document.createElement(`canvas`);e.width=128,e.height=128;let t=e.getContext(`2d`),n=t.createRadialGradient(128/2,128/2,0,128/2,128/2,128/2);n.addColorStop(0,`rgba(255,255,255,1)`),n.addColorStop(.35,`rgba(150,210,255,0.65)`),n.addColorStop(1,`rgba(80,160,255,0)`),t.fillStyle=n,t.fillRect(0,0,128,128);let r=new C(e);return r.needsUpdate=!0,r}function Xe(e){let i=new n;i.name=`engine-fx`;let a=new r(.4,24),o=new b({color:1581870,emissive:Q.clone(),emissiveIntensity:Ie,metalness:.6,roughness:.3}),s=Ye(),u=new w({map:s,color:Q.clone(),transparent:!0,depthWrite:!1,blending:2,opacity:.18}),d=[],f=[],p=Ke(),h=[];e.forEach((e,n)=>{let r=new t(a,o);r.position.copy(e),r.rotation.y=Math.PI,i.add(r);let s=new m(u);s.position.copy(e).add(new y(0,0,.22)),s.scale.set(.55,.55,1),s.visible=!1,i.add(s),d.push(s);let c=new v({uniforms:{uTime:{value:0},uThrust:{value:0},uPhase:{value:n%4*17.3},uColorCore:{value:We.clone()},uColorMid:{value:Ge.clone()}},vertexShader:qe,fragmentShader:Je,transparent:!0,depthWrite:!1,side:2,blending:2}),l=new t(p,c);l.position.copy(e).add(new y(0,0,.04)),l.scale.set($,$,Ve),l.renderOrder=5,i.add(l),h.push({mesh:l,mat:c});let _=new g(Q.getHex(),ze,40,2);_.position.copy(e).add(new y(0,0,1)),i.add(_),f.push(_)});let _=new c;return{group:i,nozzleMat:o,updateThrust(e,t){let n=l.clamp(e,0,1);_.copy(Q).lerp(Re,n);let r=l.lerp(Ie,Le,n);o.emissive.copy(_),o.emissiveIntensity=r,u.color.copy(_),u.opacity=l.lerp(.18,.48,n);let i=l.lerp(1.25,2.05,n);for(let e of d)e.scale.set(i,i,1);let a=l.lerp(ze,Be,n);for(let e of f)e.color.copy(_),e.intensity=a;let s=l.lerp(Ve,He,n),c=l.lerp($,Ue,n);for(let e of h)e.mesh.visible=n>.04,e.mesh.scale.set(c,c,s),e.mat.uniforms.uTime.value=t,e.mat.uniforms.uThrust.value=n},dispose(){a.dispose(),o.dispose(),u.dispose(),s.dispose(),p.dispose();for(let e of h)e.mat.dispose()}}}var Ze=e({buildShipV2:()=>Qe});async function Qe(e,t){let{hull:r,source:i}=await Fe(e,t),a=Xe(r.nozzleAttachPoints),o=new n;return o.name=`ship-root-v2`,o.userData.hullSource=i,o.add(r.group),o.add(a.group),{group:o,updateThrust(e,t){a.updateThrust(e,t)},dispose(){r.dispose(),a.dispose()}}}export{ne as a,O as c,se as d,ee as i,k as l,Ze as n,re as o,te as r,D as s,Qe as t,oe as u};