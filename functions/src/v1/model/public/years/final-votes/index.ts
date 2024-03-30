import { db } from '../../../../../utils/firebase';
import { converter } from '../../../../../utils/firebase/converter';
import { PublicUserYearFinalVote } from '../../users/years/final-votes';

export type PublicFinalVote = PublicUserYearFinalVote;

export type PublicFinalVotes = PublicFinalVote[];

export const publicFinalVoteConverter = converter<PublicFinalVote>();

const collectionPath = (yearId: string) =>
  `/v/1/scopes/public/years/${yearId}/finalVotes`;
const collectionRef = (yearId: string) =>
  db
    .collection(collectionPath(yearId))
    .withConverter(converter<PublicFinalVote>());
const docPath = (yearId: string, id: string) =>
  `${collectionPath(yearId)}/${id}`;
const docRef = (yearId: string, id: string) =>
  db.doc(docPath(yearId, id)).withConverter(converter<PublicFinalVote>());

export const getPublicFinalVote = async (
  yearId: string,
  id: string
): Promise<PublicFinalVote | undefined> => {
  return (await docRef(yearId, id).get()).data();
};

export const setPublicFinalVote = async (
  publicFinalVote: PublicFinalVote
): Promise<void> => {
  await docRef(publicFinalVote.yearId, publicFinalVote.id).set(
    publicFinalVote,
    {
      merge: true,
    }
  );
};

export const getAllPublicFinalVotes = async (
  yearId: string
): Promise<PublicFinalVotes> => {
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

export const convertPublicUserYearFinalVoteToPublicFinalVote = (
  publicUserYearFinalVote: PublicUserYearFinalVote
): PublicFinalVote => {
  const publicFinalVote: PublicFinalVote = publicUserYearFinalVote;
  return publicFinalVote;
};
