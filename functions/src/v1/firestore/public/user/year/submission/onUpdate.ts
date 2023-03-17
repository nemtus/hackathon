import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import {
  convertPublicUserYearSubmissionToPublicSubmission,
  setPublicSubmission,
} from '../../../../../model/public/years/submissions';
import { PublicUserYearSubmission } from '../../../../../model/public/users/years/submissions';

const path =
  '/v/1/scopes/public/users/{userID}/years/{yearID}/submissions/{submissionID}';

export const onUpdate = () =>
  functions()
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-submission-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

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

      const beforePublicUserYearSubmission =
        converter<PublicUserYearSubmission>().fromFirestore(
          changeSnapshot.before
        );
      logger.debug({ beforePublicUserYearSubmission });
      if (!beforePublicUserYearSubmission) {
        throw Error('beforePublicUserYearSubmission is undefined');
      }

      const afterPublicUserYearSubmission =
        converter<PublicUserYearSubmission>().fromFirestore(
          changeSnapshot.after
        );
      logger.debug({ afterPublicUserYearSubmission });
      if (!afterPublicUserYearSubmission) {
        throw Error('afterPublicUserYearSubmission is undefined');
      }

      const publicTeam = convertPublicUserYearSubmissionToPublicSubmission(
        userId,
        afterPublicUserYearSubmission
      );
      await setPublicSubmission(publicTeam);
    });
