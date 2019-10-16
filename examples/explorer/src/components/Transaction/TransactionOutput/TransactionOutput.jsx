import graphql from 'babel-plugin-relay/macro';
import { createFragmentContainer } from 'react-relay';
import TransactionItem from '../TransactionItem/TransactionItem';

export default createFragmentContainer(TransactionItem, {
  txItem: graphql`
    fragment TransactionOutput_txItem on TransactionOutput {
      amount
      address {
        id
      }
    }
  `
});
