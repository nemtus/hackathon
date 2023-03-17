import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { postMessage } from '../../../../../../utils/slack/postMessage';
import {
  AdminUserYearSubmission,
  setAdminUserYearSubmission,
} from '../../../../../model/admin/users/years/submissions';
import { privateUserYearSubmissionConverter } from '../../../../../model/private/users/years/submissions';
import {
  PublicUserYearSubmission,
  setPublicUserYearSubmission,
} from '../../../../../model/public/users/years/submissions';

const SLACK_BOT_USER_OAUTH_TOKEN = defineSecret('SLACK_BOT_USER_OAUTH_TOKEN');
const SLACK_NOTIFY_CHANNEL = defineSecret('SLACK_NOTIFY_CHANNEL');

const path =
  '/v/1/scopes/private/users/{userID}/years/{yearID}/submissions/{submissionID}';

export const onCreate = () =>
  functions()
    .runWith({
      secrets: ['SLACK_BOT_USER_OAUTH_TOKEN', 'SLACK_NOTIFY_CHANNEL'],
    })
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-year-submission-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

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

      const privateUserYearSubmission =
        privateUserYearSubmissionConverter.fromFirestore(snapshot);
      if (!privateUserYearSubmission) {
        throw Error('privateUserYearSubmission is undefined');
      }
      logger.debug({ privateUserYearSubmission });

      const adminUserYearSubmission: AdminUserYearSubmission =
        privateUserYearSubmission;
      logger.debug({ adminUserYearSubmission });
      await setAdminUserYearSubmission(userId, adminUserYearSubmission);

      const publicUserYearSubmission: PublicUserYearSubmission =
        privateUserYearSubmission;
      logger.debug({ publicUserYearSubmission });
      await setPublicUserYearSubmission(userId, publicUserYearSubmission);

      const slackBotUserOAuthToken = SLACK_BOT_USER_OAUTH_TOKEN.value();
      const slackNotifyChannel = SLACK_NOTIFY_CHANNEL.value();
      const postMessageResponse = await postMessage(
        slackBotUserOAuthToken,
        JSON.stringify(publicUserYearSubmission, null, 2),
        `#${slackNotifyChannel}`
      );
      logger.debug({ postMessageResponse });
    });
