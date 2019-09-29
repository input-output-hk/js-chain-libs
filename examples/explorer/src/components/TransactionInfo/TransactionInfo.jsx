import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './transactionInfo.scss';
import Table from 'react-bootstrap/Table';
import TransactionInput from '../TransactionInput/TransactionInput';
import TransactionOutput from '../TransactionOutput/TransactionOutput';

const TransactionInfo = ({ transaction }) => (
  <Jumbotron>
    <div className="TransactionInfo">
      <h2>Transaction: {transaction.id}</h2>
      <Table striped bordered hover>
        <tbody>
          <tr>
            <td>Hash:</td>
            <td>{transaction.id}</td>
          </tr>
          <tr>
            <td>Block:</td>
            <td>{transaction.block.id}</td>
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
  </Jumbotron>
);

export default createFragmentContainer(
  TransactionInfo,
  // Each key specified in this object will correspond to a prop available to the component
  {
    transaction: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment TransactionInfo_transaction on Transaction {
        id
        block {
          id
        }
        inputs {
          ...TransactionInput_transactionInput
        }
        outputs {
          ...TransactionOutput_transactionOutput
        }
      }
    `
  }
);
