// @flow
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import curry from 'lodash/curry';
import type {
  Transaction,
  Address,
  PoolId,
  TransactionInput,
  TransactionOutput
} from '../models';
import styles from './TransactionListing.scss';

type Props = {
  transactions: Array<Transaction>,
  myAddress: Address
};
type TransactionType = 'SEND' | 'RECEIVE' | 'DELEGATE';

export default ({ transactions, myAddress }: Props) => {
  return (
    <Container>
      {transactions.map(curry(transactionToRow)(myAddress))}
    </Container>
  );
};

const findBiggestInputOrOutput = (
  arr: Array<TransactionInput | TransactionOutput>
) =>
  arr.reduce(
    (accumulator, it) => (it.amount > accumulator.amount ? it : accumulator),
    { amount: 0 }
  );

const sumAmounts = (arr: Array<TransactionInput | TransactionOutput>) =>
  arr.reduce((sum, it) => it.amount + sum, 0);

const transactionToRow = (
  myAddress: Address,
  { id, certificate, inputs, outputs }: Transaction
) => {
  let transactionType: TransactionType;
  let other: PoolId | Address;
  const inputSum = sumAmounts(inputs);
  if (certificate) {
    transactionType = 'DELEGATE';
    other = certificate.pool;
  } else if (inputs.find(({ address }) => address === myAddress)) {
    transactionType = 'SEND';
    other = findBiggestInputOrOutput(outputs).address;
  } else if ((outputs || []).find(({ address }) => address === myAddress)) {
    transactionType = 'RECEIVE';
    other = findBiggestInputOrOutput(inputs).address;
  } else {
    console.error(`transaction with id: ${id} is malformed`);
    return null;
  }
  return (
    <Row key={id} className={styles.row}>
      <Col className={styles.transactionType} xs={1}>
        {transactionType}
      </Col>
      <Col xs={5} className={styles.address}>
        {other}
      </Col>
      {/* TODO show date */}
      <Col xs={1}>04/20/2020</Col>
      <Col className={styles.amount} xs={2}>
        {inputSum}
      </Col>
      {/* TODO show confirmations */}
      <Col className={styles.transactionStatus} xs={2}>
        pending
      </Col>
      {/* TODO add a dropdown with details (inpt sum, output sum, ) */}
    </Row>
  );
};
