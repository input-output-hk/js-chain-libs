import type { Dispatch as ReduxDispatch, Store as ReduxStore } from 'redux';

export type counterStateType = {
  +counter: number
};

export type AddressState = {
  address: string,
  balance: number
}

export type Action = {
  +type: string
};

export type SetAddressAction = {
  +type: string,
  address: string
};

export type GetState = () => counterStateType;

export type Dispatch = ReduxDispatch<Action>;

export type Store = ReduxStore<GetState, Action>;
