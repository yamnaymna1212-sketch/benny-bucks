// Free, local replacement for the Gemini collage stills + Omni "assemble" clips (no API key).
// Paper-cutout look in pure CSS/SVG: flat color field + grain, torn split, halftone cut-outs, cream keylines,
// soft paper shadows, and fast (~0.25s) slide-and-snap assembly. Times are absolute seconds.
import React from 'react';
import {AbsoluteFill, Img, spring, staticFile} from 'remotion';
import {C, FPS, FONT, useT} from './engine';

export const CREAM = '#F6EEDC';
// Fast snap-in (about 0.25s) used by every collage entrance.
const snap = (t: number, at: number) => spring({frame: Math.round((t - at) * FPS), fps: FPS, config: {damping: 16, stiffness: 420, mass: 0.6}});
const STEP = 30; // full frame rate: snappy, no stop-motion lag
const stepT = (t: number) => Math.floor(t * STEP) / STEP;
const keyline = (k: number) => [[k, 0], [-k, 0], [0, k], [0, -k], [k * 0.7, k * 0.7], [-k * 0.7, k * 0.7], [k * 0.7, -k * 0.7], [-k * 0.7, -k * 0.7]]
  .map(([x, y]) => `drop-shadow(${x}px ${y}px 0 ${CREAM})`).join(' ') + ' drop-shadow(10px 14px 8px rgba(40,25,10,0.35))';

// Grain overlay (uncoated paper).
const Grain = ({o = 0.22}: {o?: number}) => (
  <svg width="100%" height="100%" style={{position: 'absolute', inset: 0, opacity: o, mixBlendMode: 'multiply'}}>
    <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" /><feColorMatrix type="saturate" values="0" /></filter>
    <rect width="100%" height="100%" filter="url(#grain)" />
  </svg>
);

export const Field = ({color}: {color: string}) => <AbsoluteFill style={{background: color}}><Grain /></AbsoluteFill>;

// Two color halves meeting at a torn paper edge; each half slides in at `at`.
export const TornSplit = ({left, right, at = 0, split = 540}: {left: string; right: string; at?: number; split?: number}) => {
  const t = stepT(useT());
  const p = snap(t, at);
  const pts = Array.from({length: 41}, (_, i) => `${split + (i % 2 ? 16 : -12) + ((i * 37) % 11) - 5},${i * 48}`).join(' L ');
  return <AbsoluteFill>
    <AbsoluteFill style={{transform: `translateX(${(1 - p) * -1080}px)`}}>
      <svg width={1080} height={1920} style={{position: 'absolute', filter: 'drop-shadow(6px 0 6px rgba(40,25,10,0.35))'}}>
        <path d={`M0,0 L ${pts} L0,1920 Z`} fill={left} />
        <path d={`M ${pts}`} fill="none" stroke={CREAM} strokeWidth={10} />
      </svg>
    </AbsoluteFill>
    <AbsoluteFill style={{transform: `translateX(${(1 - p) * 1080}px)`, zIndex: -1}}><Field color={right} /></AbsoluteFill>
    <AbsoluteFill style={{pointerEvents: 'none'}}><Grain o={0.18} /></AbsoluteFill>
  </AbsoluteFill>;
};

type From = 'left' | 'right' | 'top' | 'bottom' | 'pop';
// One paper cut-out. `src` = studio/public/gen/<src>.png cutout (Benny stays in color); `halftone` turns it into B&W dots.
export const Piece = ({x, y, w, at, until, from = 'bottom', rot = 0, src, halftone, children}: {
  x: number; y: number; w: number; at: number; until?: number; from?: From; rot?: number; src?: string; halftone?: boolean; children?: React.ReactNode;
}) => {
  const t = stepT(useT());
  if (t < at || (until !== undefined && t >= until)) return null;
  const p = snap(t, at);
  const d = (1 - p) * 600;
  const [dx, dy] = from === 'left' ? [-d, 0] : from === 'right' ? [d, 0] : from === 'top' ? [0, -d] : from === 'bottom' ? [0, d] : [0, 0];
  const s = from === 'pop' ? p : 1;
  const wob = Math.sin((t - at) * 14) * Math.exp(-(t - at) * 8); // little settle wiggle
  const url = src ? staticFile(`gen/${src}.png`) : '';
  return <div style={{position: 'absolute', left: x, top: y, width: 0, height: 0, transform: `translate(${dx}px,${dy}px) scale(${s}) rotate(${rot + wob}deg)`}}>
    <div style={{position: 'absolute', transform: 'translate(-50%,-50%)', filter: keyline(7)}}>
      {src ? <div style={{position: 'relative', width: w}}>
        <Img src={url} style={{width: w, display: 'block', filter: halftone ? 'grayscale(1) contrast(1.35)' : 'saturate(1.1)'}} />
        {halftone && <div style={{position: 'absolute', inset: 0, mixBlendMode: 'multiply', opacity: 0.55,
          background: 'radial-gradient(circle, #000 34%, transparent 38%) 0 0/9px 9px',
          WebkitMaskImage: `url(${url})`, WebkitMaskSize: '100% 100%', maskImage: `url(${url})`, maskSize: '100% 100%'}} />}
      </div> : <div style={{width: w}}>{children}</div>}
    </div>
  </div>;
};

// Colored cardstock label for prices/numbers (added at assembly, never baked into stills).
export const Card = ({text, color = C.gold, ink = C.ink, size = 120, ...m}: {text: string; color?: string; ink?: string; size?: number; x: number; y: number; at: number; until?: number; from?: From; rot?: number}) => (
  <Piece w={0} {...m}><div style={{display: 'inline-block', transform: 'translateX(-50%)', background: color, padding: '6px 34px', fontFamily: FONT, fontWeight: 900,
    fontSize: size, color: ink, whiteSpace: 'nowrap', letterSpacing: -2, boxShadow: 'inset 0 0 0 4px rgba(0,0,0,0.08)'}}>{text}</div></Piece>
);

// Simple cardstock flags.
export const FlagUS = ({w = 220}: {w?: number}) => (
  <svg width={w} height={w * 0.6} viewBox="0 0 190 114">
    <rect width="190" height="114" fill="#fff" />{Array.from({length: 7}, (_, i) => <rect key={i} y={i * 17.54} width="190" height="8.77" fill="#B22234" />)}
    <rect width="76" height="61" fill="#3C3B6E" />
    {Array.from({length: 12}, (_, i) => <circle key={i} cx={10 + (i % 4) * 18} cy={11 + Math.floor(i / 4) * 19} r={3.5} fill="#fff" />)}
  </svg>
);
export const FlagDE = ({w = 220}: {w?: number}) => (
  <svg width={w} height={w * 0.6} viewBox="0 0 5 3"><rect width="5" height="1" fill="#000" /><rect y="1" width="5" height="1" fill="#DD0000" /><rect y="2" width="5" height="1" fill="#FFCE00" /></svg>
);

export const COLLAGE_FPS = FPS;
