// ================= EP16 HOOK: "Trump just lost Congress. So will gas get cheaper? Meet Mike. He pays about four dollars a gallon." =================
// Same visual language as EP15 (CageNova map, head badges, no bodies before 'Meet', few SFX, steady camera).
// Frame 1 (no sound): red USA + Trump head badge on DC + the Capitol + a gas pump showing $4.04. 'lost' = red LOST stamp, Trump shocked, map wipes red -> blue.
screen15('$4.04','#ff3b3b');
popT('$4.04',.48,RED,PRICE_P,-1,tCheaper-.05);
popT('$4.04',.42,RED,PRICE_P,tPays-.05,1e9);
const BILLS15=[0,1,2,3,4].map(()=>{const b=MNY.note(100,{curve:.012,glow:.12});b.scale.setScalar(2.2);b.visible=false;scene.add(b);return b;});
const ARUP=CK.icon('up',{color:'#ff2a2a',size:.55}),ARDN=CK.icon('down',{color:'#22e06a',size:.55});scene.add(ARUP);scene.add(ARDN);
popT('?',.7,YEL,PRICE_P.clone().add(V3(0,.05,0)),tCheaper-.05,tMeet-.3);
// ---------------- the Capitol (south-west of DC so the badge never hides it) ----------------
const CP=mxz(-80.6,36.2),CSCL=.62;
const CAPG=new THREE.Group();CAPG.position.copy(CP);CAPG.rotation.y=Math.PI/2;CAPG.scale.setScalar(CSCL);scene.add(CAPG);
{const wm=M(0xf6f4ee,.5),gm=M(0xd9d6cc,.55);add(B(3.0,.18,1.2),gm,0,.09,0,CAPG);add(B(2.8,.9,1.0),wm,0,.63,0,CAPG);
 for(let i=0;i<8;i++)add(CY(.06,.06,.85,16),wm,-1.05+i*.3,.62,.55,CAPG);add(B(2.9,.12,1.1),gm,0,1.14,0,CAPG);
 add(CY(.5,.55,.45,40),wm,0,1.42,0,CAPG);const d=add(new THREE.SphereGeometry(.52,40,16,0,Math.PI*2,0,Math.PI/2),wm,0,1.64,0,CAPG);d.scale.y=.9;add(CY(.07,.09,.35,16),wm,0,2.25,0,CAPG);add(new THREE.SphereGeometry(.07,12,8),M(0xd4af37,.3,1),0,2.45,0,CAPG);
 for(let i=0;i<10;i++)add(CY(.035,.035,.42,10),wm,Math.cos(i/10*Math.PI*2)*.52,1.42,Math.sin(i/10*Math.PI*2)*.52,CAPG);}
const PCONG=pill('CONGRESS',1.3);PCONG.material.depthTest=false;PCONG.renderOrder=9;
popT('LOST',.62,RED,CP.clone().add(V3(0,2.35,0)),tLost-.02,tSo-.05);
// ---------------- Trump: HEAD ONLY in a red badge on DC (live render target) ----------------
const HRT=new THREE.WebGLRenderTarget(640,640,{samples:4,type:THREE.HalfFloatType});
const HCAM=new THREE.PerspectiveCamera(20,1,.05,1.6);const HBG=new THREE.Color(0x9c1f2c);
const DC=mxz(-77.0,39.4),BH=1.55,BR=.62;
const BADGE=new THREE.Group();scene.add(BADGE);
{add(new THREE.RingGeometry(BR*1.02,BR*1.32,96),new THREE.MeshBasicMaterial({color:new THREE.Color(3,.55,.45),toneMapped:false,transparent:true,opacity:.55,blending:THREE.AdditiveBlending,depthWrite:false}),0,0,-.01,BADGE,false);
 add(new THREE.CircleGeometry(BR*1.07,96),new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false}),0,0,-.005,BADGE,false);
 const fc=add(new THREE.CircleGeometry(BR,96),new THREE.MeshBasicMaterial({map:HRT.texture}),0,0,0,BADGE,false);fc.renderOrder=4;}
const STEM=add(new THREE.ConeGeometry(.11,BH-BR,24),M(0xffffff,.4),DC.x,US_Y+(BH-BR)/2,DC.z,scene,false);STEM.rotation.x=Math.PI;
const PTR=pill('TRUMP',1.1);PTR.material.depthTest=false;PTR.renderOrder=9;
const TRH=V3(GX,SY,19.25);
function trump16(t){const k=bump(t,-.25,.35);const on=k>.01&&t<tMeet;BADGE.visible=STEM.visible=PTR.visible=on;if(!on){TR.g.visible=false;return;}
 const P=TR;relax(P);idle(P,t,.25);P.g.visible=true;P.g.position.copy(TRH);P.g.rotation.y=Math.PI;
 const sh=sm(tLost-.05,tLost+.2,t);face(P,{jaw:.03+.04*Math.abs(Math.sin(t*8))+.25*sh,smile:.3*(1-sh)});
 P.g.updateMatrixWorld(true);const h=V3();(P.BN.head||P.BN.neck01).getWorldPosition(h);h.y+=.06;
 HCAM.position.copy(h).add(V3(0,.02,-.92));HCAM.lookAt(h.x,h.y-.02,h.z);
 FK.update(P,t,{expr:[['smirk',.6*(1-sh)],['shock',.95*sh]],look:HCAM.position});
 const bg=scene.background;scene.background=HBG;renderer.setRenderTarget(HRT);renderer.clear();renderer.render(scene,HCAM);renderer.setRenderTarget(null);scene.background=bg;P.g.visible=false;
 BADGE.position.copy(DC).add(V3(0,BH,0));BADGE.quaternion.copy(cam.quaternion);BADGE.scale.setScalar(Math.max(.001,k));
 STEM.scale.set(1,Math.max(.001,k),1);face2cam(PTR,DC.clone().add(V3(0,BH-BR*k-.32,0)));PTR.scale.setScalar(Math.max(.001,k));}
// ---------------- Mike beside the pump (after the white flash on 'Meet') ----------------
const MKP=mxz(-103.4,38.0),CSC=1.4;
function mike15(t){const P=MIKE,on=t>=tMeet-.04;P.g.visible=on;if(!on)return;
 relax(P);idle(P,t,1.1);P.g.position.copy(MKP);P.g.rotation.y=Math.PI/2-.12;P.g.scale.setScalar(CSC);
 const sh=sm(tPays-.15,tPays+.15,t);armsUp(P,.22*sh);pose(P,'head',-.05*sh,-.35*sh,0);
 face(P,{jaw:.05+.05*sh,smile:.15*(1-sh)});FK.update(P,t,{expr:[['shock',.9*sh],['joy',.3*(1-sh)]],look:sh>.5?PRICE_P:cam.position});}
const PMIKE=pill('MIKE',.95);
const WF15=document.createElement('div');WF15.style.cssText='position:absolute;inset:0;background:#fff;opacity:0;z-index:2';document.getElementById('ov').appendChild(WF15);
function animate(t){sun.intensity=2.4;WF15.style.opacity=String(Math.max(0,1-Math.abs(t-tMeet)/.14)*.95);updPops(t);MK.g.visible=false;DEBT.visible=DFR.visible=false;ELS.g.visible=false;
 wipe15(t);trump16(t);mike15(t);
 DOTS.forEach(s=>{const v=.75+.25*Math.sin(t*3+s.userData.ph);s.scale.setScalar(.26*v);s.material.opacity=v;});
 const cv=t<tMeet;CAPG.visible=cv;const ck=bump(t,tCong-.1,.3);PCONG.visible=cv&&ck>.01;if(PCONG.visible){face2cam(PCONG,CP.clone().add(V3(0,-.05,0)).add(V3(.55,.25,0)));PCONG.scale.setScalar(Math.max(.001,ck));}
 CAPG.scale.setScalar(CSCL*(1+.12*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tLost+.02)/.3)))));
 PUMP.scale.setScalar(1+.18*Math.sin(Math.PI*Math.min(1,Math.max(0,(t-tGas+.05)/.35))));
 const q=t>=tCheaper-.05&&t<tMeet-.05;screen15(q?'?':'$4.04',q?'#ffc61a':'#ff3b3b');
 BILLS15.forEach((b,i)=>{const t0=tGas+.05+i*.06;let on=t>=t0&&t<tCheaper+.3,p;
  if(on){const a=t*2.2+i*Math.PI*2/5,k=Math.min(1,(t-t0)/.3);p=PP.clone().add(V3(Math.cos(a)*1.05*k,.6+i*.28+.1*Math.sin(t*3+i),Math.sin(a)*1.05*k));}
  else if(t>=tPays+i*.1&&t<tPays+i*.1+.62){on=true;const u=(t-tPays-i*.1)/.6;p=MKP.clone().add(V3(.7,1.35,-.2)).lerp(PP.clone().add(V3(.35,1.25,0)),u).add(V3(0,Math.sin(u*Math.PI)*.45,0));}
  b.visible=on;if(!on)return;b.position.copy(p);b.lookAt(cam.position);b.rotateZ(.4*Math.sin(t*4+i));MNY.flutter(b,t,i);});
 const sw=Math.sin((t-tCheaper)*7);CK.iconAnim(ARUP,t,tCheaper,tMeet-.3,{pos:PP.clone().add(V3(.1,PUMPH+.55+.12*Math.max(0,sw),.72)),cam,spin:.3});
 CK.iconAnim(ARDN,t,tCheaper+.12,tMeet-.3,{pos:PP.clone().add(V3(.1,PUMPH+.55-.12*Math.max(0,-sw),-.72)),cam,spin:.3});
 PMIKE.visible=t>=tMike-.05&&t<tPays-.1;if(PMIKE.visible)face2cam(PMIKE,MKP.clone().add(V3(0,2.75,0)));}
// ---------------- camera: wide (whole red USA, badge, Capitol, pump) -> push in on DC while it wipes blue -> 3/4 front on the pump -> Mike ----------------
const gbox=(lo0,la0,lo1,la1,y0,y1)=>{const a=mxz(lo0,la0,y0),b=mxz(lo1,la1,y1);return new THREE.Box3(a.clone().min(b),a.clone().max(b));};
const BXc=(p,r,h)=>CK.box([p.x-r,p.y,p.z-r],[p.x+r,p.y+h,p.z+r]);
const PUB=BXc(PP,.55,PUMPH+.9),PUB2=BXc(PP,1.15,PUMPH+1.0),DCB=CK.box([DC.x-.3,US_Y,DC.z-.75],[DC.x+.3,US_Y+BH+BR+.05,DC.z+.75]),CAPB=BXc(CP,1.0,2.9),MKB2=BXc(MKP,.45,3.05);
const FT15=(T,dir,fov,o={})=>CK.fit(T,{dir,fov,top:.06,...o});
const KEYS1=[[0,FT15([gbox(-124,25,-68,49,0,.1),PUB,DCB,CAPB],[.6,1.0,0],40)],
 [tLost+.05,FT15([gbox(-103,29,-70,46,0,.1),PUB,DCB,CAPB],[.8,.85,0],40)],
 [tSo-.05,FT15([gbox(-104,28,-69,47,0,.1),PUB,DCB,CAPB],[.82,.8,0],40,{slack:.95})],
 [tGas+.2,FT15([PUB2],[1,.5,-.32],38)],
 [tCheaper+.2,FT15([PUB,BXc(PP,.9,PUMPH+1.25)],[1,.55,.3],38)],
 [tMeet,FT15([PUB,BXc(PP,.9,PUMPH+1.25)],[1,.55,.22],38,{slack:.95})]];
mike15(tPays);
const PRB=CK.box([PP.x-.2,PP.y+PUMPH+.2,PP.z-1.0],[PP.x+.2,PP.y+PUMPH+.95,PP.z+1.0]);
const KEYS2=[[tMeet,FT15([MKB2,PUB],[1,.42,.12],38)],[tPays+.2,FT15([MKB2,PUB,PRB],[1,.4,.05],38)],[HOOK_END,FT15([MKB2,PUB,PRB],[1,.38,0],38,{slack:.94})]];
mike15(0);
