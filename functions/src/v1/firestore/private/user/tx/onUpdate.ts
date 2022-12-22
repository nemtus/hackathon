import functions from '../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../utils/firebase/logger';
import { privateUserTxConverter } from '../../../../model/private/users/txs';
import {
  convertPrivateUserTxToPublicUserTx,
  PublicUserTx,
  setPublicUserTx,
} from '../../../../model/public/users/txs';

const path = '/v/1/scopes/private/users/{userID}/txs/{txID}';

export const onUpdate = () =>
  functions()
    .firestore.document(path)
    .onUpdate(async (changeSnapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-tx-onUpdate'
        )
      ) {
        return;
      }
      logger.debug({ changeSnapshot, context });

      const before = (
        await changeSnapshot.before.ref
          .withConverter(privateUserTxConverter)
          .get()
      ).data();
      logger.debug({ before });

      const after = (
        await changeSnapshot.after.ref
          .withConverter(privateUserTxConverter)
          .get()
      ).data();
      logger.debug({ after });

      if (!after) {
        throw Error('after is undefined');
      }

      const publicUserTx: PublicUserTx =
        convertPrivateUserTxToPublicUserTx(after);
      logger.debug({ publicUserTx });
      await setPublicUserTx(context.params.userID, publicUserTx);
    });
