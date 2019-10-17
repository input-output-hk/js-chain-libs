import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import { Address, Balance, Counter, PrivateKey, Identifier } from '../models';

export type Action = {
  type: string
};

export type Store = ReduxStore<State, Action>;
export type GetState = () => AppState;
export type Dispatch = ReduxDispatch<Action> & Thunk<Action>;
export type Thunk<A> = ((Dispatch, GetState) => Promise<void> | void) => A;

export type AppState = {
  account: AccountState,
  nodeSettings: NodeSettings
};

export type AccountState = AccountKeys & BalanceAndCounter;

export type AccountKeys = {
  address: Address,
  privateKey: PrivateKey,
  identifier: Identifier
};

export type BalanceAndCounter = {
  balance: Balance,
  counter: Counter
};

export type NodeSettings = {
  block0Hash: string,
  fees: {
    certificate: number,
    coefficient: number,
    constant: number
  }
};
