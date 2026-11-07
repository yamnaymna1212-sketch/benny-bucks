import React from 'react';
import {AbsoluteFill, Audio, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {Auditor, Pose} from './Auditor';
import {Paper, Words, Tag, Stamp, Source, Font} from './Episode';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const ease = Easing.inOut(Easing.cubic);
const lerp = (f: number, a: number, b: number, x: number, y: number) => interpolate(f, [a, b], [x, y], {...clamp, easing: ease});

const Polaroid: React.FC<{icon?: string; img?: string; label: string; x: number; y: number; start: number; rot: number}> = ({icon, img, label, x, y, start, rot}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const sp = spring({frame: f - start, fps, config: {damping: 11, stiffness: 150}});
  return (
    <div style={{position: 'absolute', left: x, top: y, width: 310, height: 370, background: '#f8f6ee', transform: `rotate(${rot}deg) scale(${sp})`, boxShadow: '10px 14px 22px rgba(0,0,0,.35)'}}>
      <div style={{position: 'absolute', left: 22, top: 22, width: 266, height: 266, background: '#d6d2c6', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        {icon && <Img src={staticFile(`st_${icon}.png`)} style={{width: 230}} />}
        {img && <Img src={staticFile(img)} style={{height: 250}} />}
      </div>
      <div style={{position: 'absolute', bottom: 22, width: '100%', textAlign: 'center', fontFamily: 'Liberation Mono, monospace', fontWeight: 700, fontSize: 26}}>{label}</div>
      <div style={{position: 'absolute', left: 145, top: -8, width: 22, height: 22, borderRadius: 11, background: '#d6453d', border: '3px solid #7a1f1a'}} />
    </div>
  );
};

const Strings: React.FC = () => {
  const f = useCurrentFrame();
  const pts = [[955, 330], [1265, 260], [1535, 380], [1735, 600]];
  return (
    <svg width={1920} height={1080} style={{position: 'absolute', left: 0, top: 0}}>
      {pts.slice(0, -1).map((p, i) => {
        const q = pts[i + 1];
        const st = [118, 146, 178][i];
        const pr = interpolate(f, [st, st + 14], [0, 1], clamp);
        const L = Math.hypot(q[0] - p[0], q[1] - p[1]) + 40;
        return <path key={i} d={`M ${p[0]} ${p[1]} Q ${(p[0] + q[0]) / 2} ${(p[1] + q[1]) / 2 + 40} ${q[0]} ${q[1]}`} stroke="#d6453d" strokeWidth={5} fill="none" strokeDasharray={L} strokeDashoffset={L * (1 - pr)} />;
      })}
    </svg>
  );
};

const Say: React.FC<{text: string; at: number; dur: number; hi?: string}> = ({text, at, dur, hi}) => (
  <Sequence from={at} durationInFrames={dur}>
    <div style={{position: 'absolute', left: 120, top: 70}}><Words text={text} start={0} size={58} hi={hi} /></div>
  </Sequence>
);

export const AuditorScene: React.FC = () => {
  const f = useCurrentFrame();
  const walking = f < 66;
  const amp = interpolate(f, [0, 50, 70], [1, 1, 0], clamp);
  const x = lerp(f, 0, 66, -460, 90);
  const talking = f >= 74 && f < 262;
  const env = Math.abs(Math.sin(f * 0.8)) * Math.abs(Math.sin(f * 0.31 + 1));
  const mouth = talking ? (env > 0.55 ? 2 : env > 0.2 ? 1 : 0) : 0;
  const point = lerp(f, 84, 100, 0, 1) * (1 - lerp(f, 214, 226, 0, 1));
  const shrug = lerp(f, 226, 240, 0, 1) * (1 - lerp(f, 262, 276, 0, 1));
  const sway = Math.sin(f / 11) * 4 * (talking ? 1 : 0.3);
  const pose: Pose = {
    walk: f * 0.42, walkAmp: amp,
    rArm: [-78 * point - 40 * shrug + (point > 0 ? Math.sin(f / 7) * 3 : 0), -8 * point - 38 * shrug],
    lArm: [8 + 30 * shrug + sway, -14 + 30 * shrug],
    headTilt: Math.sin(f / 30) * 2 + (talking ? Math.sin(f / 9) * 1.6 : 0) + shrug * 6 - point * 3,
    brow: shrug + (f > 186 && f < 214 ? 0.7 : 0),
    mouth, blink: f % 84 < 4,
    bob: -Math.abs(Math.sin(f * 0.42)) * 12 * amp + Math.sin(f / 14) * 2,
  };
  return (
    <Paper dur={300} bg="kraft.png" zoom={0.04}>
      <Font />
      <Polaroid icon="bank" label="EXCHANGE" x={800} y={330} start={100} rot={-4} />
      <Polaroid icon="wallet" label="WALLET 0x…" x={1110} y={250} start={128} rot={3} />
      <Polaroid icon="network" label="ADDRESSES" x={1370} y={350} start={156} rot={-2} />
      <Polaroid img="hood.png" label="FBI: DPRK-linked" x={1580} y={600} start={190} rot={4} />
      <Strings />
      <div style={{position: 'absolute', left: x, top: 150}}>
        <Auditor pose={pose} height={900} />
      </div>
      <Say text="February 21, 2025." at={76} dur={44} hi="2025." />
      <Say text="One exchange. About $1.5 billion gone." at={122} dur={66} hi="$1.5" />
      <Say text="The FBI later pointed to North Korea." at={190} dur={72} hi="FBI" />
      <Stamp text="PER FBI" start={264} x={1230} y={850} />
      <Source id="fbi" start={190} />
      {/* sound */}
      {[6, 20, 34, 48, 62].map((t) => <Sequence key={t} from={t}><Audio src={staticFile('sfx/tick.wav')} volume={0.55} /></Sequence>)}
      {[100, 128, 156, 190, 264].map((t) => <Sequence key={t} from={t}><Audio src={staticFile('sfx/thud.wav')} volume={0.6} /></Sequence>)}
      <Sequence from={0}><Audio src={staticFile('sfx/whoosh.wav')} volume={0.4} /></Sequence>
      <Audio src={staticFile('sfx/drone.wav')} volume={0.25} />
    </Paper>
  );
};
