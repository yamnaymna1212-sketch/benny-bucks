// EP7 "Why do rich countries fight wars over cars?" — tariffs: cheap China car vs USA car, Boss Bear's 100% TAX wall.
// Hook first (approval), full episode after. Line timings: studio/src/data/doug-tariff.json.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos} from '../penguin/rig';
import {Stamp} from '../penguin/world';
import {cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {Arrow, BossBear, Puzzled, UsFlag, Why} from './dougVenezuela';
import TIM from '../data/doug-tariff.json';

export const DOUG_TARIFF_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 2.4) * 30) / 30;
const G = 1400;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';
// hook beats (s): arrow swings to the USA, the tax wall slams down, the cheap price doubles
const US = 1.35, WALL = 2.2, DOUBLE = 3.0;

// ---------- props ----------
export const CnFlag = () => <g>
  <rect width={190} height={120} fill="#DE2910" />
  <path d="M38 22 L44 40 L63 40 L48 51 L54 69 L38 58 L22 69 L28 51 L13 40 L32 40 Z" fill="#FFDE00" />
  {[[78, 14], [92, 30], [92, 52], [78, 66]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={6} fill="#FFDE00" />)}
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
</g>;

// Side name in big caps with its waving flag in front (replaces the flag poles: no room under the price cards).
const SideLabel = ({text, flag, x, y, at, t}: {text: string; flag: 'us' | 'cn'; x: number; y: number; at: number; t: number}) => {
  const p = ease((t - at) / 0.25), wave = Math.sin(t * 5) * 3;
  return <div style={{position: 'absolute', left: x - 270, width: 540, top: y, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, opacity: p, transform: `scale(${0.5 + 0.5 * p})`}}>
    <svg width={120} height={78} viewBox="0 0 190 124" style={{overflow: 'visible'}}><g transform={`translate(0 ${wave}) skewY(${wave})`}>{flag === 'us' ? <UsFlag /> : <CnFlag />}</g></svg>
    <span style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 76, color: INK}}>{text}</span>
  </div>;
};

// Small cheap electric hatchback (mint, lightning bolt on the door).
export const CheapCar = ({x, y, w = 380, t}: {x: number; y: number; w?: number; t: number}) =>
  <svg width={w} height={w * 0.55} viewBox="0 0 400 220" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.55, overflow: 'visible'}}>
    <ellipse cx={200} cy={214} rx={180} ry={9} fill="#DDE6EC" />
    <path d="M30 170 L30 120 Q 34 96 70 92 L110 46 Q 124 30 150 30 L270 30 Q 300 30 316 52 L344 92 Q 376 98 376 130 L376 170 Z" fill="#8FD9B6" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M124 90 L150 50 L204 50 L204 90 Z M222 90 L222 50 L268 50 Q 288 50 300 70 L314 90 Z" fill="#CDEBFA" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M196 106 L176 140 L198 140 L184 168 L222 126 L200 126 L214 106 Z" fill="#F5C518" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={362} cy={118} r={9} fill="#FFF3B0" stroke={INK} strokeWidth={4} />
    {[100, 300].map((cx) => <g key={cx} transform={`translate(${cx} 172) rotate(${t * 40})`}>
      <circle r={36} fill={INK} /><circle r={16} fill="#BBB" /><path d="M-16 0 L16 0" stroke={INK} strokeWidth={4} />
    </g>)}
  </svg>;

// Sleek white electric sedan, "TESLA" written on the door (text only, no logo).
export const BigCar = ({x, y, w = 450, t}: {x: number; y: number; w?: number; t: number}) =>
  <svg width={w} height={w * 0.45} viewBox="0 0 500 225" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.45, overflow: 'visible'}}>
    <ellipse cx={250} cy={219} rx={230} ry={9} fill="#DDE6EC" />
    <path d="M20 170 L20 128 Q 24 108 70 102 L150 50 Q 180 34 230 34 L300 34 Q 350 36 400 86 L460 104 Q 486 112 486 140 L486 170 Z" fill="#FBFBF9" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M168 98 L196 60 Q 210 50 240 50 L296 50 Q 336 52 372 98 Z" fill="#2B2F36" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <line x1={272} y1={50} x2={272} y2={98} stroke="#FBFBF9" strokeWidth={6} />
    <text x={262} y={146} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={38} letterSpacing={8} fill={RED}>TESLA</text>
    <path d="M470 118 L486 122" stroke={RED} strokeWidth={8} strokeLinecap="round" />
    {[110, 390].map((cx) => <g key={cx} transform={`translate(${cx} 172) rotate(${t * 40})`}>
      <circle r={42} fill={INK} /><circle r={22} fill="#9AA0A6" /><path d="M-6 -18 A 20 20 0 0 1 14 -12" stroke={RED} strokeWidth={8} fill="none" />
    </g>)}
  </svg>;

// Snow leopard (car seller from China): pale coat, rosettes, thick tail, green eyes, red bow tie.
export const SnowLeopard = ({x, y, h = 420, wave = 0, grin}: {x: number; y: number; h?: number; wave?: number; grin?: boolean}) => {
  const t = useCurrentFrame() / FPS, bob = Math.sin(t * 3.3) * 3;
  const spots = [[110, 250], [200, 230], [140, 310], [220, 300], [95, 340], [185, 360]];
  return <svg width={h * 0.8} height={h} viewBox="0 0 320 400" style={{position: 'absolute', left: x - h * 0.4, top: y - h + bob, overflow: 'visible'}}>
    <path d="M250 350 C 330 330, 330 230, 290 200" fill="none" stroke={INK} strokeWidth={42} strokeLinecap="round" />
    <path d="M250 350 C 330 330, 330 230, 290 200" fill="none" stroke="#ECE8DF" strokeWidth={30} strokeLinecap="round" />
    <path d="M70 395 C 50 280, 80 190, 160 190 C 240 190, 270 280, 250 395 Z" fill="#ECE8DF" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {spots.map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={11} fill="none" stroke="#6B6B6B" strokeWidth={6} strokeDasharray="10 6" />)}
    <path d={`M80 230 Q ${30 - wave * 30} ${200 - wave * 90} ${40 - wave * 10} ${160 - wave * 70}`} fill="none" stroke={INK} strokeWidth={30} strokeLinecap="round" />
    <path d={`M80 230 Q ${30 - wave * 30} ${200 - wave * 90} ${40 - wave * 10} ${160 - wave * 70}`} fill="none" stroke="#ECE8DF" strokeWidth={18} strokeLinecap="round" />
    <path d="M140 196 L160 212 L180 196 L180 222 L160 212 L140 222 Z" fill={RED} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={100} cy={52} r={24} fill="#ECE8DF" stroke={INK} strokeWidth={7} /><circle cx={220} cy={52} r={24} fill="#ECE8DF" stroke={INK} strokeWidth={7} />
    <ellipse cx={160} cy={112} rx={92} ry={78} fill="#ECE8DF" stroke={INK} strokeWidth={7} />
    {[[96, 80], [224, 80], [120, 50], [200, 50], [160, 44]].map(([sx, sy], i) => <circle key={i} cx={sx} cy={sy} r={7} fill="#6B6B6B" />)}
    <ellipse cx={126} cy={104} rx={14} ry={16} fill="#7BC67E" stroke={INK} strokeWidth={4} /><ellipse cx={194} cy={104} rx={14} ry={16} fill="#7BC67E" stroke={INK} strokeWidth={4} />
    <ellipse cx={126} cy={106} rx={4} ry={10} fill={INK} /><ellipse cx={194} cy={106} rx={4} ry={10} fill={INK} />
    <path d="M148 134 L172 134 L160 148 Z" fill="#E58FA0" stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <path d={grin ? 'M128 152 Q160 182 192 152' : 'M140 156 Q160 166 180 156'} fill={grin ? '#fff' : 'none'} stroke={INK} strokeWidth={5} strokeLinecap="round" />
    {[-1, 1].map((s) => <path key={s} d={`M${160 + s * 40} 142 L${160 + s * 92} 132 M${160 + s * 40} 150 L${160 + s * 92} 154`} stroke={INK} strokeWidth={3} />)}
  </svg>;
};

// Big price card above each car; `old` = struck-through old price shown above the new one.
const PriceCard = ({x, y, price, color, at, t, old}: {x: number; y: number; price: string; color: string; at: number; t: number; old?: string}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x - 210, width: 420, top: y, textAlign: 'center', opacity: p, transform: `scale(${0.5 + 0.5 * p}) rotate(${old ? -4 : 0}deg)`}}>
    {old && <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 54, color: INK, textDecoration: `line-through 8px ${RED}`}}>{old}</div>}
    <div style={{display: 'inline-block', background: '#fff', border: `7px solid ${INK}`, borderRadius: 22, padding: '0 22px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 92, color}}>{price}</div>
  </div>;
};

// Ice-block wall that slams down between the two sides, with the red 100% TAX banner.
const TaxWall = ({t}: {t: number}) => {
  if (t < WALL - 0.25) return null;
  const p = ease((t - (WALL - 0.25)) / 0.25), shake = t - WALL < 0.3 && t > WALL ? Math.sin(t * 90) * 8 * (1 - (t - WALL) / 0.3) : 0;
  const top = 780 - 980 * (1 - p);
  return <>
    <div style={{position: 'absolute', left: 470 + shake, top, width: 140, height: G - 780, background: '#D7EEF9', border: `7px solid ${INK}`, borderRadius: 8, boxSizing: 'border-box',
      backgroundImage: 'linear-gradient(#9FC8DD 5px, transparent 5px)', backgroundSize: '100% 100px'}} />
    <div style={{position: 'absolute', left: 540 - 220 + shake, top: top + 70, width: 440, transform: 'rotate(-6deg)', background: RED, border: `8px solid ${INK}`, borderRadius: 16,
      textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 92, color: '#fff', letterSpacing: 2}}>100% TAX</div>
  </>;
};

const Hook = ({t}: {t: number}) => {
  const lookR = t >= US && t < WALL, doubled = t >= DOUBLE;
  return <>
    <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
    <Why t={t} />
    <SideLabel text="CHINA" flag="cn" x={250} y={575} at={0.3} t={t} />
    <SideLabel text="USA" flag="us" x={830} y={575} at={US} t={t} />
    {doubled
      ? <PriceCard x={250} y={660} price="$20,000" old="$10,000" color={RED} at={DOUBLE} t={t} />
      : <PriceCard x={250} y={720} price="$10,000" color={GREEN} at={0.4} t={t} />}
    <PriceCard x={830} y={720} price="$40,000" color={RED} at={US + 0.1} t={t} />
    <SnowLeopard x={150} y={G - 50} h={470} wave={t < US ? Math.abs(Math.sin(t * 6)) : 0} grin={!doubled} />
    <CheapCar x={250} y={G + 10} w={420} t={0} />
    <BigCar x={830} y={G + 10} w={460} t={0} />
    <TaxWall t={t} />
    {t >= WALL && <BossBear x={700} y={G + 40} h={320} mouth={t < WALL + 0.6 ? 0.5 : 0} />}
    <Arrow x={540} y={500} t={t} swingAt={US} />
    <Penguin id="doug" x={540} y={1490} h={270} pose={{turn: lookR ? 0.5 : -0.5, look: [lookR ? 0.8 : -0.8, -0.3], brows: doubled ? 'shock' : lookR ? 'worried' : 'happy', eyeScale: doubled ? 1.3 : 1.05, pupil: doubled ? 0.5 : 1, beak: doubled ? 'frown' : 'smile', flapR: 35, flapL: 35, sweat: doubled}} />
    {doubled && <Puzzled x={620} y={1180} t={t} />}
    <Stamp text="SAME CAR" x={250} y={1250} at={DOUBLE + 0.8} color={RED} size={64} />
  </>;
};

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: 'cut' | 'swipe' | 'zoom' | 'iris' | 'pop'};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
];

export const DougTariff = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s = 1, fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (China, then USA), back out when the wall drops, then onto the doubled price
    const toCN = ease((tc - 0.6) / 0.5) * (tc < US ? 1 : 0), toUS = ease((tc - US) / 0.45) * (tc < WALL ? 1 : 0), toTag = ease((tc - DOUBLE) / 0.4);
    s = 1 + 0.22 * (toCN + toUS) + 0.2 * toTag; fx = 540 - 270 * toCN + 270 * toUS - 200 * toTag; fy = 960 + 60 * (toCN + toUS) + 40 * toTag;
  }
  s *= tc < 1.0 ? 1 : beat(tc, TIM);
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.4} name="user-cash-register" vol={0.3} />
    <Sfx at={US - 0.05} name="user-whoosh" vol={0.3} />
    <Sfx at={US + 0.1} name="user-cash-register" vol={0.3} />
    <Sfx at={WALL} name="user-boom" vol={0.45} />
    <Sfx at={DOUBLE} name="user-slap" vol={0.4} />
    <Sfx at={DOUBLE + 0.8} name="user-wrong" vol={0.35} />
  </AbsoluteFill>;
};
