import {Composition} from 'remotion';
import {GasIran, GAS_IRAN_SECONDS} from './videos/gasIran';
export const Root = () => (
  <Composition id="gas-iran" component={GasIran} width={1080} height={1920} fps={30}
    durationInFrames={Math.ceil(GAS_IRAN_SECONDS * 30)} />
);
