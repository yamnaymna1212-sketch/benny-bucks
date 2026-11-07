import React from 'react';

const COAT = '#2c2f38', COAT2 = '#454a57', PANTS = '#1d1e24', SKIN = '#dcb18c', RED = '#d6453d', LINE = '#111';

export type Pose = {
  walk: number;       // walk phase (radians)
  walkAmp: number;    // 0..1
  rArm: [number, number]; // screen-right arm: shoulder angle, elbow angle
  lArm: [number, number]; // screen-left arm
  headTilt: number;
  brow: number;       // -1..1 (raise)
  mouth: number;      // 0 closed, 1 small, 2 open
  blink: boolean;
  bob: number;
};

const Limb: React.FC<{x1: number; y1: number; x2: number; y2: number; w: number; c: string}> = ({x1, y1, x2, y2, w, c}) => (
  <>
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={LINE} strokeWidth={w + 7} strokeLinecap="round" />
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeLinecap="round" />
  </>
);

const Arm: React.FC<{sx: number; sy: number; a: [number, number]; mag?: boolean}> = ({sx, sy, a, mag}) => (
  <g transform={`rotate(${a[0]} ${sx} ${sy})`}>
    <Limb x1={sx} y1={sy} x2={sx} y2={sy + 100} w={36} c={COAT} />
    <g transform={`rotate(${a[1]} ${sx} ${sy + 100})`}>
      <Limb x1={sx} y1={sy + 100} x2={sx} y2={sy + 190} w={31} c={COAT} />
      <circle cx={sx} cy={sy + 206} r={20} fill={SKIN} stroke={LINE} strokeWidth={4} />
      <Limb x1={sx} y1={sy + 216} x2={sx} y2={sy + 244} w={9} c={SKIN} />
      {mag && (
        <g>
          <line x1={sx} y1={sy + 206} x2={sx} y2={sy + 280} stroke={LINE} strokeWidth={12} strokeLinecap="round" />
          <circle cx={sx} cy={sy + 325} r={52} fill="#e9f1f5" fillOpacity={0.75} stroke={LINE} strokeWidth={11} />
          <path d={`M ${sx - 30} ${sy + 305} Q ${sx - 20} ${sy + 290} ${sx - 5} ${sy + 290}`} stroke="#fff" strokeWidth={6} fill="none" strokeLinecap="round" />
        </g>
      )}
    </g>
  </g>
);

const Leg: React.FC<{hx: number; hy: number; a: number; k: number}> = ({hx, hy, a, k}) => (
  <g transform={`rotate(${a} ${hx} ${hy})`}>
    <Limb x1={hx} y1={hy} x2={hx} y2={hy + 135} w={46} c={PANTS} />
    <g transform={`rotate(${k} ${hx} ${hy + 135})`}>
      <Limb x1={hx} y1={hy + 135} x2={hx} y2={hy + 255} w={40} c={PANTS} />
      <ellipse cx={hx + 12} cy={hy + 270} rx={38} ry={15} fill="#0c0c0e" stroke={LINE} strokeWidth={3} />
    </g>
  </g>
);

export const Auditor: React.FC<{pose: Pose; height?: number; flip?: boolean}> = ({pose, height = 880, flip}) => {
  const p = pose;
  const sw = Math.sin(p.walk) * 30 * p.walkAmp;
  const sw2 = -sw;
  const k1 = Math.max(0, -Math.sin(p.walk + 0.6)) * 34 * p.walkAmp;
  const k2 = Math.max(0, Math.sin(p.walk + 0.6)) * 34 * p.walkAmp;
  const rArm: [number, number] = [p.rArm[0] + sw2 * 0.8 * (p.rArm[0] === 0 ? 1 : 0), p.rArm[1]];
  const lArm: [number, number] = [p.lArm[0] + sw * 0.8 * (p.lArm[0] === 0 ? 1 : 0), p.lArm[1]];
  const mouth = [
    <path key="m0" d="M 184 232 Q 200 236 216 230" stroke="#5a2b24" strokeWidth={4} fill="none" strokeLinecap="round" />,
    <ellipse key="m1" cx={200} cy={233} rx={11} ry={6} fill="#5a2b24" />,
    <ellipse key="m2" cx={200} cy={236} rx={14} ry={13} fill="#5a2b24" />,
  ][p.mouth];
  const eyeRy = p.blink ? 1.5 : 9;
  return (
    <svg viewBox="0 0 400 800" height={height} width={height / 2} style={{overflow: 'visible', transform: flip ? 'scaleX(-1)' : undefined}}>
      <defs>
        <filter id="cutout" x="-20%" y="-10%" width="140%" height="120%">
          <feMorphology in="SourceAlpha" operator="dilate" radius="6" result="d" />
          <feFlood floodColor={RED} result="r" />
          <feComposite in="r" in2="d" operator="in" result="ring" />
          <feGaussianBlur in="d" stdDeviation="9" result="b" />
          <feOffset in="b" dx="10" dy="14" result="o" />
          <feComponentTransfer in="o" result="sh"><feFuncA type="linear" slope="0.35" /></feComponentTransfer>
          <feMerge><feMergeNode in="sh" /><feMergeNode in="ring" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <clipPath id="faceclip"><ellipse cx={200} cy={190} rx={52} ry={62} /></clipPath>
      </defs>
      <g filter="url(#cutout)" transform={`translate(0 ${p.bob})`}>
        {/* back arm (screen-left) */}
        <Arm sx={138} sy={272} a={lArm} />
        {/* legs */}
        <Leg hx={170} hy={500} a={sw} k={k1} />
        <Leg hx={230} hy={500} a={sw2} k={k2} />
        {/* torso */}
        <path d="M 128 262 Q 200 236 272 262 L 294 535 Q 200 556 106 535 Z" fill={COAT} stroke={LINE} strokeWidth={4} />
        <polygon points="172,252 228,252 200,420" fill="#e9e5da" stroke={LINE} strokeWidth={3} />
        <polygon points="194,262 206,262 214,380 200,412 186,380" fill={RED} stroke={LINE} strokeWidth={3} />
        <polygon points="172,252 130,268 168,470 200,420" fill={COAT2} stroke={LINE} strokeWidth={3} />
        <polygon points="228,252 270,268 232,470 200,420" fill={COAT2} stroke={LINE} strokeWidth={3} />
        <line x1={200} y1={420} x2={200} y2={545} stroke={LINE} strokeWidth={3} />
        {/* neck + head */}
        <g transform={`rotate(${p.headTilt} 200 262)`}>
          <rect x={180} y={235} width={40} height={36} fill="#c99c78" stroke={LINE} strokeWidth={3} />
          <circle cx={149} cy={196} r={12} fill={SKIN} stroke={LINE} strokeWidth={3} />
          <circle cx={251} cy={196} r={12} fill={SKIN} stroke={LINE} strokeWidth={3} />
          <ellipse cx={200} cy={190} rx={52} ry={62} fill={SKIN} stroke={LINE} strokeWidth={4} />
          <g clipPath="url(#faceclip)">
            <rect x={140} y={120} width={130} height={58} fill="#000" opacity={0.38} />
            <rect x={200} y={120} width={70} height={150} fill="#000" opacity={0.18} />
            <path d="M 150 215 Q 200 270 250 215 L 250 240 L 150 240 Z" fill="#000" opacity={0.12} />
          </g>
          {/* eyes */}
          <ellipse cx={180} cy={188} rx={10} ry={eyeRy} fill="#fff" stroke={LINE} strokeWidth={2} />
          <ellipse cx={222} cy={188} rx={10} ry={eyeRy} fill="#fff" stroke={LINE} strokeWidth={2} />
          {!p.blink && <><circle cx={183} cy={189} r={4.5} fill="#111" /><circle cx={225} cy={189} r={4.5} fill="#111" /></>}
          <line x1={166} y1={170 - p.brow * 8} x2={193} y2={165 - p.brow * 10} stroke={LINE} strokeWidth={5} strokeLinecap="round" />
          <line x1={209} y1={165 - p.brow * 10} x2={236} y2={170 - p.brow * 8} stroke={LINE} strokeWidth={5} strokeLinecap="round" />
          <path d="M 200 192 Q 194 214 204 216" stroke="#8a5f44" strokeWidth={3.5} fill="none" strokeLinecap="round" />
          {mouth}
          {/* fedora */}
          <ellipse cx={200} cy={143} rx={92} ry={20} fill="#151519" stroke={LINE} strokeWidth={4} />
          <path d="M 140 142 Q 142 70 200 66 Q 258 70 260 142 Q 200 156 140 142 Z" fill="#1c1c21" stroke={LINE} strokeWidth={4} />
          <path d="M 142 130 Q 200 144 258 130 L 258 142 Q 200 156 142 142 Z" fill={RED} />
        </g>
        {/* front arm (screen-right) */}
        <Arm sx={262} sy={272} a={rArm} />
      </g>
    </svg>
  );
};
