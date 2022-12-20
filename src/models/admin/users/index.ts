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

const collectionPath = '/v/1/scopes/admin/users';
const collectionRef = collection(db, collectionPath).withConverter(
  converter<AdminUser>()
);
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  doc(db, docPath(id)).withConverter(converter<AdminUser>());

export const getAdminUser = async (
  id: string
): Promise<AdminUser | undefined> => {
  return (await getDoc(docRef(id))).data();
};

export const setAdminUser = async (adminUser: AdminUser): Promise<void> => {
  await setDoc(docRef(adminUser.id), adminUser, { merge: true });
};

export const getAllAdminUsers = async (): Promise<AdminUsers> => {
  return (
    await getDocs(query(collectionRef, orderBy('createdAt', 'asc')))
  ).docs.map((doc) => doc.data());
};

export const queryEntryAdminUsers = async (): Promise<AdminUsers> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getDocs(
      query(collectionRef, orderBy('entryAt', 'asc'), startAt(startDate))
    )
  ).docs.map((doc) => doc.data());
};

export const querySubmitAdminUsers = async (): Promise<AdminUsers> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getDocs(
      query(collectionRef, orderBy('submitAt', 'asc'), startAt(startDate))
    )
  ).docs.map((doc) => doc.data());
};

export const queryVoteAdminUsers = async (): Promise<AdminUsers> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getDocs(
      query(collectionRef, orderBy('voteAt', 'asc'), startAt(startDate))
    )
  ).docs.map((doc) => doc.data());
};
