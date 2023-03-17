import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PublicUserYearSubmission } from '../../../../public/users/years/submissions';

export type PrivateUserYearSubmission = PublicUserYearSubmission;

export type PrivateUserYearSubmissions = PublicUserYearSubmission[];

export const privateUserYearSubmissionConverter =
  converter<PrivateUserYearSubmission>();

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/private/users/${userId}/years/${yearId}/submissions`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PrivateUserYearSubmission>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PrivateUserYearSubmission>());

export const getPrivateUserYearSubmission = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PrivateUserYearSubmission | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPrivateUserYearSubmission = async (
  userId: string,
  privateUserYearSubmission: PrivateUserYearSubmission
): Promise<PrivateUserYearSubmission | undefined> => {
  if (!privateUserYearSubmission.id) {
    const docRef = await collectionRef(
      userId,
      privateUserYearSubmission.yearId
    ).add(privateUserYearSubmission);
    return (await docRef.get()).data();
  }
  await docRef(
    userId,
    privateUserYearSubmission.yearId,
    privateUserYearSubmission.id
  ).set(privateUserYearSubmission, {
    merge: true,
  });
  return (
    await docRef(
      userId,
      privateUserYearSubmission.yearId,
      privateUserYearSubmission.id
    ).get()
  ).data();
};
