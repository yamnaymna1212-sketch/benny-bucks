// GPU render: serves this folder, renders every frame in Chromium (GPU on), then encodes mp4 with the audio.
// Usage: npm run render            (full video)
//        npm run render -- 5        (first 5 seconds only = preview)
//        add --show to watch it render in a visible window (most reliable GPU path)
import http from 'node:http';import fs from 'node:fs';import path from 'node:path';import {execFileSync} from 'node:child_process';
import {chromium} from 'playwright';import ffmpeg from 'ffmpeg-static';
const root=process.cwd(),PORT=8765;const types={'.html':'text/html','.js':'text/javascript','.json':'application/json','.woff2':'font/woff2','.jpg':'image/jpeg','.hdr':'application/octet-stream','.glb':'model/gltf-binary','.wav':'audio/wav'};
const srv=http.createServer((q,r)=>{const f=path.join(root,decodeURIComponent(q.url.split('?')[0]));if(!fs.existsSync(f)||fs.statSync(f).isDirectory()){r.writeHead(404);return r.end();}
  r.writeHead(200,{'Content-Type':types[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);}).listen(PORT);
const args=process.argv.slice(2),show=args.includes('--show'),secs=Number(args.find(a=>/^[0-9.]+$/.test(a))||0);
const EPS={ep1:{page:'ep1.html',tl:'timeline_ep1.json',wav:'mix_ep1.wav',out:'ep1-where-money.mp4'},ep2:{page:'ep2.html',tl:'timeline_ep2.json',wav:'mix_ep2.wav',out:'ep2-dig-200m.mp4'},ep4:{page:'ep4.html',tl:'timeline_ep4.json',wav:'mix_ep4.wav',out:'ep4-print-million.mp4'}};
const EP=EPS[args.find(a=>EPS[a])]||{page:'v2.html',tl:'timeline2.json',wav:'mix2.wav',out:'bank-v2.mp4'};
const b=await chromium.launch({channel:'chrome',headless:!show,args:['--ignore-gpu-blocklist','--use-angle=metal','--enable-gpu']});
let p=await b.newPage({viewport:{width:720,height:1280}});p.on('console',m=>{if(m.type()==='error')console.log('browser:',m.text().slice(0,200));});p.on('pageerror',e=>console.log('page error:',e.message));
const load=async()=>{await p.goto(`http://localhost:${PORT}/${EP.page}?pr=2`);await p.waitForFunction(()=>document.title==='ready',null,{timeout:600000});};
p.on('crash',()=>console.log('PAGE CRASHED'));p.on('framenavigated',f=>{if(f===p.mainFrame())console.log('navigated:',f.url());});
await load();
console.log('GPU:',await p.evaluate(()=>{const g=document.createElement('canvas').getContext('webgl2');const e=g.getExtension('WEBGL_debug_renderer_info');return e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):'unknown';}));
const dur=secs||JSON.parse(fs.readFileSync(EP.tl)).dur,N=Math.round(dur*30);
fs.rmSync('frames',{recursive:true,force:true});fs.mkdirSync('frames');const t0=Date.now();
for(let f=0;f<N;f++){for(let a=0;;a++){try{await p.evaluate(t=>renderAt(t),f/30);break;}catch(e){if(a>=3)throw e;console.log(`frame ${f}: ${e.message.split('\n')[0]} -> reloading page`);if(p.isClosed())p=await b.newPage({viewport:{width:720,height:1280}});await load();}}
  await p.screenshot({path:`frames/f${String(f).padStart(4,'0')}.jpg`,type:'jpeg',quality:94});
  if(f%30===0)console.log(`frame ${f}/${N}  ${((Date.now()-t0)/1000).toFixed(0)}s`);}
await b.close();srv.close();
const out=secs?EP.out.replace('.mp4',`-preview-${secs}s.mp4`):EP.out;
execFileSync(ffmpeg,['-y','-v','error','-framerate','30','-i','frames/f%04d.jpg','-i',EP.wav,'-t',String(dur),'-c:v','libx264','-preset','slow','-crf','17','-pix_fmt','yuv420p','-c:a','aac','-b:a','192k','-movflags','+faststart',out]);
console.log('done ->',out);
