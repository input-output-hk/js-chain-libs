// @flow
import {
  SET_KEYS,
  SET_ACCOUNT_STATE,
  SEND_TRANSACTION,
  SEND_STAKE_DELEGATION
} from '../actions/account';
import type {
  SetKeysAction,
  SendTransactionAction,
  SetAccountStateAction,
  SendStakeDelegation
} from '../actions/account';
import type { Account } from './types';

export default function account(
  state: Account,
  // eslint-disable-next-line flowtype/space-after-type-colon
  action:
    | SetKeysAction
    | SetAccountStateAction
    | SendTransactionAction
    | SendStakeDelegation
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
    case SEND_STAKE_DELEGATION:
      return Object.assign({}, state, {
        counter: action.newCounter
      });
    default:
      return state;
  }
}
