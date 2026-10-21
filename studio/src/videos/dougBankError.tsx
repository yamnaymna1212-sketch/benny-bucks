// EP7 "Bank Error" — should get $82 vs got $1,200,000 (real story: Louisiana 2021). Hook first (approval), full episode after.
// Line timings: studio/src/data/doug-bank-error.json (free Kokoro am_michael VO, one line per phrase).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Captions, Sfx, beat} from '../penguin/edit';
import {IceBank, Thought} from '../penguin/world';
import {Bill, Fox} from './dougLaundering';
import TIM from '../data/doug-bank-error.json';

const P = (i: number) => TIM[i].start;
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
const Phone = ({t, y}: {t: number; y: number}) => {
  const got = ease((t - LAND) / 0.2), buzz = t > LAND && t < LAND + 0.4 ? Math.sin(t * 80) * 5 : 0;
  return <div style={{position: 'absolute', left: B1[0] - 105 + buzz, top: y - 195, width: 210, height: 390, background: INK, borderRadius: 32}}>
    <div style={{position: 'absolute', left: 11, right: 11, top: 11, bottom: 11, background: '#fff', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', left: '50%', top: 12, width: 54, height: 13, marginLeft: -27, borderRadius: 7, background: INK}} />
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: GREEN, transform: `scale(${got})`}}>+$1,200,000</div>
    </div>
  </div>;
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

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
];

export const DougBankError = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s = 1, fx = 540, fy = 960;
  if (sh.at === 0) [s, fx, fy] = cam(tc);
  else s = beat(tc, TIM);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-bank-error-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={BANK} name="user-pop" vol={0.3} />
    <Sfx at={SENDW} name="user-whoosh" vol={0.3} />
    <Sfx at={ONE} name="user-cash-register" vol={0.45} />
    <Sfx at={MILLION} name="user-money" vol={0.35} />
    <Sfx at={LAND} name="user-money-transfer" vol={0.4} />
    <Sfx at={MISTAKE} name="user-shock" vol={0.4} />
    <Sfx at={EIGHTY2} name="ding" vol={0.45} />
  </AbsoluteFill>;
};
