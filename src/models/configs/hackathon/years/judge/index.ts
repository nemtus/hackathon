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

export type ConfigHackathonYearJudge = {
  id: 'judge';
  startAt: Date;
  endAt: Date;
  users: string[];
};

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/judge`;
export const docRef = (yearId: string) =>
  doc(db, docPath(yearId)).withConverter(converter<ConfigHackathonYearJudge>());

export const getConfigHackathonYearJudge = async (
  yearId: string
): Promise<ConfigHackathonYearJudge | undefined> => {
  return (await getDoc(docRef(yearId))).data();
};

export const setConfigHackathonYearJudge = async (
  yearId: string,
  configHackathonYearJudge: Partial<ConfigHackathonYearJudge>
): Promise<void> => {
  await setDoc(docRef(yearId), configHackathonYearJudge, { merge: true });
};
