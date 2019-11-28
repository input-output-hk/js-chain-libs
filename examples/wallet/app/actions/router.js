// @flow
import { push } from 'connected-react-router';
import type { Dispatch, GetState } from '../reducers/types';
import type { Address } from '../models';
import routes from '../constants/routes';
import { loadAccountFromPrivateKey } from './account';

import {
  isAccountInfoInLocalStorage,
  readAccountKeysFromLocalStorage
} from '../utils/storage';

// eslint-disable-next-line import/prefer-default-export
export const redirectToFirstAppPage = () => {
  return (dispatch: Dispatch, getState: GetState) => {
    if (isAccountInfoInLocalStorage()) {
      readAccountKeysFromLocalStorage()
        .then(accountKeys => {
          return loadAccountFromPrivateKey(accountKeys.privateKey);
        })
        .then(() => {
          return dispatch(push(routes.WALLET));
        })
        .catch(error => console.error(error));
    }
    const {
      account: { address }
    }: { account: { address: Address } } = getState();
    if (address) {
      return dispatch(push(routes.WALLET));
    }
    return dispatch(push(routes.CHOOSE_RESTORE_OR_IMPORT));
  };
};
