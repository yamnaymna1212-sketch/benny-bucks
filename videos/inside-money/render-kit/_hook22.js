// ===================== EP22 tips tax: GTA-cinematic diner hook =====================
const lawn=add(B(600,.2,600),pbr('leafy_grass',120,120,0x86d24a),0,-.1,0,scene,false);
street(0,19,400);
const PIT=undefined;
const DINER={siding:'white_planks_clean',col:0xf4d9b8,roof:'grey_roof_tiles',rc:0x8d929a,sh:0x2a6f7a,inner:0x7fd3c8,simple:true,flag:false,noPicket:true};
house(0,0,0,DINER,true,1);
house(-22,0,0,{siding:'white_planks_clean',col:0xb8e6dc,roof:'roof_07',rc:0xc79b84,sh:0xffffff,inner:0xece4d4,simple:true,flag:false},false,-1);
house(22,0,0,{siding:'white_planks_clean',col:0xfff1b8,roof:'grey_roof_tiles',rc:0x8d929a,sh:0x2a6f7a,inner:0xece4d4,simple:true,flag:false},false,1);
const FROND=(()=>{const g=new THREE.PlaneGeometry(.55,3.2,4,16);g.translate(0,1.6,0);const p=g.attributes.position;
 for(let i=0;i<p.count;i++){const y=p.getY(i),x=p.getX(i),u=y/3.2;p.setX(i,x*(1-u*.85)*(1+.3*Math.sin(u*3)));p.setZ(i,-u*u*1.8+Math.abs(x)*.35);}g.computeVertexNormals();return g;})();
const FM=new THREE.MeshStandardMaterial({color:0x2f8a3a,roughness:.7,side:THREE.DoubleSide}),TRK=M(0xa98a64,.9);
function palm(x,z,h,lean=.12,ry=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;scene.add(g);let px=0,py=0;const n=9;
 for(let i=0;i<n;i++){const u=i/n,seg=h/n,r=.2-.07*u;const m=add(CY(r*.92,r,seg*1.04,12),TRK,px,py+seg/2,0,g);m.rotation.z=-lean*u*1.6;px+=Math.sin(lean*u*1.6)*seg;py+=Math.cos(lean*u*1.6)*seg;}
 const top=new THREE.Group();top.position.set(px,py,0);g.add(top);for(let i=0;i<11;i++){const f=new THREE.Mesh(FROND,FM);f.castShadow=true;f.rotation.set(0,i/11*Math.PI*2+i*.3,0);top.add(f);}
 add(new THREE.SphereGeometry(.28,12,10),M(0x5a4a2a,.8),0,0,0,top);return g;}
for(const [x,z,h,l] of[[-7.5,11.6,8.5,.16],[7.2,11.8,9.5,-.12],[-14.5,10.5,10,.1],[14.6,10.8,8,-.18],[-30,11,9,.14],[30,11.5,10,-.1],[-11,26,9,.12],[10,26.5,10.5,-.1]])palm(x,z,h,l);
const {core}=await import('./scenekit/core.js');const K=await core(THREE,scene,{TL});
const {sm,pop,AD}=K;
const TLN=await (await fetch(Q.get('tl')||'timeline_ep22.json')).json(),CH=TLN.chunks,WS=TLN.words,DUR=TLN.dur;
const nw=x=>x.toLowerCase().replace(/[^a-z0-9]/g,'');
function FIND(ph,occ=0){const p=ph.split(/\s+/).map(nw);let c=0;for(let i=0;i+p.length<=WS.length;i++){if(p.every((w,j)=>nw(WS[i+j].w)===w)){if(c++===occ)return [i,i+p.length-1];}}console.error('phrase not found',ph);return [0,0];}
const T=(ph,o=0)=>WS[FIND(ph,o)[0]].s;
const tAmt=T('twenty-five thousand'),tTips=T('tips'),tTax=T('tax'),tPay=T('pay'),tZero=T('zero'),tNew=T('a new');
{const [a,b]=FIND('twenty-five thousand dollars');for(let i=a;i<=b;i++)CH[i].t='$25,000';}
// ================= DINER INTERIOR (cutaway): checker floor, counter, stools, neon, giant tip jar =================
const FY=.52;
{const chk=tex(256,256,x=>{for(let i=0;i<8;i++)for(let j=0;j<8;j++){x.fillStyle=(i+j)%2?'#f4f1ea':'#c8302f';x.fillRect(i*32,j*32,32,32);}});chk.wrapS=chk.wrapT=THREE.RepeatWrapping;chk.repeat.set(4,3);
 const fl=add(new THREE.PlaneGeometry(8.6,7.1),new THREE.MeshStandardMaterial({map:chk,roughness:.35}),0,FY+.012,0,scene,false);fl.rotation.x=-Math.PI/2;
 // counter (chrome top, red front)
 add(B(5.6,1.0,.9),M(0xc8302f,.35,.1),0,FY+.5,-1.45);add(B(5.7,.08,1.0),M(0xdfe3e8,.2,.9),0,FY+1.04,-1.45);
 for(const sx of[-2.2,-1.1,0,1.1,2.2]){add(CY(.09,.09,.62,12),M(0xcfd3d8,.2,.9),sx,FY+.32,-.55);add(CY(.34,.34,.14,20),M(0x1f5fbf,.4),sx,FY+.69,-.55);}
 // back wall: neon DINER sign + menu board
 const neon=tex(1024,256,x=>{x.clearRect(0,0,1024,256);x.fillStyle='#ff2d78';x.font='800 190px Mont';x.textAlign='center';x.fillText('DINER',512,200);});
 add(new THREE.PlaneGeometry(2.6,.65),new THREE.MeshStandardMaterial({map:neon,transparent:true,emissive:0xff2d78,emissiveMap:neon,emissiveIntensity:1.2,roughness:.5}),-1.8,FY+2.35,-3.62,scene,false);
 add(B(2.0,.9,.05),M(0x1d2a33,.6),2.1,FY+2.0,-3.65,scene,false);
 const rl=new THREE.PointLight(0xffe2b0,3.2,9,1.6);rl.position.set(0,2.0,1.6);scene.add(rl);}
// giant glass tip jar overflowing with $20 straps + loose bills
const JAR=new THREE.Group();JAR.position.set(-.75,FY+1.08,-1.4);scene.add(JAR);
{const glass=new THREE.MeshStandardMaterial({color:0xdff3ff,roughness:.08,transparent:true,opacity:.16,envMapIntensity:.25,depthWrite:false});
 add(CY(.44,.4,.8,36),glass,0,.4,0,JAR,false);add(CY(.47,.47,.06,36),M(0xdfe3e8,.3,.8),0,.82,0,JAR,false);
 for(let ly=0;ly<4;ly++)for(let a=0;a<5;a++){const s=MK.strap(20);s.scale.setScalar(1.25);const ang=a/5*Math.PI*2+ly*.6;s.position.set(Math.cos(ang)*.2,.12+ly*.17,Math.sin(ang)*.2);s.rotation.set(0,ang+Math.PI/2,0);JAR.add(s);}
 for(let i=0;i<8;i++){const b=MK.strap(20);b.scale.setScalar(1.1);b.position.set(Math.cos(i*2.4)*.28,.92+.05*(i%3),Math.sin(i*2.4)*.22);b.rotation.set(1.2+.1*i,i*1.1,.4);JAR.add(b);}}
// floating 3D: green $25,000 over the jar, red "TAX $0 ?" sign over the counter
const AMT=K.txt3('$25,000',.17,0x2fe06a,{ei:1.0});AMT.visible=false;
const SIGN=K.txt3('TAX $0 ?',.17,0xffd21a,{ei:1.05});SIGN.visible=false;
// ================= CAST: Mike (waiter, white apron) + IRS agent walks in =================
const IRST=tex(512,160,x=>{x.clearRect(0,0,512,160);x.fillStyle='#ffd21a';x.font='800 120px Mont';x.textAlign='center';x.fillText('IRS',256,128);});
const IRSM=new THREE.MeshStandardMaterial({map:IRST,transparent:true,roughness:.4,emissive:0xffd21a,emissiveMap:IRST,emissiveIntensity:.25});
const mike=await K.person('mike',null,.8,FY,-2.25,0,0x2f6fd6);
add(B(.5,.62,.05),M(0xffffff,.7),0,.82,.19,mike.g,false);   // apron
const AGENT=await K.person('guard',{'polo|cargo|suit|sportsuit|jacket':0x141c2e},0,0,30,Math.PI,0x141c2e);
AGENT.g.traverse(o=>{if(o.isMesh&&/polo|cargo|suit|jacket/i.test(o.name+o.material.name)){o.material.map=null;o.material.color.set(0x141c2e);o.material.needsUpdate=true;}});
{const bp=K.add(new THREE.PlaneGeometry(.5,.17),IRSM,0,1.22,-.2,AGENT.g,false);bp.rotation.y=Math.PI;}
const tEnter=tTax-.5,tStop=tEnter+1.6;
const _v=V3();
// ================= LIGHT / POST (golden hour GTA grade) =================
scene.environmentIntensity=.55;scene.fog=new THREE.Fog(0xf08a7a,70,260);
scene.background=K.tex(64,1024,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#1e1f5a');g.addColorStop(.3,'#5b3b8c');g.addColorStop(.42,'#c8508a');g.addColorStop(.49,'#ff7a5c');g.addColorStop(.53,'#ffb36b');g.addColorStop(.57,'#ffd88f');g.addColorStop(1,'#ffd88f');x.fillStyle=g;x.fillRect(0,0,w,h);});
scene.background.mapping=THREE.EquirectangularReflectionMapping;
const sun=new THREE.DirectionalLight(0xff9a5a,3.4);sun.castShadow=true;sun.shadow.mapSize.set(4096,4096);Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:120});sun.shadow.bias=-.0004;sun.shadow.normalBias=.05;
sun.position.set(-30,12,30);sun.target.position.set(0,0,8);scene.add(sun);scene.add(sun.target);
scene.add(new THREE.HemisphereLight(0xffb0a0,0x2a3550,.9));renderer.toneMappingExposure=1.2;
const cam=new THREE.PerspectiveCamera(45,W/H,.05,600);
const comp=new EffectComposer(renderer,new THREE.WebGLRenderTarget(W*PR,H*PR,{samples:4,type:THREE.HalfFloatType}));comp.setPixelRatio(PR);comp.setSize(W,H);comp.addPass(new RenderPass(scene,cam));
comp.addPass(new UnrealBloomPass(new THREE.Vector2(W,H),.34,.18,1.45));comp.addPass(new OutputPass());
const GRADE=new ShaderPass({uniforms:{tDiffuse:{value:null},con:{value:1.12},sat:{value:1.16},vig:{value:.28}},vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform sampler2D tDiffuse;uniform float con,sat,vig;varying vec2 vUv;void main(){vec4 c=texture2D(tDiffuse,vUv);vec3 v=c.rgb;float l=dot(v,vec3(.2126,.7152,.0722));v=mix(vec3(l),v,sat);v+=mix(vec3(-.02,.015,.03),vec3(.035,.01,-.025),smoothstep(.2,.8,l));v=(v-.5)*con+.5;float d=distance(vUv,vec2(.5));v*=1.-vig*smoothstep(.35,.85,d);gl_FragColor=vec4(clamp(v,0.,1.),c.a);}'});comp.addPass(GRADE);
// ================= CAMERA: slow push on Mike + jar, then the agent enters =================
const SH=[{t0:0,keys:[[0,[0,1.6,4.9],[0,FY+1.35,-1.4],40],[tTax,[0,1.58,4.5],[0,FY+1.35,-1.4],40],[tNew+1.4,[-.05,1.55,4.1],[-.05,FY+1.3,-1.3],40]]}];
const LOOK=V3();
const HUD=document.getElementById('hud'),STAR=[...HUD.children];HUD.style.top='86px';
function animate(t){
 // jar glow number
 {const a=pop(t,tAmt,.3);AMT.visible=a>.01;AMT.scale.setScalar(Math.max(.001,a));AMT.position.set(-.7,FY+2.25,-1.0);AMT.quaternion.copy(cam.quaternion);}
 {const a=pop(t,tTax+.05,.3);SIGN.visible=a>.01;SIGN.scale.setScalar(Math.max(.001,a)*(1+.03*Math.sin(t*8)*a));SIGN.position.set(.15,FY+2.6,-2.0);SIGN.quaternion.copy(cam.quaternion);}
 // Mike: proud, jar-side hand on the counter, reacts when the agent walks in
 K.relax(mike);K.idle(mike,t);mike.g.position.set(.8,FY,-2.25);
 const proud=K.win(t,0,tEnter+.4,.12);if(proud>0){K.arm(mike,'L',AD[0]+.9*proud,AD[2]-.7*proud,.4);K.face(mike,{smile:.9*proud});K.pose(mike,'head',.1,-.05*proud,0);K.pose(mike,'spine03',.06*Math.sin(t*3),0,0);}
 const gasp=K.win(t,tEnter+.4,tStop+1.4,.1);if(gasp>0){K.shrug(mike,gasp*.9);K.face(mike,{jaw:.5*gasp,smile:0});K.pose(mike,'head',-.08*gasp,.35*Math.sin(t*4)*gasp,0);}
 mike.g.rotation.y=-.15*sm(tEnter,tEnter+.5,t);
 // IRS agent: enters from the left, walks to the counter, stops, points at the jar
 {const P=AGENT,u=sm(tEnter,tStop,t),x=-1.6+1.45*u,z=.35-.1*u;K.relax(P);P.g.visible=t>tEnter-.05;P.g.position.set(x,FY,z);
  const yaw=Math.atan2(1.45,-.1)*(1-sm(tStop-.35,tStop,t))+(Math.PI)*sm(tStop-.35,tStop,t);P.g.rotation.y=yaw>0?yaw:yaw;
  const run=u>0&&u<1?Math.min(1,u*5,(1-u)*5):0;
  if(run>0){K.walk(P,t*1.5,.7*run);K.pose(P,'spine03',.1*run,0,0);P.g.position.y=FY+.03*Math.abs(Math.sin(t*1.5*7))*run;}
  else if(t>tStop-.01){K.idle(P,t,3);const k=sm(tStop,tStop+.3,t);K.point(P,'R',k);K.pose(P,'head',0,.1*Math.sin(t*2)*k,0);}}
 mike.g.updateMatrixWorld(true);
 // GTA HUD: 1 star when the agent enters, 2 when he points
 const stars=t>=tStop?2:t>=tEnter?1:0;STAR.forEach((s,i)=>{const on=i<stars;s.style.color=on?'#ffffff':'rgba(255,255,255,.18)';});
 HUD.style.opacity=String(sm(tEnter-.1,tEnter+.1,t));
}
await loaded;await Promise.all(Object.values(MODELS));
const cap=document.getElementById('cap');
window.renderAt=t=>{try{K.shotCam(cam,t,SH);cam.getWorldDirection(LOOK);animate(t);}catch(e){console.error('RENDER ERR',t,e.message,e.stack.split('\n')[1]);}
 let c=CH[0];for(const x of CH)if(t>=x.s-.03)c=x;cap.textContent=c.t;const wa=t-c.s;cap.style.transform=`scale(${wa<.08?.86+wa/.08*.14:1})`;
 comp.render();return true;};
window.renderAt(Number(Q.get('t')||0));document.title='ready';
</script></body></html>
