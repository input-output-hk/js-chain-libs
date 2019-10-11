import graphql from 'babel-plugin-relay/macro';

const blockQuery = graphql`
  query blockByChainlengthSearchResultQuery($length: ChainLength!) {
    blockByChainLength(length: $length) {
      ...FullBlockInfo_block
    }
  }
`;

export default blockQuery;
