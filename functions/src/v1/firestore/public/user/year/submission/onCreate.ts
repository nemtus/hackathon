import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import {
  setPublicSubmission,
  convertPublicUserYearSubmissionToPublicSubmission,
} from '../../../../../model/public/years/submissions';
import { PublicUserYearSubmission } from '../../../../../model/public/users/years/submissions';

const path =
  '/v/1/scopes/public/users/{userID}/years/{yearID}/submissions/{submissionID}';

export const onCreate = () =>
  functions()
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-submission-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

      const userId = context.params.userID;
      const yearId = context.params.yearID;
      const submissionId = context.params.submissionID;
      logger.debug({
        userId,
        yearId,
        submissionId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!submissionId) {
        throw Error('submissionId is undefined');
      }

      const publicUserYearSubmission =
        converter<PublicUserYearSubmission>().fromFirestore(snapshot);
      if (!publicUserYearSubmission) {
        throw Error('publicUserYearSubmission is undefined');
      }
      logger.debug({ publicUserYearSubmission });

      const publicSubmission =
        convertPublicUserYearSubmissionToPublicSubmission(
          userId,
          publicUserYearSubmission
        );
      await setPublicSubmission(publicSubmission);
    });
