import functions from '../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../utils/firebase/logger';
import { privateUserConverter } from '../../../model/private/users';
import {
  convertPrivateUserToPublicUser,
  setPublicUser,
} from '../../../model/public/users';

const path = '/v/1/scopes/private/users/{userID}';

export const onCreate = () =>
  functions()
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

      const privateUser = (
        await snapshot.ref.withConverter(privateUserConverter).get()
      ).data();
      if (!privateUser) {
        throw Error('privateUser is undefined');
      }
      logger.debug({ privateUser });

      const publicUser = convertPrivateUserToPublicUser(privateUser);
      logger.debug({ publicUser });
      await setPublicUser(publicUser);
    });
