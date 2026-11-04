// money-kit.js — REAL US notes for every Inside Money episode (NEXT_LEVEL_PLAN stage 2, 2026-11-04).
// Fronts = official uscurrency.gov images ($100 2013-present, $20 2003-present, $1 1963-present, with their SPECIMEN overprint), see money/SOURCES.md.
// Legal frame (18 U.S.C. 504 + 31 CFR 411, not legal advice): colour illustration only ONE-SIDED (backs are blank paper here) and
// linear size > 150 % of a real note -> every note/strap/brick is built at SCALE 1.51. Never scale a money mesh down below 1.
//
// Use:  import {moneyKit} from './money-kit.js';  const MK=await moneyKit(THREE);
//   MK.note(100,{curve:.01})       one bill (Group: front mesh + blank back), lies in the XY plane facing +z, long side = x
//   MK.fan(100,5,{spread:.5})      a hand fan of bills (pivot = held end at the origin), for bone finger3-1R
//   MK.strap(100,{glow:.25})       one 100-note strap (box), lies flat (y up), long side = x, portrait reads upright from the -z side (camera looking +z)
//   MK.brick(100,{nx:1,ny:6,nz:3}) a block of straps in ONE box (nx along x, ny layers, nz along z) - cheap for pallets / flying stacks
//   MK.size(100,{nx,ny,nz})        -> {w,h,d} of that brick;  MK.NW / MK.NH / MK.NT = one note width / height / strap thickness
//   MK.flutter(noteGroup,t,seed)   bends + spins a flying single bill
// Strap colours = American Bankers Association standard: 100 x $1 = $100 red, 100 x $20 = $2,000 violet, 100 x $100 = $10,000 mustard.
export async function moneyKit(THREE,{base=new URL('./money/',import.meta.url).href,scale=1.51,aniso=8}={}){
  if(scale<=1.5)throw new Error('money-kit: scale must stay > 1.5 (18 USC 504)');
  const NW=.156*scale,NH=.0663*scale,NT=.0109*scale;   // real note 156 x 66.3 mm, 100 notes = 10.9 mm
  const DEN={100:{f:'note100.jpg',band:'#b98f26',ink:'#4a3a12',txt:'$10,000',edge:[158,172,146]},
             20:{f:'note20.jpg',band:'#7d4fa6',ink:'#f3ecff',txt:'$2,000',edge:[160,174,150]},
              1:{f:'note1.jpg',band:'#c42a3a',ink:'#fff3f3',txt:'$100',edge:[166,176,156]}};
  const img=f=>new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=()=>no(new Error('money-kit: missing '+base+f));i.src=base+f;});
  for(const k in DEN)DEN[k].im=await img(DEN[k].f);
  const cv=(w,h,f)=>{const c=document.createElement('canvas');c.width=w;c.height=h;f(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=aniso;return t;};
  const rnd=(s=>()=>(s=(s*16807)%2147483647)/2147483647)(7);
  // ---- painters (all work in a w x h box) ----
  const paper=(x,w,h,rgb=[214,220,203])=>{x.fillStyle=`rgb(${rgb})`;x.fillRect(0,0,w,h);for(let i=0;i<w*h/90;i++){const a=.03+rnd()*.05;x.fillStyle=rnd()<.5?`rgba(255,255,255,${a})`:`rgba(60,80,50,${a})`;x.fillRect(rnd()*w,rnd()*h,1+rnd()*3,1);}};
  const face=(x,d,X,Y,w,h)=>{x.save();x.fillStyle='#e6e9dc';x.fillRect(X,Y,w,h);const m=Math.round(h*.022);x.drawImage(DEN[d].im,X+m,Y+m,w-2*m,h-2*m);
    const g=x.createRadialGradient(X+w*.5,Y+h*.5,h*.3,X+w*.5,Y+h*.5,w*.62);g.addColorStop(0,'rgba(255,250,235,0)');g.addColorStop(1,'rgba(90,85,60,.16)');x.fillStyle=g;x.fillRect(X,Y,w,h);x.restore();};   // paper margin + soft wear at the corners
  const band=(x,d,X,Y,w,h,label=true)=>{const D=DEN[d],bw=w*.2,bx=X+w*.5-bw/2;x.save();x.fillStyle='rgba(0,0,0,.28)';x.fillRect(bx-3,Y,bw+6,h);x.fillStyle=D.band;x.fillRect(bx,Y,bw,h);
    const g=x.createLinearGradient(bx,0,bx+bw,0);g.addColorStop(0,'rgba(0,0,0,.18)');g.addColorStop(.25,'rgba(255,255,255,.14)');g.addColorStop(.75,'rgba(255,255,255,.04)');g.addColorStop(1,'rgba(0,0,0,.2)');x.fillStyle=g;x.fillRect(bx,Y,bw,h);
    if(label&&h>40){x.fillStyle=D.ink;x.font=`800 ${Math.round(bw*.34)}px Mont, Arial, sans-serif`;x.textAlign='center';x.textBaseline='middle';x.translate(bx+bw/2,Y+h/2);x.rotate(-Math.PI/2);x.fillText(D.txt,0,0);
      x.fillRect(-h*.38,-bw*.36,h*.76,Math.max(1,bw*.03));x.fillRect(-h*.38,bw*.33,h*.76,Math.max(1,bw*.03));}x.restore();};
  const edges=(x,d,X,Y,w,h,n)=>{const c=DEN[d].edge;x.fillStyle=`rgb(${c})`;x.fillRect(X,Y,w,h);const lines=n*100;   // stacked paper edges: one hair line per note, slight waves
    for(let i=0;i<lines;i+=1){const yy=Y+h*i/lines,l=(rnd()-.5)*46;x.fillStyle=`rgb(${c.map(v=>Math.max(0,Math.min(255,v+l)))})`;x.fillRect(X,yy,w,Math.max(1,h/lines*.7));}
    for(let s=0;s<n;s++){const y0=Y+h*s/n,sh=h/n,g=x.createLinearGradient(0,y0,0,y0+sh);   // each strap bulges: light middle, dark seam between straps
      g.addColorStop(0,'rgba(20,30,15,.45)');g.addColorStop(.12,'rgba(255,255,255,.10)');g.addColorStop(.5,'rgba(255,255,255,.04)');g.addColorStop(.88,'rgba(0,0,0,.10)');g.addColorStop(1,'rgba(20,30,15,.55)');
      x.fillStyle=g;x.fillRect(X,y0,w,sh);x.fillStyle='rgba(15,22,10,.6)';x.fillRect(X,y0+sh-Math.max(2,sh*.05),w,Math.max(2,sh*.05));}};
  // ---- materials (cached by key) ----
  const cache={},mat=(t,o={})=>new THREE.MeshStandardMaterial({map:t,roughness:o.r??.82,metalness:0,...(o.glow?{emissive:0xffffff,emissiveMap:t,emissiveIntensity:o.glow}:{})});
  const BACK=cv(512,218,(x,w,h)=>paper(x,w,h));   // ONE-SIDED: the back is blank paper, never the printed back
  const FRONT={};for(const d in DEN)FRONT[d]=cv(1024,435,(x,w,h)=>face(x,d,0,0,w,h));
  function brickMats(d,nx,ny,nz,glow=0){const key=[d,nx,ny,nz,glow].join();if(cache[key])return cache[key];
    const PW=Math.min(512,Math.round(2048/Math.max(nx,nz))),PH=Math.round(PW*NH/NW),EH=Math.max(24,Math.round(PW*NT/NW*1.6));
    const top=cv(PW*nx,PH*nz,x=>{for(let i=0;i<nx;i++)for(let k=0;k<nz;k++){face(x,d,i*PW,k*PH,PW,PH);band(x,d,i*PW,k*PH,PW,PH);x.fillStyle='rgba(0,0,0,.22)';x.fillRect(i*PW,k*PH+PH-2,PW,2);x.fillRect(i*PW+PW-2,k*PH,2,PH);}});
    top.center.set(.5,.5);top.rotation=Math.PI;   // portraits read upright for a camera on the -z side looking +z (the usual set-up)
    const bot=cv(PW*nx,PH*nz,(x,w,h)=>{paper(x,w,h);for(let i=0;i<nx;i++)for(let k=0;k<nz;k++)band(x,d,i*PW,k*PH,PW,PH,false);});
    const lng=cv(PW*nx,EH*ny,x=>{for(let i=0;i<nx;i++){edges(x,d,i*PW,0,PW,EH*ny,ny);for(let j=0;j<ny;j++)band(x,d,i*PW,j*EH,PW,EH,false);}});   // long faces (+-z): band wraps here
    const sht=cv(Math.round(PH*nz),EH*ny,x=>{for(let k=0;k<nz;k++)edges(x,d,k*PH,0,PH,EH*ny,ny);});                                           // short faces (+-x): bare edges
    const o={glow};return cache[key]=[mat(sht),mat(sht),mat(top,{...o,r:.78}),mat(bot),mat(lng),mat(lng)];}
  const size=(d,{nx=1,ny=1,nz=1}={})=>({w:NW*nx,h:NT*ny,d:NH*nz});
  function brick(d=100,{nx=1,ny=1,nz=1,glow=0,shadow=true}={}){const s=size(d,{nx,ny,nz});const m=new THREE.Mesh(new THREE.BoxGeometry(s.w,s.h,s.d),brickMats(d,nx,ny,nz,glow));m.castShadow=m.receiveShadow=shadow;m.userData.money={d,nx,ny,nz};return m;}
  const strap=(d=100,o={})=>brick(d,{...o,nx:1,ny:1,nz:1});
  // ---- single bills ----
  const NG=new THREE.PlaneGeometry(NW,NH,16,2);
  function note(d=100,{curve=0,glow=0}={}){const g=new THREE.Group(),geo=NG.clone();
    const f=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:FRONT[d],roughness:.8,side:THREE.FrontSide,...(glow?{emissive:0xffffff,emissiveMap:FRONT[d],emissiveIntensity:glow}:{})}));
    const b=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({map:BACK,roughness:.85,side:THREE.BackSide}));f.castShadow=b.castShadow=true;g.add(f,b);g.userData.money={d,geo,base:NG.attributes.position.array.slice()};bend(g,curve);return g;}
  function bend(g,c=0,tw=0){const u=g.userData.money,p=u.geo.attributes.position;for(let i=0;i<p.count;i++){const x=u.base[i*3],y=u.base[i*3+1],k=x/(NW/2);p.setZ(i,c*k*k+tw*k*(y/(NH/2)));}p.needsUpdate=true;u.geo.computeVertexNormals();}
  function fan(d=100,n=5,{spread=.55,curve=.006,glow=0}={}){const g=new THREE.Group();for(let i=0;i<n;i++){const b=note(d,{curve,glow}),piv=new THREE.Group();b.position.x=NW*.42;piv.add(b);piv.rotation.z=(i/(Math.max(1,n-1))-.5)*spread;piv.position.z=i*.0006;g.add(piv);}return g;}
  function flutter(g,t,seed=0){bend(g,.012*Math.sin(t*9+seed*3),.01*Math.sin(t*6.3+seed));}
  return {NW,NH,NT,SCALE:scale,DEN,FRONT,BACK,note,fan,strap,brick,size,bend,flutter,brickMats};
}
