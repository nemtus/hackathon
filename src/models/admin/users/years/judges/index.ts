import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { PrivateUserYearJudge } from 'models/private/users/years/judges';

export type AdminUserYearJudge = PrivateUserYearJudge;

export type AdminUserYearJudges = AdminUserYearJudge[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/judges`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<AdminUserYearJudge>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<AdminUserYearJudge>()
  );

export const getAdminUserYearJudge = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearJudge | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setAdminUserYearJudge = async (
  userId: string,
  adminUserYearJudge: AdminUserYearJudge
): Promise<AdminUserYearJudge | undefined> => {
  if (!adminUserYearJudge.id) {
    const docRef = await addDoc(
      collectionRef(userId, adminUserYearJudge.yearId),
      adminUserYearJudge
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(
    docRef(userId, adminUserYearJudge.yearId, adminUserYearJudge.id),
    adminUserYearJudge,
    {
      merge: true,
    }
  );
  return (
    await getDoc(
      docRef(userId, adminUserYearJudge.yearId, adminUserYearJudge.id)
    )
  ).data();
};

export const convertPrivateUserYearJudgeToAdminUserYearJudge = (
  privateUserYearVote: PrivateUserYearJudge
): AdminUserYearJudge => {
  const adminUserYearJudge: AdminUserYearJudge = privateUserYearVote;
  return adminUserYearJudge;
};
