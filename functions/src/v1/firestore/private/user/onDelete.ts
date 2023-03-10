import functions from '../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../utils/firebase/logger';

const path = '/v/1/scopes/admin/users/{userID}';

export const onDelete = () =>
  functions()
    .firestore.document(path)
    .onDelete(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-onDelete'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });
    });
