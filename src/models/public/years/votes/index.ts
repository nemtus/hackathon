import db, {
  doc,
  converter,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'utils/firebase';
import { PublicUserYearVote } from 'models/public/users/years/votes';

export type PublicVote = PublicUserYearVote;

export type PublicVotes = PublicVote[];

const collectionPath = (yearId: string) =>
  `/v/1/scopes/public/years/${yearId}/votes`;
const collectionRef = (yearId: string) =>
  collection(db, collectionPath(yearId)).withConverter(converter<PublicVote>());
const docPath = (yearId: string, id: string) =>
  `${collectionPath(yearId)}/${id}`;
const docRef = (yearId: string, id: string) =>
  doc(db, docPath(yearId, id)).withConverter(converter<PublicVote>());

export const getPublicVote = async (
  yearId: string,
  id: string
): Promise<PublicVote | undefined> => {
  return (await getDoc(docRef(yearId, id))).data();
};

export const getAllPublicVotes = async (
  yearId: string
): Promise<PublicVote[]> => {
  return (
    await getDocs(query(collectionRef(yearId), orderBy('createdAt', 'asc')))
  ).docs.map((doc) => doc.data());
};
