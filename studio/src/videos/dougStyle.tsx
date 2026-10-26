// STYLE TEST (not an episode): dark indigo "American" look from the reference (glass cards, glow, grid, stars).
// Two still frames only: hook (frame 60) and card (frame 150). Nothing here is published.
import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Penguin, Seal} from '../penguin/rig';

const GREEN = '#3DFF9A';
const RED = '#FF4D4D';

const Stars = () => {
  const dots = Array.from({length: 70}, (_, i) => ({
    x: (i * 137.5) % 1080,
    y: (i * 271.3) % 1920,
    r: 1 + (i % 3),
    o: 0.25 + ((i * 7) % 5) / 10,
  }));
  return <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
    {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity={d.o} />)}
  </svg>;
};

const Background = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 35%, #3B3FA8 0%, #232A7A 35%, #15307A 65%, #14506E 100%)'}}>
    <AbsoluteFill style={{
      backgroundImage: 'linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)',
      backgroundSize: '90px 90px',
    }} />
    <Stars />
  </AbsoluteFill>
);

// Glass card with a glowing green outline, like the reference "combien ?" panel
const GlassCard = ({x, y, w, h, children}: {x: number; y: number; w: number; h: number; children?: React.ReactNode}) => (
  <div style={{
    position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: 34,
    background: 'linear-gradient(160deg, rgba(40,48,120,0.85), rgba(20,28,80,0.85))',
    border: '3px solid rgba(160,190,255,0.45)', boxShadow: '0 0 40px rgba(90,140,255,0.35), inset 0 0 30px rgba(120,160,255,0.12)',
  }}>{children}</div>
);

// Pill tag like "combien ?" / "ça dépend"
const Pill = ({x, y, text}: {x: number; y: number; text: string}) => (
  <div style={{
    position: 'absolute', left: x, top: y, padding: '10px 26px', borderRadius: 30,
    background: 'rgba(40,50,110,0.9)', border: '2px solid rgba(200,220,255,0.6)',
    color: '#fff', fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 42,
  }}>{text}</div>
);

const Ring = ({x, y, pct, color}: {x: number; y: number; pct: number; color: string}) => {
  const r = 110, c = 2 * Math.PI * r;
  return <svg width={300} height={300} style={{position: 'absolute', left: x, top: y}}>
    <circle cx={150} cy={150} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth={22} fill="none" />
    <circle cx={150} cy={150} r={r} stroke={color} strokeWidth={22} fill="none" strokeLinecap="round"
      strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 150 150)"
      style={{filter: `drop-shadow(0 0 12px ${color})`}} />
    <text x={150} y={170} textAnchor="middle" fill="#fff" fontFamily="Arial Black, Arial, sans-serif" fontWeight={900} fontSize={80}>{Math.round(pct * 100)}%</text>
  </svg>;
};

// HOOK still: "WHY DOES DOUG PAY DOUG?" with price cards
const HookFrame = () => (
  <AbsoluteFill>
    <Background />
    <Pill x={70} y={140} text="$ rent ?" />
    <Pill x={640} y={140} text="$ Doug ?" />
    <GlassCard x={60} y={300} w={960} h={460}>
      <div style={{position: 'absolute', left: 50, top: 40, fontFamily: 'Arial Black, Arial, sans-serif', fontWeight: 900, fontSize: 130, color: '#fff', lineHeight: 1}}>$2,000</div>
      <div style={{position: 'absolute', left: 50, top: 210, fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 52, color: RED}}>RENT / MONTH</div>
      <div style={{position: 'absolute', right: 50, top: 40, fontFamily: 'Arial Black, Arial, sans-serif', fontWeight: 900, fontSize: 130, color: GREEN}}>$0</div>
      <div style={{position: 'absolute', right: 50, top: 210, fontFamily: 'Arial, sans-serif', fontWeight: 700, fontSize: 52, color: GREEN}}>DOUG PAID</div>
    </GlassCard>
    <div style={{position: 'absolute', left: 0, right: 0, top: 830, textAlign: 'center', fontFamily: 'Arial Black, Arial, sans-serif', fontWeight: 900, fontSize: 112, color: '#fff', textShadow: '0 6px 0 rgba(0,0,0,0.25)'}}>
      WHY DOES DOUG<br />PAY DOUG?
    </div>
    <Penguin id="doug" x={540} y={1560} h={560} pose={{turn: 0.3, look: [0.6, -0.2], brows: 'worried', eyeScale: 1.1, beak: 'frown', flapR: 30, flapL: 30, sweat: true}} />
    <Seal id="seal" x={860} y={1640} h={300} />
  </AbsoluteFill>
);

// CARD still: a second frame with the glass-card look (rent % pill + ring)
const CardFrame = () => (
  <AbsoluteFill>
    <Background />
    <GlassCard x={60} y={160} w={960} h={520}>
      <Pill x={40} y={40} text="combien ?" />
      <Pill x={560} y={40} text="ça dépend" />
      <Ring x={60} y={130} pct={0.8} color={GREEN} />
      <div style={{position: 'absolute', left: 420, top: 170, fontFamily: 'Arial, sans-serif', fontWeight: 800, fontSize: 56, color: '#fff', lineHeight: 1.25}}>
        RENT TAKES<br /><span style={{color: GREEN}}>80%</span> OF<br />DOUG'S PAY
      </div>
    </GlassCard>
    <div style={{position: 'absolute', left: 0, right: 0, top: 760, textAlign: 'center', fontFamily: 'Arial Black, Arial, sans-serif', fontWeight: 900, fontSize: 120, color: '#fff'}}>
      DOUG RENT
    </div>
    <Penguin id="doug2" x={540} y={1560} h={560} pose={{turn: -0.3, look: [-0.6, -0.2], brows: 'sad', eyeScale: 1.15, beak: 'frown', flapR: 10, flapL: 10}} />
  </AbsoluteFill>
);

export const DougStyle = () => {
  const frame = useCurrentFrame();
  return frame < 90 ? <HookFrame /> : <CardFrame />;
};
