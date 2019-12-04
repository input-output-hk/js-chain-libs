// @flow
import { push } from 'connected-react-router';
import type { Dispatch } from 'redux';
import curry from 'lodash/curry';
import type {
  AppState,
  Thunk,
  AccountKeys,
  AccountState
} from '../reducers/types';
import type {
  Amount,
  Address,
  PoolId,
  Delegation,
  Identifier,
  TransactionHash,
  Transaction
} from '../models';
import { updateNodeSettings } from './nodeSettings';
import {
  getAccountFromPrivateKey,
  buildSendFundsTransaction,
  getAccountFromSeed,
  buildDelegateTransaction
} from '../utils/wasmWrapper';
import {
  getAccountState,
  broadcastTransaction,
  getTransactions
} from '../utils/nodeConnection';
import { isValidMnemonic, createSeedFromMnemonic } from '../utils/mnemonic';
import { saveAccountInfoInLocalStorage } from '../utils/storage';

import routes from '../constants/routes.json';

export type SetKeysAction = { type: 'SET_KEYS' } & AccountKeys;
export const SET_KEYS = 'SET_KEYS';
export const PRIVATE_KEY_ERROR = 'privateKeyError';
export const ACCOUNT_STATE_ERROR = 'accountStateError';

export function setAccount(privateKey: string): Thunk<SetKeysAction> {
  return function setAccountThunk(dispatch) {
    return getAccountFromPrivateKey(privateKey).then(
      curry(initializeKeysAndRedirect)(dispatch)
    );
  };
}

export function setAccountFromPrivateKey(
  privateKey: string
): Thunk<SetKeysAction> {
  return function setAccountFromPrivateKeyThunk(dispatch) {
    getAccountFromPrivateKey(privateKey)
      .then(loadedPrivateKey => {
        dispatch({
          type: SET_KEYS,
          ...loadedPrivateKey
        });
        return dispatch(updateAccountTransactionsAndState());
      })
      .catch(error => {
        console.error(error);
        throw new Error(PRIVATE_KEY_ERROR);
      });
  };
}

export function updateAccountTransactionsAndState(): Thunk<SetKeysAction> {
  return function updateAccountTransactionsAndStateThunk(dispatch) {
    return Promise.all([
      dispatch(updateAccountTransactions()),
      dispatch(updateNodeSettings()),
      dispatch(updateAccountState())
    ]).then(() => dispatch(push(routes.WALLET)));
  };
}

/**
 * @dev This function is used to obtain the list of transactions, the balance
 * and the delegation of a given account after obtaining the public, private
 * and identifier keys.
 * @param {Dispatch} dispatch
 * @param {AccountKeys} keys
 * @param {boolean} saveAccount If true, the keys are stored in the local storage
 */
const initializeKeysAndRedirect = (
  dispatch: Dispatch,
  keys: AccountKeys,
  saveAccount?: boolean = true
) => {
  dispatch({
    type: SET_KEYS,
    ...keys
  });
  if (saveAccount) {
    saveAccountInfoInLocalStorage(keys);
  }

  return dispatch(updateAccountTransactionsAndState());
};

export function setAccountFromMnemonic(
  mnemonicPhrase: string,
  mnemonicPassword?: string
): Thunk<SetKeysAction> {
  if (isValidMnemonic(mnemonicPhrase)) {
    const seed = createSeedFromMnemonic(mnemonicPhrase, mnemonicPassword);
    return function setAccountThunk(dispatch) {
      return getAccountFromSeed(seed).then(
        curry(initializeKeysAndRedirect)(dispatch)
      );
    };
  }
  // TODO: Add a message displaying error
  console.log('Mnemonic phrase is not valid');
}

export type SetAccountStateAction = {
  type: 'SET_ACCOUNT_STATE'
} & AccountState;
export const SET_ACCOUNT_STATE = 'SET_ACCOUNT_STATE';

export function updateAccountState(): Thunk<SetAccountStateAction> {
  return function updateAccountStateThunk(dispatch, getState) {
    const { identifier }: { identifier: Identifier } = getState().account;
    if (!identifier) {
      console.log('not fetching account because wallet is not initialized yet');
      return;
    }
    return (
      getAccountState(identifier)
        .then(({ balance, counter, delegation }: AccountState) =>
          dispatch({
            type: SET_ACCOUNT_STATE,
            balance,
            counter,
            delegation
          })
        )
        // TODO: display a notification or something
        .catch(() => {
          console.error('there was an error fetching account info');
          return Promise.reject(new Error(ACCOUNT_STATE_ERROR));
        })
    );
  };
}

export type SetTransactionsAction = {
  type: 'SET_TRANSACTIONS',
  transactions: Array<Transaction>
};
export const SET_TRANSACTIONS = 'SET_TRANSACTIONS';

export function updateAccountTransactions(): Thunk<SetAccountStateAction> {
  return function updateAccountTransactionsThunk(dispatch, getState) {
    const { address }: { address: Address } = getState().account;
    if (!address) {
      console.log(
        'not fetching transactions because wallet is not initialized yet'
      );
      return;
    }
    return (
      getTransactions(address)
        .then(({ transactions }: { transactions: Array<Transaction> }) =>
          dispatch({
            type: SET_TRANSACTIONS,
            transactions
          })
        )
        // TODO: display a notification or something
        .catch(() => {
          console.error('there was an error fetching transactions');
          return Promise.reject(new Error(ACCOUNT_STATE_ERROR));
        })
    );
  };
}

export type SendTransactionAction = {
  type: 'SEND_TRANSACTION',
  newCounter: number,
  id: TransactionHash,
  destination: Address,
  amount: Amount,
  fee: Amount
};

export const SEND_TRANSACTION = 'SEND_TRANSACTION';

export function sendTransaction(
  destination: Address,
  amount: Amount
): Thunk<SendTransactionAction> {
  // Assume balance and counter are up to date
  return function sendTransactionThunk(dispatch, getState) {
    const state: AppState = getState();
    return buildSendFundsTransaction(
      destination,
      amount,
      state.account.privateKey,
      state.account.counter,
      state.nodeSettings
    )
      .then(({ id, transaction, fee }) => {
        return broadcastTransaction(transaction).then(() => ({ id, fee }));
      })
      .then(({ id, fee }) =>
        dispatch({
          type: SEND_TRANSACTION,
          newCounter: state.account.counter + 1,
          id,
          destination,
          amount,
          fee
        })
      );
  };
}

export type SendStakeDelegation = {
  type: 'SEND_STAKE_DELEGATION',
  newCounter: number,
  id: TransactionHash,
  pools: Array<PoolId>,
  fee: Amount
};

export const SEND_STAKE_DELEGATION = 'SEND_STAKE_DELEGATION';

export function sendStakeDelegation(
  newDelegation: Delegation
): Thunk<SendStakeDelegation> {
  // Assume balance and counter are up to date
  return function sendStakeDelegationThunk(dispatch, getState) {
    const state: AppState = getState();
    return buildDelegateTransaction(
      newDelegation,
      state.account.privateKey,
      state.account.counter,
      state.nodeSettings
    )
      .then(({ id, transaction, fee }) =>
        broadcastTransaction(transaction).then(() => ({ id, fee }))
      )
      .then(({ id, fee }) =>
        dispatch({
          type: SEND_STAKE_DELEGATION,
          newCounter: state.account.counter + 1,
          id,
          pools: Object.keys(newDelegation),
          fee
        })
      );
  };
}
