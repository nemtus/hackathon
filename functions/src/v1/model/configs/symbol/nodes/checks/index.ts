import { db } from '../../../../../../utils/firebase';
import { converter } from '../../../../../../utils/firebase/converter';

export type NodeCheck = {
  id?: string;
  nodeId: string;
  isValidHttp?: boolean;
  isValidHttps?: boolean;
  isValidWs?: boolean;
  isValidWss?: boolean;
  isLatestBlockHeight?: boolean;
  latestBlockHeight?: number;
  createdAt?: Date;
  updatedAt?: Date;
  completedAt?: Date;
};

export type NodeChecks = NodeCheck[];

export const nodeCheckConverter = converter<NodeCheck>();

const collectionPath = (nodeId: string) =>
  `/v/1/configs/symbol/nodes/${nodeId}/checks`;
const collectionRef = (nodeId: string) =>
  db.collection(collectionPath(nodeId)).withConverter(converter<NodeCheck>());
const docPath = (nodeId: string, id: string) =>
  `${collectionPath(nodeId)}/${id}`;
const docRef = (nodeId: string, id: string) =>
  db.doc(docPath(nodeId, id)).withConverter(converter<NodeCheck>());

export const getNodeCheck = async (
  nodeId: string,
  id: string
): Promise<NodeCheck | undefined> => {
  return (await docRef(nodeId, id).get()).data();
};

export const addNodeCheck = async (
  nodeId: string,
  nodeCheck: NodeCheck
): Promise<void> => {
  nodeCheck.createdAt = new Date();
  const nodeCheckDocRef = await collectionRef(nodeId).add(nodeCheck);
  const id = nodeCheckDocRef.id;
  await nodeCheckDocRef.set({ id }, { merge: true });
};

export const setNodeCheck = async (
  nodeId: string,
  nodeCheck: NodeCheck
): Promise<void> => {
  if (!nodeCheck.id) {
    await addNodeCheck(nodeId, nodeCheck);
    return;
  }
  await docRef(nodeId, nodeCheck.id).set(nodeCheck, { merge: true });
};

export const getNodeChecks = async (nodeId: string): Promise<NodeChecks> => {
  return (
    await collectionRef(nodeId).orderBy('createdAt', 'desc').get()
  ).docs.map((snapshot) => snapshot.data());
};

export const getLatestNodeCheck = async (
  nodeId: string
): Promise<NodeCheck | undefined> => {
  const nodes = (
    await collectionRef(nodeId).orderBy('createdAt', 'desc').limit(1).get()
  ).docs.map((snapshot) => snapshot.data());
  if (nodes.length === 0) {
    return undefined;
  }
  return nodes[0];
};
