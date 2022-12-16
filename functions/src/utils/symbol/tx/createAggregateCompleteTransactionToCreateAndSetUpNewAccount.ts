import {
  AccountAddressRestrictionTransaction,
  AddressRestrictionFlag,
  AggregateTransaction,
  AggregateTransactionCosignature,
  CosignatureSignedTransaction,
  CosignatureTransaction,
  Deadline,
  defaultChronoUnit,
  MultisigAccountModificationTransaction,
  PlainMessage,
  TransactionMapping,
  TransferTransaction,
  UnresolvedAddress,
} from 'symbol-sdk';
import { logger } from '../../firebase/logger';
import { AdminUser } from '../../../v1/model/admin/users';
import { AdminUserTx } from '../../../v1/model/admin/users/txs';
import {
  restoreAccountFromPrivateKey,
  restoreAccountsFromAdminUser,
} from '../account';
import {
  getEpochAdjustment,
  getGenerationHashSeed,
  getNetworkType,
} from '../network';

export const createAggregateCompleteTransactionToCreateAndSetUpNewAccount =
  async (
    feeBillingAccountPrivateKey: string,
    messageReceivingAccountPrivateKey: string,
    dataEncryptionKey: string,
    adminUser: AdminUser
  ): Promise<AdminUserTx> => {
    const feeBillingAccount = await restoreAccountFromPrivateKey(
      feeBillingAccountPrivateKey
    );
    const messageReceivingAccount = await restoreAccountFromPrivateKey(
      messageReceivingAccountPrivateKey
    );
    const multisigAccounts = await restoreAccountsFromAdminUser(
      adminUser,
      dataEncryptionKey
    );
    const multisigAccount = multisigAccounts.multisigAccount;
    const multisigCosignatory1Account =
      multisigAccounts.multisigCosignatory1Account;
    const multisigCosignatory2Account =
      multisigAccounts.multisigCosignatory2Account;
    const multisigCosignatory3Account =
      multisigAccounts.multisigCosignatory3Account;

    const epochAdjustment = await getEpochAdjustment();
    logger.debug('epochAdjustment', { epochAdjustment });
    const deadline = Deadline.create(epochAdjustment, 6, defaultChronoUnit);
    logger.debug('deadline', { deadline });
    const networkType = await getNetworkType();
    logger.debug('networkType', { networkType });

    const serviceId = messageReceivingAccount.address.plain();
    const serviceName = 'NEMTUS Hackathon Hack+';
    const description = 'createAndSetUpNewAccount';

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

    logger.debug('embeddedMultisigAccountModificationTransaction');
    const minApprovalDelta = 2;
    const minRemovalDelta = 2;
    const addressAdditions: UnresolvedAddress[] = [
      multisigCosignatory1Account.address,
      multisigCosignatory2Account.address,
      multisigCosignatory3Account.address,
    ];
    const addressDeletions: UnresolvedAddress[] = [];
    const embeddedMultisigAccountModificationTransaction =
      MultisigAccountModificationTransaction.create(
        deadline,
        minApprovalDelta,
        minRemovalDelta,
        addressAdditions,
        addressDeletions,
        networkType
      ).toAggregate(multisigAccount.publicAccount);

    logger.debug('embeddedAccountAddressRestrictionTransaction1of4');
    const addressRestrictionFlag = AddressRestrictionFlag.AllowIncomingAddress;
    const restrictionAdditionsForMultisigAccount: UnresolvedAddress[] = [
      feeBillingAccount.address,
      messageReceivingAccount.address,
      // multisigAccount.address,
      multisigCosignatory1Account.address,
      multisigCosignatory2Account.address,
      multisigCosignatory3Account.address,
    ];
    const restrictionDeletionsForMultisigAccount: UnresolvedAddress[] = [];
    const embeddedMultisigAccountRestrictionTransaction =
      AccountAddressRestrictionTransaction.create(
        deadline,
        addressRestrictionFlag,
        restrictionAdditionsForMultisigAccount,
        restrictionDeletionsForMultisigAccount,
        networkType
      ).toAggregate(multisigAccount.publicAccount);

    logger.debug('embeddedAccountAddressRestrictionTransaction2of4');
    const restrictionAdditionsForMultisigCosignatory1Account: UnresolvedAddress[] =
      [
        feeBillingAccount.address,
        messageReceivingAccount.address,
        multisigAccount.address,
        // multisigCosignatory1Account.address,
        multisigCosignatory2Account.address,
        multisigCosignatory3Account.address,
      ];
    const restrictionDeletionsForMultisigCosignatory1Account: UnresolvedAddress[] =
      [];
    const embeddedMultisigCosignatory1AccountRestrictionTransaction =
      AccountAddressRestrictionTransaction.create(
        deadline,
        addressRestrictionFlag,
        restrictionAdditionsForMultisigCosignatory1Account,
        restrictionDeletionsForMultisigCosignatory1Account,
        networkType
      ).toAggregate(multisigCosignatory1Account.publicAccount);

    logger.debug('embeddedAccountAddressRestrictionTransaction3of4');
    const restrictionAdditionsForMultisigCosignatory2Account: UnresolvedAddress[] =
      [
        feeBillingAccount.address,
        messageReceivingAccount.address,
        multisigAccount.address,
        multisigCosignatory1Account.address,
        // multisigCosignatory2Account.address,
        multisigCosignatory3Account.address,
      ];
    const restrictionDeletionsForMultisigCosignatory2Account: UnresolvedAddress[] =
      [];
    const embeddedMultisigCosignatory2AccountRestrictionTransaction =
      AccountAddressRestrictionTransaction.create(
        deadline,
        addressRestrictionFlag,
        restrictionAdditionsForMultisigCosignatory2Account,
        restrictionDeletionsForMultisigCosignatory2Account,
        networkType
      ).toAggregate(multisigCosignatory2Account.publicAccount);

    logger.debug('embeddedAccountAddressRestrictionTransaction4of4');
    const restrictionAdditionsForMultisigCosignatory3Account: UnresolvedAddress[] =
      [
        feeBillingAccount.address,
        messageReceivingAccount.address,
        multisigAccount.address,
        multisigCosignatory1Account.address,
        multisigCosignatory2Account.address,
        // multisigCosignatory3Account.address,
      ];
    const restrictionDeletionsForMultisigCosignatory3Account: UnresolvedAddress[] =
      [];
    const embeddedMultisigCosignatory3AccountRestrictionTransaction =
      AccountAddressRestrictionTransaction.create(
        deadline,
        addressRestrictionFlag,
        restrictionAdditionsForMultisigCosignatory3Account,
        restrictionDeletionsForMultisigCosignatory3Account,
        networkType
      ).toAggregate(multisigCosignatory3Account.publicAccount);

    logger.debug('aggregateCompleteTransaction');
    const embeddedTransactions = [
      embeddedTransferTransaction,
      embeddedMultisigAccountModificationTransaction,
      embeddedMultisigAccountRestrictionTransaction,
      embeddedMultisigCosignatory1AccountRestrictionTransaction,
      embeddedMultisigCosignatory2AccountRestrictionTransaction,
      embeddedMultisigCosignatory3AccountRestrictionTransaction,
    ];
    const initialEmptyCosignatures: AggregateTransactionCosignature[] = [];
    const feeMultiplier = 100;
    const requiredCosignatories = 5;
    const aggregateCompleteTransaction = AggregateTransaction.createComplete(
      deadline,
      embeddedTransactions,
      networkType,
      initialEmptyCosignatures
    ).setMaxFeeForAggregate(feeMultiplier, requiredCosignatories);

    const generationHashSeed = await getGenerationHashSeed();
    logger.debug('generagionHashSeed', {
      generationHashSeed: generationHashSeed,
    });

    // Note: ここから必要な署名を集めていく(トランザクションをアナウンスするアカウント(FeeBillingAccount)の署名1アカウント分+その他連署4アカウント分)

    // Note: まず最初に最終的にトランザクションをアナウンスするアカウントで署名。
    logger.debug('signing aggregateCompleteTransaction by FeeBillingAccount');
    const partialSignedAggregateCompleteTransaction = feeBillingAccount.sign(
      aggregateCompleteTransaction,
      generationHashSeed
    );

    // Note: 連署データを保持する配列を初期化する。この後各アカウントで連署データ作る毎に配列に追加していき、全部そろったら改めてトランザクションに連署データをセットする。
    logger.debug('initializing cosignatures');
    const cosignatures = [];

    // Note: 連署1/4
    logger.debug(
      'cosigning 1/4 aggregateCompleteTransaction by multisigAccount'
    );
    const cosignedTransactionByMultisigAccount =
      CosignatureTransaction.signTransactionPayload(
        multisigAccount,
        partialSignedAggregateCompleteTransaction.payload,
        generationHashSeed
      );
    const cosignatureByMultisigAccount = new CosignatureSignedTransaction(
      cosignedTransactionByMultisigAccount.parentHash,
      cosignedTransactionByMultisigAccount.signature,
      cosignedTransactionByMultisigAccount.signerPublicKey
    );
    cosignatures.push(cosignatureByMultisigAccount);

    // Note: 連署2/4
    logger.debug(
      'cosigning 2/4 aggregateCompleteTransaction by multisigCosignatory1Account'
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

    // Note: 連署3/4
    logger.debug(
      'cosigning 3/4 aggregateCompleteTransaction by multisigCosignatory2Account'
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

    // Note: 連署4/4
    logger.debug(
      'cosigning 4/4 aggregateCompleteTransaction by multisigCosignatory3Account'
    );
    const cosignedTransactionByMultisigCosignatory3Account =
      CosignatureTransaction.signTransactionPayload(
        multisigCosignatory3Account,
        partialSignedAggregateCompleteTransaction.payload,
        generationHashSeed
      );
    const cosignatureByMultisigCosignatory3Account =
      new CosignatureSignedTransaction(
        cosignedTransactionByMultisigCosignatory3Account.parentHash,
        cosignedTransactionByMultisigCosignatory3Account.signature,
        cosignedTransactionByMultisigCosignatory3Account.signerPublicKey
      );
    cosignatures.push(cosignatureByMultisigCosignatory3Account);

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
      userId: adminUser.id,
      hash,
      payload,
      publicKey,
      type,
      networkType,
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
