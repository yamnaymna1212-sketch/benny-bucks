// EP10 "How Poor vs Rich Doug use debt" — hook in the user's reference style (big title, POOR red / RICH green,
// both sides = Doug, VERSUS pole in the middle, -$1,800 under poor, PAID +$3,000 under rich, all visible from frame 0).
// Hook first (approval), full episode after the voice. Timings below are placeholders until the VO exists.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HAND, HandFont} from '../base';
import {Fish, INK, Penguin, onTwos} from '../penguin/rig';
import {Sfx} from '../penguin/edit';

export const DOUG_DEBT_HOOK_SECONDS = 5;
const G = 1170;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';
// hook beats (placeholder until the voice): poor side named, rich side named, both again
const POOR_AT = 1.1, RICH_AT = 2.7, BOTH_AT = 4.1;

// Hand-written word with a white outline so it reads on any background.
const Word = ({text, color = INK, size}: {text: string; color?: string; size: number}) =>
  <span style={{color, WebkitTextStroke: `${size * 0.03}px ${color}`}}>{text}</span>;

// Big title, fully visible on frame 0 (TikTok thumbnail), with a soft wobble afterwards.
const HookTitle = ({t}: {t: number}) => {
  return <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: HAND, fontWeight: 700, color: INK, whiteSpace: 'nowrap',
    transform: `rotate(${Math.sin(t * 2) * 0.6}deg)`}}>
    <div style={{fontSize: 92, lineHeight: '112px'}}><Word text="HOW " size={92} /><Word text="POOR" color={RED} size={92} /><Word text=" VS " size={92} /><Word text="RICH" color={GREEN} size={92} /></div>
    <div style={{fontSize: 124, lineHeight: '140px'}}><Word text="DOUG USE " size={124} /><Word text="DEBT" color={RED} size={124} /></div>
  </div>;
};

// Side label (POOR / RICH) with a scribbled underline that re-draws when that side is named.
const SideLabel = ({text, x, y, color, t, at}: {text: string; x: number; y: number; color: string; t: number; at: number}) => {
  const hit = t >= at && t < at + 0.25 ? 1 + 0.18 * Math.sin(((t - at) / 0.25) * Math.PI) : 1;
  const draw = t < at ? 1 : ease((t - at) / 0.35);
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', transform: `scale(${hit}) rotate(-3deg)`}}>
    <div style={{fontFamily: HAND, fontWeight: 700, fontSize: 130, lineHeight: '130px', color, WebkitTextStroke: `5px ${color}`, letterSpacing: 4}}>{text}</div>
    <svg width={400} height={40} viewBox="0 0 400 40" style={{overflow: 'visible'}}>
      <path d="M20 22 Q 120 34, 210 20 T 380 18" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
    </svg>
  </div>;
};

// Credit card held in front of Doug's belly.
const Card = ({x, y, color, t, shake = 0}: {x: number; y: number; color: string; t: number; shake?: number}) =>
  <svg width={230} height={146} viewBox="0 0 230 146" style={{position: 'absolute', left: x - 115 + Math.sin(t * 60) * shake, top: y - 73, overflow: 'visible', transform: 'rotate(-4deg)'}}>
    <rect x={4} y={4} width={222} height={138} rx={18} fill={color} stroke={INK} strokeWidth={7} />
    <rect x={26} y={40} width={44} height={34} rx={6} fill="#F5C518" stroke={INK} strokeWidth={4} />
    <path d="M26 57 L70 57 M48 40 L48 74" stroke={INK} strokeWidth={3} />
    <circle cx={176} cy={34} r={14} fill={RED} stroke={INK} strokeWidth={3} /><circle cx={196} cy={34} r={14} fill="#F5A623" stroke={INK} strokeWidth={3} opacity={0.95} />
    <path d="M26 108 L200 108" stroke="#fff" strokeWidth={6} strokeDasharray="14 10" strokeLinecap="round" />
  </svg>;

// Red debt rope: from the poor card, snaking down to the -$1,800 (like the reference's red string).
const DebtRope = ({x, y, t}: {x: number; y: number; t: number}) => {
  const w = Math.sin(t * 4) * 10;
  return <svg width={10} height={10} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <path d={`M0 0 C ${-70 + w} 60, ${70 - w} 120, ${-20 + w} 180 S ${-60 - w} 200, ${-90 + w} 250`} fill="none" stroke={INK} strokeWidth={22} strokeLinecap="round" />
    <path d={`M0 0 C ${-70 + w} 60, ${70 - w} 120, ${-20 + w} 180 S ${-60 - w} 200, ${-90 + w} 250`} fill="none" stroke={RED} strokeWidth={13} strokeLinecap="round" />
    <path d={`M0 0 C ${-70 + w} 60, ${70 - w} 120, ${-20 + w} 180 S ${-60 - w} 200, ${-90 + w} 250`} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="6 16" strokeLinecap="round" opacity={0.7} />
  </svg>;
};

// Red/white striped ice pole with VERSUS across it (the reference's middle divider, snow-world version).
const VersusPole = ({x, y, t}: {x: number; y: number; t: number}) => {
  const off = (t * 40) % 56;
  return <>
    <svg width={90} height={560} viewBox="0 0 90 560" style={{position: 'absolute', left: x - 45, top: y - 280, overflow: 'visible'}}>
      <defs><clipPath id="pole"><rect x={18} y={36} width={54} height={488} rx={27} /></clipPath></defs>
      <rect x={18} y={36} width={54} height={488} rx={27} fill="#fff" />
      <g clipPath="url(#pole)">{Array.from({length: 14}, (_, i) => <path key={i} d={`M0 ${i * 56 - off} L90 ${i * 56 - off - 50} L90 ${i * 56 - off - 26} L0 ${i * 56 - off + 24} Z`} fill={RED} />)}</g>
      <rect x={18} y={36} width={54} height={488} rx={27} fill="none" stroke={INK} strokeWidth={6} />
      <rect x={8} y={8} width={74} height={36} rx={16} fill="#CFE6F3" stroke={INK} strokeWidth={6} />
      <rect x={8} y={516} width={74} height={36} rx={16} fill="#CFE6F3" stroke={INK} strokeWidth={6} />
    </svg>
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${-4 + Math.sin(t * 3) * 1.5}deg)`, fontFamily: 'Montserrat', fontWeight: 900, fontStyle: 'italic',
      fontSize: 60, color: INK, WebkitTextStroke: '9px #fff', paintOrder: 'stroke fill', letterSpacing: 1}}>VERSUS</div>
  </>;
};

// Big number under each side, visible from frame 0; it punches when its side is named.
const Amount = ({text, x, y, color, t, at, size = 150}: {text: string; x: number; y: number; color: string; t: number; at: number; size?: number}) => {
  const d = t - at, k = d >= 0 && d < 0.3 ? 1 + 0.3 * Math.sin((d / 0.3) * Math.PI) : 1;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(-5deg) scale(${k})`, fontFamily: HAND, fontWeight: 700, fontSize: size, lineHeight: 1,
    color, WebkitTextStroke: `${size * 0.02}px ${color}`, letterSpacing: 8, whiteSpace: 'nowrap'}}>{text}</div>;
};

// PAID stamp: on screen from frame 0, slams again when the rich side is named.
const Paid = ({x, y, t, at}: {x: number; y: number; t: number; at: number}) => {
  const d = t - at, s = d >= 0 && d < 0.14 ? 1.9 - 0.9 * (d / 0.14) : 1;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(-10deg) scale(${s})`, border: `9px solid ${GREEN}`, borderRadius: 16, padding: '0 26px',
    fontFamily: HAND, fontWeight: 700, fontSize: 92, lineHeight: '110px', color: GREEN, letterSpacing: 6, background: 'rgba(255,255,255,0.85)'}}>PAID</div>;
};

const Ground = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 60, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;

export const DebtHook = ({t}: {t: number}) => {
  const poorHot = t >= POOR_AT && t < RICH_AT, richHot = t >= RICH_AT;
  return <>
    <Ground />
    <HookTitle t={t} />
    <SideLabel text="POOR" x={250} y={420} color={RED} t={t} at={POOR_AT} />
    <SideLabel text="RICH" x={830} y={420} color={GREEN} t={t} at={RICH_AT} />
    {/* poor Doug: worried, sweating, trembles when named */}
    <Penguin id="poor" x={240} y={G} h={430} pose={{turn: 0.25, look: [0.3, -0.2], brows: poorHot ? 'shock' : 'worried', eyeScale: poorHot ? 1.25 : 1.05, pupil: poorHot ? 0.55 : 1,
      beak: 'frown', sweat: true, tremble: poorHot ? 1 : 0.3, flapL: 30, flapR: 30}} />
    <Card x={240} y={G - 100} color="#7C6FD6" t={t} shake={poorHot ? 4 : 0} />
    <DebtRope x={250} y={G - 40} t={t} />
    <div style={{position: 'absolute', left: 60, top: 640 + Math.sin(t * 6) * 8, fontFamily: HAND, fontWeight: 700, fontSize: 120, color: INK, transform: 'rotate(-14deg)'}}>?</div>
    {/* rich Doug: top hat + monocle, smug smile, flippers up when named */}
    <Penguin id="rich" x={840} y={G} h={430} outfit="rich" pose={{turn: -0.25, look: [-0.3, -0.2], brows: 'happy', beak: 'smile', blush: 0.6,
      flapL: richHot ? 120 + Math.sin(t * 9) * 12 : 30, flapR: richHot ? 120 + Math.sin(t * 9 + 1) * 12 : 30, hop: richHot ? Math.abs(Math.sin((t - RICH_AT) * 6)) * 0.6 : 0}} />
    <Card x={840} y={G - 100} color="#7C6FD6" t={t} />
    {richHot && [0, 1, 2, 3, 4].map((i) => { const p = ((t - RICH_AT) * 0.9 + i * 0.21) % 1;
      return <Fish key={i} id={`rf${i}`} x={680 + i * 62} y={620 + p * 520} w={90} rot={20 + i * 30} seed={i} />; })}
    <VersusPole x={540} y={G - 280} t={t} />
    <Amount text="-$1,800" x={270} y={G + 245} color={RED} t={t} at={POOR_AT} size={140} />
    <Paid x={820} y={G + 110} t={t} at={RICH_AT} />
    <Amount text="+$3,000" x={820} y={G + 250} color={GREEN} t={t} at={RICH_AT} size={120} />
  </>;
};

// 5-s hook preview (no voice yet): wide, push to POOR, push to RICH, back to both.
export const DougDebtHook = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const toP = ease((tc - POOR_AT) / 0.4) * (tc < RICH_AT ? 1 : 0), toR = ease((tc - RICH_AT) / 0.4) * (tc < BOTH_AT ? 1 : 0);
  const s = 1 + 0.22 * (toP + toR), fx = 540 - 270 * toP + 270 * toR, fy = 960 + 120 * (toP + toR);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}><DebtHook t={t} /></AbsoluteFill>
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={POOR_AT - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={POOR_AT + 0.15} name="user-wrong" vol={0.4} />
    <Sfx at={RICH_AT - 0.05} name="user-whoosh" vol={0.25} />
    <Sfx at={RICH_AT + 0.05} name="user-cash-register" vol={0.4} />
    <Sfx at={RICH_AT + 0.5} name="user-wow" vol={0.35} />
    <Sfx at={BOTH_AT - 0.05} name="user-whoosh" vol={0.22} />
  </AbsoluteFill>;
};
