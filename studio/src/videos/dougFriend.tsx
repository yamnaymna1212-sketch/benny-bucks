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

// Small cartoon car (side view). capX/capY = fuel cap in local px (rear of the car). flip = faces left.
const Car = ({x, y, w = 340, color, t, shake = 0, flip}: {x: number; y: number; w?: number; color: string; t: number; shake?: number; flip?: boolean}) => {
  const k = w / 340, sy = Math.sin(t * 40) * 2 * shake;
  return <svg width={w} height={200 * k} viewBox="0 0 340 200" style={{position: 'absolute', left: x - w / 2, top: y - 200 * k + sy, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    <ellipse cx={170} cy={196} rx={160} ry={9} fill="rgba(30,40,60,0.13)" />
    <path d="M20 150 L20 105 Q22 88 45 84 L95 80 L135 35 Q142 28 155 28 L245 28 Q258 28 266 38 L300 82 Q322 86 324 104 L324 150 Z" fill={color} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M110 80 L145 42 L195 42 L195 80 Z" fill="#CFEFFF" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M210 80 L210 42 L250 42 L280 80 Z" fill="#CFEFFF" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <line x1={202} y1={84} x2={202} y2={148} stroke={INK} strokeWidth={4} />
    <rect x={300} y={96} width={22} height={14} rx={4} fill="#FFE08A" stroke={INK} strokeWidth={4} />
    <rect x={30} y={98} width={30} height={20} rx={5} fill={INK} />
    {[85, 260].map((cx) => <g key={cx}><circle cx={cx} cy={152} r={34} fill={INK} /><circle cx={cx} cy={152} r={15} fill="#D9D9D9" stroke={INK} strokeWidth={4} /></g>)}
  </svg>;
};

// Pump price counter (big, above the pump). Counts up while filling.
const Counter = ({x, y, v, color}: {x: number; y: number; v: number; color: string}) =>
  <div style={{position: 'absolute', left: x - 230, width: 460, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 150, lineHeight: '160px', color, WebkitTextStroke: `5px ${INK}`}}>${Math.round(v)}</div>;

// Hose from the pump to a nozzle in the car's fuel cap, gas drips falling and a puddle growing under it.
const Fueling = ({px, py, cx, cy, gy, dir, t, on, spill}: {px: number; py: number; cx: number; cy: number; gy: number; dir: number; t: number; on: boolean; spill: number}) => {
  const hx = cx - dir * 46, hy = cy - 26;
  const drops = on ? [0, 1, 2].map((i) => { const ph = (t * 1.5 + i / 3) % 1; return {x: cx + dir * 4, y: cy + 14 + ph * (gy - cy - 14), o: 1 - ph * 0.3}; }) : [];
  return <svg width={10} height={10} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
    <ellipse cx={cx} cy={gy} rx={18 + 60 * spill} ry={5 + 12 * spill} fill="#F2B705" stroke="#C99A00" strokeWidth={3} opacity={spill > 0.02 ? 0.9 : 0} />
    <path d={`M${px} ${py} C ${px} ${gy + 30}, ${hx - dir * 60} ${gy + 30}, ${hx} ${hy}`} fill="none" stroke={INK} strokeWidth={15} strokeLinecap="round" />
    <path d={`M${px} ${py} C ${px} ${gy + 30}, ${hx - dir * 60} ${gy + 30}, ${hx} ${hy}`} fill="none" stroke="#555" strokeWidth={6} strokeLinecap="round" />
    <path d={`M${hx} ${hy} L${cx} ${cy}`} stroke={INK} strokeWidth={22} strokeLinecap="round" />
    <path d={`M${hx} ${hy} L${cx} ${cy}`} stroke="#3B3B3B" strokeWidth={11} strokeLinecap="round" />
    {drops.map((d, i) => <path key={i} transform={`translate(${d.x} ${d.y})`} d="M0 -14 C 5 -4, 10 4, 0 9 C -10 4, -5 -4, 0 -14 Z" fill="#F2B705" stroke={INK} strokeWidth={2.5} opacity={d.o} />)}
  </svg>;
};

export const Hook = ({t}: {t: number}) => {
  const usP = ease((t - 0.2) / (H(2) - 0.4)), veP = ease((t - H(2)) / (H(4) - H(2) - 0.2));
  const usOn = t > 0.2 && usP < 0.995, veOn = t > H(2) && veP < 0.995;
  const GY = G + 330, CAR_W = 270, k = CAR_W / 340, carTop = GY - 60 - 200 * k;
  const US_CAR = 405, VE_CAR = 675, usCap = US_CAR - CAR_W / 2 + 40 * k, veCap = VE_CAR + CAR_W / 2 - 40 * k, capY = carTop + 92 * k;
  return <>
    <div style={{position: 'absolute', left: 538, top: 400, width: 6, height: 1100, background: INK, opacity: 0.85}} />
    <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
    <Title t={t} />
    <Label text="USA" x={US_X} y={400} at={0} t={t + 1} />
    <Label text="VENEZUELA" x={VE_X} y={400} at={0} t={t + 1} />
    <Counter x={US_X} y={520} v={66 * usP} color={RED} />
    <Counter x={VE_X} y={520} v={2 * veP} color={GREEN} />
    <div style={{position: 'absolute', left: 0, top: 0, transform: 'translate(-20px, 330px) scale(0.75)', transformOrigin: '0 0'}}>
      <FlagPump x={180} y={G} price={`$${Math.round(66 * usP)}`} unit="/ TANK" flag="us" top={RED} t={t} color={RED} fill={usP} />
    </div>
    <div style={{position: 'absolute', left: 0, top: 0, transform: 'translate(320px, 330px) scale(0.75)', transformOrigin: '0 0'}}>
      <FlagPump x={813} y={G} price={`$${Math.round(2 * veP)}`} unit="/ TANK" flag="ve" top="#F5C518" t={t} color={GREEN} fill={veP} />
    </div>
    <Car x={US_CAR} y={GY - 60} w={CAR_W} color="#5EC4FA" t={t} shake={usOn ? 1 : 0} />
    <Car x={VE_CAR} y={GY - 60} w={CAR_W} color="#FF8A65" t={t} shake={veOn ? 1 : 0} flip />
    <Fueling px={150} py={G + 10} cx={usCap} cy={capY} gy={GY - 60} dir={1} t={t} on={usOn} spill={usP} />
    <Fueling px={930} py={G + 10} cx={veCap} cy={capY} gy={GY - 60} dir={-1} t={t} on={veOn} spill={veP} />
    <Penguin id="doug" x={185} y={GY + 40} h={330} pose={{turn: 0.6, look: [0.3, -0.9], brows: usP > 0.5 ? 'shock' : 'worried', eyeScale: 1 + 0.3 * usP, flapR: 75 + Math.sin(t * 10) * 8, sweat: usP > 0.4, tremble: usP > 0.7 ? 1 : 0}} />
    <div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-Math.abs(Math.sin(t * 6)) * 14 * (veOn ? 1 : 0)}px)`}}>
      <Otter x={895} y={GY + 40} h={310} flip t={t} />
    </div>
    <Vs x={540} y={1060} t={t + 1} />
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
    <Audio src={staticFile('doug-friend-hook.mp3')} volume={1} />
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
