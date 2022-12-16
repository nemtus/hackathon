import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db, FieldValue } from '../../../../utils/firebase';
import { omitUndefinedProperties } from '../../../../utils/typescript/omitUndefinedProperties';
import { PrivateUser } from '../../private/users';

export type AdminUser = {
  multisigSaltHexString?: string;
  multisigIvHexString?: string;
  multisigEncryptedPrivateKey?: string;
  multisigCosignatory1SaltHexString?: string;
  multisigCosignatory1IvHexString?: string;
  multisigCosignatory1EncryptedPrivateKey?: string;
  multisigCosignatory2SaltHexString?: string;
  multisigCosignatory2IvHexString?: string;
  multisigCosignatory2EncryptedPrivateKey?: string;
  multisigCosignatory3SaltHexString?: string;
  multisigCosignatory3IvHexString?: string;
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
      multisigSaltHexString: adminUser.multisigSaltHexString,
      multisigIvHexString: adminUser.multisigIvHexString,
      multisigEncryptedPrivateKey: adminUser.multisigEncryptedPrivateKey,
      multisigPublicKey: adminUser.multisigPublicKey,
      multisigAddress: adminUser.multisigAddress,
      multisigCosignatory1SaltHexString:
        adminUser.multisigCosignatory1SaltHexString,
      multisigCosignatory1IvHexString:
        adminUser.multisigCosignatory1IvHexString,
      multisigCosignatory1EncryptedPrivateKey:
        adminUser.multisigCosignatory1EncryptedPrivateKey,
      multisigCosignatory1PublicKey: adminUser.multisigCosignatory1PublicKey,
      multisigCosignatory1Address: adminUser.multisigCosignatory1Address,
      multisigCosignatory2SaltHexString:
        adminUser.multisigCosignatory2SaltHexString,
      multisigCosignatory2IvHexString:
        adminUser.multisigCosignatory2IvHexString,
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
      multisigSaltHexString: data.multisigSaltHexString,
      multisigIvHexString: data.multisigIvHexString,
      multisigEncryptedPrivateKey: data.multisigEncryptedPrivateKey,
      multisigPublicKey: data.multisigPublicKey,
      multisigAddress: data.multisigAddress,
      multisigCosignatory1SaltHexString: data.multisigCosignatory1SaltHexString,
      multisigCosignatory1IvHexString: data.multisigCosignatory1IvHexString,
      multisigCosignatory1EncryptedPrivateKey:
        data.multisigCosignatory1EncryptedPrivateKey,
      multisigCosignatory1PublicKey: data.multisigCosignatory1PublicKey,
      multisigCosignatory1Address: data.multisigCosignatory1Address,
      multisigCosignatory2SaltHexString: data.multisigCosignatory2SaltHexString,
      multisigCosignatory2IvHexString: data.multisigCosignatory2IvHexString,
      multisigCosignatory2EncryptedPrivateKey:
        data.multisigCosignatory2EncryptedPrivateKey,
      multisigCosignatory2PublicKey: data.multisigCosignatory2PublicKey,
      multisigCosignatory2Address: data.multisigCosignatory2Address,
      multisigCosignatory3SaltHexString: data.multisigCosignatory3SaltHexString,
      multisigCosignatory3IvHexString: data.multisigCosignatory3IvHexString,
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
