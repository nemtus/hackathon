import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db, FieldValue } from '../../../../../utils/firebase';
import { omitUndefinedProperties } from '../../../../../utils/typescript/omitUndefinedProperties';
import { PrivateUserTx } from '../../../private/users/txs';

export type AdminUserTx = PrivateUserTx;

export type AdminUserTxs = AdminUserTx[];

export const adminUserTxConverter = {
  toFirestore: (adminUserTx: AdminUserTx): DocumentData => {
    return omitUndefinedProperties({
      id: adminUserTx.id,
      userId: adminUserTx.userId,
      hash: adminUserTx.hash,
      payload: adminUserTx.payload,
      publicKey: adminUserTx.publicKey,
      type: adminUserTx.type,
      networkType: adminUserTx.networkType,
      description: adminUserTx.description,
      createdAt: adminUserTx.createdAt,
      updatedAt: FieldValue.serverTimestamp(),
      announced: adminUserTx.announced,
      announcedAt: adminUserTx.announcedAt,
      unconfirmed: adminUserTx.unconfirmed,
      unconfirmedAt: adminUserTx.unconfirmedAt,
      confirmed: adminUserTx.confirmed,
      confirmedAt: adminUserTx.confirmedAt,
      finalized: adminUserTx.finalized,
      finalizedAt: adminUserTx.finalizedAt,
      expired: adminUserTx.expired,
      expiredAt: adminUserTx.expiredAt,
      error: adminUserTx.error,
      errorAt: adminUserTx.errorAt,
    });
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): AdminUserTx => {
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
  `/v/1/scopes/admin/users/${userId}/txs`;
const docPath = (userId: string, id: string) =>
  `${collectionPath(userId)}/${id}`;

export const getAdminUserTx = async (
  userId: string,
  id: string
): Promise<AdminUserTx | undefined> => {
  const adminUserTxSnapshot = await db
    .doc(docPath(userId, id))
    .withConverter(adminUserTxConverter)
    .get();
  const adminUserTx = adminUserTxSnapshot.data();
  return adminUserTx;
};

export const setAdminUserTx = async (
  userId: string,
  adminUserTx: AdminUserTx
): Promise<void> => {
  await db
    .doc(docPath(userId, adminUserTx.id))
    .withConverter(adminUserTxConverter)
    .set(adminUserTx, { merge: true });
};

export const getAllAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
  const adminUserTxsSnapshot = await db
    .collection(collectionPath(userId))
    .withConverter(adminUserTxConverter)
    .get();
  const adminUserTxs = adminUserTxsSnapshot.docs.map((adminUserTxSnapshot) =>
    adminUserTxSnapshot.data()
  );
  return adminUserTxs;
};

export const queryAnnouncedAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
  const announcedAdminUserTxsSnapshot = await db
    .collection(collectionPath(userId))
    .withConverter(adminUserTxConverter)
    .where('announced', '!=', false)
    .orderBy('createdAt', 'asc')
    .get();
  const announcedAdminUserTxs = announcedAdminUserTxsSnapshot.docs.map(
    (adminUserTx) => adminUserTx.data()
  );
  return announcedAdminUserTxs;
};

export const queryUnconfirmedAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
  const unconfirmedAdminUserTxsSnapshot = await db
    .collection(collectionPath(userId))
    .withConverter(adminUserTxConverter)
    .where('announced', '!=', true)
    .where('unconfirmed', '!=', false)
    .orderBy('createdAt', 'asc')
    .get();
  const unconfirmedAdminUserTxs = unconfirmedAdminUserTxsSnapshot.docs.map(
    (adminUserTx) => adminUserTx.data()
  );
  return unconfirmedAdminUserTxs;
};

export const queryConfirmedAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
  const confirmedAdminUserTxsSnapshot = await db
    .collection(collectionPath(userId))
    .withConverter(adminUserTxConverter)
    .where('announced', '!=', true)
    .where('unconfirmed', '!=', true)
    .where('confirmed', '!=', false)
    .orderBy('createdAt', 'asc')
    .get();
  const confirmedAdminUserTxs = confirmedAdminUserTxsSnapshot.docs.map(
    (adminUserTx) => adminUserTx.data()
  );
  return confirmedAdminUserTxs;
};

export const queryFinalizedAdminUserTxs = async (
  userId: string
): Promise<AdminUserTxs> => {
  const finalizedAdminUserTxsSnapshot = await db
    .collection(collectionPath(userId))
    .withConverter(adminUserTxConverter)
    .where('announced', '!=', true)
    .where('unconfirmed', '!=', true)
    .where('confirmed', '!=', true)
    .where('finalized', '!=', false)
    .orderBy('createdAt', 'asc')
    .get();
  const confirmedAdminUserTxs = finalizedAdminUserTxsSnapshot.docs.map(
    (adminUserTx) => adminUserTx.data()
  );
  return confirmedAdminUserTxs;
};
