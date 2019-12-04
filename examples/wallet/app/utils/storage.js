// @flow
import type { AccountKeys } from '../reducers/types';
import type { Address, Identifier, PrivateKey } from '../models';

export function saveAccountInfoInLocalStorage(keys: AccountKeys): void {
  Object.keys(keys).forEach(key => localStorage.setItem(key, keys[key]));
}

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
