import functions from '../../../../../../utils/firebase/baseFunction';
import { converter } from '../../../../../../utils/firebase/converter';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import {
  setPublicTeam,
  convertPublicUserYearTeamToPublicTeam,
} from '../../../../../model/public/years/teams';
import { PublicUserYearTeam } from '../../../../../model/public/users/years/teams';

const path = '/v/1/scopes/public/users/{userID}/years/{yearID}/teams/{teamID}';

export const onCreate = () =>
  functions()
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-public-user-year-team-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

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

      const publicUserYearTeam =
        converter<PublicUserYearTeam>().fromFirestore(snapshot);
      if (!publicUserYearTeam) {
        throw Error('publicUserYearTeam is undefined');
      }
      logger.debug({ publicUserYearTeam });

      const publicTeam = convertPublicUserYearTeamToPublicTeam(
        userId,
        publicUserYearTeam
      );
      await setPublicTeam(publicTeam);
    });
