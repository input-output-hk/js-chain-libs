import graphql from 'babel-plugin-relay/macro';

import FullTransactionInfo from '../../Transactions/FullTransactionInfo/FullTransactionInfo';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

const transactionQuery = graphql`
  query TransactionSearchResultQuery($id: String!) {
    transaction(id: $id) {
      ...FullTransactionInfo_transaction
    }
  }
`;

const TransactionSearchResult = QueryWrapper(FullTransactionInfo, transactionQuery);

export default TransactionSearchResult;
