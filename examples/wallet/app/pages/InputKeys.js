// @flow
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import RestoreWalletFromPrivateKey from '../components/RestoreWalletFromPrivateKey';
import typeof {
  setAccountFromMnemonic as SetAccountFromMnemonic,
  setAccount as SetAccount
} from '../actions/account';
import { isValidMnemonic } from '../utils/mnemonic';

type Props = {
  setAccountFromMnemonic: SetAccountFromMnemonic,
  setAccount: SetAccount
};

// FIXME: this has no error handling, neither while parsing the address
// nor when fetching the balance.
export default ({ setAccountFromMnemonic, setAccount }: Props) => {
  const checkIsValidMnemonicPhrase = function checkIsValidMnemonicPhrase() {
    setIsMnemonicValid(isValidMnemonic(newMnemonicPhrase));
  };

  const handleSubmitMnemonic = function handleSubmitMnemonic(event) {
    event.preventDefault();
    if (isValidMnemonic(newMnemonicPhrase)) {
      setAccountFromMnemonic(newMnemonicPhrase, newMnemonicPassword);
    }
    setIsMnemonicValid(false);
  };

  const [isMnemonicValid, setIsMnemonicValid] = useState(true);

  const [newMnemonicPhrase, setNewMnemonicPhrase] = useState('');

  const [newMnemonicPassword, setNewMnemonicPassword] = useState('');

  return (
    <Tabs fill defaultActiveKey="keyString" className="justify-content-center">
      <Tab eventKey="keyString" title="Use key string">
        <RestoreWalletFromPrivateKey setAccount={setAccount} />
      </Tab>
      <Tab eventKey="mnemonic" title="Use mnemonic phrase">
        <Container>
          <Form onSubmit={handleSubmitMnemonic} className="mt-5">
            <Form.Group>
              <Form.Label>Wallet Seed:</Form.Label>
              <Form.Control
                required
                type="text"
                id="mnemonicPhrase"
                name="mnemonicPhrase"
                placeholder="Enter your secret word phrase here to restore your vault. The phrase can have 12, 15, 18, 21 or 24 words."
                value={newMnemonicPhrase}
                isInvalid={!isMnemonicValid}
                onChange={event => setNewMnemonicPhrase(event.target.value)}
                onBlur={() => checkIsValidMnemonicPhrase()}
              />
              <Form.Label className="text-danger" hidden={isMnemonicValid}>
                <code>
                  The phrase can have 12, 15, 18, 21 or 24 valid words.
                </code>
              </Form.Label>
              <Form.Text>
                Example:
                <br />
                <code>
                  decade panther require cruise robust mail gadget advice
                  tonight post inner snack
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
                Initialize wallet using mnemonic phrase
              </Button>
            </Row>
          </Form>
        </Container>
      </Tab>
    </Tabs>
  );
};
