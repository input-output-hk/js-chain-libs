// @flow
import type { AccountKeys } from '../reducers/types';
import { aesEncrypt, aesDecrypt } from './decrypt';

const WALLET_ENCRYPTED_KEYS = 'wallet.encrypted.account.info';

export function isUnlockWalletPasswordCreated(): boolean {
  const encryptedAccountInfo = localStorage.getItem(WALLET_ENCRYPTED_KEYS);
  if (encryptedAccountInfo) return true;
  return false;
}

export function saveEncryptedAccountInfo(
  spendingPassword: ?string,
  keys: AccountKeys
): void {
  const plainTextAccountInfo = JSON.stringify(keys);
  const spedingPwd: string = spendingPassword || '';
  const encryptedTextAccountInfo = aesEncrypt(spedingPwd, plainTextAccountInfo);
  localStorage.setItem(WALLET_ENCRYPTED_KEYS, encryptedTextAccountInfo);
}

// eslint-disable-next-line flowtype/space-after-type-colon
export function readEncryptedAccountInfo(
  spendingPassword: ?string
): ?AccountKeys {
  const encryptedHex = localStorage.getItem(WALLET_ENCRYPTED_KEYS);
  try {
    if (encryptedHex && encryptedHex.length > 0) {
      const plainText = aesDecrypt(spendingPassword, encryptedHex);
      const accountKeys = JSON.parse(plainText);
      return accountKeys;
    }
  } catch (e) {
    console.error('There was an error unlocking wallet', e.toString());
  }
  return undefined;
}
