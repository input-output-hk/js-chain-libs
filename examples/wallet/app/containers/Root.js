// @flow
import React from 'react';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { hot } from 'react-hot-loader/root';
import config from 'config';
import type { Store } from '../reducers/types';
import Routes from '../Routes';
import {
  updateAccountState,
  updateAccountTransactions
} from '../actions/account';
import { setStakePools } from '../actions/stakePools';
import { updateNodeSettings } from '../actions/nodeSettings';
import { createBlockSubscription } from '../utils/nodeConnection';

type Props = {
  store: Store,
  history: {}
};

const Root = ({ store, history }: Props) => {
  // This does not take into consideration what happeneda to the last request
  // if the previous request didn't finish, it just launches another one.
  // this of course causes race conditions and it can be problematic to open infinite
  // connections, but in the near future we should subscribe to the gRPC gossip and
  // no longer require polling.
  store.dispatch(updateNodeSettings()).then(() =>
    runInmmediatelyAndSetInterval(
      () => {
        if (!window.newBlocksReader) {
          const { block0Hash } = store.getState().nodeSettings;
          if (block0Hash) {
            console.log('initializing new block stream reader');
            window.newBlocksReader = createBlockSubscription(block0Hash);
            window.newBlocksReader.on('data', () =>
              Promise.all([
                store.dispatch(updateAccountState()),
                store.dispatch(setStakePools()),
                store.dispatch(updateAccountTransactions())
              ])
            );
            window.newBlocksReader.on('error', error =>
              console.error('block stream reader erroed: ', error)
            );
            window.newBlocksReader.on('status', status =>
              console.log('block stream reader reported status: ', status)
            );
          } else {
            console.log('cant update blocks without a genesis block hash');
          }
        } else {
          console.log('block stream reader is OK');
        }
      },
      config.get('accountPollingInterval'),
      'blockReaderUpdater'
    )
  );
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <Routes />
      </ConnectedRouter>
    </Provider>
  );
};

export default hot(Root);

const runInmmediatelyAndSetInterval = (
  func: void => void,
  interval: number,
  timerName: string
): void => {
  func();
  if (!window.periodicTimers) {
    window.periodicTimers = {};
  }
  if (!window.periodicTimers[timerName]) {
    window.periodicTimers[timerName] = setInterval(func, interval);
  }
};
