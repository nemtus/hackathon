import { db } from '../../../../../../utils/firebase';
import { converter } from '../../../../../../utils/firebase/converter';
import { PrivateUserYearEntry } from '../../../../private/users/years/entries';

export type AdminUserYearEntry = PrivateUserYearEntry;

export type AdminUserEntries = AdminUserYearEntry[];

export const adminUserConverter = converter<AdminUserYearEntry>();

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/entries`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<AdminUserYearEntry>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<AdminUserYearEntry>());

export const getAdminUserYearEntry = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearEntry | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setAdminUserYearEntry = async (
  userId: string,
  yearId: string,
  adminUserYearEntry: AdminUserYearEntry
): Promise<void> => {
  await docRef(userId, yearId, adminUserYearEntry.id).set(adminUserYearEntry, {
    merge: true,
  });
};

export const getAllAdminUserYearEntries = async (
  userId: string,
  yearId: string
): Promise<AdminUserEntries> => {
  return (await collectionRef(userId, yearId).get()).docs.map((snapshot) =>
    snapshot.data()
  );
};

export const queryEntryAdminUserYearEntries = async (
  userId: string,
  yearId: string
): Promise<AdminUserEntries> => {
  return (
    await collectionRef(userId, yearId)
      .where('entryAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const querySubmitAdminUserYearEntries = async (
  userId: string,
  yearId: string
): Promise<AdminUserEntries> => {
  return (
    await collectionRef(userId, yearId)
      .where('entryAt', '!=', null)
      .where('submitAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryVoteAdminUserYearEntries = async (
  userId: string,
  yearId: string
): Promise<AdminUserEntries> => {
  return (
    await collectionRef(userId, yearId)
      .where('voteAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const convertPrivateUserYearEntryToAdminUserYearEntry = (
  privateUserYearEntry: PrivateUserYearEntry
): AdminUserYearEntry => {
  const adminUserYearEntry: AdminUserYearEntry = {
    id: privateUserYearEntry.id,
    yearId: privateUserYearEntry.yearId,
    userId: privateUserYearEntry.userId,
    createdAt: privateUserYearEntry.createdAt,
    updatedAt: privateUserYearEntry.updatedAt,
  };
  return adminUserYearEntry;
};
