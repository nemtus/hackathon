import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
// import {
//   convertPublicUserYearJudgeToPublicJudge,
//   setPublicJudge,
// } from '../../../../../model/public/years/judges';
import {
  convertPublicUserYearFinalJudgeToPublicFinalJudge,
  setPublicFinalJudge,
} from '../../../../../model/public/years/final-judges';
// import { PublicUserYearJudge } from '../../../../../model/public/users/years/judges';
import { PublicUserYearFinalJudge } from '../../../../../model/public/users/years/final-judges';

const path =
  '/v/1/scopes/public/users/{userID}/years/{yearID}/finalJudges/{finalJudgeID}';

export const onUpdate = () =>
  functions()
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-finalJudge-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

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

      const beforePublicUserYearFinalJudge =
        converter<PublicUserYearFinalJudge>().fromFirestore(
          changeSnapshot.before
        );
      logger.debug({ beforePublicUserYearFinalJudge });
      if (!beforePublicUserYearFinalJudge) {
        throw Error('beforePublicUserYearFinalJudge is undefined');
      }

      const afterPublicUserYearFinalJudge =
        converter<PublicUserYearFinalJudge>().fromFirestore(
          changeSnapshot.after
        );
      logger.debug({ afterPublicUserYearFinalJudge });
      if (!afterPublicUserYearFinalJudge) {
        throw Error('afterPublicUserYearFinalJudge is undefined');
      }

      const publicFinalJudge =
        convertPublicUserYearFinalJudgeToPublicFinalJudge(
          afterPublicUserYearFinalJudge
        );
      await setPublicFinalJudge(publicFinalJudge);
    });
