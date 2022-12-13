import {
  DocumentData,
  QueryDocumentSnapshot,
  FieldValue,
  Timestamp,
} from 'firebase-admin/firestore';
import { db } from '../../../../../../utils/firebase';
import { omitUndefinedProperties } from '../../../../../../utils/typescript/omitUndefinedProperties';

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

export const nodeCheckConverter = {
  toFirestore: (nodeCheck: Partial<NodeCheck>): DocumentData => {
    return omitUndefinedProperties({
      id: nodeCheck.id,
      nodeId: nodeCheck.nodeId,
      isValidHttp: nodeCheck.isValidHttp,
      isValidHttps: nodeCheck.isValidHttps,
      isValidWs: nodeCheck.isValidWs,
      isValidWss: nodeCheck.isValidWss,
      isLatestBlockHeight: nodeCheck.isLatestBlockHeight,
      latestBlockHeight: nodeCheck.latestBlockHeight,
      createdAt: nodeCheck.createdAt ? FieldValue.serverTimestamp() : undefined,
      updatedAt: FieldValue.serverTimestamp(),
      completedAt: nodeCheck.completedAt
        ? FieldValue.serverTimestamp()
        : undefined,
    });
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): NodeCheck => {
    const data = snapshot.data();
    return {
      id: data.id,
      nodeId: data.nodeId,
      isValidHttp: data.isValidHttp,
      isValidHttps: data.isValidHttps,
      isValidWs: data.isValidWs,
      isValidWss: data.isValidWss,
      isLatestBlockHeight: data.isLatestBlockHeight,
      latestBlockHeight: data.latestBlockHeight,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      completedAt: data.completedAt?.toDate(),
    } as NodeCheck;
  },
};

const collectionPath = (nodeId: string) =>
  `/v/1/configs/symbol/nodes/${nodeId}/checks`;
const docPath = (nodeId: string, id: string) =>
  `${collectionPath(nodeId)}/${id}`;

export const getNodeCheck = async (
  nodeId: string,
  id: string
): Promise<NodeCheck | undefined> => {
  const nodeCheckSnapshot = await db
    .doc(docPath(nodeId, id))
    .withConverter(nodeCheckConverter)
    .get();
  const nodeCheck = nodeCheckSnapshot.data();
  return nodeCheck;
};

export const addNodeCheck = async (
  nodeId: string,
  nodeCheck: NodeCheck
): Promise<void> => {
  const cloneNodeCheck = Object.assign(nodeCheck);
  cloneNodeCheck['createdAt'] = Timestamp.now();
  const nodeCheckDocRef = await db
    .collection(collectionPath(nodeId))
    .withConverter(nodeCheckConverter)
    .add(cloneNodeCheck);
  const id = nodeCheckDocRef.id;
  await nodeCheckDocRef.set({ id }, { merge: true });
  return;
};

export const setNodeCheck = async (
  nodeId: string,
  nodeCheck: NodeCheck
): Promise<void> => {
  if (!nodeCheck.id) {
    await addNodeCheck(nodeId, nodeCheck);
    return;
  }
  await db
    .doc(docPath(nodeId, nodeCheck.id))
    .withConverter(nodeCheckConverter)
    .set(nodeCheck, { merge: true });
  return;
};

export const getNodeChecks = async (nodeId: string): Promise<NodeChecks> => {
  const nodesSnapshot = await db
    .collection(collectionPath(nodeId))
    .withConverter(nodeCheckConverter)
    .orderBy('createdAt', 'desc')
    .get();
  const nodes = nodesSnapshot.docs.map((nodeSnapshot) => nodeSnapshot.data());
  return nodes;
};

export const getLatestNodeCheck = async (
  nodeId: string
): Promise<NodeCheck | undefined> => {
  const nodesSnapshot = await db
    .collection(collectionPath(nodeId))
    .withConverter(nodeCheckConverter)
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();
  const nodes = nodesSnapshot.docs.map((nodeSnapshot) => nodeSnapshot.data());
  if (nodes.length === 0) {
    return undefined;
  }
  return nodes[0];
};
