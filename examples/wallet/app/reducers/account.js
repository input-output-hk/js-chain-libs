// @flow
import {
  SET_KEYS,
  SET_BALANCE_AND_COUNTER,
  SEND_TRANSACTION
} from '../actions/account';
import type {
  SetKeysAction,
  SetBalanceAndCounterAction
} from '../actions/account';
import type { AccountState } from './types';

export default function account(
  state: AccountState,
  action: SetKeysAction | SetBalanceAndCounterAction
): AccountState {
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
    case SET_BALANCE_AND_COUNTER:
      return Object.assign({}, state, {
        balance: action.balance,
        counter: action.counter
      });
    case SEND_TRANSACTION:
      return Object.assign({}, state, {
        counter: action.newCounter
      });
    default:
      return state;
  }
}
