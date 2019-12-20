// @flow
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';

// FIXME: this has no error handling, neither while parsing the address
// nor when fetching the balance.
export default () => {
  const [isValidPassword, setIsValidPassword] = useState(true);

  const checkValidSpendingPassword = function checkValidSpendingPassword() {
    if (password && password.length < 8) {
      setIsValidPassword(false);
    } else {
      setIsValidPassword(true);
    }
  };

  const checkValidEqualPasswords = function checkValidEqualPasswords() {
    checkValidSpendingPassword();
    if (password !== confirmPassword) {
      setArePasswordAndConfirmationEqual(false);
    } else {
      setArePasswordAndConfirmationEqual(true);
    }
  };

  const [
    arePasswordAndConfirmationEqual,
    setArePasswordAndConfirmationEqual
  ] = useState(true);

  const [password, setPassword] = useState('');

  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <Container className="mt-3">
      <Form.Group>
        <Form.Control
          type="password"
          id="password"
          name="password"
          placeholder="New password (min 8 chars)"
          value={password}
          isInvalid={!isValidPassword}
          onChange={event => setPassword(event.target.value)}
          onBlur={() => checkValidSpendingPassword()}
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
          onBlur={() => checkValidEqualPasswords()}
          className="mt-3"
        />
        <Form.Label
          className="text-danger"
          hidden={arePasswordAndConfirmationEqual}
        >
          <code>Password and confirmation must be the same.</code>
        </Form.Label>
      </Form.Group>
    </Container>
  );
};
