import graphql from 'babel-plugin-relay/macro';

import BlockInfo from '../../Blocks/BlockInfo/BlockInfo';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

const blockQuery = graphql`
  query BlockByLengthSearchResultQuery($length: ChainLength!) {
    blockByChainLength(length: $length) {
      ...BlockInfo_block
    }
  }
`;

const propsConvert = props => ({ block: props.blockByChainLength });

const BlockByLengthSearchResult = QueryWrapper(BlockInfo, blockQuery, propsConvert);

export default BlockByLengthSearchResult;
