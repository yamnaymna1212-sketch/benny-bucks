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

// Puffin: the shop owner (snow cones, groceries). Small, stripy beak, apron. Faces left by default.
export type PuffinPose = {mouth?: number; lids?: number; smirk?: boolean; flap?: number; look?: number};
export const Puffin = ({x, y, h = 360, id = 'puffin', flip, pose = {}}: {x: number; y: number; h?: number; id?: string; flip?: boolean; pose?: PuffinPose}) => {
  const t = useT2() + 3.1;
  const {mouth = 0, lids = 0, smirk = false, flap = 0, look = -0.4} = pose;
  const k = h / 400, w = 300 * k, br = 1 + 0.014 * Math.sin(t * 2.6), blink = (t % 3.9) < 0.12 ? 0.1 : 1;
  return <>
    <Shadow x={x} y={y} w={w * 0.7} />
    <svg width={w} height={h} viewBox="0 0 300 400" style={{position: 'absolute', left: x - w / 2, top: y - h, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
      <defs><Boil id={id} amount={1.8 / k} /></defs>
      <g filter={`url(#${id})`} transform={`translate(150 392) scale(1 ${br}) translate(-150 -392)`}>
        <path d="M110 384 L96 396 L132 396 Z M180 384 L166 396 L204 396 Z" fill="#F08A24" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M150 60 C 230 60, 256 170, 256 270 C 256 350, 220 388, 150 388 C 80 388, 44 350, 44 270 C 44 170, 70 60, 150 60 Z" fill="#1F1F1F" stroke={INK} strokeWidth={LW} />
        <path d="M150 190 C 210 190, 224 260, 222 310 C 220 360, 190 380, 150 380 C 110 380, 80 360, 78 310 C 76 260, 90 190, 150 190 Z" fill="#FFF8EA" />
        <path d="M84 300 L216 300 L210 372 Q150 392 90 372 Z" fill="#E9F4FB" stroke={INK} strokeWidth={LW - 1} strokeLinejoin="round" />
        <path d="M120 300 L120 270 M180 300 L180 270" stroke={INK} strokeWidth={3} />
        <ellipse cx={150} cy={140} rx={78} ry={62} fill="#F3F3F0" stroke={INK} strokeWidth={LW - 1} />
        <ellipse cx={122} cy={128} rx={14} ry={14 * blink} fill="#fff" stroke={INK} strokeWidth={LW - 1} /><circle cx={122 + look * 6} cy={130} r={5} fill={INK} />
        <ellipse cx={178} cy={128} rx={14} ry={14 * blink} fill="#fff" stroke={INK} strokeWidth={LW - 1} /><circle cx={178 + look * 6} cy={130} r={5} fill={INK} />
        {lids > 0 && <path d={`M106 ${114 + 28 * lids} L138 ${114 + 28 * lids} M162 ${114 + 28 * lids} L194 ${114 + 28 * lids}`} stroke={INK} strokeWidth={LW} strokeLinecap="round" />}
        {smirk && <path d="M104 106 L136 112 M164 112 L196 104" stroke={INK} strokeWidth={LW} strokeLinecap="round" />}
        {mouth > 0.03 && <path d={`M118 166 L182 166 L150 ${176 + mouth * 26} Z`} fill="#7A1F1F" />}
        <path d="M112 150 Q150 136 188 150 L150 200 Z" fill="#E8543A" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M128 154 L150 186 L172 154" fill="none" stroke="#F2C230" strokeWidth={8} />
        <path d="M118 151 Q150 140 182 151" fill="none" stroke="#4A6FA5" strokeWidth={6} />
        <g transform={`rotate(${-flap} 60 230)`}><path d="M60 230 C 30 270, 26 320, 44 340 C 60 320, 72 280, 74 240 Z" fill="#1F1F1F" stroke={INK} strokeWidth={LW} strokeLinejoin="round" /></g>
        <g transform={`rotate(${flap} 240 230)`}><path d="M240 230 C 270 270, 274 320, 256 340 C 240 320, 228 280, 226 240 Z" fill="#1F1F1F" stroke={INK} strokeWidth={LW} strokeLinejoin="round" /></g>
      </g>
    </svg>
  </>;
};

// Big Seal: runs the Federal Fish Reserve (the money maker). Sits upright, suit + red tie + glasses.
export type BigSealPose = {mouth?: number; lids?: number; flap?: number; look?: number; sweat?: boolean};
export const BigSeal = ({x, y, h = 520, id = 'bigseal', flip, pose = {}}: {x: number; y: number; h?: number; id?: string; flip?: boolean; pose?: BigSealPose}) => {
  const t = useT2() + 4.2;
  const {mouth = 0, lids = 0.2, flap = 0, look = -0.3} = pose;
  const k = h / 520, w = 400 * k, br = 1 + 0.012 * Math.sin(t * 2.1), blink = (t % 4.3) < 0.12 ? 0.1 : 1, wh = Math.sin(t * 6) * 2;
  return <>
    <Shadow x={x} y={y} w={w * 0.8} />
    <svg width={w} height={h} viewBox="0 0 400 520" style={{position: 'absolute', left: x - w / 2, top: y - h, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
      <defs><Boil id={id} amount={1.8 / k} /></defs>
      <g filter={`url(#${id})`} transform={`translate(200 512) scale(1 ${br}) translate(-200 -512)`}>
        <path d="M250 500 L330 470 C 344 466, 352 480, 340 490 L 300 512 Z" fill="#7C838A" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M120 170 C 80 260, 70 420, 100 500 L 300 512 C 320 420, 300 260, 260 170 Z" fill="#8E959C" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M120 230 C 96 300, 92 420, 110 500 L 290 508 C 304 420, 300 300, 276 230 L 200 300 Z" fill="#2B3440" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M160 236 L200 300 L240 236 Z" fill="#fff" stroke={INK} strokeWidth={LW - 1} />
        <path d="M192 244 L208 244 L204 258 L214 330 L200 346 L186 330 L196 258 Z" fill="#D83A2E" stroke={INK} strokeWidth={LW - 1} strokeLinejoin="round" />
        <g transform={`rotate(${-flap} 120 280)`}><path d="M120 280 C 80 320, 60 380, 80 400 C 100 396, 130 340, 140 300 Z" fill="#2B3440" stroke={INK} strokeWidth={LW} strokeLinejoin="round" /></g>
        <path d="M110 120 C 100 50, 160 20, 210 30 C 270 42, 290 110, 270 170 C 250 220, 140 224, 116 180 C 110 162, 110 140, 110 120 Z" fill="#8E959C" stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M130 170 C 160 200, 230 204, 262 172 C 240 214, 150 214, 130 170 Z" fill="#C3C8CD" />
        <ellipse cx={162} cy={104} rx={9} ry={9 * blink} fill={INK} /><ellipse cx={226} cy={100} rx={9} ry={9 * blink} fill={INK} />
        <circle cx={162 + look * 4} cy={104} r={24} fill="none" stroke={INK} strokeWidth={4} /><circle cx={226 + look * 4} cy={100} r={24} fill="none" stroke={INK} strokeWidth={4} />
        <path d="M186 102 L202 100" stroke={INK} strokeWidth={4} />
        {lids > 0 && <path d={`M146 ${92 + 20 * lids} L178 ${92 + 20 * lids} M210 ${88 + 20 * lids} L242 ${88 + 20 * lids}`} stroke={INK} strokeWidth={LW} strokeLinecap="round" />}
        <ellipse cx={192} cy={136} rx={16} ry={11} fill={INK} />
        <path d={`M172 ${156 + mouth * 4} Q192 ${162 + mouth * 20} 212 ${156 + mouth * 4}`} fill={mouth > 0.1 ? '#7A1F1F' : 'none'} stroke={INK} strokeWidth={LW} strokeLinecap="round" />
        {[-1, 0, 1].map((i) => <path key={i} d={`M170 ${140 + i * 8} L130 ${136 + i * 14 + wh}`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />)}
        {[-1, 0, 1].map((i) => <path key={`r${i}`} d={`M214 ${140 + i * 8} L254 ${136 + i * 14 - wh}`} stroke={INK} strokeWidth={2.5} strokeLinecap="round" />)}
      </g>
    </svg>
  </>;
};

// Fox the Banker: Arctic fox (white fur, pointy ears, bushy tail), navy suit + red tie, sly half-lidded eyes. Front view.
// pose.flap raises his right arm (holds a card reader when holding), pocket = how full his suit pocket is (0..1).
export type FoxPose = {mouth?: number; lids?: number; laugh?: number; flap?: number; look?: number; holding?: boolean; pocket?: number; smirk?: boolean};
export const Fox = ({x, y, h = 520, id = 'fox', flip, pose = {}}: {x: number; y: number; h?: number; id?: string; flip?: boolean; pose?: FoxPose}) => {
  const t = useT2() + 2.3;
  const {mouth = 0, lids = 0.4, laugh = 0, flap = 0, look = 0, holding = false, pocket = 0, smirk = true} = pose;
  const k = h / 520, w = 400 * k;
  const br = 1 + 0.014 * Math.sin(t * 2.4) + laugh * 0.03 * Math.sin(t * 40), blink = (t % 4.1) < 0.12 ? 0.1 : 1;
  const tail = Math.sin(t * 2.6) * 8, FUR = '#F7F9FB', FUR2 = '#DCE4EA', SUIT = '#26324A';
  const eye = (cx: number) => <g>
    <ellipse cx={cx} cy={150} rx={19} ry={17 * blink} fill="#fff" stroke={INK} strokeWidth={LW} />
    <circle cx={cx + look * 7} cy={152} r={7} fill="#3E8FB0" stroke={INK} strokeWidth={2} /><circle cx={cx + look * 7} cy={152} r={3} fill={INK} />
    {lids > 0 && <path d={`M${cx - 20} ${133 + 34 * lids} L${cx + 20} ${133 + 34 * lids} L${cx + 20} 130 L${cx - 20} 130 Z`} fill={FUR2} stroke={INK} strokeWidth={LW - 1} strokeLinejoin="round" />}
  </g>;
  return <>
    <Shadow x={x} y={y} w={w * 0.8} />
    <svg width={w} height={h} viewBox="0 0 400 520" style={{position: 'absolute', left: x - w / 2, top: y - h, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
      <defs><Boil id={id} amount={1.8 / k} /></defs>
      <g filter={`url(#${id})`} transform={`translate(200 512) scale(1 ${br}) translate(-200 -512)`}>
        {/* bushy tail */}
        <g transform={`rotate(${tail} 270 440)`}><path d="M270 450 C 340 440, 390 380, 380 300 C 376 270, 352 262, 346 290 C 336 350, 300 400, 262 410 Z" fill={FUR} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
          <path d="M376 296 C 372 276, 356 270, 350 290 C 358 300, 368 302, 376 296 Z" fill={FUR2} /></g>
        {/* legs + shoes */}
        <path d="M150 440 L146 500 L186 500 L190 440 Z M210 440 L214 500 L254 500 L250 440 Z" fill={SUIT} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M134 500 Q140 486 186 490 L188 512 L132 512 Z M212 490 Q260 486 266 500 L268 512 L212 512 Z" fill="#111" stroke={INK} strokeWidth={LW - 1} strokeLinejoin="round" />
        {/* suit body */}
        <path d="M120 250 C 110 320, 116 410, 130 452 L 270 452 C 284 410, 290 320, 280 250 C 250 228, 150 228, 120 250 Z" fill={SUIT} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M168 238 L200 318 L232 238 Z" fill="#fff" stroke={INK} strokeWidth={LW - 1} strokeLinejoin="round" />
        <path d="M193 248 L207 248 L204 262 L213 320 L200 336 L187 320 L196 262 Z" fill="#D83A2E" stroke={INK} strokeWidth={LW - 1} strokeLinejoin="round" />
        <path d="M168 238 L190 300 L150 270 Z M232 238 L210 300 L250 270 Z" fill="#33415E" stroke={INK} strokeWidth={LW - 1} strokeLinejoin="round" />
        {/* pocket (bulges as it fills) */}
        <path d={`M214 ${372 - pocket * 14} Q236 ${360 - pocket * 30} 258 ${372 - pocket * 14} L256 404 Q236 ${410 + pocket * 16} 216 404 Z`} fill="#33415E" stroke={INK} strokeWidth={LW - 1} strokeLinejoin="round" />
        {pocket > 0.05 && <path d={`M222 ${370 - pocket * 16} L236 ${346 - pocket * 30} L250 ${370 - pocket * 16}`} fill="#CFE8C8" stroke={INK} strokeWidth={3} />}
        {[300, 340].map((yy) => <circle key={yy} cx={200} cy={yy + 30} r={5} fill="#E2B13C" stroke={INK} strokeWidth={2} />)}
        {/* left arm (on hip) */}
        <path d="M124 262 C 96 300, 92 350, 116 378 C 128 380, 136 372, 132 360 C 120 340, 124 310, 140 286 Z" fill={SUIT} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <circle cx={122} cy={378} r={15} fill={FUR} stroke={INK} strokeWidth={LW - 1} />
        {/* right arm (raise with flap) */}
        <g transform={`rotate(${-flap} 276 266)`}>
          <path d="M276 262 C 304 300, 310 350, 290 380 C 278 384, 268 376, 272 364 C 284 340, 280 310, 262 286 Z" fill={SUIT} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
          <circle cx={284} cy={380} r={15} fill={FUR} stroke={INK} strokeWidth={LW - 1} />
          {holding && <g transform="translate(262 330)"><rect x={0} y={0} width={70} height={110} rx={12} fill="#3A3F47" stroke={INK} strokeWidth={LW} />
            <rect x={10} y={12} width={50} height={30} rx={4} fill="#9EE6A0" stroke={INK} strokeWidth={3} />
            {[0, 1, 2].map((r) => [0, 1, 2].map((c) => <rect key={`${r}${c}`} x={12 + c * 17} y={54 + r * 16} width={12} height={10} rx={2} fill="#C9CED4" />))}</g>}
        </g>
        {/* head: ears, face, cheek fluff, snout */}
        <path d="M118 120 L104 22 L176 82 Z M282 120 L296 22 L224 82 Z" fill={FUR} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M124 104 L116 46 L160 84 Z M276 104 L284 46 L240 84 Z" fill="#E9C9CF" />
        <path d="M200 60 C 270 60, 300 110, 296 170 C 310 196, 290 222, 262 224 C 240 246, 160 246, 138 224 C 110 222, 90 196, 104 170 C 100 110, 130 60, 200 60 Z" fill={FUR} stroke={INK} strokeWidth={LW} strokeLinejoin="round" />
        <path d="M150 196 C 170 186, 230 186, 250 196 C 244 226, 156 226, 150 196 Z" fill={FUR2} />
        {eye(160)}{eye(240)}
        <path d={`M138 120 L182 ${smirk ? 132 : 126} M262 120 L218 ${smirk ? 128 : 126}`} stroke={INK} strokeWidth={LW + 1} strokeLinecap="round" />
        <path d="M184 176 Q200 168 216 176 Q208 192 200 192 Q192 192 184 176 Z" fill={INK} />
        {mouth + laugh > 0.05 ? <path d={`M176 204 Q200 ${210 + (mouth + laugh * 0.8) * 26} 228 204 Z`} fill="#7A1F1F" stroke={INK} strokeWidth={LW - 1} strokeLinejoin="round" />
          : <path d={smirk ? 'M178 206 Q204 214 226 198' : 'M180 206 Q200 212 220 206'} fill="none" stroke={INK} strokeWidth={LW} strokeLinecap="round" />}
      </g>
    </svg>
  </>;
};
