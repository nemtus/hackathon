import { db } from '../../../../../utils/firebase';
import { converter } from '../../../../../utils/firebase/converter';

export type Node = {
  id: string;
  isValidHttp?: boolean;
  isValidHttps?: boolean;
  isValidWs?: boolean;
  isValidWss?: boolean;
  isLatestBlockHeight?: boolean;
  latestBlockHeight?: number;
  updatedAt?: Date;
};

export type Nodes = Node[];

export const nodeConverter = converter<Node>();

const collectionPath = '/v/1/configs/symbol/nodes';
const collectionRef = db
  .collection(collectionPath)
  .withConverter(converter<Node>());
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  db.doc(docPath(id)).withConverter(converter<Node>());

export const getNode = async (id: string): Promise<Node | undefined> => {
  return (await docRef(id).get()).data();
};

export const setNode = async (node: Node): Promise<void> => {
  await docRef(node.id).set(node, { merge: true });
};

export const getAllNodes = async (): Promise<Nodes> => {
  return (await collectionRef.get()).docs.map((snapshot) => snapshot.data());
};

export const queryValidNodes = async (): Promise<Nodes> => {
  return (
    await collectionRef
      .where('isValidHttp', '==', true)
      .where('isValidHttps', '==', true)
      .where('isValidWs', '==', true)
      .where('isValidWss', '==', true)
      .where('isLatestBlockHeight', '==', true)
      .get()
  ).docs.map((snapshot) => snapshot.data());
};
