import {
  AggregateTransaction,
  AggregateTransactionCosignature,
  Deadline,
  defaultChronoUnit,
  PlainMessage,
  TransferTransaction,
} from 'symbol-sdk';
import { logger } from '../../firebase/logger';
import { getAdminUser } from '../../../v1/model/admin/users';
import { AdminUserTx } from '../../../v1/model/admin/users/txs';
import {
  EncryptedAccount,
  MultisigAccounts,
  restoreAccountFromEncryptedAccount,
  restoreAccountFromPrivateKey,
  restoreAccountsFromAdminUser,
} from '../account';
import {
  getEpochAdjustment,
  getGenerationHashSeed,
  getNetworkType,
} from '../network';
import { AdminUserYearTeam } from '../../../v1/model/admin/users/years/teams';
import { AdminUserYearSubmission } from '../../../v1/model/admin/users/years/submissions';
import { getPublicUserYearSubmission } from '../../../v1/model/public/users/years/submissions';

export const createAggregateCompleteTransactionToCreateNewSubmission = async (
  feeBillingAccountPrivateKey: string,
  messageReceivingAccountPrivateKey: string,
  dataEncryptionKey: string,
  userId: string,
  adminUserYearTeam: AdminUserYearTeam,
  adminUserYearSubmission: AdminUserYearSubmission
): Promise<AdminUserTx> => {
  if (!userId) {
    throw Error('userId is undefined');
  }
  const adminUser = await getAdminUser(userId);
  if (!adminUser) {
    throw Error('adminUser is undefined');
  }
  logger.debug({ adminUser });

  const feeBillingAccount = await restoreAccountFromPrivateKey(
    feeBillingAccountPrivateKey
  );
  const messageReceivingAccount = await restoreAccountFromPrivateKey(
    messageReceivingAccountPrivateKey
  );
  const multisigAccounts: MultisigAccounts = await restoreAccountsFromAdminUser(
    adminUser,
    dataEncryptionKey
  );

  if (!adminUserYearTeam.teamSaltHexString) {
    throw Error('teamSaltHexString is not valid');
  }
  if (!adminUserYearTeam.teamIvHexString) {
    throw Error('teamSaltHexString is not valid');
  }
  if (!adminUserYearTeam.teamEncryptedPrivateKey) {
    throw Error('teamSaltHexString is not valid');
  }
  if (!adminUserYearTeam.teamPublicKey) {
    throw Error('teamSaltHexString is not valid');
  }
  if (!adminUserYearTeam.teamAddress) {
    throw Error('teamSaltHexString is not valid');
  }
  const teamEncryptedAccount: EncryptedAccount = {
    saltHexString: adminUserYearTeam.teamSaltHexString,
    ivHexString: adminUserYearTeam.teamIvHexString,
    encryptedPrivateKey: adminUserYearTeam.teamEncryptedPrivateKey,
    publicKey: adminUserYearTeam.teamPublicKey,
    address: adminUserYearTeam.teamAddress,
  };
  const teamAccount = await restoreAccountFromEncryptedAccount(
    teamEncryptedAccount,
    dataEncryptionKey
  );

  const multisigAccount = multisigAccounts.multisigAccount;
  const multisigCosignatory1Account =
    multisigAccounts.multisigCosignatory1Account;
  const multisigCosignatory2Account =
    multisigAccounts.multisigCosignatory2Account;

  const epochAdjustment = await getEpochAdjustment();
  logger.debug('epochAdjustment', { epochAdjustment });
  const deadline = Deadline.create(epochAdjustment, 6, defaultChronoUnit);
  logger.debug('deadline', { deadline });
  const networkType = await getNetworkType();
  logger.debug('networkType', { networkType });

  const serviceId = messageReceivingAccount.address.plain();
  const serviceName = 'NEMTUS Hackathon Hack+';
  const description = `CreateNewSubmission${adminUserYearTeam.yearId}`;

  logger.debug('embeddedTransferTransaction');
  const messageJson = {
    serviceId,
    serviceName,
    userId,
    userMultisigAddress: multisigAccount.address.plain(),
    description,
  };
  logger.debug('messageJson', { messageJson });
  const messageString = JSON.stringify(messageJson);
  logger.debug('messageString', { messageString });
  const embeddedTransferTransaction = TransferTransaction.create(
    deadline,
    teamAccount.address,
    [],
    PlainMessage.create(messageString),
    networkType
  ).toAggregate(feeBillingAccount.publicAccount);

  logger.debug('embeddedTransferTransaction2');
  const message2Json = {
    serviceId,
    serviceName,
    userId: adminUser.id,
    yearId: adminUserYearTeam.yearId,
    teamId: adminUserYearTeam.id,
    submissionId: adminUserYearSubmission.id,
    userMultisigAddress: multisigAccount.address.plain(),
    teamMultisigAddress: teamAccount.address.plain(),
    description,
  };
  logger.debug('message2Json', { message2Json });
  const message2String = JSON.stringify(message2Json);
  logger.debug('message2String', { message2String });
  const embeddedTransferTransaction2 = TransferTransaction.create(
    deadline,
    messageReceivingAccount.address,
    [],
    PlainMessage.create(message2String),
    networkType
  ).toAggregate(teamAccount.publicAccount);

  logger.debug('embeddedTransferTransaction3');
  const publicUserYearSubmission = await getPublicUserYearSubmission(
    userId,
    adminUserYearTeam.yearId,
    adminUserYearTeam.id
  );
  if (!publicUserYearSubmission) {
    throw Error('publicUserYearSubmission is undefined');
  }
  const message3Json = Object.assign({}, publicUserYearSubmission) as any;
  if (!publicUserYearSubmission.storeRepositoryUrlOnChain) {
    delete message3Json.repositoryUrl;
  }
  delete message3Json.imageUrl;
  logger.debug('message3Json', { message3Json });
  const message3String = JSON.stringify(message3Json);
  logger.debug('message3String', { message3String });
  const embeddedTransferTransaction3 = TransferTransaction.create(
    deadline,
    messageReceivingAccount.address,
    [],
    PlainMessage.create(message3String),
    networkType
  ).toAggregate(teamAccount.publicAccount);

  const message4Json = { imageUrl: publicUserYearSubmission.imageUrl };
  logger.debug('message4Json', { message4Json });
  const message4String = JSON.stringify(message4Json);
  logger.debug('message4String', { message4String });
  const embeddedTransferTransaction4 = TransferTransaction.create(
    deadline,
    messageReceivingAccount.address,
    [],
    PlainMessage.create(message4String),
    networkType
  ).toAggregate(teamAccount.publicAccount);

  logger.debug('aggregateTransaction');
  const embeddedTransactions = [
    embeddedTransferTransaction,
    embeddedTransferTransaction2,
    embeddedTransferTransaction3,
    embeddedTransferTransaction4,
  ];
  const initialEmptyCosignatures: AggregateTransactionCosignature[] = [];
  const feeMultiplier = 100;
  const requiredCosignatories = 2;
  const aggregateCompleteTransaction = AggregateTransaction.createComplete(
    deadline,
    embeddedTransactions,
    networkType,
    initialEmptyCosignatures
  ).setMaxFeeForAggregate(feeMultiplier, requiredCosignatories);

  const generationHashSeed = await getGenerationHashSeed();
  logger.debug('generagionHashSeed', {
    generationHashSeed,
  });

  const signedAggregateCompleteTransactionWithCosignatures =
    feeBillingAccount.signTransactionWithCosignatories(
      aggregateCompleteTransaction,
      [multisigCosignatory1Account, multisigCosignatory2Account],
      generationHashSeed
    );

  const hash = signedAggregateCompleteTransactionWithCosignatures.hash;
  const payload = signedAggregateCompleteTransactionWithCosignatures.payload;
  const publicKey =
    signedAggregateCompleteTransactionWithCosignatures.signerPublicKey;
  const type = signedAggregateCompleteTransactionWithCosignatures.type;

  const adminUserTx: AdminUserTx = {
    id: hash,
    userId,
    hash,
    payload,
    publicKey,
    type,
    networkType,
    description,
    createdAt: new Date(),
    updatedAt: new Date(),
    announced: false,
    unconfirmed: false,
    confirmed: false,
    finalized: false,
    expired: false,
    error: false,
  };
  logger.debug({ adminUserTx });
  return adminUserTx;
};
