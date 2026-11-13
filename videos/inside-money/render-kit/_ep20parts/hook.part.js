// ===================== EP20 hidden cash -> IRS raid (GTA 6 cinematic hook: Vice City sunset, palms, letterbox, WANTED stars) =====================
const lawn=add(B(600,.2,600),pbr('leafy_grass',120,120,0x86d24a),0,-.1,0,scene,false);
street(0,19,400);
const PIT={x:.75,z:.35,w:.78,d:.56};      // hole under the living-room floorboards (house-local = world, house at origin)
const PINK={siding:'white_planks_clean',col:0xf4b6c8,roof:'grey_roof_tiles',rc:0x8d929a,sh:0x2a6f7a,inner:0xf3e3c8,simple:true,flag:false,pit:PIT,noPicket:true};
const mikeH=house(0,0,0,PINK,true,1);      // cutaway: ground-floor front wall removed
house(-22,0,0,{siding:'white_planks_clean',col:0xb8e6dc,roof:'roof_07',rc:0xc79b84,sh:0xffffff,inner:0xece4d4,simple:true,flag:false},false,-1);
house(22,0,0,{siding:'white_planks_clean',col:0xfff1b8,roof:'grey_roof_tiles',rc:0x8d929a,sh:0x2a6f7a,inner:0xece4d4,simple:true,flag:false},false,1);
house(-44,0,0,SIMPLE5(STY[4]),false,1);house(44,0,0,SIMPLE5(STY[1]),false,-1);
function SIMPLE5(o){return Object.assign({},o,{simple:true,flag:false});}
// Vice City palms (procedural: curved ringed trunk + drooping fronds)
const FROND=(()=>{const g=new THREE.PlaneGeometry(.55,3.2,4,16);g.translate(0,1.6,0);const p=g.attributes.position;
 for(let i=0;i<p.count;i++){const y=p.getY(i),x=p.getX(i),u=y/3.2;p.setX(i,x*(1-u*.85)*(1+.3*Math.sin(u*3)));p.setZ(i,-u*u*1.8+Math.abs(x)*.35);}g.computeVertexNormals();return g;})();
const FM=new THREE.MeshStandardMaterial({color:0x2f8a3a,roughness:.7,side:THREE.DoubleSide}),TRK=new THREE.MeshStandardMaterial({color:0xa98a64,roughness:.9,map:tex(64,256,x=>{x.fillStyle='#b39572';x.fillRect(0,0,64,256);x.fillStyle='#7d6346';for(let y=0;y<256;y+=16)x.fillRect(0,y,64,4);})});
function palm(x,z,h,lean=.12,ry=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);let px=0,py=0;const n=9;
 for(let i=0;i<n;i++){const u=i/n,seg=h/n,r=.2-.07*u;const m=add(CY(r*.92,r,seg*1.04,12),TRK,px,py+seg/2,0,g);m.rotation.z=-lean*u*1.6;px+=Math.sin(lean*u*1.6)*seg;py+=Math.cos(lean*u*1.6)*seg;}
 const top=new THREE.Group();top.position.set(px,py,0);g.add(top);for(let i=0;i<11;i++){const f=new THREE.Mesh(FROND,FM);f.castShadow=true;f.rotation.set(0,i/11*Math.PI*2+i*.3,0);const fr=new THREE.Group();fr.add(f);f.rotation.x=0;fr.rotation.y=i/11*Math.PI*2;f.rotation.x=1.05+.25*Math.sin(i*1.7);top.add(fr);}
 add(new THREE.SphereGeometry(.28,12,10),M(0x5a4a2a,.8),0,0,0,top);return g;}
for(const [x,z,h,l] of[[-7.5,11.6,8.5,.16],[7.2,11.8,9.5,-.12],[-14.5,10.5,10,.1],[14.6,10.8,8,-.18],[-30,11,9,.14],[30,11.5,10,-.1],[-11,26,9,.12],[10,26.5,10.5,-.1],[0,27,8.5,.08],[-26,27,9.5,.15],[26,27,9,-.14]])palm(x,z,h,l,x*.3);
for(const [x,z] of[[-4.2,6.2],[3.6,6.2]])model('shrub_01',x,0,z,.9,x);
const {core}=await import('./scenekit/core.js');const K=await core(THREE,scene,{TL});
const {sm,pop,AD}=K;
// ================= TIMELINE =================
const TLN=await (await fetch(Q.get('tl')||'timeline_ep20.json')).json(),CH=TLN.chunks,WS=TLN.words,DUR=TLN.dur;
const nw=x=>x.toLowerCase().replace(/[^a-z0-9]/g,'');
function FIND(ph,occ=0){const p=ph.split(/\s+/).map(nw);let c=0;for(let i=0;i+p.length<=WS.length;i++){if(p.every((w,j)=>nw(WS[i+j].w)===w)){if(c++===occ)return [i,i+p.length-1];}}console.error('phrase not found',ph);return [0,0];}
const T=(ph,o=0)=>WS[FIND(ph,o)[0]].s,TE=(ph,o=0)=>WS[FIND(ph,o)[1]].e;
const tHide=T('hide'),tAmt=T('one hundred thousand'),tFloor=T('floor'),tSo=T('so the'),tIRS=T('irs'),tSees=T('sees'),tBuilt=T('you just built'),tTax=T('tax evasion'),tBut=T('but cash');
{const [a,b]=FIND('one hundred thousand dollars');CH[a].t='$100,000';for(let i=a+1;i<=b;i++)CH[i].t='$100,000';}
// ================= ROOM (cutaway living room, warm practical light) =================
const FY=.52;   // floor top
{const sofa=model('Sofa_01',-2.4,FY,-2.75,.85,0);model('Television_01',3.6,FY,-2.6,1.1,-.5);model('potted_plant_01',-4.0,FY,-3.1,1.2,0);
 const rug=add(new THREE.PlaneGeometry(2.6,1.7),new THREE.MeshStandardMaterial({map:tex(256,170,x=>{x.fillStyle='#d9643a';x.fillRect(0,0,256,170);x.strokeStyle='#f2c14e';x.lineWidth=10;x.strokeRect(14,14,228,142);x.strokeStyle='#2a6f7a';x.lineWidth=6;x.strokeRect(34,34,188,102);}),roughness:.95}),-2.2,FY+.005,-1.2,scene,false);rug.rotation.x=-Math.PI/2;
 const rl=new THREE.PointLight(0xffd6a0,9,9,1.3);rl.position.set(0,2.7,0);scene.add(rl);}
// the hole: dark plank walls + floor, filled by $20 straps ($100,000 = 50 straps of $2,000)
{const pw=pbr('wood_planks',1,1,0x4a3424);const H0=-.02,Hh=FY-H0;add(B(PIT.w,.02,PIT.d),pw,PIT.x,H0+.01,PIT.z,scene,false);
 for(const s of[-1,1]){add(B(PIT.w,Hh,.02),pw,PIT.x,H0+Hh/2,PIT.z+s*(PIT.d/2-.01),scene,false);add(B(.02,Hh,PIT.d),pw,PIT.x+s*(PIT.w/2-.01),H0+Hh/2,PIT.z,scene,false);}}
const STRAPS=[];{const NW=MK.NW,NH=MK.NH,NT=MK.NT;let k=0;
 for(let ly=0;ly<4&&k<50;ly++)for(let iz=0;iz<5&&k<50;iz++)for(let ix=0;ix<3&&k<50;ix++){const s=MK.strap(20);s.visible=false;scene.add(s);
  const bx=PIT.x-NW+ix*NW,bz=PIT.z-2*NH+iz*NH;STRAPS.push({m:s,to:V3(bx+(Math.sin(k*7.1)*.012),.05+ly*NT*1.05+NT/2,bz),ry:Math.sin(k*3.3)*.06,k});k++;}}
// lifted floorboards leaning on the wall, slide back over the hole on "so the IRS"
const BOARDS=[];for(let i=0;i<4;i++){const b=add(B(.2,.05,PIT.d+.06),pbr('oak_wood_planks',.3,1,0xc29466),0,0,0,scene,true);BOARDS.push(b);}
const BAG=K.group(-.15,FY,.95);{K.add(K.RB(.62,.32,.34,.12),K.M(0x16181c,.8),0,.16,0,BAG);K.add(new THREE.TorusGeometry(.16,.02,8,20,Math.PI),K.M(0x16181c,.8),0,.32,0,BAG);
 const top=MK.strap(20);top.position.set(0,.33,0);BAG.add(top);}
const HAND=MK.strap(20);HAND.visible=false;scene.add(HAND);
// floating 3D numbers / words (readable on mute)
const AMT=K.txt3('$100,000',.2,0x2fe06a,{ei:1.0});AMT.visible=false;
const EVA=K.txt3('TAX EVASION',.48,0xff1a1a,{ei:1.25});EVA.visible=false;
// ================= THE RAID: IRS SUVs + police, IRS agents =================
const {vehicle}=await import('./scenekit/vehicles.js');
const IRST=tex(512,160,x=>{x.clearRect(0,0,512,160);x.fillStyle='#ffd21a';x.font='800 120px Mont';x.textAlign='center';x.fillText('IRS',256,128);});
const IRSM=new THREE.MeshStandardMaterial({map:IRST,transparent:true,roughness:.4,emissive:0xffd21a,emissiveMap:IRST,emissiveIntensity:.25});
const CARS=[['suv',-52,13.0,0,-4.7,.45],['suv',52,13.9,Math.PI,4.7,-.45],['police',-64,17.4,0,-9.8,.25],['police',64,20.6,Math.PI,9.6,-.25]].map(([ty,from,z,ry,to,skid],i)=>{
 const v=vehicle(K,ty,{x:from,z,ry,color:ty==='suv'?0x0d0f12:undefined});v.from=from;v.to=to;v.ry0=ry;v.skid=skid;v.z=z;v.i=i;
 if(ty==='suv'){for(const s of[-1,1]){const m=K.add(new THREE.PlaneGeometry(1.3,.4),IRSM,-.3,.92,s*1.0,v.root,false);if(s<0)m.rotation.y=Math.PI;}
  v.L=[[0xff1a1a,-.35],[0x1a4dff,.35]].map(([c,zz])=>{const l=new THREE.PointLight(c,0,14,1.3);l.position.set(2.0,1.0,zz);v.root.add(l);const b=K.add(K.B(.05,.08,.28),new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:.2}),2.46,.95,zz,v.root,false);return {l,b};});}
 return v;});
const AG=[];{const rec={'polo|cargo|suit|sportsuit|jacket':0x141c2e};const who=['guard','printer','seller','manager'];
 for(let i=0;i<4;i++){const P=await K.person(who[i],rec,0,0,30,Math.PI,0x141c2e);P.g.traverse(o=>{if(o.isMesh&&/polo|cargo|suit|jacket/i.test(o.name+o.material.name)){o.material.map=null;o.material.color.set(0x141c2e);o.material.needsUpdate=true;}});const bp=K.add(new THREE.PlaneGeometry(.5,.17),IRSM,0,1.22,-.2,P.g,false);bp.rotation.y=Math.PI;
  const car=CARS[i<2?0:1];AG.push({P,car,x0:car.to+(i%2?.6:-.6),z0:car.z-1.2,x1:[-1.55,-.5,.5,1.55][i],z1:10.4+(i%2)*.35,dl:i*.12});}}
const mike=await K.person('mike',null,-.35,FY,.35,.25,0x2f6fd6);
const _v=V3();const wristW=(P_,sd='R')=>{const b=P_.BN['wrist'+sd];return b?b.getWorldPosition(_v).clone():P_.g.position.clone();};
// ================= LIGHT / POST (Vice City golden hour, crisp, no haze) =================
scene.environmentIntensity=.55;scene.fog=new THREE.Fog(0xf08a7a,70,260);
scene.background=K.tex(64,1024,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#1e1f5a');g.addColorStop(.3,'#5b3b8c');g.addColorStop(.42,'#c8508a');g.addColorStop(.49,'#ff7a5c');g.addColorStop(.53,'#ffb36b');g.addColorStop(.57,'#ffd88f');g.addColorStop(1,'#ffd88f');x.fillStyle=g;x.fillRect(0,0,w,h);});
scene.background.mapping=THREE.EquirectangularReflectionMapping;
const sun=new THREE.DirectionalLight(0xff9a5a,3.4);sun.castShadow=true;sun.shadow.mapSize.set(LQ?2048:4096,LQ?2048:4096);Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:120});sun.shadow.bias=-.0004;sun.shadow.normalBias=.05;
sun.position.set(-30,12,30);sun.target.position.set(0,0,8);scene.add(sun);scene.add(sun.target);
const HEMI=new THREE.HemisphereLight(0xffb0a0,0x2a3550,.7);scene.add(HEMI);renderer.toneMappingExposure=1.08;
const cam=new THREE.PerspectiveCamera(45,W/H,.05,600);
const comp=new EffectComposer(renderer,new THREE.WebGLRenderTarget(W*PR,H*PR,{samples:LQ?0:4,type:THREE.HalfFloatType}));comp.setPixelRatio(PR);comp.setSize(W,H);comp.addPass(new RenderPass(scene,cam));
comp.addPass(new UnrealBloomPass(new THREE.Vector2(W,H),.34,.18,1.45));comp.addPass(new OutputPass());
// grade: GTA-style teal shadows / warm highlights, strong contrast, vignette
const GRADE=new ShaderPass({uniforms:{tDiffuse:{value:null},con:{value:1.12},sat:{value:1.16},vig:{value:.28}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform sampler2D tDiffuse;uniform float con,sat,vig;varying vec2 vUv;void main(){vec4 c=texture2D(tDiffuse,vUv);vec3 v=c.rgb;float l=dot(v,vec3(.2126,.7152,.0722));v=mix(vec3(l),v,sat);v+=mix(vec3(-.02,.015,.03),vec3(.035,.01,-.025),smoothstep(.2,.8,l));v=(v-.5)*con+.5;float d=distance(vUv,vec2(.5));v*=1.-vig*smoothstep(.35,.85,d);gl_FragColor=vec4(clamp(v,0.,1.),c.a);}'});comp.addPass(GRADE);
// ================= CAMERA (one continuous move): inside the cutaway on the hole -> pull out through the open front to the street -> low GTA angle behind the agents =================
const SH=[{t0:0,keys:[
 [0,[.5,2.0,6.4],[.15,1.15,.4],46],
 [tFloor,[.55,1.85,5.1],[.2,1.0,.4],43],
 [tSo+.25,[.5,1.9,4.9],[.2,1.05,.4],43],
 [tSees+.1,[9.0,4.6,27.5],[0,2.2,9],50],
 [tBuilt+.15,[2.2,1.75,19.0],[0,2.6,4.5],50],
 [tBut,[1.6,1.7,17.8],[0,2.7,4.5],48]]}];
const LOOK=V3();
// ================= ANIMATION =================
const tDrop0=.05,tDrop1=tSo-.05;   // straps fly from Mike's hand into the hole
function animate(t){
 // straps: each one arcs from the bag/hand into its slot
 const n=STRAPS.length;STRAPS.forEach((s,i)=>{const t0=tDrop0+(tDrop1-tDrop0)*Math.pow(i/n,.9),u=Math.min(1,Math.max(0,(t-t0)/.26));s.m.visible=t>=t0;if(!s.m.visible)return;
  const a=V3(-.05,FY+.85,.62);s.m.position.set(a.x+(s.to.x-a.x)*u,a.y+(s.to.y-a.y)*u+.35*u*(1-u)*4*.25,a.z+(s.to.z-a.z)*u);s.m.rotation.set((1-u)*2.2,s.ry+(1-u)*1.4,(1-u)*.8);});
 // floorboards: leaning stack beside the hole -> slide back over it on "so the IRS"
 const cv=sm(tSo,tSo+.55,t);BOARDS.forEach((b,i)=>{const lean=V3(PIT.x+.62,FY+.32,PIT.z-.35+i*.07),flat=V3(PIT.x-PIT.w/2+.1+i*.193,FY+.02,PIT.z),u=sm(tSo+i*.09,tSo+.32+i*.09,t);
  b.position.lerpVectors(lean,flat,u);b.position.y+=.18*Math.sin(u*Math.PI);b.rotation.set(0,0,(1-u)*1.25);});
 // $100,000 green over the hole, TAX EVASION red over the house
 {const a=pop(t,tAmt,.3)*(1-sm(tSees,tSees+.25,t));AMT.visible=a>.01;AMT.scale.setScalar(Math.max(.001,a));AMT.position.set(PIT.x-.1,FY+.85,PIT.z+.2);AMT.quaternion.copy(cam.quaternion);}
 {const e=pop(t,tTax,.32);EVA.visible=e>.01;EVA.scale.setScalar(Math.max(.001,e)*(1+.04*Math.sin(t*9)*e));EVA.position.set(0,4.55,7.4);EVA.quaternion.copy(cam.quaternion);}
 // cars race in and skid (GTA), lights flash
 for(const v of CARS){const t0=tIRS-.35+v.i*.1,t1=tSees-.1+v.i*.08,u=sm(t0,t1,t),e=1-Math.pow(1-Math.min(1,Math.max(0,(t-t0)/(t1-t0))),2.2);
  v.root.position.x=v.from+(v.to-v.from)*e;v.root.rotation.y=v.ry0+v.skid*sm(t1-.35,t1,t);v.root.visible=t>t0-.05;v.update(t,true);
  if(v.L){const ph=Math.sin(t*Math.PI*2*3.2+v.i)>0;v.L[0].l.intensity=ph?40:3;v.L[1].l.intensity=ph?3:40;v.L[0].b.material.emissiveIntensity=ph?5:.2;v.L[1].b.material.emissiveIntensity=ph?.2:5;}}
 // agents jump out and run to the lawn, backs to the camera (IRS on the jackets), arms pointed at the house
 for(const a of AG){const P=a.P,tA=tSees-.1+a.dl*.6,u=sm(tA,tA+.7,t);K.relax(P);P.g.visible=t>tA;
  P.g.position.set(a.x0+(a.x1-a.x0)*u,0,a.z0+(a.z1-a.z0)*u);{const rr=Math.atan2(a.x1-a.x0,a.z1-a.z0),f=sm(.8,1,u);P.g.rotation.y=rr+(Math.PI-rr)*f;}
  if(u<1&&u>0)K.walk(P,t*1.45,.55);else{K.idle(P,t,a.dl*9);const pt=sm(tA+.75,tA+.95,t);K.point(P,'R',pt);K.point(P,'L',pt*.9);}}
 // Mike: tosses straps (left arm), smug as the boards close, hears the sirens -> turns to the street -> hands up
 const M_=mike;K.relax(M_);K.idle(M_,t);M_.g.position.set(-.35,FY,.35);
 const toss=t<tSo?Math.max(0,Math.sin(t*9)):0;if(t<tSo){K.arm(M_,'L',AD[0]+.7+.5*toss,AD[2]-.25,.6-.4*toss);K.pose(M_,'spine03',.18,-.25,0);K.face(M_,{smile:.6});}
 const smug=K.win(t,tSo+.1,tIRS+.35,.12);if(smug>0){K.shrug(M_,smug*.8);K.face(M_,{smile:1.1*smug});}
 const turn=sm(tIRS+.25,tIRS+.6,t);const look=K.win(t,tIRS+.2,tBuilt-.2,.15);if(look>0)K.pose(M_,'head',0,-.6*look,0);M_.g.rotation.y=.25+(-.25)*turn;
 const up=sm(tBuilt-.25,tBuilt+.1,t);if(up>0){K.armsUp(M_,up);K.face(M_,{jaw:.5*up});K.pose(M_,'head',-.05*up,.08*Math.sin(t*6)*up,0);}
 M_.g.updateMatrixWorld(true);
 const wl=wristW(M_,'L');HAND.visible=t<tSo-.1;if(HAND.visible){HAND.position.copy(wl).add(V3(.03,-.02,.05));HAND.rotation.set(.3,.4,0);}
 // GTA HUD: wanted stars fill one by one from the sirens to "evasion", flash red/blue when full
 const stars=Math.min(5,Math.floor(Math.max(0,(t-tIRS)/((tTax+.2-tIRS)/5))+(t>=tIRS?1:0)));
 STAR.forEach((s,i)=>{const on=i<stars,full=stars>=5;s.style.color=on?(full?(Math.sin(t*14)>0?'#ff3b3b':'#4d7bff'):'#ffffff'):'rgba(255,255,255,.18)';s.style.transform=on&&t-tIRS-(i*(tTax+.2-tIRS)/5)<.12?'scale(1.35)':'scale(1)';});
 HUD.style.opacity=String(sm(tIRS-.1,tIRS+.1,t));
}
const story=()=>{};
