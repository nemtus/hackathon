import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { postMessage } from '../../../../../../utils/slack/postMessage';
import { getAdminUser } from '../../../../../model/admin/users';
import {
  AdminUserYearJudge,
  setAdminUserYearJudge,
} from '../../../../../model/admin/users/years/judges';
import { getAdminUserYearTeam } from '../../../../../model/admin/users/years/teams';
import { privateUserYearJudgeConverter } from '../../../../../model/private/users/years/judges';
import {
  PublicUserYearJudge,
  setPublicUserYearJudge,
} from '../../../../../model/public/users/years/judges';

const SLACK_BOT_USER_OAUTH_TOKEN = defineSecret('SLACK_BOT_USER_OAUTH_TOKEN');
const SLACK_NOTIFY_CHANNEL = defineSecret('SLACK_NOTIFY_CHANNEL');

const path =
  '/v/1/scopes/private/users/{userID}/years/{yearID}/judges/{judgeID}';

export const onCreate = () =>
  functions()
    .runWith({
      secrets: [
        'DATA_ENCRYPTION_KEY',
        'SLACK_BOT_USER_OAUTH_TOKEN',
        'SLACK_NOTIFY_CHANNEL',
      ],
    })
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-year-judge-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

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

      const privateUserYearJudge =
        privateUserYearJudgeConverter.fromFirestore(snapshot);
      if (!privateUserYearJudge) {
        throw Error('privateUserYearJudge is undefined');
      }
      logger.debug({ privateUserYearJudge });

      // Note: Validate user
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (privateUserYearJudge.userId !== userId) {
        throw Error('userId is not matched to privateUserYearJudge.userId');
      }
      const adminUser = await getAdminUser(userId);
      if (!adminUser) {
        throw Error('adminUser is undefined');
      }
      logger.debug({ adminUser });

      // Note: Validate judges
      let totalPoints = 0;

      for (const judge of privateUserYearJudge.judges) {
        logger.debug({ judge });
        if (judge.userId !== userId) {
          throw Error('judge.userId is not matched to userId');
        }
        if (
          !(
            privateUserYearJudge.isDraft === false && // Note: should not be draft
            judge.userId && // Note: voting user
            judge.yearId === '2023' && // Todo: convert to env
            judge.teamId &&
            judge.submissionId &&
            Number.isInteger(judge.point) &&
            judge.point >= 0 &&
            judge.point <= privateUserYearJudge.judges.length * 5 &&
            totalPoints <= privateUserYearJudge.judges.length * 5 &&
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
      if (totalPoints !== privateUserYearJudge.judges.length * 100) {
        throw Error('totalPoint should be 100 * votes.length');
      }
      if (totalPoints !== privateUserYearJudge.totalPoints) {
        throw Error(
          'totalPoints should be equal to adminUserYearJudge.totalPoints'
        );
      }

      const adminUserYearJudge: AdminUserYearJudge = privateUserYearJudge;
      logger.debug({ adminUserYearJudge });
      await setAdminUserYearJudge(userId, adminUserYearJudge);

      const publicUserYearJudge: PublicUserYearJudge = privateUserYearJudge;
      logger.debug({ publicUserYearJudge });
      await setPublicUserYearJudge(userId, publicUserYearJudge);

      const slackBotUserOAuthToken = SLACK_BOT_USER_OAUTH_TOKEN.value();
      const slackNotifyChannel = SLACK_NOTIFY_CHANNEL.value();
      const postMessageResponse = await postMessage(
        slackBotUserOAuthToken,
        JSON.stringify(publicUserYearJudge, null, 2),
        `#${slackNotifyChannel}`
      );
      logger.debug({ postMessageResponse });
    });
