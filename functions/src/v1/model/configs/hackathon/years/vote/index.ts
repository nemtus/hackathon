import { db } from '../../../../../../utils/firebase';
import { converter } from '../../../../../../utils/firebase/converter';

export type ConfigHackathonYearVote = {
  id: 'vote';
  startAt: Date;
  endAt: Date;
};

export const configHackathonYearVoteConverter =
  converter<ConfigHackathonYearVote>();

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/vote`;
const docRef = (yearId: string) =>
  db.doc(docPath(yearId)).withConverter(converter<ConfigHackathonYearVote>());

export const getConfigHackathonYearVote = async (
  yearId: string
): Promise<ConfigHackathonYearVote | undefined> => {
  return (await docRef(yearId).get()).data();
};
