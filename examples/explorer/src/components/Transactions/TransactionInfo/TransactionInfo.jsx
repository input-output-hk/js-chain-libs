import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './transactionInfo.scss';
import Table from 'react-bootstrap/Table';
import EmptyResult from '../../Commons/EmptyResult/EmptyResult';
import TransactionInputsOutputs from '../TransactionInputsOutputs/TransactionInputsOutputs';
import CertificateInfo from '../../Certificates/CertificateInfo/CertificateInfo';

const TransactionInfo = ({ transaction }) => {
  if (!transaction) {
    return <EmptyResult {...{ entityName: 'Transaction' }} />;
  }
  const { inputs, outputs } = transaction;
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
              <td>Inputs count:</td>
              <td>{transaction.inputs.length}</td>
            </tr>
            <tr>
              <td>Outputs count:</td>
              <td>{transaction.outputs.length}</td>
            </tr>
          </tbody>
        </Table>
        <TransactionInputsOutputs {...{ inputs, outputs }} />
        <CertificateInfo certificate={transaction.certificate} />
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
          ...TransactionInputsOutputs_inputs
        }
        outputs {
          ...TransactionInputsOutputs_outputs
        }
        certificate {
          ...CertificateInfo_certificate
        }
      }
    `
  }
);
