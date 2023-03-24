import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { PrivateUserYearJudge } from 'models/private/users/years/judges';

export type Judge = {
  id: string;
  userId: string; // Note: 誰が投票したか
  yearId: string;
  teamId: string;
  submissionId: string;
  point: number;
  message: string;
};

export type PublicUserYearJudge = {
  id: string; // Note: 1 user can create only 1 vote with rule id = userId
  userId: string;
  yearId: string;
  judges: Judge[];
  totalPoints: number;
  createdAt?: Date;
  updatedAt?: Date;
  approved: boolean;
  approvedAt?: Date;
};

export type PublicUserYearJudges = PublicUserYearJudge[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/judges`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PublicUserYearJudge>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<PublicUserYearJudge>()
  );

export const getPublicUserYearJudge = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PublicUserYearJudge | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setPublicUserYearJudge = async (
  userId: string,
  publicUserYearJudge: PublicUserYearJudge
): Promise<PublicUserYearJudge | undefined> => {
  if (!publicUserYearJudge.id) {
    const docRef = await addDoc(
      collectionRef(userId, publicUserYearJudge.yearId),
      publicUserYearJudge
    );
    return (await getDoc(docRef)).data();
  }
  await setDoc(
    docRef(userId, publicUserYearJudge.yearId, publicUserYearJudge.id),
    publicUserYearJudge,
    {
      merge: true,
    }
  );
  return (
    await getDoc(
      docRef(userId, publicUserYearJudge.yearId, publicUserYearJudge.id)
    )
  ).data();
};

export const convertPrivateUserYearJudgeToPublicUserYearJudge = (
  privateUserYearVote: PrivateUserYearJudge
): PublicUserYearJudge => {
  const publicUserYearVote: PublicUserYearJudge = privateUserYearVote;
  return publicUserYearVote;
};
