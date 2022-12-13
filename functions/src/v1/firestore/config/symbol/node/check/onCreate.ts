import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';

const path = '/v/1/configs/symbol/nodes/{nodeID}/checks/{checkID}';

export const onCreate = () =>
  functions()
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-config-symbol-node-check-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });
    });
