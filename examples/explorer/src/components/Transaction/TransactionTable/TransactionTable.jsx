import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { inputsAmount, outputsAmount } from '../../../helpers/transactionHelper';
import { Amount, TransactionLink, BlockLink } from '../../Commons';

import './transactionTable.scss';

// TODO: Review which values should be shown here
const TransactionTable = ({ transactions, showBlocks = false }) => (
  <div className="transactionTable">
    <h3> Transactions </h3>
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Hash</th>
          {showBlocks && <th>Block</th>}
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
            {showBlocks && (
              <td>
                <BlockLink id={tx.block.id} />
              </td>
            )}
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
  </div>
);

export default createFragmentContainer(TransactionTable, {
  transactions: graphql`
    fragment TransactionTable_transactions on Transaction @relay(plural: true) {
      id
      inputs {
        amount
      }
      outputs {
        amount
      }
      block {
        id
      }
    }
  `
});
