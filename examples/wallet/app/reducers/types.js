import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type appState = {
  addressInfo: AddressState
};

export type AddressState = {
  address: string,
  balance: number
};

export type Action = {
  +type: string
};

export type SetAddressAction = {
  +type: string,
  address: string,
  balance: number
};

export type GetState = () => appState;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
