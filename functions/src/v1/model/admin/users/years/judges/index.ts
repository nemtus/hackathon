import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PrivateUserYearJudge } from '../../../../private/users/years/judges';

export type AdminUserYearJudge = PrivateUserYearJudge;

export type AdminUserYearJudges = AdminUserYearJudge[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/judges`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<AdminUserYearJudge>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<AdminUserYearJudge>());

export const getAdminUserYearJudge = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearJudge | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setAdminUserYearJudge = async (
  userId: string,
  adminUserYearJudge: AdminUserYearJudge
): Promise<AdminUserYearJudge | undefined> => {
  if (!adminUserYearJudge.id) {
    const docRef = await collectionRef(userId, adminUserYearJudge.yearId).add(
      adminUserYearJudge
    );
    return (await docRef.get()).data();
  }
  await docRef(userId, adminUserYearJudge.yearId, adminUserYearJudge.id).set(
    adminUserYearJudge,
    {
      merge: true,
    }
  );
  return (
    await docRef(userId, adminUserYearJudge.yearId, adminUserYearJudge.id).get()
  ).data();
};

export const convertPrivateUserYearJudgeToAdminUserYearJudge = (
  privateUserYearJudge: PrivateUserYearJudge
): AdminUserYearJudge => {
  const adminUserYearJudge: AdminUserYearJudge = privateUserYearJudge;
  return adminUserYearJudge;
};
