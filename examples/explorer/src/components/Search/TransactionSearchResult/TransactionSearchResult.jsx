import graphql from 'babel-plugin-relay/macro';

import TransactionInfo from '../../Transactions/TransactionInfo/TransactionInfo';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

const transactionQuery = graphql`
  query TransactionSearchResultQuery($id: String!) {
    transaction(id: $id) {
      id
      ...TransactionInfo_transaction
    }
  }
`;

const TransactionSearchResult = QueryWrapper(TransactionInfo, transactionQuery);

export default TransactionSearchResult;
