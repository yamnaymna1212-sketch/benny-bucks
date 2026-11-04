// ================= EP10 HOOK ANIMATION + zack camera FX =================
popT('$3.8 BILLION',.15,GRN,V3(CRX+.52,3.02,CRZ-.3),tBil-.05,tWith+.2);
popT('A YEAR',.11,YEL,V3(CRX+.52,2.84,CRZ-.3),tYear-.05,tWith+.2);
popT('$40 TRILLION',.25,RED,V3(GX,2.1,19.6),tTril-.05,tMeet+3);
const EL=new THREE.PointLight(0xfff4e6,.7,4,1.5);scene.add(EL);   // camera eye-light: catchlights in the eyes, soft face fill
const _zp=V3(),_zd=V3();
function shake(t){cam.rotateX(.0035*Math.sin(t*9.1)+.0018*Math.sin(t*17.3+2));cam.rotateY(.0035*Math.sin(t*7.7+1)+.0015*Math.sin(t*15.1));cam.updateMatrixWorld();}   // handheld micro-shake
function zfxPrev(t){setCam(Math.max(0,t-1/30));shake(Math.max(0,t-1/30));cam.getWorldDirection(_zd);_zp.copy(cam.position).addScaledVector(_zd,10);}
function zfxNow(t){shake(t);const p=_zp.clone().project(cam);let bx=-p.x*.5,by=-p.y*.5;const L=Math.hypot(bx,by),mx=.06;if(L>mx){bx*=mx/L;by*=mx/L;}if(L<.003){bx=0;by=0;}   // motion blur only on fast moves
 ZG.uniforms.blur.value.set(bx,by);ZG.uniforms.time.value=t;
 BOKEH.uniforms.focus.value=cam.position.distanceTo(V3(...(CAMF?CAMF.look:hv(t,k=>k[2]))));BOKEH.uniforms.aperture.value=CAMF?.ap??.0018;   // camera-kit framing: per-shot focus + aperture (macro = shallow)EL.position.copy(cam.position).add(V3(0,.12,0));}
const TRA={};let TRS=0;   // Trump loads the straps: right hand pallet -> crate, solved once
const TPX=CRX+.52,TPZ=CRZ+.4;
function trumpLoad(t){const P=TR;P.g.position.set(TPX,SY,TPZ);P.g.rotation.y=Math.PI;
 if(!TRS){TRS=1;relax(P);P.g.updateMatrixWorld(true);TRA.pal=solveReach(P,'R',V3(PLX-.25,SY+.72,CRZ+.05));relax(P);TRA.cr=solveReach(P,'R',V3(CRX+.25,SY+.78,CRZ+.05));relax(P);TRA.palL=solveReach(P,'L',V3(PLX-.05,SY+.72,CRZ+.05));relax(P);TRA.crL=solveReach(P,'L',V3(CRX+.05,SY+.78,CRZ+.05));relax(P);}
 relax(P);idle(P,t,1);let ph=0;FLY.forEach((m,i)=>{const t0=tSend+.05+i*(tYear-tSend)/FLY.length;if(t>=t0-.2&&t<t0+.42)ph=sm(t0,t0+.42,t);});
 const on=sm(tSend-.3,tSend,t)*(1-sm(tWith,tWith+.3,t));
 setA(P,'R',lerpA(REST,lerpA(TRA.pal,TRA.cr,ph),on));pose(P,'upperarm01L',AD[0]+.15*on,0,-AD[2]+.25*on);   // left hand stays at his side (no hidden arm)
 pose(P,'spine03',.12*on,0,0);face(P,{jaw:.03+.04*Math.abs(Math.sin(t*9)),smile:.35});}
function animate(t){updPops(t);updC(t);MIKE.g.visible=t<5.9;TR.g.visible=t<tWith+.5;fl.visible=false;const tf=CK.ramp(t,S2a,S2b,.45,.45);trumpLoad(tf);hookIcons(t);   // tf = speed-ramped scene time (slow-mo in the macro)
 {const pa=FG3.attributes.position;for(let i=0;i<pa.count;i++){const u=(pa.getX(i)+.44)/.88;pa.setZ(i,Math.sin(u*7-t*6)*.05*u);}pa.needsUpdate=true;FG3.computeVertexNormals();}
 FLY.forEach((m,i)=>{const t0=tSend+.05+i*(tYear-tSend)/FLY.length,k=sm(t0,t0+.42,tf);m.position.lerpVectors(m.userData.a,m.userData.b,k);m.position.y+=.32*Math.sin(Math.PI*k);m.rotation.set(0,(1-k)*2.4,(1-k)*.5);});
 if(t<57.75)drawDebt(40502080966097+t*63000);else drawGrid();DEBT.visible=DFR.visible=t>tWith-.12;   // the clock appears inside the whip-pan blur: no cropped teaser in the crate shots
 {const dt=t-tTril;DEBT.scale.setScalar(dt>0?1+.1*Math.exp(-dt*7)*Math.cos(dt*22):1);}
 {const P=MIKE;relax(P);idle(P,t,1.3);const turn=sm(tDebt+.1,tDebt+.5,t);P.g.rotation.y=-.08-.8*turn;
  if(t>tTril-.1&&t<tDebt-.15)pose(P,'head',-.18*sm(tTril-.1,tTril+.2,t),0,0);   // looks up at the clock
  if(t>tDebt-.25){const k=sm(tDebt-.25,tDebt+.05,t);face(P,{jaw:.09*k,smile:0});pose(P,'spine03',-.08*k,0,0);arm(P,'L',AD[0]+.25*k,AD[2]-.25*k,.5*k);arm(P,'R',AD[0]+.25*k,AD[2]-.25*k,.5*k);}}   // shock: mouth opens a little, leans back, hands flinch up, turns to us (no tongue)
 story10(t);
 faces10(t);   // face-kit: expressions, blink, look-at (ep10_face.js)
 {const pa=FG2.attributes.position;for(let i=0;i<pa.count;i++){const u=(pa.getX(i)+1.2)/2.4;pa.setZ(i,Math.sin(u*6-t*5)*.12*u);}pa.needsUpdate=true;FG2.computeVertexNormals();}
}
