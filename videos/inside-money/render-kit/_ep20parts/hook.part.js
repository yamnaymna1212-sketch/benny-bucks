// ===================== EP20 (ATM deposit) — Maple Street + a bank with an ATM; giant ATM interior set at x=IN =====================
const lawn=add(B(600,.2,600),pbr('leafy_grass',120,120,0x8fdc4a),0,-.1,0,scene,false);
street(0,19,400);
const SIMPLE=o=>Object.assign({},o,{simple:true,flag:false});
house(-22,0,0,SIMPLE(STY[1]),false,-1);house(22,0,0,SIMPLE(STY[3]),false,1);house(-44,0,0,SIMPLE(STY[4]),false,1);house(44,0,0,SIMPLE(STY[5]),false,-1);
for(const [x,s] of[[-22,2],[0,3],[22,1]])house(x,-34,Math.PI,SIMPLE(STY[s]),false,1);
const TREES=['island_tree_01','jacaranda_tree','pine_tree_01'];
for(const [x,z,h] of[[-10.5,10,6.5],[11.5,10,7],[-14,-8,9],[15,-12,8],[-30,-14,9],[31,-20,10],[-36,8,8],[36,8,9],[0,-26,9]])model(TREES[Math.round(Math.abs(x*7+z))%3],x,0,z,h,x);
const {core}=await import('./scenekit/core.js');const K=await core(THREE,scene,{TL});
const {sm,pop,AD}=K;
// ---------- the bank (front faces the street, +z) ----------
const BANK=K.group(0,0,0);
{const st=pbr('white_sandstone_blocks_02',4,2,0xf3ece0);
 K.add(K.B(14,6.4,10),st,0,3.2,3,BANK);K.add(K.B(14.6,.6,10.6),K.M(0xe8e1d4,.6),0,6.6,3,BANK);          // body + cornice
 K.add(K.B(16,.12,6),pbr('concrete_pavement',8,3,0xdedede),0,.06,11,BANK,false);                         // sidewalk
 for(const x of[-5.2,-1.8])K.add(K.CY(.32,.36,5.6,24),K.M(0xf4efe6,.55),x,2.8,8.45,BANK);                // columns
 const gl=new THREE.MeshPhysicalMaterial({color:0x1d2a36,roughness:.08,metalness:.4,clearcoat:1,envMapIntensity:1.2});
 K.add(K.B(2.6,2.6,.08),gl,-3.5,1.6,8.06,BANK);K.add(K.B(2.8,2.8,.06),K.M(0xb8a888,.4,.6),-3.5,1.6,8.02,BANK);  // glass door
 for(const x of[-5.6,5.6])K.add(K.B(1.6,1.8,.08),gl,x,4.5,8.03,BANK);
 const sign=K.txt3('BANK',.72,0xd9a62a,{ei:.25,p:BANK});sign.position.set(0,5.45,8.12);}
// ---------- the ATM (built into the facade) ----------
const AX=3.2,AZ=8.0;   // ATM centre on the wall
const ATM=K.group(AX,0,AZ,BANK);
const SCRT=K.tex(512,400,()=>{});let scrMode=-1;
function screenDraw(mode){if(mode===scrMode)return;scrMode=mode;K.redraw(SCRT,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#0f3d73');g.addColorStop(1,'#0a2448');x.fillStyle=g;x.fillRect(0,0,w,h);
 x.textAlign='center';x.fillStyle='#fff';x.font='800 40px Mont';x.fillText(mode?'DEPOSITING...':'INSERT CASH',w/2,70);
 x.fillStyle=mode?'#2fe06a':'#21b357';x.beginPath();x.roundRect(86,130,340,120,22);x.fill();x.fillStyle='#fff';x.font='800 64px Mont';x.fillText('DEPOSIT',w/2,214);
 x.fillStyle='#9fc2ea';x.font='800 34px Mont';x.fillText('WITHDRAW',w/2,320);});}
screenDraw(0);
{const steel=K.M(0x5c636b,.35,.85),dk=K.M(0x16191c,.4,.6);
 K.add(K.RB(1.25,2.3,.5,.06),K.M(0x1d4f8f,.4,.3),0,1.25,.05,ATM);                 // blue surround (front z=.30)
 K.add(K.RB(1.0,1.95,.42,.04),steel,0,1.12,.14,ATM);                               // steel body (front z=.35)
 K.add(new THREE.PlaneGeometry(.62,.48),new THREE.MeshBasicMaterial({map:SCRT,toneMapped:false}),0,1.62,.362,ATM,false);
 K.add(K.B(.7,.56,.02),dk,0,1.62,.35,ATM);
 const kp=K.tex(256,200,(x,w,h)=>{x.fillStyle='#2a2e33';x.fillRect(0,0,w,h);x.font='800 30px Mont';x.textAlign='center';for(let r=0;r<4;r++)for(let c=0;c<3;c++){x.fillStyle='#d9dde2';x.beginPath();x.roundRect(20+c*60,12+r*46,48,38,6);x.fill();x.fillStyle='#222';x.fillText('123456789*0#'[r*3+c],44+c*60,42+r*46);}
  ['#d42a2a','#e8c32a','#2fae4a'].forEach((col,i)=>{x.fillStyle=col;x.beginPath();x.roundRect(200,14+i*62,44,50,6);x.fill();});});
 K.add(K.B(.4,.31,.02),K.M(0x2a2e33,.6),0,1.17,.355,ATM);K.add(new THREE.PlaneGeometry(.34,.27),new THREE.MeshStandardMaterial({map:kp,roughness:.8}),0,1.17,.368,ATM,false);
 K.add(K.B(.46,.12,.06),K.M(0x0b0b0b,.5),0,.9,.37,ATM);                           // cash slot frame
 K.add(new THREE.PlaneGeometry(.36,.035),new THREE.MeshBasicMaterial({color:0x000000}),0,.9,.402,ATM,false);
 const sign=K.tex(256,96,(x,w,h)=>{x.fillStyle='#1d4f8f';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='800 70px Mont';x.textAlign='center';x.fillText('ATM',w/2,74);});
 K.add(new THREE.PlaneGeometry(.7,.26),new THREE.MeshBasicMaterial({map:sign,toneMapped:false}),0,2.22,.31,ATM,false);}
const SLOTLED=K.add(K.B(.42,.015,.02),new THREE.MeshStandardMaterial({color:0x2fe06a,emissive:0x2fe06a,emissiveIntensity:1.6}),0,.97,.4,ATM,false);
const SLOT=V3(AX,.9,AZ+.36);   // world point of the cash slot
// ---------- giant ATM interior (Mike is the size of a finger in here) ----------
const IN=300,IG=K.group(IN,0,0);
const PCB=K.tex(1024,512,(x,w,h)=>{x.fillStyle='#0f4a2c';x.fillRect(0,0,w,h);x.strokeStyle='#d8b04a';x.lineWidth=5;
 for(let i=0;i<46;i++){let px=(i*97)%w,py=(i*53)%h;x.beginPath();x.moveTo(px,py);for(let k=0;k<4;k++){if(k%2)px+=((i*31+k*17)%160)-60;else py+=((i*23+k*29)%140)-50;x.lineTo(px,py);}x.stroke();x.fillStyle='#e8c35a';x.beginPath();x.arc(px,py,8,0,7);x.fill();}
 for(let i=0;i<12;i++){x.fillStyle='#16181b';const cx=(i*211)%(w-150)+20,cy=(i*137)%(h-110)+20;x.fillRect(cx,cy,130,80);x.fillStyle='#8b9096';for(let k=0;k<8;k++){x.fillRect(cx+6+k*15,cy-10,7,10);x.fillRect(cx+6+k*15,cy+80,7,10);}}});
PCB.wrapS=THREE.RepeatWrapping;PCB.repeat.set(4,1);
const STRIPE=K.tex(256,32,(x,w,h)=>{for(let i=0;i<12;i++){x.fillStyle=i%2?'#151515':'#f2c21a';x.beginPath();x.moveTo(i*24,0);x.lineTo(i*24+24,0);x.lineTo(i*24+8,h);x.lineTo(i*24-16,h);x.fill();}});
STRIPE.wrapS=THREE.RepeatWrapping;STRIPE.repeat.set(14,1);
{const steel=K.M(0x7d858e,.35,.85),rub=K.M(0x1b1c1e,.85);
 K.add(K.B(60,.2,14),pbr('granite_tile',12,3,0x9aa1a8),0,-.1,0,IG,false);                                   // floor plate
 K.add(new THREE.PlaneGeometry(60,8),new THREE.MeshStandardMaterial({map:PCB,roughness:.55,metalness:.2}),0,4,4.2,IG,false).rotation.y=Math.PI;   // circuit-board back wall
 for(const y of[.5,7.4])K.add(K.B(60,.08,.08),new THREE.MeshStandardMaterial({color:0x3aa0ff,emissive:0x3aa0ff,emissiveIntensity:2.2}),0,y,4.1,IG,false);   // blue LED strips
 for(let i=0;i<9;i++)K.add(new THREE.SphereGeometry(.07,12,8),new THREE.MeshStandardMaterial({color:0x2fe06a,emissive:0x2fe06a,emissiveIntensity:2}),-24+i*6,6.2,4.05,IG,false);
 K.add(K.B(30,.3,2.4),rub,-3,.85,0,IG);                                                                     // conveyor belt (top y=1.0)
 for(let i=0;i<26;i++){const r=K.add(K.CY(.16,.16,2.7,18),steel,-17.5+i*1.15,.62,0,IG);r.rotation.x=Math.PI/2;}
 for(const z of[-1.35,1.35])K.add(K.B(30,.28,.12),new THREE.MeshStandardMaterial({map:STRIPE,roughness:.6}),-3,1.14,z,IG);   // yellow/black rails
 K.add(K.B(30,.9,.25),steel,-3,.45,-1.5,IG);K.add(K.B(30,.9,.25),steel,-3,.45,1.5,IG);}
const ROLL=[];for(const y of[1.75,3.05]){const r=K.add(K.CY(.62,.62,2.9,40),K.M(0x9aa2ab,.25,.9),-10.5,y,0,IG);r.rotation.x=Math.PI/2;ROLL.push(r);}
{const fr=K.M(0x2b2f35,.4,.7);for(const z of[-1.6,1.6])K.add(K.B(1.8,4.4,.2),fr,-10.5,2.2,z,IG);K.add(K.B(1.8,.3,3.4),fr,-10.5,4.35,0,IG);}
for(const [c,x,y,z,i] of[[0xffffff,-2,6,-3,22],[0x9fd0ff,6,5,-3,16],[0xfff1d6,-9,5,-2,16]]){const l=new THREE.PointLight(c,i,24,1.2);l.position.set(x,y,z);IG.add(l);}
// the giant $1,000 stack Mike rides (bills at finger scale = a raft)
const GS=14,RAFT=K.group(0,0,0,IG);for(let i=0;i<10;i++){const n=MK.note(100,{curve:0});n.scale.setScalar(GS);n.rotation.set(-Math.PI/2,0,Math.PI+.05*Math.sin(i*2.7));n.position.set(.05*Math.sin(i*1.9),.012+i*.016,.04*Math.cos(i*1.3));RAFT.add(n);}   // ten $100 bills = $1,000 (no strap band)
const RH=.17;
const LOOSE=[];for(let i=0;i<6;i++){const n=MK.note(100,{curve:.01});n.scale.setScalar(7);IG.add(n);LOOSE.push(n);}
// ---------- outside props: Mike's $1,000 (ten $100 bills) ----------
const NOTES=[];for(let i=0;i<10;i++){const n=MK.note(100,{curve:.004});scene.add(n);NOTES.push(n);}
const BIG=K.txt3('$1,000',.34,0x2fe06a,{ei:1.0});
// ================= TIMELINE =================
const TLN=await (await fetch(Q.get('tl')||'timeline_ep20full.json')).json(),CH=TLN.chunks,WS=TLN.words,DUR=TLN.dur;
const nw=x=>x.toLowerCase().replace(/[^a-z0-9]/g,'');
function FIND(ph,occ=0){const p=ph.split(/\s+/).map(nw);let c=0;for(let i=0;i+p.length<=WS.length;i++){if(p.every((w,j)=>nw(WS[i+j].w)===w)){if(c++===occ)return [i,i+p.length-1];}}console.error('phrase not found',ph);return [0,0];}
const T=(ph,o=0)=>WS[FIND(ph,o)[0]].s,TE=(ph,o=0)=>WS[FIND(ph,o)[1]].e;
const tThou=T('thousand dollars'),tInside=T('inside the'),tAtm=T('atm',0),tSucks=T('sucks him'),tFirst=T('first stop');
{const [a,b]=FIND('thousand dollars');for(let i=a;i<=b;i++)CH[i].t='';}   // the amount floats in 3D
// ================= CAST =================
const mike=await K.person('mike',null,AX-.25,0,AZ+.9,2.6,0x2f6fd6);
const mikeI=await K.person('mike',null,IN,0,0,Math.PI,0x2f6fd6);
const _v=V3();const wristW=(P_,sd='R')=>{const b=P_.BN['wrist'+sd];return b?b.getWorldPosition(_v).clone():P_.g.position.clone();};
// ================= LIGHT / POST (bright daylight, crisp, no haze) =================
const hdrD=await new RGBELoader().loadAsync('dl/kloofendal_clear_4k.hdr');hdrD.mapping=THREE.EquirectangularReflectionMapping;
scene.background=hdrD;scene.environment=hdrD;scene.environmentIntensity=.8;scene.fog=new THREE.Fog(0xcfe0f0,90,260);
const sun=new THREE.DirectionalLight(0xfff2de,3.4);sun.castShadow=true;sun.shadow.mapSize.set(LQ?2048:4096,LQ?2048:4096);Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:120});sun.shadow.bias=-.0004;sun.shadow.normalBias=.05;
sun.position.set(-20,26,30);sun.target.position.set(0,0,8);scene.add(sun);scene.add(sun.target);
const HEMI=new THREE.HemisphereLight(0xeaf3ff,0x6a6458,1.4);scene.add(HEMI);renderer.toneMappingExposure=1.25;
const cam=new THREE.PerspectiveCamera(45,W/H,.02,600);
const comp=new EffectComposer(renderer,new THREE.WebGLRenderTarget(W*PR,H*PR,{samples:LQ?0:4,type:THREE.HalfFloatType}));comp.setPixelRatio(PR);comp.setSize(W,H);comp.addPass(new RenderPass(scene,cam));
const OUT=new OutlinePass(new THREE.Vector2(W,H),scene,cam);Object.assign(OUT,{edgeStrength:6,edgeGlow:.6,edgeThickness:2.2,pulsePeriod:0});OUT.visibleEdgeColor.set(0x38e8ff);OUT.hiddenEdgeColor.set(0x38e8ff);comp.addPass(OUT);
comp.addPass(new UnrealBloomPass(new THREE.Vector2(W,H),.45,.18,1.3));comp.addPass(new OutputPass());
const GRADE=new ShaderPass({uniforms:{tDiffuse:{value:null},con:{value:1.12},sat:{value:1.12},vig:{value:.18}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform sampler2D tDiffuse;uniform float con,sat,vig;varying vec2 vUv;void main(){vec4 c=texture2D(tDiffuse,vUv);vec3 v=c.rgb;float l=dot(v,vec3(.2126,.7152,.0722));v=mix(vec3(l),v,sat);v=(v-.5)*con+.5;float d=distance(vUv,vec2(.5));v*=1.-vig*smoothstep(.35,.85,d);gl_FragColor=vec4(clamp(v,0.,1.),c.a);}'});comp.addPass(GRADE);
// ================= CAMERA =================
// outside: side view (Mike + ATM + $1,000) -> slow push -> dive into the cash slot -> white flash -> inside: track the raft along the belt
const tFeed=tThou-.05,tPull=tInside,tGone=tAtm+.15,tDive=tGone,tIn=tAtm+.3;
const sx=t=>{const a=sm(tIn,tSucks,t),b=sm(tSucks,tFirst+.4,t);return 7.5-4.0*a-6.5*b;};   // raft x on the belt (slow ride, then whoosh after "sucks")
const SH=[{t0:0,set:'out',keys:[
 [0,[5.9,2.2,12.9],[3.1,1.6,8.4],44],
 [tFeed,[5.4,2.0,12.1],[3.15,1.45,8.4],42],
 [tPull+.2,[4.9,1.6,11.0],[3.2,1.15,8.4],38],
 [tDive-.05,[3.6,1.05,9.4],[3.2,.92,8.3],32],
 [tIn,[3.22,.92,8.6],[3.2,.9,8.2],30]]},
 {t0:tIn,set:'in',o:[IN,0,0],keys:[[tIn,[3.2,3.6,-2.6],[0,2.0,0],56],[tIn+.7,[.8,3.3,-4.6],[0,1.9,0],46],[tSucks,[-1.2,3.1,-4.6],[0,1.9,0],44],[tSucks+.6,[-2.2,2.9,-4.2],[.3,1.9,0],46],[tFirst+.4,[-2.6,3.2,-5.0],[-.6,1.9,0],48]]}];
const RIDE=SH[1].keys;
const LOOK=V3();const FL=document.getElementById('fl');
// ================= ANIMATION =================
function animate(t){
 const inside=t>=tIn;
 FL.style.opacity=String(Math.max(0,1-Math.abs(t-tIn)/.14)*.95);   // white flash between outside and inside
 screenDraw(t>tFeed?1:0);SLOTLED.material.emissiveIntensity=t>tFeed&&t<tGone?(Math.sin(t*30)>0?2.4:.4):1.2;
 // ---- outside: Mike at the ATM, then pulled into the slot (shrinking) ----
 const M_=mike;K.relax(M_);K.idle(M_,t);
 const pull=sm(tPull,tGone,t);M_.g.visible=!inside&&pull<.995;
 if(M_.g.visible){const p0=V3(AX-.25,0,AZ+.9),p1=SLOT.clone().add(V3(0,-.02,0));
  M_.g.position.copy(p0).lerp(p1,Math.pow(pull,.7));M_.g.scale.setScalar(Math.max(.02,1-Math.pow(pull,.45)*.98));
  M_.g.rotation.set(-1.2*pull,2.6-.5*sm(tFeed,tPull,t)+3*pull,0);
  if(t<tFeed){K.arm(M_,'R',AD[0]+1.05,AD[2]-.25,.55);K.face(M_,{smile:.8});}
  else if(t<tPull){K.arm(M_,'R',AD[0]+1.2,AD[2]-.2,.3);K.face(M_,{jaw:.25,smile:.3});K.pose(M_,'head',.1,0,0);}
  else{K.armsUp(M_,1);K.face(M_,{jaw:.6});K.pose(M_,'head',-.2,0,0);}
  M_.g.updateMatrixWorld(true);}
 // the ten bills: fanned in his hand, then shot into the slot one by one
 const wr=M_.g.visible?wristW(M_,'R'):SLOT.clone();
 NOTES.forEach((n,i)=>{const ti=tFeed+i*.045,u=sm(ti,ti+.22,t);n.visible=!inside&&u<.98;if(!n.visible)return;
  const hand=wr.clone().add(V3(.03,.06+i*.004,.06));n.position.copy(hand).lerp(SLOT.clone().add(V3(0,0,-.1)),u);
  n.quaternion.copy(cam.quaternion);n.rotateZ(.25*(i/9-.5)*(1-u)+1.57*u);MK.flutter(n,t,i);});
 // $1,000 floats above (outside: over the ATM, inside: over Mike)
 {const a=pop(t,0,.25);BIG.visible=true;BIG.scale.setScalar(Math.max(.001,a)*(1+.05*Math.sin(t*5)));
  if(!inside)BIG.position.set(AX+.05,2.55-.38*sm(0,tFeed+.3,t),AZ+.6);else BIG.position.set(IN+sx(t),1.06+RH+2.0,0);BIG.quaternion.copy(cam.quaternion);}
 // ---- inside: Mike rides the raft along the belt ----
 const MI=mikeI;MI.g.visible=inside;RAFT.visible=inside;
 const x=sx(t),fast=sm(tSucks,tSucks+.3,t);
 RAFT.position.set(x,1.06,0);RAFT.rotation.z=.04*Math.sin(t*9)*(.4+fast);
 ROLL.forEach((r,i)=>{r.rotation.y=t*(i?-6:6);});
 if(inside){K.relax(MI);MI.g.position.set(IN+x,1.06+RH,.05);MI.g.rotation.y=Math.PI+.25*Math.sin(t*2.2);
  K.armsUp(MI,.85+.15*Math.sin(t*12));K.face(MI,{jaw:.55+.2*fast,smile:.7});K.pose(MI,'spine03',-.08-.1*fast,0,.06*Math.sin(t*7));K.pose(MI,'head',-.15,.15*Math.sin(t*3),0);
  MI.g.position.y+=.06*Math.abs(Math.sin(t*9));MI.g.updateMatrixWorld(true);}
 LOOSE.forEach((n,i)=>{n.visible=inside;if(!inside)return;const f=t-tIn+i*.35;n.position.set(x+4.5-((f*2.2)%9),2.0+1.8*Math.sin(f*1.7+i),1.1+1.3*Math.abs(Math.sin(i*2.3)));n.rotation.set(.5*Math.sin(f*1.3+i),Math.PI+.5*Math.sin(f*.9+i),f*.7+i);MK.flutter(n,t,i);});
 if(inside){const tt=Math.min(Math.max(t,RIDE[0][0]),RIDE[RIDE.length-1][0]),p=K.hv(tt,RIDE,k=>k[1]),l=K.hv(tt,RIDE,k=>k[2]),X=IN+sx(t);cam.position.set(X+p[0],p[1],p[2]);cam.lookAt(X+l[0],l[1],l[2]);cam.getWorldDirection(LOOK);}
 OUT.selectedObjects=[];story(t);
}
function story(t){
 // ---- light: the sun follows the camera (shadows stay sharp in every place) ----
 const gx=cam.position.x+LOOK.x*8,gz=cam.position.z+LOOK.z*8;sun.target.position.set(gx,0,gz);sun.position.set(gx-20,26,gz+22);sun.target.updateMatrixWorld();
}
