import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PrivateUserYearJudge } from '../../../../private/users/years/judges';

export type Judge = {
  id: string;
  userId: string; // Note: 誰が投票したか
  yearId: string;
  teamId: string;
  submissionId: string;
  point: number;
  message: string;
};

export type PublicUserYearJudge = {
  id: string; // Note: 1 user can create only 1 vote with rule id = userId
  userId: string;
  yearId: string;
  judges: Judge[];
  totalPoints: number;
  // isDraft: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  approved: boolean;
  approvedAt?: Date;
};

export type PublicUserYearJudges = PublicUserYearJudge[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/judges`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PublicUserYearJudge>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PublicUserYearJudge>());

export const getPublicUserYearJudge = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PublicUserYearJudge | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPublicUserYearJudge = async (
  userId: string,
  publicUserYearJudge: PublicUserYearJudge
): Promise<PublicUserYearJudge | undefined> => {
  if (!publicUserYearJudge.id) {
    const docRef = await collectionRef(userId, publicUserYearJudge.yearId).add(
      publicUserYearJudge
    );
    return (await docRef.get()).data();
  }
  await docRef(userId, publicUserYearJudge.yearId, publicUserYearJudge.id).set(
    publicUserYearJudge,
    {
      merge: true,
    }
  );
  return (
    await docRef(
      userId,
      publicUserYearJudge.yearId,
      publicUserYearJudge.id
    ).get()
  ).data();
};

export const convertPrivateUserYearJudgeToPublicUserYearJudge = (
  privateUserYearJudge: PrivateUserYearJudge
): PublicUserYearJudge => {
  const publicUserYearJudge: PublicUserYearJudge = privateUserYearJudge;
  return publicUserYearJudge;
};
