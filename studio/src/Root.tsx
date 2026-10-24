import {Composition} from 'remotion';
import {PenguinWorld} from './videos/penguinWorld';
import {PenguinCast2} from './videos/penguinCast2';
import {DougGas, DOUG_GAS_SECONDS} from './videos/dougGas';
import {DougRent, DOUG_RENT_SECONDS} from './videos/dougRent';
import {DougVenezuela, DOUG_VENEZUELA_SECONDS} from './videos/dougVenezuela';
import {DougCarHook, HOOK_SECONDS as CAR_HOOK_SECONDS} from './videos/dougCar';
import {DougCar, DOUG_CAR_SECONDS} from './videos/dougCarEp';
import {DougLibyaHook, LIBYA_HOOK_SECONDS} from './videos/dougLibya';
import {DougLaundering, DOUG_LAUNDERING_SECONDS} from './videos/dougLaundering';
export const Root = () => (
  <>
    <Composition id="doug-rent" component={DougRent} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_RENT_SECONDS * 30)} />
    <Composition id="doug-gas" component={DougGas} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_GAS_SECONDS * 30)} />
    <Composition id="doug-venezuela" component={DougVenezuela} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_VENEZUELA_SECONDS * 30)} />
    <Composition id="doug-laundering" component={DougLaundering} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_LAUNDERING_SECONDS * 30)} />
    <Composition id="doug-car-hook" component={DougCarHook} width={1080} height={1920} fps={30} durationInFrames={Math.round(CAR_HOOK_SECONDS * 30)} />
    <Composition id="doug-car" component={DougCar} width={1080} height={1920} fps={30} durationInFrames={Math.round(DOUG_CAR_SECONDS * 30)} />
    <Composition id="doug-libya-hook" component={DougLibyaHook} width={1080} height={1920} fps={30} durationInFrames={Math.round(LIBYA_HOOK_SECONDS * 30)} />
    <Composition id="penguin-cast2" component={PenguinCast2} width={1080} height={1920} fps={30} durationInFrames={60} />
    <Composition id="penguin-world" component={PenguinWorld} width={1080} height={1920} fps={30} durationInFrames={60} />
  </>
);
