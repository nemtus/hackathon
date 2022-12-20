import { defineSecret } from 'firebase-functions/params';
import functions from '../../utils/firebase/baseFunction';
import { hasAlreadyTriggered } from '../../utils/firebase/hasAlreadyTriggered';
import { logger } from '../../utils/firebase/logger';
import { createNewEncryptedAccount } from '../../utils/symbol/account';
import { createAggregateCompleteTransactionToCreateAndSetUpNewAccount } from '../../utils/symbol/tx/createAggregateCompleteTransactionToCreateAndSetUpNewAccount';
import { AdminUser, setAdminUser } from '../model/admin/users';
import { setAdminUserTx } from '../model/admin/users/txs';

const FEE_BILLING_ACCOUNT_PRIVATE_KEY = defineSecret(
  'FEE_BILLING_ACCOUNT_PRIVATE_KEY'
);
const MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY = defineSecret(
  'MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY'
);
const DATA_ENCRYPTION_KEY = defineSecret('DATA_ENCRYPTION_KEY');

export const onCreate = () =>
  functions()
    .runWith({
      secrets: [
        'FEE_BILLING_ACCOUNT_PRIVATE_KEY',
        'MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY',
        'DATA_ENCRYPTION_KEY',
      ],
    })
    .auth.user()
    .onCreate(async (userRecord, context) => {
      if (await hasAlreadyTriggered(context.eventId, 'v1-auth-onCreate')) {
        return;
      }
      logger.debug({
        userRecord,
        context,
      });
      const feeBillingAccountPrivateKey =
        FEE_BILLING_ACCOUNT_PRIVATE_KEY.value();
      const messageReceivingAccountPrivateKey =
        MESSAGE_RECEIVING_ACCOUNT_PRIVATE_KEY.value();
      const dataEncryptionKey = DATA_ENCRYPTION_KEY.value();
      const multisigEncryptedAccount = await createNewEncryptedAccount(
        dataEncryptionKey
      );
      const multisigCosignatory1EncryptedAccount =
        await createNewEncryptedAccount(dataEncryptionKey);
      const multisigCosignatory2EncryptedAccount =
        await createNewEncryptedAccount(dataEncryptionKey);
      const multisigCosignatory3EncryptedAccount =
        await createNewEncryptedAccount(dataEncryptionKey);
      const adminUser: AdminUser = {
        id: userRecord.uid,
        displayName: undefined,
        photoUrl: undefined,
        twitterId: undefined,
        githubId: undefined,
        createdAt: new Date(),
        entryAt: undefined,
        submitAt: undefined,
        voteAt: undefined,
        multisigSaltHexString: multisigEncryptedAccount.saltHexString,
        multisigIvHexString: multisigEncryptedAccount.ivHexString,
        multisigEncryptedPrivateKey:
          multisigEncryptedAccount.encryptedPrivateKey,
        multisigPublicKey: multisigEncryptedAccount.publicKey,
        multisigAddress: multisigEncryptedAccount.address,
        multisigCosignatory1SaltHexString:
          multisigCosignatory1EncryptedAccount.saltHexString,
        multisigCosignatory1IvHexString:
          multisigCosignatory1EncryptedAccount.ivHexString,
        multisigCosignatory1EncryptedPrivateKey:
          multisigCosignatory1EncryptedAccount.encryptedPrivateKey,
        multisigCosignatory1PublicKey:
          multisigCosignatory1EncryptedAccount.publicKey,
        multisigCosignatory1Address:
          multisigCosignatory1EncryptedAccount.address,
        multisigCosignatory2SaltHexString:
          multisigCosignatory2EncryptedAccount.saltHexString,
        multisigCosignatory2IvHexString:
          multisigCosignatory2EncryptedAccount.ivHexString,
        multisigCosignatory2EncryptedPrivateKey:
          multisigCosignatory2EncryptedAccount.encryptedPrivateKey,
        multisigCosignatory2PublicKey:
          multisigCosignatory2EncryptedAccount.publicKey,
        multisigCosignatory2Address:
          multisigCosignatory2EncryptedAccount.address,
        multisigCosignatory3SaltHexString:
          multisigCosignatory3EncryptedAccount.saltHexString,
        multisigCosignatory3IvHexString:
          multisigCosignatory3EncryptedAccount.ivHexString,
        multisigCosignatory3EncryptedPrivateKey:
          multisigCosignatory3EncryptedAccount.encryptedPrivateKey,
        multisigCosignatory3PublicKey:
          multisigCosignatory3EncryptedAccount.publicKey,
        multisigCosignatory3Address:
          multisigCosignatory3EncryptedAccount.address,
      };
      logger.debug({ adminUser });
      await setAdminUser(adminUser);

      const aggregateCompleteTransactionToCreateAndSetUpNewAccount =
        await createAggregateCompleteTransactionToCreateAndSetUpNewAccount(
          feeBillingAccountPrivateKey,
          messageReceivingAccountPrivateKey,
          dataEncryptionKey,
          adminUser
        );
      await setAdminUserTx(
        adminUser.id,
        aggregateCompleteTransactionToCreateAndSetUpNewAccount
      );
    });
