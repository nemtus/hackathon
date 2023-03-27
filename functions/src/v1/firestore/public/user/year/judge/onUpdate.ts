import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import {
  convertPublicUserYearJudgeToPublicJudge,
  setPublicJudge,
} from '../../../../../model/public/years/judges';
import { PublicUserYearJudge } from '../../../../../model/public/users/years/judges';

const path =
  '/v/1/scopes/public/users/{userID}/years/{yearID}/judges/{judgeID}';

export const onUpdate = () =>
  functions()
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-judge-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

      const userId = context.params.userID;
      const yearId = context.params.yearID;
      const judgeId = context.params.judgeID;
      logger.debug({
        userId,
        yearId,
        judgeId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!judgeId) {
        throw Error('judgeId is undefined');
      }

      const beforePublicUserYearJudge =
        converter<PublicUserYearJudge>().fromFirestore(changeSnapshot.before);
      logger.debug({ beforePublicUserYearJudge });
      if (!beforePublicUserYearJudge) {
        throw Error('beforePublicUserYearJudge is undefined');
      }

      const afterPublicUserYearJudge =
        converter<PublicUserYearJudge>().fromFirestore(changeSnapshot.after);
      logger.debug({ afterPublicUserYearJudge });
      if (!afterPublicUserYearJudge) {
        throw Error('afterPublicUserYearJudge is undefined');
      }

      const publicTeam = convertPublicUserYearJudgeToPublicJudge(
        afterPublicUserYearJudge
      );
      await setPublicJudge(publicTeam);
    });
