// EP7 "Why do rich countries fight wars over cars?" — Chicken Tax / car wars. Hook = the user's own image
// (studio/public/tariff/hook.png: USA + Tesla vs China flag + Toyota Hilux) cut into layers and animated, Doug added in the middle.
// Hook first (approval), full episode after. Line timings: studio/src/data/doug-tariff.json.
import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Penguin, onTwos} from '../penguin/rig';
import {cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Arrow, Puzzled, Why} from './dougVenezuela';
import TIM from '../data/doug-tariff.json';

export const DOUG_TARIFF_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 2.4) * 30) / 30;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const back = (p: number) => { const q = cl(p) - 1; return 1 + 2.7 * q * q * q + 1.7 * q * q; }; // overshoot ease
// hook beats (s): USA side in, arrow swings to the other side, VS slams
const US = 0.3, CN = 1.35, VS = 2.2;

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

const Speed = ({x, y, t, a, dir}: {x: number; y: number; t: number; a: number; dir: 1 | -1}) => {
  const d = t - a; if (d < 0 || d > 0.45) return null;
  return <>{[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: x - dir * (60 + i * 30) - 90, top: y + i * 46, width: 180 * (1 - d / 0.45), height: 9, borderRadius: 5, background: '#161616', opacity: 0.6}} />)}</>;
};

const Hook = ({t}: {t: number}) => {
  // entries: people/flag/sign drop in with overshoot, cars drive in from the side, VS slams from huge to normal
  const usTop = back((t - US) / 0.35), usCar = ease((t - US - 0.15) / 0.4);
  const cnTop = back((t - CN) / 0.35), cnCar = ease((t - CN - 0.15) / 0.4);
  const vs = t < VS ? 0 : t - VS < 0.15 ? 3 - 2 * (t - VS) / 0.15 : 1;
  const breathe = (ph: number) => 1 + 0.008 * Math.sin(t * 2.4 + ph); // idle life once landed
  const bounce = (a: number) => (t > a ? -Math.abs(Math.sin((t - a) * 9)) * 10 * Math.exp(-(t - a) * 5) : 0);
  const lookR = t >= CN, shock = t >= VS;
  return <>
    {t >= US && <Layer k="usTop" dy={(1 - usTop) * -700} s={breathe(0)} />}
    {t >= US + 0.15 && <Layer k="usCar" dx={(1 - usCar) * -1100} dy={bounce(US + 0.55)}><Shine t={t} a={US + 0.7} /></Layer>}
    {t >= CN && <Layer k="cnTop" dy={(1 - cnTop) * -700} s={breathe(1.5)} />}
    {t >= CN + 0.15 && <Layer k="cnCar" dx={(1 - cnCar) * 1100} dy={bounce(CN + 0.55)}><Shine t={t} a={CN + 0.7} /></Layer>}
    {t >= VS && <Layer k="vs" s={vs} rot={(1 - Math.min(vs, 1)) * 20 + Math.sin(t * 4) * 1.5} />}
    <Why t={t} />
    <Speed x={250} y={1080} t={t} a={US + 0.15} dir={1} />
    <Speed x={830} y={1080} t={t} a={CN + 0.15} dir={-1} />
    <Arrow x={540} y={500} t={t} swingAt={CN} />
    <Penguin id="doug" x={540} y={1480} h={290} pose={{turn: lookR ? 0.5 : -0.5, look: [lookR ? 0.8 : -0.8, -0.4], brows: shock ? 'shock' : lookR ? 'worried' : 'happy',
      eyeScale: shock ? 1.3 : 1.05, pupil: shock ? 0.5 : 1, beak: shock ? 'frown' : 'smile', flapR: shock ? 70 : 35, flapL: shock ? 70 : 35, sweat: shock, hop: shock && t - VS < 0.3 ? 1 : 0}} />
    {shock && <Puzzled x={630} y={1170} t={t} />}
  </>;
};

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: 'cut' | 'swipe' | 'zoom' | 'iris' | 'pop'};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
];

export const DougTariff = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s = 1, fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (USA, then the other side), back out on the VS slam, then a slow push to Doug
    const toUS = ease((tc - 0.8) / 0.45) * (tc < CN ? 1 : 0), toCN = ease((tc - CN - 0.1) / 0.45) * (tc < VS ? 1 : 0), toDoug = ease((tc - VS - 0.4) / 2.2);
    s = 1 + 0.22 * (toUS + toCN) + 0.12 * toDoug; fx = 540 - 260 * toUS + 260 * toCN; fy = 960 + 30 * (toUS + toCN) + 80 * toDoug;
  }
  s *= tc < 1.0 ? 1 : beat(tc, TIM);
  return <AbsoluteFill style={{background: '#FDFDFD', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={US} name="user-whoosh" vol={0.3} />
    <Sfx at={US + 0.2} name="swoosh-fast" vol={0.3} />
    <Sfx at={CN} name="user-whoosh" vol={0.3} />
    <Sfx at={CN + 0.2} name="swoosh-fast" vol={0.3} />
    <Sfx at={VS} name="user-boom" vol={0.45} />
    <Sfx at={VS + 0.3} name="penguin-squawk" vol={0.35} />
  </AbsoluteFill>;
};
