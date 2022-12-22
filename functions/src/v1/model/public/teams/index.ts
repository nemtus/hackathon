import { db } from '../../../../utils/firebase';
import { converter } from '../../../../utils/firebase/converter';
import { AdminTeam } from '../../admin/teams';
import { PrivateTeam } from '../../private/teams';

export type PublicTeam = {
  id: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
  submitAt?: Date;
  multisigAddress?: string;
};

export type PublicTeams = PublicTeam[];

export const publicTeamConverter = converter<PublicTeam>();

const collectionPath = '/v/1/scopes/public/teams';
const collectionRef = db
  .collection(collectionPath)
  .withConverter(converter<PublicTeam>());
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  db.doc(docPath(id)).withConverter(converter<PublicTeam>());

export const getPrivateTeam = async (
  id: string
): Promise<PublicTeam | undefined> => {
  return (await docRef(id).get()).data();
};

export const setPublicTeam = async (publicTeam: PublicTeam): Promise<void> => {
  await docRef(publicTeam.id).set(publicTeam, { merge: true });
};

export const getAllPublicTeams = async (): Promise<PublicTeams> => {
  return (await collectionRef.get()).docs.map((snapshot) => snapshot.data());
};

export const queryEntryPublicTeams = async (): Promise<PublicTeams> => {
  return (
    await collectionRef
      .where('entryAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const querySubmitPublicTeams = async (): Promise<PublicTeams> => {
  return (
    await collectionRef
      .where('entryAt', '!=', null)
      .where('submitAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryVotePublicTeams = async (): Promise<PublicTeams> => {
  return (
    await collectionRef
      .where('voteAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const convertAdminTeamToPublicTeam = (
  adminTeam: AdminTeam
): PublicTeam => {
  const publicTeam: PublicTeam = {
    id: adminTeam.id,
    name: adminTeam.name,
    createdAt: adminTeam.createdAt,
    updatedAt: adminTeam.updatedAt,
    submitAt: adminTeam.submitAt,
    multisigAddress: adminTeam.multisigAddress,
  };
  return publicTeam;
};

export const convertPrivateUserToPublicUser = (
  privateTeam: PrivateTeam
): PublicTeam => {
  const publicUser: PublicTeam = {
    id: privateTeam.id,
    name: privateTeam.name,
    createdAt: privateTeam.createdAt,
    updatedAt: privateTeam.updatedAt,
    submitAt: privateTeam.submitAt,
    multisigAddress: privateTeam.multisigAddress,
  };
  return publicUser;
};
