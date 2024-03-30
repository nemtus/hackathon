import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PrivateUserYearFinalJudge } from '../../../../private/users/years/final-judges';

export type FinalJudge = {
  id: string;
  userId: string; // Note: 誰が投票したか
  yearId: string;
  teamId: string;
  submissionId: string;
  point: number;
  message: string;
};

export type PublicUserYearFinalJudge = {
  id: string; // Note: 1 user can create only 1 vote with rule id = userId
  userId: string;
  yearId: string;
  judges: FinalJudge[];
  totalPoints: number;
  // isDraft: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  approved: boolean;
  approvedAt?: Date;
};

export type PublicUserYearFinalJudges = PublicUserYearFinalJudge[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/finalJudges`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PublicUserYearFinalJudge>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PublicUserYearFinalJudge>());

export const getPublicUserYearFinalJudge = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PublicUserYearFinalJudge | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPublicUserYearFinalJudge = async (
  userId: string,
  publicUserYearFinalJudge: PublicUserYearFinalJudge
): Promise<PublicUserYearFinalJudge | undefined> => {
  if (!publicUserYearFinalJudge.id) {
    const docRef = await collectionRef(
      userId,
      publicUserYearFinalJudge.yearId
    ).add(publicUserYearFinalJudge);
    return (await docRef.get()).data();
  }
  await docRef(
    userId,
    publicUserYearFinalJudge.yearId,
    publicUserYearFinalJudge.id
  ).set(publicUserYearFinalJudge, {
    merge: true,
  });
  return (
    await docRef(
      userId,
      publicUserYearFinalJudge.yearId,
      publicUserYearFinalJudge.id
    ).get()
  ).data();
};

export const convertPrivateUserYearFinalJudgeToPublicUserYearFinalJudge = (
  privateUserYearFinalJudge: PrivateUserYearFinalJudge
): PublicUserYearFinalJudge => {
  const publicUserYearFinalJudge: PublicUserYearFinalJudge =
    privateUserYearFinalJudge;
  return publicUserYearFinalJudge;
};
