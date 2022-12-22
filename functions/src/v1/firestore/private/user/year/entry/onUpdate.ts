import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';

const path =
  '/v/1/scopes/private/users/{userID}/years/{yearID}/entries/{entryID}';

export const onUpdate = () =>
  functions()
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-year-entry-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });
    });
