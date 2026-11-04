// ================= EP11 HOOK: "Bury $50,000 in your backyard, and it's yours. Put it in a bank, and legally, it's theirs." =================
// Real money: $50,000 = 2,500 x $20 = 25 straps of $2,000 (ABA strap colour for $20 = violet), real bill size 156 x 66 mm, strap ~11 mm.
for(const o of[...CHAIN,STK,CHEF.g,P4.g,CANG,JUG,P9.g,SAFE,TAXF,IOU,BILL50,BUB,NOZ,...KIDS.map(k=>k.g)])o.visible=false;   // EP9 story props off
for(const o of scene.children)if(o.isGroup&&((Math.abs(o.position.x+13.05)<.01&&Math.abs(o.position.z-15)<.01)||(Math.abs(o.position.x+7.4)<.01&&Math.abs(o.position.z-15.6)<.01)))o.visible=false;
POPS.forEach(m=>m.visible=false);POPS.length=0;
TR.g.visible=false;
const N20=tex(1024,436,x=>{x.drawImage(NOTE.image,0,0,1024,436);x.fillStyle='#2f5a3c';x.font='800 92px Mont';x.textAlign='center';for(const [a,b] of[[110,125],[914,125],[110,395],[914,395]])x.fillText('20',a,b);
 x.fillStyle='rgba(60,90,70,.55)';x.beginPath();x.ellipse(512,218,120,150,0,0,7);x.fill();x.fillStyle='#d9e4cf';x.beginPath();x.ellipse(512,218,100,130,0,0,7);x.fill();x.fillStyle='rgba(60,90,70,.6)';x.beginPath();x.ellipse(512,190,46,58,0,0,7);x.fill();x.fillRect(452,240,120,90);});
const VIO='#7a3fa0';
const S20T=tex(1024,436,x=>{x.drawImage(N20.image,0,0);x.fillStyle=VIO;x.fillRect(452,0,120,436);x.fillStyle='rgba(255,255,255,.9)';x.font='800 34px Mont';x.save();x.translate(512,218);x.rotate(-Math.PI/2);x.textAlign='center';x.fillText('$2,000',0,12);x.restore();});
const S20E=tex(512,64,x=>{x.fillStyle='#d9dcc8';x.fillRect(0,0,512,64);for(let i=0;i<64;i+=2){x.fillStyle=`rgba(70,90,70,${.15+Math.random()*.2})`;x.fillRect(0,i,512,1);}x.fillStyle=VIO;x.fillRect(226,0,60,64);});
const S20M=new THREE.MeshStandardMaterial({map:S20T,roughness:.85,emissive:0x1a5c2a,emissiveIntensity:.22}),S20EM=new THREE.MeshStandardMaterial({map:S20E,roughness:.9}),S20SM=new THREE.MeshStandardMaterial({color:0xd9dcc8,roughness:.9});
const SG=new THREE.BoxGeometry(.156,.011,.066);
const strap=(p=scene)=>{const m=new THREE.Mesh(SG,[S20SM,S20SM,S20M,S20M,S20EM,S20EM]);m.castShadow=true;m.receiveShadow=true;p.add(m);return m;};
// ---- the backyard hole behind Mike's house (house at MX,MZ faces the street; back wall z = MZ-3.75, fence z = MZ-9.75) ----
const HW=.98,HD=.5,HY=-.075;
{const soil=(w,d)=>pbr('excavated_soil_wall',Math.max(.3,w/1.5),Math.max(.3,d/1.5),0x8a6a4a);
 add(B(HW,.012,HD),soil(HW,HD),PX,HY-.006,PZ,scene,false);                                                  // floor
 for(const [w,d,x,z] of[[HW+.04,.02,PX,PZ-HD/2-.01],[HW+.04,.02,PX,PZ+HD/2+.01],[.02,HD,PX-HW/2-.01,PZ],[.02,HD,PX+HW/2+.01,PZ]])add(B(w,-HY+.004,d),soil(w,.3),x,HY/2+.002,z,scene,false);   // walls, inset under the grass
 const mound=add(new THREE.SphereGeometry(.42,28,14,0,Math.PI*2,0,Math.PI/2),pbr('excavated_soil_wall',1.2,.6,0x7a5a3c),PX+.05,-.02,PZ+.72);mound.scale.set(1.25,.7,.7);   // dirt pile behind the hole
 const sh=new THREE.Group();sh.position.set(PX+.38,.32,PZ+.8);sh.rotation.set(-.28,0,.18);scene.add(sh);   // shovel stuck in the pile
 add(CY(.016,.016,.95,10),pbr('oak_wood_planks',.2,1,0x9a7650),0,.25,0,sh);add(B(.2,.26,.012),M(0x6c7176,.35,.85),0,-.32,0,sh);add(B(.12,.035,.035),M(0x222222,.5),0,.74,0,sh);}
const PIT=[];for(let r=0;r<5;r++)for(let c=0;c<5;c++){const m=strap();m.userData.b=V3(PX-.34+c*.168+(Math.sin(r*7+c)*.012),HY+.007+(r+c)%2*.004,PZ-.15+r*.074);m.rotation.y=Math.sin(r*3+c*5)*.06;m.position.copy(m.userData.b);PIT.push(m);}
const DROP=PIT.slice(-5);   // the last 5 straps fall from Mike's hand on 'bury ... backyard'
// ---- the bank across Maple St (FIRST NATIONAL BANK at x -20, front z 18.8): a short readable BANK sign + doors ----
for(const o of scene.children)if(o.isGroup&&Math.abs(o.position.x+20)<.01&&Math.abs(o.position.z-22.8)<.01)o.traverse(m=>{if(m.isMesh&&m.geometry.type==='PlaneGeometry'&&m.position.y>3.3)m.visible=false;});   // long sign off (too wide for 9:16)
{const st=tex(1024,340,x=>{x.fillStyle='#14335f';x.fillRect(0,0,1024,340);x.strokeStyle='#d4af37';x.lineWidth=16;x.strokeRect(14,14,996,312);x.fillStyle='#fff';x.font='800 210px Mont';x.textAlign='center';x.fillText('BANK',512,250);});
 const s=add(new THREE.PlaneGeometry(2.1,.7),new THREE.MeshBasicMaterial({map:st,toneMapped:false}),BKX,3.45,18.74,scene,false);s.rotation.y=Math.PI;
 add(B(2.0,2.55,.16),M(0x15110d,.9),BKX,1.27,18.72,scene,false);for(const [w,h2,x,y] of[[2.2,.12,0,2.6],[.12,2.6,-1.04,1.3],[.12,2.6,1.04,1.3]])add(B(w,h2,.2),M(0xe9e1d0,.6),BKX+x,y,18.7,scene,false);const VL=new THREE.PointLight(0xffd9a0,2.2,3.5,1.6);VL.position.set(BKX,1.6,19.2);scene.add(VL);}   // dark lobby behind the open doors, warm light   // door frame
const DOORS=[-1,1].map(sd=>{const g=new THREE.Group();g.position.set(BKX+sd*.82,0,18.6);scene.add(g);const d=add(B(.8,2.3,.06),M(0x3a2a1a,.45,.2),-sd*.4,1.17,0,g);add(B(.06,.5,.05),M(0xd4af37,.3,1),-sd*.7,1.15,-.05,g);return {g,sd};});
const STACK=new THREE.Group();scene.add(STACK);for(let i=0;i<25;i++){const m=strap(STACK);m.position.set(Math.sin(i*2.1)*.004,i*.0112,0);m.rotation.y=Math.PI/2+Math.sin(i*1.7)*.03;}   // 25 straps = $50,000, one real-size stack
popT('$50,000',.13,GRN,V3(PX-.05,1.2,PZ+.25),.1,tPut+.1);
popT('YOURS',.15,GRN,V3(PX-.05,.94,PZ+.25),tYours-.12,tPut+.1);
popT('$50,000',.15,YEL,V3(BKX+.12,2.4,BKZ-.6),tBank-.05,tMeet+.9);
popT('THEIRS',.21,RED,V3(BKX+.12,2.0,BKZ-.6),tTheirs-.08,tMeet+.9);
// back of Mike's house: windows + a back door (the plain back wall looked empty behind the hole)
{const wt=tex(256,320,x=>{x.fillStyle='#f4f2ec';x.fillRect(0,0,256,320);x.fillStyle='#6f9fc8';x.fillRect(18,18,220,284);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(30,30,90,120);x.fillStyle='#f4f2ec';x.fillRect(122,18,12,284);x.fillRect(18,154,220,12);});
 const dt=tex(256,512,x=>{x.fillStyle='#f4f2ec';x.fillRect(0,0,256,512);x.fillStyle='#7a2e26';x.fillRect(18,18,220,494);x.fillStyle='#6f9fc8';x.fillRect(48,48,160,150);x.fillStyle='#d4af37';x.beginPath();x.arc(200,300,10,0,7);x.fill();});
 const bz=MZ-3.75-.12,wm=new THREE.MeshStandardMaterial({map:wt,roughness:.4}),dm=new THREE.MeshStandardMaterial({map:dt,roughness:.6});
 for(const [x,y] of[[MX+2.8,1.9],[MX-2.6,1.9],[MX+2.8,4.75],[MX,4.75],[MX-2.6,4.75]]){const w=add(new THREE.PlaneGeometry(1.1,1.35),wm,x,y,bz,scene,false);w.rotation.y=Math.PI;}
 const d=add(new THREE.PlaneGeometry(1.0,2.1),dm,MX+.2,1.5,bz,scene,false);d.rotation.y=Math.PI;
 add(B(1.6,.12,.9),pbr('concrete_pavement',1,.6),MX+.2,.4,bz-.45);}
