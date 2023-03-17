import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PrivateUserYearSubmission } from '../../../../private/users/years/submissions';

export type AdminUserYearSubmission = PrivateUserYearSubmission;

export type AdminUserYearSubmissions = AdminUserYearSubmission[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/submissions`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<AdminUserYearSubmission>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<AdminUserYearSubmission>());

export const getAdminUserYearSubmission = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearSubmission | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setAdminUserYearSubmission = async (
  userId: string,
  adminUserYearSubmission: AdminUserYearSubmission
): Promise<AdminUserYearSubmission | undefined> => {
  if (!adminUserYearSubmission.id) {
    const docRef = await collectionRef(
      userId,
      adminUserYearSubmission.yearId
    ).add(adminUserYearSubmission);
    return (await docRef.get()).data();
  }
  await docRef(
    userId,
    adminUserYearSubmission.yearId,
    adminUserYearSubmission.id
  ).set(adminUserYearSubmission, {
    merge: true,
  });
  return (
    await docRef(
      userId,
      adminUserYearSubmission.yearId,
      adminUserYearSubmission.id
    ).get()
  ).data();
};

export const convertPrivateUserYearSubmissionToAdminUserYearSubmission = (
  privateUserYearSubmission: PrivateUserYearSubmission
): AdminUserYearSubmission => {
  const adminUserYearSubmission: AdminUserYearSubmission =
    privateUserYearSubmission;
  return adminUserYearSubmission;
};
