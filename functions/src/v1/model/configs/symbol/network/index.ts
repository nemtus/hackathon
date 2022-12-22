import { db } from '../../../../../utils/firebase';
import { converter } from '../../../../../utils/firebase/converter';

export type Network = {
  id: string;
  epochAdjustment: number;
  generationHashSeed: string;
  identifier: string;
};

export const networkConverter = converter<Network>();

const collectionPath = '/v/1/configs/symbol/network';
// const collectionRef = db
//   .collection(collectionPath)
//   .withConverter(converter<Network>());
const docPath = `${collectionPath}/info`;
const docRef = db.doc(docPath).withConverter(converter<Network>());

export const getNetworkInfo = async (): Promise<Network | undefined> => {
  return (await docRef.get()).data();
};

export const setNetworkInfo = async (network: Network): Promise<void> => {
  await docRef.set(network, { merge: true });
};
