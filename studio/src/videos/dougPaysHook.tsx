// DOUG PAYS · EP. 1 "Rent" — HOOK PREVIEW v3 (first 3 s). Ref: "Le Brief" hook = building + flag + white notice card with a big red price.
// Here: American house + US flag, white rent notice "$1,600" (big, red) vs a TINY green "$200" card Doug holds. Nothing else.
// ~$1,600 = typical US rent (Zillow typical asking rent Jul 2026 = $1,962; verify + cite). "$200" = story figure, not a stat.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin} from '../penguin/rig';
import {Captions} from '../penguin/edit';
import {NightBg, NightGround, N_GREEN} from '../penguin/night';

const G = 1290;
const CAP = [{start: 0, end: 1.4, text: 'Rent is $1,600.'}, {start: 1.4, end: 3.0, text: 'Doug has $200.'}];
const ease = (x: number) => { const k = Math.max(0, Math.min(1, x)); return 1 - (1 - k) ** 3; };
const pop = (t: number, at: number) => { const d = t - at; return d < 0 ? 0 : d < 0.2 ? 1.12 * (d / 0.2) : 1.12 - 0.12 * Math.min(1, (d - 0.2) / 0.12); };

const Flag = ({x, y, t}: {x: number; y: number; t: number}) => {
  const w = 150, h = 96, wave = Math.sin(t * 5) * 3;
  return <g transform={`translate(${x} ${y})`}>
    <rect x={-4} y={0} width={8} height={170} fill="#C9CED6" stroke={INK} strokeWidth={4} />
    <circle cx={0} cy={0} r={9} fill="#E8B04A" stroke={INK} strokeWidth={4} />
    <g transform={`translate(4 12) skewY(${wave})`}>
      {Array.from({length: 7}, (_, i) => <rect key={i} x={0} y={i * (h / 7)} width={w} height={h / 7 + 0.5} fill={i % 2 ? '#fff' : '#D83A2E'} />)}
      <rect x={0} y={0} width={w * 0.42} height={h * 4 / 7} fill="#2B4C9B" />
      {Array.from({length: 12}, (_, i) => <circle key={i} cx={9 + (i % 4) * 14} cy={9 + Math.floor(i / 4) * 14} r={2.4} fill="#fff" />)}
      <rect x={0} y={0} width={w} height={h} fill="none" stroke={INK} strokeWidth={4} />
    </g>
  </g>;
};

// Plain American suburban house (siding, brick chimney, blue door, porch light) with a US flag on a pole
const House = ({x, base, t}: {x: number; base: number; t: number}) => {
  const W = 470, H = 330;
  return <svg width={W + 220} height={H + 230} style={{position: 'absolute', left: x - (W + 220) / 2, top: base - H - 200, overflow: 'visible'}} viewBox={`0 0 ${W + 220} ${H + 230}`}>
    <g transform="translate(110 200)">
      <rect x={330} y={-10} width={50} height={110} fill="#B5533C" stroke={INK} strokeWidth={6} />
      <rect x={0} y={90} width={W} height={H - 90} fill="#F1E7D3" stroke={INK} strokeWidth={6} />
      {[0, 1, 2, 3].map((i) => <line key={i} x1={0} x2={W} y1={150 + i * 45} y2={150 + i * 45} stroke="#D9CBB0" strokeWidth={3} />)}
      <polygon points={`-30,100 ${W / 2},-10 ${W + 30},100`} fill="#8E3F32" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {[70, 300].map((wx) => <g key={wx}><rect x={wx} y={150} width={100} height={110} fill="#BFE6FA" stroke={INK} strokeWidth={6} /><line x1={wx + 50} x2={wx + 50} y1={150} y2={260} stroke={INK} strokeWidth={5} /><line x1={wx} x2={wx + 100} y1={205} y2={205} stroke={INK} strokeWidth={5} /></g>)}
      <rect x={195} y={190} width={80} height={140} rx={6} fill="#2F5FA8" stroke={INK} strokeWidth={6} />
      <circle cx={256} cy={265} r={6} fill="#E8B04A" stroke={INK} strokeWidth={3} />
      <rect x={165} y={170} width={140} height={14} fill="#fff" stroke={INK} strokeWidth={5} />
    </g>
    <Flag x={610} y={30} t={t} />
  </svg>;
};

const Hook = ({t}: {t: number}) => {
  const card = pop(t, 0.15), small = pop(t, 1.4), shock = t >= 1.4;
  return <>
    <House x={540} base={560} t={t} />
    {/* ONE white card, ONE word, ONE big red number (like the reference's 350 €) */}
    <div style={{position: 'absolute', left: 190, top: 590, width: 700, transform: `scale(${card})`, transformOrigin: '50% 0'}}>
      <div style={{background: '#FDFDFD', borderRadius: 24, padding: '14px 34px 22px', textAlign: 'center', boxShadow: '0 12px 30px rgba(0,0,0,0.35)', border: `4px solid ${INK}`}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 44, letterSpacing: 8, color: '#5B6470'}}>RENT</div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 184, lineHeight: 1.02, color: '#E8362E'}}>$1,600</div>
      </div>
    </div>
    <NightGround y={G} />
    <Penguin id="doug" x={360} y={G + 40} h={380} pose={{turn: 0, look: [0, 0.3], brows: shock ? 'shock' : 'worried', eyeScale: shock ? 1.35 : 1.05, pupil: 0.6, beak: 'frown', flapR: shock ? 50 : 30, flapL: shock ? 50 : 30, sweat: shock}} />
    {/* small green tag under Doug = the contrast */}
    <div style={{position: 'absolute', left: 620, top: 1090, width: 300, transform: `scale(${small})`, transformOrigin: '50% 50%'}}>
      <div style={{textAlign: 'center', background: 'rgba(20,28,82,0.92)', border: `3px solid ${N_GREEN}`, borderRadius: 22, boxShadow: `0 0 26px ${N_GREEN}77`, padding: '6px 0 12px'}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, letterSpacing: 5, color: '#fff'}}>DOUG</div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 100, lineHeight: 1.02, color: N_GREEN}}>$200</div>
      </div>
    </div>
  </>;
};

export const DougPaysHook = () => {
  const tc = useCurrentFrame() / FPS, s = 1 + 0.02 * tc;
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <NightBg />
    <AbsoluteFill style={{transform: `translate(${540 - 540 * s}px, ${960 - 960 * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={tc} /></AbsoluteFill>
    <Captions t={tc} phrases={CAP} />
  </AbsoluteFill>;
};
