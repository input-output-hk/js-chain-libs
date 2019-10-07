import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';
import TransactionItem from '../TransactionItem/TransactionItem';

export default createFragmentContainer(TransactionItem, {
  txItem: graphql`
    fragment TransactionInput_txItem on TransactionInput {
      amount
      address {
        id
      }
    }
  `
});
