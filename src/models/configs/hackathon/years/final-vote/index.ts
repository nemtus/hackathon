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

export type ConfigHackathonYearFinalVote = {
  id: 'vote';
  startAt: Date;
  endAt: Date;
};

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/finalVote`;
export const docRef = (yearId: string) =>
  doc(db, docPath(yearId)).withConverter(
    converter<ConfigHackathonYearFinalVote>()
  );

export const getConfigHackathonYearFinalVote = async (
  yearId: string
): Promise<ConfigHackathonYearFinalVote | undefined> => {
  return (await getDoc(docRef(yearId))).data();
};

export const setConfigHackathonYearFinalVote = async (
  yearId: string,
  configHackathonYearFinalVote: Partial<ConfigHackathonYearFinalVote>
): Promise<void> => {
  await setDoc(docRef(yearId), configHackathonYearFinalVote, { merge: true });
};
