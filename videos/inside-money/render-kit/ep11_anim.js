// ================= EP11 hook animation + zack camera FX =================
const EL=new THREE.PointLight(0xfff4e6,.7,4,1.5);scene.add(EL);
const _zp=V3(),_zd=V3();
function shake(t){cam.rotateX(.0035*Math.sin(t*9.1)+.0018*Math.sin(t*17.3+2));cam.rotateY(.0035*Math.sin(t*7.7+1)+.0015*Math.sin(t*15.1));cam.updateMatrixWorld();}
function zfxPrev(t){setCam(Math.max(0,t-1/30));shake(Math.max(0,t-1/30));cam.getWorldDirection(_zd);_zp.copy(cam.position).addScaledVector(_zd,10);}
const FOC=t=>sm(tYours+.1,tPut-.25,t)*(1-sm(tPut-.05,tPut+.05,t))+sm(tTheirs-.3,tTheirs,t)*(1-sm(tMeet-.12,tMeet+.05,t));   // tight glowing zooms: the rest goes darker
function zfxNow(t){shake(t);const p=_zp.clone().project(cam);let bx=-p.x*.5,by=-p.y*.5;const L=Math.hypot(bx,by),mx=.06;if(L>mx){bx*=mx/L;by*=mx/L;}if(L<.003){bx=0;by=0;}
 ZG.uniforms.blur.value.set(bx,by);ZG.uniforms.time.value=t;ZG.uniforms.vig.value=.16+.6*FOC(t);
 BOKEH.uniforms.focus.value=cam.position.distanceTo(V3(...hv(t,k=>k[2])));EL.position.copy(cam.position).add(V3(0,.12,0));}
const MIKEA={};let MAS=0;
const MPX=PX-1.2,MPZ=PZ-.05;   // Mike on the lawn at the hole (screen right), facing it (+x), in profile
const LDT=i=>.25+i*.26;         // each money layer floats down into the hole (reference style)
const DIG=.8;                   // one dig every .8 s while the money drops
function shovelTo(top,bot){const d=bot.clone().sub(top).normalize();SHV.position.copy(top);SHV.quaternion.setFromUnitVectors(V3(0,-1,0),d);}
function animate(t){updPops(t);updC(t);fl.visible=false;const P=MIKE;relax(P);
 if(!MAS){MAS=1;P.g.position.set(MPX,0,MPZ);P.g.rotation.y=Math.PI/2;P.g.updateMatrixWorld(true);
  const a=(sd,v)=>{relax(P);const r=solveReach(P,sd,v);relax(P);return r;};
  MIKEA.dnR=a('R',V3(PX-.62,.42,MPZ+.05));MIKEA.dnL=a('L',V3(PX-.86,.92,MPZ-.08));MIKEA.upR=a('R',V3(PX-.78,.95,MPZ+.05));MIKEA.upL=a('L',V3(PX-1.0,1.28,MPZ-.1));
  P.g.position.set(MBX,0,MBZ);P.g.rotation.y=-.08;}
 const glow=.25+1.1*FOC(t);LTM.emissiveIntensity=glow;LEM.emissiveIntensity=glow*.6;   // money glows (strongest in the tight zoom)
 // ---- money layers drop into the hole ----
 LAY.forEach((m,i)=>{const t0=LDT(i),k=sm(t0,t0+.5,t);m.visible=t>t0-.02;m.position.copy(m.userData.b);m.position.y+=(1-k)*1.6;m.rotation.set((1-k)*.12,(1-k)*.35,0);});
 if(t<tPut-.05){P.g.position.set(MPX,0,MPZ);P.g.rotation.y=Math.PI/2;idle(P,t,1.3);
  const digOn=1-sm(tBack+.45,tBack+.8,t),ph=(t%DIG)/DIG,c=.5-.5*Math.cos(ph*2*Math.PI);   // c: 0 = blade in the hole, 1 = lifted
  const R=lerpA(MIKEA.dnR,MIKEA.upR,c),Lr=lerpA(MIKEA.dnL,MIKEA.upL,c);
  setA(P,'R',lerpA(REST,R,digOn));setA(P,'L',lerpA(REST,Lr,digOn));pose(P,'spine03',.28*digOn*(1-c*.6),0,0);pose(P,'spine02',.12*digOn,0,0);
  const pr=sm(tYours-.3,tYours,t);face(P,{jaw:.02,smile:.2+.5*pr});if(pr>0)pose(P,'head',-.1*pr,-.35*pr,0);   // proud smile, looks at us on 'yours'
  P.g.updateMatrixWorld(true);const wr=V3(),wl=V3();P.BN.wristR.getWorldPosition(wr);P.BN.wristL.getWorldPosition(wl);
  const blade=V3(PX-.62-.12*c,-.35+.95*c,MPZ+.02);shovelTo(wr,wr.clone().lerp(blade,1).sub(wr).normalize().multiplyScalar(1.2).add(wr));   // grip in his right hand, blade into the hole / lifted with dirt
  if(digOn<=.02)shovelTo(wr.clone().add(V3(0,.02,0)),wr.clone().add(V3(.1,-1.2,.05)));   // planted at his side after digging
  SHV.visible=true;
  DIRT.forEach((m,i)=>{const n=Math.floor(t/DIG),tt=(t%DIG)/DIG,k=(tt-.5)/.45;m.visible=digOn>.5&&k>0&&k<1&&n>=0;if(!m.visible)return;   // dirt thrown onto the pile on each lift
   const a=V3(PX-.7+(i%3)*.05,.45,MPZ+(i%4-1.5)*.05),b=V3(PX+1.35+(i%5)*.08,.35+(i%3)*.05,PZ+.3+(i%4-1.5)*.08);m.position.lerpVectors(a,b,k);m.position.y+=.9*Math.sin(Math.PI*k);m.rotation.set(k*5+i,k*3,0);});
  BLAY.forEach(m=>m.visible=false);PAL.visible=false;}
 else{SHV.visible=false;DIRT.forEach(m=>m.visible=false);PAL.visible=true;P.g.position.set(MBX,0,MBZ);idle(P,t,1.3);
  const turn=sm(tMeet-.15,tMeet+.2,t);P.g.rotation.y=-.08-.85*turn;
  const pt=sm(tBank-.2,tBank+.05,t)*(1-sm(tLeg+.1,tLeg+.35,t));arm(P,'L',AD[0]+.9*pt,AD[2]-.2*pt,.2*pt);   // points his money in
  BLAY.forEach((m,i)=>{const t0=tBank-.05+i*.08,k=sm(t0,t0+.4,t);m.visible=k<.98;m.position.lerpVectors(m.userData.a,V3(BKX,1.0+i*.05,18.9),k);m.position.y+=.6*Math.sin(Math.PI*k);m.rotation.set(0,k*.3,0);m.scale.setScalar(1-.45*k);});
  if(t>tTheirs-.1){const s=sm(tTheirs-.1,tTheirs+.2,t);face(P,{jaw:.09*s,smile:0});pose(P,'spine03',-.08*s,0,0);arm(P,'L',AD[0]+.25*s,AD[2]-.25*s,.5*s);arm(P,'R',AD[0]+.25*s,AD[2]-.25*s,.5*s);}
  else face(P,{jaw:.02,smile:.25});}
 const sh=sm(tLeg-.02,tLeg+.22,t);DOORS.forEach(({g,sd})=>{g.rotation.y=sd*(1-sh)*1.35;});   // doors slam on 'legally'
}
