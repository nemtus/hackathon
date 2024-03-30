import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { setAdminUserTx } from '../../../../../model/admin/users/txs';
import { AdminUserYearFinalVote } from '../../../../../model/admin/users/years/final-votes';
import { createAggregateCompleteTransactionToCreateNewFinalVote } from '../../../../../../utils/symbol/tx/createAggregateCompleteTransactionToCreateNewFinalVote';
import { createAggregateCompleteTransactionToUpdateFinalVote } from '../../../../../../utils/symbol/tx/createAggregateCompleteTransactionToUpdateFinalVote';

const MOSAIC_ID_2023 = process.env.MOSAIC_ID_2023;
const MOSAIC_ID_2024 = process.env.MOSAIC_ID_2024;
const CURRENT_YEAR = process.env.CURRENT_YEAR;
const CURRENT_YEAR_MOSAIC_ID = process.env[`MOSAIC_ID_${CURRENT_YEAR}`];

const FEE_BILLING_ACCOUNT_PRIVATE_KEY = defineSecret(
  'FEE_BILLING_ACCOUNT_PRIVATE_KEY'
);
const MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY = defineSecret(
  'MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY'
);
const DATA_ENCRYPTION_KEY = defineSecret('DATA_ENCRYPTION_KEY');

const path =
  '/v/1/scopes/admin/users/{userID}/years/{yearID}/finalVotes/{finalVoteID}';

export const onUpdate = () =>
  functions()
    .runWith({
      memory: '256MB',
      secrets: [
        'FEE_BILLING_ACCOUNT_PRIVATE_KEY',
        'MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY',
        'DATA_ENCRYPTION_KEY',
      ],
    })
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-admin-user-year-vote-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

      const feeBillingAccountPrivateKey =
        FEE_BILLING_ACCOUNT_PRIVATE_KEY.value();
      const messageReceivingAccountPrivateKey =
        MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY.value();
      const dataEncryptionKey = DATA_ENCRYPTION_KEY.value();
      const mosaicId2023 = MOSAIC_ID_2023;
      const mosaicId2024 = MOSAIC_ID_2024;
      const currentYearMosaicId = CURRENT_YEAR_MOSAIC_ID;
      if (!mosaicId2023) {
        throw Error('mosaicId2023 is undefined');
      }
      if (!mosaicId2024) {
        throw Error('mosaicId2024 is undefined');
      }
      if (
        !currentYearMosaicId ||
        currentYearMosaicId === 'MOSAIC_ID_' ||
        currentYearMosaicId === 'MOSAIC_ID_undefined'
      ) {
        throw Error('currentYearMosaicId is undefined');
      }
      logger.debug({ mosaicId2023, mosaicId2024, currentYearMosaicId });

      const userId = context.params.userID;
      const yearId = context.params.yearID;
      const finalVoteId = context.params.finalVoteID;
      logger.debug({
        userId,
        yearId,
        finalVoteId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!finalVoteId) {
        throw Error('finalVoteId is undefined');
      }

      const beforeAdminUserYearFinalVote =
        converter<AdminUserYearFinalVote>().fromFirestore(
          changeSnapshot.before
        );
      logger.debug({ beforeAdminUserYearFinalVote });
      if (!beforeAdminUserYearFinalVote) {
        throw Error('beforeAdminUserYearFinalVote is undefined');
      }

      const afterAdminUserYearFinalVote =
        converter<AdminUserYearFinalVote>().fromFirestore(changeSnapshot.after);
      logger.debug({ afterAdminUserYearFinalVote });
      if (!afterAdminUserYearFinalVote) {
        throw Error('afterAdminUserYearFinalVote is undefined');
      }

      const sendCreateFinalVoteTxFlag =
        beforeAdminUserYearFinalVote.approved === false &&
        afterAdminUserYearFinalVote.approved === true &&
        beforeAdminUserYearFinalVote.approvedAt === undefined &&
        afterAdminUserYearFinalVote.approvedAt instanceof Date;
      logger.debug({ sendCreateFinalVoteTxFlag });

      const sendUpdateFinalVoteTxFlag =
        beforeAdminUserYearFinalVote.approved === false &&
        afterAdminUserYearFinalVote.approved === true &&
        beforeAdminUserYearFinalVote.approvedAt instanceof Date &&
        afterAdminUserYearFinalVote.approvedAt instanceof Date;
      logger.debug({ sendUpdateFinalVoteTxFlag });

      if (sendCreateFinalVoteTxFlag) {
        logger.debug('sendCreateFinalVoteTx...');
        const aggregateCompleteTransactionToCreateNewFinalVote =
          await createAggregateCompleteTransactionToCreateNewFinalVote(
            feeBillingAccountPrivateKey,
            messageReceivingAccountPrivateKey,
            dataEncryptionKey,
            userId,
            afterAdminUserYearFinalVote,
            currentYearMosaicId
          );
        await setAdminUserTx(
          userId,
          aggregateCompleteTransactionToCreateNewFinalVote
        );
      }

      if (sendUpdateFinalVoteTxFlag) {
        logger.debug('sendUpdateFinalVoteTx...');
        const aggregateCompleteTransactionToUpdateVote =
          await createAggregateCompleteTransactionToUpdateFinalVote(
            feeBillingAccountPrivateKey,
            messageReceivingAccountPrivateKey,
            dataEncryptionKey,
            userId,
            afterAdminUserYearFinalVote,
            currentYearMosaicId
          );
        await setAdminUserTx(userId, aggregateCompleteTransactionToUpdateVote);
      }
    });
