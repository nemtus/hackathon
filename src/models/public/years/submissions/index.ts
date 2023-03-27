import db, {
  doc,
  converter,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'utils/firebase';
import { PublicUserYearSubmission } from 'models/public/users/years/submissions';

export type PublicSubmission = { userId: string } & PublicUserYearSubmission;

export type PublicSubmissions = PublicSubmission[];

const collectionPath = (yearId: string) =>
  `/v/1/scopes/public/years/${yearId}/submissions`;
const collectionRef = (yearId: string) =>
  collection(db, collectionPath(yearId)).withConverter(
    converter<PublicSubmission>()
  );
const docPath = (yearId: string, id: string) =>
  `${collectionPath(yearId)}/${id}`;
const docRef = (yearId: string, id: string) =>
  doc(db, docPath(yearId, id)).withConverter(converter<PublicSubmission>());

export const getPublicSubmission = async (
  yearId: string,
  id: string
): Promise<PublicSubmission | undefined> => {
  return (await getDoc(docRef(yearId, id))).data();
};

export const getAllPublicSubmissions = async (
  yearId: string
): Promise<PublicSubmission[]> => {
  return (
    await getDocs(query(collectionRef(yearId), orderBy('createdAt', 'asc')))
  ).docs.map((doc) => doc.data());
};
