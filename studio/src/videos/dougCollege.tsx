// EP8 "College Explained by Doug" — private US college $45,000/yr vs Germany public university ~$0 (same degree). HOOK ONLY so far.
// Line timings: studio/src/data/doug-college.json (Kokoro VO am_liam).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {BigWord} from '../penguin/world';
import {cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {GREEN, RED, UsFlag, Vs, Why} from './dougVenezuela';
import TIM from '../data/doug-college.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_COLLEGE_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const MONT = 'Montserrat';

const DeFlag = () => <g>
  <rect width={190} height={40} fill="#111" /><rect y={40} width={190} height={40} fill="#DD0000" /><rect y={80} width={190} height={40} fill="#FFCE00" />
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
</g>;
const Flag = ({x, y, w = 240, flag}: {x: number; y: number; w?: number; flag: 'us' | 'de'}) =>
  <svg width={w} height={w * 0.632} viewBox="0 0 190 120" style={{position: 'absolute', left: x - w / 2, top: y}}>{flag === 'us' ? <UsFlag /> : <DeFlag />}</svg>;
const Name = ({text, x, y, size = 76}: {text: string; x: number; y: number; size?: number}) =>
  <div style={{position: 'absolute', left: x - 270, width: 540, top: y, textAlign: 'center', fontFamily: MONT, fontWeight: 900, fontSize: size, color: INK}}>{text}</div>;
const PriceCard = ({text, x, y, color, at, t, tilt = 0, w = 410, h = 190, size = 98}: {text: string; x: number; y: number; color: string; at: number; t: number; tilt?: number; w?: number; h?: number; size?: number}) => {
  const p = ease((t - at) / 0.3); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x - w / 2, width: w, top: y, height: h, borderRadius: 32, background: color, border: `9px solid ${INK}`, boxShadow: `0 12px 0 ${INK}`, boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: MONT, fontWeight: 900, fontSize: size, color: '#fff', letterSpacing: -3, whiteSpace: 'nowrap',
    transform: `scale(${0.5 + 0.5 * p}) rotate(${tilt}deg)`}}>{text}</div>;
};
// Graduation cap + diploma scroll (identical on both sides = "same degree").
const Grad = ({x, y, w = 300, rot = 0}: {x: number; y: number; w?: number; rot?: number}) =>
  <svg width={w} height={w * 0.95} viewBox="0 0 300 285" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.95, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
    <path d="M150 20 L290 80 L150 140 L10 80 Z" fill="#2B2F36" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M70 112 L70 170 Q150 215 230 170 L230 112 L150 140 Z" fill="#3A404A" stroke={INK} strokeWidth={8} strokeLinejoin="round" />
    <path d="M150 80 L262 96 L262 170" fill="none" stroke="#F5C518" strokeWidth={8} strokeLinecap="round" /><circle cx={262} cy={178} r={13} fill="#F5C518" stroke={INK} strokeWidth={5} />
    <rect x={60} y={205} width={180} height={64} rx={30} fill="#FBF3D5" stroke={INK} strokeWidth={8} />
    <rect x={128} y={205} width={44} height={64} fill="#D83A2E" stroke={INK} strokeWidth={6} />
  </svg>;
const Note = ({text, x, y}: {text: string; x: number; y: number}) =>
  <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 38, color: '#777'}}>{text}</div>;

// ---------- hook (clean versus layout) ----------
const DE = () => P(1);
const Hook = ({t}: {t: number}) => {
  const lookR = t >= DE();
  return <>
    <div style={{position: 'absolute', inset: 0, transform: 'translateY(-175px) scale(0.92)', transformOrigin: '50% 0'}}><Why t={t} /></div>
    <Flag x={250} y={395} flag="us" /><Flag x={830} y={395} flag="de" />
    <Name text="USA" x={250} y={555} /><Name text="GERMANY" x={830} y={555} size={66} />
    <PriceCard text="$45,000" x={235} y={670} color={RED} at={0.3} t={t} tilt={-3} />
    <PriceCard text="~$0" x={845} y={670} color={GREEN} at={DE() + 0.3} t={t} tilt={3} size={130} />
    <Vs x={540} y={765} t={t} />
    <Note text="per year · private college" x={250} y={900} /><Note text="public university" x={830} y={900} />
    <Grad x={230} y={1500} w={300} rot={Math.sin(t * 3) * 1.5} /><Grad x={850} y={1500} w={300} rot={-Math.sin(t * 3) * 1.5} />
    <Penguin id="doug" x={540} y={1490} h={380} pose={{turn: lookR ? 0.5 : -0.5, look: [lookR ? 0.8 : -0.8, -0.3], brows: lookR ? 'shock' : 'worried', eyeScale: lookR ? 1.25 : 1.05, pupil: lookR ? 0.5 : 1, beak: 'frown', flapR: 35, flapL: 35, sweat: lookR}} />
  </>;
};
const Same = ({t}: {t: number}) => <>
  <Grad x={260} y={1150} w={400} /><Grad x={820} y={1150} w={400} />
  <BigWord text="=" x={540} y={780} at={P(2)} size={260} color={INK} rot={0} />
  <BigWord text="same degree" x={540} y={300} at={P(2)} until={P(3)} size={130} color={RED} />
  {t >= P(3) && <><Penguin id="doug" x={540} y={1500} h={520} pose={{beak: 'flat', brows: 'worried', eyeScale: 1.2, look: [0, 0.3], flapL: 40, flapR: 40}} />
    <BigWord text="same Doug" x={540} y={300} at={P(3)} size={130} color={RED} /></>}
</>;

const SHOTS: {at: number; set: (t: number) => React.ReactNode; fx_?: string}[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(2), set: (t) => <Same t={t - P(2)} />, fx_: 'zoom'},
];

export const DougCollege = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // push toward the side being named (USA, then Germany), back out on "Same degree"
    const toUS = ease((tc - 1.0) / 0.6) * (tc < DE() ? 1 : 0), toDE = ease((tc - DE()) / 0.5) * (tc < P(2) ? 1 : 0);
    s0 = 1 + 0.18 * (toUS + toDE); fx = 540 - 230 * toUS + 230 * toDE; fy = 960 + 40 * (toUS + toDE);
  }
  const s = s0 * (tc < 1.0 ? 1 : beat(tc, TIM));
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-college-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.3} name="user-cash-register" vol={0.3} />
    <Sfx at={DE()} name="user-boom" vol={0.45} />
    <Sfx at={P(2)} name="user-slap" vol={0.35} />
  </AbsoluteFill>;
};
