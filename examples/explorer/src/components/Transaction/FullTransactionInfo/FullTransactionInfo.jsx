import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import { EmptyResult } from '../../Commons';
import TransactionInputsOutputs from '../TransactionInputsOutputs/TransactionInputsOutputs';
import TransactionInfo from '../TransactionInfo/TransactionInfo';
import { CertificateInfo } from '../../Certificate';

const FullTransactionInfo = ({ transaction }) => {
  if (!transaction) {
    return <EmptyResult {...{ entityName: 'Transaction' }} />;
  }
  const { inputs, outputs, certificate } = transaction;
  return (
    <div className="entityInfoContainer">
      <TransactionInfo {...{ transaction }} />
      <TransactionInputsOutputs {...{ inputs, outputs }} />
      <CertificateInfo {...{ certificate }} />
    </div>
  );
};

export default createFragmentContainer(FullTransactionInfo, {
  transaction: graphql`
    fragment FullTransactionInfo_transaction on Transaction {
      inputs {
        ...TransactionInputsOutputs_inputs
      }
      outputs {
        ...TransactionInputsOutputs_outputs
      }
      certificate {
        ...CertificateInfo_certificate
      }
      ...TransactionInfo_transaction
    }
  `
});
