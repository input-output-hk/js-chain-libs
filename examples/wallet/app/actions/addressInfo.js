// @flow
import type { GetState, Dispatch } from '../reducers/types';

export const SET_ADDRESS = 'SET_ADDRESS';

export function setNewAddress(address) {
  return {
    type: SET_ADDRESS,
    address
  };
}
