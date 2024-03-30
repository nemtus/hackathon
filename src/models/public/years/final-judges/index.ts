import db, {
  doc,
  converter,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'utils/firebase';
import { PublicUserYearFinalJudge } from 'models/public/users/years/final-judges';

export type PublicFinalJudge = PublicUserYearFinalJudge;

export type PublicFinalJudges = PublicFinalJudge[];

const collectionPath = (yearId: string) =>
  `/v/1/scopes/public/years/${yearId}/finalJudges`;
const collectionRef = (yearId: string) =>
  collection(db, collectionPath(yearId)).withConverter(
    converter<PublicFinalJudge>()
  );
const docPath = (yearId: string, id: string) =>
  `${collectionPath(yearId)}/${id}`;
const docRef = (yearId: string, id: string) =>
  doc(db, docPath(yearId, id)).withConverter(converter<PublicFinalJudge>());

export const getPublicFinalJudge = async (
  yearId: string,
  id: string
): Promise<PublicFinalJudge | undefined> => {
  return (await getDoc(docRef(yearId, id))).data();
};

export const getAllPublicFinalJudges = async (
  yearId: string
): Promise<PublicFinalJudge[]> => {
  return (
    await getDocs(query(collectionRef(yearId), orderBy('createdAt', 'asc')))
  ).docs.map((doc) => doc.data());
};
