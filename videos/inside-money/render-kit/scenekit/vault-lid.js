// scenekit/vault-lid.js - "the strongest armor in the world": a bolted steel lid with hazard edges, a vault wheel and a keypad whose screen you can rewrite.
//   const LID=vaultLid(K,{w,d,h,kpx,kpz});  (kpx/kpz = keypad position on the lid)  LID.root (Group, y=0 = underside)  LID.wheel (Group)  LID.screen('****','#39ff6a')  LID.keypadPos (local)
export function vaultLid(K,{w=4,d=3.3,h=.3,kpx=.7,kpz=0}={}){
 const {THREE,add,B,RB,CY,M}=K;const ARM=K.group();
 const steel=new THREE.MeshPhysicalMaterial({color:0x7f878f,metalness:.75,roughness:.45,clearcoat:.2,envMapIntensity:.9}),dark=M(0x2b2f34,.4,.9);
 const HZ=K.tex(1024,64,x=>{x.fillStyle='#f2c200';x.fillRect(0,0,1024,64);x.fillStyle='#111';for(let i=-2;i<34;i++){x.beginPath();x.moveTo(i*32,64);x.lineTo(i*32+16,64);x.lineTo(i*32+48,0);x.lineTo(i*32+32,0);x.fill();}}),hz=new THREE.MeshStandardMaterial({map:HZ,roughness:.5});
 add(RB(w,h,d,.05),steel,0,h/2,0,ARM);
 for(const s of[-1,1]){add(B(w+.01,.08,.01),hz,0,h*.55,s*(d/2+.003),ARM,false);const e=add(B(d+.01,.08,.01),hz,s*(w/2+.003),h*.55,0,ARM,false);e.rotation.y=Math.PI/2;}
 const bolt=new THREE.CylinderGeometry(.035,.035,.03,12);for(let i=0;i<15;i++)for(const s of[-1,1])add(bolt,dark,-w/2+.14+i*(w-.28)/14,h+.014,s*(d/2-.12),ARM,false);
 for(let i=1;i<10;i++)for(const s of[-1,1])add(bolt,dark,s*(w/2-.12),h+.014,-d/2+.12+i*(d-.24)/10,ARM,false);
 const W=new THREE.Group();W.position.set(-.45,h+.06,0);ARM.add(W);const cm=M(0xd5dade,.2,1);
 add(new THREE.TorusGeometry(.42,.045,14,40),cm,0,0,0,W).rotation.x=Math.PI/2;for(let k=0;k<3;k++){const sp=add(CY(.026,.026,.84,10),cm,0,0,0,W);sp.rotation.order='YXZ';sp.rotation.set(0,k*Math.PI/3,Math.PI/2);}add(CY(.1,.1,.07,20),cm,0,0,0,W);
 // keypad: dark housing, 3x4 keys, a screen texture redrawn on demand
 const KPX=kpx,KPZ=kpz;add(RB(.46,.13,.5,.02),dark,KPX,h+.065,KPZ,ARM);
 const KT=K.tex(256,120,()=>{});const sc=add(new THREE.PlaneGeometry(.36,.17),new THREE.MeshStandardMaterial({map:KT,emissive:0xffffff,emissiveMap:KT,emissiveIntensity:1.0}),KPX,h+.133,KPZ-.12,ARM,false);sc.rotation.x=-Math.PI/2;
 const keyM=M(0x9aa1a8,.35,.6);for(let r=0;r<4;r++)for(let c=0;c<3;c++)add(RB(.08,.03,.06,.01),keyM,KPX-.1+c*.1,h+.14,KPZ+.0+r*.065,ARM,false);
 const LED=add(new THREE.SphereGeometry(.018,10,8),new THREE.MeshStandardMaterial({color:0x39ff6a,emissive:0x39ff6a,emissiveIntensity:2}),KPX+.19,h+.14,KPZ-.2,ARM,false);
 let last='';const screen=(str,col='#39ff6a')=>{const key=str+col;if(key===last)return;last=key;K.redraw(KT,(x,cw,ch)=>{x.fillStyle='#070b07';x.fillRect(0,0,cw,ch);x.fillStyle=col;x.font=`800 ${str.length>4?62:84}px Mont`;x.textAlign='center';x.textBaseline='middle';x.fillText(str,cw/2,ch/2+4);});
  LED.material.color.set(col);LED.material.emissive.set(col);};
 screen('****');
 return {root:ARM,wheel:W,screen,keypadPos:K.V3(KPX,h+.14,KPZ),steel,w,d,h};}
