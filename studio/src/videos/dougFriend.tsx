// EP7 "Gas: Doug (USA) vs his friend (Venezuela) — 3 reasons". Hook first (approval), full episode after.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {FlagPump, Label, Vs} from './dougVenezuela';
import {Phrase, Sfx, beat} from '../penguin/edit';
import {cutFX} from '../penguin/acting';
import HT from '../data/doug-friend-hook.json';

const G = 1300;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';

// Doug's friend in Venezuela: a sea otter (only Doug + family are penguins). Name never shown in the hook.
export const Otter = ({x, y, h = 360, flip, t}: {x: number; y: number; h?: number; flip?: boolean; t: number}) => {
  const bob = Math.sin(t * 3) * 3;
  return <svg width={h * 0.8} height={h} viewBox="0 0 320 400" style={{position: 'absolute', left: x - h * 0.4, top: y - h + bob, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    <ellipse cx={160} cy={395} rx={110} ry={10} fill="#E3E8EC" />
    <path d="M250 360 C 320 350, 330 290, 300 250" fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" />
    <path d="M250 360 C 320 350, 330 290, 300 250" fill="none" stroke="#8A5A3B" strokeWidth={22} strokeLinecap="round" />
    <path d="M80 390 C 60 280, 90 190, 160 190 C 230 190, 260 280, 240 390 Z" fill="#8A5A3B" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M115 390 C 105 300, 125 240, 160 240 C 195 240, 215 300, 205 390 Z" fill="#E9D3B4" />
    <circle cx={92} cy={80} r={22} fill="#8A5A3B" stroke={INK} strokeWidth={6} /><circle cx={228} cy={80} r={22} fill="#8A5A3B" stroke={INK} strokeWidth={6} />
    <ellipse cx={160} cy={130} rx={88} ry={78} fill="#8A5A3B" stroke={INK} strokeWidth={7} />
    <ellipse cx={160} cy={150} rx={62} ry={48} fill="#E9D3B4" />
    <ellipse cx={160} cy={132} rx={15} ry={10} fill={INK} />
    <circle cx={125} cy={108} r={11} fill={INK} /><circle cx={195} cy={108} r={11} fill={INK} />
    <circle cx={128} cy={104} r={3.5} fill="#fff" /><circle cx={198} cy={104} r={3.5} fill="#fff" />
    <path d="M140 156 Q160 176 180 156" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
    <path d="M118 140 L80 132 M118 148 L78 152 M202 140 L240 132 M202 148 L242 152" stroke={INK} strokeWidth={3} strokeLinecap="round" />
    <ellipse cx={128} cy={285} rx={22} ry={16} fill="#8A5A3B" stroke={INK} strokeWidth={6} />
    <ellipse cx={192} cy={285} rx={22} ry={16} fill="#8A5A3B" stroke={INK} strokeWidth={6} />
  </svg>;
};

const Title = ({t}: {t: number}) => {
  const p = ease(t / 0.25);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 112, lineHeight: '120px', color: INK, opacity: p, transform: `scale(${0.6 + 0.4 * p}) rotate(-2deg)`}}>
    what's the<br />difference<span style={{color: RED}}>?</span>
  </div>;
};

// phrase timings of the hook voice (videos/doug-friend/vo/hook.timings.json)
export const HOOK_TIM = HT as Phrase[];
const H = (i: number) => HOOK_TIM[i].start;
const VE_X = 770, US_X = 290;

export const Hook = ({t}: {t: number}) => {
  const usFill = ease(t / 1.2), veFill = ease((t - H(2)) / 1.5);
  return <>
    <div style={{position: 'absolute', left: 538, top: 400, width: 6, height: 1100, background: INK, opacity: 0.85}} />
    <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
    <Title t={t} />
    <Label text="USA" x={US_X} y={400} at={0} t={t + 1} />
    <Label text="VENEZUELA" x={VE_X} y={400} at={0} t={t + 1} />
    <FlagPump x={US_X} y={G} price="$66" unit="/ TANK" flag="us" top={RED} t={t} color={RED} fill={usFill} />
    <FlagPump x={VE_X} y={G} price="$2" unit="/ TANK" flag="ve" top="#F5C518" t={t} color={GREEN} fill={veFill} />
    <Penguin id="doug" x={US_X} y={G + 330} h={400} pose={{turn: 0.4, look: [0.5, -0.4], brows: 'worried', eyeScale: 1.2}} />
    <Otter x={VE_X} y={G + 330} h={400} flip t={t} />
    <Vs x={540} y={980} t={t + 1} />
  </>;
};

// Face-down card with a big "?" (one per reason), pops in, floats, slight tilt.
const MysteryCard = ({x, y, at, t, tilt}: {x: number; y: number; at: number; t: number; tilt: number}) => {
  const p = ease((t - at) / 0.22), over = p < 1 ? Math.sin(p * Math.PI) * 0.15 : 0;
  const fl = Math.sin(t * 3 + x) * 10;
  return <div style={{position: 'absolute', left: x - 120, top: y - 170 + fl, width: 240, height: 340, borderRadius: 26, background: '#2F6FD6', border: `8px solid ${INK}`, boxSizing: 'border-box',
    transform: `scale(${p + over}) rotate(${tilt}deg)`, opacity: p > 0 ? 1 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 0 rgba(0,0,0,0.12)'}}>
    <div style={{position: 'absolute', inset: 14, borderRadius: 16, border: '5px dashed rgba(255,255,255,0.55)'}} />
    <span style={{fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 210, color: '#fff', lineHeight: 1, textShadow: `0 6px 0 ${INK}`}}>?</span>
  </div>;
};

// "Three reasons." = new shot: Doug thinking under 3 face-down cards.
export const Reasons = ({t, at}: {t: number; at: number}) => {
  const tp = ease((t - at) / 0.25);
  return <>
    <div style={{position: 'absolute', left: -400, right: -400, top: G + 200, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 130, color: INK, transform: `scale(${0.6 + 0.4 * tp}) rotate(-2deg)`, opacity: tp}}>
      <span style={{color: RED}}>3</span> REASONS
    </div>
    <MysteryCard x={250} y={960} at={at + 0.1} t={t} tilt={-10} />
    <MysteryCard x={540} y={900} at={at + 0.25} t={t} tilt={0} />
    <MysteryCard x={830} y={960} at={at + 0.4} t={t} tilt={10} />
    <Penguin id="doug" x={540} y={G + 520} h={560} pose={{look: [0, -0.9], brows: 'worried', eyeScale: 1.25}} />
  </>;
};

export const DOUG_FRIEND_SECONDS = Math.ceil((HOOK_TIM[HOOK_TIM.length - 1].end + 0.9) * 30) / 30;
export const DougFriend = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS, R = H(5);
  // push toward the side being spoken, wide again on the question
  const toUS = ease((tc - 0.3) / 0.5) * (tc < H(2) ? 1 : 0), toVE = ease((tc - H(2)) / 0.5) * (tc < H(4) ? 1 : 0);
  const sc = (tc >= R ? 1 + 0.015 * (tc - R) : 1 + 0.18 * (toUS + toVE)) * (tc < 0.3 ? 1 : beat(tc, HOOK_TIM)), fx = tc >= R ? 540 : 540 - 200 * toUS + 200 * toVE, fy = 960;
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, [{at: 0, fx: 'cut'}, {at: R, fx: 'swipe'}])}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * sc}px, ${960 - fy * sc}px) scale(${sc})`, transformOrigin: '0 0'}}>
        {tc < R ? <Hook t={Math.max(t, 0)} /> : <Reasons t={t} at={R} />}
      </AbsoluteFill>
    </AbsoluteFill>
    <Audio src={staticFile('doug-friend-hook.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={H(1)} name="user-cash-register" vol={0.35} />
    <Sfx at={H(2) - 0.05} name="user-whoosh" vol={0.22} />
    <Sfx at={H(3)} name="user-ting" vol={0.4} />
    <Sfx at={H(4) - 0.05} name="user-whoosh" vol={0.22} />
    <Sfx at={R - 0.05} name="user-whoosh" vol={0.3} />
    <Sfx at={R + 0.1} name="user-pop" vol={0.3} />
    <Sfx at={R + 0.25} name="user-pop" vol={0.3} />
    <Sfx at={R + 0.4} name="user-boom" vol={0.4} />
  </AbsoluteFill>;
};
