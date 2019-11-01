// @flow
import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import Wallet from './pages/Wallet';
import ChooseRestoreOrImport from './pages/ChooseRestoreOrImport';
import Index from './containers/Index';
import SidebarLayout from './layouts/SidebarLayout';
import InputKeys from './containers/InputKeys';

export default () => (
  <App>
    <Switch>
      <Route path={routes.WALLET} component={Wallet} />
      <Route
        path={routes.SEND}
        component={() => (
          <SidebarLayout>
            <h1>please imagine a cute send funds screen</h1>
          </SidebarLayout>
        )}
      />
      <Route
        path={routes.STAKING}
        component={() => (
          <SidebarLayout>
            <h1>please imagine a cute staking screen</h1>
          </SidebarLayout>
        )}
      />
      <Route
        path={routes.SETTINGS}
        component={() => (
          <SidebarLayout>
            <h1>please imagine a cute settings screen</h1>
          </SidebarLayout>
        )}
      />
      <Route path={routes.INPUT_KEYS} component={InputKeys} />
      <Route
        path={routes.CHOOSE_RESTORE_OR_IMPORT}
        component={ChooseRestoreOrImport}
      />
      <Route path={routes.INDEX} component={Index} />
    </Switch>
  </App>
);
