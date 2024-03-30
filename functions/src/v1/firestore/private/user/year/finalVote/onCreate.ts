import { defineSecret, defineString } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { postMessage } from '../../../../../../utils/slack/postMessage';
import { getAdminUser } from '../../../../../model/admin/users';
import { getAdminUserYearTeam } from '../../../../../model/admin/users/years/teams';
// import {
//   AdminUserYearVote,
//   setAdminUserYearVote,
// } from '../../../../../model/admin/users/years/votes';
import {
  AdminUserYearFinalVote,
  setAdminUserYearFinalVote,
} from '../../../../../model/admin/users/years/final-votes';
import { getConfigHackathonYearVote } from '../../../../../model/configs/hackathon/years/vote';
import { getConfigHackathonYearFinalVote } from '../../../../../model/configs/hackathon/years/final-vote';
import { getPrivateUserYearJudge } from '../../../../../model/private/users/years/judges';
import { getPrivateUserYearFinalJudge } from '../../../../../model/private/users/years/final-judges';
// import { privateUserYearVoteConverter } from '../../../../../model/private/users/years/votes';
import { privateUserYearFinalVoteConverter } from '../../../../../model/private/users/years/final-votes';
// import {
//   PublicUserYearVote,
//   setPublicUserYearVote,
// } from '../../../../../model/public/users/years/votes';
import {
  PublicUserYearFinalVote,
  setPublicUserYearFinalVote,
} from '../../../../../model/public/users/years/final-votes';

const CURRENT_YEAR = process.env.CURRENT_YEAR;
const MOSAIC_ID_2023 = process.env.MOSAIC_ID_2023;
const MOSAIC_ID_2024 = process.env.MOSAIC_ID_2024;

const DEBUG_CURRENT_YEAR = defineString('CURRENT_YEAR');
const DEBUG_MOSAIC_ID_2023 = defineString('MOSAIC_ID_2023');
const DEBUG_MOSAIC_ID_2024 = defineString('MOSAIC_ID_2024');

const SLACK_BOT_USER_OAUTH_TOKEN = defineSecret('SLACK_BOT_USER_OAUTH_TOKEN');
const SLACK_NOTIFY_CHANNEL = defineSecret('SLACK_NOTIFY_CHANNEL');

const path =
  '/v/1/scopes/private/users/{userID}/years/{yearID}/finalVotes/{finalVoteID}';

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
          'v1-firestore-private-user-year-finalVote-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

      logger.debug(DEBUG_CURRENT_YEAR.value());
      logger.debug(DEBUG_MOSAIC_ID_2023.value());
      logger.debug(DEBUG_MOSAIC_ID_2024.value());

      logger.debug({
        DEBUG_CURRENT_YEAR: DEBUG_CURRENT_YEAR.value(),
        DEBUG_MOSAIC_ID_2023: DEBUG_MOSAIC_ID_2023.value(),
        DEBUG_MOSAIC_ID_2024: DEBUG_MOSAIC_ID_2024.value(),
      });

      logger.debug(CURRENT_YEAR);
      logger.debug(MOSAIC_ID_2023);
      logger.debug(MOSAIC_ID_2024);

      logger.debug({
        CURRENT_YEAR: CURRENT_YEAR,
        MOSAIC_ID_2023: MOSAIC_ID_2023,
        MOSAIC_ID_2024: MOSAIC_ID_2024,
      });

      const userId = context.params.userID;
      const yearId = context.params.yearID;
      const finalVoteId = context.params.finalVoteID;
      logger.debug({
        userId,
        yearId,
        finalVoteId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!finalVoteId) {
        throw Error('finalVoteId is undefined');
      }

      const configHackathonYearVote = await getConfigHackathonYearVote(yearId);
      if (!configHackathonYearVote) {
        throw Error('configHackathonYearVote is undefined');
      }
      logger.debug({ configHackathonYearVote });
      const configHackathonYearFinalVote =
        await getConfigHackathonYearFinalVote(yearId);
      if (!configHackathonYearFinalVote) {
        throw Error('configHackathonYearFinalVote is undefined');
      }
      logger.debug({ configHackathonYearFinalVote });

      const privateUserYearJudge = await getPrivateUserYearJudge(
        userId,
        yearId,
        userId
      );
      if (privateUserYearJudge) {
        throw Error(
          'privateUserYearJudge should be undefined. Judge cannot vote'
        );
      }
      const privateUserYearFinalJudge = await getPrivateUserYearFinalJudge(
        userId,
        yearId,
        userId
      );
      if (privateUserYearFinalJudge) {
        throw Error(
          'privateUserYearFinalJudge should be undefined. Judge cannot vote'
        );
      }

      const privateUserYearFinalVote =
        privateUserYearFinalVoteConverter.fromFirestore(snapshot);
      if (!privateUserYearFinalVote) {
        throw Error('privateUserYearFinalVote is undefined');
      }
      logger.debug({ privateUserYearFinalVote });

      // Note: Validate user
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (privateUserYearFinalVote.userId !== userId) {
        throw Error('userId is not matched to privateUserYearFinalVote.userId');
      }
      const adminUser = await getAdminUser(userId);
      if (!adminUser) {
        throw Error('adminUser is undefined');
      }
      logger.debug({ adminUser });

      // Note: Validate votes
      let totalPoints = 0;

      for (const finalVote of privateUserYearFinalVote.votes) {
        logger.debug({ finalVote });
        if (finalVote.userId !== userId) {
          throw Error('vote.userId is not matched to userId');
        }
        const flag1 = privateUserYearFinalVote.createdAt;
        const flag2 = privateUserYearFinalVote.createdAt
          ? configHackathonYearFinalVote.startAt <=
            privateUserYearFinalVote.createdAt
          : false;
        const flag3 = privateUserYearFinalVote.createdAt
          ? privateUserYearFinalVote.createdAt <=
            configHackathonYearFinalVote.endAt
          : false;
        const flag4 = finalVote.userId;
        const flag5 = finalVote.yearId === CURRENT_YEAR;
        const flag6 = finalVote.teamId;
        const flag7 = finalVote.submissionId;
        const flag8 = Number.isInteger(finalVote.point);
        const flag9 = finalVote.point >= 0;
        const flag10 =
          finalVote.point <= privateUserYearFinalVote.votes.length * 5;
        const flag11 = totalPoints <= privateUserYearFinalVote.votes.length * 5;
        const flag12 = typeof finalVote.message === 'string';
        logger.debug({
          flag1,
          flag2,
          flag3,
          flag4,
          flag5,
          flag6,
          flag7,
          flag8,
          flag9,
          flag10,
          flag11,
          flag12,
        });

        if (
          !(
            privateUserYearFinalVote.createdAt &&
            configHackathonYearFinalVote.startAt <=
              privateUserYearFinalVote.createdAt &&
            privateUserYearFinalVote.createdAt <=
              configHackathonYearFinalVote.endAt &&
            finalVote.userId && // Note: voting user
            finalVote.yearId === CURRENT_YEAR &&
            finalVote.teamId &&
            finalVote.submissionId &&
            Number.isInteger(finalVote.point) &&
            finalVote.point >= 0 &&
            finalVote.point <= privateUserYearFinalVote.votes.length * 5 &&
            totalPoints <= privateUserYearFinalVote.votes.length * 5 &&
            typeof finalVote.message === 'string'
          )
        ) {
          throw Error('finalVote is not valid');
        }
        const adminUserYearTeam = await getAdminUserYearTeam(
          finalVote.teamId,
          finalVote.yearId,
          finalVote.teamId
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
        totalPoints += finalVote.point;
      }
      logger.debug({ totalPoints });
      if (totalPoints !== privateUserYearFinalVote.votes.length * 5) {
        throw Error('totalPoint should be 5 * votes.length');
      }
      if (totalPoints !== privateUserYearFinalVote.totalPoints) {
        throw Error(
          'totalPoints should be equal to privateUserYearVote.totalPoints'
        );
      }

      const adminUserYearFinalVote: AdminUserYearFinalVote =
        privateUserYearFinalVote;
      logger.debug({ adminUserYearFinalVote });
      await setAdminUserYearFinalVote(userId, adminUserYearFinalVote);

      const publicUserYearFinalVote: PublicUserYearFinalVote =
        privateUserYearFinalVote;
      logger.debug({ publicUserYearFinalVote });
      await setPublicUserYearFinalVote(userId, publicUserYearFinalVote);

      const slackBotUserOAuthToken = SLACK_BOT_USER_OAUTH_TOKEN.value();
      const slackNotifyChannel = SLACK_NOTIFY_CHANNEL.value();
      const postMessageResponse = await postMessage(
        slackBotUserOAuthToken,
        JSON.stringify(publicUserYearFinalVote, null, 2),
        `#${slackNotifyChannel}`
      );
      logger.debug({ postMessageResponse });
    });
