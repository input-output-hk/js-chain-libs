// @flow
import { STAKEPOOL_INFO_UPDATED } from '../actions/stakePools';
import type { StakePools } from './types';
import type { SetStakePoolsAction } from '../actions/stakePools';

export default function stakePools(
  state: StakePools,
  action: SetStakePoolsAction
): StakePools {
  if (typeof state === 'undefined') {
    return { availablePools: [] };
  }
  switch (action.type) {
    case STAKEPOOL_INFO_UPDATED:
      return Object.assign(state, { availablePools: action.stakePools });
    default:
      return state;
  }
}
