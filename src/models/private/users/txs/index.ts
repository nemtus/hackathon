import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from '../../../../utils/firebase';
import { PublicUserTx } from '../../../public/users/txs';

export type PrivateUserTx = PublicUserTx;

export type PrivateUserTxs = PublicUserTx[];

const collectionPath = (userId: string) =>
  `/v/1/scopes/private/users/${userId}/txs`;

const collectionRef = (userId: string) =>
  collection(db, collectionPath(userId)).withConverter(
    converter<PrivateUserTx>()
  );

const docPath = (userId: string, id: string) =>
  `${collectionPath(userId)}/${id}`;

const docRef = (userId: string, id: string) =>
  doc(db, docPath(userId, id)).withConverter(converter<PrivateUserTx>());

export const getPrivateUserTx = async (
  userId: string,
  id: string
): Promise<PrivateUserTx | undefined> => {
  return (await getDoc(docRef(userId, id))).data();
};

export const setPrivateUserTx = async (
  userId: string,
  privateUserTx: PrivateUserTx
): Promise<void> => {
  await setDoc(docRef(userId, privateUserTx.id), privateUserTx, {
    merge: true,
  });
};

export const getAllPrivateUserTxs = async (
  userId: string
): Promise<PrivateUserTxs> => {
  return (
    await getDocs(query(collectionRef(userId), orderBy('createdAt', 'desc')))
  ).docs.map((doc) => doc.data());
};

export const queryNotAnnouncedPrivateUserTxs = async (
  userId: string
): Promise<PrivateUserTxs> => {
  return (
    await getDocs(
      query(
        collectionRef(userId),
        where('announced', '==', false),
        orderBy('createdAt', 'asc')
      )
    )
  ).docs.map((doc) => doc.data());
};

export const queryNotUnconfirmedPrivateUserTxs = async (
  userId: string
): Promise<PrivateUserTxs> => {
  return (
    await getDocs(
      query(
        collectionRef(userId),
        where('unconfirmed', '==', false),
        orderBy('createdAt', 'asc')
      )
    )
  ).docs.map((doc) => doc.data());
};

export const queryNotConfirmedPrivateUserTxs = async (
  userId: string
): Promise<PrivateUserTxs> => {
  return (
    await getDocs(
      query(
        collectionRef(userId),
        where('confirmed', '==', false),
        orderBy('createdAt', 'asc')
      )
    )
  ).docs.map((doc) => doc.data());
};

export const queryNotFinalizedPrivateUserTxs = async (
  userId: string
): Promise<PrivateUserTxs> => {
  return (
    await getDocs(
      query(
        collectionRef(userId),
        where('finalized', '==', false),
        orderBy('createdAt', 'asc')
      )
    )
  ).docs.map((doc) => doc.data());
};

export const convertAdminUserTxToPrivateUserTx = (
  privateUserTx: PrivateUserTx
): PublicUserTx => {
  const publicUserTx: PublicUserTx = privateUserTx;
  return publicUserTx;
};
