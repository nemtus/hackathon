import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PublicUserYearJudge } from '../../../../public/users/years/judges';

export type PrivateUserYearJudge = PublicUserYearJudge;

export type PrivateUserYearJudges = PublicUserYearJudge[];

export const privateUserYearJudgeConverter = converter<PrivateUserYearJudge>();

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/judges`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PrivateUserYearJudge>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PrivateUserYearJudge>());

export const getPrivateUserYearJudge = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearJudge | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPrivateUserYearJudge = async (
  userId: string,
  privateUserYearJudge: PrivateUserYearJudge
): Promise<PrivateUserYearJudge | undefined> => {
  if (!privateUserYearJudge.id) {
    const docRef = await collectionRef(userId, privateUserYearJudge.yearId).add(
      privateUserYearJudge
    );
    return (await docRef.get()).data();
  }
  await docRef(
    userId,
    privateUserYearJudge.yearId,
    privateUserYearJudge.id
  ).set(privateUserYearJudge, {
    merge: true,
  });
  return (
    await docRef(
      userId,
      privateUserYearJudge.yearId,
      privateUserYearJudge.id
    ).get()
  ).data();
};
