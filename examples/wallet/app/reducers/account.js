// @flow
import sortBy from 'lodash/sortBy';
import {
  SET_KEYS,
  SET_MNEMONIC,
  SET_ACCOUNT_STATE,
  SEND_TRANSACTION,
  SEND_STAKE_DELEGATION,
  SET_TRANSACTIONS
} from '../actions/account';
import type {
  SetKeysAction,
  SendTransactionAction,
  SetAccountStateAction,
  SetTransactionsAction,
  SendStakeDelegation
} from '../actions/account';
import type { Account } from './types';
import type { Transaction } from '../models';

export default function account(
  state: Account,
  // eslint-disable-next-line flowtype/space-after-type-colon
  action:
    | SetKeysAction
    | SetAccountStateAction
    | SendTransactionAction
    | SendStakeDelegation
    | SetTransactionsAction
): Account {
  if (typeof state === 'undefined') {
    return { transactions: [] };
  }
  switch (action.type) {
    case SET_KEYS:
      return Object.assign({}, state, {
        address: action.address,
        privateKey: action.privateKey,
        identifier: action.identifier
      });
    case SET_MNEMONIC:
      return Object.assign({}, state, {
        address: action.address,
        privateKey: action.privateKey,
        identifier: action.identifier
      });
    case SET_ACCOUNT_STATE:
      return Object.assign({}, state, {
        balance: action.balance,
        counter: action.counter,
        delegation: action.delegation
      });
    case SEND_TRANSACTION: {
      const newTransaction: Transaction = {
        id: action.id,
        outputs: [{ address: action.destination, amount: action.amount }],
        inputs: [{ address: state.address, amount: action.amount + action.fee }]
      };
      return Object.assign({}, state, {
        counter: action.newCounter,
        transactions: addTransactionToArray(state.transactions, newTransaction)
      });
    }
    case SEND_STAKE_DELEGATION: {
      const newTransaction: Transaction = {
        id: action.id,
        inputs: [{ address: state.address, amount: action.fee }],
        certificate: { type: 'STAKE_DELEGATION', pools: action.pools },
        outputs: []
      };
      return Object.assign({}, state, {
        counter: action.newCounter,
        transactions: addTransactionToArray(state.transactions, newTransaction)
      });
    }
    case SET_TRANSACTIONS: {
      // transactions from the node always overwrite transactions already in the state
      const mergedTransactionList = Object.assign(
        {},
        transactionListAsObject(state.transactions),
        transactionListAsObject(action.transactions)
      );
      return Object.assign({}, state, {
        // FIXME: transactions should also be ordered by transaction index, but this isnt
        // exposed on the API
        transactions: sortBy(Object.values(mergedTransactionList), it =>
          // if the number is not present, then the transaction is in the mempool
          // and it should show first
          typeof it.blockHeight === 'number'
            ? // more recent transaction first
              -it.blockHeight
            : Number.NEGATIVE_INFINITY
        )
      });
    }
    default:
      return state;
  }
}

const transactionListAsObject = arr =>
  arr.reduce((acc, it) => Object.assign({}, acc, { [it.id]: it }), {});

const addTransactionToArray = (array, tx) => {
  const oldTransaction = array.find(it => it.id === tx.id);
  if (!oldTransaction) {
    return [tx, ...array];
  }
  console.log(
    `An older transaction with the same hash was found while inserting: ${
      tx.id
    }`
  );
  return [...array];
};
