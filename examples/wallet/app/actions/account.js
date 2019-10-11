// @flow
import { AccountState } from '../reducers/types';

export const SET_ACCOUNT = 'SET_ACCOUNT';

export type SetAccountAction = {
  type: 'SET_ACCOUNT',
  account: AccountState
};

export function setAccount(account: AccountState): SetAccountAction {
  return {
    type: SET_ACCOUNT,
    account
  };
}
