import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
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
import { PrivateUserYearVote } from '../../../../../model/private/users/years/votes';
import {
  PublicUserYearVote,
  setPublicUserYearVote,
} from '../../../../../model/public/users/years/votes';

const SLACK_BOT_USER_OAUTH_TOKEN = defineSecret('SLACK_BOT_USER_OAUTH_TOKEN');
const SLACK_NOTIFY_CHANNEL = defineSecret('SLACK_NOTIFY_CHANNEL');

const path = '/v/1/scopes/private/users/{userID}/years/{yearID}/votes/{voteID}';

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
          'v1-firestore-private-user-year-vote-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

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

      const beforePrivateUserYearVote =
        converter<PrivateUserYearVote>().fromFirestore(changeSnapshot.before);
      logger.debug({ beforePrivateUserYearVote });
      if (!beforePrivateUserYearVote) {
        throw Error('beforePrivateUserYearVote is undefined');
      }

      const afterPrivateUserYearVote =
        converter<PrivateUserYearVote>().fromFirestore(changeSnapshot.after);
      logger.debug({ afterPrivateUserYearVote });
      if (!afterPrivateUserYearVote) {
        throw Error('afterPrivateUserYearVote is undefined');
      }

      // Note: Validate user
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (afterPrivateUserYearVote.userId !== userId) {
        throw Error('userId is not matched to afterPrivateUserYearVote.userId');
      }
      const adminUser = await getAdminUser(userId);
      if (!adminUser) {
        throw Error('adminUser is undefined');
      }
      logger.debug({ adminUser });

      // Note: Validate votes
      let totalPoints = 0;

      for (const vote of afterPrivateUserYearVote.votes) {
        logger.debug({ vote });
        if (vote.userId !== userId) {
          throw Error('vote.userId is not matched to userId');
        }
        if (
          !(
            afterPrivateUserYearVote.createdAt &&
            configHackathonYearVote.startAt <=
              afterPrivateUserYearVote.createdAt &&
            afterPrivateUserYearVote.createdAt <=
              configHackathonYearVote.endAt &&
            vote.userId && // Note: voting user
            vote.yearId === '2023' && // Todo: convert to env
            vote.teamId &&
            vote.submissionId &&
            Number.isInteger(vote.point) &&
            vote.point >= 0 &&
            vote.point <= afterPrivateUserYearVote.votes.length * 5 &&
            totalPoints <= afterPrivateUserYearVote.votes.length * 5 &&
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
      if (totalPoints !== afterPrivateUserYearVote.votes.length * 5) {
        throw Error('totalPoint should be 5 * votes.length');
      }
      if (totalPoints !== afterPrivateUserYearVote.totalPoints) {
        throw Error(
          'totalPoints should be equal to afterPrivateUserYearVote.totalPoints'
        );
      }

      const adminUserYearVote: AdminUserYearVote = afterPrivateUserYearVote;
      if (
        beforePrivateUserYearVote.approved === false &&
        afterPrivateUserYearVote.approved === true
      ) {
        adminUserYearVote.approvedAt = new Date();
      }
      logger.debug({ adminUserYearVote });
      await setAdminUserYearVote(userId, adminUserYearVote);

      const publicUserYearVote: PublicUserYearVote = afterPrivateUserYearVote;
      if (
        beforePrivateUserYearVote.approved === false &&
        afterPrivateUserYearVote.approved === true
      ) {
        publicUserYearVote.approvedAt = new Date();
      }
      logger.debug({ publicUserYearVote });
      await setPublicUserYearVote(userId, publicUserYearVote);

      if (
        beforePrivateUserYearVote.approved === true &&
        afterPrivateUserYearVote.approved === false
      ) {
        const slackBotUserOAuthToken = SLACK_BOT_USER_OAUTH_TOKEN.value();
        const slackNotifyChannel = SLACK_NOTIFY_CHANNEL.value();
        const postMessageResponse = await postMessage(
          slackBotUserOAuthToken,
          JSON.stringify(publicUserYearVote, null, 2),
          `#${slackNotifyChannel}`
        );
        logger.debug({ postMessageResponse });
      }
    });
