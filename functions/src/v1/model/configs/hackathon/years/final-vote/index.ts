import { db } from '../../../../../../utils/firebase';
import { converter } from '../../../../../../utils/firebase/converter';

export type ConfigHackathonYearFinalVote = {
  id: 'vote';
  startAt: Date;
  endAt: Date;
};

export const configHackathonYearFinalVoteConverter =
  converter<ConfigHackathonYearFinalVote>();

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/finalVote`;
const docRef = (yearId: string) =>
  db
    .doc(docPath(yearId))
    .withConverter(converter<ConfigHackathonYearFinalVote>());

export const getConfigHackathonYearFinalVote = async (
  yearId: string
): Promise<ConfigHackathonYearFinalVote | undefined> => {
  return (await docRef(yearId).get()).data();
};
