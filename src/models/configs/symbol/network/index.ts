import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db } from '../../../../../utils/firebase';
import { omitUndefinedProperties } from '../../../../../utils/typescript/omitUndefinedProperties';

export type Network = {
  id: string;
  epochAdjustment: number;
  generationHashSeed: string;
  identifier: string;
};

export const networkConverter = {
  toFirestore: (network: Network): DocumentData => {
    return omitUndefinedProperties({
      id: network.id,
      epochAdjustment: network.epochAdjustment,
      generationHashSeed: network.generationHashSeed,
      identifier: network.identifier,
    });
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): Network => {
    const data = snapshot.data();
    return {
      id: data.id,
      epochAdjustment: data.epochAdjustment,
      generationHashSeed: data.generationHashSeed,
      identifier: data.identifier,
    };
  },
};

const collectionPath = '/v/1/configs/symbol/network';
const docPath = `${collectionPath}/info`;

export const getNetworkInfo = async (): Promise<Network | undefined> => {
  const networkInfoSnapshot = await db
    .doc(docPath)
    .withConverter(networkConverter)
    .get();
  const networkInfo = networkInfoSnapshot.data();
  return networkInfo;
};

export const setNetworkInfo = async (network: Network): Promise<void> => {
  await db
    .doc(docPath)
    .withConverter(networkConverter)
    .set(network, { merge: true });
};
