import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PublicUserYearVote } from '../../../../public/users/years/votes';

export type PrivateUserYearVote = PublicUserYearVote;

export type PrivateUserYearVotes = PublicUserYearVote[];

export const privateUserYearVoteConverter = converter<PrivateUserYearVote>();

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/votes`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PrivateUserYearVote>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PrivateUserYearVote>());

export const getPrivateUserYearVote = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearVote | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPrivateUserYearVote = async (
  userId: string,
  privateUserYearTeam: PrivateUserYearVote
): Promise<PrivateUserYearVote | undefined> => {
  if (!privateUserYearTeam.id) {
    const docRef = await collectionRef(userId, privateUserYearTeam.yearId).add(
      privateUserYearTeam
    );
    return (await docRef.get()).data();
  }
  await docRef(userId, privateUserYearTeam.yearId, privateUserYearTeam.id).set(
    privateUserYearTeam,
    {
      merge: true,
    }
  );
  return (
    await docRef(
      userId,
      privateUserYearTeam.yearId,
      privateUserYearTeam.id
    ).get()
  ).data();
};
