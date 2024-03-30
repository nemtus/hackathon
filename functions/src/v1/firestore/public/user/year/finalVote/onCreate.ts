import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
// import {
//   setPublicVote,
//   convertPublicUserYearVoteToPublicVote,
// } from '../../../../../model/public/years/votes';
import {
  setPublicFinalVote,
  convertPublicUserYearFinalVoteToPublicFinalVote,
} from '../../../../../model/public/years/final-votes';
// import { PublicUserYearVote } from '../../../../../model/public/users/years/votes';
import { PublicUserYearFinalVote } from '../../../../../model/public/users/years/final-votes';

const path =
  '/v/1/scopes/public/users/{userID}/years/{yearID}/finalVotes/{finalVoteID}';

export const onCreate = () =>
  functions()
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-finalVote-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

      const userId = context.params.userID;
      const yearId = context.params.yearID;
      const finalVoteId = context.params.finalVoteID;
      logger.debug({
        userId,
        yearId,
        finalVoteId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!finalVoteId) {
        throw Error('finalVoteId is undefined');
      }

      const publicUserYearFinalVote =
        converter<PublicUserYearFinalVote>().fromFirestore(snapshot);
      if (!publicUserYearFinalVote) {
        throw Error('publicUserYearFinalVote is undefined');
      }
      logger.debug({ publicUserYearFinalVote });

      const publicFinalVote = convertPublicUserYearFinalVoteToPublicFinalVote(
        publicUserYearFinalVote
      );
      await setPublicFinalVote(publicFinalVote);
    });
