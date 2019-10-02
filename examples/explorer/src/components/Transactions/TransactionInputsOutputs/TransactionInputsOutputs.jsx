import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './transactionInputsOutputs.scss';
import TransactionInput from '../TransactionInput/TransactionInput';
import TransactionOutput from '../TransactionOutput/TransactionOutput';

const TransactionInputsOutputs = ({ inputs, outputs }) => {
  return (
    <div className="transactionIOContainer">
      <h2>Inputs and Outputs</h2>
      <div className="transactionIOTable">
        <div className="column">
          <h5>Inputs</h5>
          {inputs.map(transactionInput => (
            <TransactionInput {...{ transactionInput }} />
          ))}
        </div>
        <div className="column">
          <h5>Outputs</h5>
          {outputs.map(transactionOutput => (
            <TransactionOutput {...{ transactionOutput }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default createFragmentContainer(
  TransactionInputsOutputs,
  // Each key specified in this object will correspond to a prop available to the component
  {
    inputs: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment TransactionInputsOutputs_inputs on TransactionInput @relay(plural: true) {
        ...TransactionInput_transactionInput
      }
    `,
    outputs: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment TransactionInputsOutputs_outputs on TransactionOutput @relay(plural: true) {
        ...TransactionOutput_transactionOutput
      }
    `
  }
);
