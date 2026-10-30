// Quick stills (cheap check before any video render): node stills.mjs ep2.html 0 2.5 4.5 [--q "gs=1&ax=[...]"]
// Writes still-<t>.jpg in this folder and prints the GPU + any page errors.
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';
import {chromium} from 'playwright';
const root=process.cwd(),PORT=8766;const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.woff2':'font/woff2','.jpg':'image/jpeg','.glb':'model/gltf-binary'};
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end();}
  r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);}).listen(PORT);
const args=process.argv.slice(2),qi=args.indexOf('--q'),extra=qi>=0?args.splice(qi,2)[1]:'';
const page=args[0],times=args.slice(1).map(Number);
const b=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--use-angle=metal','--enable-gpu']});
const p=await b.newPage({viewport:{width:720,height:1280}});
p.on('console',m=>{if(m.type()==='error')console.log('browser:',m.text().slice(0,300));});p.on('pageerror',e=>console.log('page error:',e.message));
await p.goto(`http://localhost:${PORT}/${page}?pr=1.5&${extra}`);await p.waitForFunction(()=>document.title==='ready',null,{timeout:300000});
console.log('GPU:',await p.evaluate(()=>{const g=document.createElement('canvas').getContext('webgl2');const e=g&&g.getExtension('WEBGL_debug_renderer_info');return e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):'unknown';}));
console.log('missing bones:',await p.evaluate(()=>window.missingBones));
for(const t of times){await p.evaluate(t=>renderAt(t),t);await p.screenshot({path:`still-${t}.jpg`,type:'jpeg',quality:90});console.log('still',t);}
await b.close();srv.close();
