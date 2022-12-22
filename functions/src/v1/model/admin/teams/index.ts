import { db } from '../../../../utils/firebase';
import { converter } from '../../../../utils/firebase/converter';
import { PrivateTeam } from '../../private/teams';

export type AdminTeam = {
  multisigSaltHexString?: string;
  multisigIvHexString?: string;
  multisigEncryptedPrivateKey?: string;
} & PrivateTeam;

export type AdminTeams = AdminTeam[];

export const adminTeamConverter = converter<AdminTeam>();

const collectionPath = '/v/1/scopes/admin/teams';
const collectionRef = db
  .collection(collectionPath)
  .withConverter(converter<AdminTeam>());
const docPath = (id: string) => `${collectionPath}/${id}`;
const docRef = (id: string) =>
  db.doc(docPath(id)).withConverter(converter<AdminTeam>());

export const getAdminTeam = async (
  id: string
): Promise<AdminTeam | undefined> => {
  return (await docRef(id).get()).data();
};

export const setAdminTeam = async (adminTeam: AdminTeam): Promise<void> => {
  await docRef(adminTeam.id).set(adminTeam, { merge: true });
};

export const getAllAdminTeams = async (): Promise<AdminTeams> => {
  return (await collectionRef.get()).docs.map((snapshot) => snapshot.data());
};

export const queryEntryAdminTeams = async (): Promise<AdminTeams> => {
  return (
    await collectionRef
      .where('entryAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const querySubmitAdminTeams = async (): Promise<AdminTeams> => {
  return (
    await collectionRef
      .where('entryAt', '!=', null)
      .where('submitAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};

export const queryVoteAdminTeams = async (): Promise<AdminTeams> => {
  return (
    await collectionRef
      .where('voteAt', '!=', null)
      .orderBy('entryAt', 'asc')
      .get()
  ).docs.map((snapshot) => snapshot.data());
};
