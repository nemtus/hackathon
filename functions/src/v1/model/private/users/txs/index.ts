import { db } from '../../../../../utils/firebase';
import { converter } from '../../../../../utils/firebase/converter';
import { AdminUserTx } from '../../../admin/users/txs';
import { PublicUserTx } from '../../../public/users/txs';

export type PrivateUserTx = PublicUserTx;

export type PrivateUserTxs = PrivateUserTx[];

export const privateUserTxConverter = converter<PrivateUserTx>();

const collectionPath = (userId: string) =>
  `/v/1/scopes/private/users/${userId}/txs`;
const collectionRef = (userId: string) =>
  db
    .collection(collectionPath(userId))
    .withConverter(converter<PrivateUserTx>());
const docPath = (userId: string, id: string) =>
  `${collectionPath(userId)}/${id}`;
const docRef = (userId: string, id: string) =>
  db.doc(docPath(userId, id)).withConverter(converter<PrivateUserTx>());

export const getPrivateUserTx = async (
  userId: string,
  id: string
): Promise<PrivateUserTx | undefined> => {
  return (await docRef(userId, id).get()).data();
};

export const setPrivateUserTx = async (
  userId: string,
  privateUserTx: PrivateUserTx
): Promise<void> => {
  await docRef(userId, privateUserTx.id).set(privateUserTx, { merge: true });
};

export const getAllPrivateUserTxs = async (
  userId: string
): Promise<PrivateUserTxs> => {
  return (await collectionRef(userId).get()).docs.map((snapshot) =>
    snapshot.data()
  );
};

export const convertAdminUserTxToPrivateUserTx = (
  adminUserTx: AdminUserTx
): PrivateUserTx => {
  const privateUserTx: PrivateUserTx = adminUserTx;
  return privateUserTx;
};
