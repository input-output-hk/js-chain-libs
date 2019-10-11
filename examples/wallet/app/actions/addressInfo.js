// @flow
import type { Dispatch } from 'redux';
import { getBalance } from '../utils/nodeConnection';

const wasmBindings = import('js-chain-libs/js_chain_libs');

export const SET_ADDRESS = 'SET_ADDRESS';

export type SetAddressAction = {
  type: 'SET_ADDRESS',
  address: string,
  balance: string
};

export function setAddress(addressStr: string) {
  return function setAddressAndRefreshBalance(
    dispatch: Dispatch<SetAddressAction>
  ) {
    return wasmBindings
      .then(({ Account, Address }) => {
        const address = Address.from_string(addressStr);
        const accountId = Account.from_address(address)
          .to_identifier()
          .to_hex();
        return getBalance(accountId);
      })
      .then(balance =>
        dispatch({
          type: SET_ADDRESS,
          address: addressStr,
          balance
        })
      );
  };
}
