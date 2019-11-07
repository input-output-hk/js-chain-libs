// @flow
import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import curry from 'lodash/curry';
import ClickableBox from 'clickable-box';
import config from 'config';
// FIXME: this is obviously not portable to a webapp
import { shell } from 'electron';
import type {
  Transaction,
  Address,
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

const sumAmounts = (arr: Array<TransactionInput | TransactionOutput>) =>
  arr.reduce((sum, it) => it.amount + sum, 0);

const transactionToRow = (
  myAddress: Address,
  { id, certificate, inputs, outputs }: Transaction
) => {
  let transactionType: TransactionType;
  const inputSum = sumAmounts(inputs);
  if (certificate) {
    transactionType = 'DELEGATE';
  } else if (inputs.find(({ address }) => address === myAddress)) {
    transactionType = 'SEND';
  } else if ((outputs || []).find(({ address }) => address === myAddress)) {
    transactionType = 'RECEIVE';
  } else {
    console.error(`transaction with id: ${id} is malformed`);
    return null;
  }
  return (
    <Row key={id} className={styles.row}>
      <Col className={styles.transactionType} xs={2}>
        {transactionType}
      </Col>
      <Col xs={2} className={styles.txHash}>
        <ClickableBox
          onClick={() =>
            shell.openExternal(
              `${config.get('explorer.url')}/${config.get(
                'explorer.transactionPath'
              )}/${id}`
            )
          }
        >
          {id}
        </ClickableBox>
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
