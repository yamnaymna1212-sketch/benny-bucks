import React from 'react';
import {AbsoluteFill, Audio, staticFile} from 'remotion';
import {At, C, Fonts, Scene, Sfx, Txt, ramp, useT, wordTimer} from '../engine';
import {Arrow, Bill, Card, Receipt, Sparkles, Stack, Tag, Wallet} from '../props';
import {DrawArrow} from '../draw';
import {FlipCal, HandFont, OutlineCaptions, SketchBox, Stamp, Write} from '../sketch';
import {Actor, BgTimeline, BigNum, CrashLine, GrowthBars, Phone, ShotCam} from '../motion';
import lines from '../data/bonus.json';

const w = wordTimer(lines);
const L = (n: number) => lines[n - 1];
export const BONUS_SECONDS = +(lines[lines.length - 1].end + 0.6).toFixed(2);
const Live = ({children}: {children: (t: number) => React.ReactNode}) => <>{children(useT())}</>;
const usd = (n: number) => '$' + Math.round(n).toLocaleString('en-US');
const within = (a: number, b: number, n: React.ReactNode) => <Live>{(t) => (t >= a && t < b ? n : null)}</Live>;

// Scene boundaries (each change is hidden inside a whip-pan)
const S2 = L(4).start, S3 = L(5).start, S3b = L(7).start, S4 = L(9).start, S5 = L(13).start, S6 = L(15).start, S7 = L(18).start;
const WHIPS = [S2, S3, S3b, S4, S5, S6, S7];

export const Bonus = () => (
  <AbsoluteFill>
    <Fonts /><HandFont />
    <Audio src={staticFile('voice-bonus.mp3')} />
    <Scene from={0} to={BONUS_SECONDS} overlay>
      <ShotCam whips={WHIPS} bg={<BgTimeline keys={[[0, 'caramel'], [S2, 'dark'], [S3, 'room'], [S3b, 'dark'], [S4, 'light'], [S5, 'dark'], [L(14).start, 'light'], [S6, 'street'], [S7, 'caramel']]} />} shots={[
        [0, 1.35, 540, 700], [1.1, 1, 540, 960], [L(2).start, 1, 540, 960], [L(2).start + 0.5, 1.12, 360, 880], [L(3).start, 1.12, 360, 880], [L(3).start + 0.5, 1.12, 740, 880],
        [S2 - 0.01, 1.12, 740, 880], [S2, 1, 540, 960], [S3 - 0.01, 1.06, 540, 940], [S3, 1, 540, 960], [L(6).start, 1.0, 540, 960], [L(6).start + 0.3, 1.1, 600, 800],
        [S3b - 0.01, 1.1, 600, 800], [S3b, 1, 540, 960], [L(8).start, 1.0, 540, 960], [L(8).start + 0.4, 1.08, 560, 780], [S4 - 0.01, 1.08, 560, 780],
        [S4, 1, 540, 960], [L(11).start, 1.3, 540, 560], [L(11).start + 1.5, 1, 540, 960], [S5 - 0.01, 1, 540, 960], [S5, 1.05, 540, 900], [L(14).start, 1, 540, 960],
        [S6, 1, 540, 960], [L(17).start, 1.08, 540, 1000], [S7 - 0.01, 1.08, 540, 1000], [S7, 1.2, 540, 900], [S7 + 0.6, 1, 540, 960]]}>

        {/* ── HOOK: $1,000 each → phone vs index fund ── */}
        {within(0, S2, <>
          <BigNum x={540} y={520} at={0.03} from={0} to={1000} dur={0.5} fmt={usd} size={190} color={C.green} glow="#9BE59B" until={L(2).start} />
          <Txt x={540} y={660} size={44} at={0.6} until={L(2).start}>BONUS EACH</Txt>
          <Live>{(t) => [0, 1].map((i) => { const a = w(1, 'bonus') + i * 0.1; if (t < a || t > L(2).start) return null; const p = ramp(t, a, a + 0.5);
            return <At key={i} x={540 + (i ? 280 : -280) * p} y={700 + 300 * p}><Bill w={150} label="$1K" /></At>; })}</Live>
          <At x={330} y={560} at={w(2, 'phone')} until={S2}><Live>{(t) => <Phone w={150} glow={1 + Math.sin(t * 8) * 0.3} />}</Live></At>
          <At x={170} y={420} at={w(2, 'credit')} enter="slideL" until={S2}><Card w={200} label="CREDIT" /></At>
          <At x={330} y={800} at={w(2, 'credit')} enter="drop" until={S2}><Tag text="-$1,000" color={C.red} w={250} /></At>
          <At x={760} y={560} at={w(3, 'index')} enter="drop" until={S2}><Tag text="INDEX FUND" color={C.green} w={320} /></At>
          <At x={900} y={420} at={w(3, 'fund')} until={S2}><Arrow w={110} color={C.green} /></At>
        </>)}

        {/* ── S2 dark: 30 years later ── */}
        {within(S2, S3, <>
          <BigNum x={540} y={560} at={S2 + 0.05} from={0} to={30} dur={0.5} fmt={(n) => `${Math.round(n)} YEARS`} size={140} color="#F2C14E" glow="#F2C14E" />
          <Txt x={540} y={720} size={56} color="#F6E7CF" at={w(4, 'gap')}>THE GAP?</Txt>
        </>)}

        {/* ── S3 room: Benny's phone ── */}
        {within(S3, S3b, <>
          <At x={720} y={640} at={S3 + 0.1}><Live>{(t) => <Phone w={200} glow={t < w(5, 'losing') ? 1 : 0.2} />}</Live></At>
          <At x={720} y={360} at={w(5, 'losing')} enter="drop"><Tag text="VALUE ↓" color={C.red} w={280} /></At>
          <At x={720} y={640} at={w(6, 'bill')} enter="drop"><Receipt w={380} rows={[['New phone', '$1,000'], ['APR', '22%', C.red]]} /></At>
        </>)}

        {/* ── S3b dark: 22% → $50/mo → 25 months → $1,260 ── */}
        {within(S3b, S4, <>
          <BigNum x={540} y={420} at={w(7, 'Twenty-two')} from={0} to={22} dur={0.4} fmt={(n) => Math.round(n) + '%'} size={200} color={C.red} glow="#FF6B5B" until={L(8).start} />
          <At x={540} y={640} at={w(7, 'fifty')} enter="drop" until={L(8).start}><Tag text="$50 / MONTH" color={C.gold} w={340} /></At>
          <FlipCal x={300} y={560} w={260} label="MONTH" items={[[L(8).start, '1'], [L(8).start + 0.25, '6'], [L(8).start + 0.5, '12'], [L(8).start + 0.75, '18'], [L(8).start + 1.0, '25']]} />
          <BigNum x={720} y={520} at={w(8, 'twelve')} from={1000} to={1260} dur={0.8} fmt={usd} size={150} color={C.red} glow="#FF6B5B" />
          <Txt x={720} y={650} size={40} color="#F6E7CF" at={w(8, 'one-thousand')}>for a $1,000 phone</Txt>
        </>)}

        {/* ── S4 light: Rick's boring index fund grows ── */}
        {within(S4, S5, <>
          <Write text="Boring." x={540} y={420} at={w(9, 'Boring')} dur={0.4} size={90} until={L(10).start} />
          <GrowthBars x={540} y={560} at={w(10, 'averaged')} rate={0.1} step={5} years={7} />
          <Live>{(t) => t >= w(10, 'ten') && t < L(11).start ? <Txt x={540} y={280} size={64} color={C.green}>≈ 10% / YEAR</Txt> : null}</Live>
          <BigNum x={540} y={270} at={w(11, 'seventeen')} from={1000} to={17449} dur={0.9} fmt={usd} size={130} color={C.green} glow="#9BE59B" until={L(12).start} />
          {within(L(12).start, S5, <>
            <Txt x={280} y={300} size={44} color={C.red}>CARD: AGAINST YOU</Txt>
            <Txt x={800} y={300} size={44} color={C.green} at={w(12, 'Index')}>INDEX: FOR YOU</Txt>
          </>)}
          <Txt x={540} y={850} size={30} at={w(11, 'thirty')} until={L(12).start}>historical average, not guaranteed</Txt>
        </>)}

        {/* ── S5 dark: the catch, crash; then light: emergency fund ── */}
        {within(S5, L(14).start, <>
          <CrashLine x={540} y={560} at={S5 + 0.2} />
          <BigNum x={760} y={340} at={w(13, 'thirty')} from={0} to={-30} dur={0.5} fmt={(n) => Math.round(n) + '%'} size={130} color={C.red} glow="#FF6B5B" />
          <Txt x={540} y={850} size={50} color="#F6E7CF" at={w(13, 'panic')}>DON'T PANIC</Txt>
        </>)}
        {within(L(14).start, S6, <>
          <SketchBox x={540} y={560} w={460} h={360} at={L(14).start + 0.1} fill="#FFF8E8"><Wallet w={260} label="SAFE" /></SketchBox>
          <Write text="EMERGENCY FUND" x={540} y={330} at={w(14, 'emergency')} dur={0.5} size={58} under={C.green} />
          <Stamp x={700} y={720} at={w(14, 'sell low')} text="NO SELLING LOW" color={C.green} size={40} />
        </>)}

        {/* ── S6 street: Benny isn't dumb → pay cash, invest next bonus ── */}
        {within(S6, S7, <>
          <At x={540} y={480} at={w(15, 'needed')} enter="drop" until={L(16).start}><Tag text="NEEDED IT" color={C.gold} w={300} /></At>
          <At x={420} y={620} at={L(16).start} until={w(16, 'invest')}><Phone w={140} /></At>
          <Live>{(t) => { const a = w(16, 'cash'); if (t < a || t >= L(17).start) return null; const p = ramp(t, a, a + 0.4); return <At x={200 + 200 * p} y={760 - 120 * p}><Bill w={160} label="CASH" /></At>; }}</Live>
          <Stamp x={540} y={380} at={w(16, 'cash') + 0.4} until={w(16, 'invest')} text="PAID IN CASH" color={C.green} size={44} />
          <At x={540} y={560} at={w(16, 'invest')} enter="drop" until={L(17).start}><Tag text="NEXT BONUS → INVEST" color={C.green} w={420} /></At>
          {within(L(17).start, S7, <>
            <At x={380} y={620}><Live>{(t) => <Stack w={260} n={ramp(t, L(17).start, L(17).end, 2, 8)} />}</Live></At>
            <At x={700} y={620}><Live>{(t) => <Stack w={300} n={ramp(t, L(17).start, L(17).end, 2, 20)} />}</Live></At>
            <DrawArrow from={[460, 420]} to={[640, 360]} at={w(17, 'gap')} color={C.green} />
          </>)}
        </>)}

        {/* ── S7 caramel: final split ── */}
        {within(S7, BONUS_SECONDS, <>
          <Write text="SAME $1,000" x={540} y={330} at={S7 + 0.05} dur={0.4} size={76} />
          <Stamp x={270} y={560} at={w(18, 'bank')} text="PAID THE BANK" color={C.red} size={40} rot={-8} />
          <Stamp x={810} y={560} at={w(18, 'future')} text="PAID THE FUTURE" color={C.green} size={40} rot={8} />
          <At x={810} y={700} at={w(18, 'future')}><Sparkles w={300} at={w(18, 'future')} /></At>
        </>)}

        {/* ── Actors (walk / turn / react) ── */}
        <Actor keys={[
          {t: 0, pose: 'benny-front', x: -200, feet: 1690, h: 680}, {t: 0.6, x: 260}, {t: L(2).start, pose: 'benny-excited', act: 'jump'}, {t: S2, pose: 'benny-thinking-03', x: 250, h: 560, feet: 1650},
          {t: S3, pose: 'benny-excited', x: 300, h: 720, feet: 1700}, {t: w(5, 'losing'), pose: 'benny-thinking-03'}, {t: L(6).start, pose: 'benny-shocked', act: 'jump'},
          {t: S3b, pose: 'benny-worried', x: 250, h: 640}, {t: L(8).start, pose: 'benny-sad-02', act: 'shake'}, {t: S4, pose: null},
          {t: L(12).start, pose: 'benny-sad-02', x: 260, h: 600, feet: 1680}, {t: S5, pose: null},
          {t: S6, pose: 'benny-front', x: -200, h: 680, feet: 1690}, {t: S6 + 0.6, x: 300, act: 'nod'}, {t: L(16).start, pose: 'benny-saving-cash'}, {t: L(17).start, pose: 'benny-excited', x: 380, act: 'jump'},
          {t: S7, pose: 'benny-sad-02', x: 270, h: 640, feet: 1690}, {t: L(19).start, pose: 'benny-thinking-03', act: 'nod'}]} />
        <Actor keys={[
          {t: 0, pose: 'rich-front', x: 1280, feet: 1690, h: 680, flip: false}, {t: 0.6, x: 820}, {t: L(3).start, pose: 'rich-pointing-chart', act: 'punch'}, {t: S2, pose: 'rich-arms-crossed', x: 830, h: 560, feet: 1650},
          {t: S3, pose: null}, {t: S4, pose: 'rich-chair-relax', x: 540, h: 600, feet: 1690}, {t: w(9, 'Boring'), pose: 'rich-sleeping'}, {t: L(10).start, pose: 'rich-pointing-chart', x: 820},
          {t: L(11).start, pose: 'rich-jump-money-rain', act: 'jump'}, {t: L(12).start, pose: 'rich-thumbs-up', x: 820, h: 600},
          {t: S5, pose: 'rich-shocked', x: 540, h: 640, act: 'shake'}, {t: w(13, 'still'), pose: 'rich-arms-crossed', act: 'nod'}, {t: L(14).start, pose: 'rich-money-bag-hug', x: 820, h: 600},
          {t: S6, pose: null}, {t: L(17).start, pose: 'rich-front', x: 1280, flip: true}, {t: L(17).start + 0.7, x: 860, flip: false},
          {t: S7, pose: 'rich-arms-crossed', x: 810, h: 640, feet: 1690}, {t: L(19).start, pose: 'rich-thumbs-up', act: 'nod'}]} />
      </ShotCam>

      <OutlineCaptions lines={lines} end={BONUS_SECONDS} y={940} size={64} />
    </Scene>

    <Sfx at={0.02} name="impact" vol={0.6} /><Sfx at={0.05} name="cha-ching" vol={0.4} /><Sfx at={0.1} name="whoosh" vol={0.3} />
    <Sfx at={w(2, 'phone')} name="pop" /><Sfx at={w(2, 'credit')} name="tick" vol={0.6} /><Sfx at={w(3, 'index')} name="ding" vol={0.3} />
    {WHIPS.map((t, i) => <Sfx key={i} at={t - 0.1} name="whoosh" vol={0.45} />)}
    <Sfx at={w(5, 'losing')} name="sad-horn" vol={0.15} /><Sfx at={w(6, 'bill')} name="thud" /><Sfx at={w(7, 'Twenty-two')} name="impact" vol={0.5} />
    <Sfx at={L(8).start} name="flip" /><Sfx at={L(8).start + 0.5} name="flip" /><Sfx at={L(8).start + 1.0} name="flip" /><Sfx at={w(8, 'twelve')} name="error" vol={0.3} />
    <Sfx at={w(9, 'Boring')} name="pop" vol={0.3} /><Sfx at={w(10, 'averaged')} name="riser" vol={0.2} /><Sfx at={w(11, 'seventeen')} name="cash-rain" vol={0.45} />
    <Sfx at={w(13, 'thirty')} name="crack" vol={0.45} /><Sfx at={w(14, 'sell low')} name="impact" vol={0.4} />
    <Sfx at={w(16, 'cash') + 0.4} name="impact" vol={0.4} /><Sfx at={w(17, 'gap')} name="spring" vol={0.3} />
    <Sfx at={w(18, 'bank')} name="impact" vol={0.45} /><Sfx at={w(18, 'future')} name="cha-ching" vol={0.4} /><Sfx at={w(19, 'Comment')} name="pop" />
  </AbsoluteFill>
);
