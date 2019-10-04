import { Address, Balance } from '../models';

export type appState = {
  addressInfo: AddressState
};

export type AddressState = {
  address: Address,
  balance: Balance
};

export type Action = {
  +type: string
};
