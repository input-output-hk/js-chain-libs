// @flow
import React from 'react';
import type { Account } from '../reducers/types';

type Props = {
  account: Account
};

export default ({ account }: Props) => {
  return (
    <div>
      <p>Current Address: {account.address}</p>
      <p>Balance: {account.balance}</p>
    </div>
  );
};
