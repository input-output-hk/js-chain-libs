// @flow
import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import addressInfo from './addressInfo';

export default function createRootReducer(history: History) {
  return combineReducers<{}, *>({
    router: connectRouter(history),
    addressInfo
  });
}
