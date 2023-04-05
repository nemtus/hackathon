import { db } from '../../../../../../utils/firebase';
import { converter } from '../../../../../../utils/firebase/converter';
import { PublicUser } from '../../../../public/users';

export type Award = {
  id: string;
  index: number;
  type: 'Award' | 'Sponsor Award';
  name: string;
  award: string;
  link: string;
  imageUrl: string;
  message: string;
  submissionId: string;
};

export type ConfigHackathonYearAward = {
  id: 'award';
  awards: Award[];
  judgeUsers: PublicUser[];
};

export const configHackathonYearAwardConverter =
  converter<ConfigHackathonYearAward>();

const collectionPath = (yearId: string) => `/v/1/configs/hackathon/${yearId}`;
const docPath = (yearId: string) => `${collectionPath(yearId)}/award`;
const docRef = (yearId: string) =>
  db.doc(docPath(yearId)).withConverter(converter<ConfigHackathonYearAward>());

export const getConfigHackathonYearEntry = async (
  yearId: string
): Promise<ConfigHackathonYearAward | undefined> => {
  return (await docRef(yearId).get()).data();
};
