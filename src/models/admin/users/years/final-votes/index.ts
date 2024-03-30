import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { PrivateUserYearFinalVote } from 'models/private/users/years/final-votes';

export type AdminUserYearFinalVote = PrivateUserYearFinalVote;

export type AdminUserYearFinalVotes = AdminUserYearFinalVote[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/finalVotes`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<AdminUserYearFinalVote>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<AdminUserYearFinalVote>()
  );

export const getAdminUserYearFinalVote = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearFinalVote | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setAdminUserYearFinalVote = async (
  userId: string,
  adminUserYearFinalVote: AdminUserYearFinalVote
): Promise<AdminUserYearFinalVote | undefined> => {
  if (!adminUserYearFinalVote.id) {
    const docRef = await addDoc(
      collectionRef(userId, adminUserYearFinalVote.yearId),
      adminUserYearFinalVote
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(
    docRef(userId, adminUserYearFinalVote.yearId, adminUserYearFinalVote.id),
    adminUserYearFinalVote,
    {
      merge: true,
    }
  );
  return (
    await getDoc(
      docRef(userId, adminUserYearFinalVote.yearId, adminUserYearFinalVote.id)
    )
  ).data();
};

export const convertPrivateUserYearFinalVoteToAdminUserYearFinalVote = (
  privateUserYearFinalVote: PrivateUserYearFinalVote
): AdminUserYearFinalVote => {
  const adminUserYearFinalVote: AdminUserYearFinalVote =
    privateUserYearFinalVote;
  return adminUserYearFinalVote;
};
