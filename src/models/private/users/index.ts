import { AdminUser } from 'models/admin/users';
import { PublicUser } from 'models/public/users';
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

const collectionPath = '/v/1/scopes/private/users';
const collectionRef = collection(db, collectionPath).withConverter(
  converter<PrivateUser>()
);
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  doc(db, docPath(id)).withConverter(converter<PrivateUser>());

export const getPrivateUser = async (
  id: string
): Promise<PrivateUser | undefined> => {
  return (await getDoc(docRef(id))).data();
};

export const setPrivateUser = async (
  privateUser: PrivateUser
): Promise<void> => {
  await setDoc(docRef(privateUser.id), privateUser, { merge: true });
};

export const getAllPrivateUsers = async (): Promise<PrivateUsers> => {
  return (
    await getDocs(query(collectionRef, orderBy('createdAt', 'asc')))
  ).docs.map((doc) => doc.data());
};

export const queryEntryPrivateUsers = async (): Promise<PrivateUsers> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getDocs(
      query(collectionRef, orderBy('entryAt', 'asc'), startAt(startDate))
    )
  ).docs.map((doc) => doc.data());
};

export const querySubmitPrivateUsers = async (): Promise<PrivateUsers> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getDocs(
      query(collectionRef, orderBy('submitAt', 'asc'), startAt(startDate))
    )
  ).docs.map((doc) => doc.data());
};

export const queryVotePrivateUsers = async (): Promise<PrivateUsers> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getDocs(
      query(collectionRef, orderBy('voteAt', 'asc'), startAt(startDate))
    )
  ).docs.map((doc) => doc.data());
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
