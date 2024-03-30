import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
// import {
//   setPublicJudge,
//   convertPublicUserYearJudgeToPublicJudge,
// } from '../../../../../model/public/years/judges';
import {
  setPublicFinalJudge,
  convertPublicUserYearFinalJudgeToPublicFinalJudge,
} from '../../../../../model/public/years/final-judges';
// import { PublicUserYearJudge } from '../../../../../model/public/users/years/judges';
import { PublicUserYearFinalJudge } from '../../../../../model/public/users/years/final-judges';

const path =
  '/v/1/scopes/public/users/{userID}/years/{yearID}/finalJudges/{finalJudgeID}';

export const onCreate = () =>
  functions()
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-finalJudge-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

      const userId = context.params.userID;
      const yearId = context.params.yearID;
      const finalJudgeId = context.params.finalJudgeID;
      logger.debug({
        userId,
        yearId,
        finalJudgeId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!finalJudgeId) {
        throw Error('finalJudgeId is undefined');
      }

      const publicUserYearFinalJudge =
        converter<PublicUserYearFinalJudge>().fromFirestore(snapshot);
      if (!publicUserYearFinalJudge) {
        throw Error('publicUserYearFinalJudge is undefined');
      }
      logger.debug({ publicUserYearFinalJudge });

      const publicFinalJudge =
        convertPublicUserYearFinalJudgeToPublicFinalJudge(
          publicUserYearFinalJudge
        );
      await setPublicFinalJudge(publicFinalJudge);
    });
