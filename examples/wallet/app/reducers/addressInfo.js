// @flow
import { SET_ADDRESS } from '../actions/addressInfo';
import type { SetAddressAction, AddressState } from './types';

export default function addressInfo(
  state: AddressState,
  action: SetAddressAction
) {
  if (typeof address === 'undefined') {
    return { address: '--', balance: 0 };
  }
  switch (action.type) {
    case SET_ADDRESS:
      return Object.assign({}, state, { address: action.address });
    default:
      return state;
  }
}
