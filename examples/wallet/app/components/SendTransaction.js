// @flow
import React, { useState } from 'react';
import config from 'config';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import typeof { sendTransaction as SendTransaction } from '../actions/account';
import styles from './SendTransaction.scss';

type Props = {
  sendTransaction: SendTransaction
};

export default ({ sendTransaction }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    sendTransaction(destinationAddress, Number(amount));
  };
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [amount, setAmount] = useState<?number>();

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label htmlFor="recipient">Recipient:</Form.Label>
        <Form.Control
          type="text"
          name="recipient"
          value={destinationAddress}
          onChange={event => setDestinationAddress(event.target.value)}
        />
      </Form.Group>

      <Form.Group htmlFor="amount">
        <Form.Label>Amount:</Form.Label>
        <Row>
          <Col xs="10">
            <Form.Control
              type="number"
              name="amount"
              value={amount}
              onChange={event => setAmount(event.target.value)}
            />
          </Col>
          <Col
            xs="2"
            className={`align-self-center text-align ${styles.unitLabel}`}
          >
            {config.get('coinName')}
          </Col>
        </Row>
      </Form.Group>
      <Row className="justify-content-between mt-2 flex-sm-row-reverse">
        <Button size="lg" variant="primary" type="submit">
          Send
        </Button>
      </Row>
    </Form>
  );
};
