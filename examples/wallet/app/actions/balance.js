// @flow
// FIXME: why isn't GetSate available?
import type { Dispatch } from 'redux';
import { getBalance } from '../utils/nodeConnection';
import { Balance } from '../models';
import { AppState } from '../reducers/types';

export const SET_BALANCE = 'SET_BALANCE';

export type SetBalanceAction = {
  type: 'SET_BALANCE',
  balance: Balance
};

type GetState = () => AppState;

export function updateBalance(): (
  dispatch: Dispatch<SetBalanceAction>,
  getState: GetState
) => Promise<SetBalanceAction> {
  return function updateBalanceThunk(dispatch, getState) {
    return getBalance(getState().account.identifier).then(balance =>
      dispatch({
        type: SET_BALANCE,
        balance
      })
    );
  };
}
