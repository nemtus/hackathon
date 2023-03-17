import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { postMessage } from '../../../../../../utils/slack/postMessage';
import { createNewEncryptedAccount } from '../../../../../../utils/symbol/account';
import {
  AdminUserYearTeam,
  setAdminUserYearTeam,
} from '../../../../../model/admin/users/years/teams';
import {
  privateUserYearTeamConverter,
  setPrivateUserYearTeam,
} from '../../../../../model/private/users/years/teams';
import {
  PublicUserYearTeam,
  setPublicUserYearTeam,
} from '../../../../../model/public/users/years/teams';

const DATA_ENCRYPTION_KEY = defineSecret('DATA_ENCRYPTION_KEY');
const SLACK_BOT_USER_OAUTH_TOKEN = defineSecret('SLACK_BOT_USER_OAUTH_TOKEN');
const SLACK_NOTIFY_CHANNEL = defineSecret('SLACK_NOTIFY_CHANNEL');

const path = '/v/1/scopes/private/users/{userID}/years/{yearID}/teams/{teamID}';

export const onCreate = () =>
  functions()
    .runWith({
      secrets: ['DATA_ENCRYPTION_KEY', 'SLACK_BOT_USER_OAUTH_TOKEN'],
    })
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-year-team-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

      const dataEncryptionKey = DATA_ENCRYPTION_KEY.value();

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

      const privateUserYearTeam =
        privateUserYearTeamConverter.fromFirestore(snapshot);
      if (!privateUserYearTeam) {
        throw Error('privateUserYearTeam is undefined');
      }
      logger.debug({ privateUserYearTeam });

      const newTeamEncryptedAccount = await createNewEncryptedAccount(
        dataEncryptionKey
      );

      const adminUserYearTeam: AdminUserYearTeam = {
        teamSaltHexString: newTeamEncryptedAccount.saltHexString,
        teamIvHexString: newTeamEncryptedAccount.ivHexString,
        teamEncryptedPrivateKey: newTeamEncryptedAccount.encryptedPrivateKey,
        teamPublicKey: newTeamEncryptedAccount.publicKey,
        teamAddress: newTeamEncryptedAccount.address,
        ...privateUserYearTeam,
      };
      logger.debug({ adminUserYearTeam });
      await setAdminUserYearTeam(userId, adminUserYearTeam);

      const publicUserYearTeam: PublicUserYearTeam = {
        teamAddress: newTeamEncryptedAccount.address,
        ...privateUserYearTeam,
      };
      logger.debug({ publicUserYearTeam });
      await setPublicUserYearTeam(userId, publicUserYearTeam);

      await setPrivateUserYearTeam(userId, {
        teamPublicKey: newTeamEncryptedAccount.publicKey,
        teamAddress: newTeamEncryptedAccount.address,
        ...privateUserYearTeam,
      });

      const slackBotUserOAuthToken = SLACK_BOT_USER_OAUTH_TOKEN.value();
      const slackNotifyChannel = SLACK_NOTIFY_CHANNEL.value();
      const postMessageResponse = await postMessage(
        slackBotUserOAuthToken,
        JSON.stringify(publicUserYearTeam, null, 2),
        `#${slackNotifyChannel}`
      );
      logger.debug({ postMessageResponse });
    });
