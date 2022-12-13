import functions from '../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../utils/firebase/logger';
import { AdminUser, setAdminUser } from '../model/admin/users';

export const onCreate = () =>
  functions()
    .auth.user()
    .onCreate(async (userRecord, context) => {
      if (await hasAlreadyTriggered(context.eventId, 'v1-auth-onCreate')) {
        return;
      }
      logger.debug({
        userRecord,
        context,
      });
      const adminUser: AdminUser = {
        id: userRecord.uid,
        displayName: undefined,
        photoUrl: undefined,
        twitterId: undefined,
        githubId: undefined,
        createdAt: new Date(),
        entryAt: null,
        submitAt: null,
        voteAt: null,
      };
      logger.debug({ adminUser });
      await setAdminUser(adminUser);
    });
