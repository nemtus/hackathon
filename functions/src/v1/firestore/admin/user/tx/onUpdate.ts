import functions from '../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../utils/firebase/logger';
import { adminUserTxConverter } from '../../../../model/admin/users/txs';
import {
  convertAdminUserTxToPrivateUserTx,
  PrivateUserTx,
  setPrivateUserTx,
} from '../../../../model/private/users/txs';

const path = '/v/1/scopes/admin/users/{userID}/txs/{txID}';

export const onUpdate = () =>
  functions()
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-admin-user-tx-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

      const before = (
        await changeSnapshot.before.ref
          .withConverter(adminUserTxConverter)
          .get()
      ).data();
      logger.debug({ before });

      const after = (
        await changeSnapshot.after.ref.withConverter(adminUserTxConverter).get()
      ).data();
      logger.debug({ after });

      if (!after) {
        throw Error('after is undefined');
      }

      const privateUserTx: PrivateUserTx =
        convertAdminUserTxToPrivateUserTx(after);
      logger.debug({ privateUserTx });
      await setPrivateUserTx(context.params.userID, privateUserTx);
    });
