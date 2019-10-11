import { FullBlockInfo } from '../../Block';
import { BlockSearchQuery } from '../../../graphql/queries';
import { QueryWrapper } from '../../QueryWrapper';

const BlockSearchResult = QueryWrapper(FullBlockInfo, BlockSearchQuery);

export default BlockSearchResult;
