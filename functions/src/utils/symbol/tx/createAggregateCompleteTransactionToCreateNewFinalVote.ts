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
import { AdminUserYearFinalVote } from '../../../v1/model/admin/users/years/final-votes';

const CURRENT_YEAR = process.env.CURRENT_YEAR;

export const createAggregateCompleteTransactionToCreateNewFinalVote = async (
  feeBillingAccountPrivateKey: string,
  messageReceivingAccountPrivateKey: string,
  dataEncryptionKey: string,
  userId: string,
  adminUserYearFinalVote: AdminUserYearFinalVote,
  mosaicIdHex: string
): Promise<AdminUserTx> => {
  if (!userId) {
    throw Error('userId is undefined');
  }
  if (adminUserYearFinalVote.userId !== userId) {
    throw Error('userId is not matched to adminUserYearFinalVote.userId');
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
  const description = `CreateNewFinalVote${adminUserYearFinalVote.yearId}`;

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
    yearId: adminUserYearFinalVote.yearId,
    voteId: adminUserYearFinalVote.id,
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

  const embeddedVoteTransactions: InnerTransaction[] = [];

  const mosaicId = new MosaicId(mosaicIdHex);

  let totalPoints = 0;

  for (const finalVote of adminUserYearFinalVote.votes) {
    logger.debug({ finalVote });
    if (finalVote.userId !== userId) {
      logger.debug('vote.userId is not matched to userId');
      continue;
    }
    if (
      !(
        finalVote.userId && // Note: voting user
        finalVote.yearId === CURRENT_YEAR &&
        finalVote.teamId &&
        finalVote.submissionId &&
        Number.isInteger(finalVote.point) &&
        finalVote.point >= 0 &&
        finalVote.point <= adminUserYearFinalVote.votes.length * 5 &&
        totalPoints <= adminUserYearFinalVote.votes.length * 5 &&
        typeof finalVote.message === 'string'
      )
    ) {
      logger.debug('finalVote is not valid');
      continue;
    }
    const adminUserYearTeam = await getAdminUserYearTeam(
      finalVote.teamId,
      finalVote.yearId,
      finalVote.teamId
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
      `embeddedMosaicSupplyRevocationTransactionForEachFinalVote userId: ${finalVote.userId}, teamId: ${finalVote.teamId}, point: ${finalVote.point}`
    );
    const mosaic = new Mosaic(mosaicId, UInt64.fromUint(finalVote.point));
    const embeddedMosaicSupplyRevocationTransaction =
      MosaicSupplyRevocationTransaction.create(
        deadline,
        multisigAccount.address,
        mosaic,
        networkType
      ).toAggregate(feeBillingAccount.publicAccount);
    embeddedVoteTransactions.push(embeddedMosaicSupplyRevocationTransaction);

    logger.debug(
      `embeddedTransferTransactionForEachFinalVote userId: ${finalVote.userId}, teamId: ${finalVote.teamId}, point: ${finalVote.point}, message: ${finalVote.message}`
    );
    const messageForEachFinalVoteJson = finalVote;
    logger.debug('messageForEachVoteJson', { messageForEachFinalVoteJson });
    const messageForEachFinalVoteString = JSON.stringify(
      messageForEachFinalVoteJson
    );
    logger.debug('messageForEachVoteString', { messageForEachFinalVoteString });
    const embeddedTransferTransactionForEachFinalVote =
      TransferTransaction.create(
        deadline,
        teamAccount.address,
        [mosaic],
        PlainMessage.create(messageForEachFinalVoteString),
        networkType
      ).toAggregate(feeBillingAccount.publicAccount);
    embeddedVoteTransactions.push(embeddedTransferTransactionForEachFinalVote);

    totalPoints += finalVote.point;
  }
  logger.debug({ totalPoints });
  if (totalPoints !== adminUserYearFinalVote.votes.length * 5) {
    throw Error('totalPoint should be 5 * votes.length');
  }
  if (totalPoints !== adminUserYearFinalVote.totalPoints) {
    throw Error(
      'totalPoints should be equal to adminUserYearFinalVote.totalPoints'
    );
  }

  logger.debug('embeddedTransferTransaction3');
  const copiedAdminUserYearFinalVote = Object.assign(
    {},
    adminUserYearFinalVote
  ) as any;
  delete copiedAdminUserYearFinalVote.votes;
  const message3Json = copiedAdminUserYearFinalVote;
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
    [new Mosaic(mosaicId, UInt64.fromUint(adminUserYearFinalVote.totalPoints))],
    EmptyMessage,
    networkType
  ).toAggregate(feeBillingAccount.publicAccount);

  logger.debug('aggregateTransaction');
  const embeddedTransactions = [
    embeddedTransferTransaction,
    embeddedTransferTransaction2,
    embeddedTransferTransaction3,
    embeddedTransferTransaction4,
    ...embeddedVoteTransactions,
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
