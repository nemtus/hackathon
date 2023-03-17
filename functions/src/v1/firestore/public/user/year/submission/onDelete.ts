import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';

const path =
  '/v/1/scopes/public/users/{userID}/years/{yearID}/submissions/{submissionID}';

export const onDelete = () =>
  functions()
    .firestore.document(path)
    .onDelete(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-submission-onDelete'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });
    });
