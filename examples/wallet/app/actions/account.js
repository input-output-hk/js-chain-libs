// @flow
import type {
  AppState,
  Thunk,
  AccountKeys,
  AccountState
} from '../reducers/types';
import type { Amount, Address } from '../models';
import {
  getAccountFromPrivateKey,
  buildTransaction
} from '../utils/wasmWrapper';
import { getAccountState, broadcastTransaction } from '../utils/nodeConnection';

export type SetKeysAction = { type: 'SET_KEYS' } & AccountKeys;
export const SET_KEYS = 'SET_KEYS';

export function setAccount(privateKey: string): Thunk<SetKeysAction> {
  return function setAccountThunk(dispatch) {
    return getAccountFromPrivateKey(privateKey)
      .then((keys: AccountKeys) =>
        dispatch({
          type: SET_KEYS,
          ...keys
        })
      )
      .then(() => dispatch(updateAccountState()));
  };
}

export type SetAccountStateAction = {
  type: 'SET_ACCOUNT_STATE'
} & AccountState;
export const SET_ACCOUNT_STATE = 'SET_ACCOUNT_STATE';

export function updateAccountState(): Thunk<SetAccountState> {
  return function updateAccountStateThunk(dispatch, getState) {
    return getAccountState(getState().account.identifier).then(
      ({ balance, counter, delegation }: AccountState) =>
        dispatch({
          type: SET_ACCOUNT_STATE,
          balance,
          counter,
          delegation
        })
    );
  };
}

export type SendTransactionAction = {
  type: 'SEND_TRANSACTION',
  newCounter: number
};
export const SEND_TRANSACTION = 'SEND_TRANSACTION';

export function sendTransaction(
  destination: Address,
  amount: Amount
): Thunk<SendTransactionAction> {
  // Assume balance and counter are up to date
  return function sendTransactionThunk(dispatch, getState) {
    const state: AppState = getState();
    return buildTransaction(
      destination,
      amount,
      state.account.privateKey,
      state.account.counter,
      state.nodeSettings
    )
      .then(({ id, transaction }) => {
        // TODO: dispatch an action which adds the transaction to the
        // transaction list
        console.log(id);
        return broadcastTransaction(transaction);
      })
      .then(() =>
        dispatch({
          type: SEND_TRANSACTION,
          newCounter: state.account.counter + 1
        })
      );
  };
}
