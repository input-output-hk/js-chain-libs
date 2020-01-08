// @flow
import sortBy from 'lodash/sortBy';
import {
  SET_UNLOCK_WALLET_PASSWORD,
  SET_KEYS,
  SET_ACCOUNT_STATE,
  SEND_TRANSACTION,
  SEND_STAKE_DELEGATION,
  SET_TRANSACTIONS
} from '../actions/account';
import type {
  SetKeysAction,
  SendFundsAction,
  SetAccountStateAction,
  SetTransactionsAction,
  SetKeysWithUnlockWalletPasswordAction,
  SendStakeDelegation
} from '../actions/account';
import type { Account } from './types';
import type { Transaction } from '../models';

export default function account(
  state: Account,
  // eslint-disable-next-line flowtype/space-after-type-colon
  action:
    | SetKeysWithUnlockWalletPasswordAction
    | SetKeysAction
    | SetAccountStateAction
    | SendFundsAction
    | SendStakeDelegation
    | SetTransactionsAction
): Account {
  if (typeof state === 'undefined') {
    return { transactions: [] };
  }
  switch (action.type) {
    case SET_UNLOCK_WALLET_PASSWORD:
      return Object.assign({}, state, {
        walletId: action.walletId,
        unlockWalletPassword: action.unlockWalletPassword
      });
    case SET_KEYS:
      return {
        ...state,
        address: action.address,
        privateKey: action.privateKey,
        identifier: action.identifier
      };

    case SET_ACCOUNT_STATE:
      return {
        ...state,
        balance: action.balance,
        counter: action.counter,
        delegation: action.delegation
      };

    case SEND_TRANSACTION: {
      // TODO: optimistically update the balance.
      // TODO: perhaps we could not receive the new counter, but increase the one currently in the state instead?
      const newTransaction: Transaction = {
        id: action.id,
        outputs: [{ address: action.destination, amount: action.amount }],
        inputs: [{ address: state.address, amount: action.amount + action.fee }]
      };
      return {
        ...state,
        counter: action.newCounter,
        transactions: addTransactionToArray(state.transactions, newTransaction)
      };
    }

    case SEND_STAKE_DELEGATION: {
      const newTransaction: Transaction = {
        id: action.id,
        inputs: [{ address: state.address, amount: action.fee }],
        certificate: { type: 'STAKE_DELEGATION', pools: action.pools },
        outputs: []
      };
      return {
        ...state,
        counter: action.newCounter,
        transactions: addTransactionToArray(state.transactions, newTransaction)
      };
    }

    case SET_TRANSACTIONS: {
      // transactions from the node always overwrite transactions already in the state
      const mergedTransactionList = {
        ...transactionListAsObject(state.transactions),
        ...transactionListAsObject(action.transactions)
      };
      return {
        ...state, // FIXME: transactions should also be ordered by transaction index, but this isnt
        // exposed on the API
        transactions: sortBy(Object.values(mergedTransactionList), it =>
          // if the number is not present, then the transaction is in the mempool
          // and it should show first
          typeof it.blockHeight === 'number'
            ? // more recent transaction first
              -it.blockHeight
            : Number.NEGATIVE_INFINITY
        )
      };
    }
    default:
      return state;
  }
}

const transactionListAsObject = arr =>
  arr.reduce((acc, it) => ({ ...acc, [it.id]: it }), {});

const addTransactionToArray = (array, tx) => {
  const oldTransaction = array.find(it => it.id === tx.id);
  if (!oldTransaction) {
    return [tx, ...array];
  }
  console.log(
    `An older transaction with the same hash was found while inserting: ${tx.id}`
  );
  return [...array];
};
