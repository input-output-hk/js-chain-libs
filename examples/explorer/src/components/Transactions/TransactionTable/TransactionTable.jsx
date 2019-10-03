import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { inputsAmount, outputsAmount } from '../../../helpers/transactionHelper';
import Amount from '../../Commons/Amount/Amount';
import TransactionLink from '../../Commons/TransactionLink/TransactionLink';
import BlockLink from '../../Commons/BlockLink/BlockLink';
// TODO: Review which values should be shown here
const TransactionTable = ({ transactions }) => (
  <Table striped bordered hover responsive>
    <thead>
      <tr>
        <th>Hash</th>
        <th>Inputs amount</th>
        <th>Outputs amount</th>
      </tr>
    </thead>
    <tbody>
      {transactions.map(tx => (
        <tr>
          <td>
            <TransactionLink id={tx.id} />
          </td>
          <td>
            <Amount decimalAmount={inputsAmount(tx)} />
          </td>
          <td>
            <Amount decimalAmount={outputsAmount(tx)} />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);

export default createFragmentContainer(
  TransactionTable,
  
  {
    transactions: graphql`
      
      fragment TransactionTable_transactions on Transaction @relay(plural: true) {
        id
        inputs {
          amount
        }
        outputs {
          amount
        }
      }
    `
  }
);
