// Supporting cast with different species and silhouettes (so roles read at a glance, like monkey vs gorilla):
// Walrus = the rich landlord / owner class (huge, tusks, top hat). Seagull = the tax man (TAX cap, steals fish).
// Same pen/fill language as the penguin, animated on twos.
import React from 'react';
import {Boil, INK, Shadow, useT2} from './rig';

const LW = 4.5;

export type WalrusPose = {mouth?: number; lids?: number; laugh?: number; flap?: number; look?: number};
// Sits facing left by default (flip = faces right). (x, y) = ground point. hat = top hat + monocle (rich).
export const Walrus = ({x, y, h = 560, id = 'walrus', flip, hat = true, pose = {}}: {x: number; y: number; h?: number; id?: string; flip?: boolean; hat?: boolean; pose?: WalrusPose}) => {
  const t = useT2() + 0.9;
  const {mouth = 0, lids = 0.45, laugh = 0, flap = 0, look = -0.3} = pose;
  const k = h / 520, w = 520 * k;
  const br = 1 + 0.016 * Math.sin(t * 2) + laugh * 0.03 * Math.sin(t * 40);
  const blink = (t % 4.4) < 0.12 ? 0.1 : 1, tw = Math.sin(t * 5) * 2;
  const eye = (cx: number) => <g>
    <ellipse cx={cx} cy={150} rx={20} ry={20 * blink} fill="#fff" stroke={INK} strokeWidth={LW} />
    <circle cx={cx + look * 8} cy={152} r={6} fill={INK} />
    {lids > 0 && <path d={`M${cx - 21} ${150 - 20 + 40 * lids} L${cx + 21} ${150 - 20 + 40 * lids} L${cx + 21} 128 L${cx - 21} 128 Z`} fill="#A87459" stroke={INK} strokeWidth={LW - 1} strokeLinejoin="round" />}
  </g>;
  return <>
    <Shadow x={x} y={y} w={w * 0.9} />
    <svg width={w} height={h} viewBox="0 0 520 520" style={{position: 'absolute', left: x - w / 2, top: y - h, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
      <defs><Boil id={id} amount={1.8 / k} /></defs>
      <g filter={`url(#${id})`} transform={`translate(260 510) scale(1 ${br}) translate(-260 -510)`}>
        <path d="M60 470 C 30 360, 70 230, 170 200 C 300 160, 450 220, 480 360 C 500 450, 470 510, 380 512 L 130 512 C 80 512, 66 496, 60 470 Z" fill="#B98468" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M150 300 C 130 380, 160 470, 240 500 C 300 520, 380 500, 400 440 C 370 470, 300 480, 250 460 C 190 430, 160 370, 150 300 Z" fill="#D4A68A" />
        <path d="M400 260 q 30 30 40 70 M420 300 q 20 26 24 60" fill="none" stroke="#8E5C44" strokeWidth={4} strokeLinecap="round" />
        <g transform={`rotate(${-flap} 140 380)`}><path d="M140 380 C 100 420, 70 480, 110 500 C 150 510, 180 460, 180 400 Z" fill="#A87459" stroke={INK} strokeWidth={LW} strokeLinejoin="round" /></g>
        <path d="M70 200 C 60 110, 140 60, 220 80 C 300 100, 320 190, 290 250 C 260 300, 110 300, 80 260 C 72 242, 70 222, 70 200 Z" fill="#B98468" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        {eye(140)}{eye(220)}
        {mouth > 0.02 && <ellipse cx={180} cy={262 + mouth * 10} rx={34} ry={mouth * 22} fill="#7A1F1F" stroke={INK} strokeWidth={LW - 1} />}
        <path d={`M150 236 L146 ${330 + tw} L162 ${330 + tw} L170 240 Z M200 240 L208 ${330 - tw} L222 ${330 - tw} L214 236 Z`} fill="#FFFDF3" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <ellipse cx={150} cy={226} rx={44} ry={32} fill="#D9B49A" stroke={INK} strokeWidth={LW} />
        <ellipse cx={214} cy={226} rx={44} ry={32} fill="#D9B49A" stroke={INK} strokeWidth={LW} />
        {[[130, 220], [150, 236], [170, 218], [196, 220], [214, 236], [234, 218]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={3.5} fill={INK} />)}
        <ellipse cx={182} cy={200} rx={18} ry={11} fill="#5A3A2A" />
        {hat && <g transform={`rotate(${Math.sin(t * 2.2) * 2} 180 84)`}>
          <ellipse cx={180} cy={86} rx={92} ry={15} fill="#111" stroke={INK} strokeWidth={LW} />
          <path d="M120 84 L126 -30 Q180 -40 234 -30 L240 84 Z" fill="#111" stroke={INK} strokeWidth={LW} />
          <path d="M122 54 L238 54 L239 72 L121 72 Z" fill="#D83A2E" />
        </g>}
        {hat && <><circle cx={220} cy={150} r={30} fill="none" stroke="#E2B13C" strokeWidth={6} /><path d="M248 160 Q 280 240 300 300" fill="none" stroke="#E2B13C" strokeWidth={3} />
          <path d="M260 330 Q 330 360 380 340" fill="none" stroke="#E2B13C" strokeWidth={5} strokeDasharray="10 6" /></>}
      </g>
    </svg>
  </>;
};

export type GullPose = {fly?: boolean; mouth?: number; flap?: number; holding?: boolean; walk?: number | null; angry?: boolean};
// Tax-collector seagull, faces left by default. (x, y) = feet point (or body centre bottom while flying).
export const Seagull = ({x, y, h = 380, id = 'gull', flip, pose = {}}: {x: number; y: number; h?: number; id?: string; flip?: boolean; pose?: GullPose}) => {
  const t = useT2() + 2.3;
  const {fly = false, mouth = 0, holding = false, walk = null, angry = true} = pose;
  const k = h / 420, w = 360 * k;
  const wing = fly ? Math.sin(t * 22) * 50 : (pose.flap ?? 0);
  const bob = fly ? Math.sin(t * 22) * 8 : walk !== null ? -Math.abs(Math.sin(walk * Math.PI * 2)) * 10 : 0;
  const step = walk !== null ? Math.sin(walk * Math.PI * 2) * 14 : 0;
  const blink = (t % 3.7) < 0.12 ? 0.1 : 1;
  return <>
    {!fly && <Shadow x={x} y={y} w={w * 0.6} />}
    <svg width={w} height={h} viewBox="0 0 360 420" style={{position: 'absolute', left: x - w / 2, top: y - h + bob * k, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
      <defs><Boil id={id} amount={1.8 / k} /></defs>
      <g filter={`url(#${id})`}>
        {!fly && <><path d={`M170 330 L${164 + step} 404 M${150 + step} 408 L${180 + step} 408`} stroke="#E8A33A" strokeWidth={8} strokeLinecap="round" />
          <path d={`M206 330 L${212 - step} 404 M${198 - step} 408 L${228 - step} 408`} stroke="#E8A33A" strokeWidth={8} strokeLinecap="round" /></>}
        <path d="M300 250 L352 236 L340 270 Z" fill="#A9B2BA" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M110 200 C 110 140, 170 120, 220 140 C 290 170, 320 240, 300 290 C 280 340, 160 350, 130 300 C 112 270, 110 240, 110 200 Z" fill="#F7F7F7" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <g transform={`rotate(${-wing} 220 200)`}><path d="M200 190 C 260 180, 320 210, 330 260 C 290 250, 240 250, 200 240 Z" fill="#A9B2BA" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
          <path d="M290 236 L330 258 L300 262 Z" fill="#333" /></g>
        <path d="M90 150 C 80 90, 120 60, 160 66 C 200 72, 214 110, 206 150 C 198 186, 110 196, 90 150 Z" fill="#F7F7F7" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <ellipse cx={128} cy={112} rx={10} ry={10 * blink} fill={INK} />
        {angry && <path d="M110 92 L146 104" stroke={INK} strokeWidth={LW + 1} strokeLinecap="round" />}
        <path d={`M98 124 L30 ${132} Q20 140 34 146 L98 ${142 + mouth * 14} Z`} fill="#F2C230" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <circle cx={44} cy={140} r={5} fill="#D83A2E" />
        {mouth > 0.05 && <path d={`M98 136 L40 ${142 + mouth * 10} L98 ${150 + mouth * 16} Z`} fill="#F2C230" stroke={INK} strokeWidth={LW - 1} />}
        <g transform="rotate(-8 150 70)">
          <path d="M96 72 Q150 40 206 70 L206 52 Q150 20 100 50 Z" fill="#2F5DA8" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
          <path d="M96 72 L60 80 Q70 66 98 62 Z" fill="#244A87" stroke={INK} strokeWidth={LW - 1} strokeLinejoin="round" />
          <text x={152} y={60} textAnchor="middle" fontFamily="Architects Daughter" fontSize={26} fill="#fff" fontWeight={700}>TAX</text>
        </g>
        {holding && <g transform="translate(26 150) rotate(-10) scale(0.45)"><path d="M-128 -9 C -90 -49, 18 -55, 82 -9 C 86 -3, 86 5, 82 11 C 18 53, -90 49, -128 9 L -104 1 Z" fill="#41A8EC" stroke={INK} strokeWidth={10} /></g>}
      </g>
    </svg>
  </>;
};
