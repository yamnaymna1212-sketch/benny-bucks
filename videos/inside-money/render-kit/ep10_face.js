// ================= EP10 FACES (face-kit.js, NEXT_LEVEL_PLAN stage 1) =================
// Trump: a pleased smirk while he loads the straps, eyes on the crate. Mike: eyes go up to the debt clock on "trillion",
// then the real stock-clip shock (Pexels 6980085, MediaPipe) when he turns to us on "debt". Everyone blinks + saccades.
const FK=faceKit(THREE);
FK.rig(MIKE,{iris:'#5c4330',brow:'#3a281a'});FK.rig(MK,{iris:'#5c4330',brow:'#3a281a'});FK.rig(TR,{});
const SHOCK=await FK.loadClip('faces/6980085.json');   // brows up 4.5 s -> jaw drop 4.8 s (smile after 5.3 s is not used)
const CRATE_EYE=V3(CRX+.2,SY+.6,CRZ),CLOCK_EYE=V3(GX,3.0,20.3);
function faces10(t){
 if(TR.g.visible)FK.update(TR,t,{expr:[['smirk',.9],['joy',.35]],look:CRATE_EYE});
 if(MIKE.g.visible){const sh=sm(tDebt-.3,tDebt+.1,t);
  const look=t<tTril-.1?CRATE_EYE:t<tDebt-.2?CLOCK_EYE:cam.position;
  FK.update(MIKE,t,{expr:[['shock',.55*sh],['doubt',.6*sm(tTril-.1,tTril+.25,t)*(1-sh)]],clip:{data:SHOCK,t0:tDebt-.3,from:4.42,len:.85,k:1},look});}
 if(MK.g.visible)FK.update(MK,t,{look:cam.position});}
