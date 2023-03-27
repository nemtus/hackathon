import { db } from '../../../../../utils/firebase';
import { converter } from '../../../../../utils/firebase/converter';
import { PublicUserYearJudge } from '../../users/years/judges';

export type PublicJudge = PublicUserYearJudge;

export type PublicJudges = PublicJudge[];

export const publicVoteConverter = converter<PublicJudge>();

const collectionPath = (yearId: string) =>
  `/v/1/scopes/public/years/${yearId}/judges`;
const collectionRef = (yearId: string) =>
  db.collection(collectionPath(yearId)).withConverter(converter<PublicJudge>());
const docPath = (yearId: string, id: string) =>
  `${collectionPath(yearId)}/${id}`;
const docRef = (yearId: string, id: string) =>
  db.doc(docPath(yearId, id)).withConverter(converter<PublicJudge>());

export const getPublicJudge = async (
  yearId: string,
  id: string
): Promise<PublicJudge | undefined> => {
  return (await docRef(yearId, id).get()).data();
};

export const setPublicJudge = async (
  publicJudge: PublicJudge
): Promise<void> => {
  await docRef(publicJudge.yearId, publicJudge.id).set(publicJudge, {
    merge: true,
  });
};

export const getAllPublicJudges = async (
  yearId: string
): Promise<PublicJudges> => {
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

export const convertPublicUserYearJudgeToPublicJudge = (
  publicUserYearJudge: PublicUserYearJudge
): PublicJudge => {
  const publicJudge: PublicJudge = publicUserYearJudge;
  return publicJudge;
};
