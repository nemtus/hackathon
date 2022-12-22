import { db } from '../../../../../../utils/firebase';
import { converter } from '../../../../../../utils/firebase/converter';
import { AdminUserYearEntry } from '../../../../admin/users/years/entries';
import { PublicUserYearEntry } from '../../../../public/users/years/entries';

export type PrivateUserYearEntry = PublicUserYearEntry;

export type PrivateUserEntries = PrivateUserYearEntry[];

export const privateUserYearEntryConverter = converter<PrivateUserYearEntry>();

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/entries`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PrivateUserYearEntry>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PrivateUserYearEntry>());

export const getPrivateUserYearEntry = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearEntry | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPrivateUserYearEntry = async (
  userId: string,
  yearId: string,
  privateUserYearEntry: PrivateUserYearEntry
): Promise<void> => {
  await docRef(userId, yearId, privateUserYearEntry.id).set(
    privateUserYearEntry,
    {
      merge: true,
    }
  );
};

export const getAllPrivateUserYearEntries = async (
  userId: string,
  yearId: string
): Promise<PrivateUserEntries> => {
  return (await collectionRef(userId, yearId).get()).docs.map((snapshot) =>
    snapshot.data()
  );
};

export const queryEntryPrivateUserYearEntries = async (
  userId: string,
  yearId: string
): Promise<PrivateUserEntries> => {
  return (
    await collectionRef(userId, yearId)
      .where('entryAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const querySubmitPrivateUserYearEntries = async (
  userId: string,
  yearId: string
): Promise<PrivateUserEntries> => {
  return (
    await collectionRef(userId, yearId)
      .where('entryAt', '!=', null)
      .where('submitAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryVotePrivateUserYearEntries = async (
  userId: string,
  yearId: string
): Promise<PrivateUserEntries> => {
  return (
    await collectionRef(userId, yearId)
      .where('voteAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const convertAdminUserYearEntryToPrivateUserYearEntry = (
  adminUserYearEntry: AdminUserYearEntry
): PrivateUserYearEntry => {
  const privateUserYearEntry: PrivateUserYearEntry = {
    id: adminUserYearEntry.id,
    yearId: adminUserYearEntry.yearId,
    userId: adminUserYearEntry.userId,
    createdAt: adminUserYearEntry.createdAt,
    updatedAt: adminUserYearEntry.updatedAt,
  };
  return privateUserYearEntry;
};
