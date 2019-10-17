// @flow
import type { Dispatch } from 'redux';
import { NodeSettings } from '../reducers/types';
import { getNodeSettings } from '../utils/nodeConnection';

export const UPDATE_NODE_SETTINGS = 'UPDATE_NODE_SETTINGS';

export type UpdateNodeSettingsAction = {
  type: 'UPDATE_NODE_SETTINGS',
  nodeSettings: NodeSettings
};

export function updateNodeSettings(): (
  dispatch: Dispatch<UpdateNodeSettingsAction>
) => Promise<UpdateNodeSettingsAction> {
  return function updateNodeSettingsThunk(dispatch) {
    return getNodeSettings().then(nodeSettings =>
      dispatch({
        type: UPDATE_NODE_SETTINGS,
        nodeSettings
      })
    );
  };
}
