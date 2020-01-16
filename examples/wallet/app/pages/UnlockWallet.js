// @flow
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import styles from './UnlockWallet.scss';
import typeof { setKeysWithUnlockWalletPassword as SetKeysWithSpendingPassword } from '../actions/account';

type Props = {
  setKeysWithUnlockWalletPassword: SetKeysWithSpendingPassword
};

export default ({ setKeysWithUnlockWalletPassword }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    try {
      return setKeysWithUnlockWalletPassword(unlockWalletPassword);
    } catch (error) {
      setIsWrongUnlockWalletPassword(true);
    }
  };

  const [unlockWalletPassword, setUnlockWalletPassword] = useState('');
  const [isWrongSpendingPassword, setIsWrongUnlockWalletPassword] = useState(
    false
  );

  return (
    <Container className={styles.container}>
      <Form onSubmit={handleSubmit} className="mt-5">
        <Form.Group>
          <Form.Label>
            Welcome! Please insert you password to unlock wallet
          </Form.Label>
          <Form.Control
            type="password"
            id="unlockWalletPassword"
            name="unlockWalletPassword"
            placeholder="Password"
            value={unlockWalletPassword}
            isInvalid={isWrongSpendingPassword}
            onChange={event => setUnlockWalletPassword(event.target.value)}
          />
          <Form.Label className="text-danger" hidden={!isWrongSpendingPassword}>
            <code>Incorrect password</code>
          </Form.Label>
        </Form.Group>
        <Row className="justify-content-center">
          <Button variant="primary" type="submit">
            Unlock wallet
          </Button>
        </Row>
      </Form>
    </Container>
  );
};
