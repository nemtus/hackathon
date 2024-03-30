import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { setAdminUserTx } from '../../../../../model/admin/users/txs';
import { AdminUserYearFinalJudge } from '../../../../../model/admin/users/years/final-judges';
import { createAggregateCompleteTransactionToCreateNewFinalJudge } from '../../../../../../utils/symbol/tx/createAggregateCompleteTransactionToCreateNewFinalJudge';
import { createAggregateCompleteTransactionToUpdateFinalJudge } from '../../../../../../utils/symbol/tx/createAggregateCompleteTransactionToUpdateFinalJudge';

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
  '/v/1/scopes/admin/users/{userID}/years/{yearID}/finalJudges/{finalJudgeID}';

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
          'v1-firestore-admin-user-year-finalJudge-onUpdate'
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
      const finalJudgeId = context.params.finalJudgeID;
      logger.debug({
        userId,
        yearId,
        finalJudgeId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!finalJudgeId) {
        throw Error('finalJudgeId is undefined');
      }

      const beforeAdminUserYearFinalJudge =
        converter<AdminUserYearFinalJudge>().fromFirestore(
          changeSnapshot.before
        );
      logger.debug({ beforeAdminUserYearFinalJudge });
      if (!beforeAdminUserYearFinalJudge) {
        throw Error('beforeAdminUserYearFinalJudge is undefined');
      }

      const afterAdminUserYearFinalJudge =
        converter<AdminUserYearFinalJudge>().fromFirestore(
          changeSnapshot.after
        );
      logger.debug({ afterAdminUserYearFinalJudge });
      if (!afterAdminUserYearFinalJudge) {
        throw Error('afterAdminUserYearFinalJudge is undefined');
      }

      const sendCreateFinalJudgeTxFlag =
        beforeAdminUserYearFinalJudge.approved === false &&
        afterAdminUserYearFinalJudge.approved === true &&
        beforeAdminUserYearFinalJudge.approvedAt === undefined &&
        afterAdminUserYearFinalJudge.approvedAt instanceof Date;
      logger.debug({ sendCreateFinalJudgeTxFlag });

      const sendUpdateFinalJudgeTxFlag =
        beforeAdminUserYearFinalJudge.approved === false &&
        afterAdminUserYearFinalJudge.approved === true &&
        beforeAdminUserYearFinalJudge.approvedAt instanceof Date &&
        afterAdminUserYearFinalJudge.approvedAt instanceof Date;
      logger.debug({ sendUpdateFinalJudgeTxFlag });

      if (sendCreateFinalJudgeTxFlag) {
        logger.debug('sendCreateFinalJudgeTx...');
        const aggregateCompleteTransactionToCreateNewJudge =
          await createAggregateCompleteTransactionToCreateNewFinalJudge(
            feeBillingAccountPrivateKey,
            messageReceivingAccountPrivateKey,
            dataEncryptionKey,
            userId,
            afterAdminUserYearFinalJudge,
            currentYearMosaicId
          );
        await setAdminUserTx(
          userId,
          aggregateCompleteTransactionToCreateNewJudge
        );
      }

      if (sendUpdateFinalJudgeTxFlag) {
        logger.debug('sendUpdateJudgeTx...');
        const aggregateCompleteTransactionToUpdateJudge =
          await createAggregateCompleteTransactionToUpdateFinalJudge(
            feeBillingAccountPrivateKey,
            messageReceivingAccountPrivateKey,
            dataEncryptionKey,
            userId,
            afterAdminUserYearFinalJudge,
            currentYearMosaicId
          );
        await setAdminUserTx(userId, aggregateCompleteTransactionToUpdateJudge);
      }
    });
