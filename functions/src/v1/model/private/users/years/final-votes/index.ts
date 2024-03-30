import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PublicUserYearFinalVote } from '../../../../public/users/years/final-votes';

export type PrivateUserYearFinalVote = PublicUserYearFinalVote;

export type PrivateUserYearFinalVotes = PrivateUserYearFinalVote[];

export const privateUserYearFinalVoteConverter =
  converter<PrivateUserYearFinalVote>();

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/finalVotes`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PrivateUserYearFinalVote>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PrivateUserYearFinalVote>());

export const getPrivateUserYearFinalVote = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearFinalVote | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPrivateUserYearFinalVote = async (
  userId: string,
  privateUserYearFinalVote: PrivateUserYearFinalVote
): Promise<PrivateUserYearFinalVote | undefined> => {
  if (!privateUserYearFinalVote.id) {
    const docRef = await collectionRef(
      userId,
      privateUserYearFinalVote.yearId
    ).add(privateUserYearFinalVote);
    return (await docRef.get()).data();
  }
  await docRef(
    userId,
    privateUserYearFinalVote.yearId,
    privateUserYearFinalVote.id
  ).set(privateUserYearFinalVote, {
    merge: true,
  });
  return (
    await docRef(
      userId,
      privateUserYearFinalVote.yearId,
      privateUserYearFinalVote.id
    ).get()
  ).data();
};
