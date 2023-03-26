import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import {
  setPublicJudge,
  convertPublicUserYearJudgeToPublicJudge,
} from '../../../../../model/public/years/judges';
import { PublicUserYearJudge } from '../../../../../model/public/users/years/judges';

const path =
  '/v/1/scopes/public/users/{userID}/years/{yearID}/judges/{judgeID}';

export const onCreate = () =>
  functions()
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-judge-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

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

      const publicUserYearJudge =
        converter<PublicUserYearJudge>().fromFirestore(snapshot);
      if (!publicUserYearJudge) {
        throw Error('publicUserYearJudge is undefined');
      }
      logger.debug({ publicUserYearJudge });

      const publicJudge =
        convertPublicUserYearJudgeToPublicJudge(publicUserYearJudge);
      await setPublicJudge(publicJudge);
    });
