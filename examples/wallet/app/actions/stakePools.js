// @flow
import type { Dispatch } from 'redux';
import type { Pool } from '../models';
import { getStakePools } from '../utils/nodeConnection';

export type SetStakePoolsAction = {
  type: 'STAKEPOOL_INFO_UPDATED',
  stakePools: Array<Pool>
};
export const STAKEPOOL_INFO_UPDATED = 'STAKEPOOL_INFO_UPDATED';

export function setStakePools(): (
  dispatch: Dispatch<SetStakePoolsAction>
) => Promise<mixed> {
  return function setStakePoolsThunk(dispatch) {
    return (
      getStakePools()
        .then((stakePools: Array<Pool>) =>
          dispatch({
            type: STAKEPOOL_INFO_UPDATED,
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
