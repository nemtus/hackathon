import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { postMessage } from '../../../../../../utils/slack/postMessage';
import { getAdminUser } from '../../../../../model/admin/users';
// import {
//   AdminUserYearJudge,
//   setAdminUserYearJudge,
// } from '../../../../../model/admin/users/years/judges';
import {
  AdminUserYearFinalJudge,
  setAdminUserYearFinalJudge,
} from '../../../../../model/admin/users/years/final-judges';
import { getAdminUserYearTeam } from '../../../../../model/admin/users/years/teams';
import { getConfigHackathonYearJudge } from '../../../../../model/configs/hackathon/years/judge';
import { getConfigHackathonYearFinalJudge } from '../../../../../model/configs/hackathon/years/final-judge';
import { privateUserYearJudgeConverter } from '../../../../../model/private/users/years/judges';
import { privateUserYearFinalJudgeConverter } from '../../../../../model/private/users/years/final-judges';
// import {
//   PublicUserYearJudge,
//   setPublicUserYearJudge,
// } from '../../../../../model/public/users/years/judges';
import {
  PublicUserYearFinalJudge,
  setPublicUserYearFinalJudge,
} from '../../../../../model/public/users/years/final-judges';

const CURRENT_YEAR = process.env.CURRENT_YEAR;

const SLACK_BOT_USER_OAUTH_TOKEN = defineSecret('SLACK_BOT_USER_OAUTH_TOKEN');
const SLACK_NOTIFY_CHANNEL = defineSecret('SLACK_NOTIFY_CHANNEL');

const path =
  '/v/1/scopes/private/users/{userID}/years/{yearID}/finalJudges/{finalJudgeID}';

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
          'v1-firestore-private-user-year-finalJudge-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

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

      const configHackathonYearJudge = await getConfigHackathonYearJudge(
        yearId
      );
      if (!configHackathonYearJudge) {
        throw Error('configHackathonYearJudge is undefined');
      }
      const configHackathonYearFinalJudge =
        await getConfigHackathonYearFinalJudge(yearId);
      if (!configHackathonYearFinalJudge) {
        throw Error('configHackathonYearFinalJudge is undefined');
      }

      const privateUserYearJudge =
        privateUserYearJudgeConverter.fromFirestore(snapshot);
      if (!privateUserYearJudge) {
        throw Error('privateUserYearJudge is undefined');
      }
      logger.debug({ privateUserYearJudge });

      const privateUserYearFinalJudge =
        privateUserYearFinalJudgeConverter.fromFirestore(snapshot);
      if (!privateUserYearFinalJudge) {
        throw Error('privateUserYearFinalJudge is undefined');
      }
      logger.debug({ privateUserYearFinalJudge });

      // Note: Validate user
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (privateUserYearFinalJudge.userId !== userId) {
        throw Error('userId is not matched to privateUserYearJudge.userId');
      }
      const adminUser = await getAdminUser(userId);
      if (!adminUser) {
        throw Error('adminUser is undefined');
      }
      logger.debug({ adminUser });

      // Note: Validate judges
      let totalPoints = 0;

      for (const finalJudge of privateUserYearFinalJudge.judges) {
        logger.debug({ finalJudge });
        if (finalJudge.userId !== userId) {
          throw Error('finalJudge.userId is not matched to userId');
        }
        if (
          !(
            privateUserYearFinalJudge.createdAt &&
            configHackathonYearFinalJudge.startAt <=
              privateUserYearFinalJudge.createdAt &&
            privateUserYearFinalJudge.createdAt <=
              configHackathonYearFinalJudge.endAt &&
            configHackathonYearFinalJudge.users.some(
              (userId) => userId === privateUserYearFinalJudge.userId
            ) &&
            finalJudge.userId && // Note: voting user
            finalJudge.yearId === CURRENT_YEAR &&
            finalJudge.teamId &&
            finalJudge.submissionId &&
            Number.isInteger(finalJudge.point) &&
            finalJudge.point >= 0 &&
            finalJudge.point <= privateUserYearFinalJudge.judges.length * 100 &&
            totalPoints <= privateUserYearFinalJudge.judges.length * 100 &&
            typeof finalJudge.message === 'string'
          )
        ) {
          throw Error('finalJudge is not valid');
        }
        const adminUserYearTeam = await getAdminUserYearTeam(
          finalJudge.teamId,
          finalJudge.yearId,
          finalJudge.teamId
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
        totalPoints += finalJudge.point;
      }
      logger.debug({ totalPoints });
      if (totalPoints !== privateUserYearFinalJudge.judges.length * 100) {
        throw Error('totalPoint should be 100 * votes.length');
      }
      if (totalPoints !== privateUserYearJudge.totalPoints) {
        throw Error(
          'totalPoints should be equal to adminUserYearFinalJudge.totalPoints'
        );
      }

      const adminUserYearFinalJudge: AdminUserYearFinalJudge =
        privateUserYearFinalJudge;
      logger.debug({ adminUserYearFinalJudge });
      await setAdminUserYearFinalJudge(userId, adminUserYearFinalJudge);

      const publicUserYearFinalJudge: PublicUserYearFinalJudge =
        privateUserYearFinalJudge;
      logger.debug({ publicUserYearFinalJudge });
      await setPublicUserYearFinalJudge(userId, publicUserYearFinalJudge);

      const slackBotUserOAuthToken = SLACK_BOT_USER_OAUTH_TOKEN.value();
      const slackNotifyChannel = SLACK_NOTIFY_CHANNEL.value();
      const postMessageResponse = await postMessage(
        slackBotUserOAuthToken,
        JSON.stringify(publicUserYearFinalJudge, null, 2),
        `#${slackNotifyChannel}`
      );
      logger.debug({ postMessageResponse });
    });
