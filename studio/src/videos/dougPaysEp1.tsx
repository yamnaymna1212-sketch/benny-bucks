// DOUG PAYS · EP. 1 "Rent" — new story (2026-10-26): Larry demands $1,600, Doug has $200, options fail one by one,
// payday loan trap, 211 + a written payment plan beat Larry's "police tonight" bluff. Night look v3.
// VO: Kokoro am_fenrir 1.3, one take per paragraph (videos/doug-rent-ep1/vo/paras.txt). Phrase map: data/doug-rent-ep1.json.
// Sources: Nolo/FindLaw (no eviction without a court), USA.gov (211), LSC 2025 ($2,500–$8,000 per eviction), CFPB (~400% APR).
import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts, HandFont} from '../base';
import {Fish, INK, Penguin, Seal, onTwos} from '../penguin/rig';
import {Puffin, Seagull, Walrus} from '../penguin/cast';
import {FishFlight, Paper, Stamp, Thought} from '../penguin/world';
import {Fx, cutFX} from '../penguin/acting';
import {Captions, Sfx, beat} from '../penguin/edit';
import {GlassCard, NightBg, NightGround, N_GREEN, N_RED, Pill, SeriesBadge} from '../penguin/night';
import {Fox} from './dougLaundering';
import {Hook, TopLine} from './dougPaysHook';
import TIM from '../data/doug-rent-ep1.json';

const P = (i: number) => TIM[i].start, E = (i: number) => TIM[i].end;
export const DOUG_PAYS_EP1_SECONDS = Math.ceil((TIM[TIM.length - 1].end + 0.9) * 30) / 30;
const G = 1250;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const pop = (t: number, at: number) => { const d = t - at; return d < 0 ? 0 : d < 0.18 ? 1.15 * (d / 0.18) : 1.15 - 0.15 * Math.min(1, (d - 0.18) / 0.12); };
const SANS = 'Montserrat';

// Big bold word (white on the night sky, dark outline). One per idea.
const Word = ({text, x, y, at, t, size = 120, color = '#fff', until, rot = -2}: {text: string; x: number; y: number; at: number; t: number; size?: number; color?: string; until?: number; rot?: number}) => {
  const p = pop(t, at); if (p <= 0 || (until !== undefined && t >= until)) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${p})`, fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap',
    WebkitTextStroke: `${Math.max(3, size * 0.04)}px ${INK}`, paintOrder: 'stroke fill', textShadow: '0 8px 0 rgba(0,0,0,0.35)'}}>{text}</div>;
};
const PopIn = ({at, t, x, y, children, origin = '50% 50%'}: {at: number; t: number; x: number; y: number; children: React.ReactNode; origin?: string}) => {
  const p = pop(t, at); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x, top: y, transform: `scale(${p})`, transformOrigin: origin}}>{children}</div>;
};
// Glass number card with a custom value size (long ranges fit).
const Card = ({x, y, w, value, label, source, at, t, color = N_GREEN, size = 140}: {x: number; y: number; w: number; value: string; label: string; source?: string; at: number; t: number; color?: string; size?: number}) => {
  const p = pop(t, at); if (p <= 0) return null;
  const h = size + (source ? 200 : 150);
  return <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, height: h, transform: `scale(${p})`, transformOrigin: '50% 0'}}>
    <GlassCard x={0} y={0} w={w} h={h}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 26, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 1, color, whiteSpace: 'nowrap', textShadow: `0 0 24px ${color}88`}}>{value}</div>
      <div style={{position: 'absolute', left: 10, right: 10, top: size + 50, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 44, color: '#fff', letterSpacing: 1}}>{label}</div>
      {source && <div style={{position: 'absolute', left: 0, right: 0, top: size + 120, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 26, color: 'rgba(220,230,255,0.75)'}}>source: {source}</div>}
    </GlassCard>
  </div>;
};

// ---------- props ----------
const Phone = ({x, y, w = 150, t, ring = -99, screen = '', rot = 0}: {x: number; y: number; w?: number; t: number; ring?: number; screen?: string; rot?: number}) => {
  const shake = t >= ring && t < ring + 1.2 ? Math.sin(t * 60) * 7 : 0;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - w * 1.9, width: w, height: w * 1.9, transform: `rotate(${rot + shake}deg)`}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: w * 0.18, background: '#20242E', border: `6px solid ${INK}`, boxSizing: 'border-box'}} />
    <div style={{position: 'absolute', left: w * 0.1, top: w * 0.18, right: w * 0.1, bottom: w * 0.22, borderRadius: w * 0.08, background: '#BFE6FA', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: SANS, fontWeight: 900, fontSize: w * 0.3, color: INK, textAlign: 'center', lineHeight: 1.1}}>{screen}</div>
    {t >= ring && t < ring + 1.2 && [0, 1].map((i) => <div key={i} style={{position: 'absolute', left: i ? w + 10 : -40, top: w * 0.4, width: 30, height: 60, borderRight: i ? 'none' : `6px solid #fff`, borderLeft: i ? `6px solid #fff` : 'none', borderRadius: '50%'}} />)}
  </div>;
};

const PoliceBear = ({x, y, h = 560, t}: {x: number; y: number; h?: number; t: number}) => {
  const flash = Math.floor(t * 6) % 2;
  return <>
    <div style={{position: 'absolute', left: x - h * 0.6, top: y - h * 1.05, width: h * 1.2, height: h * 1.2, borderRadius: '50%', background: `radial-gradient(circle, ${flash ? 'rgba(255,60,60,0.45)' : 'rgba(60,120,255,0.45)'} 0%, transparent 65%)`}} />
    <svg width={h * 0.8} height={h} viewBox="0 0 320 400" style={{position: 'absolute', left: x - h * 0.4, top: y - h, overflow: 'visible'}}>
      <path d="M60 390 C 30 260, 70 170, 160 170 C 250 170, 290 260, 260 390 Z" fill="#2B4C9B" stroke={INK} strokeWidth={7} strokeLinejoin="round" />
      <path d="M140 200 L160 260 L180 200" fill="none" stroke="#fff" strokeWidth={6} />
      <path d="M200 240 l14 -10 l14 10 l-4 18 l-20 0 Z" fill="#F5C518" stroke={INK} strokeWidth={4} />
      <circle cx={95} cy={74} r={28} fill="#FBFBF7" stroke={INK} strokeWidth={7} /><circle cx={225} cy={74} r={28} fill="#FBFBF7" stroke={INK} strokeWidth={7} />
      <ellipse cx={160} cy={124} rx={95} ry={80} fill="#FBFBF7" stroke={INK} strokeWidth={7} />
      <path d="M78 70 Q160 10 242 70 L236 88 L84 88 Z" fill="#1E3A7A" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      <rect x={70} y={84} width={180} height={16} rx={6} fill="#111" stroke={INK} strokeWidth={4} />
      <circle cx={160} cy={58} r={11} fill="#F5C518" stroke={INK} strokeWidth={4} />
      <ellipse cx={160} cy={154} rx={44} ry={32} fill="#EFEFE8" stroke={INK} strokeWidth={5} />
      <ellipse cx={160} cy={140} rx={16} ry={11} fill={INK} />
      <circle cx={125} cy={115} r={8} fill={INK} /><circle cx={195} cy={115} r={8} fill={INK} />
      <path d="M108 100 L138 108 M212 100 L182 108" stroke={INK} strokeWidth={6} strokeLinecap="round" />
      <path d="M142 172 Q160 166 178 172" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
      <rect x={140} y={-30} width={40} height={26} rx={6} fill={flash ? '#FF3C3C' : '#3C78FF'} stroke={INK} strokeWidth={4} transform="translate(0 0)" opacity={0} />
    </svg>
    <div style={{position: 'absolute', left: x - 50, top: y - h - 60, width: 100, height: 46, borderRadius: '30px 30px 8px 8px', background: flash ? '#FF3C3C' : '#3C78FF', border: `5px solid ${INK}`, boxShadow: `0 0 40px ${flash ? '#FF3C3C' : '#3C78FF'}`}} />
  </>;
};

const Duck = ({x, y, w = 260, t}: {x: number; y: number; w?: number; t: number}) =>
  <svg width={w} height={w * 0.8} viewBox="0 0 200 160" style={{position: 'absolute', left: x - w / 2, top: y - w * 0.8 + Math.sin(t * 3) * 6, overflow: 'visible'}}>
    <path d="M30 100 C 20 150, 170 160, 180 100 C 185 70, 140 70, 120 90 L 70 90 C 50 80, 34 84, 30 100 Z" fill="#F7D33E" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    <circle cx={60} cy={60} r={36} fill="#F7D33E" stroke={INK} strokeWidth={6} />
    <path d="M20 62 L-14 70 L20 80 Z" fill="#F08A24" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    <circle cx={50} cy={52} r={6} fill={INK} />
    <path d="M110 110 Q140 96 160 110" fill="none" stroke={INK} strokeWidth={5} strokeLinecap="round" />
  </svg>;

const Item = ({x, y, kind}: {x: number; y: number; kind: 'tv' | 'sofa' | 'car'}) => <svg width={300} height={220} viewBox="0 0 300 220" style={{position: 'absolute', left: x - 150, top: y - 220, overflow: 'visible'}}>
  {kind === 'tv' && <><rect x={30} y={20} width={240} height={150} rx={10} fill="#2A2F3A" stroke={INK} strokeWidth={7} /><rect x={48} y={36} width={204} height={118} fill="#6FA8DC" /><path d="M110 170 L90 210 M190 170 L210 210" stroke={INK} strokeWidth={8} strokeLinecap="round" /></>}
  {kind === 'sofa' && <><rect x={30} y={70} width={240} height={90} rx={24} fill="#C0504D" stroke={INK} strokeWidth={7} /><rect x={10} y={100} width={50} height={90} rx={16} fill="#A8403D" stroke={INK} strokeWidth={7} /><rect x={240} y={100} width={50} height={90} rx={16} fill="#A8403D" stroke={INK} strokeWidth={7} /><rect x={50} y={140} width={200} height={50} rx={10} fill="#D46A66" stroke={INK} strokeWidth={7} /></>}
  {kind === 'car' && <><path d="M20 160 L30 110 L80 104 L110 60 L200 60 L240 104 L280 112 L284 160 Z" fill="#3D8BD8" stroke={INK} strokeWidth={7} strokeLinejoin="round" /><path d="M120 70 L190 70 L220 104 L104 104 Z" fill="#BFE6FA" stroke={INK} strokeWidth={5} /><circle cx={80} cy={165} r={28} fill="#222" stroke={INK} strokeWidth={6} /><circle cx={230} cy={165} r={28} fill="#222" stroke={INK} strokeWidth={6} /></>}
</svg>;

const Bow = ({x, y, s = 1}: {x: number; y: number; s?: number}) => <svg width={90 * s} height={60 * s} viewBox="0 0 90 60" style={{position: 'absolute', left: x - 45 * s, top: y - 30 * s, overflow: 'visible'}}>
  <path d="M45 30 L5 6 L5 54 Z M45 30 L85 6 L85 54 Z" fill="#F06AA0" stroke={INK} strokeWidth={5} strokeLinejoin="round" /><circle cx={45} cy={30} r={11} fill="#F06AA0" stroke={INK} strokeWidth={5} />
</svg>;
const Backpack = ({x, y, s = 1}: {x: number; y: number; s?: number}) => <div style={{position: 'absolute', left: x - 40 * s, top: y, width: 80 * s, height: 100 * s, background: '#F2C230', border: `5px solid ${INK}`, borderRadius: 18 * s, boxSizing: 'border-box'}} />;

// ---------- scenes ----------
const Hk = ({t}: {t: number}) => <Hook t={t} />;

const Paycheck = ({t}: {t: number}) => {
  const left = t < P(5) ? 1 : t < P(6) ? 0.66 : t < P(7) ? 0.36 : t < P(8) ? 0.14 : 0.06;
  const w = 820 * left;
  return <>
    <NightGround y={G} />
    <GlassCard x={130} y={220} w={820} h={230}>
      <div style={{position: 'absolute', left: 40, top: 26, fontFamily: SANS, fontWeight: 900, fontSize: 52, color: '#fff', letterSpacing: 2}}>DOUG'S PAYCHECK</div>
      <div style={{position: 'absolute', left: 40, top: 110, width: 740, height: 70, borderRadius: 35, background: 'rgba(255,255,255,0.12)'}} />
      <div style={{position: 'absolute', left: 40, top: 110, width: Math.max(44, w * 0.9), height: 70, borderRadius: 35, background: left > 0.2 ? N_GREEN : N_RED, boxShadow: `0 0 20px ${left > 0.2 ? N_GREEN : N_RED}`, transition: 'none'}} />
    </GlassCard>
    {[['🔧 CAR REPAIR', 5, 160, 560], ['🛒 GROCERIES', 6, 600, 640], ['🎉 NIGHT OUT', 7, 200, 760]].map(([s, i, x, y]) =>
      t < P(8) && <PopIn key={s as string} at={P(i as number)} t={t} x={x as number} y={y as number}><Pill x={0} y={0} text={s as string} color={N_RED} /></PopIn>)}
    <Penguin id="doug" x={540} y={G} h={430} pose={{look: [0, -0.6], brows: t >= P(8) ? 'shock' : 'worried', eyeScale: t >= P(8) ? 1.3 : 1, beak: 'frown', flapL: 20, flapR: 20, sweat: t >= P(7)}} />
    <Word text="$200 LEFT" x={540} y={520} at={P(8)} t={t} size={110} color={N_GREEN} />
  </>;
};

const Call = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Penguin id="doug" x={260} y={G} h={430} pose={{turn: 0.5, look: [0.8, 0], brows: t >= P(12) ? 'shock' : 'worried', eyeScale: t >= P(12) ? 1.35 : 1, beak: 'frown', flapR: 70, sweat: t >= P(12)}} />
  <Phone x={420} y={G - 250} w={110} t={t} ring={P(9)} screen="📞" rot={8} />
  <Walrus x={800} y={G + 10} h={480} id="larry-call" pose={{angry: true, mouth: t >= P(11) ? 0.5 + 0.5 * Math.abs(Math.sin(t * 9)) : 0, lids: 0, look: -0.9, flap: 30}} />
  <Phone x={640} y={G - 330} w={100} t={t} ring={P(9)} screen="📞" rot={-12} />
  <Word text="RING RING" x={540} y={330} at={P(9)} until={P(10)} t={t} size={120} />
  <PopIn at={P(10)} t={t} x={560} y={G + 50}><Pill x={0} y={0} text="LARRY · LANDLORD" /></PopIn>
  <Word text="RENT." x={540} y={300} at={P(11)} t={t} size={110} />
  <Word text="$1,600" x={540} y={450} at={P(12)} t={t} size={170} color={N_RED} />
  <Word text="NOW!" x={540} y={610} at={P(13)} t={t} size={120} color={N_RED} />
</>;

const Family = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Penguin id="doug" x={250} y={G} h={400} pose={{turn: 0.4, look: [0.5, -0.8], brows: 'worried', beak: 'frown', lids: 0.25}} />
  <Thought x={600} y={640} w={820} tx={330} ty={G - 420} at={P(14) - 0.05}>
    <Penguin id="baby" x={190} y={440} h={190} build="baby" pose={{look: [0.3, 0], brows: 'worried', beak: 'flat'}} />
    {t >= P(15) && <><Penguin id="girl" x={400} y={440} h={260} build="thin" pose={{look: [0.2, 0], beak: 'smile'}} /><Backpack x={460} y={300} s={0.8} /></>}
    {t >= P(16) && <><Penguin id="wife" x={630} y={440} h={330} pose={{look: [-0.3, 0], beak: 'smile', brows: 'happy'}} /><Bow x={660} y={150} s={0.9} /></>}
  </Thought>
  <PopIn at={P(14)} t={t} x={110} y={1080}><Pill x={0} y={0} text="BABY SON" /></PopIn>
  {t >= P(15) && <PopIn at={P(15)} t={t} x={460} y={1080}><Pill x={0} y={0} text="SCHOOL" /></PopIn>}
  {t >= P(16) && <PopIn at={P(16)} t={t} x={760} y={1080}><Pill x={0} y={0} text="WIFE" /></PopIn>}
</>;

const Bank = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <div style={{position: 'absolute', left: 560, top: G - 300, width: 460, height: 300, background: '#6B4A2B', border: `7px solid ${INK}`, borderRadius: 12, boxSizing: 'border-box'}} />
  <Fox x={790} y={G - 200} h={520} mouth={t >= P(18) ? 0.6 * Math.abs(Math.sin(t * 9)) : 0} />
  <Penguin id="doug" x={300} y={G} h={430} pose={{turn: 0.5, look: [0.8, -0.2], brows: t >= P(19) ? 'shock' : 'worried', beak: 'frown', flapR: t < P(18) ? 60 : 20}} />
  <Word text="LOAN?" x={300} y={620} at={P(17)} t={t} size={110} />
  <Word text="NO STEADY JOB" x={540} y={360} at={P(18)} t={t} size={96} />
  <Stamp text="DENIED" x={560} y={560} at={P(19)} color={N_RED} size={120} />
</>;

const Friends = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Penguin id="doug" x={540} y={G} h={400} pose={{look: [0, -0.8], brows: 'worried', beak: 'frown', flapR: 70}} />
  <Phone x={660} y={G - 230} w={90} t={t} ring={P(20)} screen="📞" rot={10} />
  {[0, 1, 2].map((i) => { const x = 190 + i * 350, at = P(20) + 0.15 + i * 0.18; const p = pop(t, at); if (p <= 0) return null;
    return <div key={i} style={{position: 'absolute', inset: 0, transform: `scale(${p})`, transformOrigin: `${x}px 600px`}}>
      <div style={{position: 'absolute', left: x - 150, top: 330, width: 300, height: 360, borderRadius: 40, background: 'rgba(30,38,100,0.85)', border: '3px solid rgba(170,195,255,0.5)'}} />
      {i === 0 && <Puffin x={x} y={660} h={280} />}
      {i === 1 && <Seal x={x} y={660} h={230} />}
      {i === 2 && <Seagull x={x} y={660} h={280} pose={{angry: false}} />}
      {t >= P(21) && <div style={{position: 'absolute', left: x - 110, top: 700, width: 220, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 70, color: N_RED, textShadow: '0 4px 0 #000'}}>{['$0', '$12', '-$80'][i]}</div>}
    </div>; })}
  <Word text="ALL BROKE" x={540} y={250} at={P(21)} t={t} size={110} color={N_RED} />
</>;

const Stuff = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Item x={220} y={700} kind="tv" />
  <Item x={540} y={560} kind="car" />
  <Item x={860} y={700} kind="sofa" />
  <Penguin id="doug" x={540} y={G} h={430} pose={{look: [0, -0.5], brows: t >= P(23) ? 'shock' : 'none', beak: t >= P(23) ? 'frown' : 'smile', flapL: 60, flapR: 60}} />
  <Word text="SELL IT?" x={540} y={250} at={P(22)} until={P(23)} t={t} size={120} />
  <Word text="OWN: NOTHING" x={540} y={250} at={P(23)} t={t} size={110} color={N_RED} />
  <Stamp text="RENTED" x={220} y={600} at={P(24)} color={N_RED} size={70} />
  <Stamp text="RENTED" x={540} y={460} at={P(24) + 0.2} color={N_RED} size={70} rot={8} />
  <Stamp text="RENTED" x={860} y={600} at={P(24) + 0.4} color={N_RED} size={70} />
</>;

const Cry = ({t}: {t: number}) => <>
  <NightGround y={G + 250} />
  <Penguin id="doug" x={540} y={G + 300} h={950} pose={{lids: 0.35, brows: 'worried', beak: 'frown', tears: true, tremble: 1}} />
</>;

const Threat = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Walrus x={760} y={G + 10} h={560} id="larry-threat" pose={{angry: true, mouth: 0.4 + 0.6 * Math.abs(Math.sin(t * 9)), lids: 0, look: -0.9, flap: 30 + 10 * Math.sin(t * 8)}} />
  <Phone x={570} y={G - 380} w={100} t={t} ring={P(26)} screen="📞" rot={-12} />
  <Word text="TONIGHT." x={540} y={300} at={P(27)} t={t} size={140} color={N_RED} />
  {t >= P(28) && <PopIn at={P(28)} t={t} x={0} y={0} origin="260px 1200px"><PoliceBear x={260} y={G} h={520} t={t} /></PopIn>}
  <Word text="🚨 POLICE" x={540} y={460} at={P(28) + 0.2} t={t} size={100} />
</>;

const DuckDream = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Penguin id="doug" x={280} y={G} h={430} pose={{turn: 0.5, look: [0.8, -0.6], brows: 'worried', beak: 'flat', lids: 0.2}} />
  <div style={{position: 'absolute', left: 520, top: G - 80, width: 520, height: 150, borderRadius: '50%', background: '#4FA3E0', border: `6px solid ${INK}`, boxSizing: 'border-box'}} />
  <Duck x={780} y={G - 10} w={280} t={t} />
  <Word text="DOUG = DUCK?" x={540} y={330} at={P(29)} until={P(30)} t={t} size={110} />
  <Card x={540} y={240} w={720} value="$0" label="DUCK RENT" at={P(30)} t={t} color={N_GREEN} size={150} />
</>;

const Mood = ({t, at, kind}: {t: number; at: number; kind: 'scared' | 'happy'}) => <>
  {kind === 'happy' && [0, 1, 2, 3, 4].map((i) => <div key={i} style={{position: 'absolute', left: 100 + i * 200, top: 620 + (i % 2) * 120 + Math.sin(t * 6 + i) * 20, fontSize: 90}}>✨</div>)}
  <NightGround y={G + 250} />
  <Penguin id="doug" x={540} y={G + 300} h={950}
    pose={kind === 'happy' ? {beak: 'smile', brows: 'happy', lids: 0.3, blush: 1, flapL: 120, flapR: 120} : {brows: 'shock', eyeScale: 1.4, pupil: 0.5, beak: 'frown', sweat: true, tremble: 1, flapL: 40, flapR: 40}} />
  <Word text={`Doug ${kind}.`} x={540} y={330} at={at} t={t} size={140} color={kind === 'happy' ? N_GREEN : N_RED} />
</>;

const Shop = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <div style={{position: 'absolute', left: 470, top: G - 520, width: 560, height: 520, background: '#3B3F58', border: `7px solid ${INK}`, boxSizing: 'border-box'}} />
  <div style={{position: 'absolute', left: 450, top: G - 640, width: 600, height: 130, background: '#F5C518', border: `7px solid ${INK}`, borderRadius: 14, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: SANS, fontWeight: 900, fontSize: 64, color: INK, boxShadow: `0 0 ${30 + 20 * Math.abs(Math.sin(t * 5))}px #F5C518`}}>PAYDAY LOANS</div>
  <div style={{position: 'absolute', left: 490, top: G - 200, width: 520, height: 200, background: '#7A5232', border: `7px solid ${INK}`, boxSizing: 'border-box'}} />
  <Puffin x={760} y={G - 190} h={300} pose={{smirk: true, mouth: 0.3 * Math.abs(Math.sin(t * 7))}} />
  <Penguin id="doug" x={240} y={G} h={430} pose={{turn: 0.5, look: [0.8, -0.4], brows: 'happy', beak: 'smile', flapR: 50}} />
</>;
const Loan = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Card x={540} y={230} w={760} value="$500" label="BORROW TODAY" at={P(33)} t={t} color={N_GREEN} size={150} />
  <Card x={540} y={640} w={760} value="$575" label="PAY BACK IN 2 WEEKS" at={P(34) + 0.6} t={t} color={N_RED} size={150} />
  <Puffin x={880} y={G + 20} h={300} pose={{smirk: true}} />
  <Penguin id="doug" x={220} y={G} h={380} pose={{turn: 0.4, look: [0.6, -0.8], brows: t >= P(34) + 0.6 ? 'shock' : 'none', beak: t >= P(34) + 0.6 ? 'frown' : 'smile', eyeScale: t >= P(34) + 0.6 ? 1.3 : 1}} />
</>;
const Apr = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Card x={540} y={260} w={860} value="~400%" label="A YEAR" source="CFPB ($15 per $100, 2 weeks)" at={P(35)} t={t} color={N_RED} size={190} />
  <Penguin id="doug" x={540} y={G} h={430} pose={{look: [0, -0.8], brows: t >= P(36) ? 'angry' : 'shock', eyeScale: 1.3, beak: 'frown', flapL: t >= P(36) ? 100 : 30, flapR: t >= P(36) ? 100 : 30}} />
  <Stamp text="NO" x={820} y={900} at={P(36)} color={N_RED} size={130} rot={10} />
</>;

const Hour = ({t}: {t: number}) => {
  const left = Math.max(0, 3600 - (t - P(37)) * 400), mm = Math.floor(left / 60), ss = Math.floor(left % 60);
  return <>
    <NightGround y={G} />
    <GlassCard x={140} y={260} w={800} h={300}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 170, color: N_RED, textShadow: `0 0 24px ${N_RED}88`}}>{`${mm}:${String(ss).padStart(2, '0')}`}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 220, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 44, color: '#fff'}}>UNTIL LARRY COMES</div>
    </GlassCard>
    <Penguin id="doug" x={540} y={G} h={480} pose={{look: [0, -0.8], brows: 'shock', eyeScale: 1.3, beak: 'frown', sweat: true, tremble: 1}} />
  </>;
};

const Dial = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Phone x={540} y={980} w={330} t={t} ring={P(38) + 0.6} screen={t >= P(39) ? '✅' : '211'} />
  <Penguin id="doug" x={200} y={G} h={380} pose={{turn: 0.5, look: [0.8, -0.5], brows: t >= P(39) ? 'happy' : 'worried', beak: t >= P(39) ? 'smile' : 'flat', flapR: 60}} />
  <Word text="CALL 211" x={540} y={250} at={P(38)} until={P(39)} t={t} size={120} />
  <Word text="RENT HELP: YES" x={540} y={250} at={P(39)} t={t} size={100} color={N_GREEN} />
</>;

const Wait = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <div style={{position: 'absolute', left: 538, top: 300, width: 4, height: 1000, background: 'linear-gradient(180deg, transparent, rgba(190,210,255,0.8), transparent)'}} />
  <Card x={270} y={260} w={480} value="2 WKS" label="CHARITY MONEY" at={P(40)} t={t} color={N_GREEN} size={110} />
  <Card x={810} y={260} w={480} value="TONIGHT" label="LARRY WANTS IT" at={P(41)} t={t} color={N_RED} size={92} />
  <Penguin id="doug" x={270} y={G} h={400} pose={{look: [0.2, -0.6], brows: 'worried', beak: 'frown'}} />
  {t >= P(41) && <Walrus x={810} y={G + 10} h={420} id="larry-wait" pose={{angry: true, mouth: 0.4 + 0.5 * Math.abs(Math.sin(t * 9)), lids: 0, look: -0.9}} />}
</>;

const Line = ({text, y, at, t, mark, color}: {text: string; y: number; at: number; t: number; mark: string; color: string}) => {
  const p = ease((t - at) / 0.2); if (p <= 0) return null;
  return <div style={{position: 'absolute', left: 60, top: y, transform: `scale(${p})`, transformOrigin: '0 50%', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 70, color: '#fff', whiteSpace: 'nowrap'}}>
    {text} <span style={{color}}>{mark}</span></div>;
};
const Math_ = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <GlassCard x={70} y={190} w={940} h={560}>
    <Line text="police tonight?" y={40} at={P(42)} t={t} mark="✗" color={N_RED} />
    <Line text="first: a judge" y={160} at={P(43)} t={t} mark="⚖️" color="#fff" />
    <Line text="court = weeks" y={280} at={P(44)} t={t} mark="⏳" color="#fff" />
    <Line text="Larry gets 0 fish" y={400} at={P(45)} t={t} mark="✗" color={N_RED} />
  </GlassCard>
  <Penguin id="doug" x={260} y={G} h={420} pose={{turn: 0.4, look: [0.6, -0.8], brows: 'happy', beak: 'smile', flapL: 120}} />
  <Walrus x={810} y={G + 10} h={430} id="larry-math" pose={{lids: 0.2, mouth: t >= P(45) ? 0.5 : 0, look: -0.6}} />
  {t >= P(44) && <div style={{position: 'absolute', left: 890, top: G - 400, fontSize: 60}}>💧</div>}
</>;

const Deal = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Penguin id="doug" x={230} y={G} h={420} pose={{turn: 0.5, look: [0.8, -0.3], brows: 'happy', beak: 'smile', flapR: 80}} />
  <Walrus x={850} y={G + 10} h={440} id="larry-deal" pose={{lids: 0.3, look: -0.8, flap: t >= P(48) ? 40 : 0}} />
  <FishFlight x1={300} y1={G - 300} x2={800} y2={G - 300} a={P(46) + 0.2} b={P(46) + 1.3} n={8} w={90} />
  <Paper x={540} y={560} w={380} title="RENT DEAL" amount="$200 NOW" at={P(46)} rot={-4} id="deal" />
  <PopIn at={P(47)} t={t} x={330} y={830}><Pill x={0} y={0} text="+ REST IN 2 WEEKS" color={N_GREEN} /></PopIn>
  <Stamp text="SIGNED ✍️" x={540} y={360} at={P(48)} color={N_GREEN} size={96} />
  <PopIn at={P(46) + 0.2} t={t} x={60} y={250}><Pill x={0} y={0} text="20 🐟 = $200" /></PopIn>
</>;

const Court = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <PopIn at={P(50)} t={t} x={370} y={180}><Pill x={0} y={0} text="IN REAL LIFE" /></PopIn>
  <Card x={540} y={290} w={940} value="NO COURT ORDER" label="= NO EVICTION" source="Nolo · FindLaw" at={P(50) + 0.4} t={t} color={N_GREEN} size={82} />
  <div style={{position: 'absolute', left: 440, top: 760, fontSize: 200, transform: `rotate(${t > P(50) + 1.4 ? Math.max(-30, -30 + 30 * Math.abs(Math.sin((t - P(50)) * 4))) : 0}deg)`}}>⚖️</div>
  <Penguin id="doug" x={200} y={G} h={360} pose={{look: [0.5, -0.6], brows: 'happy', beak: 'smile'}} />
</>;
const Cost = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <Card x={540} y={260} w={980} value="$2,500–$8,000" label="ONE EVICTION COSTS THE LANDLORD" source="Legal Services Corp., 2025" at={P(51)} t={t} color={N_RED} size={110} />
  <Walrus x={540} y={G + 10} h={520} id="larry-cost" pose={{lids: 0, look: 0, mouth: 0.6}} />
  <div style={{position: 'absolute', left: 640, top: G - 520, fontSize: 70}}>💧</div>
</>;
const Tips = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <GlassCard x={60} y={170} w={960} h={640}>
    <div style={{position: 'absolute', left: 0, right: 0, top: 30, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 76, color: N_RED}}>BEHIND ON RENT?</div>
    {[['📞 CALL 211', 53, 170], ['🤝 ASK FOR A PAYMENT PLAN', 54, 300], ['✍️ GET IT IN WRITING', 55, 430]].map(([s, i, y]) => {
      const p = ease((t - P(i as number)) / 0.2); if (p <= 0) return null;
      return <div key={s as string} style={{position: 'absolute', left: 50, top: y as number, transform: `scale(${p})`, transformOrigin: '0 50%', fontFamily: SANS, fontWeight: 900, fontSize: 52, color: '#fff', whiteSpace: 'nowrap'}}>{s}</div>; })}
    <div style={{position: 'absolute', left: 0, right: 0, top: 580, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 26, color: 'rgba(220,230,255,0.75)'}}>source: USA.gov — emergency rent help</div>
  </GlassCard>
  <Penguin id="doug" x={540} y={G} h={400} pose={{look: [0, -0.6], brows: 'happy', beak: 'smile', flapR: 110}} />
</>;
const Next = ({t}: {t: number}) => <>
  <NightGround y={G} />
  <PopIn at={P(56)} t={t} x={330} y={180}><Pill x={0} y={0} text="NEXT EPISODE" /></PopIn>
  <Word text="RENT +20%" x={540} y={400} at={P(56) + 0.6} t={t} size={160} color={N_RED} />
  <Walrus x={770} y={G + 10} h={520} id="larry-next" pose={{laugh: 1, mouth: 0.5, lids: 0.4, look: -0.6}} />
  <Penguin id="doug" x={260} y={G} h={430} pose={{turn: 0.5, look: [0.8, -0.3], brows: 'shock', eyeScale: 1.35, beak: 'frown', flapL: 50, flapR: 50}} />
  <Word text="can Larry do that? 👇" x={540} y={620} at={P(57)} t={t} size={78} />
</>;

// ---------- shots ----------
type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx; top?: boolean};
const SHOTS: Shot[] = [
  {at: 0, set: (t) => <Hk t={t} />, top: true},
  {at: P(4), set: (t) => <Paycheck t={t} />, fx_: 'zoom'},
  {at: P(9), set: (t) => <Call t={t} />, fx_: 'swipe'},
  {at: P(14), set: (t) => <Family t={t} />, fx_: 'iris'},
  {at: P(17), set: (t) => <Bank t={t} />, fx_: 'swipeL'},
  {at: P(20), set: (t) => <Friends t={t} />, fx_: 'pop'},
  {at: P(22), set: (t) => <Stuff t={t} />, fx_: 'swipe'},
  {at: P(25), set: (t) => <Cry t={t} />, fx_: 'zoom'},
  {at: P(26), set: (t) => <Threat t={t} />, fx_: 'swipeL'},
  {at: P(29), set: (t) => <DuckDream t={t} />, fx_: 'iris'},
  {at: P(31), set: (t) => <Mood t={t} at={P(31)} kind="scared" />, fx_: 'zoom'},
  {at: P(32), set: (t) => <Shop t={t} />, fx_: 'swipe'},
  {at: P(33), set: (t) => <Loan t={t} />, fx_: 'pop'},
  {at: P(35), set: (t) => <Apr t={t} />, fx_: 'zoom'},
  {at: P(37), set: (t) => <Hour t={t} />, fx_: 'swipeL'},
  {at: P(38), set: (t) => <Dial t={t} />, fx_: 'pop'},
  {at: P(40), set: (t) => <Wait t={t} />, fx_: 'swipe'},
  {at: P(42), set: (t) => <Math_ t={t} />, fx_: 'iris'},
  {at: P(46), set: (t) => <Deal t={t} />, fx_: 'swipeL'},
  {at: P(49), set: (t) => <Mood t={t} at={P(49)} kind="happy" />, fx_: 'zoom'},
  {at: P(50), set: (t) => <Court t={t} />, fx_: 'swipe'},
  {at: P(51), set: (t) => <Cost t={t} />, fx_: 'pop'},
  {at: P(52), set: (t) => <Tips t={t} />, fx_: 'swipeL'},
  {at: P(56), set: (t) => <Next t={t} />, fx_: 'zoom'},
];
// deep zooms [phrase, focusX, focusY, scale]
const DEEP: [number, number, number, number][] = [[13, 600, 700, 1.2], [16, 600, 640, 1.3], [19, 560, 620, 1.4], [28, 500, 820, 1.18], [31, 540, 700, 1.25], [34, 540, 760, 1.25], [45, 540, 640, 1.15], [48, 540, 500, 1.35]];

export const DougPaysEp1 = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at)!;
  let s0 = 1 + 0.02 * (tc - sh.at), fx = 540, fy = 960;
  const dz = DEEP.find(([i]) => tc >= P(i) && tc < E(i) + 0.15), dp = dz ? ease((tc - P(dz[0])) / 0.22) : 0;
  const s = (dz ? s0 + (dz[3] - s0) * dp : s0) * beat(tc, TIM);
  if (dz) { fx += (dz[1] - fx) * dp; fy += (dz[2] - fy) * dp; }
  return <AbsoluteFill style={{overflow: 'hidden'}}>
    <Fonts /><HandFont />
    <NightBg />
    <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
      <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}>{sh.set(sh.at === 0 ? tc : t)}</AbsoluteFill>
      {sh.top && <TopLine t={tc} />}
    </AbsoluteFill>
    {!sh.top && <SeriesBadge ep={1} />}
    <Captions t={tc} phrases={TIM.slice(2)} />
    <Audio src={staticFile('doug-rent-ep1-voice.mp3')} />
    {SHOTS.slice(1).map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.22} />)}
    {/* hook (same as the approved preview) */}
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={0.15} name="user-whoosh" vol={0.25} />
    <Sfx at={P(1)} name="user-boom" vol={0.45} />
    <Sfx at={P(2) + 0.35} name="user-cash-register" vol={0.35} />
    <Sfx at={P(3) + 0.5} name="user-wrong" vol={0.3} />
    {/* story */}
    <Sfx at={P(4)} name="penguin-squawk" vol={0.3} />
    <Sfx at={P(5)} name="user-money-transfer" vol={0.3} />
    <Sfx at={P(6)} name="user-cash-register" vol={0.3} />
    <Sfx at={P(7)} name="user-money" vol={0.3} />
    <Sfx at={P(8)} name="user-aww" vol={0.35} />
    <Sfx at={P(9)} name="user-notif" vol={0.45} />
    <Sfx at={P(10)} name="walrus-grunt" vol={0.4} />
    <Sfx at={P(12)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(13)} name="user-boom" vol={0.4} />
    <Sfx at={P(14)} name="user-pop" vol={0.3} />
    <Sfx at={P(15)} name="user-pop" vol={0.3} />
    <Sfx at={P(16)} name="user-pop" vol={0.3} />
    <Sfx at={P(18)} name="user-wrong" vol={0.3} />
    <Sfx at={P(19)} name="user-slap" vol={0.4} />
    <Sfx at={P(20)} name="user-notif2" vol={0.35} />
    <Sfx at={P(21)} name="user-horn" vol={0.3} />
    <Sfx at={P(23)} name="user-shock" vol={0.35} />
    <Sfx at={P(24)} name="user-slap" vol={0.3} />
    <Sfx at={P(24) + 0.2} name="user-slap" vol={0.3} />
    <Sfx at={P(24) + 0.4} name="user-slap" vol={0.3} />
    <Sfx at={P(25)} name="user-aww" vol={0.4} />
    <Sfx at={P(26)} name="user-notif" vol={0.4} />
    <Sfx at={P(27)} name="user-boom" vol={0.45} />
    <Sfx at={P(28)} name="walrus-laugh" vol={0.35} />
    <Sfx at={P(29)} name="user-pop" vol={0.3} />
    <Sfx at={P(30)} name="user-wow" vol={0.35} />
    <Sfx at={P(31)} name="user-fahh" vol={0.45} />
    <Sfx at={P(32)} name="user-ting" vol={0.3} />
    <Sfx at={P(33)} name="user-money" vol={0.35} />
    <Sfx at={P(34) + 0.6} name="user-cash-register" vol={0.35} />
    <Sfx at={P(35)} name="user-boom" vol={0.45} />
    <Sfx at={P(36)} name="user-slap" vol={0.4} />
    <Sfx at={P(37)} name="user-timer" vol={0.4} />
    <Sfx at={P(38) + 0.6} name="user-notif2" vol={0.35} />
    <Sfx at={P(39)} name="user-yeah" vol={0.4} />
    <Sfx at={P(40)} name="user-timer" vol={0.3} />
    <Sfx at={P(41)} name="walrus-grunt" vol={0.4} />
    <Sfx at={P(42)} name="user-wrong" vol={0.3} />
    <Sfx at={P(43)} name="user-ting" vol={0.3} />
    <Sfx at={P(44)} name="user-timer" vol={0.25} />
    <Sfx at={P(45)} name="user-boom" vol={0.4} />
    <Sfx at={P(46) + 0.2} name="user-money-transfer" vol={0.35} />
    <Sfx at={P(48)} name="user-slap" vol={0.35} />
    <Sfx at={P(49)} name="user-yeah" vol={0.4} />
    <Sfx at={P(50) + 0.4} name="user-ting" vol={0.35} />
    <Sfx at={P(51)} name="user-cash-register" vol={0.35} />
    <Sfx at={P(51) + 0.6} name="user-boom" vol={0.4} />
    <Sfx at={P(53)} name="user-pop" vol={0.3} />
    <Sfx at={P(54)} name="user-pop" vol={0.3} />
    <Sfx at={P(55)} name="user-pop" vol={0.3} />
    <Sfx at={P(56) + 0.6} name="user-shock" vol={0.4} />
    <Sfx at={P(57)} name="walrus-laugh" vol={0.35} />
  </AbsoluteFill>;
};
