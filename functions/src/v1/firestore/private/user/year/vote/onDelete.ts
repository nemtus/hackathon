import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';

const path = '/v/1/scopes/private/users/{userID}/years/{yearID}/votes/{voteID}';

export const onDelete = () =>
  functions()
    .firestore.document(path)
    .onDelete(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-year-vote-onDelete'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });
    });
