// EP7 "Why do rich countries fight wars over cars?" — Chicken Tax / car wars. Hook = the user's own image
// (studio/public/tariff/hook.png: USA + Tesla vs China flag + Toyota Hilux) cut into layers and animated, Doug added in the middle.
// Hook first (approval), full episode after. Line timings: studio/src/data/doug-tariff.json.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {ConeStand, FishFlight, Igloo, PriceTag, Stamp, Thought, Title} from '../penguin/world';
import {BigSeal, Puffin, Seagull, Walrus} from '../penguin/cast';
import {Snowfall, Sun} from './dougGas';
import {cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Arrow, Puzzled, UsFlag, Why} from './dougVenezuela';
import TIM from '../data/doug-tariff.json';

export const DOUG_TARIFF_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const back = (p: number) => { const q = cl(p) - 1; return 1 + 2.7 * q * q * q + 1.7 * q * q; }; // overshoot ease
// hook beats (s): arrow points at the USA, swings to the other side, VS throbs + Doug shocked
const US = 0.3, CN = 1.1, VS = 1.75;

// ---------- the user's image, cut into layers ----------
// Source 940x1672 drawn at full frame width; IY = where its top lands. Polygons (source px) partition the picture,
// so the layers tile back into the exact original once every piece has landed.
const IW = 940, IH = 1672, K = 1080 / IW, IY = 20;
type Pt = [number, number];
const POLY: Record<string, Pt[]> = {
  usTop: [[0, 480], [405, 480], [405, 845], [400, 845], [110, 850], [60, 880], [0, 900]],
  usCar: [[0, 900], [60, 880], [110, 850], [400, 845], [405, 845], [487, 870], [487, 1110], [0, 1110]],
  vs: [[405, 580], [555, 580], [555, 840], [405, 840]],
  cnTop: [[405, 480], [IW, 480], [IW, 840], [870, 830], [640, 835], [600, 870], [487, 870], [405, 845], [405, 840], [555, 840], [555, 580], [405, 580]],
  cnCar: [[487, 870], [600, 870], [640, 835], [870, 830], [IW, 840], [IW, 1110], [487, 1110]],
};
const center = (k: string) => { const p = POLY[k]; const xs = p.map((q) => q[0]), ys = p.map((q) => Math.min(q[1], 1090)); return [(Math.min(...xs) + Math.max(...xs)) / 2 * K, IY + (Math.min(...ys) + Math.max(...ys)) / 2 * K]; };

const Layer = ({k, dx = 0, dy = 0, s = 1, rot = 0, children}: {k: string; dx?: number; dy?: number; s?: number; rot?: number; children?: React.ReactNode}) => {
  const [cx, cy] = center(k);
  return <div style={{position: 'absolute', left: 0, top: IY, width: 1080, height: IH * K, clipPath: `polygon(${POLY[k].map(([x, y]) => `${x * K}px ${y * K}px`).join(',')})`,
    transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${s})`, transformOrigin: `${cx}px ${cy - IY}px`, mixBlendMode: 'multiply'}}>
    <Img src={staticFile('tariff/hook.png')} style={{width: 1080, height: IH * K, display: 'block'}} />
    {children}
  </div>;
};

// Light sweep across a car body (glossy "showroom" pass) between a and a+0.6 s.
const Shine = ({t, a}: {t: number; a: number}) => {
  const p = (t - a) / 0.6; if (p < 0 || p > 1) return null;
  return <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen', background: `linear-gradient(105deg, transparent ${p * 140 - 24}%, rgba(255,255,255,0.5) ${p * 140 - 20}%, transparent ${p * 140 - 16}%)`}} />;
};

const Hook = ({t}: {t: number}) => {
  // both sides on screen from frame 0: the picture punches in, the side the arrow points at pulses, cars idle-shake, VS throbs
  const pop = back(t / 0.3), punch = 1.14 - 0.14 * pop;
  const pulse = (a: number) => 1 + 0.05 * Math.sin(cl((t - a) / 0.35) * Math.PI);
  const breathe = (ph: number) => 1 + 0.008 * Math.sin(t * 2.4 + ph);
  const idle = (ph: number) => Math.sin(t * 38 + ph) * 1.4; // engine running
  const vsS = (t < VS ? 1 + 0.04 * Math.sin(t * 7) : 1 + 0.35 * Math.exp(-(t - VS) * 8)) * punch;
  const lookR = t >= CN, shock = t >= VS;
  const tug = Math.sin(t * 5.5) * 0.7 + Math.sin(t * 2.1) * 0.3, pull = tug * 26; // rope position: + = China wins, - = USA wins
  return <>
    <Layer k="usTop" s={punch * breathe(0) * pulse(US)} dx={pull - 10} rot={-3 + tug * 3} />
    <Layer k="usCar" s={punch * pulse(US)} dy={idle(0)}><Shine t={t} a={US + 0.2} /><Shine t={t} a={3.2} /></Layer>
    <Layer k="cnTop" s={punch * breathe(1.5) * pulse(CN)} dx={pull + 10} rot={3 + tug * 3} />
    <Layer k="cnCar" s={punch * pulse(CN)} dy={idle(2)}><Shine t={t} a={CN + 0.2} /><Shine t={t} a={3.6} /></Layer>
    <Layer k="vs" s={vsS} rot={Math.sin(t * 4) * 2} />
    <Rope t={t} pull={pull} />
    <Why t={t} />
    <Arrow x={540} y={500} t={t} swingAt={CN} />
    <Penguin id="doug" x={540} y={1480} h={290} pose={{turn: tug * 0.6, look: [tug, -0.6], brows: shock ? 'shock' : lookR ? 'worried' : 'happy',
      eyeScale: shock ? 1.3 : 1.05, pupil: shock ? 0.5 : 1, beak: shock ? 'frown' : 'smile', flapR: shock ? 70 : 35, flapL: shock ? 70 : 35, sweat: shock, hop: shock && t - VS < 0.3 ? 1 : 0}} />
    {shock && <Puzzled x={630} y={1170} t={t} />}
  </>;
};

// Tug-of-war rope from Trump's pointing hand to Xi's folded arms, red knot in the middle, comic bursts on each yank.
const Rope = ({t, pull}: {t: number; pull: number}) => {
  const ax = 212 + pull - 10, ay = 899, bx = 856 + pull + 10, by = 950, mx = (ax + bx) / 2, sag = 40 + Math.sin(t * 9) * 6;
  const yank = Math.floor(t * 5.5 / Math.PI) % 2 === 0 ? 'TUG!' : 'PULL!', side = Math.cos(t * 5.5) > 0 ? 1 : -1;
  return <>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M${ax} ${ay} Q ${mx} ${(ay + by) / 2 + sag} ${bx} ${by}`} fill="none" stroke={INK} strokeWidth={17} strokeLinecap="round" />
      <path d={`M${ax} ${ay} Q ${mx} ${(ay + by) / 2 + sag} ${bx} ${by}`} fill="none" stroke="#C99A5B" strokeWidth={10} strokeLinecap="round" strokeDasharray="14 10" />
      <path d={`M${mx - 18} ${(ay + by) / 2 + sag / 2 - 4} l18 -34 l18 34 Z`} fill="#D83A2E" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    </svg>
    <div style={{position: 'absolute', left: 540 + side * 330 - 90, top: 1130, width: 180, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 54, color: '#fff',
      WebkitTextStroke: `10px ${INK}`, paintOrder: 'stroke', transform: `rotate(${side * 8}deg) scale(${1 + 0.15 * Math.abs(Math.sin(t * 11))})`}}>{yank}</div>
  </>;
};

// "This is Doug." -> Doug's own place: snow, igloo, dreaming of the Hilux (the truck from the hook picture).
const DougHome = ({t}: {t: number}) => {
  const want = t >= TIM[2].start;
  return <>
    <Snowfall t={t} />
    <div style={{position: 'absolute', left: -400, right: -400, top: 1300, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
    <Igloo x={820} y={1300} w={420} />
    <Penguin id="doug" x={420} y={1300} h={560} pose={{turn: want ? 0.4 : 0, look: want ? [0.6, -0.9] : [0, 0], brows: want ? 'worried' : 'happy', beak: 'smile', flapR: want ? 20 : 60 + Math.sin(t * 8) * 25, blush: want ? 0.6 : 0}} />
    <Thought x={680} y={430} w={560} tx={470} ty={760} at={TIM[2].start}>
      <div style={{position: 'absolute', left: 70, top: 40, width: 420, height: 250, overflow: 'hidden'}}>
        <Img src={staticFile('tariff/hook.png')} style={{position: 'absolute', width: IW * 0.93, left: -490 * 0.93, top: -830 * 0.93}} />
      </div>
    </Thought>
  </>;
};

// ---------- episode helpers ----------
const P = (i: number) => TIM[i].start;
const RED = '#D83A2E', GREEN = '#2E9E4F', G = 1300;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const Ground = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 800, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;

// Crop of the user's picture (source px box), bottom-centre at (x, y), width w. White paper vanishes with multiply.
const PARTS: Record<string, [number, number, number, number]> = {
  trump: [28, 628, 208, 905], elon: [182, 640, 330, 882], duo: [25, 628, 332, 905], xi: [665, 640, 852, 862],
  tesla: [8, 842, 482, 1068], hilux: [488, 828, 935, 1092], usflag: [60, 500, 262, 700], cnflag: [700, 515, 918, 700],
};
const Cut = ({part, x, y, w, flip, rot = 0, s = 1}: {part: string; x: number; y: number; w: number; flip?: boolean; rot?: number; s?: number}) => {
  const [x0, y0, x1, y1] = PARTS[part], k = w / (x1 - x0), h = (y1 - y0) * k;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h, overflow: 'hidden', mixBlendMode: 'multiply',
    transform: `${flip ? 'scaleX(-1) ' : ''}rotate(${rot}deg) scale(${s})`, transformOrigin: '50% 100%'}}>
    <Img src={staticFile('tariff/hook.png')} style={{position: 'absolute', width: IW * k, left: -x0 * k, top: -y0 * k}} />
  </div>;
};
const pop = (t: number, at: number) => back((t - at) / 0.3);
const Big = ({text, x, y, at, t, size = 140, color = INK, rot = -3}: {text: string; x: number; y: number; at: number; t: number; size?: number; color?: string; rot?: number}) => {
  if (t < at) return null;
  return <div style={{position: 'absolute', left: x - 500, width: 1000, top: y - size * 0.6, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, color, lineHeight: 1.1,
    WebkitTextStroke: color === INK ? undefined : `8px ${INK}`, paintOrder: 'stroke', transform: `rotate(${rot}deg) scale(${pop(t, at)})`}}>{text}</div>;
};

const Chicken = ({x, y, h = 300, t, peace, mad}: {x: number; y: number; h?: number; t: number; peace?: boolean; mad?: boolean}) => {
  const bob = Math.abs(Math.sin(t * 7)) * -8;
  return <svg width={h} height={h} viewBox="0 0 300 300" style={{position: 'absolute', left: x - h / 2, top: y - h + bob, overflow: 'visible'}}>
    <path d="M120 240 L110 296 M170 240 L180 296 M95 296 L125 296 M165 296 L195 296" stroke="#E8A20C" strokeWidth={9} strokeLinecap="round" />
    <path d="M60 170 C 40 90, 120 80, 150 120 C 170 60, 240 70, 250 120 C 270 210, 210 250, 150 250 C 90 250, 70 220, 60 170 Z" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M60 170 C 20 150, 20 110, 40 100 C 50 130, 60 140, 80 150" fill="#fff" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M190 60 Q 196 30 210 50 Q 220 22 232 50 Q 248 34 246 66" fill={RED} stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M250 104 L284 116 L250 128 Z" fill="#F5C518" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M246 130 Q 254 150 240 156 Q 232 144 240 130" fill={RED} stroke={INK} strokeWidth={4} />
    <circle cx={228} cy={96} r={9} fill={INK} />
    {mad && <path d="M212 78 L240 86" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
    <path d="M120 170 Q 150 200 190 170" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
    {peace && <g transform={`rotate(${Math.sin(t * 6) * 10} 100 150)`}><line x1={100} y1={150} x2={60} y2={20} stroke={INK} strokeWidth={6} />
      <path d="M60 20 L0 30 L10 70 L66 60 Z" fill="#fff" stroke={INK} strokeWidth={5} /></g>}
  </svg>;
};
const EuFlag = ({x, y, w = 200}: {x: number; y: number; w?: number}) => <svg width={w} height={w * 0.63} viewBox="0 0 190 120" style={{position: 'absolute', left: x - w / 2, top: y, overflow: 'visible'}}>
  <rect width={190} height={120} fill="#1F3FA8" stroke={INK} strokeWidth={5} />
  {Array.from({length: 12}, (_, i) => { const a = i / 12 * Math.PI * 2; return <circle key={i} cx={95 + Math.cos(a) * 38} cy={60 + Math.sin(a) * 38} r={6} fill="#FFDE00" />; })}
</svg>;
const Factory = ({x, y, w = 600, t, closed}: {x: number; y: number; w?: number; t: number; closed?: boolean}) => <>
  <svg width={w} height={w * 0.7} viewBox="0 0 600 420" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.7, overflow: 'visible'}}>
    <rect x={460} y={40} width={60} height={200} fill="#B9C3CC" stroke={INK} strokeWidth={7} />
    {!closed && [0, 1, 2].map((i) => { const p = (t * 0.6 + i / 3) % 1; return <circle key={i} cx={490 + p * 60} cy={30 - p * 160} r={22 + p * 30} fill="#E4E8EC" stroke={INK} strokeWidth={4} opacity={1 - p} />; })}
    <path d="M20 420 L20 200 L120 140 L120 200 L220 140 L220 200 L320 140 L320 200 L420 140 L420 200 L580 200 L580 420 Z" fill="#E7DCCB" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {[80, 200, 320, 440].map((wx) => <rect key={wx} x={wx} y={250} width={70} height={60} fill={closed ? '#6B6B6B' : '#FFE58A'} stroke={INK} strokeWidth={5} />)}
    <rect x={250} y={330} width={100} height={90} fill="#8A5A3C" stroke={INK} strokeWidth={6} />
    <text x={300} y={190} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill={INK}>CAR FACTORY</text>
    {closed && <><path d="M240 340 L360 400 M240 400 L360 340" stroke="#8A5A3C" strokeWidth={14} />
      <g transform="rotate(-8 300 280)"><rect x={170} y={250} width={260} height={70} fill={RED} stroke={INK} strokeWidth={6} rx={8} />
        <text x={300} y={300} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={46} fill="#fff">CLOSED</text></g></>}
  </svg>
</>;
const Tank = ({x, y, w = 520, t}: {x: number; y: number; w?: number; t: number}) => <svg width={w} height={w * 0.5} viewBox="0 0 520 260" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.5, overflow: 'visible'}}>
  <rect x={300} y={74} width={210} height={24} rx={8} fill="#6E7B3E" stroke={INK} strokeWidth={6} />
  <path d="M150 120 L180 60 L330 60 L350 120 Z" fill="#7D8A47" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
  <path d="M30 130 L470 130 L440 180 L60 180 Z" fill="#7D8A47" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
  <rect x={40} y={180} width={420} height={70} rx={35} fill="#3D3D3D" stroke={INK} strokeWidth={7} />
  {[90, 160, 230, 300, 370, 420].map((cx) => <circle key={cx} cx={cx} cy={215} r={22} fill="#777" stroke={INK} strokeWidth={5} transform={`rotate(${t * 200} ${cx} 215)`} />)}
  <path d="M230 80 l10 20 l22 2 l-17 14 l6 22 l-21 -12 l-21 12 l6 -22 l-17 -14 l22 -2 Z" fill="#fff" transform="translate(0 -14) scale(0.9) translate(25 10)" />
</svg>;
const Gate = ({x, y, open, t}: {x: number; y: number; open: number; t: number}) => <svg width={700} height={420} viewBox="0 0 700 420" style={{position: 'absolute', left: x - 120, top: y - 420, overflow: 'visible'}}>
  <rect x={60} y={120} width={110} height={300} fill="#F4F4F2" stroke={INK} strokeWidth={7} />
  <g transform={`rotate(${-open * 80} 130 170)`}>
    {Array.from({length: 7}, (_, i) => <rect key={i} x={170 + i * 70} y={150} width={70} height={40} fill={i % 2 ? '#fff' : RED} stroke={INK} strokeWidth={5} />)}
  </g>
  <rect x={40} y={20} width={150} height={90} rx={10} fill={RED} stroke={INK} strokeWidth={6} />
  <text x={115} y={82} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={46} fill="#fff">TAX</text>
</svg>;
const Shield = ({x, y, w = 360, flag, t}: {x: number; y: number; w?: number; flag: 'us' | 'cn'; t: number}) => <svg width={w} height={w * 1.2} viewBox="0 0 300 360" style={{position: 'absolute', left: x - w / 2, top: y - w * 1.2 + Math.sin(t * 4) * 6, overflow: 'visible'}}>
  <path d="M150 10 L290 60 Q 290 260 150 350 Q 10 260 10 60 Z" fill="#DCEBF5" stroke={INK} strokeWidth={9} strokeLinejoin="round" opacity={0.92} />
  <g transform="translate(60 120) scale(0.95)">{flag === 'us' ? <UsFlag /> : <CnFlag />}</g>
</svg>;
const UsFlagMini = ({x, y, w = 200}: {x: number; y: number; w?: number}) => <svg width={w} height={w * 0.63} viewBox="0 0 190 120" style={{position: 'absolute', left: x - w / 2, top: y, overflow: 'visible'}}><UsFlag /></svg>;
const CnFlag = () => <g>
  <rect width={190} height={120} fill="#DE2910" stroke={INK} strokeWidth={5} />
  <path d="M38 22 L44 40 L63 40 L48 51 L54 69 L38 58 L22 69 L28 51 L13 40 L32 40 Z" fill="#FFDE00" />
  {[[78, 14], [92, 30], [92, 52], [78, 66]].map(([cx, cy], i) => <circle key={i} cx={cx} cy={cy} r={6} fill="#FFDE00" />)}
</g>;
const Tears = ({x, y, t}: {x: number; y: number; t: number}) => <>{[0, 1].map((i) => { const p = (t * 1.6 + i * 0.5) % 1;
  return <div key={i} style={{position: 'absolute', left: x + (i ? 70 : -70), top: y + p * 120, width: 22, height: 30, borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', background: '#7CC4EC', border: `3px solid ${INK}`, opacity: 1 - p}} />; })}</>;

// ---------- scenes ----------
const HiluxHero = ({t}: {t: number}) => {
  const drive = ease((t - P(4)) / 0.6);
  return <>
    <Ground />
    <Cut part="xi" x={250} y={G - 250} w={330} />
    <Cut part="hilux" x={-300 + 900 * drive} y={G + 30} w={720} rot={Math.sin(t * 30) * 0.4} />
    <Big text="TOUGH" x={540} y={420} at={P(4) + 0.6} t={t} size={150} color={GREEN} />
    <Big text="HILUX" x={540} y={640} at={P(5)} t={t} size={180} color="#fff" rot={4} />
  </>;
};
const WholeWorld = ({t}: {t: number}) => {
  const r = 250, rot = t * 40;
  return <>
    <svg width={600} height={600} viewBox="-300 -300 600 600" style={{position: 'absolute', left: 240, top: 560, overflow: 'visible'}}>
      <circle r={r} fill="#7CC4EC" stroke={INK} strokeWidth={8} />
      <g transform={`rotate(${rot / 4})`}><path d="M-160 -120 Q -60 -200 0 -120 Q 40 -60 -40 -20 Q -120 0 -160 -120 Z M40 40 Q 140 0 180 80 Q 140 180 60 150 Z M-150 60 Q -80 40 -60 120 Q -120 170 -170 120 Z" fill="#7BC67E" stroke={INK} strokeWidth={6} /></g>
    </svg>
    {[0, 1, 2, 3, 4].map((i) => { const a = (rot + i * 72) * Math.PI / 180; return <Cut key={i} part="hilux" x={540 + Math.cos(a) * 360} y={860 + Math.sin(a) * 330 + 60} w={230} flip={Math.sin(a) > 0} />; })}
    <Big text="WHOLE WORLD" x={540} y={330} at={P(6)} t={t} size={110} />
  </>;
};
const NoHilux = ({t}: {t: number}) => <>
  <Ground />
  <UsFlagMini x={540} y={260} w={300} />
  <Cut part="hilux" x={780} y={G + 20} w={520} />
  {t >= P(10) + 1 && <Big text="✕" x={780} y={1080} at={P(10) + 1} t={t} size={420} color={RED} rot={0} />}
  <Cut part="trump" x={350} y={G - 120} w={330} />
  <Penguin id="doug" x={260} y={G + 150} h={330} pose={{turn: 0.5, look: [0.8, -0.3], brows: 'worried', beak: 'frown', flapR: 30}} />
  <Big text="NO HILUX" x={540} y={660} at={P(10) + 1} t={t} size={120} color={RED} />
</>;
const WhyChicken = ({t}: {t: number}) => {
  const fall = ease((t - P(12)) / 0.35), chick = t >= P(12);
  return <>
    <Ground />
    <Penguin id="doug" x={300} y={G} h={480} pose={{turn: 0.4, look: chick ? [0.6, -0.8] : [0, -0.3], brows: chick ? 'shock' : 'worried', eyeScale: chick ? 1.35 : 1, pupil: chick ? 0.5 : 1, beak: 'frown', flapR: chick ? 80 : 30, flapL: chick ? 80 : 30}} />
    {!chick && <Puzzled x={450} y={560} t={t} />}
    {chick && <Chicken x={720} y={G - 900 * (1 - fall)} h={420} t={t} />}
    <Big text="CHICKEN?!" x={540} y={420} at={P(12) + 0.3} t={t} size={140} color="#F5C518" />
  </>;
};
const Europe1964 = ({t}: {t: number}) => {
  const stamp = P(13) + 2.3;
  return <>
    <Ground />
    <div style={{position: 'absolute', left: 390, top: 230, width: 300, height: 220, background: '#fff', border: `7px solid ${INK}`, borderRadius: 16, textAlign: 'center', transform: `rotate(-4deg) scale(${pop(t, P(13))})`}}>
      <div style={{background: RED, height: 50, borderBottom: `6px solid ${INK}`, borderRadius: '8px 8px 0 0'}} />
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 104, color: INK}}>1964</div>
    </div>
    <EuFlag x={230} y={560} w={260} />
    <Seagull id="eugull" x={260} y={G} h={430} pose={{angry: true, mouth: t > stamp - 0.4 && t < stamp + 0.4 ? 0.6 : 0, flap: t > stamp - 0.3 ? 40 : 0}} />
    <UsFlagMini x={790} y={620} w={220} />
    <Chicken x={790} y={G} h={360} t={t} />
    <Stamp text="TAX" x={790} y={1050} at={stamp} color={RED} size={120} />
  </>;
};
const Angry = ({t}: {t: number}) => {
  const shake = t < P(16) ? Math.sin(t * 60) * 6 : 0, gate = t >= P(16);
  return <>
    <Ground />
    {!gate ? <>
      <UsFlagMini x={540} y={300} w={420} />
      <div style={{position: 'absolute', left: 0, top: 0, transform: `translateX(${shake}px)`}}><Cut part="trump" x={540} y={G} w={560} /></div>
      <Big text={t >= P(15) ? 'REVENGE' : 'ANGRY'} x={540} y={1180} at={t >= P(15) ? P(15) : P(14)} t={t} size={150} color={RED} rot={-6} />
    </> : <>
      <Gate x={430} y={G} open={0} t={t} />
      <Cut part="trump" x={250} y={G - 60} w={300} />
      <Cut part="hilux" x={lerp(1400, 900, ease((t - P(16)) / 0.6))} y={G + 20} w={480} />
      <Big text="FOREIGN TRUCKS" x={540} y={460} at={P(16) + 0.5} t={t} size={96} />
    </>}
  </>;
};
const TwentyFive = ({t}: {t: number}) => <>
  <Ground />
  <Cut part="hilux" x={540} y={G + 20} w={640} />
  <Big text="25%" x={540} y={620} at={P(17)} t={t} size={330} color={RED} rot={-5} />
  <Big text="TAX" x={540} y={880} at={P(17) + 0.35} t={t} size={150} />
</>;
const ChickenTax = ({t}: {t: number}) => <>
  <Chicken x={540} y={1300} h={440} t={t} mad />
  <Title lines={['CHICKEN TAX']} y={560} at={P(19) + 0.5} size={130} />
</>;
const Confused = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={540} y={G + 120} h={760} pose={{brows: 'worried', eyeScale: 1.2, pupil: 0.8, beak: 'flat', look: [Math.sin(t * 3) * 0.6, -0.2], flapR: 30, flapL: 30, sweat: true}} />
  <Puzzled x={760} y={420} t={t} />
  <Puzzled x={240} y={480} t={t + 1} />
</>;
const WarOver = ({t}: {t: number}) => {
  const later = t >= P(22), year = Math.round(lerp(1964, 2026, ease((t - P(22)) / 1.2)));
  return <>
    <Ground />
    {!later ? <>
      <Chicken x={360} y={G} h={380} t={t} peace />
      <Big text="WAR OVER" x={540} y={420} at={P(21)} t={t} size={120} color={GREEN} />
      <Gate x={600} y={G} open={0} t={t} />
      <Big text="TAX: STILL HERE" x={540} y={620} at={P(21) + 0.9} t={t} size={92} color={RED} rot={4} />
    </> : <>
      <div style={{position: 'absolute', left: 300, top: 300, width: 480, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 190, color: INK}}>{year}</div>
      <Gate x={430} y={G} open={0} t={t} />
      {[0, 1, 2].map((i) => <svg key={i} width={160} height={160} viewBox="0 0 100 100" style={{position: 'absolute', left: 300 + i * 260, top: 860 + i * 30, opacity: ease((t - P(22) - 0.6) / 0.6)}}>
        <path d="M0 0 L100 100 M100 0 L0 100 M50 0 L50 100 M0 50 L100 50" stroke="#888" strokeWidth={2} /><circle cx={50} cy={50} r={20} fill="none" stroke="#888" strokeWidth={2} /><circle cx={50} cy={50} r={38} fill="none" stroke="#888" strokeWidth={2} /></svg>)}
      <Big text="60 YEARS" x={540} y={600} at={P(22) + 1.2} t={t} size={110} color={RED} />
    </>}
  </>;
};
const Jobs = ({t}: {t: number}) => {
  const jobs = t >= P(28);
  return <>
    <Ground />
    <Cut part="tesla" x={540} y={G + 20} w={720} s={jobs ? 0.7 : 1} />
    {!jobs && <Puzzled x={800} y={560} t={t} />}
    {jobs && <>
      <Walrus id="w1" x={180} y={G + 40} h={360} hat={false} pose={{mouth: 0.3}} />
      <BigSeal id="s1" x={900} y={G + 40} h={340} flip />
      <Big text="JOBS" x={540} y={560} at={P(28)} t={t} size={240} color={GREEN} rot={-4} />
    </>}
  </>;
};
const Workers = ({t}: {t: number}) => <>
  <Ground />
  <Factory x={540} y={980} w={640} t={t} />
  {[0, 1, 2, 3, 4, 5].map((i) => { const x = lerp(-200 - i * 160, 120 + i * 168, ease((t - P(29) - 0.6 - i * 0.12) / 0.6));
    return i % 3 === 0 ? <Walrus key={i} id={`wk${i}`} x={x} y={G + 140} h={230} hat={false} /> : i % 3 === 1 ? <BigSeal key={i} id={`wk${i}`} x={x} y={G + 140} h={210} /> : <Puffin key={i} id={`wk${i}`} x={x} y={G + 140} h={220} />; })}
  <Big text="1,000 WORKERS" x={540} y={250} at={P(29) + 0.9} t={t} size={100} />
</>;
const Spend = ({t}: {t: number}) => <>
  <Ground />
  <Igloo x={220} y={G} w={340} />
  <ConeStand x={820} y={G} w={380} price="$5" />
  <Walrus id="sp1" x={420} y={G + 160} h={300} hat={false} pose={{mouth: 0.4}} />
  <Puffin id="sp2" x={640} y={G + 170} h={260} />
  <FishFlight x1={420} y1={G - 100} x2={800} y2={G - 400} a={P(30) + 0.3} b={P(30) + 1.1} n={5} w={90} />
  <FishFlight x1={640} y1={G - 100} x2={260} y2={G - 300} a={P(30) + 1} b={P(30) + 1.8} n={4} w={80} seed={2} />
  <Big text="$ → TOWN" x={540} y={330} at={P(30) + 0.4} t={t} size={120} color={GREEN} />
</>;
const Closed = ({t}: {t: number}) => <>
  <Ground />
  <Factory x={540} y={980} w={640} t={t} closed />
  <Walrus id="c1" x={260} y={G + 150} h={300} hat={false} pose={{lids: 0.8}} />
  <Tears x={240} y={G - 130} t={t} />
  <Puffin id="c2" x={820} y={G + 150} h={270} pose={{lids: 0.8}} />
  <Tears x={800} y={G - 110} t={t} />
  <Big text="TOWN CRY" x={540} y={260} at={P(31) + 0.3} t={t} size={120} color={RED} />
</>;
const RealLife = ({t}: {t: number}) => {
  const n = Math.round(lerp(0, 400000, ease((t - P(32) - 0.8) / 1.6)));
  return <>
    <Ground />
    <Cut part="xi" x={300} y={G - 180} w={360} />
    <Cut part="hilux" x={720} y={G + 20} w={520} />
    <Big text="IN REAL LIFE" x={540} y={260} at={P(32)} t={t} size={80} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 380, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 190, color: GREEN, WebkitTextStroke: `9px ${INK}`, paintOrder: 'stroke'}}>{n.toLocaleString('en-US')}</div>
    {t < P(33) ? <Big text="TOYOTA WORKERS" x={540} y={660} at={P(32) + 1.6} t={t} size={86} />
      : <Big text="= MIAMI 🌴" x={540} y={680} at={P(33)} t={t} size={110} color="#E8546A" rot={4} />}
  </>;
};
const War = ({t}: {t: number}) => {
  const tank = t >= P(35) + 1, none = t >= P(36);
  return <>
    <Ground />
    <Big text="CAR = WAR" x={540} y={300} at={P(34)} t={t} size={140} color={RED} />
    {!none ? <>
      <Big text="WORLD WAR 2" x={540} y={480} at={P(35)} t={t} size={96} />
      <Factory x={tank ? 300 : 540} y={1000} w={tank ? 440 : 600} t={t} />
      {tank && <Tank x={lerp(1300, 780, ease((t - P(35) - 1) / 0.6))} y={G + 20} w={460} t={t} />}
    </> : <>
      <Factory x={300} y={1000} w={440} t={t} closed />
      <Tank x={780} y={G + 20} w={460} t={0} />
      <Big text="✕" x={780} y={1180} at={P(36) + 0.6} t={t} size={360} color={RED} rot={0} />
      <Big text={t >= P(37) ? 'POWER' : 'NO TANKS'} x={540} y={480} at={t >= P(37) ? P(37) : P(36) + 0.6} t={t} size={t >= P(37) ? 150 : 110} color={t >= P(37) ? GREEN : RED} />
    </>}
  </>;
};
const Protect = ({t}: {t: number}) => {
  const all = t >= P(40);
  return <>
    <Ground />
    <Cut part="tesla" x={all ? 280 : 540} y={G + 20} w={all ? 460 : 640} />
    <Cut part="duo" x={all ? 280 : 540} y={G - (all ? 160 : 230)} w={all ? 300 : 420} />
    <Shield x={all ? 280 : 540} y={G - 20} w={all ? 380 : 520} flag="us" t={t} />
    {all && <>
      <Cut part="hilux" x={800} y={G + 20} w={460} />
      <Cut part="xi" x={800} y={G - 160} w={240} />
      <Shield x={800} y={G - 20} w={380} flag="cn" t={t + 1} />
      <Big text="EVERYONE" x={540} y={330} at={P(40)} t={t} size={120} color={RED} />
    </>}
    {!all && <Big text="PROTECT" x={540} y={330} at={P(39)} t={t} size={130} color={GREEN} />}
  </>;
};
const Understand = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={540} y={G + 100} h={700} pose={{brows: 'happy', beak: 'smile', lids: 0.2, flapR: 50 + Math.sin(t * 6) * 20, flapL: 20}} />
  <Title lines={['DOUG UNDERSTAND']} y={360} at={P(41) + 0.2} size={96} />
</>;
const StillWant = ({t}: {t: number}) => {
  const sad = t >= P(43);
  return <>
    <Ground />
    <Gate x={420} y={G} open={0} t={t} />
    <Cut part="hilux" x={880} y={G + 20} w={420} />
    <Penguin id="doug" x={230} y={G + 60} h={420} pose={{turn: 0.5, look: [0.8, -0.2], brows: 'worried', beak: sad ? 'frown' : 'smile', tears: sad, flapR: sad ? 10 : 40}} />
    {!sad && <Thought x={500} y={430} w={420} tx={280} ty={820} at={P(42) + 0.2}><div style={{position: 'absolute', left: 90, top: 40, fontSize: 150, textAlign: 'center'}}>❤️</div></Thought>}
    {sad && <Big text="NOT HERE" x={540} y={380} at={P(43)} t={t} size={120} color={RED} />}
  </>;
};
const Question = ({t}: {t: number}) => <>
  <Ground />
  <Cut part="hilux" x={540} y={G + 20} w={680} />
  <PriceTag x={760} y={540} price="+25%" at={P(44) + 0.3} size={1.3} />
  <Penguin id="doug" x={200} y={G + 200} h={360} pose={{look: [0.3, -0.2], brows: 'worried', beak: 'flat'}} />
  <Big text="WOULD YOU PAY?" x={540} y={300} at={P(44)} t={t} size={100} />
</>;

const Adventure = ({t, kind}: {t: number; kind: 'mountain' | 'desert' | 'never'}) => {
  const at = kind === 'mountain' ? P(7) : kind === 'desert' ? P(8) : P(9), d = ease((t - at) / 0.8);
  return <>
    {kind === 'desert' && <>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, background: '#FFF4D6'}} />
      <Sun x={850} y={330} t={t} size={150} />
      <svg width={1080} height={700} viewBox="0 0 1080 700" style={{position: 'absolute', left: 0, top: 1100}}><path d="M0 120 Q 270 0 540 120 Q 810 230 1080 90 L1080 700 L0 700 Z" fill="#F2C76B" stroke={INK} strokeWidth={7} /></svg>
      <Cut part="hilux" x={lerp(-100, 640, d)} y={1290} w={620} rot={-4 + Math.sin(t * 20) * 1.5} />
    </>}
    {kind === 'mountain' && <>
      <svg width={1080} height={1100} viewBox="0 0 1080 1100" style={{position: 'absolute', left: 0, top: 500}}>
        <path d="M-50 1100 L540 120 L1130 1100 Z" fill="#B9C3CC" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
        <path d="M410 340 L540 120 L670 340 L610 300 L560 350 L500 300 Z" fill="#fff" stroke={INK} strokeWidth={6} strokeLinejoin="round" /></svg>
      <Cut part="hilux" x={lerp(150, 420, d)} y={lerp(1500, 1050, d)} w={420} rot={-30} />
    </>}
    {kind === 'never' && <>
      <Ground />
      <Cut part="hilux" x={540} y={G + 20} w={680} rot={Math.sin(t * 25) * 1} />
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 300 + i * 200, top: 900 - ((t * 120 + i * 60) % 200), width: 60, height: 60, borderRadius: '50%', background: '#B0B0B0', opacity: 0.6}} />)}
      <Stamp text="NEVER DIE" x={540} y={650} at={P(9) + 0.2} color={GREEN} size={110} />
    </>}
    {kind !== 'never' && <Big text={kind === 'mountain' ? 'MOUNTAIN' : 'DESERT'} x={540} y={300} at={at} t={t} size={140} color={kind === 'mountain' ? INK : '#E8A20C'} />}
  </>;
};
const TruckPrice = ({t}: {t: number}) => <>
  <Ground />
  <Cut part="hilux" x={540} y={G + 20} w={640} />
  <PriceTag x={320} y={600} price="$40,000" at={P(18)} size={1.3} color={GREEN} />
  <PriceTag x={740} y={760} price="+$10,000 TAX" at={P(18) + 1.2} size={1.1} rot={6} />
</>;
const TexasFlag = ({x, y, w = 260}: {x: number; y: number; w?: number}) => <svg width={w} height={w * 0.66} viewBox="0 0 180 120" style={{position: 'absolute', left: x - w / 2, top: y, overflow: 'visible'}}>
  <rect width={60} height={120} fill="#1F3FA8" /><rect x={60} width={120} height={60} fill="#fff" /><rect x={60} y={60} width={120} height={60} fill={RED} />
  <path d="M30 38 L36 56 L55 56 L40 67 L46 85 L30 74 L14 85 L20 67 L5 56 L24 56 Z" fill="#fff" />
  <rect width={180} height={120} fill="none" stroke={INK} strokeWidth={5} />
</svg>;
const Texas = ({t}: {t: number}) => {
  const out = ease((t - P(24)) / 0.7);
  return <>
    <Ground />
    <TexasFlag x={540} y={170} w={280} />
    <Big text="TEXAS" x={540} y={470} at={P(23) + 0.3} t={t} size={110} />
    <Factory x={330} y={1000} w={520} t={t} />
    <Cut part="hilux" x={lerp(330, 790, out)} y={G + 20} w={440} />
    {t >= P(24) && <Big text="MADE IN USA" x={540} y={1150} at={P(24)} t={t} size={96} color={GREEN} rot={-4} />}
    {t >= P(25) && <><Chicken x={880} y={900} h={220} t={t} /><Stamp text="NO TAX" x={880} y={820} at={P(25) + 0.2} color={GREEN} size={80} /></>}
  </>;
};

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: 'cut' | 'swipe' | 'zoom' | 'iris' | 'pop'};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(1), set: (t) => <DougHome t={t} />, fx_: 'swipe'},
  {at: P(4), set: (t) => <HiluxHero t={t} />, fx_: 'zoom'},
  {at: P(6), set: (t) => <WholeWorld t={t} />, fx_: 'iris'},
  {at: P(7), set: (t) => <Adventure t={t} kind="mountain" />, fx_: 'swipe'},
  {at: P(8), set: (t) => <Adventure t={t} kind="desert" />, fx_: 'zoom'},
  {at: P(9), set: (t) => <Adventure t={t} kind="never" />, fx_: 'pop'},
  {at: P(10), set: (t) => <NoHilux t={t} />, fx_: 'swipe'},
  {at: P(11), set: (t) => <WhyChicken t={t} />, fx_: 'pop'},
  {at: P(13), set: (t) => <Europe1964 t={t} />, fx_: 'swipe'},
  {at: P(14), set: (t) => <Angry t={t} />, fx_: 'zoom'},
  {at: P(17), set: (t) => <TwentyFive t={t} />, fx_: 'pop'},
  {at: P(18), set: (t) => <TruckPrice t={t} />, fx_: 'swipe'},
  {at: P(19), set: (t) => <ChickenTax t={t} />, fx_: 'iris'},
  {at: P(20), set: (t) => <Confused t={t} />, fx_: 'zoom'},
  {at: P(21), set: (t) => <WarOver t={t} />, fx_: 'swipe'},
  {at: P(23), set: (t) => <Texas t={t} />, fx_: 'iris'},
  {at: P(26), set: (t) => <Jobs t={t} />, fx_: 'pop'},
  {at: P(29), set: (t) => <Workers t={t} />, fx_: 'swipe'},
  {at: P(30), set: (t) => <Spend t={t} />, fx_: 'iris'},
  {at: P(31), set: (t) => <Closed t={t} />, fx_: 'zoom'},
  {at: P(32), set: (t) => <RealLife t={t} />, fx_: 'swipe'},
  {at: P(34), set: (t) => <War t={t} />, fx_: 'pop'},
  {at: P(38), set: (t) => <Hook t={t + 3} />, fx_: 'zoom'},
  {at: P(39), set: (t) => <Protect t={t} />, fx_: 'swipe'},
  {at: P(41), set: (t) => <Understand t={t} />, fx_: 'iris'},
  {at: P(42), set: (t) => <StillWant t={t} />, fx_: 'swipe'},
  {at: P(44), set: (t) => <Question t={t} />, fx_: 'pop'},
];
// deep zooms [phrase, x, y, scale]: the camera dives onto the face/object named, released on the next phrase
const DEEP: [number, number, number, number][] = [[5, 540, 640, 1.4], [12, 640, 860, 1.25], [17, 540, 700, 1.4], [20, 540, 900, 1.6], [28, 540, 600, 1.4], [36, 780, 1150, 1.5], [43, 230, 1100, 1.7]];

export const DougTariff = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s = 1, fx = 540, fy = 960;
  if (sh.at === 0) s = 1 + 0.05 * cl(tc / 2.5); // hook: both sides stay in frame, slow drift
  else s = 1 + 0.012 * (tc - sh.at);
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < TIM[i].end + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  if (dz) { s += (dz[3] - s) * dp; fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  s *= tc < 1.0 ? 1 : beat(tc, TIM);
  return <AbsoluteFill style={{background: '#FDFDFD', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-tariff-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={US} name="swoosh-fast" vol={0.3} />
    <Sfx at={CN} name="user-whoosh" vol={0.35} />
    <Sfx at={VS} name="user-boom" vol={0.45} />
    <Sfx at={P(1)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(2)} name="user-pop" vol={0.3} />
    <Sfx at={P(4)} name="swoosh-fast" vol={0.35} />
    <Sfx at={P(5)} name="user-ting" vol={0.35} />
    <Sfx at={P(6)} name="user-wow" vol={0.35} />
    <Sfx at={P(10) + 1} name="user-wrong" vol={0.4} />
    <Sfx at={P(12)} name="user-boom" vol={0.45} />
    <Sfx at={P(13) + 2.3} name="user-slap" vol={0.4} />
    <Sfx at={P(14)} name="user-shock" vol={0.4} />
    <Sfx at={P(16)} name="swoosh-fast" vol={0.35} />
    <Sfx at={P(17)} name="user-cash-register" vol={0.4} />
    <Sfx at={P(17) + 0.35} name="user-ting" vol={0.35} />
    <Sfx at={P(19) + 0.5} name="user-ting" vol={0.35} />
    <Sfx at={P(20)} name="user-fahh" vol={0.45} />
    <Sfx at={P(21)} name="user-yeah" vol={0.35} />
    <Sfx at={P(21) + 0.9} name="user-wrong" vol={0.35} />
    <Sfx at={P(22)} name="user-timer" vol={0.3} />
    <Sfx at={P(23) + 0.3} name="user-pop" vol={0.35} />
    <Sfx at={P(24)} name="user-yeah" vol={0.35} />
    <Sfx at={P(25) + 0.2} name="user-slap" vol={0.35} />
    <Sfx at={P(7)} name="user-wow" vol={0.3} />
    <Sfx at={P(9) + 0.2} name="user-boom" vol={0.35} />
    <Sfx at={P(15)} name="user-slap" vol={0.35} />
    <Sfx at={P(18)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(18) + 1.2} name="user-money" vol={0.35} />
    <Sfx at={P(33)} name="user-wow" vol={0.35} />
    <Sfx at={P(37)} name="user-boom" vol={0.35} />
    <Sfx at={P(28)} name="user-boom" vol={0.4} />
    <Sfx at={P(29) + 0.9} name="user-pop" vol={0.35} />
    <Sfx at={P(30) + 0.3} name="user-money" vol={0.35} />
    <Sfx at={P(31)} name="user-aww" vol={0.4} />
    <Sfx at={P(32) + 0.8} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(32) + 2.4} name="user-wow" vol={0.35} />
    <Sfx at={P(34)} name="user-boom" vol={0.4} />
    <Sfx at={P(35) + 1} name="swoosh-fast" vol={0.35} />
    <Sfx at={P(36) + 0.6} name="user-slap" vol={0.4} />
    <Sfx at={P(38)} name="user-boom" vol={0.35} />
    <Sfx at={P(39)} name="user-yeah" vol={0.35} />
    <Sfx at={P(40)} name="user-pop" vol={0.35} />
    <Sfx at={P(41) + 0.2} name="user-ting" vol={0.35} />
    <Sfx at={P(43)} name="user-aww" vol={0.4} />
    <Sfx at={P(44) + 0.3} name="user-cash-register" vol={0.35} />
  </AbsoluteFill>;
};
