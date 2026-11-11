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
{const st=pbr('white_stucco',4,2,0xeee6d8);
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
const SLOTLED=K.add(K.B(.42,.015,.02),new THREE.MeshStandardMaterial({color:0x2fe06a,emissive:0x2fe06a,emissiveIntensity:.7}),0,.97,.4,ATM,false);
const SLOT=V3(AX,.9,AZ+.36);   // world point of the cash slot
// ---------- giant ATM interior: 3 simple tracks stacked top -> bottom (1 COUNT, 2 SCAN, 3 LOCKED BOX); few elements, calm colours ----------
const IN=300,IG=K.group(IN,0,0);
const YA=9.0,YB=5.0,YC=1.0;   // belt tops
{K.add(K.B(60,.2,60),K.M(0x5a6068,.7,.3),0,-.07,-20,IG,false);                                                  // floor
 K.add(new THREE.PlaneGeometry(80,40),K.M(0x1f3550,.85,.1),0,12,3.2,IG,false).rotation.y=Math.PI;            // plain navy back wall
 const rub=K.M(0x1b1c1e,.85),yel=K.M(0xe8b81a,.5),grey=K.M(0x8a9199,.4,.7);
 for(const y of[YA,YB,YC]){K.add(K.B(5.4,.3,1.6),rub,0,y-.15,0,IG);for(const z of[-.86,.86])K.add(K.B(5.4,.16,.08),yel,0,y+.05,z,IG);
  for(const x of[-2.4,2.4])K.add(K.B(.18,y-.3,.18),grey,x,(y-.3)/2,.9,IG);}
 // drop chutes joining the tracks (A -> B at the right of the screen, B -> C at the left)
}
// 1 COUNT: two steel rollers over track A
const ROLL=[];{const fr=K.M(0x2b2f35,.4,.7);for(const y of[YA+2.35,YA+3.0]){const r=K.add(K.CY(.3,.3,1.9,32),K.M(0xb4bbc3,.25,.9),-1.3,y,0,IG);r.rotation.x=Math.PI/2;ROLL.push(r);}
 K.add(K.B(.7,3.3,.12),fr,-1.3,YA+1.65,1.0,IG);}
// 2 SCAN: an arch with a soft green scan light over track B
const SCAN=K.group(0,YB,0,IG);{const fr=K.M(0x2b2f35,.4,.7);for(const x of[-1.05,1.05])K.add(K.B(.22,2.6,.3),fr,x,1.3,-.2,SCAN);K.add(K.B(2.32,.26,.3),fr,0,2.6,-.2,SCAN);}
const BEAM=K.add(new THREE.PlaneGeometry(1.9,2.4),new THREE.MeshBasicMaterial({color:0x2fe06a,transparent:true,opacity:.14,depthWrite:false,side:THREE.DoubleSide}),0,1.25,0,SCAN,false);BEAM.position.z=-.2;
// 3 LOCKED BOX: steel box on track C (opening faces the incoming raft)
const BOX=K.group(-1.6,YC,0,IG);{const st=K.M(0x6f767e,.35,.85);K.add(K.B(1.9,1.9,.1),st,0,.95,-.85,BOX);K.add(K.B(1.9,1.9,.1),st,0,.95,.85,BOX);K.add(K.B(.1,1.9,1.8),st,-.95,.95,0,BOX);K.add(K.B(1.9,.1,1.8),st,0,1.9,0,BOX);}
const LABS=[['1  COUNT',YA],['2  SCAN',YB],['3  LOCKED BOX',YC]].map(([s_,y])=>{const m=K.txt3(s_,.42,0xffffff,{ei:.05,p:IG});m.position.set(.9,y+2.0,-1.3);m.visible=false;return m;});
for(const [c,x,y,z,i] of[[0xffffff,0,13,-6,40],[0xfff1d6,0,7,-6,30],[0xffffff,0,3,-6,26]]){const l=new THREE.PointLight(c,i,24,1.2);l.position.set(x,y,z);IG.add(l);}
// Mike's raft: ten $100 bills (= $1,000, no strap band)
const GS=9,RAFT=K.group(0,0,0,IG);for(let i=0;i<10;i++){const n=MK.note(100,{curve:0});n.scale.setScalar(GS);n.rotation.set(-Math.PI/2,0,Math.PI+.05*Math.sin(i*2.7));n.position.set(.04*Math.sin(i*1.9),.01+i*.011,.03*Math.cos(i*1.3));RAFT.add(n);}
const RH=.12;
// ---------- outside props: Mike's $1,000 (ten $100 bills) ----------
const NOTES=[];for(let i=0;i<10;i++){const n=MK.note(100,{curve:.004});scene.add(n);NOTES.push(n);}
const BIG=K.txt3('$1,000',.34,0x22c55e,{ei:.18});
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
comp.addPass(new UnrealBloomPass(new THREE.Vector2(W,H),.18,.15,1.7));comp.addPass(new OutputPass());
const GRADE=new ShaderPass({uniforms:{tDiffuse:{value:null},con:{value:1.12},sat:{value:1.12},vig:{value:.18}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform sampler2D tDiffuse;uniform float con,sat,vig;varying vec2 vUv;void main(){vec4 c=texture2D(tDiffuse,vUv);vec3 v=c.rgb;float l=dot(v,vec3(.2126,.7152,.0722));v=mix(vec3(l),v,sat);v=(v-.5)*con+.5;float d=distance(vUv,vec2(.5));v*=1.-vig*smoothstep(.35,.85,d);gl_FragColor=vec4(clamp(v,0.,1.),c.a);}'});comp.addPass(GRADE);
// ================= CAMERA =================
// outside: side view (Mike + ATM + $1,000) -> slow push -> dive into the cash slot -> white flash -> inside: track the raft along the belt
const tFeed=tThou-.05,tPull=tInside,tGone=tAtm+.15,tDive=tGone,tIn=tAtm+.3;
const tWide=T('mike hits')+.35,tLab=tWide+.1;
const sx=t=>{const a=sm(tIn,tSucks,t),b=sm(tSucks,tFirst+.4,t);return 2.0-.5*a-2.2*b;};   // raft x on track A (slow, then whoosh to the counter)
const SH=[{t0:0,set:'out',keys:[
 [0,[5.9,2.2,12.9],[3.1,1.6,8.4],44],
 [tFeed,[5.4,2.0,12.1],[3.15,1.45,8.4],42],
 [tPull+.2,[4.9,1.6,11.0],[3.2,1.15,8.4],38],
 [tDive-.05,[3.6,1.05,9.4],[3.2,.92,8.3],32],
 [tIn,[3.22,.92,8.6],[3.2,.9,8.2],30]]},
 {t0:tIn,set:'in',o:[IN,0,0],keys:[
 [tIn,[sx(tIn)+1.8,YA+2.6,-2.4],[sx(tIn),YA+1.0,0],56],
 [tIn+.75,[sx(tIn+.75)+.5,YA+1.3,-3.6],[sx(tIn+.75),YA+.95,0],44],
 [tWide,[0,5.3,-19.2],[0,5.0,0],50],
 [tSucks-.05,[0,5.3,-18.6],[0,5.0,0],50],
 [tSucks+.55,[sx(tSucks+.55)-.6,YA+1.4,-4.6],[sx(tSucks+.55)-.3,YA+1.0,0],46],
 [tFirst+.4,[sx(tFirst+.4)-.9,YA+1.5,-4.4],[sx(tFirst+.4)-.6,YA+1.2,0],46]]}];
const LOOK=V3();const FL=document.getElementById('fl');
// ================= ANIMATION =================
function animate(t){
 const inside=t>=tIn;
 FL.style.opacity=String(Math.max(0,1-Math.abs(t-tIn)/.14)*.95);   // white flash between outside and inside
 screenDraw(t>tFeed?1:0);SLOTLED.material.emissiveIntensity=t>tFeed&&t<tGone?(Math.sin(t*30)>0?1.2:.3):.7;
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
 {const a=pop(t,0,.25);BIG.visible=(!inside&&t<tPull+.15)||(inside&&(t<tWide-.1||t>tSucks+.4));BIG.scale.setScalar(Math.max(.001,a)*(1+.05*Math.sin(t*5)));
  if(!inside)BIG.position.set(AX+.05,2.55-.38*sm(0,tFeed+.3,t),AZ+.6);else BIG.position.set(IN+sx(t),YA+RH+2.0,0);BIG.quaternion.copy(cam.quaternion);}
 // ---- inside: close ride -> pull back to show the 3 tracks (labels 1-2-3 pop) -> whoosh toward the counter ----
 const MI=mikeI;MI.g.visible=inside;RAFT.visible=inside;
 const x=sx(t),fast=sm(tSucks,tSucks+.3,t);
 RAFT.position.set(x,YA+.02,0);RAFT.rotation.z=.03*Math.sin(t*8)*(.3+fast);
 ROLL.forEach((r,i)=>{r.rotation.y=t*(i?-5:5);});BEAM.material.opacity=.1+.06*Math.sin(t*6);
 LABS.forEach((m,i)=>{const a=pop(t,tLab+i*.2,.25)*(1-sm(tSucks+.2,tSucks+.5,t));m.visible=a>.01;m.scale.setScalar(Math.max(.001,a));m.quaternion.copy(cam.quaternion);});
 if(inside){K.relax(MI);K.idle(MI,t);MI.g.position.set(IN+x,YA+.02+RH,.05);
  if(t<tWide-.2){MI.g.rotation.y=Math.PI+.3;K.arm(MI,'L',AD[0]+.2,AD[2]-1.3,.2);K.arm(MI,'R',AD[0]+.2,AD[2]-1.3,.2);K.pose(MI,'spine03',.15,0,.08*Math.sin(t*6));K.face(MI,{jaw:.45,smile:.6});}
  else if(t<tSucks){MI.g.rotation.y=Math.PI-.5;K.point(MI,'R',1);K.pose(MI,'head',.25,-.3,0);K.face(MI,{jaw:.2,smile:.9});}
  else{MI.g.rotation.y=Math.PI;K.armsUp(MI,.9+.1*Math.sin(t*12));K.pose(MI,'spine03',-.18*fast,0,0);K.face(MI,{jaw:.65});}
  MI.g.updateMatrixWorld(true);}
 OUT.selectedObjects=[];story(t);
}
function story(t){
 // ---- light: the sun follows the camera (shadows stay sharp in every place) ----
 const gx=cam.position.x+LOOK.x*8,gz=cam.position.z+LOOK.z*8;sun.target.position.set(gx,0,gz);sun.position.set(gx-20,26,gz+22);sun.target.updateMatrixWorld();
}
