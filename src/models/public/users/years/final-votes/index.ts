import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { PrivateUserYearFinalVote } from 'models/private/users/years/final-votes';

export type FinalVote = {
  id: string;
  userId: string; // Note: 誰が投票したか
  yearId: string;
  teamId: string;
  submissionId: string;
  point: number;
  message: string;
};

export type PublicUserYearFinalVote = {
  id: string; // Note: 1 user can create only 1 vote with rule id = userId
  userId: string;
  yearId: string;
  votes: FinalVote[];
  totalPoints: number;
  createdAt?: Date;
  updatedAt?: Date;
  approved: boolean;
  approvedAt?: Date;
};

export type PublicUserYearFinalVotes = PublicUserYearFinalVote[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/finalVotes`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PublicUserYearFinalVote>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<PublicUserYearFinalVote>()
  );

export const getPublicUserYearFinalVote = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PublicUserYearFinalVote | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setPublicUserYearFinalVote = async (
  userId: string,
  publicUserYearFinalVote: PublicUserYearFinalVote
): Promise<PublicUserYearFinalVote | undefined> => {
  if (!publicUserYearFinalVote.id) {
    const docRef = await addDoc(
      collectionRef(userId, publicUserYearFinalVote.yearId),
      publicUserYearFinalVote
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(
    docRef(userId, publicUserYearFinalVote.yearId, publicUserYearFinalVote.id),
    publicUserYearFinalVote,
    {
      merge: true,
    }
  );
  return (
    await getDoc(
      docRef(userId, publicUserYearFinalVote.yearId, publicUserYearFinalVote.id)
    )
  ).data();
};

export const convertPrivateUserYearFinalVoteToPublicUserYearFinalVote = (
  privateUserYearFinalVote: PrivateUserYearFinalVote
): PublicUserYearFinalVote => {
  const publicUserYearFinalVote: PublicUserYearFinalVote =
    privateUserYearFinalVote;
  return publicUserYearFinalVote;
};
