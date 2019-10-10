import graphql from 'babel-plugin-relay/macro';

import { FullTransactionInfo } from '../../Transaction';
import { QueryWrapper } from '../../QueryWrapper';

const transactionQuery = graphql`
  query TransactionSearchResultQuery($id: String!) {
    transaction(id: $id) {
      ...FullTransactionInfo_transaction
    }
  }
`;

const TransactionSearchResult = QueryWrapper(FullTransactionInfo, transactionQuery);

export default TransactionSearchResult;
