import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PublicUserYearTeam } from '../../../../public/users/years/teams';

export type PrivateUserYearTeam = {
  teamPublicKey?: string;
} & PublicUserYearTeam;

export type PrivateUserYearTeams = PublicUserYearTeam[];

export const privateUserYearTeamConverter = converter<PrivateUserYearTeam>();

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/teams`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PrivateUserYearTeam>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PrivateUserYearTeam>());

export const getPrivateUserYearTeam = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearTeam | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPrivateUserYearTeam = async (
  userId: string,
  privateUserYearTeam: PrivateUserYearTeam
): Promise<PrivateUserYearTeam | undefined> => {
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
