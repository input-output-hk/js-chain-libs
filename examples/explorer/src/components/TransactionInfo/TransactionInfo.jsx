import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './transactionInfo.scss';
import Table from 'react-bootstrap/Table';
import EmptyResult from '../commons/EmptyResult/EmptyResult';
import TransactionInput from '../TransactionInput/TransactionInput';
import TransactionOutput from '../TransactionOutput/TransactionOutput';

import { inputsAmount, outputsAmount } from '../../helpers/transactionHelper';

const TransactionInfo = ({ transaction }) => {
  if (!transaction) {
    return <EmptyResult {...{ entityName: 'Transaction' }} />;
  }
  return (
    <Jumbotron>
      <div className="transactionInfo">
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
              <td>Inputs amount:</td>
              <td>{inputsAmount(transaction)}</td>
            </tr>
            <tr>
              <td>Outputs amount:</td>
              <td>{outputsAmount(transaction)}</td>
            </tr>
          </tbody>
        </Table>
        {/* TODO: Add Input-Output component */}
      </div>
    </Jumbotron>
  );
};

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
