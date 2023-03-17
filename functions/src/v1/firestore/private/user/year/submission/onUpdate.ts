import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { postMessage } from '../../../../../../utils/slack/postMessage';
import {
  AdminUserYearSubmission,
  setAdminUserYearSubmission,
} from '../../../../../model/admin/users/years/submissions';
import { PrivateUserYearSubmission } from '../../../../../model/private/users/years/submissions';
import {
  PublicUserYearSubmission,
  setPublicUserYearSubmission,
} from '../../../../../model/public/users/years/submissions';

const SLACK_BOT_USER_OAUTH_TOKEN = defineSecret('SLACK_BOT_USER_OAUTH_TOKEN');

const path =
  '/v/1/scopes/private/users/{userID}/years/{yearID}/submissions/{submissionID}';

export const onUpdate = () =>
  functions()
    .runWith({
      secrets: ['SLACK_BOT_USER_OAUTH_TOKEN'],
    })
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-year-submission-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

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
        throw Error('submissionId is undefined');
      }

      const beforePrivateUserYearSubmission =
        converter<PrivateUserYearSubmission>().fromFirestore(
          changeSnapshot.before
        );
      logger.debug({ beforePrivateUserYearSubmission });
      if (!beforePrivateUserYearSubmission) {
        throw Error('beforePrivateUserYearSubmission is undefined');
      }

      const afterPrivateUserYearSubmission =
        converter<PrivateUserYearSubmission>().fromFirestore(
          changeSnapshot.after
        );
      logger.debug({ afterPrivateUserYearSubmission });
      if (!afterPrivateUserYearSubmission) {
        throw Error('afterPrivateUserYearSubmission is undefined');
      }

      const adminUserYearSubmission: AdminUserYearSubmission =
        afterPrivateUserYearSubmission;
      if (
        beforePrivateUserYearSubmission.approved === false &&
        afterPrivateUserYearSubmission.approved === true
      ) {
        adminUserYearSubmission.approvedAt = new Date();
      }
      logger.debug({ adminUserYearSubmission });
      await setAdminUserYearSubmission(userId, adminUserYearSubmission);

      const publicUserYearSubmission: PublicUserYearSubmission =
        afterPrivateUserYearSubmission;
      if (
        beforePrivateUserYearSubmission.approved === false &&
        afterPrivateUserYearSubmission.approved === true
      ) {
        publicUserYearSubmission.approvedAt = new Date();
      }
      logger.debug({ publicUserYearSubmission });
      await setPublicUserYearSubmission(userId, publicUserYearSubmission);

      if (
        beforePrivateUserYearSubmission.approved === true &&
        afterPrivateUserYearSubmission.approved === false
      ) {
        const slackBotUserOAuthToken = SLACK_BOT_USER_OAUTH_TOKEN.value();
        const postMessageResponse = await postMessage(
          slackBotUserOAuthToken,
          JSON.stringify(publicUserYearSubmission, null, 2),
          '#hackathon'
        );
        logger.debug({ postMessageResponse });
      }
    });
