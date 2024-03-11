import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { setAdminUserTx } from '../../../../../model/admin/users/txs';
import { getAdminUserYearTeam } from '../../../../../model/admin/users/years/teams';
import { AdminUserYearSubmission } from '../../../../../model/admin/users/years/submissions';
import { createAggregateCompleteTransactionToCreateNewSubmission } from '../../../../../../utils/symbol/tx/createAggregateCompleteTransactionToCreateNewSubmission';
import { createAggregateCompleteTransactionToUpdateSubmission } from '../../../../../../utils/symbol/tx/createAggregateCompleteTransactionToUpdateSubmission';

const FEE_BILLING_ACCOUNT_PRIVATE_KEY = defineSecret(
  'FEE_BILLING_ACCOUNT_PRIVATE_KEY'
);
const MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY = defineSecret(
  'MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY'
);
const DATA_ENCRYPTION_KEY = defineSecret('DATA_ENCRYPTION_KEY');

const path =
  '/v/1/scopes/admin/users/{userID}/years/{yearID}/submissions/{submissionID}';

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
          'v1-firestore-admin-user-year-submission-onUpdate'
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

      const userId = context.params.userID;
      const yearId = context.params.yearID;
      const submissionId = context.params.submissionID;
      logger.debug({
        userId,
        yearId,
        submissionId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!submissionId) {
        throw Error('teamId is undefined');
      }

      const beforeAdminUserYearSubmission =
        converter<AdminUserYearSubmission>().fromFirestore(
          changeSnapshot.before
        );
      logger.debug({ beforeAdminUserYearSubmission });
      if (!beforeAdminUserYearSubmission) {
        throw Error('beforeAdminUserYearSubmission is undefined');
      }

      const afterAdminUserYearSubmission =
        converter<AdminUserYearSubmission>().fromFirestore(
          changeSnapshot.after
        );
      logger.debug({ afterAdminUserYearSubmission });
      if (!afterAdminUserYearSubmission) {
        throw Error('afterAdminUserYearSubmission is undefined');
      }

      const adminUserYearTeam = await getAdminUserYearTeam(
        userId,
        yearId,
        afterAdminUserYearSubmission.teamId
      );
      if (!adminUserYearTeam) {
        throw Error('adminUserYearTeam is undefined');
      }

      const sendCreateSubmissionTxFlag =
        beforeAdminUserYearSubmission.approved === false &&
        afterAdminUserYearSubmission.approved === true &&
        beforeAdminUserYearSubmission.approvedAt === undefined &&
        afterAdminUserYearSubmission.approvedAt instanceof Date;
      logger.debug({ sendCreateSubmissionTxFlag });

      const sendUpdateSubmissionTxFlag =
        beforeAdminUserYearSubmission.approved === false &&
        afterAdminUserYearSubmission.approved === true &&
        beforeAdminUserYearSubmission.approvedAt instanceof Date &&
        afterAdminUserYearSubmission.approvedAt instanceof Date;
      logger.debug({ sendUpdateSubmissionTxFlag });

      if (sendCreateSubmissionTxFlag) {
        logger.debug('sendCreateSubmissionTx...');
        const aggregateCompleteTransactionToCreateAndSetUpNewSubmission =
          await createAggregateCompleteTransactionToCreateNewSubmission(
            feeBillingAccountPrivateKey,
            messageReceivingAccountPrivateKey,
            dataEncryptionKey,
            userId,
            adminUserYearTeam,
            afterAdminUserYearSubmission
          );
        await setAdminUserTx(
          userId,
          aggregateCompleteTransactionToCreateAndSetUpNewSubmission
        );
      }

      if (sendUpdateSubmissionTxFlag) {
        logger.debug('sendUpdateTeamInfoTx...');
        const aggregateCompleteTransactionToUpdateSubmission =
          await createAggregateCompleteTransactionToUpdateSubmission(
            feeBillingAccountPrivateKey,
            messageReceivingAccountPrivateKey,
            dataEncryptionKey,
            userId,
            adminUserYearTeam,
            afterAdminUserYearSubmission
          );
        await setAdminUserTx(
          userId,
          aggregateCompleteTransactionToUpdateSubmission
        );
      }
    });
