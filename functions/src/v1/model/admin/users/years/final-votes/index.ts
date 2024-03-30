import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PrivateUserYearFinalVote } from '../../../../private/users/years/final-votes';

export type AdminUserYearFinalVote = PrivateUserYearFinalVote;

export type AdminUserYearFinalVotes = AdminUserYearFinalVote[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/admin/users/${userId}/years/${yearId}/finalVotes`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<AdminUserYearFinalVote>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<AdminUserYearFinalVote>());

export const getAdminUserYearFinalVote = async (
  userId: string,
  yearId: string,
  id: string
): Promise<AdminUserYearFinalVote | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setAdminUserYearFinalVote = async (
  userId: string,
  adminUserYearTeam: AdminUserYearFinalVote
): Promise<AdminUserYearFinalVote | undefined> => {
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

export const convertPrivateUserYearFinalVoteToAdminUserYearFinalVote = (
  privateUserYearFinalVote: PrivateUserYearFinalVote
): AdminUserYearFinalVote => {
  const adminUserYearFinalVote: AdminUserYearFinalVote =
    privateUserYearFinalVote;
  return adminUserYearFinalVote;
};
