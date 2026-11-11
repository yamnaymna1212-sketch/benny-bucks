// ===================== EP19 (credit card) — built on scenekit; world from ep18full (Maple Street) =====================
const lawn=add(B(600,.2,600),pbr('leafy_grass',120,120,0x8fdc4a),0,-.1,0,scene,false);
street(0,19,400);
const mikeH=house(0,0,0,STY[2],false,1);     // Mike's house faces the street (+z)
house(-22,0,0,STY[1],false,-1);house(22,0,0,STY[3],false,1);house(-44,0,0,STY[4],false,1);house(44,0,0,STY[5],false,-1);
for(const [x,s] of[[-22,2],[0,3],[22,1]])house(x,-34,Math.PI,STY[s],false,1);
const TREES=['island_tree_01','jacaranda_tree','pine_tree_01'];
for(const [x,z,h] of[[-9.5,9,6.5],[11.5,8.5,7],[-14,-8,9],[15,-12,8],[-30,-14,9],[31,-20,10],[-36,8,8],[36,8,9],[0,-26,9]])model(TREES[Math.round(Math.abs(x*7+z))%3],x,0,z,h,x);
for(const [x,z] of[[-4.2,6.2],[3.6,6.2]])model('shrub_01',x,0,z,.9,x);
const {core}=await import('./scenekit/core.js');const K=await core(THREE,scene,{TL});
const {sm,pop,AD}=K;
// ================= TIMELINE =================
const TLN=await (await fetch(Q.get('tl')||'timeline_ep19full.json')).json(),CH=TLN.chunks,WS=TLN.words,DUR=TLN.dur;
const nw=x=>x.toLowerCase().replace(/[^a-z0-9]/g,'');
function FIND(ph,occ=0){const p=ph.split(/\s+/).map(nw);let c=0;for(let i=0;i+p.length<=WS.length;i++){if(p.every((w,j)=>nw(WS[i+j].w)===w)){if(c++===occ)return [i,i+p.length-1];}}console.error('phrase not found',ph);return [0,0];}
const T=(ph,o=0)=>WS[FIND(ph,o)[0]].s,TE=(ph,o=0)=>WS[FIND(ph,o)[1]].e;
const tCard=T('credit card'),tForever=T('forever'),tMike=T('mike owes'),tThou=T('thousand'),tThrows=T('he throws'),tTrash=T('trash'),tDay1=T('day one');
// captions: the amount floats in 3D, so its words are blank (no repetition)
{const [a,b]=FIND('one thousand dollars');for(let i=a;i<=b;i++)CH[i].t='';}
// ================= PROPS (real objects, no emoji) =================
// giant credit card above Mike: dark navy card, gold chip, contactless mark, embossed number, red glowing edge
const CARD=K.group(-.4,4.75,9.0);
{const ct=K.tex(1012,638,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#1d2f6b');g.addColorStop(.55,'#0f1838');g.addColorStop(1,'#060a1c');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.globalAlpha=.12;x.fillStyle='#fff';for(let i=0;i<7;i++){x.beginPath();x.arc(820,120,140+i*70,0,7);x.lineWidth=3;x.strokeStyle='#9fb4ff';x.stroke();}x.globalAlpha=1;
  const cg=x.createLinearGradient(110,230,250,340);cg.addColorStop(0,'#f6dd8c');cg.addColorStop(1,'#b8892e');x.fillStyle=cg;x.beginPath();x.roundRect(110,225,150,115,16);x.fill();
  x.strokeStyle='#8a6420';x.lineWidth=3;for(const yy of[262,300])x.beginPath(),x.moveTo(110,yy),x.lineTo(260,yy),x.stroke();x.beginPath();x.moveTo(185,225);x.lineTo(185,340);x.stroke();
  x.strokeStyle='#e8ecff';x.lineWidth=7;x.lineCap='round';for(let i=0;i<3;i++){x.beginPath();x.arc(300,282,22+i*18,-.75,.75);x.stroke();}
  x.fillStyle='#eef1ff';x.font='800 64px Mont';x.textAlign='left';x.fillText('4000 1234 5678 9010',110,450);
  x.font='800 30px Mont';x.fillStyle='#b9c3e6';x.fillText('VALID THRU 09/29',110,505);x.font='800 44px Mont';x.fillStyle='#eef1ff';x.fillText('MIKE',110,580);
  x.font='800 50px Mont';x.textAlign='right';x.fillStyle='#ffffff';x.fillText('CREDIT',w-70,110);});
 const body=K.add(K.RB(3.4,2.14,.07,.16),[K.M(0x0b1230,.35,.4),K.M(0x0b1230,.35,.4),K.M(0x0b1230,.35,.4),K.M(0x0b1230,.35,.4),new THREE.MeshStandardMaterial({map:ct,roughness:.32,metalness:.25}),K.M(0x0b1230,.35,.4)],0,0,0,CARD,false);}
const EDGE=(()=>{const pts=[],w=3.46,h=2.2,R=.18;for(const [cx,cy,a0] of[[w/2-R,h/2-R,0],[-w/2+R,h/2-R,Math.PI/2],[-w/2+R,-h/2+R,Math.PI],[w/2-R,-h/2+R,1.5*Math.PI]])for(let i=0;i<=8;i++){const a=a0+i/8*Math.PI/2;pts.push(V3(cx+Math.cos(a)*R,cy+Math.sin(a)*R,0));}
 const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true),160,.03,8,true),new THREE.MeshStandardMaterial({color:0xff2a2a,emissive:0xff2a2a,emissiveIntensity:2.0,roughness:.4}));CARD.add(m);return m;})();
const UNPAID=K.txt3('UNPAID',.42,0xff2a2a,{ei:1.05,p:CARD});UNPAID.position.set(.35,-.1,.12);UNPAID.rotation.z=.16;UNPAID.visible=false;
const AMT=K.txt3('$1,000',.6,0xff2a2a,{ei:1.1});AMT.visible=false;
// the paper bill ("AMOUNT DUE $1,000.00") -> crumpled paper ball
const BILLT=K.tex(420,540,(x,w,h)=>{x.fillStyle='#fbfaf6';x.fillRect(0,0,w,h);x.fillStyle='#1d2f6b';x.fillRect(0,0,w,70);x.fillStyle='#fff';x.font='800 34px Mont';x.fillText('STATEMENT',24,48);
 x.fillStyle='#777';x.font='800 20px Mont';for(let i=0;i<6;i++)x.fillRect(24,110+i*34,(i%3?260:340),10);x.fillStyle='#111';x.font='800 28px Mont';x.fillText('AMOUNT DUE',24,380);
 x.fillStyle='#d01818';x.font='800 58px Mont';x.fillText('$1,000.00',24,450);x.strokeStyle='#d01818';x.lineWidth=4;x.strokeRect(14,340,w-28,135);});
const BILL=K.add(new THREE.PlaneGeometry(.24,.31),new THREE.MeshStandardMaterial({map:BILLT,roughness:.8,side:THREE.DoubleSide}),0,0,0,scene,false);
const BALL=(()=>{const g=new THREE.IcosahedronGeometry(.075,2),p=g.attributes.position;for(let i=0;i<p.count;i++){const v=V3(p.getX(i),p.getY(i),p.getZ(i));const k=1+.28*Math.sin(v.x*90+v.y*40)*Math.cos(v.z*70);v.multiplyScalar(k);p.setXYZ(i,v.x,v.y,v.z);}g.computeVertexNormals();
 return K.add(g,new THREE.MeshStandardMaterial({color:0xf1efe8,roughness:.95,flatShading:true}),0,0,0);})();BALL.visible=false;
// rollout trash cart at the curb (trash day): green body, black lid, wheels
const CAN=K.group(1.35,0,12.55);CAN.rotation.y=-.25;
{K.add(K.RB(.62,.98,.7,.06),K.M(0x2c5a34,.55),0,.53,0,CAN);for(let i=0;i<4;i++)K.add(K.B(.64,.03,.72),K.M(0x244a2b,.6),0,.25+i*.2,0,CAN,false);
 const w=K.CY(.11,.11,.06,20);for(const s of[-1,1]){const m=K.add(w,K.M(0x111111,.7),s*.3,.11,-.3,CAN);m.rotation.z=Math.PI/2;}
 K.add(K.B(.5,.04,.05),K.M(0x1b1b1b,.5),0,1.0,-.38,CAN);}
const LIDP=K.group(0,1.03,-.34,CAN);const LIDM=K.add(K.RB(.68,.05,.76,.02),K.M(0x151515,.5),0,0,.37,LIDP);
// ================= CAST =================
const mike=await K.person('mike',null,-1.35,0,9.7,0,0x2f6fd6);
const _v=V3();const wristW=(P_,sd='R')=>{const b=P_.BN['wrist'+sd];return b?b.getWorldPosition(_v).clone():P_.g.position.clone();};
// ================= LIGHT / POST (bright daylight, crisp, no haze) =================
scene.environmentIntensity=.9;scene.fog=new THREE.Fog(0xc4d6ea,120,320);
const sun=new THREE.DirectionalLight(0xfff1dc,3.2);sun.castShadow=true;sun.shadow.mapSize.set(LQ?2048:4096,LQ?2048:4096);Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:120});sun.shadow.bias=-.0004;sun.shadow.normalBias=.05;
sun.position.set(-14,40,30);sun.target.position.set(0,0,8);scene.add(sun);scene.add(sun.target);
const HEMI=new THREE.HemisphereLight(0xf2f7ff,0x7a9a50,1.15);scene.add(HEMI);renderer.toneMappingExposure=1.15;
const cam=new THREE.PerspectiveCamera(45,W/H,.05,600);
const comp=new EffectComposer(renderer,new THREE.WebGLRenderTarget(W*PR,H*PR,{samples:LQ?0:4,type:THREE.HalfFloatType}));comp.setPixelRatio(PR);comp.setSize(W,H);comp.addPass(new RenderPass(scene,cam));
const OUT=new OutlinePass(new THREE.Vector2(W,H),scene,cam);Object.assign(OUT,{edgeStrength:6,edgeGlow:.6,edgeThickness:2.2,pulsePeriod:0});OUT.visibleEdgeColor.set(0x38e8ff);OUT.hiddenEdgeColor.set(0x38e8ff);comp.addPass(OUT);
comp.addPass(new UnrealBloomPass(new THREE.Vector2(W,H),.32,.18,1.5));comp.addPass(new OutputPass());
const GRADE=new ShaderPass({uniforms:{tDiffuse:{value:null},con:{value:1.1},sat:{value:1.3},vig:{value:.14}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform sampler2D tDiffuse;uniform float con,sat,vig;varying vec2 vUv;void main(){vec4 c=texture2D(tDiffuse,vUv);vec3 v=c.rgb;float l=dot(v,vec3(.2126,.7152,.0722));v=mix(vec3(l),v,sat);v=(v-.5)*con+.5;float d=distance(vUv,vec2(.5));v*=1.-vig*smoothstep(.35,.85,d);gl_FragColor=vec4(clamp(v,0.,1.),c.a);}'});comp.addPass(GRADE);
// ================= CAMERA: wide (house + Mike + card + bill + bin) -> zoom card -> tight on $1,000 -> follow the throw =================
const SH=[{t0:0,set:'front',keys:[
 [0,[-.3,2.7,21.5],[-.3,3.0,9.5],50],
 [tForever,[-.35,3.3,17.6],[-.4,3.9,9.2],46],
 [tThou-.1,[-.4,4.0,14.6],[-.4,4.25,9.0],42],
 [tThrows-.15,[-.4,4.1,14.2],[-.4,4.2,9.0],42],
 [tThrows+.45,[.6,2.3,16.6],[.1,1.45,10.8],46],
 [tTrash+.15,[1.0,1.9,16.4],[.7,1.05,11.6],44],
 [tDay1+.4,[1.0,1.85,16.2],[.7,1.05,11.6],43]]}];
const LOOK=V3();
// ================= ANIMATION =================
const tCr=tThrows+.05,tRel=tThrows+.62,tLand=tRel+.42;   // crumple, release, land in the bin
function animate(t){
 // card: hovers, red edge pulses; UNPAID stamp slams on "forever"
 CARD.position.y=4.75+.05*Math.sin(t*1.6);CARD.rotation.y=.06*Math.sin(t*.8);CARD.rotation.x=-.06;
 EDGE.material.emissiveIntensity=1.6+.8*(Math.sin(t*9)>0?1:.4)*sm(tCard-.1,tCard+.2,t);
 {const k=Math.min(1,Math.max(0,(t-tForever)/.16));UNPAID.visible=t>=tForever;UNPAID.scale.setScalar(Math.max(.01,1.8-.8*k*k));}
 {const s=pop(t,tThou-.04,.3);AMT.visible=s>.01;AMT.scale.setScalar(Math.max(.001,s));AMT.position.set(-.4,3.22+.03*Math.sin(t*2.4),9.25);AMT.quaternion.copy(cam.quaternion);}
 // Mike: holds the bill, glances up at the card, shrugs on "thousand", crumples, throws, fist up
 const M_=mike;K.relax(M_);K.idle(M_,t);M_.g.position.set(-1.35,0,9.7);
 const turn=sm(tThrows+.25,tRel-.1,t)*(1-sm(tLand+.15,tLand+.5,t));M_.g.rotation.y=.55*turn;
 const look=K.win(t,tCard-.1,tForever+.35,.15);K.pose(M_,'head',-.45*look,0,0);
 const hold=1-sm(tCr+.25,tCr+.35,t);
 if(t<tCr+.3){K.arm(M_,'R',AD[0]+.95,AD[2]-.25,1.25);K.face(M_,{smile:.5*(1-look),jaw:.15*look});}
 const sh=K.win(t,tThou+.1,tThrows-.1,.15);if(sh>0){K.shrug(M_,sh);K.face(M_,{smile:.9*sh});}
 if(t>=tCr&&t<tCr+.35){const c=sm(tCr,tCr+.3,t);K.arm(M_,'L',AD[0]+.95*c,AD[2]-.3*c,1.35*c);}
 if(t>=tCr+.3&&t<tLand+.1){const wu=sm(tCr+.3,tRel-.12,t),fw=sm(tRel-.12,tRel+.05,t);
  K.arm(M_,'R',AD[0]+.3+1.1*fw,AD[2]-2.0*wu+1.4*fw,1.6*wu-1.4*fw);K.pose(M_,'spine03',-.08*wu+.15*fw,.25*wu-.2*fw,0);K.face(M_,{smile:.4});}
 const win=sm(tLand,tLand+.15,t);if(win>0){K.arm(M_,'L',AD[0]+.3*win,AD[2]-2.0*win,.6*win);K.face(M_,{smile:1.3*win,jaw:.2*win});M_.g.position.y=.08*Math.abs(Math.sin((t-tLand)*8))*win*(1-sm(tLand+.6,tLand+.9,t));}
 M_.g.updateMatrixWorld(true);
 const wr=wristW(M_,'R'),wl=wristW(M_,'L');
 // bill in the right hand -> crumpled between both hands -> paper ball flies into the bin
 BILL.visible=t<tCr+.3;if(BILL.visible){const c=sm(tCr,tCr+.3,t);BILL.position.copy(wr).add(V3(.04,.03,.12)).lerp(wl.clone().add(wr).multiplyScalar(.5).add(V3(0,0,.12)),c);BILL.quaternion.copy(cam.quaternion);BILL.rotateZ(-.15);BILL.scale.set(1-.75*c,1-.7*c,1);}
 BALL.visible=t>=tCr+.25;
 if(BALL.visible){const target=V3(1.35,1.15,12.55);
  if(t<tRel){BALL.position.copy(wr).add(V3(.02,.02,.08));}
  else{BALL.userData.p0=BALL.userData.p0||wr.clone();const p0=BALL.userData.p0,u=Math.min(1,(t-tRel)/(tLand-tRel));BALL.position.set(p0.x+(target.x-p0.x)*u,p0.y+(target.y-p0.y)*u+1.3*u*(1-u),p0.z+(target.z-p0.z)*u);if(u>=1)BALL.visible=false;}
  BALL.rotation.set(t*6,t*4,0);}
 if(t<tRel)BALL.userData.p0=null;
 // bin lid: pops open just before the ball arrives, slaps shut
 LIDP.rotation.x=-1.05*K.win(t,tLand-.18,tLand+.05,.08)+.06*Math.sin((t-tLand)*30)*Math.exp(-Math.max(0,t-tLand)*8)*(t>tLand?1:0);
 OUT.selectedObjects=(t>=tThrows+.3&&t<tLand+.4)?[CAN]:[];OUT.edgeStrength=6+3*Math.sin(t*12);
 GRADE.uniforms.vig.value=.14+.22*K.win(t,tThou-.1,tThrows-.1,.2);   // tight glowing zoom on the amount: the rest goes darker
}
await loaded;await Promise.all(Object.values(MODELS));
const cap=document.getElementById('cap');
window.renderAt=t=>{try{K.shotCam(cam,t,SH);cam.getWorldDirection(LOOK);animate(t);}catch(e){console.error('RENDER ERR',t,e.message,e.stack.split('\n')[1]);}
 let c=CH[0];for(const x of CH)if(t>=x.s-.03)c=x;cap.textContent=c.t;const wa=t-c.s;cap.style.transform=`scale(${wa<.08?.86+wa/.08*.14:1})`;
 comp.render();return true;};
window.renderAt(Number(Q.get('t')||0));document.title='ready';
</script></body></html>
