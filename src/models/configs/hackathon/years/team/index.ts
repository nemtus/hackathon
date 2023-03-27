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

export type ConfigHackathonYearTeam = {
  id: 'team';
  startAt: Date;
  endAt: Date;
};

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/team`;
export const docRef = (yearId: string) =>
  doc(db, docPath(yearId)).withConverter(converter<ConfigHackathonYearTeam>());

export const getConfigHackathonYearTeam = async (
  yearId: string
): Promise<ConfigHackathonYearTeam | undefined> => {
  return (await getDoc(docRef(yearId))).data();
};

export const setConfigHackathonYearTeam = async (
  yearId: string,
  configHackathonYearTeam: Partial<ConfigHackathonYearTeam>
): Promise<void> => {
  await setDoc(docRef(yearId), configHackathonYearTeam, { merge: true });
};
