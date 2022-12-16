import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db, FieldValue } from '../../../../utils/firebase';
import { omitUndefinedProperties } from '../../../../utils/typescript/omitUndefinedProperties';
import { AdminUser } from '../../admin/users';
import { PublicUser } from '../../public/users';

export type PrivateUser = {
  multisigPublicKey?: string;
  multisigCosignatory1PublicKey?: string;
  multisigCosignatory1Address?: string;
  multisigCosignatory2PublicKey?: string;
  multisigCosignatory2Address?: string;
  multisigCosignatory3PublicKey?: string;
  multisigCosignatory3Address?: string;
} & PublicUser;

export type PrivateUsers = PrivateUser[];

export const privateUserConverter = {
  toFirestore: (privateUser: PrivateUser): DocumentData => {
    return omitUndefinedProperties({
      id: privateUser.id,
      displayName: privateUser.displayName,
      photoUrl: privateUser.photoUrl,
      twitterId: privateUser.twitterId,
      githubId: privateUser.githubId,
      createdAt: privateUser.createdAt
        ? FieldValue.serverTimestamp()
        : undefined,
      updatedAt: FieldValue.serverTimestamp(),
      entryAt: privateUser.entryAt ? FieldValue.serverTimestamp() : null,
      submitAt: privateUser.submitAt ? FieldValue.serverTimestamp() : null,
      voteAt: privateUser.voteAt ? FieldValue.serverTimestamp() : null,
      multisigPublicKey: privateUser.multisigPublicKey,
      multisigAddress: privateUser.multisigAddress,
      multisigCosignatory1PublicKey: privateUser.multisigCosignatory1PublicKey,
      multisigCosignatory1Address: privateUser.multisigCosignatory1Address,
      multisigCosignatory2PublicKey: privateUser.multisigCosignatory2PublicKey,
      multisigCosignatory2Address: privateUser.multisigCosignatory2Address,
      multisigCosignatory3PublicKey: privateUser.multisigCosignatory3PublicKey,
      multisigCosignatory3Address: privateUser.multisigCosignatory3Address,
    });
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): PrivateUser => {
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
      multisigPublicKey: data.multisigPublicKey,
      multisigAddress: data.multisigAddress,
      multisigCosignatory1PublicKey: data.multisigCosignatory1PublicKey,
      multisigCosignatory1Address: data.multisigCosignatory1Address,
      multisigCosignatory2PublicKey: data.multisigCosignatory2PublicKey,
      multisigCosignatory2Address: data.multisigCosignatory2Address,
      multisigCosignatory3PublicKey: data.multisigCosignatory3PublicKey,
      multisigCosignatory3Address: data.multisigCosignatory3Address,
    };
  },
};

export const convertAdminUserToPrivateUser = (
  adminUser: AdminUser
): PrivateUser => {
  const privateUser: PrivateUser = {
    id: adminUser.id,
    displayName: adminUser.displayName,
    photoUrl: adminUser.photoUrl,
    twitterId: adminUser.twitterId,
    githubId: adminUser.githubId,
    createdAt: adminUser.createdAt,
    updatedAt: adminUser.updatedAt,
    entryAt: adminUser.entryAt ? adminUser.entryAt : null,
    submitAt: adminUser.submitAt ? adminUser.submitAt : null,
    voteAt: adminUser.voteAt ? adminUser.voteAt : null,
    multisigPublicKey: adminUser.multisigPublicKey,
    multisigAddress: adminUser.multisigAddress,
    multisigCosignatory1PublicKey: adminUser.multisigCosignatory1PublicKey,
    multisigCosignatory1Address: adminUser.multisigCosignatory1Address,
    multisigCosignatory2PublicKey: adminUser.multisigCosignatory2PublicKey,
    multisigCosignatory2Address: adminUser.multisigCosignatory2Address,
    multisigCosignatory3PublicKey: adminUser.multisigCosignatory3PublicKey,
    multisigCosignatory3Address: adminUser.multisigCosignatory3Address,
  };
  return privateUser;
};

const collectionPath = '/v/1/scopes/private/users';
const docPath = (id: string) => `${collectionPath}/${id}`;

export const getPrivateUser = async (
  id: string
): Promise<PrivateUser | undefined> => {
  const privateUserSnapshot = await db
    .doc(docPath(id))
    .withConverter(privateUserConverter)
    .get();
  const privateUser = privateUserSnapshot.data();
  return privateUser;
};

export const setPrivateUser = async (
  privateUser: PrivateUser
): Promise<void> => {
  await db
    .doc(docPath(privateUser.id))
    .withConverter(privateUserConverter)
    .set(privateUser, { merge: true });
};

export const getAllPrivateUsers = async (): Promise<PrivateUsers> => {
  const privateUsersSnapshot = await db
    .collection(collectionPath)
    .withConverter(privateUserConverter)
    .get();
  const privateUsers = privateUsersSnapshot.docs.map((privateUserSnapshot) =>
    privateUserSnapshot.data()
  );
  return privateUsers;
};

export const queryEntryPrivateUsers = async (): Promise<PrivateUsers> => {
  const entryPrivateUsersSnapshot = await db
    .collection(collectionPath)
    .withConverter(privateUserConverter)
    .where('entryAt', '!=', null)
    .orderBy('entryAt', 'asc')
    .get();
  const entryPrivateUsers = entryPrivateUsersSnapshot.docs.map(
    (entryPrivateUser) => entryPrivateUser.data()
  );
  return entryPrivateUsers;
};

export const querySubmitPrivateUsers = async (): Promise<PrivateUsers> => {
  const submitPrivateUsersSnapshot = await db
    .collection(collectionPath)
    .withConverter(privateUserConverter)
    .where('entryAt', '!=', null)
    .where('submitAt', '!=', null)
    .orderBy('submitAt', 'asc')
    .get();
  const submitPrivateUsers = submitPrivateUsersSnapshot.docs.map(
    (submitPrivateUser) => submitPrivateUser.data()
  );
  return submitPrivateUsers;
};

export const queryVotePrivateUsers = async (): Promise<PrivateUsers> => {
  const votePrivateUsersSnapshot = await db
    .collection(collectionPath)
    .withConverter(privateUserConverter)
    .where('voteAt', '!=', null)
    .orderBy('voteAt', 'asc')
    .get();
  const votePrivateUsers = votePrivateUsersSnapshot.docs.map(
    (votePrivateUser) => votePrivateUser.data()
  );
  return votePrivateUsers;
};
