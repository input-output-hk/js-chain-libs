// @flow
import React, { useState } from 'react';
import { Redirect } from 'react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import routes from '../constants/routes.json';
import typeof {
  setAccountFromMnemonic as SetAccountFromMnemonic,
  setAccount as SetAccount
} from '../actions/account';
import typeof { updateNodeSettings as UpdateNodeSettings } from '../actions/nodeSettings';

type Props = {
  setAccountFromMnemonic: SetAccountFromMnemonic,
  setAccount: SetAccount,
  updateNodeSettings: UpdateNodeSettings,
  privateKey: string,
  mnemonicPhrase: string,
  mnemonicPassword: string
};

// FIXME: this has no error handling, neither while parsing the address
// nor when fetching the balance.
export default ({
  updateNodeSettings,
  setAccount,
  setAccountFromMnemonic,
  privateKey,
  mnemonicPhrase,
  mnemonicPassword
}: Props) => {
  const handleSubmitKeyString = function handleSubmitKeyString(event) {
    event.preventDefault();
    return Promise.all([setAccount(newPrivateKey), updateNodeSettings()]);
  };

  const handleSubmitMnemonic = function handleSubmitMnemonic(event) {
    event.preventDefault();
    return Promise.all([
      setAccountFromMnemonic(newMnemonicPhrase, newMnemonicPassword)
    ]);
  };

  if (privateKey) {
    return <Redirect push to={routes.WALLET} />;
  }

  const [newPrivateKey, setNewPrivateKey] = useState(privateKey);

  const [newMnemonicPhrase, setNewMnemonicPhrase] = useState(mnemonicPhrase);

  const [newMnemonicPassword, setNewMnemonicPassword] = useState(
    mnemonicPassword
  );

  return (
    <Tabs fill defaultActiveKey="keyString" className="justify-content-center">
      <Tab eventKey="keyString" title="Use key string">
        <Container>
          <Form onSubmit={handleSubmitKeyString} className="mt-5">
            <Form.Group>
              <Form.Label>Private key:</Form.Label>
              <Form.Control
                required
                type="text"
                name="privateKey"
                value={newPrivateKey}
                onChange={event => setNewPrivateKey(event.target.value)}
              />
              <Form.Text>
                It&apos;s a string like:
                <br />
                <code>
                  ed25519e_sk15psr45hyqnpwcl8xd4lv0m32prenhh8kcltgte2305h5jgynndxect9274j0am0qmmd0snjuadnm6xkgssnkn2njvkg8et8qg0vevsgnwvmpl
                </code>
              </Form.Text>
            </Form.Group>
            <Row className="justify-content-between">
              {/* TODO: bind this button */}
              <Button variant="secondary" type="button">
                Go back
              </Button>
              <Button variant="primary" type="submit">
                Initialize wallet Use key string
              </Button>
            </Row>
          </Form>
        </Container>
      </Tab>
      <Tab eventKey="mnemonic" title="Use mnemonic phrase">
        <Container>
          <Form onSubmit={handleSubmitMnemonic} className="mt-5">
            <Form.Group>
              <Form.Label>Wallet Seed:</Form.Label>
              <Form.Control
                required
                type="text"
                name="mnemonicPhrase"
                placeholder="Enter your secret twenty four word phrase here to restore your vault"
                value={newMnemonicPhrase}
                onChange={event => setNewMnemonicPhrase(event.target.value)}
              />
              <Form.Text>
                Example:
                <br />
                <code>
                  decade panther require cruise robust mail gadget advice
                  tonight post inner snack web sorry actor topple floor odor
                  lift few reflect august cousin year
                </code>
              </Form.Text>
              <Form.Control
                type="password"
                name="mnemonicPassword"
                placeholder="Secret password"
                value={newMnemonicPassword}
                onChange={event => setNewMnemonicPassword(event.target.value)}
                className="mt-3"
              />
            </Form.Group>
            <Row className="justify-content-between">
              {/* TODO: bind this button */}
              <Button variant="secondary" type="button">
                Go back
              </Button>
              <Button variant="primary" type="submit">
                Initialize wallet use mnemonic phrase
              </Button>
            </Row>
          </Form>
        </Container>
      </Tab>
    </Tabs>
  );
};
