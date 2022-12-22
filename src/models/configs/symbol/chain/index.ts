import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  // collection,
  // getDocs,
  // query,
  // orderBy,
  // startAt,
} from '../../../../utils/firebase';

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

const collectionPath = '/v/1/configs/symbol/chain';
// const collectionRef = collection(db, collectionPath).withConverter(
//   converter<Chain>()
// );
const docPath = `${collectionPath}/info`;
const docRef = () => doc(db, docPath).withConverter(converter<Chain>());

export const getChainInfo = async (): Promise<Chain | undefined> => {
  return (await getDoc(docRef())).data();
};

export const setChainInfo = async (
  chainInfo: Partial<Chain>
): Promise<void> => {
  await setDoc(docRef(), chainInfo, { merge: true });
};
