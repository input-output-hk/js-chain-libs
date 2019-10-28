// @flow
import {
  SET_KEYS,
  SET_ACCOUNT_STATE,
  SEND_TRANSACTION
} from '../actions/account';
import type {
  SetKeysAction,
  SendTransactionAction,
  SetAccountStateAction
} from '../actions/account';
import type { Account } from './types';

export default function account(
  state: Account,
  action: SetKeysAction | SetAccountStateAction | SendTransactionAction
): Account {
  if (typeof state === 'undefined') {
    return {};
  }
  switch (action.type) {
    case SET_KEYS:
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
    case SEND_TRANSACTION:
      return Object.assign({}, state, {
        counter: action.newCounter
      });
    default:
      return state;
  }
}
