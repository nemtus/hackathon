import { AdminUserYearEntry } from 'models/admin/users/years/entries';
import { PrivateUserYearEntry } from 'models/private/users/years/entries';
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
  getCountFromServer,
} from 'utils/firebase';

export type PublicUserYearEntry = {
  id: string;
  yearId?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type PublicUserYearEntries = PublicUserYearEntry[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/entries`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PublicUserYearEntry>()
  );
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  doc(db, docPath(id)).withConverter(converter<PublicUserYearEntry>());

export const getPublicUserEntry = async (
  id: string
): Promise<PublicUserYearEntry | undefined> => {
  return (await getDoc(docRef(id))).data();
};

export const setPublicUserEntry = async (
  publicUser: PublicUserYearEntry
): Promise<void> => {
  await setDoc(docRef(publicUser.id), publicUser, { merge: true });
};

export const getAllPublicUserEntries = async (
  userId: string,
  yearId: string
): Promise<PublicUserYearEntries> => {
  return (
    await getDocs(
      query(collectionRef(userId, yearId), orderBy('createdAt', 'asc'))
    )
  ).docs.map((doc) => doc.data());
};

export const getCountAllPublicUserEntries = async (
  userId: string,
  yearId: string
): Promise<number> => {
  return (await getCountFromServer(query(collectionRef(userId, yearId)))).data()
    .count;
};

export const queryEntryPublicUserEntries = async (
  userId: string,
  yearId: string
): Promise<PublicUserYearEntries> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getDocs(
      query(
        collectionRef(userId, yearId),
        orderBy('entryAt', 'asc'),
        startAt(startDate)
      )
    )
  ).docs.map((doc) => doc.data());
};

export const getCountEntryPublicUserEntries = async (
  userId: string,
  yearId: string
): Promise<number> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getCountFromServer(
      query(
        collectionRef(userId, yearId),
        orderBy('entryAt', 'asc'),
        startAt(startDate)
      )
    )
  ).data().count;
};

export const querySubmitPublicUserEntries = async (
  userId: string,
  yearId: string
): Promise<PublicUserYearEntries> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getDocs(
      query(
        collectionRef(userId, yearId),
        orderBy('submitAt', 'asc'),
        startAt(startDate)
      )
    )
  ).docs.map((doc) => doc.data());
};

export const getCountSubmitPublicUserEntries = async (
  userId: string,
  yearId: string
): Promise<number> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getCountFromServer(
      query(
        collectionRef(userId, yearId),
        orderBy('submitAt', 'asc'),
        startAt(startDate)
      )
    )
  ).data().count;
};

export const queryVotePublicUserEntries = async (
  userId: string,
  yearId: string
): Promise<PublicUserYearEntries> => {
  const startDate = new Date('2022-12-17T00:00:00.000Z');
  return (
    await getDocs(
      query(
        collectionRef(userId, yearId),
        orderBy('voteAt', 'asc'),
        startAt(startDate)
      )
    )
  ).docs.map((doc) => doc.data());
};

export const convertAdminUserToPublicUser = (
  adminUserYearEntry: AdminUserYearEntry
): PublicUserYearEntry => {
  const publicUser: PublicUserYearEntry = {
    id: adminUserYearEntry.id,
    yearId: adminUserYearEntry.yearId,
    userId: adminUserYearEntry.userId,
    createdAt: adminUserYearEntry.createdAt,
    updatedAt: adminUserYearEntry.updatedAt,
  };
  return publicUser;
};

export const convertPrivateUserToPublicUser = (
  privateUserYearEntry: PrivateUserYearEntry
): PublicUserYearEntry => {
  const publicUser: PublicUserYearEntry = {
    id: privateUserYearEntry.id,
    yearId: privateUserYearEntry.yearId,
    userId: privateUserYearEntry.userId,
    createdAt: privateUserYearEntry.createdAt,
    updatedAt: privateUserYearEntry.updatedAt,
  };
  return publicUser;
};
