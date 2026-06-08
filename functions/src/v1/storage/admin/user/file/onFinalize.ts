import functions from '../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../utils/firebase/logger';

export const onFinalize = () =>
  functions()
    .storage.object()
    .onFinalize(async (object, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-storage-admin-user-file-onFinalize',
        )
      ) {
        return;
      }
      logger.debug({ object, context });
    });
