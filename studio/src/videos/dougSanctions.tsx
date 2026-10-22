// EP7 "Sanctions" — hook preview first (user picked: "Why does America punish Iran... when it makes YOUR gas more expensive?").
// Layout from the user's reference image: two floating islands (USA green / Iran desert), Doug in the middle on an ice floe
// in the sea. Leaders are animals with their signature heads (gold-hair polar bear / turbaned musk ox).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {INK, Penguin, onTwos, talk} from '../penguin/rig';
import {Captions, Sfx} from '../penguin/edit';
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
const GasPump = ({x, y, price, red, shake}: {x: number; y: number; price: number; red: boolean; shake: number}) =>
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
