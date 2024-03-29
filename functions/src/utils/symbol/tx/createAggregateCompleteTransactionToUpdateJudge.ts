import {
  AggregateTransaction,
  AggregateTransactionCosignature,
  Deadline,
  defaultChronoUnit,
  PlainMessage,
  TransferTransaction,
  MosaicSupplyRevocationTransaction,
  InnerTransaction,
  MosaicId,
  Mosaic,
  UInt64,
  EmptyMessage,
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
import { getAdminUserYearTeam } from '../../../v1/model/admin/users/years/teams';
import { AdminUserYearJudge } from '../../../v1/model/admin/users/years/judges';

const CURRENT_YEAR = process.env.CURRENT_YEAR;

export const createAggregateCompleteTransactionToUpdateJudge = async (
  feeBillingAccountPrivateKey: string,
  messageReceivingAccountPrivateKey: string,
  dataEncryptionKey: string,
  userId: string,
  adminUserYearJudge: AdminUserYearJudge,
  mosaicIdHex: string
): Promise<AdminUserTx> => {
  if (!userId) {
    throw Error('userId is undefined');
  }
  if (adminUserYearJudge.userId !== userId) {
    throw Error('userId is not matched to adminUserYearVote.userId');
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
  const description = `UpdateJudge${adminUserYearJudge.yearId}`;

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
    multisigAccount.address,
    [],
    PlainMessage.create(messageString),
    networkType
  ).toAggregate(feeBillingAccount.publicAccount);

  logger.debug('embeddedTransferTransaction2');
  const message2Json = {
    serviceId,
    serviceName,
    userId: adminUser.id,
    yearId: adminUserYearJudge.yearId,
    voteId: adminUserYearJudge.id,
    userMultisigAddress: multisigAccount.address.plain(),
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
  ).toAggregate(multisigAccount.publicAccount);

  const embeddedJudgeTransactions: InnerTransaction[] = [];

  const mosaicId = new MosaicId(mosaicIdHex);

  let totalPoints = 0;

  for (const judge of adminUserYearJudge.judges) {
    logger.debug({ judge });
    if (judge.userId !== userId) {
      logger.debug('judge.userId is not matched to userId');
      continue;
    }
    if (
      !(
        judge.userId && // Note: judging user
        judge.yearId === CURRENT_YEAR &&
        judge.teamId &&
        judge.submissionId &&
        Number.isInteger(judge.point) &&
        judge.point >= 0 &&
        judge.point <= adminUserYearJudge.judges.length * 100 &&
        totalPoints <= adminUserYearJudge.judges.length * 100 &&
        typeof judge.message === 'string'
      )
    ) {
      logger.debug('judge is not valid');
      continue;
    }
    const adminUserYearTeam = await getAdminUserYearTeam(
      judge.teamId,
      judge.yearId,
      judge.teamId
    );
    logger.debug({ adminUserYearTeam });
    if (!adminUserYearTeam) {
      logger.debug('adminUserYearTeam is not undefined');
      continue;
    }
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

    logger.debug(
      `embeddedMosaicSupplyRevocationTransactionForEachJudge userId: ${judge.userId}, teamId: ${judge.teamId}, point: ${judge.point}`
    );
    const mosaic = new Mosaic(mosaicId, UInt64.fromUint(judge.point));
    const embeddedMosaicSupplyRevocationTransaction =
      MosaicSupplyRevocationTransaction.create(
        deadline,
        multisigAccount.address,
        mosaic,
        networkType
      ).toAggregate(feeBillingAccount.publicAccount);
    embeddedJudgeTransactions.push(embeddedMosaicSupplyRevocationTransaction);

    logger.debug(
      `embeddedTransferTransactionForEachJudge userId: ${judge.userId}, teamId: ${judge.teamId}, point: ${judge.point}, message: ${judge.message}`
    );
    const messageForEachJudgeJson = judge;
    logger.debug('messageForEachJudgeJson', { messageForEachJudgeJson });
    const messageForEachJudgeString = JSON.stringify(messageForEachJudgeJson);
    logger.debug('messageForEachJudgeString', { messageForEachJudgeString });
    const embeddedTransferTransactionForEachJudge = TransferTransaction.create(
      deadline,
      teamAccount.address,
      [mosaic],
      PlainMessage.create(messageForEachJudgeString),
      networkType
    ).toAggregate(feeBillingAccount.publicAccount);
    embeddedJudgeTransactions.push(embeddedTransferTransactionForEachJudge);

    totalPoints += judge.point;
  }
  logger.debug({ totalPoints });
  if (totalPoints !== adminUserYearJudge.judges.length * 100) {
    throw Error('totalPoint should be 100 * judges.length');
  }
  if (totalPoints !== adminUserYearJudge.totalPoints) {
    throw Error(
      'totalPoints should be equal to adminUserYearJudge.totalPoints'
    );
  }

  logger.debug('embeddedTransferTransaction3');
  const copiedAdminUserYearJudge = Object.assign({}, adminUserYearJudge) as any;
  delete copiedAdminUserYearJudge.judges;
  const message3Json = copiedAdminUserYearJudge;
  logger.debug('message3Json', { message3Json });
  const message3String = JSON.stringify(message3Json);
  logger.debug('message3String', { message3String });
  const embeddedTransferTransaction3 = TransferTransaction.create(
    deadline,
    messageReceivingAccount.address,
    [],
    PlainMessage.create(message3String),
    networkType
  ).toAggregate(multisigAccount.publicAccount);

  logger.debug('embeddedTransferTransaction4');
  const embeddedTransferTransaction4 = TransferTransaction.create(
    deadline,
    multisigAccount.address,
    [new Mosaic(mosaicId, UInt64.fromUint(adminUserYearJudge.totalPoints))],
    EmptyMessage,
    networkType
  ).toAggregate(feeBillingAccount.publicAccount);

  logger.debug('aggregateTransaction');
  const embeddedTransactions = [
    embeddedTransferTransaction,
    embeddedTransferTransaction2,
    embeddedTransferTransaction3,
    embeddedTransferTransaction4,
    ...embeddedJudgeTransactions,
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
