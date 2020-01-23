// @flow
import type { Dispatch } from 'redux';
import type { NodeSettings } from '../reducers/types';
import nodeConnectionBuilder from '../utils/nodeConnection';

const { getNodeSettings } = nodeConnectionBuilder();

export const UPDATE_NODE_SETTINGS = 'UPDATE_NODE_SETTINGS';
export const ACCOUNT_STATE_ERROR = 'ACCOUNT_STATE_ERROR';

export type UpdateNodeSettingsAction = {
  type: 'UPDATE_NODE_SETTINGS',
  nodeSettings: NodeSettings
};

export function updateNodeSettings(): (
  dispatch: Dispatch<UpdateNodeSettingsAction>
) => Promise<UpdateNodeSettingsAction> {
  return function updateNodeSettingsThunk(dispatch) {
    return (
      getNodeSettings()
        .then(nodeSettings =>
          dispatch({
            type: UPDATE_NODE_SETTINGS,
            nodeSettings
          })
        )
        // TODO: display a notification or something
        // FIXME since this is not called periodically, it should be retried
        .catch(() => {
          return Promise.reject(new Error(ACCOUNT_STATE_ERROR));
        })
    );
  };
}
