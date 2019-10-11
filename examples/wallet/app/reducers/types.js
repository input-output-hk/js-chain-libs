import { Address, Balance } from '../models';

export type AppState = {
  account: AccountState
};

export type AccountState = {
  address: Address,
  balance: Balance
};

export type Action = {
  +type: string
};
