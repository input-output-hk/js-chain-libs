// @flow
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { isValidSpendingPassword } from '../utils/storage';
import typeof { setKeysWithSpendingPassword as SetKeysWithSpendingPassword } from '../actions/account';

type Props = {
  setKeysWithSpendingPassword: SetKeysWithSpendingPassword
};

export default ({ setKeysWithSpendingPassword }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    if (isValidSpendingPassword(spendingPassword)) {
      setIsWrongSpendingPassword(false);
      setHiddenSpendingPassword(true);
      return Promise.all([setKeysWithSpendingPassword(spendingPassword)]);
    }
    setIsWrongSpendingPassword(true);
    setHiddenSpendingPassword(false);
  };

  const [spendingPassword, setSpendingPassword] = useState('');
  const [isWrongSpendingPassword, setIsWrongSpendingPassword] = useState(false);
  const [hiddenSpendingPassword, setHiddenSpendingPassword] = useState(true);

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="mt-5">
        <Form.Group>
          <Form.Label>
            Wellcome! Please insert you password to unlock wallet
          </Form.Label>
          <Form.Control
            type="password"
            id="spendingPassword"
            name="spendingPassword"
            placeholder="Password"
            value={spendingPassword}
            isInvalid={isWrongSpendingPassword}
            onChange={event => setSpendingPassword(event.target.value)}
          />
          <Form.Label className="text-danger" hidden={hiddenSpendingPassword}>
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
