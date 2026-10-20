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
const G = 1200;
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

// ---------- money washer props ----------
// Dollar bill: clean = crisp green, dirty = brown with stains.
export const Bill = ({x, y, w = 170, rot = 0, dirty}: {x: number; y: number; w?: number; rot?: number; dirty?: boolean}) =>
  <svg width={w} height={w * 0.46} viewBox="0 0 170 78" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.23, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
    <rect x={2} y={2} width={166} height={74} rx={6} fill={dirty ? '#7C6A3A' : '#7DCB5A'} stroke={INK} strokeWidth={5} />
    <rect x={12} y={11} width={146} height={56} rx={4} fill="none" stroke={dirty ? '#5A4A22' : '#3E8E2E'} strokeWidth={3} />
    <circle cx={85} cy={39} r={22} fill={dirty ? '#9C8A52' : '#B9E79E'} stroke={INK} strokeWidth={4} />
    <text x={85} y={52} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={36} fill={INK}>$</text>
    {dirty && <><circle cx={35} cy={25} r={11} fill="#4A3A18" /><circle cx={135} cy={55} r={14} fill="#4A3A18" /><circle cx={125} cy={20} r={6} fill="#4A3A18" /></>}
  </svg>;
// Washing machine: drum spins with bills inside, little wobble. Door centre = (x, y - h * 0.42).
export const Washer = ({x, y, w = 460, t, money}: {x: number; y: number; w?: number; t: number; money?: 'dirty' | 'clean' | 'both'}) => {
  const h = w * 1.12, wob = Math.sin(t * 22) * 2.5, r = w * 0.32;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h, transform: `rotate(${wob * 0.4}deg)`, transformOrigin: '50% 100%'}}>
    <div style={{position: 'absolute', inset: 0, background: '#FAFAFA', border: `7px solid ${INK}`, borderRadius: 30, boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: h * 0.16, borderBottom: `6px solid ${INK}`, background: '#E8F3FA', borderRadius: '30px 30px 0 0', boxSizing: 'border-box', border: `7px solid ${INK}`}}>
      {[0, 1].map((i) => <div key={i} style={{position: 'absolute', left: 30 + i * 70, top: 18, width: 44, height: 44, borderRadius: '50%', background: '#fff', border: `5px solid ${INK}`, boxSizing: 'border-box'}} />)}
      <div style={{position: 'absolute', right: 30, top: 22, width: 120, height: 36, borderRadius: 8, background: INK, color: '#5EF08A', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 24, textAlign: 'center', lineHeight: '36px'}}>WASH $</div>
    </div>
    <div style={{position: 'absolute', left: w / 2 - r - 22, top: h * 0.58 - r - 22, width: (r + 22) * 2, height: (r + 22) * 2, borderRadius: '50%', background: '#D9DEE2', border: `7px solid ${INK}`, boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: w / 2 - r, top: h * 0.58 - r, width: r * 2, height: r * 2, borderRadius: '50%', background: '#BFE6FA', border: `6px solid ${INK}`, boxSizing: 'border-box', overflow: 'hidden'}}>
      <div style={{position: 'absolute', inset: 0, transform: `rotate(${t * 540}deg)`}}>
        {[0, 1, 2, 3].map((i) => <Bill key={i} x={r + Math.cos(i * 1.57) * r * 0.45} y={r + Math.sin(i * 1.57) * r * 0.45} w={110} rot={i * 50} dirty={money === 'dirty' || (money === 'both' && i % 2 === 0)} />)}
      </div>
      {[0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: (i * 47) % (r * 2), top: r * 2 - ((t * 120 + i * 60) % (r * 2)), width: 24, height: 24, borderRadius: '50%', border: '4px solid #fff', boxSizing: 'border-box'}} />)}
      <div style={{position: 'absolute', left: r * 0.3, top: r * 0.2, width: r * 0.5, height: r * 0.25, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', transform: 'rotate(-30deg)'}} />
    </div>
  </div>;
};
// Bills flying on an arc from (x1,y1) to (x2,y2), one every `gap` seconds, looping from `a`.
const Stream = ({x1, y1, x2, y2, t, a, dirty, gap = 0.3, dur = 0.7}: {x1: number; y1: number; x2: number; y2: number; t: number; a: number; dirty?: boolean; gap?: number; dur?: number}) => {
  if (t < a) return null;
  const out: React.ReactNode[] = [];
  for (let k = 0; k < Math.ceil(dur / gap) + 1; k++) {
    const st = a + (Math.floor((t - a) / gap) - k) * gap, p = (t - st) / dur;
    if (st < a || p < 0 || p > 1) continue;
    out.push(<Bill key={k} x={x1 + (x2 - x1) * p} y={y1 + (y2 - y1) * p - Math.sin(p * Math.PI) * 220} w={dirty ? 130 : 140} rot={p * 360 * (dirty ? 1 : -1)} dirty={dirty} />);
  }
  return <>{out}</>;
};
const Stinky = ({x, y, t}: {x: number; y: number; t: number}) => <>
  {[0, 1, 2].map((i) => <svg key={i} width={40} height={120} viewBox="0 0 40 120" style={{position: 'absolute', left: x - 80 + i * 70, top: y - 140 - ((t * 40 + i * 20) % 30), opacity: 0.8}}>
    <path d="M20 115 C 0 90, 40 70, 20 45 C 0 20, 40 10, 20 0" fill="none" stroke="#6B8E23" strokeWidth={7} strokeLinecap="round" /></svg>)}
  {[0, 1].map((i) => <div key={`f${i}`} style={{position: 'absolute', left: x - 30 + Math.sin(t * 9 + i * 2) * 90, top: y - 120 + Math.cos(t * 7 + i) * 40, width: 14, height: 14, borderRadius: '50%', background: INK}} />)}
</>;
const Sparkles = ({x, y, t}: {x: number; y: number; t: number}) => <>
  {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: x - 120 + i * 75, top: y - 150 - (i % 2) * 70, fontSize: 60, transform: `scale(${0.6 + 0.4 * Math.abs(Math.sin(t * 5 + i))})`}}>✨</div>)}
</>;

// ---------- sets ----------
const POOR = P(0) + 1.35, MILLION = P(1);
const WX = 540, WY = G, DOOR_Y = WY - 460 * 1.12 * 0.42; // washer + door centre
const Hook = ({t}: {t: number}) => {
  const tt = ease(t / 0.25), cleanN = 2 + Math.min(4, Math.floor(cl(t - 0.6) * 4));
  return <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 118, lineHeight: '128px', color: INK, transform: `scale(${0.6 + 0.4 * tt})`, opacity: tt}}>
      HOW MONEY<br />LAUNDERING<span style={{color: RED}}>?</span>
    </div>
    <Ground />
    <Washer x={WX} y={WY} t={t} money="both" />
    {/* dirty money in (left) */}
    <Label text="DIRTY $" x={205} y={520} at={0.2} t={t} size={78} color={RED} />
    {[0, 1, 2, 3, 4].map((i) => <Bill key={i} x={130 + (i % 3) * 45} y={G - 30 - Math.floor(i / 2) * 55} w={170} rot={(i * 23) % 30 - 15} dirty />)}
    <Stinky x={170} y={G - 160} t={t} />
    <Stream x1={180} y1={G - 200} x2={WX - 40} y2={DOOR_Y} t={t} a={0.2} dirty />
    {/* clean money out (right) */}
    <Label text="CLEAN $" x={880} y={520} at={0.6} t={t} size={78} color={GREEN} />
    <Stream x1={WX + 40} y1={DOOR_Y} x2={910} y2={G - 200} t={t} a={0.6} />
    {Array.from({length: cleanN}, (_, i) => <Bill key={i} x={870 + (i % 3) * 45} y={G - 30 - Math.floor(i / 2) * 55} w={170} rot={(i * 17) % 20 - 10} />)}
    {t > 0.6 && <Sparkles x={910} y={G - 120} t={t} />}
    <Label text="$1,000,000" x={910} y={620} at={MILLION + 0.6} t={t} size={70} color={GREEN} />
    {/* Doug watches from the front, small, one "?" */}
    <Penguin id="doug" x={540} y={G + 270} h={290} pose={{look: [t < 1 ? -0.7 : 0.7, -0.4], brows: 'shock', eyeScale: 1.2, beak: 'frown'}} />
    <div style={{position: 'absolute', left: 660, top: G - 10 + Math.sin(t * 6) * 8, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 110, color: INK, transform: 'rotate(14deg)'}}>?</div>
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
  if (sh.at === 0) { // hook: slow push toward the washer door, then toward the clean money on "one million"
    const toW = ease((tc - 1.0) / 0.6) * (tc < MILLION ? 1 : 0), toC = ease((tc - MILLION) / 0.4);
    s0 = 1 + 0.08 * toW + 0.2 * toC; fx = 540 + 280 * toC; fy = 960 + 60 * toW + 100 * toC;
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
    <Sfx at={0.2} name="swoosh-fast" vol={0.3} />
    <Sfx at={0.75} name="user-cash-register" vol={0.3} />
    <Sfx at={POOR} name="user-boom" vol={0.45} />
    <Sfx at={MILLION + 0.6} name="user-money" vol={0.35} />
  </AbsoluteFill>;
};
