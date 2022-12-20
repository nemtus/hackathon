import { db } from '../../../../utils/firebase';
import { converter } from '../../../../utils/firebase/converter';
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

export const privateUserConverter = converter<PrivateUser>();

const collectionPath = '/v/1/scopes/private/users';
const collectionRef = db
  .collection(collectionPath)
  .withConverter(converter<PrivateUser>());
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  db.doc(docPath(id)).withConverter(converter<PrivateUser>());

export const getPrivateUser = async (
  id: string
): Promise<PrivateUser | undefined> => {
  return (await docRef(id).get()).data();
};

export const setPrivateUser = async (
  privateUser: PrivateUser
): Promise<void> => {
  await docRef(privateUser.id).set(privateUser, { merge: true });
};

export const getAllPrivateUsers = async (): Promise<PrivateUsers> => {
  return (await collectionRef.get()).docs.map((snapshot) => snapshot.data());
};

export const queryEntryPrivateUsers = async (): Promise<PrivateUsers> => {
  return (
    await collectionRef
      .where('entryAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const querySubmitPrivateUsers = async (): Promise<PrivateUsers> => {
  return (
    await collectionRef
      .where('entryAt', '!=', null)
      .where('submitAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryVotePrivateUsers = async (): Promise<PrivateUsers> => {
  return (
    await collectionRef
      .where('voteAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
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
    entryAt: adminUser.entryAt,
    submitAt: adminUser.submitAt,
    voteAt: adminUser.voteAt,
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
