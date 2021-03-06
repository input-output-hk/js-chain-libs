// @flow
import React, { useState } from 'react';
import config from 'config';
import { debounce } from 'lodash';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import type { SendFunds } from '../actions/account';
import styles from './SendTransaction.scss';
import type { Balance } from '../models';
import type { NodeSettings } from '../reducers/types';
import { typeof isValidAddress as IsValidAddress } from '../utils/wasmWrapper';
import feeCalculator from '../utils/feeCalculator';

type Props = {
  sendFunds: SendFunds,
  balance: Balance,
  nodeSettings: NodeSettings,
  isValidAddress: IsValidAddress
};

export default ({
  balance,
  nodeSettings,
  sendFunds,
  isValidAddress
}: Props) => {
  const handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    sendFunds(destinationAddress, Number(amount))
      .then(() => {
        console.log('success!');
        return setAmount('');
      })
      .catch(error => console.error('couldnt send funds: ', error));
  };
  const [destinationAddress, setDestinationAddress] = useState<string>('');
  const [validAddress, setValidAddress] = useState<boolean>(false);
  const [amount, setAmount] = useState<number | ''>('');
  const isValidAmount = (value, currentBalance) =>
    transactionFee + value <= currentBalance &&
    typeof value === 'number' &&
    value > 0;
  const transactionFee = feeCalculator(nodeSettings).sendFundsFee();
  // This is asyncronous and might be resource intensive, so it's better to debounce it.
  const debouncedAddressValidator = debounce(
    value =>
      isValidAddress(value)
        .then(setValidAddress)
        .catch(console.error),
    config.get('formDebounceInterval')
  );

  const computeAmountErrorMessage = (): string => {
    if (typeof amount === 'number') {
      if (amount <= 0) {
        return 'Balance must be positive';
      }
      if (amount > balance - transactionFee) {
        if (balance < transactionFee) {
          return 'Your balance is lower than the transaction fees :(';
        }
        return `Insufficient balance. Max: ${balance - transactionFee}`;
      }
    }
    return '';
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className={styles.fieldWithFeedback}>
        <Form.Label htmlFor="recipient">Recipient:</Form.Label>
        <Form.Control
          type="text"
          name="recipient"
          isInvalid={!validAddress && destinationAddress}
          isValid={destinationAddress && validAddress}
          value={destinationAddress}
          onChange={({ target: { value } }) => {
            setDestinationAddress(value);
            debouncedAddressValidator(value);
          }}
        />
        <Form.Control.Feedback type="invalid">
          Please enter a valid address
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group htmlFor="amount" className={styles.fieldWithFeedback}>
        <Form.Label>Amount:</Form.Label>
        <Row>
          <Col xs="10">
            <Form.Control
              type="number"
              name="amount"
              value={amount}
              // why the typeof checks? because we want:
              // * The form to start with an empty value (not with zero).
              // * Have zero be an invalid amount (this could be argued).
              // * The form to start in a valid state.
              isInvalid={
                typeof amount === 'number' && !isValidAmount(amount, balance)
              }
              isValid={
                typeof amount === 'number' && isValidAmount(amount, balance)
              }
              onChange={({ target: { value } }) => setAmount(Number(value))}
            />
            <Form.Control.Feedback type="invalid">
              {computeAmountErrorMessage()}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="valid">
              {`After fee: ${transactionFee + amount}`}
            </Form.Control.Feedback>
          </Col>
          <Col xs="2" className={`align-self-start mt-2 ${styles.unitLabel}`}>
            {config.get('coinName')}
          </Col>
        </Row>
      </Form.Group>
      <Row className="justify-content-between mt-2 flex-sm-row-reverse">
        <Button
          size="lg"
          variant="primary"
          disabled={!validAddress || !isValidAmount(amount, balance)}
          type="submit"
        >
          Send
        </Button>
      </Row>
    </Form>
  );
};
