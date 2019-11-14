// @flow
import type { Dispatch } from 'redux';
import type { PoolId } from '../models';
import { getStakePools } from '../utils/nodeConnection';

export type SetStakePoolsAction = {
  type: 'SET_STAKEPOOLS',
  stakePools: Array<PoolId>
};
export const SET_STAKEPOOLS = 'SET_STAKEPOOLS';

export function setStakePools(): (
  dispatch: Dispatch<SetStakePoolsAction>
) => Promise<SetStakePoolsAction> {
  return function setStakePoolsThunk(dispatch) {
    return (
      getStakePools()
        .then((stakePools: Array<PoolId>) =>
          dispatch({
            type: SET_STAKEPOOLS,
            stakePools
          })
        )
        // TODO: display a notification or something
        .catch(() =>
          console.error('there was an error fetching stake pools info')
        )
    );
  };
}
