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

// ATM: balance screen flips from $10,000.00 to $0.00 on "Gone."
export const Atm = ({x, base, t, goneAt, w = 400}: {x: number; base: number; t: number; goneAt: number; w?: number}) => {
  const gone = t >= goneAt, flash = gone && t < goneAt + 0.5 && Math.floor(t * 12) % 2 === 0, k = w / 400;
  return <div style={{position: 'absolute', left: x - w / 2, top: base - 560 * k, width: w, height: 560 * k}}>
    <div style={{position: 'absolute', inset: 0, background: '#3E5C8A', border: `7px solid ${INK}`, borderRadius: 22 * k, boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 18 * k, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 46 * k, color: '#fff', letterSpacing: 6}}>ATM</div>
    <div style={{position: 'absolute', left: 40 * k, right: 40 * k, top: 86 * k, height: 170 * k, borderRadius: 12 * k, background: flash ? '#5A1010' : '#0F2A1E', border: `6px solid ${INK}`, boxSizing: 'border-box',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, color: gone ? N_RED : N_GREEN}}>
      <div style={{fontSize: 24 * k, letterSpacing: 3, color: '#BFE6FA'}}>BALANCE</div>
      <div style={{fontSize: 64 * k, textShadow: `0 0 16px ${gone ? N_RED : N_GREEN}`}}>{gone ? '$0.00' : '$10,000'}</div>
    </div>
    {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <div key={`${r}${c}`} style={{position: 'absolute', left: 110 * k + c * 64 * k, top: 290 * k + r * 54 * k, width: 50 * k, height: 40 * k, borderRadius: 8 * k, background: '#D9DEE6', border: `4px solid ${INK}`, boxSizing: 'border-box'}} />))}
    <div style={{position: 'absolute', left: 70 * k, right: 70 * k, top: 470 * k, height: 24 * k, borderRadius: 6, background: '#111', border: `4px solid ${INK}`}} />
  </div>;
};

export const Hook2 = ({t}: {t: number}) => {
  const in0 = 1.08 - 0.08 * ease(t / 0.22), bump = (at: number) => 1 + 0.12 * Math.max(0, 1 - Math.abs(t - at) / 0.2);
  const base = 960, shock = t >= P(2);
  return <>
    <div style={{position: 'absolute', left: 538, top: 560, width: 4, height: 760, borderRadius: 2, background: 'linear-gradient(180deg, transparent, rgba(190,210,255,0.8), transparent)'}} />
    {/* LEFT: Doug on the phone */}
    <div style={{transform: `scale(${in0})`, transformOrigin: '270px 960px'}}>
      <div style={{position: 'absolute', left: 150, top: base - 8, width: 240, height: 26, borderRadius: '50%', background: 'rgba(0,0,0,0.25)'}} />
      <Penguin id="doug" x={270} y={base + 6} h={380} shadow={false} pose={{turn: -0.3, look: [0.2, 0.2], brows: shock ? 'shock' : 'worried', eyeScale: shock ? 1.35 : 1.05, pupil: 0.6, beak: 'frown', flapL: 120, flapR: shock ? 50 : 25, sweat: shock}} />
      <Phone x={128} y={base - 262} t={t} />
    </div>
    <div style={{position: 'absolute', left: 45, top: base + 60, width: 470, transform: `scale(${in0 * bump(P(1) + 0.35)})`, transformOrigin: '50% 0'}}>
      <div style={{textAlign: 'center', background: 'rgba(20,28,82,0.94)', border: `4px solid ${N_GREEN}`, borderRadius: 24, boxShadow: `0 0 30px ${N_GREEN}77`, padding: '12px 10px 18px'}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 40, letterSpacing: 6, color: '#fff'}}>DOUG TOOK</div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 118, lineHeight: 1.04, color: N_GREEN, textShadow: `0 0 22px ${N_GREEN}88`}}>$0</div>
      </div>
    </div>
    {/* RIGHT: ATM + the money that is gone */}
    <div style={{transform: `scale(${in0})`, transformOrigin: '810px 960px'}}>
      <Atm x={810} base={base} t={t} goneAt={P(3)} w={340} />
    </div>
    <div style={{position: 'absolute', left: 565, top: base + 60, width: 470, transform: `scale(${in0 * bump(P(2) + 0.3)})`, transformOrigin: '50% 0'}}>
      <div style={{background: '#FDFDFD', borderRadius: 24, padding: '12px 10px 18px', textAlign: 'center', boxShadow: '0 12px 30px rgba(0,0,0,0.35)', border: `4px solid ${INK}`}}>
        <div style={{fontFamily: 'Montserrat', fontWeight: 800, fontSize: 40, letterSpacing: 6, color: '#5B6470'}}>GONE</div>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 110, lineHeight: 1.04, color: '#E8362E'}}>$10,000</div>
      </div>
    </div>
  </>;
};

export const DougPays2Hook = () => {
  const tc = useCurrentFrame() / FPS, s = 1 + 0.02 * tc;
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
