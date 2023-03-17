// Todo: Team
import { AdminUserYearSubmission } from 'models/admin/users/years/submissions';
import { PublicUserYearSubmission } from 'models/public/users/years/submissions';
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

export type PrivateUserYearSubmission = PublicUserYearSubmission;

export type PrivateUserYearSubmissions = PrivateUserYearSubmission[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/submissions`;
export const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PrivateUserYearSubmission>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
export const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<PrivateUserYearSubmission>()
  );

export const getPrivateUserYearSubmission = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearSubmission | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setPrivateUserYearSubmission = async (
  userId: string,
  privateUserYearSubmission: PrivateUserYearSubmission
): Promise<PrivateUserYearSubmission | undefined> => {
  if (!privateUserYearSubmission.id) {
    const docRef = await addDoc(
      collectionRef(userId, privateUserYearSubmission.yearId),
      privateUserYearSubmission
    );
    return (await getDoc(docRef)).data();
  }

  try {
    await runTransaction(db, async (transaction) => {
      const privateUserYearSubmissionDocRef = docRef(
        userId,
        privateUserYearSubmission.yearId,
        privateUserYearSubmission.id
      );
      const privateUserYearSubmissionDoc = await transaction.get(
        privateUserYearSubmissionDocRef
      );
      if (!privateUserYearSubmissionDoc.exists()) {
        transaction.set(
          privateUserYearSubmissionDocRef,
          privateUserYearSubmission
        );
        return (
          await getDoc(
            docRef(
              userId,
              privateUserYearSubmission.yearId,
              privateUserYearSubmission.id
            )
          )
        ).data();
      }
      transaction.update(
        privateUserYearSubmissionDocRef,
        privateUserYearSubmission
      );
      return (
        await getDoc(
          docRef(
            userId,
            privateUserYearSubmission.yearId,
            privateUserYearSubmission.id
          )
        )
      ).data();
    });
  } catch (error) {
    console.error(error);
  }
};

export const getAllPrivateUserYearSubmissions = async (
  userId: string,
  yearId: string
): Promise<PrivateUserYearSubmissions> => {
  return (
    await getDocs(
      query(collectionRef(userId, yearId), orderBy('createdAt', 'asc'))
    )
  ).docs.map((doc) => doc.data());
};

export const convertPrivateUserYearSubmissionToPublicUserYearSubmission = (
  privateUserYearSubmission: PrivateUserYearSubmission
): PublicUserYearSubmission => {
  const publicUserYearSubmission: PublicUserYearSubmission =
    privateUserYearSubmission;
  return publicUserYearSubmission;
};

export const convertPrivateUserYearSubmissionToAdminUserYearSubmission = (
  privateUserYearSubmission: PrivateUserYearSubmission
): AdminUserYearSubmission => {
  const adminUserYearSubmission: AdminUserYearSubmission =
    privateUserYearSubmission;
  return adminUserYearSubmission;
};
