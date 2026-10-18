// The hit-hook layout from the channel's best videos (64.7K "WHY gas $4.32 vs $0.03"): yellow-brush WHY on top,
// two sides with flag + giant price card + object, confused casual Doug in the middle. Everything is on screen
// from frame 0 (it is also the cover), then idles; the contrast reads with no sound.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Fonts, HandFont, HAND} from '../base';
import {INK, Penguin, useT2} from './rig';

export type FlagKind = 'usa' | 'iran' | 'japan' | 'germany' | 'canada' | 'mexico' | 'uk' | 'none';
export type HookSide = {flag?: FlagKind; label?: string; price: string; unit?: string; obj?: 'pump' | React.ReactNode; color?: string};

const RED = '#D83A2E', GREEN = '#2E9E4F', BLUE = '#2F5DA8';

const Flag = ({kind, w = 300, wave = 0}: {kind: FlagKind; w?: number; wave?: number}) => {
  const h = w * 0.62;
  const body = (() => {
    if (kind === 'usa') return <>
      {Array.from({length: 13}, (_, i) => <rect key={i} x={0} y={(i * h) / 13} width={w} height={h / 13 + 0.5} fill={i % 2 ? '#fff' : '#C8102E'} />)}
      <rect x={0} y={0} width={w * 0.42} height={(h * 7) / 13} fill="#1F3A7A" />
      {Array.from({length: 20}, (_, i) => <circle key={i} cx={10 + (i % 5) * w * 0.08} cy={10 + Math.floor(i / 5) * h * 0.13} r={w * 0.012} fill="#fff" />)}
    </>;
    if (kind === 'iran') return <><rect width={w} height={h / 3} fill="#239F40" /><rect y={h / 3} width={w} height={h / 3} fill="#fff" /><rect y={(2 * h) / 3} width={w} height={h / 3} fill="#DA0000" />
      <circle cx={w / 2} cy={h / 2} r={h * 0.12} fill="none" stroke="#DA0000" strokeWidth={6} /></>;
    if (kind === 'japan') return <><rect width={w} height={h} fill="#fff" /><circle cx={w / 2} cy={h / 2} r={h * 0.3} fill="#BC002D" /></>;
    if (kind === 'germany') return <><rect width={w} height={h / 3} fill="#000" /><rect y={h / 3} width={w} height={h / 3} fill="#DD0000" /><rect y={(2 * h) / 3} width={w} height={h / 3} fill="#FFCE00" /></>;
    if (kind === 'canada') return <><rect width={w} height={h} fill="#fff" /><rect width={w / 4} height={h} fill="#D80621" /><rect x={(3 * w) / 4} width={w / 4} height={h} fill="#D80621" />
      <path d={`M${w / 2} ${h * 0.2} L${w * 0.56} ${h * 0.45} L${w * 0.62} ${h * 0.4} L${w * 0.58} ${h * 0.62} L${w * 0.42} ${h * 0.62} L${w * 0.38} ${h * 0.4} L${w * 0.44} ${h * 0.45} Z`} fill="#D80621" /></>;
    if (kind === 'mexico') return <><rect width={w / 3} height={h} fill="#006847" /><rect x={w / 3} width={w / 3} height={h} fill="#fff" /><rect x={(2 * w) / 3} width={w / 3} height={h} fill="#CE1126" />
      <circle cx={w / 2} cy={h / 2} r={h * 0.1} fill="#8C6A3F" /></>;
    if (kind === 'uk') return <><rect width={w} height={h} fill="#012169" /><path d={`M0 0 L${w} ${h} M${w} 0 L0 ${h}`} stroke="#fff" strokeWidth={h * 0.2} />
      <path d={`M0 0 L${w} ${h} M${w} 0 L0 ${h}`} stroke="#C8102E" strokeWidth={h * 0.07} /><path d={`M${w / 2} 0 V${h} M0 ${h / 2} H${w}`} stroke="#fff" strokeWidth={h * 0.3} />
      <path d={`M${w / 2} 0 V${h} M0 ${h / 2} H${w}`} stroke="#C8102E" strokeWidth={h * 0.17} /></>;
    return null;
  })();
  return <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{overflow: 'visible', transform: `skewY(${-4 + wave}deg)`, filter: 'drop-shadow(0 6px 0 rgba(0,0,0,0.12))'}}>
    <defs><clipPath id={`fl${kind}`}><rect width={w} height={h} rx={6} /></clipPath></defs>
    <g clipPath={`url(#fl${kind})`}>{body}</g>
    <rect width={w} height={h} rx={6} fill="none" stroke={INK} strokeWidth={5} />
  </svg>;
};

const Pump = ({w = 300, color}: {w?: number; color: string}) =>
  <svg width={w} height={w * 1.35} viewBox="0 0 300 405" style={{overflow: 'visible'}}>
    <rect x={40} y={20} width={220} height={360} rx={26} fill={color} stroke={INK} strokeWidth={7} />
    <rect x={72} y={56} width={156} height={90} rx={10} fill="#DDE6EC" stroke={INK} strokeWidth={6} />
    <rect x={88} y={186} width={124} height={130} rx={10} fill="rgba(0,0,0,0.12)" />
    <path d="M150 210 C 168 238, 178 256, 178 272 A28 28 0 0 1 122 272 C 122 256, 132 238, 150 210 Z" fill="#fff" stroke={INK} strokeWidth={5} />
    <rect x={20} y={372} width={260} height={30} rx={8} fill="#555" stroke={INK} strokeWidth={6} />
    <path d="M260 120 C 300 130, 300 260, 280 300" fill="none" stroke={INK} strokeWidth={12} strokeLinecap="round" />
    <rect x={262} y={290} width={34} height={60} rx={8} fill={RED} stroke={INK} strokeWidth={5} />
  </svg>;

const Side = ({side, x, y, t, phase}: {side: HookSide; x: number; y: number; t: number; phase: number}) => {
  const bob = Math.sin(t * 2.4 + phase) * 6;
  return <div style={{position: 'absolute', left: x, top: y + bob, width: 420, transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
    {side.flag && side.flag !== 'none' && <div style={{marginBottom: 26}}><Flag kind={side.flag} w={300} wave={Math.sin(t * 3 + phase) * 1.5} /></div>}
    {side.label && <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 62, color: INK, marginBottom: 14, letterSpacing: -1}}>{side.label}</div>}
    <div style={{background: '#fff', border: `7px solid ${INK}`, borderRadius: 26, padding: '6px 26px 10px', textAlign: 'center', boxShadow: '0 10px 0 rgba(0,0,0,0.12)'}}>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: side.price.length > 6 ? 104 : 130, lineHeight: 1.05, color: INK, letterSpacing: -4, whiteSpace: 'nowrap'}}>{side.price}</div>
      {side.unit && <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: INK, marginTop: -4}}>{side.unit}</div>}
    </div>
    <div style={{fontSize: 80, lineHeight: 1, margin: '6px 0', color: INK, fontWeight: 900}}>↓</div>
    {side.obj === 'pump' ? <Pump w={220} color={side.color ?? BLUE} /> : side.obj}
  </div>;
};

export const WhyHook = ({left, right, word = 'WHY'}: {left: HookSide; right: HookSide; word?: string}) => {
  const t = useT2();
  const pulse = 1 + 0.025 * Math.sin(t * 5);
  return <AbsoluteFill style={{background: '#FBFBF8'}}>
    <Fonts /><HandFont />
    {/* WHY on a yellow brush stroke with burst lines */}
    <div style={{position: 'absolute', left: 540 - 380, top: 250 - 150, width: 760, height: 300, transform: `rotate(-2deg) scale(${pulse})`,
      display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={760} height={300} viewBox="0 0 760 300" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d="M110 70 C 260 46, 480 44, 650 62 C 672 120, 668 196, 648 244 C 470 262, 280 262, 104 240 C 88 190, 90 120, 110 70 Z" fill="#F7CF3B" />
        <path d="M120 240 L180 254 M580 252 L640 242" stroke="#F7CF3B" strokeWidth={14} strokeLinecap="round" />
        {[[70, 80, 0, 40], [60, 150, -20, 150], [70, 220, 0, 260], [690, 80, 760, 40], [700, 150, 780, 150], [690, 220, 760, 260]].map(([x1, y1, x2, y2], i) =>
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={14} strokeLinecap="round" />)}
      </svg>
      <div style={{position: 'relative', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 230, lineHeight: 1, color: INK, letterSpacing: -6, whiteSpace: 'nowrap'}}>{word}</div>
    </div>
    <Side side={left} x={225} y={440} t={t} phase={0} />
    <Side side={right} x={855} y={440} t={t} phase={1.7} />
    {/* confused Doug in the middle: casual clothes, flipper up, eyes rolled up, ? marks */}
    <Penguin x={540} y={1500} h={560} id="hookDoug" outfit="casual"
      pose={{brows: 'worried', look: [0.5, -0.7], flapR: 22, flapL: 14, beak: 'frown', turn: 0.15}} />
    {[{x: 400, y: 1000, r: -14, s: 0.85}, {x: 690, y: 975, r: 12, s: 1}].map((q, i) =>
      <div key={i} style={{position: 'absolute', left: q.x, top: q.y + Math.sin(t * 3 + i * 2) * 10, transform: `translate(-50%,-50%) rotate(${q.r}deg) scale(${q.s})`,
        fontFamily: HAND, fontWeight: 900, fontSize: 130, color: INK}}>?</div>)}
  </AbsoluteFill>;
};

// Cover/hook demo: same contrast as the 64.7K hit, with Doug.
export const WhyHookDemo = () => <WhyHook
  left={{flag: 'usa', price: '$4.32', unit: 'PER GALLON', obj: 'pump', color: BLUE}}
  right={{flag: 'iran', price: '$0.03', unit: 'PER GALLON', obj: 'pump', color: GREEN}} />;
