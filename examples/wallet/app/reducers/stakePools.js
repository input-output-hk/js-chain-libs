// @flow
import { SET_STAKEPOOLS } from '../actions/stakePools';
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
    case SET_STAKEPOOLS:
      return Object.assign(state, { availablePools: action.stakePools });
    default:
      return state;
  }
}
