import { db } from '../../../../../../utils/firebase';
import { converter } from '../../../../../../utils/firebase/converter';

export type ConfigHackathonYearSubmission = {
  id: 'submission';
  startAt: Date;
  endAt: Date;
};

export const configHackathonYearSubmissionConverter =
  converter<ConfigHackathonYearSubmission>();

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/submission`;
const docRef = (yearId: string) =>
  db
    .doc(docPath(yearId))
    .withConverter(converter<ConfigHackathonYearSubmission>());

export const getConfigHackathonYearSubmission = async (
  yearId: string
): Promise<ConfigHackathonYearSubmission | undefined> => {
  return (await docRef(yearId).get()).data();
};
