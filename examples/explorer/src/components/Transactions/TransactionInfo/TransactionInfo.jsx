import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './transactionInfo.scss';
import Table from 'react-bootstrap/Table';

import BlockLink from '../../Commons/BlockLink/BlockLink';
import TransactionLink from '../../Commons/TransactionLink/TransactionLink';

const TransactionInfo = ({ transaction }) => (
  <div className="entityInfoTable">
    <h2>Transaction</h2>
    <div className="keyValueTable">
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td>Hash:</td>
            <td>
              <TransactionLink id={transaction.id} />
            </td>
          </tr>
          <tr>
            <td>Block:</td>
            <td>
              <BlockLink id={transaction.block.id} />
            </td>
          </tr>
          <tr>
            <td>Inputs count:</td>
            <td>{transaction.inputs.length}</td>
          </tr>
          <tr>
            <td>Outputs count:</td>
            <td>{transaction.outputs.length}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  </div>
);

export default createFragmentContainer(TransactionInfo, {
  transaction: graphql`
    fragment TransactionInfo_transaction on Transaction {
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
});
