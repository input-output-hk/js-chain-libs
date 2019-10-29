// @flow
import React, { useState } from 'react';
import type { PoolId } from '../models';
import typeof { sendStakeDelegation as SendStakeDelegation } from '../actions/account';
import StakePoolList from '../containers/StakePoolList';

type Props = {
  sendStakeDelegation: SendStakeDelegation
};

export default ({ sendStakeDelegation }: Props) => {
  const [poolId, setPoolId] = useState<PoolId>('');

  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    sendStakeDelegation(poolId);
  };

  return (
    <div>
      <h2>Stake Delegation</h2>
      <StakePoolList onSelection={setPoolId} />
      <h3>Delegate to an specific pool</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="poolId">
          Pool id:
          <input
            type="text"
            name="poolId"
            value={poolId}
            onChange={event => setPoolId(event.target.value)}
          />
        </label>
        <input type="submit" value="Delegate!" />
      </form>
    </div>
  );
};
