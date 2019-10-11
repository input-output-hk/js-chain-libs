// @flow
import React from 'react';

type Props = {
  balance: number,
  address: string
};

export default ({ balance, address }: Props) => {
  return (
    <div>
      <p>Current Address: {address}</p>
      <p>Balance: {balance}</p>
    </div>
  );
};
