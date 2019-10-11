// @flow
import { SET_ACCOUNT } from '../actions/account';
import type { SetAccountAction, AccountState } from './types';

export default function account(
  state: AccountState,
  action: SetAccountAction
): AccountState {
  if (typeof state === 'undefined') {
    return {};
  }
  switch (action.type) {
    case SET_ACCOUNT:
      return action.account;
    default:
      return state;
  }
}
