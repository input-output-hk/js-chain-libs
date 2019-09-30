import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './transactionInputsOutputs.scss';
import TransactionInput from '../TransactionInput/TransactionInput';
import TransactionOutput from '../TransactionOutput/TransactionOutput';

const TransactionInputsOutputs = ({ transaction }) => {
  return (
    <div className="transactionInputsOutputs">
      <div className="column">
        <h5>Inputs</h5>
        {transaction.inputs.map(transactionInput => (
          <TransactionInput {...{ transactionInput }} />
        ))}
      </div>
      <div className="column">
        <h5>Outputs</h5>
        {transaction.outputs.map(transactionOutput => (
          <TransactionOutput {...{ transactionOutput }} />
        ))}
      </div>
    </div>
  );
};

export default createFragmentContainer(
  TransactionInputsOutputs,
  // Each key specified in this object will correspond to a prop available to the component
  {
    transaction: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment TransactionInputsOutputs_transaction on Transaction {
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
