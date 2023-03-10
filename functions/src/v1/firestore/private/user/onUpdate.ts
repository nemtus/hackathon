import functions from '../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../utils/firebase/logger';
import { privateUserConverter } from '../../../model/private/users';
import {
  convertPrivateUserToPublicUser,
  PublicUser,
  setPublicUser,
} from '../../../model/public/users';

const path = '/v/1/scopes/admin/users/{userID}';

export const onUpdate = () =>
  functions()
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

      const before = (
        await changeSnapshot.before.ref
          .withConverter(privateUserConverter)
          .get()
      ).data();
      logger.debug({ before });

      const after = (
        await changeSnapshot.after.ref.withConverter(privateUserConverter).get()
      ).data();
      logger.debug({ after });

      if (!after) {
        throw Error('after is undefined');
      }

      const publicUser: PublicUser = convertPrivateUserToPublicUser(after);
      logger.debug({ publicUser });
      await setPublicUser(publicUser);
    });
