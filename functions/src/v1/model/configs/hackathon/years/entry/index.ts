import { db } from '../../../../../../utils/firebase';
import { converter } from '../../../../../../utils/firebase/converter';

export type ConfigHackathonYearEntry = {
  id: 'entry';
  startAt: Date;
  endAt: Date;
};

export const configHackathonYearEntryConverter =
  converter<ConfigHackathonYearEntry>();

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/entry`;
const docRef = (yearId: string) =>
  db.doc(docPath(yearId)).withConverter(converter<ConfigHackathonYearEntry>());

export const getConfigHackathonYearEntry = async (
  yearId: string
): Promise<ConfigHackathonYearEntry | undefined> => {
  return (await docRef(yearId).get()).data();
};
