// Todo: Team
import { AdminUserYearTeam } from 'models/admin/users/years/teams';
import { PublicUserYearTeam } from 'models/public/users/years/teams';
import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';

export type PrivateUserYearTeam = PublicUserYearTeam;

export type PrivateUserYearTeams = PrivateUserYearTeam[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/teams`;
export const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PrivateUserYearTeam>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
export const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<PrivateUserYearTeam>()
  );

export const getPrivateUserYearTeam = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearTeam | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setPrivateUserYearTeam = async (
  userId: string,
  privateUserYearTeam: PrivateUserYearTeam
): Promise<PrivateUserYearTeam | undefined> => {
  if (!privateUserYearTeam.id) {
    const docRef = await addDoc(
      collectionRef(userId, privateUserYearTeam.yearId),
      privateUserYearTeam
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(
    docRef(userId, privateUserYearTeam.yearId, privateUserYearTeam.id),
    privateUserYearTeam,
    {
      merge: true,
    }
  );
  return (
    await getDoc(
      docRef(userId, privateUserYearTeam.yearId, privateUserYearTeam.id)
    )
  ).data();
};

export const convertPrivateUserYearTeamToPublicUserYearTeam = (
  privateUserYearTeam: PrivateUserYearTeam
): PublicUserYearTeam => {
  const publicUserYearTeam: PublicUserYearTeam = privateUserYearTeam;
  return publicUserYearTeam;
};

export const convertPrivateUserYearTeamToAdminUserYearTeam = (
  privateUserYearTeam: PrivateUserYearTeam
): AdminUserYearTeam => {
  const adminUserYearTeam: AdminUserYearTeam = privateUserYearTeam;
  return adminUserYearTeam;
};
