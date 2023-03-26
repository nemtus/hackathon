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

export type ConfigHackathonYearSubmission = {
  id: 'submission';
  startAt: Date;
  endAt: Date;
};

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/submission`;
export const docRef = (yearId: string) =>
  doc(db, docPath(yearId)).withConverter(
    converter<ConfigHackathonYearSubmission>()
  );

export const getConfigHackathonYearSubmission = async (
  yearId: string
): Promise<ConfigHackathonYearSubmission | undefined> => {
  return (await getDoc(docRef(yearId))).data();
};

export const setConfigHackathonYearSubmission = async (
  yearId: string,
  configHackathonYearSubmission: Partial<ConfigHackathonYearSubmission>
): Promise<void> => {
  await setDoc(docRef(yearId), configHackathonYearSubmission, { merge: true });
};
