import {Composition} from 'remotion';
import {GasIran, GAS_IRAN_SECONDS} from './videos/gasIran';
import {CashVsCard, CASH_CARD_SECONDS} from './videos/cashVsCard';
import {RichGetRicher, RICH_SECONDS} from './videos/richGetRicher';
export const Root = () => (
  <>
    <Composition id="gas-iran" component={GasIran} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(GAS_IRAN_SECONDS * 30)} />
    <Composition id="cash-vs-card" component={CashVsCard} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(CASH_CARD_SECONDS * 30)} />
    <Composition id="rich-get-richer" component={RichGetRicher} width={1080} height={1920} fps={30} durationInFrames={Math.ceil(RICH_SECONDS * 30)} />
  </>
);
