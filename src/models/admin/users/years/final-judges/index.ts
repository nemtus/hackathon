import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { PrivateUserYearFinalJudge } from 'models/private/users/years/final-judges';

export type AdminUserYearFinalJudge = PrivateUserYearFinalJudge;

export type AdminUserYearFinalJudges = AdminUserYearFinalJudge[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/finalJudges`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<AdminUserYearFinalJudge>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<AdminUserYearFinalJudge>()
  );

export const getAdminUserYearFinalJudge = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearFinalJudge | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setAdminUserYearFinalJudge = async (
  userId: string,
  adminUserYearJudge: AdminUserYearFinalJudge
): Promise<AdminUserYearFinalJudge | undefined> => {
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

export const convertPrivateUserYearFinalJudgeToAdminUserYearFinalJudge = (
  privateUserYearFinalJudge: PrivateUserYearFinalJudge
): AdminUserYearFinalJudge => {
  const adminUserYearFinalJudge: AdminUserYearFinalJudge =
    privateUserYearFinalJudge;
  return adminUserYearFinalJudge;
};
