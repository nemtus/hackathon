import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import {
  setPublicVote,
  convertPublicUserYearVoteToPublicVote,
} from '../../../../../model/public/years/votes';
import { PublicUserYearVote } from '../../../../../model/public/users/years/votes';

const path = '/v/1/scopes/public/users/{userID}/years/{yearID}/votes/{voteID}';

export const onCreate = () =>
  functions()
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-vote-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

      const userId = context.params.userID;
      const yearId = context.params.yearID;
      const voteId = context.params.voteID;
      logger.debug({
        userId,
        yearId,
        voteId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!voteId) {
        throw Error('voteId is undefined');
      }

      const publicUserYearVote =
        converter<PublicUserYearVote>().fromFirestore(snapshot);
      if (!publicUserYearVote) {
        throw Error('publicUserYearVote is undefined');
      }
      logger.debug({ publicUserYearVote });

      const publicVote =
        convertPublicUserYearVoteToPublicVote(publicUserYearVote);
      await setPublicVote(publicVote);
    });
