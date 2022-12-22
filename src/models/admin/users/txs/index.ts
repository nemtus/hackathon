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
import { PrivateUserTx } from '../../../private/users/txs';

export type AdminUserTx = PrivateUserTx;

export type AdminUserTxs = AdminUserTx[];

const collectionPath = (userId: string) =>
  `/v/1/scopes/admin/users/${userId}/txs`;

const collectionRef = (userId: string) =>
  collection(db, collectionPath(userId)).withConverter(
    converter<AdminUserTx>()
  );

const docPath = (userId: string, id: string) =>
  `${collectionPath(userId)}/${id}`;

const docRef = (userId: string, id: string) =>
  doc(db, docPath(userId, id)).withConverter(converter<AdminUserTx>());

export const getAdminUserTx = async (
  userId: string,
  id: string
): Promise<AdminUserTx | undefined> => {
  return (await getDoc(docRef(userId, id))).data();
};

export const setAdminUserTx = async (
  userId: string,
  adminUserTx: AdminUserTx
): Promise<void> => {
  await setDoc(docRef(userId, adminUserTx.id), adminUserTx, { merge: true });
};

export const getAllAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
  return (
    await getDocs(query(collectionRef(userId), orderBy('createdAt', 'desc')))
  ).docs.map((doc) => doc.data());
};

export const queryNotAnnouncedAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
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

export const queryNotUnconfirmedAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
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

export const queryNotConfirmedAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
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

export const queryNotFinalizedAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
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
