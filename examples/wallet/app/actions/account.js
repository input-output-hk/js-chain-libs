// @flow
import {
  AppState,
  Dispatch,
  GetState,
  Thunk,
  AccountKeys,
  BalanceAndCounter
} from '../reducers/types';
import { Amount, Address } from '../models';
import {
  getAccountFromPrivateKey,
  buildTransaction
} from '../utils/wasmWrapper';
import { getBalanceAndCounter } from '../utils/nodeConnection';

export type SetKeysAction = { type: 'SET_KEYS' } & AccountKeys;
export const SET_KEYS = 'SET_KEYS';

export function setAccount(
  privateKey: string
): (
  dispatch: Dispatch<SetKeysAction | Thunk<SetBalanceAndCounterAction>>
) => Promise<SetKeysAction> {
  return function setAccountThunk(dispatch) {
    return getAccountFromPrivateKey(privateKey)
      .then((keys: AccountKeys) =>
        dispatch({
          type: SET_KEYS,
          ...keys
        })
      )
      .then(() => dispatch(updateBalanceAndCounter()));
  };
}

export type SetBalanceAndCounterAction = {
  type: 'SET_BALANCE_AND_COUNTER'
} & BalanceAndCounter;
export const SET_BALANCE_AND_COUNTER = 'SET_BALANCE_AND_COUNTER';

export function updateBalanceAndCounter(): (
  dispatch: Dispatch<Thunk<SetBalanceAndCounterAction>>,
  getState: GetState
) => Promise<SetBalanceAndCounterAction> {
  return function updateBalanceThunk(dispatch, getState) {
    return getBalanceAndCounter(getState().account.identifier).then(
      ({ balance, counter }: BalanceAndCounter) =>
        dispatch({
          type: SET_BALANCE_AND_COUNTER,
          balance,
          counter
        })
    );
  };
}

export type SendTransactionAction = {
  type: 'SEND_TRANSACTION'
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
    ).then((transaction: Uint8Array) =>
      console.log('TODO: broadcast the tx: ', transaction.toString())
    );
  };
}
