// EP7 "Same tank: USA $66 vs Venezuela $2 — 3 reasons". Script: videos/doug-friend/script.md, line timings: studio/src/data/doug-friend.json.
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Fish, INK, Penguin, onTwos} from '../penguin/rig';
import {Seagull, Walrus} from '../penguin/cast';
import {BigWord, FishFlight, FishPile, Stamp, Title as Sparkle} from '../penguin/world';
import {MoneyBag, OilGush, Pump, Refinery} from './dougGas';
import {BarrelPile, BossBear, FlagPump, Ground, Label, LineAnimal, UsFlag, VeFlag, Vs} from './dougVenezuela';
import {Captions, Phrase, Sfx, beat} from '../penguin/edit';
import {Fx, cutFX} from '../penguin/acting';
import TIM from '../data/doug-friend.json';

const PH = TIM as Phrase[];
const P = (i: number) => PH[i].start, E = (i: number) => PH[i].end;
export const DOUG_FRIEND_SECONDS = Math.ceil((PH[PH.length - 1].end + 0.9) * 30) / 30;
const G = 1300;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const RED = '#D83A2E', GREEN = '#2E9E4F';

// ---------- Doug's friend in Venezuela: a sea otter (only Doug + family are penguins). Name never shown. ----------
export const Otter = ({x, y, h = 360, flip, t, mood = 'happy'}: {x: number; y: number; h?: number; flip?: boolean; t: number; mood?: 'happy' | 'angry' | 'shock'}) => {
  const bob = Math.sin(t * 3) * 3, shake = mood === 'angry' ? Math.sin(t * 50) * 3 : 0;
  return <svg width={h * 0.8} height={h} viewBox="0 0 320 400" style={{position: 'absolute', left: x - h * 0.4 + shake, top: y - h + bob, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    <ellipse cx={160} cy={395} rx={110} ry={10} fill="#E3E8EC" />
    <path d="M250 360 C 320 350, 330 290, 300 250" fill="none" stroke={INK} strokeWidth={34} strokeLinecap="round" />
    <path d="M250 360 C 320 350, 330 290, 300 250" fill="none" stroke="#8A5A3B" strokeWidth={22} strokeLinecap="round" />
    <path d="M80 390 C 60 280, 90 190, 160 190 C 230 190, 260 280, 240 390 Z" fill="#8A5A3B" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
    <path d="M115 390 C 105 300, 125 240, 160 240 C 195 240, 215 300, 205 390 Z" fill="#E9D3B4" />
    <circle cx={92} cy={80} r={22} fill="#8A5A3B" stroke={INK} strokeWidth={6} /><circle cx={228} cy={80} r={22} fill="#8A5A3B" stroke={INK} strokeWidth={6} />
    <ellipse cx={160} cy={130} rx={88} ry={78} fill="#8A5A3B" stroke={INK} strokeWidth={7} />
    <ellipse cx={160} cy={150} rx={62} ry={48} fill="#E9D3B4" />
    <ellipse cx={160} cy={132} rx={15} ry={10} fill={INK} />
    <circle cx={125} cy={108} r={mood === 'shock' ? 15 : 11} fill={INK} /><circle cx={195} cy={108} r={mood === 'shock' ? 15 : 11} fill={INK} />
    <circle cx={128} cy={104} r={3.5} fill="#fff" /><circle cx={198} cy={104} r={3.5} fill="#fff" />
    {mood === 'angry' && <path d="M100 82 L145 96 M220 82 L175 96" stroke={INK} strokeWidth={8} strokeLinecap="round" />}
    {mood === 'happy' ? <path d="M140 156 Q160 176 180 156" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      : mood === 'angry' ? <path d="M138 172 Q160 152 182 172" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      : <ellipse cx={160} cy={166} rx={12} ry={14} fill={INK} />}
    <path d="M118 140 L80 132 M118 148 L78 152 M202 140 L240 132 M202 148 L242 152" stroke={INK} strokeWidth={3} strokeLinecap="round" />
    <ellipse cx={128} cy={285} rx={22} ry={16} fill="#8A5A3B" stroke={INK} strokeWidth={6} />
    <ellipse cx={192} cy={285} rx={22} ry={16} fill="#8A5A3B" stroke={INK} strokeWidth={6} />
  </svg>;
};

// ---------- real American cars (no brands): pickup truck (USA) and a big old 70s sedan (Venezuela). Side view, facing right; flip = faces left. ----------
export const Car = ({x, y, w = 340, kind, color, t, shake = 0, flip}: {x: number; y: number; w?: number; kind: 'pickup' | 'sedan'; color: string; t: number; shake?: number; flip?: boolean}) => {
  const k = w / 340, sy = Math.sin(t * 40) * 2 * shake;
  const CHROME = '#D7DDE2';
  return <svg width={w} height={200 * k} viewBox="0 0 340 200" style={{position: 'absolute', left: x - w / 2, top: y - 200 * k + sy, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    <ellipse cx={170} cy={196} rx={165} ry={9} fill="rgba(30,40,60,0.13)" />
    {kind === 'pickup' ? <>
      <rect x={12} y={82} width={168} height={72} rx={6} fill={color} stroke={INK} strokeWidth={7} />
      <line x1={20} y1={98} x2={172} y2={98} stroke={INK} strokeWidth={4} opacity={0.5} />
      <path d="M176 154 L176 44 Q178 26 196 26 L238 26 Q250 26 258 38 L278 82 L320 88 Q334 92 334 112 L334 154 Z" fill={color} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M192 40 L236 40 L258 82 L192 82 Z" fill="#CFEFFF" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <rect x={320} y={100} width={18} height={16} rx={4} fill="#FFE08A" stroke={INK} strokeWidth={4} />
      <rect x={318} y={132} width={24} height={20} rx={5} fill={CHROME} stroke={INK} strokeWidth={4} />
      <rect x={4} y={132} width={20} height={20} rx={5} fill={CHROME} stroke={INK} strokeWidth={4} />
      <rect x={196} y={92} width={22} height={7} rx={3} fill={INK} />
      {[78, 268].map((cx) => <g key={cx}><circle cx={cx} cy={154} r={38} fill={INK} /><circle cx={cx} cy={154} r={17} fill={CHROME} stroke={INK} strokeWidth={4} /></g>)}
    </> : <>
      <path d="M8 150 L8 108 Q10 96 30 94 L92 90 L122 54 Q128 48 140 48 L228 48 Q240 48 248 56 L276 90 L318 94 Q334 97 334 114 L334 150 Z" fill={color} stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M110 90 L136 60 L182 60 L182 90 Z" fill="#CFEFFF" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <path d="M194 90 L194 60 L236 60 L260 90 Z" fill="#CFEFFF" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
      <line x1={10} y1={116} x2={332} y2={116} stroke={CHROME} strokeWidth={8} />
      <line x1={10} y1={116} x2={332} y2={116} stroke={INK} strokeWidth={2} opacity={0.4} />
      <rect x={318} y={100} width={18} height={14} rx={4} fill="#FFE08A" stroke={INK} strokeWidth={4} />
      <rect x={318} y={130} width={24} height={18} rx={5} fill={CHROME} stroke={INK} strokeWidth={4} />
      <rect x={0} y={130} width={22} height={18} rx={5} fill={CHROME} stroke={INK} strokeWidth={4} />
      {[78, 264].map((cx) => <g key={cx}><circle cx={cx} cy={152} r={31} fill={INK} /><circle cx={cx} cy={152} r={15} fill={CHROME} stroke={INK} strokeWidth={4} /></g>)}
    </>}
  </svg>;
};
// fuel cap position (local, unflipped) for each car
const CAP = {pickup: [40, 112], sedan: [36, 104]} as const;

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

const HookTitle = ({t}: {t: number}) => {
  const p = ease(t / 0.25);
  return <div style={{position: 'absolute', left: 0, right: 0, top: 120, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 112, lineHeight: '120px', color: INK, opacity: p, transform: `scale(${0.6 + 0.4 * p}) rotate(-2deg)`}}>
    what's the<br />difference<span style={{color: RED}}>?</span>
  </div>;
};

const US_X = 270, VE_X = 810;
// Split stage: each side = pump at the outer edge, car in the middle of its half, character in front of the pump.
// usP / veP = fill progress 0..1 (counters + puddles).
const Split = ({t, usP, veP, usOn, veOn, title = true, otterMood = 'happy', dougPose}: {t: number; usP: number; veP: number; usOn: boolean; veOn: boolean; title?: boolean; otterMood?: 'happy' | 'angry' | 'shock'; dougPose?: object}) => {
  const GY = G + 330, CAR_W = 300, k = CAR_W / 340, carTop = GY - 60 - 200 * k;
  const US_CAR = 330, VE_CAR = 750;
  const usCap = US_CAR - CAR_W / 2 + CAP.pickup[0] * k, veCap = VE_CAR + CAR_W / 2 - CAP.sedan[0] * k;
  return <>
    <div style={{position: 'absolute', left: 538, top: 400, width: 6, height: 1100, background: INK, opacity: 0.85}} />
    <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
    {title && <HookTitle t={t} />}
    <Label text="USA" x={US_X} y={400} at={0} t={t + 1} />
    <Label text="VENEZUELA" x={VE_X} y={400} at={0} t={t + 1} />
    <Counter x={US_X} y={520} v={66 * usP} color={RED} />
    <Counter x={VE_X} y={520} v={2 * veP} color={GREEN} />
    <div style={{position: 'absolute', left: 0, top: 0, transform: 'translate(-30px, 330px) scale(0.72)', transformOrigin: '0 0'}}>
      <FlagPump x={180} y={G} price={`$${Math.round(66 * usP)}`} unit="/ TANK" flag="us" top={RED} t={t} color={RED} fill={usP} />
    </div>
    <div style={{position: 'absolute', left: 0, top: 0, transform: 'translate(330px, 330px) scale(0.72)', transformOrigin: '0 0'}}>
      <FlagPump x={830} y={G} price={`$${Math.round(2 * veP)}`} unit="/ TANK" flag="ve" top="#F5C518" t={t} color={GREEN} fill={veP} />
    </div>
    <Car x={US_CAR} y={GY - 60} w={CAR_W} kind="pickup" color="#C8352B" t={t} shake={usOn ? 1 : 0} />
    <Car x={VE_CAR} y={GY - 60} w={CAR_W} kind="sedan" color="#7FCFB8" t={t} shake={veOn ? 1 : 0} flip />
    <Fueling px={120} py={G + 10} cx={usCap} cy={carTop + CAP.pickup[1] * k} gy={GY - 60} dir={1} t={t} on={usOn} spill={usP} />
    <Fueling px={960} py={G + 10} cx={veCap} cy={carTop + CAP.sedan[1] * k} gy={GY - 60} dir={-1} t={t} on={veOn} spill={veP} />
    <Penguin id="doug" x={110} y={GY + 60} h={300} pose={dougPose ?? {turn: 0.6, look: [0.3, -0.9], brows: usP > 0.5 ? 'shock' : 'worried', eyeScale: 1 + 0.3 * usP, flapR: 75 + Math.sin(t * 10) * 8, sweat: usP > 0.4, tremble: usP > 0.7 && usOn ? 1 : 0}} />
    <div style={{position: 'absolute', left: 0, top: 0, transform: `translateY(${-Math.abs(Math.sin(t * 6)) * 14 * (veOn ? 1 : 0)}px)`}}>
      <Otter x={975} y={GY + 60} h={290} flip t={t} mood={otterMood} />
    </div>
    <Vs x={540} y={1060} t={t + 1} />
  </>;
};

const Hook = ({t}: {t: number}) => {
  const usP = ease((t - 0.2) / (P(2) - 0.4)), veP = ease((t - P(2)) / (P(4) - P(2) - 0.2));
  return <Split t={t} usP={usP} veP={veP} usOn={t > 0.2 && usP < 0.995} veOn={t > P(2) && veP < 0.995} />;
};

// ---------- 3 cards: face-down "?" cards, each reason flips one ----------
const FACES = [{text: 'OIL', icon: '🛢️', color: '#2B2B2B'}, {text: 'SUBSIDY', icon: '🐻‍❄️', color: GREEN}, {text: 'TAX + PROFIT', icon: '💰', color: RED}];
const Card = ({x, y, at, t, tilt, flipAt, face, big}: {x: number; y: number; at: number; t: number; tilt: number; flipAt?: number; face: typeof FACES[number]; big?: boolean}) => {
  const p = ease((t - at) / 0.22), over = p < 1 ? Math.sin(p * Math.PI) * 0.15 : 0;
  const fl = Math.sin(t * 3 + x) * 10, f = flipAt === undefined ? 0 : cl((t - flipAt) / 0.35);
  const sx = Math.abs(Math.cos(f * Math.PI)), front = f >= 0.5, s = (p + over) * (big && front ? lerp(1, 1.25, ease((t - flipAt! - 0.3) / 0.3)) : 1);
  return <div style={{position: 'absolute', left: x - 120, top: y - 170 + fl, width: 240, height: 340, borderRadius: 26, background: front ? '#FFFDF5' : '#2F6FD6', border: `8px solid ${INK}`, boxSizing: 'border-box',
    transform: `scale(${s}) rotate(${tilt}deg) scaleX(${Math.max(0.02, sx)})`, opacity: p > 0 ? 1 : 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 14px 0 rgba(0,0,0,0.12)', zIndex: big ? 2 : 1}}>
    {!front ? <>
      <div style={{position: 'absolute', inset: 14, borderRadius: 16, border: '5px dashed rgba(255,255,255,0.55)'}} />
      <span style={{fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 210, color: '#fff', lineHeight: 1, textShadow: `0 6px 0 ${INK}`}}>?</span>
    </> : <>
      <div style={{fontSize: 110, lineHeight: 1}}>{face.icon}</div>
      <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: face.text.length > 8 ? 34 : face.text.length > 4 ? 42 : 54, color: face.color, marginTop: 16, textAlign: 'center', lineHeight: 1.1}}>{face.text}</div>
    </>}
  </div>;
};
// open = index of the card being flipped now (cards before it are already open).
const Cards = ({t, at, open, flipAt, intro}: {t: number; at: number; open: number; flipAt?: number; intro?: boolean}) => {
  const tp = ease((t - at) / 0.25), pos = [[250, 760, -10], [540, 700, 0], [830, 760, 10]];
  return <>
    <div style={{position: 'absolute', left: -400, right: -400, top: G + 200, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
    <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 130, color: INK, transform: `scale(${0.6 + 0.4 * tp}) rotate(-2deg)`, opacity: tp}}>
      {intro ? <><span style={{color: RED}}>3</span> REASONS</> : <>REASON <span style={{color: RED}}>{open + 1}</span></>}
    </div>
    {pos.map(([x, y, r], i) => <Card key={i} x={x} y={y} tilt={r} t={t} face={FACES[i]} at={intro ? at + 0.1 + i * 0.15 : -9}
      flipAt={intro ? undefined : i < open ? -9 : i === open ? flipAt : undefined} big={!intro && i === open} />)}
    <Penguin id="doug" x={540} y={G + 180} h={420} pose={{look: [intro ? 0 : (open - 1) * 0.6, -0.9], brows: intro ? 'worried' : 'none', eyeScale: 1.25, beak: intro ? undefined : 'smile'}} />
  </>;
};

// ---------- reason 1: oil ----------
const Oil = ({t}: {t: number}) => <>
  <Ground />
  <OilGush x={640} y={G + 5} t={t} at={P(7) + 0.9} />
  <Penguin id="doug" x={250} y={G} h={380} pose={{turn: 0.5, look: [0.6, -0.6], brows: t > P(7) + 0.9 ? 'shock' : 'none', eyeScale: t > P(7) + 0.9 ? 1.25 : 1}} />
  <BigWord text="gas ← oil" x={540} y={520} at={P(7) + 0.2} size={120} />
</>;

const Reserves = ({t}: {t: number}) => <>
  <Ground />
  <Label text="VENEZUELA" x={330} y={340} at={P(8)} t={t} />
  <BarrelPile x={330} y={G} rows={6} w={78} flag="ve" />
  <Label text="USA" x={850} y={760} at={P(9)} t={t} />
  {t >= P(9) && <BarrelPile x={850} y={G} rows={2} w={78} flag="us" />}
  <BigWord text="#1 in the world" x={540} y={1400} at={P(8) + 1.2} color={GREEN} size={80} />
</>;

const Close = ({t}: {t: number}) => {
  const flow = ease((t - P(10) - 0.6) / 1);
  return <>
    <Ground />
    <svg width={190} height={120} viewBox="0 0 190 120" style={{position: 'absolute', left: 60, top: 560}}><VeFlag /></svg>
    <BarrelPile x={200} y={G} rows={3} w={70} flag="ve" />
    <div style={{position: 'absolute', left: 300, top: G - 70, width: 420 * flow, height: 34, background: '#2B2B2B', border: `5px solid ${INK}`, borderRadius: 10}} />
    <Pump x={820} y={G} t={t} run={flow > 0.9} dollars={2} />
    <Otter x={620} y={G} h={300} t={t} />
    <BigWord text="close to home" x={540} y={460} at={P(10) + 0.6} size={100} />
    {t > P(10) + 1.4 && <Stamp text="CHEAP" x={760} y={760} at={P(10) + 1.4} color={GREEN} size={110} />}
  </>;
};

// ---------- reason 2: subsidy ----------
const Boss = ({t}: {t: number}) => <>
  <Ground />
  <svg width={380} height={240} viewBox="0 0 190 120" style={{position: 'absolute', left: 350, top: 380}}><VeFlag /></svg>
  <BossBear x={lerp(1300, 540, ease((t - P(12)) / 0.6))} y={G} h={620} mouth={t > P(12) + 0.6 ? 0.4 : 0} />
</>;

const Pay = ({t}: {t: number}) => {
  const cut = t >= P(14), pay = t >= P(14) + 1.2;
  return <>
    <Ground />
    <Pump x={760} y={G} t={t} run={pay} dollars={cut ? 2 : 66} />
    <BossBear x={260} y={G} h={500} mouth={cut ? 0.4 : 0} />
    <BigWord text="real cost" x={700} y={520} at={P(13)} until={P(14)} size={100} />
    {cut && <BigWord text="pay $2" x={700} y={520} at={P(14)} color={GREEN} size={110} />}
    {pay && <BigWord text="I pay rest" x={300} y={640} at={P(14) + 1.2} color={RED} size={90} />}
    <FishFlight x1={300} y1={G - 400} x2={760} y2={G - 250} a={P(14) + 1.2} b={P(14) + 1.9} n={5} w={90} />
    <FishFlight x1={300} y1={G - 400} x2={760} y2={G - 250} a={P(14) + 1.6} b={P(14) + 2.3} n={5} w={90} seed={3} />
  </>;
};

const Subsidy = () => <Sparkle lines={['SUBSIDY']} y={900} at={P(15)} size={150} />;

// Doug + state gag: close-up, the state written big.
const Mood = ({t, at, kind}: {t: number; at: number; kind: 'poor' | 'happy' | 'jealous'}) => {
  const pose = kind === 'poor' ? {lids: 0.35, brows: 'worried' as const, beak: 'frown' as const, tears: true}
    : kind === 'happy' ? {beak: 'smile' as const, brows: 'happy' as const, lids: 0.3, blush: 1, flapL: 120, flapR: 120}
    : {brows: 'angry' as const, beak: 'frown' as const, lids: 0.45, look: [0.8, 0] as [number, number]};
  return <>
    {kind === 'jealous' && <div style={{position: 'absolute', inset: 0, background: '#E5F6E1'}} />}
    {kind === 'happy' && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 120 + i * 200, top: 420 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}
    <Penguin id="doug" x={kind === 'jealous' ? 420 : 540} y={G + 300} h={950} pose={pose} />
    {kind === 'jealous' && <div style={{position: 'absolute', left: 840, top: 1000}}><Otter x={0} y={300} h={280} t={t} flip /><div style={{position: 'absolute', left: -60, top: -40, fontFamily: 'Montserrat', fontWeight: 900, fontSize: 70, color: GREEN}}>$2</div></div>}
    {kind === 'poor' && <>
      <div style={{position: 'absolute', left: 640, top: 1180, width: 260, height: 170, background: '#8B5A2B', border: `6px solid ${INK}`, borderRadius: 18}} />
      <div style={{position: 'absolute', left: lerp(720, 980, ease((t - at) / 0.8)), top: lerp(1150, 500, ease((t - at) / 0.8)), transform: `rotate(${t * 300}deg)`}}><Fish id="flyfish" x={0} y={0} w={110} /></div>
    </>}
    <BigWord text={`Doug ${kind}.`} x={540} y={360} at={at} size={130} color={kind === 'poor' ? RED : GREEN} />
  </>;
};

// ---------- reason 3: no Boss Bear, Larry's profit, cost stack, Tax Gull ----------
const America = ({t}: {t: number}) => <>
  <Ground />
  <svg width={380} height={240} viewBox="0 0 190 120" style={{position: 'absolute', left: 350, top: 380}}><UsFlag /></svg>
  <BossBear x={300} y={G} h={380} sad />
  {t >= P(18) + 0.5 && <BigWord text="✕" x={300} y={G - 200} at={P(18) + 0.5} color={RED} size={380} />}
  <Pump x={820} y={G} t={t} run dollars={10 + Math.max(0, t - P(18)) * 22} />
  {t >= P(18) + 1.4 && <Penguin id="doug" x={620} y={G} h={360} pose={{turn: 0.6, look: [0.8, -0.3], brows: 'worried', sweat: true}} />}
  {t >= P(18) + 1.4 && <BigWord text="full price" x={700} y={720} at={P(18) + 1.4} color={RED} size={100} />}
</>;

const Larry = ({t}: {t: number}) => <>
  <Ground />
  <Refinery x={650} y={G} t={t} label="LARRY OIL" id="lo" />
  <Walrus x={250} y={G} h={440} flip pose={{lids: 0.5, laugh: t > P(19) + 1 ? 1 : 0, look: 0.6}} />
  {t >= P(19) + 1 && <MoneyBag x={260} y={G - 470} w={170} label="$$" />}
  <BigWord text="profit" x={600} y={500} at={P(19) + 1} color={GREEN} size={120} />
</>;

const Stack = ({t}: {t: number}) => {
  const parts = [{n: 'OIL', c: '#3A3A3A'}, {n: 'REFINERY', c: '#7B8794'}, {n: 'TRUCK', c: '#2F6FD6'}, {n: 'TAX', c: RED}];
  const dur = E(20) - P(20);
  return <>
    <Ground />
    <Penguin id="doug" x={230} y={G} h={360} pose={{turn: 0.6, look: [0.8, -0.5], brows: 'worried'}} />
    {parts.map((p, i) => { const a = P(20) + 0.25 + i * dur / 4.6, k = ease((t - a) / 0.3);
      return <div key={i} style={{position: 'absolute', left: 520, width: 420, top: lerp(-200, G - 140 - i * 150, k), height: 130, background: p.c, border: `6px solid ${INK}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Montserrat', fontWeight: 900, fontSize: 56, color: '#fff', opacity: t >= a ? 1 : 0}}>{p.n}</div>; })}
    <BigWord text="$4.41" x={730} y={500} at={E(20) - 0.4} color={RED} size={130} />
  </>;
};

const Gull = ({t}: {t: number}) => {
  const land = ease((t - P(21)) / 0.7);
  return <>
    <Ground />
    <Pump x={720} y={G} t={t} run dollars={4.41} />
    <Seagull x={lerp(1200, 520, land)} y={lerp(300, G, land)} h={400} pose={{fly: land < 1, mouth: t > P(21) + 1.1 ? 0.6 : 0, holding: t > P(21) + 1}} />
    {t > P(21) + 0.9 && <FishPile x={440} y={G - 230} n={3} w={90} />}
    <BigWord text="TAX" x={540} y={520} at={P(21) + 0.5} color={RED} size={130} />
    <BigWord text="every gallon" x={540} y={1420} at={P(21) + 1.1} color={RED} size={80} />
  </>;
};

// ---------- real life numbers ----------
const RealLife = ({t}: {t: number}) => <>
  <BigWord text="real life" x={540} y={380} at={P(23)} size={110} />
  <Label text="USA" x={250} y={540} at={P(23)} t={t} />
  <Label text="VENEZUELA" x={830} y={548} at={P(24)} t={t} />
  <FlagPump x={250} y={G + 80} price="$4.41" flag="us" top={RED} t={t} color={RED} fill={1} />
  {t >= P(24) && <FlagPump x={830} y={G + 80} price="$0.13" flag="ve" top="#F5C518" t={t} color={GREEN} fill={1} />}
  {t >= P(25) && <Stamp text="30x CHEAPER" x={540} y={1400} at={P(25)} color={GREEN} size={78} rot={-6} />}
  <div style={{position: 'absolute', left: 0, right: 0, top: 1650, textAlign: 'center', fontFamily: 'Architects Daughter', fontSize: 34, color: '#888'}}>AAA 2026 · GlobalPetrolPrices</div>
</>;

// ---------- twist: the line, Boss Bear broke, no gas ----------
const Queue = ({t}: {t: number}) => {
  const back = ease((t - P(26) - 0.9) / 1.0);
  return <div style={{position: 'absolute', inset: 0, transform: `scale(${1 - 0.6 * back}) translateX(${1100 * (1 - back)}px)`, transformOrigin: '850px 1300px'}}>
    <div style={{position: 'absolute', left: -2000, right: -400, top: G, height: 60, background: '#F2DCA0', borderTop: `5px solid ${INK}`}} />
    <Pump x={900} y={G} t={t} run={false} dollars={0.13} />
    {Array.from({length: 10}, (_, i) => <LineAnimal key={i} i={i} x={700 - i * 150} y={G} h={300} />)}
    <Otter x={700 - 10 * 150 + 10} y={G} h={300} t={t} mood={back > 0.3 ? 'shock' : 'happy'} />
    {back < 0.2 && <BigWord text="friend happy" x={-560} y={520} at={P(26)} color={GREEN} size={110} />}
    {back > 0.6 && <BigWord text="the line" x={300} y={600} at={P(26) + 1.5} size={170} color={RED} />}
  </div>;
};

const Broke = ({t}: {t: number}) => {
  const fishLeft = t < P(27) + 1.4 ? 10 : Math.max(0, Math.round(10 - (t - P(27) - 1.4) * 12));
  return <>
    <Ground />
    <BossBear x={330} y={G} h={520} sweat={t >= P(27) + 1.4} sad={t >= P(27) + 1.4} />
    {fishLeft > 0 && <FishPile x={330} y={G + 40} n={fishLeft} w={90} />}
    {[0, 1, 2, 3].map((i) => <FishFlight key={i} x1={330} y1={G - 300} x2={900} y2={G - 200 - i * 120} a={P(27) + i * 0.35} b={P(27) + i * 0.35 + 0.6} n={3} w={80} seed={i} />)}
    {Array.from({length: 4}, (_, i) => <LineAnimal key={i} i={i + 1} x={880 - (i % 2) * 120} y={G} h={240} />)}
    <BigWord text="everyone" x={760} y={560} at={P(27) + 0.3} size={100} />
    {t >= P(27) + 1.4 && <BigWord text="0 fish" x={330} y={500} at={P(27) + 1.6} color={RED} size={110} />}
  </>;
};

const NoFix = ({t}: {t: number}) => <>
  <Ground />
  <Refinery x={540} y={G} t={t} id="br" closed />
  <BigWord text="no fix" x={540} y={480} at={P(28) + 0.5} color={RED} size={130} />
</>;

const NoGas = ({t}: {t: number}) => <>
  <Ground />
  <Pump x={540} y={G} t={t} run={false} dollars={0.13} />
  <BigWord text="cheap gas" x={540} y={520} at={P(29)} color={GREEN} size={110} />
  {t >= P(29) + 0.55 && <Stamp text="NO GAS" x={540} y={1000} at={P(29) + 0.55} color={RED} size={130} />}
</>;

const FriendAngry = ({t}: {t: number}) => <>
  <div style={{position: 'absolute', inset: 0, background: '#FFE3DF'}} />
  <Otter x={540} y={G + 300} h={900} t={t} mood="angry" />
  {[0, 1].map((i) => { const ph = (t * 1.5 + i / 2) % 1; return <div key={i} style={{position: 'absolute', left: 300 + i * 380, top: 660 - ph * 180, width: 90 + ph * 60, height: 90 + ph * 60, borderRadius: '50%', background: '#fff', border: `5px solid ${INK}`, opacity: 1 - ph}} />; })}
  <BigWord text="friend angry." x={540} y={360} at={P(30)} size={120} color={RED} />
</>;

const DrivesOff = ({t}: {t: number}) => {
  const go = ease((t - P(31) - 1.1) / 1.2), cx = lerp(560, 1500, go);
  return <>
    <Ground />
    {[0, 1, 2, 3].map((i) => <div key={i} style={{position: 'absolute', left: ((i * 300 - t * 900) % 1400 + 1400) % 1400 - 200, top: G + 20 + i * 12, width: 160, height: 6, background: '#D6E8F3', borderRadius: 3, opacity: go}} />)}
    <svg width={190} height={120} viewBox="0 0 190 120" style={{position: 'absolute', left: 80, top: 480}}><UsFlag /></svg>
    <Car x={cx} y={G + 20} w={520} kind="pickup" color="#C8352B" t={t} shake={0.3} />
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1142, overflow: 'hidden'}}><Penguin id="doug" x={cx + 88} y={1215} h={150} shadow={false} pose={{side: true, turn: 1, beak: 'smile', brows: 'happy'}} /></div>
    <BigWord text="$66" x={300} y={760} at={P(31)} color={RED} size={130} />
    {t >= P(31) + 1.1 && <Stamp text="NO LINE" x={620} y={430} at={P(31) + 1.1} color={GREEN} size={120} />}
  </>;
};

const SameTank = ({t}: {t: number}) => <>
  <Split t={t} usP={1} veP={1} usOn={false} veOn={false} title={false} otterMood="angry" dougPose={{beak: 'smile', brows: 'happy', turn: 0.4}} />
  <Stamp text="SAME TANK" x={540} y={230} at={P(33)} color={INK} size={110} rot={-4} />
</>;

const Cta = ({t}: {t: number}) => <>
  <Ground />
  <div style={{position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 76, color: INK, lineHeight: 1.2}}>
    <span style={{color: GREEN}}>CHEAP + LINE</span><br /><span style={{fontFamily: 'Architects Daughter', fontSize: 70}}>or</span><br /><span style={{color: RED}}>PAY MORE + GO</span>?
  </div>
  {Array.from({length: 3}, (_, i) => <LineAnimal key={i} i={i} x={980 - i * 160} y={G} h={240} />)}
  <Penguin id="doug" x={330} y={G + 60} h={520} pose={{flapR: 120 + Math.sin(t * 10) * 10, beak: 'smile', look: [0.3, 0.6]}} />
  <BigWord text="👇" x={330} y={700} at={E(34) - 1} size={140} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook t={t} />},
  {at: P(5), set: (t) => <Cards t={t} at={P(5)} open={0} intro />, fx_: 'swipe'},
  {at: P(6), set: (t) => <Cards t={t} at={P(6)} open={0} flipAt={P(6) + 0.2} />, fx_: 'pop'},
  {at: P(7), set: (t) => <Oil t={t} />, fx_: 'zoom'},
  {at: P(8), set: (t) => <Reserves t={t} />, fx_: 'swipeL'},
  {at: P(10), set: (t) => <Close t={t} />, fx_: 'swipe'},
  {at: P(11), set: (t) => <Cards t={t} at={P(11)} open={1} flipAt={P(11) + 0.2} />, fx_: 'pop'},
  {at: P(12), set: (t) => <Boss t={t} />, fx_: 'iris'},
  {at: P(13), set: (t) => <Pay t={t} />, fx_: 'swipe'},
  {at: P(15), set: () => <Subsidy />, fx_: 'pop'},
  {at: P(16), set: (t) => <Mood t={t} at={P(16)} kind="jealous" />, fx_: 'zoom'},
  {at: P(17), set: (t) => <Cards t={t} at={P(17)} open={2} flipAt={P(17) + 0.2} />, fx_: 'pop'},
  {at: P(18), set: (t) => <America t={t} />, fx_: 'swipeL'},
  {at: P(19), set: (t) => <Larry t={t} />, fx_: 'swipe'},
  {at: P(20), set: (t) => <Stack t={t} />, fx_: 'iris'},
  {at: P(21), set: (t) => <Gull t={t} />, fx_: 'pop'},
  {at: P(22), set: (t) => <Mood t={t} at={P(22)} kind="poor" />, fx_: 'zoom'},
  {at: P(23), set: (t) => <RealLife t={t} />, fx_: 'swipe'},
  {at: P(26), set: (t) => <Queue t={t} />, fx_: 'swipeL'},
  {at: P(27), set: (t) => <Broke t={t} />, fx_: 'iris'},
  {at: P(28), set: (t) => <NoFix t={t} />, fx_: 'swipe'},
  {at: P(29), set: (t) => <NoGas t={t} />, fx_: 'pop'},
  {at: P(30), set: (t) => <FriendAngry t={t} />, fx_: 'zoom'},
  {at: P(31), set: (t) => <DrivesOff t={t} />, fx_: 'swipeL'},
  {at: P(32), set: (t) => <Mood t={t} at={P(32)} kind="happy" />, fx_: 'zoom'},
  {at: P(33), set: (t) => <SameTank t={t} />, fx_: 'swipe'},
  {at: P(34), set: (t) => <Cta t={t} />, fx_: 'pop'},
];
// deep zooms [segment, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[7, 480, 1050, 1.3], [9, 850, 1150, 1.6], [14, 540, 1000, 1.2], [19, 430, 1000, 1.3], [21, 560, 1100, 1.4], [24, 830, 1000, 1.35], [29, 540, 1050, 1.35]];

export const DougFriend = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.012 * (tc - sh.at), fx = 540, fy = 960;
  if (sh.at === 0) { // hook: push toward the side being spoken, wide again on the question
    const toUS = ease((tc - 0.3) / 0.5) * (tc < P(2) ? 1 : 0), toVE = ease((tc - P(2)) / 0.5) * (tc < P(4) ? 1 : 0);
    s0 = 1 + 0.18 * (toUS + toVE); fx = 540 - 200 * toUS + 200 * toVE;
  }
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (tc < 0.3 ? 1 : beat(tc, PH));
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(t)}</AbsoluteFill>
    </AbsoluteFill>
    {tc >= P(5) && <Captions t={tc} phrases={PH} />}
    <Audio src={staticFile('doug-friend-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={P(1)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(3)} name="user-ting" vol={0.4} />
    <Sfx at={P(5) + 0.1} name="user-pop" vol={0.3} />
    <Sfx at={P(5) + 0.25} name="user-pop" vol={0.3} />
    <Sfx at={P(5) + 0.4} name="user-boom" vol={0.4} />
    {[6, 11, 17].map((i) => <Sfx key={`f${i}`} at={P(i) + 0.2} name="user-pop" vol={0.4} />)}
    <Sfx at={P(7) + 0.9} name="user-boom" vol={0.4} />
    <Sfx at={P(8) + 1.2} name="user-wow" vol={0.35} />
    <Sfx at={P(9)} name="user-wrong" vol={0.3} />
    <Sfx at={P(10) + 1.4} name="user-money" vol={0.3} />
    <Sfx at={P(12) + 0.6} name="user-pop" vol={0.35} />
    <Sfx at={P(14)} name="user-slap" vol={0.35} />
    <Sfx at={P(14) + 1.2} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(15)} name="user-ting" vol={0.35} />
    <Sfx at={P(16)} name="user-wrong" vol={0.35} />
    <Sfx at={P(18) + 0.5} name="user-wrong" vol={0.35} />
    <Sfx at={P(18) + 1.4} name="user-timer" vol={0.3} />
    <Sfx at={P(19) + 1} name="user-cash-register" vol={0.35} />
    {[0, 1, 2, 3].map((i) => <Sfx key={`st${i}`} at={P(20) + 0.25 + i * (E(20) - P(20)) / 4.6} name="user-slap" vol={0.25} />)}
    <Sfx at={E(20) - 0.4} name="user-ting" vol={0.35} />
    <Sfx at={P(21) + 0.9} name="user-slap" vol={0.35} />
    <Sfx at={P(22)} name="user-aww" vol={0.4} />
    <Sfx at={P(23)} name="user-ting" vol={0.35} />
    <Sfx at={P(24)} name="user-boom" vol={0.35} />
    <Sfx at={P(25)} name="user-ting" vol={0.4} />
    <Sfx at={P(26) + 1.5} name="user-wrong" vol={0.4} />
    <Sfx at={P(27)} name="user-money" vol={0.3} />
    <Sfx at={P(27) + 1.6} name="user-fahh" vol={0.45} />
    <Sfx at={P(28) + 0.5} name="user-boom" vol={0.4} />
    <Sfx at={P(29) + 0.55} name="user-slap" vol={0.4} />
    <Sfx at={P(30)} name="user-shock" vol={0.4} />
    <Sfx at={P(31)} name="user-cash-register" vol={0.3} />
    <Sfx at={P(31) + 1.1} name="user-yeah" vol={0.35} />
    <Sfx at={P(32)} name="user-wow" vol={0.35} />
    <Sfx at={P(33)} name="user-slap" vol={0.35} />
    <Sfx at={P(34)} name="user-pop" vol={0.35} />
  </AbsoluteFill>;
};
