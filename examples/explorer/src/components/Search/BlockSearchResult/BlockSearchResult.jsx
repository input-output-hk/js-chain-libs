import graphql from 'babel-plugin-relay/macro';

import FullBlockInfo from '../../Blocks/FullBlockInfo/FullBlockInfo';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

const blockQuery = graphql`
  query BlockSearchResultQuery($id: String!) {
    block(id: $id) {
      ...FullBlockInfo_block
    }
  }
`;

const BlockSearchResult = QueryWrapper(FullBlockInfo, blockQuery);

export default BlockSearchResult;
