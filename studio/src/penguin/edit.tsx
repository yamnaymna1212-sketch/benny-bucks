// Editing layer for the Doug series: readable "primitive" captions + beat punches + SFX helpers.
import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';
import {FPS, SFX_GAIN} from '../engine';

export type Phrase = {start: number; end: number; text: string; line?: number};

// Words that get a colour (numbers / money / the cast) so the eye catches the point instantly.
const RED = /^(0|nothing|broke|owe|owes|rent|180|150|200|30%|debt|tax)$/i, GREEN = /^(own|igloo|rich|30|\+30|bank|mortgage)$/i, BLUE = /^(doug|larry|fish)$/i;
const colour = (w: string) => { const k = w.replace(/[^\w%+]/g, ''); return RED.test(k) ? '#FF5A4E' : GREEN.test(k) ? '#3DDC84' : BLUE.test(k) ? '#5EC4FA' : '#FFFFFF'; };

// Split every phrase into chunks of <= 3 words, timed by character length (no word-level ASR needed).
export function chunks(phrases: Phrase[]) {
  const out: {start: number; end: number; words: string[]}[] = [];
  for (const p of phrases) {
    const words = p.text.replace(/[()]/g, '').split(/\s+/).filter(Boolean);
    const groups: string[][] = [];
    for (let i = 0; i < words.length; i += 3) groups.push(words.slice(i, i + 3));
    if (groups.length > 1 && groups[groups.length - 1].length === 1 && groups[groups.length - 1][0].length <= 5) { const last = groups.pop()!; groups[groups.length - 1].push(...last); }
    const total = groups.reduce((s, g) => s + g.join(' ').length, 0);
    let t = p.start;
    for (const g of groups) { const d = (p.end - p.start) * g.join(' ').length / total; out.push({start: t, end: t + d, words: g}); t += d; }
  }
  return out;
}

// Chunky white caption with navy outline, coloured keywords, pop + tiny tilt per chunk (hand-made feel).
export const Captions = ({t, phrases, y = 1530, size: maxSize = 84}: {t: number; phrases: Phrase[]; y?: number; size?: number}) => {
  const cs = chunks(phrases);
  const i = cs.findIndex((c, k) => t >= c.start && t < (cs[k + 1]?.start ?? c.end + 0.3));
  if (i < 0) return null;
  const c = cs[i], size = Math.min(maxSize, 1500 / Math.max(8, c.words.join(' ').length)), d = t - c.start, s = d < 0.08 ? 1.18 - 0.18 * (d / 0.08) : 1, rot = ((i * 37) % 7) - 3;
  return <div style={{position: 'absolute', left: 0, right: 0, top: y, display: 'flex', justifyContent: 'center', transform: `scale(${s}) rotate(${rot * 0.6}deg)`}}>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, lineHeight: 1.05, textAlign: 'center', maxWidth: 940, textTransform: 'uppercase', letterSpacing: 1}}>
      {c.words.map((w, k) => <span key={k} style={{color: colour(w), WebkitTextStroke: `${size * 0.16}px #123B6B`, paintOrder: 'stroke fill', textShadow: `0 ${size * 0.07}px 0 #0B2A4D`, marginRight: '0.28em'}}>{w}</span>)}
    </div>
  </div>;
};

// Camera kick on every phrase start (alternating push), so the picture moves with the voice.
export const beat = (tc: number, phrases: Phrase[]) => {
  let k = 1;
  phrases.forEach((p, i) => { const d = tc - p.start; if (d >= 0 && d < 0.6) k *= 1 + (i % 2 ? 0.05 : 0.035) * Math.exp(-d * 9); });
  return k;
};

export const Sfx = ({at, name, vol = 0.4}: {at: number; name: string; vol?: number}) =>
  <Sequence from={Math.max(0, Math.round(at * FPS))} layout="none"><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * SFX_GAIN} /></Sequence>;
