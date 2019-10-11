import { TransactionSearchQuery } from '../../../graphql/queries';
import { FullTransactionInfo } from '../../Transaction';
import { QueryWrapper } from '../../QueryWrapper';

const TransactionSearchResult = QueryWrapper(FullTransactionInfo, TransactionSearchQuery);

export default TransactionSearchResult;
