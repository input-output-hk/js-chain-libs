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

// FIXME: this has no error handling, neither while parsing the address
// nor when fetching the balance.
export default ({ setAccountFromMnemonic }: Props) => {
  const handleSubmitCreateSpending = function handleSubmitCreateSpending(
    event
  ) {
    event.preventDefault();
    if (isValidMnemonic(newMnemonicPhrase)) {
      return Promise.all([
        setAccountFromMnemonic(newMnemonicPhrase, newMnemonicPassword)
      ]);
    }
    setIsMnemonicValid(false);
  };

  const [isMnemonicValid, setIsMnemonicValid] = useState(true);

  const [newMnemonicPhrase, setNewMnemonicPhrase] = useState('');

  const [newMnemonicPassword, setNewMnemonicPassword] = useState('');

  return (
    <Container>
      <Form onSubmit={handleSubmitCreateSpending} className="mt-5">
        <Form.Group>
          <Form.Label>Create your new wallet password:</Form.Label>
          <Form.Control
            required
            type="password"
            id="mnemonicPhrase"
            name="mnemonicPhrase"
            placeholder="New password (min 8 chars)"
            value={newMnemonicPhrase}
            isInvalid={!isMnemonicValid}
            onChange={event => setNewMnemonicPhrase(event.target.value)}
          />
          <Form.Label className="text-danger" hidden={isMnemonicValid}>
            <code>You should not share your password with others.</code>
          </Form.Label>
          <Form.Control
            type="password"
            name="mnemonicPassword"
            placeholder="Confirm password"
            value={newMnemonicPassword}
            onChange={event => setNewMnemonicPassword(event.target.value)}
            className="mt-3"
          />
        </Form.Group>
        <Row className="justify-content-center">
          <Button variant="primary" type="submit">
            Create
          </Button>
        </Row>
      </Form>
    </Container>
  );
};
