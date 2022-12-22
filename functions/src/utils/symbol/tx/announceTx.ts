import { logger } from 'firebase-functions/v1';
import { firstValueFrom } from 'rxjs';
import { Address, RepositoryFactoryHttp, SignedTransaction } from 'symbol-sdk';
import { AdminUserTx } from '../../../v1/model/admin/users/txs';
import { queryValidNodes } from '../../../v1/model/configs/symbol/nodes';
import { selectRandomElement } from '../../typescript/selectRandomElement';

type TxStatus = {
  announced: boolean;
  announcedAt?: Date;
  unconfirmed: boolean;
  unconfirmedAt?: Date;
  confirmed: boolean;
  confirmedAt?: Date;
  finalized: boolean;
  finalizedAt?: Date;
  expired: boolean;
  expiredAt?: Date;
  error: boolean;
  errorAt?: Date;
};

export const announceTx = async (
  adminUserTx: AdminUserTx
): Promise<TxStatus> => {
  logger.debug({ adminUserTx });

  if (!adminUserTx.publicKey || !adminUserTx.networkType) {
    throw Error('publicKey, networkType is required');
  }
  const address = Address.createFromPublicKey(
    adminUserTx.publicKey,
    adminUserTx.networkType
  );

  if (
    !adminUserTx.payload ||
    !adminUserTx.hash ||
    !adminUserTx.publicKey ||
    !adminUserTx.type
  ) {
    throw Error('payload, hash, publicKey, type are required');
  }
  const signedTransaction = new SignedTransaction(
    adminUserTx.payload,
    adminUserTx.hash,
    adminUserTx.publicKey,
    adminUserTx.type,
    adminUserTx.networkType
  );

  const validNodes = await queryValidNodes();
  logger.debug({ validNodes });

  let i = 0;
  const txStatus: TxStatus = {
    announced: false,
    unconfirmed: false,
    confirmed: false,
    finalized: false,
    expired: false,
    error: false,
  };

  while (i < 20 || !txStatus.confirmed) {
    i = i++;
    logger.debug(i + ' th try');
    txStatus.announced = false;
    txStatus.unconfirmed = false;
    txStatus.confirmed = false;
    txStatus.finalized = false;
    txStatus.error = false;
    const node = selectRandomElement(validNodes);
    logger.debug({ node });
    const nodeUrl = `https://${node.id}:3001`;
    logger.debug({ nodeUrl });
    const repositoryFactory = new RepositoryFactoryHttp(nodeUrl);
    const transactionRepository =
      repositoryFactory.createTransactionRepository();
    const transactionStatusRepository =
      repositoryFactory.createTransactionStatusRepository();

    // Note: 既にconfirmedかunconfirmedになっていないか確認
    try {
      const transactionStatus = await firstValueFrom(
        transactionStatusRepository.getTransactionStatus(adminUserTx.hash)
      );
      if (transactionStatus.group === 'confirmed') {
        const now = new Date();
        logger.debug('tx already confirmed');
        txStatus.confirmed = true;
        txStatus.unconfirmed = true;
        txStatus.announced = true;
        txStatus.confirmedAt = txStatus.confirmedAt
          ? txStatus.confirmedAt
          : now;
        txStatus.unconfirmedAt = txStatus.unconfirmedAt
          ? txStatus.unconfirmedAt
          : now;
        txStatus.announcedAt = txStatus.announcedAt
          ? txStatus.announcedAt
          : now;
      }
      if (transactionStatus.group === 'unconfirmed') {
        const now = new Date();
        logger.debug('tx already unconfirmed');
        txStatus.confirmed = false;
        txStatus.unconfirmed = true;
        txStatus.announced = true;
        txStatus.unconfirmedAt = txStatus.unconfirmedAt
          ? txStatus.unconfirmedAt
          : now;
        txStatus.announcedAt = txStatus.announcedAt
          ? txStatus.announcedAt
          : now;
      }
    } catch (error) {
      logger.debug({ error });
    }

    if (txStatus.confirmed) {
      break;
    }

    try {
      const listener = repositoryFactory.createListener();
      try {
        await listener.open();
        listener.unconfirmedAdded(address).subscribe((tx) => {
          logger.debug('unconfirmedAdded', { address, tx });
          if (tx.transactionInfo?.hash === adminUserTx.hash) {
            const now = new Date();
            logger.debug('unconfirmedTxHash match', { hash: adminUserTx.hash });
            txStatus.unconfirmed = true;
            txStatus.announced = true;
            txStatus.unconfirmedAt = txStatus.unconfirmedAt
              ? txStatus.unconfirmedAt
              : now;
            txStatus.announcedAt = txStatus.announcedAt
              ? txStatus.announcedAt
              : now;
          }
        });
        listener.confirmed(address).subscribe((tx) => {
          const now = new Date();
          logger.debug('confirmed', { address, tx });
          if (tx.transactionInfo?.hash === adminUserTx.hash) {
            txStatus.confirmed = true;
            txStatus.unconfirmed = true;
            txStatus.announced = true;
            txStatus.confirmedAt = txStatus.confirmedAt
              ? txStatus.confirmedAt
              : now;
            txStatus.unconfirmedAt = txStatus.unconfirmedAt
              ? txStatus.unconfirmedAt
              : now;
            txStatus.announcedAt = txStatus.announcedAt
              ? txStatus.announcedAt
              : now;
            if (listener.isOpen()) {
              listener.close();
            }
          }
        });
        listener.newBlock().subscribe((block) => {
          logger.debug('newBlock', { block });
        });
        const subscription = transactionRepository
          .announce(signedTransaction)
          .subscribe((response) => {
            logger.debug('announce', { response });
            if (!response) {
              subscription.unsubscribe();
            }
          });
        const now = new Date();
        txStatus.announced = true;
        txStatus.announcedAt = txStatus.announcedAt
          ? txStatus.announcedAt
          : now;
      } catch (error) {
        logger.warn('listener open or tx announce error', { error });
        if (listener.isOpen()) {
          listener.close();
        }
      }
    } catch (error) {
      logger.warn('listener create error', { error });
    }

    if (!txStatus.confirmed) {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Note: listenerでの検知漏れ対策として、もう一度confirmedかunconfirmedになっていないか確認
      try {
        const transactionStatus = await firstValueFrom(
          transactionStatusRepository.getTransactionStatus(adminUserTx.hash)
        );
        if (transactionStatus.group === 'confirmed') {
          const now = new Date();
          txStatus.confirmed = true;
          txStatus.unconfirmed = true;
          txStatus.announced = true;
          txStatus.confirmedAt = txStatus.confirmedAt
            ? txStatus.confirmedAt
            : now;
          txStatus.unconfirmedAt = txStatus.unconfirmedAt
            ? txStatus.unconfirmedAt
            : now;
          txStatus.announcedAt = txStatus.announcedAt
            ? txStatus.announcedAt
            : now;
        }
        if (transactionStatus.group === 'unconfirmed') {
          const now = new Date();
          txStatus.confirmed = false;
          txStatus.unconfirmed = true;
          txStatus.announced = true;
          txStatus.unconfirmedAt = txStatus.unconfirmedAt
            ? txStatus.unconfirmedAt
            : now;
          txStatus.announcedAt = txStatus.announcedAt
            ? txStatus.announcedAt
            : now;
        }
      } catch (error) {
        logger.debug({ error });
      }

      if (txStatus.confirmed) {
        break;
      }
    }
  }

  logger.debug({ txStatus });
  return txStatus;
};
