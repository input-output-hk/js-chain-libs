import { BlockByChainlengthSearchQuery } from '../../../graphql/queries';
import { FullBlockInfo } from '../../Block';
import { QueryWrapper } from '../../QueryWrapper';

const propsConvert = props => ({ block: props.blockByChainLength });

const BlockByLengthSearchResult = QueryWrapper(
  FullBlockInfo,
  BlockByChainlengthSearchQuery,
  propsConvert
);

export default BlockByLengthSearchResult;
