import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import {
  convertPublicUserYearVoteToPublicVote,
  setPublicVote,
} from '../../../../../model/public/years/votes';
import { PublicUserYearVote } from '../../../../../model/public/users/years/votes';

const path = '/v/1/scopes/public/users/{userID}/years/{yearID}/votes/{voteID}';

export const onUpdate = () =>
  functions()
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-vote-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

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

      const beforePublicUserYearVote =
        converter<PublicUserYearVote>().fromFirestore(changeSnapshot.before);
      logger.debug({ beforePublicUserYearVote });
      if (!beforePublicUserYearVote) {
        throw Error('beforePublicUserYearVote is undefined');
      }

      const afterPublicUserYearVote =
        converter<PublicUserYearVote>().fromFirestore(changeSnapshot.after);
      logger.debug({ afterPublicUserYearVote });
      if (!afterPublicUserYearVote) {
        throw Error('afterPublicUserYearVote is undefined');
      }

      const publicTeam = convertPublicUserYearVoteToPublicVote(
        afterPublicUserYearVote
      );
      await setPublicVote(publicTeam);
    });
