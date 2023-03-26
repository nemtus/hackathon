import { db } from '../../../../../../utils/firebase';
import { converter } from '../../../../../../utils/firebase/converter';

export type ConfigHackathonYearTeam = {
  id: 'team';
  startAt: Date;
  endAt: Date;
};

export const configHackathonYearTeamConverter =
  converter<ConfigHackathonYearTeam>();

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/team`;
const docRef = (yearId: string) =>
  db.doc(docPath(yearId)).withConverter(converter<ConfigHackathonYearTeam>());

export const getConfigHackathonYearTeam = async (
  yearId: string
): Promise<ConfigHackathonYearTeam | undefined> => {
  return (await docRef(yearId).get()).data();
};
