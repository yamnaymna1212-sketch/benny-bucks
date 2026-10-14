// Notebook / pencil motion vocabulary: write-on text with a pencil, highlighter swipes, blueprint sketch boxes,
// flip calendars, stamps, outlined word captions. Times are absolute seconds.
import React from 'react';
import {AbsoluteFill, staticFile} from 'remotion';
import {evolvePath} from '@remotion/paths';
import {C, FONT, Z, pop, ramp, useT} from './engine';

export const HAND = 'Architects Daughter';
export const HandFont = () => <style>{`@font-face{font-family:'${HAND}';src:url(${staticFile('fonts/ArchitectsDaughter.ttf')})}`}</style>;

// White page with a faint grid (keeps the clean white look).
export const GridPaper = () => (
  <AbsoluteFill style={{background: '#FFFFFF', backgroundImage:
    'linear-gradient(#EEF1F4 2px, transparent 2px), linear-gradient(90deg, #EEF1F4 2px, transparent 2px)', backgroundSize: '54px 54px'}} />
);

export const Pencil = ({w = 150}: {w?: number}) => (
  <svg width={w} height={w} viewBox="0 0 100 100" style={{overflow: 'visible'}}>
    <g transform="rotate(-50 0 0)">
      <path d="M0 0 L10 -5 L10 5 Z" fill="#3B3B3B" /><path d="M10 -5 L22 -9 L22 9 L10 5 Z" fill="#F3D9B1" stroke={C.ink} strokeWidth={2} />
      <rect x="22" y="-9" width="62" height="18" fill={C.yellow} stroke={C.ink} strokeWidth={2} /><rect x="84" y="-9" width="8" height="18" fill="#B9B9B9" stroke={C.ink} strokeWidth={2} />
      <rect x="92" y="-9" width="12" height="18" rx="3" fill="#F2A0A8" stroke={C.ink} strokeWidth={2} />
    </g>
  </svg>
);

// Handwritten text revealed left→right with a pencil riding the edge.
export const Write = ({text, x, y, at, until, dur = 0.8, size = 90, color = C.ink, pencil = true, highlight, under}: {
  text: string; x: number; y: number; at: number; until?: number; dur?: number; size?: number; color?: string; pencil?: boolean; highlight?: string; under?: string;
}) => {
  const t = useT();
  if (t < at || (until !== undefined && t >= until)) return null;
  const p = ramp(t, at, at + dur);
  const hp = highlight ? ramp(t, at + dur, at + dur + 0.25) : 0;
  const up = under ? ramp(t, at + dur, at + dur + 0.3) : 0;
  return <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)'}}>
    <div style={{position: 'relative', display: 'inline-block', padding: '0 14px'}}>
      {highlight && <div style={{position: 'absolute', left: 0, top: '12%', height: '80%', width: '100%', background: highlight, opacity: 0.55,
        transform: `scaleX(${hp}) rotate(-1deg)`, transformOrigin: 'left center', borderRadius: 6}} />}
      <div style={{position: 'relative', fontFamily: HAND, fontSize: size, color, whiteSpace: 'nowrap', lineHeight: 1.15, clipPath: `inset(-20% ${(1 - p) * 100}% -20% 0)`}}>{text}</div>
      {under && <div style={{position: 'absolute', left: 0, bottom: -4, height: 7, width: '100%', background: under, borderRadius: 4, transform: `scaleX(${up})`, transformOrigin: 'left'}} />}
      {pencil && p > 0 && p < 1 && <div style={{position: 'absolute', left: `${p * 100}%`, top: '78%'}}><Pencil w={size * 1.3} /></div>}
    </div>
  </div>;
};

// Blueprint box: construction lines overshoot the corners, then the fill wipes in with pencil hatching.
export const SketchBox = ({x, y, w, h, at, until, fill = '#FFFFFF', children, drawDur = 0.45}: {x: number; y: number; w: number; h: number; at: number; until?: number; fill?: string; children?: React.ReactNode; drawDur?: number}) => {
  const t = useT();
  if (t < at || (until !== undefined && t >= until)) return null;
  const o = 22, l = x - w / 2, tp = y - h / 2;
  const lines = [`M ${l - o} ${tp} L ${l + w + o} ${tp}`, `M ${l + w} ${tp - o} L ${l + w} ${tp + h + o}`, `M ${l + w + o} ${tp + h} L ${l - o} ${tp + h}`, `M ${l} ${tp + h + o} L ${l} ${tp - o}`];
  const fp = ramp(t, at + drawDur, at + drawDur + 0.3);
  const cp = ramp(t, at + drawDur + 0.15, at + drawDur + 0.45);
  return <>
    <div style={{position: 'absolute', left: l, top: tp, width: w, height: h, background: fill, clipPath: `inset(0 0 ${(1 - fp) * 100}% 0)`,
      backgroundImage: 'repeating-linear-gradient(45deg, rgba(0,0,0,0.05) 0 2px, transparent 2px 9px)'}} />
    <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
      {lines.map((d, i) => { const e = evolvePath(ramp(t, at + i * drawDur / 4, at + (i + 1) * drawDur / 4), d);
        return <path key={i} d={d} stroke={C.ink} strokeWidth={5} strokeLinecap="round" fill="none" strokeDasharray={e.strokeDasharray} strokeDashoffset={e.strokeDashoffset} />; })}
    </svg>
    <div style={{position: 'absolute', left: x, top: y, transform: 'translate(-50%,-50%)', opacity: cp}}>{children}</div>
  </>;
};

// Calendar card whose page flips each time the value changes. items: [time, value]
export const FlipCal = ({x, y, w = 360, label, items, color = C.red}: {x: number; y: number; w?: number; label: string; items: [number, string][]; color?: string}) => {
  const t = useT();
  let i = -1;
  items.forEach((it, k) => { if (t >= it[0]) i = k; });
  if (i < 0) return null;
  const flip = ramp(t, items[i][0], items[i][0] + 0.28);
  const prev = i > 0 ? items[i - 1][1] : null;
  const h = w * 0.95;
  const page = (v: string, rot: number) => <div style={{position: 'absolute', left: 0, top: h * 0.25, width: w, height: h * 0.75, background: '#fff', border: `5px solid ${C.ink}`, borderTop: 0, boxSizing: 'border-box',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: HAND, fontSize: w * 0.3, color: C.ink, transformOrigin: 'top center', transform: `perspective(800px) rotateX(${rot}deg)`, backfaceVisibility: 'hidden'}}>{v}</div>;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: `scale(${pop(t, items[0][0])})`}}>
    <div style={{position: 'absolute', inset: 0, background: '#fff', border: `5px solid ${C.ink}`}} />
    <div style={{position: 'absolute', left: 0, top: 0, width: w, height: h * 0.25, background: color, border: `5px solid ${C.ink}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: HAND, fontSize: w * 0.13, color: '#fff'}}>{label}</div>
    {[0.3, 0.7].map((f) => <div key={f} style={{position: 'absolute', left: w * f - 14, top: -16, width: 28, height: 28, borderRadius: 14, border: `5px solid ${C.ink}`, background: '#fff'}} />)}
    {prev !== null && flip < 1 && page(prev, -flip * 90)}
    {page(items[i][1], prev !== null ? 90 - flip * 90 : 0)}
  </div>;
};

// Rubber stamp that slams down.
export const Stamp = ({x, y, at, text = 'APPROVED', color = C.red, size = 80, rot = -12}: {x: number; y: number; at: number; text?: string; color?: string; size?: number; rot?: number}) => {
  const t = useT();
  if (t < at) return null;
  const p = ramp(t, at, at + 0.14);
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${2.2 - 1.2 * p})`, opacity: p,
    border: `8px double ${color}`, padding: '4px 22px', fontFamily: HAND, fontSize: size, color, letterSpacing: 4}}>{text}</div>;
};

// Word captions: white fill + thick black outline (TikTok style), static, low-middle.
export const OutlineCaptions = ({lines, y = Z.wordY, end, size = 84}: {lines: {text: string; start: number; end: number}[]; y?: number; end: number; size?: number}) => {
  const t = useT();
  if (t >= end) return null;
  const line = lines.find((l) => t >= l.start - 0.05 && t <= l.end + 0.3);
  if (!line) return null;
  const ws = line.text.split(' ');
  let idx = 0, cur = '';
  for (const raw of ws) {
    const i = line.text.indexOf(raw, idx); idx = i + raw.length;
    if (t >= line.start + (line.end - line.start) * (i / line.text.length)) cur = raw;
  }
  if (!cur) return null;
  return <div style={{position: 'absolute', left: 540, top: y, transform: 'translate(-50%,-50%)', fontFamily: FONT, fontWeight: 900, fontSize: size, color: '#fff',
    WebkitTextStroke: `${size * 0.16}px ${C.ink}`, paintOrder: 'stroke fill', textTransform: 'uppercase', whiteSpace: 'nowrap'}}>{cur}</div>;
};
