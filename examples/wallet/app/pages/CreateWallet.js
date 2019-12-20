// @flow
import React from 'react';
import typeof { push as Push } from 'connected-react-router';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import routes from '../constants/routes.json';
import InputCreateSpendingPassword from '../components/InputCreateSpendingPassword';

type Props = {
  push: Push
};

export default ({ push }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="mt-5">
        <InputCreateSpendingPassword />
        <Row className="justify-content-center">
          <Button
            variant="primary"
            type="submit"
            onClick={() => push(routes.REVEAL_MNEMONIC_PHRASE)}
          >
            Create wallet
          </Button>
        </Row>
      </Form>
    </Container>
  );
};
