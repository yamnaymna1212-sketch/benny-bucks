// Penguin-world money & everyday props (EP6+, user rule 2026-10-20): look like the REAL object at a glance, but every word,
// portrait, seal or brand is replaced by fish. Bill = real US-note layout (corner numbers, centre oval, emblem) with a fish in the oval.
// World = soft snowy backdrop so a shot is never an empty white page.
import React from 'react';
import {INK} from './rig';

const FISH_D = 'M-30 0 Q0 -26 26 0 Q0 26 -30 0 Z M26 0 L44 -16 L44 16 Z';
export const MiniFish = ({x, y, s = 1, color = '#5EC4FA', flip}: {x: number; y: number; s?: number; color?: string; flip?: boolean}) =>
  <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}><path d={FISH_D} fill={color} stroke={INK} strokeWidth={5 / s > 8 ? 8 : 5} strokeLinejoin="round" /><circle cx={-14} cy={-4} r={4} fill={INK} /></g>;

// ---------- money: realistic note layout, no words ----------
export const Note = ({w = 300, value = 50}: {w?: number; value?: number}) => {
  const G1 = '#2F5A3A', PAPER = '#E4ECD9', id = `nt${value}`;
  return <svg width={w} height={w * 0.425} viewBox="0 0 470 200" style={{display: 'block', overflow: 'visible'}}>
    <defs><linearGradient id={id} x1="0" x2="1"><stop offset="0" stopColor="#DCE7CF" /><stop offset="0.5" stopColor={PAPER} /><stop offset="1" stopColor="#D5E2C6" /></linearGradient></defs>
    <rect x={3} y={3} width={464} height={194} rx={8} fill={`url(#${id})`} stroke={INK} strokeWidth={6} />
    {/* fine guilloche lines */}
    {Array.from({length: 9}, (_, i) => <path key={i} d={`M14 ${30 + i * 18} Q120 ${18 + i * 18} 235 ${30 + i * 18} T456 ${30 + i * 18}`} fill="none" stroke="#B9CBA9" strokeWidth={1.6} />)}
    <rect x={14} y={14} width={442} height={172} rx={6} fill="none" stroke={G1} strokeWidth={4} />
    <rect x={22} y={22} width={426} height={156} rx={4} fill="none" stroke={G1} strokeWidth={1.6} strokeDasharray="3 4" />
    {/* corner numbers */}
    {[[44, 50], [426, 50], [44, 172], [426, 172]].map(([cx, cy], i) =>
      <text key={i} x={cx} y={cy} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill={G1}>{value}</text>)}
    {/* centre oval with the fish "portrait" */}
    <ellipse cx={235} cy={100} rx={64} ry={74} fill="#D3E0C4" stroke={G1} strokeWidth={4} />
    <ellipse cx={235} cy={100} rx={54} ry={64} fill="none" stroke={G1} strokeWidth={1.5} />
    <MiniFish x={232} y={100} s={1.25} />
    {/* left emblem (fish seal) + right big number */}
    <circle cx={110} cy={100} r={34} fill="none" stroke={G1} strokeWidth={4} strokeDasharray="4 3" />
    <MiniFish x={110} y={100} s={0.6} color="#7FB38A" />
    <text x={360} y={126} textAnchor="middle" fontFamily="Montserrat" fontWeight={900} fontSize={78} fill={G1} opacity={0.85}>{value}</text>
  </svg>;
};

// ---------- bank card: real card layout (chip, contactless, embossed number), fish network logo ----------
export const BankCard = ({w = 260, kind}: {w?: number; kind: 'debit' | 'credit'}) => {
  const id = `bc${kind}`, [c1, c2] = kind === 'debit' ? ['#1E6E8C', '#46B3D6'] : ['#B5850E', '#F4CF5A'];
  return <svg width={w} height={w * 0.63} viewBox="0 0 400 252" style={{display: 'block', overflow: 'visible'}}>
    <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={c1} /><stop offset="1" stopColor={c2} /></linearGradient>
      <linearGradient id={`${id}c`} x1="0" x2="1"><stop offset="0" stopColor="#E9C66A" /><stop offset="1" stopColor="#C99A2E" /></linearGradient></defs>
    <rect x={3} y={3} width={394} height={246} rx={22} fill={`url(#${id})`} stroke={INK} strokeWidth={7} />
    <path d="M3 170 Q200 120 397 180 L397 226 Q397 249 374 249 L26 249 Q3 249 3 226 Z" fill="#fff" opacity={0.12} />
    <rect x={40} y={82} width={64} height={50} rx={9} fill={`url(#${id}c)`} stroke={INK} strokeWidth={4} />
    <path d="M40 107 L104 107 M62 82 L62 132 M82 82 L82 132" stroke="#8A6A1E" strokeWidth={2.5} />
    {[0, 1, 2].map((i) => <path key={i} d={`M${126 + i * 11} ${92 - i * 4} Q${134 + i * 13} 107 ${126 + i * 11} ${122 + i * 4}`} fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" />)}
    <text x={40} y={182} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={30} fill="#fff" stroke="rgba(0,0,0,0.35)" strokeWidth={1}>5050 •••• •••• 1234</text>
    <text x={370} y={52} textAnchor="end" fontFamily="Montserrat" fontWeight={900} fontSize={30} fill="#fff" stroke={INK} strokeWidth={1.5}>{kind.toUpperCase()}</text>
    {/* fish network logo: two overlapping circles, a fish in each */}
    <circle cx={318} cy={212} r={24} fill="#5EC4FA" stroke={INK} strokeWidth={3} /><circle cx={348} cy={212} r={24} fill="#F7E9A8" stroke={INK} strokeWidth={3} opacity={0.95} />
    <MiniFish x={316} y={212} s={0.38} color="#fff" /><MiniFish x={350} y={212} s={0.38} color="#5EC4FA" flip />
  </svg>;
};

// ---------- phone banking app (Fish Bank) ----------
export const Phone = ({w = 300, balance, color = INK, note = 'example', label = "Doug's account"}: {w?: number; balance: string; color?: string; note?: string; label?: string}) =>
  <div style={{width: w, height: w * 1.9, background: '#1D2228', border: `7px solid ${INK}`, borderRadius: w * 0.14, padding: w * 0.05, boxSizing: 'border-box', position: 'relative'}}>
    <div style={{position: 'absolute', left: '50%', top: w * 0.035, width: w * 0.28, height: w * 0.05, transform: 'translateX(-50%)', background: '#000', borderRadius: 20}} />
    <div style={{width: '100%', height: '100%', background: '#F4FAFD', borderRadius: w * 0.09, overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
      <div style={{width: '100%', height: w * 0.32, background: '#2F5DA8', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: w * 0.03, paddingTop: w * 0.06, boxSizing: 'border-box'}}>
        <svg width={w * 0.18} height={w * 0.12} viewBox="-50 -30 100 60"><MiniFish x={0} y={0} s={1} /></svg>
        <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.085, color: '#fff'}}>FISH BANK</div>
      </div>
      <div style={{marginTop: w * 0.18, fontFamily: 'Montserrat', fontWeight: 700, fontSize: w * 0.075, color: '#5A6470'}}>{label}</div>
      <div style={{marginTop: w * 0.04, fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.25, color}}>{balance}</div>
      {note && <div style={{marginTop: w * 0.02, fontFamily: 'Montserrat', fontWeight: 600, fontSize: w * 0.06, color: '#8A949E'}}>({note})</div>}
      <div style={{marginTop: 'auto', marginBottom: w * 0.1, width: '70%', height: w * 0.16, borderRadius: w * 0.05, background: '#DDE9F2'}} />
    </div>
  </div>;

// ---------- wall calendar (rings, red header, day grid); month index picks the page ----------
const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
export const WallCalendar = ({w = 260, month = 0, mark}: {w?: number; month?: number; mark?: number}) =>
  <div style={{width: w, height: w * 1.05, background: '#fff', border: `7px solid ${INK}`, borderRadius: w * 0.07, position: 'relative', boxShadow: '6px 8px 0 rgba(0,0,0,0.12)'}}>
    {[0.3, 0.7].map((k) => <div key={k} style={{position: 'absolute', left: `${k * 100}%`, top: -w * 0.07, width: w * 0.06, height: w * 0.16, marginLeft: -w * 0.03, background: '#9AA4AD', border: `4px solid ${INK}`, borderRadius: 10}} />)}
    <div style={{height: w * 0.3, background: '#D83A2E', borderBottom: `6px solid ${INK}`, borderRadius: `${w * 0.05}px ${w * 0.05}px 0 0`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.17, color: '#fff'}}>{MONTHS[((month % 12) + 12) % 12]}</div>
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: w * 0.018, padding: w * 0.06}}>
      {Array.from({length: 28}, (_, i) => <div key={i} style={{height: w * 0.085, borderRadius: 4, background: i === mark ? '#D83A2E' : '#E3EAF0'}} />)}
    </div>
  </div>;

// ---------- real-looking red puffer jacket on a hanger (hood with fur trim, quilted puffs, zipper, sleeves) ----------
export const PufferJacket = ({w = 300, hanger = true}: {w?: number; hanger?: boolean}) => {
  const R = '#D83A2E', D = '#9E2419', L = '#F07263';
  return <svg width={w} height={w * 1.15} viewBox="0 0 300 345" style={{display: 'block', overflow: 'visible'}}>
    {hanger && <path d="M150 34 Q150 6 168 10 Q182 16 170 30 M150 34 L80 62 M150 34 L220 62" fill="none" stroke="#7A8590" strokeWidth={6} strokeLinecap="round" />}
    {/* sleeves */}
    {[-1, 1].map((sd) => <g key={sd} transform={`translate(150 0) scale(${sd} 1) translate(-150 0)`}>
      <path d="M78 78 Q30 96 22 180 L26 290 L68 294 L74 190 L92 150 Z" fill={R} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
      {[130, 180, 230].map((yy) => <path key={yy} d={`M${28 - (yy - 130) * 0.02} ${yy} Q48 ${yy + 10} 74 ${yy - 2}`} fill="none" stroke={D} strokeWidth={4} />)}
      <rect x={24} y={282} width={46} height={22} rx={6} fill={D} stroke={INK} strokeWidth={4} />
    </g>)}
    {/* body */}
    <path d="M86 66 Q150 52 214 66 L234 120 L232 322 Q150 336 68 322 L66 120 Z" fill={R} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {[118, 170, 222, 274].map((yy) => <g key={yy}><path d={`M68 ${yy} Q150 ${yy + 14} 232 ${yy}`} fill="none" stroke={D} strokeWidth={4.5} />
      <path d={`M84 ${yy - 22} Q150 ${yy - 12} 216 ${yy - 22}`} fill="none" stroke={L} strokeWidth={6} strokeLinecap="round" opacity={0.8} /></g>)}
    <path d="M150 64 L150 330" stroke="#C9C9C9" strokeWidth={7} strokeDasharray="5 5" /><path d="M150 64 L150 330" stroke={INK} strokeWidth={2} />
    <rect x={143} y={100} width={14} height={30} rx={5} fill="#C9C9C9" stroke={INK} strokeWidth={3} />
    {[[90, 236], [178, 236]].map(([px, py]) => <path key={px} d={`M${px} ${py} L${px + 32} ${py - 4}`} stroke={INK} strokeWidth={4} strokeLinecap="round" />)}
    <rect x={68} y={310} width={164} height={20} rx={6} fill={D} stroke={INK} strokeWidth={4} />
    {/* hood with fur trim */}
    <path d="M96 70 Q100 12 150 10 Q200 12 204 70 Q150 54 96 70 Z" fill={D} stroke={INK} strokeWidth={6} strokeLinejoin="round" />
    {Array.from({length: 13}, (_, i) => { const a = Math.PI * (1 - i / 12); return <circle key={i} cx={150 + Math.cos(a) * 58} cy={66 - Math.sin(a) * 50} r={13} fill="#F6F1E7" stroke={INK} strokeWidth={3} />; })}
  </svg>;
};

// coat rack (clothes rail on two feet)
export const Rack = ({x, y, w = 520, children}: {x: number; y: number; w?: number; children?: React.ReactNode}) =>
  <div style={{position: 'absolute', left: x - w / 2, top: y - 560, width: w, height: 560}}>
    <div style={{position: 'absolute', left: 0, top: 40, width: w, height: 16, background: '#8A949E', border: `5px solid ${INK}`, borderRadius: 10}} />
    <div style={{position: 'absolute', left: 14, top: 50, width: 16, height: 500, background: '#8A949E', border: `5px solid ${INK}`}} />
    <div style={{position: 'absolute', left: w - 30, top: 50, width: 16, height: 500, background: '#8A949E', border: `5px solid ${INK}`}} />
    {children}
  </div>;

// ---------- snowy backdrop: pale sky, distant mountains + igloos, slow snow; ground line at g ----------
export const World = ({g, t, snow = 14, night}: {g: number; t: number; snow?: number; night?: boolean}) => <>
  <div style={{position: 'absolute', left: -2000, top: -2000, width: 5080, height: 2000 + g, background: night ? '#232A33' : 'linear-gradient(#DDF0FA, #F4FAFD 70%)'}} />
  <svg width={1080} height={520} viewBox="0 0 1080 520" style={{position: 'absolute', left: 0, top: g - 520, overflow: 'visible'}}>
    <path d="M-400 520 L-120 250 L60 400 L250 170 L470 390 L640 230 L860 410 L1010 260 L1480 520 Z" fill={night ? '#2E3844' : '#CFE6F3'} />
    <path d="M250 170 L205 225 L232 215 L255 238 L280 212 L300 222 Z M640 230 L605 272 L630 264 L650 282 L668 262 L684 270 Z M1010 260 L978 298 L1000 292 L1018 306 L1036 290 L1050 296 Z" fill={night ? '#3C4855' : '#fff'} />
    <path d="M-400 520 L-50 380 L200 470 L420 360 L700 470 L900 380 L1480 520 Z" fill={night ? '#34404D' : '#E2F1F9'} />
    {[[150, 0.32], [780, 0.26], [960, 0.3]].map(([x, s], i) => <g key={i} transform={`translate(${x} 520) scale(${s})`} opacity={night ? 0.5 : 0.7}>
      <path d="M-200 0 Q-190 -236 0 -240 Q190 -236 200 0 Z" fill={night ? '#46525F' : '#F4FAFD'} stroke={night ? '#56626F' : '#A9CFE3'} strokeWidth={8} />
      <path d="M-60 0 L-60 -66 Q0 -116 60 -66 L60 0 Z" fill={night ? '#2E3844' : '#A9CFE3'} /></g>)}
  </svg>
  <div style={{position: 'absolute', left: -2000, top: g - 10, width: 5080, height: 3000, background: night ? '#3A4652' : '#E4F4FC', borderTop: `6px solid ${INK}`}} />
  {Array.from({length: snow}, (_, i) => <div key={i} style={{position: 'absolute', left: (i * 173 + Math.sin(t + i) * 20) % 1080, top: ((i * 263 + t * 70) % (g + 100)) - 60,
    width: 12 + (i % 3) * 4, height: 12 + (i % 3) * 4, borderRadius: '50%', background: '#fff', border: '2px solid #B7DCEE', opacity: 0.9}} />)}
</>;
