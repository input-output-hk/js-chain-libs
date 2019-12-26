// @flow
import React, { useState } from 'react';
import config from 'config';
import { debounce } from 'lodash';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import typeof { sendTransaction as SendTransaction } from '../actions/account';
import styles from './SendTransaction.scss';
import { isValidAddress } from '../utils/wasmWrapper';

type Props = {
  sendTransaction: SendTransaction
};

export default ({ sendTransaction }: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    sendTransaction(destinationAddress, Number(amount));
  };
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [validAddress, setValidAddress] = useState<boolean>(true);
  const [amount, setAmount] = useState<?number>();
  // This is asyncronous and might be resource intensive, so it's better to debounce it.
  const debouncedAddressValidator = debounce(
    value =>
      isValidAddress(value)
        .then(setValidAddress)
        .catch(console.error),
    config.get('formDebounceInterval')
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group>
        <Form.Label htmlFor="recipient">Recipient:</Form.Label>
        <Form.Control
          type="text"
          name="recipient"
          isInvalid={!validAddress && destinationAddress}
          isValid={destinationAddress && validAddress}
          value={destinationAddress}
          onChange={event => {
            debouncedAddressValidator(event.target.value);
            setDestinationAddress(event.target.value);
          }}
        />
        <Form.Control.Feedback type="invalid">
          Please enter a valid address
        </Form.Control.Feedback>
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
