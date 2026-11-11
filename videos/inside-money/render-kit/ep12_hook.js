// ================= EP12 HOOK v3 (user feedback 2026-11-04): ONE continuous shot, readable with NO sound =================
// "What if a criminal washed his dirty money, then deposited it at the bank? Would they... catch him?"
// Bright Zack-blue cutaway room with ONLY: a big washing machine (screen left), the masked man (centre, cyan rim light),
// a laundry basket heaped with DIRTY $10,000 straps (screen right, front). He shoves fat dirty stacks into the drum -> brown water
// spins -> clears -> door opens, CLEAN glowing stacks fly into his open bag (the clean money is visible inside) -> he picks it up,
// walks out -> the camera pulls out of the cutaway: the BANK is the next building, its CCTV turns to him, red light on "catch him".
// The story (ep12_story.js) is appended inside this block by make_ep12.py.
const H12=!Q.get('lab');let hook12=()=>{},CK12;
const TL12=await (await fetch('timeline_ep12.json')).json();
const W12=w=>{const k=TL12.words.find(x=>x.w.toLowerCase().replace(/[^a-z]/g,'')===w);return k?k.s:0;};
if(H12){CH.length=0;CH.push(...TL12.chunks);}
{
const tCrim=W12('criminal'),tWash=W12('washed'),tDirty=W12('dirty'),tThen=W12('then'),tDep=W12('deposited'),tBank=W12('bank'),tWould=W12('would'),tCatch=W12('catch');
const RX=110,RZ=15,BX=RX+5.95;
const ROOM=SK.darkRoom(RX,RZ);scene.add(ROOM.g);const BANK=SK.bankFront(BX,RZ+.1,{name:'BANK'});scene.add(BANK.g);
add(B(30,.12,2.6),pbr('concrete_pavement',10,1),RX+6,.06,RZ-1.3,scene,false);add(B(30,.14,.18),M(0xbdb8ae,.7),RX+6,.07,RZ-2.6,scene,false);   // sidewalk + kerb
add(B(30,.04,6),pbr('worn_asphalt',8,1.6),RX+6,.02,RZ-5.7,scene,false);
// big washer, screen left (camera looks +z: +x = screen left)
const WS=1.35,WSH=SK.washer();WSH.scale.setScalar(WS);WSH.position.set(RX+.6,0,RZ+1.95);scene.add(WSH);const WU=WSH.userData;
WSH.traverse(o=>{if(o.isMesh){const a=Array.isArray(o.material)?o.material:[o.material];a.forEach(m=>{m.envMapIntensity=.5;});}});
for(let i=0;i<12;i++){const n=MNY.note(100,{curve:.03});const a=i*2.3,r=.05+((i*.37)%1)*.12;n.position.set(Math.cos(a)*r,Math.sin(a)*r,-.08+((i*.61)%1)*.22);n.rotation.set(Math.sin(i)*1.2,Math.cos(i*1.7)*1.4,a);WU.notes.add(n);}
SK.dirty(WU.notes,1);
const DRUM_W=V3(RX+.6,WU.cz*WS,RZ+1.95+WU.front*WS+.06);   // mouth of the drum
// basket of dirty straps (screen right, in front), the two fat stacks he carries, the open bag on the floor
const BSK=SK.basket({n:16});BSK.position.set(RX-.78,0,RZ+1.2);SK.dirty(BSK,1);scene.add(BSK);
const HELD=[0,1].map(i=>{const m=MNY.brick(100,{nx:1,ny:6,nz:2});SK.dirty(m,1);scene.add(m);return m;});
const BAG=SK.duffel({open:1,straps:6});BAG.position.set(RX-.15,0,RZ+.8);BAG.rotation.y=.2;scene.add(BAG);
BAG.userData.straps.forEach(m=>{m.material=(Array.isArray(m.material)?m.material:[m.material]).map(x=>{const c=x.clone();if(c.emissive){c.emissive.set(0xffffff);c.emissiveMap=c.map;c.emissiveIntensity=.06;}return c;});m.visible=false;});
const CLEAN=[0,1,2].map(i=>{const m=MNY.brick(100,{nx:1,ny:5,nz:2,glow:.07});scene.add(m);return m;});
// the masked man: three-quarter view, facing the washer
const MRY=Math.PI/2+.45,MP=V3(RX-.18,0,RZ+1.62);
const MA=person('masked',MP.x,0,MP.z,MRY);styleMasked(MA);FK.rig(MA,{iris:'#4a3a2a'});
MA.g.traverse(o=>{if(o.isMesh&&/sweater/i.test(o.name+o.material.name))o.material.color.set(0x4a4f5a);if(o.isMesh&&/cargo/i.test(o.name+o.material.name))o.material.color.set(0x23262c);});   // charcoal sweater: reads against the blue wall
const MAMATS=[];MA.g.traverse(o=>{if(o.isMesh)MAMATS.push(o.material);});
const FWD=V3(Math.sin(MRY),0,Math.cos(MRY)),RGT=V3(-Math.cos(MRY),0,Math.sin(MRY));   // body forward / right (forward x up)
const hands=(c)=>[c.clone().addScaledVector(RGT,.16),c.clone().addScaledVector(RGT,-.16)];   // [right, left] targets around a held object
const HOLD_C=MP.clone().addScaledVector(FWD,.42).setY(1.05),PUSH_C=DRUM_W.clone().addScaledVector(FWD,-.12).setY(DRUM_W.y+.05),DOWN_C=V3(BSK.position.x+.2,.55,BSK.position.z+.15);
const solve2=c=>{relax(MA);const [r,l]=hands(c);const R=solveReach(MA,'R',r);relax(MA);const L=solveReach(MA,'L',l);relax(MA);return {R,L};};
const A_HOLD=solve2(HOLD_C),A_PUSH=solve2(PUSH_C),A_DOWN=solve2(DOWN_C);
const lerpA=(a,b,k)=>({ux:a.ux+(b.ux-a.ux)*k,uz:a.uz+(b.uz-a.uz)*k,lx:a.lx+(b.lx-a.lx)*k}),REL={ux:AD[0],uz:AD[2],lx:0},CARRY={ux:AD[0]+.05,uz:AD[2]-.5,lx:.15};
// walk: out of the room, along the sidewalk, through the bank's open doorway, to teller window 1
const CNTZ=RZ+.1+BANK.counterZ,WIN1=BX-1.3;
const PATH=[MP.clone(),V3(RX-.1,0,RZ+.35),V3(RX+1.3,0,RZ-.75),V3(BX-.15,0,RZ-.95),V3(BX,0,RZ+.7),V3(WIN1,0,CNTZ-.7)];
const SEG=[];let LEN=0;for(let i=1;i<PATH.length;i++){const d=PATH[i].distanceTo(PATH[i-1]);SEG.push(d);LEN+=d;}
const at=s=>{s=Math.max(0,Math.min(LEN,s));for(let i=0;i<SEG.length;i++){if(s<=SEG[i]||i===SEG.length-1){const k=Math.min(1,s/SEG[i]);return [PATH[i].clone().lerp(PATH[i+1],k),Math.atan2(PATH[i+1].x-PATH[i].x,PATH[i+1].z-PATH[i].z)];}s-=SEG[i];}};
const tPick=tDep+.42,tWalk=tPick+.25,SPEED=2.2,T_IN=tWalk+LEN/SPEED;   // T_IN = he reaches the counter
const DOOR_T=tWalk+(SEG[0]+SEG[1]+SEG[2]+SEG[3]*.6)/SPEED;   // when he reaches the doorway
const bagIn=V3(BAG.position.x,.3,BAG.position.z);
hook12=function(t){
 // washer: open while he loads, shut + spin, brown -> clear, open
 WU.open(1-sm(tWash+.45,tDirty-.05,t)+sm(tThen+.02,tThen+.25,t));const sp=sm(tDirty-.1,tDirty+.12,t)*(1-sm(tThen-.12,tThen+.02,t));WU.spin(t,.15+sp*1.9);
 const clean=sm(tThen-.32,tThen,t);WU.setDirt(1-clean);SK.dirty(WU.notes,1-clean);
 // ---- the masked man ----
 MA.g.visible=true;relax(MA);idle(MA,t,1);
 if(t<tWalk){MA.g.position.copy(MP);MA.g.rotation.y=MRY;
  // stack 1 already in his hands at frame 1 -> into the drum; down to the basket for stack 2 -> into the drum; then grab the bag
  const p1=sm(.0,tCrim+.25,t),d2=sm(tCrim+.3,tWash+.05,t),u2=sm(tWash+.05,tWash+.25,t),p2=sm(tWash+.25,tWash+.5,t),back=sm(tWash+.5,tWash+.7,t),bend=sm(tPick-.3,tPick,t)*(1-sm(tPick,tWalk,t));
  let a=lerpA(A_HOLD.R,A_PUSH.R,p1),b=lerpA(A_HOLD.L,A_PUSH.L,p1);
  if(t>tCrim+.3){a=lerpA(lerpA(lerpA(A_PUSH.R,A_DOWN.R,d2),A_HOLD.R,u2),A_PUSH.R,p2);b=lerpA(lerpA(lerpA(A_PUSH.L,A_DOWN.L,d2),A_HOLD.L,u2),A_PUSH.L,p2);}
  a=lerpA(a,REL,back);b=lerpA(b,REL,back);arm(MA,'R',a.ux,a.uz,a.lx);arm(MA,'L',b.ux,b.uz,b.lx);
  pose(MA,'spine03',.12*(1-back)+.35*d2*(1-u2)+.55*bend,0,0);
  if(bend>0){const v=lerpA(REL,{ux:AD[0]+.55,uz:AD[2]-.25,lx:.15},bend);arm(MA,'R',v.ux,v.uz,v.lx);}}
 else if(t<T_IN){const [wp,wy]=at((t-tWalk)*SPEED);MA.g.position.copy(wp);const dy=wy-MA.g.rotation.y;MA.g.rotation.y+=Math.atan2(Math.sin(dy),Math.cos(dy))*.35;walk(MA,t,.42);arm(MA,'R',CARRY.ux,CARRY.uz,CARRY.lx);}
 for(const m of MAMATS)m.envMapIntensity=.45+.55*sm(RZ+.6,RZ-.6,MA.g.position.z);
 MA.g.updateMatrixWorld(true);const HR=MA.BN.wristR.getWorldPosition(V3()),HL=MA.BN.wristL.getWorldPosition(V3());
 if(t<tWalk)FK.update(MA,t,{expr:[['angry',.5]],look:t<tPick?DRUM_W:bagIn});
 // the two dirty stacks: stack 1 between his hands -> drum; stack 2 from the basket -> hands -> drum
 const mid=HR.clone().add(HL).multiplyScalar(.5).add(V3(0,.02,0));
 HELD[0].visible=t<tCrim+.3;HELD[0].position.copy(mid);HELD[0].rotation.y=MRY+Math.PI/2;
 HELD[1].visible=t>tCrim+.3&&t<tWash+.55;HELD[1].position.copy(t<tWash?BSK.position.clone().add(V3(.05,.42,0)).lerp(mid,sm(tWash-.12,tWash+.05,t)):mid);HELD[1].rotation.y=MRY+Math.PI/2;
 // clean stacks: drum -> bag (then they are IN the bag: visible glowing straps)
 CLEAN.forEach((m,i)=>{const k=sm(tThen+.15+i*.06,tDep+.3+i*.04,t);m.visible=k>0&&k<1;m.position.lerpVectors(DRUM_W,bagIn.clone().add(V3(0,.05+i*.03,0)),k).add(V3(0,Math.sin(k*Math.PI)*.35,0));m.rotation.set(k*2.5,.3,k*3);});
 BAG.userData.straps.forEach((s,i)=>{s.visible=t>tThen+.35+i*.04;});
 if(t>=tPick&&t<T_IN+.3){BAG.position.copy(HR).add(V3(0,-.36,0));BAG.rotation.y=MA.g.rotation.y+Math.PI/2;}
 // bank doors open when he gets there (and stay open), CCTV follows him, red light on "catch"
 BANK.doors.forEach((d,i)=>{d.rotation.y=(i?1:-1)*1.45*sm(DOOR_T-.9,DOOR_T-.3,t);});
 const ck=sm(tBank-.25,tWould,t),cp=BANK.cctv.getWorldPosition(V3()),dd=MA.g.position.clone().add(V3(0,1.2,0)).sub(cp);
 BANK.cctv.rotation.set(Math.atan2(-dd.y,Math.hypot(dd.x,dd.z))*ck-.25*(1-ck),Math.atan2(-dd.x,-dd.z)*ck+.6*(1-ck),0);
 const on=t>tCatch-.05&&Math.sin(t*18)>-.3;BANK.led.material.color.set(on?0xff2020:0x330000);BANK.led.scale.setScalar(on?1.6:1);};
// ---------- camera helpers (one continuous path, built in ep12_story.js) ----------
CK12=cameraKit(THREE,{FK});
function mono(xs,ys){const n=xs.length,d=[],m=new Array(n).fill(0);for(let i=0;i<n-1;i++)d.push((ys[i+1]-ys[i])/(xs[i+1]-xs[i]));
 m[0]=d[0];m[n-1]=d[n-2];for(let i=1;i<n-1;i++)m[i]=d[i-1]*d[i]<=0?0:(d[i-1]+d[i])/2;
 for(let i=0;i<n-1;i++){if(d[i]===0){m[i]=m[i+1]=0;continue;}const a=m[i]/d[i],b=m[i+1]/d[i],h=a*a+b*b;if(h>9){const k=3/Math.sqrt(h);m[i]=k*a*d[i];m[i+1]=k*b*d[i];}}
 return x=>{let i=0;while(i<n-2&&x>xs[i+1])i++;const h=xs[i+1]-xs[i],u=Math.max(0,Math.min(1,(x-xs[i])/h)),u2=u*u,u3=u2*u;
  return (2*u3-3*u2+1)*ys[i]+(u3-2*u2+u)*h*m[i]+(-2*u3+3*u2)*ys[i+1]+(u3-u2)*h*m[i+1];};}
const F=(f,t)=>[t,f.pos.toArray?f.pos.toArray():[...f.pos],f.look.toArray?f.look.toArray():[...f.look],f.fov];
const MANAT=t=>{const p=t<tWalk?MP:(t<T_IN?at((t-tWalk)*SPEED)[0]:PATH.at(-1));return CK12.box([p.x-.35,0,p.z-.3],[p.x+.35,1.92,p.z+.3]);};
const WBOX=CK12.box([RX+.6-.41,0,RZ+1.55],[RX+.6+.41,1.16,RZ+2.35]),DOORB=CK12.box([RX+.6-.3,WU.cz*WS-.29,RZ+1.5],[RX+.6+.3,WU.cz*WS+.29,RZ+1.5]),BSKB=CK12.box([RX-1.12,0,RZ+.85],[RX-.45,.5,RZ+1.55]);
const BAGB=CK12.box([RX-.5,0,RZ+.6],[RX+.2,.4,RZ+1.0]),CCTVB=CK12.box([BX-3.1,3.1,RZ-.9],[BX-2.7,3.6,RZ-.6]),FRIEZE=CK12.box([BX-3.0,4.95,RZ-.6],[BX+3.0,5.6,RZ-.6]),BDOOR=CK12.box([BX-1.0,0,RZ],[BX+1.0,3.0,RZ]);
const HOOK_KEYS=[
 F(CK12.fit([WBOX,MANAT(0),BSKB],{dir:[0,.1,-1],fov:36,slack:.97}),0),
 F(CK12.fit([WBOX,MANAT(0),BSKB],{dir:[.06,.1,-1],fov:36,slack:.9}),tWash+.3),
 F(CK12.fit([DOORB,WBOX],{dir:[.05,.12,-1],fov:34,slack:.95}),tDirty+.2),
 F(CK12.fit([WBOX,BAGB,MANAT(0)],{dir:[-.05,.15,-1],fov:40}),tDep+.2),
 F(CK12.fit([MANAT(tBank+.25),CK12.box([RX-2.3,0,RZ],[RX+2.3,2.9,RZ])],{dir:[-.15,.12,-1],fov:46}),tBank+.25),
 F(CK12.fit([MANAT(tCatch+.15),FRIEZE,BDOOR,CCTVB],{dir:[.05,.06,-1],fov:46}),tCatch+.15)];
