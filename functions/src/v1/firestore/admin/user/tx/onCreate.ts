import functions from '../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../utils/firebase/logger';
import { announceTx } from '../../../../../utils/symbol/tx/announceTx';
import {
  adminUserTxConverter,
  setAdminUserTx,
} from '../../../../model/admin/users/txs';
import {
  convertAdminUserTxToPrivateUserTx,
  setPrivateUserTx,
} from '../../../../model/private/users/txs';

const path = '/v/1/scopes/admin/users/{userID}/txs/{txID}';

export const onCreate = () =>
  functions()
    .runWith({ timeoutSeconds: 540 })
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-admin-user-tx-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

      const adminUserTx = (
        await snapshot.ref.withConverter(adminUserTxConverter).get()
      ).data();
      if (!adminUserTx) {
        throw Error('adminUserTx is undefined');
      }
      logger.debug({ adminUserTx });

      const privateUserTx = convertAdminUserTxToPrivateUserTx(adminUserTx);
      logger.debug({ privateUserTx });
      await setPrivateUserTx(context.params.userID, privateUserTx);

      const txStatus = await announceTx(adminUserTx);

      await setAdminUserTx(context.params.userID, {
        id: adminUserTx.id,
        announced: txStatus.announced,
        announcedAt: txStatus.announcedAt,
        unconfirmed: txStatus.unconfirmed,
        unconfirmedAt: txStatus.unconfirmedAt,
        confirmed: txStatus.confirmed,
        confirmedAt: txStatus.confirmedAt,
        finalized: txStatus.finalized,
        finalizedAt: txStatus.finalizedAt,
        expired: txStatus.expired,
        expiredAt: txStatus.expiredAt,
        error: txStatus.error,
        errorAt: txStatus.errorAt,
      });
    });
