import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { postMessage } from '../../../../../../utils/slack/postMessage';
import { getAdminUser } from '../../../../../model/admin/users';
import {
  AdminUserYearJudge,
  setAdminUserYearJudge,
} from '../../../../../model/admin/users/years/judges';
import { getAdminUserYearTeam } from '../../../../../model/admin/users/years/teams';
import { getConfigHackathonYearJudge } from '../../../../../model/configs/hackathon/years/judge';
import { PrivateUserYearJudge } from '../../../../../model/private/users/years/judges';
import {
  PublicUserYearJudge,
  setPublicUserYearJudge,
} from '../../../../../model/public/users/years/judges';

const CURRENT_YEAR = process.env.CURRENT_YEAR;

const SLACK_BOT_USER_OAUTH_TOKEN = defineSecret('SLACK_BOT_USER_OAUTH_TOKEN');
const SLACK_NOTIFY_CHANNEL = defineSecret('SLACK_NOTIFY_CHANNEL');

const path =
  '/v/1/scopes/private/users/{userID}/years/{yearID}/judges/{judgeID}';

export const onUpdate = () =>
  functions()
    .runWith({
      secrets: ['SLACK_BOT_USER_OAUTH_TOKEN', 'SLACK_NOTIFY_CHANNEL'],
    })
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-year-judge-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

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

      const configHackathonYearJudge = await getConfigHackathonYearJudge(
        yearId
      );
      if (!configHackathonYearJudge) {
        throw Error('configHackathonYearJudge is undefined');
      }

      const beforePrivateUserYearJudge =
        converter<PrivateUserYearJudge>().fromFirestore(changeSnapshot.before);
      logger.debug({ beforePrivateUserYearJudge });
      if (!beforePrivateUserYearJudge) {
        throw Error('beforePrivateUserYearJudge is undefined');
      }

      const afterPrivateUserYearJudge =
        converter<PrivateUserYearJudge>().fromFirestore(changeSnapshot.after);
      logger.debug({ afterPrivateUserYearJudge });
      if (!afterPrivateUserYearJudge) {
        throw Error('afterPrivateUserYearJudge is undefined');
      }

      // Note: Validate user
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (afterPrivateUserYearJudge.userId !== userId) {
        throw Error(
          'userId is not matched to afterPrivateUserYearJudge.userId'
        );
      }
      const adminUser = await getAdminUser(userId);
      if (!adminUser) {
        throw Error('adminUser is undefined');
      }
      logger.debug({ adminUser });

      // Note: Validate judges
      let totalPoints = 0;

      for (const judge of afterPrivateUserYearJudge.judges) {
        logger.debug({ judge });
        if (judge.userId !== userId) {
          throw Error('judge.userId is not matched to userId');
        }
        if (
          !(
            afterPrivateUserYearJudge.createdAt &&
            configHackathonYearJudge.startAt <=
              afterPrivateUserYearJudge.createdAt &&
            afterPrivateUserYearJudge.createdAt <=
              configHackathonYearJudge.endAt &&
            configHackathonYearJudge.users.some(
              (userId) => userId === afterPrivateUserYearJudge.userId
            ) &&
            judge.userId && // Note: voting user
            judge.yearId === CURRENT_YEAR &&
            judge.teamId &&
            judge.submissionId &&
            Number.isInteger(judge.point) &&
            judge.point >= 0 &&
            judge.point <= afterPrivateUserYearJudge.judges.length * 100 &&
            totalPoints <= afterPrivateUserYearJudge.judges.length * 100 &&
            typeof judge.message === 'string'
          )
        ) {
          throw Error('judge is not valid');
        }
        const adminUserYearTeam = await getAdminUserYearTeam(
          judge.teamId,
          judge.yearId,
          judge.teamId
        );
        logger.debug({ adminUserYearTeam });
        if (!adminUserYearTeam) {
          throw Error('adminUserYearTeam is not undefined');
        }
        if (!adminUserYearTeam.teamSaltHexString) {
          throw Error('teamSaltHexString is not valid');
        }
        if (!adminUserYearTeam.teamIvHexString) {
          throw Error('teamSaltHexString is not valid');
        }
        if (!adminUserYearTeam.teamEncryptedPrivateKey) {
          throw Error('teamSaltHexString is not valid');
        }
        if (!adminUserYearTeam.teamPublicKey) {
          throw Error('teamSaltHexString is not valid');
        }
        if (!adminUserYearTeam.teamAddress) {
          throw Error('teamSaltHexString is not valid');
        }
        totalPoints += judge.point;
      }
      logger.debug({ totalPoints });
      if (totalPoints !== afterPrivateUserYearJudge.judges.length * 100) {
        throw Error('totalPoint should be 100 * votes.length');
      }
      if (totalPoints !== afterPrivateUserYearJudge.totalPoints) {
        throw Error(
          'totalPoints should be equal to afterPrivateUserYearJudge.totalPoints'
        );
      }

      const adminUserYearJudge: AdminUserYearJudge = afterPrivateUserYearJudge;
      if (
        beforePrivateUserYearJudge.approved === false &&
        afterPrivateUserYearJudge.approved === true
      ) {
        adminUserYearJudge.approvedAt = new Date();
      }
      logger.debug({ adminUserYearJudge });
      await setAdminUserYearJudge(userId, adminUserYearJudge);

      const publicUserYearJudge: PublicUserYearJudge =
        afterPrivateUserYearJudge;
      if (
        beforePrivateUserYearJudge.approved === false &&
        afterPrivateUserYearJudge.approved === true
      ) {
        publicUserYearJudge.approvedAt = new Date();
      }
      logger.debug({ publicUserYearJudge });
      await setPublicUserYearJudge(userId, publicUserYearJudge);

      if (
        beforePrivateUserYearJudge.approved === true &&
        afterPrivateUserYearJudge.approved === false
      ) {
        const slackBotUserOAuthToken = SLACK_BOT_USER_OAUTH_TOKEN.value();
        const slackNotifyChannel = SLACK_NOTIFY_CHANNEL.value();
        const postMessageResponse = await postMessage(
          slackBotUserOAuthToken,
          JSON.stringify(publicUserYearJudge, null, 2),
          `#${slackNotifyChannel}`
        );
        logger.debug({ postMessageResponse });
      }
    });
