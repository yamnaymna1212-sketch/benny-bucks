// EP8 "Credit score: same $25,000 car, Doug pays $10,000 more". Hook image first (approval).
// Numbers: $25,000 used car, 60 months. APR by VantageScore tier, Experian Q1 2026 (used): 501-600 = 19.42%, 781-850 = 6.30%.
// Interest: 19.42% -> $14,258 ; 6.30% -> $4,209 ; difference ~ $10,049.
import React from 'react';
import {AbsoluteFill} from 'remotion';
import {Fonts, HandFont} from '../base';
import {INK, Penguin} from '../penguin/rig';
import {Car, Otter} from './dougFriend';

const G = 1300;
const RED = '#D83A2E', GREEN = '#2E9E4F';

const Score = ({x, y, n, color, who}: {x: number; y: number; n: number; color: string; who: string}) =>
  <div style={{position: 'absolute', left: x - 200, width: 400, top: y, textAlign: 'center'}}>
    <div style={{fontFamily: 'Montserrat', fontWeight: 900, fontSize: 40, color: INK, letterSpacing: 2}}>{who}</div>
    <div style={{display: 'inline-block', marginTop: 6, background: color, color: '#fff', border: `7px solid ${INK}`, borderRadius: 26, padding: '0 34px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 130, lineHeight: '150px'}}>{n}</div>
  </div>;

const Tag = ({x, y, text, color, size = 88}: {x: number; y: number; text: string; color: string; size?: number}) =>
  <div style={{position: 'absolute', left: x - 250, width: 500, top: y, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: size, color, WebkitTextStroke: `4px ${INK}`, paintOrder: 'stroke fill'}}>{text}</div>;

export const CreditHook = () => <>
  <div style={{position: 'absolute', left: 538, top: 380, width: 6, height: 1150, background: INK, opacity: 0.85}} />
  <div style={{position: 'absolute', left: -400, right: -400, top: G, height: 700, background: '#E4F4FC', borderTop: `5px solid ${INK}`}} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 130, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 84, lineHeight: '96px', color: INK, transform: 'rotate(-2deg)'}}>
    same car<span style={{color: RED}}>.</span> same price<span style={{color: RED}}>.</span>
  </div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 330, textAlign: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 64, color: INK}}>$25,000 USED CAR</div>
  <Score x={270} y={450} n={550} color={RED} who="DOUG" />
  <Score x={810} y={450} n={790} color={GREEN} who="FRIEND" />
  <Car x={270} y={G + 150} w={400} kind="pickup" color="#C8352B" t={0} />
  <Car x={810} y={G + 150} w={400} kind="pickup" color="#C8352B" t={0} />
  <Tag x={270} y={700} text="+$14,258" color={RED} size={96} />
  <Tag x={810} y={700} text="+$4,209" color={GREEN} size={96} />
  <div style={{position: 'absolute', left: 0, right: 0, top: 850, textAlign: 'center'}}>
    <span style={{display: 'inline-block', background: RED, color: '#fff', border: `8px solid ${INK}`, borderRadius: 30, padding: '8px 44px', fontFamily: 'Montserrat', fontWeight: 900, fontSize: 112, transform: 'rotate(-3deg)'}}>$10,000 MORE</span>
  </div>
  <div style={{position: 'absolute', left: 0, right: 0, top: 1075, textAlign: 'center', fontFamily: 'Architects Daughter', fontWeight: 700, fontSize: 44, color: INK}}>interest on the same loan (60 months)</div>
  <Penguin id="doug" x={270} y={G + 560} h={330} pose={{turn: 0.5, look: [0.4, -0.5], brows: 'shock', eyeScale: 1.35, sweat: true, tears: true}} />
  <Otter x={810} y={G + 560} h={320} flip t={0} />
</>;

export const DOUG_CREDIT_HOOK_SECONDS = 3;
export const DougCreditHook = () => <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}><Fonts /><HandFont /><CreditHook /></AbsoluteFill>;
