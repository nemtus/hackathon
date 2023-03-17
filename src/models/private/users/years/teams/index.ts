// Todo: Team
import { AdminUserYearTeam } from 'models/admin/users/years/teams';
import { PublicUserYearTeam } from 'models/public/users/years/teams';
import db, {
  doc,
  converter,
  getDoc,
  getDocs,
  // setDoc,
  collection,
  addDoc,
  runTransaction,
  query,
  orderBy,
} from 'utils/firebase';

export type PrivateUserYearTeam = {
  teamPublicKey?: string;
} & PublicUserYearTeam;

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

  try {
    await runTransaction(db, async (transaction) => {
      const privateUserYearTeamDocRef = docRef(
        userId,
        privateUserYearTeam.yearId,
        privateUserYearTeam.id
      );
      const privateUserYearTeamDoc = await transaction.get(
        privateUserYearTeamDocRef
      );
      if (!privateUserYearTeamDoc.exists()) {
        transaction.set(privateUserYearTeamDocRef, privateUserYearTeam);
        return (
          await getDoc(
            docRef(userId, privateUserYearTeam.yearId, privateUserYearTeam.id)
          )
        ).data();
      }
      transaction.update(privateUserYearTeamDocRef, privateUserYearTeam);
      return (
        await getDoc(
          docRef(userId, privateUserYearTeam.yearId, privateUserYearTeam.id)
        )
      ).data();
    });
  } catch (error) {
    console.error(error);
  }
};

export const getAllPrivateUserYearTeams = async (
  userId: string,
  yearId: string
): Promise<PrivateUserYearTeams> => {
  return (
    await getDocs(
      query(collectionRef(userId, yearId), orderBy('createdAt', 'asc'))
    )
  ).docs.map((doc) => doc.data());
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
