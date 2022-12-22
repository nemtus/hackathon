import functions from '../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../utils/firebase/logger';
import { privateUserTxConverter } from '../../../../model/private/users/txs';
import {
  convertPrivateUserTxToPublicUserTx,
  setPublicUserTx,
} from '../../../../model/public/users/txs';

const path = '/v/1/scopes/private/users/{userID}/txs/{txID}';

export const onCreate = () =>
  functions()
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-private-user-tx-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

      const privateUserTx = (
        await snapshot.ref.withConverter(privateUserTxConverter).get()
      ).data();
      if (!privateUserTx) {
        throw Error('privateUserTx is undefined');
      }
      logger.debug({ privateUserTx });

      const publicUserTx = convertPrivateUserTxToPublicUserTx(privateUserTx);
      logger.debug({ publicUserTx });
      await setPublicUserTx(context.params.userID, publicUserTx);
    });
