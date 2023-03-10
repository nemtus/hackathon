// Todo: Team
import { AdminUserYearEntry } from 'models/admin/users/years/entries';
import { PublicUserYearEntry } from 'models/public/users/years/entries';
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

export type PrivateUserYearEntry = PublicUserYearEntry;

export type PrivateUserYearEntries = PrivateUserYearEntry[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/entries`;
export const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PrivateUserYearEntry>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
export const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<PrivateUserYearEntry>()
  );

export const getPrivateUserEntry = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearEntry | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setPrivateUserEntry = async (
  userId: string,
  yearId: string,
  privateUserEntry: PrivateUserYearEntry
): Promise<void> => {
  await setDoc(docRef(userId, yearId, privateUserEntry.id), privateUserEntry, {
    merge: true,
  });
};

export const getAllPrivateUserEntries = async (
  userId: string,
  yearId: string
): Promise<PrivateUserYearEntries> => {
  return (
    await getDocs(
      query(collectionRef(userId, yearId), orderBy('createdAt', 'asc'))
    )
  ).docs.map((doc) => doc.data());
};

export const getCountAllPrivateUserEntries = async (
  userId: string,
  yearId: string
): Promise<number> => {
  return (await getCountFromServer(query(collectionRef(userId, yearId)))).data()
    .count;
};

export const queryEntryPrivateUserEntries = async (
  userId: string,
  yearId: string
): Promise<PrivateUserYearEntries> => {
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

export const getCountEntryPrivateUserEntries = async (
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

export const querySubmitPrivateUserEntries = async (
  userId: string,
  yearId: string
): Promise<PrivateUserYearEntries> => {
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

export const getCountSubmitPrivateUserEntries = async (
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

export const queryVotePrivateUserEntries = async (
  userId: string,
  yearId: string
): Promise<PrivateUserYearEntries> => {
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

export const convertAdminUserToPrivateUser = (
  adminUserYearEntry: AdminUserYearEntry
): PrivateUserYearEntry => {
  const privateUser: PrivateUserYearEntry = {
    id: adminUserYearEntry.id,
    yearId: adminUserYearEntry.yearId,
    userId: adminUserYearEntry.userId,
    createdAt: adminUserYearEntry.createdAt,
    updatedAt: adminUserYearEntry.updatedAt,
  };
  return privateUser;
};
