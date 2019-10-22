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
      <table>
        <thead>
          <tr>
            <th> pool id </th>
            <th> amount </th>
          </tr>
        </thead>
        <tbody>
          {account.delegation &&
            account.delegation.map(({ amount, poolId }) => (
              <tr key={poolId}>
                <td>{poolId}</td>
                <td>{amount}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
