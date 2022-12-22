import { defineSecret } from 'firebase-functions/params';
import functions from '../../../../../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../../../../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../../../../../utils/firebase/logger';
import { restoreAccountFromPrivateKey } from '../../../../../../utils/symbol/account';
import { createAggregateCompleteTransactionToEntry } from '../../../../../../utils/symbol/tx/createAggregateCompleteTransactionToEntry';
import { setAdminUserTx } from '../../../../../model/admin/users/txs';
import { privateUserYearEntryConverter } from '../../../../../model/private/users/years/entries';

const FEE_BILLING_ACCOUNT_PRIVATE_KEY = defineSecret(
  'FEE_BILLING_ACCOUNT_PRIVATE_KEY'
);
const MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY = defineSecret(
  'MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY'
);
const DATA_ENCRYPTION_KEY = defineSecret('DATA_ENCRYPTION_KEY');

const path =
  '/v/1/scopes/admin/users/{userID}/years/{yearID}/entries/{entryID}';

export const onCreate = () =>
  functions()
    .runWith({
      secrets: [
        'FEE_BILLING_ACCOUNT_PRIVATE_KEY',
        'MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY',
        'DATA_ENCRYPTION_KEY',
      ],
    })
    .firestore.document(path)
    .onCreate(async (snapshot, context) => {
      if (
        await hasAlreadyTriggered(
          context.eventId,
          'v1-firestore-admin-user-year-entry-onCreate'
        )
      ) {
        return;
      }
      logger.debug({ snapshot, context });

      const adminUserYearEntry = (
        await snapshot.ref.withConverter(privateUserYearEntryConverter).get()
      ).data();
      if (!adminUserYearEntry) {
        throw Error('adminUserYearEntry is undefined');
      }
      logger.debug({ adminUserYearEntry });

      if (adminUserYearEntry.userId !== context.params.userID) {
        throw Error('adminUserYearEntry.userId !== context.params.userID');
      }
      if (adminUserYearEntry.yearId !== context.params.yearID) {
        throw Error('adminUserYearEntry.yearId !== context.params.yearID');
      }

      const feeBillingAccountPrivateKey =
        FEE_BILLING_ACCOUNT_PRIVATE_KEY.value();
      const messageReceivingAccountPrivateKey =
        MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY.value();
      const dataEncryptionKey = DATA_ENCRYPTION_KEY.value();

      const feeBillingAccount = await restoreAccountFromPrivateKey(
        feeBillingAccountPrivateKey
      );
      const messageReceivingAccount = await restoreAccountFromPrivateKey(
        messageReceivingAccountPrivateKey
      );

      const aggregateCompleteTransactionToEntry =
        await createAggregateCompleteTransactionToEntry(
          feeBillingAccount.privateKey,
          messageReceivingAccount.privateKey,
          dataEncryptionKey,
          adminUserYearEntry
        );
      await setAdminUserTx(
        adminUserYearEntry.userId,
        aggregateCompleteTransactionToEntry
      );
    });
