// EP7 "Bank Error" — should get $82 vs got $1,200,000 (real story: Louisiana 2021). Hook first (approval), full episode after.
// Line timings: studio/src/data/doug-bank-error.json (free Kokoro am_michael VO, one line per phrase).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Captions, Sfx, beat} from '../penguin/edit';
import {BigWord, FishPile, IceBank, Paper, SpeedLines, Stamp, Thought, Title} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Bill, Fox} from './dougLaundering';
import TIM from '../data/doug-bank-error.json';

const P = (i: number) => TIM[i].start;
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
export const DOUG_BANK_ERROR_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1390;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';

// word timings inside the hook lines (syllable estimate on the Kokoro take)
// word onsets from silencedetect on the Kokoro take: each element enters on its own word
const BANK = P(0) + 1.0, SENDW = P(0) + 1.25, ONE = P(0) + 1.83, MILLION = P(0) + 2.85, LAND = MILLION + 0.6, MISTAKE = P(0) + 3.85, EIGHTY2 = P(1) + 0.93;

// ---------- hook (side by side, like every versus hook): BANK + US flag left --- money line ---> Doug + phone right ----------
// Synced to the words: Doug (0 s) -> bank ("bank") -> line ("send") -> $1,200,000 ("one point two") -> bills ("million") -> phone -> freeze ("mistake").
const B0: [number, number] = [460, 1060], BC: [number, number] = [580, 230], B1: [number, number] = [655, 1010]; // money line (quadratic)
const onLine = (p: number) => [0, 1].map((k) => (1 - p) ** 2 * B0[k] + 2 * (1 - p) * p * BC[k] + p * p * B1[k]);
const TAG = onLine(0.5);
const Flag = ({x, y, t, w = 210}: {x: number; y: number; t: number; w?: number}) => <>
  <div style={{position: 'absolute', left: x - 6, top: y, width: 12, height: 300, background: INK, borderRadius: 6}} />
  <svg width={w} height={w * 0.55} viewBox="0 0 190 105" style={{position: 'absolute', left: x + 6, top: y + 6, transform: `skewY(${Math.sin(t * 5) * 4}deg)`, transformOrigin: '0 50%'}}>
    {Array.from({length: 7}, (_, i) => <rect key={i} x={0} y={i * 15} width={190} height={7.5} fill={RED} />)}
    <rect x={0} y={0} width={80} height={56} fill="#2C4A9E" />
    {Array.from({length: 12}, (_, i) => <circle key={i} cx={10 + (i % 4) * 20} cy={10 + Math.floor(i / 4) * 18} r={4} fill="#fff" />)}
    <rect x={0} y={0} width={190} height={105} fill="none" stroke={INK} strokeWidth={5} />
  </svg>
</>;
// Bank app phone: blue BANK header with a mini US flag, BALANCE, amount. (x, y) = centre.
export const BankApp = ({x, y, w = 210, amount, color = INK, buzz = 0, call}: {x: number; y: number; w?: number; amount: string; color?: string; buzz?: number; call?: string}) => {
  const k = w / 210, h = w * 1.86;
  return <div style={{position: 'absolute', left: x - w / 2 + buzz, top: y - h / 2, width: w, height: h, background: INK, borderRadius: 32 * k}}>
    <div style={{position: 'absolute', left: 11 * k, right: 11 * k, top: 11 * k, bottom: 11 * k, background: '#F4F9FC', borderRadius: 24 * k, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 92 * k, background: '#1F5FAF', borderBottom: `${4 * k}px solid ${INK}`}}>
        <svg width={44 * k} height={26 * k} viewBox="0 0 190 105" style={{position: 'absolute', left: 16 * k, top: 46 * k}}>
          {Array.from({length: 7}, (_, i) => <rect key={i} x={0} y={i * 15} width={190} height={7.5} fill={RED} />)}
          <rect x={0} y={0} width={80} height={56} fill="#2C4A9E" /><rect x={0} y={0} width={190} height={105} fill="none" stroke="#fff" strokeWidth={8} />
        </svg>
        <div style={{position: 'absolute', left: 68 * k, top: 38 * k, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 34 * k, color: '#fff'}}>BANK</div>
      </div>
      {call ? <div style={{position: 'absolute', left: 0, right: 0, top: 130 * k, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40 * k, color: INK, lineHeight: 1.3}}>📞<br />{call}</div> : <>
        <div style={{position: 'absolute', left: 0, right: 0, top: 140 * k, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 800, fontSize: 20 * k, color: '#6B7C8C'}}>BALANCE</div>
        <div style={{position: 'absolute', left: 0, right: 0, top: 172 * k, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: (amount.length > 8 ? 30 : 40) * k, color}}>{amount}</div>
        {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 20 * k, right: 20 * k, top: (250 + i * 26) * k, height: 12 * k, background: '#DCE6EE', borderRadius: 6 * k}} />)}
      </>}
    </div>
  </div>;
};
const Phone = ({t, y}: {t: number; y: number}) => {
  const got = t >= LAND, buzz = t > LAND && t < LAND + 0.4 ? Math.sin(t * 80) * 5 : 0;
  return <BankApp x={B1[0]} y={y} amount={got ? '$1,200,000' : '$0.00'} color={got ? GREEN : INK} buzz={buzz} />;
};
const Hook = ({t}: {t: number}) => {
  const jumping = t > LAND && t < MISTAKE, hop = jumping ? Math.abs(Math.sin((t - LAND) * 7)) * 90 : 0, frozen = t >= MISTAKE;
  const pose = frozen
    ? {brows: 'shock' as const, eyeScale: 1.5, beak: 'frown' as const, flapL: 60, flapR: 20, look: [-0.3, -0.1] as [number, number], tremble: 0.4}
    : jumping ? {brows: 'happy' as const, beak: 'smile' as const, flapL: 60, flapR: 150 + Math.sin(t * 14) * 15, hop, look: [-0.3, -0.2] as [number, number]}
    : {flapL: 60, look: [t < BANK ? 0 : -0.6, t < BANK ? 0.3 : -0.3] as [number, number]};
  const draw = ease((t - SENDW) / 0.45), shake = t > ONE && t < ONE + 0.4 ? Math.sin(t * 60) * 5 : 0, bank = ease((t - BANK) / 0.25);
  const tagP = ease((t - ONE) / 0.2) * (1 + (t > MILLION ? Math.sin(cl((t - MILLION) / 0.3) * Math.PI) * 0.12 : 0));
  return <>
    <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 800, background: '#F2F8FC', borderTop: `5px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${bank})`, transformOrigin: `240px ${G}px`}}>
      <Flag x={110} y={G - 760} t={t} w={240} />
      <IceBank x={240} y={G} w={460} />
      <Fox x={360} y={G} h={330} flip mouth={t > ONE && t < ONE + 0.6 ? 0.6 : 0} />
    </div>
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={`M${B0} Q${BC} ${B1}`} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
      {draw > 0.95 && <path d={`M${B1[0] - 10} ${B1[1] - 60} L${B1[0] - 2} ${B1[1] - 8} L${B1[0] - 55} ${B1[1] - 22}`} fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />}
    </svg>
    <div style={{position: 'absolute', left: TAG[0] - 210 + shake, top: TAG[1] - 200, width: 420, textAlign: 'center', transform: `scale(${tagP})`, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, lineHeight: '130px', color: RED, WebkitTextStroke: `3px ${INK}`, paintOrder: 'stroke fill'}}>$1,200,000</div>
    {t > MILLION && t < LAND + 0.1 && [0, 1, 2, 3, 4, 5].map((i) => { const p = cl((t - MILLION - i * 0.06) / 0.5);
      if (p <= 0 || p >= 1) return null; const [x, y] = onLine(p); return <Bill key={i} x={x} y={y} w={120} rot={p * 300} />; })}
    <Penguin id="doug" x={875} y={G} h={500} pose={pose} />
    <Phone t={t} y={B1[1] + 195 - hop} />
    <Thought x={880} y={680} w={300} tx={880} ty={880} at={EIGHTY2 - 0.15}>
      <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 92, color: GREEN}}>$82</div>
    </Thought>
  </>;
};
// light camera after a still first second [time, scale, focusX, focusY]
const CAM: [number, number, number, number][] = [ // light, and the bank never leaves the frame for long
  [0, 1.12, 760, 1060], [BANK - 0.1, 1.12, 760, 1060], [BANK + 0.25, 1.0, 540, 930], [ONE, 1.0, 540, 930], [ONE + 0.3, 1.1, 560, 840], [MILLION, 1.1, 560, 840],
  [MILLION + 0.3, 1.0, 540, 930], [LAND, 1.0, 540, 930], [LAND + 0.25, 1.12, 610, 1000], [MISTAKE, 1.12, 610, 1000], [MISTAKE + 0.25, 1.18, 620, 1020],
  [EIGHTY2 - 0.2, 1.18, 620, 1020], [EIGHTY2 + 0.1, 1.08, 600, 930],
];
const cam = (tc: number) => {
  let i = 0; while (i < CAM.length - 1 && tc >= CAM[i + 1][0]) i++;
  const a = CAM[i], b = CAM[Math.min(i + 1, CAM.length - 1)], p = b === a ? 0 : ease((tc - a[0]) / (b[0] - a[0]));
  return [1, 2, 3].map((k) => a[k] + (b[k] - a[k]) * p);
};

// ---------- story props ----------
const SG = 1300; // story ground
const Snow = () => <div style={{position: 'absolute', left: -400, right: -400, top: SG, height: 900, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;
const Bubble = ({text, x, y, at, t, w = 520, tailX = 0, size = 58}: {text: string; x: number; y: number; at: number; t: number; w?: number; tailX?: number; size?: number}) => {
  const p = ease((t - at) / 0.2); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `scale(${p})`, transformOrigin: `${w / 2 + tailX}px 100%`}}>
    <div style={{background: '#fff', border: `6px solid ${INK}`, borderRadius: 40, padding: '22px 26px', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: size, lineHeight: 1.15, textAlign: 'center', color: INK}}>{text}</div>
    <div style={{position: 'absolute', left: w / 2 + tailX - 20, bottom: -34, width: 0, height: 0, borderLeft: '20px solid transparent', borderRight: '20px solid transparent', borderTop: `40px solid ${INK}`}} />
  </div>;
};
const Sparkles = ({x, y, t}: {x: number; y: number; t: number}) => <>
  {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: x - 120 + i * 75, top: y - 150 - (i % 2) * 70, fontSize: 60, transform: `scale(${0.6 + 0.4 * Math.abs(Math.sin(t * 5 + i))})`}}>✨</div>)}
</>;
// Sheriff Moose (police): brown moose, big antlers, sheriff hat + gold star. Faces left by default. (x, y) = feet.
const Moose = ({x, y, h = 620, flip, mouth = 0, angry = 0, cuffs}: {x: number; y: number; h?: number; flip?: boolean; mouth?: number; angry?: number; cuffs?: boolean}) => {
  const t = useCurrentFrame() / FPS, bob = Math.sin(t * 2.5) * 3;
  return <svg width={h * 0.75} height={h} viewBox="0 0 300 400" style={{position: 'absolute', left: x - h * 0.375, top: y - h + bob, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    <ellipse cx={150} cy={396} rx={105} ry={9} fill="#E3E8EC" />
    <path d="M100 395 L105 300 M200 395 L195 300" stroke={INK} strokeWidth={26} strokeLinecap="round" /><path d="M100 395 L105 300 M200 395 L195 300" stroke="#7A4E2A" strokeWidth={16} strokeLinecap="round" />
    <path d="M80 330 Q 75 220 150 205 Q 225 220 220 330 Z" fill="#8B5A2B" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M150 215 L150 330" stroke="#6E4520" strokeWidth={4} />
    <path d="M182 250 l7 15 16 2 -12 11 4 16 -15 -8 -15 8 4 -16 -12 -11 16 -2 Z" fill="#F2C230" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    {cuffs && <g transform="translate(70 300)"><circle cx={0} cy={0} r={16} fill="none" stroke="#9AA3AB" strokeWidth={8} /><circle cx={34} cy={0} r={16} fill="none" stroke="#9AA3AB" strokeWidth={8} /><path d="M14 0 L20 0" stroke="#9AA3AB" strokeWidth={6} /></g>}
    <path d="M100 95 Q 50 70 40 20 Q 60 50 70 30 Q 75 60 95 45 Q 95 75 112 80 Z" fill="#D9B47A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M200 95 Q 250 70 260 20 Q 240 50 230 30 Q 225 60 205 45 Q 205 75 188 80 Z" fill="#D9B47A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M110 90 Q 150 70 190 90 L 185 175 Q 150 195 115 175 Z" fill="#8B5A2B" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M120 160 Q 60 165 45 200 Q 55 240 110 232 Q 140 225 140 195 Z" fill="#7A4E2A" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <ellipse cx={62} cy={202} rx={9} ry={6} fill={INK} /><ellipse cx={90} cy={198} rx={8} ry={6} fill={INK} />
    <path d={mouth > 0 ? `M60 222 Q 85 ${226 + mouth * 22} 112 220` : 'M62 222 Q 85 230 110 221'} fill={mouth > 0 ? INK : 'none'} stroke={INK} strokeWidth={5} strokeLinecap="round" />
    <ellipse cx={132} cy={128} rx={11} ry={12} fill={INK} /><ellipse cx={170} cy={128} rx={11} ry={12} fill={INK} />
    <circle cx={135} cy={124} r={4} fill="#fff" /><circle cx={173} cy={124} r={4} fill="#fff" />
    <path d={`M118 ${108 + angry * 6} L146 ${112 - angry * 2} M184 ${108 + angry * 6} L156 ${112 - angry * 2}`} stroke={INK} strokeWidth={6} strokeLinecap="round" />
    <path d="M70 92 Q 150 110 230 92 Q 210 100 200 80 Q 190 40 150 42 Q 110 40 100 80 Q 90 100 70 92 Z" fill="#C8A060" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M102 76 Q 150 86 198 76" fill="none" stroke="#7A4E2A" strokeWidth={8} />
    <path d="M150 52 l4 9 10 1 -8 7 3 10 -9 -5 -9 5 3 -10 -8 -7 10 -1 Z" fill="#F2C230" stroke={INK} strokeWidth={3} />
  </svg>;
};
// Simple house with a front door (door centre x, so the knock scene can reuse it).
const House = ({x, y, w = 700, door = 0}: {x: number; y: number; w?: number; door?: number}) => {
  const h = w * 0.8;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h, width: w, height: h}}>
    <svg width={w} height={h} viewBox="0 0 700 560" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <rect x={80} y={230} width={540} height={330} fill="#F4E3C8" stroke={INK} strokeWidth={8} />
      <path d="M40 240 L350 40 L660 240 Z" fill="#C2503E" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
      <rect x={490} y={70} width={60} height={110} fill="#C2503E" stroke={INK} strokeWidth={7} />
      <rect x={130} y={300} width={130} height={110} fill="#BFE6FA" stroke={INK} strokeWidth={7} /><path d="M195 300 L195 410 M130 355 L260 355" stroke={INK} strokeWidth={5} />
      <rect x={440} y={300} width={130} height={110} fill="#BFE6FA" stroke={INK} strokeWidth={7} /><path d="M505 300 L505 410 M440 355 L570 355" stroke={INK} strokeWidth={5} />
      <rect x={295} y={360} width={110} height={200} fill="#7A4E2A" stroke={INK} strokeWidth={7} transform={`skewY(${-door * 8})`} style={{transformOrigin: '295px 460px'}} />
      <circle cx={385} cy={465} r={8} fill="#F2C230" stroke={INK} strokeWidth={3} />
    </svg>
  </div>;
};
// Shiny SUV (side view). (x, y) = bottom centre.
const Car = ({x, y, w = 620, t}: {x: number; y: number; w?: number; t: number}) => <svg width={w} height={w * 0.5} viewBox="0 0 620 310" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.5, overflow: 'visible'}}>
  <path d="M30 230 L30 160 Q 40 130 90 125 L170 60 Q 190 45 230 45 L430 45 Q 470 45 495 70 L560 125 Q 600 135 600 175 L600 230 Z" fill="#2C2F38" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
  <path d="M185 70 L240 65 L240 125 L120 125 Z" fill="#BFE6FA" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <path d="M260 65 L420 65 Q 450 65 470 85 L505 125 L260 125 Z" fill="#BFE6FA" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <path d="M60 165 L560 165" stroke="#5A6070" strokeWidth={5} />
  <path d={`M${80 + ((t * 300) % 500)} 140 l40 -20`} stroke="#fff" strokeWidth={10} strokeLinecap="round" opacity={0.8} />
  {[150, 470].map((cx) => <g key={cx}><circle cx={cx} cy={235} r={58} fill={INK} /><circle cx={cx} cy={235} r={28} fill="#C9CED4" stroke={INK} strokeWidth={5} /></g>)}
  <rect x={570} y={180} width={30} height={18} rx={5} fill="#F7E9A0" stroke={INK} strokeWidth={4} />
</svg>;
// 911 dispatch desk: desk, monitor with "911", red light; Doug sits behind with a headset.
const Desk911 = ({t, ring, dark}: {t: number; ring?: boolean; dark?: boolean}) => {
  const on = ring && Math.floor(t * 4) % 2 === 0;
  return <>
    <div style={{position: 'absolute', left: 620, top: 620, width: 380, height: 300, background: INK, borderRadius: 24}}>
      <div style={{position: 'absolute', left: 14, right: 14, top: 14, bottom: 14, background: dark ? '#3A3F48' : '#0F2A4A', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 130, color: on ? '#FF5A4A' : '#fff'}}>911</div>
    </div>
    <div style={{position: 'absolute', left: 785, top: 920, width: 50, height: 110, background: INK}} />
    <div style={{position: 'absolute', left: 60, top: 1020, width: 960, height: 70, background: '#B07A45', border: `7px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: 120, top: 1090, width: 30, height: 210, background: INK}} /><div style={{position: 'absolute', left: 930, top: 1090, width: 30, height: 210, background: INK}} />
    <div style={{position: 'absolute', left: 170, top: 540, width: 90, height: 90, borderRadius: '50%', background: on ? '#FF3B2E' : '#8A2A22', border: `6px solid ${INK}`, boxShadow: on ? '0 0 60px 20px rgba(255,59,46,0.5)' : 'none'}} />
  </>;
};
const Headset = ({x, y, h}: {x: number; y: number; h: number}) => { const k = h / 520;
  return <svg width={400 * k} height={h} viewBox="0 0 400 520" style={{position: 'absolute', left: x - 200 * k, top: y - h, overflow: 'visible'}}>
    <path d="M85 170 Q 200 -10 315 170" fill="none" stroke={INK} strokeWidth={16} strokeLinecap="round" />
    <rect x={62} y={150} width={40} height={70} rx={14} fill={INK} /><rect x={298} y={150} width={40} height={70} rx={14} fill={INK} />
    <path d="M318 215 Q 300 290 240 292" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" /><circle cx={236} cy={292} r={12} fill={INK} />
  </svg>; };
const Monitor = ({x, y, t, text, color = INK, press}: {x: number; y: number; t: number; text: string; color?: string; press?: boolean}) => <>
  <div style={{position: 'absolute', left: x - 30, top: y + 170, width: 60, height: 140, background: INK}} />
  <div style={{position: 'absolute', left: x - 260, top: y - 180, width: 520, height: 360, background: INK, borderRadius: 26}}>
    <div style={{position: 'absolute', left: 16, right: 16, top: 16, bottom: 16, background: '#fff', borderRadius: 14}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 50, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: text.length > 5 ? 78 : 130, color}}>{text}</div>
      <div style={{position: 'absolute', left: 140, right: 140, bottom: 34, height: 80, borderRadius: 18, background: press ? INK : '#fff', color: press ? '#fff' : INK, border: `6px solid ${INK}`, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46, textAlign: 'center', lineHeight: '68px'}}>SEND</div>
    </div>
  </div>
</>;
const BigFlag = ({x, y, w = 300}: {x: number; y: number; w?: number}) => <svg width={w} height={w * 0.55} viewBox="0 0 190 105" style={{position: 'absolute', left: x - w / 2, top: y}}>
  {Array.from({length: 7}, (_, i) => <rect key={i} x={0} y={i * 15} width={190} height={7.5} fill={RED} />)}
  <rect x={0} y={0} width={80} height={56} fill="#2C4A9E" />
  {Array.from({length: 12}, (_, i) => <circle key={i} cx={10 + (i % 4) * 20} cy={10 + Math.floor(i / 4) * 18} r={4} fill="#fff" />)}
  <rect x={0} y={0} width={190} height={105} fill="none" stroke={INK} strokeWidth={5} />
</svg>;
const Siren = ({t}: {t: number}) => { const r = Math.floor(t * 5) % 2 === 0;
  return <>
    <div style={{position: 'absolute', left: -400, top: -400, width: 940, height: 2800, background: r ? 'rgba(255,59,46,0.16)' : 'transparent'}} />
    <div style={{position: 'absolute', left: 540, top: -400, width: 940, height: 2800, background: !r ? 'rgba(46,111,255,0.16)' : 'transparent'}} />
  </>; };
const Fly = ({x1, y1, x2, y2, t, a, n = 6, w = 140}: {x1: number; y1: number; x2: number; y2: number; t: number; a: number; n?: number; w?: number}) => <>
  {Array.from({length: n}, (_, i) => { const p = cl((t - a - i * 0.08) / 0.55); if (p <= 0 || p >= 1) return null;
    return <Bill key={i} x={x1 + (x2 - x1) * p} y={y1 + (y2 - y1) * p - Math.sin(p * Math.PI) * 260} w={w} rot={p * 360} />; })}
</>;

// ---------- sets (one per idea; T = phrase index) ----------
const Intro = ({t}: {t: number}) => <>
  <Snow />
  <Penguin id="doug" x={540} y={SG} h={620} pose={{beak: 'smile', brows: 'happy', flapR: 70 + Math.sin(t * 8) * 25}} />
  <BigWord text="Doug" x={540} y={460} at={P(2)} size={190} />
</>;
const Job = ({t, until}: {t: number; until?: number}) => <>
  <Snow />
  <Desk911 t={t} ring />
  <Penguin id="doug" x={360} y={1060} h={460} pose={{beak: 'smile', brows: 'happy', mouth: Math.abs(Math.sin(t * 14)) * 0.6, look: [0.6, 0]}} />
  <Headset x={360} y={1060} h={460} />
  {until === undefined && <BigWord text="9-1-1" x={540} y={330} at={P(3) + 1.9} size={190} color={RED} />}
  {until === undefined && <BigWord text="emergency" x={540} y={330} at={P(3) + 0.3} until={P(3) + 1.9} size={130} />}
</>;
const Owe = ({t}: {t: number}) => <>
  <Snow />
  <IceBank x={300} y={SG} w={520} />
  <Fox x={330} y={SG} h={520} flip mouth={t > P(4) && t < P(4) + 1.2 ? 0.3 + 0.2 * Math.sin(t * 20) : 0} />
  <Penguin id="doug" x={820} y={SG} h={460} pose={{turn: -0.6, look: [-0.8, -0.1], flapL: 60, beak: 'smile'}} />
  <BigWord text="Fox the banker" x={540} y={360} at={P(4)} until={P(4) + 1.4} size={110} />
  <Paper x={620} y={720} w={300} title="FOX OWES DOUG" amount="$82" at={P(4) + 1.2} />
  <BigWord text="$82" x={540} y={360} at={P(4) + 1.6} size={190} color={GREEN} />
</>;
const Typing = ({t}: {t: number}) => {
  const slip = P(5) + 0.6, n = t < slip ? 82 : Math.round(82 + (1200000 - 82) * ease((t - slip) / 0.7));
  const press = t > P(6) + 0.3 && t < P(6) + 0.6;
  return <>
    <Snow />
    <Monitor x={640} y={760} t={t} text={`$${n.toLocaleString('en-US')}`} color={t < slip ? GREEN : RED} press={press} />
    <div style={{position: 'absolute', left: 380, top: 1150, width: 520, height: 60, background: '#fff', border: `6px solid ${INK}`, borderRadius: 12}} />
    <Fox x={230} y={SG} h={560} flip sly={t < slip ? 0.3 : 1} mouth={t > P(6) && t < P(6) + 0.9 ? 0.3 : 0} />
    {t >= slip && t < P(6) && <BigWord text="oops" x={300} y={420} at={slip} size={130} color={RED} />}
    {t >= P(6) && <Fly x1={640} y1={760} x2={1300} y2={500} t={t} a={P(6) + 0.4} n={8} />}
    {t >= P(6) && <BigWord text="SEND" x={640} y={370} at={P(6) + 0.3} size={150} />}
  </>;
};
const OpenApp = ({t}: {t: number}) => <>
  <Snow />
  <Penguin id="doug" x={300} y={SG} h={520} pose={{turn: 0.5, look: [0.8, -0.2], flapR: 60}} />
  <BankApp x={720} y={820} w={440} amount="$1,200,000" color={GREEN} buzz={t < P(7) + 0.4 ? Math.sin(t * 80) * 6 : 0} />
  <Sparkles x={720} y={500} t={t} />
</>;
const Blink = ({t}: {t: number}) => {
  const b = (t > P(8) + 0.15 && t < P(8) + 0.35) || (t > P(8) + 1.0 && t < P(8) + 1.2);
  return <>
    <Penguin id="doug" x={540} y={SG + 900} h={1500} pose={{lids: b ? 1 : 0, eyeScale: 1.3, look: [0, -0.2], brows: 'shock'}} />
    <BigWord text="blink" x={250} y={330} at={P(8) + 0.15} size={110} />
    <BigWord text="blink" x={820} y={430} at={P(8) + 1.0} size={110} />
  </>;
};
const FoxCall = ({t}: {t: number}) => <>
  <Snow />
  <Fox x={260} y={SG} h={520} flip mouth={0.3 + 0.25 * Math.abs(Math.sin(t * 16))} sly={0} />
  <div style={{position: 'absolute', left: 300, top: 860, width: 60, height: 110, background: INK, borderRadius: 12, transform: 'rotate(-20deg)'}} />
  <Penguin id="doug" x={830} y={SG} h={440} pose={{turn: -0.5, look: [-0.8, 0], brows: 'worried', flapL: 60}} />
  <BankApp x={680} y={1050} w={150} amount="" call="FOX" buzz={Math.sin(t * 80) * 4} />
  <Bubble text="MISTAKE!" x={330} y={330} at={P(9) + 0.6} t={t} w={460} size={72} tailX={-60} />
  <Bubble text="give fish back" x={600} y={560} at={P(9) + 1.2} t={t} w={520} size={60} tailX={-200} />
</>;
const Nothing = ({t}: {t: number}) => <>
  <Snow />
  <Penguin id="doug" x={540} y={SG} h={700} pose={{lids: 0.45, look: [0.5, 0], beak: 'flat'}} />
  <div style={{position: 'absolute', left: 470, top: 860, width: 140, height: 30, background: '#9AA3AB', border: `5px solid ${INK}`, borderRadius: 8, transform: 'rotate(-4deg)'}} />
  <BigWord text="..." x={820} y={480} at={P(10) + 0.3} size={220} />
</>;
const Move = ({t}: {t: number}) => {
  const x = lerp(-250, 1350, cl((t - P(11)) / 1.6));
  return <>
    <Snow />
    <IceBank x={880} y={SG} w={420} id="bank2" />
    <div style={{position: 'absolute', left: x - 330, top: 0}}>
      <div style={{position: 'absolute', left: 0, top: SG - 150, width: 330, height: 60, background: '#3D8BD8', border: `6px solid ${INK}`, borderRadius: 14}} />
    </div>
    <FishPile x={x - 165} y={SG - 145} n={6} w={120} />
    <Penguin id="doug" x={x + 60} y={SG} h={420} pose={{side: true, run: true, walk: t * 3, turn: 1, lean: 12}} />
    <SpeedLines x={x - 340} y={SG - 60} dir={1} h={300} />
    <BigWord text="FAST" x={540} y={420} at={P(11) + 0.9} size={200} color={RED} />
  </>;
};
const BuyHouse = ({t}: {t: number}) => <>
  <Snow />
  <House x={540} y={SG} w={760} />
  <Penguin id="doug" x={250} y={SG + 60} h={380} pose={{beak: 'smile', brows: 'happy', flapR: 110 + Math.sin(t * 8) * 15}} />
  <BigWord text="house" x={540} y={380} at={P(12)} size={160} />
</>;
const BuyCar = ({t}: {t: number}) => <>
  <Snow />
  <Car x={lerp(1500, 560, ease((t - P(13)) / 0.5))} y={SG} w={700} t={t} />
  <Sparkles x={560} y={900} t={t} />
  <Penguin id="doug" x={180} y={SG + 80} h={360} pose={{beak: 'smile', brows: 'happy', lids: 0.3, flapR: 110}} />
  <BigWord text="shiny car" x={540} y={400} at={P(13) + 0.6} size={150} />
</>;
const Good = ({t}: {t: number}) => <>
  <Snow />
  <House x={330} y={SG - 80} w={520} />
  <Car x={800} y={SG - 60} w={420} t={t} />
  <Penguin id="doug" x={540} y={SG + 120} h={420} outfit="rich" pose={{beak: 'smile', brows: 'happy', lids: 0.4, blush: 1, flapL: 120, flapR: 120}} />
  <BigWord text="life is good" x={540} y={380} at={P(14)} size={140} color={GREEN} />
  <Sparkles x={540} y={560} t={t} />
</>;
const Knock = ({t}: {t: number}) => {
  const k = P(15) + 1.05, shake = (t > k && t < k + 0.15) || (t > k + 0.3 && t < k + 0.45) ? Math.sin(t * 90) * 8 : 0;
  return <>
    <Snow />
    <div style={{position: 'absolute', left: 120 + shake, top: 330, width: 420, height: 970, background: '#7A4E2A', border: `9px solid ${INK}`, boxSizing: 'border-box'}}>
      <div style={{position: 'absolute', right: 40, top: 480, width: 46, height: 46, borderRadius: '50%', background: '#F2C230', border: `5px solid ${INK}`}} />
    </div>
    <Moose x={lerp(1350, 800, ease((t - P(15) - 0.2) / 0.5))} y={SG} h={760} mouth={0} angry={1} />
    <BigWord text="Sheriff Moose" x={540} y={250} at={P(15) + 0.4} until={k} size={110} />
    {t > k && <BigWord text="KNOCK KNOCK" x={330} y={250} at={k} size={100} color={RED} />}
  </>;
};
const Charges = ({t}: {t: number}) => <>
  <Snow />
  <Moose x={300} y={SG} h={720} flip angry={1} mouth={0.4} />
  <Penguin id="doug" x={830} y={SG} h={420} pose={{brows: 'worried', sweat: true, tremble: 1, eyeScale: 1.2, beak: 'frown', look: [-0.8, -0.2]}} />
  <Stamp text="THEFT" x={540} y={360} at={P(16)} color={RED} size={130} />
  <Stamp text="BANK FRAUD" x={540} y={600} at={P(16) + 0.6} color={RED} size={110} rot={8} />
</>;
const Fired = ({t}: {t: number}) => <>
  <Snow />
  <Desk911 t={t} dark />
  <Penguin id="doug" x={360} y={1060} h={460} pose={{brows: 'worried', beak: 'frown', lids: 0.3, look: [0.6, 0.2]}} />
  {t < P(17) + 0.4 && <Headset x={360} y={1060} h={460} />}
  {t >= P(17) + 0.4 && <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${(t - P(17) - 0.4) * 1400}px, ${-(t - P(17) - 0.4) * 900}px) rotate(${(t - P(17)) * 500}deg)`, transformOrigin: '360px 700px'}}><Headset x={360} y={1060} h={460} /></div>}
  <Stamp text="FIRED" x={540} y={360} at={P(17) + 0.4} color={RED} size={170} />
</>;
const Sue = ({t}: {t: number}) => <>
  <Snow />
  <Fox x={330} y={SG} h={600} flip mouth={0.3} sly={1} />
  <Paper x={720} y={760} w={360} title="LAWSUIT" amount="$1,200,000" at={P(18) + 0.2} rot={6} />
  <Stamp text="SUED" x={720} y={380} at={P(18) + 0.6} color={RED} size={150} />
</>;
const Poor = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', inset: -400, background: '#E9EDF0'}} />
  <Penguin id="doug" x={540} y={SG + 300} h={950} pose={{lids: 0.35, brows: 'worried', beak: 'frown', tears: true}} />
  <BigWord text="Doug poor." x={540} y={340} at={P(19)} size={150} color={RED} />
</>;
const Called = ({t}: {t: number}) => <Title lines={['BANK ERROR']} y={880} at={P(20) + 0.6} size={135} />;
const Gift = ({t}: {t: number}) => <>
  <Snow />
  <div style={{position: 'absolute', left: 340, top: 800, width: 400, height: 380, background: '#D83A2E', border: `8px solid ${INK}`, borderRadius: 16, boxSizing: 'border-box'}}>
    <div style={{position: 'absolute', left: 160, top: 0, width: 64, height: '100%', background: '#F2C230', borderLeft: `6px solid ${INK}`, borderRight: `6px solid ${INK}`}} />
  </div>
  <div style={{position: 'absolute', left: 310, top: 720, width: 460, height: 100, background: '#D83A2E', border: `8px solid ${INK}`, borderRadius: 16, boxSizing: 'border-box'}} />
  <BankApp x={540} y={640} w={150} amount="$1.2M" color={GREEN} />
  <BigWord text="✗" x={540} y={950} at={P(21) + 0.7} size={560} color={RED} rot={0} />
  <BigWord text="not a gift" x={540} y={330} at={P(21) + 0.7} size={150} color={RED} />
</>;
const RealLife = ({t}: {t: number}) => <>
  <BigWord text="real life" x={540} y={360} at={P(22)} size={130} />
  <BigFlag x={540} y={500} w={360} />
  <BigWord text="LOUISIANA" x={540} y={870} at={P(22) + 0.9} size={150} color="#2C4A9E" rot={0} />
  <BigWord text="2021" x={540} y={1100} at={P(22) + 1.9} size={190} color={RED} />
</>;
const Woman = ({t}: {t: number}) => <>
  <BigWord text="should get" x={540} y={300} at={P(23)} size={90} />
  <BigWord text="$82" x={540} y={470} at={P(23) + 0.2} size={200} color={GREEN} rot={0} />
  <BigWord text="got" x={540} y={720} at={P(23) + 0.8} size={90} />
  <BigWord text="$1,200,000" x={540} y={900} at={P(23) + 0.9} size={170} color={RED} rot={0} />
  {t > P(23) + 0.9 && <Sparkles x={540} y={1120} t={t} />}
  <div style={{position: 'absolute', left: 0, right: 0, top: 1340, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 34, color: '#888'}}>Charles Schwab transfer error, Louisiana 2021 (news reports)</div>
</>;
const Bought = ({t}: {t: number}) => <>
  <Snow />
  <House x={300} y={SG} w={480} />
  <Car x={800} y={SG} w={440} t={t} />
  <BigWord text="✓" x={300} y={620} at={P(24) + 0.5} size={200} color={GREEN} rot={0} />
  <BigWord text="✓" x={800} y={860} at={P(24) + 1.1} size={200} color={GREEN} rot={0} />
  <BigWord text="house + car" x={540} y={360} at={P(24) + 0.5} size={130} />
</>;
const Arrested = ({t}: {t: number}) => <>
  <Siren t={t} />
  <Snow />
  <svg width={520} height={300} viewBox="0 0 260 150" style={{position: 'absolute', left: 280, top: 700}}>
    <circle cx={70} cy={75} r={55} fill="none" stroke="#9AA3AB" strokeWidth={18} /><circle cx={70} cy={75} r={55} fill="none" stroke={INK} strokeWidth={4} />
    <circle cx={190} cy={75} r={55} fill="none" stroke="#9AA3AB" strokeWidth={18} /><circle cx={190} cy={75} r={55} fill="none" stroke={INK} strokeWidth={4} />
    <rect x={118} y={66} width={24} height={18} fill="#9AA3AB" stroke={INK} strokeWidth={4} />
  </svg>
  <Stamp text="ARRESTED" x={540} y={420} at={P(25) + 0.3} color={RED} size={140} />
</>;
const Callback = ({t}: {t: number}) => <Job t={t} until={1} />;
const Emergency = ({t}: {t: number}) => <>
  <Siren t={t} />
  <Snow />
  <Moose x={300} y={SG} h={700} flip angry={1} cuffs />
  <Penguin id="doug" x={790} y={SG} h={460} pose={{brows: 'shock', eyeScale: 1.3, beak: 'frown', sweat: true, tremble: 1, look: [-0.8, -0.2]}} />
  <BigWord text="EMERGENCY" x={540} y={360} at={P(27) + 0.6} size={115} color={RED} />
</>;
const Ask = ({t}: {t: number}) => <>
  <Snow />
  <Penguin id="doug" x={540} y={SG} h={480} pose={{look: [0, -0.6], brows: 'worried', flapR: 90}} />
  {[['GIVE IT BACK', GREEN, 280], ['KEEP IT', RED, 800]].map(([txt, c, x], i) => { const p = ease((t - P(28) - 0.2 - i * 0.3) / 0.25);
    return <div key={i} style={{position: 'absolute', left: (x as number) - 210, top: 500, width: 420, height: 170, background: c as string, border: `7px solid ${INK}`, borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 48, color: '#fff', transform: `scale(${p}) rotate(${i ? 3 : -3}deg)`}}>{txt}</div>; })}
  <BigWord text="be honest" x={540} y={330} at={P(28) + 1.2} size={110} />
</>;
const Cta = ({t}: {t: number}) => <>
  <Snow />
  <Penguin id="doug" x={540} y={SG} h={560} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <BigWord text="comments" x={540} y={380} at={P(29)} size={150} />
  <BigWord text="👇" x={800} y={700} at={P(29) + 0.3} size={160} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(2), set: (t) => <Intro t={t} />, fx_: 'zoom'},
  {at: P(3), set: (t) => <Job t={t} />, fx_: 'swipe'},
  {at: P(4), set: (t) => <Owe t={t} />, fx_: 'swipeL'},
  {at: P(5), set: (t) => <Typing t={t} />, fx_: 'zoom'},
  {at: P(7), set: (t) => <OpenApp t={t} />, fx_: 'swipe'},
  {at: P(8), set: (t) => <Blink t={t} />, fx_: 'pop'},
  {at: P(9), set: (t) => <FoxCall t={t} />, fx_: 'swipeL'},
  {at: P(10), set: (t) => <Nothing t={t} />, fx_: 'zoom'},
  {at: P(11), set: (t) => <Move t={t} />, fx_: 'swipe'},
  {at: P(12), set: (t) => <BuyHouse t={t} />, fx_: 'pop'},
  {at: P(13), set: (t) => <BuyCar t={t} />, fx_: 'swipeL'},
  {at: P(14), set: (t) => <Good t={t} />, fx_: 'zoom'},
  {at: P(15), set: (t) => <Knock t={t} />, fx_: 'iris'},
  {at: P(16), set: (t) => <Charges t={t} />, fx_: 'pop'},
  {at: P(17), set: (t) => <Fired t={t} />, fx_: 'swipe'},
  {at: P(18), set: (t) => <Sue t={t} />, fx_: 'swipeL'},
  {at: P(19), set: (t) => <Poor t={t} />, fx_: 'zoom'},
  {at: P(20), set: (t) => <Called t={t} />, fx_: 'iris'},
  {at: P(21), set: (t) => <Gift t={t} />, fx_: 'pop'},
  {at: P(22), set: (t) => <RealLife t={t} />, fx_: 'swipe'},
  {at: P(23), set: (t) => <Woman t={t} />, fx_: 'zoom'},
  {at: P(24), set: (t) => <Bought t={t} />, fx_: 'swipeL'},
  {at: P(25), set: (t) => <Arrested t={t} />, fx_: 'pop'},
  {at: P(26), set: (t) => <Callback t={t} />, fx_: 'swipe'},
  {at: P(27), set: (t) => <Emergency t={t} />, fx_: 'zoom'},
  {at: P(28), set: (t) => <Ask t={t} />, fx_: 'iris'},
  {at: P(29), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[4, 560, 760, 1.2], [6, 640, 760, 1.25], [8, 540, 760, 1.25], [10, 540, 760, 1.3], [19, 540, 700, 1.25], [27, 620, 820, 1.15]];

export const DougBankError = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) [s, fx, fy] = cam(tc);
  else {
    const dz = DEEP.find(([i]) => tc >= P(i) && tc < TIM[i].end + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
    if (dz) { s += (dz[3] - s) * dp; fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
    s *= beat(tc, TIM);
  }
  const ht = ease(tc / 0.25);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    {/* hook title on top (screen space); the spoken hook line has no caption so the words are not repeated */}
    {tc < P(2) && <div style={{position: 'absolute', left: 0, right: 0, top: 110, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 120, lineHeight: '130px', color: INK, transform: `scale(${0.6 + 0.4 * ht})`, opacity: ht}}>
      WHAT HAPPENS<span style={{color: RED}}>?</span></div>}
    <Captions t={tc} phrases={TIM.slice(1)} />
    <Audio src={staticFile('doug-bank-error-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={BANK} name="user-pop" vol={0.3} />
    <Sfx at={SENDW} name="user-whoosh" vol={0.3} />
    <Sfx at={ONE} name="user-cash-register" vol={0.45} />
    <Sfx at={MILLION} name="user-money" vol={0.35} />
    <Sfx at={LAND} name="user-money-transfer" vol={0.4} />
    <Sfx at={MISTAKE} name="user-shock" vol={0.4} />
    <Sfx at={EIGHTY2} name="ding" vol={0.45} />
    <Sfx at={P(2)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(3) + 0.3} name="user-notif" vol={0.35} />
    <Sfx at={P(3) + 1.9} name="user-boom" vol={0.35} />
    <Sfx at={P(4) + 1.6} name="ding" vol={0.4} />
    <Sfx at={P(5) + 0.6} name="user-wrong" vol={0.35} />
    <Sfx at={P(6) + 0.3} name="user-pop" vol={0.35} />
    <Sfx at={P(6) + 0.4} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(7)} name="user-cash-register" vol={0.4} />
    <Sfx at={P(7) + 0.4} name="user-wow" vol={0.35} />
    <Sfx at={P(8) + 0.15} name="user-pop" vol={0.3} />
    <Sfx at={P(8) + 1.0} name="user-pop" vol={0.3} />
    <Sfx at={P(9)} name="user-notif2" vol={0.35} />
    <Sfx at={P(9) + 0.6} name="user-wrong" vol={0.3} />
    <Sfx at={P(10) + 0.3} name="user-horn" vol={0.25} />
    <Sfx at={P(11)} name="swoosh-fast" vol={0.35} />
    <Sfx at={P(11) + 0.9} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(12)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(13)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(14)} name="user-yeah" vol={0.4} />
    <Sfx at={P(15) + 1.05} name="user-slap" vol={0.4} />
    <Sfx at={P(15) + 1.35} name="user-slap" vol={0.4} />
    <Sfx at={P(16)} name="user-boom" vol={0.4} />
    <Sfx at={P(16) + 0.6} name="user-boom" vol={0.4} />
    <Sfx at={P(17) + 0.4} name="user-slap" vol={0.35} />
    <Sfx at={P(18) + 0.6} name="user-wrong" vol={0.35} />
    <Sfx at={P(19)} name="user-fahh" vol={0.45} />
    <Sfx at={P(20) + 0.6} name="user-ting" vol={0.35} />
    <Sfx at={P(21) + 0.7} name="user-wrong" vol={0.35} />
    <Sfx at={P(22)} name="user-pop" vol={0.3} />
    <Sfx at={P(22) + 1.9} name="ding" vol={0.35} />
    <Sfx at={P(23) + 0.2} name="ding" vol={0.4} />
    <Sfx at={P(23) + 0.9} name="user-cash-register" vol={0.4} />
    <Sfx at={P(24) + 0.5} name="user-money" vol={0.3} />
    <Sfx at={P(24) + 1.1} name="user-money" vol={0.3} />
    <Sfx at={P(25) + 0.3} name="user-boom" vol={0.45} />
    <Sfx at={P(26)} name="user-notif" vol={0.3} />
    <Sfx at={P(27) + 0.6} name="user-shock" vol={0.45} />
    <Sfx at={P(28) + 0.2} name="user-pop" vol={0.3} />
    <Sfx at={P(28) + 0.5} name="user-pop" vol={0.3} />
    <Sfx at={P(29)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
