import { db } from '../../../../utils/firebase';
import { converter } from '../../../../utils/firebase/converter';
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

export const adminUserConverter = converter<AdminUser>();

const collectionPath = '/v/1/scopes/admin/users';
const collectionRef = db
  .collection(collectionPath)
  .withConverter(converter<AdminUser>());
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  db.doc(docPath(id)).withConverter(converter<AdminUser>());

export const getAdminUser = async (
  id: string
): Promise<AdminUser | undefined> => {
  return (await docRef(id).get()).data();
};

export const setAdminUser = async (adminUser: AdminUser): Promise<void> => {
  await docRef(adminUser.id).set(adminUser, { merge: true });
};

export const getAllAdminUsers = async (): Promise<AdminUsers> => {
  return (await collectionRef.get()).docs.map((snapshot) => snapshot.data());
};

export const queryEntryAdminUsers = async (): Promise<AdminUsers> => {
  return (
    await collectionRef
      .where('entryAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const querySubmitAdminUsers = async (): Promise<AdminUsers> => {
  return (
    await collectionRef
      .where('entryAt', '!=', null)
      .where('submitAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryVoteAdminUsers = async (): Promise<AdminUsers> => {
  return (
    await collectionRef
      .where('voteAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};
