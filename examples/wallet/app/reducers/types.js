import { Address, Balance, PrivateKey, Identifier } from '../models';

export type AppState = {
  account: AccountState,
  balance: Balance
};

export type AccountState = {
  address: Address,
  privateKey: PrivateKey,
  identifier: Identifier
};

export type Action = {
  +type: string
};
