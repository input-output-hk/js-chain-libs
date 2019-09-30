import React from 'react';
import Table from 'react-bootstrap/Table';
import Card from 'react-bootstrap/Card';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { inputsAmount, outputsAmount } from '../../helpers/transactionHelper';
// TODO: Review which values should be shown here
const TransactionTable = ({ transactions }) => (
  <Card>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Hash</th>
          <th>Block</th>
          <th>Inputs amount</th>
          <th>Outputs amount</th>
        </tr>
      </thead>
      <tbody>
        {transactions.map(tx => (
          <tr>
            <td>{tx.id}</td>
            <td>{tx.block.id}</td>
            <td>{inputsAmount(tx)}</td>
            <td>{outputsAmount(tx)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  </Card>
);

export default createFragmentContainer(
  TransactionTable,
  // Each key specified in this object will correspond to a prop available to the component
  {
    transactions: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment TransactionTable_transactions on Transaction @relay(plural: true) {
        id
        block {
          id
        }
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
