// Render caption-free stills (scale 0.25) at the given frames, one bundle + one browser.
// Usage (from studio/): node caption-frames.mjs <compId> <outDir> <frames.json>
import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition, openBrowser} from '@remotion/renderer';
import fs from 'fs';
import path from 'path';
const [comp, out, framesFile] = process.argv.slice(2);
const frames = JSON.parse(fs.readFileSync(framesFile, 'utf8'));
fs.mkdirSync(out, {recursive: true});
const serveUrl = await bundle({entryPoint: path.resolve('src/index.ts')});
const browser = await openBrowser('chrome', {browserExecutable: process.env.CH, chromeMode: 'chrome-for-testing'});
const inputProps = {noCaptions: true};
const composition = await selectComposition({serveUrl, id: comp, inputProps, puppeteerInstance: browser});
for (const f of frames) {
  const o = `${out}/f${String(f).padStart(5, '0')}.png`;
  if (fs.existsSync(o)) continue;
  await renderStill({composition, serveUrl, frame: f, output: o, scale: 0.25, inputProps, puppeteerInstance: browser});
}
await browser.close({silent: true});
console.log('stills', frames.length);
