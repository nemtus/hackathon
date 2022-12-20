import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  where,
} from '../../../../utils/firebase';

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

const collectionPath = '/v/1/configs/symbol/nodes';
const collectionRef = collection(db, collectionPath).withConverter(
  converter<Node>()
);
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  doc(db, docPath(id)).withConverter(converter<Node>());

export const getNode = async (id: string): Promise<Node | undefined> => {
  return (await getDoc(docRef(id))).data();
};

export const setNode = async (node: Node): Promise<void> => {
  await setDoc(docRef(node.id), node, { merge: true });
};

export const getAllNodes = async (): Promise<Nodes> => {
  return (
    await getDocs(query(collectionRef, orderBy('createdAt', 'asc')))
  ).docs.map((doc) => doc.data());
};

export const queryValidNodes = async (): Promise<Nodes> => {
  return (
    await getDocs(
      query(
        collectionRef,
        orderBy('createdAt', 'asc'),
        where('isValidHttp', '==', true),
        where('isValidHttps', '==', true),
        where('isValidWs', '==', true),
        where('isValidWss', '==', true),
        where('isLatestBlockHeight', '==', true)
      )
    )
  ).docs.map((doc) => doc.data());
};
