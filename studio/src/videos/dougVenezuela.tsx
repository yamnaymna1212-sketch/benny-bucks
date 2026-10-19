// EP3 "Gas: America vs Venezuela" — remake of the user's hit (USA $4.41 vs Venezuela $0.13), penguin version.
// Hook first (approval), full episode after. Line timings: studio/src/data/doug-venezuela.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Fish, INK, Penguin, onTwos} from '../penguin/rig';
import {BigSeal, Seagull, Walrus} from '../penguin/cast';
import {BigWord, FishFlight, FishPile, Stamp, Title} from '../penguin/world';
import {MoneyBag, OilGush, Pump, Receipt, Refinery, Snowfall, Snowmobile, Sun} from './dougGas';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import TIM from '../data/doug-venezuela.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_VENEZUELA_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.8) * 30) / 30;
const G = 1300;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const RED = '#D83A2E', GREEN = '#2E9E4F';
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

// ---------- props ----------
const UsFlag = () => <g>
  <rect width={190} height={120} fill="#fff" stroke={INK} strokeWidth={5} />
  {[0, 1, 2, 3, 4, 5, 6].map((i) => <rect key={i} y={i * 17.4} width={190} height={8.7} fill="#B22234" />)}
  <rect width={84} height={64} fill="#3C3B6E" />
  {Array.from({length: 12}, (_, i) => <circle key={i} cx={12 + (i % 4) * 20} cy={12 + Math.floor(i / 4) * 20} r={4} fill="#fff" />)}
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
</g>;
const VeFlag = () => <g>
  <rect width={190} height={40} fill="#F5C518" /><rect y={40} width={190} height={40} fill="#1F4BA8" /><rect y={80} width={190} height={40} fill="#D83A2E" />
  {Array.from({length: 8}, (_, i) => { const a = Math.PI * (0.85 - i * 0.1); return <circle key={i} cx={95 + Math.cos(a) * 30} cy={78 - Math.sin(a) * 26} r={4} fill="#fff" />; })}
  <rect width={190} height={120} fill="none" stroke={INK} strokeWidth={5} />
</g>;

// Gas pump with a flag on a pole and a big "$x / GALLON" window, jerry can in front (as in the user's original thumbnail).
const FlagPump = ({x, y, price, flag, top, t, color, fill}: {x: number; y: number; price: string; flag: 'us' | 've'; top: string; t: number; color: string; fill: number}) => {
  const wave = Math.sin(t * 5) * 3;
  return <svg width={420} height={760} viewBox="0 0 420 760" style={{position: 'absolute', left: x - 210, top: y - 760, overflow: 'visible'}}>
    <line x1={60} y1={40} x2={60} y2={300} stroke={INK} strokeWidth={8} />
    <circle cx={60} cy={36} r={10} fill={INK} />
    <g transform={`translate(64 ${50 + wave}) skewY(${wave})`}>{flag === 'us' ? <UsFlag /> : <VeFlag />}</g>
    <rect x={40} y={300} width={300} height={440} rx={22} fill="#F4F4F2" stroke={INK} strokeWidth={7} />
    <rect x={40} y={300} width={300} height={34} rx={14} fill={top} stroke={INK} strokeWidth={7} />
    <rect x={64} y={370} width={252} height={160} rx={12} fill="#fff" stroke={INK} strokeWidth={6} />
    <text x={190} y={460} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={price.length > 5 ? 74 : 84} fill={color}>{price}</text>
    <text x={190} y={510} textAnchor="middle" fontFamily="Montserrat" fontWeight={800} fontSize={34} fill={INK}>/ GALLON</text>
    <path d="M340 400 C 400 420, 400 560, 360 600" fill="none" stroke={INK} strokeWidth={14} strokeLinecap="round" />
    <path d="M340 400 C 400 420, 400 560, 360 600" fill="none" stroke={top} strokeWidth={6} strokeLinecap="round" />
    <rect x={20} y={730} width={340} height={22} fill={top} stroke={INK} strokeWidth={5} />
    {/* jerry can, fills with gas (fill 0..1) */}
    <g transform="translate(70 600)">
      <defs><clipPath id={`can-${flag}`}><path d="M0 30 L90 30 L130 70 L130 150 L0 150 Z" /></clipPath></defs>
      <path d="M0 30 L90 30 L130 70 L130 150 L0 150 Z" fill="#FFF8E0" />
      <g clipPath={`url(#can-${flag})`}>
        <path d={`M-10 ${150 - 120 * fill + Math.sin(t * 9) * 3} Q 35 ${150 - 120 * fill - 7} 70 ${150 - 120 * fill} T 150 ${150 - 120 * fill} L150 160 L-10 160 Z`} fill="#F2B705" />
      </g>
      <path d="M0 30 L90 30 L130 70 L130 150 L0 150 Z" fill="none" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <path d="M20 60 L100 130 M100 60 L20 130" stroke="#C99A00" strokeWidth={8} opacity={0.5} />
      {fill > 0 && fill < 1 && <path d={`M150 -20 Q 120 -10, 60 ${150 - 120 * fill}`} fill="none" stroke="#F2B705" strokeWidth={9} strokeLinecap="round" />}
      <rect x={20} y={6} width={60} height={22} rx={8} fill="none" stroke={INK} strokeWidth={6} />
    </g>
  </svg>;
};

// Big hand-written "why?" with the red question mark and a red arrow toward the US pump (as in the original).
const Why = ({t}: {t: number}) => {
  const p = ease(t / 0.25);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 230, height: 330, transform: `scale(${0.6 + 0.4 * p})`, opacity: p, transformOrigin: '50% 60%'}}>
    <div style={{position: 'absolute', left: 0, right: 0, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 290, lineHeight: '300px', color: INK, letterSpacing: -6}}>
      why<span style={{color: RED}}>?</span>
    </div>
  </div>;
};
const Puzzled = ({x, y, t}: {x: number; y: number; t: number}) =>
  <div style={{position: 'absolute', left: x, top: y + Math.sin(t * 6) * 8, fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 120, color: INK, transform: 'rotate(14deg)'}}>?</div>;
// Red hand-drawn arrow: draws itself on, points at America, then swings over to point at Venezuela.
const Arrow = ({x, y, t, swingAt}: {x: number; y: number; t: number; swingAt: number}) => {
  const draw = ease((t - 0.15) / 0.4), sw = t < swingAt ? 0 : cl((t - swingAt) / 0.35);
  const over = sw < 1 ? Math.sin(sw * Math.PI) * 12 : 0; // little overshoot while swinging
  const ang = 148 + (32 - 148) * ease(sw) - over;
  return <svg width={10} height={10} style={{position: 'absolute', left: x, top: y, overflow: 'visible'}}>
    <g transform={`rotate(${ang})`}>
      <path d="M0 0 Q 85 -34, 170 0" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />
      {draw > 0.9 && <path d="M170 0 L128 -26 M170 0 L130 30" fill="none" stroke={RED} strokeWidth={15} strokeLinecap="round" />}
    </g>
  </svg>;
};
const Label = ({text, x, y, at, t}: {text: string; x: number; y: number; at: number; t: number}) => {
  const p = ease((t - at) / 0.25);
  return <div style={{position: 'absolute', left: x - 260, width: 520, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: text.length > 5 ? 64 : 80, color: INK, opacity: p, transform: `scale(${0.5 + 0.5 * p})`}}>{text}</div>;
};
const Vs = ({x, y, t}: {x: number; y: number; t: number}) => {
  const p = ease((t - 0.5) / 0.3);
  return <div style={{position: 'absolute', left: x - 75, top: y - 75, width: 150, height: 150, borderRadius: '50%', background: RED, border: `7px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 72, color: '#fff', transform: `scale(${p}) rotate(${-8 + Math.sin(t * 4) * 3}deg)`}}>VS</div>;
};


// ---------- Boss Bear (polar bear = the government that pays for the gas) ----------
const BossBear = ({x, y, h = 520, mouth = 0, sweat, sad, flip}: {x: number; y: number; h?: number; mouth?: number; sweat?: boolean; sad?: boolean; flip?: boolean}) => {
  const t = useCurrentFrame() / FPS, bob = Math.sin(t * 3) * 3;
  return <svg width={h * 0.8} height={h} viewBox="0 0 320 400" style={{position: 'absolute', left: x - h * 0.4, top: y - h + bob, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    <ellipse cx={160} cy={395} rx={120} ry={10} fill="#E3E8EC" />
    <path d="M60 390 C 30 260, 70 170, 160 170 C 250 170, 290 260, 260 390 Z" fill="#FBFBF7" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M60 230 L260 330" stroke="#D83A2E" strokeWidth={30} />
    <text x={165} y={292} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={26} fill="#fff" transform="rotate(26 165 285)">BOSS</text>
    <circle cx={95} cy={70} r={28} fill="#FBFBF7" stroke={INK} strokeWidth={7} /><circle cx={225} cy={70} r={28} fill="#FBFBF7" stroke={INK} strokeWidth={7} />
    <ellipse cx={160} cy={120} rx={95} ry={80} fill="#FBFBF7" stroke={INK} strokeWidth={7} />
    <path d="M110 40 L120 6 L140 30 L160 0 L180 30 L200 6 L210 40 Z" fill="#F5C518" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <ellipse cx={160} cy={150} rx={44} ry={32} fill="#EFEFE8" stroke={INK} strokeWidth={5} />
    <ellipse cx={160} cy={136} rx={16} ry={11} fill={INK} />
    <circle cx={125} cy={105} r={8} fill={INK} /><circle cx={195} cy={105} r={8} fill={INK} />
    {sad && <path d="M108 86 L138 96 M212 86 L182 96" stroke={INK} strokeWidth={6} strokeLinecap="round" />}
    <path d={mouth > 0 ? `M140 160 Q160 ${165 + mouth * 30} 180 160` : sad ? 'M142 172 Q160 158 178 172' : 'M142 162 Q160 174 178 162'} fill={mouth > 0 ? INK : 'none'} stroke={INK} strokeWidth={5} strokeLinecap="round" />
    {sweat && <path d="M250 80 Q262 100 250 110 Q238 100 250 80 Z" fill="#7CC4EC" stroke={INK} strokeWidth={3} />}
  </svg>;
};

// Pile of oil barrels with a flag (bigger pile = more oil).
const BarrelPile = ({x, y, rows, w = 70, flag}: {x: number; y: number; rows: number; w?: number; flag: 'us' | 've'}) => {
  const out: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) for (let i = 0; i < rows - r; i++) {
    const bx = x + (i - (rows - r - 1) / 2) * w, by = y - r * w * 1.2;
    out.push(<div key={`${r}-${i}`} style={{position: 'absolute', left: bx - w * 0.45, top: by - w * 1.2, width: w * 0.9, height: w * 1.2, background: '#2B2B2B', border: `4px solid ${INK}`, borderRadius: 10, boxSizing: 'border-box'}}>
      <div style={{marginTop: w * 0.35, height: 5, background: '#666'}} /><div style={{marginTop: w * 0.3, height: 5, background: '#666'}} /></div>);
  }
  return <>{out}<svg width={190} height={120} viewBox="0 0 190 120" style={{position: 'absolute', left: x - 50, top: y - rows * w * 1.2 - 300, overflow: 'visible'}}>
    <line x1={0} y1={0} x2={0} y2={260} stroke={INK} strokeWidth={8} /><g transform="translate(4 6) scale(0.8)">{flag === 'us' ? <UsFlag /> : <VeFlag />}</g></svg></>;
};

// One small animal of the gas line (never penguin-like: gull, walrus, seal).
const LineAnimal = ({i, x, y, h}: {i: number; x: number; y: number; h: number}) => {
  const k = i % 3 + 1;
  return k === 1 ? <Seagull id={`la${i}`} x={x} y={y} h={h} flip pose={{angry: false}} />
    : k === 2 ? <Walrus id={`la${i}`} x={x} y={y} h={h * 1.1} flip hat={false} /> : <BigSeal id={`la${i}`} x={x} y={y} h={h} flip />;
};

const Ground = () => <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 60, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />;

const Intro = ({t}: {t: number}) => {
  const ride = t >= P(4), x = ride ? lerp(-200, 560, ease((t - P(4)) / 1)) : 540;
  return <>
    <Snowfall t={t} /><Ground />
    {!ride ? <Penguin id="doug" x={540} y={G} h={520} pose={{beak: 'smile', brows: 'happy', flapR: 60 + Math.sin(t * 8) * 20}} /> : <>
      {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: ((i * 300 - t * 900) % 1400 + 1400) % 1400 - 200, top: G + 20 + i * 14, width: 160, height: 6, background: '#D6E8F3', borderRadius: 3}} />)}
      <Snowmobile x={x} y={G} t={t} moving />
      <Penguin id="doug" x={x - 30} y={G - 120} h={330} pose={{side: true, turn: 1, beak: 'smile', brows: 'happy'}} />
    </>}
    <BigWord text="Doug" x={540} y={560} at={P(3)} until={P(4)} size={150} />
  </>;
};

const Drink = ({t}: {t: number}) => <>
  <Ground />
  <Snowmobile x={330} y={G} t={t} />
  <Pump x={800} y={G} t={t} run dollars={10 + (t - P(5)) * 6} />
  <Penguin id="doug" x={560} y={G} h={360} pose={{turn: 0.6, look: [0.8, -0.2], brows: 'worried'}} />
  <BigWord text="every day" x={540} y={600} at={P(6)} size={110} color={RED} />
</>;

const Oil = ({t}: {t: number}) => <>
  <Ground />
  <OilGush x={600} y={G + 5} t={t} at={P(8) - 0.1} />
  <Penguin id="doug" x={230} y={G} h={380} pose={{turn: 0.5, look: [0.6, -0.6], brows: t > P(8) ? 'shock' : 'none', eyeScale: t > P(8) ? 1.25 : 1}} />
  <BigWord text="gas ← oil" x={540} y={560} at={P(7) + 0.2} size={120} />
</>;

const Reserves = ({t}: {t: number}) => <>
  <Ground />
  <Label text="VENEZUELA" x={330} y={360} at={P(9)} t={t} />
  <BarrelPile x={330} y={G} rows={6} w={78} flag="ve" />
  <Label text="USA" x={850} y={760} at={P(10)} t={t} />
  {t >= P(10) && <BarrelPile x={850} y={G} rows={2} w={78} flag="us" />}
  <BigWord text="#1 oil pile" x={330} y={1440} at={P(9) + 1.2} color={GREEN} size={90} />
</>;

const Trick = ({t}: {t: number}) => <>
  <Ground />
  <BossBear x={lerp(1300, 560, ease((t - P(11)) / 0.6))} y={G} h={620} mouth={t > P(11) + 0.6 ? 0.4 : 0} />
  <BigWord text="Boss Bear" x={540} y={520} at={P(11) + 0.6} size={120} color={RED} />
</>;

const Pay = ({t}: {t: number}) => {
  const cut = t >= P(13), pay = t >= P(14);
  return <>
    <Ground />
    <Pump x={760} y={G} t={t} run={pay} dollars={cut ? 0.13 : 9.99} />
    <BossBear x={260} y={G} h={500} mouth={pay ? 0.3 : 0} />
    <div style={{position: 'absolute', left: 560, top: 700, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 120, color: INK}}>$$$</div>
    {cut && <BigWord text="✕" x={670} y={770} at={P(13)} color={RED} size={220} />}
    {cut && <BigWord text="1¢" x={920} y={900} at={P(13) + 0.4} color={GREEN} size={160} />}
    <BigWord text="cost" x={680} y={600} at={P(12)} until={P(13)} size={100} />
    <FishFlight x1={300} y1={G - 400} x2={760} y2={G - 250} a={P(14)} b={P(14) + 0.7} n={5} w={90} />
    <FishFlight x1={300} y1={G - 400} x2={760} y2={G - 250} a={P(14) + 0.5} b={P(14) + 1.2} n={5} w={90} seed={3} />
  </>;
};

const Subsidy = () => <Title lines={['SUBSIDY']} y={900} at={P(15)} size={150} />;

const America = ({t}: {t: number}) => <>
  <Ground />
  {t < P(18) ? <>
    <svg width={380} height={240} viewBox="0 0 190 120" style={{position: 'absolute', left: 350, top: 500}}><UsFlag /></svg>
    <BossBear x={540} y={G} h={420} sad />
    {t >= P(17) && <BigWord text="✕" x={540} y={G - 220} at={P(17)} color={RED} size={420} />}
  </> : <>
    <Refinery x={650} y={G} t={t} label="LARRY OIL" id="lo" />
    <Walrus x={250} y={G} h={440} flip pose={{lids: 0.5, laugh: t > P(19) ? 1 : 0, look: 0.6}} />
    {t >= P(19) && <MoneyBag x={260} y={G - 470} w={170} label="$$" />}
    <BigWord text="profit" x={600} y={520} at={P(19)} color={GREEN} size={120} />
  </>}
</>;

const Gull = ({t}: {t: number}) => {
  const land = ease((t - P(20)) / 0.7);
  return <>
    <Ground />
    <Pump x={720} y={G} t={t} run dollars={4.41} />
    <Seagull x={lerp(1200, 520, land)} y={lerp(300, G, land)} h={400} pose={{fly: land < 1, mouth: t > P(21) ? 0.6 : 0, holding: t > P(20) + 1}} />
    {t > P(20) + 0.9 && <FishPile x={440} y={G - 230} n={3} w={90} />}
    <BigWord text="TAX" x={540} y={520} at={P(20) + 0.5} color={RED} size={130} />
    <BigWord text="every gallon" x={540} y={1440} at={P(21)} color={RED} size={90} />
  </>;
};

// Doug + state gag: close-up, the state written big. kind: poor / happy / angry
const Mood = ({t, at, kind}: {t: number; at: number; kind: 'poor' | 'happy' | 'angry'}) => {
  const pose = kind === 'poor' ? {lids: 0.35, brows: 'worried' as const, beak: 'frown' as const, tears: true}
    : kind === 'happy' ? {beak: 'smile' as const, brows: 'happy' as const, lids: 0.3, blush: 1, flapL: 120, flapR: 120}
    : {brows: 'angry' as const, angry: 1, beak: 'frown' as const, tremble: 1};
  const steam = kind === 'angry';
  return <>
    {kind === 'angry' && <div style={{position: 'absolute', inset: 0, background: '#FFE3DF'}} />}
    {kind === 'happy' && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 200, top: 420 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}
    <Penguin id="doug" x={540} y={G + 300} h={950} pose={pose} />
    {kind === 'poor' && <>
      <div style={{position: 'absolute', left: 640, top: 1180, width: 260, height: 170, background: '#8B5A2B', border: `6px solid ${INK}`, borderRadius: 18}} />
      <div style={{position: 'absolute', left: lerp(720, 980, ease((t - at) / 0.8)), top: lerp(1150, 500, ease((t - at) / 0.8)), transform: `rotate(${t * 300}deg)`}}><Fish id="flyfish" x={0} y={0} w={110} /></div>
    </>}
    {steam && [0, 1].map((i) => { const ph = (t * 1.5 + i / 2) % 1; return <div key={i} style={{position: 'absolute', left: 300 + i * 420, top: 520 - ph * 200, width: 90 + ph * 60, height: 90 + ph * 60, borderRadius: '50%', background: '#fff', border: `5px solid ${INK}`, opacity: 1 - ph}} />; })}
    <BigWord text={`Doug ${kind}.`} x={540} y={360} at={at} size={130} color={kind === 'happy' ? GREEN : RED} />
  </>;
};

const RealLife = ({t}: {t: number}) => <>
  <BigWord text="real life" x={540} y={400} at={P(23)} size={110} />
  <Label text="USA" x={250} y={560} at={P(23)} t={t} />
  <Label text="VENEZUELA" x={830} y={568} at={P(24)} t={t} />
  <FlagPump x={250} y={G + 80} price="$4.41" flag="us" top="#D83A2E" t={t} color={RED} fill={1} />
  {t >= P(24) && <FlagPump x={830} y={G + 80} price="$0.13" flag="ve" top="#F5C518" t={t} color={GREEN} fill={1} />}
  <div style={{position: 'absolute', left: 0, right: 0, top: 1400, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 34, color: '#888'}}>AAA Oct 2026 · GlobalPetrolPrices</div>
</>;

const Move = ({t}: {t: number}) => {
  const fill = t >= P(26);
  return <>
    {!fill && <Sun x={880} y={480} t={t} size={140} />}
    <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 60, background: '#F2DCA0', borderTop: `5px solid ${INK}`}} />
    {!fill ? <>
      <div style={{position: 'absolute', left: lerp(-500, 330, ease((t - P(25)) / 0.8)), top: G - 300, width: 460, height: 230, background: '#F2F2F2', border: `6px solid ${INK}`, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Architects Daughter', fontSize: 58, fontWeight: 700}}>VENEZUELA →</div>
      <Penguin id="doug" x={lerp(-300, 220, ease((t - P(25)) / 0.8))} y={G} h={360} pose={{beak: 'smile', brows: 'happy', walk: t}} />
    </> : <>
      <Pump x={720} y={G} t={t} run={t < P(26) + 1.4} dollars={Math.min(1.95, (t - P(26)) * 1.4)} />
      <Penguin id="doug" x={430} y={G} h={420} pose={{turn: 0.6, look: [0.8, -0.3], eyeScale: 1.2, brows: 'shock'}} />
      <Receipt x={130} y={500} t={t} at={P(26) + 1} />
      <BigWord text="$1.95" x={180} y={440} at={P(26) + 1.2} color={GREEN} size={130} />
      <BigWord text="full tank" x={720} y={560} at={P(26) + 0.3} size={100} />
    </>}
  </>;
};

const Queue = ({t}: {t: number}) => {
  const back = ease((t - P(28)) / 1.2);
  return <div style={{position: 'absolute', inset: 0, transform: `scale(${1 - 0.6 * back})`, transformOrigin: '850px 1300px'}}>
    <div style={{position: 'absolute', left: -2000, right: -400, top: G, height: 60, background: '#F2DCA0', borderTop: `5px solid ${INK}`}} />
    <Pump x={900} y={G} t={t} run={false} dollars={0.13} />
    {Array.from({length: 10}, (_, i) => <LineAnimal key={i} i={i} x={700 - i * 150} y={G} h={300} />)}
    <Penguin id="doug" x={700 - 10 * 150 + 20} y={G} h={300} pose={{brows: 'shock', eyeScale: 1.3, look: [0.8, 0]}} />
    {back > 0.6 && <BigWord text="the line" x={300} y={600} at={P(28) + 0.8} size={170} color={RED} />}
  </div>;
};

const Broke = ({t}: {t: number}) => {
  const fishLeft = t < P(30) ? 10 : Math.max(0, Math.round(10 - (t - P(30)) * 12));
  const brk = t >= P(31);
  return <>
    <Ground />
    {!brk ? <>
      <BossBear x={330} y={G} h={520} sweat={t >= P(30)} sad={t >= P(30)} />
      {fishLeft > 0 && <FishPile x={330} y={G + 40} n={fishLeft} w={90} />}
      {[0, 1, 2, 3].map((i) => <FishFlight key={i} x1={330} y1={G - 300} x2={900} y2={G - 200 - i * 120} a={P(29) + i * 0.4} b={P(29) + i * 0.4 + 0.6} n={3} w={80} seed={i} />)}
      {Array.from({length: 4}, (_, i) => <LineAnimal key={i} i={i + 1} x={880 - (i % 2) * 120} y={G - (i > 1 ? 0 : 0)} h={240} />)}
      <BigWord text="everyone" x={760} y={560} at={P(29) + 0.3} size={100} />
      {t >= P(30) && <BigWord text="0 fish" x={330} y={520} at={P(30) + 0.5} color={RED} size={110} />}
    </> : <>
      <Refinery x={540} y={G} t={t} id="br" closed />
      <BigWord text="broken" x={540} y={520} at={P(31) + 0.2} color={RED} size={130} />
    </>}
  </>;
};

const NoGas = ({t}: {t: number}) => <>
  <Ground />
  <Pump x={540} y={G} t={t} run={false} dollars={0.13} />
  <BigWord text="cheap gas" x={540} y={560} at={P(32)} color={GREEN} size={110} />
  {t >= P(33) && <Stamp text="NO GAS" x={540} y={1000} at={P(33)} color={RED} size={130} />}
</>;

const Later = ({t}: {t: number}) => {
  const got = t >= P(36), think = t >= P(37), sand = t >= P(38);
  return <>
    {!sand ? <>
      <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 60, background: '#F2DCA0', borderTop: `5px solid ${INK}`}} />
      <BigWord text="3 days later..." x={540} y={460} at={P(35)} size={110} />
      <Penguin id="doug" x={460} y={G} h={430} pose={got ? {beak: 'smile', brows: 'happy', flapR: 110, lids: 0.3} : {lids: 0.6, brows: 'worried', sweat: true}} />
      {got && <div style={{position: 'absolute', left: 600, top: G - 250, width: 130, height: 160, background: '#F2B705', border: `6px solid ${INK}`, borderRadius: 12}} />}
      {think && <BigWord text="...wait" x={700} y={760} at={P(37)} size={100} />}
    </> : <>
      <Sun x={820} y={460} t={t} size={190} />
      <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: '#F2DCA0', borderTop: `5px solid ${INK}`}} />
      <Snowmobile x={540} y={G + 10} t={t} />
      <Penguin id="doug" x={510} y={G - 110} h={330} pose={{side: true, turn: 1, brows: 'shock', eyeScale: 1.3, sweat: true}} />
      <BigWord text="no snow" x={540} y={760} at={P(38) + 0.3} color={RED} size={150} />
    </>}
  </>;
};

const Cta = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 60, background: '#F2DCA0', borderTop: `5px solid ${INK}`}} />
  <BigWord text="wait for 13¢ gas?" x={540} y={470} at={P(39)} size={96} />
  {Array.from({length: 3}, (_, i) => <LineAnimal key={i} i={i} x={980 - i * 160} y={G} h={240} />)}
  <Penguin id="doug" x={360} y={G + 60} h={560} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <BigWord text="👇" x={360} y={640} at={P(40)} size={140} />
</>;

// ---------- sets ----------
const VE = P(1), SAME = P(2);
const Hook = ({t}: {t: number}) => {
  const lookR = t >= VE;
  return <>
    <Why t={t} />
    <Label text="USA" x={210} y={622} at={0.3} t={t} />
    <Label text="VENEZUELA" x={830} y={630} at={VE} t={t} />
    <FlagPump x={210} y={G + 120} price="$4.41" flag="us" top="#D83A2E" t={t} color={RED} fill={ease((t - 0.4) / 2)} />
    <FlagPump x={830} y={G + 120} price="$0.13" flag="ve" top="#F5C518" t={t} color={GREEN} fill={ease((t - VE) / 1.6)} />
    <Arrow x={540} y={512} t={t} swingAt={VE} />
    <Vs x={540} y={790} t={t} />
    <Puzzled x={392} y={830} t={t} />
    <Penguin id="doug" x={540} y={G + 60} h={470} pose={{turn: lookR ? 0.5 : -0.5, look: [lookR ? 0.8 : -0.8, -0.3], brows: lookR ? 'shock' : 'worried', eyeScale: lookR ? 1.25 : 1.05, pupil: lookR ? 0.5 : 1, beak: 'frown', flapR: 35, flapL: 35, sweat: lookR}} />
    <Stamp text="SAME GAS" x={540} y={1180} at={SAME} color={RED} size={96} />
  </>;
};

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(3), set: (t) => <Intro t={t} />, fx_: 'swipe'},
  {at: P(5), set: (t) => <Drink t={t} />, fx_: 'pop'},
  {at: P(7), set: (t) => <Oil t={t} />, fx_: 'zoom'},
  {at: P(9), set: (t) => <Reserves t={t} />, fx_: 'swipeL'},
  {at: P(11), set: (t) => <Trick t={t} />, fx_: 'iris'},
  {at: P(12), set: (t) => <Pay t={t} />, fx_: 'swipe'},
  {at: P(15), set: () => <Subsidy />, fx_: 'pop'},
  {at: P(16), set: (t) => <America t={t} />, fx_: 'swipeL'},
  {at: P(20), set: (t) => <Gull t={t} />, fx_: 'pop'},
  {at: P(22), set: (t) => <Mood t={t} at={P(22)} kind="poor" />, fx_: 'zoom'},
  {at: P(23), set: (t) => <RealLife t={t} />, fx_: 'swipe'},
  {at: P(25), set: (t) => <Move t={t} />, fx_: 'swipeL'},
  {at: P(27), set: (t) => <Mood t={t} at={P(27)} kind="happy" />, fx_: 'zoom'},
  {at: P(28), set: (t) => <Queue t={t} />, fx_: 'iris'},
  {at: P(29), set: (t) => <Broke t={t} />, fx_: 'swipe'},
  {at: P(32), set: (t) => <NoGas t={t} />, fx_: 'pop'},
  {at: P(34), set: (t) => <Mood t={t} at={P(34)} kind="angry" />, fx_: 'zoom'},
  {at: P(35), set: (t) => <Later t={t} />, fx_: 'swipeL'},
  {at: P(39), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[8, 600, 1000, 1.5], [10, 850, 1150, 1.6], [13, 740, 950, 1.3], [17, 540, 1100, 1.5], [21, 600, 1100, 1.4], [30, 330, 1000, 1.6], [33, 540, 1000, 1.5], [38, 540, 1000, 1.4]];

export const DougVenezuela = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side named (America, then Venezuela)
    const toUS = ease((tc - 0.3) / 0.6) * (tc < VE ? 1 : 0), toVE = ease((tc - VE) / 0.5) * (tc < SAME ? 1 : 0);
    s0 = 1 + 0.22 * (toUS + toVE); fx = 540 - 230 * toUS + 230 * toVE; fy = 960 + 40 * (toUS + toVE);
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    <Captions t={tc} phrases={TIM} />
    <Audio src={staticFile('doug-venezuela-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={P(0) + 1.5} name="user-cash-register" vol={0.3} />
    <Sfx at={VE + 0.5} name="user-boom" vol={0.45} />
    <Sfx at={SAME} name="user-slap" vol={0.4} />
    <Sfx at={P(3)} name="penguin-squawk" vol={0.35} />
    <Sfx at={P(5)} name="user-money" vol={0.3} />
    <Sfx at={P(6)} name="user-timer" vol={0.3} />
    <Sfx at={P(8)} name="user-boom" vol={0.4} />
    <Sfx at={P(9) + 1.2} name="user-wow" vol={0.35} />
    <Sfx at={P(10)} name="user-wrong" vol={0.3} />
    <Sfx at={P(11) + 0.6} name="user-pop" vol={0.35} />
    <Sfx at={P(13)} name="user-slap" vol={0.35} />
    <Sfx at={P(14)} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(15)} name="user-ting" vol={0.35} />
    <Sfx at={P(17)} name="user-wrong" vol={0.35} />
    <Sfx at={P(18)} name="walrus-laugh" vol={0.4} />
    <Sfx at={P(19)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(20)} name="gull-caw" vol={0.4} />
    <Sfx at={P(20) + 0.9} name="user-slap" vol={0.35} />
    <Sfx at={P(21)} name="gull-mine" vol={0.35} />
    <Sfx at={P(22)} name="user-aww" vol={0.4} />
    <Sfx at={P(23)} name="user-ting" vol={0.35} />
    <Sfx at={P(24)} name="user-boom" vol={0.35} />
    <Sfx at={P(26) + 1.2} name="user-cash-register" vol={0.35} />
    <Sfx at={P(27)} name="user-yeah" vol={0.4} />
    <Sfx at={P(28) + 0.6} name="user-wrong" vol={0.4} />
    <Sfx at={P(29)} name="user-money" vol={0.3} />
    <Sfx at={P(30) + 0.5} name="user-fahh" vol={0.45} />
    <Sfx at={P(31)} name="user-boom" vol={0.4} />
    <Sfx at={P(33)} name="user-slap" vol={0.4} />
    <Sfx at={P(34)} name="user-shock" vol={0.4} />
    <Sfx at={P(35)} name="user-timer" vol={0.3} />
    <Sfx at={P(36)} name="user-yeah" vol={0.3} />
    <Sfx at={P(38) + 0.3} name="user-horn" vol={0.4} />
    <Sfx at={P(39)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
