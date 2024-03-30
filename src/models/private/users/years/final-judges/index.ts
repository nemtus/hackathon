import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { AdminUserYearFinalJudge } from 'models/admin/users/years/final-judges';
import { PublicUserYearFinalJudge } from 'models/public/users/years/final-judges';

export type PrivateUserYearFinalJudge = PublicUserYearFinalJudge;

export type PrivateUserYearFinalJudges = PrivateUserYearFinalJudge[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/finalJudges`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PrivateUserYearFinalJudge>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
export const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<PrivateUserYearFinalJudge>()
  );

export const getPrivateUserYearFinalJudge = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearFinalJudge | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setPrivateUserYearFinalJudge = async (
  userId: string,
  privateUserYearJudge: PrivateUserYearFinalJudge
): Promise<PrivateUserYearFinalJudge | undefined> => {
  if (!privateUserYearJudge.id) {
    const docRef = await addDoc(
      collectionRef(userId, privateUserYearJudge.yearId),
      privateUserYearJudge
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(
    docRef(userId, privateUserYearJudge.yearId, privateUserYearJudge.id),
    privateUserYearJudge,
    {
      merge: true,
    }
  );
  return (
    await getDoc(
      docRef(userId, privateUserYearJudge.yearId, privateUserYearJudge.id)
    )
  ).data();
};

export const convertPrivateYearJudgeToAdminUserYearJudge = (
  privateUserYearFinalJudge: PrivateUserYearFinalJudge
): AdminUserYearFinalJudge => {
  const adminUserYearFinalJudge: AdminUserYearFinalJudge =
    privateUserYearFinalJudge;
  return adminUserYearFinalJudge;
};

export const convertPrivateUserYearJudgeToPublicUserYearJudge = (
  privateUserYearFinalJudge: PrivateUserYearFinalJudge
): PrivateUserYearFinalJudge => {
  const publicUserYearFinalJudge: PublicUserYearFinalJudge =
    privateUserYearFinalJudge;
  return publicUserYearFinalJudge;
};
