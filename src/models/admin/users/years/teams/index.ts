// Todo: Team
import { PrivateUserYearTeam } from 'models/private/users/years/teams';
import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';

export type AdminUserYearTeam = PrivateUserYearTeam;

export type AdminUserYearTeams = AdminUserYearTeam[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/teams`;
export const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<AdminUserYearTeam>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
export const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<AdminUserYearTeam>()
  );

export const getAdminUserYearTeam = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearTeam | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setAdminUserYearTeam = async (
  userId: string,
  adminUserYearTeam: AdminUserYearTeam
): Promise<AdminUserYearTeam | undefined> => {
  if (!adminUserYearTeam.id) {
    const docRef = await addDoc(
      collectionRef(userId, adminUserYearTeam.yearId),
      adminUserYearTeam
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(
    docRef(userId, adminUserYearTeam.yearId, adminUserYearTeam.id),
    adminUserYearTeam,
    {
      merge: true,
    }
  );
  return (
    await getDoc(docRef(userId, adminUserYearTeam.yearId, adminUserYearTeam.id))
  ).data();
};
