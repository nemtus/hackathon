import functions from '../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../utils/firebase/logger';
import { adminUserConverter } from '../../../model/admin/users';
import {
  convertAdminUserToPrivateUser,
  setPrivateUser,
} from '../../../model/private/users';

const path = '/v/1/scopes/admin/users/{userID}';

export const onCreate = () =>
  functions()
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-admin-user-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

      const adminUser = (
        await snapshot.ref.withConverter(adminUserConverter).get()
      ).data();
      if (!adminUser) {
        throw Error('adminUser is undefined');
      }
      logger.debug({ adminUser });

      const privateUser = convertAdminUserToPrivateUser(adminUser);
      logger.debug({ privateUser });
      await setPrivateUser(privateUser);
    });
