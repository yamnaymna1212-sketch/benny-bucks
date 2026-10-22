// EP7 "Sanctions" — hook preview first (user picked: "Why does America punish Iran... when it makes YOUR gas more expensive?").
// Layout from the user's reference image: two floating islands (USA green / Iran desert), Doug in the middle on an ice floe
// in the sea. Leaders are animals with their signature heads (gold-hair polar bear / turbaned musk ox).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos, talk} from '../penguin/rig';
import {Captions, Sfx, beat} from '../penguin/edit';
import {BigWord, FishFlight, PriceTag, Thought, Title} from '../penguin/world';
import {BigSeal, Seagull, Walrus} from '../penguin/cast';
import {Fx, cutFX} from '../penguin/acting';
import {MoneyBag, Refinery, Snowfall, Snowmobile} from './dougGas';
import {Bill, Fox} from './dougLaundering';
import EP from '../data/doug-sanctions.json';
import TIM from '../data/doug-sanctions-hook.json';

export const DOUG_SANCTIONS_HOOK_SECONDS = 4;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const RED = '#D83A2E', GREEN = '#2E9E4F';

// word times in the hook voice (syllable-aligned)
const W = {america: 0.25, punish: 0.75, iran: 1.12, your: 1.92, gas: 2.1, expensive: 2.54, end: 3.14};

// ---------- flags ----------
const UsFlag = () => <g>
  <rect width={150} height={95} fill="#fff" />
  {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} y={i * 13.8} width={150} height={6.9} fill="#B22234" />)}
  <rect width={66} height={51} fill="#3C3B6E" />
  {Array.from({length: 9}, (_, i) => <circle key={i} cx={12 + (i % 3) * 20} cy={11 + Math.floor(i / 3) * 15} r={3.5} fill="#fff" />)}
  <rect width={150} height={95} fill="none" stroke={INK} strokeWidth={5} />
</g>;
const IrFlag = () => <g>
  <rect width={150} height={32} fill="#239F40" /><rect y={32} width={150} height={31} fill="#fff" /><rect y={63} width={150} height={32} fill="#DA0000" />
  <path d="M75 34 C 66 40, 66 56, 75 61 C 84 56, 84 40, 75 34 Z M75 38 L75 60" fill="none" stroke="#DA0000" strokeWidth={4} />
  <rect width={150} height={95} fill="none" stroke={INK} strokeWidth={5} />
</g>;
const FlagPole = ({x, y, t, kind}: {x: number; y: number; t: number; kind: 'us' | 'ir'}) => {
  const w = Math.sin(t * 5 + x) * 3;
  return <svg width={170} height={260} viewBox="0 0 170 260" style={{position: 'absolute', left: x, top: y - 260, overflow: 'visible'}}>
    <line x1={6} y1={10} x2={6} y2={260} stroke={INK} strokeWidth={7} /><circle cx={6} cy={8} r={8} fill={INK} />
    <g transform={`translate(10 ${16 + w}) skewY(${w})`}>{kind === 'us' ? <UsFlag /> : <IrFlag />}</g>
  </svg>;
};

// ---------- islands (floating chunks, like the reference) ----------
const Island = ({x, w, top, kind}: {x: number; w: number; top: number; kind: 'grass' | 'sand'}) => {
  const g = kind === 'grass' ? '#7CC75B' : '#E9C47E', c = kind === 'grass' ? '#9B6A3C' : '#B98A4E', dk = kind === 'grass' ? '#5FA845' : '#D2A85E';
  return <svg width={w} height={460} viewBox={`0 0 ${w} 460`} style={{position: 'absolute', left: x, top, overflow: 'visible'}}>
    <path d={`M0 40 L${w} 20 L${w - 20} 140 L${w - 60} 230 L${w - 110} 210 L${w - 150} 330 L${w - 200} 270 L${w / 2} 420 L${w / 2 - 50} 300 L${w / 2 - 110} 360 L120 250 L70 300 L30 170 Z`} fill={c} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {[0.2, 0.4, 0.6, 0.8].map((k) => <path key={k} d={`M${w * k} 80 L${w * k + 10} ${150 + k * 120}`} stroke="#00000033" strokeWidth={6} strokeLinecap="round" />)}
    <path d={`M0 40 L${w} 20 L${w} 70 Q ${w * 0.75} 95 ${w / 2} 80 Q ${w * 0.25} 100 0 85 Z`} fill={g} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d={`M30 60 L${w - 30} 44`} stroke={dk} strokeWidth={10} strokeLinecap="round" />
  </svg>;
};

// Gas pump with a big price window (price counts up when Iran's oil is blocked).
export const GasPump = ({x, y, price, red, shake}: {x: number; y: number; price: number; red: boolean; shake: number}) =>
  <svg width={210} height={330} viewBox="0 0 210 330" style={{position: 'absolute', left: x - 105 + shake, top: y - 330, overflow: 'visible'}}>
    <rect x={20} y={0} width={190} height={92} rx={12} fill="#fff" stroke={red ? RED : INK} strokeWidth={7} />
    <text x={115} y={66} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={58} fill={red ? RED : INK}>${price.toFixed(2)}</text>
    <line x1={115} y1={92} x2={115} y2={120} stroke={INK} strokeWidth={6} />
    <rect x={50} y={120} width={130} height={200} rx={14} fill={RED} stroke={INK} strokeWidth={6} />
    <rect x={68} y={140} width={94} height={56} rx={6} fill="#fff" stroke={INK} strokeWidth={4} />
    <text x={115} y={180} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill={INK}>GAS</text>
    <path d="M180 170 C 210 180, 210 260, 190 280" fill="none" stroke={INK} strokeWidth={9} strokeLinecap="round" />
    <rect x={40} y={312} width={150} height={16} fill="#555" stroke={INK} strokeWidth={4} />
  </svg>;

const Barrel = ({x, y, s = 1}: {x: number; y: number; s?: number}) => <svg width={70 * s} height={90 * s} viewBox="0 0 70 90" style={{position: 'absolute', left: x - 35 * s, top: y - 90 * s, overflow: 'visible'}}>
  <rect x={3} y={3} width={64} height={84} rx={10} fill="#262626" stroke={INK} strokeWidth={5} />
  <line x1={3} y1={30} x2={67} y2={30} stroke="#666" strokeWidth={5} /><line x1={3} y1={60} x2={67} y2={60} stroke="#666" strokeWidth={5} />
  <path d="M35 36 C 28 46, 28 52, 35 54 C 42 52, 42 46, 35 36 Z" fill="#fff" />
</svg>;

// ---------- Boss Bear USA (polar bear, gold swoop hair, navy suit, red tie) — faces right ----------
type Mood = 'smug' | 'angry' | 'shock';
const TrumpBear = ({x, y, h = 380, t, mood, point, mouth}: {x: number; y: number; h?: number; t: number; mood: Mood; point: number; mouth: number}) => {
  const bob = Math.sin(t * 3) * 3, shake = mood === 'shock' ? Math.sin(t * 60) * 2 : 0;
  const arm = lerp(70, -10, point) + (point > 0.5 ? Math.sin(t * 14) * 5 : 0); // pointing arm angle (deg)
  const eye = mood === 'shock' ? 13 : 8;
  return <svg width={h * 0.8} height={h} viewBox="0 0 320 400" style={{position: 'absolute', left: x - h * 0.4 + shake, top: y - h + bob, overflow: 'visible'}}>
    <ellipse cx={160} cy={396} rx={110} ry={9} fill="rgba(30,40,60,0.15)" />
    {/* legs + suit body */}
    <rect x={100} y={330} width={46} height={64} rx={10} fill="#1F2E55" stroke={INK} strokeWidth={6} />
    <rect x={176} y={330} width={46} height={64} rx={10} fill="#1F2E55" stroke={INK} strokeWidth={6} />
    <path d="M70 350 C 60 240, 90 180, 160 180 C 230 180, 262 240, 250 350 Z" fill="#24346A" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M128 182 L160 250 L192 182 Z" fill="#fff" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <path d="M152 196 L168 196 L174 300 L160 318 L146 300 Z" fill={RED} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
    <circle cx={222} cy={210} r={6} fill="#fff" stroke={INK} strokeWidth={2} />
    {/* back arm */}
    <path d="M86 220 C 60 260, 62 300, 80 320" fill="none" stroke={INK} strokeWidth={36} strokeLinecap="round" />
    <path d="M86 220 C 60 260, 62 300, 80 320" fill="none" stroke="#24346A" strokeWidth={24} strokeLinecap="round" />
    <circle cx={80} cy={326} r={18} fill="#FBFBF7" stroke={INK} strokeWidth={5} />
    {/* pointing arm (toward Iran) */}
    <g transform={`translate(232 216) rotate(${arm})`}>
      <rect x={-6} y={-20} width={110} height={40} rx={18} fill="#24346A" stroke={INK} strokeWidth={6} />
      <rect x={96} y={-22} width={14} height={44} fill="#fff" stroke={INK} strokeWidth={4} />
      <circle cx={124} cy={0} r={20} fill="#FBFBF7" stroke={INK} strokeWidth={5} />
      <rect x={134} y={-8} width={point > 0.3 ? 38 : 14} height={14} rx={7} fill="#FBFBF7" stroke={INK} strokeWidth={4} />
    </g>
    {/* head */}
    <circle cx={92} cy={62} r={24} fill="#FBFBF7" stroke={INK} strokeWidth={6} /><circle cx={222} cy={62} r={24} fill="#FBFBF7" stroke={INK} strokeWidth={6} />
    <ellipse cx={160} cy={110} rx={88} ry={76} fill="#FBFBF7" stroke={INK} strokeWidth={7} />
    {/* the hair: big gold swoop, combed to his left */}
    <path d="M70 92 C 60 40, 110 14, 170 18 C 230 20, 262 44, 256 74 C 240 56, 214 52, 196 60 C 176 44, 120 46, 92 74 C 84 80, 76 88, 70 92 Z" fill="#F7C531" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M110 44 C 150 30, 200 32, 236 50 M120 60 C 150 50, 180 50, 206 58" fill="none" stroke="#D49A12" strokeWidth={5} strokeLinecap="round" />
    {/* brows + eyes */}
    {mood === 'angry' && <path d="M112 84 L142 96 M208 84 L178 96" stroke={INK} strokeWidth={7} strokeLinecap="round" />}
    {mood === 'smug' && <path d="M114 90 L140 92 M180 92 L206 90" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
    {mood === 'shock' && <path d="M112 78 Q127 66 142 78 M178 78 Q193 66 208 78" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
    <circle cx={128} cy={106} r={eye} fill={mood === 'shock' ? '#fff' : INK} stroke={INK} strokeWidth={mood === 'shock' ? 5 : 0} />
    <circle cx={192} cy={106} r={eye} fill={mood === 'shock' ? '#fff' : INK} stroke={INK} strokeWidth={mood === 'shock' ? 5 : 0} />
    {mood === 'shock' && <><circle cx={130} cy={108} r={5} fill={INK} /><circle cx={194} cy={108} r={5} fill={INK} /></>}
    {/* muzzle + mouth */}
    <ellipse cx={164} cy={146} rx={42} ry={30} fill="#EFEFE8" stroke={INK} strokeWidth={5} />
    <ellipse cx={164} cy={132} rx={14} ry={10} fill={INK} />
    {mood === 'shock' ? <ellipse cx={164} cy={160} rx={11} ry={8 + mouth * 6} fill={INK} />
      : mouth > 0.05 ? <ellipse cx={168} cy={158} rx={16} ry={4 + mouth * 12} fill={INK} />
      : <path d={mood === 'smug' ? 'M146 156 Q166 166 186 152' : 'M146 162 Q164 152 182 162'} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
    {mood === 'shock' && <path transform={`translate(250 ${90 + (t * 60) % 40})`} d="M0 -20 C 8 -6, 14 4, 0 12 C -14 4, -8 -6, 0 -20 Z" fill="#9AD6F5" stroke={INK} strokeWidth={3} />}
    {mood === 'angry' && <ellipse cx={164} cy={104} rx={60} ry={16} fill="#FF7B6E" opacity={0.25} />}
  </svg>;
};

// ---------- Musk Ox Iran (black turban, white beard, round glasses, black robe) — faces left ----------
const OxLeader = ({x, y, h = 380, t, mood, mouth}: {x: number; y: number; h?: number; t: number; mood: 'stern' | 'angry'; mouth: number}) => {
  const bob = Math.sin(t * 2.4 + 1) * 3, angry = mood === 'angry', tr = angry ? Math.sin(t * 50) * 2 : 0;
  return <svg width={h * 0.8} height={h} viewBox="0 0 320 400" style={{position: 'absolute', left: x - h * 0.4 + tr, top: y - h + bob, overflow: 'visible'}}>
    <ellipse cx={160} cy={396} rx={110} ry={9} fill="rgba(30,40,60,0.15)" />
    {/* robe */}
    <path d="M62 392 C 56 260, 90 186, 160 186 C 230 186, 264 260, 258 392 Z" fill="#1E1E1E" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M136 200 L160 392 L184 200 Z" fill="#7A6450" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {/* crossed arms (shaggy hooves) */}
    <path d="M86 280 C 130 300, 190 300, 236 280" fill="none" stroke={INK} strokeWidth={44} strokeLinecap="round" />
    <path d="M86 280 C 130 300, 190 300, 236 280" fill="none" stroke="#2C2C2C" strokeWidth={32} strokeLinecap="round" />
    <ellipse cx={100} cy={282} rx={20} ry={16} fill="#5B4636" stroke={INK} strokeWidth={5} /><ellipse cx={222} cy={282} rx={20} ry={16} fill="#5B4636" stroke={INK} strokeWidth={5} />
    {/* horns (musk ox) curling down under the turban */}
    <path d="M86 70 C 40 70, 36 130, 60 150 C 64 124, 74 106, 98 100 Z" fill="#E9DCC0" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M234 70 C 280 70, 284 130, 260 150 C 256 124, 246 106, 222 100 Z" fill="#E9DCC0" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {/* shaggy face */}
    <path d="M90 80 C 90 40, 230 40, 230 80 L 236 150 C 220 200, 100 200, 84 150 Z" fill="#6B5240" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    {/* long white beard */}
    <path d="M100 140 C 110 230, 140 268, 160 272 C 180 268, 210 230, 220 140 C 196 162, 124 162, 100 140 Z" fill="#F4F2EC" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {[130, 150, 170, 190].map((bx) => <path key={bx} d={`M${bx} 175 Q ${bx + 4} 210 ${bx} 240`} fill="none" stroke="#C9C4B8" strokeWidth={4} strokeLinecap="round" />)}
    {/* mouth in the beard */}
    {mouth > 0.05 ? <ellipse cx={156} cy={160} rx={14} ry={3 + mouth * 9} fill={INK} /> : <path d={angry ? 'M140 164 Q156 154 172 164' : 'M140 160 L172 160'} stroke={INK} strokeWidth={5} strokeLinecap="round" />}
    <ellipse cx={156} cy={138} rx={22} ry={12} fill="#3A2A20" />
    {/* round glasses + eyes */}
    <circle cx={126} cy={106} r={22} fill="#F3EEE4" stroke={INK} strokeWidth={5} /><circle cx={190} cy={106} r={22} fill="#F3EEE4" stroke={INK} strokeWidth={5} />
    <line x1={148} y1={106} x2={168} y2={106} stroke={INK} strokeWidth={5} />
    <circle cx={120} cy={108} r={angry ? 6 : 7} fill={INK} /><circle cx={184} cy={108} r={angry ? 6 : 7} fill={INK} />
    {angry ? <path d="M104 82 L144 96 M212 82 L172 96" stroke="#F4F2EC" strokeWidth={9} strokeLinecap="round" />
      : <path d="M106 86 L144 90 M176 90 L210 86" stroke="#F4F2EC" strokeWidth={8} strokeLinecap="round" />}
    {/* black turban */}
    <path d="M78 74 C 70 14, 250 14, 242 74 C 210 60, 110 60, 78 74 Z" fill="#141414" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M92 58 C 130 40, 190 40, 228 58 M100 40 C 130 26, 190 26, 220 40" fill="none" stroke="#3A3A3A" strokeWidth={5} strokeLinecap="round" />
    {angry && [0, 1].map((i) => { const ph = (t * 1.6 + i / 2) % 1; return <circle key={i} cx={i ? 270 : 50} cy={30 - ph * 60} r={14 + ph * 14} fill="#fff" stroke={INK} strokeWidth={4} opacity={1 - ph} />; })}
  </svg>;
};

// Red sanction letter flying on an arc from America to Iran.
const SanctionNote = ({x1, y1, x2, y2, a, t, rot = 0}: {x1: number; y1: number; x2: number; y2: number; a: number; t: number; rot?: number}) => {
  const p = (t - a) / 0.4; if (p < 0 || p > 1) return null;
  const x = lerp(x1, x2, p), y = lerp(y1, y2, p) - Math.sin(p * Math.PI) * 160;
  return <div style={{position: 'absolute', left: x - 70, top: y - 46, width: 140, height: 92, background: '#fff', border: `6px solid ${RED}`, borderRadius: 8,
    transform: `rotate(${rot + p * 360}deg) scale(${0.7 + 0.3 * Math.sin(p * Math.PI)})`, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 19, color: RED, boxShadow: '0 4px 0 rgba(0,0,0,0.15)'}}>SANCTIONS</div>;
};

const Why = ({t}: {t: number}) => {
  const p = ease(t / 0.22);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 250, lineHeight: '270px',
    color: INK, letterSpacing: -6, opacity: p, transform: `scale(${0.6 + 0.4 * p}) rotate(-3deg)`}}>why<span style={{color: RED}}>?</span></div>;
};
const Label = ({text, x, y, at, t, color = '#fff'}: {text: string; x: number; y: number; at: number; t: number; color?: string}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x - 200, width: 400, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 84, color,
    WebkitTextStroke: `4px ${INK}`, paintOrder: 'stroke fill', opacity: p, transform: `scale(${0.5 + 0.5 * p})`}}>{text}</div>;
};

const SEA = 1150;
const Hook = ({t}: {t: number}) => {
  const blocked = t >= W.iran + 0.1;
  const price = t < W.gas ? 2.98 : lerp(2.98, 4.56, ease((t - W.gas) / 0.5));
  const red = t >= W.gas + 0.1;
  const bearMood: Mood = t >= W.expensive ? 'shock' : t >= W.punish - 0.15 ? 'angry' : 'smug';
  const point = ease((t - W.america) / 0.25) * (t < W.your ? 1 : 1 - ease((t - W.your) / 0.25));
  const bearTalk = t > W.america && t < W.iran + 0.2 ? talk(t, [[W.america, W.iran + 0.2]]) * 0.8 : bearMood === 'shock' ? 0.6 : 0;
  // Doug: points at the side being named, then at the viewer ("YOUR"), then at the pump.
  const side = t < W.punish ? -1 : t < W.your ? 1 : t < W.gas ? 0 : -1;
  const x = ease((t - W.iran - 0.1) / 0.15);
  return <>
    <Why t={t} />
    <div style={{position: 'absolute', left: -300, right: -300, top: SEA, height: 800, background: '#BFE6F7', borderTop: `6px solid ${INK}`}} />

    {/* USA island: flag, gas pump, Boss Bear */}
    <Island x={-30} w={500} top={800} kind="grass" />
    <FlagPole x={392} y={840} t={t} kind="us" />
    <GasPump x={118} y={846} price={price} red={red} shake={red && t < W.expensive + 0.5 ? Math.sin(t * 70) * 4 : 0} />
    <TrumpBear x={300} y={880} h={360} t={t} mood={bearMood} point={point} mouth={bearTalk} />
    <Label text="USA" x={220} y={980} at={W.america} t={t} />

    {/* Iran island: flag, oil barrels, musk ox */}
    <Island x={610} w={500} top={800} kind="sand" />
    <FlagPole x={872} y={790} t={t} kind="ir" />
    <Barrel x={880} y={850} /><Barrel x={960} y={856} /><Barrel x={920} y={772} />
    {blocked && <svg width={240} height={240} style={{position: 'absolute', left: 800, top: 640, overflow: 'visible'}}>
      <path d="M20 20 L220 220 M220 20 L20 220" stroke={RED} strokeWidth={26} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - x} />
    </svg>}
    <OxLeader x={725} y={880} h={360} t={t} mood={blocked ? 'angry' : 'stern'} mouth={0} />
    <Label text="IRAN" x={850} y={980} at={W.iran} t={t} />

    {/* Doug on his ice floe in the middle */}
    <div style={{position: 'absolute', left: 350, top: 1430, width: 380, height: 60, background: '#F2FAFF', border: `6px solid ${INK}`, borderRadius: '40% 50% 45% 40%'}} />
    <Penguin id="doug" x={540} y={1448} h={300} pose={{turn: side * 0.5, look: [side * 0.8, side ? -0.3 : 0], mouth: talk(t, [[0, W.end]]),
      flapL: side < 0 ? 105 + Math.sin(t * 9) * 6 : 20, flapR: side > 0 ? 105 + Math.sin(t * 9) * 6 : side === 0 ? 70 : 20,
      brows: t >= W.expensive ? 'shock' : 'worried', eyeScale: t >= W.expensive ? 1.25 : 1}} />

    {/* sanctions fly America -> Iran on "punish" */}
    {[0, 1].map((i) => <SanctionNote key={i} x1={300} y1={600} x2={880 + i * 40} y2={720} a={W.punish - 0.05 + i * 0.12} t={t} rot={-10 + i * 14} />)}
  </>;
};

export const DougSanctionsHook = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  // very light push toward the side being named (USA -> Iran -> USA pump), back to wide at the end
  const toUS = ease((tc - W.america) / 0.4) * (tc < W.punish + 0.1 ? 1 : 0), toIR = tc >= W.punish + 0.1 && tc < W.gas ? ease((tc - W.punish - 0.1) / 0.4) : 0;
  const toPump = tc >= W.gas && tc < 3.5 ? ease((tc - W.gas) / 0.4) : 0;
  const s = 1 + 0.05 * toUS + 0.05 * toIR + 0.07 * toPump;
  const fx = 540 - 200 * toUS + 220 * toIR - 330 * toPump, fy = 960 - 40 * toPump;
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={t} /></AbsoluteFill>
    <Captions t={tc} phrases={TIM} y={1610} />
    <Audio src={staticFile('doug-sanctions-hook-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={W.punish - 0.05} name="user-whoosh" vol={0.35} />
    <Sfx at={W.iran + 0.1} name="user-boom" vol={0.45} />
    <Sfx at={W.gas} name="user-cash-register" vol={0.35} />
    <Sfx at={W.gas + 0.5} name="user-ting" vol={0.4} />
    <Sfx at={W.expensive + 0.2} name="user-shock" vol={0.35} />
  </AbsoluteFill>;
};

// =====================================================================================================
// Full episode (64 s). One line = one shot; line timings from studio/src/data/doug-sanctions.json.
// =====================================================================================================
const P = (i: number) => EP[i].start, E = (i: number) => EP[i].end;
export const DOUG_SANCTIONS_SECONDS = Math.ceil((EP[EP.length - 1].end + 0.8) * 30) / 30;
const G = 1300;
const GOLD = '#F5C518';
const Ground = ({sand}: {sand?: boolean}) => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: sand ? '#F2DCA0' : '#E4F4FC', borderTop: `5px solid ${INK}`}} />;

// ---------- extra props ----------
const ChinaFlag = () => <g>
  <rect width={150} height={95} fill="#DE2910" />
  <path d="M28 14 L33 29 L49 29 L36 38 L41 53 L28 44 L15 53 L20 38 L7 29 L23 29 Z" fill="#FFDE00" />
  {[[62, 12], [72, 24], [72, 40], [62, 52]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={4.5} fill="#FFDE00" />)}
  <rect width={150} height={95} fill="none" stroke={INK} strokeWidth={5} />
</g>;
const Pole = ({x, y, t, kind}: {x: number; y: number; t: number; kind: 'us' | 'ir' | 'cn'}) => kind === 'cn'
  ? <svg width={170} height={260} viewBox="0 0 170 260" style={{position: 'absolute', left: x, top: y - 260, overflow: 'visible'}}>
    <line x1={6} y1={10} x2={6} y2={260} stroke={INK} strokeWidth={7} /><g transform={`translate(10 ${16 + Math.sin(t * 5) * 3})`}><ChinaFlag /></g></svg>
  : <FlagPole x={x} y={y} t={t} kind={kind} />;

// Giant panda = China (the buyer). Faces left. (x, y) = feet.
const Panda = ({x, y, h = 420, t, happy = true, mouth = 0}: {x: number; y: number; h?: number; t: number; happy?: boolean; mouth?: number}) => {
  const bob = Math.sin(t * 3 + 2) * 3;
  return <svg width={h * 0.8} height={h} viewBox="0 0 320 400" style={{position: 'absolute', left: x - h * 0.4, top: y - h + bob, overflow: 'visible'}}>
    <ellipse cx={160} cy={396} rx={110} ry={9} fill="rgba(30,40,60,0.15)" />
    <rect x={92} y={320} width={56} height={72} rx={24} fill="#1E1E1E" stroke={INK} strokeWidth={6} /><rect x={172} y={320} width={56} height={72} rx={24} fill="#1E1E1E" stroke={INK} strokeWidth={6} />
    <ellipse cx={160} cy={270} rx={100} ry={92} fill="#FBFBF7" stroke={INK} strokeWidth={7} />
    <path d="M70 230 Q 160 200 250 230 L 250 260 Q 160 236 70 260 Z" fill="#1E1E1E" />
    <path d="M80 250 C 40 280, 50 320, 80 320" fill="none" stroke="#1E1E1E" strokeWidth={36} strokeLinecap="round" />
    <path d="M240 250 C 280 280, 270 320, 240 320" fill="none" stroke="#1E1E1E" strokeWidth={36} strokeLinecap="round" />
    <circle cx={90} cy={60} r={30} fill="#1E1E1E" stroke={INK} strokeWidth={6} /><circle cx={230} cy={60} r={30} fill="#1E1E1E" stroke={INK} strokeWidth={6} />
    <ellipse cx={160} cy={118} rx={92} ry={80} fill="#FBFBF7" stroke={INK} strokeWidth={7} />
    <ellipse cx={122} cy={108} rx={24} ry={30} fill="#1E1E1E" transform="rotate(25 122 108)" /><ellipse cx={198} cy={108} rx={24} ry={30} fill="#1E1E1E" transform="rotate(-25 198 108)" />
    {happy ? <><path d="M112 110 Q122 98 132 110" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" /><path d="M188 110 Q198 98 208 110" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" /></>
      : <><circle cx={124} cy={108} r={8} fill="#fff" /><circle cx={196} cy={108} r={8} fill="#fff" /></>}
    <ellipse cx={160} cy={146} rx={14} ry={10} fill={INK} />
    {mouth > 0.05 ? <ellipse cx={160} cy={170} rx={16} ry={4 + mouth * 10} fill={INK} /> : <path d="M140 164 Q160 182 180 164" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />}
    {happy && <><circle cx={100} cy={150} r={12} fill="#F4B7B0" opacity={0.7} /><circle cx={220} cy={150} r={12} fill="#F4B7B0" opacity={0.7} /></>}
  </svg>;
};

const Tanker = ({x, y, w = 360, blocked}: {x: number; y: number; w?: number; blocked?: boolean}) => <svg width={w} height={w * 0.46} viewBox="0 0 260 120" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.38, overflow: 'visible'}}>
  <path d="M0 60 L260 60 L235 108 L22 108 Z" fill="#A8322B" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <rect x={0} y={48} width={260} height={14} fill="#3A3A3A" stroke={INK} strokeWidth={5} />
  <rect x={190} y={8} width={52} height={42} fill="#fff" stroke={INK} strokeWidth={5} /><rect x={208} y={-10} width={14} height={20} fill={INK} />
  {[40, 85, 130].map((cx) => <ellipse key={cx} cx={cx} cy={46} rx={18} ry={9} fill="#E8E2D2" stroke={INK} strokeWidth={4} />)}
  <text x={110} y={95} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={28} fill="#fff">OIL</text>
  {blocked && <path d="M60 0 L200 110 M200 0 L60 110" stroke={RED} strokeWidth={16} strokeLinecap="round" />}
</svg>;

const Derrick = ({x, y, t, s = 1}: {x: number; y: number; t: number; s?: number}) => {
  const a = Math.sin(t * 4) * 14;
  return <svg width={240 * s} height={220 * s} viewBox="0 0 240 220" style={{position: 'absolute', left: x - 120 * s, top: y - 220 * s, overflow: 'visible'}}>
    <rect x={10} y={205} width={220} height={14} fill="#666" stroke={INK} strokeWidth={4} />
    <path d="M90 205 L120 70 L150 205" fill="none" stroke={INK} strokeWidth={9} strokeLinejoin="round" />
    <g transform={`rotate(${a} 120 70)`}>
      <rect x={20} y={60} width={190} height={20} rx={6} fill="#3A3A3A" stroke={INK} strokeWidth={4} />
      <path d="M20 50 Q -8 70 20 110 Z" fill="#3A3A3A" stroke={INK} strokeWidth={4} />
      <line x1={8} y1={100} x2={8} y2={205} stroke={INK} strokeWidth={4} />
    </g>
  </svg>;
};

const Missile = ({x, y, w = 420, rot = -20}: {x: number; y: number; w?: number; rot?: number}) => <svg width={w} height={w * 0.3} viewBox="0 0 300 90" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.15, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
  <path d="M40 30 L230 30 Q290 45 230 60 L40 60 Z" fill="#C9CED4" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <path d="M230 30 Q290 45 230 60 Z" fill={RED} stroke={INK} strokeWidth={5} />
  <path d="M40 30 L10 6 L70 30 M40 60 L10 84 L70 60" fill="#8A9399" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
</svg>;

export const Globe = ({x, y, r = 300, t}: {x: number; y: number; r?: number; t: number}) => {
  const o = (t * 40) % 600;
  return <svg width={r * 2} height={r * 2} viewBox="-150 -150 300 300" style={{position: 'absolute', left: x - r, top: y - r, overflow: 'visible'}}>
    <defs><clipPath id="globe"><circle r={140} /></clipPath></defs>
    <circle r={140} fill="#7CC4EC" />
    <g clipPath="url(#globe)">{[-600, 0].map((k) => <g key={k} transform={`translate(${k + o - 300} 0)`}>
      <path d="M60 -90 C 120 -110, 160 -60, 130 -20 C 110 10, 70 0, 60 30 C 40 70, 0 40, 10 -10 C 20 -50, 30 -80, 60 -90 Z" fill="#7CC75B" stroke={INK} strokeWidth={4} />
      <path d="M210 10 C 250 0, 280 40, 260 80 C 240 110, 200 100, 200 60 Z" fill="#7CC75B" stroke={INK} strokeWidth={4} />
      <path d="M340 -80 C 420 -100, 480 -50, 460 0 C 430 40, 380 20, 360 -10 C 330 -40, 320 -70, 340 -80 Z" fill="#7CC75B" stroke={INK} strokeWidth={4} />
      <path d="M420 40 C 450 30, 480 70, 460 110 C 440 120, 410 90, 420 40 Z" fill="#7CC75B" stroke={INK} strokeWidth={4} />
    </g>)}</g>
    <circle r={140} fill="none" stroke={INK} strokeWidth={7} />
  </svg>;
};

const Calendar = ({x, y, year}: {x: number; y: number; year: number}) => <div style={{position: 'absolute', left: x - 230, top: y - 200, width: 460, height: 400, background: '#fff', border: `8px solid ${INK}`, borderRadius: 26, overflow: 'hidden', boxShadow: '8px 10px 0 rgba(0,0,0,0.1)'}}>
  <div style={{height: 110, background: RED, borderBottom: `8px solid ${INK}`}} />
  <div style={{textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 170, lineHeight: '270px', color: INK}}>{year}</div>
</div>;

const NumBadge = ({n, x = 150, y = 330, at, t}: {n: number; x?: number; y?: number; at: number; t: number}) => {
  const p = ease((t - at) / 0.2);
  return <div style={{position: 'absolute', left: x - 90, top: y - 90, width: 180, height: 180, borderRadius: '50%', background: RED, border: `8px solid ${INK}`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Montserrat', fontWeight: 900, fontSize: 120, transform: `scale(${p}) rotate(-8deg)`}}>{n}</div>;
};

const BigPump = ({x, y, price, red, s = 2}: {x: number; y: number; price: number; red: boolean; s?: number}) =>
  <div style={{position: 'absolute', left: x, top: y, transform: `scale(${s})`, transformOrigin: '0 0'}}><GasPump x={105} y={330} price={price} red={red} shake={0} /></div>;

// Doug + state gag: close-up, the state written big.
const DougMood = ({t, at, kind}: {t: number; at: number; kind: 'confused' | 'poor'}) => {
  const pose = kind === 'poor' ? {lids: 0.35, brows: 'worried' as const, beak: 'frown' as const, tears: true}
    : {brows: 'worried' as const, eyeScale: 1.2, pupil: 0.6, look: [0.4, -0.5] as [number, number], lean: 8 * Math.sin(t * 3)};
  return <>
    {kind === 'confused' && [0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 170 + i * 330, top: 560 + (i % 2) * 90 + Math.sin(t * 5 + i) * 14, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 150, color: RED, transform: `rotate(${(i - 1) * 18}deg)`}}>?</div>)}
    <Penguin id="doug" x={540} y={G + 300} h={950} pose={pose} />
    <BigWord text={`Doug ${kind}.`} x={540} y={420} at={at} size={130} color={RED} />
  </>;
};

// Doug peeking in from the screen edge, watching what happens (so no shot is ever empty).
const Peek = ({t, at, side = -1, y = G + 120, h = 560, shock}: {t: number; at: number; side?: number; y?: number; h?: number; shock?: boolean}) => {
  const p = ease((t - at - 0.15) / 0.35);
  const x = side < 0 ? lerp(-260, -40, p) : lerp(1340, 1120, p);
  return <Penguin id="peek" x={x} y={y + Math.sin(t * 3) * 6} h={h} pose={{turn: -side * 0.7, look: [-side * 0.9, -0.2], lean: -side * 14, brows: shock ? 'shock' : 'worried',
    eyeScale: shock ? 1.3 : 1.1, pupil: shock ? 0.6 : 1, flapL: side < 0 ? 6 : 50, flapR: side > 0 ? 6 : 50}} />;
};

// ---------- sets ----------
const Intro = ({t}: {t: number}) => {
  const x = lerp(-250, 560, ease((t - P(1)) / 0.9));
  return <>
    <Snowfall t={t} /><Ground />
    {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: ((i * 380 - t * 900) % 1400 + 1400) % 1400 - 200, top: G + 30 + i * 18, width: 160, height: 6, background: '#D6E8F3', borderRadius: 3}} />)}
    <Snowmobile x={x} y={G} t={t} moving />
    <Penguin id="doug" x={x - 30} y={G - 120} h={330} pose={{side: true, turn: 1, beak: 'smile', brows: 'happy'}} />
    <BigWord text="Doug" x={540} y={600} at={P(1)} size={150} />
  </>;
};

const PunishHow = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', inset: 0, background: '#EAF6FD'}} />
  <Penguin id="doug" x={540} y={G + 300} h={950} pose={{brows: 'worried', look: [0.3, -0.4], lean: 7, mouth: talk(t, [[P(2), E(2)]]), flapR: 70}} />
  <BigWord text="?" x={880} y={520} at={P(2) + 0.2} size={260} color={RED} />
</>;

const OilPile = ({x, y, rows, s = 1.3}: {x: number; y: number; rows: number; s?: number}) => <>{Array.from({length: rows}, (_, r) => Array.from({length: rows - r}, (_, i) =>
  <Barrel key={`${r}${i}`} x={x + (i - (rows - r - 1) / 2) * 76 * s} y={y - r * 86 * s} s={s} />))}</>;

const Oil = ({t}: {t: number}) => {
  const money = t >= P(3) + 0.8;
  return <>
    <Ground sand />
    <OilPile x={540} y={G} rows={4} s={1.4} />
    <OxLeader x={540} y={G - 3 * 86 * 1.4 - 100} h={330} t={t} mood="stern" mouth={0} />
    {money && [0, 1, 2, 3].map((i) => { const p = ease((t - P(3) - 0.8 - i * 0.08) / 0.4);
      return <Bill key={i} x={540 + Math.cos(i * 1.7) * 380 * p} y={900 + Math.sin(i * 2.3) * 200 * p} w={200} rot={i * 25 - 30} />; })}
    <BigWord text="oil = $" x={540} y={380} at={P(3) + 0.8} size={140} color={GREEN} />
  </>;
};

const Dollars = ({t}: {t: number}) => <>
  <Ground sand />
  <Barrel x={540} y={G} s={5.5} />
  <PriceTag x={800} y={640} price="$" at={P(4) + 0.5} rot={10} size={2} color={GREEN} />
  <Peek t={t} at={P(4)} side={-1} />
</>;

const BelongsUS = ({t}: {t: number}) => <>
  <Ground />
  <Pole x={720} y={G} t={t} kind="us" />
  <TrumpBear x={460} y={G} h={620} t={t} mood="smug" point={0} mouth={0} />
  <Bill x={470} y={G - 200} w={380} rot={-6} />
</>;

const Warn = ({t}: {t: number}) => {
  const lose = t >= P(6) + 1.1, fly = ease((t - P(6) - 1.1) / 0.6);
  return <>
    <Ground />
    <TrumpBear x={290} y={G} h={520} t={t} mood="angry" point={1} mouth={talk(t, [[P(6), E(6)]])} />
    <Fox x={800} y={G} h={480} mouth={0} sly={0} />
    <Barrel x={660} y={G} s={1.2} />
    {lose && <><Bill x={800 + fly * 260} y={G - 360 - fly * 700} w={200} rot={fly * 300} /><BigWord text="✕" x={800} y={G - 600} at={P(6) + 1.1} color={RED} size={200} /></>}
  </>;
};

const Run = ({t}: {t: number}) => {
  const d = ease((t - P(7) - 0.15) / 1.5);
  return <>
    <Ground />
    <OilPile x={800} y={G} rows={3} />
    <Fox x={lerp(560, -100, d)} y={G} h={430} mouth={0.8} sly={0} />
    <Walrus id="w7" x={lerp(330, -250, d)} y={G} h={360} hat={false} pose={{mouth: 0.8, lids: 0}} />
    <Seagull id="g7" x={lerp(500, -200, d)} y={lerp(G - 500, G - 900, d)} h={300} pose={{fly: true, mouth: 0.6}} />
    <BigWord text="!!" x={480} y={560} at={P(7)} size={170} color={RED} />
    <Peek t={t} at={P(7) + 0.4} side={1} shock />
  </>;
};

const SanctionsTitle = ({t}: {t: number}) => <>
  {[0, 1, 2, 3].map((i) => <SanctionNote key={i} x1={-100} y1={500 + i * 300} x2={1180} y2={400 + i * 300} a={P(8) + i * 0.15 - 0.1} t={t} rot={i * 20} />)}
  <Title lines={['SANCTIONS']} y={760} at={P(8)} size={150} />
  <Ground />
  <TrumpBear x={300} y={G} h={420} t={t} mood="angry" point={1} mouth={0} />
  <OxLeader x={800} y={G} h={420} t={t} mood="angry" mouth={0} />
</>;

const Since = ({t}: {t: number}) => {
  const y = Math.round(lerp(1979, 2026, ease((t - P(9) - 1.2) / 1.6)));
  return <>
    <Ground sand />
    <Calendar x={540} y={720} year={y} />
    <OxLeader x={540} y={G + 40} h={360} t={t} mood={y > 2000 ? 'angry' : 'stern'} mouth={0} />
  </>;
};

const Broke = ({t}: {t: number}) => <>
  <Ground />
  <Penguin id="doug" x={330} y={G} h={520} pose={{turn: 0.4, look: [0.6, -0.6], brows: 'worried', mouth: talk(t, [[P(10), E(10)]]), flapR: 60}} />
  <Thought x={720} y={560} w={460} tx={420} ty={G - 520} at={P(10) + 0.1}>
    <MoneyBag x={230} y={250} w={190} label="$0" />
  </Thought>
</>;

const China = ({t}: {t: number}) => {
  const k = ((t - P(11)) * 1.4) % 1;
  return <>
    <Ground sand />
    <Pole x={900} y={G - 360} t={t} kind="cn" />
    <OxLeader x={220} y={G} h={400} t={t} mood="stern" mouth={0} />
    <Panda x={830} y={G} h={430} t={t} />
    <Barrel x={lerp(330, 680, k)} y={G - Math.sin(k * Math.PI) * 120} s={1.6} />
    <PriceTag x={560} y={600} price="SALE" at={P(11) + 1.3} rot={-8} size={1.1} />
  </>;
};

const Discount = ({t}: {t: number}) => <>
  <Ground sand />
  <Barrel x={540} y={G} s={3.6} />
  <PriceTag x={780} y={640} price="-$8" fish="per barrel" at={P(12) + 0.3} rot={10} size={1.4} />
  <Panda x={180} y={G + 60} h={420} t={t} />
</>;

const War = ({t}: {t: number}) => {
  const closed = t >= P(14) + 0.9;
  return <>
    <div style={{position: 'absolute', inset: -200, background: '#7CC4EC'}} />
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d="M-100 -100 L1180 -100 L1180 700 C 900 760, 760 820, 640 900 C 520 960, 300 880, -100 860 Z" fill="#E9C47E" stroke={INK} strokeWidth={8} />
      <path d="M-100 2100 L1180 2100 L1180 1100 C 900 1060, 780 1000, 660 1020 C 560 1040, 360 1180, -100 1160 Z" fill="#E9C47E" stroke={INK} strokeWidth={8} />
    </svg>
    <div style={{position: 'absolute', left: 120, top: 520, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 90, color: INK}}>IRAN</div>
    <div style={{position: 'absolute', left: 140, top: 990, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 56, color: '#1F5F86'}}>Strait of Hormuz</div>
    <Tanker x={880} y={960} w={300} blocked={closed} />
    {closed && <svg width={60} height={330} style={{position: 'absolute', left: 640, top: 880, overflow: 'visible'}}>
      {Array.from({length: 9}, (_, i) => <ellipse key={i} cx={30} cy={12 + i * 30} rx={12} ry={20} fill="none" stroke="#8A9399" strokeWidth={8} />)}</svg>}
    {[0, 1, 2].map((i) => { const ph = cl((t - P(14) - i * 0.2) / 0.6); return ph > 0 && ph < 1 && <div key={i} style={{position: 'absolute', left: 300 + i * 240 - ph * 60, top: 640 - i * 60 - ph * 60, width: 120 + ph * 120, height: 120 + ph * 120, borderRadius: '50%', background: i % 2 ? '#F5A524' : '#fff', border: `6px solid ${INK}`, opacity: 1 - ph}} />; })}
    <BigWord text="WAR" x={540} y={360} at={P(14)} until={P(14) + 1.0} size={220} color={RED} />
    <BigWord text="CLOSED" x={540} y={360} at={P(14) + 0.9} size={170} color={RED} />
  </>;
};

const OneInFive = ({t}: {t: number}) => <>
  <Ground />
  {[0, 1, 2, 3, 4].map((i) => { const on = t >= P(15) + i * 0.18, hot = i === 2 && t >= P(15) + 1.2;
    return on && <div key={i} style={{position: 'absolute', left: 0, top: 0, transform: hot ? `translateY(${-60 - Math.sin(t * 6) * 10}px)` : undefined}}>
      {hot && <div style={{position: 'absolute', left: 540 - 110, top: G - 320, width: 220, height: 300, borderRadius: 40, background: '#FFD7D2'}} />}
      <Barrel x={140 + i * 200} y={G} s={2} /></div>; })}
  <BigWord text="1 in 5" x={540} y={560} at={P(15) + 1.2} size={170} color={RED} />
</>;

const Stop = ({t}: {t: number}) => {
  const up = t >= P(16) + 1.0, all = t >= P(16) + 1.6;
  return <>
    <div style={{position: 'absolute', inset: -200, background: '#BFE6F7'}} />
    <Tanker x={540} y={700} w={420} blocked />
    {up && !all && <svg width={300} height={420} style={{position: 'absolute', left: 390, top: 900, overflow: 'visible'}}>
      <path d="M150 400 L150 60 M60 150 L150 40 L240 150" fill="none" stroke={RED} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" /></svg>}
    {all && <>
      <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
      <Walrus id="w16" x={200} y={G} h={330} flip hat={false} pose={{mouth: 0.9, lids: 0}} />
      <BigSeal id="s16" x={540} y={G} h={320} pose={{mouth: 0.9, sweat: true}} />
      <Fox x={880} y={G} h={360} mouth={0.9} sly={0} />
    </>}
  </>;
};

const OwnOil = ({t}: {t: number}) => <>
  <Ground />
  <Pole x={720} y={G - 210} t={t} kind="us" />
  <Derrick x={760} y={G} t={t} s={1.5} />
  <Penguin id="doug" x={300} y={G} h={560} pose={{turn: 0.6, look: [0.8, -0.2], brows: 'angry', angry: 1, beak: 'frown', mouth: talk(t, [[P(17), E(17)]]), flapR: 110 + Math.sin(t * 9) * 6}} />
</>;

const NumberOne = ({t}: {t: number}) => <>
  <Ground />
  <OilPile x={540} y={G} rows={5} s={1.1} />
  <TrumpBear x={540} y={G - 4 * 86 * 1.1 - 95} h={340} t={t} mood="smug" point={0} mouth={0} />
  <BigWord text="#1" x={540} y={400} at={P(18) + 0.6} size={220} color={GOLD} />
</>;

const OnePrice = ({t}: {t: number}) => <>
  <Globe x={540} y={980} r={330} t={t} />
  <PriceTag x={760} y={560} price="1 price" at={P(19) + 0.5} rot={8} size={1.1} />
  <Peek t={t} at={P(19)} side={-1} y={G + 260} />
</>;

const Larry = ({t}: {t: number}) => {
  const happy = t >= P(20) + 1.8;
  return <>
    <Ground />
    <Refinery x={700} y={G} t={t} label="LARRY OIL" id="lo" />
    <Walrus id="larry" x={260} y={G} h={460} flip pose={{lids: 0.5, laugh: happy ? 1 : 0.3, look: 0.6, mouth: happy ? 0.8 : 0}} />
    {happy && <MoneyBag x={270} y={G - 480} w={200} label="$$$" />}
    <BigWord text="Larry happy." x={540} y={460} at={P(20) + 1.8} size={120} color={GREEN} />
  </>;
};

const RealLife = ({t}: {t: number}) => {
  const p = ease((t - P(22) - 1.0) / 1.8), price = lerp(2.98, 4.56, p);
  return <>
    <BigWord text="real life" x={540} y={330} at={P(22)} size={110} />
    <BigPump x={298} y={500} price={price} red={p > 0.05} s={2.3} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 1310, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 80, color: INK}}>{p < 0.5 ? 'FEB 2026' : 'MAY 2026'}</div>
    <div style={{position: 'absolute', left: 0, right: 0, top: 1420, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 34, color: '#888'}}>AAA national average, 2026</div>
    <Peek t={t} at={P(22) + 0.6} side={1} y={G + 160} shock={p > 0.6} />
  </>;
};

const PaysPunish = ({t}: {t: number}) => <>
  <Ground />
  <BigPump x={600} y={G - 330 * 1.4} price={4.56} red s={1.4} />
  <Penguin id="doug" x={330} y={G} h={520} pose={{turn: 0.5, look: [0.6, -0.2], brows: 'shock', eyeScale: 1.25, sweat: true, mouth: talk(t, [[P(23), E(23)]]), flapR: 80}} />
  <FishFlight x1={360} y1={G - 300} x2={760} y2={G - 300} a={P(23) + 0.3} b={P(23) + 1.0} n={4} w={90} />
  <FishFlight x1={360} y1={G - 300} x2={760} y2={G - 300} a={P(23) + 0.9} b={P(23) + 1.6} n={4} w={90} seed={3} />
</>;

const WhyDo = ({t}: {t: number}) => {
  const noM = t >= P(24) + 1.0;
  return <>
    <Ground sand />
    <OxLeader x={300} y={G} h={480} t={t} mood="angry" mouth={0} />
    <MoneyBag x={300} y={G - 470} w={150} label="$0" />
    {noM && <><Missile x={760} y={800} w={460} /><BigWord text="✕" x={760} y={800} at={P(24) + 1.0} size={330} color={RED} /></>}
  </>;
};

const TwoProblems = ({t}: {t: number}) => <>
  <BigWord text="smart?" x={540} y={600} at={P(25)} until={P(25) + 0.9} size={160} color={GREEN} />
  {t >= P(25) + 0.9 && <><NumBadge n={1} x={360} y={960} at={P(25) + 1.0} t={t} /><NumBadge n={2} x={720} y={960} at={P(25) + 1.25} t={t} /></>}
  <BigWord text="problems" x={540} y={1250} at={P(25) + 1.2} size={130} color={RED} />
  <Peek t={t} at={P(25)} side={-1} y={G + 220} />
  <Peek t={t} at={P(25) + 0.9} side={1} y={G + 220} shock />
</>;

const ProblemOne = ({t}: {t: number}) => {
  const k = ((t - P(26)) * 1.4) % 1;
  return <>
    <Ground sand />
    <NumBadge n={1} at={P(26)} t={t} />
    <OxLeader x={230} y={G} h={400} t={t} mood="stern" mouth={0} />
    <Panda x={830} y={G} h={430} t={t} mouth={0} />
    <Barrel x={lerp(340, 680, k)} y={G - Math.sin(k * Math.PI) * 120} s={1.6} />
    <PriceTag x={560} y={620} price="-$8" at={P(26) + 1.2} rot={-8} size={1} />
  </>;
};

const ProblemTwo = ({t}: {t: number}) => {
  const drop = ease((t - P(27) - 0.9) / 0.35);
  return <>
    <Ground />
    <NumBadge n={2} at={P(27)} t={t} />
    <BigPump x={620} y={G - 330 * 1.4} price={4.56} red s={1.4} />
    <Penguin id="doug" x={360} y={G} h={drop >= 1 ? 470 : 520} pose={{squash: drop >= 1 ? 0.8 : 0, brows: drop >= 1 ? 'shock' : 'worried', eyeScale: drop >= 1 ? 1.3 : 1, tremble: drop >= 1 ? 1 : 0}} />
    <div style={{position: 'absolute', left: 230, top: lerp(-400, G - 700, drop), width: 260, height: 320, background: '#FFFDF5', border: `7px solid ${INK}`, transform: 'rotate(-6deg)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, color: RED}}><div style={{fontSize: 64}}>BILL</div><div style={{fontSize: 70}}>$$$</div></div>
  </>;
};

const NoBullets = ({t}: {t: number}) => <>
  <Ground />
  <TrumpBear x={240} y={G} h={480} t={t} mood="angry" point={1} mouth={0.4} />
  <OxLeader x={850} y={G} h={430} t={t} mood="angry" mouth={0} />
  {Array.from({length: 6}, (_, i) => <SanctionNote key={i} x1={360} y1={G - 340} x2={820} y2={G - 300 + (i % 3) * 40} a={P(28) + i * 0.22} t={t} rot={i * 15} />)}
  <BigWord text="no bullets" x={540} y={480} at={P(28) + 0.8} size={130} color={RED} />
</>;

const Weapon = ({t}: {t: number}) => {
  const dollar = t >= P(29) + 1.3, p = ease((t - P(29) - 1.3) / 0.35);
  return <>
    {!dollar ? <><Missile x={540} y={900} w={700} /><BigWord text="✕" x={540} y={900} at={P(29) + 0.6} size={420} color={RED} /></> : <>
      <svg width={1200} height={1200} viewBox="-600 -600 1200 1200" style={{position: 'absolute', left: -60, top: 300, transform: `rotate(${t * 20}deg)`, opacity: p}}>
        {Array.from({length: 12}, (_, i) => <path key={i} d="M0 0 L-60 -560 L60 -560 Z" fill="#FFF2B3" transform={`rotate(${i * 30})`} />)}</svg>
      <div style={{position: 'absolute', left: 0, top: 0, transform: `scale(${p})`, transformOrigin: '540px 900px'}}><Bill x={540} y={900} w={760} rot={-6} /></div>
    </>}
    <Peek t={t} at={P(29)} side={1} y={G + 200} shock={dollar} />
  </>;
};

const World = ({t}: {t: number}) => <>
  <Globe x={540} y={1000} r={300} t={t} />
  {Array.from({length: 5}, (_, i) => { const a = t * 1.6 + i * (Math.PI * 2 / 5);
    return <Bill key={i} x={540 + Math.cos(a) * 420} y={1000 + Math.sin(a) * 150} w={170} rot={Math.cos(a) * 20} />; })}
  <BigWord text="1944" x={540} y={460} at={P(30) + 0.2} size={200} />
  <Peek t={t} at={P(30) + 0.3} side={-1} y={G + 300} />
</>;

const Iceberg = ({t}: {t: number}) => {
  const dive = ease((t - P(31) - 0.6) / 1.0);
  return <div style={{position: 'absolute', inset: 0, transform: `translateY(${-650 * dive}px)`}}>
    <div style={{position: 'absolute', left: -300, right: -300, top: 900, height: 2400, background: '#4FA3D1'}} />
    <svg width={1080} height={2000} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      <path d="M440 900 L500 760 L590 760 L640 900 Z" fill="#F2FAFF" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M440 900 L640 900 L800 1150 L960 1500 L860 1900 L240 1950 L100 1500 L260 1150 Z" fill="#CFEBFA" stroke={INK} strokeWidth={7} strokeLinejoin="round" opacity={0.95} />
      <path d="M300 1300 L420 1500 M700 1250 L780 1600 M480 1700 L600 1800" stroke="#9FD3EE" strokeWidth={10} strokeLinecap="round" />
    </svg>
    <Penguin id="doug" x={545} y={765} h={190} pose={{brows: 'shock', eyeScale: 1.2, look: [0, 0.8]}} />
    <BigWord text="tip" x={820} y={680} at={P(31) + 0.2} size={110} color={RED} />
  </div>;
};

const Cta = ({t}: {t: number}) => <>
  <Ground />
  <BigPump x={680} y={G - 330 * 1.3} price={4.56} red s={1.3} />
  <Penguin id="doug" x={360} y={G} h={560} pose={{look: [0, 0.2], brows: 'worried', flapR: 120 + Math.sin(t * 10) * 10, mouth: 0}} />
  <BigWord text="pay more?" x={540} y={380} at={P(32)} size={130} />
  <BigWord text="👇" x={360} y={640} at={P(32) + 0.8} size={130} />
</>;

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(1), set: (t) => <Intro t={t} />, fx_: 'swipe'},
  {at: P(2), set: (t) => <PunishHow t={t} />, fx_: 'zoom'},
  {at: P(3), set: (t) => <Oil t={t} />, fx_: 'swipeL'},
  {at: P(4), set: (t) => <Dollars t={t} />, fx_: 'pop'},
  {at: P(5), set: (t) => <BelongsUS t={t} />, fx_: 'swipe'},
  {at: P(6), set: (t) => <Warn t={t} />, fx_: 'iris'},
  {at: P(7), set: (t) => <Run t={t} />, fx_: 'swipeL'},
  {at: P(8), set: (t) => <SanctionsTitle t={t} />, fx_: 'pop'},
  {at: P(9), set: (t) => <Since t={t} />, fx_: 'swipe'},
  {at: P(10), set: (t) => <Broke t={t} />, fx_: 'zoom'},
  {at: P(11), set: (t) => <China t={t} />, fx_: 'swipeL'},
  {at: P(12), set: (t) => <Discount t={t} />, fx_: 'pop'},
  {at: P(13), set: (t) => <DougMood t={t} at={P(13)} kind="confused" />, fx_: 'zoom'},
  {at: P(14), set: (t) => <War t={t} />, fx_: 'iris'},
  {at: P(15), set: (t) => <OneInFive t={t} />, fx_: 'swipe'},
  {at: P(16), set: (t) => <Stop t={t} />, fx_: 'swipeL'},
  {at: P(17), set: (t) => <OwnOil t={t} />, fx_: 'pop'},
  {at: P(18), set: (t) => <NumberOne t={t} />, fx_: 'swipe'},
  {at: P(19), set: (t) => <OnePrice t={t} />, fx_: 'iris'},
  {at: P(20), set: (t) => <Larry t={t} />, fx_: 'swipeL'},
  {at: P(21), set: (t) => <DougMood t={t} at={P(21)} kind="poor" />, fx_: 'zoom'},
  {at: P(22), set: (t) => <RealLife t={t} />, fx_: 'swipe'},
  {at: P(23), set: (t) => <PaysPunish t={t} />, fx_: 'pop'},
  {at: P(24), set: (t) => <WhyDo t={t} />, fx_: 'swipeL'},
  {at: P(25), set: (t) => <TwoProblems t={t} />, fx_: 'pop'},
  {at: P(26), set: (t) => <ProblemOne t={t} />, fx_: 'swipe'},
  {at: P(27), set: (t) => <ProblemTwo t={t} />, fx_: 'swipeL'},
  {at: P(28), set: (t) => <NoBullets t={t} />, fx_: 'iris'},
  {at: P(29), set: (t) => <Weapon t={t} />, fx_: 'zoom'},
  {at: P(30), set: (t) => <World t={t} />, fx_: 'swipe'},
  {at: P(31), set: (t) => <Iceberg t={t} />, fx_: 'iris'},
  {at: P(32), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [line, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[5, 470, 900, 1.45], [15, 540, 1100, 1.4], [18, 540, 700, 1.4], [23, 540, 1000, 1.15], [30, 540, 900, 1.3]];

export const DougSanctions = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook camera (same as the approved preview)
    const toUS = ease((tc - W.america) / 0.4) * (tc < W.punish + 0.1 ? 1 : 0), toIR = tc >= W.punish + 0.1 && tc < W.gas ? ease((tc - W.punish - 0.1) / 0.4) : 0;
    const toPump = tc >= W.gas ? ease((tc - W.gas) / 0.4) : 0;
    s0 = 1 + 0.05 * toUS + 0.05 * toIR + 0.07 * toPump; fx = 540 - 200 * toUS + 220 * toIR - 330 * toPump; fy = 960 - 40 * toPump;
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < E(0) ? 1 : beat(tc, EP));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={EP} y={tc < E(0) ? 1610 : 1530} />
    <Audio src={staticFile('doug-sanctions-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={W.punish - 0.05} name="user-whoosh" vol={0.35} />
    <Sfx at={W.iran + 0.1} name="user-boom" vol={0.45} />
    <Sfx at={W.gas} name="user-cash-register" vol={0.35} />
    <Sfx at={W.gas + 0.5} name="user-ting" vol={0.4} />
    <Sfx at={W.expensive + 0.2} name="user-shock" vol={0.35} />
    <Sfx at={P(1)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(3) + 0.8} name="user-money" vol={0.35} />
    <Sfx at={P(4) + 0.5} name="user-pop" vol={0.35} />
    <Sfx at={P(5)} name="user-cash-register" vol={0.3} />
    <Sfx at={P(6) + 1.1} name="user-wrong" vol={0.4} />
    <Sfx at={P(7)} name="user-shock" vol={0.35} />
    <Sfx at={P(8)} name="user-boom" vol={0.4} />
    <Sfx at={P(9) + 1.2} name="user-timer" vol={0.3} />
    <Sfx at={P(10) + 0.1} name="user-pop" vol={0.3} />
    <Sfx at={P(11) + 1.3} name="user-cash-register" vol={0.35} />
    <Sfx at={P(12) + 0.3} name="user-ting" vol={0.4} />
    <Sfx at={P(13)} name="user-aww" vol={0.4} />
    <Sfx at={P(14)} name="user-boom" vol={0.45} />
    <Sfx at={P(14) + 0.9} name="user-slap" vol={0.35} />
    <Sfx at={P(15) + 1.2} name="user-ting" vol={0.4} />
    <Sfx at={P(16) + 1.0} name="user-wrong" vol={0.35} />
    <Sfx at={P(16) + 1.6} name="user-shock" vol={0.35} />
    <Sfx at={P(17)} name="penguin-honk" vol={0.35} />
    <Sfx at={P(18) + 0.6} name="user-wow" vol={0.35} />
    <Sfx at={P(19) + 0.5} name="user-pop" vol={0.35} />
    <Sfx at={P(20)} name="walrus-laugh" vol={0.4} />
    <Sfx at={P(20) + 1.8} name="user-cash-register" vol={0.35} />
    <Sfx at={P(21)} name="user-fahh" vol={0.45} />
    <Sfx at={P(22)} name="user-ting" vol={0.35} />
    <Sfx at={P(22) + 2.8} name="user-boom" vol={0.4} />
    <Sfx at={P(23) + 0.3} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(24) + 1.0} name="user-wrong" vol={0.35} />
    <Sfx at={P(25) + 1.0} name="user-pop" vol={0.35} />
    <Sfx at={P(26)} name="user-ting" vol={0.3} />
    <Sfx at={P(27)} name="user-ting" vol={0.3} />
    <Sfx at={P(27) + 1.2} name="user-slap" vol={0.45} />
    <Sfx at={P(28)} name="user-whoosh" vol={0.35} />
    <Sfx at={P(29) + 1.3} name="user-wow" vol={0.4} />
    <Sfx at={P(30) + 0.2} name="user-boom" vol={0.35} />
    <Sfx at={P(31) + 0.6} name="user-whoosh" vol={0.35} />
    <Sfx at={P(32)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
