// @flow
import { SET_BALANCE } from '../actions/balance';
import type { SetBalanceAction } from '../actions/balance';
import type { Balance } from '../models';

export default function account(
  state: Balance,
  action: SetBalanceAction
): Balance {
  if (typeof state === 'undefined') {
    return 0;
  }
  switch (action.type) {
    case SET_BALANCE:
      return action.balance;
    default:
      return state;
  }
}
