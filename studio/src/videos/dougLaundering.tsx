// EP6 "Money Laundering Explained by Doug" — rich ($1,000,000) vs jail ($0). Hook first (approval), full episode after.
// Line timings: studio/src/data/doug-laundering.json (free Kokoro am_michael VO, one line per phrase).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Fish, INK, Penguin, onTwos} from '../penguin/rig';
import {Seagull, Walrus} from '../penguin/cast';
import {BigWord, FishFlight, FishPile, IceBank, Mansion, Stamp, Title} from '../penguin/world';
import {MoneyBag, Snowmobile} from './dougGas';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-laundering.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_LAUNDERING_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1200;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
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
export const Sparkles = ({x, y, t}: {x: number; y: number; t: number}) => <>
  {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: x - 120 + i * 75, top: y - 150 - (i % 2) * 70, fontSize: 60, transform: `scale(${0.6 + 0.4 * Math.abs(Math.sin(t * 5 + i))})`}}>✨</div>)}
</>;

// ---------- sets ----------
const POOR = P(0) + 1.35, MILLION = P(1);
const WX = 540, WY = G, DOOR_Y = WY - 460 * 1.12 * 0.42; // washer + door centre
const UsFlag = ({x, y, w = 220, t}: {x: number; y: number; w?: number; t: number}) => {
  const wave = Math.sin(t * 5) * 3;
  return <svg width={w} height={w * 0.63} viewBox="0 0 190 120" style={{position: 'absolute', left: x, top: y, overflow: 'visible', transform: `skewY(${wave}deg)`}}>
    <rect width={190} height={120} fill="#fff" stroke={INK} strokeWidth={5} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} y={i * 17.4} width={190} height={8.7} fill="#B22234" />)}
    <rect width={84} height={64} fill="#3C3B6E" />
    {Array.from({length: 12}, (_, i) => <circle key={i} cx={12 + (i % 4) * 20} cy={12 + Math.floor(i / 4) * 20} r={4} fill="#fff" />)}
    <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
  </svg>;
};
const ROPE = (x: number) => 740 + 40 * Math.sin(((x - 640) / 400) * Math.PI); // sagging clothesline y at x
const PINS = [700, 790, 880, 970];
const WX2 = 360, DOOR2 = G - 340 * 1.12 * 0.42; // hook washer + door centre
const Hook = ({t}: {t: number}) => {
  const tt = ease(t / 0.25);
  // Doug scrubs, then throws clean bills onto the line: slot 2 at 0.8 s, slot 3 at 1.3 s
  const throws = [0.8, 1.3], hung = 2 + throws.filter((a) => t >= a + 0.35).length;
  const scrub = Math.sin(t * 12) * 30;
  return <>
    <div style={{position: 'absolute', left: 0, right: 0, top: 150, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 112, lineHeight: '122px', color: INK, transform: `scale(${0.6 + 0.4 * tt})`, opacity: tt}}>
      HOW MONEY<br />LAUNDERING<span style={{color: RED}}>?</span>
    </div>
    <Ground />
    {/* left: BEFORE = dirty dollars */}
    <Label text="DIRTY $" x={200} y={470} at={0.1} t={t} size={78} color={RED} />
    {[0, 1, 2, 3, 4].map((i) => <Bill key={i} x={80 + (i % 3) * 50} y={G - 30 - Math.floor(i / 3) * 55} w={150} rot={(i * 23) % 30 - 15} dirty />)}
    <Stinky x={120} y={G - 150} t={t} />
    <Stream x1={120} y1={G - 140} x2={WX2} y2={DOOR2} t={t} a={0.1} dirty gap={0.35} dur={0.6} />
    {/* right: AFTER = clean dollars drying on the line, US flag on the pole */}
    <Label text="CLEAN $" x={850} y={470} at={0.3} t={t} size={78} color={GREEN} />
    <div style={{position: 'absolute', left: 632, top: 550, width: 16, height: G - 550, background: '#8B5A2B', border: `4px solid ${INK}`, boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: 1032, top: 700, width: 16, height: G - 700, background: '#8B5A2B', border: `4px solid ${INK}`, boxSizing: 'border-box'}} />
    <UsFlag x={646} y={556} w={210} t={t} />
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d={`M640 ${ROPE(640)} ${PINS.map((x) => `L${x} ${ROPE(x)}`).join(' ')} L1040 ${ROPE(1040)}`} fill="none" stroke={INK} strokeWidth={5} />
    </svg>
    {PINS.slice(0, hung).map((x, i) => { const sw = Math.sin(t * 4 + i) * 5;
      return <React.Fragment key={i}>
        <div style={{position: 'absolute', left: x - 60, top: ROPE(x), transform: `rotate(${sw}deg)`, transformOrigin: '60px 0'}}><Bill x={60} y={70} w={150} rot={90} /></div>
        <div style={{position: 'absolute', left: x - 7, top: ROPE(x) - 18, width: 14, height: 40, background: '#E8B04A', border: `3px solid ${INK}`, borderRadius: 4}} />
      </React.Fragment>; })}
    {throws.map((a, i) => { const p = (t - a) / 0.35; if (p < 0 || p > 1) return null; const x2 = PINS[2 + i];
      return <Bill key={i} x={lerp(WX2, x2, p)} y={lerp(DOOR2, ROPE(x2) + 70, p) - Math.sin(p * Math.PI) * 180} w={150} rot={90 * p} />; })}
    {t > 0.3 && <Sparkles x={840} y={980} t={t} />}
    {/* middle: washing machine, Doug next to it hangs the clean dollars */}
    <Washer x={WX2} y={G} w={340} t={t} money="both" />
    <Penguin id="doug" x={575} y={G + 30} h={360} pose={{turn: 0.5, look: [0.8, -0.5], brows: 'happy', beak: 'smile', flapR: 120 + scrub * 0.5, flapL: 40}} />
  </>;
};

// ---------- Fox the Banker (Arctic fox: sly, suit + tie). Faces left by default. (x, y) = feet. ----------
export const Fox = ({x, y, h = 520, flip, mouth = 0, sly = 1, pen}: {x: number; y: number; h?: number; flip?: boolean; mouth?: number; sly?: number; pen?: boolean}) => {
  const t = useCurrentFrame() / FPS, bob = Math.sin(t * 3) * 3, tail = Math.sin(t * 4) * 8;
  return <svg width={h * 0.75} height={h} viewBox="0 0 300 400" style={{position: 'absolute', left: x - h * 0.375, top: y - h + bob, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    <ellipse cx={150} cy={396} rx={100} ry={9} fill="#E3E8EC" />
    <g transform={`rotate(${tail} 230 330)`}><path d="M220 340 C 300 330, 310 230, 270 200 C 290 260, 250 300, 215 300 Z" fill="#FBFBF7" stroke={INK} strokeWidth={7} strokeLinejoin="round" /></g>
    <path d="M90 390 L95 230 Q150 205 205 230 L210 390 Z" fill="#2C3E66" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M125 225 L150 300 L175 225 Z" fill="#fff" stroke={INK} strokeWidth={5} />
    <path d="M143 236 L157 236 L162 300 L150 316 L138 300 Z" fill="#D83A2E" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d="M95 250 Q 60 300 80 340" fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" /><path d="M95 250 Q 60 300 80 340" fill="none" stroke="#2C3E66" strokeWidth={12} strokeLinecap="round" />
    {pen && <path d="M70 330 L40 290" stroke={INK} strokeWidth={8} strokeLinecap="round" />}
    <path d="M85 60 L105 140 L60 130 Z" fill="#FBFBF7" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><path d="M215 60 L195 140 L240 130 Z" fill="#FBFBF7" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M86 78 L98 128 L72 124 Z" fill="#F4B7B0" /><path d="M214 78 L202 128 L228 124 Z" fill="#F4B7B0" />
    <path d="M60 130 Q150 90 240 130 Q250 200 150 230 Q50 200 60 130 Z" fill="#FBFBF7" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M70 175 Q 20 195 30 200 Q 80 205 110 200" fill="#FBFBF7" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={30} cy={196} r={10} fill={INK} />
    <ellipse cx={105} cy={155} rx={13} ry={13 * (1 - 0.55 * sly)} fill={INK} /><ellipse cx={175} cy={155} rx={13} ry={13 * (1 - 0.55 * sly)} fill={INK} />
    <path d="M88 138 L122 146 M192 138 L158 146" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    <path d={mouth > 0 ? `M60 205 Q 85 ${210 + mouth * 30} 115 205` : 'M60 206 Q 90 222 118 204'} fill={mouth > 0 ? INK : 'none'} stroke={INK} strokeWidth={5} strokeLinecap="round" />
  </svg>;
};
// Speech bubble (hand-written).
const Bubble = ({text, x, y, at, t, w = 520, tailX = 0, size = 58}: {text: string; x: number; y: number; at: number; t: number; w?: number; tailX?: number; size?: number}) => {
  const p = ease((t - at) / 0.2); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `scale(${p})`, transformOrigin: `${w / 2 + tailX}px 100%`}}>
    <div style={{background: '#fff', border: `6px solid ${INK}`, borderRadius: 40, padding: '22px 26px', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: size, lineHeight: 1.15, textAlign: 'center', color: INK}}>{text}</div>
    <div style={{position: 'absolute', left: w / 2 + tailX - 20, bottom: -34, width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderTop: `40px solid ${INK}`}} />
  </div>;
};
// Plain sled (stolen ones are red/blue, Doug's is gold).
export const Sled = ({x, y, w = 260, color = '#3D8BD8'}: {x: number; y: number; w?: number; color?: string}) =>
  <svg width={w} height={w * 0.45} viewBox="0 0 260 117" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.45, overflow: 'visible'}}>
    <path d="M10 105 L230 105 Q258 105 250 80" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
    <path d="M40 105 L40 80 M200 105 L200 80" stroke={INK} strokeWidth={8} />
    <rect x={20} y={40} width={220} height={42} rx={12} fill={color} stroke={INK} strokeWidth={6} />
    {color === '#F2C230' && <path d="M60 50 L70 62 M150 48 L160 62" stroke="#fff" strokeWidth={6} strokeLinecap="round" />}
  </svg>;
// Doug's snowmobile wash (front shop).
const WashShop = ({x, y, w = 700, t, night}: {x: number; y: number; w?: number; t: number; night?: boolean}) => {
  const h = w * 0.7;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h}}>
    <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: h * 0.78, background: night ? '#7D8DA6' : '#F4F9FC', border: `7px solid ${INK}`, borderRadius: '24px 24px 0 0', boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: w * 0.2, width: w * 0.6, bottom: 0, height: h * 0.5, background: '#2C4A5E', border: `7px solid ${INK}`, borderRadius: '120px 120px 0 0', boxSizing: 'border-box'}} />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: w * 0.25 + i * w * 0.14, bottom: h * 0.08 + ((t * 80 + i * 40) % (h * 0.35)), width: 34, height: 34, borderRadius: '50%', border: '5px solid #BFE6FA', boxSizing: 'border-box'}} />)}
    <div style={{position: 'absolute', left: w * 0.06, right: w * 0.06, top: 0, height: h * 0.26, background: '#41A8EC', border: `7px solid ${INK}`, borderRadius: 16, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.075, color: '#fff', WebkitTextStroke: `3px ${INK}`, paintOrder: 'stroke fill'}}>DOUG'S SNOWMOBILE WASH</div>
  </div>;
};
// Cash box: slot on top, drawer at the bottom-right.
const CashBox = ({x, y, w = 380, t}: {x: number; y: number; w?: number; t: number}) => <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.8, width: w, height: w * 0.8, transform: `rotate(${Math.sin(t * 25) * 1.2}deg)`}}>
  <div style={{position: 'absolute', inset: 0, background: '#9AA7B2', border: `7px solid ${INK}`, borderRadius: 22, boxSizing: 'border-box'}} />
  <div style={{position: 'absolute', left: w * 0.25, width: w * 0.5, top: 20, height: 22, background: INK, borderRadius: 10}} />
  <div style={{position: 'absolute', left: w * 0.3, width: w * 0.4, top: w * 0.25, height: w * 0.25, background: INK, color: '#5EF08A', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.09, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8}}>CASH</div>
  <div style={{position: 'absolute', left: w * 0.1, right: w * 0.1, bottom: 24, height: w * 0.16, background: '#C4CDD4', border: `6px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box'}} />
</div>;
// Fish flying on an arc, looping (dirty = rotten).
const FishStream = ({x1, y1, x2, y2, t, a, rotten = 0, gap = 0.3, dur = 0.7, w = 150, id}: {x1: number; y1: number; x2: number; y2: number; t: number; a: number; rotten?: number; gap?: number; dur?: number; w?: number; id: string}) => {
  if (t < a) return null;
  const out: React.ReactNode[] = [];
  for (let k = 0; k < Math.ceil(dur / gap) + 1; k++) {
    const n = Math.floor((t - a) / gap) - k, st = a + n * gap, p = (t - st) / dur;
    if (n < 0 || p < 0 || p > 1) continue;
    out.push(<Fish key={n} id={`${id}${n % 4}`} x={x1 + (x2 - x1) * p} y={y1 + (y2 - y1) * p - Math.sin(p * Math.PI) * 200} w={w} rot={p * 300} rotten={rotten} />);
  }
  return <>{out}</>;
};
const Magnifier = ({x, y, size = 160}: {x: number; y: number; size?: number}) => <div style={{position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size}}>
  <div style={{position: 'absolute', inset: 0, borderRadius: '50%', border: `12px solid ${INK}`, background: 'rgba(191,230,250,0.55)', boxSizing: 'border-box'}} />
  <div style={{position: 'absolute', left: size * 0.82, top: size * 0.82, width: size * 0.5, height: 24, background: '#8B5A2B', border: `5px solid ${INK}`, borderRadius: 10, transform: 'rotate(45deg)', transformOrigin: '0 50%'}} />
</div>;
const Night = () => <>
  <div style={{position: 'absolute', inset: -400, background: '#1E2A4A'}} />
  <div style={{position: 'absolute', left: 820, top: 300, width: 140, height: 140, borderRadius: '50%', background: '#F7E9A0', boxShadow: '-30px 0 0 0 #1E2A4A inset'}} />
  {[[120, 260], [300, 420], [620, 230], [940, 560], [480, 520]].map(([a, b], i) => <div key={i} style={{position: 'absolute', left: a, top: b, fontSize: 40, color: '#fff'}}>✦</div>)}
</>;
const Check = ({text, x, y, at, t, ok, color = INK}: {text: string; x: number; y: number; at: number; t: number; ok?: boolean; color?: string}) => {
  const p = ease((t - at) / 0.2); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${p})`, transformOrigin: '0 50%', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 92, color, whiteSpace: 'nowrap'}}>
    {text} <span style={{color: ok ? GREEN : RED}}>{ok ? '✓' : '✗'}</span></div>;
};

// Doug + state gag: close-up, the state written big.
const Mood = ({t, at, kind}: {t: number; at: number; kind: 'poor' | 'rich'}) => <>
  {kind === 'rich' && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 200, top: 520 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}
  {kind === 'poor' && <div style={{position: 'absolute', inset: -400, background: '#E9EDF0'}} />}
  <Penguin id="doug" x={540} y={G + 300} h={950} outfit={kind === 'rich' ? 'rich' : 'none'}
    pose={kind === 'rich' ? {beak: 'smile', brows: 'happy', lids: 0.3, blush: 1, flapL: 120, flapR: 120} : {lids: 0.35, brows: 'worried', beak: 'frown', tears: true}} />
  {kind === 'poor' && <div style={{position: 'absolute', left: 140, top: 380, width: 800, height: 1100}}>
    {Array.from({length: 6}, (_, i) => <div key={i} style={{position: 'absolute', left: i * 150, top: -1100 * (1 - ease((t - at) / 0.25)), width: 26, height: 1100, background: '#4A4F55', border: `4px solid ${INK}`, borderRadius: 6, boxSizing: 'border-box'}} />)}
  </div>}
  <BigWord text={`Doug ${kind}.`} x={540} y={340} at={at} size={140} color={kind === 'rich' ? GREEN : RED} />
</>;

const Snow = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 900, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;
const BillPile = ({x, y, n, w = 170}: {x: number; y: number; n: number; w?: number}) => <>
  {Array.from({length: n}, (_, i) => { const row = Math.floor(i / 4), col = i % 4, inRow = Math.min(4, n - row * 4);
    return <Bill key={i} x={x + (col - (inRow - 1) / 2) * w * 0.7 + (row % 2) * 30} y={y - 30 - row * w * 0.3} w={w} rot={((i * 29) % 30) - 15} />; })}
</>;

const Million = ({t}: {t: number}) => <>
  <Snow />
  <Mansion x={540} y={G - 250} w={760} />
  <BillPile x={540} y={G} n={16} />
  <Penguin id="doug" x={540} y={G - 230} h={400} outfit="rich" pose={{beak: 'smile', brows: 'happy', lids: 0.3, flapR: 110 + Math.sin(t * 8) * 15, flapL: 110}} />
  <Sparkles x={300} y={700} t={t} /><Sparkles x={860} y={760} t={t} />
  <BigWord text="$1,000,000" x={540} y={330} at={P(1) + 0.4} size={150} color={GREEN} />
</>;

const Intro = ({t}: {t: number}) => {
  const bag = t >= P(3), drop = ease((t - P(3)) / 0.35);
  return <>
    <Snow />
    <Penguin id="doug" x={bag ? 330 : 540} y={G} h={bag ? 460 : 560} pose={bag ? {turn: 0.6, look: [0.8, -0.2], beak: 'smile', brows: 'happy'} : {beak: 'smile', brows: 'happy', flapR: 60 + Math.sin(t * 8) * 20}} />
    <BigWord text="Doug" x={540} y={460} at={P(2)} until={P(3)} size={170} />
    {bag && <>
      <MoneyBag x={760} y={G - 380 - (1 - drop) * 900} w={360} label="FISH" />
      <FishPile x={760} y={G - 330 - (1 - drop) * 900} n={4} w={130} />
      <BigWord text="big bag" x={540} y={420} at={P(3) + 0.4} size={130} />
    </>}
  </>;
};

const Larry = ({t}: {t: number}) => <>
  <Snow />
  <Walrus x={330} y={G} h={520} pose={{laugh: t > P(5) ? 1 : 0, lids: 0.5, look: 0.5}} flip />
  <Sled x={760} y={G} w={300} color="#D83A2E" /><Sled x={820} y={G - 130} w={260} /><Sled x={720} y={G - 250} w={240} color="#2E9E4F" />
  <BigWord text="Larry" x={330} y={520} at={P(4)} until={P(5)} size={140} />
  {t >= P(5) && <Stamp text="STOLEN" x={780} y={780} at={P(5) + 0.3} color={RED} size={120} />}
  <FishFlight x1={780} y1={G - 600} x2={330} y2={G - 400} a={P(5) + 0.6} b={P(5) + 1.3} n={4} w={90} />
</>;

const Dirty = ({t}: {t: number}) => <>
  <Snow />
  <FishPile x={540} y={G} n={9} w={240} rotten={1} />
  <Stinky x={440} y={G - 380} t={t} /><Stinky x={700} y={G - 340} t={t + 1} />
  <BigWord text="dirty" x={540} y={500} at={P(6)} until={P(7)} size={170} color="#7C6A3A" />
  {t >= P(7) && t < P(8) && <>
    <div style={{position: 'absolute', left: 380, top: 380, width: 320, height: 170, background: '#F4B7D0', border: `7px solid ${INK}`, borderRadius: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64}}>SOAP</div>
    <BigWord text="✗" x={540} y={460} at={P(7) + 0.3} size={280} color={RED} />
  </>}
  {t >= P(8) && <Stamp text="CRIME" x={540} y={480} at={P(8)} color={RED} size={170} />}
</>;

const Bank = ({t}: {t: number}) => {
  const walk = ease((t - P(9)) / 0.9), ask = t >= P(10), sweat = t >= P(11);
  return <>
    <Snow />
    <IceBank x={540} y={G} w={980} />
    <div style={{position: 'absolute', left: 520, top: G - 220, width: 520, height: 220, background: '#C8924E', border: `7px solid ${INK}`, boxSizing: 'border-box'}} />
    <Fox x={790} y={G - 120} h={520} mouth={ask && !sweat ? 0.3 + 0.2 * Math.sin(t * 20) : 0} />
    <MoneyBag x={sweat ? 300 : 120 + 230 * walk} y={G - 230} w={190} label="FISH" />
    <Penguin id="doug" x={-100 + 380 * walk} y={G} h={430} pose={sweat ? {brows: 'worried', sweat: true, tremble: 1, eyeScale: 1.2, look: [0.8, -0.2], beak: 'frown'} : {walk: walk < 1 ? t : null, turn: 0.6, look: [0.8, 0], beak: 'smile'}} />
    {ask && <Bubble text="where fish come from?" x={700} y={360} at={P(10) + 0.1} t={t} w={560} tailX={120} />}
    {sweat && <BigWord text="..." x={280} y={680} at={P(11)} size={200} />}
  </>;
};

const Wash = ({t}: {t: number}) => {
  const nobody = t >= P(13);
  return <>
    <Snow />
    <WashShop x={540} y={G} w={860} t={t} />
    <Penguin id="doug" x={nobody ? 330 : 540} y={G + 120} h={360} pose={nobody ? {lids: 0.5, brows: 'worried', look: [0.8, 0]} : {beak: 'smile', brows: 'happy', flapR: 120, flapL: 120}} />
    {nobody && <>
      <div style={{position: 'absolute', left: -200 + (t - P(13)) * 800, top: G + 40, width: 110, height: 110, borderRadius: '50%', background: '#fff', border: `6px solid ${INK}`, transform: `rotate(${t * 400}deg)`, boxSizing: 'border-box'}} />
      <BigWord text="0 customers" x={540} y={380} at={P(13)} size={120} color={RED} />
    </>}
  </>;
};

const Ledger = ({t}: {t: number}) => <>
  <Night />
  <div style={{position: 'absolute', left: 60, top: 1050, width: 960, height: 60, background: '#8B5A2B', border: `6px solid ${INK}`}} />
  <Penguin id="doug" x={330} y={1080} h={420} pose={{turn: 0.6, look: [0.8, 0.5], brows: 'angry', angry: 0.4, beak: 'smile', holding: true}} />
  <div style={{position: 'absolute', left: 470, top: 600, width: 520, height: 460, background: '#FFF8E0', border: `7px solid ${INK}`, borderRadius: 12, transform: 'rotate(-4deg)', padding: 30, boxSizing: 'border-box', fontFamily: 'Architects Daughter', fontWeight: 700, color: INK}}>
    <div style={{fontSize: 52, borderBottom: `4px solid ${INK}`}}>CUSTOMERS</div>
    {t >= P(15) && <div style={{fontSize: 180, color: GREEN, transform: `scale(${ease((t - P(15)) / 0.25)})`}}>100</div>}
  </div>
  <BigWord text="every night" x={540} y={380} at={P(14)} until={P(15)} size={130} color="#fff" />
  {t >= P(15) + 0.6 && <BigWord text="real: 0" x={760} y={1130} at={P(15) + 0.6} size={100} color={RED} />}
</>;

const Box = ({t}: {t: number}) => {
  const out = t >= P(17);
  return <>
    <Snow />
    <CashBox x={540} y={G} w={420} t={t} />
    <FishPile x={150} y={G} n={5} w={150} rotten={1} />
    <Stinky x={150} y={G - 200} t={t} />
    <FishStream x1={170} y1={G - 250} x2={540} y2={G - 330} t={t} a={P(16)} rotten={1} id="fsd" />
    <BigWord text="dirty fish" x={300} y={480} at={P(16)} size={110} color="#7C6A3A" />
    {out && <>
      <FishStream x1={640} y1={G - 80} x2={920} y2={G - 150} t={t} a={P(17)} id="fsc" />
      <FishPile x={930} y={G} n={Math.min(6, 1 + Math.floor((t - P(17)) * 4))} w={150} />
      <Sparkles x={930} y={G - 220} t={t} />
      <BigWord text="clean fish" x={780} y={600} at={P(17)} size={110} color={GREEN} />
    </>}
  </>;
};

const Story = ({t}: {t: number}) => {
  const thank = t >= P(19);
  return <>
    <Snow />
    <IceBank x={540} y={G} w={980} />
    <div style={{position: 'absolute', left: 520, top: G - 220, width: 520, height: 220, background: '#C8924E', border: `7px solid ${INK}`, boxSizing: 'border-box'}} />
    <Fox x={790} y={G - 120} h={520} mouth={thank ? 0.4 : 0} sly={thank ? 0.2 : 1} />
    <Penguin id="doug" x={280} y={G} h={430} pose={{turn: 0.6, look: [0.8, -0.2], beak: 'smile', brows: 'happy', holding: true}} />
    <div style={{position: 'absolute', left: 300, top: 640, width: 330, height: 300, background: '#fff', border: `6px solid ${INK}`, transform: 'rotate(-6deg)', padding: 20, boxSizing: 'border-box', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 44, lineHeight: 1.2}}>
      SNOWMOBILE WASH<br />income: 🐟🐟🐟<br /><span style={{color: GREEN}}>100 customers</span></div>
    {thank && <Bubble text="thank you, penguin" x={760} y={370} at={P(19)} t={t} w={520} tailX={60} />}
  </>;
};

const Called = ({t}: {t: number}) => t < P(21) ? <Title lines={['MONEY', 'LAUNDERING']} y={880} at={P(20) + 0.5} size={170} /> : <>
  <Snow />
  <Washer x={300} y={G} w={420} t={t} money="clean" />
  <Snowmobile x={800} y={G} w={400} t={t} />
  <BigWord text="money ✓" x={300} y={500} at={P(21)} size={110} color={GREEN} />
  <BigWord text="✗" x={800} y={G - 120} at={P(21) + 1} size={300} color={RED} />
  <BigWord text="snowmobiles" x={790} y={600} at={P(21) + 1} size={90} color={RED} />
</>;

const RealLife = ({t}: {t: number}) => t < P(24) ? <>
  <BigWord text="real life" x={540} y={420} at={P(23)} size={120} />
  <svg width={300} height={190} viewBox="0 0 190 120" style={{position: 'absolute', left: 390, top: 560}}>
    <rect width={190} height={120} fill="#fff" stroke={INK} strokeWidth={5} />
    {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} y={i * 17.4} width={190} height={8.7} fill="#B22234" />)}
    <rect width={84} height={64} fill="#3C3B6E" /><rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} /></svg>
  <BigWord text="$300,000,000,000" x={540} y={900} at={P(23) + 1.6} size={112} color={RED} rot={0} />
  <BigWord text="crime money" x={540} y={1060} at={P(23) + 2.8} size={100} />
  <BigWord text="every year" x={540} y={1200} at={P(23) + 4.2} size={100} color={RED} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 1320, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 34, color: '#888'}}>US Treasury, National Money Laundering Risk Assessment</div>
</> : <>
  <Snow />
  <Washer x={540} y={G} w={600} t={t * 1.5} money="both" />
  <BillPile x={540} y={G - 640} n={8} w={150} />
  <BigWord text="washing" x={540} y={300} at={P(24)} size={140} />
</>;

const Lux = ({t}: {t: number}) => {
  const sled = t >= P(26), good = t >= P(27);
  return <>
    <Snow />
    <Mansion x={540} y={G} w={820} />
    {sled && <Sled x={lerp(1400, 800, ease((t - P(26)) / 0.5))} y={G + 120} w={340} color="#F2C230" />}
    <Penguin id="doug" x={330} y={G + 140} h={420} outfit="rich" pose={{beak: 'smile', brows: 'happy', lids: 0.3, flapR: 100 + Math.sin(t * 8) * 15}} />
    <BigWord text="mansion" x={540} y={380} at={P(25)} until={P(26)} size={130} />
    {sled && !good && <BigWord text="gold sled" x={540} y={380} at={P(26)} size={130} color="#C99A00" />}
    {good && <><BigWord text="life is good" x={540} y={380} at={P(27)} size={130} color={GREEN} /><Sparkles x={540} y={560} t={t} /></>}
  </>;
};

const Gull = ({t}: {t: number}) => {
  const land = ease((t - P(28)) / 0.7);
  return <>
    <Snow />
    <WashShop x={330} y={G} w={600} t={t} />
    <Seagull x={lerp(1200, 820, land)} y={lerp(300, G, land)} h={420} pose={{fly: land < 1, mouth: t > P(29) ? 0.4 : 0}} />
    {land >= 1 && <Magnifier x={620} y={G - 260 + Math.sin(t * 3) * 10} size={170} />}
    <BigWord text="Tax Gull" x={760} y={420} at={P(28) + 0.5} until={P(29)} size={120} color={RED} />
    <div style={{position: 'absolute', left: 0, top: 0}}>
      <Check text="soap: 0" x={90} y={330} at={P(29)} t={t} />
      <Check text="water: 0" x={90} y={450} at={P(29) + 0.8} t={t} />
      <Check text="$1,000,000" x={90} y={570} at={P(30)} t={t} ok color={GREEN} />
    </div>
    {t >= P(30) + 0.6 && <BigWord text="?!" x={950} y={600} at={P(30) + 0.6} size={160} color={RED} />}
  </>;
};

const Seize = ({t}: {t: number}) => {
  const a = P(31), b = a + 1.1, c = a + 2.2;
  return <>
    <Snow />
    <Mansion x={300} y={G - 300} w={480} />
    <Sled x={800} y={G - 330} w={300} color="#F2C230" />
    <FishPile x={540} y={G} n={6} w={160} />
    <Stamp text="TAKEN" x={300} y={G - 520} at={a + 0.3} color={RED} size={100} />
    <Stamp text="TAKEN" x={800} y={G - 420} at={b} color={RED} size={100} />
    <Stamp text="TAKEN" x={540} y={G - 160} at={c} color={RED} size={100} />
    <Seagull x={lerp(1100, 540, ease((t - a) / 0.5))} y={500} h={320} pose={{fly: true, holding: t > c}} />
  </>;
};

const JailDishes = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', inset: -400, background: '#BFC6CC'}} />
  <Snow />
  <div style={{position: 'absolute', left: 520, top: G - 260, width: 420, height: 260, background: '#9AA3AB', border: `7px solid ${INK}`, boxSizing: 'border-box'}} />
  {Array.from({length: 7}, (_, i) => <div key={i} style={{position: 'absolute', left: 600 + (i % 3) * 30, top: G - 300 - i * 34, width: 220, height: 30, borderRadius: '50%', background: '#fff', border: `5px solid ${INK}`, boxSizing: 'border-box'}} />)}
  <Penguin id="doug" x={360} y={G} h={480} pose={{lids: 0.4, brows: 'worried', beak: 'frown', flapR: 40 + Math.sin(t * 12) * 25, turn: 0.5, look: [0.8, 0.3]}} />
  {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 640 + i * 70, top: G - 330 - ((t * 90 + i * 30) % 120), width: 30, height: 30, borderRadius: '50%', border: '4px solid #fff', boxSizing: 'border-box'}} />)}
  {t >= P(33) && Array.from({length: 7}, (_, i) => <div key={`b${i}`} style={{position: 'absolute', left: 20 + i * 165, top: 200 - 1200 * (1 - ease((t - P(33) - 0.7) / 0.25)), width: 30, height: 1250, background: '#4A4F55', border: `4px solid ${INK}`, borderRadius: 6, boxSizing: 'border-box'}} />)}
  <BigWord text="washed fish" x={540} y={420} at={P(32)} until={P(33)} size={130} />
  {t >= P(33) && <BigWord text="wash dishes" x={540} y={420} at={P(33)} size={130} color={RED} />}
</>;

const Cta = ({t}: {t: number}) => <>
  <Snow />
  <BigWord text="next business?" x={540} y={380} at={P(35)} size={120} />
  {['CAR WASH', 'LAUNDROMAT', 'NAIL SALON'].map((s, i) => { const p = ease((t - P(35) - 0.4 - i * 0.3) / 0.25);
    return <div key={s} style={{position: 'absolute', left: 560, top: 540 + i * 170, width: 440, height: 130, background: '#fff', border: `6px solid ${INK}`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, transform: `scale(${p}) rotate(${i % 2 ? 3 : -3}deg)`}}>{s}</div>; })}
  <Penguin id="doug" x={300} y={G + 60} h={560} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <BigWord text="👇" x={300} y={600} at={P(36)} size={140} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(1), set: (t) => <Million t={t} />, fx_: 'zoom'},
  {at: P(2), set: (t) => <Intro t={t} />, fx_: 'swipe'},
  {at: P(4), set: (t) => <Larry t={t} />, fx_: 'swipeL'},
  {at: P(6), set: (t) => <Dirty t={t} />, fx_: 'pop'},
  {at: P(9), set: (t) => <Bank t={t} />, fx_: 'swipe'},
  {at: P(12), set: (t) => <Wash t={t} />, fx_: 'iris'},
  {at: P(14), set: (t) => <Ledger t={t} />, fx_: 'zoom'},
  {at: P(16), set: (t) => <Box t={t} />, fx_: 'swipeL'},
  {at: P(18), set: (t) => <Story t={t} />, fx_: 'pop'},
  {at: P(20), set: (t) => <Called t={t} />, fx_: 'zoom'},
  {at: P(22), set: (t) => <Mood t={t} at={P(22)} kind="rich" />, fx_: 'zoom'},
  {at: P(23), set: (t) => <RealLife t={t} />, fx_: 'swipe'},
  {at: P(25), set: (t) => <Lux t={t} />, fx_: 'swipeL'},
  {at: P(28), set: (t) => <Gull t={t} />, fx_: 'iris'},
  {at: P(31), set: (t) => <Seize t={t} />, fx_: 'pop'},
  {at: P(32), set: (t) => <JailDishes t={t} />, fx_: 'swipe'},
  {at: P(34), set: (t) => <Mood t={t} at={P(34)} kind="poor" />, fx_: 'zoom'},
  {at: P(35), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[3, 640, 800, 1.3], [5, 780, 950, 1.4], [8, 540, 700, 1.4], [11, 330, 950, 1.6], [15, 730, 820, 1.4], [19, 760, 700, 1.4], [26, 700, 1150, 1.4], [30, 400, 600, 1.4], [33, 540, 900, 1.2]];

export const DougLaundering = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: slow push toward the clothesline
    const toW = ease((tc - 1.0) / 0.6);
    s0 = 1 + 0.03 * toW;
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
    <Sfx at={0.15} name="swoosh-fast" vol={0.3} />
    <Sfx at={1.15} name="user-cash-register" vol={0.3} />
    <Sfx at={POOR} name="user-boom" vol={0.45} />
    <Sfx at={P(1) + 0.4} name="user-money" vol={0.35} />
    <Sfx at={P(2)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(3) + 0.3} name="user-slap" vol={0.35} />
    <Sfx at={P(4)} name="walrus-grunt" vol={0.4} />
    <Sfx at={P(5)} name="walrus-laugh" vol={0.4} />
    <Sfx at={P(5) + 0.3} name="user-boom" vol={0.35} />
    <Sfx at={P(6)} name="user-wrong" vol={0.3} />
    <Sfx at={P(7) + 0.3} name="user-horn" vol={0.3} />
    <Sfx at={P(8)} name="user-boom" vol={0.4} />
    <Sfx at={P(10)} name="user-notif" vol={0.3} />
    <Sfx at={P(11)} name="user-shock" vol={0.4} />
    <Sfx at={P(13)} name="user-aww" vol={0.35} />
    <Sfx at={P(15)} name="user-ting" vol={0.35} />
    <Sfx at={P(15) + 0.6} name="user-wrong" vol={0.3} />
    <Sfx at={P(16)} name="user-money" vol={0.3} />
    <Sfx at={P(17)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(19)} name="user-wow" vol={0.35} />
    <Sfx at={P(20) + 0.5} name="user-ting" vol={0.35} />
    <Sfx at={P(21) + 1} name="user-slap" vol={0.3} />
    <Sfx at={P(22)} name="user-yeah" vol={0.4} />
    <Sfx at={P(23)} name="user-ting" vol={0.35} />
    <Sfx at={P(23) + 1.6} name="user-boom" vol={0.4} />
    <Sfx at={P(25)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(26)} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(27)} name="user-wow" vol={0.35} />
    <Sfx at={P(28)} name="gull-caw" vol={0.4} />
    <Sfx at={P(29)} name="user-wrong" vol={0.3} />
    <Sfx at={P(29) + 0.8} name="user-wrong" vol={0.3} />
    <Sfx at={P(30) + 0.6} name="user-shock" vol={0.4} />
    <Sfx at={P(31) + 0.3} name="user-slap" vol={0.35} />
    <Sfx at={P(31) + 1.1} name="user-slap" vol={0.35} />
    <Sfx at={P(31) + 2.2} name="gull-mine" vol={0.4} />
    <Sfx at={P(33) + 0.7} name="user-boom" vol={0.4} />
    <Sfx at={P(34)} name="user-fahh" vol={0.45} />
    <Sfx at={P(35)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
