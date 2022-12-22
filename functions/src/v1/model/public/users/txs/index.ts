import { db } from '../../../../../utils/firebase';
import { converter } from '../../../../../utils/firebase/converter';
import { AdminUserTx } from '../../../admin/users/txs';
import { PrivateUserTx } from '../../../private/users/txs';

export type PublicUserTx = {
  id: string;
  userId?: string;
  hash?: string;
  payload?: string;
  publicKey?: string;
  type?: number;
  networkType?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  announced?: boolean;
  announcedAt?: Date;
  unconfirmed?: boolean;
  unconfirmedAt?: Date;
  confirmed?: boolean;
  confirmedAt?: Date;
  finalized?: boolean;
  finalizedAt?: Date;
  expired?: boolean;
  expiredAt?: Date;
  error?: boolean;
  errorAt?: Date;
};

export type PublicUserTxs = PublicUserTx[];

export const PublicUserTxConverter = converter<PublicUserTx>();

const collectionPath = (userId: string) =>
  `/v/1/scopes/public/users/${userId}/txs`;
const collectionRef = (userId: string) =>
  db
    .collection(collectionPath(userId))
    .withConverter(converter<PublicUserTx>());
const docPath = (userId: string, id: string) =>
  `${collectionPath(userId)}/${id}`;
const docRef = (userId: string, id: string) =>
  db.doc(docPath(userId, id)).withConverter(converter<PublicUserTx>());

export const getPublicUserTx = async (
  userId: string,
  id: string
): Promise<PublicUserTx | undefined> => {
  return (await docRef(userId, id).get()).data();
};

export const setPublicUserTx = async (
  userId: string,
  publicUserTx: PublicUserTx
): Promise<void> => {
  await docRef(userId, publicUserTx.id).set(publicUserTx, { merge: true });
};

export const getAllPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  return (await collectionRef(userId).get()).docs.map((snapshot) =>
    snapshot.data()
  );
};

export const queryAnnouncedPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  return (
    await collectionRef(userId)
      .where('announced', '!=', false)
      .orderBy('createdAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryUnconfirmedPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  return (
    await collectionRef(userId)
      .where('announced', '!=', true)
      .where('unconfirmed', '!=', false)
      .orderBy('createdAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryConfirmedPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  return (
    await collectionRef(userId)
      .where('announced', '!=', true)
      .where('unconfirmed', '!=', true)
      .where('confirmed', '!=', false)
      .orderBy('createdAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryFinalizedPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
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

export const convertAdminUserTxToPublicUserTx = (
  adminUserTx: AdminUserTx
): PublicUserTx => {
  const publicUserTx: PublicUserTx = adminUserTx;
  return publicUserTx;
};

export const convertPrivateUserTxToPublicUserTx = (
  privateUserTx: PrivateUserTx
): PublicUserTx => {
  const publicUserTx: PublicUserTx = privateUserTx;
  return publicUserTx;
};
