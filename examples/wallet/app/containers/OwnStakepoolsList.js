// @flow
import { connect } from 'react-redux';
import type { AppState } from '../reducers/types';
import type { Pool, PoolId } from '../models';
import OwnStakepoolsList from '../components/OwnStakepoolsList';

export type GetOnlyOwnStakepools = typeof getOnlyOwnStakepools;

export function getOnlyOwnStakepools(
  state: AppState
): { stakePools: Array<PoolId> } {
  const {
    stakePools: { availablePools },
    account: { publicKey }
  } = state;
  console.log(availablePools);
  return {
    stakePools: availablePools
      .filter(
        (pool: Pool) =>
          pool.owners.find(it => it === publicKey) ||
          pool.operators.find(it => it === publicKey)
      )
      .map(({ id }) => id)
  };
}

export default connect(getOnlyOwnStakepools)(OwnStakepoolsList);
