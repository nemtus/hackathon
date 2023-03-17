import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import {
  convertPublicUserYearTeamToPublicTeam,
  setPublicTeam,
} from '../../../../../model/public/years/teams';
import { PublicUserYearTeam } from '../../../../../model/public/users/years/teams';

const path = '/v/1/scopes/public/users/{userID}/years/{yearID}/teams/{teamID}';

export const onUpdate = () =>
  functions()
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-team-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

      const userId = context.params.userID;
      const yearId = context.params.yearID;
      const teamId = context.params.teamID;
      logger.debug({
        userId,
        yearId,
        teamId,
      });
      if (!userId) {
        throw Error('userId is undefined');
      }
      if (!yearId) {
        throw Error('yearId is undefined');
      }
      if (!teamId) {
        throw Error('teamId is undefined');
      }

      const beforePublicUserYearTeam =
        converter<PublicUserYearTeam>().fromFirestore(changeSnapshot.before);
      logger.debug({ beforePublicUserYearTeam });
      if (!beforePublicUserYearTeam) {
        throw Error('beforePublicUserYearTeam is undefined');
      }

      const afterPublicUserYearTeam =
        converter<PublicUserYearTeam>().fromFirestore(changeSnapshot.after);
      logger.debug({ afterPublicUserYearTeam });
      if (!afterPublicUserYearTeam) {
        throw Error('afterPublicUserYearTeam is undefined');
      }

      const publicTeam = convertPublicUserYearTeamToPublicTeam(
        userId,
        afterPublicUserYearTeam
      );
      await setPublicTeam(publicTeam);
    });
