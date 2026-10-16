// Motion test v2 in the reference technique: empty white stage, characters in the middle band, 3/4 turns,
// handing things over, small hand-written lines above the speaker, hard cuts wide <-> face close-up.
// Story: payday -> pays rent -> "rent is 5 fish now" -> shock -> whole pile goes to the seal -> "thank you penguin".
import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {FPS, SFX_GAIN} from '../engine';
import {HAND, HandFont} from '../sketch';
import {Fish, INK, Line, Penguin, PenguinPose, Seal, Stand, talk} from '../penguin/rig';

export const PENGUIN_TEST_SECONDS = 12;
const G = 1180, PH = 400; // ground line (invisible), penguin height
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const r = (t: number, a: number, b: number) => cl((t - a) / (b - a));
const ease = (p: number) => 1 - Math.pow(1 - p, 3);
const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

const Sfx = ({at, name, vol = 0.5, rate = 1}: {at: number; name: string; vol?: number; rate?: number}) =>
  <Sequence from={Math.round(at * FPS)} layout="none"><Audio src={staticFile(`sfx/${name}.wav`)} volume={vol * SFX_GAIN} playbackRate={rate} /></Sequence>;

const GRAB = 2.7, GIVE = 4.1, SHOCK = 5.4, BACK = 6.9, SEALCU = 9.6, FLY = [7.2, 7.6, 8.0, 8.4];
// Shots: [start, scale, focusX, focusY]. Hard cuts between them (reference editing), tiny push inside each.
const SHOTS: [number, number, number, number][] = [[0, 1, 540, 960], [SHOCK, 3.2, 470, 946], [BACK, 1, 540, 960], [SEALCU, 2.4, 790, 1010]];
// Pile on the left: index 4 (top) is grabbed and handed over; 3,2,1,0 then fly to the counter in that order.
const PILE: [number, number, number][] = [[95, 1150, -4], [80, 1104, 6], [110, 1058, -7], [85, 1012, 4], [100, 966, -3]];
const COUNTER: [number, number][] = [[880, 1040], [960, 1036], [920, 1000], [1000, 998], [960, 962]];
const flyAt = (i: number) => FLY[3 - i];

// Penguin's eyes follow each fish from the pile (left) to the seal (right).
const lookX = (t: number) => {
  for (const a of FLY) if (t >= a && t < a + 0.45) return lerp(-0.9, 0.9, (t - a) / 0.45);
  return t < FLY[0] ? -0.8 : 0.6;
};

const PileFish = ({i, t}: {i: number; t: number}) => {
  const [x, y, rr] = PILE[i];
  if (i === 4) return t < GRAB ? <Fish x={x} y={y} w={150} rot={rr} id="p4" /> : null;
  const at = flyAt(i), [cx, cy] = COUNTER[4 - i];
  if (t < at) return <Fish x={x} y={y} w={150} rot={rr} flip={i % 2 === 1} id={`p${i}`} seed={i * 0.7} />;
  const q = r(t, at, at + 0.45);
  if (q >= 1) return <Fish x={cx} y={cy} w={130} rot={rr} id={`p${i}`} seed={i} wag={0.6} />;
  return <Fish x={lerp(x, cx, q)} y={lerp(y, cy, q) - Math.sin(q * Math.PI) * 420} w={140} rot={rr + q * 360} id={`p${i}`} seed={i} wag={2} />;
};

export const PenguinTest = () => {
  const frame = useCurrentFrame(), t = frame / FPS;
  const px = lerp(300, 470, ease(r(t, 2.8, 3.8)));
  const walking = t > 2.8 && t < 3.8;
  const shock = t >= SHOCK && t < BACK, after = t >= BACK;
  const pose: PenguinPose = {
    turn: shock ? 0 : after ? lerp(0.8, 0, ease(r(t, BACK, BACK + 0.2))) : lerp(0, 0.8, ease(r(t, 2.4, 2.7))),
    walk: walking ? (t - 2.8) * 1.8 : null,
    mouth: shock ? 0.3 : talk(t, [[0.3, 1.3], [1.6, 2.0], [7.0, 7.4]]),
    brows: shock ? 'shock' : after ? 'worried' : t < 4.5 ? 'happy' : 'none',
    look: shock ? [0, 0] : after ? [lookX(t), 0.2] : t > 4.3 ? [0.6, -0.2] : [0, 0],
    flapR: shock ? 115 : t > 0.3 && t < 1.6 ? 95 + Math.sin(t * 13) * 28 : t >= GIVE - 0.2 && !after ? lerp(6, 82, ease(r(t, GIVE - 0.2, GIVE + 0.15))) : 6 + (walking ? Math.sin(t * 11) * 12 : 0),
    flapL: shock ? 115 : 6 + (walking ? -Math.sin(t * 11) * 12 : 0),
    holding: t >= GRAB && !after,
    eyeScale: shock ? 1 + 0.3 * ease(r(t, SHOCK, SHOCK + 0.15)) : 1, pupil: shock ? 0.4 : 1, tremble: shock ? 1 : 0,
    squash: t > 3.8 && t < 4.3 ? Math.sin((t - 3.8) * 18) * Math.exp(-(t - 3.8) * 7) : 0,
  };
  const wallet = 5 - (t >= GRAB ? 1 : 0) - FLY.filter((a) => t >= a).length;
  const sealTalk = talk(t, [[4.3, 5.2], [9.8, 10.7]]);
  const [s0, sc, fx, fy] = [...SHOTS].reverse().find(([a]) => t >= a)!;
  const s = sc * (1 + 0.012 * (t - s0));
  const cam = `translate(${540 - fx * s}px, ${960 - fy * s}px) scale(${s})`;
  const close = sc > 1;
  return <AbsoluteFill style={{background: '#FFFFFF', overflow: 'hidden'}}>
    <HandFont />
    <AbsoluteFill style={{transform: cam, transformOrigin: '0 0'}}>
      <Seal x={850} y={G} h={300} mouth={sealTalk} smug={after} flap={t > 7 && t < 9 ? Math.abs(Math.sin(t * 8)) * 20 : 0} />
      <Stand x={850} y={G} label="RENT" w={400} h={560} counter={120} />
      {after && <Fish x={COUNTER[0][0]} y={COUNTER[0][1]} w={130} rot={3} id="given" wag={0.6} />}
      {PILE.map((_, i) => <PileFish key={i} i={i} t={t} />)}
      <Penguin x={px} y={G} h={PH} pose={pose} />
      {!close && <>
        <Line t={t} text="payday!" x={300} y={660} at={0.3} until={2.2} />
        <Line t={t} text="rent is 5 fish now." x={760} y={560} at={4.3} until={SHOCK} />
        <Line t={t} text="ok..." x={470} y={720} at={7.0} until={7.9} />
      </>}
    </AbsoluteFill>
    {t >= SEALCU && <Line t={t} text="thank you penguin." x={540} y={1580} at={9.8} size={86} />}
    <div style={{position: 'absolute', left: 46, top: 96, display: 'flex', alignItems: 'center', gap: 10, background: '#fff', border: `4px solid ${INK}`, borderRadius: 22, padding: '6px 24px 6px 8px'}}>
      <div style={{position: 'relative', width: 120, height: 64}}><Fish x={60} y={32} w={120} id="wal" /></div>
      <div style={{fontFamily: HAND, fontSize: 76, color: wallet === 0 ? '#D83A2E' : INK, lineHeight: 1, fontWeight: 700}}>× {wallet}</div>
    </div>
    {[0.35, 0.6, 0.85, 1.1, 1.65, 1.9, 7.05, 7.3].map((a) => <Sfx key={a} at={a} name="blip" vol={0.3} />)}
    <Sfx at={GRAB} name="pop" vol={0.45} />
    {[2.85, 3.13, 3.41, 3.69].map((a) => <Sfx key={a} at={a} name="tick" vol={0.25} />)}
    <Sfx at={GIVE} name="flip" vol={0.4} />
    {[4.35, 4.6, 4.85, 5.1, 9.85, 10.1, 10.35, 10.6].map((a) => <Sfx key={a} at={a} name="blip" vol={0.3} rate={0.6} />)}
    <Sfx at={SHOCK} name="impact" vol={0.8} />
    {FLY.map((a) => <Sfx key={a} at={a} name="whoosh" vol={0.25} />)}
    {FLY.map((a) => <Sfx key={`c${a}`} at={a + 0.45} name="cha-ching" vol={0.3} />)}
    <Sfx at={10.9} name="sad-horn" vol={0.45} />
  </AbsoluteFill>;
};
