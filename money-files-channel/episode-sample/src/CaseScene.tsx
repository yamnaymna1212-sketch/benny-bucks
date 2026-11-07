import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing, random} from 'remotion';
import {Detective, DPose, C} from './Detective';

const IV = '#ede6d6', YEL = '#f2c230', RED = '#d6453d', INK = '#111317';
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const io = Easing.inOut(Easing.cubic);
const out = Easing.out(Easing.cubic);
const L = (f: number, a: number, b: number, x = 0, y = 1, e = io) => interpolate(f, [a, b], [x, y], {...clamp, easing: e});
const OS: React.CSSProperties = {fontFamily: 'OS, sans-serif', textTransform: 'uppercase', letterSpacing: 1};
const MONO: React.CSSProperties = {fontFamily: 'Liberation Mono, monospace', fontWeight: 700};

const Fonts = () => (
  <style>{`@font-face{font-family:OS;src:url(${staticFile('oswald.ttf')});font-weight:200 700;}
  @font-face{font-family:PF;src:url(${staticFile('pf.ttf')});font-weight:400 900;}`}</style>
);

// a beat = a block of content that enters, holds, then leaves
const Beat: React.FC<{from: number; to: number; children: React.ReactNode}> = ({from, to, children}) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f > to + 12) return null;
  const o = L(f, from, from + 8) * (1 - L(f, to, to + 10));
  const y = (1 - L(f, from, from + 12, 0, 1, out)) * 40 - L(f, to, to + 10) * 30;
  return <AbsoluteFill style={{opacity: o, transform: `translateY(${y}px)`}}>{children}</AbsoluteFill>;
};

const Pop: React.FC<{at: number; children: React.ReactNode; style?: React.CSSProperties}> = ({at, children, style}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - at, fps, config: {damping: 12, stiffness: 160}});
  return <div style={{position: 'absolute', transform: `scale(${s})`, ...style}}>{children}</div>;
};

const Bank: React.FC<{w?: number}> = ({w = 420}) => (
  <svg viewBox="0 0 420 340" width={w}>
    <polygon points="20,110 210,20 400,110" fill={IV} />
    <rect x={30} y={110} width={360} height={22} fill={IV} />
    {[0, 1, 2, 3, 4].map((i) => (
      <g key={i}>
        <rect x={52 + i * 70} y={140} width={38} height={150} fill={IV} />
        <rect x={46 + i * 70} y={136} width={50} height={10} fill="#cfc6b2" />
      </g>
    ))}
    <rect x={20} y={292} width={380} height={18} fill={IV} />
    <rect x={6} y={310} width={408} height={22} fill="#cfc6b2" />
    <circle cx={210} cy={78} r={18} fill="none" stroke={INK} strokeWidth={5} />
  </svg>
);

// stylised banknote — deliberately not a copy of any real currency design
const Bill: React.FC<{w?: number}> = ({w = 200}) => (
  <svg viewBox="0 0 200 90" width={w}>
    <rect x={1} y={1} width={198} height={88} rx={4} fill="#b9c7a3" stroke="#3b4a33" strokeWidth={2} />
    <rect x={8} y={8} width={184} height={74} rx={2} fill="none" stroke="#56684a" strokeWidth={2} strokeDasharray="4 3" />
    <ellipse cx={100} cy={45} rx={26} ry={30} fill="#d5dfc2" stroke="#3b4a33" strokeWidth={2} />
    <text x={100} y={57} textAnchor="middle" fontSize={34} fontFamily="PF" fontWeight={800} fill="#2e3a28">$</text>
    <text x={22} y={30} fontSize={16} fontFamily="OS" fill="#2e3a28">100</text>
    <text x={178} y={78} fontSize={16} fontFamily="OS" textAnchor="end" fill="#2e3a28">100</text>
  </svg>
);

const FlyingBills: React.FC<{at: number; from: [number, number]; to: [number, number]}> = ({at, from, to}) => {
  const f = useCurrentFrame();
  return (
    <>
      {Array.from({length: 14}).map((_, i) => {
        const t0 = at + i * 4;
        const t = L(f, t0, t0 + 34, 0, 1, Easing.inOut(Easing.quad));
        if (f < t0) return null;
        const jx = (random(`x${i}`) - 0.5) * 260, jy = (random(`y${i}`) - 0.5) * 260;
        const x = from[0] + (to[0] + jx - from[0]) * t;
        const y = from[1] + (to[1] + jy - from[1]) * t - Math.sin(t * Math.PI) * 220;
        const r = (random(`r${i}`) - 0.5) * 80 + t * 200 * (random(`s${i}`) > 0.5 ? 1 : -1);
        const o = 1 - L(f, t0 + 26, t0 + 36);
        return <div key={i} style={{position: 'absolute', left: x, top: y, transform: `rotate(${r}deg) scale(${0.8 - 0.3 * t})`, opacity: o, filter: 'drop-shadow(4px 6px 4px rgba(0,0,0,.4))'}}><Bill w={170} /></div>;
      })}
    </>
  );
};

const Counter: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const v = L(f, at, at + 48, 0, 1.5, Easing.out(Easing.quad));
  return <div style={{...OS, fontWeight: 700, fontSize: 210, color: YEL, lineHeight: 1}}>${v.toFixed(2)}B</div>;
};

const Network: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const N = 46;
  const nodes = Array.from({length: N}).map((_, i) => [random(`nx${i}`) * 820, random(`ny${i}`) * 520]);
  return (
    <svg width={860} height={560} style={{overflow: 'visible'}}>
      {nodes.map((p, i) => {
        const q = nodes[Math.floor(random(`l${i}`) * N)];
        const t = L(f, at + i * 1.2, at + i * 1.2 + 10);
        return <line key={'l' + i} x1={p[0]} y1={p[1]} x2={p[0] + (q[0] - p[0]) * t} y2={p[1] + (q[1] - p[1]) * t} stroke={IV} strokeWidth={1.6} opacity={0.45} />;
      })}
      {nodes.map((p, i) => {
        const s = L(f, at + i * 1.2, at + i * 1.2 + 6, 0, 1, out);
        return <circle key={'n' + i} cx={p[0]} cy={p[1]} r={(i % 7 === 0 ? 9 : 5) * s} fill={i % 7 === 0 ? YEL : IV} />;
      })}
    </svg>
  );
};

const SourceChip: React.FC<{at: number; a: string; b: string}> = ({at, a, b}) => {
  const f = useCurrentFrame();
  const x = L(f, at, at + 14, 760, 0, out);
  return (
    <div style={{position: 'absolute', right: 60 - x, bottom: 50, background: IV, color: INK, padding: '12px 24px', borderLeft: `10px solid ${RED}`, ...MONO, fontSize: 24, lineHeight: 1.4}}>
      <div>SOURCE · {a}</div><div style={{fontWeight: 400}}>{b}</div>
    </div>
  );
};

const Stamp: React.FC<{at: number; text: string}> = ({at, text}) => {
  const f = useCurrentFrame();
  const t = f - at;
  const s = L(t, 0, 5, 2.4, 1, out);
  return <div style={{opacity: t < 0 ? 0 : 1, transform: `rotate(-11deg) scale(${s})`, border: `7px solid ${RED}`, color: RED, padding: '4px 22px', ...OS, fontWeight: 700, fontSize: 58, mixBlendMode: 'screen'}}>{text}</div>;
};

const FBIDoc: React.FC<{at: number}> = ({at}) => {
  const f = useCurrentFrame();
  const hw = L(f, at + 22, at + 40, 0, 100, out);
  return (
    <div style={{width: 640, background: '#f6f2e7', color: INK, padding: '34px 40px', boxShadow: '14px 18px 0 rgba(0,0,0,.35)', transform: 'rotate(-2deg)'}}>
      <div style={{...MONO, fontSize: 22, borderBottom: `3px solid ${INK}`, paddingBottom: 10}}>FEDERAL BUREAU OF INVESTIGATION</div>
      <div style={{...MONO, fontWeight: 400, fontSize: 20, marginTop: 10}}>Public Service Announcement · I-022625-PSA</div>
      <div style={{...MONO, fontWeight: 400, fontSize: 20}}>February 26, 2025</div>
      <div style={{fontFamily: 'PF', fontWeight: 700, fontSize: 34, lineHeight: 1.3, marginTop: 26, position: 'relative'}}>
        <span style={{position: 'absolute', left: -6, top: 4, height: '92%', width: `${hw}%`, background: YEL, opacity: 0.85, mixBlendMode: 'multiply'}} />
        <span style={{position: 'relative'}}>“…responsible for the theft of approximately $1.5 billion USD…”</span>
      </div>
      {[80, 92, 70, 86].map((w, i) => <div key={i} style={{height: 10, width: `${w}%`, background: '#b9b4a6', marginTop: 16}} />)}
    </div>
  );
};

const PersonSlot: React.FC = () => (
  <div style={{width: 460, height: 560, background: '#d8d2c2', border: `10px solid ${IV}`, boxShadow: '14px 18px 0 rgba(0,0,0,.35)', position: 'relative', overflow: 'hidden', transform: 'rotate(2deg)'}}>
    <svg viewBox="0 0 460 560" width={440} height={540}>
      <ellipse cx={230} cy={210} rx={92} ry={112} fill="#8f8a7e" />
      <path d="M 40 560 Q 60 360 230 350 Q 400 360 420 560 Z" fill="#7b766b" />
    </svg>
    <div style={{position: 'absolute', top: 18, left: 18, background: INK, color: IV, ...MONO, fontSize: 18, padding: '6px 12px'}}>PHOTO SLOT · licensed image</div>
  </div>
);

const Words: React.FC<{text: string; at: number; size?: number; color?: string; hi?: string}> = ({text, at, size = 56, color = IV, hi}) => {
  const f = useCurrentFrame();
  return (
    <div style={{fontFamily: 'PF', fontWeight: 800, fontSize: size, color, lineHeight: 1.2}}>
      {text.split(' ').map((w, i) => {
        const t = at + i * 3;
        const isHi = hi && w.includes(hi);
        return <span key={i} style={{display: 'inline-block', marginRight: 14, opacity: L(f, t, t + 5), transform: `translateY(${(1 - L(f, t, t + 8, 0, 1, out)) * 14}px)`, color: isHi ? YEL : color}}>{w}</span>;
      })}
    </div>
  );
};

const Sfx: React.FC<{n: string; at: number; v?: number}> = ({n, at, v = 0.7}) => <Sequence from={at}><Audio src={staticFile(`sfx/${n}.wav`)} volume={v} /></Sequence>;

export const CASE_LEN = 400;

export const CaseScene: React.FC = () => {
  const f = useCurrentFrame();
  // ---- the character's performance ----
  const walkIn = f < 80;
  const amp = interpolate(f, [0, 62, 80, 352, 366], [1, 1, 0, 0, 1], clamp);
  const x = L(f, 0, 80, -420, 110) + L(f, 356, 400, 0, -560);
  const point = L(f, 96, 112) * (1 - L(f, 182, 196)) + L(f, 286, 300) * (1 - L(f, 330, 344));
  const look = f < 96 ? 0.6 : f < 200 ? 1 : f < 280 ? L(f, 200, 214, 1, -0.1) : 1;
  const squint = L(f, 214, 222) * (1 - L(f, 268, 276));
  const glint = Math.max(L(f, 228, 232) * (1 - L(f, 232, 240)), L(f, 340, 344) * (1 - L(f, 344, 352)));
  const pose: DPose = {
    walk: f * 0.36, amp, point, look, squint, glint,
    tilt: Math.sin(f / 26) * 1.5 + (f > 200 && f < 280 ? -4 : 0),
    bob: -Math.abs(Math.sin(f * 0.36)) * 10 * amp + Math.sin(f / 15) * 2,
  };
  const zoom = 1 + L(f, 0, CASE_LEN, 0, 0.05, Easing.linear);
  return (
    <AbsoluteFill style={{background: '#0f2a46', overflow: 'hidden'}}>
      <Fonts />
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        <Img src={staticFile('navy.png')} style={{width: 1920, height: 1080, objectFit: 'cover'}} />

        {/* BEAT 1 — case title */}
        <Beat from={10} to={92}>
          <div style={{position: 'absolute', left: 820, top: 170}}>
            <div style={{...MONO, fontSize: 30, color: IV, opacity: 0.85}}>CASE FILE 001 · FEB 21, 2025</div>
            <div style={{...OS, fontWeight: 700, fontSize: 190, color: YEL, lineHeight: 0.95, marginTop: 18}}>THE BYBIT<br />HACK</div>
            <div style={{marginTop: 26, width: 900}}><Words text="The largest crypto theft ever reported." at={40} size={50} hi="largest" /></div>
          </div>
        </Beat>

        {/* BEAT 2 — the bank and the money */}
        <Beat from={96} to={190}>
          <Pop at={100} style={{left: 760, top: 330}}><Bank w={430} /></Pop>
          <div style={{position: 'absolute', left: 790, top: 690, ...OS, fontSize: 40, color: IV, fontWeight: 600}}>BYBIT · CRYPTO EXCHANGE</div>
          <FlyingBills at={118} from={[900, 450]} to={[1520, 760]} />
          <div style={{position: 'absolute', left: 1170, top: 140}}><Counter at={120} /></div>
          <div style={{position: 'absolute', left: 1180, top: 380, ...MONO, fontSize: 28, color: IV}}>IN DIGITAL ASSETS · APPROX.</div>
          <SourceChip at={124} a="FBI IC3 PSA I-022625-PSA" b="Feb 26, 2025 · ic3.gov/PSA/2025/PSA250226" />
        </Beat>

        {/* BEAT 3 — the institution names the culprit */}
        <Beat from={198} to={278}>
          <div style={{position: 'absolute', left: 1260, top: 380, opacity: 0.9}}><Network at={200} /></div>
          <div style={{position: 'absolute', left: 1400, top: 300, ...MONO, fontSize: 26, color: IV}}>“THOUSANDS OF ADDRESSES”</div>
          <div style={{position: 'absolute', left: 720, top: 230}}><FBIDoc at={202} /></div>
          <div style={{position: 'absolute', left: 760, top: 800}}><Stamp at={238} text="TraderTraitor · DPRK" /></div>
          <SourceChip at={206} a="FBI IC3 PSA I-022625-PSA" b="Feb 26, 2025 · ic3.gov/PSA/2025/PSA250226" />
        </Beat>

        {/* BEAT 4 — a real person enters the story */}
        <Beat from={284} to={350}>
          <Pop at={288} style={{left: 900, top: 170}}><PersonSlot /></Pop>
          <div style={{position: 'absolute', left: 1420, top: 330, width: 440}}>
            <div style={{background: YEL, color: INK, ...OS, fontWeight: 700, fontSize: 54, padding: '8px 20px', display: 'inline-block'}}>BEN ZHOU</div>
            <div style={{background: IV, color: INK, ...MONO, fontSize: 24, padding: '10px 20px', marginTop: 6, display: 'inline-block'}}>CO-FOUNDER & CEO, BYBIT</div>
            <div style={{marginTop: 30}}><Words text="The person at the top when it happened." at={300} size={40} /></div>
          </div>
        </Beat>

        {/* BEAT 5 — closing question */}
        <Beat from={352} to={398}>
          <div style={{position: 'absolute', left: 260, top: 380, width: 1400, textAlign: 'center'}}>
            <Words text="So how do you steal $1.5 billion?" at={356} size={74} hi="billion?" />
          </div>
        </Beat>

        {/* the character lives in every beat */}
        <div style={{position: 'absolute', left: x, top: 200}}>
          <Detective pose={pose} height={860} />
        </div>
      </AbsoluteFill>

      <Audio src={staticFile('sfx/drone.wav')} volume={0.3} />
      {[8, 26, 44, 62].map((t) => <Sfx key={t} n="tick" at={t} v={0.5} />)}
      <Sfx n="thud" at={30} v={0.7} />
      <Sfx n="whoosh" at={96} v={0.5} /><Sfx n="thud" at={100} v={0.6} />
      {[120, 132, 144, 156].map((t) => <Sfx key={t} n="tick" at={t} v={0.4} />)}
      <Sfx n="thud" at={168} v={0.8} />
      <Sfx n="whoosh" at={198} v={0.5} /><Sfx n="thud" at={238} v={1} />
      <Sfx n="whoosh" at={284} v={0.5} /><Sfx n="thud" at={290} v={0.6} />
      <Sfx n="whoosh" at={352} v={0.5} />
    </AbsoluteFill>
  );
};

export const CharacterSheet: React.FC = () => {
  const poses: [string, Partial<DPose>][] = [
    ['IDLE', {}], ['WALK', {walk: 1.2, amp: 1}], ['POINT', {point: 1, look: 1}], ['SUSPICIOUS', {squint: 1, look: -0.2, tilt: -4, glint: 1}],
  ];
  return (
    <AbsoluteFill style={{background: '#0f2a46'}}>
      <Fonts />
      <Img src={staticFile('navy.png')} style={{width: 1920, height: 1080, objectFit: 'cover', position: 'absolute'}} />
      <div style={{position: 'absolute', left: 80, top: 60, ...OS, fontWeight: 700, fontSize: 84, color: YEL}}>THE AUDITOR</div>
      <div style={{position: 'absolute', left: 84, top: 170, ...MONO, fontSize: 26, color: IV}}>CHANNEL HOST · CHARACTER SHEET · v1</div>
      {poses.map(([n, p], i) => (
        <div key={n} style={{position: 'absolute', left: 120 + i * 440, top: 240}}>
          <Detective pose={{walk: 0, amp: 0, point: 0, look: 0.4, squint: 0, tilt: 0, bob: 0, glint: 0, ...p}} height={720} />
          <div style={{...MONO, fontSize: 28, color: IV, marginTop: 6, marginLeft: 80}}>{n}</div>
        </div>
      ))}
      <div style={{position: 'absolute', right: 80, top: 80, display: 'flex', gap: 14}}>
        {[C.coat, C.panel, C.band, C.gold, IV, YEL].map((c) => <div key={c} style={{width: 56, height: 56, background: c, border: `3px solid ${IV}`}} />)}
      </div>
    </AbsoluteFill>
  );
};
