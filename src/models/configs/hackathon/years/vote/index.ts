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

export type ConfigHackathonYearVote = {
  id: 'vote';
  startAt: Date;
  endAt: Date;
};

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/vote`;
export const docRef = (yearId: string) =>
  doc(db, docPath(yearId)).withConverter(converter<ConfigHackathonYearVote>());

export const getConfigHackathonYearVote = async (
  yearId: string
): Promise<ConfigHackathonYearVote | undefined> => {
  return (await getDoc(docRef(yearId))).data();
};

export const setConfigHackathonYearVote = async (
  yearId: string,
  configHackathonYearVote: Partial<ConfigHackathonYearVote>
): Promise<void> => {
  await setDoc(docRef(yearId), configHackathonYearVote, { merge: true });
};
