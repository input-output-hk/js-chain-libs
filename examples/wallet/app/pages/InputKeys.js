// @flow
import React from 'react';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import RestoreWalletFromPrivateKey from '../containers/RestoreWalletFromPrivateKey';
import RestoreWalletFromMnemonic from '../containers/RestoreWalletFromMnemonic';

export default () => {
  return (
    <Tabs fill defaultActiveKey="keyString" className="justify-content-center">
      <Tab eventKey="keyString" title="Use key string">
        <RestoreWalletFromPrivateKey />
      </Tab>
      <Tab eventKey="mnemonic" title="Use mnemonic phrase">
        <RestoreWalletFromMnemonic />
      </Tab>
    </Tabs>
  );
};
