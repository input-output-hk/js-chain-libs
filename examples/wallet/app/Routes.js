// @flow
import React from 'react';
import { Switch, Route } from 'react-router';
import routes from './constants/routes';
import App from './containers/App';
import Home from './components/Home';
import ChooseRestoreOrImport from './components/ChooseRestoreOrImport';
import Index from './containers/Index';
import InputKeys from './containers/InputKeys';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOME} component={Home} />
      <Route path={routes.INPUT_KEYS} component={InputKeys} />
      <Route
        path={routes.CHOOSE_RESTORE_OR_IMPORT}
        component={ChooseRestoreOrImport}
      />
      <Route path={routes.INDEX} component={Index} />
    </Switch>
  </App>
);
