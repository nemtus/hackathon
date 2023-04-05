import { PublicUser } from 'models/public/users';
import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  // collection,
  // getDocs,
  // query,
  // orderBy,
  // startAt,
} from '../../../../../utils/firebase';

export type Award = {
  id: string;
  index: number;
  type: 'Award' | 'Sponsor Award';
  name: string;
  award: string;
  link: string;
  imageUrl: string;
  message: string;
  submissionId: string;
};

export type ConfigHackathonYearAward = {
  id: 'award';
  awards: Award[];
  judgeUsers: PublicUser[];
};

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/award`;
export const docRef = (yearId: string) =>
  doc(db, docPath(yearId)).withConverter(converter<ConfigHackathonYearAward>());

export const getConfigHackathonYearAward = async (
  yearId: string
): Promise<ConfigHackathonYearAward | undefined> => {
  return (await getDoc(docRef(yearId))).data();
};

export const setConfigHackathonYearAward = async (
  yearId: string,
  configHackathonYearAward: Partial<ConfigHackathonYearAward>
): Promise<void> => {
  await setDoc(docRef(yearId), configHackathonYearAward, { merge: true });
};
