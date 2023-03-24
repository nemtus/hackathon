import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { AdminUserYearVote } from 'models/admin/users/years/votes';
import { PublicUserYearVote } from 'models/public/users/years/votes';

export type PrivateUserYearVote = PublicUserYearVote;

export type PublicUserYearVotes = PrivateUserYearVote[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/votes`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PrivateUserYearVote>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<PrivateUserYearVote>()
  );

export const getPrivateUserYearVote = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearVote | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setPrivateUserYearVote = async (
  userId: string,
  privateUserYearVote: PrivateUserYearVote
): Promise<PrivateUserYearVote | undefined> => {
  if (!privateUserYearVote.id) {
    const docRef = await addDoc(
      collectionRef(userId, privateUserYearVote.yearId),
      privateUserYearVote
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(
    docRef(userId, privateUserYearVote.yearId, privateUserYearVote.id),
    privateUserYearVote,
    {
      merge: true,
    }
  );
  return (
    await getDoc(
      docRef(userId, privateUserYearVote.yearId, privateUserYearVote.id)
    )
  ).data();
};

export const convertPrivateYearVoteToAdminUserYearVote = (
  privateUserYearVote: PrivateUserYearVote
): AdminUserYearVote => {
  const adminUserYearVote: AdminUserYearVote = privateUserYearVote;
  return adminUserYearVote;
};

export const convertPrivateUserYearVoteToPublicUserYearVote = (
  privateUserYearVote: PrivateUserYearVote
): PrivateUserYearVote => {
  const publicUserYearVote: PrivateUserYearVote = privateUserYearVote;
  return publicUserYearVote;
};
