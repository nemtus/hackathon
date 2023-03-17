import { db } from '../../../../../utils/firebase';
import { converter } from '../../../../../utils/firebase/converter';
import { PublicUserYearTeam } from '../../users/years/teams';

export type PublicTeam = { userId: string } & PublicUserYearTeam;

export type PublicTeams = PublicTeam[];

export const publicTeamConverter = converter<PublicTeam>();

const collectionPath = (yearId: string) =>
  `/v/1/scopes/public/years/${yearId}/teams`;
const collectionRef = (yearId: string) =>
  db.collection(collectionPath(yearId)).withConverter(converter<PublicTeam>());
const docPath = (yearId: string, id: string) =>
  `${collectionPath(yearId)}/${id}`;
const docRef = (yearId: string, id: string) =>
  db.doc(docPath(yearId, id)).withConverter(converter<PublicTeam>());

export const getPublicTeam = async (
  yearId: string,
  id: string
): Promise<PublicTeam | undefined> => {
  return (await docRef(yearId, id).get()).data();
};

export const setPublicTeam = async (publicTeam: PublicTeam): Promise<void> => {
  await docRef(publicTeam.yearId, publicTeam.id).set(publicTeam, {
    merge: true,
  });
};

export const getAllPublicTeams = async (
  yearId: string
): Promise<PublicTeams> => {
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

export const convertPublicUserYearTeamToPublicTeam = (
  userId: string,
  publicUserYearTeam: PublicUserYearTeam
): PublicTeam => {
  const publicTeam: PublicTeam = {
    userId,
    ...publicUserYearTeam,
  };
  return publicTeam;
};
