import React from 'react';
import Jumbotron from 'react-bootstrap/Jumbotron';
import Container from 'react-bootstrap/Container';

import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';

const TransactionInfo = ({ transaction }) => (
  <Jumbotron>
    <Container>
      <h1> Here it is... the transaction you have been looking for: {transaction.id}</h1>
    </Container>
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
      }
    `
  }
);
