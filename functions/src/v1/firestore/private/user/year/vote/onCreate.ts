import { defineSecret, defineString } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { postMessage } from '../../../../../../utils/slack/postMessage';
import { getAdminUser } from '../../../../../model/admin/users';
import { getAdminUserYearTeam } from '../../../../../model/admin/users/years/teams';
import {
  AdminUserYearVote,
  setAdminUserYearVote,
} from '../../../../../model/admin/users/years/votes';
import { getConfigHackathonYearVote } from '../../../../../model/configs/hackathon/years/vote';
import { getPrivateUserYearJudge } from '../../../../../model/private/users/years/judges';
import { privateUserYearVoteConverter } from '../../../../../model/private/users/years/votes';
import {
  PublicUserYearVote,
  setPublicUserYearVote,
} from '../../../../../model/public/users/years/votes';

const CURRENT_YEAR = process.env.CURRENT_YEAR;
const MOSAIC_ID_2023 = process.env.MOSAIC_ID_2023;
const MOSAIC_ID_2024 = process.env.MOSAIC_ID_2024;

const DEBUG_CURRENT_YEAR = defineString('CURRENT_YEAR');
const DEBUG_MOSAIC_ID_2023 = defineString('MOSAIC_ID_2023');
const DEBUG_MOSAIC_ID_2024 = defineString('MOSAIC_ID_2024');

const SLACK_BOT_USER_OAUTH_TOKEN = defineSecret('SLACK_BOT_USER_OAUTH_TOKEN');
const SLACK_NOTIFY_CHANNEL = defineSecret('SLACK_NOTIFY_CHANNEL');

const path = '/v/1/scopes/private/users/{userID}/years/{yearID}/votes/{voteID}';

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
          'v1-firestore-private-user-year-vote-onCreate'
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
      const voteId = context.params.voteID;
      logger.debug({
        userId,
        yearId,
        voteId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!voteId) {
        throw Error('voteId is undefined');
      }

      const configHackathonYearVote = await getConfigHackathonYearVote(yearId);
      if (!configHackathonYearVote) {
        throw Error('configHackathonYearVote is undefined');
      }
      logger.debug({ configHackathonYearVote });

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

      const privateUserYearVote =
        privateUserYearVoteConverter.fromFirestore(snapshot);
      if (!privateUserYearVote) {
        throw Error('privateUserYearVote is undefined');
      }
      logger.debug({ privateUserYearVote });

      // Note: Validate user
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (privateUserYearVote.userId !== userId) {
        throw Error('userId is not matched to privateUserYearVote.userId');
      }
      const adminUser = await getAdminUser(userId);
      if (!adminUser) {
        throw Error('adminUser is undefined');
      }
      logger.debug({ adminUser });

      // Note: Validate votes
      let totalPoints = 0;

      for (const vote of privateUserYearVote.votes) {
        logger.debug({ vote });
        if (vote.userId !== userId) {
          throw Error('vote.userId is not matched to userId');
        }
        const flag1 = privateUserYearVote.createdAt;
        const flag2 = privateUserYearVote.createdAt
          ? configHackathonYearVote.startAt <= privateUserYearVote.createdAt
          : false;
        const flag3 = privateUserYearVote.createdAt
          ? privateUserYearVote.createdAt <= configHackathonYearVote.endAt
          : false;
        const flag4 = vote.userId;
        const flag5 = vote.yearId === CURRENT_YEAR;
        const flag6 = vote.teamId;
        const flag7 = vote.submissionId;
        const flag8 = Number.isInteger(vote.point);
        const flag9 = vote.point >= 0;
        const flag10 = vote.point <= privateUserYearVote.votes.length * 5;
        const flag11 = totalPoints <= privateUserYearVote.votes.length * 5;
        const flag12 = typeof vote.message === 'string';
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
            privateUserYearVote.createdAt &&
            configHackathonYearVote.startAt <= privateUserYearVote.createdAt &&
            privateUserYearVote.createdAt <= configHackathonYearVote.endAt &&
            vote.userId && // Note: voting user
            vote.yearId === CURRENT_YEAR &&
            vote.teamId &&
            vote.submissionId &&
            Number.isInteger(vote.point) &&
            vote.point >= 0 &&
            vote.point <= privateUserYearVote.votes.length * 5 &&
            totalPoints <= privateUserYearVote.votes.length * 5 &&
            typeof vote.message === 'string'
          )
        ) {
          throw Error('vote is not valid');
        }
        const adminUserYearTeam = await getAdminUserYearTeam(
          vote.teamId,
          vote.yearId,
          vote.teamId
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
        totalPoints += vote.point;
      }
      logger.debug({ totalPoints });
      if (totalPoints !== privateUserYearVote.votes.length * 5) {
        throw Error('totalPoint should be 5 * votes.length');
      }
      if (totalPoints !== privateUserYearVote.totalPoints) {
        throw Error(
          'totalPoints should be equal to privateUserYearVote.totalPoints'
        );
      }

      const adminUserYearVote: AdminUserYearVote = privateUserYearVote;
      logger.debug({ adminUserYearVote });
      await setAdminUserYearVote(userId, adminUserYearVote);

      const publicUserYearVote: PublicUserYearVote = privateUserYearVote;
      logger.debug({ publicUserYearVote });
      await setPublicUserYearVote(userId, publicUserYearVote);

      const slackBotUserOAuthToken = SLACK_BOT_USER_OAUTH_TOKEN.value();
      const slackNotifyChannel = SLACK_NOTIFY_CHANNEL.value();
      const postMessageResponse = await postMessage(
        slackBotUserOAuthToken,
        JSON.stringify(publicUserYearVote, null, 2),
        `#${slackNotifyChannel}`
      );
      logger.debug({ postMessageResponse });
    });
