// @flow
import React from 'react';
import { Redirect } from 'react-router';
import { AccountState } from '../reducers/types';
import routes from '../constants/routes.json';

export default (account: AccountState) => {
  if (!account.address) {
    return <Redirect push to={routes.INPUT_KEYS} />;
  }
  return <Redirect push to={routes.HOME} />;
};
