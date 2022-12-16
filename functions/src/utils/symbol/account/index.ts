import { Account } from 'symbol-sdk';
import { AdminUser } from '../../../v1/model/admin/users';
import {
  createIvHexString,
  createSaltHexString,
  decrypt,
  encrypt,
} from '../../cipher/encrypt';
import { getNetworkType } from '../network';

export type EncryptedAccount = {
  saltHexString: string;
  ivHexString: string;
  encryptedPrivateKey: string;
  publicKey: string;
  address: string;
};

export type MultisigAccount = {
  multisigAccount: Account;
  multisigCosignatory1Account: Account;
  multisigCosignatory2Account: Account;
  multisigCosignatory3Account: Account;
};

export type PrivateAccount = {
  privateKey: string;
  publicKey: string;
  address: string;
};

export type PublicAccount = {
  publicKey: string;
  address: string;
};

export const createNewEncryptedAccount = async (
  dataEncryptionKey: string
): Promise<EncryptedAccount> => {
  const networkType = await getNetworkType();
  const account = Account.generateNewAccount(networkType);
  const privateKey = account.privateKey;
  const saltHexString = createSaltHexString();
  const ivHexString = createIvHexString();
  const encryptedPrivateKey = encrypt(
    privateKey,
    dataEncryptionKey,
    saltHexString,
    ivHexString
  );
  const publicKey = account.publicKey;
  const address = account.address.plain();
  const encryptedAccount: EncryptedAccount = {
    saltHexString,
    ivHexString,
    encryptedPrivateKey,
    publicKey,
    address,
  };
  return encryptedAccount;
};

export const restorePrivateAccountFromEncryptedAccount = (
  encryptedAccount: EncryptedAccount,
  dataEncryptionKey: string
): PrivateAccount => {
  const privateKey = decrypt(
    encryptedAccount.encryptedPrivateKey,
    dataEncryptionKey,
    encryptedAccount.saltHexString,
    encryptedAccount.ivHexString
  );
  const publicKey = encryptedAccount.publicKey;
  const address = encryptedAccount.address;
  const privateAccount: PrivateAccount = {
    privateKey,
    publicKey,
    address,
  };
  return privateAccount;
};

export const restoreAccountFromEncryptedAccount = async (
  encryptedAccount: EncryptedAccount,
  dataEncryptionKey: string
): Promise<Account> => {
  const privateKey = decrypt(
    encryptedAccount.encryptedPrivateKey,
    dataEncryptionKey,
    encryptedAccount.saltHexString,
    encryptedAccount.ivHexString
  );
  const networkType = await getNetworkType();
  const account = Account.createFromPrivateKey(privateKey, networkType);
  return account;
};

export const restorePrivateAccountFromPrivateKey = async (
  privateKey: string
) => {
  const networkType = await getNetworkType();
  const account = Account.createFromPrivateKey(privateKey, networkType);
  const publicKey = account.publicKey;
  const address = account.address.plain();
  const privateAccount: PrivateAccount = {
    privateKey,
    publicKey,
    address,
  };
  return privateAccount;
};

export const restoreAccountFromPrivateKey = async (
  privateKey: string
): Promise<Account> => {
  const networkType = await getNetworkType();
  const account = Account.createFromPrivateKey(privateKey, networkType);
  return account;
};

export const restoreAccountsFromAdminUser = async (
  adminUser: AdminUser,
  dataEncryptionKey: string
): Promise<MultisigAccount> => {
  const networkType = await getNetworkType();

  if (!adminUser.multisigEncryptedPrivateKey) {
    throw Error('multisigEncryptedPrivateKey is required');
  }
  if (!adminUser.multisigIvHexString) {
    throw Error('multisigIvHexString is required');
  }
  if (!adminUser.multisigSaltHexString) {
    throw Error('multisigSaltHexString is required');
  }
  const multisitPrivateKey = decrypt(
    adminUser.multisigEncryptedPrivateKey,
    dataEncryptionKey,
    adminUser.multisigSaltHexString,
    adminUser.multisigIvHexString
  );
  const multisigAccount = Account.createFromPrivateKey(
    multisitPrivateKey,
    networkType
  );

  if (!adminUser.multisigCosignatory1EncryptedPrivateKey) {
    throw Error('multisigCosignatory1EncryptedPrivateKey is required');
  }
  if (!adminUser.multisigCosignatory1IvHexString) {
    throw Error('multisigCosignatory1IvHexString is required');
  }
  if (!adminUser.multisigCosignatory1SaltHexString) {
    throw Error('multisigCosignatory1SaltHexString is required');
  }
  const multisitCosignatory1PrivateKey = decrypt(
    adminUser.multisigCosignatory1EncryptedPrivateKey,
    dataEncryptionKey,
    adminUser.multisigCosignatory1SaltHexString,
    adminUser.multisigCosignatory1IvHexString
  );
  const multisigCosignatory1Account = Account.createFromPrivateKey(
    multisitCosignatory1PrivateKey,
    networkType
  );

  if (!adminUser.multisigCosignatory2EncryptedPrivateKey) {
    throw Error('multisigCosignatory2EncryptedPrivateKey is required');
  }
  if (!adminUser.multisigCosignatory2IvHexString) {
    throw Error('multisigCosignatory2IvHexString is required');
  }
  if (!adminUser.multisigCosignatory2SaltHexString) {
    throw Error('multisigCosignatory2SaltHexString is required');
  }
  const multisitCosignatory2PrivateKey = decrypt(
    adminUser.multisigCosignatory2EncryptedPrivateKey,
    dataEncryptionKey,
    adminUser.multisigCosignatory2SaltHexString,
    adminUser.multisigCosignatory2IvHexString
  );
  const multisigCosignatory2Account = Account.createFromPrivateKey(
    multisitCosignatory2PrivateKey,
    networkType
  );

  if (!adminUser.multisigCosignatory3EncryptedPrivateKey) {
    throw Error('multisigCosignatory3EncryptedPrivateKey is required');
  }
  if (!adminUser.multisigCosignatory3IvHexString) {
    throw Error('multisigCosignatory3IvHexString is required');
  }
  if (!adminUser.multisigCosignatory3SaltHexString) {
    throw Error('multisigCosignatory3SaltHexString is required');
  }
  const multisitCosignatory3PrivateKey = decrypt(
    adminUser.multisigCosignatory3EncryptedPrivateKey,
    dataEncryptionKey,
    adminUser.multisigCosignatory3SaltHexString,
    adminUser.multisigCosignatory3IvHexString
  );
  const multisigCosignatory3Account = Account.createFromPrivateKey(
    multisitCosignatory3PrivateKey,
    networkType
  );

  return {
    multisigAccount,
    multisigCosignatory1Account,
    multisigCosignatory2Account,
    multisigCosignatory3Account,
  };
};

export const convertEncryptedAccountToPublicAccount = (
  encryptedAccount: EncryptedAccount
): PublicAccount => {
  const publicKey = encryptedAccount.publicKey;
  const address = encryptedAccount.address;
  const publicAccount: PublicAccount = {
    publicKey,
    address,
  };
  return publicAccount;
};
