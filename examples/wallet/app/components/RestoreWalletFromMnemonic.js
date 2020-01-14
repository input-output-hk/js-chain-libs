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
    if (pass !== confirmation) {
      setArePasswordAndConfirmationEqual(false);
      return false;
    }
    setArePasswordAndConfirmationEqual(true);

    if (!/^[0-9a-zA-Z]{8,}$/.test(password)) {
      setIsValidPassword(false);
      return false;
    }

    setIsValidPassword(true);
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
            <em className="text-danger">
              The phrase can have 12, 15, 18, 21 or 24 valid words.
            </em>
          </Form.Label>
          <Form.Text>
            Example:
            <br />
            <em className="text-danger">
              decade panther require cruise robust mail gadget advice tonight
              post inner snack
            </em>
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
            <em className="text-danger">
              This secret password is part of the BIP39 standard to generate
              safer wallet seeds.
            </em>
          </Form.Text>
          <Form.Label className="mt-5">Unlock wallet:</Form.Label>
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
              <em className="text-danger">
                The password must have at least 8 chars.
              </em>
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
              <em className="text-danger">
                This key allows you to unlock your wallet every time you start
                it and to keep your account data in a more secure way.
              </em>
            </Form.Text>
            <Form.Label
              className="text-danger"
              hidden={arePasswordAndConfirmationEqual}
            >
              <em className="text-danger">
                password and confirmation must be the same.
              </em>
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
