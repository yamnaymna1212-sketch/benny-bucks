// EP4 "Full tank: $66 in the USA vs $0.45 in Iran" — hook = WhyHook main template.
import React from 'react';
import {WhyHook} from '../penguin/whyHook';

export const DougGasIranHook = () => <WhyHook
  left={{flag: 'usa', price: '$66', unit: 'FULL TANK', obj: 'pump', color: '#2F5DA8'}}
  right={{flag: 'iran', price: '$0.45', unit: 'FULL TANK', obj: 'pump', color: '#2E9E4F'}} />;
