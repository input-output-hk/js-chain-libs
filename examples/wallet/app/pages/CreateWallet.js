// @flow
import React, { useState } from 'react';
import typeof { push as Push } from 'connected-react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import routes from '../constants/routes.json';
import CreateUnlockWalletPassword from '../containers/CreateUnlockWalletPassword';

type Props = {
  push: Push
};

export default ({ push }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();

    if (isValidUnlockPassword) {
      console.log(unlockWalletPassword);
      push(routes.REVEAL_MNEMONIC_PHRASE);
    }
  };

  const setValidCreateUnlockWalletPassword = function setValidCreateUnlockWalletPassword(
    unlockPwd: string,
    isValid: boolean
  ): void {
    setUnlockWalletPassword(unlockPwd);
    setIsValidUnlockPassword(isValid);
  };

  const [unlockWalletPassword, setUnlockWalletPassword] = useState('');
  const [isValidUnlockPassword, setIsValidUnlockPassword] = useState(false);

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="mt-5">
        <CreateUnlockWalletPassword
          setValidCreateUnlockWalletPassword={
            setValidCreateUnlockWalletPassword
          }
        />
        <Row className="justify-content-center">
          <Button variant="primary" type="submit">
            Create wallet
          </Button>
        </Row>
      </Form>
    </Container>
  );
};
