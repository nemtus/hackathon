import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { setAdminUserTx } from '../../../../../model/admin/users/txs';
import { AdminUserYearJudge } from '../../../../../model/admin/users/years/judges';
import { createAggregateCompleteTransactionToCreateNewJudge } from '../../../../../../utils/symbol/tx/createAggregateCompleteTransactionToCreateNewJudge';
import { createAggregateCompleteTransactionToUpdateJudge } from '../../../../../../utils/symbol/tx/createAggregateCompleteTransactionToUpdateJudge';

const FEE_BILLING_ACCOUNT_PRIVATE_KEY = defineSecret(
  'FEE_BILLING_ACCOUNT_PRIVATE_KEY'
);
const MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY = defineSecret(
  'MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY'
);
const DATA_ENCRYPTION_KEY = defineSecret('DATA_ENCRYPTION_KEY');
const MOSAIC_ID_2023 = defineSecret(`MOSAIC_ID_2023`);

const path = '/v/1/scopes/admin/users/{userID}/years/{yearID}/judges/{judgeID}';

export const onUpdate = () =>
  functions()
    .runWith({
      secrets: [
        'FEE_BILLING_ACCOUNT_PRIVATE_KEY',
        'MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY',
        'DATA_ENCRYPTION_KEY',
        'MOSAIC_ID_2023',
      ],
    })
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-admin-user-year-judge-onUpdate'
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
      const mosaicId2023 = MOSAIC_ID_2023.value();

      const userId = context.params.userID;
      const yearId = context.params.yearID;
      const judgeId = context.params.judgeID;
      logger.debug({
        userId,
        yearId,
        judgeId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!judgeId) {
        throw Error('judgeId is undefined');
      }

      const beforeAdminUserYearJudge =
        converter<AdminUserYearJudge>().fromFirestore(changeSnapshot.before);
      logger.debug({ beforeAdminUserYearJudge });
      if (!beforeAdminUserYearJudge) {
        throw Error('beforeAdminUserYearJudge is undefined');
      }

      const afterAdminUserYearJudge =
        converter<AdminUserYearJudge>().fromFirestore(changeSnapshot.after);
      logger.debug({ afterAdminUserYearJudge });
      if (!afterAdminUserYearJudge) {
        throw Error('afterAdminUserYearJudge is undefined');
      }

      const sendCreateJudgeTxFlag =
        beforeAdminUserYearJudge.approved === false &&
        afterAdminUserYearJudge.approved === true &&
        beforeAdminUserYearJudge.approvedAt === undefined &&
        afterAdminUserYearJudge.approvedAt instanceof Date;
      logger.debug({ sendCreateJudgeTxFlag });

      const sendUpdateJudgeTxFlag =
        beforeAdminUserYearJudge.approved === false &&
        afterAdminUserYearJudge.approved === true &&
        beforeAdminUserYearJudge.approvedAt instanceof Date &&
        afterAdminUserYearJudge.approvedAt instanceof Date;
      logger.debug({ sendUpdateJudgeTxFlag });

      if (sendCreateJudgeTxFlag) {
        logger.debug('sendCreateJudgeTx...');
        const aggregateCompleteTransactionToCreateNewJudge =
          await createAggregateCompleteTransactionToCreateNewJudge(
            feeBillingAccountPrivateKey,
            messageReceivingAccountPrivateKey,
            dataEncryptionKey,
            userId,
            afterAdminUserYearJudge,
            mosaicId2023
          );
        await setAdminUserTx(
          userId,
          aggregateCompleteTransactionToCreateNewJudge
        );
      }

      if (sendUpdateJudgeTxFlag) {
        logger.debug('sendUpdateJudgeTx...');
        const aggregateCompleteTransactionToUpdateJudge =
          await createAggregateCompleteTransactionToUpdateJudge(
            feeBillingAccountPrivateKey,
            messageReceivingAccountPrivateKey,
            dataEncryptionKey,
            userId,
            afterAdminUserYearJudge,
            mosaicId2023
          );
        await setAdminUserTx(userId, aggregateCompleteTransactionToUpdateJudge);
      }
    });
