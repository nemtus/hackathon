import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db, FieldValue } from '../../../../../utils/firebase';
import { omitUndefinedProperties } from '../../../../../utils/typescript/omitUndefinedProperties';
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

export const PublicUserTxConverter = {
  toFirestore: (PublicUserTx: PublicUserTx): DocumentData => {
    return omitUndefinedProperties({
      id: PublicUserTx.id,
      userId: PublicUserTx.userId,
      hash: PublicUserTx.hash,
      payload: PublicUserTx.payload,
      publicKey: PublicUserTx.publicKey,
      type: PublicUserTx.type,
      networkType: PublicUserTx.networkType,
      description: PublicUserTx.description,
      createdAt: PublicUserTx.createdAt,
      updatedAt: FieldValue.serverTimestamp(),
      announced: PublicUserTx.announced,
      announcedAt: PublicUserTx.announcedAt,
      unconfirmed: PublicUserTx.unconfirmed,
      unconfirmedAt: PublicUserTx.unconfirmedAt,
      confirmed: PublicUserTx.confirmed,
      confirmedAt: PublicUserTx.confirmedAt,
      finalized: PublicUserTx.finalized,
      finalizedAt: PublicUserTx.finalizedAt,
      expired: PublicUserTx.expired,
      expiredAt: PublicUserTx.expiredAt,
      error: PublicUserTx.error,
      errorAt: PublicUserTx.errorAt,
    });
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): PublicUserTx => {
    const data = snapshot.data();
    return {
      id: data.id,
      userId: data.userId,
      hash: data.hash,
      payload: data.payload,
      publicKey: data.publicKey,
      type: data.type,
      networkType: data.networkType,
      description: data.description,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      announced: data.announced,
      announcedAt: data.announcedAt?.toDate(),
      unconfirmed: data.unconfirmed,
      unconfirmedAt: data.unconfirmedAt?.toDate(),
      confirmed: data.confirmed,
      confirmedAt: data.confirmedAt?.toDate(),
      finalized: data.finalized,
      finalizedAt: data.finalizedAt?.toDate(),
      expired: data.expired,
      expiredAt: data.expiredAt?.toDate(),
      error: data.error,
      errorAt: data.errorAt?.toDate(),
    };
  },
};

const collectionPath = (userId: string) =>
  `/v/1/scopes/public/users/${userId}/txs`;
const docPath = (userId: string, id: string) =>
  `${collectionPath(userId)}/${id}`;

export const getPublicUserTx = async (
  userId: string,
  id: string
): Promise<PublicUserTx | undefined> => {
  const publicUserTxSnapshot = await db
    .doc(docPath(userId, id))
    .withConverter(PublicUserTxConverter)
    .get();
  const publicUserTx = publicUserTxSnapshot.data();
  return publicUserTx;
};

export const setPublicUserTx = async (
  userId: string,
  publicUserTx: PublicUserTx
): Promise<void> => {
  await db
    .doc(docPath(userId, publicUserTx.id))
    .withConverter(PublicUserTxConverter)
    .set(publicUserTx, { merge: true });
};

export const getAllPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  const publicUserTxsSnapshot = await db
    .collection(collectionPath(userId))
    .withConverter(PublicUserTxConverter)
    .get();
  const publicUserTxs = publicUserTxsSnapshot.docs.map((publicUserTxSnapshot) =>
    publicUserTxSnapshot.data()
  );
  return publicUserTxs;
};

export const queryAnnouncedPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  const announcedPublicUserTxsSnapshot = await db
    .collection(collectionPath(userId))
    .withConverter(PublicUserTxConverter)
    .where('announced', '!=', false)
    .orderBy('createdAt', 'asc')
    .get();
  const announcedPublicUserTxs = announcedPublicUserTxsSnapshot.docs.map(
    (adminUserTx) => adminUserTx.data()
  );
  return announcedPublicUserTxs;
};

export const queryUnconfirmedPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  const unconfirmedPublicUserTxsSnapshot = await db
    .collection(collectionPath(userId))
    .withConverter(PublicUserTxConverter)
    .where('announced', '!=', true)
    .where('unconfirmed', '!=', false)
    .orderBy('createdAt', 'asc')
    .get();
  const unconfirmedPublicUserTxs = unconfirmedPublicUserTxsSnapshot.docs.map(
    (publicUserTx) => publicUserTx.data()
  );
  return unconfirmedPublicUserTxs;
};

export const queryConfirmedPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  const confirmedPublicUserTxsSnapshot = await db
    .collection(collectionPath(userId))
    .withConverter(PublicUserTxConverter)
    .where('announced', '!=', true)
    .where('unconfirmed', '!=', true)
    .where('confirmed', '!=', false)
    .orderBy('createdAt', 'asc')
    .get();
  const confirmedPublicUserTxs = confirmedPublicUserTxsSnapshot.docs.map(
    (publicUserTx) => publicUserTx.data()
  );
  return confirmedPublicUserTxs;
};

export const queryFinalizedPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  const finalizedPublicUserTxsSnapshot = await db
    .collection(collectionPath(userId))
    .withConverter(PublicUserTxConverter)
    .where('announced', '!=', true)
    .where('unconfirmed', '!=', true)
    .where('confirmed', '!=', true)
    .where('finalized', '!=', false)
    .orderBy('createdAt', 'asc')
    .get();
  const confirmedPublicUserTxs = finalizedPublicUserTxsSnapshot.docs.map(
    (publicUserTx) => publicUserTx.data()
  );
  return confirmedPublicUserTxs;
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
