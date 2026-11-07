import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import ep from './episode.json';

const INK = '#1a1a1c', RED = '#d6453d', YEL = '#fae62a';
const F = {fontFamily: 'PF, serif', color: INK} as React.CSSProperties;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.out(Easing.cubic);

export const Font = () => (
  <style>{`@font-face{font-family:PF;src:url(${staticFile('pf.ttf')});font-weight:400 900;}`}</style>
);

// paper background with slow camera push + jitter
export const Paper: React.FC<{dur: number; children: React.ReactNode; zoom?: number; bg?: string}> = ({dur, children, zoom = 0.05, bg = 'paper.png'}) => {
  const f = useCurrentFrame();
  const s = 1 + interpolate(f, [0, dur], [0, zoom], clamp);
  const jx = Math.sin(f / 5) * 1.2, jy = Math.cos(f / 6) * 1.2;
  return (
    <AbsoluteFill style={{background: '#ebe8de', overflow: 'hidden'}}>
      <AbsoluteFill style={{transform: `scale(${s}) translate(${jx}px,${jy}px)`}}>
        <Img src={staticFile(bg)} style={{width: 1920, height: 1080, objectFit: 'cover'}} />
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// highlighted keyword that wipes in like a marker
export const Hi: React.FC<{start: number; children: string}> = ({start, children}) => {
  const f = useCurrentFrame();
  const w = interpolate(f, [start, start + 14], [0, 100], {...clamp, easing: ease});
  return (
    <span style={{position: 'relative', display: 'inline-block'}}>
      <span style={{position: 'absolute', left: -10, top: '12%', height: '78%', width: `calc(${w}% + 20px)`, background: YEL, mixBlendMode: 'multiply', transform: 'rotate(-0.8deg)'}} />
      <span style={{position: 'relative'}}>{children}</span>
    </span>
  );
};

export const Words: React.FC<{text: string; start: number; size?: number; hi?: string}> = ({text, start, size = 60, hi}) => {
  const f = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div style={{...F, fontSize: size, fontWeight: 800, lineHeight: 1.2}}>
      {words.map((w, i) => {
        const t = start + i * 4;
        const o = interpolate(f, [t, t + 6], [0, 1], clamp);
        const y = interpolate(f, [t, t + 8], [14, 0], {...clamp, easing: ease});
        const isHi = hi && w.replace(/[.,]/g, '') === hi;
        return (
          <span key={i} style={{display: 'inline-block', opacity: o, transform: `translateY(${y}px)`, marginRight: 16}}>
            {isHi ? <Hi start={t + 4}>{w}</Hi> : w}
          </span>
        );
      })}
    </div>
  );
};

export const Tag: React.FC<{text: string; start: number; x: number; y: number; rot?: number}> = ({text, start, x, y, rot = -3}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame: f - start, fps, config: {damping: 12, stiffness: 160}});
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `rotate(${rot}deg) scale(${sp})`, background: '#f4f1e6', padding: '8px 22px', border: `3px solid ${INK}`, boxShadow: '6px 8px 0 rgba(0,0,0,.18)', fontFamily: 'Liberation Mono, monospace', fontWeight: 700, fontSize: 34, color: INK}}>
      {text}
    </div>
  );
};

export const Stamp: React.FC<{text: string; start: number; x: number; y: number}> = ({text, start, x, y}) => {
  const f = useCurrentFrame();
  const t = f - start;
  const s = interpolate(t, [0, 5], [2.6, 1], {...clamp, easing: ease});
  const o = interpolate(t, [0, 3], [0, 1], clamp);
  const shake = t > 5 && t < 12 ? Math.sin(t * 3) * 4 : 0;
  return (
    <div style={{position: 'absolute', left: x, top: y, opacity: o, transform: `rotate(-12deg) scale(${s}) translateX(${shake}px)`, border: `8px solid ${RED}`, color: RED, padding: '6px 28px', fontFamily: 'PF', fontWeight: 900, fontSize: 70, letterSpacing: 4, borderRadius: 8, mixBlendMode: 'multiply'}}>
      {text}
    </div>
  );
};

// on-screen citation chip — the "real sources" layer
export const Source: React.FC<{id: keyof typeof ep.sources; start: number}> = ({id, start}) => {
  const f = useCurrentFrame();
  const s = ep.sources[id];
  const x = interpolate(f, [start, start + 12], [-700, 0], {...clamp, easing: ease});
  return (
    <div style={{position: 'absolute', left: 60 + x, bottom: 56, background: INK, color: '#f4f1e6', padding: '14px 26px', fontFamily: 'Liberation Mono, monospace', fontSize: 25, lineHeight: 1.35, borderLeft: `10px solid ${RED}`}}>
      <div style={{fontWeight: 700}}>SOURCE · {s.pub}</div>
      <div style={{opacity: 0.8}}>{s.date} · {s.url}</div>
    </div>
  );
};

const Sticker: React.FC<{name: string; x: number; y: number; start: number; size?: number}> = ({name, x, y, start, size = 190}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame: f - start, fps, config: {damping: 10, stiffness: 140}});
  return <Img src={staticFile(`st_${name}.png`)} style={{position: 'absolute', left: x, top: y, width: size * 1.9, transform: `scale(${sp})`, filter: 'drop-shadow(8px 12px 10px rgba(0,0,0,.3))'}} />;
};

const Cutout: React.FC<{src: string; x: number; y: number; h: number; start: number; from?: 'left' | 'right'}> = ({src, x, y, h, start, from = 'right'}) => {
  const f = useCurrentFrame();
  const t = interpolate(f, [start, start + 16], [0, 1], {...clamp, easing: ease});
  const dx = (1 - t) * (from === 'right' ? 500 : -500);
  const bob = Math.sin(f / 18) * 4;
  return <Img src={staticFile(src)} style={{position: 'absolute', left: x + dx, top: y + bob, height: h, opacity: t, filter: 'drop-shadow(12px 16px 14px rgba(0,0,0,.35))', transform: 'rotate(1.5deg)'}} />;
};

const Counter: React.FC<{start: number; x: number; y: number}> = ({start, x, y}) => {
  const f = useCurrentFrame();
  const v = interpolate(f, [start, start + 45], [0, 1.5], {...clamp, easing: Easing.out(Easing.quad)});
  const done = f > start + 45;
  const pulse = done ? 1 + Math.max(0, 0.08 - (f - start - 45) * 0.004) : 1;
  return (
    <div style={{position: 'absolute', left: x, top: y, ...F, fontSize: 210, fontWeight: 900, transform: `scale(${pulse})`, transformOrigin: 'left'}}>
      <Hi start={start + 40}>{`$${v.toFixed(2)}B`}</Hi>
    </div>
  );
};

// hand-drawn arrow that draws itself
const Arrow: React.FC<{d: string; start: number; len?: number}> = ({d, start, len = 600}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [start, start + 20], [0, 1], {...clamp, easing: ease});
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      <path d={d} stroke={INK} strokeWidth={7} fill="none" strokeLinecap="round" strokeDasharray={`${len}`} strokeDashoffset={len * (1 - p)} />
      {p > 0.95 && <path d={d.split(' ').slice(-2).join(' ')} />}
    </svg>
  );
};

export const Fade: React.FC<{dur: number; children: React.ReactNode}> = ({dur, children}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [0, 6, dur - 6, dur], [0, 1, 1, 0], clamp);
  return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

export const Sfx: React.FC<{name: string; at: number; vol?: number}> = ({name, at, vol = 0.8}) => (
  <Sequence from={at}><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol} /></Sequence>
);

// ---------- scenes ----------
const S1 = () => (
  <Paper dur={150}>
    <Tag text="Feb 21, 2025" start={6} x={140} y={150} />
    <div style={{position: 'absolute', left: 140, top: 330, width: 1500}}>
      <Words text="The Largest Crypto Heist in History" start={18} size={110} hi="Heist" />
    </div>
    <div style={{position: 'absolute', left: 140, top: 700}}>
      <Words text="About $1.5 billion in digital assets, gone." start={70} size={54} />
    </div>
    <Source id="bloomberg" start={90} />
  </Paper>
);

const S2 = () => (
  <Paper dur={150}>
    <Tag text="Feb 26, 2025 — FBI statement" start={4} x={140} y={110} />
    <Counter start={10} x={140} y={260} />
    <div style={{position: 'absolute', left: 140, top: 560, width: 1000}}>
      <Words text="The FBI says North Korea was responsible." start={50} size={56} hi="North" />
    </div>
    <Cutout src="hood.png" x={1220} y={90} h={800} start={40} />
    <Tag text="TraderTraitor" start={70} x={1250} y={890} rot={4} />
    <Source id="fbi" start={60} />
  </Paper>
);

const S3 = () => (
  <Paper dur={150}>
    <div style={{position: 'absolute', left: 140, top: 90}}>
      <Words text="Where the money went" start={4} size={80} hi="money" />
    </div>
    <Sticker name="wallet" x={60} y={340} start={20} />
    <Sticker name="network" x={700} y={290} start={50} />
    <Sticker name="coins" x={1340} y={360} start={80} />
    <Arrow d="M 480 560 Q 580 470 690 540" start={36} />
    <Arrow d="M 1100 540 Q 1220 460 1330 560" start={66} />
    <Tag text="thousands of addresses" start={62} x={640} y={700} rot={-2} />
    <Tag text="Bitcoin + other assets" start={92} x={1230} y={760} rot={3} />
    <div style={{position: 'absolute', left: 140, top: 900}}>
      <Words text="Dispersed across multiple blockchains." start={96} size={44} />
    </div>
    <Source id="fbi" start={30} />
  </Paper>
);

const S4 = () => {
  const f = useCurrentFrame();
  return (
    <Paper dur={120}>
      <Cutout src="suit_halftone.png" x={160} y={130} h={780} start={4} from="left" />
      <div style={{position: 'absolute', left: 780, top: 220, width: 900}}>
        <Words text="Real people appear here — from a licensed photo library." start={14} size={64} hi="licensed" />
      </div>
      <Tag text="PHOTO SLOT · credit prints automatically" start={50} x={780} y={620} rot={-2} />
      <Stamp text="CONFIRMED" start={78} x={1080} y={760} />
      <div style={{position: 'absolute', left: 780, top: 760, ...F, fontSize: 34, opacity: interpolate(f, [60, 72], [0, 1], clamp)}}>Name · Role · Source line</div>
    </Paper>
  );
};

const S5 = () => (
  <Paper dur={120} zoom={0.08}>
    <div style={{position: 'absolute', left: 200, top: 340, width: 1520, textAlign: 'center'}}>
      <Words text="How safe is a billion dollars if one weak link can break it?" start={18} size={82} hi="weak" />
    </div>
  </Paper>
);

export const Episode: React.FC = () => {
  const cuts = [0, 150, 300, 450, 570];
  const durs = [150, 150, 150, 120, 90];
  const scenes = [S1, S2, S3, S4, S5];
  return (
    <AbsoluteFill>
      <Font />
      <Audio src={staticFile('sfx/drone.wav')} volume={0.28} />
      {scenes.map((S, i) => (
        <Sequence key={i} from={cuts[i]} durationInFrames={durs[i] + 6}>
          <Fade dur={durs[i] + 6}><S /></Fade>
          <Sfx name="whoosh" at={0} vol={0.5} />
        </Sequence>
      ))}
      <Sfx name="thud" at={78} />
      <Sfx name="tick" at={160} vol={0.5} /><Sfx name="tick" at={175} vol={0.5} /><Sfx name="tick" at={190} vol={0.5} />
      <Sfx name="thud" at={150 + 45 + 10} vol={0.9} />
      <Sfx name="thud" at={450 + 78} vol={1} />
    </AbsoluteFill>
  );
};
