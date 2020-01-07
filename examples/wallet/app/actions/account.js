// @flow
import { push } from 'connected-react-router';
import type { Dispatch } from 'redux';
import curry from 'lodash/curry';
import type {
  AppState,
  Thunk,
  AccountKeys,
  AccountState,
  SpendingPassword
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
  getAccountFromSeed,
  typeof buildSendFundsTransaction as BuildSendFundsTransaction,
  typeof buildDelegateTransaction as BuildDelegateTransaction
} from '../utils/wasmWrapper';
import {
  getAccountState,
  typeof broadcastTransaction as BroadcastTransaction,
  getTransactions
} from '../utils/nodeConnection';
import { isValidMnemonic, createSeedFromMnemonic } from '../utils/mnemonic';
import {
  saveEncryptedAccountInfo,
  readEncryptedAccountInfo
} from '../utils/storage';

import routes from '../constants/routes.json';

export type SetKeysAction = { type: 'SET_KEYS' } & AccountKeys;
export type SetKeysWithSpendingPasswordAction = {
  type: 'SET_SPENDING_PASSWORD'
} & SpendingPassword;
export const SET_KEYS = 'SET_KEYS';
export const SET_SPENDING_PASSWORD = 'SET_SPENDING_PASSWORD';

export function setAccount(
  privateKey: string,
  spendingPassword: ?string
): Thunk<SetKeysAction> {
  return function setAccountThunk(dispatch) {
    return getAccountFromPrivateKey(privateKey).then(keys =>
      curry(initializeKeysAndRedirect)(dispatch, keys, spendingPassword)
    );
  };
}

export function setKeysWithUnlockWalletPassword(
  spendingPassword: ?string = ''
): Thunk<SetKeysAction> {
  return function setKeysWithUnlockWalletPasswordThunk(dispatch) {
    const accountKeys = readEncryptedAccountInfo(spendingPassword);
    if (accountKeys) {
      const spendingPasswordKeys = {
        walletId: 'wallet01',
        spendingPassword
      };
      dispatch({
        type: SET_SPENDING_PASSWORD,
        ...spendingPasswordKeys
      });

      return getAccountFromPrivateKey(accountKeys.privateKey).then(keys =>
        curry(initializeKeysAndRedirect)(dispatch, keys, spendingPassword)
      );
    }
    throw new Error('Invalid password');
  };
}

export function setAccountFromPrivateKey(
  privateKey: string
): Thunk<SetKeysAction> {
  return function setAccountFromPrivateKeyThunk(dispatch) {
    return getAccountFromPrivateKey(privateKey).then(loadedPrivateKey => {
      dispatch({
        type: SET_KEYS,
        ...loadedPrivateKey
      });
      return Promise.all([
        dispatch(updateAccountTransactions()),
        dispatch(updateNodeSettings()),
        dispatch(updateAccountState())
      ])
        .then(() => dispatch(push(routes.WALLET)))
        .catch(error => {
          console.log(error);
          dispatch(push(routes.INPUT_KEYS));
        });
    });
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
  spendingPassword: ?string = ''
) => {
  dispatch({
    type: SET_KEYS,
    ...keys
  });

  saveEncryptedAccountInfo(spendingPassword, keys);

  return Promise.all([
    dispatch(updateAccountTransactions()),
    dispatch(updateNodeSettings()),
    dispatch(updateAccountState())
  ])
    .then(() => dispatch(push(routes.WALLET)))
    .catch(error => {
      console.log(error);
      dispatch(push(routes.WALLET));
    });
};

export function setAccountFromMnemonic(
  mnemonicPhrase: string,
  mnemonicPassword: string,
  spendingPassword: ?string
): Thunk<SetKeysAction> {
  if (isValidMnemonic(mnemonicPhrase)) {
    const seed = createSeedFromMnemonic(mnemonicPhrase, mnemonicPassword);
    return function setAccountThunk(dispatch) {
      return getAccountFromSeed(seed).then(keys =>
        curry(initializeKeysAndRedirect)(dispatch, keys, spendingPassword)
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
          return Promise.reject();
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
          return Promise.reject();
        })
    );
  };
}

export type SendFundsAction = {
  type: 'SEND_TRANSACTION',
  newCounter: number,
  id: TransactionHash,
  destination: Address,
  amount: Amount,
  fee: Amount
};

export const SEND_TRANSACTION = 'SEND_TRANSACTION';
export type BuildSendFundsAction = typeof buildSendFundsAction;
export type SendFunds = $Call<
  BuildSendFundsAction,
  BuildDelegateTransaction,
  BroadcastTransaction
>;

export const buildSendFundsAction = (
  buildSendFundsTransaction: BuildSendFundsTransaction,
  broadcastTransaction: BroadcastTransaction
) =>
  function sendFunds(destination: Address, amount: Amount): Thunk {
    // Assume balance and counter are up to date
    return function sendFundsThunk(dispatch, getState) {
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
  };

export type SendStakeDelegation = {
  type: 'SEND_STAKE_DELEGATION',
  newCounter: number,
  id: TransactionHash,
  pools: Array<PoolId>,
  fee: Amount
};

export const SEND_STAKE_DELEGATION = 'SEND_STAKE_DELEGATION';

export type BuildDelegationAction = typeof buildDelegationAction;
export type Delegate = $Call<
  BuildDelegationAction,
  BuildDelegateTransaction,
  BroadcastTransaction
>;
export const buildDelegationAction = (
  buildDelegateTransaction: BuildDelegateTransaction,
  broadcastTransaction: BroadcastTransaction
) => (newDelegation: Delegation): Thunk => {
  // Assume balance and counter are up to date
  return function delegationThunk(dispatch, getState) {
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
};
