// @flow
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

// eslint-disable-next-line react/prop-types
export default ({ setValidUnlockWalletPassword }) => {
  const checkValidUnlockWalletPassword = function checkValidUnlockWalletPassword(
    pass
  ) {
    setIsValidPassword(true);
    if (!pass) {
      setIsValidPassword(false);
      return false;
    }
    if (pass.length < 8) {
      setIsValidPassword(false);
      return false;
    }
  };

  const checkValidUnlockWalletConfirmation = function checkValidUnlockWalletConfirmation(
    unlockWalletPassword,
    confirmation
  ) {
    setArePasswordAndConfirmationEqual(true);
    let isValidUnlockPassword = true;
    if (!confirmation || confirmation.length < 8) {
      isValidUnlockPassword = false;
    }

    if (unlockWalletPassword !== confirmation) {
      setArePasswordAndConfirmationEqual(false);
      isValidUnlockPassword = false;
    }

    setValidUnlockWalletPassword(unlockWalletPassword, isValidUnlockPassword);
    return isValidUnlockPassword;
  };

  const [
    arePasswordAndConfirmationEqual,
    setArePasswordAndConfirmationEqual
  ] = useState(true);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isValidPassword, setIsValidPassword] = useState(true);

  return (
    <Form.Group>
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
          onBlur={() => checkValidUnlockWalletPassword(password)}
        />
        <Form.Control.Feedback type="invalid">
          The password must have at least 8 chars.
        </Form.Control.Feedback>
        <Form.Control
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm password"
          value={confirmPassword}
          isInvalid={!arePasswordAndConfirmationEqual}
          onChange={event => setConfirmPassword(event.target.value)}
          onBlur={() =>
            checkValidUnlockWalletConfirmation(password, confirmPassword)
          }
          className="mt-3"
        />
        <Form.Text>
          <span>
            This key allows you to unlock your wallet every time you start it
            and to keep your account data in a more secure way.
          </span>
        </Form.Text>
        <Form.Control.Feedback type="invalid">
          password and confirmation must be the same.
        </Form.Control.Feedback>
      </Form.Group>
    </Form.Group>
  );
};
