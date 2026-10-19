import {Composition} from 'remotion';
import {WhyHookDemo} from './penguin/whyHook';
import {DougDoorDashHook} from './videos/dougDoorDash';
import {DougCashCard, DougCashCardHook, DougCashCardHookV2, DOUG_CASH_CARD_SECONDS} from './videos/dougCashCard';
import {DougGasIran, DougGasIranHook, DOUG_GAS_IRAN_SECONDS} from './videos/dougGasIran';
import {PenguinWorld} from './videos/penguinWorld';
import {PenguinCast2} from './videos/penguinCast2';
import {DougGas, DOUG_GAS_SECONDS} from './videos/dougGas';
import {DougInflation, DOUG_INFLATION_SECONDS} from './videos/dougInflation';
import {DougRent, DOUG_RENT_SECONDS} from './videos/dougRent';
export const Root = () => (
  <>
    <Composition id="doug-gas-iran" component={DougGasIran} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_GAS_IRAN_SECONDS * 30)} />
    <Composition id="doug-gas-iran-hook" component={DougGasIranHook} width={1080} height={1920} fps={30} durationInFrames={150} />
    <Composition id="doug-cash-card" component={DougCashCard} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_CASH_CARD_SECONDS * 30)} />
    <Composition id="doug-cash-card-hook-v2" component={DougCashCardHookV2} width={1080} height={1920} fps={30} durationInFrames={90} />
    <Composition id="doug-cash-card-hook" component={DougCashCardHook} width={1080} height={1920} fps={30} durationInFrames={150} />
    <Composition id="doug-doordash-hook" component={DougDoorDashHook} width={1080} height={1920} fps={30} durationInFrames={150} />
    <Composition id="doug-why-hook" component={WhyHookDemo} width={1080} height={1920} fps={30} durationInFrames={90} />
    <Composition id="doug-rent" component={DougRent} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_RENT_SECONDS * 30)} />
    <Composition id="doug-gas" component={DougGas} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_GAS_SECONDS * 30)} />
    <Composition id="penguin-cast2" component={PenguinCast2} width={1080} height={1920} fps={30} durationInFrames={60} />
    <Composition id="doug-inflation" component={DougInflation} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_INFLATION_SECONDS * 30)} />
    <Composition id="penguin-world" component={PenguinWorld} width={1080} height={1920} fps={30} durationInFrames={60} />
  </>
);
