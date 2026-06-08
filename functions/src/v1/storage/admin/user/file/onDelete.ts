import functions from '../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../utils/firebase/logger';

export const onDelete = () =>
  functions()
    .storage.object()
    .onDelete(async (object, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-storage-admin-user-file-onDelete',
        )
      ) {
        return;
      }
      logger.debug({ object, context });
    });
