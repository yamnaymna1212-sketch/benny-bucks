// Night look v3 (user, 2026-10-26): ONLY the backdrop changes — dark indigo gradient + grid + stars (ref: user's
// "Le Brief" screenshots) and glass info cards for numbers. Rig, cast, montage, zooms, captions, SFX stay as before.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {FPS} from '../base';

export const N_GREEN = '#3DFF9A', N_RED = '#FF5A4E', N_BLUE = '#8FB8FF';
const SANS = 'Montserrat';

const STARS = Array.from({length: 80}, (_, i) => ({x: (i * 137.5) % 1080, y: (i * 271.3) % 1920, r: 1.2 + (i % 3), o: 0.25 + ((i * 7) % 5) / 10, p: i * 1.7}));

// Full-frame backdrop (put it OUTSIDE the camera transform so zooms move the scene, not the sky).
export const NightBg = () => {
  const t = useCurrentFrame() / FPS;
  return <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 32%, #3E42AE 0%, #252C80 38%, #17337C 66%, #135A74 100%)'}}>
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.07) 2px, transparent 2px)', backgroundSize: '90px 90px', backgroundPosition: `0 ${(t * 12) % 90}px`}} />
    <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
      {STARS.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity={d.o * (0.7 + 0.3 * Math.sin(t * 2 + d.p))} />)}
    </svg>
  </AbsoluteFill>;
};

// Ice floor that glows softly on the dark sky (replaces the light Ground strip).
export const NightGround = ({y}: {y: number}) =>
  <div style={{position: 'absolute', left: -400, right: -400, top: y, height: 900, background: 'linear-gradient(180deg, rgba(150,200,255,0.30), rgba(150,200,255,0.06))', borderTop: '5px solid rgba(220,235,255,0.85)', boxShadow: '0 -10px 40px rgba(120,170,255,0.35)'}} />;

export const GlassCard = ({x, y, w, h, children}: {x: number; y: number; w: number; h: number; children?: React.ReactNode}) =>
  <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 34, background: 'linear-gradient(160deg, rgba(44,52,128,0.88), rgba(20,28,82,0.88))',
    border: '3px solid rgba(170,195,255,0.5)', boxShadow: '0 0 44px rgba(90,140,255,0.35), inset 0 0 30px rgba(120,160,255,0.12)'}}>{children}</div>;

export const Pill = ({x, y, text, color = '#fff'}: {x: number; y: number; text: string; color?: string}) =>
  <div style={{position: 'absolute', left: x, top: y, padding: '10px 28px', borderRadius: 34, background: 'rgba(40,50,112,0.92)', border: '2px solid rgba(205,222,255,0.65)', color, fontFamily: SANS, fontWeight: 800, fontSize: 40, whiteSpace: 'nowrap'}}>{text}</div>;

// Glowing progress ring (e.g. "80%"); pct animates from 0 after `at`.
export const Ring = ({x, y, pct, at = -99, color = N_GREEN, size = 300}: {x: number; y: number; pct: number; at?: number; color?: string; size?: number}) => {
  const t = useCurrentFrame() / FPS, k = Math.max(0, Math.min(1, (t - at) / 0.8)), v = pct * (1 - (1 - k) ** 3), r = size * 0.37, c = 2 * Math.PI * r;
  return <svg width={size} height={size} style={{position: 'absolute', left: x - size / 2, top: y - size / 2, overflow: 'visible'}}>
    <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.13)" strokeWidth={size * 0.075} fill="none" />
    <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={size * 0.075} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v)} transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{filter: `drop-shadow(0 0 12px ${color})`}} />
    <text x={size / 2} y={size / 2 + size * 0.09} textAnchor="middle" fill="#fff" fontFamily={SANS} fontWeight={900} fontSize={size * 0.26}>{Math.round(v * 100)}%</text>
  </svg>;
};

// ONE number per scene: big glowing figure + short label + optional source line (credibility rule).
export const NumberCard = ({x, y, w = 760, value, label, source, at = -99, color = N_GREEN}: {x: number; y: number; w?: number; value: string; label: string; source?: string; at?: number; color?: string}) => {
  const t = useCurrentFrame() / FPS, d = t - at, p = d < 0 ? 0 : d < 0.18 ? 1.12 * (d / 0.18) : 1.12 - 0.12 * Math.min(1, (d - 0.18) / 0.12);
  if (p <= 0) return null;
  return <div style={{position: 'absolute', left: x - w / 2, top: y, width: w, transform: `scale(${p})`, transformOrigin: '50% 0'}}>
    <GlassCard x={0} y={0} w={w} h={source ? 330 : 290}>
      <div style={{position: 'absolute', left: 0, right: 0, top: 26, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 150, lineHeight: 1, color, textShadow: `0 0 24px ${color}88`}}>{value}</div>
      <div style={{position: 'absolute', left: 0, right: 0, top: 196, textAlign: 'center', fontFamily: SANS, fontWeight: 800, fontSize: 48, color: '#fff', letterSpacing: 2}}>{label}</div>
      {source && <div style={{position: 'absolute', left: 0, right: 0, top: 270, textAlign: 'center', fontFamily: SANS, fontWeight: 600, fontSize: 26, color: 'rgba(220,230,255,0.7)'}}>source: {source}</div>}
    </GlassCard>
  </div>;
};

// Series badge, top-left, every frame (follow/return rule): "DOUG PAYS · EP. 1"
export const SeriesBadge = ({ep}: {ep: number}) =>
  <div style={{position: 'absolute', left: 40, top: 70, padding: '8px 22px', borderRadius: 26, background: 'rgba(20,26,80,0.85)', border: '2px solid rgba(205,222,255,0.6)', fontFamily: SANS, fontWeight: 900, fontSize: 34, color: '#fff', letterSpacing: 1}}>
    🐧 DOUG PAYS · <span style={{color: N_GREEN}}>EP. {ep}</span>
  </div>;
