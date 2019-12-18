// @flow
import { push } from 'connected-react-router';
import type { Dispatch, GetState } from '../reducers/types';
import type { Address } from '../models';
import routes from '../constants/routes';
import { setAccountFromPrivateKey } from './account';

import {
  isSpedingPasswordCreated,
  readAccountKeysFromDEN
} from '../utils/storage';

// eslint-disable-next-line import/prefer-default-export
export const redirectToFirstAppPage = () => {
  return (dispatch: Dispatch, getState: GetState) => {
    if (isSpedingPasswordCreated()) return dispatch(push(routes.UNLOCK_WALLET));

    const accountKeys = readAccountKeysFromDEN('manteca');
    if (accountKeys) {
      return dispatch(setAccountFromPrivateKey(accountKeys.privateKey));
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
