// EP5 "Cash vs card: the same $10 passed 20 times" (swipe-fee chain) — WhyHook main template (Edit rules v4).
import React from 'react';
import {WhyHook} from '../penguin/whyHook';
import {INK} from '../penguin/rig';

const Cash = ({w = 250}: {w?: number}) =>
  <div style={{width: w, height: w * 0.45, background: '#CFE8C8', border: `6px solid ${INK}`, borderRadius: 12, boxShadow: 'inset 0 0 0 10px #B5D9AB',
    display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat', fontWeight: 900, fontSize: w * 0.26, color: INK, transform: 'rotate(-6deg)'}}>$10</div>;
const Card = ({w = 250}: {w?: number}) =>
  <div style={{width: w, height: w * 0.62, background: '#2F5DA8', border: `6px solid ${INK}`, borderRadius: 18, position: 'relative', transform: 'rotate(6deg)'}}>
    <div style={{position: 'absolute', left: 24, top: 34, width: 52, height: 40, background: '#F5C518', border: `4px solid ${INK}`, borderRadius: 8}} />
    <div style={{position: 'absolute', left: 24, bottom: 22, right: 24, height: 12, background: 'rgba(255,255,255,0.7)', borderRadius: 6}} />
  </div>;

export const DougCashCardHook = () => <WhyHook
  left={{label: 'CASH', price: '$10', unit: 'STAYS $10', obj: <Cash />}}
  right={{label: 'CARD', price: '$10', unit: 'BECOMES $6.20', obj: <Card />}} />;
