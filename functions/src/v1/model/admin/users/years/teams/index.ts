import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PrivateUserYearTeam } from '../../../../private/users/years/teams';

export type AdminUserYearTeam = {
  teamSaltHexString?: string;
  teamIvHexString?: string;
  teamEncryptedPrivateKey?: string;
} & PrivateUserYearTeam;

export type AdminUserYearTeams = AdminUserYearTeam[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/teams`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<AdminUserYearTeam>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<AdminUserYearTeam>());

export const getAdminUserYearTeam = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearTeam | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setAdminUserYearTeam = async (
  userId: string,
  adminUserYearTeam: AdminUserYearTeam
): Promise<AdminUserYearTeam | undefined> => {
  if (!adminUserYearTeam.id) {
    const docRef = await collectionRef(userId, adminUserYearTeam.yearId).add(
      adminUserYearTeam
    );
    return (await docRef.get()).data();
  }
  await docRef(userId, adminUserYearTeam.yearId, adminUserYearTeam.id).set(
    adminUserYearTeam,
    {
      merge: true,
    }
  );
  return (
    await docRef(userId, adminUserYearTeam.yearId, adminUserYearTeam.id).get()
  ).data();
};

export const convertPrivateUserYearTeamToAdminUserYearTeam = (
  privateUserYearTeam: PrivateUserYearTeam
): AdminUserYearTeam => {
  const adminUserYearTeam: AdminUserYearTeam = privateUserYearTeam;
  return adminUserYearTeam;
};
