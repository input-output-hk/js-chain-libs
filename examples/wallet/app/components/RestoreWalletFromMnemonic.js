// @flow
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import typeof { setAccountFromMnemonic as SetAccountFromMnemonic } from '../actions/account';
import { isValidMnemonic } from '../utils/mnemonic';

type Props = {
  setAccountFromMnemonic: SetAccountFromMnemonic
};

export default ({ setAccountFromMnemonic }: Props) => {
  const checkIsValidMnemonicPhrase = function checkIsValidMnemonicPhrase() {
    setIsMnemonicValid(isValidMnemonic(newMnemonicPhrase));
  };

  const handleSubmitMnemonic = function handleSubmitMnemonic(event) {
    event.preventDefault();
    if (isValidMnemonic(newMnemonicPhrase)) {
      if (checkValidUnlockWalletPassword(password, confirmPassword)) {
        return setAccountFromMnemonic(
          newMnemonicPhrase,
          newMnemonicPassword,
          password
        );
      }
    } else {
      setIsMnemonicValid(false);
    }
  };

  const [isMnemonicValid, setIsMnemonicValid] = useState(true);

  const [newMnemonicPhrase, setNewMnemonicPhrase] = useState('');

  const [newMnemonicPassword, setNewMnemonicPassword] = useState('');

  const checkValidUnlockWalletPassword = function checkValidUnlockWalletPassword(
    pass,
    confirmation
  ) {
    if (!pass && !confirmation) return true;
    if (pass.length < 8) {
      setIsValidPassword(false);
      return false;
    }
    setIsValidPassword(true);

    if (pass !== confirmation) {
      setArePasswordAndConfirmationEqual(false);
      return false;
    }
    setArePasswordAndConfirmationEqual(true);
    return true;
  };

  const [
    arePasswordAndConfirmationEqual,
    setArePasswordAndConfirmationEqual
  ] = useState(true);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(true);

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
          <Form.Label className="text-danger" hidden={isMnemonicValid}>
            <code>The phrase can have 12, 15, 18, 21 or 24 valid words.</code>
          </Form.Label>
          <Form.Text>
            Example:
            <br />
            <code>
              decade panther require cruise robust mail gadget advice tonight
              post inner snack
            </code>
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
            This secret password is part of the BIP39 standard to generate safer
            wallet seeds.
          </Form.Text>
          <Form.Label className="mt-5">Unlock wallet (optional):</Form.Label>
          <Form.Group>
            <Form.Control
              type="password"
              id="password"
              name="password"
              placeholder="New password (min 8 chars)"
              value={password}
              isInvalid={!isValidPassword}
              onChange={event => setPassword(event.target.value)}
            />
            <Form.Label className="text-danger" hidden={isValidPassword}>
              <code>The password must have at least 8 chars.</code>
            </Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={event => setConfirmPassword(event.target.value)}
              className="mt-3"
            />
            <Form.Text>
              This key allows you to unlock your wallet every time you start it
              and to keep your account data in a more secure way.
            </Form.Text>
            <Form.Label
              className="text-danger"
              hidden={arePasswordAndConfirmationEqual}
            >
              <code>password and confirmation must be the same.</code>
            </Form.Label>
          </Form.Group>
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
