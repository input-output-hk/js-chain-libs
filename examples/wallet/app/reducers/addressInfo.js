// @flow
import { SET_ADDRESS } from '../actions/addressInfo';
import type { SetAddressAction, AddressState } from './types';

export default function addressInfo(
  state: AddressState,
  action: SetAddressAction
) {
  if (typeof state === 'undefined') {
    return { address: '--', balance: 0 };
  }
  switch (action.type) {
    case SET_ADDRESS:
      return Object.assign({}, state, {
        address: action.address,
        balance: action.balance
      });
    default:
      return state;
  }
}
