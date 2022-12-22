import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  // where,
} from '../../../../../utils/firebase';

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

const collectionPath = (nodeId: string) =>
  `/v/1/configs/symbol/nodes/${nodeId}/checks`;
const collectionRef = (nodeId: string) =>
  collection(db, collectionPath(nodeId)).withConverter(converter<NodeCheck>());
const docPath = (nodeId: string, id: string) =>
  `${collectionPath(nodeId)}/${id}`;
const docRef = (nodeId: string, id: string) =>
  doc(db, docPath(nodeId, id)).withConverter(converter<NodeCheck>());

export const getNodeCheck = async (
  nodeId: string,
  id: string
): Promise<NodeCheck | undefined> => {
  return (await getDoc(docRef(nodeId, id))).data();
};

export const addNodeCheck = async (
  nodeId: string,
  nodeCheck: NodeCheck
): Promise<void> => {
  const cloneNodeCheck = Object.assign(nodeCheck);
  cloneNodeCheck['createdAt'] = new Date();
  const nodeCheckDocRef = await addDoc(collectionRef(nodeId), cloneNodeCheck);
  const id = nodeCheckDocRef.id;
  await setDoc(docRef(nodeId, id), { id }, { merge: true });
};

export const setNodeCheck = async (
  nodeId: string,
  nodeCheck: NodeCheck
): Promise<void> => {
  if (!nodeCheck.id) {
    await addNodeCheck(nodeId, nodeCheck);
    return;
  }
  await setDoc(docRef(nodeId, nodeCheck.id), nodeCheck, { merge: true });
};

export const getNodeChecks = async (nodeId: string): Promise<NodeChecks> => {
  return (
    await getDocs(query(collectionRef(nodeId), orderBy('createdAt', 'asc')))
  ).docs.map((doc) => doc.data());
};

export const getLatestNodeCheck = async (
  nodeId: string
): Promise<NodeCheck | undefined> => {
  const nodes = (
    await getDocs(
      query(collectionRef(nodeId), orderBy('createdAt', 'desc'), limit(1))
    )
  ).docs.map((doc) => doc.data());
  if (nodes.length === 0) {
    return undefined;
  }
  return nodes[0];
};
