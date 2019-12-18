// @flow
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import typeof { setAccount as SetAccount } from '../actions/account';

type Props = {
  setAccount: SetAccount
};

// FIXME: this has no error handling, neither while parsing the address
// nor when fetching the balance.
export default ({ setAccount }: Props) => {
  const handleSubmitCreateSpending = function handleSubmitCreateSpending(
    event
  ) {
    event.preventDefault();
    if (mustCreateSpendingPassword) {
      if (checkValidPassword(password, confirmPassword)) {
        setAccount(newPrivateKey, password);
      }
    } else {
      setAccount(newPrivateKey, '');
    }
  };

  const handleCheckCreateSpendingPassword = function handleCheckCreateSpendingPassword(
    evt
  ) {
    setMustCreateSpendingPassword(evt.target.checked);
    setHiddenSpendingPassword(!evt.target.checked);
  };

  const checkValidPassword = function checkValidPassword(pass, confirmation) {
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

  const [isValidPassword, setIsValidPassword] = useState(true);
  const [newPrivateKey, setNewPrivateKey] = useState('');
  const [mustCreateSpendingPassword, setMustCreateSpendingPassword] = useState(
    true
  );
  const [hiddenSpendingPassword, setHiddenSpendingPassword] = useState(false);

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
          <Form.Group
            controlId="formCreateSpendingPasswordCheck"
            className="mt-4"
          >
            <Form.Check
              type="switch"
              label="Create a password to store your settings securely in an encrypted
              storage"
              onChange={event => handleCheckCreateSpendingPassword(event)}
            />
          </Form.Group>
          <Form.Group hidden={hiddenSpendingPassword}>
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
            <Form.Label
              className="text-danger"
              hidden={arePasswordAndConfirmationEqual}
            >
              <code>Password and confirmation must be the same.</code>
            </Form.Label>
          </Form.Group>
        </Form.Group>
        <Row className="justify-content-center">
          <Button variant="primary" type="submit">
            Initialize wallet using key string
          </Button>
        </Row>
      </Form>
    </Container>
  );
};
