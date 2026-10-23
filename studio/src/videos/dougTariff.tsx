// EP7 "Why do rich countries fight wars over cars?" — Chicken Tax / car wars. Hook = the user's own image
// (studio/public/tariff/hook.png: USA + Tesla vs China flag + Toyota Hilux) cut into layers and animated, Doug added in the middle.
// Hook first (approval), full episode after. Line timings: studio/src/data/doug-tariff.json.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Igloo, Thought} from '../penguin/world';
import {Snowfall} from './dougGas';
import {cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Arrow, Puzzled, Why} from './dougVenezuela';
import TIM from '../data/doug-tariff.json';

export const DOUG_TARIFF_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 2.4) * 30) / 30;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const back = (p: number) => { const q = cl(p) - 1; return 1 + 2.7 * q * q * q + 1.7 * q * q; }; // overshoot ease
// hook beats (s): arrow points at the USA, swings to the other side, VS throbs + Doug shocked
const US = 0.3, CN = 1.3, VS = 2.0;

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

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: 'cut' | 'swipe' | 'zoom' | 'iris' | 'pop'};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: TIM[1].start, set: (t) => <DougHome t={t} />, fx_: 'swipe'},
];

export const DougTariff = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s = 1, fx = 540, fy = 960;
  if (sh.at === 0) s = 1 + 0.05 * cl(tc / 2.5); // hook: both sides stay in frame, slow drift
  else s = 1 + 0.012 * (tc - sh.at);
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
    <Sfx at={TIM[1].start} name="penguin-squawk" vol={0.35} />
    <Sfx at={TIM[2].start} name="user-pop" vol={0.3} />
  </AbsoluteFill>;
};
