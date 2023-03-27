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

export type ConfigHackathonYearEntry = {
  id: 'entry';
  startAt: Date;
  endAt: Date;
};

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/entry`;
export const docRef = (yearId: string) =>
  doc(db, docPath(yearId)).withConverter(converter<ConfigHackathonYearEntry>());

export const getConfigHackathonYearEntry = async (
  yearId: string
): Promise<ConfigHackathonYearEntry | undefined> => {
  return (await getDoc(docRef(yearId))).data();
};

export const setConfigHackathonYearEntry = async (
  yearId: string,
  configHackathonYearEntry: Partial<ConfigHackathonYearEntry>
): Promise<void> => {
  await setDoc(docRef(yearId), configHackathonYearEntry, { merge: true });
};
