import { db } from '../../../../../utils/firebase';
import { converter } from '../../../../../utils/firebase/converter';
import { PrivateUserTx } from '../../../private/users/txs';

export type AdminUserTx = PrivateUserTx;

export type AdminUserTxs = AdminUserTx[];

export const adminUserTxConverter = converter<AdminUserTx>();

const collectionPath = (userId: string) =>
  `/v/1/scopes/admin/users/${userId}/txs`;
const collectionRef = (userId: string) =>
  db.collection(collectionPath(userId)).withConverter(converter<AdminUserTx>());
const docPath = (userId: string, id: string) =>
  `${collectionPath(userId)}/${id}`;
const docRef = (userId: string, id: string) =>
  db.doc(docPath(userId, id)).withConverter(converter<AdminUserTx>());

export const getAdminUserTx = async (
  userId: string,
  id: string
): Promise<AdminUserTx | undefined> => {
  return (await docRef(userId, id).get()).data();
};

export const setAdminUserTx = async (
  userId: string,
  adminUserTx: AdminUserTx
): Promise<void> => {
  await docRef(userId, adminUserTx.id).set(adminUserTx, { merge: true });
};

export const getAllAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
  return (await collectionRef(userId).get()).docs.map((snapshot) =>
    snapshot.data()
  );
};

export const queryAnnouncedAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
  return (
    await collectionRef(userId)
      .where('announced', '!=', false)
      .orderBy('createdAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryUnconfirmedAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
  return (
    await collectionRef(userId)
      .where('announced', '!=', true)
      .where('unconfirmed', '!=', false)
      .orderBy('createdAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryConfirmedAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
  return (
    await collectionRef(userId)
      .where('announced', '!=', true)
      .where('unconfirmed', '!=', true)
      .where('confirmed', '!=', false)
      .orderBy('createdAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryFinalizedAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
  return (
    await collectionRef(userId)
      .where('announced', '!=', true)
      .where('unconfirmed', '!=', true)
      .where('confirmed', '!=', true)
      .where('finalized', '!=', false)
      .orderBy('createdAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};
