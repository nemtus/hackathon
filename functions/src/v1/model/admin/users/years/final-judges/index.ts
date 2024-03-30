import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PrivateUserYearFinalJudge } from '../../../../private/users/years/final-judges';

export type AdminUserYearFinalJudge = PrivateUserYearFinalJudge;

export type AdminUserYearFinalJudges = AdminUserYearFinalJudge[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/finalJudges`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<AdminUserYearFinalJudge>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<AdminUserYearFinalJudge>());

export const getAdminUserYearFinalJudge = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearFinalJudge | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setAdminUserYearFinalJudge = async (
  userId: string,
  adminUserYearFinalJudge: AdminUserYearFinalJudge
): Promise<AdminUserYearFinalJudge | undefined> => {
  if (!adminUserYearFinalJudge.id) {
    const docRef = await collectionRef(
      userId,
      adminUserYearFinalJudge.yearId
    ).add(adminUserYearFinalJudge);
    return (await docRef.get()).data();
  }
  await docRef(
    userId,
    adminUserYearFinalJudge.yearId,
    adminUserYearFinalJudge.id
  ).set(adminUserYearFinalJudge, {
    merge: true,
  });
  return (
    await docRef(
      userId,
      adminUserYearFinalJudge.yearId,
      adminUserYearFinalJudge.id
    ).get()
  ).data();
};

export const convertPrivateUserYearFinalJudgeToAdminUserYearFinalJudge = (
  privateUserYearFinalJudge: PrivateUserYearFinalJudge
): AdminUserYearFinalJudge => {
  const adminUserYearFinalJudge: AdminUserYearFinalJudge =
    privateUserYearFinalJudge;
  return adminUserYearFinalJudge;
};
