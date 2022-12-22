import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';

const path =
  '/v/1/scopes/admin/users/{userID}/years/{yearID}/entries/{entryID}';

export const onDelete = () =>
  functions()
    .firestore.document(path)
    .onDelete(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-admin-user-year-entry-onDelete'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });
    });
