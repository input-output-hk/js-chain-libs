// @flow
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import typeof { setAccount as SetAccount } from '../actions/account';
import CreateUnlockWalletPassword from '../containers/CreateUnlockWalletPassword';
import { getAccountFromPrivateKey } from '../utils/wasmWrapper';

type Props = {
  setAccount: SetAccount,
  unlockWalletPassword: string,
  isValidUnlockPassword: boolean
};

// FIXME: this has no error handling, neither while parsing the address
// nor when fetching the balance.
export default ({
  setAccount,
  unlockWalletPassword,
  isValidUnlockPassword
}: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    if (isValidUnlockPassword) {
      return setAccount(newPrivateKey, unlockWalletPassword).catch(error => {
        console.error(error);
        setPrivateKeyErrorMessage('Invalid private key');
      });
    }
  };

  const checkValidPrivateKey = function checkValidPrivateKey() {
    getAccountFromPrivateKey(newPrivateKey)
      .then(() => setPrivateKeyErrorMessage(''))
      .catch(error => {
        console.error(error);
        setPrivateKeyErrorMessage('Invalid private key');
      });
  };

  const [newPrivateKey, setNewPrivateKey] = useState('');
  const [privateKeyErrorMessage, setPrivateKeyErrorMessage] = useState('');

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="mt-5">
        <Form.Group>
          <Form.Label>Private key:</Form.Label>
          <Form.Control
            required
            type="text"
            name="privateKey"
            value={newPrivateKey}
            isInvalid={privateKeyErrorMessage}
            onChange={event => setNewPrivateKey(event.target.value)}
            onBlur={() => checkValidPrivateKey()}
          />
          <Form.Control.Feedback type="invalid">
            {privateKeyErrorMessage}
          </Form.Control.Feedback>
          <Form.Text>
            It&apos;s a string like:
            <br />
            <span>
              ed25519e_sk15psr45hyqnpwcl8xd4lv0m32prenhh8kcltgte2305h5jgynndxect9274j0am0qmmd0snjuadnm6xkgssnkn2njvkg8et8qg0vevsgnwvmpl
            </span>
          </Form.Text>
          <CreateUnlockWalletPassword />
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
