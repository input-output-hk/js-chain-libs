// @flow
import React from 'react';
import AccountInfo from '../containers/AccountInfo';
import SendTransaction from '../containers/SendTransaction';

export default () => {
  return (
    <div>
      <h2> Account Info</h2>
      <AccountInfo />
      <hr />
      <h2> Send funds</h2>
      <SendTransaction />
    </div>
  );
};
