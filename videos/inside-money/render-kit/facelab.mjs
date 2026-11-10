// Face lab: load a page once, render several bone/expression variants of one camera into a labelled contact sheet.
// node facelab.mjs ep10.html <t> "<cam x,y,z,lx,ly,lz,fov>" variants.json out.jpg
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';import ffmpeg from 'ffmpeg-static';
const root=process.cwd(),PORT=8767;const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.glb':'model/gltf-binary'};
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end();}
  r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);}).listen(PORT);
const [page,t,camq,vf,out]=process.argv.slice(2);const V=JSON.parse(fs.readFileSync(vf));
const b=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--use-angle=metal','--enable-gpu']});
const p=await b.newPage({viewport:{width:720,height:1280}});p.on('pageerror',e=>console.log('page error:',e.message));p.on('console',m=>{if(m.type()==='error')console.log('browser:',m.text().slice(0,300));});
await p.goto(`http://localhost:${PORT}/${page}?pr=1&cam=0,1,0,0,1,1,30&t=${t}`);await p.waitForFunction(()=>document.title==='ready',null,{timeout:300000});
// camq = "who,bone,dist,fov[,dx,dy]" -> camera in front of that bone (along the character's facing), or a raw "x,y,z,lx,ly,lz,fov"
await p.evaluate(([camq,t])=>{const a=camq.split(',');if(a.length===7){Q.set('cam',camq);return;}const P=a[0]==='T'?TR:MIKE;renderAt(Number(t));P.g.updateMatrixWorld(true);
 const w=new THREE.Vector3();let f=new THREE.Vector3(0,0,1).applyQuaternion(P.g.getWorldQuaternion(new THREE.Quaternion()));
 if(a[1]==='eyes'){const c=new THREE.Vector3(),v=new THREE.Vector3();let n=0;P.g.traverse(o=>{if(o.isSkinnedMesh&&/high-poly/.test(o.name+o.material.name)){const pa=o.geometry.attributes.position;for(let i=0;i<pa.count;i+=7){o.getVertexPosition(i,v);o.localToWorld(v);c.add(v);n++;}}});w.copy(c.divideScalar(n));
  const h=new THREE.Vector3();P.g.traverse(o=>{if(o.isBone&&o.name==='head')o.getWorldPosition(h);});f=w.clone().sub(h);f.y=0;f.normalize();window.EYEC=w.toArray();}
 else P.g.traverse(o=>{if(o.isBone&&o.name===a[1])o.getWorldPosition(w);});const r=new THREE.Vector3(1,0,0).applyQuaternion(P.g.getWorldQuaternion(new THREE.Quaternion()));
 const d=+a[2],dx=+(a[4]||0),dy=+(a[5]||0);const L=w.clone().addScaledVector(r,dx).add(new THREE.Vector3(0,dy,0));const C=L.clone().addScaledVector(f,d);Q.set('cam',[...C.toArray(),...L.toArray(),+a[3]].map(v=>v.toFixed(4)).join(','));},[camq,t]);
console.log("eyes centre",await p.evaluate(()=>window.EYEC));fs.mkdirSync('/tmp/fl',{recursive:true});const files=[];
for(const [i,v] of V.entries()){await p.evaluate(v=>{window.FB=v.fb||null;window.FX=v.fx||null;renderAt(v.t??Number(new URLSearchParams(location.search).get('t')));const c=document.getElementById('cap');c.textContent=v.label;c.style.fontSize='18px';c.style.top='4%';},v);
  const f=`/tmp/fl/v${i}.jpg`;await p.screenshot({path:f,type:"jpeg",quality:88,clip:{x:0,y:0,width:720,height:1280},scale:"css"});execFileSync(ffmpeg,["-y","-v","error","-i",f,"-vf","scale=360:640",f.replace(".jpg","s.jpg")]);fs.renameSync(f.replace(".jpg","s.jpg"),f);files.push(f);console.log(i,v.label);}
await b.close();srv.close();
const cols=Math.min(4,files.length),rows=Math.ceil(files.length/cols);
if(files.length===1)fs.copyFileSync(files[0],out);else execFileSync(ffmpeg,["-y","-v","error",...files.flatMap(f=>['-i',f]),'-filter_complex',`${files.map((_,i)=>`[${i}]`).join('')}xstack=inputs=${files.length}:layout=${files.map((_,i)=>`${(i%cols)*360}_${Math.floor(i/cols)*640}`).join('|')}:fill=black`,'-frames:v','1',out]);
console.log('sheet ->',out);
