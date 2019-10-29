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
import typeof { setAccount as SetAccount } from '../actions/account';
import typeof { updateNodeSettings as UpdateNodeSettings } from '../actions/nodeSettings';

type Props = {
  setAccount: SetAccount,
  updateNodeSettings: UpdateNodeSettings,
  privateKey: string
};

// FIXME: this has no error handling, neither while parsing the address
// nor when fetching the balance.
export default ({ updateNodeSettings, setAccount, privateKey }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    return Promise.all([setAccount(newPrivateKey), updateNodeSettings()]);
  };

  if (privateKey) {
    return <Redirect push to={routes.HOME} />;
  }

  const [newPrivateKey, setNewPrivateKey] = useState(privateKey);

  return (
    <Tabs fill defaultActiveKey="keyString" className="justify-content-center">
      <Tab eventKey="keyString" title="Use key string">
        <Container>
          <Form onSubmit={handleSubmit}>
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
                Initialize wallet
              </Button>
            </Row>
          </Form>
        </Container>
      </Tab>
      <Tab eventKey="mnemonic" title="Use mnemonic phrase">
        <Container>
          <p>Under construction</p>
        </Container>
      </Tab>
    </Tabs>
  );
};
