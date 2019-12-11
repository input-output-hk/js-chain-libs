// @flow
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import typeof { setAccountFromMnemonic as SetAccountFromMnemonic } from '../actions/account';

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
    if (checkValidPassword(password, confirmPassword)) {
      return Promise.all([setAccountFromMnemonic(password, confirmPassword)]);
    }
  };

  const checkValidPassword = function checkValidPassword(pass, confirmation) {
    if (!pass) return false;
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

  const [isValidPassword, setIsValidPassword] = useState(true);
  const [
    arePasswordAndConfirmationEqual,
    setArePasswordAndConfirmationEqual
  ] = useState(true);

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <Container>
      <Form onSubmit={handleSubmitCreateSpending} className="mt-5">
        <Form.Group>
          <Form.Label>Create a password for your encrypted storage</Form.Label>
          <Form.Control
            required
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
          <Form.Label
            className="text-danger"
            hidden={arePasswordAndConfirmationEqual}
          >
            <code>password and confirmation must be the same.</code>
          </Form.Label>
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
