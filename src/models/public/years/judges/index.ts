import db, {
  doc,
  converter,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'utils/firebase';
import { PublicUserYearJudge } from 'models/public/users/years/judges';

export type PublicJudge = PublicUserYearJudge;

export type PublicJudges = PublicJudge[];

const collectionPath = (yearId: string) =>
  `/v/1/scopes/public/years/${yearId}/judges`;
const collectionRef = (yearId: string) =>
  collection(db, collectionPath(yearId)).withConverter(
    converter<PublicJudge>()
  );
const docPath = (yearId: string, id: string) =>
  `${collectionPath(yearId)}/${id}`;
const docRef = (yearId: string, id: string) =>
  doc(db, docPath(yearId, id)).withConverter(converter<PublicJudge>());

export const getPublicJudge = async (
  yearId: string,
  id: string
): Promise<PublicJudge | undefined> => {
  return (await getDoc(docRef(yearId, id))).data();
};

export const getAllPublicJudges = async (
  yearId: string
): Promise<PublicJudge[]> => {
  return (
    await getDocs(query(collectionRef(yearId), orderBy('createdAt', 'asc')))
  ).docs.map((doc) => doc.data());
};
