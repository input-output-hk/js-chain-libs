// @flow
import type { AccountKeys } from '../reducers/types';
import {
  computeBlake2bHexWithSecret,
  isBlake2HashHexWithSecretOk,
  aesEncrypt,
  aesDecrypt
} from './decrypt';

const WALLET_SPEDING_PASSWORD_KEY = 'wallet.spending.pwd';
const WALLET_ENCRYPTED_KEYS = 'wallet.encrypted.account.info';

export function saveSpendingPassword(spendingPassword: ?string = ''): void {
  const spendingHash = computeBlake2bHexWithSecret(spendingPassword);
  localStorage.setItem(WALLET_SPEDING_PASSWORD_KEY, spendingHash);
}

export function isValidSpendingPassword(spendingPassword: string): boolean {
  const savedSpendingHash = localStorage.getItem(WALLET_SPEDING_PASSWORD_KEY);
  if (!savedSpendingHash)
    throw new Error('There is not a spending password created');
  return isBlake2HashHexWithSecretOk(spendingPassword, savedSpendingHash);
}

export function isSpedingPasswordCreated(): boolean {
  const savedSpendingHash = localStorage.getItem(WALLET_SPEDING_PASSWORD_KEY);
  if (savedSpendingHash) return true;
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
export function readAccountKeysFromDEN(
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
