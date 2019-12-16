// @flow
import type { AccountKeys } from '../reducers/types';
import type { Address, Identifier, PrivateKey } from '../models';
import {
  computeBlake2bHexWithSecret,
  isBlake2HashHexWithSecretOk
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

export function saveAccountInfoInDEN(
  spendingPassword: ?string,
  keys: AccountKeys
): void {
  const plainTextAccountInfo = JSON.stringify(keys);
  const spedingPwd: string = !spendingPassword ? '' : spendingPassword;
  const encryptedTextAccountInfo = aesEncrypt(spedingPwd, plainTextAccountInfo);
  localStorage.setItem(WALLET_ENCRYPTED_KEYS, encryptedTextAccountInfo);
}

// eslint-disable-next-line flowtype/space-after-type-colon
export function readAccountKeysFromLocalStorage(): ?AccountKeys {
  if (localStorage.getItem('privateKey')) {
    return {
      address: (localStorage.getItem('address'): Address),
      identifier: (localStorage.getItem('identifier'): Identifier),
      privateKey: (localStorage.getItem('privateKey'): PrivateKey)
    };
  }
  return undefined;
}
