import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { PrivateUserYearSubmission } from 'models/private/users/years/submissions';

export type AdminUserYearSubmission = PrivateUserYearSubmission;

export type AdminUserYearSubmissions = AdminUserYearSubmission[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/submissions`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<AdminUserYearSubmission>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<AdminUserYearSubmission>()
  );

export const getAdminUserYearSubmission = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearSubmission | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setAdminUserYearSubmission = async (
  userId: string,
  adminUserYearSubmission: AdminUserYearSubmission
): Promise<AdminUserYearSubmission | undefined> => {
  if (!adminUserYearSubmission.id) {
    const docRef = await addDoc(
      collectionRef(userId, adminUserYearSubmission.yearId),
      adminUserYearSubmission
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(
    docRef(userId, adminUserYearSubmission.yearId, adminUserYearSubmission.id),
    adminUserYearSubmission,
    {
      merge: true,
    }
  );
  return (
    await getDoc(
      docRef(userId, adminUserYearSubmission.yearId, adminUserYearSubmission.id)
    )
  ).data();
};

export const convertPrivateUserYearSubmissionToAdminUserYearSubmission = (
  privateUserYearSubmission: PrivateUserYearSubmission
): AdminUserYearSubmission => {
  const adminUserYearSubmission: AdminUserYearSubmission =
    privateUserYearSubmission;
  return adminUserYearSubmission;
};
