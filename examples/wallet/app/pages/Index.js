// @flow
import React from 'react';
import { Redirect } from 'react-router';
import type { Account } from '../reducers/types';
import routes from '../constants/routes.json';

export default (account: Account) => {
  if (!account.address) {
    return <Redirect push to={routes.CHOOSE_RESTORE_OR_IMPORT} />;
  }
  return <Redirect push to={routes.WALLET} />;
};
