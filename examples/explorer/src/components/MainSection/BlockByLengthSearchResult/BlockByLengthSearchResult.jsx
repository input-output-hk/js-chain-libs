import graphql from 'babel-plugin-relay/macro';

import { FullBlockInfo } from '../../Block';
import { QueryWrapper } from '../../QueryWrapper';

const blockQuery = graphql`
  query BlockByLengthSearchResultQuery($length: ChainLength!) {
    blockByChainLength(length: $length) {
      ...FullBlockInfo_block
    }
  }
`;

const propsConvert = props => ({ block: props.blockByChainLength });

const BlockByLengthSearchResult = QueryWrapper(FullBlockInfo, blockQuery, propsConvert);

export default BlockByLengthSearchResult;
