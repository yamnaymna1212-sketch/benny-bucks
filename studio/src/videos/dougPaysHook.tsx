// DOUG PAYS · EP. 1 "Rent" — HOOK PREVIEW v3 (first 3 s). Ref: "Le Brief" hook = building + flag + white notice card with a big red price.
// Here: American house + US flag, white rent notice "$1,600" (big, red) vs a TINY green "$200" card Doug holds. Nothing else.
// ~$1,600 = typical US rent (Zillow typical asking rent Jul 2026 = $1,962; verify + cite). "$200" = story figure, not a stat.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin} from '../penguin/rig';
import {Captions} from '../penguin/edit';
import {NightBg, NightGround, N_GREEN, N_RED, SeriesBadge} from '../penguin/night';

const G = 1290;
const CAP = [{start: 0, end: 1.2, text: 'Rent is $1,600.'}, {start: 1.2, end: 2.2, text: 'Doug has $200.'}, {start: 2.2, end: 3.2, text: 'Due Friday.'}];
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
    <Flag x={640} y={30} t={t} />
  </svg>;
};

const Hook = ({t}: {t: number}) => {
  const card = pop(t, 0.2), small = pop(t, 1.0), shock = t >= 1.0;
  return <>
    <House x={500} base={585} t={t} />
    {/* white rent notice: THE big red price (like the reference's 350 €) */}
    <div style={{position: 'absolute', left: 190, top: 610, width: 700, transform: `scale(${card})`, transformOrigin: '50% 0'}}>
      <div style={{background: '#FDFDFD', borderRadius: 22, padding: '20px 34px 26px', boxShadow: '0 12px 30px rgba(0,0,0,0.35)', border: `4px solid ${INK}`}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 30, letterSpacing: 4, color: '#5B6470', borderBottom: '3px solid #D5D9E0', paddingBottom: 10}}>LANDLORD · NOTICE</div>
        <div style={{fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 50, color: '#1E2430', marginTop: 12}}>Monthly rent · due Friday</div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 190, lineHeight: 1.05, color: '#E8362E'}}>$1,600</div>
      </div>
    </div>
    <NightGround y={G} />
    <Penguin id="doug" x={330} y={G + 40} h={370} pose={{turn: 0.45, look: [0.8, -0.15], brows: shock ? 'shock' : 'worried', eyeScale: shock ? 1.35 : 1.05, pupil: 0.6, beak: 'frown', flapR: shock ? 50 : 30, flapL: shock ? 50 : 30, sweat: shock}} />
    {/* TINY green wallet card = the contrast */}
    <div style={{position: 'absolute', left: 640, top: 1110, width: 260, transform: `scale(${small}) rotate(4deg)`, transformOrigin: '50% 50%'}}>
      <div style={{background: 'linear-gradient(160deg, rgba(44,52,128,0.95), rgba(20,28,82,0.95))', border: `3px solid ${N_GREEN}`, borderRadius: 22, boxShadow: `0 0 28px ${N_GREEN}88`, textAlign: 'center', padding: '10px 0 14px'}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#fff', letterSpacing: 2}}>DOUG HAS</div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 96, lineHeight: 1.05, color: N_GREEN, textShadow: `0 0 22px ${N_GREEN}88`}}>$200</div>
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
    <SeriesBadge ep={1} />
    <Captions t={tc} phrases={CAP} />
  </AbsoluteFill>;
};
