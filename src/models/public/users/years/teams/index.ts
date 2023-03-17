import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { PublicUser } from 'models/public/users';
import { PrivateUserYearTeam } from 'models/private/users/years/teams';

export type PublicUserYearTeam = {
  id: string; // Note: 1 user can create only 1 team with rule userId = teamId
  yearId: string;
  name: string;
  users: PublicUser[];
  teamAddress?: string;
  addressForPrizeReceipt: string;
  createdAt?: Date;
  updatedAt?: Date;
  approved: boolean;
  approvedAt?: Date;
};

export type PublicUserYearTeams = PublicUserYearTeam[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/teams`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PublicUserYearTeam>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<PublicUserYearTeam>()
  );

export const getPublicUserYearTeam = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PublicUserYearTeam | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setPublicUserYearTeam = async (
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
  await setDoc(
    docRef(userId, publicUserYearTeam.yearId, publicUserYearTeam.id),
    publicUserYearTeam,
    {
      merge: true,
    }
  );
  return (
    await getDoc(
      docRef(userId, publicUserYearTeam.yearId, publicUserYearTeam.id)
    )
  ).data();
};

export const convertPrivateUserYearTeamToPublicUserYearTeam = (
  privateUserYearTeam: PrivateUserYearTeam
): PublicUserYearTeam => {
  const publicUserYearTeam: PublicUserYearTeam = privateUserYearTeam;
  return publicUserYearTeam;
};
