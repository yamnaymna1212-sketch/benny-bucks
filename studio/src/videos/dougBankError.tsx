// EP7 "Bank Error" — should get $82 vs got $1,200,000 (real story: Louisiana 2021). Hook first (approval), full episode after.
// Line timings: studio/src/data/doug-bank-error.json (free Kokoro am_michael VO, one line per phrase).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-bank-error.json';

const P = (i: number) => TIM[i].start;
export const DOUG_BANK_ERROR_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1460;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';

// word timings inside the hook lines (syllable estimate on the Kokoro take)
const MILLION = P(0) + 1.85, MISTAKE = P(0) + 3.6, EIGHTY2 = P(1) + 0.75;

// ---------- hook props ----------
const UsFlag = ({x, y, w = 90}: {x: number; y: number; w?: number}) =>
  <svg width={w} height={w * 0.55} viewBox="0 0 190 105" style={{position: 'absolute', left: x, top: y}}>
    {Array.from({length: 7}, (_, i) => <rect key={i} x={0} y={i * 15} width={190} height={7.5} fill={RED} />)}
    <rect x={0} y={0} width={190} height={105} fill="none" stroke={INK} strokeWidth={6} />
    <rect x={0} y={0} width={80} height={56} fill="#2C4A9E" stroke={INK} strokeWidth={4} />
    {Array.from({length: 9}, (_, i) => <circle key={i} cx={14 + (i % 3) * 26} cy={12 + Math.floor(i / 3) * 16} r={4} fill="#fff" />)}
  </svg>;
// Big price board: label on top, number below; `kick` = punch time (spoken word).
const Board = ({x, y, label, value, color, t, at, kick}: {x: number; y: number; label: string; value: string; color: string; t: number; at: number; kick: number}) => {
  const p = ease((t - at) / 0.2), k = t > kick ? Math.sin(cl((t - kick) / 0.3) * Math.PI) * 0.14 : 0;
  return <div style={{position: 'absolute', left: x - 235, top: y, width: 470, height: 330, transform: `scale(${p * (1 + k)}) rotate(${color === RED ? 2 : -2}deg)`, opacity: p > 0 ? 1 : 0}}>
    <div style={{position: 'absolute', inset: 0, background: '#fff', border: `9px solid ${color}`, borderRadius: 30, boxShadow: `0 10px 0 ${INK}`}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: INK}}>{label}</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: value.length > 5 ? 76 : 150, lineHeight: '150px', color}}>{value}</div>
  </div>;
};
const Vs = ({x, y, t}: {x: number; y: number; t: number}) => {
  const p = ease((t - 0.3) / 0.25);
  return <div style={{position: 'absolute', left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 66, color: '#fff', transform: `scale(${p}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>;
};
// Bank app phone: header with US flag, balance counts 0 -> 1,200,000 on "million", red "deposit" banner.
const Phone = ({x, y, w = 330, t}: {x: number; y: number; w?: number; t: number}) => {
  const h = w * 1.9, c = ease((t - MILLION) / 0.5), bal = Math.round(82 + (1200000 - 82) * c);
  const shown = t < MILLION ? '$0.00' : `$${bal.toLocaleString('en-US')}.00`;
  const ban = ease((t - MILLION - 0.1) / 0.2);
  return <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: h}}>
    <div style={{position: 'absolute', inset: 0, background: INK, borderRadius: 46}} />
    <div style={{position: 'absolute', left: 16, right: 16, top: 16, bottom: 16, background: '#F4F9FC', borderRadius: 34, overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 0, height: 120, background: '#1F5FAF', borderBottom: `5px solid ${INK}`}}>
        <UsFlag x={20} y={38} w={84} />
        <div style={{position: 'absolute', left: 116, top: 36, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 42, color: '#fff'}}>BANK</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 170, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 800, fontSize: 30, color: '#6B7C8C'}}>BALANCE</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 215, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: shown.length > 9 ? 40 : 58, color: t < MILLION ? INK : RED}}>{shown}</div>
      <div style={{position: 'absolute', left: 20, right: 20, top: 320, height: 120, background: '#fff', border: `5px solid ${INK}`, borderRadius: 20, transform: `scale(${ban})`}}>
        <div style={{textAlign: 'center', marginTop: 14, fontFamily: 'Montserrat', fontWeight: 800, fontSize: 24, color: '#6B7C8C'}}>DEPOSIT</div>
        <div style={{textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 38, color: RED}}>+$1,200,000</div>
      </div>
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 30, right: 30, top: 480 + i * 34, height: 16, background: '#DCE6EE', borderRadius: 8}} />)}
    </div>
  </div>;
};

const Hook = ({t}: {t: number}) => {
  // Doug: happy hops on "million", then freezes in shock on "mistake"
  const jumping = t > MILLION && t < MISTAKE, hop = jumping ? Math.abs(Math.sin((t - MILLION) * 7)) * 110 : 0;
  const frozen = t >= MISTAKE, wait = t >= P(1);
  const pose = frozen
    ? {brows: 'shock' as const, eyeScale: 1.45, beak: 'frown' as const, flapR: 70, flapL: 40, look: [0.6, wait ? -0.9 : -0.2] as [number, number], tremble: 0.4, sweat: true}
    : jumping ? {brows: 'happy' as const, beak: 'smile' as const, flapR: 70, flapL: 150 + Math.sin(t * 14) * 15, hop, look: [0.6, -0.2] as [number, number]}
    : {flapR: 70, look: [0.6, -0.1] as [number, number], beak: 'flat' as const};
  return <>
    <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
    <Board x={275} y={170} label="SHOULD GET" value="$82" color={GREEN} t={t} at={5 / FPS} kick={EIGHTY2} />
    <Board x={805} y={170} label="GOT" value="$1,200,000" color={RED} t={t} at={9 / FPS} kick={MILLION} />
    <Vs x={540} y={520} t={t} />
    <Penguin id="doug" x={330} y={G} h={560} pose={pose} />
    <Phone x={720} y={640 - hop * (560 / 520)} t={t} />
    {frozen && <div style={{position: 'absolute', left: 150, top: 760 + Math.sin(t * 6) * 8, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 130, color: INK, transform: 'rotate(-12deg)'}}>?</div>}
  </>;
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
  if (sh.at === 0) { // first second wide, push to the red $1.2M side on "million", swing to the green $82 on "eighty two"
    const toR = ease((tc - MILLION) / 0.35) * (tc < EIGHTY2 ? 1 : 0), toG = ease((tc - EIGHTY2) / 0.35);
    s = 1 + 0.12 * toR + 0.12 * toG; fx = 540 + 120 * toR - 120 * toG; fy = 960 - 120 * toR - 120 * toG;
    s *= tc < 1.0 ? 1 : beat(tc, TIM);
  }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-bank-error-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={5 / FPS} name="user-pop" vol={0.3} />
    <Sfx at={MILLION} name="user-cash-register" vol={0.45} />
    <Sfx at={MILLION + 0.3} name="penguin-squawk" vol={0.3} />
    <Sfx at={MISTAKE} name="user-shock" vol={0.4} />
    <Sfx at={EIGHTY2} name="ding" vol={0.45} />
  </AbsoluteFill>;
};
