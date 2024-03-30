import db, {
  doc,
  converter,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'utils/firebase';
import { PublicUserYearFinalVote } from 'models/public/users/years/final-votes';

export type PublicFinalVote = PublicUserYearFinalVote;

export type PublicFinalVotes = PublicFinalVote[];

const collectionPath = (yearId: string) =>
  `/v/1/scopes/public/years/${yearId}/finalVotes`;
const collectionRef = (yearId: string) =>
  collection(db, collectionPath(yearId)).withConverter(
    converter<PublicFinalVote>()
  );
const docPath = (yearId: string, id: string) =>
  `${collectionPath(yearId)}/${id}`;
const docRef = (yearId: string, id: string) =>
  doc(db, docPath(yearId, id)).withConverter(converter<PublicFinalVote>());

export const getPublicFinalVote = async (
  yearId: string,
  id: string
): Promise<PublicFinalVote | undefined> => {
  return (await getDoc(docRef(yearId, id))).data();
};

export const getAllPublicFinalVotes = async (
  yearId: string
): Promise<PublicFinalVote[]> => {
  return (
    await getDocs(query(collectionRef(yearId), orderBy('createdAt', 'asc')))
  ).docs.map((doc) => doc.data());
};
