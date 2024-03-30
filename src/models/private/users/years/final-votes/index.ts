import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { AdminUserYearFinalVote } from 'models/admin/users/years/final-votes';
import { PublicUserYearFinalVote } from 'models/public/users/years/final-votes';

export type PrivateUserYearFinalVote = PublicUserYearFinalVote;

export type PublicUserYearFinalVotes = PrivateUserYearFinalVote[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/finalVotes`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PrivateUserYearFinalVote>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
export const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<PrivateUserYearFinalVote>()
  );

export const getPrivateUserYearFinalVote = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearFinalVote | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setPrivateUserYearFinalVote = async (
  userId: string,
  privateUserYearFinalVote: PrivateUserYearFinalVote
): Promise<PrivateUserYearFinalVote | undefined> => {
  if (!privateUserYearFinalVote.id) {
    const docRef = await addDoc(
      collectionRef(userId, privateUserYearFinalVote.yearId),
      privateUserYearFinalVote
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(
    docRef(
      userId,
      privateUserYearFinalVote.yearId,
      privateUserYearFinalVote.id
    ),
    privateUserYearFinalVote,
    {
      merge: true,
    }
  );
  return (
    await getDoc(
      docRef(
        userId,
        privateUserYearFinalVote.yearId,
        privateUserYearFinalVote.id
      )
    )
  ).data();
};

export const convertPrivateYearFinalVoteToAdminUserYearFinalVote = (
  privateUserYearFinalVote: PrivateUserYearFinalVote
): AdminUserYearFinalVote => {
  const adminUserYearFinalVote: AdminUserYearFinalVote =
    privateUserYearFinalVote;
  return adminUserYearFinalVote;
};

export const convertPrivateUserYearFinalVoteToPublicUserYearFinalVote = (
  privateUserYearFinalVote: PrivateUserYearFinalVote
): PrivateUserYearFinalVote => {
  const publicUserYearFinalVote: PrivateUserYearFinalVote =
    privateUserYearFinalVote;
  return publicUserYearFinalVote;
};
