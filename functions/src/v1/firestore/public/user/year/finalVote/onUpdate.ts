import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
// import {
//   convertPublicUserYearVoteToPublicVote,
//   setPublicVote,
// } from '../../../../../model/public/years/votes';
import {
  convertPublicUserYearFinalVoteToPublicFinalVote,
  setPublicFinalVote,
} from '../../../../../model/public/years/final-votes';
// import { PublicUserYearVote } from '../../../../../model/public/users/years/votes';
import { PublicUserYearFinalVote } from '../../../../../model/public/users/years/final-votes';

const path =
  '/v/1/scopes/public/users/{userID}/years/{yearID}/finalVotes/{finalVoteID}';

export const onUpdate = () =>
  functions()
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-finalVote-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

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

      const beforePublicUserYearFinalVote =
        converter<PublicUserYearFinalVote>().fromFirestore(
          changeSnapshot.before
        );
      logger.debug({ beforePublicUserYearFinalVote });
      if (!beforePublicUserYearFinalVote) {
        throw Error('beforePublicUserYearFinalVote is undefined');
      }

      const afterPublicUserYearFinalVote =
        converter<PublicUserYearFinalVote>().fromFirestore(
          changeSnapshot.after
        );
      logger.debug({ afterPublicUserYearFinalVote });
      if (!afterPublicUserYearFinalVote) {
        throw Error('afterPublicUserYearFinalVote is undefined');
      }

      const publicFinalVote = convertPublicUserYearFinalVoteToPublicFinalVote(
        afterPublicUserYearFinalVote
      );
      await setPublicFinalVote(publicFinalVote);
    });
