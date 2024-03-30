import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  addDoc,
} from 'utils/firebase';
import { PrivateUserYearFinalJudge } from 'models/private/users/years/final-judges';

export type FinalJudge = {
  id: string;
  userId: string; // Note: 誰が投票したか
  yearId: string;
  teamId: string;
  submissionId: string;
  point: number;
  message: string;
};

export type PublicUserYearFinalJudge = {
  id: string; // Note: 1 user can create only 1 vote with rule id = userId
  userId: string;
  yearId: string;
  judges: FinalJudge[];
  totalPoints: number;
  createdAt?: Date;
  updatedAt?: Date;
  approved: boolean;
  approvedAt?: Date;
};

export type PublicUserYearFinalJudges = PublicUserYearFinalJudge[];

const collectionPath = (userId: string, yearId: string) =>
  `/v/1/scopes/public/users/${userId}/years/${yearId}/finalJudges`;
const collectionRef = (userId: string, yearId: string) =>
  collection(db, collectionPath(userId, yearId)).withConverter(
    converter<PublicUserYearFinalJudge>()
  );
const docPath = (userId: string, yearId: string, id: string) =>
  `${collectionPath(userId, yearId)}/${id}`;
const docRef = (userId: string, yearId: string, id: string) =>
  doc(db, docPath(userId, yearId, id)).withConverter(
    converter<PublicUserYearFinalJudge>()
  );

export const getPublicUserYearFinalJudge = async (
  userId: string,
  yearId: string,
  id: string
): Promise<PublicUserYearFinalJudge | undefined> => {
  return (await getDoc(docRef(userId, yearId, id))).data();
};

export const setPublicUserYearFinalJudge = async (
  userId: string,
  publicUserYearJudge: PublicUserYearFinalJudge
): Promise<PublicUserYearFinalJudge | undefined> => {
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

export const convertPrivateUserYearFinalJudgeToPublicUserYearFinalJudge = (
  privateUserYearFinalJudge: PrivateUserYearFinalJudge
): PublicUserYearFinalJudge => {
  const publicUserYearFinalJudge: PublicUserYearFinalJudge =
    privateUserYearFinalJudge;
  return publicUserYearFinalJudge;
};
