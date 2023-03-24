import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { PrivateUserYearVote } from 'models/private/users/years/votes';

export type Vote = {
  id: string;
  userId: string; // Note: 誰が投票したか
  yearId: string;
  teamId: string;
  submissionId: string;
  point: number;
  message: string;
};

export type PublicUserYearVote = {
  id: string; // Note: 1 user can create only 1 vote with rule id = userId
  userId: string;
  yearId: string;
  votes: Vote[];
  totalPoints: number;
  createdAt?: Date;
  updatedAt?: Date;
  approved: boolean;
  approvedAt?: Date;
};

export type PublicUserYearVotes = PublicUserYearVote[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/votes`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PublicUserYearVote>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<PublicUserYearVote>()
  );

export const getPublicUserYearVote = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PublicUserYearVote | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setPublicUserYearVote = async (
  userId: string,
  publicUserYearVote: PublicUserYearVote
): Promise<PublicUserYearVote | undefined> => {
  if (!publicUserYearVote.id) {
    const docRef = await addDoc(
      collectionRef(userId, publicUserYearVote.yearId),
      publicUserYearVote
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(
    docRef(userId, publicUserYearVote.yearId, publicUserYearVote.id),
    publicUserYearVote,
    {
      merge: true,
    }
  );
  return (
    await getDoc(
      docRef(userId, publicUserYearVote.yearId, publicUserYearVote.id)
    )
  ).data();
};

export const convertPrivateUserYearVoteToPublicUserYearVote = (
  privateUserYearVote: PrivateUserYearVote
): PublicUserYearVote => {
  const publicUserYearVote: PublicUserYearVote = privateUserYearVote;
  return publicUserYearVote;
};
