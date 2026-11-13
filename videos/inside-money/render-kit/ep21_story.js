// EP21 story (after the hook): the base grows to the RIGHT inside one earth cross-section (front face z=0).
// Tunnels are cutaway cavities drawn on the front face (dark red) and revealed while they are dug (clipping planes);
// characters inside tunnels stand/crawl at z~.35 in front of the cavity (side-on "ant farm" read, like the reference).
export async function story(C){
const {THREE,K,scene,cam,T,mike,SW,boneW,RAIN,WATER,DROPS,SHOV,CLODS,HOLE,SH,FL,model}=C;
const {add,B,CY,M,sm,pop,win,AD,V3}=K;
const ZC=.012,ZI=.18;     // cavity plane z, actor z inside tunnels
// ---------------- times ----------------
const tSide=T('so you dig sideways'),tRuns=T('runs right back'),tThis1=T('this is your tunnel'),tFinds=T('swat finds'),tDrops=T('drops a flashbang'),tSo2=T('so you make'),
 tFlash=T('flash hits'),tPump=T('pump tear gas'),tDip=T('so you dip'),tCant=T('cant get through'),tThis2=T('this is your water'),tCrawl=T('crawl in with'),tFake=T('dig a fake'),
 tBack=T('crawl right back'),tThis3=T('this is your maze'),tDrone=T('fly a drone'),tCover=T('cover every'),tSees=T('sees nothing'),tThis4=T('this is your camouflage'),
 tDogs=T('their dogs'),tRub=T('rub every'),tSmell=T('smell nothing'),tSooner=T('but sooner'),tRiver=T('so you dig one'),tNot=T('and that entrance'),tSearch=T('they search'),
 tNobody=T('nobody searches'),tAdd=T('add a hammock'),tLantern=T('a lantern'),tRacc=T('raccoon'),tSnack=T('stealing your'),tCongr=T('congratulations'),tBuilt=T('you built'),
 tWould=T('would swat'),tYes=T('comment yes'),END=60.9;
// ---------------- cavity helpers ----------------
const CAV=0x7e2c17,CAVD=0x561c0c,LIP=0xa8462a;
const clipX=()=>new THREE.Plane(V3(-1,0,0),-999);          // visible x <= c  (set .constant)
const mat=(c,pl)=>new THREE.MeshStandardMaterial({color:c,roughness:.95,clippingPlanes:pl?[pl]:null});
// band between floor polyline + y0 and + y1 (vertical offsets)
function band(pts,y0,y1,m,z){const s=new THREE.Shape();pts.forEach((p,i)=>i?s.lineTo(p[0],p[1]+y1):s.moveTo(p[0],p[1]+y1));for(let i=pts.length-1;i>=0;i--)s.lineTo(pts[i][0],pts[i][1]+y0);
 return add(new THREE.ShapeGeometry(s),m,0,0,z,scene,false);}
function corridor(pts,h,pl){band(pts,0,h,mat(CAV,pl),ZC);band(pts,h-.13,h,mat(CAVD,pl),ZC+.002);band(pts,0,.07,mat(LIP,pl),ZC+.002);}
function rect(x0,y0,x1,y1,pl,c=CAV){const s=new THREE.Shape([V3(x0,y0),V3(x1,y0),V3(x1,y1),V3(x0,y1)].map(v=>new THREE.Vector2(v.x,v.y)));return add(new THREE.ShapeGeometry(s),mat(c,pl),0,0,ZC,scene,false);}
// ---------------- layout ----------------
const MAIN=[[.75,-2.15],[4.6,-1.87],[5.6,-1.87],[7.4,-3.1],[9.0,-3.1],[10.4,-4.7],[12.0,-4.7],[13.4,-3.1],[14.6,-3.1],[15.1,-3.6]];
const fy=(P,x)=>{for(let i=0;i<P.length-1;i++)if(x<=P[i+1][0]){const a=P[i],b=P[i+1],u=(x-a[0])/(b[0]-a[0]);return a[1]+(b[1]-a[1])*Math.max(0,u);}return P[P.length-1][1];};
const slope=(P,x)=>{const d=.15;return Math.atan2(fy(P,x+d)-fy(P,x-d),2*d);};
const PL1=clipX(),PL2=clipX(),PL3=clipX(),PLR=clipX(),PLRT=clipX();
corridor(MAIN.slice(0,2),1.25,PL1);corridor(MAIN.slice(1,5),1.25,PL2);corridor(MAIN.slice(4,10),1.25,PL3);
const ROOM={x0:15.0,x1:19.5,y0:-3.6,y1:-1.2};rect(ROOM.x0,ROOM.y0,ROOM.x1,ROOM.y1,PLR);rect(ROOM.x0,ROOM.y1-.16,ROOM.x1,ROOM.y1,PLR,CAVD);rect(ROOM.x0,ROOM.y0,ROOM.x1,ROOM.y0+.08,PLR,LIP);
const RT=[[19.4,-3.6],[21.5,-3.6],[23.7,-2.25]];corridor(RT,1.25,PLRT);
// maze ring (centre (3.2,-4.1), r 1.15, 0.9 wide) + shaft from T1 + link to the exit shaft that reaches the surface at x -2.0 (left of the hole)
const RC={x:3.2,y:-4.1,r:1.15};const RINGM=[mat(CAV),mat(CAVD)];let RING=null,RINGD=null;
const ringGeo=L=>new THREE.RingGeometry(RC.r-.45,RC.r+.45,64,1,Math.PI/2-L,L);
const PLS=new THREE.Plane(V3(0,1,0),99),PLK=clipX(),PLE=new THREE.Plane(V3(0,-1,0),-99);   // shaft down (y >= c), link (x >= c), exit up (y <= c)
const shaftM=mat(CAV,PLS);add(new THREE.ShapeGeometry(new THREE.Shape([[2.8,-2.75],[3.6,-2.75],[3.6,-1.95],[2.8,-1.95]].map(p=>new THREE.Vector2(...p)))),shaftM,0,0,ZC,scene,false);
const linkM=new THREE.MeshStandardMaterial({color:CAV,roughness:.95,clippingPlanes:[new THREE.Plane(V3(1,0,0),99)]});const PLK2=linkM.clippingPlanes[0];
add(new THREE.ShapeGeometry(new THREE.Shape([[-2.4,-4.55],[2.2,-4.55],[2.2,-3.65],[-2.4,-3.65]].map(p=>new THREE.Vector2(...p)))),linkM,0,0,ZC,scene,false);
const exitM=new THREE.MeshStandardMaterial({color:CAV,roughness:.95,clippingPlanes:[PLE]});
add(new THREE.ShapeGeometry(new THREE.Shape([[-2.4,-4.55],[-1.6,-4.55],[-1.6,.02],[-2.4,.02]].map(p=>new THREE.Vector2(...p)))),exitM,0,0,ZC,scene,false);
const EXITHOLE=add(B(.8,.07,.8),M(0x2a1208,1),-2.0,.035,-.38,scene,false);EXITHOLE.visible=false;
// air pipes from the room ceiling to the surface (PVC, front of the cut face) + vent caps
const PIPES=[16.2,18.6].map(x=>{const g=K.group(x,0,0);add(CY(.07,.07,1.55,14),M(0xc9ccd0,.45,.1),0,-.45,.12,g);add(CY(.12,.12,.08,16),M(0x9ea3a8,.4,.3),0,.33,.12,g);
 const sap=add(CY(.075,.075,1,14),new THREE.MeshStandardMaterial({color:0xd98a1a,emissive:0xb06000,emissiveIntensity:.6,roughness:.3,transparent:true,opacity:.9}),0,-1.2,.13,g,false);sap.visible=false;
 const blob=add(new THREE.SphereGeometry(.13,16,10),new THREE.MeshStandardMaterial({color:0xe39a22,emissive:0xc06a00,emissiveIntensity:.8,roughness:.2}),0,.39,.12,g,false);blob.visible=false;g.visible=false;
 const cav=rect(x-.13,ROOM.y1-.02,x+.13,-.05,null);cav.visible=false;return {g,sap,blob,x,cav};});
// river (right): front cross-section of the water + surface strip, banks
const RV={x0:22.0,x1:27.0,b0:22.9,b1:26.1,bed:-2.0};
{const s=new THREE.Shape([[RV.x0,.075],[RV.x1,.075],[RV.b1,RV.bed],[RV.b0,RV.bed]].map(p=>new THREE.Vector2(...p)));
 add(new THREE.ShapeGeometry(s),new THREE.MeshStandardMaterial({color:0x3f86a8,roughness:.15,transparent:true,opacity:.92}),0,0,.02,scene,false);
 const top=add(new THREE.PlaneGeometry(RV.x1-RV.x0,60),new THREE.MeshStandardMaterial({color:0x4a95b8,roughness:.08,metalness:.1}),(RV.x0+RV.x1)/2,.078,-30,scene,false);top.rotation.x=-Math.PI/2;
 for(const x of[RV.x0,RV.x1]){const b=add(B(.35,.14,60),M(0x6b4a2e,1),x,.07,-30,scene,false);}
 const bed=add(B(RV.b1-RV.b0,.06,.02),M(0x5a3a22,1),(RV.b0+RV.b1)/2,RV.bed,.025,scene,false);}
// glowing ring around the river-bottom entrance (twist beat)
const EGLOW=add(new THREE.TorusGeometry(.62,.05,10,40),new THREE.MeshBasicMaterial({color:0xffd21a,toneMapped:false}),23.3,-1.75,.05,scene,false);EGLOW.visible=false;
// more pines toward the right (dog / river / search beats)
const PTR=M(0x6b4a2e,.9),PN=[M(0x2f6b3a,.85),M(0x3a7d43,.85),M(0x285c34,.85)];let sd=7;const R=()=>(sd=(sd*16807)%2147483647)/2147483647;
function pine(x,z,h){const g=K.group(x,0,z);const tk=add(CY(.12,.2,1,8),PTR,0,h*.2,0,g);tk.scale.y=h*.4;const c=PN[Math.floor(R()*3)];
 for(let k=0;k<4;k++){const r=h*(.3-.06*k),m=add(new THREE.ConeGeometry(1,1.6,9,1),c,0,h*(.3+.17*k),0,g);m.scale.set(r,h*.17,r);m.rotation.y=R()*3;}}
for(let i=0;i<70;i++){const x=9+R()*26,z=-3-R()*30;if(x>RV.x0-1.4&&x<RV.x1+1.4)continue;pine(x,z,5+R()*6);}
// ---------------- props ----------------
// flashbang + gas canister/hose
const CAN=add(CY(.1,.1,.26,16),M(0x56682e,.45,.3),0,-50,0,scene);
const FLASH=add(new THREE.SphereGeometry(1,24,16),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.9,toneMapped:false}),7.5,-2.75,.5,scene,false);FLASH.visible=false;
const FLL=new THREE.PointLight(0xffffff,0,12,1.2);FLL.position.set(7.5,-2.6,1.2);scene.add(FLL);
const TANK=add(CY(.12,.12,.55,16),M(0x7a8a3a,.5,.3),0,-50,0,scene);
const HOSE=add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(.35,.45,-1.6),V3(.25,.1,-1.3),V3(.1,-.8,-.9),V3(0,-1.7,-.7)]),24,.03,8),M(0x1d1d1d,.6),0,0,0,scene);HOSE.visible=false;
const GASM=new THREE.SpriteMaterial({map:K.tex(128,128,(x,w,h)=>{const g=x.createRadialGradient(64,64,4,64,64,62);g.addColorStop(0,'rgba(185,215,80,.9)');g.addColorStop(1,'rgba(185,215,80,0)');x.fillStyle=g;x.fillRect(0,0,w,h);}),transparent:true,depthWrite:false,opacity:.75});
const GAS=[...Array(70)].map((_,i)=>{const s=new THREE.Sprite(GASM);s.scale.setScalar(.6);s.visible=false;scene.add(s);return {s,o:((i*0.618)%1),j:i};});
const GASP=[[0,-1.0,-.7],[.3,-1.75,-.4],[.95,-1.65,.3],[4.6,-1.38,.3],[5.6,-1.38,.3],[7.4,-2.6,.3],[8.9,-2.62,.3],[9.45,-3.0,.3]];
const along=(P,u)=>{let L=0;const seg=[];for(let i=0;i<P.length-1;i++){const d=Math.hypot(P[i+1][0]-P[i][0],P[i+1][1]-P[i][1],P[i+1][2]-P[i][2]);seg.push(d);L+=d;}let s=u*L;
 for(let i=0;i<seg.length;i++){if(s<=seg[i]||i===seg.length-1){const k=Math.min(1,s/seg[i]);return V3(P[i][0]+(P[i+1][0]-P[i][0])*k,P[i][1]+(P[i+1][1]-P[i][1])*k,P[i][2]+(P[i+1][2]-P[i][2])*k);}s-=seg[i];}};
// water trap: water inside the U only up to y -3.45 (exact polygon of cavity under the level)
const WT=new THREE.Shape([[9.175,-3.3],[10.4,-4.7],[12.0,-4.7],[13.225,-3.3],[12.131,-3.3],[12.0,-3.45],[10.4,-3.45],[10.269,-3.3]].map(p=>new THREE.Vector2(...p)));
const WTRAP=add(new THREE.ShapeGeometry(WT),new THREE.MeshStandardMaterial({color:0x4f93a8,roughness:.6,transparent:true,opacity:.88}),0,0,ZC+.01,scene,false);WTRAP.visible=false;
// ferns lid over the hole
const LID=K.group(0,-60,-.75);{const l=add(new THREE.PlaneGeometry(1.7,1.7),M(0x3f7d34,.9),0,0,0,LID);l.rotation.x=-Math.PI/2;
 for(const [x,z,h] of[[-.45,-.4,.55],[.4,-.35,.6],[-.3,.45,.5],[.45,.4,.55],[0,0,.65]])model('shrub_02',x,0,z,h,x*3,LID);}
// drone
const DRONE=K.group(-8,4,-1.2);{add(K.RB(.42,.12,.42,.04),M(0x22252a,.4,.3),0,0,0,DRONE);DRONE.userData.rot=[];
 for(const [x,z] of[[-.32,-.32],[.32,-.32],[-.32,.32],[.32,.32]]){add(B(.06,.04,.06),M(0x22252a,.4),x,.04,z,DRONE);const r=add(new THREE.CylinderGeometry(.2,.2,.01,20),new THREE.MeshBasicMaterial({color:0x9aa0a6,transparent:true,opacity:.45}),x,.08,z,DRONE,false);DRONE.userData.rot.push(r);
  const arm=add(B(.36,.03,.04),M(0x22252a,.4),x/2,.02,z/2,DRONE);arm.rotation.y=Math.atan2(z,x)*-1;}
 add(new THREE.SphereGeometry(.035,8,6),new THREE.MeshBasicMaterial({color:0xff2020,toneMapped:false}),-.2,-.04,.22,DRONE,false);add(new THREE.SphereGeometry(.035,8,6),new THREE.MeshBasicMaterial({color:0x20ff40,toneMapped:false}),.2,-.04,.22,DRONE,false);
 const cone=add(new THREE.ConeGeometry(1.6,4.2,32,1,true),new THREE.MeshBasicMaterial({color:0x6dff7a,transparent:true,opacity:.16,depthWrite:false,side:THREE.DoubleSide,toneMapped:false}),0,-2.1,0,DRONE,false);DRONE.userData.cone=cone;}
DRONE.visible=false;
// police dogs (procedural German shepherds, facing +z locally)
function dog(){const g=K.group(0,-50,0),tan=M(0xb27a3e,.8),blk=M(0x1e1a16,.8);
 add(K.RB(.3,.3,.78,.1),tan,0,.55,0,g);add(K.RB(.31,.12,.5,.05),blk,0,.7,-.05,g);
 const head=K.group(0,.72,.4,g);add(K.RB(.22,.22,.26,.07),tan,0,.06,0,head);add(K.RB(.13,.11,.2,.04),blk,0,.0,.2,head);add(new THREE.SphereGeometry(.03,8,6),M(0x0a0a0a,.3),0,.04,.31,head);
 for(const s of[-1,1]){const e=add(new THREE.ConeGeometry(.05,.14,8),blk,s*.07,.22,-.02,head);}
 const legs=[[-.1,.3],[.1,.3],[-.1,-.3],[.1,-.3]].map(([x,z])=>{const p=K.group(x,.45,z,g);add(CY(.035,.03,.45,8),tan,0,-.22,0,p);return p;});
 const tail=K.group(0,.62,-.38,g);add(CY(.03,.015,.4,8),tan,0,-.18,0,tail).rotation.x=0;tail.rotation.x=-2.4;
 return {g,head,legs,tail};}
const DOGS=[dog(),dog()];
function dogPose(d,x,z,ry,t,walk,sniff){d.g.position.set(x,0,z);d.g.rotation.y=ry;const ph=t*9;d.legs.forEach((l,i)=>l.rotation.x=walk*.55*Math.sin(ph+(i%2?Math.PI:0)+(i>1?Math.PI/2:0)));
 d.head.rotation.x=sniff*(.75+.12*Math.sin(t*22));d.head.position.y=.72-.18*sniff;d.tail.rotation.z=.35*Math.sin(t*10);}
// room: hammock, lantern, crate + chips, raccoon
const HAM=K.group(0,0,ZI+.05);{add(CY(.06,.06,1.5,10),M(0x7a5a3a,.8),15.55,-2.85,0,HAM);add(CY(.06,.06,1.5,10),M(0x7a5a3a,.8),18.45,-2.85,0,HAM);
 const curve=new THREE.QuadraticBezierCurve3(V3(15.6,-2.45,0),V3(17.0,-3.55,0),V3(18.4,-2.45,0));
 const ht=K.tex(256,32,(x,w,h)=>{for(let i=0;i<8;i++){x.fillStyle=['#e94f3d','#f2c14e','#2f8fb3','#f5ead0'][i%4];x.fillRect(i*32,0,32,h);}});ht.wrapS=THREE.RepeatWrapping;
 const tube=add(new THREE.TubeGeometry(curve,40,.12,10),new THREE.MeshStandardMaterial({map:ht,roughness:.8}),0,0,0,HAM);tube.scale.z=2.2;}
HAM.scale.setScalar(.001);
const LAMP=K.group(19.05,-1.2,ZI);{add(CY(.008,.008,.5,6),M(0x333333,.5,.6),0,-.25,0,LAMP);add(K.RB(.18,.26,.18,.03),M(0x2a2a2a,.4,.6),0,-.6,0,LAMP);
 add(CY(.07,.07,.18,12),new THREE.MeshBasicMaterial({color:0xffc56b,toneMapped:false}),0,-.6,0,LAMP,false);}
const LL=new THREE.PointLight(0xffb867,0,7,1.3);LL.position.set(18.6,-2.0,1.0);scene.add(LL);LAMP.scale.setScalar(.001);
const CRATE=add(K.RB(.55,.45,.45,.03),K.pbr('wood_planks',1,1,0xb08a5a),19.0,-3.37,ZI,scene);
const CHIPS=add(K.RB(.26,.32,.08,.03),new THREE.MeshStandardMaterial({map:K.tex(128,160,(x,w,h)=>{x.fillStyle='#ffcf1f';x.fillRect(0,0,w,h);x.fillStyle='#d92b2b';x.fillRect(0,50,w,52);x.fillStyle='#fff';x.font='800 34px Mont';x.textAlign='center';x.fillText('CHIPS',64,90);}),roughness:.5}),19.0,-2.98,ZI+.05,scene);
const RAC=K.group(21,-3.6,ZI+.1);{const gr=M(0x5d5d58,.85),dk=M(0x2a2a2a,.8),wh=M(0xe8e6df,.8);
 const b=add(new THREE.SphereGeometry(.2,16,12),gr,0,.2,0,RAC);b.scale.set(1.5,.95,1);const hd=K.group(.3,.3,0,RAC);add(new THREE.SphereGeometry(.12,14,10),gr,0,0,0,hd);
 add(B(.1,.06,.25),dk,.04,.02,0,hd);add(new THREE.SphereGeometry(.035,8,6),wh,.06,.05,.09,hd);add(new THREE.SphereGeometry(.035,8,6),wh,.06,.05,-.09,hd);add(new THREE.SphereGeometry(.025,8,6),dk,.14,-.01,0,hd);
 for(const s of[-1,1])add(new THREE.ConeGeometry(.04,.08,6),gr,-.02,.12,s*.07,hd);
 const tail=K.group(-.28,.22,0,RAC);for(let i=0;i<5;i++){const c=add(CY(.06,.06,.07,10),i%2?dk:gr,-.07*i,.03*i,0,tail);c.rotation.z=Math.PI/2+.4;}
 RAC.userData.legs=[[-.15,.1],[.15,.1],[-.15,-.1],[.15,-.1]].map(([x,z])=>{const p=K.group(x,.12,z,RAC);add(CY(.03,.03,.14,6),dk,0,-.07,0,p);return p;});RAC.userData.hd=hd;}
RAC.visible=false;
// ---------------- screen-fixed 3D labels (yellow = the named part; green YES / red NO) ----------------
const TX=(s,c)=>{const m=K.txt3(s,.2,c,{ei:0});m.material=[new THREE.MeshBasicMaterial({color:c,toneMapped:false}),new THREE.MeshBasicMaterial({color:new THREE.Color(c).multiplyScalar(.35),toneMapped:false})];m.visible=false;
 m.geometry.computeBoundingBox();const bb=m.geometry.boundingBox,w=bb.max.x-bb.min.x+.2,h=.36;K.add(K.RB(w,h,.03,.06),new THREE.MeshBasicMaterial({color:0x0b0b0e,transparent:true,opacity:.75,toneMapped:false}),0,0,-.07,m,false);m.userData.h=h;m.userData.w=w;return m;};
const _f=V3(),_u=V3(),_r=V3();
function SHOWS(m,t,t0,t1,xs,ys,hf){const a=pop(t,t0,.3)*(t1?1-sm(t1,t1+.2,t):1);m.visible=a>.01;if(!m.visible)return;const D=1.4,Hh=2*D*Math.tan(cam.fov*Math.PI/360),Ww=Hh*cam.aspect;
 cam.getWorldDirection(_f);_u.set(0,1,0).applyQuaternion(cam.quaternion);_r.set(1,0,0).applyQuaternion(cam.quaternion);
 m.position.copy(cam.position).addScaledVector(_f,D).addScaledVector(_u,ys*Hh).addScaledVector(_r,xs*Ww);m.quaternion.copy(cam.quaternion);
 const s=Math.min(hf*Hh/m.userData.h,.86*Ww/m.userData.w);m.scale.setScalar(s*Math.max(.001,a));}
const LB={tun:TX('TUNNEL',0xffd21a),wat:TX('WATER TRAP',0xffd21a),maze:TX('MAZE',0xffd21a),cam:TX('CAMOUFLAGE',0xffd21a),base:TX('SECRET BASE',0xffd21a),yes:TX('YES',0x22e85e),no:TX('NO',0xf00000)};
// ---------------- CAMERA (continuous; replaces the hook's last key) ----------------
const KEYS=SH[0].keys;KEYS.pop();
KEYS.push(
 [tSide+.3,[1.0,-.75,6.2],[1.0,-1.35,0],42],
 [tRuns,[3.0,-.9,6.2],[3.0,-1.45,0],42],
 [tThis1,[2.6,-.55,8.4],[2.6,-1.25,0],42],
 [tFinds,[1.4,.45,8.0],[1.0,-.5,-.6],42],
 [tDrops+.6,[1.8,-.3,8.4],[1.8,-1.2,0],42],
 [tSo2+.2,[5.6,-1.6,8.2],[5.6,-2.3,0],42],
 [tFlash-.1,[7.4,-2.0,7.4],[7.5,-2.6,0],42],
 [tPump,[2.6,-.9,10.5],[3.0,-1.6,0],42],[tDip-.3,[5.6,-1.6,10.5],[6.0,-2.3,0],42],
 [tDip+.2,[9.8,-2.6,8.6],[10.2,-3.3,0],42],
 [tCant,[12.0,-2.6,8.2],[12.2,-3.3,0],42],
 [tThis2+.4,[12.2,-2.4,8.8],[12.4,-3.1,0],42],
 [tCrawl+.1,[1.6,-1.2,9.6],[1.5,-1.9,0],42],
 [tFake+.3,[1.8,-2.2,10.5],[1.6,-2.9,0],42],
 [tBack+.6,[.8,-1.6,10.5],[.4,-2.2,0],42],
 [tThis3+.2,[.6,-.6,11.5],[.6,-1.5,0],42],
 [tDrone,[.4,1.3,9.2],[.3,.9,-2],44],
 [tSees,[.5,1.1,8.6],[.3,.6,-1.6],44],
 [tThis4+.3,[.4,1.0,8.4],[.3,.5,-1.4],44],
 [tDogs-.1,[16.6,-.6,8.6],[16.8,-1.25,0],44],
 [tSmell,[17.6,-.6,8.6],[17.6,-1.25,0],44],
 [tSooner,[9.6,-1.4,31],[9.6,-2.3,0],52],
 [tRiver-.1,[9.8,-1.4,30],[9.8,-2.3,0],52],
 [tRiver+.35,[21.6,-1.9,8.2],[21.6,-2.5,0],44],
 [tNot,[23.0,-1.3,6.4],[23.2,-1.9,0],42],
 [tSearch-.1,[22.6,1.5,8.6],[21.6,1.0,-2.4],44],
 [tNobody,[23.6,.6,8.2],[23.4,0,-1],44],
 [tAdd-.15,[23.6,-1.0,6.6],[23.4,-1.7,0],42],
 [tAdd+.2,[17.3,-1.6,9.2],[17.3,-2.1,0],42],
 [tSnack+.4,[17.9,-1.6,9.2],[17.9,-2.1,0],42],
 [tCongr+.1,[17.2,-1.8,12],[17.2,-2.4,0],46],
 [tBuilt+.3,[11.0,-1.2,36],[11.0,-2.3,0],52],
 [tWould,[11.6,-1.3,33],[11.6,-2.3,0],52],
 [END,[17.2,-1.5,10.5],[17.2,-2.0,0],44]);
// ---------------- actors ----------------
for(const P of[mike,...SW.map(s=>s.P)])P.g.rotation.order='YXZ';
const _q=new THREE.Quaternion(),_e=new THREE.Euler(0,0,0,'YXZ');
function crawl(P,x,y,z,dir,t,{k=1,dig=false,swim=false}={}){   // x,y = hip position; dir = +1 right / -1 left; slope from caller via y path
 const ry=dir>0?Math.PI/2:-Math.PI/2,pitch=1.42;P.g.rotation.set(pitch,ry,0);P.g.position.set(x-dir*.82,y-.05,z);const ph=t*(swim?5:6.5),s=Math.sin(ph);
 if(dig){K.arm(P,'R',AD[0]+2.2+.5*s,AD[2]-.3,.4+.3*s);K.arm(P,'L',AD[0]+2.2-.5*s,AD[2]-.3,.4-.3*s);}
 else{K.arm(P,'R',AD[0]+1.9+.6*s,AD[2]-.25,.5);K.arm(P,'L',AD[0]+1.9-.6*s,AD[2]-.25,.5);}
 for(const sd of['L','R']){const q=sd==='L'?1:-1;K.pose(P,'upperleg01'+sd,-.25*q*s*(swim?1.4:1),0,0);K.pose(P,'lowerleg01'+sd,.35+.3*q*s,0,0);}
 K.pose(P,'head',-1.0,0,0);K.pose(P,'spine03',-.08,0,0);}
function kneel(P,x,y,z,ry,k=1){P.g.rotation.set(0,ry,0);P.g.position.set(x,y-.5*k,z);K.pose(P,'spine03',.15*k,0,0);for(const sd of['L','R']){K.pose(P,'upperleg01'+sd,-.1*k,0,0);K.pose(P,'lowerleg01'+sd,1.65*k,0,0);}}
function stand(P,x,y,z,ry){P.g.rotation.set(0,ry,0);P.g.position.set(x,y,z);}
function scratch(P,t,k=1){K.arm(P,'R',AD[0]+.6*k,AD[2]-1.95*k,2.3*k+.25*Math.sin(t*18)*k);K.pose(P,'head',.1*k,.15*Math.sin(t*3)*k,.12*k);}
const lerpK=(KF,t)=>{if(t<=KF[0][0])return KF[0].slice(1);for(let i=0;i<KF.length-1;i++)if(t<=KF[i+1][0]){const a=KF[i],b=KF[i+1],u=sm(a[0],b[0],t);return a.slice(1).map((v,j)=>v+(b[j+1]-v)*u);}return KF[KF.length-1].slice(1);};
const linK=(KF,t)=>{if(t<=KF[0][0])return KF[0].slice(1);for(let i=0;i<KF.length-1;i++)if(t<=KF[i+1][0]){const a=KF[i],b=KF[i+1],u=(t-a[0])/(b[0]-a[0]);return a.slice(1).map((v,j)=>v+(b[j+1]-v)*u);}return KF[KF.length-1].slice(1);};
// ring path for crawlers: angle a (radians, from +x CCW) -> hip point on the ring centre line
const ringPt=a=>[RC.x+RC.r*Math.cos(a),RC.y+RC.r*Math.sin(a)-.4];
// clods thrown back over a digger
function clods(t,x,y,dir,on){CLODS.forEach(c=>{const tk=((t*5.2/(Math.PI*2))+c.k/26)%1;c.m.visible=on&&tk<.7;if(!c.m.visible)return;const u=tk/.7;
 c.m.position.set(x+dir*1.0-dir*u*.9,y+.35+1.3*u*(1-u),ZI+.25+(c.k%3)*.05);c.m.scale.setScalar(.6);c.m.rotation.set(u*6,u*4,0);});}
// SWAT gear follow (helmet/vest along the body, flashlight forward)
function gear(s,t,prone=false){const P=s.P;P.g.updateMatrixWorld(true);P.g.getWorldQuaternion(_q);const hd=boneW(P,'head'),sp=boneW(P,'spine01'),wr=boneW(P,'wristR');
 s.G.helm.position.copy(hd).add(V3(0,.09,0).applyQuaternion(_q));s.G.helm.quaternion.copy(_q);s.G.vest.position.copy(sp).add(V3(0,-.12,0).applyQuaternion(_q));s.G.vest.quaternion.copy(_q);
 s.G.lamp.position.copy(wr);_e.set(0,P.g.rotation.y,0);s.G.lamp.quaternion.setFromEuler(_e);s.G.lamp.rotateY(.3*Math.sin(t*2.6+s.i*1.7));s.G.lamp.rotateX(prone?-.05:.3+.1*Math.sin(t*3+s.i));
 for(const g of Object.values(s.G))g.visible=P.g.visible;}
// SWAT surface spots per beat
const SPOT={rim:[[-.9,-1.95],[-.15,-1.85],[.55,-1.9],[1.3,-2.0]],dog:[[15.2,-1.1],[13.0,-3.2],[17.6,-1.2],[11.6,-3.6]],
 ent:[[-.2,-1.85],[-2.0,-1.2],[16.2,-.75],[18.6,-.8]],river:[[18.6,-2.6],[20.6,-3.8],[28.2,-2.8],[29.6,-4.6]]};
const SWX=SW.map(s=>({x:s.x1,z:s.lane}));
// ---------------- UPDATE ----------------
return function(t){
 // hook leftovers: rain stops after the tunnel line; the hole water drains away as the sloped tunnel opens
 if(t>tThis1){RAIN.visible=false;}else if(t>tRuns)RAIN.material.opacity=.55*(1-sm(tRuns,tThis1,t));
 if(t>tSide+.3){const wl=1.05*(1-sm(tRuns-.6,tThis1,t));WATER.visible=wl>.02;WATER.scale.y=Math.max(.001,wl);WATER.position.y=-HOLE.dep+wl/2;DROPS.forEach(d=>d.visible=wl>.3&&t<tRuns);}
 // ---------- reveals ----------
 const hx=(a,b,t0,t1)=>a+(b-a)*sm(t0,t1,t);
 PL1.constant=t<tSide?-1:hx(.75,4.75,tSide+.2,tRuns+.4)+.55;
 PL2.constant=t<tSo2?4.5:hx(4.6,9.1,tSo2,tSo2+1.15)+.5;
 PL3.constant=t<tDip?8.9:(t<tDogs-.3?hx(9.0,14.4,tDip,tDip+1.5)+.5:99);
 PLR.constant=t<tDogs-.3?-99:99;PIPES.forEach(p=>{p.g.visible=t>tDogs-.3;p.cav.visible=p.g.visible;});
 PLRT.constant=t<tRiver?19.3:hx(19.4,23.8,tRiver,tRiver+1.6)+.4;
 // maze: shaft from T1 (y >= c), ring CCW... revealed with Mike's digging clock (fake tunnel), link + exit shaft
 const r0=tFake-.4;const mzA=sm(r0+.15,r0+1.35,t)*Math.PI*1.5;   // ring arc dug clockwise from the top: 0 -> 270 deg
 PLS.constant=t<r0?1.9:hx(1.95,2.8,r0,r0+.15);
 if(mzA>.01){if(RING){scene.remove(RING);RING.geometry.dispose();scene.remove(RINGD);RINGD.geometry.dispose();}
  RING=add(ringGeo(mzA),RINGM[0],RC.x,RC.y,ZC,scene,false);RINGD=add(new THREE.RingGeometry(RC.r+.33,RC.r+.45,64,1,Math.PI/2-mzA,mzA),RINGM[1],RC.x,RC.y,ZC+.002,scene,false);}
 PLK2.constant=t<r0+1.35?-99:-(2.2-hx(0,4.6,r0+1.35,r0+1.6));   // visible x >= c : link grows to the left
 PLE.constant=t<r0+1.6?-99:hx(-4.55,.05,r0+1.6,r0+1.95);           // exit shaft grows up (visible y <= c)
 EXITHOLE.visible=t>r0+1.95;
 // ---------- Mike ----------
 const M_=mike;
 if(t>tSide+.3){K.relax(M_);K.idle(M_,t);M_.g.visible=true;let dig=false,dx=0,dy=0,ddir=1;SHOV.visible=false;
  if(t<tRuns+.4){const x=hx(1.15,4.5,tSide+.3,tRuns+.4);crawl(M_,x,fy(MAIN,x)+.22,ZI,1,t,{dig:true});dig=true;dx=x;dy=fy(MAIN,x);}
  else if(t<tSo2){const x=4.25;kneel(M_,x,fy(MAIN,x),ZI,-.2);const pr=win(t,tThis1,tFinds-.2,.15);K.shrug(M_,pr*(.8+.2*Math.sin(t*5)));K.face(M_,{smile:pr});
   const up=sm(tFinds,tFinds+.3,t);K.pose(M_,'head',-.5*up,.2*Math.sin(t*3)*up,0);K.face(M_,{jaw:.45*up});}
  else if(t<tSo2+1.15){const x=hx(4.6,8.7,tSo2,tSo2+1.15);crawl(M_,x,fy(MAIN,x)+.22,ZI,1,t,{dig:true});dig=true;dx=x;dy=fy(MAIN,x);}
  else if(t<tDip){const x=8.75;kneel(M_,x,-3.1,ZI,-.35);const h=win(t,tFlash-.2,tPump,.15);K.headHold(M_,h);K.pose(M_,'spine03',.3*h,0,0);
   const lk=sm(tPump,tPump+.3,t);K.pose(M_,'head',0,-.7*lk,0);K.face(M_,{jaw:.4*lk+.3*h});}
  else if(t<tDip+1.5){const x=hx(9.0,13.8,tDip,tDip+1.5);crawl(M_,x,fy(MAIN,x)+.22,ZI,1,t,{dig:true,swim:x>9.6&&x<13.2&&t>tDip+.9});dig=x<13.2;dx=x;dy=fy(MAIN,x);}
  else if(t<tFake-.5){const x=13.9;kneel(M_,x,-3.1,ZI,-.5);K.pose(M_,'head',0,-.6,0);const sm2=win(t,tThis2-.2,tCrawl,.2);K.face(M_,{smile:1.1*sm2});K.shrug(M_,.5*sm2);}
  else if(t<tFake+1.75){ // digs the fake circle: T1 junction -> down shaft -> ring clockwise -> link -> exit shaft -> climbs out and runs off left
   const r0=tFake-.4;if(t<r0){crawl(M_,hx(4.2,3.3,tFake-.5,r0),-1.8,ZI,-1,t);}
   else if(t<r0+.15){stand(M_,3.2,hx(-1.95,-3.1,r0,r0+.15),ZI,0);K.armsUp(M_,.8);}
   else if(t<r0+1.35){const a=Math.PI/2-sm(r0+.15,r0+1.35,t)*Math.PI*1.5,[x,y]=ringPt(a);crawl(M_,x,y,ZI,1,t,{dig:true});M_.g.rotation.set(1.42,Math.PI/2,0);
    M_.g.position.set(x,y,ZI);M_.g.rotateZ(0);M_.g.quaternion.multiplyQuaternions(new THREE.Quaternion().setFromAxisAngle(V3(0,0,1),a-Math.PI/2),M_.g.quaternion);dig=true;dx=x;dy=y;ddir=Math.cos(a-Math.PI/2)>0?-1:1;}
   else if(t<r0+1.6){const x=hx(2.0,-2.0,r0+1.35,r0+1.6);crawl(M_,x,-4.5,ZI,-1,t,{dig:true});dig=true;dx=x;dy=-4.5;ddir=-1;}
   else if(t<r0+1.95){stand(M_,-2.0,hx(-4.55,-.3,r0+1.6,r0+1.95),ZI,0);K.armsUp(M_,1);K.walk(M_,t*1.5,.4);}
   else{const u=sm(r0+1.95,r0+2.5,t);stand(M_,-2.0-6*u,0,-.4,-Math.PI/2);K.walk(M_,t*1.8,.8);}}
  else if(t<tDrone-.2){M_.g.visible=false;}
  else if(t<tDogs-.3){stand(M_,0,-HOLE.dep,-.72,.15);const up=win(t,tCover-.25,tThis4-.3,.2),dn=sm(tThis4-.3,tThis4+.1,t);K.armsUp(M_,up*.95);K.pose(M_,'head',-.4*up,0,0);
   if(dn>0){K.sit(M_,.75*dn);M_.g.position.y=-HOLE.dep-.62*dn;K.face(M_,{smile:.9*dn});K.pose(M_,'head',-.3*dn,0,0);}}
  else if(t<tSooner){stand(M_,16.25,ROOM.y0,ZI,-.2);const rb=win(t,tRub-.1,tSmell-.1,.15);K.armsUp(M_,rb*.95);for(const sd of['L','R'])K.pose(M_,'lowerarm01'+sd,.4*rb+.35*Math.sin(t*16+(sd==='L'?0:1.5))*rb,0,0);
   const ok=sm(tSmell+.1,tSmell+.4,t);K.shrug(M_,ok*.8);K.face(M_,{smile:ok});}
  else if(t<tRiver){stand(M_,17.4,ROOM.y0,ZI,.2);const w=sm(tSooner,tSooner+.3,t);K.headHold(M_,w);K.face(M_,{jaw:.5*w});}
  else if(t<tRiver+1.6){const x=hx(19.7,23.1,tRiver,tRiver+1.6),y=x<21.5?-3.6:-3.6+(x-21.5)/2.2*1.35;crawl(M_,x,y+.22,ZI,1,t,{dig:true});M_.g.rotateX(-(x>21.5?.55:0));dig=true;dx=x;dy=y;}
  else if(t<tSearch){kneel(M_,22.6,-2.55,ZI,-.2);const p=win(t,tNot,tSearch,.15);K.point(M_,'L',p);K.arm(M_,'L',AD[0]+2.6*p,AD[2]-.4,.1);K.face(M_,{smile:.9*p});K.pose(M_,'head',-.4*p,0,0);}
  else if(t<tNobody-.6){M_.g.visible=false;}
  else if(t<tAdd-.2){const u=sm(tNobody-.6,tAdd-.25,t),x=25.0-1.7*u,y=-.2-1.6*u;crawl(M_,x,y,ZI,-1,t,{swim:true});M_.g.rotation.set(1.42+.6*u,-Math.PI/2,0);}
  else{ // hammock: lying on the back, hands behind the head; waves on "congratulations"; sits up for the CTA question
   const sit=sm(tWould-.2,tWould+.3,t);M_.g.rotation.set(-1.48*(1-sit),Math.PI/2,0);M_.g.position.set(17.9-.65*sit,-2.86+.05*sit,ZI+.05);K.lieArms(M_,1-sit);
   if(sit>0){K.sit(M_,sit);K.shrug(M_,sit*(.8+.2*Math.sin(t*4)));K.face(M_,{smile:.9*sit});}
   const wv=win(t,tCongr,tWould-.3,.15);if(wv>0){K.arm(M_,'R',AD[0]+.3,AD[2]-2.0*wv,.6+.4*Math.sin(t*12)*wv);K.face(M_,{smile:1.2*wv});}
   const rac=win(t,tSnack,tCongr,.1);if(rac>0){K.pose(M_,'head',.4*rac,.5*rac,0);K.face(M_,{jaw:.5*rac});}}
  M_.g.updateMatrixWorld(true);
  if(dig){SHOV.visible=true;const wr=boneW(M_,'wristR');SHOV.position.copy(wr);M_.g.getWorldQuaternion(_q);SHOV.quaternion.copy(_q);SHOV.rotateX(-1.2);SHOV.translateY(-.1);}
  clods(t,dx,dy,ddir,dig);}
 // ---------- flashbang: SWAT drops it into the hole, it rolls down the tunnel to the zigzag corner, flash hits the dirt wall ----------
 const c0=tDrops+.25;CAN.visible=t>c0&&t<tFlash+.05;
 if(CAN.visible){const P=linK([[c0,-.15,.9,-1.25],[c0+.55,-.1,-2.08,-.75],[c0+.8,.9,-2.08,.35],[tFlash-.65,5.6,-1.8,.35],[tFlash-.05,7.35,-2.98,.35]],t);CAN.position.set(...P);CAN.rotation.set(t*9,0,t*6);}
 const fl=t>tFlash?Math.exp(-(t-tFlash)*3.2):0;FLASH.visible=fl>.02&&t<tFlash+1.5;FLASH.scale.setScalar(.2+.55*(1-fl));FLASH.material.opacity=.85*fl;FLL.intensity=40*fl;
 FL.style.opacity=String(.3*Math.max(0,1-(t-tFlash)*2.5)*(t>tFlash?1:0));
 // ---------- tear gas ----------
 TANK.visible=t>tPump-.3&&t<tCrawl;HOSE.visible=TANK.visible;if(TANK.visible)TANK.position.set(.45,.3,-1.75);
 const gf=sm(tPump+.2,tDip+.6,t),ga=sm(tPump+.2,tPump+.6,t)*(1-sm(tThis2+.4,tCrawl+.2,t));
 GAS.forEach(g=>{g.s.visible=ga>.02;if(!g.s.visible)return;const p=along(GASP,gf*g.o);p.x+=.15*Math.sin(t*2+g.j);p.y+=.12*Math.sin(t*2.6+g.j*1.3)+.2;g.s.position.copy(p);g.s.scale.setScalar(.5+.2*Math.sin(g.j+t));g.s.material.opacity=.5*ga;});
 // water trap fills behind Mike
 {const w=sm(tDip+1.3,tDip+1.8,t);WTRAP.visible=w>.01;WTRAP.material.opacity=.88*w;}
 // ---------- SWAT ----------
 if(t>tFinds-.2){SW.forEach((s,i)=>{const P=s.P;K.relax(P);P.g.visible=true;let prone=false;
  if(t<tCrawl){ // flashbang + gas beat: s1 walks to the rim and drops; s2 pumps gas; others search near the hole
   if(i===1){const u=sm(tFinds,tFinds+.7,t);stand(P,SWX[1].x+(-.15-SWX[1].x)*u,0,SWX[1].z+(-1.85-SWX[1].z)*u,u<1?Math.atan2(-.15-SWX[1].x,(-1.85-SWX[1].z)):.0);if(u>0&&u<1)K.walk(P,t*1.5,.6);else K.idle(P,t,1);
    const dr=win(t,tFinds+.7,tDrops+.5,.15);K.point(P,'R',dr);K.pose(P,'head',.5*dr,0,0);K.pose(P,'spine03',.35*dr,0,0);}
   else if(i===2){const u=sm(tPump-.6,tPump,t);stand(P,SWX[2].x+(.75-SWX[2].x)*u,0,SWX[2].z+(-1.95-SWX[2].z)*u,u<1?-Math.PI/2:-.3);if(u>0&&u<1)K.walk(P,t*1.5,.6);else K.idle(P,t,2);
    const pm=win(t,tPump,tThis2,.15);K.handsFront(P,pm);K.pose(P,'spine03',.3*pm,0,0);}
   else{stand(P,SWX[i].x,0,SWX[i].z,Math.PI*.95+.4*Math.sin(t*.7+i));K.idle(P,t,i);K.arm(P,'R',AD[0]+1.2,AD[2]-.25,.35);K.pose(P,'head',0,.5*Math.sin(t*1.6+i),0);}}
  else if(t<tDrone-.2){ // maze: s0 + s3 slide into the hole, crawl T1, down the fake circle, out the exit shaft, scratch heads; s1/s2 watch the hole
   if(i===0||i===3){const d=i===3?.45:0,a0=tCrawl+d,r0=tFake-.4+.9+d;
    if(t<a0+.6){const u=sm(a0,a0+.6,t);stand(P,-.3+.4*(i===3),-HOLE.dep*u,-1.85+1.1*u,0);K.armsUp(P,.7*(1-u));}
    else if(t<r0){const x=hx(.9,3.1,a0+.6,r0);crawl(P,x,fy(MAIN,x)+.22,ZI-.05,1,t);prone=true;}
    else if(t<r0+.25){stand(P,3.2,hx(-1.95,-3.1,r0,r0+.25),ZI-.05,0);K.armsUp(P,.6);}
    else if(t<r0+1.5){const a=Math.PI/2-sm(r0+.25,r0+1.5,t)*Math.PI*1.5,[x,y]=ringPt(a);crawl(P,x,y,ZI-.05,1,t);P.g.position.set(x,y,ZI-.05);P.g.quaternion.multiplyQuaternions(new THREE.Quaternion().setFromAxisAngle(V3(0,0,1),a-Math.PI/2),P.g.quaternion);prone=true;}
    else if(t<r0+1.8){const x=hx(2.0,-2.0,r0+1.5,r0+1.8);crawl(P,x,-4.5,ZI-.05,-1,t);prone=true;}
    else if(t<r0+2.15){stand(P,-2.0,hx(-4.55,0,r0+1.8,r0+2.15),ZI-.1,0);K.armsUp(P,1);}
    else{stand(P,-2.0+(i===3?-.75:.1),0,i===3?-.9:-.5,.25*(i===3?1:-1));K.idle(P,t,i);scratch(P,t,sm(r0+2.15,r0+2.4,t));K.face(P,{jaw:.3});}}
   else{stand(P,i===1?-.15:.75,0,i===1?-1.85:-1.95,0);K.idle(P,t,i);K.arm(P,'R',AD[0]+1.3,AD[2]-.2,.3);K.pose(P,'head',.45,.2*Math.sin(t+i),0);K.pose(P,'spine03',.25,0,0);}}
  else if(t<tDogs-.3){ // drone: s1 flies it from a tablet, others search around
   const sp=[[-1.9,-1.4],[-3.2,-3.6],[2.6,-4.0],[-2.8,-.9]][i];stand(P,sp[0],0,sp[1],i===1?.4:Math.PI*.9+.5*Math.sin(t*.8+i));K.idle(P,t,i);
   if(i===1){K.handsFront(P,1);K.pose(P,'head',-.35,.3*Math.sin(t*1.5),0);}else{K.arm(P,'R',AD[0]+1.2,AD[2]-.25,.35);K.pose(P,'head',0,.5*Math.sin(t*1.6+i),0);}}
  else if(t<tSooner){ // dogs: handlers walk the dogs to the vents, then past them
   const sp=SPOT.dog[i],w=(i===0||i===2)?sm(tSmell,tSmell+1.2,t):0;stand(P,sp[0]+w*2.6,0,sp[1],Math.PI/2*(w>0&&w<1?1:.4)+(i%2?2.6:0));if(w>0&&w<1)K.walk(P,t*1.5,.55);else K.idle(P,t,i);
   K.arm(P,'L',AD[0]+.6,AD[2]-.2,.4);K.pose(P,'head',.3*(i%2?0:1),.4*Math.sin(t*1.3+i),0);}
  else if(t<tSearch-.2){const sp=SPOT.ent[i];stand(P,sp[0],0,sp[1],.1*Math.sin(t+i));K.idle(P,t,i);K.arm(P,'R',AD[0]+1.35,AD[2]-.2,.2);K.pose(P,'head',.5,0,0);K.pose(P,'spine03',.3,0,0);}
  else{const sp=SPOT.river[i],dr=.6*Math.sin(t*.5+i*1.7);stand(P,sp[0]+dr,0,sp[1],(i%2?-1:1)*1.2+.8*Math.sin(t*.9+i));K.walk(P,t*1.2+i,.3);K.arm(P,'R',AD[0]+1.2,AD[2]-.25,.35);K.pose(P,'head',.15,.6*Math.sin(t*1.7+i),0);}
  gear(s,t,prone);});}
 // ---------- drone ----------
 DRONE.visible=t>tDrone-.3&&t<tDogs-.3;if(DRONE.visible){const p=lerpK([[tDrone-.3,-7.5,4.0,-1.4],[tCover,-2.0,3.7,-1.2],[tSees-.6,.1,3.5,-1.0],[tSees+.6,.3,3.5,-1.0],[tDogs-.3,7.5,4.1,-1.4]],t);DRONE.position.set(...p);
  DRONE.rotation.z=-.12*Math.cos(t*.8);DRONE.userData.rot.forEach((r,k)=>r.rotation.y=t*40+k);const sc=win(t,tSees-.7,tThis4,.25);DRONE.userData.cone.visible=sc>.02;DRONE.userData.cone.material.opacity=.18*sc;}
 // ferns lid: lifted from Mike's hands up over the hole
 const ld=sm(tCover-.2,tCover+.9,t);LID.visible=t>tCover-.25&&t<tSooner+3||t>tSooner+3;LID.position.set(0,t<tCover-.25?-60:-.25+.29*ld,-.75);LID.scale.setScalar(Math.max(.001,.7+.3*ld));
 // ---------- dogs ----------
 DOGS.forEach((d,k)=>{const on=t>tDogs-.3&&t<tSooner+0||(t>tSooner&&t<tSearch-.2)||t>tSearch-.2;d.g.visible=t>tDogs-.3;if(!d.g.visible)return;
  if(t<tSooner){const pipe=PIPES[k].x,w=sm(tDogs-.3,tDogs+.4,t),gone=sm(tSmell,tSmell+1.2,t),x=pipe-1.4+1.35*w+2.8*gone;dogPose(d,x,-.42,Math.PI/2,t,(w>0&&w<1)||(gone>0&&gone<1)?1:0,win(t,tDogs+.4,tSmell,.2));}
  else if(t<tSearch-.2){const sp=SPOT.ent[k+2];dogPose(d,sp[0]+.55,sp[1]+.1,Math.PI/2+.4,t,0,.6);}
  else{const sp=SPOT.river[k*2],dr=.6*Math.sin(t*.5+k*2*1.7);dogPose(d,sp[0]+dr+.6,sp[1]+.3,Math.PI/2*(Math.cos(t*.5)>0?1:-1),t,.6,.4);}});
 // vents + pine sap (amber rises up the pipe, blob on top)
 PIPES.forEach((p,k)=>{const r=sm(tRub+.1*k,tRub+.9+.1*k,t);p.sap.visible=r>0;p.sap.scale.y=Math.max(.001,1.55*r);p.sap.position.y=-1.2+.775*r;p.blob.visible=r>.95;p.blob.scale.setScalar(Math.max(.001,pop(t,tRub+.9+.1*k,.3)));});
 // twist glow at the river entrance
 const eg=win(t,tNot,tSearch+.2,.2)+win(t,tNobody+.4,tAdd,.2);EGLOW.visible=eg>.02;EGLOW.scale.setScalar(Math.max(.001,eg*(1+.06*Math.sin(t*8))));
 // ---------- room props ----------
 HAM.scale.setScalar(Math.max(.001,pop(t,tAdd+.3,.3)));const lp=pop(t,tLantern,.3);LAMP.scale.setScalar(Math.max(.001,lp));LL.intensity=t>tLantern?9*Math.min(1,lp)*(1+.05*Math.sin(t*13)):0;
 {RAC.visible=t>tRacc-.3;const u1=sm(tRacc-.3,tSnack,t),u2=sm(tSnack+.35,tCongr+.3,t),x=20.6-1.35*u1+2.8*u2;RAC.position.set(x,ROOM.y0,ZI+.1);RAC.rotation.y=u2>0?0:Math.PI;
  const mv=(u1>0&&u1<1)||(u2>0&&u2<1);RAC.userData.legs.forEach((l,i)=>l.rotation.z=mv?.6*Math.sin(t*20+(i%2?Math.PI:0)):0);RAC.userData.hd.rotation.z=.15*Math.sin(t*6);
  const grab=t>tSnack+.15;CHIPS.position.set(grab?x+(u2>0?.32:-.32):19.0,grab?-3.22:-2.98,ZI+.05);CHIPS.rotation.z=grab?.6:0;}
 // ---------- labels ----------
 SHOWS(LB.tun,t,tThis1,tFinds-.1,0,.3,.06);SHOWS(LB.wat,t,tThis2,tCrawl-.1,0,.3,.06);SHOWS(LB.maze,t,tThis3,tDrone-.2,0,.3,.06);SHOWS(LB.cam,t,tThis4,tDogs-.4,0,.3,.06);
 SHOWS(LB.base,t,tBuilt,tWould-.1,0,.3,.065);SHOWS(LB.yes,t,tYes,0,-.22,.3,.1);SHOWS(LB.no,t,tYes+.3,0,.22,.3,.1);
 // ---------- follow-cam: during the digging beats the camera rides with Mike (subject centred, below the caption) ----------
 const FW=[[tSide+.3,tRuns+.4,6.6],[tSo2-.1,tFlash-.3,7.0],[tDip-.15,tThis2+.6,7.6],[tFake-.5,tFake+1.7,9.2],[tRiver-.05,tRiver+1.7,7.4]];
 for(const [a,b,d] of FW){const f=win(t,a,b,.35);if(f<=0)continue;mike.g.updateMatrixWorld(true);const h=boneW(mike,'spine03');
  cam.getWorldDirection(_f);const lk=cam.position.clone().addScaledVector(_f,Math.abs(cam.position.z/_f.z||8));
  cam.position.lerp(V3(h.x,h.y+1.05,d),f);lk.lerp(V3(h.x,h.y+.8,0),f);cam.lookAt(lk);}
};}
