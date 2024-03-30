import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PrivateUserYearFinalVote } from '../../../../private/users/years/final-votes';

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
  // isDraft: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  approved: boolean;
  approvedAt?: Date;
};

export type PublicUserYearFinalVotes = PublicUserYearFinalVote[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/finalVotes`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PublicUserYearFinalVote>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PublicUserYearFinalVote>());

export const getPublicUserYearFinalVote = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PublicUserYearFinalVote | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPublicUserYearFinalVote = async (
  userId: string,
  publicUserYearVote: PublicUserYearFinalVote
): Promise<PublicUserYearFinalVote | undefined> => {
  if (!publicUserYearVote.id) {
    const docRef = await collectionRef(userId, publicUserYearVote.yearId).add(
      publicUserYearVote
    );
    return (await docRef.get()).data();
  }
  await docRef(userId, publicUserYearVote.yearId, publicUserYearVote.id).set(
    publicUserYearVote,
    {
      merge: true,
    }
  );
  return (
    await docRef(userId, publicUserYearVote.yearId, publicUserYearVote.id).get()
  ).data();
};

export const convertPrivateUserYearFinalVoteToPublicUserYearFinalVote = (
  privateUserYearFinalVote: PrivateUserYearFinalVote
): PublicUserYearFinalVote => {
  const publicUserYearFinalVote: PublicUserYearFinalVote =
    privateUserYearFinalVote;
  return publicUserYearFinalVote;
};
