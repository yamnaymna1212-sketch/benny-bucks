// Renders profile.html (1080x1080) -> inside-money-profile.png  |  node profile.mjs
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {chromium} from 'playwright';
const root=process.cwd(),PORT=8767;const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.jpg':'image/jpeg'};
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end();}
 r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);}).listen(PORT);
const b=await chromium.launch({channel:'chrome',headless:true,args:['--ignore-gpu-blocklist','--use-angle=metal','--enable-gpu']});
const p=await b.newPage({viewport:{width:1080,height:1080}});p.on('pageerror',e=>console.log('page error:',e.message));
await p.goto(`http://localhost:${PORT}/profile.html`);await p.waitForFunction(()=>document.title==='ready',null,{timeout:300000});
await p.screenshot({path:'inside-money-profile.png'});await b.close();srv.close();console.log('done');
