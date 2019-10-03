import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './transactionInfo.scss';
import Table from 'react-bootstrap/Table';
import EmptyResult from '../../Commons/EmptyResult/EmptyResult';
import TransactionInputsOutputs from '../TransactionInputsOutputs/TransactionInputsOutputs';
import CertificateInfo from '../../Certificates/CertificateInfo/CertificateInfo';

import BlockLink from '../../Commons/BlockLink/BlockLink';
import TransactionLink from '../../Commons/TransactionLink/TransactionLink';

const TransactionInfo = ({ transaction }) => {
  if (!transaction) {
    return <EmptyResult {...{ entityName: 'Transaction' }} />;
  }
  const { inputs, outputs } = transaction;
  return (
    <div className="transactionInfo">
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
      <TransactionInputsOutputs {...{ inputs, outputs }} />
      <CertificateInfo certificate={transaction.certificate} />
    </div>
  );
};

export default createFragmentContainer(
  TransactionInfo,
  
  {
    transaction: graphql`
      
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
