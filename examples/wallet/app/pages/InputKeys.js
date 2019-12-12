// @flow
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
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
