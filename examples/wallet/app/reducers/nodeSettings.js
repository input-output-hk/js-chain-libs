// @flow
import { UPDATE_NODE_SETTINGS } from '../actions/nodeSettings';
import type { UpdateNodeSettingsAction } from '../actions/nodeSettings';
import type { NodeSettings } from './types';

export default function nodeSettings(
  state: NodeSettings,
  action: UpdateNodeSettingsAction
): NodeSettings {
  if (typeof state === 'undefined') {
    return { fees: {} };
  }
  switch (action.type) {
    case UPDATE_NODE_SETTINGS:
      return action.nodeSettings;
    default:
      return state;
  }
}
