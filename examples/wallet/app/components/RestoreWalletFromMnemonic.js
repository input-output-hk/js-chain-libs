// @flow
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import typeof { setAccountFromMnemonic as SetAccountFromMnemonic } from '../actions/account';
import { isValidMnemonic } from '../utils/mnemonic';
import CreateUnlockWalletPassword from '../containers/CreateUnlockWalletPassword';

type Props = {
  setAccountFromMnemonic: SetAccountFromMnemonic,
  unlockWalletPassword: string,
  isValidUnlockPassword: boolean
};

export default ({
  setAccountFromMnemonic,
  unlockWalletPassword,
  isValidUnlockPassword
}: Props) => {
  const checkIsValidMnemonicPhrase = function checkIsValidMnemonicPhrase() {
    setIsMnemonicValid(isValidMnemonic(newMnemonicPhrase));
  };

  const handleSubmitMnemonic = function handleSubmitMnemonic(event) {
    event.preventDefault();
    if (isValidMnemonic(newMnemonicPhrase)) {
      // TODO: ADD IF SENTENCE TO CHECK IF PASSWORD AND CONFIRM IS OK
      if (isValidUnlockPassword) {
        return setAccountFromMnemonic(
          newMnemonicPhrase,
          newMnemonicPassword,
          unlockWalletPassword
        );
      }
    }
    setIsMnemonicValid(false);
  };

  const [isMnemonicValid, setIsMnemonicValid] = useState(true);

  const [newMnemonicPhrase, setNewMnemonicPhrase] = useState('');

  const [newMnemonicPassword, setNewMnemonicPassword] = useState('');

  return (
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
          <Form.Control.Feedback type="invalid">
            The phrase can have 12, 15, 18, 21 or 24 valid words.
          </Form.Control.Feedback>
          <Form.Text>
            Example:
            <br />
            <span>
              decade panther require cruise robust mail gadget advice tonight
              post inner snack
            </span>
          </Form.Text>
          <Form.Control
            type="password"
            name="mnemonicPassword"
            placeholder="Secret password of wallet seed"
            value={newMnemonicPassword}
            onChange={event => setNewMnemonicPassword(event.target.value)}
            className="mt-3"
          />
          <Form.Text>
            <span>
              This secret password is part of the BIP39 standard to generate
              safer wallet seeds.
            </span>
          </Form.Text>
          <CreateUnlockWalletPassword />
        </Form.Group>
        <Row className="justify-content-between">
          <Button variant="secondary" type="button">
            Go back
          </Button>
          <Button variant="primary" type="submit">
            Initialize wallet using mnemonic phrase
          </Button>
        </Row>
      </Form>
    </Container>
  );
};
