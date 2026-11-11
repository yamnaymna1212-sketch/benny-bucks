// ================= EP10 HOOK CAMERA (camera-kit.js, NEXT_LEVEL_PLAN stage 3) =================
// 5 framings in 5.6 s, every one auto-fitted above the 74 % caption line:
// wide crate+pallet+Trump (push) -> MACRO real $10,000 strap ($3.8, slow-mo ramp) -> low medium crate + $3.8 BILLION + glowing $ coin (boom)
// -> WHIP over Mike's shoulder to the debt clock + $40 TRILLION + glowing warning icon (big boom) -> orbit -> face close-up (FK.closeUp).
const CK=cameraKit(THREE,{FK});
const TPH=V3(TPX,SY+1.95,TPZ),TOPL=SY+.09+.055+3*.112;   // Trump's head, centre of the pallet's top layer
const CRATE=CK.box([CRX-.45,SY,CRZ-.39],[CRX+.45,SY+.62,CRZ+.39]),PALLET=CK.box([PLX-.45,SY,CRZ-.45],[PLX+.45,SY+.8,CRZ+.45]);
const FLAG=CK.box([CRX-.78,SY+1.72,CRZ+.2],[CRX-.3,SY+2.42,CRZ+.2]);
const popAt=t0=>POPS.filter(m=>Math.abs(m.userData.t0-t0)<.01).map(m=>CK.popBox(m));   // the real floating-text meshes (baseline anchor, pop overshoot)
const TXT38=[...popAt(tBil-.05),...popAt(tYear-.05)],TXT40=popAt(tTril-.05);
const MIKE_HEAD=V3(GX+.615,1.6,15.805),CLOCK=CK.box([GX-1.8,SY+2.2,20.35],[GX+1.8,SY+3.8,20.35]);
const COIN=CK.icon('dollar',{color:'#1fd66a',size:.3}),WARN=CK.icon('warn',{color:'#ff2a2a',size:.42});scene.add(COIN,WARN);
const COIN_AT=V3((TXT38[0].min.x+TXT38[0].max.x)/2,TXT38[0].max.y+.2,CRZ-.3),WARN_AT=V3(TXT40[0].min.x-.32,TXT40[0].min.y+.2,19.55);   // icons beside the numbers (screen left = +x / screen right = -x)
const COINB=CK.box(V3(COIN_AT.x-.17,COIN_AT.y-.17,COIN_AT.z),V3(COIN_AT.x+.17,COIN_AT.y+.17,COIN_AT.z)),WARNB=CK.box(V3(WARN_AT.x-.4,WARN_AT.y-.3,WARN_AT.z),V3(WARN_AT.x+.4,WARN_AT.y+.3,WARN_AT.z));
const S2a=1.25,S2b=2.15;   // macro shot = speed-ramp window for the flying straps
const MAC=CK.box([PLX-.16,TOPL+.03,CRZ-.45],[PLX+.16,TOPL+.06,CRZ-.16]);
const HOOK_SHOTS=[
 {t0:0,t1:S2a,a:()=>CK.fit([CRATE,PALLET,FLAG,TPH],{dir:[0,.12,-1],fov:46}),b:()=>CK.fit([CRATE,PALLET,FLAG,TPH],{dir:[.05,.1,-1],fov:46,slack:.94}),ease:'ramp'},
 {t0:S2a,t1:S2b,a:()=>CK.macro(MAC,{dir:[.12,.8,-1],fov:26,ap:.007}),b:()=>CK.macro(MAC,{dir:[.05,.72,-1],fov:26,ap:.007,slack:.8}),ease:'linear',drift:.25},
 {t0:S2b,t1:tWith,a:()=>CK.fit([CRATE,TXT38,COINB,TPH],{dir:[.35,-.1,-1],fov:44}),b:()=>CK.fit([CRATE,TXT38,COINB,TPH],{dir:[.28,-.08,-1],fov:44,slack:.95}),ease:'ramp'},
 {t0:tWith,t1:tDebt-.06,in:'whip',a:()=>CK.overShoulder(MIKE,[GX,2.95,20.3],{back:1.25,out:.5,up:.12,fov:50,ry:-.08,fit:[CLOCK,TXT40,WARNB]}),b:()=>CK.overShoulder(MIKE,[GX,2.95,20.3],{back:1.0,out:.45,up:.1,fov:50,ry:-.08,fit:[CLOCK,TXT40,WARNB],slack:.93}),ease:'ramp'},
 {t0:tDebt-.06,t1:tDebt+.5,a:()=>CK.orbit(MIKE_HEAD,{a0:2.25,a1:-.87,r0:1.05,r1:.72,h0:.16,h1:.03,fov0:40,fov1:29})[0],b:()=>HOOK_SHOTS[5].a,ease:'ramp'},
 {t0:tDebt+.5,t1:tMeet+.62,a:()=>CK.closeUp(MIKE,{ry:-.88,dist:.72,fov:29}),b:()=>CK.closeUp(MIKE,{ry:-.88,dist:.66,fov:27}),ease:'smooth'},
];
const CAMH=CK.track(HOOK_SHOTS,{whip:.26}),CAM_END=tMeet+.62;let CAMF=null;
HOOK_SHOTS.forEach(s=>{if(typeof s.a==='function')s.a=s.a();});HOOK_SHOTS[4].b=HOOK_SHOTS[5].a;   // solve framings now (orbit lands exactly on the close-up)
HOOK_SHOTS.forEach(s=>{if(typeof s.b==='function')s.b=s.b();if(s.drift!==undefined){s.a.drift=s.drift;s.b.drift=s.drift;}});
{const E=CAMH.end(CAM_END);for(const k of KEYS)if(k[0]<CAM_END+.06){k[1]=E.pos;k[2]=E.look;k[3]=E.fov;}}   // story keys start from the last hook framing
CK.boom(tBil,.5);CK.boom(tTril,1);
function hookIcons(t){CK.iconAnim(COIN,t,tBil-.02,tWith,{pos:COIN_AT,cam,spin:1});CK.iconAnim(WARN,t,tTril+.02,tDebt-.06,{pos:WARN_AT,cam,spin:.5});}
// stills check: frame-safety of every key target per shot (console 'CK' lines) + story framing gaps > 2 s
window.CK_REPORT=()=>({shots:HOOK_SHOTS.map((s,i)=>({i,t0:s.t0,a:CK.check(s.a,[[CRATE,PALLET,FLAG,TPH],[MAC],[CRATE,TXT38,COINB],[CLOCK,TXT40,WARNB],[MIKE_HEAD],[MIKE_HEAD]][i]),b:CK.check(s.b,[[CRATE,PALLET,FLAG,TPH],[MAC],[CRATE,TXT38,COINB],[CLOCK,TXT40,WARNB],[MIKE_HEAD],[MIKE_HEAD]][i])})),
 cuts:CAMH.cuts,storyGaps:CK.audit(KEYS.map(k=>k[0]).filter(t=>t>=CAM_END))});
