import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db, FieldValue } from '../../../../../utils/firebase';
import { omitUndefinedProperties } from '../../../../../utils/typescript/omitUndefinedProperties';

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

export const nodeConverter = {
  toFirestore: (node: Node): DocumentData => {
    return omitUndefinedProperties({
      id: node.id,
      isValidHttp: node.isValidHttp,
      isValidHttps: node.isValidHttps,
      isValidWs: node.isValidWs,
      isValidWss: node.isValidWss,
      isLatestBlockHeight: node.isLatestBlockHeight,
      latestBlockHeight: node.latestBlockHeight,
      updatedAt: FieldValue.serverTimestamp(),
    });
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): Node => {
    const data = snapshot.data();
    return {
      id: data.id,
      isValidHttp: data.isValidHttp,
      isValidHttps: data.isValidHttps,
      isValidWs: data.isValidWs,
      isValidWss: data.isValidWss,
      isLatestBlockHeight: data.isLatestBlockHeight,
      latestBlockHeight: data.latestBlockHeight,
      updatedAt: data.createdAt?.toDate(),
    };
  },
};

const collectionPath = '/v/1/configs/symbol/nodes';
const docPath = (id: string) => `${collectionPath}/${id}`;

export const getNode = async (id: string): Promise<Node | undefined> => {
  const nodeSnapshot = await db
    .doc(docPath(id))
    .withConverter(nodeConverter)
    .get();
  const node = nodeSnapshot.data();
  return node;
};

export const setNode = async (node: Node): Promise<void> => {
  await db
    .doc(docPath(node.id))
    .withConverter(nodeConverter)
    .set(node, { merge: true });
};

export const getAllNodes = async (): Promise<Nodes> => {
  const nodesSnapshot = await db
    .collection(collectionPath)
    .withConverter(nodeConverter)
    .get();
  const nodes = nodesSnapshot.docs.map((nodeSnapshot) => nodeSnapshot.data());
  return nodes;
};

export const queryValidNodes = async (): Promise<Nodes> => {
  const nodesSnapshot = await db
    .collection(collectionPath)
    .withConverter(nodeConverter)
    .where('isValidHttp', '==', true)
    .where('isValidHttps', '==', true)
    .where('isValidWs', '==', true)
    .where('isValidWss', '==', true)
    .where('isLatestBlockHeight', '==', true)
    .get();
  const nodes = nodesSnapshot.docs.map((nodeSnapshot) => nodeSnapshot.data());
  return nodes;
};
