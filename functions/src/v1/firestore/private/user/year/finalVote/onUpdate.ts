import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
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
// import { getPrivateUserYearJudge } from '../../../../../model/private/users/years/judges';
import { getPrivateUserYearFinalJudge } from '../../../../../model/private/users/years/final-judges';
// import { PrivateUserYearVote } from '../../../../../model/private/users/years/votes';
import { PrivateUserYearFinalVote } from '../../../../../model/private/users/years/final-votes';
// import {
//   PublicUserYearVote,
//   setPublicUserYearVote,
// } from '../../../../../model/public/users/years/votes';
import {
  PublicUserYearFinalVote,
  setPublicUserYearFinalVote,
} from '../../../../../model/public/users/years/final-votes';

const CURRENT_YEAR = process.env.CURRENT_YEAR;

const SLACK_BOT_USER_OAUTH_TOKEN = defineSecret('SLACK_BOT_USER_OAUTH_TOKEN');
const SLACK_NOTIFY_CHANNEL = defineSecret('SLACK_NOTIFY_CHANNEL');

const path =
  '/v/1/scopes/private/users/{userID}/years/{yearID}/finalVotes/{finalVoteID}';

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
          'v1-firestore-private-user-year-finalVote-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

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
      const configHackathonYearFinalVote =
        await getConfigHackathonYearFinalVote(yearId);
      if (!configHackathonYearFinalVote) {
        throw Error('configHackathonYearFinalVote is undefined');
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

      const beforePrivateUserYearFinalVote =
        converter<PrivateUserYearFinalVote>().fromFirestore(
          changeSnapshot.before
        );
      logger.debug({ beforePrivateUserYearFinalVote });
      if (!beforePrivateUserYearFinalVote) {
        throw Error('beforePrivateUserYearFinalVote is undefined');
      }

      const afterPrivateUserYearFinalVote =
        converter<PrivateUserYearFinalVote>().fromFirestore(
          changeSnapshot.after
        );
      logger.debug({ afterPrivateUserYearFinalVote });
      if (!afterPrivateUserYearFinalVote) {
        throw Error('afterPrivateUserYearFinalVote is undefined');
      }

      // Note: Validate user
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (afterPrivateUserYearFinalVote.userId !== userId) {
        throw Error(
          'userId is not matched to afterPrivateUserYearFinalVote.userId'
        );
      }
      const adminUser = await getAdminUser(userId);
      if (!adminUser) {
        throw Error('adminUser is undefined');
      }
      logger.debug({ adminUser });

      // Note: Validate votes
      let totalPoints = 0;

      for (const finalVote of afterPrivateUserYearFinalVote.votes) {
        logger.debug({ finalVote });
        if (finalVote.userId !== userId) {
          throw Error('finalVote.userId is not matched to userId');
        }
        if (
          !(
            afterPrivateUserYearFinalVote.createdAt &&
            configHackathonYearFinalVote.startAt <=
              afterPrivateUserYearFinalVote.createdAt &&
            afterPrivateUserYearFinalVote.createdAt <=
              configHackathonYearFinalVote.endAt &&
            finalVote.userId && // Note: voting user
            finalVote.yearId === CURRENT_YEAR &&
            finalVote.teamId &&
            finalVote.submissionId &&
            Number.isInteger(finalVote.point) &&
            finalVote.point >= 0 &&
            finalVote.point <= afterPrivateUserYearFinalVote.votes.length * 5 &&
            totalPoints <= afterPrivateUserYearFinalVote.votes.length * 5 &&
            typeof finalVote.message === 'string'
          )
        ) {
          throw Error('vote is not valid');
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
      if (totalPoints !== afterPrivateUserYearFinalVote.votes.length * 5) {
        throw Error('totalPoint should be 5 * votes.length');
      }
      if (totalPoints !== afterPrivateUserYearFinalVote.totalPoints) {
        throw Error(
          'totalPoints should be equal to afterPrivateUserYearFinalVote.totalPoints'
        );
      }

      const adminUserYearFinalVote: AdminUserYearFinalVote =
        afterPrivateUserYearFinalVote;
      if (
        beforePrivateUserYearFinalVote.approved === false &&
        afterPrivateUserYearFinalVote.approved === true
      ) {
        adminUserYearFinalVote.approvedAt = new Date();
      }
      logger.debug({ adminUserYearFinalVote });
      await setAdminUserYearFinalVote(userId, adminUserYearFinalVote);

      const publicUserYearFinalVote: PublicUserYearFinalVote =
        afterPrivateUserYearFinalVote;
      if (
        beforePrivateUserYearFinalVote.approved === false &&
        afterPrivateUserYearFinalVote.approved === true
      ) {
        publicUserYearFinalVote.approvedAt = new Date();
      }
      logger.debug({ publicUserYearFinalVote });
      await setPublicUserYearFinalVote(userId, publicUserYearFinalVote);

      if (
        beforePrivateUserYearFinalVote.approved === true &&
        afterPrivateUserYearFinalVote.approved === false
      ) {
        const slackBotUserOAuthToken = SLACK_BOT_USER_OAUTH_TOKEN.value();
        const slackNotifyChannel = SLACK_NOTIFY_CHANNEL.value();
        const postMessageResponse = await postMessage(
          slackBotUserOAuthToken,
          JSON.stringify(publicUserYearFinalVote, null, 2),
          `#${slackNotifyChannel}`
        );
        logger.debug({ postMessageResponse });
      }
    });
