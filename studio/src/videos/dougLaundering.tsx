// EP6 "Money Laundering Explained by Doug" — rich ($1,000,000) vs jail ($0). Hook first (approval), full episode after.
// Line timings: studio/src/data/doug-laundering.json (free Kokoro am_michael VO, one line per phrase).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Mansion, Stamp} from '../penguin/world';
import {MoneyBag} from './dougGas';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-laundering.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_LAUNDERING_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1300;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';

// ---------- hook props (versus layout from dougVenezuela) ----------
const How = ({t}: {t: number}) => {
  const p = ease(t / 0.25);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 200, height: 330, transform: `scale(${0.6 + 0.4 * p})`, opacity: p, transformOrigin: '50% 60%'}}>
    <div style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 290, lineHeight: '300px', color: INK, letterSpacing: -6}}>
      how<span style={{color: RED}}>?</span>
    </div>
  </div>;
};
// Red hand-drawn arrow: draws itself on, points at RICH (left), swings to JAIL (right) on "poor".
const Arrow = ({x, y, t, swingAt}: {x: number; y: number; t: number; swingAt: number}) => {
  const draw = ease((t - 0.15) / 0.4), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.35);
  const over = sw < 1 ? Math.sin(sw * Math.PI) * 12 : 0;
  const ang = 148 + (32 - 148) * ease(sw) - over;
  return <svg width={10} height={10} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <g transform={`rotate(${ang})`}>
      <path d="M0 0 Q 85 -34, 170 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />
      {draw > 0.9 && <path d="M170 0 L128 -26 M170 0 L130 30" fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />}
    </g>
  </svg>;
};
const Label = ({text, x, y, at, t, size = 80, color = INK}: {text: string; x: number; y: number; at: number; t: number; size?: number; color?: string}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x - 270, width: 540, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, color, opacity: p, transform: `scale(${0.5 + 0.5 * p})`, whiteSpace: 'nowrap'}}>{text}</div>;
};
const Vs = ({x, y, t}: {x: number; y: number; t: number}) => {
  const p = ease((t - 0.5) / 0.3);
  return <div style={{position: 'absolute', left: x - 75, top: y - 75, width: 150, height: 150, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 72, color: '#fff', transform: `scale(${p}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>;
};
// Jail cell: grey back wall, bars slam down at `at`.
const Jail = ({x, y, w = 440, h = 560, t, at, part}: {x: number; y: number; w?: number; h?: number; t: number; at: number; part: 'wall' | 'bars'}) => {
  const drop = ease((t - at) / 0.25);
  return part === 'wall' ?
    <div style={{position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h, background: '#BFC6CC', border: `7px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box'}}>
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 30 + i * 140, top: 60 + (i % 2) * 120, width: 80, height: 40, border: `4px solid #9AA3AB`, borderRadius: 4}} />)}
    </div> :
    <div style={{position: 'absolute', left: x - w / 2, top: y - h - (1 - drop) * h, width: w, height: h, overflow: 'visible'}}>
      {Array.from({length: 6}, (_, i) => <div key={i} style={{position: 'absolute', left: 20 + i * ((w - 60) / 5), top: 0, width: 22, height: h, background: '#4A4F55', border: `4px solid ${INK}`, borderRadius: 6, boxSizing: 'border-box'}} />)}
      <div style={{position: 'absolute', left: 0, top: h * 0.22, width: w, height: 22, background: '#4A4F55', border: `4px solid ${INK}`, boxSizing: 'border-box'}} />
    </div>;
};

const Ground = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;

// ---------- sets ----------
const POOR = P(0) + 1.35, MILLION = P(1);
const Hook = ({t}: {t: number}) => {
  const lookR = t >= POOR && t < MILLION;
  return <>
    <How t={t} />
    <Ground />
    <Label text="RICH" x={270} y={560} at={0.3} t={t} />
    <Label text="JAIL" x={810} y={560} at={POOR} t={t} />
    {/* left: Doug rich in front of his mansion */}
    <Mansion x={260} y={G} w={560} />
    <MoneyBag x={80} y={G - 230} w={180} label="$" />
    <Penguin id="doug-rich" x={290} y={G} h={440} outfit="rich" pose={{beak: 'smile', brows: 'happy', flapR: 90 + Math.sin(t * 8) * 15, lids: 0.3}} />
    <Label text="$1,000,000" x={270} y={660} at={0.4} t={t} size={80} color={GREEN} />
    {/* right: same Doug behind bars */}
    <Jail x={810} y={G} w={480} h={600} t={t} at={POOR} part="wall" />
    <Penguin id="doug-jail" x={810} y={G} h={440} pose={{brows: 'worried', beak: 'frown', lids: 0.35, tears: true}} />
    {t >= POOR && <Jail x={810} y={G} w={480} h={600} t={t} at={POOR} part="bars" />}
    <Label text="$0" x={810} y={630} at={POOR} t={t} size={150} color={RED} />
    <Arrow x={540} y={512} t={t} swingAt={POOR} />
    <Vs x={540} y={820} t={t} />
    <div style={{position: 'absolute', left: 900, top: 760 + Math.sin(t * 6) * 8, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 120, color: INK, transform: 'rotate(14deg)'}}>?</div>
    <Stamp text="SAME DOUG" x={540} y={1360} at={MILLION + 0.9} color={RED} size={90} />
  </>;
};

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [];

export const DougLaundering = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push to JAIL on "poor", then to RICH on "one million", wide again on SAME DOUG
    const toJ = ease((tc - POOR) / 0.4) * (tc < MILLION ? 1 : 0), toR = ease((tc - MILLION) / 0.4) * (tc < MILLION + 0.9 ? 1 : 0);
    s0 = 1 + 0.22 * (toJ + toR); fx = 540 + 270 * toJ - 270 * toR; fy = 960 + 60 * (toJ + toR);
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < 1.0 ? 1 : beat(tc, TIM));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-laundering-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.45} name="user-cash-register" vol={0.3} />
    <Sfx at={POOR} name="user-boom" vol={0.45} />
    <Sfx at={POOR + 0.15} name="user-slap" vol={0.35} />
    <Sfx at={MILLION + 0.6} name="user-money" vol={0.3} />
    <Sfx at={MILLION + 0.9} name="user-wrong" vol={0.35} />
  </AbsoluteFill>;
};
