import { db } from '../../../../../utils/firebase';
import { converter } from '../../../../../utils/firebase/converter';

export type Chain = {
  id?: 'info';
  blockGenerationTargetTime?: number;
  currencyMosaicId?: string;
  defaultDynamicFeeMultiplier?: number;
  harvestingMosaicId?: string;
  latestBlockHeight: number;
  latestFinalizedBlockHeight: number;
  maxTransactionLifeTime?: number;
  maxTransactionPerBlock?: number;
};

export const chainConverter = converter<Chain>();

const collectionPath = '/v/1/configs/symbol/chain';
// const collectionRef = db
//   .collection(collectionPath)
//   .withConverter(converter<Chain>());
const docPath = `${collectionPath}/info`;
const docRef = db.doc(docPath).withConverter(converter<Chain>());

export const getChainInfo = async (): Promise<Chain | undefined> => {
  return (await docRef.get()).data();
};

export const setChainInfo = async (
  chainInfo: Partial<Chain>
): Promise<void> => {
  await docRef.set(chainInfo, { merge: true });
};
