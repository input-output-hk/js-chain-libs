// @flow
import type { Store as ReduxStore, Dispatch as ReduxDispatch } from 'redux';
import type { RouterHistory } from 'react-router-dom';
import type {
  Address,
  Balance,
  Counter,
  PrivateKey,
  Delegation,
  Identifier,
  PoolId,
  Transaction
} from '../models';

export type Action = {
  type: string
};

export type Store = ReduxStore<AppState, Action>;
export type GetState = () => AppState;
export type Dispatch = ReduxDispatch<Action> & Thunk;
export type Thunk = (Dispatch, GetState) => any;

export type AppState = {
  account: Account,
  nodeSettings: NodeSettings,
  stakePools: StakePools,
  router: RouterHistory
};

export type Account = AccountKeys &
  AccountState & { transactions: Array<Transaction> };

export type AccountKeys = {
  address: Address,
  privateKey: PrivateKey,
  identifier: Identifier
};

export type AccountState = {
  balance: Balance,
  counter: Counter,
  delegation: Delegation
};

export type NodeSettings = {
  block0Hash: string,
  fees: {
    certificate: number,
    coefficient: number,
    constant: number
  }
};

export type StakePools = {
  availablePools: Array<PoolId>
};
