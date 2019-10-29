// @flow
import React from 'react';
import type { PoolId } from '../models';

type Props = {
  stakePools: Array<PoolId>,
  onSelection: (poolId: PoolId) => void
};

export default ({ stakePools, onSelection }: Props) => {
  return (
    <div>
      <h3>Pools available</h3>
      <table>
        <thead>
          <tr>
            <th> Pool id </th>
          </tr>
        </thead>
        <tbody>
          {stakePools &&
            stakePools.map(poolId => (
              <tr key={poolId}>
                <td>{poolId}</td>
                <td>
                  <button type="button" onClick={() => onSelection(poolId)}>
                    select
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};
