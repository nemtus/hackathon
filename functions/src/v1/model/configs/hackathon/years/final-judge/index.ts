import { db } from '../../../../../../utils/firebase';
import { converter } from '../../../../../../utils/firebase/converter';

export type ConfigHackathonYearFinalJudge = {
  id: 'judge';
  startAt: Date;
  endAt: Date;
  users: string[]; // Note: Judge's uid array
};

export const configHackathonYearFinalJudgeConverter =
  converter<ConfigHackathonYearFinalJudge>();

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/finalJudge`;
const docRef = (yearId: string) =>
  db
    .doc(docPath(yearId))
    .withConverter(converter<ConfigHackathonYearFinalJudge>());

export const getConfigHackathonYearFinalJudge = async (
  yearId: string
): Promise<ConfigHackathonYearFinalJudge | undefined> => {
  return (await docRef(yearId).get()).data();
};
