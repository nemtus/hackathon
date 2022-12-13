import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db, FieldValue } from '../../../../utils/firebase';
import { omitUndefinedProperties } from '../../../../utils/typescript/omitUndefinedProperties';
import { PrivateUser } from '../../private/users';

export type AdminUser = {
  salt?: string;
  iv?: string;
  multisigEncryptedPrivateKey?: string;
  multisigCosignatory1EncryptedPrivateKey?: string;
  multisigCosignatory2EncryptedPrivateKey?: string;
  multisigCosignatory3EncryptedPrivateKey?: string;
} & PrivateUser;

export type AdminUsers = AdminUser[];

export const adminUserConverter = {
  toFirestore: (adminUser: AdminUser): DocumentData => {
    return omitUndefinedProperties({
      id: adminUser.id,
      displayName: adminUser.displayName,
      photoUrl: adminUser.photoUrl,
      twitterId: adminUser.twitterId,
      githubId: adminUser.githubId,
      createdAt: adminUser.createdAt ? FieldValue.serverTimestamp() : undefined,
      updatedAt: FieldValue.serverTimestamp(),
      entryAt: adminUser.entryAt ? FieldValue.serverTimestamp() : null,
      submitAt: adminUser.submitAt ? FieldValue.serverTimestamp() : null,
      voteAt: adminUser.voteAt ? FieldValue.serverTimestamp() : null,
      salt: adminUser.salt,
      iv: adminUser.iv,
      multisigEncryptedPrivateKey: adminUser.multisigEncryptedPrivateKey,
      multisigPublicKey: adminUser.multisigPublicKey,
      multisigAddress: adminUser.multisigAddress,
      multisigCosignatory1EncryptedPrivateKey:
        adminUser.multisigCosignatory1EncryptedPrivateKey,
      multisigCosignatory1PublicKey: adminUser.multisigCosignatory1PublicKey,
      multisigCosignatory1Address: adminUser.multisigCosignatory1Address,
      multisigCosignatory2EncryptedPrivateKey:
        adminUser.multisigCosignatory2EncryptedPrivateKey,
      multisigCosignatory2PublicKey: adminUser.multisigCosignatory2PublicKey,
      multisigCosignatory2Address: adminUser.multisigCosignatory2Address,
      multisigCosignatory3EncryptedPrivateKey:
        adminUser.multisigCosignatory3EncryptedPrivateKey,
      multisigCosignatory3PublicKey: adminUser.multisigCosignatory3PublicKey,
      multisigCosignatory3Address: adminUser.multisigCosignatory3Address,
    });
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): AdminUser => {
    const data = snapshot.data();
    return {
      id: data.id,
      displayName: data.displayName,
      photoUrl: data.photoUrl,
      twitterId: data.twitterId,
      githubId: data.githubId,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
      entryAt: data.entryAt ? data.entryAt.toDate() : null,
      submitAt: data.submitAt ? data.submitAt.toDate() : null,
      voteAt: data.voteAt ? data.voteAt.toDate() : null,
      salt: data.salt,
      iv: data.iv,
      multisigEncryptedPrivateKey: data.multisigEncryptedPrivateKey,
      multisigPublicKey: data.multisigPublicKey,
      multisigAddress: data.multisigAddress,
      multisigCosignatory1EncryptedPrivateKey:
        data.multisigCosignatory1EncryptedPrivateKey,
      multisigCosignatory1PublicKey: data.multisigCosignatory1PublicKey,
      multisigCosignatory1Address: data.multisigCosignatory1Address,
      multisigCosignatory2EncryptedPrivateKey:
        data.multisigCosignatory2EncryptedPrivateKey,
      multisigCosignatory2PublicKey: data.multisigCosignatory2PublicKey,
      multisigCosignatory2Address: data.multisigCosignatory2Address,
      multisigCosignatory3EncryptedPrivateKey:
        data.multisigCosignatory3EncryptedPrivateKey,
      multisigCosignatory3PublicKey: data.multisigCosignatory3PublicKey,
      multisigCosignatory3Address: data.multisigCosignatory3Address,
    };
  },
};

const collectionPath = '/v/1/scopes/admin/users';
const docPath = (id: string) => `${collectionPath}/${id}`;

export const getAdminUser = async (
  id: string
): Promise<AdminUser | undefined> => {
  const adminUserSnapshot = await db
    .doc(docPath(id))
    .withConverter(adminUserConverter)
    .get();
  const adminUser = adminUserSnapshot.data();
  return adminUser;
};

export const setAdminUser = async (adminUser: AdminUser): Promise<void> => {
  await db
    .doc(docPath(adminUser.id))
    .withConverter(adminUserConverter)
    .set(adminUser, { merge: true });
};

export const getAllAdminUsers = async (): Promise<AdminUsers> => {
  const adminUsersSnapshot = await db
    .collection(collectionPath)
    .withConverter(adminUserConverter)
    .get();
  const adminUsers = adminUsersSnapshot.docs.map((adminUserSnapshot) =>
    adminUserSnapshot.data()
  );
  return adminUsers;
};

export const queryEntryAdminUsers = async (): Promise<AdminUsers> => {
  const entryAdminUsersSnapshot = await db
    .collection(collectionPath)
    .withConverter(adminUserConverter)
    .where('entryAt', '!=', null)
    .orderBy('entryAt', 'asc')
    .get();
  const entryAdminUsers = entryAdminUsersSnapshot.docs.map((entryAdminUser) =>
    entryAdminUser.data()
  );
  return entryAdminUsers;
};

export const querySubmitAdminUsers = async (): Promise<AdminUsers> => {
  const submitAdminUsersSnapshot = await db
    .collection(collectionPath)
    .withConverter(adminUserConverter)
    .where('entryAt', '!=', null)
    .where('submitAt', '!=', null)
    .orderBy('submitAt', 'asc')
    .get();
  const submitAdminUsers = submitAdminUsersSnapshot.docs.map(
    (submitAdminUser) => submitAdminUser.data()
  );
  return submitAdminUsers;
};

export const queryVoteAdminUsers = async (): Promise<AdminUsers> => {
  const voteAdminUsersSnapshot = await db
    .collection(collectionPath)
    .withConverter(adminUserConverter)
    .where('voteAt', '!=', null)
    .orderBy('voteAt', 'asc')
    .get();
  const voteAdminUsers = voteAdminUsersSnapshot.docs.map((voteAdminUser) =>
    voteAdminUser.data()
  );
  return voteAdminUsers;
};
