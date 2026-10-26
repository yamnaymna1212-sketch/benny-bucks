// DOUG PAYS · EP. 2 "Lost debit card" — HOOK v1 (2026-10-26). Frame 0 = the whole contrast (user rule: never an empty first frame).
// Top: "WHY DID YOU TAKE IT ALL?" / LEFT: Doug on the phone with the bank, green card "DOUG TOOK $0" /
// RIGHT: ATM whose balance flips to $0.00 on "Gone.", red card "$10,000 GONE". Story figures, not stats.
// VO phrases: 0 "Bank call Doug: Why you take all your money?" 1 "Doug took $0." 2 "$10,000." 3 "Gone."
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin} from '../penguin/rig';
import {Captions, Sfx} from '../penguin/edit';
import {NightBg, N_GREEN, N_RED} from '../penguin/night';
import {Flag} from './dougPaysHook';
import TIM from '../data/doug-card-ep2.json';

const P = (i: number) => TIM[i].start;
export const DOUG_PAYS2_HOOK_FRAMES = Math.ceil((TIM[3].end + 0.4) * FPS);
const cl = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => 1 - (1 - cl(x)) ** 3;

export const TopLine2 = ({t}: {t: number}) => {
  const k = ease(t / 0.3);
  return <div style={{position: 'absolute', left: 30, right: 30, top: 230 - 30 * (1 - k), transform: `scale(${1.06 - 0.06 * k})`, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 100, lineHeight: 1.05, color: '#fff',
    WebkitTextStroke: `4px ${INK}`, paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>
    WHY DID YOU<br />TAKE IT <span style={{color: N_RED}}>ALL?</span>
  </div>;
};

// Phone held to Doug's head, ringing, screen says BANK
const Phone = ({x, y, t}: {x: number; y: number; t: number}) => {
  const shake = Math.sin(t * 55) * (t < P(1) ? 6 : 0);
  return <div style={{position: 'absolute', left: x - 55, top: y - 105, width: 110, height: 200, transform: `rotate(${14 + shake}deg)`}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 20, background: '#20242E', border: `6px solid ${INK}`, boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: 12, top: 22, right: 12, bottom: 26, borderRadius: 10, background: '#BFE6FA', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: INK}}>
      <div style={{fontSize: 40}}>🏦</div>BANK</div>
  </div>;
};

// American bank: stone facade, pediment, columns, BANK sign, US flag on a pole (left)
export const BankHall = ({x, base, w = 500, t}: {x: number; base: number; w?: number; t: number}) => {
  const k = w / 500, h = 470 * k;
  return <div style={{position: 'absolute', left: x - w / 2, top: base - h, width: w, height: h}}>
    <svg width={w} height={h} viewBox="0 0 500 470" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      <rect x={20} y={150} width={460} height={320} fill="#E8E4DA" stroke={INK} strokeWidth={7} />
      <polygon points="0,155 250,40 500,155" fill="#D8D2C4" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <rect x={150} y={95} width={200} height={46} rx={6} fill="#2B4C9B" stroke={INK} strokeWidth={5} />
      <text x={250} y={129} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#fff" letterSpacing={6}>BANK</text>
      {[50, 140, 330, 420].map((cx) => <rect key={cx} x={cx} y={175} width={34} height={280} fill="#F6F3EC" stroke={INK} strokeWidth={5} />)}
      <rect x={10} y={455} width={480} height={18} fill="#C9C2B2" stroke={INK} strokeWidth={5} />
    </svg>
    <svg width={10} height={10} style={{position: 'absolute', left: w - 150 * k, top: -30 * k, overflow: 'visible'}}><g transform={`scale(${k * 0.9})`}><Flag x={0} y={0} t={t} /></g></svg>
  </div>;
};

// ATM: balance screen flips from $10,000.00 to $0.00 on "Gone."
export const Atm = ({x, base, t, goneAt, w = 400, balance}: {x: number; base: number; t: number; goneAt: number; w?: number; balance?: string}) => {
  const gone = t >= goneAt, flash = gone && t < goneAt + 0.5 && Math.floor(t * 12) % 2 === 0, k = w / 400;
  return <div style={{position: 'absolute', left: x - w / 2, top: base - 560 * k, width: w, height: 560 * k}}>
    <div style={{position: 'absolute', inset: 0, background: '#3E5C8A', border: `7px solid ${INK}`, borderRadius: 22 * k, boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 18 * k, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46 * k, color: '#fff', letterSpacing: 6}}>ATM</div>
    <div style={{position: 'absolute', left: 40 * k, right: 40 * k, top: 86 * k, height: 170 * k, borderRadius: 12 * k, background: flash ? '#5A1010' : '#0F2A1E', border: `6px solid ${INK}`, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, color: gone ? N_RED : N_GREEN}}>
      <div style={{fontSize: 24 * k, letterSpacing: 3, color: '#BFE6FA'}}>BALANCE</div>
      <div style={{fontSize: 64 * k, textShadow: `0 0 16px ${gone ? N_RED : N_GREEN}`}}>{balance ?? (gone ? '$0.00' : '$10,000')}</div>
    </div>
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <div key={`${r}${c}`} style={{position: 'absolute', left: 110 * k + c * 64 * k, top: 290 * k + r * 54 * k, width: 50 * k, height: 40 * k, borderRadius: 8 * k, background: '#D9DEE6', border: `4px solid ${INK}`, boxSizing: 'border-box'}} />))}
    <div style={{position: 'absolute', left: 70 * k, right: 70 * k, top: 470 * k, height: 24 * k, borderRadius: 6, background: '#111', border: `4px solid ${INK}`}} />
  </div>;
};

// Realistic American bank (v2, user: "more clear and real"): stone steps, 4 fluted columns, BANK engraved in the frieze,
// pediment with a $ seal, US flag on the roof corner, a walk-up ATM built into the wall (balance flips to $0.00 on "Gone.").
export const RealBank = ({x, base, w = 500, t, goneAt, balance}: {x: number; base: number; w?: number; t: number; goneAt: number; balance?: string}) => {
  const k = w / 500, h = 560 * k, gone = t >= goneAt, flash = gone && t < goneAt + 0.5 && Math.floor(t * 12) % 2 === 0;
  const col = (cx: number) => <g key={cx}>
    <rect x={cx - 22} y={238} width={44} height={14} fill="#DDD6C6" stroke={INK} strokeWidth={4} />
    <rect x={cx - 17} y={252} width={34} height={224} fill="#F7F3EA" stroke={INK} strokeWidth={4} />
    {[-8, 0, 8].map((d) => <line key={d} x1={cx + d} x2={cx + d} y1={258} y2={470} stroke="#D4CCBA" strokeWidth={3} />)}
    <rect x={cx - 22} y={476} width={44} height={12} fill="#DDD6C6" stroke={INK} strokeWidth={4} />
  </g>;
  return <div style={{position: 'absolute', left: x - w / 2, top: base - h, width: w, height: h}}>
    <svg width={w} height={h} viewBox="0 0 500 560" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
      {/* flag on the roof corner */}
      <rect x={372} y={14} width={7} height={140} fill="#C9CED6" stroke={INK} strokeWidth={3} />
      <circle cx={375.5} cy={12} r={7} fill="#E8B04A" stroke={INK} strokeWidth={3} />
      <g transform={`translate(379 20) skewY(${Math.sin(t * 5) * 3})`}>
        {Array.from({length: 7}, (_, i) => <rect key={i} x={0} y={i * 10} width={96} height={10.5} fill={i % 2 ? '#fff' : '#D83A2E'} />)}
        <rect x={0} y={0} width={42} height={40} fill="#2B4C9B" />
        {Array.from({length: 9}, (_, i) => <circle key={i} cx={8 + (i % 3) * 13} cy={8 + Math.floor(i / 3) * 12} r={2.2} fill="#fff" />)}
        <rect x={0} y={0} width={96} height={70} fill="none" stroke={INK} strokeWidth={3} />
      </g>
      {/* pediment + frieze */}
      <polygon points="18,190 250,92 482,190" fill="#E2DBCB" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <circle cx={250} cy={154} r={24} fill="#C9A44C" stroke={INK} strokeWidth={4} />
      <text x={250} y={165} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill={INK}>$</text>
      <rect x={10} y={190} width={480} height={48} fill="#D6CEBC" stroke={INK} strokeWidth={6} />
      <text x={250} y={227} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={38} fill="#3B4252" letterSpacing={14}>BANK</text>
      {/* wall + doors */}
      <rect x={34} y={238} width={432} height={250} fill="#ECE6D8" stroke={INK} strokeWidth={5} />
      {[290, 350, 410].map((yy) => <line key={yy} x1={34} x2={466} y1={yy} y2={yy} stroke="#DCD4C2" strokeWidth={2} />)}
      <rect x={308} y={330} width={84} height={158} fill="#24415E" stroke={INK} strokeWidth={5} />
      <line x1={350} x2={350} y1={330} y2={488} stroke={INK} strokeWidth={4} />
      {[60, 160, 280, 420].map(col)}
      {/* steps */}
      <rect x={20} y={488} width={460} height={22} fill="#CFC7B4" stroke={INK} strokeWidth={5} />
      <rect x={6} y={510} width={488} height={22} fill="#C3BBA7" stroke={INK} strokeWidth={5} />
      <rect x={-8} y={532} width={516} height={28} fill="#B7AE99" stroke={INK} strokeWidth={5} />
    </svg>
    {/* walk-up ATM built into the wall (between columns 1 and 2) */}
    <div style={{position: 'absolute', left: 82 * k, top: 262 * k, width: 76 * k, height: 214 * k, background: '#3E5C8A', border: `${4 * k}px solid ${INK}`, borderRadius: 8 * k, boxSizing: 'border-box'}}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 4 * k, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 16 * k, color: '#fff', letterSpacing: 2}}>ATM</div>
    </div>
    {/* big readable balance screen, popped out of the ATM */}
    <div style={{position: 'absolute', left: 30 * k, top: 290 * k, width: 250 * k, height: 110 * k, borderRadius: 12 * k, background: flash ? '#5A1010' : '#0F2A1E', border: `${5 * k}px solid ${INK}`, boxSizing: 'border-box', boxShadow: `0 0 26px ${gone ? N_RED : N_GREEN}66`,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, color: gone ? N_RED : N_GREEN}}>
      <div style={{fontSize: 18 * k, letterSpacing: 3, color: '#BFE6FA'}}>BALANCE</div>
      <div style={{fontSize: 48 * k, lineHeight: 1, textShadow: `0 0 14px ${gone ? N_RED : N_GREEN}`}}>{balance ?? (gone ? '$0.00' : '$10,000')}</div>
    </div>
  </div>;
};

// Matching glass price cards (same size/style both sides; green = Doug, red = gone)
const PriceCard = ({x, top, label, value, color, scale}: {x: number; top: number; label: string; value: string; color: string; scale: number}) =>
  <div style={{position: 'absolute', left: x - 230, top, width: 460, height: 190, transform: `scale(${scale})`, transformOrigin: '50% 0'}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 26, background: 'rgba(20,28,82,0.94)', border: `4px solid ${color}`, boxShadow: `0 0 30px ${color}77`, boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 16, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 800, fontSize: 38, letterSpacing: 6, color: '#fff'}}>{label}</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 64, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 100, lineHeight: 1, color, textShadow: `0 0 22px ${color}88`, whiteSpace: 'nowrap'}}>{value}</div>
  </div>;

export const Hook2 = ({t}: {t: number}) => {
  const in0 = 1.08 - 0.08 * ease(t / 0.22), bump = (at: number) => 1 + 0.12 * Math.max(0, 1 - Math.abs(t - at) / 0.2);
  const base = 1010, shock = t >= P(2);
  return <>
    <div style={{position: 'absolute', left: 538, top: 540, width: 4, height: 760, borderRadius: 2, background: 'linear-gradient(180deg, transparent, rgba(190,210,255,0.8), transparent)'}} />
    {/* LEFT: Doug on the phone with the bank */}
    <div style={{transform: `scale(${in0})`, transformOrigin: '270px 1010px'}}>
      <div style={{position: 'absolute', left: 150, top: base - 8, width: 240, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.25)'}} />
      <Penguin id="doug" x={290} y={base + 6} h={400} shadow={false} pose={{turn: -0.3, look: [0.2, 0.2], brows: shock ? 'shock' : 'worried', eyeScale: shock ? 1.35 : 1.05, pupil: 0.6, beak: 'frown', flapL: 120, flapR: shock ? 50 : 25, sweat: shock}} />
      <Phone x={140} y={base - 280} t={t} />
    </div>
    {/* RIGHT: the bank */}
    <div style={{transform: `scale(${in0})`, transformOrigin: '810px 1010px'}}>
      <RealBank x={800} base={base} w={460} t={t} goneAt={P(3)} />
    </div>
    <PriceCard x={275} top={base + 50} label="DOUG TOOK" value="$0" color={N_GREEN} scale={in0 * bump(P(1) + 0.35)} />
    <PriceCard x={808} top={base + 50} label="GONE" value="$10,000" color={N_RED} scale={in0 * bump(P(2) + 0.3)} />
  </>;
};

export const DougPays2Hook = () => {
  const tc = useCurrentFrame() / FPS, s = 1 + 0.006 * tc;
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <NightBg />
    <AbsoluteFill style={{transform: `translate(${540 - 540 * s}px, ${960 - 960 * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook2 t={tc} /></AbsoluteFill>
    <TopLine2 t={tc} />
    <Captions t={tc} phrases={TIM.slice(1, 4)} />
    <Audio src={staticFile('doug-card-ep2-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.1} name="user-notif" vol={0.35} />
    <Sfx at={P(1) + 0.35} name="user-pop" vol={0.3} />
    <Sfx at={P(2) + 0.3} name="user-cash-register" vol={0.35} />
    <Sfx at={P(3)} name="user-boom" vol={0.45} />
    <Sfx at={P(3) + 0.3} name="user-wrong" vol={0.3} />
  </AbsoluteFill>;
};
