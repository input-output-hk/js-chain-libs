import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './transactionOutput.scss';
import AdaAmount from '../../Commons/AdaAmount/AdaAmount';

const TransactionOutput = ({ transactionOutput }) => (
  <div className="transactionOutput">
    <div>
      <div>Address: </div>
      <div>{transactionOutput.address.id}</div>
    </div>
    <div>
      <div>Amount: </div>
      <AdaAmount lovelaceAmount={transactionOutput.amount} />
    </div>
  </div>
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
