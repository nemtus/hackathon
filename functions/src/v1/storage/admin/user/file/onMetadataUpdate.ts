import functions from '../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../utils/firebase/logger';

export const onMetadataUpdate = () =>
  functions()
    .storage.object()
    .onMetadataUpdate(async (object, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-storage-admin-user-file-onMetadataUpdate',
        )
      ) {
        return;
      }
      logger.debug({ object, context });
    });
