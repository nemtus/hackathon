import { db } from '../../../../utils/firebase';
import { converter } from '../../../../utils/firebase/converter';
import { AdminTeam } from '../../admin/teams';
import { PublicTeam } from '../../public/years/teams';

export type PrivateTeam = {
  multisigPublicKey?: string;
} & PublicTeam;

export type PrivateTeams = PrivateTeam[];

export const privateTeamConverter = converter<PrivateTeam>();

const collectionPath = '/v/1/scopes/private/teams';
const collectionRef = db
  .collection(collectionPath)
  .withConverter(converter<PrivateTeam>());
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  db.doc(docPath(id)).withConverter(converter<PrivateTeam>());

export const getPrivateUser = async (
  id: string
): Promise<PrivateTeam | undefined> => {
  return (await docRef(id).get()).data();
};

export const setPrivateUser = async (
  privateTeam: PrivateTeam
): Promise<void> => {
  await docRef(privateTeam.id).set(privateTeam, { merge: true });
};

export const getAllPrivateTeams = async (): Promise<PrivateTeams> => {
  return (await collectionRef.get()).docs.map((snapshot) => snapshot.data());
};

export const queryEntryPrivateTeams = async (): Promise<PrivateTeams> => {
  return (
    await collectionRef
      .where('entryAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const querySubmitPrivateTeams = async (): Promise<PrivateTeams> => {
  return (
    await collectionRef
      .where('entryAt', '!=', null)
      .where('submitAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryVotePrivateTeams = async (): Promise<PrivateTeams> => {
  return (
    await collectionRef
      .where('voteAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const convertAdminTeamToPrivateTeam = (
  adminTeam: AdminTeam
): PrivateTeam => {
  const privateTeam: PrivateTeam = {
    id: adminTeam.id,
    name: adminTeam.name,
    createdAt: adminTeam.createdAt,
    updatedAt: adminTeam.updatedAt,
    submitAt: adminTeam.submitAt,
    multisigAddress: adminTeam.multisigAddress,
    multisigPublicKey: adminTeam.multisigPublicKey,
  };
  return privateTeam;
};
