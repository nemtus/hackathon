import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db } from '../../../../../utils/firebase';
import { omitUndefinedProperties } from '../../../../../utils/typescript/omitUndefinedProperties';

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

export const chainConverter = {
  toFirestore: (chain: Partial<Chain>): DocumentData => {
    return omitUndefinedProperties({
      id: chain.id,
      blockGenerationTargetTime: chain.blockGenerationTargetTime,
      currencyMosaicId: chain.currencyMosaicId,
      defaultDynamicFeeMultiplier: chain.defaultDynamicFeeMultiplier,
      harvestingMosaicId: chain.harvestingMosaicId,
      latestBlockHeight: chain.latestBlockHeight,
      latestFinalizedBlockHeight: chain.latestFinalizedBlockHeight,
      maxTransactionLifeTime: chain.maxTransactionLifeTime,
      maxTransactionPerBlock: chain.maxTransactionPerBlock,
    });
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): Chain => {
    const data = snapshot.data();
    return {
      id: data.id,
      blockGenerationTargetTime: data.blockGenerationTargetTime,
      currencyMosaicId: data.currencyMosaicId,
      defaultDynamicFeeMultiplier: data.defaultDynamicFeeMultiplier,
      harvestingMosaicId: data.harvestingMosaicId,
      latestBlockHeight: data.latestBlockHeight,
      latestFinalizedBlockHeight: data.latestFinalizedBlockHeight,
      maxTransactionLifeTime: data.maxTransactionLifeTime,
      maxTransactionPerBlock: data.maxTransactionPerBlock,
    } as Chain;
  },
};

const collectionPath = '/v/1/configs/symbol/chain';
const docPath = `${collectionPath}/info`;

export const getChainInfo = async (): Promise<Chain | undefined> => {
  const nodeSnapshot = await db
    .doc(docPath)
    .withConverter(chainConverter)
    .get();
  const node = nodeSnapshot.data();
  return node;
};

export const setChainInfo = async (
  chainInfo: Partial<Chain>
): Promise<void> => {
  await db
    .doc(docPath)
    .withConverter(chainConverter)
    .set(chainInfo, { merge: true });
};
