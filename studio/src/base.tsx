// Shared basics for the Doug channel: frame rate, SFX level, fonts.
import React from 'react';
import {staticFile} from 'remotion';

export const FPS = 30;
export const SFX_GAIN = 0.35;
export const HAND = 'Architects Daughter';
export const Fonts = () => <style>{`@font-face{font-family:Montserrat;src:url(${staticFile('fonts/Montserrat.ttf')});font-weight:100 900}`}</style>;
export const HandFont = () => <style>{`@font-face{font-family:'${HAND}';src:url(${staticFile('fonts/ArchitectsDaughter.ttf')})}`}</style>;
