// DOUG PAYS · EP. 2 "Lost debit card" (2026-10-26): Doug writes his PIN on his card, leaves it in a café, Weasel drains
// $10,000 at the ATM ($1,000 a day), bank calls "why?", Doug checks under his bed, ATM camera -> police catch Weasel,
// bank returns $9,999, $1 = a fish tail. Warning story (no method). Night look v3.
// VO: Kokoro am_fenrir 1.3, one take per paragraph (videos/doug-card-ep2/vo/paras.txt). Phrase map: data/doug-card-ep2.json.
// Sources: CFPB Reg E comment 6(b)-2 (PIN on card does not raise liability), 12 CFR 1005.6 ($50 / $500 / 60 days).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Fish, INK, Penguin, onTwos} from '../penguin/rig';
import {Puffin} from '../penguin/cast';
import {FishFlight, Stamp} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {GlassCard, NightBg, NightGround, N_GREEN, N_RED, Pill, SeriesBadge} from '../penguin/night';
import {Fox} from './dougLaundering';
import {Card, Phone, PoliceBear, PopIn, Word} from './dougPaysEp1';
import {Atm, Hook2, RealBank, TopLine2} from './dougPays2Hook';
import TIM from '../data/doug-card-ep2.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_PAYS_EP2_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.9) * 30) / 30;
const G = 1250;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const SANS = 'Montserrat';

// ---------- props ----------
// Debit card; `pin` = Doug's hand-written PIN on it (draws on from pinAt)
const DebitCard = ({x, y, w = 420, rot = 0, pinAt = -99, t, glint = false}: {x: number; y: number; w?: number; rot?: number; pinAt?: number; t: number; glint?: boolean}) => {
  const k = w / 420, pin = cl((t - pinAt) / 0.8);
  return <div style={{position: 'absolute', left: x - w / 2, top: y - w * 0.315, width: w, height: w * 0.63, transform: `rotate(${rot}deg)`}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 26 * k, background: 'linear-gradient(135deg, #2F6FD8, #1B3F8F)', border: `${6 * k}px solid ${INK}`, boxSizing: 'border-box', boxShadow: glint ? `0 0 ${30 + 25 * Math.abs(Math.sin(t * 6))}px #fff` : 'none'}} />
    <div style={{position: 'absolute', left: 30 * k, top: 26 * k, fontFamily: SANS, fontWeight: 900, fontSize: 30 * k, color: '#fff', letterSpacing: 3}}>DEBIT</div>
    <div style={{position: 'absolute', left: 30 * k, top: 80 * k, width: 70 * k, height: 54 * k, borderRadius: 10 * k, background: '#E8C25A', border: `${4 * k}px solid ${INK}`, boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: 30 * k, top: 160 * k, fontFamily: SANS, fontWeight: 700, fontSize: 30 * k, color: '#DCE7FF', letterSpacing: 4}}>•••• •••• 4821</div>
    <div style={{position: 'absolute', left: 30 * k, top: 205 * k, fontFamily: SANS, fontWeight: 800, fontSize: 24 * k, color: '#fff'}}>DOUG</div>
    {pin > 0 && <div style={{position: 'absolute', right: 20 * k, top: 70 * k, padding: `${4 * k}px ${12 * k}px`, background: '#FFF6A8', border: `${4 * k}px solid ${INK}`, transform: 'rotate(6deg)',
      fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 44 * k, color: N_RED, clipPath: `inset(0 ${(1 - pin) * 100}% 0 0)`}}>PIN 1234</div>}
  </div>;
};

// Weasel: long white snow weasel, black tail tip, sneaky eyes. Faces right by default. (x, y) = ground.
const Weasel = ({x, y, h = 300, t, flip, happy, sad}: {x: number; y: number; h?: number; t: number; flip?: boolean; happy?: boolean; sad?: boolean}) => {
  const hop = happy ? Math.abs(Math.sin(t * 9)) * 40 : 0, tail = Math.sin(t * 6) * 10;
  return <svg width={h * 1.4} height={h} viewBox="0 0 420 300" style={{position: 'absolute', left: x - h * 0.7, top: y - h - hop, overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
    <ellipse cx={210} cy={296} rx={150} ry={9} fill="rgba(0,0,0,0.25)" />
    <g transform={`rotate(${tail} 90 230)`}><path d="M90 230 C 40 240, 10 200, 20 170 C 40 195, 70 205, 100 205 Z" fill="#FBFBF7" stroke={INK} strokeWidth={6} strokeLinejoin="round" /><path d="M20 170 C 14 186, 18 196, 30 190 C 26 182, 24 176, 20 170 Z" fill={INK} /></g>
    <path d="M80 250 C 70 190, 130 170, 230 175 C 290 178, 320 200, 315 250 C 310 280, 100 285, 80 250 Z" fill="#FBFBF7" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M120 270 l-6 28 M170 275 l0 24 M260 272 l4 26 M295 262 l10 26" stroke={INK} strokeWidth={10} strokeLinecap="round" />
    <path d="M280 200 C 280 140, 330 110, 370 125 C 405 138, 410 180, 380 200 C 350 220, 300 225, 280 200 Z" fill="#FBFBF7" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <path d="M300 128 l6 -30 l22 24 Z M350 118 l14 -28 l12 32 Z" fill="#FBFBF7" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={402} cy={168} r={9} fill={INK} />
    {happy ? <><path d="M330 150 q10 -12 20 0" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" /><path d="M362 150 q10 -12 20 0" fill="none" stroke={INK} strokeWidth={6} strokeLinecap="round" /><path d="M350 188 q20 18 42 0" fill="#7A1F1F" stroke={INK} strokeWidth={5} /></>
      : <><ellipse cx={340} cy={152} rx={10} ry={sad ? 10 : 6} fill={INK} /><ellipse cx={372} cy={152} rx={10} ry={sad ? 10 : 6} fill={INK} /><path d={sad ? 'M325 132 l25 10 M390 132 l-22 10' : 'M325 140 l25 4 M390 140 l-22 4'} stroke={INK} strokeWidth={5} strokeLinecap="round" />
        <path d={sad ? 'M352 196 q16 -10 32 0' : 'M352 190 q16 8 32 -4'} fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" /></>}
  </svg>;
};

const Cafe = () => <>
  <div style={{position: 'absolute', left: 560, top: G - 560, width: 480, height: 130, background: '#8B5A2B', border: `7px solid ${INK}`, borderRadius: 16, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 64, color: '#FFF3D6'}}>☕ CAFÉ</div>
  <div style={{position: 'absolute', left: 600, top: G - 240, width: 400, height: 240, background: '#A0703F', border: `7px solid ${INK}`, boxSizing: 'border-box'}} />
</>;
const Table = ({x}: {x: number}) => <>
  <div style={{position: 'absolute', left: x - 170, top: G - 260, width: 340, height: 28, background: '#C98A4B', border: `6px solid ${INK}`, borderRadius: 8}} />
  <div style={{position: 'absolute', left: x - 14, top: G - 236, width: 28, height: 236, background: '#9A6A35', border: `6px solid ${INK}`, boxSizing: 'border-box'}} />
</>;
const Cup = ({x, y}: {x: number; y: number}) => <div style={{position: 'absolute', left: x - 34, top: y - 60, width: 68, height: 60, background: '#fff', border: `6px solid ${INK}`, borderRadius: '0 0 20px 20px', boxSizing: 'border-box'}} />;
const Bill = ({x, y, rot = 0}: {x: number; y: number; rot?: number}) => <div style={{position: 'absolute', left: x - 70, top: y - 34, width: 140, height: 68, background: '#8FD19E', border: `5px solid ${INK}`, borderRadius: 8, transform: `rotate(${rot}deg)`,
  display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 34, color: '#1E5B2E', boxSizing: 'border-box'}}>$</div>;
const Bed = ({x, y}: {x: number; y: number}) => <>
  <div style={{position: 'absolute', left: x - 330, top: y - 200, width: 660, height: 130, background: '#EAF2FF', border: `7px solid ${INK}`, borderRadius: 20, boxSizing: 'border-box'}} />
  <div style={{position: 'absolute', left: x - 340, top: y - 330, width: 40, height: 330, background: '#8B5A2B', border: `6px solid ${INK}`, boxSizing: 'border-box'}} />
  <div style={{position: 'absolute', left: x + 300, top: y - 250, width: 40, height: 250, background: '#8B5A2B', border: `6px solid ${INK}`, boxSizing: 'border-box'}} />
  <div style={{position: 'absolute', left: x - 290, top: y - 250, width: 170, height: 70, background: '#fff', border: `6px solid ${INK}`, borderRadius: 30, boxSizing: 'border-box'}} />
  <div style={{position: 'absolute', left: x - 330, top: y - 80, width: 660, height: 80, background: 'rgba(0,0,0,0.55)'}} />
</>;
const Sock = ({x, y, rot, color}: {x: number; y: number; rot: number; color: string}) => <svg width={110} height={150} viewBox="0 0 110 150" style={{position: 'absolute', left: x - 55, top: y - 75, transform: `rotate(${rot}deg)`, overflow: 'visible'}}>
  <path d="M30 0 L75 0 L75 90 Q75 140 30 140 Q0 140 5 115 Q10 100 30 95 Z" fill={color} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <path d="M30 20 L75 20" stroke="#fff" strokeWidth={8} />
</svg>;

// ---------- scenes ----------
const Forget = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Penguin id="doug" x={540} y={G} h={480} pose={{look: [0, -0.6], brows: 'none', beak: 'flat', lids: 0.15, flapL: 30, flapR: 30}} />
  {t >= P(5) && ['🔑', '❓', '🧦', '❓'].map((e, i) => <div key={i} style={{position: 'absolute', left: 540 + Math.cos(t * 2.5 + i * 1.6) * 300 - 50, top: 640 + Math.sin(t * 2.5 + i * 1.6) * 120 - 50, fontSize: 90}}>{e}</div>)}
  <Word text="DOUG FORGETS" x={540} y={330} at={P(5)} t={t} size={110} />
</>;
const Write = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <DebitCard x={540} y={620} w={760} rot={-4} pinAt={P(6) + 0.5} t={t} />
  <Penguin id="doug" x={250} y={G} h={380} pose={{turn: 0.5, look: [0.8, -0.8], brows: 'happy', beak: 'smile', flapR: 90 + Math.sin(t * 14) * 10}} />
  <Word text="1-2-3-4" x={720} y={1090} at={P(7)} t={t} size={120} color={N_RED} />
</>;
const CafeScene = ({t}: {t: number}) => {
  const leave = ease((t - P(10)) / 1.0), dx = lerp(330, 1250, leave);
  return <>
    <NightGround y={G} />
    <Cafe />
    <Puffin x={800} y={G - 230} h={260} />
    <Table x={330} />
    <Cup x={280} y={G - 260} />
    <DebitCard x={410} y={G - 284} w={150} t={t} glint={t >= P(11)} />
    <Penguin id="doug" x={dx} y={G} h={400} pose={t >= P(10) ? {turn: 1, side: true, walk: t, look: [1, 0], beak: 'smile'} : {turn: 0.3, look: [0.4, 0.4], beak: 'smile', brows: 'happy', flapR: t >= P(9) ? 60 + Math.sin(t * 6) * 20 : 10}} />
    <Word text="CARD STAYS" x={420} y={420} at={P(11)} t={t} size={100} color={N_RED} />
  </>;
};
const Find = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Table x={330} />
  {t < P(13) && <DebitCard x={410} y={G - 284} w={150} t={t} glint />}
  <Weasel x={lerp(1250, 700, ease((t - P(12)) / 0.6))} y={G} h={280} t={t} flip happy={t >= P(14)} />
  {t >= P(13) && <DebitCard x={540} y={560} w={640} rot={5} pinAt={-99} t={t} />}
  <Word text="PIN ON IT!" x={540} y={300} at={P(13) + 0.2} t={t} size={110} color={N_RED} />
</>;
const Drain = ({t}: {t: number}) => {
  const bal = t < P(17) ? 10000 : t < P(19) ? 9000 : t < P(20) ? 8000 : t < P(22) ? Math.max(0, Math.round((8000 - 8000 * cl((t - P(20)) / (P(22) - P(20)))) / 1000) * 1000) : 0;
  const day = t < P(18) ? 1 : t < P(20) ? 2 : t < P(22) ? Math.min(10, 2 + Math.floor(8 * cl((t - P(20)) / (P(22) - P(20))) + 0.5)) : 10;
  return <>
    <NightGround y={G} />
    <RealBank x={600} base={G} w={760} t={t} goneAt={999} balance={`$${bal.toLocaleString('en-US')}`} />
    <Weasel x={880} y={G + 40} h={240} t={t} happy />
    {[0, 1, 2].map((i) => { const ph = ((t * 1.6 + i * 0.33) % 1); return t >= P(17) && t < P(22) ? <Bill key={i} x={330 + ph * 500} y={G - 300 - Math.sin(ph * Math.PI) * 220} rot={ph * 200} /> : null; })}
    <PopIn at={P(15)} t={t} x={60} y={200}><Pill x={0} y={0} text={`DAY ${day}`} color={N_RED} /></PopIn>
    <Word text="-$1,000" x={540} y={300} at={P(17)} until={P(18)} t={t} size={120} color={N_RED} />
    <Word text="-$1,000" x={540} y={300} at={P(19)} until={P(20)} t={t} size={120} color={N_RED} />
    <Word text="EVERY DAY" x={540} y={300} at={P(20)} until={P(22)} t={t} size={110} />
    <Word text="ACCOUNT: $0" x={540} y={300} at={P(22)} t={t} size={110} color={N_RED} />
  </>;
};
const Why = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Penguin id="doug" x={260} y={G} h={420} pose={{turn: 0.5, look: [0.8, 0], brows: t >= P(24) ? 'shock' : 'worried', eyeScale: t >= P(24) ? 1.35 : 1, beak: 'frown', flapR: 70}} />
  <Phone x={420} y={G - 250} w={110} t={t} ring={P(23)} screen="🏦" rot={8} />
  <Fox x={800} y={G} h={520} flip mouth={t >= P(24) ? 0.6 * Math.abs(Math.sin(t * 9)) : 0} />
  <Word text="RING RING" x={540} y={330} at={P(23)} until={P(24)} t={t} size={120} />
  <Word text="DOUG, WHY?" x={540} y={330} at={P(24)} t={t} size={120} color={N_RED} />
</>;
const Sleep = ({t}: {t: number}) => {
  const x = lerp(200, 560, cl((t - P(25)) / 2));
  return <>
    <NightGround y={G} />
    <Atm x={860} base={G} t={t} goneAt={999} w={280} balance="$$$" />
    <Penguin id="doug" x={x} y={G} h={420} pose={{turn: 0.6, lids: 1, beak: 'flat', flapL: 85, flapR: 85, walk: t}} />
    <div style={{position: 'absolute', left: x - 95, top: G - 455, width: 190, height: 80, background: '#3C78FF', border: `6px solid ${INK}`, borderRadius: '50% 50% 10px 10px', transform: 'rotate(-10deg)'}} />
    {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: x + 110 + i * 50, top: G - 520 - i * 70 - ((t * 40) % 30), fontFamily: SANS, fontWeight: 900, fontSize: 60 + i * 16, color: '#fff'}}>Z</div>)}
    <Word text="IN HIS SLEEP?" x={540} y={300} at={P(25) + 0.3} t={t} size={110} />
  </>;
};
const UnderBed = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Bed x={540} y={G} />
  <Penguin id="doug" x={200} y={G} h={330} pose={{turn: 0.7, look: [1, 0.8], brows: 'worried', beak: 'flat', lean: 20}} />
  {t >= P(27) && [['#E8546A', 420, -20], ['#F2C230', 560, 15], ['#5EC4FA', 700, -10]].map(([c, x, r], i) =>
    <PopIn key={i} at={P(27) + i * 0.12} t={t} x={0} y={0} origin={`${x}px 900px`}><Sock x={x as number} y={880 - i * 30} rot={r as number} color={c as string} /></PopIn>)}
  <Word text="ONLY SOCKS" x={540} y={330} at={P(27)} t={t} size={110} />
</>;
const Mood = ({t, at, kind}: {t: number; at: number; kind: 'poor' | 'happy'}) => <>
  {kind === 'happy' && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 100 + i * 200, top: 620 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}
  <NightGround y={G + 250} />
  <Penguin id="doug" x={540} y={G + 300} h={950}
    pose={kind === 'happy' ? {beak: 'smile', brows: 'happy', lids: 0.3, blush: 1, flapL: 120, flapR: 120} : {lids: 0.35, brows: 'worried', beak: 'frown', tears: true}} />
  <Word text={`Doug ${kind}.`} x={540} y={330} at={at} t={t} size={140} color={kind === 'happy' ? N_GREEN : N_RED} />
</>;
const Gone = ({t}: {t: number}) => {
  const x = lerp(-200, 620, ease((t - P(29)) / 0.6));
  return <>
    <NightGround y={G} />
    <Table x={330} />
    <Cup x={280} y={G - 260} />
    <Penguin id="doug" x={x} y={G} h={400} pose={t < P(30) ? {turn: 1, side: true, run: true, walk: t * 2, look: [1, 0]} : {turn: -0.5, look: [-0.8, 0.6], brows: 'shock', eyeScale: 1.35, beak: 'frown', flapL: 60, flapR: 60}} />
    <Word text="CARD GONE" x={540} y={330} at={P(30)} t={t} size={120} color={N_RED} />
  </>;
};
const Report = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Penguin id="doug" x={300} y={G} h={460} pose={{turn: 0.5, look: [0.8, -0.2], brows: 'angry', beak: 'frown', flapR: 80, flapL: t >= P(32) ? 110 : 30, mouth: 0.6}} />
  <Phone x={480} y={G - 280} w={120} t={t} screen="🏦" rot={8} />
  <Fox x={830} y={G} h={480} flip />
  <Word text="LOST CARD!" x={540} y={330} at={P(31) + 0.6} until={P(32)} t={t} size={110} />
  <Word text="NOT DOUG!" x={540} y={330} at={P(32)} t={t} size={140} color={N_RED} />
</>;
const Camera = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <GlassCard x={90} y={200} w={900} h={640}>
    <div style={{position: 'absolute', left: 30, top: 30, right: 30, bottom: 30, borderRadius: 20, background: '#2A2F3A', overflow: 'hidden', filter: 'grayscale(1) contrast(1.2)'}}>
      <div style={{position: 'absolute', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,0.06) 0 2px, transparent 2px 6px)'}} />
      <Atm x={260} base={560} t={t} goneAt={999} w={260} balance="" />
      <div style={{position: 'absolute', left: 0, top: 0, width: 840, height: 580, transform: t >= P(35) ? `scale(${1 + 0.5 * ease((t - P(35)) / 0.3)})` : undefined, transformOrigin: '560px 400px'}}>
        <Weasel x={560} y={560} h={240} t={t} flip />
      </div>
    </div>
    <div style={{position: 'absolute', left: 60, top: 50, fontFamily: SANS, fontWeight: 900, fontSize: 40, color: N_RED}}>{Math.floor(t * 2) % 2 ? '●' : '○'} REC · ATM CAM</div>
  </GlassCard>
  <Penguin id="doug" x={540} y={G} h={360} pose={{look: [0, -0.8], brows: 'worried', beak: 'flat'}} />
  <Word text="NOT PENGUIN" x={540} y={950} at={P(34) + 0.4} until={P(35)} t={t} size={100} />
  <Stamp text="WEASEL!" x={540} y={940} at={P(35)} color={N_RED} size={110} />
</>;
const Jail = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Weasel x={700} y={G} h={260} t={t} flip sad />
  {t >= P(36) && <PopIn at={P(36)} t={t} x={0} y={0} origin="300px 1200px"><PoliceBear x={300} y={G} h={480} t={t} /></PopIn>}
  {t >= P(37) && <div style={{position: 'absolute', left: 520, top: 500, width: 400, height: G - 500}}>
    {Array.from({length: 6}, (_, i) => <div key={i} style={{position: 'absolute', left: i * 72, top: -900 * (1 - ease((t - P(37)) / 0.25)), width: 24, height: G - 500, background: '#4A4F55', border: `4px solid ${INK}`, borderRadius: 6, boxSizing: 'border-box'}} />)}
  </div>}
  <Word text="CAUGHT" x={540} y={330} at={P(36) + 0.2} until={P(37)} t={t} size={130} color={N_GREEN} />
  <Word text="JAIL" x={540} y={330} at={P(37)} t={t} size={150} color={N_RED} />
</>;
const Back = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Fox x={820} y={G} h={480} flip />
  <Penguin id="doug" x={260} y={G} h={420} pose={{turn: 0.5, look: [0.8, -0.3], brows: 'happy', beak: 'smile', flapL: 60, flapR: 60}} />
  <FishFlight x1={760} y1={G - 300} x2={300} y2={G - 300} a={P(38) + 0.1} b={P(38) + 1.4} n={8} w={90} />
  <Card x={540} y={230} w={760} value="$9,999" label="BACK TO DOUG" at={P(40)} t={t} color={N_GREEN} size={150} />
  <PopIn at={P(41)} t={t} x={330} y={640}><Pill x={0} y={0} text="$1 MISSING" color={N_RED} /></PopIn>
  <Word text="ALMOST ALL" x={540} y={330} at={P(39)} until={P(40)} t={t} size={110} />
</>;
const FishMath = ({t}: {t: number}) => {
  const cut = ease((t - P(42) - 0.6) / 0.3);
  return <>
    <NightGround y={G} />
    <Card x={540} y={200} w={760} value="$1 = 1/10 🐟" label="1 FISH = $10" at={P(42)} t={t} color="#fff" size={110} />
    <Fish id="whole" x={500 - cut * 40} y={720} w={420} />
    {cut > 0 && <div style={{position: 'absolute', left: 0, top: 0, transform: `translate(${cut * 120}px, ${t >= P(43) ? -40 : 0}px)`}}>
      <div style={{position: 'absolute', left: 300, top: 640, width: 6, height: 170, background: N_RED, transform: 'rotate(8deg)'}} /></div>}
    <Penguin id="doug" x={760} y={G} h={400} pose={{turn: -0.5, look: [-0.8, -0.5], brows: 'happy', beak: t >= P(43) ? 'smile' : 'flat', mouth: t >= P(43) ? 0.6 * Math.abs(Math.sin(t * 10)) : 0, flapL: 60}} />
    <Word text="FISH TAIL 😋" x={360} y={1000} at={P(43)} t={t} size={96} />
  </>;
};
const Law = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <PopIn at={P(45)} t={t} x={370} y={170}><Pill x={0} y={0} text="IN REAL LIFE" /></PopIn>
  <Card x={540} y={270} w={940} value="PIN ON CARD?" label="YOU DON'T PAY MORE" source="CFPB · Regulation E, comment 6(b)-2" at={P(45) + 0.3} t={t} color={N_GREEN} size={110} />
  <DebitCard x={540} y={860} w={380} rot={-6} pinAt={-99} t={t} />
  <Penguin id="doug" x={170} y={G} h={340} pose={{look: [0.5, -0.6], brows: 'shock', eyeScale: 1.2, beak: 'flat'}} />
</>;
const Rules = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Card x={540} y={200} w={900} value="2 DAYS" label="REPORT → LOSE $50 MAX" source="CFPB · 12 CFR 1005.6" at={P(46)} t={t} color={N_GREEN} size={130} />
  <Card x={540} y={640} w={900} value="60+ DAYS" label="AFTER STATEMENT → LOSE IT ALL" at={P(48)} t={t} color={N_RED} size={130} />
  {t >= P(49) && <Stamp text="LOSE IT ALL" x={540} y={1080} at={P(49)} color={N_RED} size={90} rot={-6} />}
</>;
const Tips = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <GlassCard x={60} y={200} w={960} h={520}>
    {[['✗ NEVER WRITE YOUR PIN', 50, 40, N_RED], ['   ON YOUR CARD', 50, 120, '#fff'], ['📞 LOST CARD?', 51, 250, '#fff'], ['   CALL YOUR BANK NOW', 52, 330, N_GREEN]].map(([s, i, y, c]) => {
      const p = ease((t - P(i as number)) / 0.2); if (p <= 0) return null;
      return <div key={s as string} style={{position: 'absolute', left: 50, top: y as number, transform: `scale(${p})`, transformOrigin: '0 50%', fontFamily: SANS, fontWeight: 900, fontSize: 60, color: c as string, whiteSpace: 'pre'}}>{s}</div>; })}
  </GlassCard>
  <Penguin id="doug" x={540} y={G} h={400} pose={{look: [0, -0.6], brows: 'happy', beak: 'smile', flapR: 110}} />
</>;
const Next = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <PopIn at={P(53)} t={t} x={330} y={180}><Pill x={0} y={0} text="NEXT EPISODE" /></PopIn>
  <Phone x={700} y={1000} w={300} t={t} ring={P(53)} screen="BANK?" rot={-6} />
  <Penguin id="doug" x={250} y={G} h={420} pose={{turn: 0.5, look: [0.8, -0.3], brows: 'worried', beak: 'flat', flapR: 40}} />
  <Word text="NOT THE BANK 👇" x={540} y={360} at={P(54)} t={t} size={100} color={N_RED} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx; top?: boolean};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hook2 t={t} />, top: true},
  {at: P(4), set: (t) => <Forget t={t} />, fx_: 'zoom'},
  {at: P(6), set: (t) => <Write t={t} />, fx_: 'pop'},
  {at: P(8), set: (t) => <CafeScene t={t} />, fx_: 'swipe'},
  {at: P(12), set: (t) => <Find t={t} />, fx_: 'iris'},
  {at: P(15), set: (t) => <Drain t={t} />, fx_: 'swipeL'},
  {at: P(23), set: (t) => <Why t={t} />, fx_: 'zoom'},
  {at: P(25), set: (t) => <Sleep t={t} />, fx_: 'iris'},
  {at: P(26), set: (t) => <UnderBed t={t} />, fx_: 'swipe'},
  {at: P(28), set: (t) => <Mood t={t} at={P(28)} kind="poor" />, fx_: 'zoom'},
  {at: P(29), set: (t) => <Gone t={t} />, fx_: 'swipeL'},
  {at: P(31), set: (t) => <Report t={t} />, fx_: 'pop'},
  {at: P(33), set: (t) => <Camera t={t} />, fx_: 'zoom'},
  {at: P(36), set: (t) => <Jail t={t} />, fx_: 'swipe'},
  {at: P(38), set: (t) => <Back t={t} />, fx_: 'iris'},
  {at: P(42), set: (t) => <FishMath t={t} />, fx_: 'pop'},
  {at: P(44), set: (t) => <Mood t={t} at={P(44)} kind="happy" />, fx_: 'zoom'},
  {at: P(45), set: (t) => <Law t={t} />, fx_: 'swipe'},
  {at: P(46), set: (t) => <Rules t={t} />, fx_: 'swipeL'},
  {at: P(50), set: (t) => <Tips t={t} />, fx_: 'pop'},
  {at: P(53), set: (t) => <Next t={t} />, fx_: 'zoom'},
];
// deep zooms [phrase, focusX, focusY, scale] — moderate so big words never leave the frame
const DEEP: [number, number, number, number][] = [[7, 600, 640, 1.2], [13, 560, 600, 1.15], [22, 600, 700, 1.2], [24, 540, 700, 1.15], [27, 560, 860, 1.25], [35, 540, 700, 1.2], [41, 540, 600, 1.15], [47, 540, 400, 1.12]];

export const DougPaysEp2 = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + (sh.top ? 0.006 : 0.02) * (tc - sh.at), fx = 540, fy = 960;
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * (sh.top ? 1 : beat(tc, TIM)); // no punch in the hook (cards near the edges)
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <NightBg />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(sh.at === 0 ? tc : t)}</AbsoluteFill>
      {sh.top && <TopLine2 t={tc} />}
    </AbsoluteFill>
    {!sh.top && <SeriesBadge ep={2} />}
    <Captions t={tc} phrases={TIM.slice(1)} />
    <Audio src={staticFile('doug-card-ep2-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    {/* hook (same as the preview) */}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.1} name="user-notif" vol={0.35} />
    <Sfx at={P(1) + 0.35} name="user-pop" vol={0.3} />
    <Sfx at={P(2) + 0.3} name="user-cash-register" vol={0.35} />
    <Sfx at={P(3)} name="user-boom" vol={0.45} />
    <Sfx at={P(3) + 0.3} name="user-wrong" vol={0.3} />
    {/* story */}
    <Sfx at={P(4)} name="penguin-squawk" vol={0.3} />
    <Sfx at={P(5)} name="user-horn" vol={0.25} />
    <Sfx at={P(7)} name="user-ting" vol={0.35} />
    <Sfx at={P(9)} name="user-pop" vol={0.25} />
    <Sfx at={P(11)} name="user-wrong" vol={0.3} />
    <Sfx at={P(13)} name="user-shock" vol={0.35} />
    <Sfx at={P(14)} name="user-wow" vol={0.35} />
    <Sfx at={P(17)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(19)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(20)} name="user-timer" vol={0.35} />
    <Sfx at={P(22)} name="user-boom" vol={0.45} />
    <Sfx at={P(23)} name="user-notif" vol={0.45} />
    <Sfx at={P(24)} name="user-shock" vol={0.35} />
    <Sfx at={P(25) + 0.3} name="user-horn" vol={0.25} />
    <Sfx at={P(27)} name="user-aww" vol={0.35} />
    <Sfx at={P(28)} name="user-fahh" vol={0.45} />
    <Sfx at={P(30)} name="user-wrong" vol={0.35} />
    <Sfx at={P(31)} name="user-notif2" vol={0.35} />
    <Sfx at={P(32)} name="user-slap" vol={0.35} />
    <Sfx at={P(33)} name="user-ting" vol={0.3} />
    <Sfx at={P(35)} name="user-boom" vol={0.4} />
    <Sfx at={P(36) + 0.2} name="user-yeah" vol={0.35} />
    <Sfx at={P(37)} name="user-slap" vol={0.4} />
    <Sfx at={P(38) + 0.1} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(40)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(41)} name="user-wrong" vol={0.3} />
    <Sfx at={P(42)} name="user-ting" vol={0.3} />
    <Sfx at={P(43)} name="user-pop" vol={0.35} />
    <Sfx at={P(44)} name="user-yeah" vol={0.4} />
    <Sfx at={P(45) + 0.3} name="user-ting" vol={0.35} />
    <Sfx at={P(46)} name="user-pop" vol={0.3} />
    <Sfx at={P(47)} name="user-money" vol={0.3} />
    <Sfx at={P(48)} name="user-boom" vol={0.4} />
    <Sfx at={P(49)} name="user-shock" vol={0.4} />
    <Sfx at={P(50)} name="user-pop" vol={0.3} />
    <Sfx at={P(52)} name="user-pop" vol={0.3} />
    <Sfx at={P(53)} name="user-notif" vol={0.4} />
    <Sfx at={P(54)} name="user-shock" vol={0.4} />
  </AbsoluteFill>;
};
