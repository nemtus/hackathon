import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { AdminUserYearJudge } from 'models/admin/users/years/judges';
import { PublicUserYearJudge } from 'models/public/users/years/judges';

export type PrivateUserYearJudge = PublicUserYearJudge;

export type PublicUserYearJudges = PrivateUserYearJudge[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/judges`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PrivateUserYearJudge>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<PrivateUserYearJudge>()
  );

export const getPrivateUserYearJudge = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearJudge | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setPrivateUserYearJudge = async (
  userId: string,
  privateUserYearJudge: PrivateUserYearJudge
): Promise<PrivateUserYearJudge | undefined> => {
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
  privateUserYearJudge: PrivateUserYearJudge
): AdminUserYearJudge => {
  const adminUserYearJudge: AdminUserYearJudge = privateUserYearJudge;
  return adminUserYearJudge;
};

export const convertPrivateUserYearJudgeToPublicUserYearJudge = (
  privateUserYearJudge: PrivateUserYearJudge
): PrivateUserYearJudge => {
  const publicUserYearJudge: PrivateUserYearJudge = privateUserYearJudge;
  return publicUserYearJudge;
};
