import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PrivateUserYearVote } from '../../../../private/users/years/votes';

export type AdminUserYearVote = PrivateUserYearVote;

export type AdminUserYearVotes = AdminUserYearVote[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/votes`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<AdminUserYearVote>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<AdminUserYearVote>());

export const getAdminUserYearVote = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearVote | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setAdminUserYearVote = async (
  userId: string,
  adminUserYearTeam: AdminUserYearVote
): Promise<AdminUserYearVote | undefined> => {
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

export const convertPrivateUserYearVoteToAdminUserYearVote = (
  privateUserYearVote: PrivateUserYearVote
): AdminUserYearVote => {
  const adminUserYearVote: AdminUserYearVote = privateUserYearVote;
  return adminUserYearVote;
};
