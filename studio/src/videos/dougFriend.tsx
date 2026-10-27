// EP7 "Gas: Doug (USA) vs his friend (Venezuela) — 3 reasons". Hook first (approval), full episode after.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {FlagPump, Label, Vs} from './dougVenezuela';

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

export const Hook = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: 538, top: 400, width: 6, height: 1100, background: INK, opacity: 0.85}} />
  <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
  <Title t={t} />
  <Label text="USA" x={270} y={400} at={0} t={t + 1} />
  <Label text="VENEZUELA" x={810} y={400} at={0} t={t + 1} />
  <FlagPump x={270} y={G} price="$66" unit="/ TANK" flag="us" top={RED} t={t} color={RED} fill={1} />
  <FlagPump x={810} y={G} price="$2" unit="/ TANK" flag="ve" top="#F5C518" t={t} color={GREEN} fill={1} />
  <Penguin id="doug" x={270} y={G + 330} h={400} pose={{turn: 0.4, look: [0.5, -0.4], brows: 'worried', eyeScale: 1.2}} />
  <Otter x={810} y={G + 330} h={400} flip t={t} />
  <Vs x={540} y={980} t={t + 1} />
</>;

export const DOUG_FRIEND_SECONDS = 5;
export const DougFriend = () => {
  const frame = useCurrentFrame(), t = onTwos(frame);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <Hook t={Math.max(t, frame / FPS)} />
  </AbsoluteFill>;
};
