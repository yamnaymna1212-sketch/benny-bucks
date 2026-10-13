// Hand-drawn emphasis marks that draw themselves on (via @remotion/paths).
import React from 'react';
import {evolvePath} from '@remotion/paths';
import {C, ramp, useT} from './engine';

export const DrawCircle = ({x, y, rx, ry, at, dur = 0.35, color = C.red}: {x: number; y: number; rx: number; ry: number; at: number; dur?: number; color?: string}) => {
  const t = useT();
  if (t < at) return null;
  const d = `M ${x + rx} ${y} A ${rx} ${ry} 0 1 1 ${x + rx - 1} ${y - 8} L ${x + rx * 0.9} ${y - ry * 0.35}`;
  const {strokeDasharray, strokeDashoffset} = evolvePath(ramp(t, at, at + dur), d);
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
    <path d={d} stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
  </svg>;
};

export const DrawArrow = ({from, to, at, dur = 0.3, color = C.red}: {from: [number, number]; to: [number, number]; at: number; dur?: number; color?: string}) => {
  const t = useT();
  if (t < at) return null;
  const [x1, y1] = from, [x2, y2] = to;
  const mx = (x1 + x2) / 2 + (y2 - y1) * 0.25, my = (y1 + y2) / 2 - (x2 - x1) * 0.25;
  const d = `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  const p = ramp(t, at, at + dur);
  const {strokeDasharray, strokeDashoffset} = evolvePath(p, d);
  const a = Math.atan2(y2 - my, x2 - mx), L = 34;
  return <svg width={1080} height={1920} style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}>
    <path d={d} stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
    {p >= 1 && <path d={`M ${x2 - L * Math.cos(a - 0.5)} ${y2 - L * Math.sin(a - 0.5)} L ${x2} ${y2} L ${x2 - L * Math.cos(a + 0.5)} ${y2 - L * Math.sin(a + 0.5)}`} stroke={color} strokeWidth={12} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>;
};
