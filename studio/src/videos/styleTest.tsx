import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {At, C, Fonts, Pic, Scene, Sfx, useT, wordTimer} from '../engine';
import {House} from '../props';
import {FlipCal, GridPaper, HandFont, OutlineCaptions, SketchBox, Stamp, Write} from '../sketch';
import lines from '../data/style-test.json';

const w = wordTimer(lines);
const L = (n: number) => lines[n - 1];
export const STYLE_SECONDS = +(lines[lines.length - 1].end + 1.8).toFixed(2);
const Live = ({children}: {children: (t: number) => React.ReactNode}) => <>{children(useT())}</>;

export const StyleTest = () => (
  <AbsoluteFill>
    <Fonts /><HandFont />
    <GridPaper />
    <Audio src={staticFile('voice-style-test.mp3')} />
    <Scene from={0} to={STYLE_SECONDS} overlay>
      {/* title written live, highlighter on each name */}
      <Write text="BENNY" x={220} y={360} at={0.05} dur={0.55} size={88} highlight="#F2A7A0" />
      <Write text="vs" x={430} y={360} at={w(1, 'versus')} dur={0.25} size={70} pencil={false} />
      <Write text="RICH RICK" x={740} y={360} at={w(1, 'Rich')} dur={0.6} size={88} highlight="#A9D8A0" />

      {/* characters: Benny left, Rick right */}
      <Pic src="benny-front" w={470} x={230} y={1180} at={0.15} until={L(3).start} enter="slideL" bob />
      <Pic src="benny-saving-cash" w={470} x={230} y={1200} at={L(3).start} enter="none" bob />
      <Live>{(t) => { const a = w(4, 'walks'); const dx = t < a ? 0 : -60 * Math.min(1, (t - a) / 0.8);
        return <Pic src="rich-front" w={560} x={850 + dx} y={1170} at={w(1, 'Rich') + 0.1} enter="slideR" bob />; }}</Live>

      {/* goal: sketch box draws, house inside */}
      <Write text="GOAL" x={540} y={560} at={w(2, 'goal')} until={L(3).start} dur={0.35} size={64} under={C.green} pencil={false} />
      <SketchBox x={540} y={780} w={330} h={300} at={w(2, 'buy')} until={L(3).start}><House w={230} /></SketchBox>

      {/* Benny saves for years: flipping calendar */}
      <FlipCal x={300} y={680} w={300} label="SAVING" items={[[w(3, 'saves'), '2026'], [w(3, 'saves') + 0.4, '2027'], [w(3, 'years'), '2028'], [L(3).end, '2029']]} />

      {/* Rick: loan letter written, stamped */}
      <SketchBox x={780} y={700} w={380} h={420} at={w(4, 'bank')} drawDur={0.35}>
        <div style={{width: 340, height: 380}} />
      </SketchBox>
      <Write text="LOAN LETTER" x={780} y={570} at={w(4, 'bank') + 0.35} dur={0.6} size={48} />
      <Stamp x={780} y={760} at={L(4).end + 0.35} size={58} />

      <OutlineCaptions lines={lines} end={STYLE_SECONDS} y={1290} size={70} />
    </Scene>
    <Sfx at={0.05} name="whoosh" vol={0.3} /><Sfx at={w(1, 'Rich')} name="pop" /><Sfx at={w(2, 'buy')} name="tick" vol={0.4} />
    <Sfx at={w(3, 'saves')} name="flip" /><Sfx at={w(3, 'years')} name="flip" /><Sfx at={L(3).end} name="flip" />
    <Sfx at={w(4, 'bank')} name="whoosh" vol={0.4} /><Sfx at={L(4).end + 0.35} name="impact" vol={0.6} />
  </AbsoluteFill>
);
