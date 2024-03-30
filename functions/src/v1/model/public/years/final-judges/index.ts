import { db } from '../../../../../utils/firebase';
import { converter } from '../../../../../utils/firebase/converter';
import { PublicUserYearFinalJudge } from '../../users/years/final-judges';

export type PublicFinalJudge = PublicUserYearFinalJudge;

export type PublicFinalJudges = PublicFinalJudge[];

export const publicFinalVoteConverter = converter<PublicFinalJudge>();

const collectionPath = (yearId: string) =>
  `/v/1/scopes/public/years/${yearId}/finalJudges`;
const collectionRef = (yearId: string) =>
  db
    .collection(collectionPath(yearId))
    .withConverter(converter<PublicFinalJudge>());
const docPath = (yearId: string, id: string) =>
  `${collectionPath(yearId)}/${id}`;
const docRef = (yearId: string, id: string) =>
  db.doc(docPath(yearId, id)).withConverter(converter<PublicFinalJudge>());

export const getPublicFinalJudge = async (
  yearId: string,
  id: string
): Promise<PublicFinalJudge | undefined> => {
  return (await docRef(yearId, id).get()).data();
};

export const setPublicFinalJudge = async (
  publicJudge: PublicFinalJudge
): Promise<void> => {
  await docRef(publicJudge.yearId, publicJudge.id).set(publicJudge, {
    merge: true,
  });
};

export const getAllPublicFinalJudges = async (
  yearId: string
): Promise<PublicFinalJudges> => {
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

export const convertPublicUserYearFinalJudgeToPublicFinalJudge = (
  publicUserYearFinalJudge: PublicUserYearFinalJudge
): PublicFinalJudge => {
  const publicFinalJudge: PublicFinalJudge = publicUserYearFinalJudge;
  return publicFinalJudge;
};
