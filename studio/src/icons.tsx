// Icons for spoken words — hand-drawn, never 3D (user rule). Priority:
//  img:<name>   the user's own colored-pencil assets (studio/public/gen/<name>.png: bank, government-office, rial-stack…)
//  prop:<Name>  our hand-drawn SVG props (props.tsx: Stack, Bill, Receipt, House, Plane, Calendar…)
//  doodle:<Name> Doodle Icons by Khushmeen Sidhu (CC0, @doodle-icons/react) on a pastel paper sticker
//  brand:<siKey> real brand logos from simple-icons (nominative use only)
// <AutoIcons> pops the matching icon on the exact word, alternating left/right gutters beside the character.
import React from 'react';
import {Audio, Img, Sequence, spring, staticFile, useCurrentFrame} from 'remotion';
import * as SI from 'simple-icons';
import * as DD from '@doodle-icons/react';
import {C, FPS, SFX_GAIN, useT} from './engine';
import {Stack, Bill, Receipt, House, Plane, Calendar, Coin, Wallet, Card} from './props';

export const ICON_WORDS: Record<string, string> = {
  money: 'img:rial-stack', million: 'img:rial-stack', millions: 'img:rial-stack', cash: 'img:rial-stack', billion: 'img:rial-stack', fortune: 'img:rial-stack',
  dollar: 'prop:Bill', dollars: 'prop:Bill', bucks: 'prop:Bill', salary: 'prop:Bill', salaries: 'prop:Bill', paycheck: 'prop:Bill',
  bank: 'img:bank', banks: 'img:bank', irs: 'img:government-office', government: 'img:government-office',
  tax: 'prop:Receipt', taxes: 'prop:Receipt', bill: 'prop:Receipt', bills: 'prop:Receipt', fee: 'prop:Receipt', receipt: 'prop:Receipt',
  house: 'prop:House', home: 'prop:House', estate: 'prop:House', rent: 'prop:House', jet: 'prop:Plane', plane: 'prop:Plane', flight: 'prop:Plane', trips: 'prop:Plane',
  year: 'prop:Calendar', years: 'prop:Calendar', month: 'prop:Calendar', coin: 'prop:Coin', wallet: 'prop:Wallet', card: 'prop:Card',
  billionaire: 'doodle:Diamond', billionaires: 'doodle:Diamond', rich: 'doodle:Diamond', charity: 'doodle:Heart', charitable: 'doodle:Heart',
  foundation: 'doodle:Bank', foundations: 'doodle:Bank', helping: 'doodle:Hand', others: 'doodle:User', board: 'doodle:User', family: 'doodle:User', kids: 'doodle:UserMale',
  president: 'doodle:Crown', king: 'doodle:Crown', ceo: 'doodle:Crown', papers: 'doodle:FileContract', paper: 'doodle:FileContract', donates: 'doodle:Gift', donation: 'doodle:Gift',
  deductible: 'doodle:Tick', legal: 'doodle:Tick', income: 'doodle:Suitcase', job: 'doodle:Suitcase', vacations: 'doodle:Sun', vacation: 'doodle:Sun',
  'self-dealing': 'doodle:Caution', illegal: 'doodle:Caution', invested: 'doodle:TrendUp', investments: 'doodle:TrendUp', growing: 'doodle:TrendUp', stocks: 'doodle:TrendUp',
  control: 'doodle:Lock', decades: 'doodle:Clock', best: 'doodle:InterfaceTrophy', tricks: 'doodle:Bulb', idea: 'doodle:Bulb', follow: 'doodle:Bell',
  philanthropist: 'doodle:Clap', savings: 'doodle:PiggyBank', save: 'doodle:PiggyBank', safe: 'doodle:Safe', car: 'doodle:Car', phone: 'doodle:Phone', burger: 'doodle:Burger',
  coffee: 'doodle:CoffeeCup1', gift: 'doodle:Gift', shop: 'doodle:Shop', ambulance: 'doodle:FirstAid', hospital: 'doodle:MedicalLogo', school: 'doodle:Bulb',
  truck: 'doodle:Truck', cars: 'doodle:Car', roads: 'doodle:Navigation', schools: 'doodle:Bus', form: 'doodle:FileForm',
  ski: 'doodle:Ship', dealer: 'doodle:Shop', interest: 'doodle:TrendUp', jail: 'doodle:Lock', prison: 'doodle:Lock', penalty: 'doodle:Caution', felony: 'doodle:Caution',
  woods: 'doodle:Tree', forest: 'doodle:Tree', robbed: 'doodle:SadEmoji', sad: 'doodle:SadEmoji', happy: 'doodle:HappyEmoji',
  facebook: 'brand:siFacebook', instagram: 'brand:siInstagram', tiktok: 'brand:siTiktok', youtube: 'brand:siYoutube', uber: 'brand:siUber',
  apple: 'brand:siApple', iphone: 'brand:siApple', google: 'brand:siGoogle', tesla: 'brand:siTesla', netflix: 'brand:siNetflix', paypal: 'brand:siPaypal',
  visa: 'brand:siVisa', mastercard: 'brand:siMastercard', mcdonalds: 'brand:siMcdonalds', starbucks: 'brand:siStarbucks', nike: 'brand:siNike', walmart: 'brand:siWalmart',
};

const brand = (key: string) => (SI as unknown as Record<string, {path: string; hex: string} | undefined>)[key];
const doodle = (key: string) => (DD as unknown as Record<string, React.ComponentType<{size?: number; color?: string}> | undefined>)[key];
const PASTEL = ['#FFE7A3', '#CDEBD3', '#FAD2CF', '#D6E4FA', '#EBDDF8'];
const PROPS: Record<string, (w: number) => JSX.Element> = {
  Stack: (w) => <Stack w={w} n={12} />, Bill: (w) => <Bill w={w} label="$100" />, Receipt: (w) => <Receipt w={w * 0.8} rows={[['TAX', '$$$', C.red]]} />,
  House: (w) => <House w={w} />, Plane: (w) => <Plane w={w} />, Calendar: (w) => <Calendar w={w} month="YEAR" />, Coin: (w) => <Coin w={w * 0.8} label="$" />,
  Wallet: (w) => <Wallet w={w} />, Card: (w) => <Card w={w} label="CARD" />,
};
export const iconExists = (id: string) => { const [k, v] = id.split(':');
  return k === 'brand' ? !!brand(v) : k === 'doodle' ? !!doodle(v) : k === 'prop' ? !!PROPS[v] : k === 'img'; };
export const IconArt = ({id, size}: {id: string; size: number}) => {
  const [kind, v] = id.split(':');
  if (kind === 'brand') { const b = brand(v); if (!b) return null;
    return <div style={{width: size, height: size, borderRadius: size * 0.22, background: '#fff', border: `5px solid ${C.ink}`, boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 24 24"><path d={b.path} fill={`#${b.hex}`} /></svg></div>; }
  if (kind === 'doodle') { const D = doodle(v); if (!D) return null; const bg = PASTEL[v.length % PASTEL.length];
    return <div style={{width: size, height: size, position: 'relative'}}>
      <svg width={size} height={size} viewBox="0 0 100 100" style={{position: 'absolute', inset: 0}}><path d="M50 4 C76 3 97 22 96 50 C95 77 77 97 49 96 C22 95 4 77 5 49 C6 23 25 5 50 4 Z" fill={bg} /></svg>
      <div style={{position: 'absolute', inset: size * 0.16}}><D size={size * 0.68} color={C.ink} /></div></div>; }
  if (kind === 'prop') return <div style={{width: size, display: 'flex', justifyContent: 'center'}}>{PROPS[v]?.(size)}</div>;
  return <Img src={staticFile(`gen/${v}.png`)} style={{width: size * 1.15, display: 'block'}} />;
};

type Tim = {text: string; start: number; end: number}[];
export const iconEvents = (tim: Tim, skipLines: number[] = [0]) => {
  const ev: {t: number; until: number; id: string; slot: number}[] = [];
  let slot = 0, lastT = -9, lastId = '';
  tim.forEach((l, li) => {
    if (skipLines.includes(li)) return;
    let i = 0;
    for (const raw of l.text.split(' ')) {
      const at = l.text.indexOf(raw, i); i = at + raw.length;
      const key = raw.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-+$/, '');
      const id = ICON_WORDS[key] ?? ICON_WORDS[key.replace(/s$/, '')];
      if (!id || id === lastId) continue;
      if (!iconExists(id)) continue;
      const t = l.start + (l.end - l.start) * (at / l.text.length);
      if (t - lastT < 0.45) continue;
      ev.push({t, until: l.end + 0.15, id, slot}); slot = 1 - slot; lastT = t; lastId = id;
    }
  });
  // an icon leaves when the next icon takes its slot
  ev.forEach((e, k) => { const nx = ev.slice(k + 1).find((o) => o.slot === e.slot); if (nx) e.until = Math.min(e.until, nx.t); e.until = Math.min(e.until, e.t + 2.2); });
  return ev;
};

const SLOTS = [[165, 1180], [915, 1180]];
const One = ({t0, until, id, slot, size}: {t0: number; until: number; id: string; slot: number; size: number}) => {
  const t = useT();
  if (t < t0 || t >= until) return null;
  const p = spring({frame: Math.round((t - t0) * FPS), fps: FPS, config: {damping: 13, stiffness: 420, mass: 0.6}});
  const out = Math.min(1, Math.max(0, (until - t) / 0.12));
  const [x, y] = SLOTS[slot];
  const fl = Math.sin(t * 2.6 + slot) * 8;
  return <div style={{position: 'absolute', left: x, top: y + fl, transform: `translate(-50%,-50%) scale(${p * out}) rotate(${(slot ? 8 : -8) * (1 - p) + (slot ? 4 : -4)}deg)`}}><IconArt id={id} size={size} /></div>;
};
export const AutoIcons = ({tim, skipLines, size = 210}: {tim: Tim; skipLines?: number[]; size?: number}) => {
  const ev = iconEvents(tim, skipLines);
  const frame = useCurrentFrame(), base = useT() - frame / FPS;
  return <>{ev.map((e, k) => <React.Fragment key={k}>
    <One t0={e.t} until={e.until} id={e.id} slot={e.slot} size={size} />
    <Sequence from={Math.round((e.t - base) * FPS)} layout="none"><Audio src={staticFile('sfx/pop.wav')} volume={0.16 * SFX_GAIN} /></Sequence>
  </React.Fragment>)}</>;
};
