import { db } from '../../../../../utils/firebase';
import { converter } from '../../../../../utils/firebase/converter';
import { PublicUserYearVote } from '../../users/years/votes';

export type PublicVote = PublicUserYearVote;

export type PublicVotes = PublicVote[];

export const publicVoteConverter = converter<PublicVote>();

const collectionPath = (yearId: string) =>
  `/v/1/scopes/public/years/${yearId}/votes`;
const collectionRef = (yearId: string) =>
  db.collection(collectionPath(yearId)).withConverter(converter<PublicVote>());
const docPath = (yearId: string, id: string) =>
  `${collectionPath(yearId)}/${id}`;
const docRef = (yearId: string, id: string) =>
  db.doc(docPath(yearId, id)).withConverter(converter<PublicVote>());

export const getPublicVote = async (
  yearId: string,
  id: string
): Promise<PublicVote | undefined> => {
  return (await docRef(yearId, id).get()).data();
};

export const setPublicVote = async (publicTeam: PublicVote): Promise<void> => {
  await docRef(publicTeam.yearId, publicTeam.id).set(publicTeam, {
    merge: true,
  });
};

export const getAllPublicVotes = async (
  yearId: string
): Promise<PublicVotes> => {
  return (await collectionRef(yearId).get()).docs.map((snapshot) =>
    snapshot.data()
  );
};

// export const querySubmitPublicTeams = async (
//   yearId: string
// ): Promise<PublicTeams> => {
//   return (
//     await collectionRef(yearId)
//       .where('entryAt', '!=', null)
//       .where('submitAt', '!=', null)
//       .orderBy('entryAt', 'asc')
//       .get()
//   ).docs.map((snapshot) => snapshot.data());
// };

// export const queryVotePublicTeams = async (
//   yearId: string
// ): Promise<PublicTeams> => {
//   return (
//     await collectionRef(yearId)
//       .where('voteAt', '!=', null)
//       .orderBy('entryAt', 'asc')
//       .get()
//   ).docs.map((snapshot) => snapshot.data());
// };

export const convertPublicUserYearVoteToPublicVote = (
  publicUserYearVote: PublicUserYearVote
): PublicVote => {
  const publicVote: PublicVote = publicUserYearVote;
  return publicVote;
};
