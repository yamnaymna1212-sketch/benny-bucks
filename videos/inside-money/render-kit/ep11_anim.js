// ================= EP11 hook animation + zack camera FX =================
const EL=new THREE.PointLight(0xfff4e6,.7,4,1.5);scene.add(EL);
const _zp=V3(),_zd=V3();
function shake(t){cam.rotateX(.0035*Math.sin(t*9.1)+.0018*Math.sin(t*17.3+2));cam.rotateY(.0035*Math.sin(t*7.7+1)+.0015*Math.sin(t*15.1));cam.updateMatrixWorld();}
function zfxPrev(t){setCam(Math.max(0,t-1/30));shake(Math.max(0,t-1/30));cam.getWorldDirection(_zd);_zp.copy(cam.position).addScaledVector(_zd,10);}
function zfxNow(t){shake(t);const p=_zp.clone().project(cam);let bx=-p.x*.5,by=-p.y*.5;const L=Math.hypot(bx,by),mx=.06;if(L>mx){bx*=mx/L;by*=mx/L;}if(L<.003){bx=0;by=0;}
 ZG.uniforms.blur.value.set(bx,by);ZG.uniforms.time.value=t;
 BOKEH.uniforms.focus.value=cam.position.distanceTo(V3(...hv(t,k=>k[2])));EL.position.copy(cam.position).add(V3(0,.12,0));}
const MIKEA={};let MAS=0;
const DT=i=>.12+i*(tBack+.5-.12)/5;   // drop times of the last 5 straps
function animate(t){updPops(t);updC(t);fl.visible=false;const P=MIKE;relax(P);
 const atBank=t>tPut-.05;
 if(!MAS){MAS=1;P.g.position.set(PX-.78,0,PZ-.12);P.g.rotation.y=2.45;P.g.updateMatrixWorld(true);relax(P);MIKEA.drop=solveReach(P,'R',V3(PX-.32,.95,PZ-.02));relax(P);
  P.g.position.set(MBX,0,MBZ);P.g.rotation.y=-.08;P.g.updateMatrixWorld(true);relax(P);MIKEA.hR=solveReach(P,'R',V3(MBX-.12,1.08,MBZ+.32));relax(P);MIKEA.hL=solveReach(P,'L',V3(MBX+.12,1.08,MBZ+.32));relax(P);}
 // ---- straps in the hole ----
 PIT.forEach(m=>{m.visible=true;m.position.copy(m.userData.b);});
 DROP.forEach((m,i)=>{const t0=DT(i),k=sm(t0,t0+.3,t);if(t<t0){m.visible=false;return;}m.position.lerpVectors(V3(PX-.32,.9,PZ-.02),m.userData.b,k*k);m.rotation.z=(1-k)*.5;});
 if(!atBank){P.g.position.set(PX-.78,0,PZ-.12);P.g.rotation.y=2.45;idle(P,t,1.3);
  const on=1-sm(tBack+.55,tBack+.85,t);const bob=.5+.5*Math.sin(t*12.5);   // hand over the hole, little drop flicks
  setA(P,'R',lerpA(REST,{ux:MIKEA.drop.ux,uz:MIKEA.drop.uz,lx:MIKEA.drop.lx-.12*bob},on));
  const pr=sm(tYours-.3,tYours,t);face(P,{jaw:.02,smile:.25+.45*pr});pose(P,'spine03',-.04*pr,0,0);pose(P,'head',-.12*pr,.1*Math.sin(t*1.1),0);   // proud: chin up, big smile
  STACK.visible=false;}
 else{P.g.position.set(MBX,0,MBZ);idle(P,t,1.3);const turn=sm(tMeet-.15,tMeet+.2,t);P.g.rotation.y=-.08-.85*turn;
  const hold=1-sm(tBank-.02,tBank+.2,t);setA(P,'R',lerpA(REST,MIKEA.hR,hold));setA(P,'L',lerpA(REST,MIKEA.hL,hold));
  P.g.updateMatrixWorld(true);const wr=V3(),wl=V3();P.BN.wristR.getWorldPosition(wr);P.BN.wristL.getWorldPosition(wl);
  const hand=wr.add(wl).multiplyScalar(.5).add(V3(0,-.12,0));const k=sm(tBank-.1,tBank+.5,t);   // the stack flies through the bank door
  STACK.visible=t<tBank+.52;STACK.position.lerpVectors(hand,V3(BKX,1.1,18.75),k);STACK.position.y+=.75*Math.sin(Math.PI*k);STACK.rotation.set(0,k*1.6,k*.25);STACK.scale.setScalar(1.25-.6*k);   // thrown high so it reads over his shoulder
  if(t>tTheirs-.1){const s=sm(tTheirs-.1,tTheirs+.2,t);face(P,{jaw:.09*s,smile:0});pose(P,'spine03',-.08*s,0,0);arm(P,'L',AD[0]+.25*s,AD[2]-.25*s,.5*s);arm(P,'R',AD[0]+.25*s,AD[2]-.25*s,.5*s);}   // shock
  else face(P,{jaw:.02,smile:.25});}
 // doors: open, slam shut on 'legally'
 const sh=sm(tLeg-.05,tLeg+.22,t);DOORS.forEach(({g,sd})=>{g.rotation.y=sd*(1-sh)*1.35;});
}
