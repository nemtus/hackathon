import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PrivateUserYearVote } from '../../../../private/users/years/votes';

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
  // isDraft: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  approved: boolean;
  approvedAt?: Date;
};

export type PublicUserYearVotes = PublicUserYearVote[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/votes`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PublicUserYearVote>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PublicUserYearVote>());

export const getPublicUserYearVote = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PublicUserYearVote | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPublicUserYearVote = async (
  userId: string,
  publicUserYearVote: PublicUserYearVote
): Promise<PublicUserYearVote | undefined> => {
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

export const convertPrivateUserYearVoteToPublicUserYearVote = (
  privateUserYearVote: PrivateUserYearVote
): PublicUserYearVote => {
  const publicUserYearVote: PublicUserYearVote = privateUserYearVote;
  return publicUserYearVote;
};
