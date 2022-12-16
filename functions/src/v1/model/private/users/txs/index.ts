import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db, FieldValue } from '../../../../../utils/firebase';
import { omitUndefinedProperties } from '../../../../../utils/typescript/omitUndefinedProperties';
import { AdminUserTx } from '../../../admin/users/txs';
import { PublicUserTx } from '../../../public/users/txs';

export type PrivateUserTx = PublicUserTx;

export type PrivateUserTxs = PrivateUserTx[];

export const privateUserTxConverter = {
  toFirestore: (privateUserTx: PrivateUserTx): DocumentData => {
    return omitUndefinedProperties({
      id: privateUserTx.id,
      userId: privateUserTx.userId,
      hash: privateUserTx.hash,
      payload: privateUserTx.payload,
      publicKey: privateUserTx.publicKey,
      type: privateUserTx.type,
      networkType: privateUserTx.networkType,
      description: privateUserTx.description,
      createdAt: privateUserTx.createdAt,
      updatedAt: FieldValue.serverTimestamp(),
      announced: privateUserTx.announced,
      announcedAt: privateUserTx.announcedAt,
      unconfirmed: privateUserTx.unconfirmed,
      unconfirmedAt: privateUserTx.unconfirmedAt,
      confirmed: privateUserTx.confirmed,
      confirmedAt: privateUserTx.confirmedAt,
      finalized: privateUserTx.finalized,
      finalizedAt: privateUserTx.finalizedAt,
      expired: privateUserTx.expired,
      expiredAt: privateUserTx.expiredAt,
      error: privateUserTx.error,
      errorAt: privateUserTx.errorAt,
    });
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): PrivateUserTx => {
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
  `/v/1/scopes/private/users/${userId}/txs`;
const docPath = (userId: string, id: string) =>
  `${collectionPath(userId)}/${id}`;

export const getPrivateUserTx = async (
  userId: string,
  id: string
): Promise<PrivateUserTx | undefined> => {
  const privateUserTxSnapshot = await db
    .doc(docPath(userId, id))
    .withConverter(privateUserTxConverter)
    .get();
  const privateUserTx = privateUserTxSnapshot.data();
  return privateUserTx;
};

export const setPrivateUserTx = async (
  userId: string,
  privateUserTx: PrivateUserTx
): Promise<void> => {
  await db
    .doc(docPath(userId, privateUserTx.id))
    .withConverter(privateUserTxConverter)
    .set(privateUserTx, { merge: true });
};

export const getAllPrivateUserTxs = async (
  userId: string
): Promise<PrivateUserTxs> => {
  const privateUserTxsSnapshot = await db
    .collection(collectionPath(userId))
    .withConverter(privateUserTxConverter)
    .get();
  const privateUserTxs = privateUserTxsSnapshot.docs.map(
    (privateUserTxSnapshot) => privateUserTxSnapshot.data()
  );
  return privateUserTxs;
};

export const convertAdminUserTxToPrivateUserTx = (
  adminUserTx: AdminUserTx
): PrivateUserTx => {
  const privateUserTx: PrivateUserTx = adminUserTx;
  return privateUserTx;
};
