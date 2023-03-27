import db, {
  doc,
  converter,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from 'utils/firebase';
import { PublicUserYearTeam } from 'models/public/users/years/teams';

export type PublicTeam = { userId: string } & PublicUserYearTeam;

export type PublicTeams = PublicTeam[];

const collectionPath = (yearId: string) =>
  `/v/1/scopes/public/years/${yearId}/teams`;
const collectionRef = (yearId: string) =>
  collection(db, collectionPath(yearId)).withConverter(converter<PublicTeam>());
const docPath = (yearId: string, id: string) =>
  `${collectionPath(yearId)}/${id}`;
const docRef = (yearId: string, id: string) =>
  doc(db, docPath(yearId, id)).withConverter(converter<PublicTeam>());

export const getPublicTeam = async (
  yearId: string,
  id: string
): Promise<PublicTeam | undefined> => {
  return (await getDoc(docRef(yearId, id))).data();
};

export const getAllPublicTeams = async (
  yearId: string
): Promise<PublicTeam[]> => {
  return (
    await getDocs(query(collectionRef(yearId), orderBy('createdAt', 'asc')))
  ).docs.map((doc) => doc.data());
};
