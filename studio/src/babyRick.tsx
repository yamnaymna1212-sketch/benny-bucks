// "Rick Jr." — original baby character (Rich Rick's son), hand-drawn line-art look to match Benny/Rick.
import React from 'react';

const INK = '#1A1A1A';
export const BabyRick = ({w = 300}: {w?: number}) => (
  <svg width={w} height={w * 1.25} viewBox="0 0 240 300" style={{display: 'block', overflow: 'visible'}}>
    <g stroke={INK} strokeWidth={5} strokeLinejoin="round" strokeLinecap="round">
      {/* spiky yellow hair (Rick's) */}
      <path d="M58 92 L52 52 L76 72 L84 34 L102 64 L118 26 L130 62 L150 30 L156 66 L178 40 L176 78 L196 64 L184 98 Z" fill="#F7D33C" />
      {/* big baby head */}
      <ellipse cx="122" cy="118" rx="78" ry="70" fill="#FCE3CC" />
      <ellipse cx="44" cy="124" rx="10" ry="14" fill="#FCE3CC" /><ellipse cx="200" cy="124" rx="10" ry="14" fill="#FCE3CC" />
      {/* black sunglasses */}
      <rect x="66" y="98" width="50" height="30" rx="12" fill={INK} /><rect x="128" y="98" width="50" height="30" rx="12" fill={INK} />
      <path d="M116 108 L128 108" fill="none" />
      {/* smug mouth + pacifier-size smile */}
      <path d="M104 156 Q122 168 142 154" fill="none" />
      {/* black tracksuit onesie with gold stripe */}
      <path d="M72 186 Q122 172 172 186 L180 252 Q122 268 64 252 Z" fill={INK} />
      <path d="M78 196 L72 250 M166 196 L172 250" stroke="#F2B705" strokeWidth={6} fill="none" />
      {/* gold chain with $ */}
      <path d="M96 186 Q122 210 148 186" fill="none" stroke="#F2B705" strokeWidth={6} />
      <circle cx="122" cy="212" r="13" fill="#F2B705" />
      {/* arms + legs */}
      <path d="M72 194 Q44 214 52 236" fill="none" strokeWidth={14} stroke={INK} /><circle cx="52" cy="240" r="10" fill="#FCE3CC" />
      <path d="M172 194 Q200 214 192 236" fill="none" strokeWidth={14} stroke={INK} /><circle cx="192" cy="240" r="10" fill="#FCE3CC" />
      <ellipse cx="98" cy="272" rx="20" ry="12" fill="#FFFFFF" /><ellipse cx="146" cy="272" rx="20" ry="12" fill="#FFFFFF" />
    </g>
    <text x="122" y="218" fontFamily="Montserrat" fontWeight={900} fontSize="16" fill={INK} textAnchor="middle">$</text>
  </svg>
);
