// EP9 hook "Gas: Iran vs America" — built from the user's own image (1024x1536), sliced into layers and animated (same method as EP8 Libya).
// The image's prices ($0.03/LITER vs $4.32/LITER) are replaced with correct per-gallon prices: Iran $0.11 (~$0.029/L, GlobalPetrolPrices 2026)
// vs USA $4.41 (AAA, Oct 2026) = 40x. On "Same gas." the scene cuts to one oil barrel filling two identical cans.
import React from 'react';
import {AbsoluteFill, Audio, Img, getInputProps, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, back, onTwos} from '../penguin/rig';
import {Captions, Sfx, beat} from '../penguin/edit';
import {cutFX} from '../penguin/acting';
import {SameGas, UsFlag} from './dougLibya';
import TIM from '../data/doug-iran.json';
import CAP from '../data/doug-iran.captions.json';

const P = (i: number) => TIM[i].start;
export const IRAN_HOOK_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 1.2) * 30) / 30;
const RED = '#D83A2E', GREEN = '#239E46', BLUE = '#1F4BA8', CREAM = '#fff';
const K = 1.15, OX = -49, OY = 70; // image px -> canvas px
const X = (x: number) => x * K + OX, Y = (y: number) => y * K + OY;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const bump = (t: number, a: number, d = 0.45) => t > a && t < a + d ? Math.sin(((t - a) / d) * Math.PI) : 0;

// A rectangle of the user's image, drawn at its own place (multiply = the cream background disappears).
const Cut = ({r: [x0, y0, x1, y1], filter}: {r: number[]; filter?: string}) =>
  <div style={{position: 'absolute', left: X(x0), top: Y(y0), width: (x1 - x0) * K, height: (y1 - y0) * K, overflow: 'hidden', mixBlendMode: 'multiply', filter: filter ? `url(#${filter})` : undefined}}>
    <Img src={staticFile('gas/iran.png')} style={{position: 'absolute', left: -x0 * K, top: -y0 * K, width: 1024 * K, height: 1536 * K, maxWidth: 'none'}} />
  </div>;
// Several cuts that move together (origin = image point ox, oy).
const Group = ({cuts, ox, oy, dx = 0, dy = 0, rot = 0, sx = 1, sy = 1, filter}: {cuts: number[][]; ox: number; oy: number; dx?: number; dy?: number; rot?: number; sx?: number; sy?: number; filter?: string}) =>
  <div style={{position: 'absolute', inset: 0, transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg) scale(${sx}, ${sy})`, transformOrigin: `${X(ox)}px ${Y(oy)}px`, mixBlendMode: 'multiply'}}>
    {cuts.map((r, i) => <Cut key={i} r={r} filter={filter} />)}
  </div>;
const WaveFilter = ({id, amount, seed}: {id: string; amount: number; seed: number}) => <svg width={0} height={0} style={{position: 'absolute'}}>
  <filter id={id} x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.008 0.025" numOctaves={1} seed={seed} /><feDisplacementMap in="SourceGraphic" scale={amount} xChannelSelector="R" yChannelSelector="G" /></filter>
</svg>;

// Gas level: a cream cover hides the liquid above the current level, so the can fills up.
const CanFill = ({x0, x1, fill, t}: {x0: number; x1: number; fill: number; t: number}) => {
  const top = 1108, bot = 1372, lvl = bot - (bot - top) * fill;
  if (fill >= 1) return null;
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0}}>
    <path d={`M${X(x0)} ${Y(top - 6)} L${X(x1)} ${Y(top - 6)} L${X(x1)} ${Y(lvl) + Math.sin(t * 9) * 4} Q ${X((x0 + x1) / 2)} ${Y(lvl) - 10} ${X(x0)} ${Y(lvl)} Z`} fill="#fff" opacity={0.88} />
  </svg>;
};

const Arrow = ({x, y, t, swingAt}: {x: number; y: number; t: number; swingAt: number}) => {
  const draw = ease((t - 0.2) / 0.35), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.35);
  const over = sw < 1 ? Math.sin(sw * Math.PI) * 12 : 0, ang = 168 + (12 - 168) * ease(sw) - over;
  return <svg width={10} height={10} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <g transform={`rotate(${ang})`}>
      <path d="M-60 0 Q 30 -26, 120 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={RED} strokeWidth={14} strokeLinecap="round" />
      {draw > 0.9 && <path d="M120 0 L84 -24 M120 0 L86 26" fill="none" stroke={RED} strokeWidth={14} strokeLinecap="round" />}
    </g>
  </svg>;
};
const Txt = ({text, x, y, size, color, at, t, hit = 0, w = 520, sub}: {text: string; x: number; y: number; size: number; color: string; at: number; t: number; hit?: number; w?: number; sub?: string}) => {
  const pop = t < at ? 1 : back((t - at) / 0.3);
  return <div style={{position: 'absolute', left: x - w / 2, width: w, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, lineHeight: 1, color,
    WebkitTextStroke: `${Math.round(size * 0.12)}px #fff`, paintOrder: 'stroke fill', transform: `scale(${pop * (1 + 0.18 * hit)})`}}>
    {text}{sub && <div style={{fontSize: size * 0.36, color: INK, marginTop: 6}}>{sub}</div>}
  </div>;
};
export const IrFlag = ({w = 170}: {w?: number}) => <svg width={w} height={w * 0.63} viewBox="0 0 190 120">
  <rect width={190} height={40} fill="#239F40" /><rect y={40} width={190} height={40} fill="#fff" /><rect y={80} width={190} height={40} fill="#DA0000" />
  <path d="M95 46 C 84 50, 84 70, 95 74 C 106 70, 106 50, 95 46 Z M95 50 L95 72" fill="none" stroke="#DA0000" strokeWidth={4} />
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={6} />
</svg>;

export const IranVersus = ({t}: {t: number}) => {
  const f = Math.floor(t * 30), seedA = (f / 3 | 0) % 9 + 1, seedB = ((f / 3 | 0) + 4) % 9 + 1;
  const swing = P(1) + 0.85;
  const irHit = bump(t, 0.6, 0.5), usHit = bump(t, swing + 0.15, 0.5);
  const person = (k: number, hit: number, side: number) => ({dy: Math.sin(t * 3 + k) * 8 - hit * 40, rot: Math.sin(t * 2.2 + k) * 2.5 + hit * 4 * side, sx: 1 + 0.015 * Math.sin(t * 2.6 + k) + hit * 0.08, sy: 1 + 0.02 * Math.sin(t * 2.6 + k) + hit * 0.08});
  const shake = (a: number, b: number) => t > a && t < b ? Math.sin(t * 50) * 6 : 0;
  const why = back(t / 0.3), q = Math.sin(t * 5) * 6;
  return <>
    <WaveFilter id="waveA" amount={11} seed={seedA} /><WaveFilter id="waveB" amount={11} seed={seedB} />
    {/* WHY? from the user's image */}
    <Group cuts={[[280, 95, 690, 345]]} ox={480} oy={300} sx={0.6 + 0.4 * cl(why)} sy={0.6 + 0.4 * cl(why)} />
    <Group cuts={[[688, 50, 798, 242]]} ox={740} oy={240} rot={q} sx={cl(back((t - 0.15) / 0.3))} sy={cl(back((t - 0.15) / 0.3))} />
    <Arrow x={540} y={640} t={t} swingAt={swing} />
    {/* busts */}
    <Group cuts={[[0, 150, 280, 420], [0, 420, 318, 574]]} ox={150} oy={574} {...person(0, irHit, 1)} />
    <Group cuts={[[730, 222, 1024, 300], [700, 245, 730, 300], [640, 300, 1024, 574]]} ox={830} oy={574} {...person(2, usHit, -1)} />
    <Txt text="IRAN" x={165} y={170} size={78} color={GREEN} at={-1} t={t} hit={irHit} w={300} />
    <Txt text="USA" x={978} y={225} size={78} color={BLUE} at={-1} t={t} hit={usHit} w={240} />
    {/* prices (corrected: per gallon) */}
    <div style={{position: 'absolute', left: 0, top: shake(0.6, 1.3)}}><Txt text="$0.11" sub="/ GALLON" x={X(250)} y={Y(578)} size={108} color={GREEN} at={-1} t={t} hit={irHit} w={480} /></div>
    <div style={{position: 'absolute', left: shake(swing + 0.15, swing + 0.9), top: 0}}><Txt text="$4.41" sub="/ GALLON" x={X(800)} y={Y(578)} size={108} color={RED} at={-1} t={t} hit={usHit} w={480} /></div>
    {/* waving flags */}
    <Cut r={[150, 726, 365, 866]} filter="waveA" />
    <Cut r={[680, 726, 890, 866]} filter="waveB" />
    {/* jerry cans fill while each side is spoken */}
    <Group cuts={[[68, 866, 428, 1400]]} ox={250} oy={1400} rot={Math.sin(t * 5) * 0.8} />
    <Group cuts={[[592, 866, 958, 1400]]} ox={775} oy={1400} rot={Math.sin(t * 5 + 1) * 0.8} />
    <CanFill x0={95} x1={400} fill={0.25 + 0.75 * ease((t - 0.3) / 1.0)} t={t} />
    <CanFill x0={620} x1={930} fill={0.25 + 0.75 * ease((t - swing) / 0.6)} t={t} />
    <Group cuts={[[430, 1005, 598, 1165]]} ox={514} oy={1085} rot={Math.sin(t * 4) * 4} sx={cl(back((t - 0.4) / 0.3))} sy={cl(back((t - 0.4) / 0.3))} />
    {/* Doug in the middle, under VS */}
    <Penguin id="doug" x={540} y={1720} h={300} pose={{brows: 'worried', eyeScale: 1.1, look: [t < swing ? -0.6 : 0.6, 0], sweat: t > swing, tremble: usHit * 0.8}} />
    <div style={{position: 'absolute', left: 600, top: 1390 + Math.sin(t * 6) * 8, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 100, color: INK, transform: 'rotate(14deg)'}}>?</div>
  </>;
};

export const DougIranHook = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS, same = tc >= P(2), swing = P(1) + 0.85;
  const toL = ease((tc - 0.5) / 0.5) * (tc < swing ? 1 : 0), toR = ease((tc - swing) / 0.4) * (same ? 0 : 1);
  const s = (same ? 1 + 0.02 * (tc - P(2)) : 1 + 0.15 * (toL + toR)) * (tc < 0.5 ? 1 : beat(tc, TIM)), fx = same ? 540 : 540 - 190 * toL + 190 * toR, fy = same ? 960 : 860;
  return <AbsoluteFill style={{background: CREAM, overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, [{at: 0}, {at: P(2), fx: 'zoom'}])}>
      <AbsoluteFill style={{background: same ? '#fff' : CREAM, transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>
        {same ? <div style={{position: 'absolute', inset: 0, transform: 'translateY(140px)'}}>
          <SameGas t={t} at={P(2)} left={<IrFlag />} right={<UsFlag />} priceL="$0.11" priceR="$4.41" colorL={GREEN} colorR={RED} />
        </div> : <IranVersus t={t} />}
      </AbsoluteFill>
    </AbsoluteFill>
    {!getInputProps().noCaptions && <Captions t={tc} phrases={TIM} place={CAP} bare />}
    <Audio src={staticFile('doug-iran-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.1} name="user-whoosh" vol={0.25} />
    <Sfx at={0.6} name="user-cash-register" vol={0.3} />
    <Sfx at={swing} name="user-whoosh" vol={0.3} />
    <Sfx at={swing + 0.15} name="user-boom" vol={0.45} />
    <Sfx at={P(2) - 0.05} name="user-whoosh" vol={0.3} />
    <Sfx at={P(2) + 0.5} name="user-ting" vol={0.35} />
  </AbsoluteFill>;
};
