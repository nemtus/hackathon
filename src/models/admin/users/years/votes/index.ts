import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { PrivateUserYearVote } from 'models/private/users/years/votes';

export type AdminUserYearVote = PrivateUserYearVote;

export type AdminUserYearVotes = AdminUserYearVote[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/votes`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<AdminUserYearVote>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<AdminUserYearVote>()
  );

export const getAdminUserYearVote = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearVote | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setAdminUserYearVote = async (
  userId: string,
  adminUserYearVote: AdminUserYearVote
): Promise<AdminUserYearVote | undefined> => {
  if (!adminUserYearVote.id) {
    const docRef = await addDoc(
      collectionRef(userId, adminUserYearVote.yearId),
      adminUserYearVote
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(
    docRef(userId, adminUserYearVote.yearId, adminUserYearVote.id),
    adminUserYearVote,
    {
      merge: true,
    }
  );
  return (
    await getDoc(docRef(userId, adminUserYearVote.yearId, adminUserYearVote.id))
  ).data();
};

export const convertPrivateUserYearVoteToAdminUserYearVote = (
  privateUserYearVote: PrivateUserYearVote
): AdminUserYearVote => {
  const adminUserYearVote: AdminUserYearVote = privateUserYearVote;
  return adminUserYearVote;
};
