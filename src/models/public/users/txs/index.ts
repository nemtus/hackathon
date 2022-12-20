import { AdminUserTx } from 'models/admin/users/txs';
import { PrivateUserTx } from 'models/private/users/txs';
import db, {
  doc,
  converter,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from '../../../../utils/firebase';

export type PublicUserTx = {
  id: string;
  userId?: string;
  hash?: string;
  payload?: string;
  publicKey?: string;
  type?: number;
  networkType?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  announced?: boolean;
  announcedAt?: Date;
  unconfirmed?: boolean;
  unconfirmedAt?: Date;
  confirmed?: boolean;
  confirmedAt?: Date;
  finalized?: boolean;
  finalizedAt?: Date;
  expired?: boolean;
  expiredAt?: Date;
  error?: boolean;
  errorAt?: Date;
};

export type PublicUserTxs = PublicUserTx[];

const collectionPath = (userId: string) =>
  `/v/1/scopes/public/users/${userId}/txs`;

const collectionRef = (userId: string) =>
  collection(db, collectionPath(userId)).withConverter(
    converter<PublicUserTx>()
  );

const docPath = (userId: string, id: string) =>
  `${collectionPath(userId)}/${id}`;

const docRef = (userId: string, id: string) =>
  doc(db, docPath(userId, id)).withConverter(converter<PublicUserTx>());

export const getPublicUserTx = async (
  userId: string,
  id: string
): Promise<PublicUserTx | undefined> => {
  return (await getDoc(docRef(userId, id))).data();
};

export const setPublicUserTx = async (
  userId: string,
  publicUserTx: PublicUserTx
): Promise<void> => {
  await setDoc(docRef(userId, publicUserTx.id), publicUserTx, { merge: true });
};

export const getAllPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  return (
    await getDocs(query(collectionRef(userId), orderBy('createdAt', 'desc')))
  ).docs.map((doc) => doc.data());
};

export const queryNotAnnouncedPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  return (
    await getDocs(
      query(
        collectionRef(userId),
        where('announced', '==', false),
        orderBy('createdAt', 'asc')
      )
    )
  ).docs.map((doc) => doc.data());
};

export const queryNotUnconfirmedPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  return (
    await getDocs(
      query(
        collectionRef(userId),
        where('unconfirmed', '==', false),
        orderBy('createdAt', 'asc')
      )
    )
  ).docs.map((doc) => doc.data());
};

export const queryNotConfirmedPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  return (
    await getDocs(
      query(
        collectionRef(userId),
        where('confirmed', '==', false),
        orderBy('createdAt', 'asc')
      )
    )
  ).docs.map((doc) => doc.data());
};

export const queryNotFinalizedPublicUserTxs = async (
  userId: string
): Promise<PublicUserTxs> => {
  return (
    await getDocs(
      query(
        collectionRef(userId),
        where('finalized', '==', false),
        orderBy('createdAt', 'asc')
      )
    )
  ).docs.map((doc) => doc.data());
};

export const convertAdminUserTxToPublicUserTx = (
  adminUserTx: AdminUserTx
): PublicUserTx => {
  const publicUserTx: PublicUserTx = adminUserTx;
  return publicUserTx;
};

export const convertPrivateUserTxToPublicUserTx = (
  privateUserTx: PrivateUserTx
): PublicUserTx => {
  const publicUserTx: PublicUserTx = privateUserTx;
  return publicUserTx;
};
