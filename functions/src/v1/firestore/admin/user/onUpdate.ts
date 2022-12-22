import functions from '../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../utils/firebase/logger';
import { adminUserConverter } from '../../../model/admin/users';
import {
  convertAdminUserToPrivateUser,
  PrivateUser,
  setPrivateUser,
} from '../../../model/private/users';

const path = '/v/1/scopes/admin/users/{userID}';

export const onUpdate = () =>
  functions()
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-admin-user-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

      const before = (
        await changeSnapshot.before.ref.withConverter(adminUserConverter).get()
      ).data();
      logger.debug({ before });

      const after = (
        await changeSnapshot.after.ref.withConverter(adminUserConverter).get()
      ).data();
      logger.debug({ after });

      if (!after) {
        throw Error('after is undefined');
      }

      const privateUser: PrivateUser = convertAdminUserToPrivateUser(after);
      logger.debug({ privateUser });
      await setPrivateUser(privateUser);
    });
