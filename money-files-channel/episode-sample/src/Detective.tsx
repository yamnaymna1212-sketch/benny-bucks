import React from 'react';

// "The Auditor" — original flat-geometric noir character for the channel.
// Signature: raised collar hides the face, gold reading-glasses glint in the shadow, gold ledger under the arm.
export const C = {
  coat: '#15171c', panel: '#252a33', collarA: '#1d2128', collarB: '#2e343f',
  trousers: '#0f1013', shoe: '#050506', hat: '#15171c', brim: '#0e1013',
  shadow: '#07080a', band: '#d6453d', gold: '#e8b23a', goldDark: '#a87a1c', eye: '#f4efe2',
};

export type DPose = {
  walk: number; amp: number;   // walk phase + amplitude 0..1
  point: number;               // 0 idle .. 1 arm extended to the right
  look: number;                // pupils -1 (left) .. 1 (right)
  squint: number;              // 0..1
  tilt: number;                // head tilt deg
  bob: number;                 // px
  glint: number;               // 0..1 glasses flash
};

export const idle: DPose = {walk: 0, amp: 0, point: 0, look: 0.4, squint: 0, tilt: 0, bob: 0, glint: 0};

const Leg: React.FC<{px: number; a: number}> = ({px, a}) => (
  <g transform={`rotate(${a} ${px + 16} 590)`}>
    <polygon points={`${px},585 ${px + 34},585 ${px + 36},772 ${px + 4},772`} fill={C.trousers} />
    <polygon points={`${px - 2},770 ${px + 40},768 ${px + 70},786 ${px + 66},796 ${px - 4},796`} fill={C.shoe} />
  </g>
);

export const Detective: React.FC<{pose: DPose; height?: number}> = ({pose, height = 820}) => {
  const p = pose;
  const sw = Math.sin(p.walk) * 24 * p.amp;
  const armA = 10 - 98 * p.point - sw * 0.5 * (1 - p.point);
  const elbow = -14 * (1 - p.point) - 4 * p.point;
  const eyeRy = 7.5 * (1 - 0.65 * p.squint);
  const lx = p.look * 4;
  return (
    <svg viewBox="0 0 420 820" height={height} width={(height * 420) / 820} style={{overflow: 'visible'}}>
      <defs>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(35)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#ffffff" strokeWidth="1.2" opacity="0.07" />
        </pattern>
        <clipPath id="coatclip"><polygon points="128,250 300,238 336,640 96,652" /></clipPath>
      </defs>
      {/* ground shadow */}
      <ellipse cx={215} cy={798} rx={130 - Math.abs(sw) * 0.8} ry={12} fill="#000" opacity={0.35} />
      <g transform={`translate(0 ${p.bob})`}>
        <Leg px={178} a={-sw} />
        <Leg px={222} a={sw} />
        {/* ledger tucked under the back arm */}
        <g transform="rotate(-9 140 400)">
          <rect x={86} y={318} width={78} height={150} rx={4} fill={C.gold} />
          <rect x={86} y={318} width={16} height={150} fill={C.goldDark} />
          <rect x={112} y={350} width={40} height={6} fill={C.goldDark} opacity={0.7} />
          <rect x={112} y={364} width={30} height={6} fill={C.goldDark} opacity={0.7} />
        </g>
        {/* coat */}
        <g transform={`rotate(${sw * 0.08} 215 260)`}>
          <polygon points="128,250 300,238 336,640 96,652" fill={C.coat} />
          <polygon points="216,246 300,238 336,640 222,646" fill={C.panel} />
          <g clipPath="url(#coatclip)"><rect x={90} y={230} width={260} height={430} fill="url(#hatch)" /></g>
          <polygon points="112,430 322,418 325,446 110,458" fill="#0b0c0f" />
          <rect x={200} y={421} width={30} height={30} fill="none" stroke={C.gold} strokeWidth={4} />
          <line x1={219} y1={460} x2={224} y2={640} stroke="#0b0c0f" strokeWidth={4} />
          <circle cx={236} cy={500} r={5} fill="#0b0c0f" /><circle cx={238} cy={570} r={5} fill="#0b0c0f" />
        </g>
        {/* head */}
        <g transform={`rotate(${p.tilt} 220 250)`}>
          <polygon points="172,150 272,138 278,236 178,242" fill={C.shadow} />
          {/* eyes behind gold glasses */}
          <ellipse cx={205} cy={180} rx={10} ry={eyeRy} fill={C.eye} />
          <ellipse cx={246} cy={177} rx={10} ry={eyeRy} fill={C.eye} />
          <circle cx={205 + lx} cy={181} r={4.2} fill="#111" />
          <circle cx={246 + lx} cy={178} r={4.2} fill="#111" />
          <circle cx={205} cy={180} r={17} fill="none" stroke={C.gold} strokeWidth={3.2} />
          <circle cx={246} cy={177} r={17} fill="none" stroke={C.gold} strokeWidth={3.2} />
          <line x1={222} y1={179} x2={229} y2={178} stroke={C.gold} strokeWidth={3} />
          {p.glint > 0 && <path d="M 236 166 L 256 186" stroke="#fff" strokeWidth={4} opacity={p.glint} strokeLinecap="round" />}
          {/* fedora */}
          <polygon points="164,150 176,74 222,60 264,68 288,138" fill={C.hat} />
          <path d="M 205 66 Q 222 84 240 64" stroke="#000" strokeWidth={4} fill="none" opacity={0.5} />
          <polygon points="167,136 286,124 288,140 165,151" fill={C.band} />
          <polygon points="128,154 312,128 322,142 136,170" fill={C.brim} />
        </g>
        {/* raised collar hides the lower face */}
        <polygon points="146,256 196,140 222,268" fill={C.collarA} />
        <polygon points="304,244 272,128 232,264" fill={C.collarB} />
        {/* front arm */}
        <g transform={`rotate(${armA} 286 268)`}>
          <polygon points="266,262 308,262 302,400 272,400" fill={C.panel} />
          <g transform={`rotate(${elbow} 287 398)`}>
            <polygon points="272,396 302,396 298,508 276,508" fill={C.panel} />
            <polygon points="270,506 304,506 302,532 272,532" fill="#0b0c0f" />
            <polygon points="274,530 300,530 296,556 278,556" fill="#0b0c0f" />
            <polygon points="283,554 291,554 291,590 284,590" fill="#0b0c0f" opacity={p.point} />
          </g>
        </g>
      </g>
    </svg>
  );
};
