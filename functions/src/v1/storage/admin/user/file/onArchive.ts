import functions from '../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../utils/firebase/logger';

export const onArchive = () =>
  functions()
    .storage.object()
    .onArchive(async (object, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-storage-admin-user-file-onArchive',
        )
      ) {
        return;
      }
      logger.debug({ object, context });
    });
