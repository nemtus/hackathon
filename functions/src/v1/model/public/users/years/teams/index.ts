import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PublicUser } from '../../../../public/users';
import { PrivateUserYearTeam } from '../../../../private/users/years/teams';

export type PublicUserYearTeam = {
  id: string; // Note: 1 user can create only 1 team with rule userId = teamId
  yearId: string;
  name: string;
  users: PublicUser[];
  teamAddress?: string;
  addressForPrizeReceipt: string;
  createdAt?: Date;
  updatedAt?: Date;
  approved: boolean;
  approvedAt?: Date;
};

export type PublicUserYearTeams = PublicUserYearTeam[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/teams`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PublicUserYearTeam>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PublicUserYearTeam>());

export const getPublicUserYearTeam = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PublicUserYearTeam | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPublicUserYearTeam = async (
  userId: string,
  publicUserYearTeam: PublicUserYearTeam
): Promise<PublicUserYearTeam | undefined> => {
  if (!publicUserYearTeam.id) {
    const docRef = await collectionRef(userId, publicUserYearTeam.yearId).add(
      publicUserYearTeam
    );
    return (await docRef.get()).data();
  }
  await docRef(userId, publicUserYearTeam.yearId, publicUserYearTeam.id).set(
    publicUserYearTeam,
    {
      merge: true,
    }
  );
  return (
    await docRef(userId, publicUserYearTeam.yearId, publicUserYearTeam.id).get()
  ).data();
};

export const convertPrivateUserYearTeamToPublicUserYearTeam = (
  privateUserYearTeam: PrivateUserYearTeam
): PublicUserYearTeam => {
  const publicUserYearTeam: PublicUserYearTeam = privateUserYearTeam;
  return publicUserYearTeam;
};
