import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { postMessage } from '../../../../../../utils/slack/postMessage';
import {
  AdminUserYearTeam,
  setAdminUserYearTeam,
} from '../../../../../model/admin/users/years/teams';
import { PrivateUserYearTeam } from '../../../../../model/private/users/years/teams';
import {
  PublicUserYearTeam,
  setPublicUserYearTeam,
} from '../../../../../model/public/users/years/teams';

const SLACK_BOT_USER_OAUTH_TOKEN = defineSecret('SLACK_BOT_USER_OAUTH_TOKEN');
const SLACK_NOTIFY_CHANNEL = defineSecret('SLACK_NOTIFY_CHANNEL');

const path = '/v/1/scopes/private/users/{userID}/years/{yearID}/teams/{teamID}';

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
          'v1-firestore-private-user-year-team-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

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

      const beforePrivateUserYearTeam =
        converter<PrivateUserYearTeam>().fromFirestore(changeSnapshot.before);
      logger.debug({ beforePrivateUserYearTeam });
      if (!beforePrivateUserYearTeam) {
        throw Error('beforePrivateUserYearTeam is undefined');
      }

      const afterPrivateUserYearTeam =
        converter<PrivateUserYearTeam>().fromFirestore(changeSnapshot.after);
      logger.debug({ afterPrivateUserYearTeam });
      if (!afterPrivateUserYearTeam) {
        throw Error('afterPrivateUserYearTeam is undefined');
      }

      const adminUserYearTeam: AdminUserYearTeam = afterPrivateUserYearTeam;
      if (
        beforePrivateUserYearTeam.approved === false &&
        afterPrivateUserYearTeam.approved === true
      ) {
        adminUserYearTeam.approvedAt = new Date();
      }
      logger.debug({ adminUserYearTeam });
      await setAdminUserYearTeam(userId, adminUserYearTeam);

      delete afterPrivateUserYearTeam.teamPublicKey;
      const publicUserYearTeam: PublicUserYearTeam = afterPrivateUserYearTeam;
      if (
        beforePrivateUserYearTeam.approved === false &&
        afterPrivateUserYearTeam.approved === true
      ) {
        publicUserYearTeam.approvedAt = new Date();
      }
      logger.debug({ publicUserYearTeam });
      await setPublicUserYearTeam(userId, publicUserYearTeam);

      if (
        beforePrivateUserYearTeam.approved === true &&
        afterPrivateUserYearTeam.approved === false
      ) {
        const slackBotUserOAuthToken = SLACK_BOT_USER_OAUTH_TOKEN.value();
        const slackNotifyChannel = SLACK_NOTIFY_CHANNEL.value();
        const postMessageResponse = await postMessage(
          slackBotUserOAuthToken,
          JSON.stringify(publicUserYearTeam, null, 2),
          `#${slackNotifyChannel}`
        );
        logger.debug({ postMessageResponse });
      }
    });
