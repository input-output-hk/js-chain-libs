import React from 'react';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

import './transactionInput.scss';
import AdaAmount from '../commons/AdaAmount/AdaAmount';

const TransactionInput = ({ transactionInput }) => (
  <div className="transactionInput">
    <div>
      <div>Address: </div>
      <div>{transactionInput.address.id}</div>
    </div>
    <div>
      <div>Amount: </div>
      <AdaAmount lovelaceAmount={transactionInput.amount} />
    </div>
  </div>
);

export default createFragmentContainer(
  TransactionInput,
  // Each key specified in this object will correspond to a prop available to the component
  {
    transactionInput: graphql`
      # As a convention, we name the fragment as '<ComponentFileName>_<propName>'
      fragment TransactionInput_transactionInput on TransactionInput {
        amount
        address {
          id
        }
      }
    `
  }
);
