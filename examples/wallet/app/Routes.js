// @flow
import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes.json';
import App from './containers/App';
import Wallet from './pages/Wallet';
import Send from './pages/Send';
import Settings from './pages/Settings';
import ChooseRestoreOrImport from './containers/ChooseRestoreOrImport';
import Delegate from './pages/Delegate';
import Index from './containers/Index';
import InputKeys from './pages/InputKeys';
import UnlockWallet from './containers/UnlockWallet';

export default () => (
  <App>
    <Switch>
      <Route path={routes.WALLET} component={Wallet} />
      <Route path={routes.SEND} component={Send} />
      <Route path={routes.STAKING} component={Delegate} />
      <Route path={routes.SETTINGS} component={Settings} />
      <Route path={routes.INPUT_KEYS} component={InputKeys} />
      <Route path={routes.UNLOCK_WALLET} component={UnlockWallet} />
      <Route
        path={routes.CHOOSE_RESTORE_OR_IMPORT}
        component={ChooseRestoreOrImport}
      />
      <Route path={routes.INDEX} component={Index} />
    </Switch>
  </App>
);
