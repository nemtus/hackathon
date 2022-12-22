import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import {
  convertPrivateUserYearEntryToAdminUserYearEntry,
  setAdminUserYearEntry,
} from '../../../../../model/admin/users/years/entries';
import { privateUserYearEntryConverter } from '../../../../../model/private/users/years/entries';
import {
  convertPrivateUserYearEntryToPublicUserYearEntry,
  setPublicUserYearEntry,
} from '../../../../../model/public/users/years/entries';

const path =
  '/v/1/scopes/private/users/{userID}/years/{yearID}/entries/{entryID}';

export const onCreate = () =>
  functions()
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-year-entry-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

      const privateUserYearEntry = (
        await snapshot.ref.withConverter(privateUserYearEntryConverter).get()
      ).data();
      if (!privateUserYearEntry) {
        throw Error('privateUserYearEntry is undefined');
      }
      logger.debug({ privateUser: privateUserYearEntry });

      const adminUser =
        convertPrivateUserYearEntryToAdminUserYearEntry(privateUserYearEntry);
      logger.debug({ adminUser });

      await setAdminUserYearEntry(
        context.params.userID,
        context.params.yearID,
        adminUser
      );

      const publicUser =
        convertPrivateUserYearEntryToPublicUserYearEntry(privateUserYearEntry);
      logger.debug({ publicUser });

      await setPublicUserYearEntry(
        context.params.userID,
        context.params.yearID,
        publicUser
      );
    });
