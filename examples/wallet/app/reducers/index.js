// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import account from './account';
import nodeSettings from './nodeSettings';

export default function createRootReducer(history: History) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    account,
    nodeSettings
  });
}
