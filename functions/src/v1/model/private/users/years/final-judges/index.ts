import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PublicUserYearFinalJudge } from '../../../../public/users/years/final-judges';

export type PrivateUserYearFinalJudge = PublicUserYearFinalJudge;

export type PrivateUserYearFinalJudges = PrivateUserYearFinalJudge[];

export const privateUserYearFinalJudgeConverter =
  converter<PrivateUserYearFinalJudge>();

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/finalJudges`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PrivateUserYearFinalJudge>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PrivateUserYearFinalJudge>());

export const getPrivateUserYearFinalJudge = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearFinalJudge | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPrivateUserYearFinalJudge = async (
  userId: string,
  privateUserYearFinalJudge: PrivateUserYearFinalJudge
): Promise<PrivateUserYearFinalJudge | undefined> => {
  if (!privateUserYearFinalJudge.id) {
    const docRef = await collectionRef(
      userId,
      privateUserYearFinalJudge.yearId
    ).add(privateUserYearFinalJudge);
    return (await docRef.get()).data();
  }
  await docRef(
    userId,
    privateUserYearFinalJudge.yearId,
    privateUserYearFinalJudge.id
  ).set(privateUserYearFinalJudge, {
    merge: true,
  });
  return (
    await docRef(
      userId,
      privateUserYearFinalJudge.yearId,
      privateUserYearFinalJudge.id
    ).get()
  ).data();
};
