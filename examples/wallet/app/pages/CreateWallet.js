// @flow
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import InputCreateSpendingPassword from '../components/InputCreateSpendingPassword';

export default () => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit} className="mt-5">
        <InputCreateSpendingPassword />
        <Row className="justify-content-center">
          <Button variant="primary" type="submit">
            Create wallet
          </Button>
        </Row>
      </Form>
    </Container>
  );
};
