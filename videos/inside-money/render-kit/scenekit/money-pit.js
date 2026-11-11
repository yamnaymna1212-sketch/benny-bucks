// scenekit/money-pit.js - a rectangular pit that fills with REAL $1 straps (blue ABA bands, money-kit, one-sided, 151 %).
// Real look (user 2026-11-10 "keep the money real"): the visible top is NEVER one flat textured slab - it is hundreds of separate
// straps (instanced, each slightly turned/raised, some laid crosswise), plus loose straps at angles and single bills on top.
//   const PIT=moneyPit(K,MK,{x,z,w,d,dep,denom:1});  PIT.update(t,{t0,t1})  fills between t0 and t1 (bricks rise layer by layer, straps rain in)
//   PIT.glow(k) green glow 0..1   PIT.root (group at the pit centre, y=0 = lawn level)
export function moneyPit(K,MK,{x=0,z=0,w=3.3,d=2.6,dep=1.25,denom=1,layers=11,tint=0xb7c7a2,rain=40}={}){
 const {THREE,scene,sm}=K;const root=K.group(x,0,z);
 const CASHM=new Set();const cashTint=o=>o.traverse(m=>{if(m.isMesh)for(const mt of[].concat(m.material))if(!CASHM.has(mt)){CASHM.add(mt);mt.color.setHex(tint);mt.roughness=.85;}});
 // ---- lower layers: cheap bricks (only seen while they rise) ----
 const nx=Math.max(1,Math.round(w/MK.NW)),nz=Math.max(1,Math.round(d/MK.NH));
 const hx=Math.ceil(nx/2),hz=Math.ceil(nz/2),BS=MK.size(denom,{nx:hx,ny:4,nz:hz});
 const BR=[];for(let i=0;i<layers;i++){const g=new THREE.Group();for(const [sx,sz] of[[-1,-1],[1,-1],[-1,1],[1,1]]){const b=MK.brick(denom,{nx:hx,ny:4,nz:hz});b.position.set(sx*BS.w/2,0,sz*BS.d/2);b.rotation.y=((i*3+sx+sz*2)%3-1)*.006;g.add(b);}
  cashTint(g);g.position.y=-dep+BS.h*(i+.5);g.userData.y=g.position.y;g.visible=false;root.add(g);BR.push(g);}
 const topY=-dep+BS.h*layers;
 // ---- top layer: separate straps (instanced = 6 draw calls), jittered so the eye reads "many bundles", not a pattern ----
 const S1=MK.strap(denom);cashTint(S1);const geo=S1.geometry,mats=S1.material;
 let k=0;const R=()=>{k++;const v=Math.sin(k*12.9898+x)*43758.5453;return v-Math.floor(v);};
 const cells=[];for(let i=0;i<nx;i++)for(let j=0;j<nz;j++)cells.push([-w/2+MK.NW*(i+.5),-d/2+MK.NH*(j+.5)]);
 const TOP=new THREE.InstancedMesh(geo,mats,cells.length+160);TOP.castShadow=TOP.receiveShadow=true;root.add(TOP);
 const m4=new THREE.Matrix4(),q=new THREE.Quaternion(),e=new THREE.Euler(),s1=new THREE.Vector3(1,1,1),p=new THREE.Vector3();let n=0;
 const put=(px,py,pz,rx,ry,rz)=>{q.setFromEuler(e.set(rx,ry,rz));m4.compose(p.set(px,py,pz),q,s1);TOP.setMatrixAt(n++,m4);};
 for(const [cx,cz] of cells)put(cx+(R()-.5)*.02,topY+MK.NT*(.5+R()*.25),cz+(R()-.5)*.012,(R()-.5)*.03,(R()-.5)*.09,(R()-.5)*.03);
 // second, partial layer: straps laid crosswise and at angles (a heap, not a floor)
 for(let i=0;i<160;i++){const ang=R()<.35?Math.PI/2:0;put((R()-.5)*(w-.3),topY+MK.NT*(1.5+Math.floor(R()*2)),(R()-.5)*(d-.3),(R()-.5)*.14,ang+(R()-.5)*.9,(R()-.5)*.14);}
 TOP.count=n;TOP.instanceMatrix.needsUpdate=true;TOP.visible=false;
 // single loose bills on top (face up, slightly curled)
 const NOTES=new THREE.Group();root.add(NOTES);NOTES.visible=false;
 for(let i=0;i<34;i++){const b=MK.note(denom,{curve:.012});cashTint(b);b.rotation.set(-Math.PI/2+(R()-.5)*.3,0,R()*6.28);b.position.set((R()-.5)*(w-.4),topY+MK.NT*(3.3+R()*1.5),(R()-.5)*(d-.4));NOTES.add(b);}
 // falling straps
 const RAIN=[];for(let i=0;i<rain;i++){const s=MK.strap(denom);cashTint(s);s.visible=false;scene.add(s);RAIN.push({s,x:x+(R()-.5)*(w-.3),z:z+(R()-.5)*(d-.3),u:R(),y0:3+R()*2.5,r:R()*6});}
 const GL=new THREE.PointLight(0x7dff9a,0,6,1.5);GL.position.set(0,.8,0);root.add(GL);
 const api={root,BR,TOP,NOTES,topY,size:{w,d,dep},
  glow(k,t=0){GL.intensity=2.2*k*(.6+.4*Math.cos(t*6.28));},
  // fill between t0 and t1; hide=true removes everything (before the pit exists)
  update(t,{t0,t1}){BR.forEach((b,i)=>{const a=t0+(t1-t0)*i/layers,kk=sm(a,a+.16,t);b.visible=t>=a;b.position.y=b.userData.y+.4*(1-kk);});
   const a=t0+(t1-t0)*(layers-1)/layers+.05,kk=sm(a,a+.2,t);TOP.visible=NOTES.visible=t>=a;TOP.position.y=NOTES.position.y=.35*(1-kk);
   const lvl=-dep+BS.h*layers*sm(t0,t1,t);
   for(const r of RAIN){const f=t-(t0-.25+r.u*(t1-t0)),y=r.y0-4.9*f*f;r.s.visible=f>0&&y>lvl;if(r.s.visible){r.s.position.set(r.x,y,r.z);r.s.rotation.set(r.r+f*3,r.r*2+f*5,f*2);}}},
  // remove n straps from the top (end scene: "one strap at a time")
  take(nLeft){TOP.count=Math.max(0,Math.min(n,nLeft));}};
 api.total=n;return api;}
