import { db } from '../../../../utils/firebase';
import { converter } from '../../../../utils/firebase/converter';
import { AdminUser } from '../../admin/users';
import { PrivateUser } from '../../private/users';

export type PublicUser = {
  id: string;
  displayName?: string;
  photoUrl?: string;
  twitterId?: string;
  githubId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  entryAt?: Date;
  submitAt?: Date;
  voteAt?: Date;
  multisigAddress?: string;
};

export type PublicUsers = PublicUser[];

export const publicUserConverter = converter<PublicUser>();

const collectionPath = '/v/1/scopes/public/users';
const collectionRef = db
  .collection(collectionPath)
  .withConverter(converter<PublicUser>());
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  db.doc(docPath(id)).withConverter(converter<PublicUser>());

export const getPrivateUser = async (
  id: string
): Promise<PublicUser | undefined> => {
  return (await docRef(id).get()).data();
};

export const setPublicUser = async (publicUser: PublicUser): Promise<void> => {
  await docRef(publicUser.id).set(publicUser, { merge: true });
};

export const getAllPublicUsers = async (): Promise<PublicUsers> => {
  return (await collectionRef.get()).docs.map((snapshot) => snapshot.data());
};

export const queryEntryPublicUsers = async (): Promise<PublicUsers> => {
  return (
    await collectionRef
      .where('entryAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const querySubmitPublicUsers = async (): Promise<PublicUsers> => {
  return (
    await collectionRef
      .where('entryAt', '!=', null)
      .where('submitAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryVotePublicUsers = async (): Promise<PublicUsers> => {
  return (
    await collectionRef
      .where('voteAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const convertAdminUserToPublicUser = (
  adminUser: AdminUser
): PublicUser => {
  const publicUser: PublicUser = {
    id: adminUser.id,
    displayName: adminUser.displayName,
    photoUrl: adminUser.photoUrl,
    twitterId: adminUser.twitterId,
    githubId: adminUser.githubId,
    createdAt: adminUser.createdAt,
    updatedAt: adminUser.updatedAt,
    entryAt: adminUser.entryAt,
    submitAt: adminUser.submitAt,
    voteAt: adminUser.voteAt,
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
    entryAt: privateUser.entryAt,
    submitAt: privateUser.submitAt,
    voteAt: privateUser.voteAt,
    multisigAddress: privateUser.multisigAddress,
  };
  return publicUser;
};
