import {
  AggregateTransaction,
  AggregateTransactionCosignature,
  CosignatureSignedTransaction,
  CosignatureTransaction,
  Deadline,
  defaultChronoUnit,
  PlainMessage,
  TransactionMapping,
  TransferTransaction,
} from 'symbol-sdk';
import { logger } from '../../firebase/logger';
import { getAdminUser } from '../../../v1/model/admin/users';
import { AdminUserTx } from '../../../v1/model/admin/users/txs';
import {
  MultisigAccounts,
  restoreAccountFromPrivateKey,
  restoreAccountsFromAdminUser,
} from '../account';
import {
  getEpochAdjustment,
  getGenerationHashSeed,
  getNetworkType,
} from '../network';
import { AdminUserYearEntry } from '../../../v1/model/admin/users/years/entries';

export const createAggregateCompleteTransactionToEntry = async (
  feeBillingAccountPrivateKey: string,
  messageReceivingAccountPrivateKey: string,
  dataEncryptionKey: string,
  adminUserYearEntry: AdminUserYearEntry
): Promise<AdminUserTx> => {
  const feeBillingAccount = await restoreAccountFromPrivateKey(
    feeBillingAccountPrivateKey
  );
  const messageReceivingAccount = await restoreAccountFromPrivateKey(
    messageReceivingAccountPrivateKey
  );

  const userId = adminUserYearEntry.userId;
  if (!userId) {
    throw Error('userId is undefined');
  }

  const adminUser = await getAdminUser(userId);
  if (!adminUser) {
    throw Error('adminUser is undefined');
  }
  logger.debug({ adminUser });

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
  const description = `Entry${adminUserYearEntry.yearId}`;

  logger.debug('embeddedTransferTransaction');
  const messageJson = {
    serviceId,
    serviceName,
    userId: adminUser.id,
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
    yearId: adminUserYearEntry.yearId,
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

  logger.debug('aggregateTransaction');
  const embeddedTransactions = [
    embeddedTransferTransaction,
    embeddedTransferTransaction2,
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

  // Note: ここから必要な署名を集めていく(トランザクションをアナウンスするアカウント(FeeBillingAccount)の署名1アカウント分+その他連署2アカウント分)

  // Note: まず最初に最終的にトランザクションをアナウンスするアカウントで署名。
  logger.debug('signing aggregateCompleteTransaction by FeeBillingAccount');
  const partialSignedAggregateCompleteTransaction = feeBillingAccount.sign(
    aggregateCompleteTransaction,
    generationHashSeed
  );

  // Note: 連署データを保持する配列を初期化する。この後各アカウントで連署データ作る毎に配列に追加していき、全部そろったら改めてトランザクションに連署データをセットする。
  logger.debug('initializing cosignatures');
  const cosignatures = [];

  // Note: 連署1/2
  logger.debug(
    'cosigning 1/2 aggregateCompleteTransaction by multisigCosignatory1Account'
  );
  const cosignedTransactionByMultisigCosignatory1Account =
    CosignatureTransaction.signTransactionPayload(
      multisigCosignatory1Account,
      partialSignedAggregateCompleteTransaction.payload,
      generationHashSeed
    );
  const cosignatureByMultisigCosignatory1Account =
    new CosignatureSignedTransaction(
      cosignedTransactionByMultisigCosignatory1Account.parentHash,
      cosignedTransactionByMultisigCosignatory1Account.signature,
      cosignedTransactionByMultisigCosignatory1Account.signerPublicKey
    );
  cosignatures.push(cosignatureByMultisigCosignatory1Account);

  // Note: 連署1/2
  logger.debug(
    'cosigning 2/2 aggregateCompleteTransaction by multisigCosignatory2Account'
  );
  const cosignedTransactionByMultisigCosignatory2Account =
    CosignatureTransaction.signTransactionPayload(
      multisigCosignatory2Account,
      partialSignedAggregateCompleteTransaction.payload,
      generationHashSeed
    );
  const cosignatureByMultisigCosignatory2Account =
    new CosignatureSignedTransaction(
      cosignedTransactionByMultisigCosignatory2Account.parentHash,
      cosignedTransactionByMultisigCosignatory2Account.signature,
      cosignedTransactionByMultisigCosignatory2Account.signerPublicKey
    );
  cosignatures.push(cosignatureByMultisigCosignatory2Account);

  // Note: 連署データをトランザクションにセットする
  logger.debug('setting cosignatures to aggregateCompleteTransaction');
  const aggregateCompleteTransactionWithCosignatures =
    TransactionMapping.createFromPayload(
      partialSignedAggregateCompleteTransaction.payload
    ) as AggregateTransaction;
  const signedAggregateCompleteTransactionWithCosignatures =
    feeBillingAccount.signTransactionGivenSignatures(
      aggregateCompleteTransactionWithCosignatures,
      cosignatures,
      generationHashSeed
    );

  const hash = signedAggregateCompleteTransactionWithCosignatures.hash;
  const payload = signedAggregateCompleteTransactionWithCosignatures.payload;
  const publicKey =
    signedAggregateCompleteTransactionWithCosignatures.signerPublicKey;
  const type = signedAggregateCompleteTransactionWithCosignatures.type;

  const adminUserTx: AdminUserTx = {
    id: hash,
    userId: adminUserYearEntry.userId,
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
  return adminUserTx;
};
