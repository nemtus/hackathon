import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { createAggregateCompleteTransactionToCreateAndSetUpNewTeam } from '../../../../../../utils/symbol/tx/createAggregateCompleteTransactionToCreateAndSetUpNewTeam';
import { createAggregateCompleteTransactionToUpdateTeamInfo } from '../../../../../../utils/symbol/tx/createAggregateCompleteTransactionToUpdateTeamInfo';
import { setAdminUserTx } from '../../../../../model/admin/users/txs';
import { AdminUserYearTeam } from '../../../../../model/admin/users/years/teams';

const FEE_BILLING_ACCOUNT_PRIVATE_KEY = defineSecret(
  'FEE_BILLING_ACCOUNT_PRIVATE_KEY'
);
const MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY = defineSecret(
  'MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY'
);
const DATA_ENCRYPTION_KEY = defineSecret('DATA_ENCRYPTION_KEY');

const path = '/v/1/scopes/admin/users/{userID}/years/{yearID}/teams/{teamID}';

export const onUpdate = () =>
  functions()
    .runWith({
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
          'v1-firestore-admin-user-year-team-onUpdate'
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
      const teamId = context.params.teamID;
      logger.debug({
        userId,
        yearId,
        teamId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!teamId) {
        throw Error('teamId is undefined');
      }

      const beforeAdminUserYearTeam =
        converter<AdminUserYearTeam>().fromFirestore(changeSnapshot.before);
      logger.debug({ beforeAdminUserYearTeam });
      if (!beforeAdminUserYearTeam) {
        throw Error('beforeAdminUserYearTeam is undefined');
      }

      const afterAdminUserYearTeam =
        converter<AdminUserYearTeam>().fromFirestore(changeSnapshot.after);
      logger.debug({ afterAdminUserYearTeam });
      if (!afterAdminUserYearTeam) {
        throw Error('afterAdminUserYearTeam is undefined');
      }

      const sendCreateAndSetUpTeamTxFlag =
        beforeAdminUserYearTeam.approved === false &&
        afterAdminUserYearTeam.approved === true &&
        beforeAdminUserYearTeam.approvedAt === undefined &&
        afterAdminUserYearTeam.approvedAt instanceof Date;
      logger.debug({ sendTxFlag: sendCreateAndSetUpTeamTxFlag });

      const sendUpdateTeamInfoTxFlag =
        beforeAdminUserYearTeam.approved === false &&
        afterAdminUserYearTeam.approved === true &&
        beforeAdminUserYearTeam.approvedAt instanceof Date &&
        afterAdminUserYearTeam.approvedAt instanceof Date;
      logger.debug({ sendUpdateTeamInfoTxFlag });

      if (sendCreateAndSetUpTeamTxFlag) {
        logger.debug('sendCreateAndSetUpTeamTx...');
        const aggregateCompleteTransactionToCreateAndSetUpNewTeam =
          await createAggregateCompleteTransactionToCreateAndSetUpNewTeam(
            feeBillingAccountPrivateKey,
            messageReceivingAccountPrivateKey,
            dataEncryptionKey,
            userId,
            afterAdminUserYearTeam
          );
        await setAdminUserTx(
          userId,
          aggregateCompleteTransactionToCreateAndSetUpNewTeam
        );
      }

      if (sendUpdateTeamInfoTxFlag) {
        logger.debug('sendUpdateTeamInfoTx...');
        const aggregateCompleteTransactionToUpdateTeamInfo =
          await createAggregateCompleteTransactionToUpdateTeamInfo(
            feeBillingAccountPrivateKey,
            messageReceivingAccountPrivateKey,
            dataEncryptionKey,
            userId,
            afterAdminUserYearTeam
          );
        await setAdminUserTx(
          userId,
          aggregateCompleteTransactionToUpdateTeamInfo
        );
      }
    });
