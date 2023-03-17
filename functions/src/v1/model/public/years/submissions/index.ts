import { db } from '../../../../../utils/firebase';
import { converter } from '../../../../../utils/firebase/converter';
import { PublicUserYearSubmission } from '../../users/years/submissions';

export type PublicSubmission = { userId: string } & PublicUserYearSubmission;

export type PublicSubmissions = PublicSubmission[];

export const publicSubmissionConverter = converter<PublicSubmission>();

const collectionPath = (yearId: string) =>
  `/v/1/scopes/public/years/${yearId}/submissions`;
const collectionRef = (yearId: string) =>
  db
    .collection(collectionPath(yearId))
    .withConverter(converter<PublicSubmission>());
const docPath = (yearId: string, id: string) =>
  `${collectionPath(yearId)}/${id}`;
const docRef = (yearId: string, id: string) =>
  db.doc(docPath(yearId, id)).withConverter(converter<PublicSubmission>());

export const getPublicSubmission = async (
  yearId: string,
  id: string
): Promise<PublicSubmission | undefined> => {
  return (await docRef(yearId, id).get()).data();
};

export const setPublicSubmission = async (
  publicSubmission: PublicSubmission
): Promise<void> => {
  await docRef(publicSubmission.yearId, publicSubmission.id).set(
    publicSubmission,
    {
      merge: true,
    }
  );
};

export const getAllPublicSubmissions = async (
  yearId: string
): Promise<PublicSubmissions> => {
  return (await collectionRef(yearId).get()).docs.map((snapshot) =>
    snapshot.data()
  );
};

export const convertPublicUserYearSubmissionToPublicSubmission = (
  userId: string,
  publicUserYearSubmission: PublicUserYearSubmission
): PublicSubmission => {
  const publicSubmission: PublicSubmission = {
    userId,
    ...publicUserYearSubmission,
  };
  return publicSubmission;
};
