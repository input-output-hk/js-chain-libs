import graphql from 'babel-plugin-relay/macro';

import BlockInfo from '../../Blocks/BlockInfo/BlockInfo';
import QueryWrapper from '../../QueryWrapper/QueryWrapper';

const blockQuery = graphql`
  query BlockSearchResultQuery($id: String!) {
    block(id: $id) {
      id
      ...BlockInfo_block
    }
  }
`;

const BlockSearchResult = QueryWrapper(BlockInfo, blockQuery);

export default BlockSearchResult;
