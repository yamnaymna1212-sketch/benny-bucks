// ================= EP11 HOOK v2 (user 2026-11-04): WIDE (house + ground cross-section + Mike digging + money) -> ZOOM -> TIGHT glowing money; same at the bank. =================
// $50,000 = 500 straps of $100 in $1 bills (real bill 156 x 66 mm, strap ~11 mm) = 5 layers of 10 x 10 straps, 1.56 m x 0.66 m.
for(const o of[...CHAIN,STK,CHEF.g,P4.g,CANG,JUG,P9.g,SAFE,TAXF,IOU,BILL50,BUB,NOZ,...KIDS.map(k=>k.g)])o.visible=false;   // EP9 story props off
for(const o of scene.children)if(o.isGroup&&((Math.abs(o.position.x+13.05)<.01&&Math.abs(o.position.z-15)<.01)||(Math.abs(o.position.x+7.4)<.01&&Math.abs(o.position.z-15.6)<.01)))o.visible=false;
POPS.forEach(m=>m.visible=false);POPS.length=0;TR.g.visible=false;
scene.traverse(o=>{if(o.isMesh&&o.geometry.parameters&&o.geometry.parameters.height===1.8&&o.geometry.parameters.width===19){const w=V3();o.getWorldPosition(w);if(w.z<-16&&w.z>-21&&Math.abs(w.x-PX)<12)o.visible=false;}});   // backyard fences between the camera and the cross-section
// ---- the ground cut open in front of the hole: grass lip + soil faces (the ground slab has a hole x PX±2.6, z CUT-8.5..PB) ----
{const soil=(w,h)=>pbr('excavated_soil_wall',Math.max(.4,w/1.6),Math.max(.4,h/1.6),0xc4936a),gr=(w,d)=>pbr('leafy_grass',Math.max(.33,w/3),Math.max(.17,d/3),0x86b84f);
 const L=2.6,D=PB-CUT,cz=(CUT+PB)/2;
 for(const s of[-1,1]){const w=L-PW/2,x=PX+s*(PW/2+w/2);add(B(w,.2,D),gr(w,D),x,-.1,cz,scene,false);add(B(w,4,D),soil(w,4),x,-2.2,cz,scene,false);}   // both sides of the hole
 add(B(PW,4+PFL+.2,D),soil(PW,3.3),PX,(-4.2+PFL)/2,cz,scene,false);                              // under the hole
 add(B(2*L,4.0,3),soil(2*L,4.0),PX,-2.2,PB+1.5,scene,false);                                      // behind the hole (its back wall)
 const FL=new THREE.PointLight(0xffe2c0,3.5,6,1.4);FL.position.set(PX-.3,.3,CUT-1.6);scene.add(FL);}   // soft fill on the cut face (no murky soil)
const MOUND=add(new THREE.SphereGeometry(.5,28,14,0,Math.PI*2,0,Math.PI/2),pbr('excavated_soil_wall',1.2,.6,0x7a5a3c),PX+1.55,-.02,PZ+.35);MOUND.scale.set(1.1,.75,.8);   // dirt pile (screen left)
// ---- money: a layer = 10 x 10 straps of $1 bills, blue ABA band ----
const LT=tex(1560,660,x=>{for(let r=0;r<10;r++)for(let c=0;c<10;c++){const X=c*156,Y=r*66;x.drawImage(NOTE.image,X+1,Y+1,154,64);x.fillStyle='#2c63c9';x.fillRect(X+66,Y+1,24,64);x.fillStyle='rgba(0,0,0,.22)';x.fillRect(X,Y+64,156,2);x.fillRect(X+154,Y,2,66);}});
const LE=tex(1560,32,x=>{x.fillStyle='#dfe3cf';x.fillRect(0,0,1560,32);for(let i=0;i<32;i+=2){x.fillStyle=`rgba(70,95,70,${.12+Math.random()*.2})`;x.fillRect(0,i,1560,1);}for(let c=0;c<10;c++){x.fillStyle='#2c63c9';x.fillRect(c*156+66,0,24,32);x.fillStyle='rgba(0,0,0,.25)';x.fillRect(c*156+154,0,2,32);}});
const LTM=new THREE.MeshStandardMaterial({map:LT,roughness:.8,emissive:0x2a8a3a,emissiveIntensity:0}),LEM=new THREE.MeshStandardMaterial({map:LE,roughness:.9,emissive:0x2a8a3a,emissiveIntensity:0});
const LG=new THREE.BoxGeometry(1.56,.011,.66);
const layer=(p=scene)=>{const m=new THREE.Mesh(LG,[LEM,LEM,LTM,LTM,LEM,LEM]);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;};
const LAY=[];for(let i=0;i<5;i++){const m=layer();m.userData.b=V3(PX,PFL+.006+i*.0115,(CUT+PB)/2+.02);LAY.push(m);}
// ---- shovel (grip at the origin, blade along local -y) ----
const SHV=new THREE.Group();scene.add(SHV);add(CY(.016,.016,1.1,10),pbr('oak_wood_planks',.2,1,0x9a7650),0,-.55,0,SHV);add(B(.2,.27,.014),M(0x6c7176,.35,.85),0,-1.2,0,SHV);add(B(.12,.035,.035),M(0x222222,.5),0,.02,0,SHV);
const DIRT=[];for(let i=0;i<10;i++){const m=add(new THREE.IcosahedronGeometry(.045+.02*Math.random(),0),pbr('excavated_soil_wall',.3,.3,0x6e5034),0,0,0);m.visible=false;DIRT.push(m);}
// ---- the bank (FIRST NATIONAL BANK at x -20, front z 18.8): short BANK sign + doors + dark lobby ----
for(const o of scene.children)if(o.isGroup&&Math.abs(o.position.x+20)<.01&&Math.abs(o.position.z-22.8)<.01)o.traverse(m=>{if(m.isMesh&&m.geometry.type==='PlaneGeometry'&&m.position.y>3.3)m.visible=false;});
{const st=tex(1024,340,x=>{x.fillStyle='#14335f';x.fillRect(0,0,1024,340);x.strokeStyle='#d4af37';x.lineWidth=16;x.strokeRect(14,14,996,312);x.fillStyle='#fff';x.font='800 210px Mont';x.textAlign='center';x.fillText('BANK',512,250);});
 const s=add(new THREE.PlaneGeometry(2.1,.7),new THREE.MeshBasicMaterial({map:st,toneMapped:false}),BKX,3.45,18.74,scene,false);s.rotation.y=Math.PI;
 add(B(2.0,2.55,.16),M(0x15110d,.9),BKX,1.27,18.72,scene,false);for(const [w,h2,x,y] of[[2.2,.12,0,2.6],[.12,2.6,-1.04,1.3],[.12,2.6,1.04,1.3]])add(B(w,h2,.2),M(0xe9e1d0,.6),BKX+x,y,18.7,scene,false);
 const VL=new THREE.PointLight(0xffd9a0,2.2,3.5,1.6);VL.position.set(BKX,1.6,19.2);scene.add(VL);}
const DOORS=[-1,1].map(sd=>{const g=new THREE.Group();g.position.set(BKX+sd*.82,0,18.6);scene.add(g);add(B(.8,2.3,.06),M(0x3a2a1a,.45,.2),-sd*.4,1.17,0,g);add(B(.06,.5,.05),M(0xd4af37,.3,1),-sd*.7,1.15,-.05,g);return {g,sd};});
const PAL=new THREE.Group();PAL.position.set(BKX-.15,0,BKZ-1.75);scene.add(PAL);{const wd=pbr('oak_wood_planks',1,1,0xb08a60);for(let i=0;i<3;i++)add(B(1.6,.08,.1),wd,0,.04,-.3+i*.3,PAL);for(let i=0;i<6;i++)add(B(.2,.03,.7),wd,-.65+i*.26,.095,0,PAL);}   // pallet next to Mike (screen right of him)
const BLAY=[];for(let i=0;i<5;i++){const m=layer();m.userData.a=V3(BKX-.15,.116+i*.0115,BKZ-1.75);BLAY.push(m);}
// ---- back of Mike's house: windows + back door + step ----
{const wt=tex(256,320,x=>{x.fillStyle='#f4f2ec';x.fillRect(0,0,256,320);x.fillStyle='#6f9fc8';x.fillRect(18,18,220,284);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(30,30,90,120);x.fillStyle='#f4f2ec';x.fillRect(122,18,12,284);x.fillRect(18,154,220,12);});
 const dt=tex(256,512,x=>{x.fillStyle='#f4f2ec';x.fillRect(0,0,256,512);x.fillStyle='#7a2e26';x.fillRect(18,18,220,494);x.fillStyle='#6f9fc8';x.fillRect(48,48,160,150);x.fillStyle='#d4af37';x.beginPath();x.arc(200,300,10,0,7);x.fill();});
 const bz=MZ-3.75-.12,wm=new THREE.MeshStandardMaterial({map:wt,roughness:.4}),dm=new THREE.MeshStandardMaterial({map:dt,roughness:.6});
 for(const [x,y] of[[MX+2.8,1.9],[MX-2.6,1.9],[MX+2.8,4.75],[MX,4.75],[MX-2.6,4.75]]){const w=add(new THREE.PlaneGeometry(1.1,1.35),wm,x,y,bz,scene,false);w.rotation.y=Math.PI;}
 const d=add(new THREE.PlaneGeometry(1.0,2.1),dm,MX+.2,1.5,bz,scene,false);d.rotation.y=Math.PI;add(B(1.6,.12,.9),pbr('concrete_pavement',1,.6),MX+.2,.4,bz-.45);}
popT('$50,000',.26,GRN,V3(PX,.75,CUT+.3),.05,tYours-.2);
popT('YOURS',.1,GRN,V3(PX,-.42,CUT-.08),tYours-.12,tPut+.05);
popT('$50,000',.16,YEL,V3(BKX+.05,2.42,BKZ-.5),tBank-.05,tTheirs-.2);
popT('THEIRS',.14,RED,V3(BKX+.05,1.62,BKZ-.4),tTheirs-.08,tMeet+.9);
