import { db } from '../../../../../../utils/firebase';
import { converter } from '../../../../../../utils/firebase/converter';
import { AdminUserYearEntry } from '../../../../admin/users/years/entries';
import { PrivateUserYearEntry } from '../../../../private/users/years/entries';

export type PublicUserYearEntry = {
  id: string;
  yearId?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PublicUserEntries = PublicUserYearEntry[];

export const publicUserConverter = converter<PublicUserYearEntry>();

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/entries`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PublicUserYearEntry>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PublicUserYearEntry>());

export const getPublicUserYearEntry = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PublicUserYearEntry | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPublicUserYearEntry = async (
  userId: string,
  yearId: string,
  publicUserYearEntry: PublicUserYearEntry
): Promise<void> => {
  await docRef(userId, yearId, publicUserYearEntry.id).set(
    publicUserYearEntry,
    {
      merge: true,
    }
  );
};

export const getAllPublicUserYearEntries = async (
  userId: string,
  yearId: string
): Promise<PublicUserEntries> => {
  return (await collectionRef(userId, yearId).get()).docs.map((snapshot) =>
    snapshot.data()
  );
};

export const queryEntryPublicUserYearEntries = async (
  userId: string,
  yearId: string
): Promise<PublicUserEntries> => {
  return (
    await collectionRef(userId, yearId)
      .where('entryAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const querySubmitPublicUserYearEntries = async (
  userId: string,
  yearId: string
): Promise<PublicUserEntries> => {
  return (
    await collectionRef(userId, yearId)
      .where('entryAt', '!=', null)
      .where('submitAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryVotePublicUserYearEntries = async (
  userId: string,
  yearId: string
): Promise<PublicUserEntries> => {
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

export const convertAdminUserYearEntryToPublicUserYearEntry = (
  adminUserYearEntry: AdminUserYearEntry
): PublicUserYearEntry => {
  const publicUserYearEntry: PublicUserYearEntry = {
    id: adminUserYearEntry.id,
    yearId: adminUserYearEntry.yearId,
    userId: adminUserYearEntry.userId,
    createdAt: adminUserYearEntry.createdAt,
    updatedAt: adminUserYearEntry.updatedAt,
  };
  return publicUserYearEntry;
};

export const convertPrivateUserYearEntryToPublicUserYearEntry = (
  privateUserYearEntry: PrivateUserYearEntry
): PublicUserYearEntry => {
  const publicUserYearEntry: PublicUserYearEntry = {
    id: privateUserYearEntry.id,
    yearId: privateUserYearEntry.yearId,
    userId: privateUserYearEntry.userId,
    createdAt: privateUserYearEntry.createdAt,
    updatedAt: privateUserYearEntry.updatedAt,
  };
  return publicUserYearEntry;
};
