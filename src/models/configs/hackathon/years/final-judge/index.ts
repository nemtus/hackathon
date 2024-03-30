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

export type ConfigHackathonYearFinalJudge = {
  id: 'finalJudge';
  startAt: Date;
  endAt: Date;
  users: string[];
};

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/finalJudge`;
export const docRef = (yearId: string) =>
  doc(db, docPath(yearId)).withConverter(
    converter<ConfigHackathonYearFinalJudge>()
  );

export const getConfigHackathonYearFinalJudge = async (
  yearId: string
): Promise<ConfigHackathonYearFinalJudge | undefined> => {
  return (await getDoc(docRef(yearId))).data();
};

export const setConfigHackathonYearFinalJudge = async (
  yearId: string,
  configHackathonYearJudge: Partial<ConfigHackathonYearFinalJudge>
): Promise<void> => {
  await setDoc(docRef(yearId), configHackathonYearJudge, { merge: true });
};
