// Trial episode (one-off, user 2026-10-22): the user's own "floating islands" image style (agentstick look).
// The user's image is cut into 3 pieces (USA island / scale / Russia island, studio/public/enemy-oil/*.png) that move
// on their own; Doug + his flag stand in the middle like "Bob"; one big word in the centre, word by word with the voice.
import React from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {FPS, Fonts} from '../base';
import {INK, Penguin, onTwos, talk} from '../penguin/rig';
import {Sfx} from '../penguin/edit';
import {Bill, Washer} from './dougLaundering';
import {Puffin} from '../penguin/cast';
import {GasCan} from './dougGas';
import {GasPump, Globe} from './dougSanctions';
import {Fx, cutFX} from '../penguin/acting';
import {PriceTag} from '../penguin/world';
import EP from '../data/doug-enemy-oil.json';

export const DOUG_ENEMY_OIL_HOOK_SECONDS = 5;
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const ease = (p: number) => 1 - Math.pow(1 - cl(p), 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;
const RED = '#D83A2E', GOLD = '#F5C518', GREEN = '#2E9E4F';
const DY = 60; // whole picture pushed down a little (TikTok top bar)

// spoken words (syllable-aligned to the voice)
const WORDS: [number, string, string?][] = [
  [0, 'WHY'], [0.19, 'DO'], [0.38, 'RICH'], [0.56, 'COUNTRIES'], [0.94, 'KEEP'], [1.13, 'BUYING'], [1.5, 'OIL'], [1.69, 'FROM'],
  [1.88, 'COUNTRIES'], [2.25, 'THEY'], [2.44, 'CALL'], [2.63, 'ENEMIES?', RED], [3.24, 'THERE ARE'], [3.55, '3', RED], [3.75, 'REASONS', RED],
];
const T = {rich: 0.38, buying: 1.13, oil: 1.5, enemies: 2.63, three: 3.55, end: 4.16};


const Piece = ({src, x, y, w, t, phase, s = 1, rot = 0, shake = 0}: {src: string; x: number; y: number; w: number; t: number; phase: number; s?: number; rot?: number; shake?: number}) =>
  <Img src={staticFile(`enemy-oil/${src}.png`)} style={{position: 'absolute', left: x + shake, top: y + DY + Math.sin(t * 1.8 + phase) * 6, width: w,
    transform: `scale(${s}) rotate(${rot}deg)`, transformOrigin: '50% 90%'}} />;

const BigWord = ({t}: {t: number}) => {
  const i = WORDS.findIndex((w, k) => t >= w[0] && t < (WORDS[k + 1]?.[0] ?? 99));
  if (i < 0) return null;
  const [at, text, color = INK] = WORDS[i], d = t - at, s = d < 0.1 ? 1.12 - 0.12 * (d / 0.1) : 1;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 830 + DY, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontStyle: 'italic',
    fontSize: Math.min(190, 1150 / text.length), lineHeight: 1, letterSpacing: -4, color, transform: `scale(${s}) skewX(-6deg)`}}>{text}</div>;
};

// object flying on an arc between (x1,y1) and (x2,y2) from time a, for d seconds
const fly = (t: number, a: number, d: number, x1: number, y1: number, x2: number, y2: number, arc = 180) => {
  const p = (t - a) / d; if (p < 0 || p > 1) return null;
  return {x: lerp(x1, x2, p), y: lerp(y1, y2, p) - Math.sin(p * Math.PI) * arc, p};
};
const F = 1080 / 941; // user's picture -> video scale
const bobOf = (t: number, phase: number) => Math.sin(t * 1.8 + phase) * 6;

// A cut-out character from the user's picture. (fx, fy) = feet point; motion = hop / lean around the feet.
const Actor = ({src, left, top, w, fx, fy, hop = 0, rot = 0, dx = 0}: {src: string; left: number; top: number; w: number; fx: number; fy: number; hop?: number; rot?: number; dx?: number}) =>
  <Img src={staticFile(`enemy-oil/${src}.png`)} style={{position: 'absolute', left: left + dx, top: top - hop, width: w,
    transform: `rotate(${rot}deg)`, transformOrigin: `${fx - left}px ${fy - top}px`}} />;

// The real barrel from the picture (copies get shipped to America).
const BW = 82 * F, BH = 126 * F;
const Barrel = ({x, y, s = 1, rot = 0}: {x: number; y: number; s?: number; rot?: number}) =>
  <Img src={staticFile('enemy-oil/barrel.png')} style={{position: 'absolute', left: x - BW * s / 2, top: y - BH * s, width: BW * s, transform: `rotate(${rot}deg)`, transformOrigin: '50% 100%'}} />;

// barrels shipped Russia -> America: [start, landing x, landing y (bottom)]
const SHIP: [number, number, number][] = [[1.5, 200, 552], [1.95, 295, 556], [2.75, 105, 546]];
const FROM = {x: 819 * F, y: 474 * F};

const Hook = ({t}: {t: number}) => {
  const usaB = bobOf(t, 0), ruB = bobOf(t, 2);
  const tilt = t < T.buying ? 0 : Math.sin((t - T.buying) * 7) * 6 * Math.exp(-(t - T.buying) * 1.2);
  const enemy = t >= T.enemies;
  const side = t < T.buying ? -1 : t < T.enemies - 0.4 ? 0 : t < 3.24 ? 1 : 0;
  // Trump: hop on "rich", leans + swings the bag on "buying", angry jabbing at Putin on "enemies"
  const hopP = cl((t - T.rich) / 0.35), tHop = t >= T.rich && hopP < 1 ? Math.sin(hopP * Math.PI) * 34 : 0;
  const tLean = t >= T.buying && t < T.enemies ? 6 * Math.sin(cl((t - T.buying) / 0.3) * Math.PI / 2) * (1 + 0.3 * Math.sin(t * 9)) : 0;
  const tJab = enemy && t < 3.3 ? 7 + Math.sin(t * 22) * 5 : 0;
  const tShake = enemy && t < 3.3 ? Math.sin(t * 60) * 3 : 0;
  // Putin: catches the money (bounce), then leans back smug and laughs on "enemies"
  const catchP = cl((t - T.buying - 0.55) / 0.3), pBounce = catchP > 0 && catchP < 1 ? Math.sin(catchP * Math.PI) * 22 : 0;
  const pLean = enemy ? -5 : 0, pLaugh = enemy && t < 3.4 ? Math.abs(Math.sin(t * 16)) * 8 : 0;
  return <>
    {enemy && <div style={{position: 'absolute', left: 640, top: 200 + DY, width: 520, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(216,58,46,0.35), rgba(216,58,46,0))',
      opacity: 0.6 + 0.4 * Math.sin((t - T.enemies) * 10)}} />}
    <Piece src="usa" x={0} y={195} w={383} t={t} phase={0} />
    <Piece src="russia" x={718} y={124} w={362} t={t} phase={2} />
    <Piece src="scale" x={383} y={247} w={335} t={t} phase={4} rot={tilt} />
    <Actor src="putin" left={650 * F} top={180 * F + DY + ruB} w={140 * F} fx={720 * F} fy={455 * F + DY + ruB} hop={pBounce + pLaugh} rot={pLean} />
    {SHIP.map(([a, x, y], i) => t >= a + 0.6 && <Barrel key={i} x={x} y={y + DY + usaB} s={0.9} />)}
    <Actor src="trump" left={100 * F} top={165 * F + DY + usaB} w={234 * F} fx={215 * F} fy={430 * F + DY + usaB} hop={tHop} rot={tLean + tJab} dx={tShake} />
    {[0, 1, 2].map((i) => { const f = fly(t, T.buying + i * 0.13, 0.55, 165, 460 + DY, 820, 380 + DY); return f && <Bill key={i} x={f.x} y={f.y} w={120} rot={f.p * 360} />; })}
    {SHIP.map(([a, x, y], i) => { const f = fly(t, a, 0.6, FROM.x, FROM.y + DY, x, y + DY, 230); return f && <Barrel key={i} x={f.x} y={f.y} s={lerp(1.1, 0.9, f.p)} rot={f.p * -360} />; })}
    {t >= T.buying + 0.55 && t < T.enemies && <Emote kind="money" x={750} y={240 + DY + ruB - pBounce} t={t} />}
    {enemy && <Emote kind="anger" x={300 - tShake} y={230 + DY + usaB} t={t} />}
    {enemy && <Emote kind="laugh" x={900} y={230 + DY + ruB - pLaugh} t={t} />}
  </>;
};
const HookDoug = ({t}: {t: number}) => {
  const enemy = t >= T.enemies, side = t < T.buying ? -1 : t < T.enemies - 0.4 ? 0 : t < 3.24 ? 1 : 0;
  return <Penguin id="doug" x={540} y={1880} h={780} pose={{turn: side * 0.45, look: [side * 0.8, side ? -0.6 : 0], mouth: talk(t, [[0, T.end]]),
    flapL: side < 0 ? 140 + Math.sin(t * 9) * 6 : 25, flapR: side > 0 ? 140 + Math.sin(t * 9) * 6 : t >= T.three ? 150 : 25,
    brows: enemy && t < 3.24 ? 'angry' : 'worried', eyeScale: t >= T.three ? 1.15 : 1}} />;
};

// Cartoon emotes drawn next to a head (the user's picture can't change faces, so feelings are shown around them).
type EmoteKind = 'anger' | 'laugh' | 'sweat' | 'money' | 'shock' | 'question';
const Emote = ({kind, x, y, t, s = 1}: {kind: EmoteKind; x: number; y: number; t: number; s?: number}) => {
  const k = s * (1 + 0.12 * Math.sin(t * 12));
  const box: React.CSSProperties = {position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${k})`, fontFamily: 'Montserrat', fontWeight: 900, lineHeight: 1};
  if (kind === 'anger') return <svg width={90} height={90} viewBox="-45 -45 90 90" style={{...box, overflow: 'visible'}}>
    {[0, 90, 180, 270].map((a) => <path key={a} transform={`rotate(${a})`} d="M8 -34 Q 4 -12, 30 -8" fill="none" stroke={RED} strokeWidth={10} strokeLinecap="round" />)}</svg>;
  if (kind === 'laugh') return <div style={{...box, fontSize: 54, color: RED, WebkitTextStroke: `3px ${INK}`, transform: `translate(-50%,-50%) rotate(${Math.sin(t * 20) * 8}deg) scale(${k})`}}>HA!</div>;
  if (kind === 'money') return <div style={{...box, fontSize: 64, color: GREEN, WebkitTextStroke: `3px ${INK}`}}>$$</div>;
  if (kind === 'shock') return <div style={{...box, fontSize: 90, color: RED, WebkitTextStroke: `4px ${INK}`}}>!</div>;
  if (kind === 'question') return <div style={{...box, fontSize: 90, color: GOLD, WebkitTextStroke: `4px ${INK}`}}>?</div>;
  const p = (t * 1.2) % 1;
  return <svg width={60} height={80} viewBox="-30 -40 60 80" style={{...box, top: y + p * 40, opacity: 1 - p * 0.6, overflow: 'visible'}}><path d="M0 -30 C 10 -10, 18 4, 0 18 C -18 4, -10 -10, 0 -30 Z" fill="#9AD6F5" stroke={INK} strokeWidth={4} /></svg>;
};

export const DougEnemyOilHook = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  // very light push toward the side being spoken, back to wide on "There are 3 reasons"
  const toL = tc >= T.rich && tc < T.buying + 0.3 ? ease((tc - T.rich) / 0.4) : 0, toR = tc >= T.enemies - 0.4 && tc < 3.24 ? ease((tc - T.enemies + 0.4) / 0.4) : 0;
  const s = 1 + 0.05 * (toL + toR), fx = 540 - 70 * toL + 70 * toR, fy = 900;
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts />
    <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${fy - fy * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={t} /><BigWord t={t} /><HookDoug t={t} /></AbsoluteFill>
    <Audio src={staticFile('doug-enemy-oil-hook-voice.mp3')} />
    <Sfx at={0} name="user-ting" vol={0.5} />
    <Sfx at={T.rich} name="user-pop" vol={0.3} />
    <Sfx at={T.buying} name="user-whoosh" vol={0.35} />
    <Sfx at={T.buying + 0.5} name="user-cash-register" vol={0.35} />
    <Sfx at={T.enemies} name="user-boom" vol={0.45} />
    <Sfx at={T.three} name="user-ting" vol={0.4} />
  </AbsoluteFill>;
};

// =====================================================================================================
// Full trial episode (~62 s): stage on top (user's picture pieces + props), one big word in the middle,
// Doug (explains) + a naive Puffin (asks, voice am_liam) at the bottom. Timings: data/doug-enemy-oil.json.
// =====================================================================================================
const P = (i: number) => EP[i].start, E = (i: number) => EP[i].end;
export const DOUG_ENEMY_OIL_SECONDS = Math.ceil((EP[EP.length - 1].end + 0.8) * 30) / 30;
const DOUG_LINES = [0, 2, 8, 14, 22, 26]; // lines asked by the Puffin (voice am_liam)
const HOT = /^(ENEMIES\?|3|REASONS\.?|CHEAP\.?|40%|RUSSIA\.?|€?21\.9|18\.7|42|BILLION\.?|BANNED|DIRTY\.?|CLEAN\.?|WAR\.?|WAR|SHOCKED|ENEMY|CRAZIEST\.?|LAUNDROMAT\.?|PUMP\.?|ONE,|TWO,|THREE\?|THREE)$/;

// every spoken word with its time (character-weighted inside each line)
const ALL_WORDS: [number, string, string?][] = EP.flatMap((l) => {
  const ws = l.text.replace(/21\.9 billion euros/, '€21.9 BILLION').split(/\s+/).filter(Boolean);
  const tot = ws.reduce((a, w) => a + w.length + 1, 0); let t = l.start;
  return ws.map((w) => { const at = t; t += (l.end - l.start) * (w.length + 1) / tot; const u = w.toUpperCase().replace(/[",]$/, '').replace(/[.:]$/, '');
    return [at, u, HOT.test(u) || HOT.test(w.toUpperCase()) ? RED : undefined] as [number, string, string?]; });
});
const EpWord = ({t}: {t: number}) => {
  const i = ALL_WORDS.findIndex((w, k) => t >= w[0] && t < (ALL_WORDS[k + 1]?.[0] ?? 99));
  if (i < 0) return null;
  const [at, text, color = INK] = ALL_WORDS[i], d = t - at, s = d < 0.1 ? 1.12 - 0.12 * (d / 0.1) : 1;
  return <div style={{position: 'absolute', left: 0, right: 0, top: 830 + DY, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontStyle: 'italic',
    fontSize: Math.min(190, 1150 / Math.max(1, text.length)), lineHeight: 1, letterSpacing: -4, color, transform: `scale(${s}) skewX(-6deg)`}}>{text}</div>;
};

// ---------- flags (drawn) ----------
const Flag = ({kind, x, y, w = 200, t}: {kind: 'eu' | 'ua' | 'in' | 'cn' | 'tr' | 'ae' | 'sg' | 'us' | 'ru'; x: number; y: number; w?: number; t: number}) => {
  const h = w * 0.64, wave = Math.sin(t * 5 + x) * 3;
  const body = kind === 'eu' ? <><rect width={150} height={96} fill="#003399" />{Array.from({length: 12}, (_, i) => { const a = i * Math.PI / 6; return <circle key={i} cx={75 + Math.cos(a) * 28} cy={48 + Math.sin(a) * 28} r={4.5} fill="#FFCC00" />; })}</>
    : kind === 'ua' ? <><rect width={150} height={48} fill="#0057B7" /><rect y={48} width={150} height={48} fill="#FFD700" /></>
    : kind === 'in' ? <><rect width={150} height={32} fill="#FF9933" /><rect y={32} width={150} height={32} fill="#fff" /><rect y={64} width={150} height={32} fill="#138808" /><circle cx={75} cy={48} r={11} fill="none" stroke="#000080" strokeWidth={3} /></>
    : kind === 'cn' ? <><rect width={150} height={96} fill="#DE2910" /><path d="M28 14 L33 29 L49 29 L36 38 L41 53 L28 44 L15 53 L20 38 L7 29 L23 29 Z" fill="#FFDE00" /></>
    : kind === 'tr' ? <><rect width={150} height={96} fill="#E30A17" /><circle cx={58} cy={48} r={22} fill="#fff" /><circle cx={65} cy={48} r={18} fill="#E30A17" /><circle cx={92} cy={48} r={7} fill="#fff" /></>
    : kind === 'ae' ? <><rect width={150} height={32} fill="#00732F" /><rect y={32} width={150} height={32} fill="#fff" /><rect y={64} width={150} height={32} fill="#000" /><rect width={40} height={96} fill="#FF0000" /></>
    : kind === 'sg' ? <><rect width={150} height={48} fill="#EF3340" /><rect y={48} width={150} height={48} fill="#fff" /><circle cx={30} cy={24} r={13} fill="#fff" /><circle cx={36} cy={24} r={12} fill="#EF3340" /></>
    : kind === 'ru' ? <><rect width={150} height={32} fill="#fff" /><rect y={32} width={150} height={32} fill="#0039A6" /><rect y={64} width={150} height={32} fill="#D52B1E" /></>
    : <>{Array.from({length: 7}, (_, i) => <rect key={i} y={i * 13.7} width={150} height={6.9} fill="#B22234" />)}<rect width={66} height={52} fill="#3C3B6E" /></>;
  return <svg width={w} height={h} viewBox="0 0 150 96" style={{position: 'absolute', left: x - w / 2, top: y - h / 2, overflow: 'visible', transform: `skewY(${wave}deg)`}}>
    {body}<rect width={150} height={96} fill="none" stroke={INK} strokeWidth={5} /></svg>;
};

// real barrel from the user's picture with a gold "?" / number sticker (the 3 mystery barrels)
const MysteryBarrel = ({x, y, s = 2.2, rot = 0, label, open = 0}: {x: number; y: number; s?: number; rot?: number; label: string; open?: number}) =>
  <div style={{position: 'absolute', left: x - BW * s / 2, top: y - BH * s, width: BW * s, height: BH * s, transform: `rotate(${rot}deg)`, transformOrigin: '50% 100%'}}>
    <Img src={staticFile('enemy-oil/barrel.png')} style={{width: '100%'}} />
    <div style={{position: 'absolute', left: '50%', top: '52%', width: 110 * s / 2.2, height: 110 * s / 2.2, transform: `translate(-50%,-50%) rotateY(${open * 180}deg)`, borderRadius: '50%', background: label === '?' ? GOLD : RED,
      border: `6px solid ${INK}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 80 * s / 2.2, color: label === '?' ? INK : '#fff'}}>{label}</div>
  </div>;

const Pipe = ({x1, x2, y, t, flow = true}: {x1: number; x2: number; y: number; t: number; flow?: boolean}) => <>
  <div style={{position: 'absolute', left: Math.min(x1, x2), top: y - 26, width: Math.abs(x2 - x1), height: 52, background: '#9AA3AB', border: `6px solid ${INK}`, borderRadius: 14}} />
  {flow && [0, 1, 2, 3].map((i) => { const ph = (t * 0.9 + i / 4) % 1; return <div key={i} style={{position: 'absolute', left: lerp(x1, x2, ph) - 18, top: y - 18, width: 36, height: 36, borderRadius: '50%', background: '#7FD3F7', border: `4px solid ${INK}`}} />; })}
</>;

const House = ({x, y, dark}: {x: number; y: number; dark?: boolean}) => <svg width={220} height={200} viewBox="0 0 220 200" style={{position: 'absolute', left: x - 110, top: y - 200, overflow: 'visible'}}>
  <path d="M20 90 L110 14 L200 90 Z" fill="#C0392B" stroke={INK} strokeWidth={6} strokeLinejoin="round" />
  <rect x={40} y={90} width={140} height={108} fill="#F4E9D8" stroke={INK} strokeWidth={6} />
  {[60, 130].map((wx) => <rect key={wx} x={wx} y={110} width={34} height={34} fill={dark ? '#2B2B40' : '#FFE27A'} stroke={INK} strokeWidth={4} />)}
  <rect x={95} y={150} width={30} height={48} fill="#8B5A2B" stroke={INK} strokeWidth={4} />
</svg>;

const Tank = ({x, y}: {x: number; y: number}) => <svg width={300} height={160} viewBox="0 0 300 160" style={{position: 'absolute', left: x - 150, top: y - 160, overflow: 'visible'}}>
  <rect x={20} y={100} width={260} height={50} rx={25} fill="#4A5A3A" stroke={INK} strokeWidth={6} />
  {[55, 105, 155, 205, 245].map((cx) => <circle key={cx} cx={cx} cy={125} r={14} fill="#2B2B2B" stroke={INK} strokeWidth={4} />)}
  <rect x={50} y={60} width={190} height={46} rx={10} fill="#6B7F4F" stroke={INK} strokeWidth={6} />
  <rect x={100} y={30} width={90} height={40} rx={14} fill="#6B7F4F" stroke={INK} strokeWidth={6} />
  <rect x={-40} y={42} width={150} height={14} fill="#4A5A3A" stroke={INK} strokeWidth={5} />
</svg>;

const Refinery = ({x, y, t}: {x: number; y: number; t: number}) => <svg width={360} height={300} viewBox="0 0 360 300" style={{position: 'absolute', left: x - 180, top: y - 300, overflow: 'visible'}}>
  {[0, 1, 2].map((i) => { const ph = (t * 0.8 + i / 3) % 1; return <circle key={i} cx={80 + ph * 30} cy={40 - ph * 70} r={18 + ph * 22} fill="#D6D6D6" stroke={INK} strokeWidth={3} opacity={1 - ph} />; })}
  <rect x={64} y={40} width={34} height={180} fill="#B9C0C3" stroke={INK} strokeWidth={5} />
  <rect x={130} y={100} width={120} height={130} rx={50} fill="#E4E7E8" stroke={INK} strokeWidth={5} />
  <rect x={10} y={220} width={340} height={70} fill="#FF9933" stroke={INK} strokeWidth={5} />
  <text x={180} y={268} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill={INK}>REFINERY</text>
</svg>;

const MoneySack = ({x, y, w, label, color = GREEN}: {x: number; y: number; w: number; label: string; color?: string}) => <svg width={w} height={w * 1.1} viewBox="0 0 100 110" style={{position: 'absolute', left: x - w / 2, top: y - w * 1.1, overflow: 'visible'}}>
  <path d="M30 20 L70 20 L60 34 C 95 50, 100 105, 50 106 C 0 105, 5 50, 40 34 Z" fill={color} stroke={INK} strokeWidth={4} strokeLinejoin="round" />
  <text x={50} y={78} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={label.length > 5 ? 17 : 24} fill="#fff">{label}</text></svg>;

const Glow = ({x, y, r, color = 'rgba(216,58,46,0.3)'}: {x: number; y: number; r: number; color?: string}) =>
  <div style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: '50%', background: `radial-gradient(circle, ${color}, rgba(255,255,255,0))`}} />;

// stage pieces placed anywhere (island pieces from the user's picture)
const Isl = ({src, x, y, w, t, phase = 0, flip}: {src: string; x: number; y: number; w: number; t: number; phase?: number; flip?: boolean}) =>
  <Img src={staticFile(`enemy-oil/${src}.png`)} style={{position: 'absolute', left: x, top: y + Math.sin(t * 1.8 + phase) * 6, width: w, transform: flip ? 'scaleX(-1)' : undefined}} />;
const PutinAt = ({x, y, h = 330, hop = 0, rot = 0, emote, t = 0}: {x: number; y: number; h?: number; hop?: number; rot?: number; emote?: EmoteKind; t?: number}) => <>
  <Img src={staticFile('enemy-oil/putin.png')} style={{position: 'absolute', left: x - h * 0.248, top: y - h - hop, height: h, transform: `rotate(${rot}deg)`, transformOrigin: '50% 100%'}} />
  {emote && <Emote kind={emote} x={x + h * 0.26} y={y - h * 0.92 - hop} t={t} s={h / 360} />}</>;
const TrumpAt = ({x, y, h = 330, hop = 0, rot = 0, emote, t = 0}: {x: number; y: number; h?: number; hop?: number; rot?: number; emote?: EmoteKind; t?: number}) => <>
  <Img src={staticFile('enemy-oil/trump.png')} style={{position: 'absolute', left: x - h * 0.4, top: y - h - hop, height: h, transform: `rotate(${rot}deg)`, transformOrigin: '40% 100%'}} />
  {emote && <Emote kind={emote} x={x + h * 0.15} y={y - h * 0.95 - hop} t={t} s={h / 360} />}</>;

// ---------- stage sets ----------
const ST = 800 + DY; // stage floor (just above the big word)
const Three = ({t, from, labels = ['?', '?', '?']}: {t: number; from: number; labels?: string[]}) => <>
  {[0, 1, 2].map((i) => { const p = ease((t - from - i * 0.15) / 0.35), wob = t > P(3) && t < E(3) ? Math.sin(t * 18 + i) * 5 : 0;
    return p > 0 && <MysteryBarrel key={i} x={220 + i * 320} y={lerp(ST - 500, ST, p)} rot={(i - 1) * 7 + wob} label={labels[i]} />; })}
</>;
const ReasonCard = ({t, n, at}: {t: number; n: number; at: number}) => {
  const p = ease((t - at) / 0.35), flip = cl((t - at - 0.35) / 0.3);
  return <><Glow x={540} y={ST - 250} r={360} color="rgba(245,197,24,0.35)" />
    <MysteryBarrel x={540} y={ST} s={lerp(2.2, 3.2, p)} rot={Math.sin(t * 10) * 3 * (1 - flip)} label={flip > 0.5 ? String(n) : '?'} open={flip < 1 ? flip : 0} /></>;
};
const GasDeal = ({t, cold, tank}: {t: number; cold?: boolean; tank?: boolean}) => <>
  <Isl src="russia" x={640} y={170 + DY} w={420} t={t} phase={2} />
  <Pipe x1={130} x2={790} y={ST - 140} t={t} flow />
  <Flag kind="eu" x={170} y={ST - 380} w={240} t={t} />
  <House x={170} y={ST - 160} dark={cold} />
  {cold && Array.from({length: 14}, (_, i) => <div key={i} style={{position: 'absolute', left: (i * 83) % 1080, top: ((i * 151) % 700 + t * 120) % 760 + 60, fontSize: 40, color: '#9CC8E8'}}>❄</div>)}
  {tank && <Tank x={lerp(1250, 860, ease((t - P(9) - 0.3) / 0.8))} y={ST - 20} />}
</>;
const Share = ({t}: {t: number}) => {
  const p = ease((t - P(5) - 0.6) / 0.8) * 0.4;
  return <>
    <Flag kind="eu" x={260} y={ST - 330} w={300} t={t} />
    <svg width={400} height={400} viewBox="-100 -100 200 200" style={{position: 'absolute', left: 600, top: ST - 560}}>
      <circle r={90} fill="#E6E6E6" stroke={INK} strokeWidth={6} />
      <path d={`M0 0 L0 -90 A90 90 0 ${p > 0.5 ? 1 : 0} 1 ${90 * Math.sin(p * 2 * Math.PI)} ${-90 * Math.cos(p * 2 * Math.PI)} Z`} fill={RED} stroke={INK} strokeWidth={5} />
      <text x={30} y={-20} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={34} fill="#fff">{Math.round(p * 100)}%</text>
    </svg>
    <Flag kind="ru" x={800} y={ST - 90} w={150} t={t} />
  </>;
};
const PriceBoom = ({t}: {t: number}) => <>
  <Glow x={540} y={ST - 300} r={380} />
  <svg width={340} height={460} style={{position: 'absolute', left: 120, top: ST - 520, overflow: 'visible'}}>
    <path d="M170 450 L170 60 M60 170 L170 40 L280 170" fill="none" stroke={RED} strokeWidth={46} strokeLinecap="round" strokeLinejoin="round" /></svg>
  <PutinAt x={760} y={ST} h={380} hop={Math.abs(Math.sin(t * 8)) * 14} rot={Math.sin(t * 4) * 4} emote="laugh" t={t} />
  <PriceTag x={830} y={ST - 430} price="SALE" at={P(11) + 1.2} rot={8} size={1} />
</>;
const Paid = ({t, ukraine}: {t: number; ukraine?: boolean}) => {
  const f = Math.min(1, Math.max(0, (t - P(12) - 0.4) / 0.7));
  return <>
    <Flag kind="eu" x={170} y={ST - 420} w={220} t={t} />
    <PutinAt x={850} y={ST} h={460} hop={f >= 1 ? Math.abs(Math.sin(t * 7)) * 12 : 0} rot={f >= 1 ? Math.sin(t * 5) * 4 : 0} emote={f >= 1 ? 'money' : undefined} t={t} />
    <MoneySack x={lerp(220, 640, ease(f))} y={ST - 40 - Math.sin(f * Math.PI) * 160} w={300} label="€21.9B" />
    {ukraine && <><Flag kind="ua" x={170} y={ST - 160} w={160} t={t} /><MoneySack x={380} y={ST - 40} w={220} label="€18.7B" color="#3E7FCB" /></>}
  </>;
};
const BackDoor = ({t}: {t: number}) => {
  const o = ease((t - P(15) - 1.0) / 0.5);
  return <>
    <ReasonCard t={t} n={3} at={P(15)} />
    {o > 0 && <svg width={260} height={420} style={{position: 'absolute', left: 820, top: ST - 430, overflow: 'visible'}}>
      <rect x={0} y={0} width={220} height={420} fill="#2B2B2B" stroke={INK} strokeWidth={6} />
      <g transform={`skewY(${o * 20})`}><rect x={0} y={0} width={220 * (1 - o * 0.7)} height={420} fill="#8B5A2B" stroke={INK} strokeWidth={6} /></g></svg>}
  </>;
};
const ToIndia = ({t}: {t: number}) => {
  const f = fly(t, P(16) + 0.3, 0.8, 760, ST - 200, 300, ST - 120, 220);
  return <>
    <PutinAt x={830} y={ST} h={360} hop={Math.abs(Math.sin(t * 6)) * 8} rot={-3 + Math.sin(t * 3) * 3} emote="money" t={t} />
    <Flag kind="in" x={250} y={ST - 330} w={260} t={t} />
    {f ? <Barrel x={f.x} y={f.y} s={1.4} rot={f.p * -360} /> : t > P(16) + 1.1 && <Barrel x={300} y={ST - 40} s={1.4} />}
    <PriceTag x={520} y={ST - 520} price="SALE" at={P(16) + 1.0} rot={-6} size={0.9} />
  </>;
};
const Diesel = ({t, toEU}: {t: number; toEU?: boolean}) => {
  const k = ((t - P(17)) * 0.8) % 1;
  const f = toEU ? fly(t, P(18) + 0.2, 0.8, 640, ST - 80, 900, ST - 220, 200) : null;
  return <>
    <Flag kind="in" x={160} y={ST - 520} w={180} t={t} />
    <div style={{position: 'absolute', left: 0, top: 0, transform: 'scale(1.3)', transformOrigin: `420px ${ST}px`}}><Refinery x={420} y={ST} t={t} /></div>
    {!toEU && <><Barrel x={lerp(80, 300, k)} y={ST} s={1} /><div style={{position: 'absolute', left: 0, top: 0}}><GasCan x={lerp(560, 760, k)} y={ST} w={110} special /></div></>}
    {toEU && <><Flag kind="eu" x={900} y={ST - 420} w={240} t={t} />{f ? <GasCan x={f.x} y={f.y} w={120} special /> : t > P(18) + 1 && <GasCan x={900} y={ST - 60} w={130} special />}</>}
  </>;
};
const FiveFlags = ({t}: {t: number}) => <>
  {(['in', 'cn', 'tr', 'ae', 'sg'] as const).map((k, i) => t >= P(19) + 1.4 + i * 0.18 && <Flag key={k} kind={k} x={140 + i * 200} y={ST - 120 - (i % 2) * 70} w={170} t={t} />)}
  <MoneySack x={540} y={ST - 260} w={260} label="$42B" />
</>;
const Laundry = ({t, clean}: {t: number; clean?: boolean}) => {
  const k = ((t - P(20)) * 0.9) % 1;
  return <>
    <Washer x={540} y={ST} w={400} t={t} money="dirty" />
    {!clean ? <Barrel x={lerp(60, 330, k)} y={ST} s={1.2} rot={k * 30} /> : <>
      <Barrel x={lerp(60, 330, k)} y={ST} s={1.1} />
      <div style={{position: 'absolute', left: 0, top: 0, filter: 'brightness(1.8) saturate(0.4)'}}><Barrel x={lerp(760, 1000, k)} y={ST} s={1.1} /></div>
      {[0, 1, 2].map((i) => <div key={i} style={{position: 'absolute', left: 820 + i * 60, top: ST - 260 - i * 40, fontSize: 60, transform: `scale(${0.7 + 0.3 * Math.sin(t * 8 + i)})`}}>✨</div>)}
    </>}
  </>;
};
const America = ({t, banned}: {t: number; banned?: boolean}) => <>
  <Isl src="usa" x={80} y={180 + DY} w={480} t={t} />
  <TrumpAt x={350} y={ST - 150} h={380} rot={banned ? Math.sin(t * 20) * 5 : Math.sin(t * 2) * 3} hop={banned ? 0 : Math.abs(Math.sin(t * 4)) * 10} emote={banned ? 'anger' : 'question'} t={t} />
  <Barrel x={720} y={ST - 60} s={1.6} />
  {banned && <svg width={260} height={260} style={{position: 'absolute', left: 590, top: ST - 330, overflow: 'visible'}}>
    <path d="M20 20 L240 240 M240 20 L20 240" stroke={RED} strokeWidth={30} strokeLinecap="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - ease((t - P(23) - 0.6) / 0.25)} /></svg>}
  {banned && <PriceTag x={760} y={ST - 520} price="2022" at={P(23) + 0.8} rot={-6} size={0.9} />}
</>;
const World = ({t}: {t: number}) => <>
  <Globe x={540} y={ST - 330} r={300} t={t} />
  <PriceTag x={830} y={ST - 600} price="1 price" at={P(24) + 0.4} rot={8} size={0.9} />
</>;
const Pump = ({t, pay}: {t: number; pay?: boolean}) => {
  const price = t < P(25) + 1.2 ? 3.1 : Math.min(4.2, 3.1 + (t - P(25) - 1.2) * 1.4);
  return <>
    <Glow x={540} y={ST - 280} r={340} />
    <div style={{position: 'absolute', left: 300, top: ST - 660, transform: 'scale(2)', transformOrigin: '0 0'}}><GasPump x={105} y={330} price={pay ? 4.2 : price} red={pay || price > 3.2} shake={0} /></div>
    {pay && [0, 1, 2].map((i) => { const f = fly(t, P(27) + i * 0.3, 0.6, 150, ST - 100, 520, ST - 400, 120); return f && <Bill key={i} x={f.x} y={f.y} w={120} rot={f.p * 300} />; })}
  </>;
};
const Picks = ({t}: {t: number}) => {
  const tilt = Math.sin(t * 3) * 8;
  return <>
    <Img src={staticFile('enemy-oil/scale.png')} style={{position: 'absolute', left: 540 - 230, top: ST - 520, width: 460, transform: `rotate(${tilt}deg)`, transformOrigin: '50% 95%'}} />
    <TrumpAt x={150} y={ST} h={320} rot={-4 + Math.sin(t * 5) * 3} emote="sweat" t={t} />
    <PutinAt x={950} y={ST} h={320} rot={4} hop={Math.abs(Math.sin(t * 9)) * 10} emote="laugh" t={t} />
  </>;
};

type Shot = {at: number; set: (t: number) => React.ReactNode; fx_?: Fx};
const SHOTS: Shot[] = [
  {at: P(1), set: (t) => <Three t={t} from={P(1)} />, fx_: 'pop'},
  {at: P(4), set: (t) => <ReasonCard t={t} n={1} at={P(4)} />, fx_: 'zoom'},
  {at: P(5), set: (t) => <Share t={t} />, fx_: 'swipe'},
  {at: P(6), set: (t) => <GasDeal t={t} />, fx_: 'swipeL'},
  {at: P(7), set: (t) => <GasDeal t={t} cold />, fx_: 'pop'},
  {at: P(9), set: (t) => <GasDeal t={t} tank />, fx_: 'swipe'},
  {at: P(10), set: (t) => <ReasonCard t={t} n={2} at={P(10)} />, fx_: 'zoom'},
  {at: P(11), set: (t) => <PriceBoom t={t} />, fx_: 'swipeL'},
  {at: P(12), set: (t) => <Paid t={t} />, fx_: 'swipe'},
  {at: P(13), set: (t) => <Paid t={t} ukraine />, fx_: 'pop'},
  {at: P(15), set: (t) => <BackDoor t={t} />, fx_: 'zoom'},
  {at: P(16), set: (t) => <ToIndia t={t} />, fx_: 'swipe'},
  {at: P(17), set: (t) => <Diesel t={t} />, fx_: 'swipeL'},
  {at: P(18), set: (t) => <Diesel t={t} toEU />, fx_: 'pop'},
  {at: P(19), set: (t) => <FiveFlags t={t} />, fx_: 'swipe'},
  {at: P(20), set: (t) => <Laundry t={t} />, fx_: 'iris'},
  {at: P(21), set: (t) => <Laundry t={t} clean />, fx_: 'pop'},
  {at: P(22), set: (t) => <America t={t} />, fx_: 'swipeL'},
  {at: P(23), set: (t) => <America t={t} banned />, fx_: 'pop'},
  {at: P(24), set: (t) => <World t={t} />, fx_: 'iris'},
  {at: P(25), set: (t) => <Pump t={t} />, fx_: 'swipe'},
  {at: P(27), set: (t) => <Pump t={t} pay />, fx_: 'pop'},
  {at: P(28), set: (t) => <Picks t={t} />, fx_: 'zoom'},
  {at: P(29), set: (t) => <Three t={t} from={P(29)} labels={['1', '2', '3']} />, fx_: 'pop'},
];

// ---------- the two on the bottom: Doug explains, the naive Puffin asks ----------
type DPose = 'count' | 'explain' | 'point' | 'shrug' | 'sad' | 'angry' | 'happy' | 'shock' | 'smug';
const DOUG_POSE: Record<number, DPose> = {1: 'count', 3: 'happy', 4: 'point', 5: 'explain', 6: 'shrug', 7: 'sad', 9: 'angry', 10: 'count', 11: 'happy', 12: 'point', 13: 'explain',
  15: 'count', 16: 'point', 17: 'explain', 18: 'point', 19: 'shock', 20: 'smug', 21: 'happy', 23: 'angry', 24: 'explain', 25: 'point', 27: 'shrug', 28: 'smug', 29: 'happy'};
const PUFFIN_REACT: Record<number, EmoteKind> = {1: 'question', 5: 'shock', 7: 'sweat', 12: 'shock', 13: 'shock', 19: 'shock', 21: 'question', 25: 'sweat', 27: 'sweat', 28: 'question'};
const Duo = ({t, li}: {t: number; li: number}) => {
  const asks = EP[li]?.voice === 'am_liam' || DOUG_LINES.includes(li);
  const lt = li >= 0 ? t - EP[li].start : 0, kick = 1 + 0.04 * Math.exp(-lt * 8); // small punch on every new line
  const ps: DPose = asks ? 'explain' : DOUG_POSE[li] ?? 'explain';
  const osc = Math.sin(t * 7), dm = asks ? 0 : talk(t, [[EP[li].start, EP[li].end]]);
  const pose = asks ? {turn: 0.5, look: [0.9, -0.1] as [number, number], flapL: 15, flapR: 25, brows: 'none' as const}
    : ps === 'count' ? {flapR: 160, flapL: 20, look: [0, 0] as [number, number], beak: 'smile' as const}
    : ps === 'point' ? {turn: -0.25, look: [-0.2, -0.9] as [number, number], flapL: 150 + osc * 6, flapR: 20}
    : ps === 'shrug' ? {flapL: 105, flapR: 105, brows: 'worried' as const, lids: 0.25}
    : ps === 'sad' ? {brows: 'worried' as const, beak: 'frown' as const, lids: 0.35, tremble: 1, flapL: 10, flapR: 10}
    : ps === 'angry' ? {brows: 'angry' as const, angry: 1, beak: 'frown' as const, flapL: 60 + osc * 30, flapR: 60 - osc * 30, tremble: 0.4}
    : ps === 'happy' ? {brows: 'happy' as const, beak: 'smile' as const, flapL: 120 + osc * 20, flapR: 120 - osc * 20, blush: 1}
    : ps === 'shock' ? {brows: 'shock' as const, eyeScale: 1.3, pupil: 0.6, flapL: 130, flapR: 130}
    : ps === 'smug' ? {lids: 0.45, beak: 'smile' as const, flapL: 40, flapR: 70, turn: 0.3}
    : {flapL: 60 + osc * 35, flapR: 60 - osc * 35, look: [0.1, 0] as [number, number]};
  const hop = (ps === 'happy' || ps === 'shock') && !asks ? Math.abs(Math.sin(t * 9)) * 22 : 0;
  const dx = asks ? 0 : (li % 3 - 1) * 30;
  // Puffin: asks with a "?" over the head, otherwise reacts to Doug
  const pm = asks ? talk(t, [[EP[li].start, EP[li].end]]) : 0, react = !asks ? PUFFIN_REACT[li] : undefined;
  const pHop = asks ? Math.abs(Math.sin(t * 6)) * 10 : react === 'shock' ? Math.abs(Math.sin(t * 10)) * 18 : 0;
  return <div style={{position: 'absolute', inset: 0, transform: `scale(${kick})`, transformOrigin: '540px 1880px'}}>
    <Penguin id="doug" x={320 + dx} y={1880 - hop} h={660} pose={{mouth: dm, ...pose}} />
    <Puffin id="puff" x={800} y={1880 - pHop} h={560} pose={{mouth: pm, look: asks ? -0.8 : react === 'shock' ? 0 : -0.6, flap: asks ? 40 + Math.sin(t * 8) * 25 : react === 'shock' ? 70 : 8, lids: react === 'sweat' ? 0.3 : 0, smirk: false}} />
    {(asks || react) && <Emote kind={asks ? 'question' : react!} x={890} y={1290 - pHop} t={t} s={1.3} />}
    {asks && li > 0 && <Emote kind="question" x={180 + dx} y={1220} t={t + 1} s={0.9} />}
  </div>;
};

// Every stage shot gets a new framing every ~1.7 s (wide / left / right / centre push) so nothing sits still.
const FRAMES = [{s: 1, x: 540}, {s: 1.15, x: 450}, {s: 1.15, x: 630}, {s: 1.1, x: 540}];
const REFRAMES: number[] = SHOTS.flatMap((sh, i) => { const end = SHOTS[i + 1]?.at ?? EP[EP.length - 1].end; const out: number[] = [];
  for (let c = sh.at + 1.7; c < end - 0.6; c += 1.7) out.push(c); return out; });
const KH = EP[0].end / 3.19; // the approved hook was timed to a 3.19 s line

export const DougEnemyOil = () => {
  const frame = useCurrentFrame(), t = onTwos(frame), tc = frame / FPS;
  const hook = tc < P(1);
  const sh = [...SHOTS].reverse().find((x) => tc >= x.at);
  const li = EP.findIndex((l, k) => tc >= l.start && tc < (EP[k + 1]?.start ?? 999));
  let s = 1, fx = 540;
  if (hook) { const h = tc / KH, toL = h >= T.rich && h < T.buying + 0.3 ? ease((h - T.rich) / 0.4) : 0, toR = h >= T.enemies - 0.4 ? ease((h - T.enemies + 0.4) / 0.4) : 0; s = 1 + 0.05 * (toL + toR); fx = 540 - 70 * toL + 70 * toR; }
  else if (sh) {
    const k = REFRAMES.filter((c) => c > sh.at && c <= tc).length, fr = FRAMES[k % FRAMES.length];
    const since = tc - Math.max(sh.at, ...REFRAMES.filter((c) => c <= tc && c > sh.at)), punch = ease(since / 0.18);
    const prev = FRAMES[(k + FRAMES.length - 1) % FRAMES.length];
    s = (k ? lerp(prev.s, fr.s, punch) : fr.s) * (1 + 0.015 * since); fx = k ? lerp(prev.x, fr.x, punch) : fr.x;
  }
  return <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
    <Fonts />
    {hook ? <AbsoluteFill style={{transform: `translate(${540 - fx * s}px, ${900 - 900 * s}px) scale(${s})`, transformOrigin: '0 0'}}><Hook t={t / KH} /></AbsoluteFill>
      : <AbsoluteFill style={cutFX(tc, SHOTS.map((x) => ({at: x.at, fx: x.fx_})))}>
        <AbsoluteFill style={{transform: `translate(${(540 - fx) * s}px, 0px) scale(${s})`, transformOrigin: `540px ${ST - 300}px`}}>{sh!.set(t)}</AbsoluteFill>
      </AbsoluteFill>}
    <EpWord t={tc} />
    <Duo t={t} li={li} />
    <Audio src={staticFile('doug-enemy-oil-voice.mp3')} />
    {/* SFX kept low under the voice */}
    <Sfx at={0} name="user-ting" vol={0.3} />
    <Sfx at={T.buying * KH} name="user-whoosh" vol={0.2} />
    <Sfx at={(T.buying + 0.5) * KH} name="user-cash-register" vol={0.2} />
    <Sfx at={T.enemies * KH} name="user-boom" vol={0.28} />
    {SHOTS.map((x, i) => <Sfx key={`w${i}`} at={x.at - 0.05} name="user-whoosh" vol={0.13} />)}
    {REFRAMES.map((c, i) => <Sfx key={`r${i}`} at={c - 0.04} name="user-whoosh" vol={0.07} />)}
    {EP.map((l, i) => l.voice === 'am_liam' && <Sfx key={`q${i}`} at={l.start} name="user-pop" vol={0.12} />)}
    <Sfx at={P(1) + 0.3} name="user-pop" vol={0.2} />
    {[4, 10, 15].map((i) => <Sfx key={i} at={P(i) + 0.4} name="user-ting" vol={0.25} />)}
    <Sfx at={P(7)} name="user-aww" vol={0.22} />
    <Sfx at={P(9) + 0.3} name="user-boom" vol={0.22} />
    <Sfx at={P(12) + 0.5} name="user-money-transfer" vol={0.22} />
    <Sfx at={P(14)} name="user-shock" vol={0.22} />
    <Sfx at={P(16) + 0.3} name="user-whoosh" vol={0.18} />
    <Sfx at={P(19) + 1.4} name="user-cash-register" vol={0.2} />
    <Sfx at={P(21)} name="user-wow" vol={0.2} />
    <Sfx at={P(23) + 0.6} name="user-wrong" vol={0.22} />
    <Sfx at={P(25) + 1.2} name="user-cash-register" vol={0.2} />
    <Sfx at={P(26)} name="user-fahh" vol={0.25} />
    <Sfx at={P(29)} name="user-pop" vol={0.2} />
  </AbsoluteFill>;
};
