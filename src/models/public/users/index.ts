import { AdminUser } from 'models/admin/users';
import { PrivateUser } from 'models/private/users';
import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  startAt,
} from '../../../utils/firebase';

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

const collectionPath = '/v/1/scopes/public/users';
const collectionRef = collection(db, collectionPath).withConverter(
  converter<AdminUser>()
);
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  doc(db, docPath(id)).withConverter(converter<AdminUser>());

export const getPrivateUser = async (
  id: string
): Promise<PublicUser | undefined> => {
  return (await getDoc(docRef(id))).data();
};

export const setPublicUser = async (publicUser: PublicUser): Promise<void> => {
  await setDoc(docRef(publicUser.id), publicUser, { merge: true });
};

export const getAllPublicUsers = async (): Promise<PublicUsers> => {
  return (
    await getDocs(query(collectionRef, orderBy('createdAt', 'asc')))
  ).docs.map((doc) => doc.data());
};

export const queryEntryPublicUsers = async (): Promise<PublicUsers> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getDocs(
      query(collectionRef, orderBy('entryAt', 'asc'), startAt(startDate))
    )
  ).docs.map((doc) => doc.data());
};

export const querySubmitPublicUsers = async (): Promise<PublicUsers> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getDocs(
      query(collectionRef, orderBy('submitAt', 'asc'), startAt(startDate))
    )
  ).docs.map((doc) => doc.data());
};

export const queryVotePublicUsers = async (): Promise<PublicUsers> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getDocs(
      query(collectionRef, orderBy('voteAt', 'asc'), startAt(startDate))
    )
  ).docs.map((doc) => doc.data());
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
