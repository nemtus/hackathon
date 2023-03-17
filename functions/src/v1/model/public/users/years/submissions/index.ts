import { db } from '../../../../../../utils/firebase/index';
import { converter } from '../../../../../../utils/firebase/converter';

import { PrivateUserYearSubmission } from '../../../../private/users/years/submissions';

export type PublicUserYearSubmission = {
  id: string; // Note: 1 user can create only 1 submission with rule userId = submissionId
  yearId: string;
  teamId: string; // Note: 1 user can create only 1 team with rule userId = teamId
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  repositoryUrl: string;
  storeRepositoryUrlOnChain: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  approved: boolean;
  approvedAt?: Date;
};

export type PublicUserYearSubmissions = PublicUserYearSubmission[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/submissions`;
const collectionRef = (userId: string, yearId: string) =>
  db
    .collection(collectionPath(userId, yearId))
    .withConverter(converter<PublicUserYearSubmission>());
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  db
    .doc(docPath(userId, yearId, id))
    .withConverter(converter<PublicUserYearSubmission>());

export const getPublicUserYearSubmission = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PublicUserYearSubmission | undefined> => {
  return (await docRef(userId, yearId, id).get()).data();
};

export const setPublicUserYearSubmission = async (
  userId: string,
  publicUserYearSubmission: PublicUserYearSubmission
): Promise<PublicUserYearSubmission | undefined> => {
  if (!publicUserYearSubmission.id) {
    const docRef = await collectionRef(
      userId,
      publicUserYearSubmission.yearId
    ).add(publicUserYearSubmission);
    return (await docRef.get()).data();
  }
  await docRef(
    userId,
    publicUserYearSubmission.yearId,
    publicUserYearSubmission.id
  ).set(publicUserYearSubmission, {
    merge: true,
  });
  return (
    await docRef(
      userId,
      publicUserYearSubmission.yearId,
      publicUserYearSubmission.id
    ).get()
  ).data();
};

export const convertPrivateUserYearSubmissionToPublicUserYearSubmission = (
  privateUserYearSubmission: PrivateUserYearSubmission
): PublicUserYearSubmission => {
  const publicUserYearSubmission: PublicUserYearSubmission =
    privateUserYearSubmission;
  return publicUserYearSubmission;
};
