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
const G = 1420, TOP = 820; // TOP = bank floor (sender), G = Doug's floor (receiver)
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';

// word timings inside the hook lines (syllable estimate on the Kokoro take)
const MILLION = P(0) + 1.85, SEND = MILLION + 0.15, LAND = SEND + 0.65, MISTAKE = P(0) + 3.6, EIGHTY2 = P(1) + 0.75;

// ---------- hook: Fox types $82, paw slips -> $1,200,000, SEND, bills fly into Doug's phone ----------
const MX = 820, MY = 560; // monitor screen centre
const PX = 700, PY = 1120; // Doug's phone centre
const typed = (t: number) => {
  if (t < 0.35) return '$';
  if (t < 0.6) return '$8';
  if (t < 1.1) return '$82';
  const n = Math.round(82 + (1200000 - 82) * ease((t - 1.1) / (MILLION - 1.1)));
  return `$${n.toLocaleString('en-US')}`;
};
const Monitor = ({t}: {t: number}) => {
  const wrong = t >= 1.1, sh = wrong && t < MILLION + 0.3 ? Math.sin(t * 60) * 4 : 0, push = t > SEND && t < SEND + 0.25;
  return <>
    <div style={{position: 'absolute', left: MX - 25, top: MY + 110, width: 50, height: 120, background: INK}} />
    <div style={{position: 'absolute', left: MX - 200, top: MY + 225, width: 400, height: 40, background: '#fff', border: `6px solid ${INK}`, borderRadius: 10}} />
    <div style={{position: 'absolute', left: MX - 190, top: MY - 130 + sh, width: 380, height: 260, background: INK, borderRadius: 22}}>
      <div style={{position: 'absolute', left: 14, right: 14, top: 14, bottom: 14, background: '#fff', borderRadius: 12}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: wrong ? 56 : 90, color: wrong ? RED : INK}}>{typed(t)}</div>
        <div style={{position: 'absolute', left: 90, right: 90, bottom: 26, height: 64, borderRadius: 14, background: push ? INK : '#fff', color: push ? '#fff' : INK, border: `5px solid ${INK}`, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, textAlign: 'center', lineHeight: '54px'}}>SEND</div>
      </div>
    </div>
  </>;
};
const Phone = ({t, y}: {t: number; y: number}) => {
  const got = ease((t - LAND) / 0.2), buzz = t > LAND && t < LAND + 0.4 ? Math.sin(t * 80) * 5 : 0;
  return <div style={{position: 'absolute', left: PX - 140 + buzz, top: y - 230, width: 280, height: 460, background: INK, borderRadius: 40}}>
    <div style={{position: 'absolute', left: 14, right: 14, top: 14, bottom: 14, background: '#fff', borderRadius: 30, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{position: 'absolute', left: '50%', top: 14, width: 70, height: 16, marginLeft: -35, borderRadius: 8, background: INK}} />
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 38, color: GREEN, transform: `scale(${got})`, textAlign: 'center', lineHeight: 1.1}}>+$1,200,000</div>
    </div>
  </div>;
};
const Hook = ({t}: {t: number}) => {
  const jumping = t > LAND && t < MISTAKE, hop = jumping ? Math.abs(Math.sin((t - LAND) * 7)) * 90 : 0;
  const frozen = t >= MISTAKE;
  const pose = frozen
    ? {brows: 'shock' as const, eyeScale: 1.5, beak: 'frown' as const, flapR: 60, flapL: 20, look: [0.5, -0.1] as [number, number], tremble: 0.4}
    : jumping ? {brows: 'happy' as const, beak: 'smile' as const, flapR: 60, flapL: 150 + Math.sin(t * 14) * 15, hop, look: [0.5, -0.1] as [number, number]}
    : {flapR: 60, look: [t < SEND ? -0.6 : 0.5, -0.1] as [number, number]};
  const typing = t > 0.25 && t < SEND + 0.1;
  return <>
    <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: '#F2F8FC', borderTop: `5px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 30, width: 1020, top: TOP, height: 16, background: INK, borderRadius: 8}} />
    <IceBank x={190} y={TOP} w={340} />
    <Fox x={480} y={TOP} h={420} flip mouth={t > MILLION && t < MILLION + 0.6 ? 0.6 : 0} sly={typing ? 0.2 : 1} />
    <Monitor t={t} />
    {t > SEND && t < LAND + 0.1 && [0, 1, 2, 3, 4].map((i) => { const p = cl((t - SEND - i * 0.06) / 0.5);
      return p > 0 && p < 1 ? <Bill key={i} x={MX + (PX - MX) * p} y={MY + (PY - MY) * p - Math.sin(p * Math.PI) * 330} w={130} rot={p * 400} /> : null; })}
    <Penguin id="doug" x={420} y={G} h={520} pose={pose} />
    <Phone t={t} y={PY - hop} />
    <Thought x={190} y={1000} w={290} tx={320} ty={1110} at={EIGHTY2 - 0.15}>
      <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 92, color: INK}}>$82</div>
    </Thought>
  </>;
};
// light camera: one main element at a time [time, scale, focusX, focusY]
const CAM: [number, number, number, number][] = [
  [0, 1.1, 540, 880], [0.5, 1.3, 660, 600], [SEND, 1.3, 660, 600], [SEND + 0.35, 1.05, 560, 860],
  [LAND, 1.25, 600, 1080], [MISTAKE, 1.25, 600, 1080], [MISTAKE + 0.25, 1.4, 470, 1060], [EIGHTY2 - 0.4, 1.4, 470, 1060], [EIGHTY2, 1.2, 420, 1060],
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
    {[0.35, 0.6, 1.1, 1.25, 1.4, 1.55].map((x, i) => <Sfx key={i} at={x} name="user-pop" vol={0.2} />)}
    <Sfx at={MILLION} name="user-cash-register" vol={0.45} />
    <Sfx at={SEND} name="user-whoosh" vol={0.35} />
    <Sfx at={LAND} name="user-money-transfer" vol={0.4} />
    <Sfx at={LAND + 0.2} name="penguin-squawk" vol={0.3} />
    <Sfx at={MISTAKE} name="user-shock" vol={0.4} />
    <Sfx at={EIGHTY2} name="ding" vol={0.45} />
  </AbsoluteFill>;
};
