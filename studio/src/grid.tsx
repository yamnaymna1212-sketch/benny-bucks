// "Grid" style (from the user's reference video): white graph paper, moving Benny clips, big colored keywords,
// hand-drawn arrows, yellow highlighter banner, white price tags. Times are absolute seconds.
import React from 'react';
import {AbsoluteFill, Audio, Freeze, Loop, OffthreadVideo, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import {C, FPS, FONT, SFX_GAIN, useT} from './engine';
import {HOOK_STILL} from './collage';

const B = 700; // bleed so camera pans/zooms never reveal an edge
export const GridField = () => (
  <AbsoluteFill style={{top: -B, left: -B, right: -B, bottom: -B, width: 'auto', height: 'auto', background: '#FFFFFF',
    backgroundImage: 'linear-gradient(#E6EAEE 2px, transparent 2px), linear-gradient(90deg, #E6EAEE 2px, transparent 2px)', backgroundSize: '54px 54px', backgroundPosition: `${B % 54}px ${B % 54}px`}} />
);

const snap = (t: number, at: number) => spring({frame: Math.round((t - at) * FPS), fps: FPS, config: {damping: 18, stiffness: 650, mass: 0.5}});
// Scene-relative start frame for Sequences placed inside a <Scene>.
const useBase = () => { const frame = useCurrentFrame(); return useT() - frame / FPS; };
const Snd = ({at, name, vol, base}: {at: number; name: string; vol: number; base: number}) =>
  at > HOOK_STILL ? <Sequence from={Math.round((at - base) * FPS)} layout="none"><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * SFX_GAIN} /></Sequence> : null;

const CLIP_SEC = 4;
// Moving Benny (transparent WebM from tools/cutout_clips.sh). Shows from `at`; plays from `play` (defaults to at; before it the
// first frame is frozen, e.g. during the still hook). `from` = start offset inside the 4s clip. Loops if the shot is longer.
export const AnimBenny = ({clip, x, y, h = 1050, at, until, play, from = 0, flip}: {clip: string; x: number; y: number; h?: number; at: number; until?: number; play?: number; from?: number; flip?: boolean}) => {
  const t = useT(), base = useBase();
  if (t < at || (until !== undefined && t >= until)) return null;
  const p0 = play ?? at, w = h * 720 / 1280;
  const vid = <OffthreadVideo src={staticFile(`anim/benny-anim-${clip}.webm`)} transparent muted style={{width: w, height: h}} />;
  return <div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, transform: flip ? 'scaleX(-1)' : undefined}}>
    {t < p0 ? <Freeze frame={Math.round(from * FPS)}>{vid}</Freeze>
      : <Sequence from={Math.round((p0 - base) * FPS) - Math.round(from * FPS)} layout="none"><Loop durationInFrames={CLIP_SEC * FPS} layout="none">{vid}</Loop></Sequence>}
  </div>;
};

// Big colored keyword that pops in (e.g. "$208" green, "cheaper" red italic).
export const Word = ({text, x, y, at, until, color = C.red, size = 110, italic, rot = 0, stroke}: {text: string; x: number; y: number; at: number; until?: number; color?: string; size?: number; italic?: boolean; rot?: number; stroke?: boolean}) => {
  const t = useT(), base = useBase();
  if (t < at || (until !== undefined && t >= until)) return null;
  const s = snap(t, at);
  return <><Snd at={at} name="pop" vol={0.3} base={base} />
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${s})`, fontFamily: FONT, fontWeight: 900, fontStyle: italic ? 'italic' : 'normal',
      fontSize: size, color, whiteSpace: 'nowrap', letterSpacing: -1, WebkitTextStroke: stroke ? `${size * 0.1}px ${C.ink}` : undefined, paintOrder: 'stroke fill'}}>{text}</div></>;
};

// Yellow highlighter banner with black text and little "shout" dashes (the reference's "WHY").
export const Banner = ({text = 'WHY', x = 540, y = 150, at, until, size = 120}: {text?: string; x?: number; y?: number; at: number; until?: number; size?: number}) => {
  const t = useT();
  if (t < at || (until !== undefined && t >= until)) return null;
  const s = snap(t, at), w = text.length * size * 0.72 + 80;
  return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`}}>
    <svg width={w + 160} height={size * 1.5} viewBox={`0 0 ${w + 160} ${size * 1.5}`} style={{position: 'absolute', left: -(w + 160) / 2, top: -size * 0.75, overflow: 'visible'}}>
      <path d={`M80 ${size * 0.35} L${w + 70} ${size * 0.2} L${w + 85} ${size * 1.2} L70 ${size * 1.3} Z`} fill="#FFD43B" />
      {[[30, 0.3, 0, 0.45], [20, 0.75, -10, 0.75], [30, 1.2, 0, 1.05]].map(([a, b, c, d], i) => <line key={i} x1={a} y1={size * b} x2={60 + c} y2={size * d} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />)}
      {[[w + 100, 0.45, w + 130, 0.3], [w + 100, 0.75, w + 140, 0.75], [w + 100, 1.05, w + 130, 1.2]].map(([a, b, c, d], i) => <line key={`r${i}`} x1={a} y1={size * b} x2={c} y2={size * d} stroke={C.ink} strokeWidth={7} strokeLinecap="round" />)}
    </svg>
    <div style={{position: 'absolute', left: 0, top: 0, transform: 'translate(-50%,-50%)', fontFamily: FONT, fontWeight: 900, fontSize: size, color: C.ink, letterSpacing: 2, whiteSpace: 'nowrap'}}>{text}</div>
  </div>;
};

// White price tag with a black outline: big price + small unit line.
export const PriceTag = ({price, unit, x, y, at, until, size = 96, color = C.ink}: {price: string; unit?: string; x: number; y: number; at: number; until?: number; size?: number; color?: string}) => {
  const t = useT(), base = useBase();
  if (t < at || (until !== undefined && t >= until)) return null;
  const s = snap(t, at);
  return <><Snd at={at} name="cha-ching" vol={0.35} base={base} />
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${s})`, background: '#fff', border: `6px solid ${C.ink}`, borderRadius: 18,
      padding: '6px 26px 10px', textAlign: 'center', fontFamily: FONT, color, whiteSpace: 'nowrap', boxShadow: '4px 6px 0 rgba(0,0,0,0.12)'}}>
      <div style={{fontWeight: 900, fontSize: size, lineHeight: 1}}>{price}</div>
      {unit && <div style={{fontWeight: 800, fontSize: size * 0.24, letterSpacing: 1, color: C.ink}}>{unit}</div>}
    </div></>;
};

// Thin black contour around flat props so white shapes read on white paper (line-art look of the reference).
const INK_OUTLINE = [[3, 0], [-3, 0], [0, 3], [0, -3]].map(([a, b]) => `drop-shadow(${a}px ${b}px 0 #1A1A1A)`).join(' ');
// Any flat object (SVG prop / flag) that pops in with a soft paper sound — no keyline, no shadow (grid look).
export const Obj = ({x, y, at, until, rot = 0, children}: {x: number; y: number; at: number; until?: number; rot?: number; children: React.ReactNode}) => {
  const t = useT(), base = useBase();
  if (t < at || (until !== undefined && t >= until)) return null;
  return <><Snd at={at} name="flip" vol={0.2} base={base} />
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg) scale(${snap(t, at)})`, filter: INK_OUTLINE}}>{children}</div></>;
};
