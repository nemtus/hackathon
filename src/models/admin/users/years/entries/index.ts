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

export type AdminUserYearEntry = PrivateUserYearEntry;

export type AdminUserYearEntries = AdminUserYearEntry[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/entries`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<AdminUserYearEntry>()
  );
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  doc(db, docPath(id)).withConverter(converter<AdminUserYearEntry>());

export const getAdminUserEntry = async (
  id: string
): Promise<AdminUserYearEntry | undefined> => {
  return (await getDoc(docRef(id))).data();
};

export const setAdminUserEntry = async (
  adminUser: AdminUserYearEntry
): Promise<void> => {
  await setDoc(docRef(adminUser.id), adminUser, { merge: true });
};

export const getAllAdminUserEntries = async (
  userId: string,
  yearId: string
): Promise<AdminUserYearEntries> => {
  return (
    await getDocs(
      query(collectionRef(userId, yearId), orderBy('createdAt', 'asc'))
    )
  ).docs.map((doc) => doc.data());
};

export const getCountAllAdminUserEntries = async (
  userId: string,
  yearId: string
): Promise<number> => {
  return (await getCountFromServer(query(collectionRef(userId, yearId)))).data()
    .count;
};

export const queryEntryAdminUserEntries = async (
  userId: string,
  yearId: string
): Promise<AdminUserYearEntries> => {
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

export const getCountEntryAdminUserEntries = async (
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

export const querySubmitAdminUserEntries = async (
  userId: string,
  yearId: string
): Promise<AdminUserYearEntries> => {
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

export const getCountSubmitAdminUserEntries = async (
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

export const queryVoteAdminUserEntries = async (
  userId: string,
  yearId: string
): Promise<AdminUserYearEntries> => {
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

export const convertAdminUserToAdminUser = (
  adminUserYearEntry: AdminUserYearEntry
): AdminUserYearEntry => {
  const adminUser: AdminUserYearEntry = {
    id: adminUserYearEntry.id,
    yearId: adminUserYearEntry.yearId,
    userId: adminUserYearEntry.userId,
    createdAt: adminUserYearEntry.createdAt,
    updatedAt: adminUserYearEntry.updatedAt,
  };
  return adminUser;
};
