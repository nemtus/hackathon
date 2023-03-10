// Todo: Team
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
  addDoc,
} from 'utils/firebase';

export type PublicUserYearTeam = {
  id?: string;
  userId: string;
  yearId: string;
  name: string;
  members: Member[];
  addressForPrizeReceipt: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type Member = {
  id?: string;
  nickName: string;
  twitterId: string;
  githubId: string;
};

export type PublicUserYearTeams = PublicUserYearTeam[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/teams`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PublicUserYearTeam>()
  );
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  doc(db, docPath(id)).withConverter(converter<PublicUserYearTeam>());

export const getPublicUserTeam = async (
  id: string
): Promise<PublicUserYearTeam | undefined> => {
  return (await getDoc(docRef(id))).data();
};

export const setPublicUserTeam = async (
  userId: string,
  publicUserYearTeam: PublicUserYearTeam
): Promise<PublicUserYearTeam | undefined> => {
  if (!publicUserYearTeam.id) {
    const docRef = await addDoc(
      collectionRef(userId, publicUserYearTeam.yearId),
      publicUserYearTeam
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(docRef(publicUserYearTeam.id), publicUserYearTeam, {
    merge: true,
  });
  return (await getDoc(docRef(publicUserYearTeam.id))).data();
};

export const getAllPublicUserEntries = async (
  userId: string,
  yearId: string
): Promise<PublicUserYearTeams> => {
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
): Promise<PublicUserYearTeams> => {
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
): Promise<PublicUserYearTeams> => {
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
): Promise<PublicUserYearTeams> => {
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
