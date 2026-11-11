// scenekit/excavator.js - a tracked excavator (clean "Building Box" toy-real look: clear-coat paint, tracks, cab glass, boom/arm/bucket pivots).
//   const EX=excavator(K,{x,z,ry,scale,color});  EX.pose(boom,arm,bucket,swing)   EX.dig(t,on) = automatic dig cycle (reach, curl, lift, swing, dump)
//   local +x = the bucket side. EX.root (Group), EX.BUCK (attach things to the bucket), EX.bucketDirt (Mesh)
export function excavator(K,{x=0,z=0,ry=0,scale=1,color=0xf6c21c,p=K.scene}={}){
 const {THREE,add,B,RB,CY,M,sm}=K;
 const EX=K.group(x,0,z,p);EX.rotation.y=ry;EX.scale.setScalar(scale);
 const YEL=new THREE.MeshPhysicalMaterial({color,roughness:.38,metalness:.1,clearcoat:.6}),DK=M(0x1d1f22,.6,.3),GLS=new THREE.MeshPhysicalMaterial({color:0x1a2a36,roughness:.05,metalness:.2,clearcoat:1,transparent:true,opacity:.8});
 for(const s of[-1,1]){add(RB(2.5,.55,.55,.2),DK,0,.3,s*.75,EX);for(let i=0;i<10;i++)add(B(.06,.57,.57),M(0x2a2c30,.7),-1.1+i*.245,.3,s*.75,EX,false);}
 add(CY(.55,.6,.25,24),DK,0,.66,0,EX);
 const TURN=new THREE.Group();TURN.position.y=.78;EX.add(TURN);
 add(RB(2.1,.75,1.65,.12),YEL,-.25,.38,0,TURN);add(RB(.9,.55,1.55,.15),YEL,-1.05,.55,0,TURN);
 add(RB(.85,.95,.8,.08),YEL,.45,1.1,.4,TURN);add(B(.78,.62,.04),GLS,.88,1.18,.4,TURN,false);add(B(.04,.6,.72),GLS,.45,1.18,.81,TURN,false);
 add(CY(.05,.05,.35,10),DK,-.6,1.0,-.5,TURN);
 const BOOM=new THREE.Group();BOOM.position.set(.55,.75,-.25);TURN.add(BOOM);add(B(2.2,.28,.26),YEL,1.05,0,0,BOOM);
 const ARMG=new THREE.Group();ARMG.position.set(2.15,0,0);BOOM.add(ARMG);add(B(.24,1.6,.22),YEL,0,-.75,0,ARMG);
 const BUCK=new THREE.Group();BUCK.position.set(0,-1.55,0);ARMG.add(BUCK);add(B(.5,.42,.6),DK,.15,-.15,0,BUCK);
 for(let i=0;i<4;i++)add(new THREE.ConeGeometry(.04,.12,6),M(0x9a9da2,.3,.8),.42,-.36,-.22+i*.15,BUCK,false).rotation.z=-Math.PI/2;
 const bucketDirt=add(new THREE.SphereGeometry(.26,14,10),K.pbr('dirt',.5,.5,0x8a6240),.15,0,0,BUCK,false);bucketDirt.visible=false;
 add(CY(.04,.04,1.2,8),M(0xb8bcc2,.3,.9),.55,-.05,-.25,TURN,false).rotation.z=1.0;
 const api={root:EX,TURN,BOOM,ARMG,BUCK,bucketDirt,mat:YEL,
  pose(bo,ar,bu,sw=0){BOOM.rotation.z=bo;ARMG.rotation.z=ar;BUCK.rotation.z=bu;TURN.rotation.y=sw;},
  // dig cycle at 1.55 Hz: returns the cycle phase (dump at ~.88) so the page can sync dirt + SFX
  dig(t,{swing=1.41,rate=1.55}={}){const cy=(t*rate)%1,L=(a,b,u)=>a+(b-a)*u;let bo,ar,bu;
   const sw=cy<.45?0:cy<.6?sm(.45,.6,cy):cy<.85?1:1-sm(.85,1,cy);
   if(cy<.25){const u=sm(0,.25,cy);bo=L(.45,-.35,u);ar=L(.2,.6,u);bu=L(.4,.2,u);}
   else if(cy<.4){const u=sm(.25,.4,cy);bo=-.35;ar=L(.6,.35,u);bu=L(.2,-1.1,u);}
   else if(cy<.85){const u=sm(.4,.55,cy);bo=L(-.35,.45,u);ar=L(.35,.2,u);bu=-1.1;}
   else{const u=sm(.85,.95,cy);bo=.45;ar=.2;bu=L(-1.1,.6,u);}
   api.pose(bo,ar,bu,swing*sw);bucketDirt.visible=cy>.33&&cy<.9;return cy;}};
 return api;}
