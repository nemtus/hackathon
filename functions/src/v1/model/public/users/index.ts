import { DocumentData, QueryDocumentSnapshot } from 'firebase-admin/firestore';
import { db, FieldValue } from '../../../../utils/firebase';
import { omitUndefinedProperties } from '../../../../utils/typescript/omitUndefinedProperties';
import { AdminUser as PrivateUser } from '../../admin/users';

export type PublicUser = {
  id: string;
  displayName?: string;
  photoUrl?: string;
  twitterId?: string;
  githubId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  entryAt: Date | null;
  submitAt: Date | null;
  voteAt: Date | null;
  multisigAddress?: string;
};

export type PublicUsers = PublicUser[];

export const publicUserConverter = {
  toFirestore: (publicUser: PublicUser): DocumentData => {
    return omitUndefinedProperties({
      id: publicUser.id,
      displayName: publicUser.displayName,
      photoUrl: publicUser.photoUrl,
      twitterId: publicUser.twitterId,
      githubId: publicUser.githubId,
      createdAt: publicUser.createdAt
        ? FieldValue.serverTimestamp()
        : undefined,
      updatedAt: FieldValue.serverTimestamp(),
      entryAt: publicUser.entryAt ? FieldValue.serverTimestamp() : null,
      submitAt: publicUser.submitAt ? FieldValue.serverTimestamp() : null,
      voteAt: publicUser.voteAt ? FieldValue.serverTimestamp() : null,
      multisigAddress: publicUser.multisigAddress,
    });
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot): PublicUser => {
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
      multisigAddress: data.multisigAddress,
    };
  },
};

export const convertAdminUserToPublicUser = (
  adminUser: PrivateUser
): PublicUser => {
  const publicUser: PublicUser = {
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
    multisigAddress: adminUser.multisigAddress,
  };
  return publicUser;
};

export const convertPrivateUserToPublicUser = (
  privateUser: PrivateUser
): PublicUser => {
  const publicUser: PublicUser = {
    id: privateUser.id,
    displayName: privateUser.displayName,
    photoUrl: privateUser.photoUrl,
    twitterId: privateUser.twitterId,
    githubId: privateUser.githubId,
    createdAt: privateUser.createdAt,
    updatedAt: privateUser.updatedAt,
    entryAt: privateUser.entryAt ? privateUser.entryAt : null,
    submitAt: privateUser.submitAt ? privateUser.submitAt : null,
    voteAt: privateUser.voteAt ? privateUser.voteAt : null,
    multisigAddress: privateUser.multisigAddress,
  };
  return publicUser;
};

const collectionPath = '/v/1/scopes/public/users';
const docPath = (id: string) => `${collectionPath}/${id}`;

export const getPrivateUser = async (
  id: string
): Promise<PublicUser | undefined> => {
  const publicUserSnapshot = await db
    .doc(docPath(id))
    .withConverter(publicUserConverter)
    .get();
  const publicUser = publicUserSnapshot.data();
  return publicUser;
};

export const setPublicUser = async (publicUser: PublicUser): Promise<void> => {
  await db
    .doc(docPath(publicUser.id))
    .withConverter(publicUserConverter)
    .set(publicUser, { merge: true });
};

export const getAllPublicUsers = async (): Promise<PublicUsers> => {
  const publicUsersSnapshot = await db
    .collection(collectionPath)
    .withConverter(publicUserConverter)
    .get();
  const publicUsers = publicUsersSnapshot.docs.map((publicUserSnapshot) =>
    publicUserSnapshot.data()
  );
  return publicUsers;
};

export const queryEntryPublicUsers = async (): Promise<PublicUsers> => {
  const entryPublicUsersSnapshot = await db
    .collection(collectionPath)
    .withConverter(publicUserConverter)
    .where('entryAt', '!=', null)
    .orderBy('entryAt', 'asc')
    .get();
  const entryPublicUsers = entryPublicUsersSnapshot.docs.map(
    (entryPublicUser) => entryPublicUser.data()
  );
  return entryPublicUsers;
};

export const querySubmitPublicUsers = async (): Promise<PublicUsers> => {
  const submitPublicUsersSnapshot = await db
    .collection(collectionPath)
    .withConverter(publicUserConverter)
    .where('entryAt', '!=', null)
    .where('submitAt', '!=', null)
    .orderBy('submitAt', 'asc')
    .get();
  const submitPublicUsers = submitPublicUsersSnapshot.docs.map(
    (submitPublicUser) => submitPublicUser.data()
  );
  return submitPublicUsers;
};

export const queryVotePublicUsers = async (): Promise<PublicUsers> => {
  const votePublicUsersSnapshot = await db
    .collection(collectionPath)
    .withConverter(publicUserConverter)
    .where('voteAt', '!=', null)
    .orderBy('voteAt', 'asc')
    .get();
  const votePublicUsers = votePublicUsersSnapshot.docs.map((votePublicUser) =>
    votePublicUser.data()
  );
  return votePublicUsers;
};
