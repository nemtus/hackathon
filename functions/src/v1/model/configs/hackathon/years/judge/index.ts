import { db } from '../../../../../../utils/firebase';
import { converter } from '../../../../../../utils/firebase/converter';

export type ConfigHackathonYearJudge = {
  id: 'judge';
  startAt: Date;
  endAt: Date;
  users: string[]; // Note: Judge's uid array
};

export const configHackathonYearJudgeConverter =
  converter<ConfigHackathonYearJudge>();

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/judge`;
const docRef = (yearId: string) =>
  db.doc(docPath(yearId)).withConverter(converter<ConfigHackathonYearJudge>());

export const getConfigHackathonYearJudge = async (
  yearId: string
): Promise<ConfigHackathonYearJudge | undefined> => {
  return (await docRef(yearId).get()).data();
};
