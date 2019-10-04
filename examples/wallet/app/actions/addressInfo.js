// @flow
import type { Dispatch } from 'redux';
import { getBalance } from '../utils/nodeConnection';
import { Address, Balance } from '../models';

export const SET_ADDRESS = 'SET_ADDRESS';

export type SetAddressAction = {
  type: 'SET_ADDRESS',
  address: Address,
  balance: Balance
};

export function setAddress(address: string) {
  return function setAddressAndRefreshBalance(
    dispatch: Dispatch<SetAddressAction>
  ) {
    // FIXME: we should add the logic to convert from the address to the accountId.
    // currently, it only works if the accountId is passed instead.
    return getBalance(address).then(balance =>
      dispatch({
        type: SET_ADDRESS,
        address,
        balance
      })
    );
  };
}
