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

export type Network = {
  id: string;
  epochAdjustment: number;
  generationHashSeed: string;
  identifier: string;
};

const collectionPath = '/v/1/configs/symbol/network';
// const collectionRef = collection(db, collectionPath).withConverter(
//   converter<Network>()
// );
const docPath = `${collectionPath}/info`;
const docRef = () => doc(db, docPath).withConverter(converter<Network>());

export const getNetworkInfo = async (): Promise<Network | undefined> => {
  return (await getDoc(docRef())).data();
};

export const setNetworkInfo = async (network: Network): Promise<void> => {
  await setDoc(docRef(), network, { merge: true });
};
