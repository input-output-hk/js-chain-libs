// @flow
import { getBalance } from '../utils/nodeConnection';

export const SET_ADDRESS = 'SET_ADDRESS';

export function oldSetAddress(address) {
  return {
    type: SET_ADDRESS,
    address
  };
}

export function setAddress(address) {
  return function setAddressAndRefreshBalance(dispatch) {
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
