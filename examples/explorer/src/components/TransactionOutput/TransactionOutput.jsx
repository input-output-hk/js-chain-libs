import React from 'react';
import Table from 'react-bootstrap/Table';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

const TransactionOutput = ({ transactionOutput }) => (
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>#</th>
        <th>Amount</th>
        <th>Id</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>500000</td>
        <td>asdln65168v365096wea5f131r5</td>
      </tr>
    </tbody>
  </Table>
);

export default createFragmentContainer(
  TransactionOutput,
  // Each key specified in this object will correspond to a prop available to the component
  {
    transactionOutput: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment TransactionOutput_transactionOutput on TransactionOutput {
        amount
        address {
          id
        }
      }
    `
  }
);
